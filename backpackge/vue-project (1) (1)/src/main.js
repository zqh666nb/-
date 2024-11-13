import './assets/main.css'

import 'amfe-flexible'
import '@/mobile/flexible'
import 'normalize.css'
import 'vant/lib/index.css' // 保持这里的引入一次即可

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Toast } from 'vant'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast) // 注册 Toast 插件

app.mount('#app')
