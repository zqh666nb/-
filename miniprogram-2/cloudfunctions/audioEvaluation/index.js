const cloud = require('wx-server-sdk')
const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
const xml2js = require('xml2js')
const { Readable } = require('stream')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 配置信息
const config = {
  hostUrl: "wss://ise-api.xfyun.cn/v2/open-ise",
  host: "iat-api.xfyun.cn",
  appid: "59ad76e8",
  apiSecret: "YmEwOTVjZjQ0YjVjNDZmNjcxMTJjNzkz",
  apiKey: "54fed05728b22fa826a6d4ac1718af25",
  uri: "/v2/open-ise",
  highWaterMark: 1280
};

// 帧状态定义
const FRAME = {
  STATUS_FIRST_FRAME: 0,
  STATUS_CONTINUE_FRAME: 1,
  STATUS_LAST_FRAME: 2
};

// 获取WebSocket URL
function getWsUrl() {
  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`;
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);
  const authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin));
  return `${config.hostUrl}?authorization=${authorization}&date=${date}&host=${config.host}`;
}

// 发送数据帧
function sendFrame(ws, data, text, status, language = 'en') {
  let frame = "";
  switch (status) {
    case FRAME.STATUS_FIRST_FRAME:
      frame = {
        common: { 
          app_id: config.appid 
        },
        business: {
          sub: "ise",
          ent: language === 'cn' ? "cn_vip" : "en_vip",
          category: "read_sentence",
          text: `\uFEFF${text}`,
          tte: "utf-8",
          ttp_skip: true,
          cmd: "ssb",
          aue: "lame",
          auf: "audio/L16;rate=16000"
        },
        data: { 
          status: 0 
        }
      };
      console.log('【发送参数帧】:', frame);
      ws.send(JSON.stringify(frame));

      frame = {
        common: { 
          app_id: config.appid 
        },
        business: { 
          aus: 1, 
          cmd: "auw", 
          aue: "lame" 
        },
        data: { 
          status: 1, 
          data: data.toString('base64') 
        }
      };
      break;

    case FRAME.STATUS_CONTINUE_FRAME:
      frame = {
        common: { 
          app_id: config.appid 
        },
        business: { 
          aus: 2, 
          cmd: "auw", 
          aue: "lame" 
        },
        data: { 
          status: 1, 
          data: data.toString('base64') 
        }
      };
      break;

    case FRAME.STATUS_LAST_FRAME:
      frame = {
        common: { 
          app_id: config.appid 
        },
        business: { 
          aus: 4, 
          cmd: "auw", 
          aue: "lame" 
        },
        data: { 
          status: 2, 
          data: data.toString('base64') 
        }
      };
      break;
  }
  console.log(`【发送数据帧】 status: ${status}`);
  ws.send(JSON.stringify(frame));
}

// 修改XML解析函数
async function parseXMLResult(base64Data) {
  try {
    // 解码base64数据
    const xmlBuffer = Buffer.from(base64Data, 'base64')
    const xmlString = xmlBuffer.toString()
    console.log('解码后的XML:', xmlString)

    // 解析XML
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlString, { 
        explicitArray: false,
        mergeAttrs: true,
        explicitRoot: false
      }, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  } catch (error) {
    console.error('XML解析错误:', error)
    throw error
  }
}

// 修改音频数据处理
exports.main = async (event, context) => {
  const { audioFileID, text, language = 'en' } = event;
  
  try {
    console.log('【开始语音评测】参数:', { audioFileID, text });

    // 下载音频文件
    const audioFile = await cloud.downloadFile({
      fileID: audioFileID,
    });
    console.log('【音频文件下载成功】大小:', audioFile.fileContent.length);

    // 检查音频文件大小
    if (audioFile.fileContent.length > 26000) {
      throw new Error('音频文件过大，无法处理');
    }

    // 创建WebSocket连接
    return new Promise((resolve, reject) => {
      const url = getWsUrl();
      console.log('【WebSocket URL】:', url);
      
      const ws = new WebSocket(url);
      let status = FRAME.STATUS_FIRST_FRAME;

      ws.on('open', () => {
        console.log('【WebSocket连接已建立】');
        
        // 读取音频数据
        const readerStream = new Readable();
        readerStream.push(audioFile.fileContent);
        readerStream.push(null);

        readerStream.on('data', (chunk) => {
          sendFrame(ws, chunk, text, status, language);
          status = FRAME.STATUS_CONTINUE_FRAME;
        });

        readerStream.on('end', () => {
          status = FRAME.STATUS_LAST_FRAME;
          sendFrame(ws, "", text, status, language);
        });
      });

      ws.on('message', (data) => {
        try {
          const res = JSON.parse(data);
          console.log('【收到消息】:', res);

          if (res.code !== 0) {
            ws.close();
            reject(new Error(res.message || '评测失败'));
            return;
          }

          if (res.data.status === 2) {
            try {
              const xmlData = Buffer.from(res.data.data, 'base64').toString();
              console.log('【评测结果XML】:', xmlData);

              // 解析XML获取分数
              xml2js.parseString(xmlData, { 
                explicitArray: false,
                mergeAttrs: true,
                trim: true,
                explicitRoot: false,
                normalizeTags: true,
                attrNameProcessors: [function(name) { return name.toLowerCase(); }],
                tagNameProcessors: [function(name) { return name.toLowerCase(); }]
              }, (err, result) => {
                if (err) {
                  console.error('【XML解析错误】:', err);
                  reject(err);
                  return;
                }

                try {
                  console.log('【解析后的XML结构】:', JSON.stringify(result, null, 2));

                  // 返回完整的解析结果
                  resolve({
                    code: 200,
                    data: {
                      raw: result,
                      debug: {
                        xmlString: xmlData,
                        parsedResult: result
                      }
                    }
                  });
                } catch (error) {
                  console.error('【结果处理错误】:', error);
                  console.error('【错误堆栈】:', error.stack);
                  reject(new Error('结果处理失败: ' + error.message));
                }
              });
            } catch (error) {
              console.error('【XML处理错误】:', error);
              console.error('【错误堆栈】:', error.stack);
              reject(new Error('XML处理失败: ' + error.message));
            }
          }
        } catch (error) {
          console.error('【消息处理错误】:', error);
          console.error('【错误堆栈】:', error.stack);
          reject(error);
        }
      });

      ws.on('error', (error) => {
        console.error('【WebSocket错误】:', error);
        reject(error);
      });

      ws.on('close', () => {
        console.log('【WebSocket连接已关闭】');
      });
    });

  } catch (error) {
    console.error('【评测失败】:', error);
    return {
      code: 500,
      error: error.message
    };
  }
}; 