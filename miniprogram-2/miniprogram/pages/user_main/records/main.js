Page({
  data: {
    records: [],
    currentTab: 'chat', // 'chat' 或 'score'
    chatRecords: [],
    scoreRecords: []
  },

  onShow: function() {
    this.loadRecords();
  },

  onLoad: function () {
    this.loadRecords();
  },

  // 加载记录
  loadRecords: function() {
    const that = this;
    console.log('开始加载记录...');
    
    // 从本地存储获取聊天记录
    wx.getStorage({
      key: 'chatHistory',
      success(res) {
        console.log('获取到聊天记录:', res.data);
        that.setData({
          chatRecords: res.data || []
        });
      },
      fail(err) {
        console.log('获取聊天记录失败:', err);
      }
    });

    // 从本地存储获取评分记录
    wx.getStorage({
      key: 'scoreHistory',
      success(res) {
        console.log('获取到评分记录:', res.data);
        that.setData({
          scoreRecords: res.data || []
        });
      },
      fail(err) {
        console.log('获取评分记录失败:', err);
      }
    });
  },

  // 切换标签页
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  // 删除记录
  deleteRecord: function(e) {
    const { type, index } = e.currentTarget.dataset;
    const that = this;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success(res) {
        if (res.confirm) {
          if (type === 'chat') {
            const newChatRecords = [...that.data.chatRecords];
            newChatRecords.splice(index, 1);
            that.setData({
              chatRecords: newChatRecords
            });
            wx.setStorage({
              key: 'chatHistory',
              data: newChatRecords
            });
          } else {
            const newScoreRecords = [...that.data.scoreRecords];
            newScoreRecords.splice(index, 1);
            that.setData({
              scoreRecords: newScoreRecords
            });
            wx.setStorage({
              key: 'scoreHistory',
              data: newScoreRecords
            });
          }
        }
      }
    });
  },

  // 清空所有记录
  clearAllRecords: function(e) {
    const { type } = e.currentTarget.dataset;
    const that = this;

    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有记录吗？',
      success(res) {
        if (res.confirm) {
          if (type === 'chat') {
            that.setData({
              chatRecords: []
            });
            wx.removeStorage({
              key: 'chatHistory'
            });
          } else {
            that.setData({
              scoreRecords: []
            });
            wx.removeStorage({
              key: 'scoreHistory'
            });
          }
        }
      }
    });
  }
});
