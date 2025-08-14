<template>
  <div class="distribution-analysis">
    <!-- 顶部导航 -->
    <div class="top-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
      <h1 class="header-title">铺货分析</h1>
      <div class="header-placeholder"></div>
    </div>

    <!-- 员工信息 -->
    <div class="employee-info" v-if="employeeInfo">
      <div class="employee-card">
        <div class="employee-name">{{ employeeInfo.name }}</div>
        <div class="employee-dept">{{ employeeInfo.department }}</div>
      </div>
    </div>

    <!-- 铺货统计概览 -->
    <div class="distribution-overview">
      <div class="overview-card">
        <div class="overview-item">
          <div class="overview-label">铺货店家</div>
          <div class="overview-value primary">{{ distributionStats.totalStores }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">新增店家</div>
          <div class="overview-value">{{ distributionStats.newStores }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">铺货金额</div>
          <div class="overview-value">¥{{ formatNumber(distributionStats.totalAmount) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">平均铺货</div>
          <div class="overview-value">¥{{ formatNumber(distributionStats.avgAmount) }}</div>
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

    <!-- 铺货店家列表 -->
    <div class="store-list">
      <div class="list-header">
        <h3>铺货店家</h3>
        <div class="store-count">共 {{ stores.length }} 家店铺</div>
      </div>
      
      <div class="store-items">
        <div 
          v-for="store in stores" 
          :key="store.id"
          class="store-item"
          @click="goToStoreDetail(store.id)"
        >
          <div class="store-header">
            <div class="store-name">{{ store.name }}</div>
            <div class="store-type" :class="store.type">{{ getStoreTypeText(store.type) }}</div>
          </div>
          
          <div class="store-content">
            <div class="store-info">
              <div class="store-address">{{ store.address }}</div>
              <div class="contact-person">联系人：{{ store.contactPerson }}</div>
            </div>
            
            <div class="distribution-amount">
              <div class="amount-value">¥{{ formatNumber(store.distributionAmount) }}</div>
              <div class="product-count">{{ store.productCount }}个商品</div>
            </div>
          </div>
          
          <div class="store-footer">
            <div class="last-distribution">最近铺货：{{ formatDate(store.lastDistributionDate) }}</div>
            <div class="store-actions">
              <button class="action-btn" @click.stop="viewStoreDetail(store.id)">查看详情</button>
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
  name: 'DistributionAnalysis',
  data() {
    return {
      loading: false,
      selectedPeriod: 'month',
      employeeInfo: null,
      distributionStats: {
        totalStores: 0,
        newStores: 0,
        totalAmount: 0,
        avgAmount: 0
      },
      timePeriods: [
        { label: '今日', value: 'today' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季', value: 'quarter' }
      ],
      stores: []
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
        
        // 模拟加载铺货统计
        this.distributionStats = {
          totalStores: 25,
          newStores: 3,
          totalAmount: 890000,
          avgAmount: 35600
        }
        
        // 模拟加载店家列表
        this.stores = [
          {
            id: 1,
            name: '好多多超市',
            type: 'supermarket',
            address: '北京市朝阳区建国路88号',
            contactPerson: '张经理',
            distributionAmount: 156000,
            productCount: 15,
            lastDistributionDate: '2024-08-14'
          },
          {
            id: 2,
            name: '宁夏来多便利店',
            type: 'convenience',
            address: '宁夏银川市兴庆区解放街123号',
            contactPerson: '李老板',
            distributionAmount: 89000,
            productCount: 8,
            lastDistributionDate: '2024-08-13'
          },
          {
            id: 3,
            name: '营销司机批发部',
            type: 'wholesale',
            address: '上海市浦东新区张江路456号',
            contactPerson: '王总',
            distributionAmount: 234000,
            productCount: 25,
            lastDistributionDate: '2024-08-12'
          },
          {
            id: 4,
            name: '社区小卖部',
            type: 'retail',
            address: '广州市天河区体育西路789号',
            contactPerson: '陈阿姨',
            distributionAmount: 45000,
            productCount: 6,
            lastDistributionDate: '2024-08-11'
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
    
    getStoreTypeText(type) {
      const typeMap = {
        'supermarket': '超市',
        'convenience': '便利店',
        'wholesale': '批发部',
        'retail': '零售店'
      }
      return typeMap[type] || type
    },
    
    goToStoreDetail(storeId) {
      this.$router.push(`/store-detail/${storeId}`)
    },
    
    viewStoreDetail(storeId) {
      this.goToStoreDetail(storeId)
    }
  }
}
</script>

<style scoped>
.distribution-analysis {
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

/* 铺货概览 */
.distribution-overview {
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

/* 店家列表 */
.store-list {
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

.store-count {
  font-size: 12px;
  color: #999;
}

.store-items {
  space-y: 12px;
}

.store-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.store-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.store-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.store-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.store-type.supermarket {
  background: #e8f5e8;
  color: #52c41a;
}

.store-type.convenience {
  background: #e6f7ff;
  color: #1890ff;
}

.store-type.wholesale {
  background: #fff7e6;
  color: #fa8c16;
}

.store-type.retail {
  background: #f6ffed;
  color: #389e0d;
}

.store-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.store-address {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.contact-person {
  font-size: 12px;
  color: #999;
}

.distribution-amount {
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

.store-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.last-distribution {
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
