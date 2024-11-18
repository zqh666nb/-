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
  chooseAvatar: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const filePath = res.tempFilePaths[0];
        this.setData({
          avatarUrl: filePath
        });
      }
    });
  },
  updateNickName: function (e) {
    this.setData({
      nickName: e.detail.value
    });
  },
  saveChanges: function () {
    const { avatarUrl, nickName } = this.data;
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo._id) {
      console.error('用户信息不完整');
      return;
    }
    if (avatarUrl.startsWith('cloud://')) {
      this.updateUserInfo({ avatarUrl, nickName }, userInfo._id);
    } else {
      this.uploadImage(avatarUrl, nickName, userInfo._id);
    }
  },
  uploadImage: function (filePath, nickName, userId) {
    const cloudPath = `user-avatar/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.png`;
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        const fileID = res.fileID;
        this.updateUserInfo({ avatarUrl: fileID, nickName }, userId);
      },
      fail: err => {
        console.error('上传失败', err);
      }
    });
  },
  updateUserInfo: function (data, userId) {
    collection.doc(userId).update({
      data,
      success: () => {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
        wx.setStorageSync('userInfo', {
          ...wx.getStorageSync('userInfo'),
          ...data
        });
      },
      fail: err => {
        console.error('更新失败', err);
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      }
    });
  }
});