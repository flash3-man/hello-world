<template>
  <div class="market-analysis">
    <!-- 顶部操作区 - 筛选与导出 -->
    <div class="header-section">
      <div class="header-bar">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="page-title">铺市分析</h1>
        <button class="export-btn" @click="exportData">
          <svg class="export-icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 2L8 10M8 2L5 5M8 2L11 5M2 14L14 14" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          导出
        </button>
      </div>

      <!-- 时间筛选与分析维度 -->
      <div class="filter-section">
        <div class="time-filter">
          <label class="filter-label">时间范围：</label>
          <div class="date-picker" @click="showDatePicker = true">
            <span class="date-text">{{ selectedDateRange }}</span>
            <svg class="date-arrow" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>

        <div class="analysis-dimension">
          <label class="filter-label">分析维度：</label>
          <div class="dimension-selector" @click="showDimensionMenu = true">
            <span class="dimension-text">{{ currentDimension }}</span>
            <svg class="dimension-arrow" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>

        <button class="filter-btn" @click="showFilterModal = true">
          <svg class="filter-icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M2 4L14 4M4 8L12 8M6 12L10 12" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          筛选
        </button>
      </div>
    </div>

    <!-- 日期选择器弹窗 -->
    <div v-if="showDatePicker" class="date-overlay" @click="showDatePicker = false">
      <div class="date-modal" @click.stop>
        <div class="date-header">
          <h3>选择时间范围</h3>
          <button class="date-close" @click="showDatePicker = false">✕</button>
        </div>
        <div class="date-content">
          <div class="quick-dates">
            <button 
              v-for="range in quickDateRanges" 
              :key="range.value"
              class="quick-date-btn"
              :class="{ active: selectedDateValue === range.value }"
              @click="selectDateRange(range)"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析维度下拉菜单 -->
    <div v-if="showDimensionMenu" class="dimension-overlay" @click="showDimensionMenu = false">
      <div class="dimension-menu" @click.stop>
        <div 
          v-for="dimension in analysisDimensions" 
          :key="dimension.value"
          class="dimension-option"
          :class="{ active: selectedDimension === dimension.value }"
          @click="selectDimension(dimension.value)"
        >
          {{ dimension.label }}
        </div>
      </div>
    </div>

    <!-- 维度切换栏 - 客户/品牌/商品 -->
    <div class="tab-section">
      <div class="tab-container">
        <button 
          v-for="tab in dataTabs" 
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 列表区 - 动态数据展示 -->
    <div class="data-section">
      <!-- 统计信息 -->
      <div class="summary-info">
        <span class="summary-text">{{ getSummaryText() }}</span>
      </div>

      <!-- 客户维度数据 -->
      <div v-if="activeTab === 'customer'" class="customer-list">
        <div class="list-header">
          <div class="header-cell col-employee">员工名称</div>
          <div class="header-cell col-covered">铺货客户数</div>
          <div class="header-cell col-uncovered">未铺货客户数</div>
          <div class="header-cell col-rate">客户铺货率</div>
        </div>
        <div 
          v-for="employee in filteredEmployeeData" 
          :key="employee.id"
          class="list-row customer-row"
          @click="goToEmployeeAnalysis(employee)"
        >
          <div class="row-cell employee-name">
            <div class="employee-info">
              <div class="employee-name-text">{{ employee.name }}</div>
              <div class="employee-department">{{ employee.department }}</div>
            </div>
          </div>
          <div class="row-cell covered-customers" @click.stop="showCustomerDetail(employee, 'covered')">
            <span class="customer-count covered">{{ employee.stockedCustomers }}</span>
          </div>
          <div class="row-cell uncovered-customers" @click.stop="showCustomerDetail(employee, 'uncovered')">
            <span class="customer-count uncovered">{{ employee.unstockedCustomers }}</span>
          </div>
          <div class="row-cell">
            <span class="rate-value" :class="getRateClass(employee.stockingRate)">
              {{ employee.stockingRate }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 品牌维度数据 -->
      <div v-if="activeTab === 'brand'" class="brand-list">
        <div class="list-header">
          <div class="header-cell">品牌名称</div>
          <div class="header-cell">铺货门店数</div>
          <div class="header-cell">品牌铺货率</div>
          <div class="header-cell">销售额排名</div>
        </div>
        <div 
          v-for="brand in filteredBrandData" 
          :key="brand.id"
          class="list-row brand-row"
          @click="goToCustomerAnalysis(brand)"
        >
          <div class="row-cell brand-name">{{ brand.name }}</div>
          <div class="row-cell">{{ brand.stockedStores }}</div>
          <div class="row-cell">
            <span class="rate-value" :class="getRateClass(brand.stockingRate)">
              {{ brand.stockingRate }}%
            </span>
          </div>
          <div class="row-cell">{{ brand.salesRanking }}</div>
        </div>
      </div>

      <!-- 商品维度数据 -->
      <div v-if="activeTab === 'product'" class="product-list">
        <div class="list-header">
          <div class="header-cell">商品名称</div>
          <div class="header-cell">铺货量</div>
          <div class="header-cell">铺货区域</div>
          <div class="header-cell">库存状态</div>
        </div>
        <div 
          v-for="product in filteredProductData" 
          :key="product.id"
          class="list-row product-row"
          @click="goToProductAnalysis(product)"
        >
          <div class="row-cell product-name">{{ product.name }}</div>
          <div class="row-cell">{{ product.stockQuantity }}</div>
          <div class="row-cell">{{ product.stockAreas }}个区域</div>
          <div class="row-cell">
            <span class="status-badge" :class="getStatusClass(product.stockStatus)">
              {{ product.stockStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <div v-if="showFilterModal" class="filter-overlay" @click="showFilterModal = false">
      <div class="filter-modal" @click.stop>
        <div class="filter-header">
          <h3>高级筛选</h3>
          <button class="filter-close" @click="showFilterModal = false">✕</button>
        </div>
        <div class="filter-content">
          <div class="filter-group">
            <label class="filter-group-label">员工筛选</label>
            <div class="checkbox-group">
              <label v-for="employee in allEmployees" :key="employee.id" class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="selectedEmployees" 
                  :value="employee.id"
                  class="checkbox-input"
                >
                <span class="checkbox-label">{{ employee.name }}</span>
              </label>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-group-label">区域筛选</label>
            <div class="checkbox-group">
              <label v-for="area in allAreas" :key="area.id" class="checkbox-item">
                <input 
                  type="checkbox" 
                  v-model="selectedAreas" 
                  :value="area.id"
                  class="checkbox-input"
                >
                <span class="checkbox-label">{{ area.name }}</span>
              </label>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-group-label">铺货率范围</label>
            <div class="range-group">
              <input 
                type="number" 
                v-model="rateRangeMin" 
                placeholder="最小值%" 
                class="range-input"
              >
              <span class="range-separator">-</span>
              <input 
                type="number" 
                v-model="rateRangeMax" 
                placeholder="最大值%" 
                class="range-input"
              >
            </div>
          </div>
        </div>
        <div class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="apply-btn" @click="applyFilters">应用筛选</button>
        </div>
      </div>
    </div>

    <!-- 客户明细弹窗 -->
    <div v-if="showCustomerDetailModal" class="modal-overlay" @click="showCustomerDetailModal = false">
      <div class="detail-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ customerDetailTitle }}</h3>
          <button class="modal-close" @click="showCustomerDetailModal = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="customer-detail-list">
            <div 
              v-for="customer in currentCustomerDetail" 
              :key="customer.id"
              class="customer-detail-item"
            >
              <div class="customer-info">
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-address">{{ customer.address }}</div>
              </div>
              <div class="customer-status">
                <span class="status-badge" :class="customer.status === '已铺货' ? 'status-covered' : 'status-uncovered'">
                  {{ customer.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarketAnalysis',
  data() {
    return {
      // 界面状态
      showDatePicker: false,
      showDimensionMenu: false,
      showFilterModal: false,
      showCustomerDetailModal: false,
      
      // 当前选择
      selectedDateValue: 'current_month',
      selectedDateRange: '06-01~06-20',
      selectedDimension: 'employee',
      currentDimension: '按员工分析',
      activeTab: 'customer',
      
      // 快速日期选择
      quickDateRanges: [
        { value: 'current_month', label: '本月 (06-01~06-20)', range: '06-01~06-20' },
        { value: 'last_month', label: '上月 (05-01~05-20)', range: '05-01~05-20' },
        { value: 'current_quarter', label: '本季度 (04-01~06-20)', range: '04-01~06-20' },
        { value: 'last_quarter', label: '上季度 (01-01~03-31)', range: '01-01~03-31' }
      ],
      
      // 分析维度
      analysisDimensions: [
        { value: 'employee', label: '按员工分析' },
        { value: 'area', label: '按区域分析' },
        { value: 'department', label: '按部门分析' }
      ],
      
      // 数据标签
      dataTabs: [
        { value: 'customer', label: '客户' },
        { value: 'brand', label: '品牌' },
        { value: 'product', label: '商品' }
      ],
      
      // 客户明细相关
      customerDetailTitle: '',
      currentCustomerDetail: [],
      
      // 员工数据（客户维度）
      employeeData: [
        {
          id: 1,
          name: '黄保杰',
          stockedCustomers: 25,
          unstockedCustomers: 12,
          stockingRate: 67.6,
          area: '兰州',
          department: '销售一部'
        },
        {
          id: 2,
          name: '拉拉',
          stockedCustomers: 18,
          unstockedCustomers: 8,
          stockingRate: 69.2,
          area: '兰州',
          department: '销售一部'
        },
        {
          id: 3,
          name: '仇胜丽',
          stockedCustomers: 22,
          unstockedCustomers: 15,
          stockingRate: 59.5,
          area: '天水',
          department: '销售二部'
        },
        {
          id: 4,
          name: '王飞',
          stockedCustomers: 31,
          unstockedCustomers: 9,
          stockingRate: 77.5,
          area: '兰州',
          department: '销售一部'
        },
        {
          id: 5,
          name: '徐伟',
          stockedCustomers: 16,
          unstockedCustomers: 14,
          stockingRate: 53.3,
          area: '天水',
          department: '销售二部'
        },
        {
          id: 6,
          name: '张三',
          stockedCustomers: 19,
          unstockedCustomers: 11,
          stockingRate: 63.3,
          area: '白银',
          department: '销售三部'
        },
        {
          id: 7,
          name: '李四',
          stockedCustomers: 28,
          unstockedCustomers: 7,
          stockingRate: 80.0,
          area: '兰州',
          department: '销售一部'
        },
        {
          id: 8,
          name: '王五',
          stockedCustomers: 14,
          unstockedCustomers: 16,
          stockingRate: 46.7,
          area: '天水',
          department: '销售二部'
        },
        {
          id: 9,
          name: '赵六',
          stockedCustomers: 23,
          unstockedCustomers: 10,
          stockingRate: 69.7,
          area: '白银',
          department: '销售三部'
        },
        {
          id: 10,
          name: '钱七',
          stockedCustomers: 20,
          unstockedCustomers: 13,
          stockingRate: 60.6,
          area: '兰州',
          department: '销售一部'
        },
        {
          id: 11,
          name: '孙八',
          stockedCustomers: 26,
          unstockedCustomers: 6,
          stockingRate: 81.3,
          area: '天水',
          department: '销售二部'
        },
        {
          id: 12,
          name: '周九',
          stockedCustomers: 17,
          unstockedCustomers: 18,
          stockingRate: 48.6,
          area: '白银',
          department: '销售三部'
        },
        {
          id: 13,
          name: '吴十',
          stockedCustomers: 21,
          unstockedCustomers: 12,
          stockingRate: 63.6,
          area: '兰州',
          department: '销售一部'
        },
        {
          id: 14,
          name: '郑十一',
          stockedCustomers: 15,
          unstockedCustomers: 17,
          stockingRate: 46.9,
          area: '天水',
          department: '销售二部'
        },
        {
          id: 15,
          name: '王十二',
          stockedCustomers: 24,
          unstockedCustomers: 8,
          stockingRate: 75.0,
          area: '白银',
          department: '销售三部'
        }
      ],
      
      // 品牌数据
      brandData: [
        {
          id: 1,
          name: '百事可乐',
          stockedStores: 45,
          stockingRate: 78.3,
          salesRanking: 1,
          category: '饮料'
        },
        {
          id: 2,
          name: '可口可乐',
          stockedStores: 42,
          stockingRate: 73.2,
          salesRanking: 2,
          category: '饮料'
        },
        {
          id: 3,
          name: '康师傅',
          stockedStores: 38,
          stockingRate: 66.1,
          salesRanking: 3,
          category: '食品'
        },
        {
          id: 4,
          name: '统一',
          stockedStores: 35,
          stockingRate: 60.9,
          salesRanking: 4,
          category: '食品'
        },
        {
          id: 5,
          name: '雪碧',
          stockedStores: 33,
          stockingRate: 57.4,
          salesRanking: 5,
          category: '饮料'
        },
        {
          id: 6,
          name: '美年达',
          stockedStores: 29,
          stockingRate: 50.4,
          salesRanking: 6,
          category: '饮料'
        },
        {
          id: 7,
          name: '旺旺',
          stockedStores: 27,
          stockingRate: 47.0,
          salesRanking: 7,
          category: '食品'
        },
        {
          id: 8,
          name: '娃哈哈',
          stockedStores: 25,
          stockingRate: 43.5,
          salesRanking: 8,
          category: '饮料'
        }
      ],
      
      // 商品数据
      productData: [
        {
          id: 1,
          name: '纯生乐堡（百事）',
          stockQuantity: 1250,
          stockAreas: 8,
          stockStatus: '正常',
          brand: '百事',
          category: '啤酒'
        },
        {
          id: 2,
          name: '可口可乐经典装',
          stockQuantity: 980,
          stockAreas: 6,
          stockStatus: '紧张',
          brand: '可口可乐',
          category: '饮料'
        },
        {
          id: 3,
          name: '康师傅红烧牛肉面',
          stockQuantity: 2100,
          stockAreas: 12,
          stockStatus: '充足',
          brand: '康师傅',
          category: '方便面'
        },
        {
          id: 4,
          name: '统一老坛酸菜面',
          stockQuantity: 1800,
          stockAreas: 10,
          stockStatus: '正常',
          brand: '统一',
          category: '方便面'
        },
        {
          id: 5,
          name: '雪碧柠檬味',
          stockQuantity: 750,
          stockAreas: 5,
          stockStatus: '紧张',
          brand: '可口可乐',
          category: '饮料'
        },
        {
          id: 6,
          name: '美年达橙味',
          stockQuantity: 650,
          stockAreas: 4,
          stockStatus: '滞销',
          brand: '百事',
          category: '饮料'
        },
        {
          id: 7,
          name: '旺旺雪饼',
          stockQuantity: 1400,
          stockAreas: 7,
          stockStatus: '正常',
          brand: '旺旺',
          category: '零食'
        },
        {
          id: 8,
          name: '娃哈哈AD钙奶',
          stockQuantity: 1100,
          stockAreas: 6,
          stockStatus: '正常',
          brand: '娃哈哈',
          category: '乳饮料'
        }
      ],
      
      // 筛选条件
      selectedEmployees: [],
      selectedAreas: [],
      rateRangeMin: null,
      rateRangeMax: null,
      
      // 基础数据
      allEmployees: [],
      allAreas: [
        { id: 1, name: '兰州' },
        { id: 2, name: '天水' },
        { id: 3, name: '白银' }
      ]
    }
  },
  
  computed: {
    // 获取过滤后的员工数据
    filteredEmployeeData() {
      let data = [...this.employeeData]
      
      // 员工筛选
      if (this.selectedEmployees.length > 0) {
        data = data.filter(emp => this.selectedEmployees.includes(emp.id))
      }
      
      // 区域筛选
      if (this.selectedAreas.length > 0) {
        const selectedAreaNames = this.allAreas
          .filter(area => this.selectedAreas.includes(area.id))
          .map(area => area.name)
        data = data.filter(emp => selectedAreaNames.includes(emp.area))
      }
      
      // 铺货率范围筛选
      if (this.rateRangeMin !== null || this.rateRangeMax !== null) {
        data = data.filter(emp => {
          const rate = emp.stockingRate
          const minOk = this.rateRangeMin === null || rate >= this.rateRangeMin
          const maxOk = this.rateRangeMax === null || rate <= this.rateRangeMax
          return minOk && maxOk
        })
      }
      
      return data
    },
    
    // 获取过滤后的品牌数据
    filteredBrandData() {
      return this.brandData
    },
    
    // 获取过滤后的商品数据
    filteredProductData() {
      return this.productData
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 选择日期范围
    selectDateRange(range) {
      this.selectedDateValue = range.value
      this.selectedDateRange = range.range
      this.showDatePicker = false
      
      // 触发数据重新加载
      this.reloadData()
    },
    
    // 选择分析维度
    selectDimension(dimension) {
      this.selectedDimension = dimension
      this.currentDimension = this.analysisDimensions.find(d => d.value === dimension).label
      this.showDimensionMenu = false
      
      // 触发数据重新加载
      this.reloadData()
    },
    
    // 切换数据标签
    switchTab(tab) {
      this.activeTab = tab
    },
    
    // 获取统计文本
    getSummaryText() {
      switch (this.activeTab) {
        case 'customer':
          return `合计员工数 ${this.filteredEmployeeData.length}`
        case 'brand':
          return `合计品牌数 ${this.filteredBrandData.length}`
        case 'product':
          return `合计商品数 ${this.filteredProductData.length}`
        default:
          return ''
      }
    },
    
    // 获取铺货率样式类
    getRateClass(rate) {
      if (rate >= 70) return 'rate-high'
      if (rate >= 50) return 'rate-medium'
      return 'rate-low'
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      switch (status) {
        case '充足': return 'status-abundant'
        case '正常': return 'status-normal'
        case '紧张': return 'status-tension'
        case '滞销': return 'status-slow'
        default: return 'status-normal'
      }
    },
    
    // 跳转到员工数据分析
    goToEmployeeAnalysis(employee) {
      this.$router.push({
        path: '/employee-analysis',
        query: {
          employeeId: employee.id,
          employeeName: employee.name,
          dateRange: this.selectedDateRange,
          from: 'market_analysis'
        }
      })
    },
    
    // 显示客户明细
    showCustomerDetail(employee, type) {
      if (type === 'covered') {
        this.customerDetailTitle = `${employee.name} - 已铺货客户明细`
        this.currentCustomerDetail = this.generateCustomerDetail(employee, true)
      } else {
        this.customerDetailTitle = `${employee.name} - 未铺货客户明细`
        this.currentCustomerDetail = this.generateCustomerDetail(employee, false)
      }
      
      this.showCustomerDetailModal = true
    },
    
    // 生成客户明细数据（模拟）
    generateCustomerDetail(employee, isCovered) {
      const count = isCovered ? employee.stockedCustomers : employee.unstockedCustomers
      const customers = []
      
      for (let i = 1; i <= count; i++) {
        customers.push({
          id: i,
          name: `${employee.name}负责客户${String(i).padStart(3, '0')}`,
          address: `甘肃省${employee.area}市区域${i}号`,
          status: isCovered ? '已铺货' : '未铺货'
        })
      }
      
      return customers
    },
    
    // 跳转到单客分析
    goToCustomerAnalysis(brand) {
      this.$router.push({
        path: '/customer-analysis',
        query: {
          brandId: brand.id,
          brandName: brand.name,
          dateRange: this.selectedDateRange,
          from: 'market_analysis'
        }
      })
    },
    
    // 跳转到单品分析
    goToProductAnalysis(product) {
      this.$router.push({
        path: '/product-analysis',
        query: {
          productId: product.id,
          productName: product.name,
          dateRange: this.selectedDateRange,
          from: 'market_analysis'
        }
      })
    },
    
    // 应用筛选
    applyFilters() {
      this.showFilterModal = false
      // 筛选逻辑已在computed中处理
    },
    
    // 重置筛选
    resetFilters() {
      this.selectedEmployees = []
      this.selectedAreas = []
      this.rateRangeMin = null
      this.rateRangeMax = null
    },
    
    // 导出数据
    exportData() {
      const currentData = this.getCurrentData()
      const headers = this.getExportHeaders()
      
      console.log('导出数据:', {
        tab: this.activeTab,
        dateRange: this.selectedDateRange,
        dimension: this.currentDimension,
        dataCount: currentData.length,
        headers: headers
      })
      
      // 这里可以调用实际的导出功能
      alert(`正在导出${this.activeTab === 'customer' ? '客户' : this.activeTab === 'brand' ? '品牌' : '商品'}维度数据...`)
    },
    
    // 获取当前数据
    getCurrentData() {
      switch (this.activeTab) {
        case 'customer': return this.filteredEmployeeData
        case 'brand': return this.filteredBrandData
        case 'product': return this.filteredProductData
        default: return []
      }
    },
    
    // 获取导出表头
    getExportHeaders() {
      switch (this.activeTab) {
        case 'customer': 
          return ['员工名称', '铺货客户数', '未铺货客户数', '客户铺货率']
        case 'brand': 
          return ['品牌名称', '铺货门店数', '品牌铺货率', '销售额排名']
        case 'product': 
          return ['商品名称', '铺货量', '铺货区域', '库存状态']
        default: 
          return []
      }
    },
    
    // 重新加载数据
    reloadData() {
      console.log('重新加载数据:', {
        dateRange: this.selectedDateRange,
        dimension: this.currentDimension,
        tab: this.activeTab
      })
      
      // 这里可以调用API重新加载数据
    }
  },
  
  mounted() {
    // 初始化员工列表（用于筛选）
    this.allEmployees = this.employeeData.map(emp => ({
      id: emp.id,
      name: emp.name
    }))
    
    // 如果是从月报跳转过来，设置相应的参数
    if (this.$route.query.from === 'monthly_report') {
      const dateRange = this.$route.query.dateRange
      if (dateRange) {
        this.selectedDateRange = dateRange
      }
    }
  }
}
</script>

<style scoped>
/* 整体布局 */
.market-analysis {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 顶部操作区 */
.header-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ffffff;
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

.export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #0056d6;
}

.export-icon {
  width: 16px;
  height: 16px;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.time-filter,
.analysis-dimension {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.date-picker,
.dimension-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.date-picker:hover,
.dimension-selector:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.date-text,
.dimension-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.date-arrow,
.dimension-arrow {
  color: #666666;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
  background-color: #f8fbff;
}

.filter-icon {
  width: 16px;
  height: 16px;
}

/* 日期选择器弹窗 */
.date-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.date-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.date-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.date-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.date-content {
  padding: 16px 20px;
}

.quick-dates {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-date-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #333333;
  font-size: 14px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quick-date-btn:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.quick-date-btn.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

/* 维度下拉菜单 */
.dimension-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.dimension-menu {
  position: absolute;
  top: 120px;
  left: 150px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  min-width: 140px;
}

.dimension-option {
  padding: 12px 16px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.dimension-option:last-child {
  border-bottom: none;
}

.dimension-option:hover {
  background-color: #f8f9fa;
}

.dimension-option.active {
  background-color: #007AFF;
  color: #ffffff;
}

/* 标签区域 */
.tab-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 0 16px;
}

.tab-container {
  display: flex;
  gap: 0;
}

.tab-item {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #666666;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #007AFF;
}

.tab-item.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

/* 数据区域 */
.data-section {
  padding: 16px;
}

.summary-info {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid #eaeaea;
}

.summary-text {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

/* 列表样式 */
.customer-list,
.brand-list,
.product-list {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eaeaea;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.header-cell {
  padding: 14px 16px;
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  border-right: 1px solid #eaeaea;
}

.header-cell:last-child {
  border-right: none;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-row:hover {
  background-color: #f8fbff;
}

.list-row:last-child {
  border-bottom: none;
}

.row-cell {
  padding: 14px 16px;
  color: #333333;
  font-size: 14px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.row-cell:last-child {
  border-right: none;
}

.employee-name,
.brand-name,
.product-name {
  font-weight: 600;
  color: #007AFF;
}

.rate-value {
  font-weight: 600;
}

.rate-high {
  color: #00b42a;
}

.rate-medium {
  color: #ff9900;
}

.rate-low {
  color: #f53f3f;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-abundant {
  background-color: #e8f7e8;
  color: #00b42a;
}

.status-normal {
  background-color: #e8f4ff;
  color: #1890ff;
}

.status-tension {
  background-color: #fff7e6;
  color: #ff9900;
}

.status-slow {
  background-color: #fff1f0;
  color: #f53f3f;
}

/* 筛选弹窗 */
.filter-overlay {
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

.filter-modal {
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.filter-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.filter-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.filter-content {
  padding: 16px 20px;
  max-height: 400px;
  overflow-y: auto;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group-label {
  display: block;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  margin: 0;
}

.checkbox-label {
  color: #333333;
  font-size: 14px;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
}

.range-separator {
  color: #666666;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eaeaea;
}

.reset-btn {
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

.reset-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.apply-btn {
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

.apply-btn:hover {
  background-color: #0056d6;
}

/* 员工信息样式 */
.employee-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.employee-name-text {
  font-weight: 600;
  color: #333333;
}

.employee-department {
  font-size: 12px;
  color: #666666;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

/* 客户数量样式 */
.customer-count {
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}

.customer-count.covered {
  color: #00b42a;
}

.customer-count.covered:hover {
  color: #009a29;
}

.customer-count.uncovered {
  color: #f53f3f;
}

.customer-count.uncovered:hover {
  color: #d63031;
}

/* 客户明细弹窗 */
.detail-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.customer-detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.customer-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.customer-detail-item:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
}

.customer-address {
  font-size: 12px;
  color: #666666;
}

.customer-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-covered {
  background-color: #e8f7e8;
  color: #00b42a;
}

.status-uncovered {
  background-color: #fff1f0;
  color: #f53f3f;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .time-filter,
  .analysis-dimension {
    justify-content: space-between;
  }
  
  .list-header,
  .list-row {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
  
  .header-cell,
  .row-cell {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding: 8px 16px;
  }
  
  .header-cell:last-child,
  .row-cell:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .data-section {
    padding: 12px;
  }
  
  .filter-section {
    padding: 12px;
  }
  
  .header-bar {
    padding: 12px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

.date-overlay,
.dimension-overlay,
.filter-overlay {
  animation: fadeIn 0.2s ease-out;
}

.date-modal,
.filter-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
