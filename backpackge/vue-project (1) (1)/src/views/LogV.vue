<template>
  <div class="login-container">
    <van-field
      v-model="username"
      label="用户名"
      placeholder="请输入用户名"
      required
    />
    <van-field
      v-model="password"
      type="password"
      label="密码"
      placeholder="请输入密码"
      required
    />
    <van-button block type="primary" @click="handleLogin">登录</van-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showFailToast, showSuccessToast, Toast } from 'vant' // 引入 Toast
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')

const router = useRouter()

const handleLogin = async () => {
  if (!username.value || !password.value) {
    Toast('用户名和密码不能为空') // 正确的调用方式
    return
  }

  try {
    const response = await axios.post('/api/login', {
      username: username.value,
      password: password.value,
    })

    if (response.status === 200) {
      showSuccessToast(response.data.message) // 使用成功提示
      localStorage.setItem('token', response.data.token)
      router.push('/')
    }
  } catch (error) {
    console.error('Login error:', error)
    showFailToast('登录失败，用户名或密码错误') // 使用失败提示
  }
}
</script>

<style scoped>
.login-container {
  padding: 20px;
}

.van-button {
  margin-top: 20px;
}
</style>
