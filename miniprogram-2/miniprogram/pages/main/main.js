const app = getApp();
const plugin = requirePlugin('WechatSI');
const manager = plugin.getRecordRecognitionManager();

// 导入CryptoJS库
const CryptoJS = require('/crypto.js'); // 确保路径和文件名正确

// Base64编码函数
function base64Encode(buffer) {
  if (!(buffer instanceof ArrayBuffer)) {
    console.error('base64Encode: 参数不是有效的ArrayBuffer', buffer);
    return '';
  }
  const base64 = wx.arrayBufferToBase64(buffer);
  return base64;
}

Page({
  data: {
    isRecording: false,
    currentBackground: 'cloud://aaaaaauv-0gjpjfhg1fee2e90.6161-aaaaaauv-0gjpjfhg1fee2e90-1330147179/013.jpg',
    userInput: '',
    chatHistory: [],
    pronunciationFeedback: '',
    accessToken: '',
    lauguages: ['英语', '汉语'],
    scenes: ['学校', '餐厅', '地铁'],
    levels: ['初级', '中级', '高级'],
    initialPrompt: 'i would like to practice speaking in a school setting,And the answer should be colloquial, fit the scene, and be relatively concise. do not show examples',
    exampleAsks: {
      '学校': [
        'May I ask where the library is?',
        'What is the homework for this class?',
        'May I borrow your notes?'
      ],
      '餐厅': [
        'May I ask if there are any special dishes？',
        'This dish should not be too spicy!',
        'Please give me a glass of water.'
      ],
      '地铁': [
        'May I ask how to get to Beijing Station?',
        'How long does it take for this subway to reach the terminal station？',
        'I want to buy a one-way ticket.'
      ]
    },
    currentExamples: [], // 当前可用的示例回答
    lastAiResponse: '', // 存储最后一次AI的回答
    currentScene: '学校',
    backgroundImages: {
      '学校': 'cloud://aaaaaauv-0gjpjfhg1fee2e90.6161-aaaaaauv-0gjpjfhg1fee2e90-1330147179/013.jpg',
      '餐厅': 'cloud://aaaaaauv-0gjpjfhg1fee2e90.6161-aaaaaauv-0gjpjfhg1fee2e90-1330147179/009.png',
      '地铁': 'cloud://aaaaaauv-0gjpjfhg1fee2e90.6161-aaaaaauv-0gjpjfhg1fee2e90-1330147179/008.png'
    },
    currentLanguage: '英语',
  },
  showSceneSelect() {
    const that = this;
    wx.showActionSheet({
      itemList: that.data.lauguages,
      success(res) {
        const selectedLanguage = that.data.lauguages[res.tapIndex];
        that.setData({
          currentLanguage: selectedLanguage
        });
        wx.showToast({
          title: `选择了：${selectedLanguage}`,
          icon: 'none',
        });

        // 更新引导语和示例回答
        if (selectedLanguage === '汉语') {
          that.setData({
            initialPrompt: '我想练习在学校环境中说话。',
            exampleAsks: {
              '学校': [
                '请问图书馆在哪里？',
                '这门课的作业是什么？',
                '我可以借你的笔记吗？'
              ],
              '餐厅': [
                '请问有什么特色菜吗？',
                '这道菜不要太辣！',
                '请给我一杯水。'
              ],
              '地铁': [
                '请问怎么去北京站？',
                '这趟地铁到终点站需要多长时间？',
                '我想买一张单程票。'
              ]
            }
          });
        } else {
          that.setData({
            initialPrompt: 'I would like to practice speaking in a school setting.',
            exampleAsks: {
              '学校': [
                'May I ask where the library is?',
                'What is the homework for this class?',
                'May I borrow your notes?'
              ],
              '餐厅': [
                'May I ask if there are any special dishes?',
                'This dish should not be too spicy!',
                'Please give me a glass of water.'
              ],
              '地铁': [
                'May I ask how to get to Beijing Station?',
                'How long does it take for this subway to reach the terminal station?',
                'I want to buy a one-way ticket.'
              ]
            }
          });
        }
      },
      fail(res) {
        if (res.errMsg !== 'showActionSheet:fail cancel') {
          console.log('弹窗选择失败', res);
        }
      }
    });
  },
  Select1() {
    const that = this;
  
    wx.showActionSheet({
      itemList: that.data.scenes,
      success(res) {
        const selectedScene = that.data.scenes[res.tapIndex];
        that.setData({
          chatHistory: [],
          currentScene: selectedScene,
          currentBackground: that.data.backgroundImages[selectedScene]
        });
        wx.showToast({
          title: `选择了：${selectedScene}`,
          icon: 'none',
        });
        // 判断选择的场景是哪一个
        if (selectedScene === '学校') {
          that.setData({
            initialPrompt: '我想练习在学校环境中说话，回答要口语化，不要举例子，相对简洁。',
         
          });
        } else if (selectedScene === '餐厅') {
          that.setData({
            initialPrompt: '我想练习在餐厅环境中说话，回答要口语化，不要举例子，相对简洁。',
          
          });
        } else if (selectedScene === '地铁') {
          that.setData({
            initialPrompt: '我想练习在地铁环境中说话，回答要口语化，不要举例子，相对简洁。',
         
          });
        }
      },
      fail(res) {
        if (res.errMsg !== 'showActionSheet:fail cancel') {
          console.log('弹窗选择失败', res);
        }
      }
    });
  },
  Select2() {
    const that = this;
    wx.showActionSheet({
      itemList: that.data.levels,
      success(res) {
        const selectedlevels = that.data.levels[res.tapIndex];
        wx.showToast({
          title: `选择了：${selectedlevels}`,
          icon: 'none',
        });

        // 显示发音反馈内容
        wx.showModal({
          title: '发音反馈',
          content: that.data.pronunciationFeedback || '没有反馈信息',
          showCancel: false
        });
      },
      fail(res) {
        if (res.errMsg !== 'showActionSheet:fail cancel') {
          console.log('弹窗选择失败', res);
        }
      }
    });
  },

  onLoad() {
    this.initRecord();
  },

  initRecord() {
    const that = this;
    manager.onRecognize = function (res) {
      console.log('current result', res.result);
    };
    manager.onStop = function (res) {
      console.log('record file path', res.tempFilePath);
      console.log('result', res.result);
      if (res.result) {
        that.setData({
          userInput: res.result,
        });
        that.sendAudioForEvaluation(res.tempFilePath, res.result);
      }
    };
    manager.onError = function (res) {
      console.error('error msg', res.msg);
    };
  },

  startRecord() {
    const lang = this.data.currentLanguage === '英语' ? 'en_US' : 'zh_CN';
    manager.start({
      lang: lang,
    });
    this.setData({
      isRecording: true,
    });
    console.log("开始录音，语言：", lang);
  },

  stopRecord() {
    manager.stop();
    this.setData({
      isRecording: false,
    });
    console.log("停止录音");
  },

  sendAudioForEvaluation(filePath, text) {
    const that = this;
    console.log('开始发送音频文件进行评测:', { filePath, text });

    // 根据当前选择的语言判断
    const isChinese = this.data.currentLanguage === '汉语';

    wx.showLoading({
      title: '语音评测中...',
      mask: true
    });

    wx.cloud.uploadFile({
      cloudPath: `audio/${Date.now()}.mp3`,
      filePath: filePath,
      success: res => {
        console.log('音频文件上传成功:', res.fileID);

        // 仅传递必要的数据
        const requestData = {
          audioFileID: res.fileID,
          text: text.slice(0, 100), // 截取文本的前100个字符，确保不超长
          language: isChinese ? 'cn' : 'en'
        };

        wx.cloud.callFunction({
          name: 'audioEvaluation',
          data: requestData,
          success: result => {
            console.log('云函数调用成功，完整返回结果:', result);
            try {
              if (result.result.code === 200) {
                const rawData = result.result.data.raw;
                console.log('原始评测数据:', JSON.stringify(rawData, null, 2));

                if (!rawData) {
                  throw new Error('评测数据为空');
                }

                let score = 0;
                let details = {
                  pronunciation: 0,
                  fluency: 0,
                  integrity: 0
                };

                if (isChinese) {
                  // 处理中文评测结果
                  if (rawData.read_sentence &&
                    rawData.read_sentence.rec_paper &&
                    rawData.read_sentence.rec_paper.read_sentence) {
                    const scores = rawData.read_sentence.rec_paper.read_sentence;
                    score = parseFloat(scores.total_score || 0);
                    details = {
                      pronunciation: parseFloat(scores.phone_score || 0), // 声韵分
                      fluency: parseFloat(scores.fluency_score || 0),    // 流畅度分
                      integrity: parseFloat(scores.integrity_score || 0), // 完整度分
                      tone: parseFloat(scores.tone_score || 0)           // 声调分
                    };
                  }
                } else {
                  // 处理英文评测结果
                  if (rawData.read_sentence &&
                    rawData.read_sentence.rec_paper &&
                    rawData.read_sentence.rec_paper.read_chapter) {
                    const scores = rawData.read_sentence.rec_paper.read_chapter;
                    score = parseFloat(scores.total_score || 0) * 20;
                    details = {
                      pronunciation: parseFloat(scores.accuracy_score || 0) * 20,
                      fluency: parseFloat(scores.fluency_score || 0) * 20,
                      integrity: parseFloat(scores.integrity_score || 0) * 20
                    };
                  }
                }

                console.log('提取的分数:', { score, details });

                // 生成反馈内容
                let feedback = isChinese ?
                  `发音评分: ${score.toFixed(1)}分
声韵分: ${details.pronunciation.toFixed(1)}分
流畅度: ${details.fluency.toFixed(1)}分
完整度: ${details.integrity.toFixed(1)}分
声调分: ${details.tone.toFixed(1)}分` :
                  `发音评分: ${score.toFixed(1)}分
发音准确度: ${details.pronunciation.toFixed(1)}分
流畅度: ${details.fluency.toFixed(1)}分
完整度: ${details.integrity.toFixed(1)}分`;

                console.log('生成的反馈:', feedback);

                that.setData({
                  pronunciationFeedback: feedback,
                  chatHistory: [...that.data.chatHistory, {
                    role: 'ai',
                    content: feedback
                  }]
                });

                // 生成建议
                if (score > 0) {
                  let suggestion = '';
                  if (isChinese) {
                    if (details.pronunciation < 60) suggestion += '声韵发音需要改进；';
                    if (details.fluency < 60) suggestion += '语速流畅度需要提高；';
                    if (details.integrity < 60) suggestion += '请完整读出所有字词；';
                    if (details.tone < 60) suggestion += '声调需要注意准确性；';
                  } else {
                    if (details.pronunciation < 60) suggestion += '单词发音需要改进；';
                    if (details.fluency < 60) suggestion += '语速流畅度需要提高；';
                    if (details.integrity < 60) suggestion += '请完整读出所有单词；';
                  }

                  if (suggestion) {
                    wx.showModal({
                      title: '发音建议',
                      content: suggestion + '要不要再试一次？',
                      showCancel: true,
                      confirmText: '再试一次',
                      cancelText: '继续',
                      success(modalRes) {
                        if (modalRes.confirm) {
                          that.startRecord();
                        }
                      }
                    });
                  }
                }
              } else {
                console.error('评测返回错误码:', result.result.code);
                wx.showToast({
                  title: '评测失败，请重试',
                  icon: 'none'
                });
              }
            } catch (error) {
              console.error('解析结果失败:', error);
              console.error('错误堆栈:', error.stack);
              console.error('原始结果:', result);
              wx.showToast({
                title: '评测结果解析失败',
                icon: 'none'
              });
            }
          },
          fail: err => {
            console.error('云函数调用失败:', err);
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      },
      fail: err => {
        console.error('音频文件上传失败:', err);
      }
    });
  },

  sendMessage() {
    const that = this;
    const { userInput, chatHistory, initialPrompt } = this.data;

    if (chatHistory.length === 0) {
      wx.request({
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        method: 'POST',
        data: {
          model: "qwen-plus",
          messages: [{ role: 'user', content: initialPrompt }],
          max_tokens: 150
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-4143273269e8491d8593d8d356af8be3`
        },
        success(res) {
          const aiResponse = res.data.choices[0].message.content;
          that.setData({
            chatHistory: [...that.data.chatHistory, { role: 'ai', content: aiResponse }],        
          });
        },

        fail(err) {
          console.error('调用AI服务失败:', err);
        }
      });
    }

    if (!userInput.trim()) return;

    this.setData({
      chatHistory: [...this.data.chatHistory, { role: 'user', content: userInput }],
      userInput: '',
    });

    wx.request({
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      method: 'POST',
      data: {
        model: "qwen-plus",
        messages: [{ role: 'user', content: userInput }],
        max_tokens: 150
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-4143273269e8491d8593d8d356af8be3`
      },
      success(res) {
        const aiResponse = res.data.choices[0].message.content;
        that.setData({
          chatHistory: [...that.data.chatHistory, { role: 'ai', content: aiResponse }],
        });
      },
      fail(err) {
        console.error('调用AI服务失败:', err);
      }
    });
  },

  onInputChange(e) {
    this.setData({
      userInput: e.detail.value,
    });
  },
  navigateTomain: function () {
    wx.navigateTo({
      url: '/pages/user_main/main/main'
    });
  },
  scrollToBottom: function () {
    const query = wx.createSelectorQuery();
    query.select('.chat-history').boundingClientRect((rect) => {
      this.setData({
        scrollTop: rect.height
      });
    }).exec();
  },
  showExamplesByScene() {
    // 如果有当前示例，使用当前示例；否则使用初始示例
    const examples = this.data.exampleAsks[this.data.currentScene] || [];

    if (examples.length === 0) {
      wx.showToast({
        title: '暂无示例回答',
        icon: 'none'
      });
      return;
    }
    if (examples.length === 0) {
      wx.showToast({
        title: '该场景暂��示例',
        icon: 'none'
      });
      return;
    }
    wx.showActionSheet({
      itemList: examples,
      success: (res) => {
        const selectedExample = examples[res.tapIndex];
        this.setData({
          userInput: selectedExample
        });
        this.sendMessage();
      }
    });
  },
 
});
