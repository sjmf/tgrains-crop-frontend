import Vue from 'vue'
import VueRouter from 'vue-router'
import ContainerMain from '../components/ContainerMain.vue'

import TabEnvironment from "@/components/tabs/TabEnvironment";
import TabProduction from "@/components/tabs/TabProduction";
import TabNutrition from "@/components/tabs/TabNutrition";
import TabHistory from "@/components/tabs/TabHistory";

Vue.use(VueRouter)

const routes = [
  {
    name: 'main',
    path: '/',
    redirect: '/production',
    component: ContainerMain,
    children: [
      {
        path: 'production',
        component: TabProduction
      },
      {
        path: 'environment',
        component: TabEnvironment
      },
      {
        path: 'nutrition',
        component: TabNutrition
      },
      {
        path: 'history',
        component: TabHistory
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
