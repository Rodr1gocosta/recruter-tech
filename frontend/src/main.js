import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import InterviewFlow from './views/InterviewFlow.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'InterviewFlow',
      component: InterviewFlow
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
