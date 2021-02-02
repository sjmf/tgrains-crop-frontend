import Vue from 'vue'
import VueRouter from 'vue-router'
import ContainerMain from '../components/ContainerMain.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'main',
    path: '/',
    component: ContainerMain
  },
]

const router = new VueRouter({
  routes
})

export default router
