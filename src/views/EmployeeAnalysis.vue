<template>
  <div class="employee-analysis">
    <!-- 顶部导航区 -->
    <div class="header-bar">
      <button class="back-arrow" @click="goBack">
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="#333333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">员工整体分析</h1>
      <div class="date-section">
        <div class="date-range" @click="showDatePicker">
          <span class="date-text">{{ currentDateRange }}</span>
        </div>
      </div>
    </div>

    <!-- 维度切换标签 -->
    <div class="dimension-tabs">
      <button 
        v-for="tab in dimensionTabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentDimension === tab.value }"
        @click="switchDimension(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 拜访分析模块 -->
      <div v-if="currentDimension === 'visit'" class="analysis-module">
        <div class="module-header">
          <div class="module-title">
            <svg class="module-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2L3 7L8 12L13 7L8 2Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text">拜访分析</span>
          </div>
          <button class="indicator-help" @click="showIndicatorModal('visit')">
            <span class="help-text">指标说明</span>
            <svg class="question-icon" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" stroke="#999999" stroke-width="1" fill="none"/>
              <text x="6" y="8" text-anchor="middle" font-size="8" fill="#999999">?</text>
            </svg>
          </button>
        </div>

        <!-- 拜访数据卡片 -->
        <div class="data-cards">
          <div class="data-card" @click="navigateToPerformanceAnalysis('visit-customers')">
            <div class="card-title">拜访客户数（去重累计）</div>
            <div class="card-value">{{ visitData.uniqueCustomers }}</div>
            <div class="card-subtitle">员工平均数 {{ visitData.avgUniqueCustomers }}</div>
          </div>
          <div class="data-card" @click="navigateToPerformanceAnalysis('visit-times')">
            <div class="card-title">拜访客户次数（总数）</div>
            <div class="card-value">{{ visitData.totalVisits }}</div>
            <div class="card-subtitle">平均数 {{ visitData.avgVisits }}</div>
          </div>
        </div>

        <!-- 行动按钮 -->
        <div class="action-buttons">
          <button class="action-btn" @click="navigateToAction('improve-visit')">
            提升拜访
          </button>
          <button class="action-btn" @click="navigateToAction('improve-efficiency')">
            提高效率
          </button>
        </div>
      </div>

      <!-- 销售分析模块 -->
      <div v-if="currentDimension === 'sales'" class="analysis-module">
        <div class="module-header">
          <div class="module-title">
            <svg class="module-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 4L8 2L14 4V12L8 14L2 12V4Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text">销售分析</span>
          </div>
          <button class="indicator-help" @click="showIndicatorModal('sales')">
            <span class="help-text">指标说明</span>
            <svg class="question-icon" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" stroke="#999999" stroke-width="1" fill="none"/>
              <text x="6" y="8" text-anchor="middle" font-size="8" fill="#999999">?</text>
            </svg>
          </button>
        </div>

        <!-- 核心数据卡 -->
        <div class="core-data-cards">
          <div class="core-card">
            <div class="card-title">销售金额</div>
            <div class="card-value sales">¥{{ formatAmount(salesData.salesAmount) }}</div>
            <div class="card-subtitle">员工中位数 ¥{{ formatAmount(salesData.medianSales) }}</div>
          </div>
          <div class="core-card">
            <div class="card-title">退货金额</div>
            <div class="card-value return">¥{{ formatAmount(salesData.returnAmount) }}</div>
            <div class="card-subtitle">员工中位数 ¥{{ formatAmount(salesData.medianReturn) }}</div>
          </div>
        </div>

        <!-- 员工类型分析 -->
        <div class="employee-type-analysis">
          <div class="analysis-title">员工类型分析</div>
          <div class="type-grid">
            <div class="type-card good" @click="navigateToEmployeePerformance('high-sales-low-return')">
              <div class="type-label">销售多退货少</div>
              <div class="type-count">{{ salesData.highSalesLowReturn }}人</div>
              <div class="type-desc">表现好</div>
            </div>
            <div class="type-card warning" @click="navigateToEmployeePerformance('high-sales-high-return')">
              <div class="type-label">销售多退货多</div>
              <div class="type-count">{{ salesData.highSalesHighReturn }}人</div>
              <div class="type-desc">有压货风险</div>
            </div>
            <div class="type-card normal" @click="navigateToEmployeePerformance('low-sales-low-return')">
              <div class="type-label">销售少退货少</div>
              <div class="type-count">{{ salesData.lowSalesLowReturn }}人</div>
              <div class="type-desc">表现一般</div>
            </div>
            <div class="type-card attention" @click="navigateToEmployeePerformance('low-sales-high-return')">
              <div class="type-label">销售少退货多</div>
              <div class="type-count">{{ salesData.lowSalesHighReturn }}人</div>
              <div class="type-desc">需关注</div>
            </div>
          </div>
        </div>

        <!-- 行动按钮 -->
        <div class="action-buttons">
          <button class="action-btn" @click="navigateToAction('employee-performance')">
            员工销售表现
          </button>
          <button class="action-btn" @click="navigateToAction('sales-return-analysis')">
            销售和退货变化分析
          </button>
        </div>
      </div>

      <!-- 铺市分析模块 -->
      <div v-if="currentDimension === 'market'" class="analysis-module">
        <div class="module-header">
          <div class="module-title">
            <svg class="module-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 3H13V13H3V3ZM5 5V11H11V5H5Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text">铺市分析</span>
          </div>
        </div>

        <!-- 行动按钮 -->
        <div class="market-actions">
          <button class="market-action-btn" @click="navigateToAction('customer-coverage')">
            <div class="action-icon">👥</div>
            <div class="action-text">提升客户覆盖</div>
            <div class="action-desc">查看应铺未铺客户</div>
          </button>
          <button class="market-action-btn" @click="navigateToAction('brand-coverage')">
            <div class="action-icon">🏷️</div>
            <div class="action-text">提升品牌覆盖</div>
            <div class="action-desc">查看应铺未铺品牌</div>
          </button>
          <button class="market-action-btn" @click="navigateToAction('product-coverage')">
            <div class="action-icon">📦</div>
            <div class="action-text">提升商品覆盖</div>
            <div class="action-desc">查看应铺未铺商品</div>
          </button>
        </div>
      </div>

      <!-- 利润分析模块 -->
      <div v-if="currentDimension === 'profit'" class="analysis-module">
        <div class="module-header">
          <div class="module-title">
            <svg class="module-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2L14 4V12L8 14L2 12V4L8 2Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text">利润</span>
          </div>
          <button class="indicator-help" @click="showIndicatorModal('profit')">
            <span class="help-text">指标说明</span>
            <svg class="question-icon" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" stroke="#999999" stroke-width="1" fill="none"/>
              <text x="6" y="8" text-anchor="middle" font-size="8" fill="#999999">?</text>
            </svg>
          </button>
          <div class="compare-toggle">
            <button 
              class="toggle-btn"
              :class="{ active: profitCompareType === 'mom' }"
              @click="profitCompareType = 'mom'"
            >
              看环比
            </button>
            <button 
              class="toggle-btn"
              :class="{ active: profitCompareType === 'yoy' }"
              @click="profitCompareType = 'yoy'"
            >
              看同比
            </button>
          </div>
        </div>

        <!-- 核心数据卡（四宫格） -->
        <div class="profit-data-grid">
          <div class="profit-card" @click="showProfitDetail('employee-profit')">
            <div class="card-title">员工利润</div>
            <div class="card-value negative">¥{{ formatAmount(profitData.employeeProfit) }}</div>
            <div class="card-change negative">
              {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↓{{ profitData.profitChange }}%
            </div>
          </div>
          <div class="profit-card" @click="showProfitDetail('net-sales')">
            <div class="card-title">净销售额</div>
            <div class="card-value">¥{{ formatAmount(profitData.netSales) }}</div>
            <div class="card-change positive">
              {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.netSalesChange }}%
            </div>
          </div>
          <div class="profit-card" @click="showProfitDetail('sales-amount')">
            <div class="card-title">销售金额</div>
            <div class="card-value">¥{{ formatAmount(profitData.salesAmount) }}</div>
            <div class="card-change positive">
              {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.salesChange }}%
            </div>
          </div>
          <div class="profit-card" @click="showProfitDetail('product-cost')">
            <div class="card-title">商品成本</div>
            <div class="card-value">¥{{ formatAmount(profitData.productCost) }}</div>
            <div class="card-change positive">
              {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.costChange }}%
            </div>
          </div>
          <div class="profit-card highlight" @click="showProfitDetail('gross-profit')">
            <div class="card-title">销售毛利</div>
            <div class="card-value">¥{{ formatAmount(profitData.grossProfit) }}</div>
            <div class="card-change positive highlight">
              {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.grossProfitChange }}%
            </div>
          </div>
        </div>

        <!-- 员工利润列表 -->
        <div class="employee-profit-list">
          <div class="list-header">
            <div class="list-title">员工利润表现</div>
            <div class="sort-options">
              <button 
                class="sort-btn"
                :class="{ active: profitSortBy === 'growthRate' }"
                @click="profitSortBy = 'growthRate'"
              >
                按增长率
              </button>
              <button 
                class="sort-btn"
                :class="{ active: profitSortBy === 'changeValue' }"
                @click="profitSortBy = 'changeValue'"
              >
                按变化值
              </button>
            </div>
          </div>
          <div class="employee-list">
            <div 
              v-for="employee in sortedEmployeeProfit" 
              :key="employee.id"
              class="employee-item"
              @click="viewEmployeeDetail(employee.id)"
            >
              <div class="employee-info">
                <div class="employee-name">{{ employee.name }}</div>
                <div class="employee-role">{{ employee.role }}</div>
              </div>
              <div class="profit-metrics">
                <div class="growth-rate" :class="{ positive: employee.growthRate > 0, negative: employee.growthRate < 0 }">
                  增长率 {{ employee.growthRate > 0 ? '↑' : '↓' }}{{ Math.abs(employee.growthRate) }}%
                </div>
                <div class="change-value" :class="{ positive: employee.changeValue > 0, negative: employee.changeValue < 0 }">
                  变化值 {{ employee.changeValue > 0 ? '+' : '' }}{{ formatAmount(employee.changeValue) }}
                </div>
              </div>
              <svg class="detail-arrow" width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 4L10 8L6 12" stroke="#999999" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
          </div>
          <button class="load-more-btn" @click="loadMoreEmployees">
            查看更多
          </button>
        </div>
      </div>
    </div>

    <!-- 日期选择器弹窗 -->
    <div v-if="showDateModal" class="modal-overlay" @click="showDateModal = false">
      <div class="date-modal" @click.stop>
        <div class="modal-header">
          <h3>选择查询时间</h3>
          <button class="close-btn" @click="showDateModal = false">×</button>
        </div>
        <div class="date-options">
          <button 
            v-for="option in dateOptions" 
            :key="option.value"
            class="date-option"
            :class="{ active: selectedDateOption === option.value }"
            @click="selectDateOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicator" class="modal-overlay" @click="showIndicator = false">
      <div class="indicator-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ currentIndicatorTitle }}</h3>
          <button class="close-btn" @click="showIndicator = false">×</button>
        </div>
        <div class="indicator-content">
          <div v-html="currentIndicatorContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeAnalysis',
  data() {
    return {
      currentDateRange: '06-01～06-26',
      currentDimension: 'visit', // visit, sales, market, profit
      showDateModal: false,
      showIndicator: false,
      selectedDateOption: 'current',
      profitCompareType: 'mom', // mom: 环比, yoy: 同比
      profitSortBy: 'growthRate', // growthRate, changeValue
      currentIndicatorTitle: '',
      currentIndicatorContent: '',
      
      // 维度标签
      dimensionTabs: [
        { value: 'visit', label: '拜访分析' },
        { value: 'sales', label: '销售分析' },
        { value: 'market', label: '铺市分析' },
        { value: 'profit', label: '利润' }
      ],
      
      // 日期选择选项
      dateOptions: [
        { value: 'today', label: '今天' },
        { value: 'yesterday', label: '昨天' },
        { value: 'current', label: '本月' },
        { value: 'last', label: '上月' },
        { value: 'last7', label: '近7天' },
        { value: 'last30', label: '近30天' },
        { value: 'quarter', label: '本季度' },
        { value: 'year', label: '本年度' }
      ],
      
      // 拜访分析数据
      visitData: {
        uniqueCustomers: 16,
        avgUniqueCustomers: 1.7,
        totalVisits: 20,
        avgVisits: 2
      },
      
      // 销售分析数据
      salesData: {
        salesAmount: 53552.74,
        medianSales: 494.00,
        returnAmount: 956.68,
        medianReturn: 0.00,
        highSalesLowReturn: 0,
        highSalesHighReturn: 9,
        lowSalesLowReturn: 0,
        lowSalesHighReturn: 9
      },
      
      // 利润分析数据
      profitData: {
        employeeProfit: -6617.54,
        profitChange: 104.06,
        netSales: 52596.06,
        netSalesChange: 76.82,
        salesAmount: 53552.74,
        salesChange: 76.41,
        productCost: 49908.24,
        costChange: 18.91,
        grossProfit: 2251.46,
        grossProfitChange: 98.64
      },
      
      // 员工利润数据
      employeeProfitData: [
        {
          id: 1,
          name: '黄保杰',
          role: '销售代表',
          growthRate: 687.23,
          changeValue: 5127.18
        },
        {
          id: 2,
          name: '渠道经理',
          role: '渠道管理',
          growthRate: 100.00,
          changeValue: 2.00
        },
        {
          id: 3,
          name: '张小明',
          role: '销售代表',
          growthRate: -15.32,
          changeValue: -1245.68
        },
        {
          id: 4,
          name: '李小红',
          role: '销售代表',
          growthRate: 45.67,
          changeValue: 890.34
        },
        {
          id: 5,
          name: '王小强',
          role: '客户经理',
          growthRate: -8.91,
          changeValue: -567.89
        }
      ]
    }
  },
  
  computed: {
    // 排序后的员工利润数据
    sortedEmployeeProfit() {
      const data = [...this.employeeProfitData]
      if (this.profitSortBy === 'growthRate') {
        return data.sort((a, b) => b.growthRate - a.growthRate)
      } else {
        return data.sort((a, b) => b.changeValue - a.changeValue)
      }
    }
  },
  
  methods: {
    // 格式化金额
    formatAmount(amount) {
      if (amount == null || amount === '') return '0.00'
      
      const num = parseFloat(amount)
      if (isNaN(num)) return '0.00'
      
      const absNum = Math.abs(num)
      
      return absNum.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 显示日期选择器
    showDatePicker() {
      this.showDateModal = true
    },
    
    // 选择日期
    selectDateOption(value) {
      this.selectedDateOption = value
      const dateMap = {
        'today': '08-11～08-11',
        'yesterday': '08-10～08-10', 
        'current': '08-01～08-11',
        'last': '07-01～07-31',
        'last7': '08-05～08-11',
        'last30': '07-12～08-11',
        'quarter': '06-01～08-11',
        'year': '01-01～08-11'
      }
      this.currentDateRange = dateMap[value] || '06-01～06-26'
      this.showDateModal = false
    },
    
    // 切换分析维度
    switchDimension(dimension) {
      this.currentDimension = dimension
    },
    
    // 显示指标说明
    showIndicatorModal(type) {
      const indicators = {
        visit: {
          title: '拜访分析指标说明',
          content: `
            <div class="indicator-item">
              <strong>拜访客户数（去重累计）：</strong>统计期间内员工拜访过的<span class="highlight">不重复客户数量</span>，同一客户多次拜访只计算一次
            </div>
            <div class="indicator-item">
              <strong>拜访客户次数（总数）：</strong>统计期间内员工的<span class="highlight">拜访总次数</span>，包含对同一客户的多次拜访
            </div>
            <div class="indicator-item">
              <strong>计算规则：</strong>
              <ul>
                <li>拜访记录以<span class="highlight">实际拜访时间</span>为准</li>
                <li>电话拜访、上门拜访均纳入统计</li>
                <li>取消的拜访记录<span class="highlight">不计入</span>统计</li>
              </ul>
            </div>
          `
        },
        sales: {
          title: '销售分析指标说明',
          content: `
            <div class="indicator-item">
              <strong>销售金额：</strong>统计期间内员工完成的<span class="highlight">销售订单总金额</span>，不含税费
            </div>
            <div class="indicator-item">
              <strong>退货金额：</strong>统计期间内员工负责客户的<span class="highlight">退货订单总金额</span>
            </div>
            <div class="indicator-item">
              <strong>员工分类规则：</strong>
              <ul>
                <li><span class="highlight">销售多退货少：</span>销售额>平均值且退货率<10%</li>
                <li><span class="highlight">销售多退货多：</span>销售额>平均值但退货率≥10%</li>
                <li><span class="highlight">销售少退货少：</span>销售额≤平均值且退货率<10%</li>
                <li><span class="highlight">销售少退货多：</span>销售额≤平均值且退货率≥10%</li>
              </ul>
            </div>
          `
        },
        profit: {
          title: '利润分析指标说明',
          content: `
            <div class="indicator-item">
              <strong>员工利润：</strong>员工负责客户产生的<span class="highlight">净利润总额</span>，计算公式：销售金额 - 商品成本 - 费用分摊
            </div>
            <div class="indicator-item">
              <strong>净销售额：</strong>销售金额扣除退货后的<span class="highlight">实际销售金额</span>
            </div>
            <div class="indicator-item">
              <strong>销售毛利：</strong>销售金额与商品成本的<span class="highlight">差额</span>，不含其他费用
            </div>
            <div class="indicator-item">
              <strong>环比/同比计算：</strong>
              <ul>
                <li><span class="highlight">环比：</span>与上月同期数据对比</li>
                <li><span class="highlight">同比：</span>与去年同期数据对比</li>
                <li>增长率 = (当期数值 - 对比期数值) / 对比期数值 × 100%</li>
              </ul>
            </div>
          `
        }
      }
      
      const indicator = indicators[type]
      if (indicator) {
        this.currentIndicatorTitle = indicator.title
        this.currentIndicatorContent = indicator.content
        this.showIndicator = true
      }
    },
    
    // 导航到具体行动页面
    navigateToAction(action) {
      console.log(`导航到行动页面: ${action}`)
      
      // 根据不同的action跳转到对应页面
      switch(action) {
        // 拜访分析相关跳转
        case 'improve-visit':
        case 'improve-efficiency':
          // 提升拜访、提高效率 -> 进入拜访分析
          this.$router.push('/visit-analysis')
          break
          
        // 销售分析相关跳转
        case 'employee-performance':
          // 员工销售表现 -> 进入员工业绩汇总表
          this.$router.push('/employee-performance')
          break
          
        case 'sales-return-analysis':
          // 销售和退货变化分析 -> 进入业绩变化分析
          this.$router.push('/performance-analysis')
          break
          
        // 铺市分析相关跳转
        case 'customer-coverage':
        case 'brand-coverage':  
        case 'product-coverage':
          // 各页签跳转进入铺市分析
          this.$router.push('/market-analysis')
          break
          
        default:
          alert('功能开发中...')
      }
    },
    
    // 跳转到业绩变化分析
    navigateToPerformanceAnalysis(type) {
      console.log(`跳转到业绩变化分析: ${type}`)
      // 拜访客户数、拜访客户次数 -> 进入业绩变化分析
      this.$router.push({
        path: '/performance-analysis',
        query: { type: type, source: 'employee-analysis' }
      })
    },
    
    // 跳转到员工业绩汇总表
    navigateToEmployeePerformance(category) {
      console.log(`跳转到员工业绩汇总表: ${category}`)
      // 员工类型分析各页签 -> 进入员工业绩汇总表
      this.$router.push({
        path: '/employee-performance',
        query: { category: category, source: 'employee-analysis' }
      })
    },
    
    // 显示利润明细
    showProfitDetail(type) {
      console.log(`显示利润明细: ${type}`)
      
      const detailTitles = {
        'employee-profit': '员工利润明细',
        'net-sales': '净销售额明细',
        'sales-amount': '销售金额明细', 
        'product-cost': '商品成本明细',
        'gross-profit': '销售毛利明细'
      }
      
      const detailData = {
        'employee-profit': [
          { name: '黄保杰', value: 5127.18, change: 687.23 },
          { name: '渠道经理', value: 2.00, change: 100.00 },
          { name: '李小红', value: 890.34, change: 45.67 },
          { name: '张小明', value: -1245.68, change: -15.32 },
          { name: '王小强', value: -567.89, change: -8.91 }
        ],
        'net-sales': [
          { name: '线上销售', value: 25896.32, change: 82.15 },
          { name: '线下门店', value: 18542.67, change: 65.43 },
          { name: '代理商销售', value: 8157.07, change: 98.76 }
        ],
        'sales-amount': [
          { name: '主营商品', value: 42356.89, change: 78.92 },
          { name: '辅助商品', value: 11195.85, change: 71.23 }
        ],
        'product-cost': [
          { name: '原材料成本', value: 32845.67, change: 15.34 },
          { name: '加工成本', value: 12876.43, change: 22.87 },
          { name: '包装成本', value: 4186.14, change: 28.56 }
        ],
        'gross-profit': [
          { name: '主营业务毛利', value: 1856.78, change: 95.23 },
          { name: '其他业务毛利', value: 394.68, change: 105.87 }
        ]
      }
      
      // 模拟弹窗显示明细数据
      const title = detailTitles[type] || '明细数据'
      const data = detailData[type] || []
      
      let detailContent = `${title}\n\n`
      data.forEach(item => {
        const changeText = item.change > 0 ? `↑${item.change}%` : `↓${Math.abs(item.change)}%`
        detailContent += `${item.name}: ¥${this.formatAmount(item.value)} (${changeText})\n`
      })
      
      alert(detailContent)
    },
    
    // 查看员工详情
    viewEmployeeDetail(employeeId) {
      const employee = this.employeeProfitData.find(emp => emp.id === employeeId)
      if (employee) {
        console.log(`查看员工详情: ${employee.name}`)
        alert(`查看 ${employee.name} 的利润明细`)
      }
    },
    
    // 加载更多员工
    loadMoreEmployees() {
      console.log('加载更多员工数据')
      alert('加载更多员工数据...')
    }
  }
}
</script>

<style scoped>
/* 整体页面布局 */
.employee-analysis {
  min-height: 100vh;
  background-color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 顶部导航区 */
.header-bar {
  width: 100%;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}

.back-arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-arrow:hover {
  background-color: #F5F5F5;
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.page-title {
  color: #333333;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

.date-section {
  display: flex;
  align-items: center;
}

.date-range {
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: 1px solid #E5E7EB;
  background-color: #F9FAFB;
}

.date-range:hover {
  background-color: #F3F4F6;
  border-color: #D1D5DB;
}

.date-text {
  color: #999999;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

/* 维度切换标签 */
.dimension-tabs {
  display: flex;
  padding: 0 1rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
  gap: 0;
}

.tab-item {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  color: #999999;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-item:hover {
  color: #4A90E2;
}

.tab-item.active {
  color: #4A90E2;
  border-bottom-color: #4A90E2;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 1rem;
  background-color: #F8F9FA;
}

/* 分析模块 */
.analysis-module {
  background-color: #FFFFFF;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 模块头部 */
.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #F0F0F0;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.title-text {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
}

.indicator-help {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.indicator-help:hover {
  background-color: #F4F4F4;
}

.help-text {
  color: #999999;
  font-size: 0.75rem;
  white-space: nowrap;
}

.question-icon {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
}

.compare-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  background: none;
  border: 1px solid #E5E7EB;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  color: #999999;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.toggle-btn.active {
  background-color: #4A90E2;
  border-color: #4A90E2;
  color: #FFFFFF;
}

/* 拜访分析 - 数据卡片 */
.data-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.data-card {
  background-color: #F4F4F4;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-card:hover {
  background-color: #E8F4FD;
  border: 1px solid #4A90E2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
}

.card-title {
  color: #666666;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.card-value {
  color: #333333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: #999999;
  font-size: 0.6875rem;
}

/* 销售分析 - 核心数据卡 */
.core-data-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.core-card {
  background-color: #FFFFFF;
  border: 1px solid #F0F0F0;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
}

.card-value.sales {
  color: #22C55E;
}

.card-value.return {
  color: #EF4444;
}

/* 员工类型分析 */
.employee-type-analysis {
  margin-bottom: 1.5rem;
}

.analysis-title {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.type-card {
  background-color: #FFFFFF;
  border: 1px solid #F0F0F0;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.type-card.good {
  border-color: #22C55E;
  background-color: #F0FDF4;
}

.type-card.warning {
  border-color: #F59E0B;
  background-color: #FFFBEB;
}

.type-card.normal {
  border-color: #6B7280;
  background-color: #F9FAFB;
}

.type-card.attention {
  border-color: #EF4444;
  background-color: #FEF2F2;
}

.type-label {
  color: #333333;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.type-count {
  color: #333333;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.type-desc {
  color: #666666;
  font-size: 0.6875rem;
}

/* 行动按钮 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  background-color: #4A90E2;
  border: none;
  border-radius: 0.375rem;
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  max-width: 200px;
}

.action-btn:hover {
  background-color: #3B7DD8;
}

/* 铺市分析 - 行动按钮 */
.market-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.market-action-btn {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.market-action-btn:hover {
  border-color: #4A90E2;
  background-color: #F8FAFF;
}

.action-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.action-text {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.action-desc {
  color: #666666;
  font-size: 0.75rem;
}

/* 利润分析 - 数据网格 */
.profit-data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.profit-card {
  background-color: #FFFFFF;
  border: 1px solid #F0F0F0;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
  border-color: #4A90E2;
}

.profit-card.highlight {
  border-color: #4A90E2;
  background-color: #F8FAFF;
}

.card-value.negative {
  color: #EF4444;
}

.card-change {
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.card-change.positive {
  color: #22C55E;
}

.card-change.negative {
  color: #EF4444;
}

.card-change.highlight {
  color: #4A90E2;
  font-weight: 600;
}

/* 员工利润列表 */
.employee-profit-list {
  background-color: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 0.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #F0F0F0;
}

.list-title {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
}

.sort-options {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  background: none;
  border: 1px solid #E5E7EB;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  color: #666666;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.sort-btn.active {
  background-color: #4A90E2;
  border-color: #4A90E2;
  color: #FFFFFF;
}

.employee-list {
  max-height: 400px;
  overflow-y: auto;
}

.employee-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.employee-item:hover {
  background-color: #F8F9FA;
}

.employee-item:last-child {
  border-bottom: none;
}

.employee-info {
  flex: 1;
}

.employee-name {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.employee-role {
  color: #666666;
  font-size: 0.75rem;
}

.profit-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-right: 2rem;
}

.growth-rate,
.change-value {
  font-size: 0.75rem;
  font-weight: 500;
}

.growth-rate.positive,
.change-value.positive {
  color: #22C55E;
}

.growth-rate.negative,
.change-value.negative {
  color: #EF4444;
}

.detail-arrow {
  position: absolute;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.load-more-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 1rem;
  color: #4A90E2;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-btn:hover {
  background-color: #F8F9FA;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
  box-sizing: border-box;
}

.date-modal,
.indicator-modal {
  background-color: #FFFFFF;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 25rem;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #F4F4F4;
}

.modal-header h3 {
  margin: 0;
  color: #333333;
  font-size: 1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #999999;
  font-size: 1.25rem;
  cursor: pointer;
  width: 1.875rem;
  height: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #F4F4F4;
}

.date-options {
  padding: 1.25rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.date-option {
  background: none;
  border: 1px solid #F4F4F4;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  color: #333333;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 2.5rem;
}

.date-option:hover {
  border-color: #4A90E2;
  background-color: rgba(74, 144, 226, 0.1);
}

.date-option.active {
  border-color: #4A90E2;
  background-color: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
}

.indicator-content {
  padding: 1.25rem;
}

.indicator-item {
  margin-bottom: 1rem;
  color: #333333;
  font-size: 0.875rem;
  line-height: 1.5;
}

.indicator-item:last-child {
  margin-bottom: 0;
}

.indicator-item .highlight {
  color: #4A90E2;
  font-weight: 600;
}

.indicator-item ul {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.indicator-item li {
  margin-bottom: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-bar {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1rem;
    padding: 0 0.5rem;
  }
  
  .dimension-tabs {
    padding: 0 0.5rem;
  }
  
  .tab-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .main-content {
    padding: 0.75rem;
  }
  
  .data-cards,
  .core-data-cards,
  .type-grid,
  .profit-data-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    max-width: none;
  }
  
  .profit-metrics {
    margin-right: 1rem;
  }
  
  .employee-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .date-text {
    font-size: 0.75rem;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .compare-toggle {
    align-self: flex-end;
  }
  
  .sort-options {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
