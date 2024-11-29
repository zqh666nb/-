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
    userInput: '',
    chatHistory: [],
    pronunciationFeedback: '',
    accessToken: '',
    lauguages: ['英语', '汉语', '日语'],
    scenes: ['学校', '餐厅', '地铁'],
    levels: ['初级', '中级', '高级'],
    initialPrompt: 'i would like to practice speaking in a restaurant setting.',
    exampleAnswers: {
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
    currentScene: '学校',
    backgroundImages: {
      '学校': '/images/school_bg.png',
      '餐厅': '/images/restaurant_bg.png',
      '地铁': '/images/subway_bg.png'
    },
    currentBackground: '/images/school_bg.png',
  },
  showSceneSelect() {
    const that = this;
    wx.showActionSheet({
      itemList: that.data.lauguages,
      success(res) {
        const selectedlauguages = that.data.lauguages[res.tapIndex];
        wx.showToast({
          title: `选择了：${selectedlauguages}`,
          icon: 'none',
        });
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
          currentScene: selectedScene,
          currentBackground: that.data.backgroundImages[selectedScene]
        });
        wx.showToast({
          title: `选择了：${selectedScene}`,
          icon: 'none',
        });
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
    manager.start({
      lang: 'en_US',
    });
    this.setData({
      isRecording: true,
    });
    console.log("开始录音");
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
    
    wx.showLoading({
      title: '语音评测中...',
      mask: true
    });

    wx.cloud.uploadFile({
      cloudPath: `audio/${Date.now()}.mp3`,
      filePath: filePath,
      success: res => {
        console.log('音频文件上传成功:', res.fileID);
        
        wx.cloud.callFunction({
          name: 'audioEvaluation',
          data: {
            audioFileID: res.fileID,
            text: text
          },
          success: result => {
            console.log('云函数调用成功，完整返回结果:', result);
            try {
              if (result.result.code === 200) {
                const rawData = result.result.data.raw;
                console.log('原��评测数据:', JSON.stringify(rawData, null, 2));

                // 检查数据结构
                if (!rawData) {
                  throw new Error('评测数据为空');
                }

                let score = 0;
                let details = {
                  pronunciation: 0,
                  fluency: 0,
                  integrity: 0
                };

                // 从read_sentence结构中提取分数
                if (rawData.read_sentence && 
                    rawData.read_sentence.rec_paper && 
                    rawData.read_sentence.rec_paper.read_chapter) {
                  const scores = rawData.read_sentence.rec_paper.read_chapter;
                  
                  // 将5分制转换为100分制
                  score = parseFloat(scores.total_score || 0) * 20;
                  details = {
                    pronunciation: parseFloat(scores.accuracy_score || 0) * 20, // accuracy_score 对应发音准确度
                    fluency: parseFloat(scores.fluency_score || 0) * 20,
                    integrity: parseFloat(scores.integrity_score || 0) * 20
                  };
                  
                  console.log('提取的分数:', { score, details });
                }

                const feedback = `发音评分: ${score.toFixed(1)}分
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

                // 只有在有实际分数时才显示建议
                if (score > 0) {
                  let suggestion = '';
                  if (details.pronunciation < 60) {
                    suggestion += '建议注意单词发音准确度；';
                  }
                  if (details.fluency < 60) {
                    suggestion += '建议提高语速流畅度；';
                  }
                  if (details.integrity < 60) {
                    suggestion += '建议完整读出所有单词；';
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
    const examples = this.data.exampleAnswers[this.data.currentScene] || [];
    if (examples.length === 0) {
      wx.showToast({
        title: '该场景暂无示例',
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
