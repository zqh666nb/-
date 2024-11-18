// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database(); // 获取数据库实例
const collection = db.collection('user'); // 获取用户集合

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    // 检查用户是否已存在
    const checkUser = await collection.where({
      openid: wxContext.OPENID
    }).get();

    if (checkUser.data.length === 0) {
      // 如果用户不存在，则添加用户信息
      await collection.add({
        data: {
          openid: wxContext.OPENID,
          nickName: event.nickName,
          avatarUrl: event.avatarUrl,
          createTime: new Date()
        }
      });
    }

    return {
      success: true,
      userInfo: {
        openid: wxContext.OPENID,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl
      },
      token: 'some-generated-token' // 这里可以生成并返回一个token
    }
  } catch (error) {
    console.error('数据库操作失败', error);
    return {
      success: false,
      errorMessage: '数据库操作失败'
    }
  }
}