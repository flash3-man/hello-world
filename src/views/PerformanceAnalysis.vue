<template>
  <div class="performance-analysis">
    <!-- 顶部操作区 -->
    <div class="header-section">
      <div class="header-actions">
        <button class="export-btn" @click="exportData">导出</button>
        <h1 class="page-title">业绩变化分析</h1>
        <button class="filter-btn" @click="toggleFilter">筛选 ▽</button>
      </div>
    </div>

    <!-- 销售金额汇总区 -->
    <div class="summary-section">
      <div class="summary-card" @click="goToEmployeeReport">
        <div class="summary-header">
          <span class="summary-title">员工业绩汇总表</span>
          <span class="summary-action">查看详情 ></span>
        </div>
        <div class="summary-metrics">
          <div class="metric-item">
            <span class="metric-label">本月销售金额</span>
            <span class="metric-value current-month">¥{{ currentMonthTotal }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">上月销售金额</span>
            <span class="metric-value last-month">¥{{ lastMonthTotal }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">环比变化</span>
            <span class="metric-value change-rate" :class="getMonthChangeClass()">
              {{ getMonthChangeRate() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 日期快速查询条件 -->
    <div class="date-quick-filter">
      <div class="filter-header">
        <span class="filter-title">日期快速查询</span>
      </div>
      <div class="date-options">
        <button 
          v-for="option in dateQuickOptions" 
          :key="option.value"
          :class="['date-option-btn', { active: selectedDateRange === option.value }]"
          @click="selectDateRange(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="custom-date-range" v-if="selectedDateRange === 'custom'">
        <div class="date-input-group">
          <input type="date" v-model="customStartDate" class="date-input" />
          <span class="date-separator">至</span>
          <input type="date" v-model="customEndDate" class="date-input" />
        </div>
      </div>
    </div>

    <!-- 筛选条件区 -->
    <div class="filter-conditions" :class="{ expanded: showAdvancedFilter }">
      <div class="basic-filter">
        <div class="condition-row">
          <div class="condition-item">
            <label class="condition-label">分析指标</label>
            <select v-model="analysisMetric" class="condition-select">
              <option value="sales-amount">销售金额</option>
              <option value="order-amount">订单金额</option>
              <option value="net-sales">净销售额</option>
              <option value="return-amount">退货金额</option>
              <option value="sales-quantity">销售数量</option>
            </select>
          </div>
          <div class="condition-item">
            <label class="condition-label">分析维度</label>
            <select v-model="analysisDimension" class="condition-select">
              <option value="region">按片区分析</option>
              <option value="customer">按客户分析</option>
              <option value="channel">按渠道分析</option>
              <option value="brand">按品牌分析</option>
              <option value="employee">按员工分析</option>
              <option value="department">按部门分析</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 高级筛选条件 -->
      <div class="advanced-filter" v-if="showAdvancedFilter">
        <div class="condition-row">
          <div class="condition-item">
            <label class="condition-label">客户</label>
            <select multiple v-model="selectedCustomers" class="condition-select multi-select">
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div class="condition-item">
            <label class="condition-label">片区</label>
            <select multiple v-model="selectedRegions" class="condition-select multi-select">
              <option v-for="region in regions" :key="region.id" :value="region.id">
                {{ region.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="condition-row">
          <div class="condition-item">
            <label class="condition-label">渠道</label>
            <select multiple v-model="selectedChannels" class="condition-select multi-select">
              <option v-for="channel in channels" :key="channel.id" :value="channel.id">
                {{ channel.name }}
              </option>
            </select>
          </div>
          <div class="condition-item">
            <label class="condition-label">品牌</label>
            <select multiple v-model="selectedBrands" class="condition-select multi-select">
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="condition-row">
          <div class="condition-item">
            <label class="condition-label">商品</label>
            <select multiple v-model="selectedProducts" class="condition-select multi-select">
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
          <div class="condition-item">
            <label class="condition-label">员工</label>
            <select multiple v-model="selectedEmployees" class="condition-select multi-select">
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="condition-row">
          <div class="condition-item">
            <label class="condition-label">分类</label>
            <select multiple v-model="selectedCategories" class="condition-select multi-select">
              <option v-for="category in productCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="condition-item">
            <div class="filter-actions">
              <button class="reset-filter-btn" @click="resetFilters">重置筛选</button>
              <button class="apply-filter-btn" @click="applyFilters">应用筛选</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="filter-toggle">
        <button class="toggle-btn" @click="toggleAdvancedFilter">
          {{ showAdvancedFilter ? '收起筛选' : '展开筛选' }}
          <span class="toggle-icon">{{ showAdvancedFilter ? '▲' : '▼' }}</span>
        </button>
      </div>
    </div>

    <!-- 数据列表区 -->
    <div class="data-list-section">
      <div class="list-header">
        <span class="header-text">{{ getDimensionText() }}分析结果</span>
      </div>
      <div class="data-list">
        <div 
          v-for="(item, index) in filteredDataList" 
          :key="item.id"
          class="data-item"
        >
          <div class="item-header">
            <span class="item-rank">{{ index + 1 }}.</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="item-metrics">
            <div class="metric-group">
              <span class="metric-label">{{ getMetricText() }} (元)</span>
              <span class="metric-value">{{ item.currentValue }}</span>
            </div>
            <div class="metric-group">
              <span class="metric-label">对比值 (元)</span>
              <span class="metric-value">{{ item.compareValue }}</span>
            </div>
            <div class="metric-group">
              <span class="metric-label">变化值 (元)</span>
              <span class="metric-value">{{ item.changeValue }}</span>
            </div>
            <div class="metric-group">
              <span class="metric-label">变化率</span>
              <span 
                class="metric-value change-rate" 
                :class="getChangeClass(item.changeRate)"
              >
                {{ item.changeRate }}
              </span>
            </div>
          </div>
          <div class="item-action">
            <span class="view-detail" @click="viewCustomers(item.id)">
              查看客户 >
            </span>
          </div>
        </div>
      </div>
      
      <!-- 合计 -->
      <div class="summary-total">
        <span class="total-text">
          合计 {{ getMetricText() }} (元)：{{ totalCurrent }} 
          对比值 (元)：{{ totalCompare }}
        </span>
      </div>
    </div>

    <!-- 底部分类区 -->
    <div class="category-tabs">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="['category-btn', { active: selectedCategory === category.id }, category.type]"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">返回</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerformanceAnalysis',
  data() {
    return {
      // 基础筛选条件
      analysisMetric: 'sales-amount',
      analysisDimension: 'region',
      selectedCategory: 'all',
      
      // 日期相关
      selectedDateRange: 'current-month',
      customStartDate: '',
      customEndDate: '',
      
      // 高级筛选显示状态
      showAdvancedFilter: false,
      
      // 筛选条件
      selectedCustomers: [],
      selectedRegions: [],
      selectedChannels: [],
      selectedBrands: [],
      selectedProducts: [],
      selectedEmployees: [],
      selectedCategories: [],
      
      // 汇总数据
      currentMonthTotal: '128,450.00',
      lastMonthTotal: '95,320.00',
      
      // 日期快速选项
      dateQuickOptions: [
        { label: '本月', value: 'current-month' },
        { label: '上月', value: 'last-month' },
        { label: '本季度', value: 'current-quarter' },
        { label: '上季度', value: 'last-quarter' },
        { label: '本年', value: 'current-year' },
        { label: '去年', value: 'last-year' },
        { label: '最近7天', value: 'recent-7days' },
        { label: '最近30天', value: 'recent-30days' },
        { label: '自定义', value: 'custom' }
      ],
      
      // 筛选选项数据
      customers: [
        { id: 1, name: '客户A' },
        { id: 2, name: '客户B' },
        { id: 3, name: '客户C' },
        { id: 4, name: '客户D' }
      ],
      regions: [
        { id: 1, name: '华东区' },
        { id: 2, name: '华南区' },
        { id: 3, name: '华北区' },
        { id: 4, name: '西南区' }
      ],
      channels: [
        { id: 1, name: '线上渠道' },
        { id: 2, name: '线下门店' },
        { id: 3, name: '代理商' },
        { id: 4, name: '直营店' }
      ],
      brands: [
        { id: 1, name: '品牌A' },
        { id: 2, name: '品牌B' },
        { id: 3, name: '品牌C' },
        { id: 4, name: '品牌D' }
      ],
      products: [
        { id: 1, name: '产品A' },
        { id: 2, name: '产品B' },
        { id: 3, name: '产品C' },
        { id: 4, name: '产品D' }
      ],
      employees: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' },
        { id: 4, name: '赵六' }
      ],
      productCategories: [
        { id: 1, name: '电子产品' },
        { id: 2, name: '服装鞋帽' },
        { id: 3, name: '家居用品' },
        { id: 4, name: '食品饮料' }
      ],
      
      categories: [
        { id: 'all', name: '全部', type: 'neutral' },
        { id: 'stable', name: '持平', type: 'neutral' },
        { id: 'growth', name: '增长', type: 'growth' },
        { id: 'decline', name: '下降', type: 'decline' }
      ],
      dataList: [
        {
          id: 1,
          name: '滁州代理',
          currentValue: '5,000.00',
          compareValue: '0.00',
          changeValue: '5,000.00',
          changeRate: '100%',
          category: 'growth'
        },
        {
          id: 2,
          name: '白云区',
          currentValue: '580.00',
          compareValue: '3,294.34',
          changeValue: '-2,714.34',
          changeRate: '-82.4%',
          category: 'decline'
        },
        {
          id: 3,
          name: '南京市',
          currentValue: '12,450.00',
          compareValue: '8,900.00',
          changeValue: '3,550.00',
          changeRate: '39.9%',
          category: 'growth'
        },
        {
          id: 4,
          name: '江宁区',
          currentValue: '7,800.00',
          compareValue: '7,800.00',
          changeValue: '0.00',
          changeRate: '0%',
          category: 'stable'
        },
        {
          id: 5,
          name: '浦口区',
          currentValue: '3,200.00',
          compareValue: '4,500.00',
          changeValue: '-1,300.00',
          changeRate: '-28.9%',
          category: 'decline'
        }
      ]
    }
  },
  computed: {
    filteredDataList() {
      if (this.selectedCategory === 'all') {
        return this.dataList
      }
      return this.dataList.filter(item => item.category === this.selectedCategory)
    },
    totalCurrent() {
      return this.formatNumber(
        this.dataList.reduce((sum, item) => {
          return sum + parseFloat(item.currentValue.replace(/,/g, ''))
        }, 0)
      )
    },
    totalCompare() {
      return this.formatNumber(
        this.dataList.reduce((sum, item) => {
          return sum + parseFloat(item.compareValue.replace(/,/g, ''))
        }, 0)
      )
    }
  },
  methods: {
    toggleFilter() {
      // 筛选功能
    },
    exportData() {
      alert('导出分析数据')
    },
    
    // 跳转到员工业绩汇总表
    goToEmployeeReport() {
      this.$router.push('/employee-report')
    },
    
    // 日期范围选择
    selectDateRange(value) {
      this.selectedDateRange = value
      if (value !== 'custom') {
        this.applyDateFilter(value)
      }
    },
    
    // 应用日期筛选
    applyDateFilter(dateRange) {
      console.log('应用日期筛选:', dateRange)
      // 根据选择的日期范围重新加载数据
      this.loadDataByDateRange(dateRange)
    },
    
    // 根据日期范围加载数据
    loadDataByDateRange(dateRange) {
      // 模拟根据不同日期范围加载数据
      console.log('加载数据，日期范围:', dateRange)
    },
    
    // 切换高级筛选
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter
    },
    
    // 重置筛选条件
    resetFilters() {
      this.selectedCustomers = []
      this.selectedRegions = []
      this.selectedChannels = []
      this.selectedBrands = []
      this.selectedProducts = []
      this.selectedEmployees = []
      this.selectedCategories = []
      this.applyFilters()
    },
    
    // 应用筛选条件
    applyFilters() {
      console.log('应用筛选条件:', {
        customers: this.selectedCustomers,
        regions: this.selectedRegions,
        channels: this.selectedChannels,
        brands: this.selectedBrands,
        products: this.selectedProducts,
        employees: this.selectedEmployees,
        categories: this.selectedCategories
      })
      // 重新加载符合筛选条件的数据
      this.loadFilteredData()
    },
    
    // 加载筛选后的数据
    loadFilteredData() {
      // 模拟加载筛选后的数据
      console.log('加载筛选后的数据')
    },
    
    // 获取月度变化率
    getMonthChangeRate() {
      const current = parseFloat(this.currentMonthTotal.replace(/,/g, ''))
      const last = parseFloat(this.lastMonthTotal.replace(/,/g, ''))
      const changeRate = ((current - last) / last * 100).toFixed(1)
      return changeRate > 0 ? `+${changeRate}%` : `${changeRate}%`
    },
    
    // 获取月度变化样式类
    getMonthChangeClass() {
      const current = parseFloat(this.currentMonthTotal.replace(/,/g, ''))
      const last = parseFloat(this.lastMonthTotal.replace(/,/g, ''))
      const change = current - last
      if (change > 0) return 'positive'
      if (change < 0) return 'negative'
      return 'neutral'
    },
    
    getDimensionText() {
      const dimensions = {
        'region': '片区',
        'customer': '客户',
        'channel': '渠道',
        'brand': '品牌',
        'employee': '员工',
        'department': '部门'
      }
      return dimensions[this.analysisDimension] || '片区'
    },
    getMetricText() {
      const metrics = {
        'sales-amount': '销售金额',
        'order-amount': '订单金额',
        'net-sales': '净销售额',
        'return-amount': '退货金额',
        'sales-quantity': '销售数量'
      }
      return metrics[this.analysisMetric] || '销售金额'
    },
    getChangeClass(changeRate) {
      const rate = parseFloat(changeRate.replace('%', ''))
      if (rate > 0) return 'positive'
      if (rate < 0) return 'negative'
      return 'neutral'
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    viewCustomers(itemId) {
      console.log('查看客户详情:', itemId)
    },
    formatNumber(num) {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.performance-analysis {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 销售金额汇总区 */
.summary-section {
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.summary-card {
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.summary-card:hover {
  background-color: #f9fafb;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-title {
  color: #111111;
  font-size: 16px;
  font-weight: bold;
}

.summary-action {
  color: #1677ff;
  font-size: 14px;
}

.summary-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  color: #666666;
  font-size: 12px;
}

.metric-value {
  font-size: 16px;
  font-weight: bold;
}

.metric-value.current-month {
  color: #1677ff;
}

.metric-value.last-month {
  color: #666666;
}

.metric-value.change-rate.positive {
  color: #00b42a;
}

.metric-value.change-rate.negative {
  color: #f53f3f;
}

.metric-value.change-rate.neutral {
  color: #666666;
}

/* 日期快速查询条件 */
.date-quick-filter {
  background-color: #ffffff;
  margin: 8px 16px;
  padding: 16px;
  border-radius: 8px;
}

.filter-header {
  margin-bottom: 12px;
}

.filter-title {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}

.date-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.date-option-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 8px 12px;
  border-radius: 4px;
  color: #666666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.date-option-btn.active {
  background-color: #1677ff;
  border-color: #1677ff;
  color: #ffffff;
}

.custom-date-range {
  margin-top: 12px;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  color: #666666;
  font-size: 14px;
}

.date-separator {
  color: #666666;
  font-size: 14px;
}

/* 筛选条件区 */
.filter-conditions {
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.basic-filter, .advanced-filter {
  padding: 16px;
}

.advanced-filter {
  border-top: 1px solid #eeeeee;
  background-color: #f9fafb;
}

.multi-select {
  height: 80px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.reset-filter-btn, .apply-filter-btn {
  flex: 1;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-filter-btn {
  background: none;
  border: 1px solid #dddddd;
  color: #666666;
}

.reset-filter-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.apply-filter-btn {
  background-color: #1677ff;
  border: 1px solid #1677ff;
  color: #ffffff;
}

.apply-filter-btn:hover {
  background-color: #0e5fd8;
}

.filter-toggle {
  padding: 12px 16px;
  border-top: 1px solid #eeeeee;
  background-color: #f9fafb;
  text-align: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 auto;
}

.toggle-icon {
  font-size: 12px;
}

/* 原有样式保持不变 */
.header-section {
  background-color: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.export-btn {
  background: none;
  border: none;
  color: #1677ff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.page-title {
  color: #111111;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.filter-btn {
  background: none;
  border: none;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
}

/* 筛选条件区 */
.filter-conditions {
  background-color: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.condition-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.condition-row:last-child {
  margin-bottom: 0;
}

.condition-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.condition-label {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.condition-select {
  padding: 8px 12px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background-color: #ffffff;
  color: #666666;
  font-size: 14px;
}

.condition-select:focus {
  outline: none;
  border-color: #1677ff;
  color: #1677ff;
}

/* 数据列表区 */
.data-list-section {
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
  background-color: #f9fafb;
} 

.header-text {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
}

.data-list {
  padding: 0;
}

.data-item {
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.data-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.item-rank {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
}

.item-name {
  color: #111111;
  font-size: 16px;
  font-weight: 500;
}

.item-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.metric-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  color: #666666;
  font-size: 12px;
}

.metric-value {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.change-rate.positive {
  color: #00b42a;
}

.change-rate.negative {
  color: #f53f3f;
}

.change-rate.neutral {
  color: #666666;
}

.item-action {
  text-align: right;
}

.view-detail {
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #e0e0e0;
}

.view-detail:hover {
  text-decoration-color: #1677ff;
}

/* 合计 */
.summary-total {
  padding: 16px;
  background-color: #f9fafb;
  border-top: 1px solid #eeeeee;
}

.total-text {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}

/* 底部分类区 */
.category-tabs {
  background-color: #ffffff;
  padding: 16px;
  border-top: 1px solid #eeeeee;
  display: flex;
  gap: 12px;
}

.category-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn.neutral {
  color: #666666;
}

.category-btn.growth {
  color: #00b42a;
  border-color: #00b42a;
}

.category-btn.decline {
  color: #f53f3f;
  border-color: #f53f3f;
}

.category-btn.active.neutral {
  background-color: #f5f5f5;
  color: #333333;
}

.category-btn.active.growth {
  background-color: #e6f7f0;
  color: #00b42a;
}

.category-btn.active.decline {
  background-color: #ffebeb;
  color: #f53f3f;
}

/* 返回按钮 */
.back-section {
  padding: 16px;
  text-align: center;
}

.back-btn {
  background-color: #1677ff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #0e5fd8;
}
</style>
