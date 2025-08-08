import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import EmployeePerformance from '@/views/EmployeePerformance.vue'
import PerformanceAnalysis from '@/views/PerformanceAnalysis.vue'
import GoalManagement from '@/views/GoalManagement.vue'
import EmployeeReport from '@/views/EmployeeReport.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/employee-performance',
    name: 'EmployeePerformance',
    component: EmployeePerformance
  },
  {
    path: '/performance-analysis',
    name: 'PerformanceAnalysis',
    component: PerformanceAnalysis
  },
  {
    path: '/goal-management',
    name: 'GoalManagement',
    component: GoalManagement
  },
  {
    path: '/employee-report',
    name: 'EmployeeReport',
    component: EmployeeReport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
