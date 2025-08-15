<template>
  <div class="order-analysis">
    <!-- 顶部导航 -->
    <div class="top-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
      <h1 class="header-title">订单分析</h1>
      <div class="header-placeholder"></div>
    </div>

    <!-- 员工信息 -->
    <div class="employee-info" v-if="employeeInfo">
      <div class="employee-card">
        <div class="employee-name">{{ employeeInfo.name }}</div>
        <div class="employee-dept">{{ employeeInfo.department }}</div>
      </div>
    </div>

    <!-- 订单统计概览 -->
    <div class="order-overview">
      <div class="overview-card">
        <div class="overview-item">
          <div class="overview-label">本月订单</div>
          <div class="overview-value primary">{{ orderStats.monthlyOrders }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">今日订单</div>
          <div class="overview-value">{{ orderStats.dailyOrders }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">订单金额</div>
          <div class="overview-value">¥{{ formatNumber(orderStats.totalAmount) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">平均客单价</div>
          <div class="overview-value">¥{{ formatNumber(orderStats.avgOrderValue) }}</div>
        </div>
      </div>
    </div>

    <!-- 时间筛选 -->
    <div class="time-filter">
      <div class="filter-tabs">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          :class="['filter-tab', { active: selectedPeriod === period.value }]"
          @click="selectPeriod(period.value)"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div class="list-header">
        <h3>订单明细</h3>
        <div class="order-count">共 {{ orders.length }} 笔订单</div>
      </div>
      
      <div class="order-items">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-item"
          @click="goToOrderDetail(order.id)"
        >
          <div class="order-header">
            <div class="order-number">{{ order.orderNumber }}</div>
            <div class="order-status" :class="order.status">{{ getStatusText(order.status) }}</div>
          </div>
          
          <div class="order-content">
            <div class="customer-info">
              <div class="customer-name">{{ order.customerName }}</div>
              <div class="order-date">{{ formatDate(order.orderDate) }}</div>
            </div>
            
            <div class="order-amount">
              <div class="amount-value">¥{{ formatNumber(order.amount) }}</div>
              <div class="product-count">{{ order.productCount }}个商品</div>
            </div>
          </div>
          
          <div class="order-footer">
            <div class="delivery-info">{{ order.deliveryInfo }}</div>
            <div class="order-actions">
              <button class="action-btn" @click.stop="viewOrderDetail(order.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderAnalysis',
  data() {
    return {
      loading: false,
      selectedPeriod: 'month',
      employeeInfo: null,
      orderStats: {
        monthlyOrders: 0,
        dailyOrders: 0,
        totalAmount: 0,
        avgOrderValue: 0
      },
      timePeriods: [
        { label: '今日', value: 'today' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季', value: 'quarter' }
      ],
      orders: []
    }
  },
  
  created() {
    this.loadData()
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    async loadData() {
      this.loading = true
      try {
        const employeeId = this.$route.params.employeeId
        
        // 模拟加载员工信息
        this.employeeInfo = {
          id: employeeId,
          name: '营销司机',
          department: '销售部'
        }
        
        // 模拟加载订单统计
        this.orderStats = {
          monthlyOrders: 15,
          dailyOrders: 2,
          totalAmount: 1340000,
          avgOrderValue: 89333
        }
        
        // 模拟加载订单列表
        this.orders = [
          {
            id: 1,
            orderNumber: 'ORD202408001',
            customerName: '好多多超市',
            orderDate: '2024-08-14',
            amount: 156000,
            productCount: 5,
            status: 'completed',
            deliveryInfo: '已送达'
          },
          {
            id: 2,
            orderNumber: 'ORD202408002',
            customerName: '宁夏来多',
            orderDate: '2024-08-13',
            amount: 234000,
            productCount: 8,
            status: 'shipping',
            deliveryInfo: '配送中'
          },
          {
            id: 3,
            orderNumber: 'ORD202408003',
            customerName: '营销司机',
            orderDate: '2024-08-12',
            amount: 89000,
            productCount: 3,
            status: 'pending',
            deliveryInfo: '待发货'
          }
        ]
        
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    selectPeriod(period) {
      this.selectedPeriod = period
      this.loadData()
    },
    
    formatNumber(num) {
      if (num === 0) return '0.00'
      return (num / 10000).toFixed(2) + '万'
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    
    getStatusText(status) {
      const statusMap = {
        'pending': '待发货',
        'shipping': '配送中',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    },
    
    goToOrderDetail(orderId) {
      this.$router.push(`/order-detail/${orderId}`)
    },
    
    viewOrderDetail(orderId) {
      this.goToOrderDetail(orderId)
    }
  }
}
</script>

<style scoped>
.order-analysis {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 20px;
}

/* 顶部导航 */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-placeholder {
  width: 40px;
}

/* 员工信息 */
.employee-info {
  padding: 16px;
}

.employee-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.employee-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.employee-dept {
  font-size: 14px;
  color: #666;
}

/* 订单概览 */
.order-overview {
  padding: 0 16px 16px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.overview-item {
  text-align: center;
}

.overview-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.overview-value.primary {
  color: #667eea;
}

/* 时间筛选 */
.time-filter {
  padding: 0 16px 16px;
}

.filter-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-tab {
  flex: 1;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #667eea;
  color: white;
}

/* 订单列表 */
.order-list {
  padding: 0 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-count {
  font-size: 12px;
  color: #999;
}

.order-items {
  space-y: 12px;
}

.order-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.order-status.completed {
  background: #e8f5e8;
  color: #52c41a;
}

.order-status.shipping {
  background: #e6f7ff;
  color: #1890ff;
}

.order-status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.customer-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.order-date {
  font-size: 12px;
  color: #999;
}

.order-amount {
  text-align: right;
}

.amount-value {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 4px;
}

.product-count {
  font-size: 12px;
  color: #999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.delivery-info {
  font-size: 12px;
  color: #666;
}

.action-btn {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #5a6fd8;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 14px;
}
</style>
