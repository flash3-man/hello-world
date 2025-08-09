<template>
  <div class="monthly-report">
    <!-- 一、全局框架与响应式适配 -->
    <!-- 顶部操作栏（包含返回按钮） -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">我的经营月报</h1>
      <div class="mode-switcher" @click="toggleReportMode">
        <span class="mode-text">{{ currentMode }}</span>
        <svg class="mode-arrow" width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
    </div>

    <!-- 标题与模式切换（业务级） -->
    <div class="business-header">
      <div class="update-info-section">
        <span class="update-info">每日8:00更新</span>
      </div>
    </div>

    <!-- 模式切换下拉菜单 -->
    <div v-if="showModeMenu" class="mode-menu-overlay" @click="showModeMenu = false">
      <div class="mode-menu" @click.stop>
        <div 
          v-for="mode in reportModes" 
          :key="mode.value"
          class="mode-option"
          :class="{ active: selectedReportMode === mode.value }"
          @click="selectReportMode(mode.value)"
        >
          {{ mode.label }}
        </div>
      </div>
    </div>

    <!-- （三）时间切换标签（核心交互） -->
    <div class="time-switcher-section">
      <div class="time-tabs">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          class="time-tab"
          :class="{ active: selectedPeriod === period.value }"
          @click="switchTimePeriod(period.value)"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 二、经营风险模块 - 风险预警闭环 -->
    <div class="business-risk-section">
      <!-- （一）模块容器与视觉强化 -->
      <div class="risk-header">
        <div class="risk-title">
          <svg class="risk-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2L22 20H2L12 2Z" fill="#FF3333"/>
            <path d="M12 8V13" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" fill="white"/>
          </svg>
          <span class="risk-text">经营风险</span>
        </div>
        <button class="voice-broadcast-btn" @click="startVoiceBroadcast">
          <svg class="broadcast-icon" width="30" height="30" viewBox="0 0 30 30">
            <path d="M6 9V15H10L16 21V3L10 9H6Z" fill="currentColor"/>
            <path d="M19 10C20.5 11.5 20.5 14.5 19 16" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
      </div>

      <!-- （二）风险条目 - 数据与交互细节 -->
      <div class="risk-items">
        <div 
          v-for="risk in businessRisks" 
          :key="risk.id"
          class="risk-item"
          @click="handleRiskClick(risk)"
        >
          <div class="risk-content">
            <span class="risk-description">{{ risk.description }}</span>
            <div class="risk-details">
              <span class="risk-count">{{ risk.count }}</span>
              <span class="risk-impact">{{ risk.impact }}</span>
            </div>
          </div>
          <svg class="risk-arrow" width="16" height="16" viewBox="0 0 16 16">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 三、业务数据模块 - 指标穿透分析 -->
    <div class="business-data-section">
      <!-- （一）模块容器与指标说明 -->
      <div class="data-header">
        <h2 class="data-title">业务数据</h2>
        <button class="indicator-info-btn" @click="showIndicatorInfo">指标说明</button>
      </div>

      <!-- 指标说明浮窗 -->
      <div v-if="showIndicatorModal" class="indicator-overlay" @click="showIndicatorModal = false">
        <div class="indicator-modal" @click.stop>
          <div class="modal-header">
            <h3>指标计算公式</h3>
            <button class="modal-close" @click="showIndicatorModal = false">✕</button>
          </div>
          <div class="modal-content">
            <div v-for="indicator in indicatorFormulas" :key="indicator.name" class="formula-item">
              <div class="formula-name">{{ indicator.name }}</div>
              <div class="formula-expression">{{ indicator.formula }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- （二）数据条目 - 计算逻辑与交互校验 -->
      <div class="data-items">
        <div 
          v-for="dataItem in businessDataItems" 
          :key="dataItem.id"
          class="data-item"
          @click="handleDataItemClick(dataItem)"
        >
          <div class="data-main">
            <div class="data-label">{{ dataItem.label }}</div>
            <div class="data-value">{{ dataItem.value }}</div>
          </div>
          <div class="data-comparison" v-if="selectedReportMode === 'detailed'">
            <div class="comparison-item">
              <span class="comparison-label">环比</span>
              <span class="comparison-value" :class="getComparisonClass(dataItem.monthOverMonth)">
                {{ dataItem.monthOverMonth }}
              </span>
            </div>
            <div class="comparison-item">
              <span class="comparison-label">同比</span>
              <span class="comparison-value" :class="getComparisonClass(dataItem.yearOverYear)">
                {{ dataItem.yearOverYear }}
              </span>
            </div>
          </div>
          <div class="data-action">
            <span class="action-text">{{ dataItem.actionText }}</span>
            <svg class="action-arrow" width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据校验提示 -->
    <div v-if="showDataValidation" class="validation-overlay">
      <div class="validation-modal">
        <div class="validation-content">
          <div class="validation-icon">⏳</div>
          <div class="validation-text">数据校验中，请稍后重试</div>
          <div class="validation-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: validationProgress + '%' }"></div>
            </div>
            <div class="progress-text">{{ validationProgress }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限提示 -->
    <div v-if="showPermissionAlert" class="permission-overlay" @click="showPermissionAlert = false">
      <div class="permission-modal" @click.stop>
        <div class="permission-header">
          <h3>访问受限</h3>
          <button class="permission-close" @click="showPermissionAlert = false">✕</button>
        </div>
        <div class="permission-content">
          <div class="permission-icon">🔒</div>
          <div class="permission-message">{{ permissionMessage }}</div>
          <div class="permission-contact">
            如需查看此数据，请联系管理员申请权限
          </div>
        </div>
        <div class="permission-actions">
          <button class="contact-admin-btn" @click="contactAdmin">联系管理员</button>
          <button class="close-permission-btn" @click="showPermissionAlert = false">我知道了</button>
        </div>
      </div>
    </div>

    <!-- 语音播报状态 -->
    <div v-if="isVoiceBroadcasting" class="voice-status-overlay">
      <div class="voice-status-modal">
        <div class="voice-animation">
          <div class="voice-wave wave1"></div>
          <div class="voice-wave wave2"></div>
          <div class="voice-wave wave3"></div>
        </div>
        <div class="voice-text">正在播报经营风险...</div>
        <button class="stop-voice-btn" @click="stopVoiceBroadcast">停止播报</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlyReport',
  data() {
    return {
      // 模式切换
      showModeMenu: false,
      selectedReportMode: 'brief', // brief: 简报模式, detailed: 详细模式
      currentMode: '简报模式',
      reportModes: [
        { value: 'brief', label: '简报模式' },
        { value: 'detailed', label: '详细模式' }
      ],
      
      // 时间切换
      selectedPeriod: 'current', // current: 本月, previous: 上月
      timePeriods: [
        { value: 'current', label: '本月' },
        { value: 'previous', label: '上月' }
      ],
      
      // 经营风险数据
      businessRisks: [
        {
          id: 1,
          description: '目标进度有点慢呦',
          count: '4个目标',
          impact: '完成率 < 50%',
          type: 'goal_progress',
          threshold: 0.5,
          targetPath: '/goal-management'
        },
        {
          id: 2,
          description: '有7个客户利润为负',
          count: '7个客户',
          impact: '利润 -12,580.66元',
          type: 'negative_profit',
          calculation: 'customer_revenue - customer_cost',
          targetPath: '/negative-profit-customers'
        },
        {
          id: 3,
          description: '昨日新增1个客户最近90天无销售',
          count: '1个客户',
          impact: '潜在流失风险',
          type: 'inactive_customer',
          dayRange: 90,
          targetPath: '/inactive-customers'
        },
        {
          id: 4,
          description: '上月的单据，还有19个客户未结清',
          count: '19个客户',
          impact: '共计126,773.18元',
          type: 'outstanding_receivables',
          amount: 126773.18,
          targetPath: '/outstanding-receivables'
        }
      ],
      
      // 业务数据项
      businessDataItems: [
        {
          id: 1,
          label: '净销售额',
          value: '37,188.06元',
          rawValue: 37188.06,
          calculation: 'sales_amount - return_amount',
          salesAmount: 38144.74,
          returnAmount: 956.68,
          monthOverMonth: '+74.72%',
          yearOverYear: '+78.84%',
          actionText: '查看业务变化分析',
          targetPath: '/performance-analysis',
          type: 'net_sales'
        },
        {
          id: 2,
          label: '客户利润',
          value: '24,028.39元',
          rawValue: 24028.39,
          calculation: 'customer_revenue - customer_cost',
          monthOverMonth: '+45.33%',
          yearOverYear: '+62.17%',
          actionText: '查看客户利润榜',
          targetPath: '/customer-profit-ranking',
          type: 'customer_profit'
        },
        {
          id: 3,
          label: '铺货客户总数',
          value: '33个',
          rawValue: 33,
          calculation: 'unique_customers_with_stock',
          monthOverMonth: '+12.00%',
          yearOverYear: '+22.22%',
          actionText: '查看员工情况',
          targetPath: '/employee-stock-analysis',
          type: 'stock_customers'
        },
        {
          id: 4,
          label: '铺货品牌',
          value: '17个品牌',
          rawValue: 17,
          calculation: 'unique_brands_in_stock',
          monthOverMonth: '+6.25%',
          yearOverYear: '+13.33%',
          actionText: '查看品牌铺货情况',
          targetPath: '/brand-stock-analysis',
          type: 'stock_brands'
        },
        {
          id: 5,
          label: '铺货商品',
          value: '36个商品',
          rawValue: 36,
          calculation: 'unique_products_in_stock',
          monthOverMonth: '+9.09%',
          yearOverYear: '+20.00%',
          actionText: '查看商品铺货情况',
          targetPath: '/product-stock-analysis',
          type: 'stock_products'
        },
        {
          id: 6,
          label: '回款金额',
          value: '23,258.48元',
          rawValue: 23258.48,
          calculation: 'sum_of_received_payments',
          monthOverMonth: '+38.92%',
          yearOverYear: '+55.73%',
          actionText: '查看客户回款榜',
          targetPath: '/customer-payment-ranking',
          type: 'payment_amount'
        },
        {
          id: 7,
          label: '拜访客户',
          value: '11个',
          rawValue: 11,
          calculation: 'unique_visited_customers',
          monthOverMonth: '+22.22%',
          yearOverYear: '+37.50%',
          actionText: '查看业绩变化分析',
          targetPath: '/performance-analysis',
          type: 'visited_customers'
        },
        {
          id: 8,
          label: '客户数',
          value: '45个',
          rawValue: 45,
          calculation: 'total_active_customers',
          monthOverMonth: '+15.38%',
          yearOverYear: '+28.57%',
          actionText: '查看客户分析',
          targetPath: '/customer-analysis',
          type: 'total_customers'
        }
      ],
      
      // 指标公式
      indicatorFormulas: [
        {
          name: '净销售额',
          formula: '销售金额 - 退货金额'
        },
        {
          name: '客户利润',
          formula: '回款 - 成本（成本含商品、服务、营销）'
        },
        {
          name: '铺货客户',
          formula: '有商品库存的客户数量（去重）'
        },
        {
          name: '回款金额',
          formula: '本月到账的所有客户回款总和'
        },
        {
          name: '拜访客户',
          formula: '本月完成拜访的客户数量（去重）'
        },
        {
          name: '客户利润率',
          formula: '(回款 - 成本) / 回款 * 100%'
        }
      ],
      
      // 弹窗状态
      showIndicatorModal: false,
      showDataValidation: false,
      showPermissionAlert: false,
      isVoiceBroadcasting: false,
      
      // 数据校验
      validationProgress: 0,
      validationTimer: null,
      
      // 权限管理
      permissionMessage: '',
      userRole: 'sales_manager', // sales_manager, finance_director, admin
      
      // 语音播报
      voiceBroadcastTimer: null,
      broadcastIndex: 0
    }
  },
  
  computed: {
    // 根据当前模式过滤显示的数据
    filteredBusinessData() {
      if (this.selectedReportMode === 'brief') {
        // 简报模式：隐藏环比/同比小字
        return this.businessDataItems.map(item => ({
          ...item,
          showComparison: false
        }))
      }
      return this.businessDataItems.map(item => ({
        ...item,
        showComparison: true
      }))
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 更新系统时间（保留但不显示）
    updateTime() {
      // 保留方法但不再显示
    },
    
    // 切换报告模式
    toggleReportMode() {
      this.showModeMenu = !this.showModeMenu
    },
    
    // 选择报告模式
    selectReportMode(mode) {
      this.selectedReportMode = mode
      this.currentMode = mode === 'brief' ? '简报模式' : '详细模式'
      this.showModeMenu = false
      
      // 刷新数据展示密度
      this.refreshDataDensity()
    },
    
    // 刷新数据展示密度
    refreshDataDensity() {
      // 根据模式调整数据展示
      console.log(`切换到${this.currentMode}，数据密度已调整`)
    },
    
    // 切换时间周期
    switchTimePeriod(period) {
      if (this.selectedPeriod === period) return
      
      this.selectedPeriod = period
      
      // 触发数据重载
      this.reloadPeriodData(period)
    },
    
    // 重载时间周期数据
    reloadPeriodData(period) {
      console.log(`正在加载${period === 'current' ? '本月' : '上月'}数据...`)
      
      // 模拟数据加载
      if (period === 'previous') {
        // 上月数据逻辑
        this.loadPreviousMonthData()
      } else {
        // 本月数据逻辑
        this.loadCurrentMonthData()
      }
    },
    
    // 加载上月数据
    loadPreviousMonthData() {
      // 更新日期范围为上月
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      
      console.log(`加载上月数据：${lastMonth.getMonth() + 1}月${lastMonth.getDate()}日 - ${lastMonth.getMonth() + 1}月${lastMonthEnd.getDate()}日`)
      
      // 这里可以调用API加载上月的经营风险和业务数据
    },
    
    // 加载本月数据
    loadCurrentMonthData() {
      console.log('加载本月数据')
      // 恢复本月数据
    },
    
    // 处理风险点击
    handleRiskClick(risk) {
      // 权限校验
      if (!this.checkRiskPermission(risk)) {
        this.showPermissionAlert = true
        this.permissionMessage = `您无权限查看${risk.description}的详细信息`
        return
      }
      
      // 数据一致性校验
      if (this.needDataValidation(risk)) {
        this.startDataValidation()
        return
      }
      
      // 跳转到对应的分析页面
      this.navigateToRiskAnalysis(risk)
    },
    
    // 检查风险权限
    checkRiskPermission(risk) {
      // 根据用户角色和风险类型检查权限
      const rolePermissions = {
        sales_manager: ['goal_progress', 'inactive_customer'],
        finance_director: ['negative_profit', 'outstanding_receivables', 'goal_progress', 'inactive_customer'],
        admin: ['goal_progress', 'negative_profit', 'inactive_customer', 'outstanding_receivables']
      }
      
      return rolePermissions[this.userRole]?.includes(risk.type) || false
    },
    
    // 检查是否需要数据校验
    needDataValidation(risk) {
      // 模拟数据一致性检查逻辑
      // 比如检查经营风险数据与业务数据的一致性
      if (risk.type === 'negative_profit') {
        const customerProfitItem = this.businessDataItems.find(item => item.type === 'customer_profit')
        // 如果客户利润为正但风险显示负利润客户，需要校验
        return customerProfitItem && customerProfitItem.rawValue > 0
      }
      return false
    },
    
    // 开始数据校验
    startDataValidation() {
      this.showDataValidation = true
      this.validationProgress = 0
      
      this.validationTimer = setInterval(() => {
        this.validationProgress += 10
        if (this.validationProgress >= 100) {
          clearInterval(this.validationTimer)
          setTimeout(() => {
            this.showDataValidation = false
          }, 1000)
        }
      }, 200)
    },
    
    // 导航到风险分析页面
    navigateToRiskAnalysis(risk) {
      console.log(`导航到风险分析：${risk.type}`)
      
      // 根据风险类型设置筛选条件
      const routeParams = this.buildRiskRouteParams(risk)
      
      // 跳转到对应页面
      this.$router.push({
        path: risk.targetPath,
        query: routeParams
      })
    },
    
    // 构建风险路由参数
    buildRiskRouteParams(risk) {
      const params = {
        from: 'monthly_report',
        riskType: risk.type
      }
      
      switch (risk.type) {
        case 'goal_progress':
          params.progressThreshold = risk.threshold
          params.filter = 'slow_progress'
          break
        case 'negative_profit':
          params.profitFilter = 'negative'
          params.sortBy = 'profit_desc'
          break
        case 'inactive_customer':
          params.dayRange = risk.dayRange
          params.filter = 'no_sales'
          break
        case 'outstanding_receivables':
          params.period = 'last_month'
          params.status = 'outstanding'
          params.sortBy = 'amount_desc'
          break
      }
      
      return params
    },
    
    // 处理业务数据点击
    handleDataItemClick(dataItem) {
      // 权限校验
      if (!this.checkDataPermission(dataItem)) {
        this.showPermissionAlert = true
        this.permissionMessage = `您无权限查看${dataItem.label}的详细分析`
        return
      }
      
      // 跳转到分析页面
      this.navigateToDataAnalysis(dataItem)
    },
    
    // 检查数据权限
    checkDataPermission(dataItem) {
      // 不同角色的数据访问权限
      const roleDataAccess = {
        sales_manager: ['net_sales', 'visited_customers', 'stock_customers', 'total_customers'],
        finance_director: ['net_sales', 'customer_profit', 'payment_amount', 'visited_customers', 'stock_customers', 'stock_brands', 'stock_products', 'total_customers'],
        admin: ['net_sales', 'customer_profit', 'payment_amount', 'visited_customers', 'stock_customers', 'stock_brands', 'stock_products', 'total_customers']
      }
      
      return roleDataAccess[this.userRole]?.includes(dataItem.type) || false
    },
    
    // 导航到数据分析页面
    navigateToDataAnalysis(dataItem) {
      console.log(`导航到数据分析：${dataItem.type}`)
      
      const routeParams = this.buildDataRouteParams(dataItem)
      
      this.$router.push({
        path: dataItem.targetPath,
        query: routeParams
      })
    },
    
    // 构建数据路由参数
    buildDataRouteParams(dataItem) {
      const params = {
        from: 'monthly_report',
        dataType: dataItem.type,
        period: this.selectedPeriod
      }
      
      // 根据数据类型添加特定参数
      switch (dataItem.type) {
        case 'net_sales':
          params.includeReturns = true
          params.breakdown = 'daily'
          break
        case 'customer_profit':
          params.sortBy = 'profit_desc'
          params.includeCosts = true
          break
        case 'stock_customers':
          params.dimension = 'employee'
          params.metric = 'coverage_rate'
          break
        case 'stock_brands':
          params.dimension = 'brand'
          params.metric = 'penetration_rate'
          break
        case 'stock_products':
          params.dimension = 'product'
          params.metric = 'turnover_rate'
          break
        case 'payment_amount':
          params.rankBy = 'amount'
          params.includeSettled = true
          break
        case 'visited_customers':
          params.includeConversion = true
          params.conversionWindow = 7
          break
      }
      
      return params
    },
    
    // 显示指标说明
    showIndicatorInfo() {
      this.showIndicatorModal = true
    },
    
    // 获取比较值的样式类
    getComparisonClass(value) {
      if (!value || value === '—' || value === '∞') return 'neutral'
      
      const numValue = parseFloat(value.replace('%', ''))
      if (numValue > 0) return 'positive'
      if (numValue < 0) return 'negative'
      return 'neutral'
    },
    
    // 开始语音播报
    startVoiceBroadcast() {
      this.isVoiceBroadcasting = true
      this.broadcastIndex = 0
      
      // 模拟语音播报
      this.voiceBroadcastTimer = setInterval(() => {
        if (this.broadcastIndex < this.businessRisks.length) {
          const risk = this.businessRisks[this.broadcastIndex]
          console.log(`播报：${risk.description}`)
          
          // 这里可以调用实际的语音合成API
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(risk.description)
            utterance.lang = 'zh-CN'
            speechSynthesis.speak(utterance)
          }
          
          this.broadcastIndex++
        } else {
          this.stopVoiceBroadcast()
        }
      }, 3000)
    },
    
    // 停止语音播报
    stopVoiceBroadcast() {
      this.isVoiceBroadcasting = false
      if (this.voiceBroadcastTimer) {
        clearInterval(this.voiceBroadcastTimer)
        this.voiceBroadcastTimer = null
      }
      
      // 停止语音合成
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel()
      }
    },
    
    // 联系管理员
    contactAdmin() {
      console.log('正在联系管理员申请权限...')
      // 这里可以发送权限申请请求
      this.showPermissionAlert = false
    },
    
    // 模拟电池电量变化（移除）
    updateBatteryLevel() {
      // 此方法已移除，不再需要电池监控
    }
  },
  
  mounted() {
    // 移除系统时间相关的定时器
    // 根据当前时间设置默认时间周期
    const now = new Date()
    if (now.getDate() < 5) {
      // 月初默认显示上月数据
      this.selectedPeriod = 'previous'
    }
  },
  
  beforeUnmount() {
    // 清理定时器
    if (this.validationTimer) {
      clearInterval(this.validationTimer)
    }
    if (this.voiceBroadcastTimer) {
      clearInterval(this.voiceBroadcastTimer)
    }
  }
}
</script>

<style scoped>
/* 整体布局 - 移动端经营月报专用设计 */
.monthly-report {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 一、全局框架与响应式适配 */
/* 顶部操作栏（包含返回按钮） */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #007AFF;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  min-width: 32px;
  height: 32px;
}

.back-btn:hover {
  background-color: #f0f8ff;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #007AFF;
}

.page-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.mode-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s;
}

.mode-switcher:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.mode-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.mode-arrow {
  color: #666666;
  transition: transform 0.3s;
}

/* 标题与模式切换（业务级） */
.business-header {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 16px;
}

.update-info-section {
  text-align: center;
}

.update-info {
  color: #666666;
  font-size: 12px;
  font-weight: 400;
}

/* 模式切换菜单 */
.mode-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.mode-menu {
  position: absolute;
  top: 60px;
  right: 16px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  min-width: 120px;
}

.mode-option {
  padding: 12px 16px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.mode-option:last-child {
  border-bottom: none;
}

.mode-option:hover {
  background-color: #f8f9fa;
}

.mode-option.active {
  background-color: #007AFF;
  color: #ffffff;
}

/* （三）时间切换标签（核心交互） */
.time-switcher-section {
  background-color: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.time-tabs {
  display: flex;
  gap: 10px;
}

.time-tab {
  width: 80px;
  height: 30px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f2f2f2;
  color: #333333;
}

.time-tab.active {
  background-color: #FF9900;
  color: #ffffff;
}

.time-tab:hover:not(.active) {
  background-color: #e9ecef;
}

/* 二、经营风险模块 - 风险预警闭环 */
.business-risk-section {
  background-color: #ffffff;
  margin: 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* （一）模块容器与视觉强化 */
.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.risk-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.risk-icon {
  width: 24px;
  height: 24px;
}

.risk-text {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
}

.voice-broadcast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
}

.voice-broadcast-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
  background-color: #f8fbff;
}

.broadcast-icon {
  width: 18px;
  height: 18px;
}

/* （二）风险条目 - 数据与交互细节 */
.risk-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff8f0;
  border: 1px solid #ffe4cc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 60px;
}

.risk-item:hover {
  background-color: #fff4e6;
  border-color: #ffb366;
  transform: translateY(-1px);
}

.risk-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.risk-description {
  color: #d46b08;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
}

.risk-details {
  display: flex;
  gap: 12px;
}

.risk-count {
  color: #ad4e00;
  font-size: 13px;
  font-weight: 600;
}

.risk-impact {
  color: #8c4700;
  font-size: 13px;
}

.risk-arrow {
  color: #d46b08;
  margin-left: 8px;
}

/* 三、业务数据模块 - 指标穿透分析 */
.business-data-section {
  background-color: #ffffff;
  margin: 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* （一）模块容器与指标说明 */
.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.data-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.indicator-info-btn {
  background: none;
  border: none;
  color: #0099FF;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.indicator-info-btn:hover {
  color: #007ACC;
}

/* 指标说明浮窗 */
.indicator-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.indicator-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #f0f0f0;
}

.modal-content {
  padding: 16px 20px;
  max-height: 400px;
  overflow-y: auto;
}

.formula-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.formula-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.formula-name {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.formula-expression {
  color: #666666;
  font-size: 13px;
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Monaco', 'Consolas', monospace;
}

/* （二）数据条目 - 计算逻辑与交互校验 */
.data-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 70px;
}

.data-item:hover {
  background-color: #e9ecef;
  border-color: #007AFF;
  transform: translateY(-1px);
}

.data-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-label {
  color: #666666;
  font-size: 13px;
  font-weight: 500;
}

.data-value {
  color: #333333;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.data-comparison {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 16px;
  min-width: 80px;
}

.comparison-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.comparison-label {
  color: #999999;
  font-size: 11px;
  font-weight: 500;
}

.comparison-value {
  font-size: 12px;
  font-weight: 600;
}

.comparison-value.positive {
  color: #00b42a;
}

.comparison-value.negative {
  color: #f53f3f;
}

.comparison-value.neutral {
  color: #666666;
}

.data-action {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-text {
  color: #007AFF;
  font-size: 12px;
  font-weight: 500;
}

.action-arrow {
  color: #007AFF;
}

/* 数据校验提示 */
.validation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.validation-modal {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.validation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.validation-icon {
  font-size: 48px;
}

.validation-text {
  color: #333333;
  font-size: 16px;
  font-weight: 500;
}

.validation-progress {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007AFF;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #666666;
  font-size: 14px;
  text-align: center;
}

/* 权限提示 */
.permission-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.permission-modal {
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.permission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.permission-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.permission-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.permission-content {
  padding: 24px 20px;
  text-align: center;
}

.permission-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.permission-message {
  color: #333333;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  line-height: 1.4;
}

.permission-contact {
  color: #666666;
  font-size: 14px;
  line-height: 1.4;
}

.permission-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eaeaea;
}

.contact-admin-btn {
  flex: 1;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-admin-btn:hover {
  background-color: #0056d6;
}

.close-permission-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-permission-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

/* 语音播报状态 */
.voice-status-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-status-modal {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px;
  max-width: 300px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.voice-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.voice-wave {
  width: 4px;
  background-color: #007AFF;
  border-radius: 2px;
  animation: wave 1.5s ease-in-out infinite;
}

.wave1 {
  height: 20px;
  animation-delay: 0s;
}

.wave2 {
  height: 30px;
  animation-delay: 0.1s;
}

.wave3 {
  height: 25px;
  animation-delay: 0.2s;
}

@keyframes wave {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

.voice-text {
  color: #333333;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
}

.stop-voice-btn {
  background-color: #f53f3f;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.stop-voice-btn:hover {
  background-color: #d32f2f;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .main-title {
    font-size: 28px;
  }
  
  .business-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .mode-switcher {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .data-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .data-comparison {
    flex-direction: row;
    justify-content: flex-start;
    gap: 16px;
    margin: 0;
    min-width: auto;
  }
  
  .data-action {
    align-self: flex-end;
  }
}

@media (max-width: 360px) {
  .business-risk-section,
  .business-data-section {
    margin: 12px;
    padding: 12px;
  }
  
  .risk-item,
  .data-item {
    padding: 12px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-overlay,
.permission-overlay,
.voice-status-overlay,
.indicator-overlay {
  animation: fadeIn 0.2s ease-out;
}

.validation-modal,
.permission-modal,
.voice-status-modal,
.indicator-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
