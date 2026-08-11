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
    path: '/catalog',
    name: 'catalog',
    component: DetalleLugarView
  },
  {
    path: '/product/:id',
    name: 'product',
    component: DetalleLugarView,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: DetalleLugarView,
    alias: '/acerca'

  },
  {
    path: '/inicio',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router