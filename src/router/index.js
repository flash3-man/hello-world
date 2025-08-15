import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import EmployeePerformance from '@/views/EmployeePerformance.vue'
import PerformanceAnalysis from '@/views/PerformanceAnalysis.vue'
import GoalManagement from '@/views/GoalManagement.vue'
import EmployeeReport from '@/views/EmployeeReport.vue'
import MonthlyReport from '@/views/MonthlyReport.vue'
import MarketAnalysis from '@/views/MarketAnalysis.vue'
import EmployeeAnalysis from '@/views/EmployeeAnalysis.vue'
import EmployeeDetailAnalysis from '@/views/EmployeeDetailAnalysis.vue'
import CustomerAnalysis from '@/views/CustomerAnalysis.vue'
import ProductAnalysis from '@/views/ProductAnalysis.vue'
import CustomerReturn from '@/views/CustomerReturn.vue'
import QuickAccessPage from '@/views/QuickAccessPage.vue'
import DepartmentGoalDetail from '@/views/DepartmentGoalDetail.vue'
import EmployeeDynamics from '@/views/EmployeeDynamics.vue'
import VisitAnalysis from '@/views/VisitAnalysis.vue'
import FinancialAnalysis from '@/views/FinancialAnalysis.vue'
import TestTable from '@/views/TestTable.vue'
import TestTableLayout from '@/views/TestTableLayout.vue'
import ComprehensiveAnalysis from '@/views/ComprehensiveAnalysis.vue'
import FocusAnalysis from '@/views/FocusAnalysis.vue'
import OrderAnalysis from '@/views/OrderAnalysis.vue'
import DistributionAnalysis from '@/views/DistributionAnalysis.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/visit-analysis',
    name: 'VisitAnalysis',
    component: VisitAnalysis
  },
  {
    path: '/financial-analysis',
    name: 'FinancialAnalysis',
    component: FinancialAnalysis
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
    path: '/employee-detail-analysis',
    name: 'EmployeeDetailAnalysis',
    component: EmployeeDetailAnalysis
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
    path: '/quick-access',
    name: 'QuickAccess',
    component: QuickAccessPage
  },
  {
    path: '/department-goal-detail/:goalId',
    name: 'DepartmentGoalDetail',
    component: DepartmentGoalDetail
  },
  {
    path: '/employee-dynamics',
    name: 'EmployeeDynamics',
    component: EmployeeDynamics
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
  },
  {
    path: '/comprehensive-analysis',
    name: 'ComprehensiveAnalysis',
    component: ComprehensiveAnalysis
  },
  {
    path: '/focus-analysis',
    name: 'FocusAnalysis',
    component: FocusAnalysis
  },
  // 带参数的路由
  {
    path: '/employee-analysis/:employeeId',
    name: 'EmployeeAnalysisDetail',
    component: EmployeeAnalysis
  },
  {
    path: '/performance-analysis/:employeeId',
    name: 'PerformanceAnalysisDetail',
    component: PerformanceAnalysis
  },
  {
    path: '/customer-analysis/:customerId',
    name: 'CustomerAnalysisDetail',
    component: CustomerAnalysis
  },
  {
    path: '/product-analysis/:productId',
    name: 'ProductAnalysisDetail',
    component: ProductAnalysis
  },
  {
    path: '/order-analysis/:employeeId',
    name: 'OrderAnalysis',
    component: OrderAnalysis
  },
  {
    path: '/distribution-analysis/:employeeId',
    name: 'DistributionAnalysis',
    component: DistributionAnalysis
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
