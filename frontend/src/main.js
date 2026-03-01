import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import InterviewFlow from './views/InterviewFlow.vue'

const router = createRouter({
  history: createWebHistory(),
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
