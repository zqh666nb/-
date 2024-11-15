<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from '@/router'

const username = ref('')
const signature = ref('')

// 获取用户信息
const fetchUserData = async () => {
  try {
    const response = await axios.get('/api/user') // 使用代理配置的 /api 前缀
    username.value = response.data.username
    signature.value = response.data.signature
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchUserData()
})

// 跳转函数
const onClickLeft = () => {
  router.push('/')
}

const show = ref(false)
const showPopup = () => {
  show.value = true
}

const navigateToLanguageLevel = () => {
  router.push('/language')
}

const navigateToSetting = () => {
  router.push('/setting')
}

const navigateToLearningRecord = () => {
  router.push('/record')
}
</script>

<template>
  <div class="user">
    <van-nav-bar title="SPEAR WITH AI" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <img
        class="avatar"
        src="https://q1.itc.cn/q_70/images03/20240207/39ec2cb31bd648ae8335e294471bd904.jpeg"
        alt="头像"
      />
      <span class="name">{{ username }}</span>
      <span class="count">{{ signature }}</span>
    </div>
    <div class="list">
      <span class="text">不限次数、帮助你更加强化的练习 </span>
      <van-cell-group>
        <van-cell title="语言水平" is-link @click="navigateToLanguageLevel" />
        <van-cell title="学习记录" is-link @click="navigateToLearningRecord" />
        <van-cell title="个人设置" is-link @click="navigateToSetting" />
      </van-cell-group>
    </div>
  </div>
  <van-popup v-model:show="show" position="bottom" :style="{ padding: '20px' }">
    <span class="title">我的英语成绩</span>
    <div class="text">
      <span>99.9</span>
    </div>
  </van-popup>
</template>

<style scoped lang="less">
.user {
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 40px 0 70px;
    background: #d2ff9a;

    .avatar {
      width: 160px;
      height: 160px;
      border-radius: 50%;
    }

    .name {
      margin-top: 20px;
      font-size: 40px;
    }

    .count {
      font-size: 30px;
    }
  }

  .list {
    padding: 20px;

    .text {
      font-size: 30px;
    }

    .van-cell-group {
      margin-top: 20px;
      padding: 10px;
      border-radius: 40px;
      box-shadow: 0 0 40px rgba(234, 234, 234, 0.4);
    }
  }
}

.van-popup {
  border-radius: 40px 40px 0 0;
  background: #fefefe;

  .title {
    width: 100%;
    text-align: center;
    font-size: 40px;
    font-weight: 600;
  }

  .text {
    font-size: 80px;
    text-align: center;
    line-height: 300px;
  }
}
</style>
