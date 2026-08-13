import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetalleLugarView from '../views/DetalleLugarView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/lugar/:id',
    name: 'detalle',
    component: DetalleLugarView,
    props: true
  },
  {
    path: '/inicio',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior() {
        return { top: 0 }
    }
})

export default router