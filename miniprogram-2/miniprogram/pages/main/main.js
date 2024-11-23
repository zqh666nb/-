const app = getApp();
const plugin = requirePlugin('WechatSI');
const manager = plugin.getRecordRecognitionManager();

Page({
  data: {
    isRecording: false, // 是否正在录音，控制底部弹窗显示
    userInput: '',
    chatHistory: [],
    accessToken: '',
    lauguages: ['英语', '汉语', '日语'],  // 可选择的语言列表
    scenes: ['学校', '餐厅', '地铁'],  // 可选择的场景列表
    levels: ['初级', '中级', '高级'],  // 可选择的语言列表
    initialPrompt: 'please use English', // 引导AI使用英文回答
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
    currentScene: '学校', // 默认场景改为学校
    backgroundImages: {
      '学校': '/images/school_bg.png',
      '餐厅': '/images/restaurant_bg.png',
      '地铁': '/images/subway_bg.png'
    },
    currentBackground: '/images/school_bg.png', // 默认背景
  },
  showSceneSelect() {
    const that = this;
    wx.showActionSheet({
      itemList: that.data.lauguages,
      success(res) {
        // 选择的场景索引是 res.tapIndex
        const selectedlauguages = that.data.lauguages[res.tapIndex];
        wx.showToast({
          title: `选择了：${selectedlauguages}`,
          icon: 'none',
        });
        // 你可以在这里根据选中的场景来更新聊天逻辑或场景数据
      },
      fail(res) {
        console.log('弹窗选择失败', res);
      }
    });
  },
  Select1() {
    const that = this;
    wx.showActionSheet({
      itemList: that.data.scenes,
      success(res) {
        // 选择的场景索引是 res.tapIndex
        const selectedScene = that.data.scenes[res.tapIndex];
        that.setData({
          currentScene: selectedScene,
          currentBackground: that.data.backgroundImages[selectedScene]
        });
        wx.showToast({
          title: `选择了：${selectedScene}`,
          icon: 'none',
        });
        // 你可以在这里根据选中的场景来更新聊天逻辑或场景数据
      },
      fail(res) {
        console.log('弹窗选择失败', res);
      }
    });
  },
  Select2() {
    const that = this;
    wx.showActionSheet({
      itemList: that.data.levels,
      success(res) {
        // 选择的场景索引是 res.tapIndex
        const selectedlevels = that.data.levels[res.tapIndex];
        wx.showToast({
          title: `选择了：${selectedlevels}`,
          icon: 'none',
        });
        // 你可以在这里根据选中的场景来更新聊天逻辑或场景数据
      },
      fail(res) {
        console.log('弹窗选择失败', res);
      }
    });
  },

  onLoad() {
    this.initRecord();
  },

  // 初始化语音识别
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
      }
    };
    manager.onError = function (res) {
      console.error('error msg', res.msg);
    };
  },

  // 开始录音
  startRecord() {
    manager.start({
      lang: 'en_US', // 可以根据需要设置语言
    });
    this.setData({
      isRecording: true, // 显示底部弹窗
    });

    // 你可以在这里启动录音功能（录音功能需要调用微信的录音API）
    console.log("开始录音");
  },

  // 停止录音
  stopRecord() {
    manager.stop();
    this.setData({
      isRecording: false, // 隐藏底部弹窗
    });

    // 结束录音并处理录音结果（可以将录音发送到服务器或者进行其他操作）
    console.log("停止录音");
  },

  // 获取百度Access Token
  /*getAccessToken() {
    const that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method: 'POST',
      data: {
        grant_type: 'client_credentials',
        client_id: 'y6UejyROGJJ0f21LGcNbQ1jZ',
        client_secret: 'OQLkw7iiEaXEsV9mwMa2pW7uMtjvO7BU',
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.data.access_token) {
          that.setData({
            accessToken: res.data.access_token,
          });
        } else {
          console.error('获取Access Token失败，响应数据:', res.data);
        }
      },
      fail(err) {
        console.error('Access Token 请求失败:', err);
      },
    });
  },*/

  // 发送消息
  sendMessage() {
    const that = this;
    const { userInput, chatHistory, initialPrompt } = this.data;

    // 如果聊天记录为空，先发送引导消息
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
          'Authorization': `Bearer sk-4143273269e8491d8593d8d356af8be3` // 使用你的API密钥
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

    // 更新聊天记录
    this.setData({
      chatHistory: [...this.data.chatHistory, { role: 'user', content: userInput }],
      userInput: '',
    });

    // 调用AI服务
    wx.request({
      url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      method: 'POST',
      data: {
        model: "qwen-plus",
        messages: [{ role: 'user', content: userInput }],
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-4143273269e8491d8593d8d356af8be3` // 使用你的API密钥
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

  // 输入框内容变化
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
        scrollTop: rect.height // 设置 scrollTop 为 scroll-view 的高度
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
        // 可选：自动发送选中的示例
        this.sendMessage();
      }
    });
  },
});
