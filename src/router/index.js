import Vue from 'vue'
import VueRouter from 'vue-router'

import ContainerMain from '../components/ContainerMain.vue'
import TabEnvironment from "@/components/tabs/TabEnvironment";
import TabProduction from "@/components/tabs/TabProduction";
import TabNutrition from "@/components/tabs/TabNutrition";
import TabHistory from "@/components/tabs/TabHistory";

Vue.use(VueRouter)

const tabs = [
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

const routes = [
  {
    path: '/',
    redirect: '/landscape/101/production',
  },
  {
    path: '/landscape/:id',
    redirect: '/landscape/:id/production',
    component: ContainerMain,
    children: tabs,
  },
]

const router = new VueRouter({
  routes
})

export default router
