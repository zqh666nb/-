const app = getApp()
Page({
  data: {
    userAvatar: '',
    messages: [
      { avatar: '/images/avatar1.png', text: "Hey, friend! How are you today?", color: '#bbdefb' },
      { avatar: '/images/avatar2.png', text: "Excuse me. Can you tell me the correct time?", color: '#bbdefb' },
      { avatar: '/images/avatar3.png', text: "Of course, it's 5 o'clock now", color: '#fff9c4' },
      { avatar: '/images/avatar4.png', text: "What do you like to do outdoors?", color: '#bbdefb' }
    ]
  },
  onLoad: function () {
    // 页面加载时的逻辑
    wx.getUserProfile({
      desc: '用于显示用户头像',
      success: (res) => {
        this.setData({
          userAvatar: res.userInfo.avatarUrl
        });
      }
    });
  }
});
