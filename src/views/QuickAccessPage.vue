<template>
  <div class="quick-access-page">
    <!-- 模块1：顶部控制区 -->
    <div class="top-control-bar">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <div class="back-icon">←</div>
        <span class="back-text">返回</span>
      </div>
      
      <!-- 页面标题 -->
      <div class="page-title">
        <span class="title-text">快捷访问</span>
      </div>
      
      <!-- 编辑按钮 -->
      <div class="edit-button" @click="enterEditMode">
        <span class="edit-text">编辑</span>
      </div>
    </div>

    <!-- 模块2：首页应用区 -->
    <div class="home-apps-section">
      <div class="section-header">
        <span class="section-title">首页应用</span>
        <span class="section-subtitle">{{ homeApps.length }}/9</span>
      </div>
      
      <div class="apps-grid home-grid">
        <div 
          v-for="app in homeApps" 
          :key="app.id"
          class="app-item"
          :class="app.colorClass"
          @click="navigateToApp(app)"
        >
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-label">{{ app.name }}</div>
          <div v-if="editMode" class="remove-btn" @click.stop="removeFromHome(app.id)">×</div>
        </div>
        
        <!-- 添加更多按钮 -->
        <div v-if="homeApps.length < 9 && editMode" class="app-item add-more" @click="openAddDialog">
          <div class="app-icon">+</div>
          <div class="app-label">添加</div>
        </div>
      </div>
    </div>

    <!-- 模块3：综合业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">综合业务</span>
        <span class="section-subtitle">全局经营分析</span>
      </div>
      
      <div class="apps-grid">
        <div 
          v-for="app in comprehensiveApps" 
          :key="app.id"
          class="app-item"
          :class="app.colorClass"
          @click="navigateToApp(app)"
        >
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-label">{{ app.name }}</div>
          <div class="app-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块4：员工业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">员工业务</span>
        <span class="section-subtitle">员工管理与分析</span>
      </div>
      
      <div class="apps-grid">
        <div 
          v-for="app in employeeApps" 
          :key="app.id"
          class="app-item"
          :class="app.colorClass"
          @click="navigateToApp(app)"
        >
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-label">{{ app.name }}</div>
          <div class="app-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块5：客户业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">客户业务</span>
        <span class="section-subtitle">客户管理与分析</span>
      </div>
      
      <div class="apps-grid">
        <div 
          v-for="app in customerApps" 
          :key="app.id"
          class="app-item"
          :class="app.colorClass"
          @click="navigateToApp(app)"
        >
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-label">{{ app.name }}</div>
          <div class="app-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块6：商品业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">商品业务</span>
        <span class="section-subtitle">商品管理与分析</span>
      </div>
      
      <div class="apps-grid">
        <div 
          v-for="app in productApps" 
          :key="app.id"
          class="app-item"
          :class="app.colorClass"
          @click="navigateToApp(app)"
        >
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-label">{{ app.name }}</div>
          <div class="app-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块7：资金业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">资金业务</span>
        <span class="section-subtitle">资金管理与分析</span>
      </div>
      
      <div class="apps-grid">
        <div 
          v-for="app in financeApps" 
          :key="app.id"
          class="app-item"
          :class="app.colorClass"
          @click="navigateToApp(app)"
        >
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-label">{{ app.name }}</div>
          <div class="app-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 搜索功能 -->
    <div v-if="showSearch" class="search-overlay">
      <div class="search-container">
        <div class="search-header">
          <input 
            ref="searchInput"
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索功能名称或业务域..."
            class="search-input"
            @input="performSearch"
          >
          <button class="search-close" @click="closeSearch">×</button>
        </div>
        
        <div v-if="searchResults.length > 0" class="search-results">
          <div class="results-header">找到 {{ searchResults.length }} 个功能</div>
          <div 
            v-for="result in searchResults" 
            :key="result.id"
            class="search-result-item"
            @click="navigateToApp(result)"
          >
            <div class="result-icon">{{ result.icon }}</div>
            <div class="result-info">
              <div class="result-name">{{ result.name }}</div>
              <div class="result-domain">{{ result.domain }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加应用弹窗 -->
    <div v-if="showAddDialog" class="add-dialog-overlay" @click="closeAddDialog">
      <div class="add-dialog" @click.stop>
        <div class="dialog-header">
          <h3>添加到首页应用</h3>
          <button class="dialog-close" @click="closeAddDialog">×</button>
        </div>
        <div class="dialog-content">
          <div class="available-apps">
            <div 
              v-for="app in availableApps" 
              :key="app.id"
              class="available-app-item"
              @click="addToHome(app)"
            >
              <div class="app-icon">{{ app.icon }}</div>
              <div class="app-name">{{ app.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickAccessPage',
  data() {
    return {
      editMode: false,
      showSearch: false,
      showAddDialog: false,
      searchKeyword: '',
      searchResults: [],
      
      // 首页应用（用户自定义的高频功能，最多9个）
      homeApps: [
        { id: 1, name: '员工月报', icon: '👥', route: '/employee-report', colorClass: 'orange', domain: '员工业务' },
        { id: 2, name: '综合月报', icon: '📊', route: '/monthly-report', colorClass: 'green', domain: '综合业务' },
        { id: 3, name: '电视大屏', icon: '📺', route: '/tv-dashboard', colorClass: 'blue', domain: '综合业务' },
        { id: 4, name: '目标管理', icon: '🎯', route: '/goal-management', colorClass: 'orange', domain: '综合业务' },
        { id: 5, name: '员工动态', icon: '📈', route: '/employee-dynamics', colorClass: 'orange', domain: '员工业务' },
        { id: 6, name: '综合日报', icon: '📋', route: '/daily-report', colorClass: 'green', domain: '综合业务' },
        { id: 7, name: '员工业绩汇总', icon: '🏆', route: '/employee-performance', colorClass: 'green', domain: '员工业务' },
        { id: 8, name: '客户销退汇总', icon: '🔄', route: '/customer-return', colorClass: 'blue', domain: '客户业务' }
      ],
      
      // 综合业务域
      comprehensiveApps: [
        { id: 101, name: '核心业务指标', icon: '📊', route: '/core-metrics', colorClass: 'blue', domain: '综合业务', description: '销售额、回款、利润等核心指标' },
        { id: 102, name: '智慧拓店', icon: '🏪', route: '/smart-expansion', colorClass: 'blue', domain: '综合业务', description: '基于数据推荐潜在优质门店' },
        { id: 103, name: '电视大屏', icon: '📺', route: '/tv-dashboard', colorClass: 'blue', domain: '综合业务', description: '会议大屏数据展示' },
        { id: 104, name: '目标管理', icon: '🎯', route: '/goal-management', colorClass: 'orange', domain: '综合业务', description: '销售、订单目标设定与追踪' },
        { id: 105, name: '综合月报', icon: '📈', route: '/monthly-report', colorClass: 'green', domain: '综合业务', description: '月度经营数据报告' },
        { id: 106, name: '综合日报', icon: '📋', route: '/daily-report', colorClass: 'green', domain: '综合业务', description: '每日经营数据监控' },
        { id: 107, name: '单据动态', icon: '📄', route: '/document-dynamics', colorClass: 'green', domain: '综合业务', description: '订单、退货单、回款单实时状态' },
        { id: 108, name: '业绩变化分析', icon: '📊', route: '/performance-analysis', colorClass: 'blue', domain: '综合业务', description: '销售额、利润环比同比分析' },
        { id: 109, name: '铺市分析', icon: '🗺️', route: '/market-analysis', colorClass: 'orange', domain: '综合业务', description: '商品铺市率、区域覆盖分析' },
        { id: 110, name: '市场热销', icon: '🔥', route: '/market-trends', colorClass: 'orange', domain: '综合业务', description: '行业热销商品、竞品数据' },
        { id: 111, name: '利润计算器', icon: '🧮', route: '/profit-calculator', colorClass: 'green', domain: '综合业务', description: '单商品/客户利润快速计算' }
      ],
      
      // 员工业务域
      employeeApps: [
        { id: 201, name: '员工月报', icon: '👥', route: '/employee-report', colorClass: 'orange', domain: '员工业务', description: '员工月度业绩报告' },
        { id: 202, name: '员工日报', icon: '📅', route: '/employee-daily-report', colorClass: 'green', domain: '员工业务', description: '员工每日拜访、订单、回款' },
        { id: 203, name: '员工整体分析', icon: '👥', route: '/employee-analysis', colorClass: 'blue', domain: '员工业务', description: '团队人均业绩、拜访效率对比' },
        { id: 204, name: '单员工分析', icon: '👤', route: '/employee-detail-analysis', colorClass: 'orange', domain: '员工业务', description: '单个员工详细数据分析' },
        { id: 205, name: '员工业绩汇总', icon: '🏆', route: '/employee-performance', colorClass: 'green', domain: '员工业务', description: '团队业绩排名汇总' },
        { id: 206, name: '拜访分析', icon: '🚶', route: '/visit-analysis', colorClass: 'blue', domain: '员工业务', description: '员工拜访客户数、成单率分析' },
        { id: 207, name: '员工动态', icon: '📈', route: '/employee-dynamics', colorClass: 'orange', domain: '员工业务', description: '员工实时行为追踪' },
        { id: 208, name: '员工利润', icon: '💰', route: '/employee-profit', colorClass: 'orange', domain: '员工业务', description: '员工创造利润分析' }
      ],
      
      // 客户业务域
      customerApps: [
        { id: 301, name: '客户整体分析', icon: '🏢', route: '/customer-analysis', colorClass: 'orange', domain: '客户业务', description: '客户总数、成单率、复购率分析' },
        { id: 302, name: '客户销退汇总', icon: '🔄', route: '/customer-return', colorClass: 'blue', domain: '客户业务', description: '客户销售退货金额汇总' },
        { id: 303, name: '单据应收', icon: '💳', route: '/receivables', colorClass: 'blue', domain: '客户业务', description: '客户应收账款管理' },
        { id: 304, name: '负利润客户', icon: '⚠️', route: '/negative-profit-customers', colorClass: 'green', domain: '客户业务', description: '合作后利润为负的客户' },
        { id: 305, name: '未铺市客户', icon: '🎯', route: '/uncovered-customers', colorClass: 'orange', domain: '客户业务', description: '有潜力但未铺货的客户' },
        { id: 306, name: '客户回款', icon: '💰', route: '/customer-payments', colorClass: 'orange', domain: '客户业务', description: '客户回款率、回款周期分析' },
        { id: 307, name: '客户费利', icon: '📊', route: '/customer-roi', colorClass: 'green', domain: '客户业务', description: '客户费用投入vs利润产出ROI' }
      ],
      
      // 商品业务域
      productApps: [
        { id: 401, name: '商品整体分析', icon: '📦', route: '/product-analysis', colorClass: 'orange', domain: '商品业务', description: '商品销售额、库存、毛利分析' },
        { id: 402, name: '商品库存', icon: '📋', route: '/product-inventory', colorClass: 'blue', domain: '商品业务', description: '库存水位、滞销畅销品监控' },
        { id: 403, name: '商品销退汇总', icon: '🔄', route: '/product-return', colorClass: 'blue', domain: '商品业务', description: '商品销售退货金额分析' },
        { id: 404, name: '商品利润', icon: '💰', route: '/product-profit', colorClass: 'green', domain: '商品业务', description: '单商品利润贡献分析' },
        { id: 405, name: '未铺市商品', icon: '🎯', route: '/uncovered-products', colorClass: 'orange', domain: '商品业务', description: '有市场但未铺货的商品' },
        { id: 406, name: '商品铺市', icon: '🗺️', route: '/product-coverage', colorClass: 'green', domain: '商品业务', description: '商品铺市率、区域覆盖分析' },
        { id: 407, name: '品牌销退汇总', icon: '🏷️', route: '/brand-return', colorClass: 'blue', domain: '商品业务', description: '品牌维度销售退货数据' },
        { id: 408, name: '品牌利润', icon: '💎', route: '/brand-profit', colorClass: 'blue', domain: '商品业务', description: '品牌整体利润分析' },
        { id: 409, name: '商品采销明细', icon: '📝', route: '/product-purchase-sales', colorClass: 'green', domain: '商品业务', description: '商品采购销售明细记录' },
        { id: 410, name: '品牌采销明细', icon: '📋', route: '/brand-purchase-sales', colorClass: 'green', domain: '商品业务', description: '品牌维度采销明细管理' }
      ],
      
      // 资金业务域
      financeApps: [
        { id: 501, name: '资金整体分析', icon: '💰', route: '/financial-analysis', colorClass: 'green', domain: '资金业务', description: '资金流入流出余额分析' },
        { id: 502, name: '客户应收余额', icon: '💳', route: '/customer-receivables', colorClass: 'orange', domain: '资金业务', description: '客户应收账款总额、逾期金额' },
        { id: 503, name: '员工回款探查', icon: '🔍', route: '/employee-payment-analysis', colorClass: 'blue', domain: '资金业务', description: '员工负责的回款情况分析' }
      ]
    }
  },
  
  computed: {
    // 可添加到首页的应用
    availableApps() {
      const homeAppIds = this.homeApps.map(app => app.id)
      const allApps = [
        ...this.comprehensiveApps,
        ...this.employeeApps,
        ...this.customerApps,
        ...this.productApps,
        ...this.financeApps
      ]
      return allApps.filter(app => !homeAppIds.includes(app.id))
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 进入编辑模式
    enterEditMode() {
      this.editMode = !this.editMode
    },
    
    // 导航到应用
    navigateToApp(app) {
      if (this.editMode) return
      this.$router.push(app.route)
    },
    
    // 从首页移除应用
    removeFromHome(appId) {
      this.homeApps = this.homeApps.filter(app => app.id !== appId)
      this.saveHomeAppsConfig()
    },
    
    // 显示添加对话框
    openAddDialog() {
      this.showAddDialog = true
    },
    
    // 关闭添加对话框
    closeAddDialog() {
      this.showAddDialog = false
    },
    
    // 添加到首页
    addToHome(app) {
      if (this.homeApps.length >= 9) {
        alert('首页应用最多只能添加9个')
        return
      }
      
      this.homeApps.push(app)
      this.saveHomeAppsConfig()
      this.closeAddDialog()
    },
    
    // 保存首页应用配置
    saveHomeAppsConfig() {
      localStorage.setItem('homeAppsConfig', JSON.stringify(this.homeApps))
    },
    
    // 加载首页应用配置
    loadHomeAppsConfig() {
      const saved = localStorage.getItem('homeAppsConfig')
      if (saved) {
        this.homeApps = JSON.parse(saved)
      }
    },
    
    // 搜索功能
    performSearch() {
      if (!this.searchKeyword.trim()) {
        this.searchResults = []
        return
      }
      
      const allApps = [
        ...this.comprehensiveApps,
        ...this.employeeApps,
        ...this.customerApps,
        ...this.productApps,
        ...this.financeApps
      ]
      
      this.searchResults = allApps.filter(app => 
        app.name.includes(this.searchKeyword) || 
        app.description.includes(this.searchKeyword) ||
        app.domain.includes(this.searchKeyword)
      )
    },
    
    // 显示搜索
    showSearchFunction() {
      this.showSearch = true
      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },
    
    // 关闭搜索
    closeSearch() {
      this.showSearch = false
      this.searchKeyword = ''
      this.searchResults = []
    }
  },
  
  mounted() {
    this.loadHomeAppsConfig()
  }
}
</script>

<style scoped>
/* === 页面整体布局 === */
.quick-access-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 20px;
}

/* === 模块1：顶部控制区 === */
.top-control-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 1000;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background: #f8f9fa;
}

.back-icon {
  font-size: 18px;
  color: #333;
  margin-right: 4px;
}

.back-text {
  font-size: 14px;
  color: #333;
}

.page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.title-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.edit-button {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background: #f8f9fa;
}

.edit-text {
  font-size: 14px;
  color: #4A90E2;
}

/* === 内容区域 === */
.home-apps-section,
.business-section {
  margin-top: 44px;
  padding: 20px 16px;
}

.home-apps-section {
  background: white;
  border-bottom: 8px solid #f8f9fa;
}

.business-section {
  background: white;
  margin-bottom: 8px;
}

/* === 区域标题 === */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
}

/* === 应用网格布局 === */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.home-grid {
  grid-template-columns: repeat(3, 1fr);
}

/* === 应用项样式 === */
.app-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e9ecef;
  min-height: 80px;
}

.app-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

/* === 颜色分类 === */
.app-item.orange {
  border-top: 3px solid #ff9933;
}

.app-item.green {
  border-top: 3px solid #33cc33;
}

.app-item.blue {
  border-top: 3px solid #3399ff;
}

.app-item.add-more {
  border: 2px dashed #ccc;
  color: #999;
}

.app-item.add-more:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

/* === 应用图标和文字 === */
.app-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.app-label {
  font-size: 12px;
  color: #333;
  text-align: center;
  line-height: 1.2;
  font-weight: 500;
}

.app-desc {
  font-size: 10px;
  color: #999;
  text-align: center;
  line-height: 1.2;
  margin-top: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* === 编辑模式 === */
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
}

/* === 搜索功能 === */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60px;
}

.search-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px 0;
}

.search-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.results-header {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-result-item:hover {
  background: #f8f9fa;
}

.result-icon {
  font-size: 20px;
  margin-right: 12px;
}

.result-info {
  flex: 1;
}

.result-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.result-domain {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

/* === 添加应用弹窗 === */
.add-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.add-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.dialog-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.available-apps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.available-app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.available-app-item:hover {
  border-color: #4A90E2;
  background: #f8f9fa;
}

.available-app-item .app-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.available-app-item .app-name {
  font-size: 12px;
  color: #333;
  text-align: center;
}

/* === 响应式设计 === */
@media (max-width: 768px) {
  .apps-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .home-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .app-item {
    padding: 12px 6px;
    min-height: 70px;
  }

  .app-icon {
    font-size: 20px;
  }

  .app-label {
    font-size: 11px;
  }

  .app-desc {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .apps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .available-apps {
    grid-template-columns: repeat(2, 1fr);
  }

  .app-item {
    padding: 10px 4px;
    min-height: 60px;
  }

  .app-icon {
    font-size: 18px;
  }

  .app-label {
    font-size: 10px;
  }
}
</style>
