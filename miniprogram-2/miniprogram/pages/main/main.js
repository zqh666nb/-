const app = getApp();

Page({
  data: {
    userInput: '',
    chatHistory: [],
    accessToken: '',
  },

  onLoad() {
    this.getAccessToken();
  },

  // 获取百度Access Token
  getAccessToken() {
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
  },

  // 发送消息
  sendMessage() {
    const that = this;
    const { userInput, accessToken } = this.data;
    if (!userInput.trim()) return;

    // 更新聊天记录
    this.setData({
      chatHistory: [...this.data.chatHistory, { role: 'user', content: userInput }],
      userInput: '',
    });

    // 调用AI服务
    wx.request({
      url: `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${accessToken}`,
      method: 'POST',
      data: {
        messages: [{ role: 'user', content: userInput }],
      },
      header: {
        'Content-Type': 'application/json',
      },
      success(res) {
        const aiResponse = res.data.result;
        that.setData({
          chatHistory: [...that.data.chatHistory, { role: 'ai', content: aiResponse }],
        });
      },
      fail(err) {
        console.error('调用AI服务失败:', err);
      },
    });
  },

  // 输入框内容变化
  onInputChange(e) {
    this.setData({
      userInput: e.detail.value,
    });
  },
});
