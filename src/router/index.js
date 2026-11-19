import { createRouter, createWebHistory } from 'vue-router'

import ContainerMain from '../components/ContainerMain.vue'
import TabEnvironment from "@/components/tabs/TabEnvironment.vue";
import TabProduction from "@/components/tabs/TabProduction.vue";
import TabNutrition from "@/components/tabs/TabNutrition.vue";
import TabHistory from "@/components/tabs/TabHistory.vue";
import RouteError from "@/components/RouteError.vue";
import EthicsStatement from "@/components/EthicsStatement.vue";

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
    redirect: to => `/landscape/${to.params.id}/production`,
    component: ContainerMain,
    children: tabs,
  },
  {
    path: '/ethics',
    component: EthicsStatement,
  },
  {
    path: '/:pathMatch(.*)*',
    component: RouteError
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
