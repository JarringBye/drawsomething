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
    component: () => '../views/roompage.vue'
  },
  {
    path: '/drawingpage:roomID',
    name: 'drawingpage',
    component: () => import('../views/drawing-board')
  },
  {
    path: '/showingpage:roomID',
    name: 'showingpage',
    component: () => import('../views/showing-board')
  }
]

const router = new VueRouter({
  routes
})

export default router
