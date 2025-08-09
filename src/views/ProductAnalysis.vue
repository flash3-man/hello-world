<template>
  <div class="product-analysis">
    <!-- 顶部操作区 - 商品与时间筛选 -->
    <div class="header-section">
      <div class="header-bar">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="page-title">单品分析</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-group">
          <label class="filter-label">时间范围：</label>
          <div class="time-picker" @click="showTimePicker = true">
            <span class="time-text">{{ selectedTimeRange }}</span>
            <svg class="time-arrow" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">商品选择：</label>
          <div class="product-picker" @click="showProductPicker = true">
            <span class="product-text">{{ selectedProductName }}</span>
            <svg class="product-arrow" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>

        <div class="comparison-tabs">
          <button 
            v-for="comparison in comparisonTypes" 
            :key="comparison.value"
            class="comparison-tab"
            :class="{ active: selectedComparison === comparison.value }"
            @click="selectComparison(comparison.value)"
          >
            {{ comparison.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 维度切换栏 - 基本信息/库存概况/采购情况/铺市信息 -->
    <div class="dimension-section">
      <div class="dimension-tabs">
        <button 
          v-for="dimension in dimensionTabs" 
          :key="dimension.value"
          class="dimension-tab"
          :class="{ active: activeDimension === dimension.value }"
          @click="switchDimension(dimension.value)"
        >
          {{ dimension.label }}
        </button>
      </div>
    </div>

    <!-- 数据展示区 - 单品数据 -->
    <div class="data-section">
      <!-- 核心指标卡片 -->
      <div class="metrics-cards">
        <div class="metric-card">
          <div class="metric-icon inventory">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="15" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M3 9L21 9" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ currentMetrics.inventoryStock }}</div>
            <div class="metric-label">库存数量</div>
            <div class="metric-change" :class="getChangeClass(currentMetrics.inventoryStockChange)">
              {{ currentMetrics.inventoryStockChange }}
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon sales">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 2L22 20H2L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ currentMetrics.salesVolume }}</div>
            <div class="metric-label">销售数量</div>
            <div class="metric-change" :class="getChangeClass(currentMetrics.salesVolumeChange)">
              {{ currentMetrics.salesVolumeChange }}
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon turnover">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ currentMetrics.turnoverRate }}</div>
            <div class="metric-label">周转率</div>
            <div class="metric-change" :class="getChangeClass(currentMetrics.turnoverRateChange)">
              {{ currentMetrics.turnoverRateChange }}
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon coverage">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12L12 16L16 12" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ currentMetrics.marketCoverage }}</div>
            <div class="metric-label">铺市覆盖率</div>
            <div class="metric-change" :class="getChangeClass(currentMetrics.marketCoverageChange)">
              {{ currentMetrics.marketCoverageChange }}
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势图表区域 -->
      <div class="chart-section">
        <div class="chart-header">
          <h3 class="chart-title">{{ getChartTitle() }}</h3>
          <div class="chart-controls">
            <button class="chart-control-btn" :class="{ active: chartType === 'trend' }" @click="chartType = 'trend'">
              趋势图
            </button>
            <button class="chart-control-btn" :class="{ active: chartType === 'comparison' }" @click="chartType = 'comparison'">
              对比图
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="mainChart" class="main-chart"></canvas>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="detail-table-section">
        <div class="table-header">
          <h3 class="table-title">详细数据</h3>
          <button class="export-table-btn" @click="exportTableData">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2L8 10M8 2L5 5M8 2L11 5M2 14L14 14" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            导出
          </button>
        </div>
        
        <div class="data-table">
          <!-- 基本信息数据表 -->
          <div v-if="activeDimension === 'basic_info'" class="table-content">
            <div class="table-row table-header-row">
              <div class="table-cell">商品编码</div>
              <div class="table-cell">商品名称</div>
              <div class="table-cell">规格型号</div>
              <div class="table-cell">所属品牌</div>
              <div class="table-cell">商品分类</div>
            </div>
            <div 
              v-for="product in basicInfoData" 
              :key="product.id"
              class="table-row"
            >
              <div class="table-cell product-code">{{ product.code }}</div>
              <div class="table-cell product-name">{{ product.name }}</div>
              <div class="table-cell">{{ product.specification }}</div>
              <div class="table-cell">{{ product.brand }}</div>
              <div class="table-cell">{{ product.category }}</div>
            </div>
          </div>

          <!-- 库存概况数据表 -->
          <div v-if="activeDimension === 'inventory_overview'" class="table-content">
            <div class="table-row table-header-row">
              <div class="table-cell">仓库</div>
              <div class="table-cell">当前库存</div>
              <div class="table-cell">安全库存</div>
              <div class="table-cell">可用库存</div>
              <div class="table-cell">库存状态</div>
            </div>
            <div 
              v-for="inventory in inventoryData" 
              :key="inventory.id"
              class="table-row"
            >
              <div class="table-cell">{{ inventory.warehouse }}</div>
              <div class="table-cell quantity">{{ inventory.currentStock }}</div>
              <div class="table-cell quantity">{{ inventory.safetyStock }}</div>
              <div class="table-cell quantity">{{ inventory.availableStock }}</div>
              <div class="table-cell">
                <span class="status-badge" :class="getInventoryStatusClass(inventory.status)">
                  {{ inventory.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- 采购情况数据表 -->
          <div v-if="activeDimension === 'procurement'" class="table-content">
            <div class="table-row table-header-row">
              <div class="table-cell">采购日期</div>
              <div class="table-cell">供应商</div>
              <div class="table-cell">采购数量</div>
              <div class="table-cell">采购单价</div>
              <div class="table-cell">采购金额</div>
            </div>
            <div 
              v-for="procurement in procurementData" 
              :key="procurement.id"
              class="table-row"
            >
              <div class="table-cell">{{ procurement.date }}</div>
              <div class="table-cell supplier">{{ procurement.supplier }}</div>
              <div class="table-cell quantity">{{ procurement.quantity }}</div>
              <div class="table-cell amount">{{ procurement.unitPrice }}</div>
              <div class="table-cell amount">{{ procurement.totalAmount }}</div>
            </div>
          </div>

          <!-- 铺市信息数据表 -->
          <div v-if="activeDimension === 'market_distribution'" class="table-content">
            <div class="table-row table-header-row">
              <div class="table-cell">区域</div>
              <div class="table-cell">铺货门店数</div>
              <div class="table-cell">总门店数</div>
              <div class="table-cell">铺货率</div>
              <div class="table-cell">销售表现</div>
            </div>
            <div 
              v-for="market in marketDistributionData" 
              :key="market.id"
              class="table-row"
            >
              <div class="table-cell">{{ market.region }}</div>
              <div class="table-cell quantity">{{ market.distributedStores }}</div>
              <div class="table-cell quantity">{{ market.totalStores }}</div>
              <div class="table-cell">
                <span class="rate-value" :class="getDistributionRateClass(market.distributionRate)">
                  {{ market.distributionRate }}%
                </span>
              </div>
              <div class="table-cell">
                <span class="performance-badge" :class="getPerformanceClass(market.performance)">
                  {{ market.performance }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间选择弹窗 -->
    <div v-if="showTimePicker" class="time-overlay" @click="showTimePicker = false">
      <div class="time-modal" @click.stop>
        <div class="time-header">
          <h3>选择时间范围</h3>
          <button class="time-close" @click="showTimePicker = false">✕</button>
        </div>
        <div class="time-content">
          <div class="time-options">
            <button 
              v-for="option in timeOptions" 
              :key="option.value"
              class="time-option-btn"
              :class="{ active: selectedTimeValue === option.value }"
              @click="selectTimeRange(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品选择弹窗 -->
    <div v-if="showProductPicker" class="product-overlay" @click="showProductPicker = false">
      <div class="product-modal" @click.stop>
        <div class="product-header">
          <h3>选择商品</h3>
          <button class="product-close" @click="showProductPicker = false">✕</button>
        </div>
        <div class="product-content">
          <div class="product-search">
            <input 
              type="text" 
              v-model="productSearchKeyword" 
              placeholder="搜索商品名称或编码..." 
              class="product-search-input"
            >
          </div>
          <div class="product-list">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="product-item"
              :class="{ active: selectedProductId === product.id }"
              @click="selectProduct(product)"
            >
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-code">{{ product.code }}</div>
                <div class="product-brand">{{ product.brand }}</div>
              </div>
              <div class="product-stats">
                <div class="stat-item">
                  <span class="stat-label">本月销量</span>
                  <span class="stat-value">{{ product.monthlySales }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">库存</span>
                  <span class="stat-value">{{ product.stock }}</span>
                </div>
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
  name: 'ProductAnalysis',
  data() {
    return {
      // 界面状态
      showTimePicker: false,
      showProductPicker: false,
      
      // 当前选择
      selectedTimeValue: 'current_month',
      selectedTimeRange: '06-01~06-20',
      selectedProductId: 1,
      selectedProductName: '兰州百合干片500g',
      selectedComparison: 'month_over_month',
      activeDimension: 'basic_info',
      chartType: 'trend',
      
      // 商品搜索
      productSearchKeyword: '',
      
      // 对比类型
      comparisonTypes: [
        { value: 'month_over_month', label: '环比' },
        { value: 'year_over_year', label: '同比' },
        { value: 'custom', label: '自定义对比' }
      ],
      
      // 时间选项
      timeOptions: [
        { value: 'current_month', label: '本月 (06-01~06-20)', range: '06-01~06-20', compareRange: '05-01~05-20' },
        { value: 'last_month', label: '上月 (05-01~05-20)', range: '05-01~05-20', compareRange: '04-01~04-20' },
        { value: 'current_quarter', label: '本季度 (04-01~06-20)', range: '04-01~06-20', compareRange: '01-01~03-31' },
        { value: 'current_year', label: '今年 (01-01~06-20)', range: '01-01~06-20', compareRange: '2024-01-01~2024-06-20' }
      ],
      
      // 维度标签
      dimensionTabs: [
        { value: 'basic_info', label: '基本信息' },
        { value: 'inventory_overview', label: '库存概况' },
        { value: 'procurement', label: '采购情况' },
        { value: 'market_distribution', label: '铺市信息' }
      ],
      
      // 商品列表
      productList: [
        {
          id: 1,
          name: '兰州百合干片500g',
          code: 'P00012580',
          brand: '陇原珍品',
          category: '农副产品',
          monthlySales: 850,
          stock: 1200
        },
        {
          id: 2,
          name: '天水花椒粉100g',
          code: 'P00012581',
          brand: '麦积山',
          category: '调味品',
          monthlySales: 620,
          stock: 800
        },
        {
          id: 3,
          name: '定西马铃薯淀粉1kg',
          code: 'P00012582',
          brand: '定西特产',
          category: '淀粉制品',
          monthlySales: 450,
          stock: 600
        },
        {
          id: 4,
          name: '庆阳苹果礼盒2kg',
          code: 'P00012583',
          brand: '陇东果业',
          category: '新鲜水果',
          monthlySales: 320,
          stock: 150
        },
        {
          id: 5,
          name: '酒泉葡萄干250g',
          code: 'P00012584',
          brand: '河西走廊',
          category: '干果',
          monthlySales: 280,
          stock: 400
        }
      ],
      
      // 当前指标数据
      currentMetrics: {
        inventoryStock: '1,200件',
        inventoryStockChange: '-5.2%',
        salesVolume: '850件',
        salesVolumeChange: '+18.6%',
        turnoverRate: '6.8次/月',
        turnoverRateChange: '+1.2次',
        marketCoverage: '78.5%',
        marketCoverageChange: '+4.3%'
      },
      
      // 基本信息数据
      basicInfoData: [
        {
          id: 1,
          code: 'P00012580',
          name: '兰州百合干片500g',
          specification: '500g/袋',
          brand: '陇原珍品',
          category: '农副产品'
        }
      ],
      
      // 库存概况数据
      inventoryData: [
        {
          id: 1,
          warehouse: '兰州中心仓',
          currentStock: '800件',
          safetyStock: '200件',
          availableStock: '750件',
          status: '正常'
        },
        {
          id: 2,
          warehouse: '天水分仓',
          currentStock: '150件',
          safetyStock: '100件',
          availableStock: '145件',
          status: '正常'
        },
        {
          id: 3,
          warehouse: '白银分仓',
          currentStock: '250件',
          safetyStock: '150件',
          availableStock: '240件',
          status: '正常'
        },
        {
          id: 4,
          warehouse: '酒泉分仓',
          currentStock: '80件',
          safetyStock: '120件',
          availableStock: '75件',
          status: '库存不足'
        }
      ],
      
      // 采购情况数据
      procurementData: [
        {
          id: 1,
          date: '2025-06-15',
          supplier: '兰州百合种植合作社',
          quantity: '500件',
          unitPrice: '15.80元',
          totalAmount: '7,900.00元'
        },
        {
          id: 2,
          date: '2025-06-08',
          supplier: '兰州百合种植合作社',
          quantity: '300件',
          unitPrice: '15.60元',
          totalAmount: '4,680.00元'
        },
        {
          id: 3,
          date: '2025-05-28',
          supplier: '兰州百合种植合作社',
          quantity: '800件',
          unitPrice: '15.50元',
          totalAmount: '12,400.00元'
        },
        {
          id: 4,
          date: '2025-05-20',
          supplier: '兰州百合种植合作社',
          quantity: '400件',
          unitPrice: '15.80元',
          totalAmount: '6,320.00元'
        }
      ],
      
      // 铺市信息数据
      marketDistributionData: [
        {
          id: 1,
          region: '兰州市',
          distributedStores: 45,
          totalStores: 52,
          distributionRate: 86.5,
          performance: '优秀'
        },
        {
          id: 2,
          region: '天水市',
          distributedStores: 28,
          totalStores: 38,
          distributionRate: 73.7,
          performance: '良好'
        },
        {
          id: 3,
          region: '白银市',
          distributedStores: 18,
          totalStores: 25,
          distributionRate: 72.0,
          performance: '良好'
        },
        {
          id: 4,
          region: '金昌市',
          distributedStores: 12,
          totalStores: 20,
          distributionRate: 60.0,
          performance: '一般'
        },
        {
          id: 5,
          region: '酒泉市',
          distributedStores: 15,
          totalStores: 28,
          distributionRate: 53.6,
          performance: '待改善'
        }
      ]
    }
  },
  
  computed: {
    // 过滤商品列表
    filteredProducts() {
      if (!this.productSearchKeyword) {
        return this.productList
      }
      return this.productList.filter(product => 
        product.name.toLowerCase().includes(this.productSearchKeyword.toLowerCase()) ||
        product.code.toLowerCase().includes(this.productSearchKeyword.toLowerCase())
      )
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 选择时间范围
    selectTimeRange(option) {
      this.selectedTimeValue = option.value
      this.selectedTimeRange = option.range
      this.showTimePicker = false
      this.loadProductData()
    },
    
    // 选择商品
    selectProduct(product) {
      this.selectedProductId = product.id
      this.selectedProductName = product.name
      this.showProductPicker = false
      this.loadProductData()
    },
    
    // 选择对比方式
    selectComparison(comparison) {
      this.selectedComparison = comparison
      this.loadProductData()
    },
    
    // 切换维度
    switchDimension(dimension) {
      this.activeDimension = dimension
      this.updateChart()
    },
    
    // 获取图表标题
    getChartTitle() {
      const titles = {
        basic_info: '商品基本信息',
        inventory_overview: '库存变化趋势',
        procurement: '采购金额趋势',
        market_distribution: '铺市覆盖率趋势'
      }
      return titles[this.activeDimension] || '数据趋势'
    },
    
    // 获取变化样式类
    getChangeClass(change) {
      if (change.includes('+') || change.includes('↑')) return 'change-positive'
      if (change.includes('-') || change.includes('↓')) return 'change-negative'
      return 'change-neutral'
    },
    
    // 获取库存状态样式类
    getInventoryStatusClass(status) {
      const statusMap = {
        '正常': 'status-normal',
        '库存不足': 'status-low',
        '库存紧张': 'status-critical',
        '缺货': 'status-out'
      }
      return statusMap[status] || 'status-default'
    },
    
    // 获取铺货率样式类
    getDistributionRateClass(rate) {
      if (rate >= 80) return 'rate-excellent'
      if (rate >= 70) return 'rate-good'
      if (rate >= 60) return 'rate-fair'
      return 'rate-poor'
    },
    
    // 获取销售表现样式类
    getPerformanceClass(performance) {
      const performanceMap = {
        '优秀': 'performance-excellent',
        '良好': 'performance-good',
        '一般': 'performance-fair',
        '待改善': 'performance-poor'
      }
      return performanceMap[performance] || 'performance-default'
    },
    
    // 加载商品数据
    loadProductData() {
      console.log('加载商品数据:', {
        productId: this.selectedProductId,
        timeRange: this.selectedTimeRange,
        comparison: this.selectedComparison,
        dimension: this.activeDimension
      })
      
      // 更新图表
      this.updateChart()
    },
    
    // 更新图表
    updateChart() {
      this.$nextTick(() => {
        this.drawChart()
      })
    },
    
    // 绘制图表
    drawChart() {
      const canvas = this.$refs.mainChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (this.chartType === 'trend') {
        this.drawTrendChart(ctx, canvas.width, canvas.height)
      } else {
        this.drawComparisonChart(ctx, canvas.width, canvas.height)
      }
    },
    
    // 绘制趋势图
    drawTrendChart(ctx, width, height) {
      const padding = 40
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      // 模拟数据
      const data = [1050, 1180, 950, 1320, 1200, 980, 1150, 1280, 1100, 1200]
      const maxValue = Math.max(...data)
      const minValue = Math.min(...data)
      const range = maxValue - minValue
      
      // 绘制网格
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      
      // 水平网格线
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }
      
      // 垂直网格线
      for (let i = 0; i <= data.length - 1; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()
      }
      
      // 绘制趋势线
      ctx.strokeStyle = '#52c41a'
      ctx.lineWidth = 3
      ctx.beginPath()
      
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((value - minValue) / range) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // 绘制数据点
      ctx.fillStyle = '#52c41a'
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((value - minValue) / range) * chartHeight
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
    },
    
    // 绘制对比图
    drawComparisonChart(ctx, width, height) {
      const padding = 40
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      // 模拟对比数据
      const currentData = [1200, 1280, 1100, 1350, 1180]
      const compareData = [1050, 1150, 980, 1220, 1080]
      const labels = ['第1周', '第2周', '第3周', '第4周', '第5周']
      
      const maxValue = Math.max(...currentData, ...compareData)
      const barWidth = chartWidth / (labels.length * 3)
      
      // 绘制柱状图
      labels.forEach((label, index) => {
        const x = padding + (chartWidth / labels.length) * index + barWidth / 2
        
        // 当前期间
        const currentHeight = (currentData[index] / maxValue) * chartHeight
        ctx.fillStyle = '#52c41a'
        ctx.fillRect(x, height - padding - currentHeight, barWidth, currentHeight)
        
        // 对比期间
        const compareHeight = (compareData[index] / maxValue) * chartHeight
        ctx.fillStyle = '#faad14'
        ctx.fillRect(x + barWidth + 5, height - padding - compareHeight, barWidth, compareHeight)
      })
      
      // 绘制图例
      ctx.fillStyle = '#52c41a'
      ctx.fillRect(width - 150, 20, 15, 15)
      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.fillText('当前期间', width - 130, 32)
      
      ctx.fillStyle = '#faad14'
      ctx.fillRect(width - 150, 40, 15, 15)
      ctx.fillStyle = '#333'
      ctx.fillText('对比期间', width - 130, 52)
    },
    
    // 导出表格数据
    exportTableData() {
      const dimensionNames = {
        basic_info: '基本信息',
        inventory_overview: '库存概况',
        procurement: '采购情况',
        market_distribution: '铺市信息'
      }
      
      console.log('导出数据:', {
        dimension: dimensionNames[this.activeDimension],
        product: this.selectedProductName,
        timeRange: this.selectedTimeRange
      })
      
      alert(`正在导出${dimensionNames[this.activeDimension]}数据...`)
    }
  },
  
  mounted() {
    // 从路由参数获取初始数据
    if (this.$route.query.productId) {
      const productId = parseInt(this.$route.query.productId)
      const product = this.productList.find(p => p.id === productId)
      if (product) {
        this.selectedProductId = product.id
        this.selectedProductName = product.name
      }
    }
    
    if (this.$route.query.dateRange) {
      this.selectedTimeRange = this.$route.query.dateRange
    }
    
    // 设置画布尺寸并绘制图表
    this.$nextTick(() => {
      if (this.$refs.mainChart) {
        this.$refs.mainChart.width = 600
        this.$refs.mainChart.height = 300
        this.drawChart()
      }
    })
  }
}
</script>

<style scoped>
/* 整体布局 */
.product-analysis {
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

.header-spacer {
  width: 32px;
}

/* 筛选区域 */
.filter-section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-label {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
}

.time-picker,
.product-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  max-width: 250px;
}

.time-picker:hover,
.product-picker:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.time-text,
.product-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.time-arrow,
.product-arrow {
  color: #666666;
}

.comparison-tabs {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.comparison-tab {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666666;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.comparison-tab:hover {
  border-color: #007AFF;
  background-color: #f0f8ff;
  color: #007AFF;
}

.comparison-tab.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

/* 维度切换区 */
.dimension-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 0 16px;
}

.dimension-tabs {
  display: flex;
  gap: 0;
}

.dimension-tab {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #666666;
  font-size: 15px;
  font-weight: 500;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dimension-tab:hover {
  color: #007AFF;
}

.dimension-tab.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

/* 数据区域 */
.data-section {
  padding: 16px;
}

/* 指标卡片 */
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.inventory {
  background-color: #e6f7ff;
  color: #1890ff;
}

.metric-icon.sales {
  background-color: #f6ffed;
  color: #52c41a;
}

.metric-icon.turnover {
  background-color: #fff7e6;
  color: #faad14;
}

.metric-icon.coverage {
  background-color: #fff1f0;
  color: #f5222d;
}

.metric-content {
  flex: 1;
}

.metric-value {
  color: #333333;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.metric-label {
  color: #666666;
  font-size: 13px;
  margin-bottom: 6px;
}

.metric-change {
  font-size: 12px;
  font-weight: 600;
}

.change-positive {
  color: #52c41a;
}

.change-negative {
  color: #f5222d;
}

.change-neutral {
  color: #666666;
}

/* 图表区域 */
.chart-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-control-btn {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666666;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-control-btn:hover {
  border-color: #007AFF;
  background-color: #f0f8ff;
  color: #007AFF;
}

.chart-control-btn.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

.chart-container {
  display: flex;
  justify-content: center;
}

.main-chart {
  max-width: 100%;
  height: auto;
}

/* 详细表格区域 */
.detail-table-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.export-table-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-table-btn:hover {
  background-color: #0056d6;
}

.data-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eaeaea;
}

.table-content {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-header-row {
  background-color: #f8f9fa;
}

.table-header-row .table-cell {
  color: #666666;
  font-weight: 600;
}

.table-cell {
  padding: 12px 16px;
  color: #333333;
  font-size: 14px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  border-right: none;
}

.product-code {
  color: #007AFF;
  font-weight: 500;
  font-family: monospace;
}

.product-name {
  font-weight: 600;
  color: #333333;
}

.quantity {
  font-weight: 600;
  color: #52c41a;
}

.amount {
  font-weight: 600;
  color: #333333;
}

.supplier {
  color: #1890ff;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-normal {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-low {
  background-color: #fff7e6;
  color: #faad14;
}

.status-critical {
  background-color: #fff1f0;
  color: #f5222d;
}

.status-out {
  background-color: #f5f5f5;
  color: #8c8c8c;
}

.rate-value {
  font-weight: 600;
}

.rate-excellent {
  color: #52c41a;
}

.rate-good {
  color: #1890ff;
}

.rate-fair {
  color: #faad14;
}

.rate-poor {
  color: #f5222d;
}

.performance-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.performance-excellent {
  background-color: #f6ffed;
  color: #52c41a;
}

.performance-good {
  background-color: #e6f7ff;
  color: #1890ff;
}

.performance-fair {
  background-color: #fff7e6;
  color: #faad14;
}

.performance-poor {
  background-color: #fff1f0;
  color: #f5222d;
}

/* 时间选择弹窗 */
.time-overlay {
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

.time-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.time-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.time-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.time-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.time-content {
  padding: 16px 20px;
}

.time-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-option-btn {
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

.time-option-btn:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.time-option-btn.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

/* 商品选择弹窗 */
.product-overlay {
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

.product-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.product-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.product-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.product-content {
  padding: 16px 20px;
  max-height: 500px;
  overflow-y: auto;
}

.product-search {
  margin-bottom: 16px;
}

.product-search-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.product-item:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.product-item.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.product-code {
  font-size: 12px;
  opacity: 0.7;
  font-family: monospace;
  margin-bottom: 2px;
}

.product-brand {
  font-size: 13px;
  opacity: 0.8;
}

.product-stats {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  opacity: 0.7;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    padding: 12px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .time-picker,
  .product-picker {
    max-width: none;
  }
  
  .metrics-cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .table-row {
    grid-template-columns: 1fr;
  }
  
  .table-cell {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding: 8px 16px;
  }
}

@media (max-width: 480px) {
  .data-section {
    padding: 12px;
  }
  
  .dimension-tab {
    padding: 12px 16px;
    font-size: 14px;
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

.time-overlay,
.product-overlay {
  animation: fadeIn 0.2s ease-out;
}

.time-modal,
.product-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
