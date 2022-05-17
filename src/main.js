import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import store from './store'
app.use(store)

import router from './router'
app.use(router)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus, {
    size: store.state.settings.elementSize
})
import 'md-editor-v3/lib/style.css'

import globalProperties from '@/util/global.properties'
globalProperties(app)

// 自定义指令
import directive from '@/util/directive'
directive(app)

import 'sn-console'

// console.log(import.meta.env.VITE_APP_AGE) // 打印出 lsbdb
// console.log(import.meta.env.VITE_APP_NAME) // 打印出 lsbdb

// 加载 svg 图标
import 'virtual:svg-icons-register'

// 全局样式
import '@/assets/styles/globals.scss'

app.mount('#app')
