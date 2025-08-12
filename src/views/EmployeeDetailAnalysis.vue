<template>
  <div class="employee-detail-analysis">
    <!-- 模块 1：顶部导航区 -->
    <div class="header-bar">
      <div class="current-time">{{ currentTime }}</div>
      <h1 class="page-title">{{ employeeName }}的数据分析</h1>
      <button class="follow-btn" @click="toggleFollow">
        {{ isFollowing ? '已关注' : '关注' }}
      </button>
    </div>

    <!-- 员工切换 -->
    <div class="employee-switcher">
      <button 
        v-for="emp in availableEmployees" 
        :key="emp.id"
        class="employee-tab"
        :class="{ active: emp.id === currentEmployeeId }"
        @click="switchEmployee(emp.id)"
      >
        {{ emp.name }}
      </button>
    </div>

    <!-- 模块 2：时间筛选区 -->
    <div class="time-filter-section">
      <div class="time-selector" @click="showStatisticalTimePicker">
        <span class="time-label">统计时间：</span>
        <span class="time-value">2024年{{ statisticalTime }}</span>
        <i class="time-arrow">📅</i>
      </div>
      <div class="time-selector" @click="showComparisonTimePicker">
        <span class="time-label">对比时间：</span>
        <span class="time-value">2024年{{ comparisonTime }}</span>
        <i class="time-arrow">📅</i>
      </div>
    </div>

    <!-- 模块 3：综合实力展现 -->
    <div class="comprehensive-ability-section">
      <div class="section-header">
        <h3 class="section-title">综合实力展现</h3>
        <button class="indicator-help" @click="showIndicatorModal">
          <span class="help-text">指标说明</span>
          <i class="help-icon">?</i>
        </button>
      </div>
      
      <!-- 雷达图容器和排名 -->
      <div class="radar-chart-container" @click="showRadarModal = true" style="cursor: zoom-in;">
        <canvas ref="radarChart" class="radar-chart" width="400" height="400"></canvas>
        <div class="ranking-info">
          <span class="rank-text">综合实力第</span>
          <span class="rank-number">{{ comprehensiveRank }}</span>
          <span class="rank-text">名</span>
        </div>
      </div>
      <!-- 雷达图放大弹窗 -->
      <div v-if="showRadarModal" class="radar-modal" @click.self="showRadarModal = false">
        <div class="radar-modal-content">
          <canvas ref="radarChartLarge" class="radar-chart-large" width="600" height="600"></canvas>
          <button class="close-btn" @click="showRadarModal = false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 模块 4：订单能力区 -->
    <div class="order-ability-section">
      <h3 class="section-title">订单能力</h3>
      <div class="order-metrics-grid">
        <div class="metric-item">
          <div class="metric-label">再访订单率</div>
          <div class="metric-value">{{ orderData.revisitOrderRate }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">拜访过客户数/拜访客户数</div>
          <div class="metric-value">{{ orderData.visitedCustomers }}/{{ orderData.totalVisits }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">单访订单SKU数</div>
          <div class="metric-value">{{ orderData.avgSkuPerVisit }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">累计订单SKU数/销售订单数</div>
          <div class="metric-value">{{ orderData.totalSku }}/{{ orderData.totalOrders }}</div>
        </div>
      </div>
    </div>

    <!-- 模块 5：销售分析区 -->
    <div class="sales-analysis-section">
      <h3 class="section-title">销售分析</h3>
      
      <!-- 订单变化情况 -->
      <div class="analysis-subsection">
        <h4 class="subsection-title">订单变化情况</h4>
        <div class="metrics-row">
          <div class="metric-group">
            <div class="metric-label">订单金额(元)</div>
            <div class="metric-value primary">{{ formatAmount(salesData.orderAmount) }}</div>
          </div>
          <div class="metric-group">
            <div class="metric-label">对比值(元)</div>
            <div class="metric-value change-positive">{{ formatAmount(salesData.comparisonValue) }}</div>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-group">
            <div class="metric-label">变化值(元)</div>
            <div class="metric-value">{{ formatAmount(salesData.changeValue) }}</div>
          </div>
          <div class="metric-group">
            <div class="metric-label">变化率</div>
            <div class="metric-value change-rate">{{ salesData.changeRate }}%</div>
          </div>
        </div>
      </div>

      <!-- 销售趋势 -->
      <div class="analysis-subsection">
        <h4 class="subsection-title">销售趋势</h4>
        <div class="chart-description">
          <p class="chart-info">显示过去13个月的销售金额变化趋势</p>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color trend-line"></span>
              销售金额（元）
            </span>
          </div>
        </div>
        <div class="trend-chart-container">
          <canvas ref="salesTrendChart" class="trend-chart" width="320" height="120"></canvas>
        </div>
        <div class="chart-summary">
          <div class="summary-item">
            <span class="summary-label">趋势方向：</span>
            <span class="summary-value trend-up">上升</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">平均增长：</span>
            <span class="summary-value">+12.5%</span>
          </div>
        </div>
        <div class="comparison-note">
          <button class="comparison-link" @click="showSalesComparison">
            对比其他员工的销售变化情况
          </button>
        </div>
      </div>

      <!-- 成交客单价分析 -->
      <div class="analysis-subsection">
        <h4 class="subsection-title">成交客单价分析</h4>
        <div class="metrics-row">
          <div class="metric-group">
            <div class="metric-label">成交客单价(元)</div>
            <div class="metric-value primary">{{ formatAmount(salesData.avgOrderValue) }}</div>
          </div>
          <div class="metric-group">
            <div class="metric-label">对比值(元)</div>
            <div class="metric-value">{{ formatAmount(salesData.avgOrderComparison) }}</div>
          </div>
        </div>
        <div class="metrics-row">
          <div class="metric-group">
            <div class="metric-label">变化值(元)</div>
            <div class="metric-value">{{ formatAmount(salesData.avgOrderChange) }}</div>
          </div>
          <div class="metric-group">
            <div class="metric-label">变化率</div>
            <div class="metric-value">{{ salesData.avgOrderChangeRate || '-' }}</div>
          </div>
        </div>
        <div class="chart-description">
          <p class="chart-info">显示过去13个月的客单价变化趋势</p>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color trend-line"></span>
              客单价（元）
            </span>
          </div>
        </div>
        <div class="trend-chart-container">
          <canvas ref="avgOrderTrendChart" class="trend-chart" width="320" height="120"></canvas>
        </div>
        <div class="chart-summary">
          <div class="summary-item">
            <span class="summary-label">趋势方向：</span>
            <span class="summary-value trend-up">上升</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">平均增长：</span>
            <span class="summary-value">+9.8%</span>
          </div>
        </div>
      </div>

      <!-- 问题定位入口 -->
      <div class="problem-location">
        <button class="locate-problem-btn" @click="navigateToCustomerAnalysis">
          定位问题：客户订单金额变化分析
        </button>
      </div>
    </div>

    <!-- 模块 6：退货分析区 -->
    <div class="return-analysis-section">
      <h3 class="section-title">退货分析</h3>
      
      <div class="analysis-subsection">
        <h4 class="subsection-title">退货变化情况</h4>
        <div class="metrics-row">
          <div class="metric-group">
            <div class="metric-label">退货金额(元)</div>
            <div class="metric-value">{{ formatAmount(returnData.returnAmount) }}</div>
          </div>
          <div class="metric-group">
            <div class="metric-label">对比值(元)</div>
            <div class="metric-value">{{ formatAmount(returnData.comparisonValue) }}</div>
          </div>
        </div>
        <div class="chart-description">
          <p class="chart-info">显示过去13个月的退货金额变化趋势</p>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color trend-line"></span>
              退货金额（元）
            </span>
          </div>
        </div>
        <div class="trend-chart-container">
          <canvas ref="returnTrendChart" class="trend-chart" width="320" height="120"></canvas>
          <div class="axis-label x-axis">月份</div>
          <div class="axis-label y-axis">金额(元)</div>
        </div>
        <div class="chart-summary">
          <div class="summary-item">
            <span class="summary-label">趋势方向：</span>
            <span class="summary-value trend-down">下降</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">平均减少：</span>
            <span class="summary-value">-8.3%</span>
          </div>
        </div>
        <div class="problem-location">
          <button class="locate-problem-btn" @click="navigateToReturnAnalysis">
            定位问题：商品退货金额分析
          </button>
        </div>
      </div>
    </div>

    <!-- 模块 7：回款分析区 -->
    <div class="payment-analysis-section">
      <h3 class="section-title">回款分析</h3>
      
      <div class="analysis-subsection">
        <h4 class="subsection-title">回款变化情况</h4>
        <div class="metrics-row">
          <div class="metric-group">
            <div class="metric-label">销售已结存(元)</div>
            <div class="metric-value">{{ formatAmount(paymentData.settledAmount) }}</div>
          </div>
          <div class="metric-group">
            <div class="metric-label">对比值(元)</div>
            <div class="metric-value">{{ formatAmount(paymentData.comparisonValue) }}</div>
          </div>
        </div>
        <div class="chart-description">
          <p class="chart-info">显示过去13个月的回款金额变化趋势</p>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color trend-line"></span>
              回款金额（元）
            </span>
          </div>
        </div>
        <div class="trend-chart-container">
          <canvas ref="paymentTrendChart" class="trend-chart" width="320" height="120"></canvas>
          <div class="axis-label x-axis">月份</div>
          <div class="axis-label y-axis">金额(元)</div>
        </div>
        <div class="chart-summary">
          <div class="summary-item">
            <span class="summary-label">趋势方向：</span>
            <span class="summary-value trend-up">上升</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">平均增长：</span>
            <span class="summary-value">+15.2%</span>
          </div>
        </div>
        <div class="problem-location">
          <button class="locate-problem-btn" @click="navigateToPaymentAnalysis">
            定位问题：其他员工销售已结变化分析
          </button>
        </div>
      </div>
    </div>

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicator" class="indicator-modal" @click="hideIndicatorModal">
      <div class="modal-content" @click.stop>
        <h4>雷达图指标说明</h4>
        <div class="indicator-item">
          <strong>勤奋度：</strong>拜访客户数/目标值，反映员工工作积极性
        </div>
        <div class="indicator-item">
          <strong>回款：</strong>回款金额/销售金额，反映资金回收能力
        </div>
        <div class="indicator-item">
          <strong>销售：</strong>销售金额/目标值，反映销售业绩达成度
        </div>
        <div class="indicator-item">
          <strong>拓客：</strong>新客户数/目标值，反映客户开发能力
        </div>
        <div class="indicator-item">
          <strong>退货风险：</strong>100-退货率，数值越高风险越低
        </div>
        <div class="indicator-item">
          <strong>订单：</strong>订单数/目标值，反映订单获取能力
        </div>
        <button class="close-btn" @click="hideIndicatorModal">关闭</button>
      </div>
    </div>

    <!-- 统计时间选择弹窗 -->
    <div v-if="showStatisticalModal" class="time-modal" @click="hideStatisticalTimePicker">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>选择统计时间</h4>
          <button class="close-btn" @click="hideStatisticalTimePicker">×</button>
        </div>
        <div class="time-options">
          <div class="quick-options">
            <h5>快捷选择</h5>
            <div class="quick-buttons">
              <button 
                v-for="option in quickTimeOptions" 
                :key="option.value"
                class="quick-btn"
                @click="selectQuickTime('statistical', option)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="custom-range">
            <h5>自定义时间范围</h5>
            <div class="date-inputs">
              <div class="input-group">
                <label>开始日期</label>
                <input 
                  type="date" 
                  v-model="customStatisticalStart"
                  class="date-input"
                />
              </div>
              <div class="input-group">
                <label>结束日期</label>
                <input 
                  type="date" 
                  v-model="customStatisticalEnd"
                  class="date-input"
                />
              </div>
            </div>
            <button class="apply-btn" @click="applyCustomTime('statistical')">
              应用自定义时间
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比时间选择弹窗 -->
    <div v-if="showComparisonModal" class="time-modal" @click="hideComparisonTimePicker">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>选择对比时间</h4>
          <button class="close-btn" @click="hideComparisonTimePicker">×</button>
        </div>
        <div class="time-options">
          <div class="quick-options">
            <h5>快捷选择</h5>
            <div class="quick-buttons">
              <button 
                v-for="option in quickTimeOptions" 
                :key="option.value"
                class="quick-btn"
                @click="selectQuickTime('comparison', option)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="custom-range">
            <h5>自定义时间范围</h5>
            <div class="date-inputs">
              <div class="input-group">
                <label>开始日期</label>
                <input 
                  type="date" 
                  v-model="customComparisonStart"
                  class="date-input"
                />
              </div>
              <div class="input-group">
                <label>结束日期</label>
                <input 
                  type="date" 
                  v-model="customComparisonEnd"
                  class="date-input"
                />
              </div>
            </div>
            <button class="apply-btn" @click="applyCustomTime('comparison')">
              应用自定义时间
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeDetailAnalysis',
  data() {
    return {
      currentTime: '16:05',
      employeeName: '黄保杰',
      currentEmployeeId: 1,
      isFollowing: false,
      showIndicator: false,
      showStatisticalModal: false,
      showComparisonModal: false,
      showRadarModal: false,
      statisticalTime: '06-01～06-20',
      comparisonTime: '05-01～05-20',
      customStatisticalStart: '2024-06-01',
      customStatisticalEnd: '2024-06-20',
      customComparisonStart: '2024-05-01',
      customComparisonEnd: '2024-05-20',
      comprehensiveRank: 1,
      
      // 可选择的员工列表
      availableEmployees: [
        { id: 1, name: '黄保杰' },
        { id: 2, name: '优胜丽' },
        { id: 3, name: '王飞' },
        { id: 4, name: '李明' }
      ],

      // 快捷时间选项
      quickTimeOptions: [
        { value: 'today', label: '今天', days: 0 },
        { value: 'yesterday', label: '昨天', days: 1 },
        { value: 'last7', label: '近7天', days: 7 },
        { value: 'last15', label: '近15天', days: 15 },
        { value: 'last30', label: '近30天', days: 30 },
        { value: 'thisMonth', label: '本月', days: 'thisMonth' },
        { value: 'lastMonth', label: '上月', days: 'lastMonth' },
        { value: 'thisQuarter', label: '本季度', days: 'thisQuarter' },
        { value: 'lastQuarter', label: '上季度', days: 'lastQuarter' }
      ],

      // 雷达图数据
      radarData: {
        labels: ['拜访效率', '销售能力', '客户维护', '产品推广', '回款能力', '团队协作'],
        datasets: [{
          data: [90, 85, 95, 88, 92, 87],
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          borderColor: 'rgba(74, 144, 226, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(74, 144, 226, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },

      // 订单数据
      orderData: {
        avgSkuPerVisit: 1.17,
        totalSku: 14,
        totalOrders: 12,
        revisitOrderRate: 85.5,
        visitedCustomers: 45,
        totalVisits: 52
      },

      // 销售数据
      salesData: {
        orderAmount: 14145.12,
        comparisonValue: 776.00,
        changeValue: 13369.12,
        changeRate: 1722.82,
        avgOrderValue: 1122.35,
        avgOrderComparison: 0.00,
        avgOrderChange: 1122.35,
        avgOrderChangeRate: null
      },
      
      // 退货数据
      returnData: {
        returnAmount: 0.00,
        comparisonValue: 0.00
      },
      
      // 回款数据
      paymentData: {
        settledAmount: 4879.60,
        comparisonValue: 0.00
      }
    }
  },
  
  mounted() {
    this.initializeTime()
    this.checkRouteParams()
    this.$nextTick(() => {
      this.initializeCharts()
    })
  },
  
  methods: {
    // 初始化时间
    initializeTime() {
      const now = new Date()
      this.currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    },
    
    // 检查路由参数
    checkRouteParams() {
      const employeeId = this.$route.query.employeeId
      const employeeName = this.$route.query.employeeName
      
      if (employeeId && employeeName) {
        this.currentEmployeeId = parseInt(employeeId)
        this.employeeName = employeeName
        this.loadEmployeeData(this.currentEmployeeId)
      }
    },
    
    // 切换员工
    switchEmployee(employeeId) {
      const employee = this.availableEmployees.find(emp => emp.id === employeeId)
      if (employee) {
        this.currentEmployeeId = employeeId
        this.employeeName = employee.name
        this.loadEmployeeData(employeeId)
        this.updateCharts()
      }
    },
    
    // 加载员工数据
    loadEmployeeData(employeeId) {
      // 根据员工ID模拟不同的数据
      const multiplier = (employeeId % 4 + 1) * 0.8
      
      // 更新雷达图数据
      this.radarData.datasets[0].data = [
        Math.round(90 * multiplier),
        Math.round(85 * (0.8 + (employeeId % 3) * 0.1)),
        Math.round(95 * multiplier),
        Math.round(88 * (0.7 + (employeeId % 4) * 0.1)),
        Math.round(92 * (0.9 + (employeeId % 2) * 0.05)),
        Math.round(87 * multiplier)
      ]
      
      // 更新销售数据
      this.salesData = {
        orderAmount: parseFloat((14145.12 * multiplier).toFixed(2)),
        comparisonValue: parseFloat((776.00 * (0.5 + (employeeId % 3) * 0.3)).toFixed(2)),
        changeValue: parseFloat((13369.12 * multiplier).toFixed(2)),
        changeRate: parseFloat((1722.82 * (0.6 + (employeeId % 4) * 0.2)).toFixed(2)),
        avgOrderValue: parseFloat((1122.35 * multiplier).toFixed(2)),
        avgOrderComparison: 0.00,
        avgOrderChange: parseFloat((1122.35 * multiplier).toFixed(2)),
        avgOrderChangeRate: null
      }
      
      // 更新排名
      this.comprehensiveRank = employeeId
    },
    
    // 初始化图表
    initializeCharts() {
      this.initRadarChart()
      this.initTrendCharts()
    },
    
    // 初始化雷达图
    initRadarChart() {
      const canvas = this.$refs.radarChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 100
      
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 绘制雷达网格
      this.drawRadarGrid(ctx, centerX, centerY, radius)
      
      // 绘制数据
      this.drawRadarData(ctx, centerX, centerY, radius)
      
      // 绘制标签
      this.drawRadarLabels(ctx, centerX, centerY, radius + 20)
    },

    // 初始化放大雷达图
    initRadarChartLarge() {
      const canvas = this.$refs.radarChartLarge
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 220

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制雷达网格
      this.drawRadarGrid(ctx, centerX, centerY, radius)

      // 绘制数据
      this.drawRadarData(ctx, centerX, centerY, radius)

      // 绘制标签
      this.drawRadarLabels(ctx, centerX, centerY, radius + 30)
    },

    // 绘制雷达网格
    drawRadarGrid(ctx, centerX, centerY, radius) {
      const sides = 6
      const step = (Math.PI * 2) / sides
      
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1
      
      // 绘制同心圆
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        const r = (radius * i) / 5
        for (let j = 0; j <= sides; j++) {
          const angle = j * step - Math.PI / 2
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }
      
      // 绘制放射线
      for (let i = 0; i < sides; i++) {
        ctx.beginPath()
        const angle = i * step - Math.PI / 2
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        )
        ctx.stroke()
      }
    },
    
    // 绘制雷达数据
    drawRadarData(ctx, centerX, centerY, radius) {
      const data = this.radarData.datasets[0].data
      const sides = data.length
      const step = (Math.PI * 2) / sides
      
      ctx.fillStyle = 'rgba(74, 144, 226, 0.2)'
      ctx.strokeStyle = '#4A90E2'
      ctx.lineWidth = 2
      
      ctx.beginPath()
      for (let i = 0; i < sides; i++) {
        const angle = i * step - Math.PI / 2
        const value = data[i] / 100 // 假设最大值为100
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // 绘制数据点
      ctx.fillStyle = '#4A90E2'
      for (let i = 0; i < sides; i++) {
        const angle = i * step - Math.PI / 2
        const value = data[i] / 100
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    
    // 绘制雷达标签
    drawRadarLabels(ctx, centerX, centerY, radius) {
      const labels = this.radarData.labels
      const data = this.radarData.datasets[0].data
      const sides = labels.length
      const step = (Math.PI * 2) / sides
      
      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      for (let i = 0; i < sides; i++) {
        const angle = i * step - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // 调整文本位置避免重叠
        let offsetX = 0
        let offsetY = 0
        if (Math.cos(angle) > 0.5) offsetX = 10
        if (Math.cos(angle) < -0.5) offsetX = -10
        if (Math.sin(angle) > 0.5) offsetY = 10
        if (Math.sin(angle) < -0.5) offsetY = -10
        
        ctx.fillText(labels[i], x + offsetX, y + offsetY)
        ctx.fillText(data[i], x + offsetX, y + offsetY + 15)
      }
    },
    
    // 初始化趋势图
    initTrendCharts() {
      this.drawTrendChart(this.$refs.salesTrendChart, this.generateTrendData())
      this.drawTrendChart(this.$refs.avgOrderTrendChart, this.generateTrendData())
      this.drawTrendChart(this.$refs.returnTrendChart, this.generateTrendData(true))
      this.drawTrendChart(this.$refs.paymentTrendChart, this.generateTrendData())
    },
    
    // 生成趋势数据
    generateTrendData(isReturn = false) {
      const data = []
      const baseValue = isReturn ? 100 : 1000
      for (let i = 0; i < 13; i++) {
        data.push(baseValue + Math.random() * 500 * (isReturn ? 0.1 : 1))
      }
      return data
    },
    
    // 绘制趋势图
    drawTrendChart(canvas, data) {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      const padding = 20
      ctx.clearRect(0, 0, width, height)
      // 计算数据范围
      const maxValue = Math.max(...data)
      const minValue = Math.min(...data)
      const range = maxValue - minValue || 1
      // 绘制坐标轴
      ctx.save()
      ctx.strokeStyle = '#bbb'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, height - padding)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding, height - padding)
      ctx.lineTo(width - padding, height - padding)
      ctx.stroke()
      ctx.restore()
      // y轴刻度和标签
      ctx.save()
      ctx.fillStyle = '#888'
      ctx.font = '12px Arial'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      for (let i = 0; i <= 4; i++) {
        const value = minValue + (range * (4 - i)) / 4
        const y = padding + ((height - 2 * padding) * i) / 4
        ctx.beginPath()
        ctx.moveTo(padding - 4, y)
        ctx.lineTo(padding, y)
        ctx.stroke()
        ctx.fillText(value.toFixed(0), padding - 6, y)
      }
      ctx.restore()
      // x轴刻度和标签
      ctx.save()
      ctx.fillStyle = '#888'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','本月']
      for (let i = 0; i < data.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1)
        ctx.beginPath()
        ctx.moveTo(x, height - padding)
        ctx.lineTo(x, height - padding + 4)
        ctx.stroke()
        ctx.fillText(months[i] || (i+1), x, height - padding + 6)
      }
      ctx.restore()
      // 绘制趋势线
      ctx.strokeStyle = '#4A90E2'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      data.forEach((value, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      // 绘制数据点
      ctx.fillStyle = '#4A90E2'
      data.forEach((value, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding)
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      // 交互：鼠标悬停显示tooltip
      if (!canvas._tooltipBind) {
        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect()
          const mx = e.clientX - rect.left
          const my = e.clientY - rect.top
          let found = false
          for (let i = 0; i < data.length; i++) {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1)
            const y = height - padding - ((data[i] - minValue) / range) * (height - 2 * padding)
            if (Math.abs(mx - x) < 8 && Math.abs(my - y) < 8) {
              found = { x, y, value: data[i], index: i }
              break
            }
          }
          this.radarTooltip = found
          this.$nextTick(() => this.drawTrendChart(canvas, data))
        })
        canvas.addEventListener('mouseleave', () => {
          this.radarTooltip = null
          this.$nextTick(() => this.drawTrendChart(canvas, data))
        })
        canvas._tooltipBind = true
      }
      // 绘制tooltip
      if (this.radarTooltip && this.radarTooltip.x) {
        ctx.save()
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#4A90E2'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(this.radarTooltip.x, this.radarTooltip.y - 18, 24, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.radarTooltip.value.toFixed(2), this.radarTooltip.x, this.radarTooltip.y - 18)
        ctx.restore()
      }
    },

    // 更新图表
    updateCharts() {
      this.$nextTick(() => {
        this.initRadarChart()
        this.initTrendCharts()
      })
    },
    
    // 格式化金额
    formatAmount(amount) {
      return new Intl.NumberFormat('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    },
    
    // 切换关注状态
    toggleFollow() {
      this.isFollowing = !this.isFollowing
    },
    
    // 显示指标说明
    showIndicatorModal() {
      this.showIndicator = true
    },
    
    // 隐藏指标说明
    hideIndicatorModal() {
      this.showIndicator = false
    },

    // 显示统计时间选择器
    showStatisticalTimePicker() {
      this.showStatisticalModal = true
    },

    // 隐藏统计时间选择器
    hideStatisticalTimePicker() {
      this.showStatisticalModal = false
    },

    // 显示对比时间选择器
    showComparisonTimePicker() {
      this.showComparisonModal = true
    },

    // 隐藏对比时间选择器
    hideComparisonTimePicker() {
      this.showComparisonModal = false
    },

    // 选择快捷时间
    selectQuickTime(type, option) {
      const today = new Date()
      let startDate, endDate

      switch (option.days) {
        case 0: // 今天
          startDate = endDate = new Date(today)
          break
        case 1: // 昨天
          startDate = endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'thisMonth': // 本月
          startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          break
        case 'lastMonth': // 上月
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          endDate = new Date(today.getFullYear(), today.getMonth(), 0)
          break
        case 'thisQuarter': { // 本季度
          const quarter = Math.floor(today.getMonth() / 3)
          startDate = new Date(today.getFullYear(), quarter * 3, 1)
          endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0)
          break
        }
        case 'lastQuarter': { // 上季度
          const lastQuarter = Math.floor(today.getMonth() / 3) - 1
          const year = lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear()
          const quarterMonth = lastQuarter < 0 ? 9 : lastQuarter * 3
          startDate = new Date(year, quarterMonth, 1)
          endDate = new Date(year, quarterMonth + 3, 0)
          break
        }
        default: // 天数类型
          endDate = new Date(today)
          startDate = new Date(today.getTime() - (option.days - 1) * 24 * 60 * 60 * 1000)
      }

      const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${month}-${day}`
      }

      const timeRange = `${formatDate(startDate)}～${formatDate(endDate)}`

      if (type === 'statistical') {
        this.statisticalTime = timeRange
        this.customStatisticalStart = startDate.toISOString().split('T')[0]
        this.customStatisticalEnd = endDate.toISOString().split('T')[0]
        this.hideStatisticalTimePicker()
      } else {
        this.comparisonTime = timeRange
        this.customComparisonStart = startDate.toISOString().split('T')[0]
        this.customComparisonEnd = endDate.toISOString().split('T')[0]
        this.hideComparisonTimePicker()
      }

      // 重新加载数据
      this.loadDataForTimeRange()
    },

    // 应用自定义时间
    applyCustomTime(type) {
      if (type === 'statistical') {
        if (!this.customStatisticalStart || !this.customStatisticalEnd) {
          alert('请选择开始和结束日期')
          return
        }
        const start = new Date(this.customStatisticalStart)
        const end = new Date(this.customStatisticalEnd)
        if (start > end) {
          alert('开始日期不能晚于结束日期')
          return
        }
        this.statisticalTime = this.formatDateRange(start, end)
        this.hideStatisticalTimePicker()
      } else {
        if (!this.customComparisonStart || !this.customComparisonEnd) {
          alert('请选择开始和结束日期')
          return
        }
        const start = new Date(this.customComparisonStart)
        const end = new Date(this.customComparisonEnd)
        if (start > end) {
          alert('开始日期不能晚于结束日期')
          return
        }
        this.comparisonTime = this.formatDateRange(start, end)
        this.hideComparisonTimePicker()
      }

      // 重新加载数据
      this.loadDataForTimeRange()
    },

    // 格式化日期范围
    formatDateRange(start, end) {
      const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${month}-${day}`
      }
      return `${formatDate(start)}～${formatDate(end)}`
    },

    // 根据时间范围重新加载数据
    loadDataForTimeRange() {
      console.log(`重新加载数据 - 统计时间: ${this.statisticalTime}, 对比时间: ${this.comparisonTime}`)
      
      // 这里可以添加实际的数据加载逻辑
      // 例如：调用API获取新的数据
      this.loadEmployeeData(this.currentEmployeeId)
      this.updateCharts()
      
      // 显示数据更新提示
      this.showDataUpdateNotification()
    },

    // 显示数据更新通知
    showDataUpdateNotification() {
      // 可以添加一个临时的提示信息
      const notification = document.createElement('div')
      notification.textContent = '数据已更新'
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #4A90E2;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 1000;
        font-size: 14px;
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 2000)
    },
    
    // 导航方法
    showSalesComparison() {
      console.log('显示销售对比')
    },
    
    navigateToCustomerAnalysis() {
      console.log('跳转到客户订单金额变化分析')
    },
    
    navigateToReturnAnalysis() {
      console.log('跳转到商品退货金额分析')
    },
    
    navigateToPaymentAnalysis() {
      console.log('跳转到其他员工销售已结变化分析')
    }
  }
}
</script>

<style scoped>
.employee-detail-analysis {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 顶部导航区 */
.header-bar {
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.current-time {
  font-size: 14px;
  color: #333;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.follow-btn {
  font-size: 14px;
  color: #4A90E2;
  background: none;
  border: none;
  cursor: pointer;
}

/* 员工切换 */
.employee-switcher {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 12px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.employee-tab {
  font-size: 14px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}

.employee-tab.active {
  color: #4A90E2;
  font-weight: bold;
}

/* 时间筛选区 */
.time-filter-section {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 12px;
}

.time-selector {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-selector:hover {
  border-color: #4A90E2;
  background-color: #f0f8ff;
}

.time-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.time-value {
  font-size: 12px;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-arrow {
  font-size: 12px;
  color: #999;
}

/* 通用样式 */
.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
}

.subsection-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

/* 综合实力展现 */
.comprehensive-ability-section {
  background-color: #fff;
  margin: 0 12px 12px 12px;
  padding: 12px;
  border-radius: 8px;
  height: 180px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.indicator-help {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 12px;
}

.help-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #999;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.radar-chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  padding: 12px;
  max-height: 500px;
  overflow: hidden;
}

.radar-chart {
  width: 400px;
  height: 400px;
  max-width: 95vw;
  max-height: 400px;
}

.ranking-info {
  text-align: center;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.rank-text {
  font-size: 16px;
  color: #666;
}

.rank-number {
  font-size: 32px;
  color: #ff3333;
  font-weight: bold;
  line-height: 1;
}



/* 订单能力区 */
.order-ability-section {
  background-color: #fff;
  margin: 0 12px 12px 12px;
  padding: 12px;
  border-radius: 8px;
  height: 72px;
}

.order-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.metric-item {
  text-align: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.3;
  word-wrap: break-word;
}

.metric-value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  line-height: 1.2;
}

/* 分析模块 */
.sales-analysis-section,
.return-analysis-section,
.payment-analysis-section {
  background-color: #fff;
  margin: 0 12px 12px 12px;
  padding: 12px;
  border-radius: 8px;
}

.analysis-subsection {
  margin-bottom: 16px;
}

.analysis-subsection:last-child {
  margin-bottom: 0;
}

.metrics-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-group {
  flex: 1;
}

/* 图表说明样式 */
.chart-description {
  margin-bottom: 12px;
}

.chart-info {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 2px;
  border-radius: 1px;
}

.legend-color.trend-line {
  background-color: #4A90E2;
}

.chart-summary {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 8px 0 12px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #666;
}

.summary-value {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.summary-value.trend-up {
  color: #28a745;
}

.summary-value.trend-down {
  color: #dc3545;
}

.metric-value.primary {
  color: #333;
  font-weight: bold;
}

.metric-value.change-positive {
  color: #ff3333;
}

.metric-value.change-rate {
  color: #ff3333;
}

/* 趋势图 */
.trend-chart-container {
  margin: 12px 0;
  display: flex;
  justify-content: center;
}

.trend-chart {
  max-width: 100%;
  height: auto;
}

.comparison-note {
  text-align: center;
  margin-top: 8px;
}

.comparison-link {
  font-size: 14px;
  color: #4A90E2;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

/* 问题定位 */
.problem-location {
  text-align: center;
  margin-top: 12px;
}

.locate-problem-btn {
  font-size: 14px;
  color: #4A90E2;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

/* 指标说明弹窗 */
.indicator-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 320px;
  margin: 0 20px;
}

.modal-content h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.indicator-item {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.close-btn {
  background-color: #4A90E2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
  width: 100%;
}

/* 时间选择弹窗 */
.time-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.time-modal .modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.time-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.time-modal .modal-header h4 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.time-modal .close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: auto;
  margin: 0;
}

.time-modal .close-btn:hover {
  color: #666;
}

.time-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.quick-options h5,
.custom-range h5 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.quick-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.quick-btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #333;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  border-color: #4A90E2;
  background-color: #f0f8ff;
  color: #4A90E2;
}

.custom-range {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.date-inputs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 4px;
  color: #666;
  font-size: 12px;
  font-weight: 500;
}

.date-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.date-input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.apply-btn {
  width: 100%;
  padding: 10px 16px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.apply-btn:hover {
  background-color: #357abd;
}

/* 雷达图放大弹窗样式 */
.radar-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.radar-modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px 24px 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}
.radar-chart-large {
  width: 600px;
  height: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 时间筛选区在小屏幕上的样式 */
  .time-filter-section {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  .time-selector {
    padding: 6px 8px;
  }

  .time-label {
    font-size: 11px;
  }

  .time-value {
    font-size: 11px;
  }

  /* 订单能力网格在小屏幕上改为单列 */
  .order-metrics-grid {
    grid-template-columns: 1fr !important;
    grid-template-rows: repeat(4, auto) !important;
    gap: 8px;
  }
  
  /* 指标项在小屏幕上保持稳定 */
  .metric-item {
    min-height: 50px;
    padding: 6px;
  }
  
  /* 雷达图在平板设备上适当调整 */
  .radar-chart {
    width: 300px;
    height: 300px;
    max-width: 300px;
    max-height: 300px;
  }
  
  .radar-chart-container {
    margin: 12px 0;
    padding: 8px;
  }
  
  /* 分析模块在小屏幕上减少边距 */
  .sales-analysis-section,
  .return-analysis-section,
  .payment-analysis-section {
    margin: 0 8px 8px 8px;
    padding: 10px;
  }
  
  /* 指标行在小屏幕上改为网格布局 */
  .metrics-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .metric-group {
    flex: none;
    min-width: auto;
    text-align: center;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 6px;
  }
  
  /* 快速选择按钮在小屏幕上改为单列 */
  .quick-buttons {
    grid-template-columns: 1fr !important;
    gap: 8px;
  }
  
  /* 日期输入在小屏幕上垂直排列 */
  .date-inputs {
    flex-direction: column;
    gap: 8px;
  }
  
  /* 时间模态框在小屏幕上全宽 */
  .time-modal .modal-content {
    width: 95%;
    max-width: none;
    margin: 10px;
  }
  
  /* 图表摘要在小屏幕上垂直排列 */
  .chart-summary {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .chart-legend {
    gap: 12px;
  }
}

@media (max-width: 992px) and (min-width: 769px) {
  /* 中等屏幕优化 */
  .order-metrics-grid {
    gap: 10px;
  }
  
  .metric-item {
    padding: 6px;
    min-height: 55px;
  }
  
  .sales-analysis-section,
  .return-analysis-section,
  .payment-analysis-section {
    margin: 0 10px 10px 10px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  /* 极小屏幕优化 */
  .order-ability-section {
    height: auto;
    min-height: 60px;
    padding: 8px 12px;
  }
  
  /* 雷达图容器在极小屏幕上调整 */
  .radar-chart-container {
    margin: 8px 0;
    padding: 6px;
  }
  
  .radar-chart {
    width: 250px;
    height: 250px;
    max-width: 250px;
    max-height: 250px;
  }

  /* 指标行在极小屏幕上保持网格布局 */
  .metrics-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .metric-group {
    padding: 6px;
    font-size: 12px;
  }
  
  /* 分析模块进一步减少边距 */
  .sales-analysis-section,
  .return-analysis-section,
  .payment-analysis-section {
    margin: 0 4px 6px 4px;
    padding: 8px;
  }
  
  /* 指标项文本大小调整 */
  .metric-item .metric-label {
    font-size: 12px;
  }
  
  .metric-item .metric-value {
    font-size: 14px;
  }
}
</style>
