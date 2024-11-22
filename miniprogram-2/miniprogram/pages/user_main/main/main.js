const db = wx.cloud.database();
const collection = db.collection('user');

Page({
  data: {
    avatarUrl: '',
    nickName: ''
  },
  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo._id) {
      collection.doc(userInfo._id).get({
        success: res => {
          const userData = res.data;
          this.setData({
            avatarUrl: userData.avatarUrl,
            nickName: userData.nickName
          });
        },
        fail: err => {
          console.error('获取用户信息失败', err);
        }
      });
    } else {
      console.error('用户信息不完整');
    }
  },
  navigateToperson1: function () {
    wx.navigateTo({
      url: '/pages/user_main/language/main'
    });
  },
  navigateToperson2: function () {
    wx.navigateTo({
      url: '/pages/user_main/records/main'
    });
  },
  navigateToperson3: function () {
    wx.navigateTo({
      url: '/pages/user_main/setting/main'
    });
  }
});
