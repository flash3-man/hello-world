<template>
  <div class="employee-report">
    <!-- 标题栏 (Top Bar) -->
    <div class="top-bar">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="page-title">员工业绩汇总表</h1>
      </div>
      <button class="export-btn" @click="exportData">
        <svg class="export-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 10L12 6H9V1H7V6H4L8 10Z"/>
          <path d="M1 14H15V12H1V14Z"/>
        </svg>
        <span class="export-text">导出</span>
      </button>
    </div>

    <!-- 日期快速查询条件 (Date Filter Bar) -->
    <div class="date-filter-section">
      <div class="date-trigger" @click="toggleDatePanel">
        <span class="current-date">{{ currentDateRange }}</span>
        <svg class="dropdown-arrow" :class="{ expanded: showDatePanel }" width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1"/>
        </svg>
      </div>
      
      <!-- 日期配置面板 -->
      <div v-if="showDatePanel" class="date-config-panel">
        <div class="date-tabs">
          <button 
            v-for="tab in dateTabs" 
            :key="tab.key"
            :class="['date-tab', { active: activeTab === tab.key }]"
            @click="selectDateTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <!-- 快捷选项内容 -->
        <div v-if="activeTab === 'quick'" class="quick-options">
          <div 
            v-for="option in quickDateOptions" 
            :key="option.key"
            :class="['quick-option', { selected: selectedQuickOption === option.key }]"
            @click="selectQuickDate(option.key)"
          >
            <span class="option-label">{{ option.label }}</span>
            <span class="option-date">{{ option.dateRange }}</span>
            <svg v-if="selectedQuickOption === option.key" class="check-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M13.5 3L6 10.5L2.5 7"/>
            </svg>
          </div>
        </div>
        
        <!-- 按日选择内容 -->
        <div v-if="activeTab === 'daily'" class="daily-picker">
          <div class="calendar-placeholder">
            <span>日历控件区域</span>
            <span class="calendar-note">支持选择起始和结束日期</span>
          </div>
        </div>
        
        <!-- 按月选择内容 -->
        <div v-if="activeTab === 'monthly'" class="monthly-picker">
          <div class="month-grid">
            <div 
              v-for="month in monthOptions" 
              :key="month.value"
              :class="['month-option', { selected: selectedMonth === month.value }]"
              @click="selectMonth(month.value)"
            >
              {{ month.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- 筛选区 (Filter Panel) -->
    <div class="filter-section">
      <div class="filter-item" v-for="filter in filterOptions" :key="filter.key" @click="openFilterSelector(filter.key)">
        <span class="filter-label">{{ filter.label }}</span>
        <span v-if="getSelectedFilterCount(filter.key) > 0" class="filter-count">
          ({{ getSelectedFilterCount(filter.key) }})
        </span>
        <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1"/>
        </svg>
      </div>
      
      <div class="filter-actions">
        <button class="reset-btn" @click="resetFilters">重置</button>
        <button class="confirm-btn" @click="applyFilters">确定</button>
      </div>
    </div>

    <!-- 数据展示区 (Data List) -->
    <div class="data-section">
      <!-- 指标说明 -->
      <div class="indicators-info" @click="showIndicatorTooltip">
        <span class="info-text">指标说明</span>
        <svg class="info-icon" width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor"/>
          <text x="7" y="10" text-anchor="middle" font-size="10">?</text>
        </svg>
      </div>
      
      <!-- 业绩表头 -->
      <div class="data-header">
        <div class="header-cell employee-name-col">员工名称</div>
        <div class="header-cell order-amount-col">订单金额（元）</div>
        <div class="header-cell order-count-col">订单单数</div>
        <div class="header-cell customer-count-col">订单客户数</div>
      </div>
      
      <!-- 业绩数据行 -->
      <div class="data-body">
        <div 
          v-for="(employee, index) in employeeData" 
          :key="employee.id"
          :class="['data-row', { 'even-row': index % 2 === 1 }]"
          @click="viewEmployeeDetail(employee)"
        >
          <div class="data-cell employee-name-col">{{ employee.name }}</div>
          <div class="data-cell order-amount-col">{{ employee.orderAmount }}</div>
          <div class="data-cell order-count-col">{{ employee.orderCount }}</div>
          <div class="data-cell customer-count-col">{{ employee.customerCount }}</div>
        </div>
      </div>
    </div>

    <!-- Tooltip 弹窗 -->
    <div v-if="showTooltip" class="tooltip-overlay" @click="hideTooltip">
      <div class="tooltip-content" @click.stop>
        <div class="tooltip-header">
          <h3 class="tooltip-title">指标说明</h3>
          <button class="tooltip-close" @click="hideTooltip">×</button>
        </div>
        <div class="tooltip-body">
          <div class="tooltip-item">
            <strong>订单金额：</strong>员工销售总额，包含所有已确认订单金额
          </div>
          <div class="tooltip-item">
            <strong>订单单数：</strong>员工完成的订单总数量
          </div>
          <div class="tooltip-item">
            <strong>订单客户数：</strong>员工服务的不重复客户数量统计
          </div>
          <div class="tooltip-item">
            <strong>统计规则：</strong>数据统计不包含退款订单，按订单创建时间计算
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选器弹窗 -->
    <div v-if="showFilterModal" class="filter-modal-overlay" @click="hideFilterModal">
      <div class="filter-modal-content" @click.stop>
        <div class="filter-modal-header">
          <h3 class="filter-modal-title">{{ currentFilterTitle }}</h3>
          <button class="filter-modal-close" @click="hideFilterModal">×</button>
        </div>
        <div class="filter-modal-body">
          <div class="filter-search">
            <input v-model="filterSearchQuery" placeholder="搜索..." class="filter-search-input" />
          </div>
          <div class="filter-options-list">
            <div 
              v-for="option in currentFilterOptions" 
              :key="option.value"
              :class="['filter-option-item', { selected: option.selected }]"
              @click="toggleFilterOption(option)"
            >
              <span class="option-label">{{ option.label }}</span>
              <svg v-if="option.selected" class="option-check" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 3L6 10.5L2.5 7"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="filter-modal-footer">
          <button class="filter-cancel-btn" @click="hideFilterModal">取消</button>
          <button class="filter-confirm-btn" @click="confirmFilterSelection">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeReport',
  data() {
    return {
      // 日期相关数据
      currentDateRange: '06-01 ~ 06-20',
      showDatePanel: false,
      activeTab: 'quick',
      selectedQuickOption: 'current-month',
      selectedMonth: '',
      
      // 日期选项配置
      dateTabs: [
        { key: 'quick', label: '快捷选择' },
        { key: 'daily', label: '按日选择' },
        { key: 'monthly', label: '按月选择' }
      ],
      
      // 快捷日期选项
      quickDateOptions: [
        { key: 'today', label: '今日', dateRange: '06-23' },
        { key: 'current-month', label: '本月', dateRange: '06-01 ~ 06-23' },
        { key: 'last-month', label: '上月', dateRange: '2025-05' },
        { key: 'last-90-days', label: '近90天', dateRange: '03-26 ~ 06-23' },
        { key: 'last-30-days', label: '近30天', dateRange: '05-24 ~ 06-23' },
        { key: 'current-quarter', label: '本季度', dateRange: '04-01 ~ 06-23' }
      ],
      
      // 月份选项
      monthOptions: [
        { value: '2025-01', label: '2025年1月' },
        { value: '2025-02', label: '2025年2月' },
        { value: '2025-03', label: '2025年3月' },
        { value: '2025-04', label: '2025年4月' },
        { value: '2025-05', label: '2025年5月' },
        { value: '2025-06', label: '2025年6月' },
        { value: '2025-07', label: '2025年7月' },
        { value: '2025-08', label: '2025年8月' }
      ],
      
      // 筛选相关数据
      filterOptions: [
        { key: 'customer', label: '客户' },
        { key: 'region', label: '片区' },
        { key: 'channel', label: '渠道' },
        { key: 'brand', label: '品牌' },
        { key: 'product', label: '商品' },
        { key: 'employee', label: '员工' },
        { key: 'category', label: '分类' }
      ],
      
      // 筛选器状态
      showFilterModal: false,
      currentFilterKey: '',
      currentFilterTitle: '',
      filterSearchQuery: '',
      selectedFilters: {
        customer: [],
        region: [],
        channel: [],
        brand: [],
        product: [],
        employee: [],
        category: []
      },
      
      // 筛选选项数据（模拟数据）
      filterOptionsData: {
        customer: [
          { value: 'customer1', label: '客户A', selected: false },
          { value: 'customer2', label: '客户B', selected: false },
          { value: 'customer3', label: '客户C', selected: false }
        ],
        region: [
          { value: 'region1', label: '华北区', selected: false },
          { value: 'region2', label: '华南区', selected: false },
          { value: 'region3', label: '西南区', selected: false }
        ],
        channel: [
          { value: 'channel1', label: '线上渠道', selected: false },
          { value: 'channel2', label: '线下门店', selected: false },
          { value: 'channel3', label: '批发渠道', selected: false }
        ],
        brand: [
          { value: 'brand1', label: '品牌A', selected: false },
          { value: 'brand2', label: '品牌B', selected: false },
          { value: 'brand3', label: '品牌C', selected: false }
        ],
        product: [
          { value: 'product1', label: '商品A', selected: false },
          { value: 'product2', label: '商品B', selected: false },
          { value: 'product3', label: '商品C', selected: false }
        ],
        employee: [
          { value: 'employee1', label: '王鹃', selected: false },
          { value: 'employee2', label: 'tt', selected: false },
          { value: 'employee3', label: '李明', selected: false }
        ],
        category: [
          { value: 'category1', label: '分类A', selected: false },
          { value: 'category2', label: '分类B', selected: false },
          { value: 'category3', label: '分类C', selected: false }
        ]
      },
      
      // 员工业绩数据
      employeeData: [
        {
          id: 1,
          name: '王鹃',
          orderAmount: '23,348.88',
          orderCount: '8',
          customerCount: '7'
        },
        {
          id: 2,
          name: 'tt',
          orderAmount: '18,567.32',
          orderCount: '12',
          customerCount: '9'
        },
        {
          id: 3,
          name: '李明',
          orderAmount: '15,234.56',
          orderCount: '6',
          customerCount: '5'
        },
        {
          id: 4,
          name: '张伟',
          orderAmount: '12,890.44',
          orderCount: '10',
          customerCount: '8'
        },
        {
          id: 5,
          name: '赵丽',
          orderAmount: '9,876.21',
          orderCount: '7',
          customerCount: '6'
        }
      ],
      
      // UI状态
      showTooltip: false
    }
  },
  
  computed: {
    currentFilterOptions() {
      if (!this.currentFilterKey) return []
      
      const options = this.filterOptionsData[this.currentFilterKey] || []
      if (!this.filterSearchQuery) return options
      
      return options.filter(option => 
        option.label.toLowerCase().includes(this.filterSearchQuery.toLowerCase())
      )
    }
  },
  
  methods: {
    // 导出数据
    exportData() {
      // 实现数据导出逻辑
      const formats = ['Excel', 'PDF', 'CSV']
      const selectedFormat = prompt(`选择导出格式：\n${formats.map((f, i) => `${i + 1}. ${f}`).join('\n')}`, '1')
      
      if (selectedFormat) {
        const formatIndex = parseInt(selectedFormat) - 1
        if (formatIndex >= 0 && formatIndex < formats.length) {
          alert(`正在导出 ${formats[formatIndex]} 格式的员工业绩汇总表...`)
          // 这里可以调用实际的导出API
        }
      }
    },
    
    // 日期面板相关方法
    toggleDatePanel() {
      this.showDatePanel = !this.showDatePanel
    },
    
    selectDateTab(tabKey) {
      this.activeTab = tabKey
    },
    
    selectQuickDate(optionKey) {
      this.selectedQuickOption = optionKey
      const option = this.quickDateOptions.find(o => o.key === optionKey)
      if (option) {
        this.currentDateRange = option.dateRange
        this.showDatePanel = false
        this.refreshData()
      }
    },
    
    selectMonth(monthValue) {
      this.selectedMonth = monthValue
      const month = this.monthOptions.find(m => m.value === monthValue)
      if (month) {
        this.currentDateRange = month.label
        this.showDatePanel = false
        this.refreshData()
      }
    },
    
    // 筛选相关方法
    openFilterSelector(filterKey) {
      this.currentFilterKey = filterKey
      this.currentFilterTitle = this.filterOptions.find(f => f.key === filterKey)?.label || ''
      this.showFilterModal = true
      this.filterSearchQuery = ''
    },
    
    hideFilterModal() {
      this.showFilterModal = false
      this.currentFilterKey = ''
      this.filterSearchQuery = ''
    },
    
    toggleFilterOption(option) {
      option.selected = !option.selected
    },
    
    confirmFilterSelection() {
      // 保存当前筛选器的选择
      if (this.currentFilterKey) {
        this.selectedFilters[this.currentFilterKey] = this.currentFilterOptions
          .filter(option => option.selected)
          .map(option => option.value)
      }
      this.hideFilterModal()
    },
    
    getSelectedFilterCount(filterKey) {
      return this.selectedFilters[filterKey]?.length || 0
    },
    
    resetFilters() {
      // 重置所有筛选条件
      Object.keys(this.selectedFilters).forEach(key => {
        this.selectedFilters[key] = []
      })
      
      // 重置筛选选项的选中状态
      Object.keys(this.filterOptionsData).forEach(key => {
        this.filterOptionsData[key].forEach(option => {
          option.selected = false
        })
      })
      
      // 重置日期为默认值
      this.selectedQuickOption = 'current-month'
      this.currentDateRange = '06-01 ~ 06-23'
      
      this.refreshData()
    },
    
    applyFilters() {
      // 应用筛选条件，刷新数据
      this.refreshData()
      alert('筛选条件已应用，正在刷新数据...')
    },
    
    // 数据展示相关方法
    showIndicatorTooltip() {
      this.showTooltip = true
    },
    
    hideTooltip() {
      this.showTooltip = false
    },
    
    viewEmployeeDetail(employee) {
      // 跳转到员工详情页面
      alert(`查看 ${employee.name} 的详细业绩数据`)
      // 这里可以跳转到详情页面，例如：
      // this.$router.push(`/employee-detail/${employee.id}`)
    },
    
    // 数据刷新
    refreshData() {
      // 根据当前筛选条件重新加载数据
      console.log('刷新数据：', {
        dateRange: this.currentDateRange,
        filters: this.selectedFilters
      })
      // 这里可以调用API获取最新数据
    },
    
    // 页面返回
    goBack() {
      this.$router.go(-1)
    }
  },
  
  // 生命周期钩子
  mounted() {
    // 页面加载时初始化数据
    this.refreshData()
  },
  
  // 点击外部关闭面板
  created() {
    document.addEventListener('click', (e) => {
      // 点击日期面板外部时关闭面板
      if (!e.target.closest('.date-filter-section')) {
        this.showDatePanel = false
      }
    })
  }
}
</script>

<style scoped>
/* 整体布局 - 移动端单屏滚动设计 */
.employee-report {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 标题栏 (Top Bar) - 像素级精确设计 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
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
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 15px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #f0f8ff;
}

.export-icon {
  fill: currentColor;
  width: 16px;
  height: 16px;
}

.export-text {
  font-weight: 500;
}

/* 日期快速查询条件 (Date Filter Bar) */
.date-filter-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: relative;
}

.date-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-trigger:hover {
  background-color: #f8f9fa;
}

.current-date {
  color: #666666;
  font-size: 16px;
  font-weight: 500;
}

.dropdown-arrow {
  stroke: #999999;
  stroke-width: 1.5;
  fill: none;
  transition: transform 0.3s ease;
}

.dropdown-arrow.expanded {
  transform: rotate(180deg);
}

/* 日期配置面板 */
.date-config-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-top: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 200;
  max-height: 400px;
  overflow-y: auto;
}

.date-tabs {
  display: flex;
  border-bottom: 1px solid #eaeaea;
}

.date-tab {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.date-tab.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
  background-color: #f8fbff;
}

/* 快捷选项 */
.quick-options {
  padding: 8px 0;
}

.quick-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-option:hover {
  background-color: #f8f9fa;
}

.quick-option.selected {
  background-color: #f0f8ff;
}

.option-label {
  color: #333333;
  font-size: 15px;
  font-weight: 500;
}

.option-date {
  color: #666666;
  font-size: 14px;
}

.check-icon {
  stroke: #007AFF;
  stroke-width: 2;
  fill: none;
  width: 16px;
  height: 16px;
}

/* 日历和月份选择器 */
.daily-picker, .monthly-picker {
  padding: 16px;
}

.calendar-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #999999;
}

.calendar-note {
  display: block;
  margin-top: 8px;
  font-size: 12px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.month-option {
  padding: 12px;
  text-align: center;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  cursor: pointer;
  color: #333333;
  font-size: 14px;
  transition: all 0.2s;
}

.month-option:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.month-option.selected {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

/* 筛选区 (Filter Panel) */
.filter-section {
  background-color: #ffffff;
  margin-top: 12px;
  padding: 16px;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-item:last-of-type {
  border-bottom: none;
}

.filter-item:hover {
  background-color: #f8f9fa;
}

.filter-label {
  color: #333333;
  font-size: 15px;
  flex: 1;
}

.filter-count {
  color: #007AFF;
  font-size: 13px;
  margin-left: 4px;
}

.filter-arrow {
  stroke: #999999;
  stroke-width: 1.5;
  fill: none;
  margin-left: 8px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eaeaea;
}

.reset-btn {
  flex: 1;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 6px;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #999999;
  background-color: #f8f9fa;
}

.confirm-btn {
  flex: 1;
  padding: 12px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background-color: #0056d6;
}

/* 数据展示区 (Data List) */
.data-section {
  background-color: #ffffff;
  margin-top: 12px;
  padding: 16px;
}

.indicators-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
  cursor: pointer;
  color: #999999;
  font-size: 13px;
}

.info-text {
  font-size: 13px;
}

.info-icon {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 1;
}

/* 业绩表头 */
.data-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1.5fr;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 2px solid #eaeaea;
  margin-bottom: 8px;
}

.header-cell {
  color: #333333;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}

.employee-name-col {
  text-align: left;
}

/* 业绩数据行 */
.data-body {
  min-height: 200px;
}

.data-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1.5fr;
  gap: 8px;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.data-row:hover {
  background-color: #f8fbff;
}

.data-row.even-row {
  background-color: #f9f9f9;
}

.data-row.even-row:hover {
  background-color: #f0f8ff;
}

.data-cell {
  color: #333333;
  font-size: 14px;
  text-align: center;
  padding: 4px;
}

.data-cell.employee-name-col {
  text-align: left;
  font-weight: 500;
}

.data-cell.order-amount-col {
  color: #007AFF;
  font-weight: 500;
}

/* Tooltip 弹窗 */
.tooltip-overlay {
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
  padding: 20px;
}

.tooltip-content {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.tooltip-title {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.tooltip-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip-body {
  padding: 16px;
}

.tooltip-item {
  margin-bottom: 12px;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
}

.tooltip-item:last-child {
  margin-bottom: 0;
}

/* 筛选器弹窗 */
.filter-modal-overlay {
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
  padding: 20px;
}

.filter-modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 360px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.filter-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.filter-modal-title {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.filter-modal-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.filter-search {
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.filter-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.filter-search-input:focus {
  outline: none;
  border-color: #007AFF;
}

.filter-options-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.filter-option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-option-item:hover {
  background-color: #f8f9fa;
}

.filter-option-item.selected {
  background-color: #f0f8ff;
}

.option-label {
  color: #333333;
  font-size: 14px;
  flex: 1;
}

.option-check {
  stroke: #007AFF;
  stroke-width: 2;
  fill: none;
  width: 16px;
  height: 16px;
}

.filter-modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #eaeaea;
}

.filter-cancel-btn {
  flex: 1;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 6px;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-cancel-btn:hover {
  border-color: #999999;
  background-color: #f8f9fa;
}

.filter-confirm-btn {
  flex: 1;
  padding: 12px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-confirm-btn:hover {
  background-color: #0056d6;
}

/* 响应式设计 - 针对不同屏幕尺寸的适配 */
@media (max-width: 480px) {
  .page-title {
    font-size: 16px;
  }
  
  .export-btn {
    font-size: 14px;
  }
  
  .data-header,
  .data-row {
    grid-template-columns: 1.5fr 1.5fr 1fr 1fr;
    gap: 4px;
  }
  
  .header-cell,
  .data-cell {
    font-size: 13px;
  }
  
  .filter-label {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .top-bar {
    padding: 10px 12px;
  }
  
  .date-trigger {
    padding: 12px;
  }
  
  .filter-section {
    padding: 12px;
  }
  
  .data-section {
    padding: 12px;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-config-panel {
  animation: slideDown 0.3s ease-out;
}

.tooltip-overlay,
.filter-modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.tooltip-content,
.filter-modal-content {
  animation: slideUp 0.3s ease-out;
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
</style>
