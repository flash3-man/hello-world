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
      <div class="edit-button" @click="toggleEditMode">
        <span class="edit-text">{{ editMode ? '保存' : '编辑' }}</span>
      </div>


    </div>

    <!-- 模块2：首页应用区 -->
    <div class="home-apps-section">
      <div class="section-header">
        <div class="section-left">
          <span class="section-title">首页应用</span>
          <span class="section-subtitle">{{ homeApps.length }}/8</span>
        </div>
        <div class="section-right">
          <button class="reset-config-btn" @click="resetConfig">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M10,8L16,12L10,16V8Z"/>
            </svg>
            重置
          </button>
        </div>
      </div>
      
      <div class="apps-grid home-grid modern-grid">
        <div
          v-for="app in homeApps"
          :key="app.id"
          class="app-item modern-card"
          @click="navigateToApp(app)"
        >
          <div class="app-icon-modern" :style="{ backgroundColor: getAppColor(app.colorClass) }">
            <div class="icon-content">{{ app.icon }}</div>
          </div>
          <div class="app-label modern-label">{{ app.name }}</div>
          <div v-if="editMode" class="remove-btn modern-remove" @click.stop="removeFromHome(app.id)">×</div>
        </div>

        <!-- 添加更多按钮 -->
        <div v-if="homeApps.length < 8 && editMode" class="app-item add-more modern-add" @click="openAddDialog">
          <div class="add-icon-modern">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
          </div>
          <div class="app-label modern-label">添加应用</div>
        </div>
      </div>
    </div>

    <!-- 模块3：综合业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">综合业务</span>
        <span class="section-subtitle">全局经营分析</span>
      </div>
      
      <div class="apps-grid modern-grid">
        <div
          v-for="app in comprehensiveApps"
          :key="app.id"
          class="app-item modern-card"
          @click="navigateToApp(app)"
        >
          <div class="app-icon-modern" :style="{ backgroundColor: getAppColor(app.colorClass) }">
            <div class="icon-content">{{ app.icon }}</div>
          </div>
          <div class="app-label modern-label">{{ app.name }}</div>
          <div class="app-desc modern-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块4：员工业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">员工业务</span>
        <span class="section-subtitle">员工管理与分析</span>
      </div>
      
      <div class="apps-grid modern-grid">
        <div
          v-for="app in employeeApps"
          :key="app.id"
          class="app-item modern-card"
          @click="navigateToApp(app)"
        >
          <div class="app-icon-modern" :style="{ backgroundColor: getAppColor(app.colorClass) }">
            <div class="icon-content">{{ app.icon }}</div>
          </div>
          <div class="app-label modern-label">{{ app.name }}</div>
          <div class="app-desc modern-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块5：客户业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">客户业务</span>
        <span class="section-subtitle">客户管理与分析</span>
      </div>
      
      <div class="apps-grid modern-grid">
        <div
          v-for="app in customerApps"
          :key="app.id"
          class="app-item modern-card"
          @click="navigateToApp(app)"
        >
          <div class="app-icon-modern" :style="{ backgroundColor: getAppColor(app.colorClass) }">
            <div class="icon-content">{{ app.icon }}</div>
          </div>
          <div class="app-label modern-label">{{ app.name }}</div>
          <div class="app-desc modern-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块6：商品业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">商品业务</span>
        <span class="section-subtitle">商品管理与分析</span>
      </div>
      
      <div class="apps-grid modern-grid">
        <div
          v-for="app in productApps"
          :key="app.id"
          class="app-item modern-card"
          @click="navigateToApp(app)"
        >
          <div class="app-icon-modern" :style="{ backgroundColor: getAppColor(app.colorClass) }">
            <div class="icon-content">{{ app.icon }}</div>
          </div>
          <div class="app-label modern-label">{{ app.name }}</div>
          <div class="app-desc modern-desc">{{ app.description }}</div>
        </div>
      </div>
    </div>

    <!-- 模块7：资金业务域 -->
    <div class="business-section">
      <div class="section-header">
        <span class="section-title">资金业务</span>
        <span class="section-subtitle">资金管理与分析</span>
      </div>
      
      <div class="apps-grid modern-grid">
        <div
          v-for="app in financeApps"
          :key="app.id"
          class="app-item modern-card"
          @click="navigateToApp(app)"
        >
          <div class="app-icon-modern" :style="{ backgroundColor: getAppColor(app.colorClass) }">
            <div class="icon-content">{{ app.icon }}</div>
          </div>
          <div class="app-label modern-label">{{ app.name }}</div>
          <div class="app-desc modern-desc">{{ app.description }}</div>
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
      
      // 首页应用（用户自定义的高频功能，最多8个）
      homeApps: [
        { id: 1, name: '员工月报', icon: '👥', route: '/employee-report', colorClass: 'orange', domain: '员工业务' },
        { id: 2, name: '业绩变化分析', icon: '📈', route: '/performance-analysis', colorClass: 'green', domain: '员工业务' },
        { id: 3, name: '员工整体分析', icon: '👤', route: '/employee-analysis', colorClass: 'blue', domain: '员工业务' },
        { id: 4, name: '目标管理', icon: '🎯', route: '/goal-management', colorClass: 'orange', domain: '综合业务' },
        { id: 5, name: '我的经营月报', icon: '📊', route: '/monthly-report', colorClass: 'purple', domain: '综合业务' },
        { id: 6, name: '铺市分析', icon: '📍', route: '/market-analysis', colorClass: 'teal', domain: '客户业务' },
        { id: 7, name: '员工业绩汇总', icon: '🏆', route: '/employee-performance', colorClass: 'brown', domain: '员工业务' },
        { id: 8, name: '客户销退汇总', icon: '🔄', route: '/customer-return', colorClass: 'grey', domain: '客户业务' }
      ],
      
      // 综合业务域
      comprehensiveApps: [
        { id: 101, name: '核心业务指标', icon: '📊', route: '/core-business-indicators', colorClass: 'blue', domain: '综合业务', description: '销售额、回款、利润等核心指标' },
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
    
    // 切换编辑模式
    toggleEditMode() {
      if (this.editMode) {
        // 保存配置
        this.saveHomeAppsConfig()
        this.editMode = false
      } else {
        // 进入编辑模式
        this.editMode = true
      }
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
      if (this.homeApps.length >= 8) {
        alert('首页应用最多只能添加8个')
        return
      }

      this.homeApps.push(app)
      this.saveHomeAppsConfig()
      this.closeAddDialog()
    },
    
    // 保存首页应用配置
    saveHomeAppsConfig() {
      // 保存到localStorage
      localStorage.setItem('homeAppsConfig', JSON.stringify(this.homeApps))

      // 同时保存到快速功能配置中
      this.syncWithHomePage()

      // 显示保存成功提示
      alert('配置保存成功！')
    },
    
    // 加载首页应用配置
    loadHomeAppsConfig() {
      const saved = localStorage.getItem('homeAppsConfig')
      if (saved) {
        try {
          const savedApps = JSON.parse(saved)
          if (savedApps && savedApps.length > 0) {
            this.homeApps = savedApps
          }
        } catch (e) {
          console.error('Failed to load home apps config:', e)
        }
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
    },

    // 获取应用颜色
    getAppColor(colorClass) {
      const colorMap = {
        'orange': '#FF8C42',
        'green': '#4CAF50',
        'blue': '#2196F3',
        'purple': '#9C27B0',
        'teal': '#00BCD4',
        'brown': '#795548',
        'grey': '#607D8B'
      }
      return colorMap[colorClass] || '#4A90E2'
    },

    // 与主页面同步
    syncWithHomePage() {
      try {
        // 将首页应用配置同步到主页面的快速功能配置
        const homeAppRoutes = this.homeApps.map(app => {
          // 根据应用名称找到对应的功能ID
          const functionMap = {
            '员工月报': 1,
            '业绩变化分析': 2,
            '员工整体分析': 3,
            '目标管理': 4,
            '我的经营月报': 5,
            '铺市分析': 6,
            '员工业绩汇总': 7,
            '客户销退汇总': 8,
            '综合月报': 5,
            '电视大屏': 9,
            '综合日报': 10,
            '员工动态': 11,
            '拜访分析': 17,
            '员工利润': 18
          }
          return functionMap[app.name]
        }).filter(id => id) // 过滤掉未找到的ID

        // 获取或创建主页面的快速功能配置
        let quickFunctionConfig = JSON.parse(localStorage.getItem('quickFunctionConfig') || '[]')

        // 检查配置格式，如果缺少必要字段则重新创建
        const needsRecreate = quickFunctionConfig.length === 0 ||
                             !Object.prototype.hasOwnProperty.call(quickFunctionConfig[0], 'name') ||
                             !Object.prototype.hasOwnProperty.call(quickFunctionConfig[0], 'icon')

        if (needsRecreate) {
          const allFunctions = [
            { id: 1, name: '员工月报', icon: 'users', route: 'employee-report', selected: false },
            { id: 2, name: '业绩变化分析', icon: 'trending-up', route: 'performance-analysis', selected: false },
            { id: 3, name: '员工整体分析', icon: 'user-check', route: 'employee-analysis', selected: false },
            { id: 4, name: '目标管理', icon: 'target', route: 'goal-management', selected: false },
            { id: 5, name: '我的经营月报', icon: 'file-text', route: 'monthly-report', selected: false },
            { id: 6, name: '铺市分析', icon: 'map-pin', route: 'market-analysis', selected: false },
            { id: 7, name: '员工业绩汇总', icon: 'bar-chart', route: 'employee-performance', selected: false },
            { id: 8, name: '客户销退汇总', icon: 'refresh-cw', route: 'customer-return', selected: false },
            { id: 9, name: '电视大屏', icon: 'settings', route: 'tv-dashboard', selected: false },
            { id: 10, name: '综合日报', icon: 'download', route: 'daily-report', selected: false },
            { id: 11, name: '员工动态', icon: 'bell', route: 'employee-dynamics', selected: false },
            { id: 12, name: '客户管理', icon: 'user', route: 'customer-management', selected: false },
            { id: 13, name: '库存管理', icon: 'package', route: 'inventory-management', selected: false },
            { id: 14, name: '商品分析', icon: 'package', route: 'product-analysis', selected: false },
            { id: 15, name: '数据导出', icon: 'download', route: 'data-export', selected: false },
            { id: 16, name: '系统设置', icon: 'settings', route: 'system-settings', selected: false },
            { id: 17, name: '拜访分析', icon: 'megaphone', route: 'visit-analysis', selected: false },
            { id: 18, name: '员工利润', icon: 'truck', route: 'employee-profit', selected: false }
          ]

          // 如果原配置存在，保持原有的selected状态
          if (quickFunctionConfig.length > 0) {
            allFunctions.forEach(func => {
              const oldFunc = quickFunctionConfig.find(f => f.id === func.id)
              if (oldFunc && Object.prototype.hasOwnProperty.call(oldFunc, 'selected')) {
                func.selected = oldFunc.selected
              }
            })
          }

          quickFunctionConfig = allFunctions
        }

        // 重置所有功能为未选中
        quickFunctionConfig.forEach(func => {
          func.selected = false
        })

        // 设置首页应用对应的功能为选中
        homeAppRoutes.forEach(funcId => {
          const func = quickFunctionConfig.find(f => f.id === funcId)
          if (func) {
            func.selected = true
          }
        })

        // 保存更新后的配置
        localStorage.setItem('quickFunctionConfig', JSON.stringify(quickFunctionConfig))

        // 触发主页面更新
        const event = new CustomEvent('homeAppsUpdated', {
          detail: {
            homeApps: this.homeApps,
            functionConfig: quickFunctionConfig,
            timestamp: Date.now()
          }
        })
        window.dispatchEvent(event)

      } catch (error) {
        console.error('同步过程中发生错误：', error)
      }
    },

    // 与主页面同步首页应用
    syncHomeAppsWithMainPage() {
      // 先尝试从homeAppsConfig加载
      const savedHomeApps = localStorage.getItem('homeAppsConfig')
      if (savedHomeApps) {
        try {
          const homeAppsConfig = JSON.parse(savedHomeApps)
          if (homeAppsConfig && homeAppsConfig.length > 0) {
            this.homeApps = homeAppsConfig
            return
          }
        } catch (e) {
          console.error('解析homeAppsConfig失败：', e)
        }
      }

      // 如果没有homeAppsConfig，从主页面的快速功能配置中获取选中的功能
      const quickFunctionConfig = JSON.parse(localStorage.getItem('quickFunctionConfig') || '[]')
      const selectedFunctions = quickFunctionConfig.filter(func => func.selected)

      // 将选中的功能映射为首页应用
      const functionToAppMap = {
        1: { id: 1, name: '员工月报', icon: '👥', route: '/employee-report', colorClass: 'orange', domain: '员工业务' },
        2: { id: 2, name: '业绩变化分析', icon: '📈', route: '/performance-analysis', colorClass: 'green', domain: '员工业务' },
        3: { id: 3, name: '员工整体分析', icon: '👤', route: '/employee-analysis', colorClass: 'blue', domain: '员工业务' },
        4: { id: 4, name: '目标管理', icon: '🎯', route: '/goal-management', colorClass: 'orange', domain: '综合业务' },
        5: { id: 5, name: '我的经营月报', icon: '📊', route: '/monthly-report', colorClass: 'purple', domain: '综合业务' },
        6: { id: 6, name: '铺市分析', icon: '📍', route: '/market-analysis', colorClass: 'teal', domain: '客户业务' },
        7: { id: 7, name: '员工业绩汇总', icon: '🏆', route: '/employee-performance', colorClass: 'brown', domain: '员工业务' },
        8: { id: 8, name: '客户销退汇总', icon: '🔄', route: '/customer-return', colorClass: 'grey', domain: '客户业务' },
        9: { id: 9, name: '电视大屏', icon: '📺', route: '/tv-dashboard', colorClass: 'blue', domain: '综合业务' },
        10: { id: 10, name: '综合日报', icon: '📋', route: '/daily-report', colorClass: 'green', domain: '综合业务' },
        11: { id: 11, name: '员工动态', icon: '📈', route: '/employee-dynamics', colorClass: 'orange', domain: '员工业务' },
        17: { id: 17, name: '拜访分析', icon: '📍', route: '/visit-analysis', colorClass: 'teal', domain: '客户业务' },
        18: { id: 18, name: '员工利润', icon: '💰', route: '/employee-profit', colorClass: 'green', domain: '员工业务' }
      }

      // 更新首页应用列表
      const newHomeApps = selectedFunctions.map(func => functionToAppMap[func.id]).filter(app => app)

      if (newHomeApps.length > 0) {
        this.homeApps = newHomeApps
      }
    },



    // 重置配置
    resetConfig() {
      if (confirm('确定要重置所有配置吗？这将清除所有自定义设置。')) {
        // 清除localStorage
        localStorage.removeItem('homeAppsConfig')
        localStorage.removeItem('quickFunctionConfig')

        // 重置首页应用为默认配置
        this.homeApps = [
          { id: 1, name: '员工月报', icon: '👥', route: '/employee-report', colorClass: 'orange', domain: '员工业务' },
          { id: 2, name: '业绩变化分析', icon: '📈', route: '/performance-analysis', colorClass: 'green', domain: '员工业务' },
          { id: 3, name: '员工整体分析', icon: '👤', route: '/employee-analysis', colorClass: 'blue', domain: '员工业务' },
          { id: 4, name: '目标管理', icon: '🎯', route: '/goal-management', colorClass: 'orange', domain: '综合业务' },
          { id: 5, name: '我的经营月报', icon: '📊', route: '/monthly-report', colorClass: 'purple', domain: '综合业务' },
          { id: 6, name: '铺市分析', icon: '📍', route: '/market-analysis', colorClass: 'teal', domain: '客户业务' },
          { id: 7, name: '员工业绩汇总', icon: '🏆', route: '/employee-performance', colorClass: 'brown', domain: '员工业务' },
          { id: 8, name: '客户销退汇总', icon: '🔄', route: '/customer-return', colorClass: 'grey', domain: '客户业务' }
        ]

        // 保存默认配置
        this.saveHomeAppsConfig()

        alert('配置已重置为默认设置！')

        // 刷新页面
        location.reload()
      }
    }
  },

  mounted() {
    this.loadHomeAppsConfig()
    this.syncHomeAppsWithMainPage()
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
  padding: 10px 16px;
  border-radius: 8px;
  background: #4A90E2;
  color: white;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}

.edit-button:hover {
  background: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

.edit-text {
  font-size: 14px;
  color: white;
  font-weight: 600;
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

.section-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-right {
  display: flex;
  align-items: center;
}

.reset-config-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #6c757d;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-config-btn:hover {
  background: #e9ecef;
  color: #495057;
  border-color: #dee2e6;
}

.reset-config-btn svg {
  width: 14px;
  height: 14px;
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

/* === 现代化网格布局 === */
.modern-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 8px 0;
}

.home-grid.modern-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
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

/* === 现代化卡片样式 === */
.app-item.modern-card {
  border: none;
  background: #ffffff;
  min-height: auto;
  padding: 16px 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.app-item.modern-card:hover {
  background-color: #ffffff;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.app-item.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4A90E2, #5CB85C, #F0AD4E, #D9534F);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.app-item.modern-card:hover::before {
  opacity: 1;
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

/* === 现代化图标样式 === */
.app-icon-modern {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
}

.app-icon-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  border-radius: 14px;
}

.app-item.modern-card:hover .app-icon-modern {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.icon-content {
  font-size: 22px;
  color: white;
  position: relative;
  z-index: 1;
}

/* === 添加按钮样式 === */
.add-icon-modern {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #6c757d;
  border: 2px dashed #adb5bd;
  transition: all 0.3s ease;
}

.app-item.modern-add:hover .add-icon-modern {
  background: linear-gradient(135deg, #4A90E2 0%, #357abd 100%);
  color: white;
  border-color: #4A90E2;
  transform: scale(1.1);
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

/* === 现代化文字样式 === */
.modern-label {
  font-size: 13px;
  color: #2c3e50;
  text-align: center;
  line-height: 1.3;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.modern-desc {
  font-size: 10px;
  color: #7f8c8d;
  text-align: center;
  line-height: 1.4;
  margin-top: 4px;
  opacity: 0.8;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* === 移除按钮现代化样式 === */
.modern-remove {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
  transition: all 0.3s ease;
  border: 3px solid white;
  line-height: 1;
}

.modern-remove:hover {
  transform: scale(1.15);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.5);
}

/* 确保删除按钮在卡片外部可见 */
.app-item.modern-card {
  position: relative;
  overflow: visible;
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

  /* 现代化设计响应式 */
  .modern-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .home-grid.modern-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .app-icon-modern,
  .add-icon-modern {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .icon-content {
    font-size: 18px;
  }

  .modern-label {
    font-size: 11px;
  }

  .modern-desc {
    font-size: 8px;
    -webkit-line-clamp: 1;
  }

  .app-item.modern-card {
    padding: 10px 6px;
    border-radius: 12px;
  }

  .section-title {
    font-size: 14px;
  }

  .business-section {
    padding: 16px 12px;
  }
}

/* 平板设备响应式 */
@media (max-width: 768px) and (min-width: 481px) {
  .modern-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .home-grid.modern-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .app-icon-modern,
  .add-icon-modern {
    width: 42px;
    height: 42px;
  }

  .modern-label {
    font-size: 12px;
  }

  .modern-desc {
    font-size: 9px;
  }

  .app-item.modern-card {
    padding: 12px 8px;
  }
}
</style>
