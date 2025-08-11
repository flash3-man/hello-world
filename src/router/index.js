import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import EmployeePerformance from '@/views/EmployeePerformance.vue'
import PerformanceAnalysis from '@/views/PerformanceAnalysis.vue'
import GoalManagement from '@/views/GoalManagement.vue'
import EmployeeReport from '@/views/EmployeeReport.vue'
import MonthlyReport from '@/views/MonthlyReport.vue'
import MarketAnalysis from '@/views/MarketAnalysis.vue'
import EmployeeAnalysis from '@/views/EmployeeAnalysis.vue'
import CustomerAnalysis from '@/views/CustomerAnalysis.vue'
import ProductAnalysis from '@/views/ProductAnalysis.vue'
import CustomerReturn from '@/views/CustomerReturn.vue'
import TestTable from '@/views/TestTable.vue'
import TestTableLayout from '@/views/TestTableLayout.vue'

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
  },
  {
    path: '/monthly-report',
    name: 'MonthlyReport',
    component: MonthlyReport
  },
  {
    path: '/market-analysis',
    name: 'MarketAnalysis',
    component: MarketAnalysis
  },
  {
    path: '/employee-analysis',
    name: 'EmployeeAnalysis',
    component: EmployeeAnalysis
  },
  {
    path: '/customer-analysis',
    name: 'CustomerAnalysis',
    component: CustomerAnalysis
  },
  {
    path: '/product-analysis',
    name: 'ProductAnalysis',
    component: ProductAnalysis
  },
  {
    path: '/customer-return',
    name: 'CustomerReturn',
    component: CustomerReturn
  },
  {
    path: '/test-table',
    name: 'TestTable',
    component: TestTable
  },
  {
    path: '/test-layout',
    name: 'TestTableLayout',
    component: TestTableLayout
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
