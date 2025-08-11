<template>
  <div class="customer-return">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <button class="back-arrow" @click="goBack">
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="#333333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">客户销售/退货汇总表</h1>
      <button class="export-btn" @click="exportData">导出</button>
    </div>

    <!-- 日期与筛选栏 -->
    <div class="date-filter-bar">
      <div class="date-section">
        <div class="date-range" @click="showDatePicker">
          <span class="date-text">{{ currentDateRange }}</span>
        </div>
      </div>
      <div class="filter-section">
        <div class="filter-item" @click="showCustomerNameFilter">
          <span class="filter-label">客户名称</span>
          <span class="filter-value">{{ customerNameFilterDisplay }}</span>
          <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
        
        <div class="filter-item" @click="showCustomerTypeFilter">
          <span class="filter-label">客户类型</span>
          <span class="filter-value">{{ customerTypeFilterDisplay }}</span>
          <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
        
        <button class="advanced-filter-btn" @click="showFilterPanel">
          筛选
        </button>
      </div>
    </div>
    
    <!-- 统计信息条 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">总金额:</span>
        <span class="stat-value">¥{{ formatAmount(totalAmount) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">高风险:</span>
        <span class="stat-value danger">{{ highRiskCount }}户</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">客户数:</span>
        <span class="stat-value">{{ customerData.length }}户</span>
      </div>
    </div>

    <!-- 指标说明区 (流式布局，占比屏幕宽度100%) -->
    <div class="indicator-section">
      <!-- 指标说明 (左对齐：left: 2%) -->
      <button class="indicator-help" @click="showIndicatorModal">
        <span class="help-text">指标说明</span>
        <svg class="question-icon" width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="5" stroke="#999999" stroke-width="1" fill="none"/>
          <text x="6" y="8" text-anchor="middle" font-size="8" fill="#999999">?</text>
        </svg>
      </button>
      <!-- 数据范围 (右对齐：right: 2%) -->
      <span class="scope-indicator">所有</span>
    </div>

    <!-- 数据列表区 (流式布局，占比屏幕宽度100%) -->
    <div class="data-list-area">
      <!-- 表头行 (响应式分配宽度) -->
      <div class="table-header">
        <div class="header-cell customer-name" @click="sortBy('name')">
          客户名称
          <svg v-if="sortConfig.field === 'name'" class="sort-icon" width="12" height="12" viewBox="0 0 12 12">
            <path :d="sortConfig.direction === 'asc' ? 'M6 3L9 7H3L6 3Z' : 'M6 9L3 5H9L6 9Z'" fill="#999999"/>
          </svg>
        </div>
        <div class="header-cell order-amount" @click="sortBy('amount')">
          订单金额(元)
          <svg v-if="sortConfig.field === 'amount'" class="sort-icon" width="12" height="12" viewBox="0 0 12 12">
            <path :d="sortConfig.direction === 'asc' ? 'M6 3L9 7H3L6 3Z' : 'M6 9L3 5H9L6 9Z'" fill="#999999"/>
          </svg>
        </div>
        <div class="header-cell order-count" @click="sortBy('orderCount')">
          订单单数
          <svg v-if="sortConfig.field === 'orderCount'" class="sort-icon" width="12" height="12" viewBox="0 0 12 12">
            <path :d="sortConfig.direction === 'asc' ? 'M6 3L9 7H3L6 3Z' : 'M6 9L3 5H9L6 9Z'" fill="#999999"/>
          </svg>
        </div>
        <div class="header-cell trend-data">环比/风险</div>
      </div>
      
      <!-- 数据行 (响应式适配所有设备) -->
      <div class="data-rows">
        <div 
          v-for="customer in sortedCustomerData" 
          :key="customer.id"
          class="data-row"
          :class="{ 
            'high-risk': customer.riskLevel === 'high',
            'medium-risk': customer.riskLevel === 'medium'
          }"
          @click="viewCustomerDetail(customer.id)"
        >
          <!-- 客户名称 + 标签 -->
          <div class="row-cell customer-name">
            <div class="customer-info">
              <span class="customer-name-text">{{ customer.name }}</span>
              <div class="customer-tags">
                <span 
                  v-for="tag in customer.tags" 
                  :key="tag"
                  class="tag"
                  :class="{
                    'tag-warning': tag.includes('退货') || tag.includes('风险') || tag.includes('关注'),
                    'tag-success': tag.includes('优质') || tag.includes('增长') || tag.includes('稳定'),
                    'tag-info': tag.includes('新客户') || tag.includes('培养')
                  }"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- 订单金额 + 业务指标 -->
          <div class="row-cell order-amount">
            <div class="amount-container">
              <div class="main-amount" :class="{ negative: customer.amount < 0 }">
                ¥{{ formatAmount(customer.amount) }}
              </div>
              <div class="amount-breakdown">
                <div class="sales-detail">销售：¥{{ formatAmount(customer.salesAmount) }}</div>
                <div class="return-detail" v-if="customer.returnAmount < 0">
                  退货：¥{{ formatAmount(customer.returnAmount) }}
                </div>
              </div>
              <div class="business-indicators">
                <span class="return-rate" v-if="customer.returnRate > 0" 
                      :class="{ 'high-return': customer.returnRate > 20 }">
                  退率{{ customer.returnRate }}%
                </span>
              </div>
            </div>
          </div>
          
          <!-- 订单单数 -->
          <div class="row-cell order-count">
            <div class="order-info">
              <span class="count-number">{{ customer.orderCount }}单</span>
              <span class="item-count">{{ customer.itemCount }}品项</span>
              <div class="last-order-info">
                <span class="last-date">{{ customer.lastOrderDate }}</span>
                <span class="date-diff">{{ formatDateDiff(customer.lastOrderDate) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 环比增长 + 风险等级 -->
          <div class="row-cell trend-data">
            <div class="trend-container">
              <div class="growth-trend" v-if="customer.monthGrowth !== null">
                <span class="growth-label">环比</span>
                <span class="growth-value" :class="{
                  'positive': customer.monthGrowth > 0,
                  'negative': customer.monthGrowth < 0,
                  'neutral': customer.monthGrowth === 0
                }">
                  {{ customer.monthGrowth > 0 ? '+' : '' }}{{ customer.monthGrowth }}%
                </span>
              </div>
              <div class="growth-trend" v-else>
                <span class="growth-label">环比</span>
                <span class="growth-value neutral">新客户</span>
              </div>
              <div class="risk-level" :class="customer.riskLevel">
                <span class="risk-label">{{ getRiskText(customer.riskLevel) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 箭头图标 (右对齐：padding-right: 2%) -->
          <svg class="detail-arrow" width="16" height="16" viewBox="0 0 16 16">
            <path d="M6 4L10 8L6 12" stroke="#999999" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </div>
      
      <!-- 数据统计摘要 -->
      <div class="data-summary">
        <div class="summary-item">
          <span class="summary-label">总客户数:</span>
          <span class="summary-value">{{ customerData.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">总交易额:</span>
          <span class="summary-value">{{ formatAmount(totalAmount) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">高风险客户:</span>
          <span class="summary-value risk-highlight">{{ highRiskCount }}</span>
        </div>
      </div>
      
      <!-- 页面底部信息 -->
      <div class="page-footer">
        <div class="footer-info">
          <span class="update-time">最后更新: {{ new Date().toLocaleString() }}</span>
          <span class="data-source">数据来源: ERP系统</span>
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

    <!-- 筛选面板 -->
    <div v-if="showFilter" class="filter-overlay" @click="showFilter = false">
      <div class="filter-panel" @click.stop>
        <div class="filter-header">
          <h3>智能筛选</h3>
          <button class="close-btn" @click="showFilter = false">×</button>
        </div>
        
        <!-- 智能筛选 - 业务预设条件 -->
        <div class="filter-section">
          <h4 class="section-title">智能筛选</h4>
          <div class="smart-filter-options">
            <label 
              v-for="filter in smartFilters" 
              :key="filter.value" 
              class="smart-filter-item"
            >
              <input 
                type="checkbox" 
                v-model="currentFilters.smartFilters" 
                :value="filter.value"
              >
              <span class="filter-text">{{ filter.label }}</span>
              <span class="filter-count">({{ filter.count }})</span>
            </label>
          </div>
        </div>
        
        <!-- 客户类型筛选 -->
        <div class="filter-section">
          <h4 class="section-title">客户类型</h4>
          <div class="filter-options">
            <label 
              v-for="type in customerTypes" 
              :key="type.value" 
              class="option-item"
            >
              <input 
                type="checkbox" 
                v-model="currentFilters.customerTypes" 
                :value="type.value"
              >
              <span class="option-text">{{ type.label }}</span>
              <span class="option-count">({{ type.count }})</span>
            </label>
          </div>
        </div>
        
        <!-- 金额区间筛选 -->
        <div class="filter-section">
          <h4 class="section-title">订单金额区间</h4>
          <div class="amount-range">
            <input 
              type="number" 
              v-model="currentFilters.amountRange.min" 
              placeholder="最小金额" 
              class="amount-input"
            >
            <span class="range-separator">-</span>
            <input 
              type="number" 
              v-model="currentFilters.amountRange.max" 
              placeholder="最大金额" 
              class="amount-input"
            >
          </div>
        </div>
        
        <!-- 客户搜索 -->
        <div class="filter-section">
          <h4 class="section-title">客户搜索</h4>
          <input 
            type="text" 
            v-model="currentFilters.searchKeyword" 
            placeholder="输入客户名称..." 
            class="search-input"
          >
        </div>
        
        <div class="filter-actions">
          <button class="reset-btn" @click="resetAllFilters">重置</button>
          <button class="confirm-btn" @click="applyAllFilters">应用筛选</button>
        </div>
      </div>
    </div>

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicator" class="modal-overlay" @click="showIndicator = false">
      <div class="indicator-modal" @click.stop>
        <div class="modal-header">
          <h3>指标说明</h3>
          <button class="close-btn" @click="showIndicator = false">×</button>
        </div>
        <div class="indicator-content">
          <div class="indicator-item">
            <strong>订单金额：</strong>指定时间段内该客户所有订单的<span class="highlight">净交易金额</span>，计算公式：销售金额 - 退货抵扣金额
          </div>
          <div class="indicator-item">
            <strong>订单单数：</strong>该客户在查询期间的订单总数量，每个订单编号计为一单，<span class="highlight">不包含已取消订单</span>
          </div>
          <div class="indicator-item">
            <strong>环比增长：</strong>与上月同期对比的增长率，正值表示增长，负值表示下降，<span class="highlight">新客户显示"新客户"</span>
          </div>
          <div class="indicator-item">
            <strong>风险等级：</strong>基于退货率、交易频次、金额波动等维度评估，<span class="risk-high">高风险</span>需重点关注，<span class="risk-medium">中风险</span>需定期跟进
          </div>
          <div class="indicator-item">
            <strong>统计规则：</strong>
            <ul>
              <li>跨月订单按<span class="highlight">下单时间</span>归属</li>
              <li>退货订单按<span class="highlight">退货确认时间</span>计算</li>
              <li>已取消订单<span class="highlight">不纳入</span>任何统计</li>
              <li>数据更新频率：<span class="highlight">每小时</span>同步一次</li>
            </ul>
          </div>
          <div class="indicator-item">
            <strong>业务价值：</strong>
            <ul>
              <li><span class="highlight">快速识别</span>异常客户（高退货、零增长）</li>
              <li><span class="highlight">支持穿透</span>查询到订单、商品明细</li>
              <li><span class="highlight">辅助决策</span>客户分级、风险管控</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerReturn',
  data() {
    return {
      currentDateRange: '06-01～06-20',
      showDateModal: false,
      showFilter: false,
      showIndicator: false,
      selectedDateOption: 'current',
      selectedTypes: [],
      
      // 新增筛选状态
      customerNameFilter: '',
      customerTypeFilter: '',
      
      amountRange: {
        min: '',
        max: ''
      },
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
      // 智能筛选条件 - 业务预设
      smartFilters: [
        { value: 'high_return', label: '高退货客户(退货率>30%)', count: 3 },
        { value: 'no_transaction_7d', label: '近7天无交易', count: 8 },
        { value: 'big_customer', label: '大客户(月交易>5万)', count: 5 },
        { value: 'new_customer', label: '新客户(首次交易<30天)', count: 12 },
        { value: 'risk_customer', label: '风险客户(连续退货)', count: 2 }
      ],
      customerTypes: [
        { value: 'A', label: 'A类客户(核心大客户)', count: 15 },
        { value: 'B', label: 'B类客户(稳定客户)', count: 42 },
        { value: 'C', label: 'C类客户(普通客户)', count: 68 },
        { value: 'new', label: '新客户', count: 23 },
        { value: 'risk', label: '风险客户', count: 5 }
      ],
      // 真实业务数据 - 支持完整的业务分析
      customerData: [
        {
          id: 1,
          name: '赤峰调味',
          amount: 27636.00,
          salesAmount: 30000.00,      // 销售金额
          returnAmount: -2364.00,     // 退货抵扣
          orderCount: 6,
          itemCount: 23,
          lastOrderDate: '2025-06-18',
          returnRate: 7.9,            // 退货率
          monthGrowth: 15.2,          // 环比增长
          riskLevel: 'low',           // 风险等级
          customerType: 'A',
          tags: ['核心客户', '稳定增长']
        },
        {
          id: 2,
          name: '张三商贸',
          amount: 45680.00,
          salesAmount: 52000.00,
          returnAmount: -6320.00,
          orderCount: 12,
          itemCount: 67,
          lastOrderDate: '2025-06-19',
          returnRate: 12.2,
          monthGrowth: -5.8,          // 负增长
          riskLevel: 'medium',
          customerType: 'A',
          tags: ['大客户', '需关注']
        },
        {
          id: 3,
          name: '李四超市',
          amount: 32150.00,
          salesAmount: 35000.00,
          returnAmount: -2850.00,
          orderCount: 8,
          itemCount: 45,
          lastOrderDate: '2025-06-17',
          returnRate: 8.1,
          monthGrowth: 8.7,
          riskLevel: 'low',
          customerType: 'B',
          tags: ['稳定客户']
        },
        {
          id: 4,
          name: '王五批发',
          amount: 28900.00,
          salesAmount: 42000.00,
          returnAmount: -13100.00,     // 高退货
          orderCount: 15,
          itemCount: 1200,
          lastOrderDate: '2025-06-20',
          returnRate: 31.2,            // 高退货率
          riskLevel: 'high',           // 高风险
          customerType: 'B',
          tags: ['高退货', '需重点关注']
        },
        {
          id: 5,
          name: '赵六贸易',
          amount: 67200.00,
          salesAmount: 69800.00,
          returnAmount: -2600.00,
          orderCount: 9,
          itemCount: 34,
          lastOrderDate: '2025-06-19',
          returnRate: 3.7,
          monthGrowth: 22.5,
          riskLevel: 'low',
          customerType: 'A',
          tags: ['优质客户', '快速增长']
        },
        {
          id: 6,
          name: '新兴超市',
          amount: 8500.00,
          salesAmount: 8500.00,
          returnAmount: 0,
          orderCount: 2,
          itemCount: 15,
          lastOrderDate: '2025-06-15',
          returnRate: 0,
          monthGrowth: null,           // 新客户无环比
          riskLevel: 'low',
          customerType: 'new',
          tags: ['新客户', '待培养']
        }
      ],
      // 当前筛选状态
      currentFilters: {
        dateRange: '',
        customerTypes: [],
        smartFilters: [],
        amountRange: { min: '', max: '' },
        searchKeyword: ''
      },
      // 排序状态
      sortConfig: {
        field: '',
        direction: 'desc' // asc | desc
      }
    }
  },
  
  computed: {
    // 客户名称筛选显示文本
    customerNameFilterDisplay() {
      return this.customerNameFilter || '全部客户'
    },
    
    // 客户类型筛选显示文本
    customerTypeFilterDisplay() {
      const typeMap = {
        'A': 'A类客户',
        'B': 'B类客户', 
        'C': 'C类客户',
        'new': '新客户',
        'risk': '风险客户'
      }
      return this.customerTypeFilter ? typeMap[this.customerTypeFilter] : '全部类型'
    },
    
    // 排序后的客户数据
    sortedCustomerData() {
      let data = [...this.customerData]
      
      if (this.sortConfig.field) {
        data.sort((a, b) => {
          let aVal = a[this.sortConfig.field]
          let bVal = b[this.sortConfig.field]
          
          // 特殊处理字符串排序
          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase()
            bVal = bVal.toLowerCase()
          }
          
          if (this.sortConfig.direction === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
      }
      
      return data
    },
    
    // 总交易金额
    totalAmount() {
      return this.customerData.reduce((sum, customer) => sum + customer.amount, 0)
    },
    
    // 高风险客户数量
    highRiskCount() {
      return this.customerData.filter(customer => customer.riskLevel === 'high').length
    }
  },
  
  methods: {
    // 格式化金额显示
    formatAmount(amount) {
      if (amount == null || amount === '') return '0.00'
      
      const num = parseFloat(amount)
      if (isNaN(num)) return '0.00'
      
      // 转换为正数显示，负号在调用时单独处理
      const absNum = Math.abs(num)
      
      // 添加千位分隔符
      return absNum.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    // 排序功能
    sortBy(field) {
      if (this.sortConfig.field === field) {
        // 切换排序方向
        this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
      } else {
        // 新字段，默认降序
        this.sortConfig.field = field
        this.sortConfig.direction = 'desc'
      }
    },
    
    // 获取风险等级文本
    getRiskText(level) {
      const riskMap = {
        'high': '高风险',
        'medium': '中风险',
        'low': '低风险'
      }
      return riskMap[level] || '未知'
    },
    
    // 格式化日期差异
    formatDateDiff(dateStr) {
      const date = new Date(dateStr)
      const now = new Date()
      const diffTime = now - date
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return '今天'
      if (diffDays === 1) return '昨天'
      if (diffDays <= 7) return `${diffDays}天前`
      if (diffDays <= 30) return `${Math.floor(diffDays / 7)}周前`
      return `${Math.floor(diffDays / 30)}月前`
    },
    
    // 重置所有筛选条件
    resetAllFilters() {
      this.currentFilters = {
        dateRange: '',
        customerTypes: [],
        smartFilters: [],
        amountRange: { min: '', max: '' },
        searchKeyword: ''
      }
    },
    
    // 应用所有筛选条件
    applyAllFilters() {
      // 实际项目中这里会调用API重新获取数据
      console.log('应用筛选条件:', this.currentFilters)
      
      // 模拟筛选逻辑（前端过滤，实际应该后端处理）
      let filteredData = [...this.customerData]
      
      // 按客户类型筛选
      if (this.currentFilters.customerTypes.length > 0) {
        filteredData = filteredData.filter(customer => 
          this.currentFilters.customerTypes.includes(customer.customerType)
        )
      }
      
      // 按智能筛选条件
      if (this.currentFilters.smartFilters.includes('high_return')) {
        filteredData = filteredData.filter(customer => customer.returnRate > 30)
      }
      if (this.currentFilters.smartFilters.includes('big_customer')) {
        filteredData = filteredData.filter(customer => customer.amount > 50000)
      }
      if (this.currentFilters.smartFilters.includes('risk_customer')) {
        filteredData = filteredData.filter(customer => customer.riskLevel === 'high')
      }
      
      // 按金额区间筛选
      if (this.currentFilters.amountRange.min) {
        filteredData = filteredData.filter(customer => 
          customer.amount >= parseFloat(this.currentFilters.amountRange.min)
        )
      }
      if (this.currentFilters.amountRange.max) {
        filteredData = filteredData.filter(customer => 
          customer.amount <= parseFloat(this.currentFilters.amountRange.max)
        )
      }
      
      // 按客户名称搜索
      if (this.currentFilters.searchKeyword) {
        const keyword = this.currentFilters.searchKeyword.toLowerCase()
        filteredData = filteredData.filter(customer => 
          customer.name.toLowerCase().includes(keyword)
        )
      }
      
      // 更新显示数据（实际项目中会重新赋值给customerData）
      console.log(`筛选后数据：${filteredData.length}条`)
      
      this.showFilter = false
      
      // 显示筛选结果提示
      this.$nextTick(() => {
        alert(`筛选完成，共找到 ${filteredData.length} 个客户`)
      })
    },
    
    // 导出数据
    exportData() {
      // 实际项目中会调用导出API
      console.log('导出数据功能')
      alert('导出功能开发中...')
    },
    
    // 查看客户详情
    viewCustomerDetail(customerId) {
      const customer = this.customerData.find(c => c.id === customerId)
      if (customer) {
        console.log('查看客户详情:', customer.name)
        // 实际项目中跳转到详情页
        alert(`查看客户详情：${customer.name}`)
      }
    },
    
    // 查看金额详情
    viewAmountDetail(customerId) {
      const customer = this.customerData.find(c => c.id === customerId)
      if (customer) {
        console.log('查看金额详情:', customer)
        alert(`${customer.name} 金额详情：\n销售：¥${this.formatAmount(customer.salesAmount)}\n退货：¥${this.formatAmount(customer.returnAmount)}\n净额：¥${this.formatAmount(customer.amount)}`)
      }
    },
    
    goBack() {
      this.$router.go(-1)
    },
    showDatePicker() {
      this.showDateModal = true
    },
    selectDateOption(value) {
      this.selectedDateOption = value
      // 根据选择更新日期范围
      const dateMap = {
        'today': '08-11～08-11',
        'yesterday': '08-10～08-10', 
        'current': '08-01～08-11',
        'last': '07-01～07-31',
        'last7': '08-05～08-11',
        'last30': '07-12～08-11'
      }
      this.currentDateRange = dateMap[value] || '06-01～06-20'
      this.showDateModal = false
    },
    showFilterPanel() {
      this.showFilter = true
    },
    
    // 打开客户名称筛选
    showCustomerNameFilter() {
      const name = prompt('请输入客户名称关键词：', this.customerNameFilter)
      if (name !== null) {
        this.customerNameFilter = name
      }
    },
    
    // 打开客户类型筛选
    showCustomerTypeFilter() {
      // 简化实现，实际项目中可以实现更复杂的选择器
      const types = ['', 'A', 'B', 'C', 'new', 'risk']
      const typeLabels = ['全部类型', 'A类客户', 'B类客户', 'C类客户', '新客户', '风险客户']
      
      let message = '请选择客户类型：\n'
      types.forEach((type, index) => {
        message += `${index}. ${typeLabels[index]}\n`
      })
      
      const selection = prompt(message + '\n请输入对应数字：')
      if (selection !== null && !isNaN(selection)) {
        const index = parseInt(selection)
        if (index >= 0 && index < types.length) {
          this.customerTypeFilter = types[index]
        }
      }
    },
    
    showIndicatorModal() {
      this.showIndicator = true
    },
    resetFilter() {
      this.selectedTypes = []
      this.amountRange = { min: '', max: '' }
    },
    applyFilter() {
      // 应用筛选逻辑
      console.log('筛选条件:', {
        types: this.selectedTypes,
        amountRange: this.amountRange
      })
      this.showFilter = false
    }
  }
}
</script>

<style scoped>
/* 整体页面 - 纵向流式布局适配所有设备 */
.customer-return {
  min-height: 100vh;
  background-color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏 - 第一行：标题 + 导出 */
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

/* 日期与筛选栏 - 第二行：日期 + 筛选 */
.date-filter-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
  box-sizing: border-box;
}

.date-section {
  display: flex;
  align-items: center;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-section .filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 80px;
}

.filter-section .filter-item:hover {
  background-color: #e9ecef;
}

.filter-section .filter-label {
  color: #333333;
  font-size: 13px;
  font-weight: 500;
}

.filter-section .filter-value {
  color: #666666;
  font-size: 13px;
  margin-left: auto;
}

.filter-section .filter-arrow {
  stroke: #999999;
  stroke-width: 1.5;
  fill: none;
  transition: transform 0.3s ease;
}

.filter-section .advanced-filter-btn {
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.filter-section .advanced-filter-btn:hover {
  background-color: #0056d6;
}

/* 返回按钮 */
.back-arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  touch-action: manipulation;
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

/* 页面标题 */
.page-title {
  color: #333333;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

/* 日期筛选 */
.date-range {
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: 1px solid #E5E7EB;
  background-color: #F9FAFB;
  touch-action: manipulation;
}

.date-range:hover {
  background-color: #F3F4F6;
  border-color: #D1D5DB;
}

.date-text {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

/* 按钮样式统一 */
.export-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  touch-action: manipulation;
  background: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

.export-btn:hover {
  background: #2563EB;
  border-color: #2563EB;
}

.funnel-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

/* 统计信息条 */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border-bottom: 1px solid #E2E8F0;
}

/* 统计信息项样式 */
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
}

.stat-label {
  color: #6B7280;
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #111827;
}

.stat-value.danger {
  color: #DC2626;
  background: #FEF2F2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #FECACA;
}

/* 数据统计摘要样式 */
.data-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-top: 1px solid #E2E8F0;
  margin-top: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.summary-label {
  color: #64748B;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.summary-value {
  color: #0F172A;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}

.summary-value.risk-highlight {
  color: #DC2626;
}

/* 页面底部信息 */
.page-footer {
  padding: 1rem;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  margin-top: 0.5rem;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #64748B;
}

.update-time,
.data-source {
  font-weight: 500;
}

/* 指标说明区 (流式布局，占比屏幕宽度100%) */
.indicator-section {
  width: 100%;
  min-height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2%; /* 左对齐：left: 2% 和 右对齐：right: 2% */
  background-color: #FFFFFF;
  border-bottom: 1px solid #F4F4F4;
  box-sizing: border-box;
}

/* 指标说明 (左对齐：left: 2%) */
.indicator-help {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  min-height: 1.5rem;
  /* 点击热区优化 */
  touch-action: manipulation;
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

/* 数据范围 (右对齐：right: 2%) */
.scope-indicator {
  color: #333333;
  font-size: 0.75rem;
  white-space: nowrap;
}

/* 数据列表区 (流式布局，占比屏幕宽度100%) */
.data-list-area {
  flex: 1;
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
}

/* 表头行 (响应式分配宽度) */
.table-header {
  width: 100%;
  background-color: #F4F4F4;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #F4F4F4;
  box-sizing: border-box;
}

.header-cell {
  color: #999999;
  font-size: 0.875rem;
  font-weight: normal;
  text-align: center;
}

/* 字段宽度分配 (flex比例) */
.header-cell.customer-name,
.row-cell.customer-name {
  flex: 3; /* 客户名称适中宽度 */
  text-align: left;
  padding-left: 0.5rem;
  padding-right: 0.5rem; /* 统一边距 */
}

.header-cell.order-amount,
.row-cell.order-amount {
  flex: 2.5; /* 订单金额稍宽，显示完整金额 */
  text-align: center;
  padding: 0 0.5rem; /* 统一边距 */
}

.header-cell.order-count,
.row-cell.order-count {
  flex: 2.2; /* 订单单数稍宽，避免内容换行 */
  text-align: center;
  padding: 0 0.5rem; /* 统一边距 */
}

.header-cell.trend-data,
.row-cell.trend-data {
  flex: 2.3; /* 环比/风险适中，显示完整信息 */
  text-align: center;
  padding: 0 0.5rem; /* 统一边距 */
}

/* 数据行 (响应式适配所有设备) */
.data-rows {
  flex: 1;
  width: 100%;
  background-color: #FFFFFF;
}

.data-row {
  width: 100%;
  min-height: 3.125rem; /* 50px转换为rem */
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #F4F4F4;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  box-sizing: border-box;
  /* 点击热区优化 */
  touch-action: manipulation;
}

.data-row:hover {
  background-color: #F4F4F4;
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.data-row.high-risk {
  border-left: 3px solid #FF4757;
  background-color: #FFF5F5;
}

.data-row.medium-risk {
  border-left: 3px solid #FF9500;
  background-color: #FFFBF0;
}

.row-cell {
  color: #333333;
  font-size: 0.875rem;
  text-align: center;
}

/* 响应式字段宽度分配 */
.row-cell.customer-name {
  flex: 3; /* 客户名称适中宽度 */
  text-align: left;
  padding-left: 0.5rem;
  padding-right: 0.5rem; /* 统一边距 */
  font-weight: 500;
  /* 长文本适配 */
  word-break: break-word;
  overflow: hidden;
}

.row-cell.order-amount {
  flex: 2.5; /* 订单金额稍宽 */
  text-align: center;
  padding: 0 0.5rem; /* 统一边距 */
  /* 带千位分隔符 */
  font-weight: 500;
}

.row-cell.order-count {
  flex: 2.2; /* 订单单数稍宽，避免内容换行 */
  text-align: center;
  padding: 0 0.5rem; /* 统一边距 */
}

.row-cell.trend-data {
  flex: 2.3; /* 环比/风险适中 */
  text-align: center;
  padding: 0 0.5rem; /* 统一边距 */
}

/* 箭头图标 (右侧固定位置) */
.detail-arrow {
  position: absolute;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  pointer-events: none; /* 避免影响行点击 */
}

/* 业务指标样式增强 */
.amount-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.amount-breakdown {
  display: flex;
  gap: 0.375rem;
  font-size: 0.6875rem;
  color: #666666;
}

.sales-detail {
  color: #22C55E;
}

.return-detail {
  color: #EF4444;
}

.business-indicators {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.125rem;
}

.return-rate {
  background: #E5F3FF;
  color: #1E40AF;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 500;
}

.return-rate.high-return {
  background: #FEE2E2;
  color: #DC2626;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  min-width: 80px; /* 确保最小宽度，避免内容挤压 */
}

.count-number {
  font-weight: 600;
  color: #111827;
  white-space: nowrap; /* 防止数字换行 */
}

.item-count {
  font-size: 0.75rem;
  color: #6B7280;
  white-space: nowrap; /* 防止品项信息换行 */
}

.last-order-info {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  margin-top: 0.125rem;
  align-items: center;
  min-width: 100%; /* 确保日期信息有足够空间 */
}

.last-date {
  font-size: 0.6875rem;
  color: #374151;
  white-space: nowrap; /* 防止日期换行 */
}

.date-diff {
  font-size: 0.625rem;
  color: #9CA3AF;
  white-space: nowrap; /* 防止时间差换行 */
}

.trend-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.growth-trend {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.growth-label {
  font-size: 0.625rem;
  color: #6B7280;
  min-width: 1.5rem;
}

.growth-value {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.25rem;
}

.growth-value.positive {
  background: #DCFCE7;
  color: #16A34A;
}

.growth-value.negative {
  background: #FEE2E2;
  color: #DC2626;
}

.growth-value.neutral {
  background: #F3F4F6;
  color: #6B7280;
}

.risk-level {
  display: flex;
  align-items: center;
}

.risk-label {
  font-size: 0.625rem;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.risk-level.high .risk-label {
  background: #FEE2E2;
  color: #DC2626;
}

.risk-level.medium .risk-label {
  background: #FEF3C7;
  color: #D97706;
}

.risk-level.low .risk-label {
  background: #DCFCE7;
  color: #16A34A;
}

/* 客户标签样式增强 */
.customer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.125rem;
  margin-top: 0.125rem;
}

.tag {
  font-size: 0.625rem;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
  white-space: nowrap;
}

.tag-warning {
  background: #FEE2E2;
  color: #DC2626;
}

.tag-success {
  background: #DCFCE7;
  color: #16A34A;
}

.tag-info {
  background: #DBEAFE;
  color: #1D4ED8;
}

/* 排序图标样式 */
.header-cell {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s ease;
}

.header-cell:hover {
  color: #4A90E2;
}

.sort-icon {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.header-cell:hover .sort-icon {
  opacity: 1;
}

/* 响应式设计逻辑 */

/* 手机端 (320-480px 宽) */
@media (max-width: 480px) {
  .header-bar {
    padding: 0.5rem;
    min-height: 3rem;
  }
  
  .date-filter-bar {
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .date-section,
  .filter-section {
    justify-content: center;
  }
  
  .filter-section {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-section .filter-item {
    flex: 1;
    min-width: 70px;
  }
  
  .page-title {
    font-size: 1rem;
    padding: 0 0.5rem;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .stat-item {
    font-size: 0.75rem;
  }
  
  .data-summary {
    flex-direction: column;
    gap: 1rem;
    padding: 0.75rem;
  }
  
  .page-footer {
    padding: 0.75rem;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
  
  .export-btn,
  .filter-text {
    font-size: 0.75rem;
  }
  
  .date-text {
    font-size: 0.75rem;
  }
  
  /* 字段宽度自动压缩，保证"客户名称"显示完整 */
  .header-cell.customer-name,
  .row-cell.customer-name {
    flex: 2.5; /* 手机端适度压缩 */
    padding: 0 0.3rem; /* 手机端统一边距 */
  }
  
  .header-cell.order-amount,
  .row-cell.order-amount {
    flex: 2; /* 订单金额压缩 */
    padding: 0 0.3rem;
  }
  
  .header-cell.order-count,
  .row-cell.order-count {
    flex: 1.8; /* 订单单数适度压缩，保持可读性 */
    padding: 0 0.25rem;
  }
  
  .header-cell.trend-data,
  .row-cell.trend-data {
    flex: 1.7; /* 环比/风险适度压缩 */
    padding: 0 0.25rem;
  }
  
  .header-cell,
  .row-cell {
    font-size: 0.75rem;
  }
  
  .data-row {
    min-height: 2.5rem;
  }
  
  /* 点击热区增大 */
  .back-arrow,
  .export-btn,
  .filter-btn {
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
}

/* 平板端 (768-1024px 宽) */
@media (min-width: 768px) and (max-width: 1024px) {
  .header-bar {
    padding: 1rem 3%;
  }
  
  .date-filter-bar {
    padding: 1rem 3%;
  }
  
  .page-title {
    font-size: 1.125rem;
  }
  
  .stats-bar {
    gap: 1.5rem;
  }
  
  /* 字段宽度按比例扩展，显示更多数据列 */
  .header-cell.customer-name,
  .row-cell.customer-name {
    flex: 3;
    padding: 0 0.5rem; /* 平板端统一边距 */
  }
  
  .header-cell.order-amount,
  .row-cell.order-amount {
    flex: 2.5;
    padding: 0 0.5rem;
  }
  
  .header-cell.order-count,
  .row-cell.order-count {
    flex: 2.2;
    padding: 0 0.5rem;
  }
  
  .header-cell.trend-data,
  .row-cell.trend-data {
    flex: 2.3;
    padding: 0 0.5rem;
  }
  
  .data-row {
    min-height: 3.5rem;
    padding: 0.75rem 3%;
  }
  
  .header-cell,
  .row-cell {
    font-size: 1rem;
  }
}

/* 桌面端 (1024px以上) */
@media (min-width: 1024px) {
  .header-bar {
    padding: 1rem 5%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .date-filter-bar {
    padding: 1rem 5%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .indicator-section {
    padding: 0.75rem 5%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .data-list-area {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .table-header {
    padding: 0.75rem 5%;
  }
  
  .data-row {
    padding: 0.75rem 5%;
  }
}

/* 弹窗样式 (自动居中显示，适配不同设备尺寸) */
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
  font-weight: bold;
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

/* 筛选面板 (响应式侧滑) */
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.filter-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(18.75rem, 80vw); /* 响应式宽度 */
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  box-shadow: -0.25rem 0 0.75rem rgba(0, 0, 0, 0.1);
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .customer-return {
    background-color: #1a1a1a;
    color: #ffffff;
  }
  
  .top-operation-bar,
  .indicator-section,
  .data-list-area {
    background-color: #2d2d2d;
    border-color: #404040;
  }
  
  .table-header {
    background-color: #404040;
  }
  
  .page-title,
  .scope-indicator {
    color: #ffffff;
  }
  
  .row-cell {
    color: #ffffff;
  }
}
</style>

