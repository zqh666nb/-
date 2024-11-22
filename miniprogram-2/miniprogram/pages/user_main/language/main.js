const db = wx.cloud.database();
const collection = db.collection('user');
Page({
  data: {
    cet4: '',
    cet6: '',
    vocab: '',
    _id: '',
  },
  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo._id) {
      this.setData({
        _id: userInfo._id
      });
      collection.doc(userInfo._id).get({
        success: res => {
          const userData = res.data;
          this.setData({
            cet4: userData.cet4 || '',
            cet6: userData.cet6 || '',
            vocab: userData.vocab || '',
            avatarUrl: userData.avatarUrl,
            nickName: userData.nickName
          });
        },
        fail: err => {
          console.error('获取用户信息失败', err);
          wx.showToast({
            title: '获取信息失败',
            icon: 'none'
          });
        }
      });
    } else {
      console.error('用户信息不完整');
      wx.showToast({
        title: '用户信息不完整',
        icon: 'none'
      });
    }
  },
  onInputChange: function (e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },
  updateDatabase: function () {
    if (!this.validateData()) {
      wx.showToast({
        title: '输入数据无效',
        icon: 'none'
      });
      return;
    }

    const data = {
      cet4: this.data.cet4,
      cet6: this.data.cet6,
      vocab: this.data.vocab
    };
    const userInfo = wx.getStorageSync('userInfo');
    collection.doc(userInfo._id).update({
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
  },
  validateData: function () {
    const { cet4, cet6, vocab } = this.data;
    // 简单验证：确保输入的值是数字且不为空
    return !isNaN(cet4) && cet4 !== '' && !isNaN(cet6) && cet6 !== '' && !isNaN(vocab) && vocab !== '';
  }
});
