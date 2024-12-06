import {
  createApp
} from 'vue'
import {
  store
} from '@/store'

// 引入全局样式
import '@/assets/styles/index.scss'
import '@/tailwind.css'

import App from '@/App.vue'
// 加载非验证路由
import router from '@/router/public.js'

// 布局加载器
import layoutLoader from '@/router/loader.js'

import context from '@/context.js'

// 初始化上下文
const t = context.init();

Promise.all([t]).then(() => {
  let r = context.user() ? layoutLoader(router) : Promise.resolve()
  Promise.all([r]).then(() => {
    if (window.location.pathname.endsWith("/thirdLogin")) {
      context.logout()
    }
    const app = createApp(App)
    app.use(store)
    app.use(router)
    app.mount('#app')
  })
})
