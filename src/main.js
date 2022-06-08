import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import {router} from "@/router";
import * as echarts from 'echarts'
import axios from "axios";

const app = createApp(App)

app
    .use(ElementPlus)
    .use(router)

// 引入ElementPlus图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$axios = axios
app.config.globalProperties.$searchServ = "http://localhost:8004"
app.config.globalProperties.$controllServ = "http://localhost:8003"

app.mount('#app')
