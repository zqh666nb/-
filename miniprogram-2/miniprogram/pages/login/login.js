const db = wx.cloud.database(); // 获取数据库实例
const collection = db.collection('user');
const app = getApp()
Page({
  data: {},
  onLoad: function () {
    // 清除之前的登录状态
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
  },
  handleWechatLogin: function () {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (userProfile) => {
        const userInfo = userProfile.userInfo;

        wx.cloud.callFunction({
          name: 'login',
          data: {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          },
          success: (res) => {
            const openid = res.result.userInfo.openid;
            wx.setStorageSync('openid', openid); // 存储 openid

            collection.where({
              openid: openid
            }).get().then(checkUser => {
              if (checkUser.data.length === 0) {
                collection.add({
                  data: {
                    openid: openid,
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    createTime: new Date()
                  }
                }).then((addRes) => {
                  const completeUserInfo = {
                    _id: addRes._id,
                    openid: openid,
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl
                  };
                  wx.setStorageSync('userInfo', completeUserInfo);
                  wx.navigateTo({
                    url: '/pages/user_main/main/main'
                  });
                }).catch(err => {
                  console.error('数据库添加失败', err);
                  wx.showToast({
                    title: '登录失败，数据库错误',
                    icon: 'none'
                  });
                });
              } else {
                const existingUser = checkUser.data[0];
                wx.setStorageSync('userInfo', existingUser);
                wx.navigateTo({
                  url: '/pages/main/main'
                });
              }
            }).catch(err => {
              console.error('数据库查询失败', err);
              wx.showToast({
                title: '登录失败，数据库错误',
                icon: 'none'
              });
            });
          },
          fail: (err) => {
            console.error('云函数调用失败', err);
            wx.showToast({
              title: '登录失败，云函数错误',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '您取消了授权',
          icon: 'none'
        });
      }
    });
  },
});
