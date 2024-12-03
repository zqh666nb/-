const db = wx.cloud.database(); // 获取数据库实例
const collection = db.collection('user');
const app = getApp()
Page({
  data: {
    isLoading: false
  },
  onLoad: function () {
    // 清除之前的登录状态
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
  },
  handleWechatLogin: function () {
    this.setData({ isLoading: true });
    
    // 先弹出授权提示
    wx.showModal({
      title: '授权提示',
      content: '是否授权一键登录？授权后可保存学习记录',
      cancelText: '暂不授权',
      confirmText: '确认授权',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确认授权，继续登录流程
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
                        wx.reLaunch({
                          url: '/pages/main/main'
                        });
                      }).catch(err => {
                        console.error('数据库添加失败', err);
                        this.showError('登录失败，数据库错误');
                      });
                    } else {
                      const existingUser = checkUser.data[0];
                      wx.setStorageSync('userInfo', existingUser);
                      wx.reLaunch({
                        url: '/pages/main/main'
                      });
                    }
                  }).catch(err => {
                    console.error('数据库查询失败', err);
                    this.showError('登录失败，数据库错误');
                  });
                },
                fail: (err) => {
                  console.error('云函数调用失败', err);
                  this.showError('登录失败，云函数错误');
                }
              });
            },
            fail: (err) => {
              this.showError('您取消了授权');
            },
            complete: () => {
              this.setData({ isLoading: false });
            }
          });
        } else {
          // 用户点击取消授权，提示用户可以选择暂不登录
          this.setData({ isLoading: false });
          wx.showToast({
            title: '您可以选择暂不登录继续使用',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
        this.setData({ isLoading: false });
      }
    });
  },
  handleSkipLogin: function () {
    wx.showModal({
      title: '提示',
      content: '暂不登录将无法保存学习记录以及个人信息，是否继续？',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/main/main'
          });
        }
      }
    });
  },
  showError: function (message) {
    wx.showToast({
      title: message,
      icon: 'none'
    });
  }
});
