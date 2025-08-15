<template>
  <div class="focus-analysis">
    <!-- 顶部导航 -->
    <div class="top-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
      <h1 class="header-title">关注</h1>
      <button class="search-btn" @click="showSearch = !showSearch">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M19 19L13 13M15 8A7 7 0 1 1 1 8A7 7 0 0 1 15 8Z" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
    </div>

    <!-- 搜索框 -->
    <div class="search-section" v-if="showSearch">
      <div class="search-container">
        <input 
          v-model="searchKeyword" 
          placeholder="请输入关键字" 
          class="search-input"
          @input="handleSearch"
        />
        <button class="search-action" @click="performSearch">搜索</button>
      </div>
    </div>

    <!-- 维度切换标签 -->
    <div class="dimension-tabs">
      <div class="tab-container">
        <button 
          :class="['tab-item', { active: activeDimension === 'employee' }]"
          @click="switchDimension('employee')"
        >
          员工
        </button>
        <button 
          :class="['tab-item', { active: activeDimension === 'customer' }]"
          @click="switchDimension('customer')"
        >
          客户
        </button>
        <button 
          :class="['tab-item', { active: activeDimension === 'product' }]"
          @click="switchDimension('product')"
        >
          商品
        </button>
      </div>
    </div>

    <!-- 员工维度 -->
    <div v-if="activeDimension === 'employee'" class="dimension-content">
      <div 
        v-for="employee in filteredEmployees" 
        :key="employee.id"
        class="data-card"
      >
        <div class="card-header">
          <h3 @click="goToEmployeeDetail(employee.id)">{{ employee.name }}</h3>
          <button 
            class="favorite-btn" 
            :class="{ 'favorited': employee.isFavorite }" 
            @click="toggleFavorite('employee', employee.id)"
          >
            ♥
          </button>
        </div>
        
        <div class="card-content">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">本月销售</div>
              <div class="metric-value primary" @click="goToPerformanceAnalysis(employee.id)">
                ¥{{ formatNumber(employee.monthlySales) }}
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label">今日销售</div>
              <div class="metric-value">¥{{ formatNumber(employee.dailySales) }}</div>
            </div>
          </div>
          
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">订单</div>
              <div class="metric-value clickable" @click="goToOrderAnalysis(employee.id)">
                {{ employee.monthlyOrders }}
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label">今日订单</div>
              <div class="metric-value">{{ employee.dailyOrders }}</div>
            </div>
          </div>
          
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">铺货</div>
              <div class="metric-value clickable" @click="goToDistributionAnalysis(employee.id)">
                {{ employee.distributionCount }}家
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label">客户</div>
              <div class="metric-value">{{ employee.customerCount }}</div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="department">{{ employee.department }}</div>
          <div class="summary">{{ employee.summary }}</div>
        </div>
      </div>
    </div>

    <!-- 客户维度 -->
    <div v-if="activeDimension === 'customer'" class="dimension-content">
      <div 
        v-for="customer in filteredCustomers" 
        :key="customer.id"
        class="data-card"
      >
        <div class="card-header">
          <h3 @click="goToCustomerDetail(customer.id)">{{ customer.name }}</h3>
          <button 
            class="favorite-btn" 
            :class="{ 'favorited': customer.isFavorite }" 
            @click="toggleFavorite('customer', customer.id)"
          >
            ♥
          </button>
        </div>
        
        <div class="card-content">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">销售金额</div>
              <div class="metric-value primary">¥{{ formatNumber(customer.salesAmount) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">销量</div>
              <div class="metric-value">{{ customer.salesQuantity }}</div>
            </div>
          </div>
          
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">本月订单</div>
              <div class="metric-value">{{ customer.monthlyOrders }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">客单价</div>
              <div class="metric-value">¥{{ formatNumber(customer.avgOrderValue) }}</div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="customer-type">{{ customer.type }}</div>
          <div class="summary">{{ customer.summary }}</div>
        </div>
      </div>
    </div>

    <!-- 商品维度 -->
    <div v-if="activeDimension === 'product'" class="dimension-content">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="data-card"
      >
        <div class="card-header">
          <h3 @click="goToProductDetail(product.id)">{{ product.name }}</h3>
          <button 
            class="favorite-btn" 
            :class="{ 'favorited': product.isFavorite }" 
            @click="toggleFavorite('product', product.id)"
          >
            ♥
          </button>
        </div>
        
        <div class="card-content">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">销售金额</div>
              <div class="metric-value primary">¥{{ formatNumber(product.salesAmount) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">销量</div>
              <div class="metric-value">{{ product.salesQuantity }}</div>
            </div>
          </div>
          
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-label">库存</div>
              <div class="metric-value">{{ product.inventory }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">单价</div>
              <div class="metric-value">¥{{ formatNumber(product.unitPrice) }}</div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="category">{{ product.category }}</div>
          <div class="summary">{{ product.summary }}</div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    
    <!-- 无更多数据 -->
    <div v-if="!hasMore && !loading && currentData.length > 0" class="no-more">
      没有更多数据了
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && currentData.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <div class="empty-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FocusAnalysis',
  data() {
    return {
      showSearch: false,
      searchKeyword: '',
      activeDimension: 'product', // 默认商品维度高亮
      loading: false,
      hasMore: true,
      
      // 员工数据
      employees: [
        {
          id: 1,
          name: '营销司机',
          department: '销售部',
          monthlySales: 1340000,
          dailySales: 0,
          monthlyOrders: 3,
          dailyOrders: 0,
          distributionCount: 0,
          customerCount: 0,
          summary: '本月表现优异，销售额领先',
          isFavorite: true
        },
        {
          id: 2,
          name: '游明代理商',
          department: '代理商',
          monthlySales: 0,
          dailySales: 0,
          monthlyOrders: 0,
          dailyOrders: 0,
          distributionCount: 0,
          customerCount: 0,
          summary: '待激活状态，需要关注',
          isFavorite: true
        },
        {
          id: 3,
          name: '游明代理商',
          department: '代理商',
          monthlySales: 0,
          dailySales: 0,
          monthlyOrders: 0,
          dailyOrders: 0,
          distributionCount: 0,
          customerCount: 0,
          summary: '本月无销售记录，需要跟进',
          isFavorite: true
        },
        {
          id: 4,
          name: '游明代理商',
          department: '代理商',
          monthlySales: 0,
          dailySales: 0,
          monthlyOrders: 0,
          dailyOrders: 0,
          distributionCount: 0,
          customerCount: 0,
          summary: '新员工，正在培训中',
          isFavorite: true
        }
      ],
      
      // 客户数据
      customers: [
        {
          id: 1,
          name: '好多多超市',
          type: '零售商',
          salesAmount: 0,
          salesQuantity: 0,
          monthlyOrders: 0,
          avgOrderValue: 0,
          summary: '潜在大客户，需要重点维护',
          isFavorite: true
        },
        {
          id: 2,
          name: '宁夏来多',
          type: '批发商',
          salesAmount: 0,
          salesQuantity: 0,
          monthlyOrders: 0,
          avgOrderValue: 0,
          summary: '合作稳定，可考虑扩大合作',
          isFavorite: true
        },
        {
          id: 3,
          name: '营销司机',
          type: '个人客户',
          salesAmount: 0,
          salesQuantity: 0,
          monthlyOrders: 0,
          avgOrderValue: 0,
          summary: '长期合作伙伴，信誉良好',
          isFavorite: true
        },
        {
          id: 4,
          name: '游明代理商',
          type: '代理商',
          salesAmount: 0,
          salesQuantity: 0,
          monthlyOrders: 0,
          avgOrderValue: 0,
          summary: '新客户，有发展潜力',
          isFavorite: true
        }
      ],
      
      // 商品数据
      products: [
        {
          id: 1,
          name: '营销司机',
          category: '饮料',
          salesAmount: 1340000,
          salesQuantity: 0,
          inventory: 1000,
          unitPrice: 0,
          summary: '热销商品，库存充足',
          isFavorite: true
        },
        {
          id: 2,
          name: '游明代理商',
          category: '食品',
          salesAmount: 0,
          salesQuantity: 0,
          inventory: 500,
          unitPrice: 0,
          summary: '新品推广中，关注销售情况',
          isFavorite: true
        },
        {
          id: 3,
          name: '营销司机',
          category: '饮料',
          salesAmount: 0,
          salesQuantity: 0,
          inventory: 800,
          unitPrice: 0,
          summary: '季节性商品，需要关注销售趋势',
          isFavorite: true
        },
        {
          id: 4,
          name: '游明代理商',
          category: '食品',
          salesAmount: 0,
          salesQuantity: 0,
          inventory: 300,
          unitPrice: 0,
          summary: '库存偏低，需要及时补货',
          isFavorite: true
        },
        {
          id: 5,
          name: '营销司机',
          category: '饮料',
          salesAmount: 0,
          salesQuantity: 0,
          inventory: 1200,
          unitPrice: 0,
          summary: '新品上市，市场反响良好',
          isFavorite: true
        },
        {
          id: 6,
          name: '游明代理商',
          category: '食品',
          salesAmount: 0,
          salesQuantity: 0,
          inventory: 600,
          unitPrice: 0,
          summary: '稳定销售，客户认可度高',
          isFavorite: true
        }
      ]
    }
  },
  
  computed: {
    currentData() {
      switch (this.activeDimension) {
        case 'employee':
          return this.filteredEmployees
        case 'customer':
          return this.filteredCustomers
        case 'product':
          return this.filteredProducts
        default:
          return []
      }
    },
    
    filteredEmployees() {
      if (!this.searchKeyword) return this.employees
      return this.employees.filter(emp => 
        emp.name.includes(this.searchKeyword) || 
        emp.department.includes(this.searchKeyword)
      )
    },
    
    filteredCustomers() {
      if (!this.searchKeyword) return this.customers
      return this.customers.filter(customer => 
        customer.name.includes(this.searchKeyword) || 
        customer.type.includes(this.searchKeyword)
      )
    },
    
    filteredProducts() {
      if (!this.searchKeyword) return this.products
      return this.products.filter(product => 
        product.name.includes(this.searchKeyword) || 
        product.category.includes(this.searchKeyword)
      )
    }
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    switchDimension(dimension) {
      this.activeDimension = dimension
      this.searchKeyword = ''
    },
    
    handleSearch() {
      // 实时搜索，无需额外处理
    },
    
    performSearch() {
      // 执行搜索逻辑
      console.log('搜索关键词:', this.searchKeyword)
    },
    
    toggleFavorite(type, id) {
      let targetArray
      switch (type) {
        case 'employee':
          targetArray = this.employees
          break
        case 'customer':
          targetArray = this.customers
          break
        case 'product':
          targetArray = this.products
          break
      }
      
      const item = targetArray.find(item => item.id === id)
      if (item) {
        item.isFavorite = !item.isFavorite
      }
    },
    
    formatNumber(num) {
      if (num === 0) return '0.00'
      return (num / 10000).toFixed(2) + '万'
    },
    
    // 跳转方法
    goToEmployeeDetail(employeeId) {
      this.$router.push(`/employee-analysis/${employeeId}`)
    },
    
    goToPerformanceAnalysis(employeeId) {
      this.$router.push(`/performance-analysis/${employeeId}`)
    },
    
    goToOrderAnalysis(employeeId) {
      this.$router.push(`/order-analysis/${employeeId}`)
    },
    
    goToDistributionAnalysis(employeeId) {
      this.$router.push(`/distribution-analysis/${employeeId}`)
    },
    
    goToCustomerDetail(customerId) {
      this.$router.push(`/customer-analysis/${customerId}`)
    },
    
    goToProductDetail(productId) {
      this.$router.push(`/product-analysis/${productId}`)
    }
  }
}
</script>

<style scoped>
.focus-analysis {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 80px;
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

.back-btn, .search-btn {
  background: none;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover, .search-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* 搜索区域 */
.search-section {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #eee;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-action {
  padding: 10px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

/* 维度切换标签 */
.dimension-tabs {
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 60px;
  z-index: 99;
}

.tab-container {
  display: flex;
  padding: 0 16px;
}

.tab-item {
  flex: 1;
  padding: 16px 0;
  text-align: center;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-item.active {
  color: #667eea;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #667eea;
  border-radius: 2px;
}

/* 内容区域 */
.dimension-content {
  padding: 16px;
}

/* 数据卡片 */
.data-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
}

.card-header h3:hover {
  color: #667eea;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.favorite-btn.favorited {
  color: #ff4757;
}

.card-content {
  padding: 16px;
}

.metrics-row {
  display: flex;
  margin-bottom: 12px;
}

.metrics-row:last-child {
  margin-bottom: 0;
}

.metric-item {
  flex: 1;
  text-align: center;
}

.metric-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  cursor: default;
}

.metric-value.primary {
  color: #667eea;
  cursor: pointer;
}

.metric-value.clickable {
  color: #667eea;
  cursor: pointer;
}

.metric-value:hover.primary,
.metric-value:hover.clickable {
  text-decoration: underline;
}

.card-footer {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
}

.department, .customer-type, .category {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 4px;
}

.summary {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
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

/* 无更多数据 */
.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  color: #999;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .metrics-row {
    flex-direction: column;
    gap: 8px;
  }

  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .metric-label {
    margin-bottom: 0;
  }
}
</style>
