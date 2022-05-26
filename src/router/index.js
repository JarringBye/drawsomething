import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: () => import('../views/home-page.vue')
  },
  {
    path: '/roompage:roomID',
    name: 'roompage',
    component: () => import('../views/room-page.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
