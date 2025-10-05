import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from './stores/admin'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Places from './views/Places.vue'
import Submit from './views/Submit.vue'
import Feedback from './views/Feedback.vue'
import Admin from './views/Admin.vue'
import AdminLogin from './components/AdminLogin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/places', name: 'Places', component: Places },
  { path: '/submit', name: 'Submit', component: Submit },
  { path: '/feedback', name: 'Feedback', component: Feedback },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin', name: 'Admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize admin store after pinia is available
const adminStore = useAdminStore()
adminStore.initializeAuth()

app.mount('#app')
