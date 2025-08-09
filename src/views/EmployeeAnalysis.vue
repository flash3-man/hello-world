<template>
  <div class="employee-analysis">
    <!-- 顶部操作区 - 人员与时间筛选 -->
    <div class="header-section">
      <div class="header-bar">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="page-title">员工数据分析</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- 人员切换标签 -->
      <div class="employee-tabs-section">
        <div class="employee-tabs">
          <button 
            v-for="employee in employeeList" 
            :key="employee.id"
            class="employee-tab"
            :class="{ active: selectedEmployeeId === employee.id }"
            @click="selectEmployee(employee.id)"
          >
            {{ employee.name }}
          </button>
        </div>
      </div>

      <!-- 时间筛选区 -->
      <div class="time-filter-section">
        <div class="time-group">
          <label class="time-label">统计时间：</label>
          <div class="time-picker" @click="showStatTimePicker = true">
            <span class="time-text">{{ statTimeRange }}</span>
            <svg class="time-arrow" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>
        <div class="time-group">
          <label class="time-label">对比时间：</label>
          <div class="time-picker" @click="showCompareTimePicker = true">
            <span class="time-text">{{ compareTimeRange }}</span>
            <svg class="time-arrow" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据展示区 - 综合实力展现 -->
    <div class="analysis-section">
      <!-- 标题与指标说明 -->
      <div class="analysis-header">
        <h2 class="analysis-title">综合实力展现</h2>
        <button class="indicator-info-btn" @click="showIndicatorModal = true">指标说明</button>
      </div>

      <!-- 雷达图区域 -->
      <div class="radar-chart-container">
        <div class="chart-wrapper">
          <canvas ref="radarChart" class="radar-chart"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color current"></div>
            <span class="legend-text">统计期间 ({{ statTimeRange }})</span>
          </div>
          <div class="legend-item">
            <div class="legend-color compare"></div>
            <span class="legend-text">对比期间 ({{ compareTimeRange }})</span>
          </div>
        </div>
      </div>

      <!-- 详细指标数据 -->
      <div class="metrics-grid">
        <div 
          v-for="metric in employeeMetrics" 
          :key="metric.key"
          class="metric-card"
        >
          <div class="metric-header">
            <span class="metric-name">{{ metric.name }}</span>
            <span class="metric-unit">{{ metric.unit }}</span>
          </div>
          <div class="metric-values">
            <div class="current-value">
              <span class="value-number">{{ metric.currentValue }}</span>
              <span class="value-label">当前</span>
            </div>
            <div class="compare-value">
              <span class="value-number">{{ metric.compareValue }}</span>
              <span class="value-label">对比</span>
            </div>
          </div>
          <div class="metric-change">
            <span class="change-value" :class="getChangeClass(metric.change)">
              {{ metric.change }}
            </span>
            <span class="change-label">变化</span>
          </div>
        </div>
      </div>

      <!-- 业绩分析图表 -->
      <div class="performance-charts">
        <div class="chart-card">
          <div class="chart-title">
            <h3>拜访客户趋势</h3>
            <span class="chart-period">{{ statTimeRange }}</span>
          </div>
          <div class="chart-content">
            <canvas ref="visitChart" class="trend-chart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-title">
            <h3>销售额趋势</h3>
            <span class="chart-period">{{ statTimeRange }}</span>
          </div>
          <div class="chart-content">
            <canvas ref="salesChart" class="trend-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- 客户分析明细 -->
      <div class="customer-analysis">
        <div class="section-header">
          <h3 class="section-title">客户分析明细</h3>
          <button class="detail-btn" @click="showCustomerDetail = !showCustomerDetail">
            {{ showCustomerDetail ? '收起' : '展开' }}详情
            <svg class="detail-arrow" :class="{ open: showCustomerDetail }" width="12" height="12" viewBox="0 0 12 12">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </button>
        </div>

        <div v-if="showCustomerDetail" class="customer-detail">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">新增客户</span>
              <span class="detail-value">{{ customerAnalysis.newCustomers }}个</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">活跃客户</span>
              <span class="detail-value">{{ customerAnalysis.activeCustomers }}个</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">流失客户</span>
              <span class="detail-value">{{ customerAnalysis.lostCustomers }}个</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户留存率</span>
              <span class="detail-value">{{ customerAnalysis.retentionRate }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">平均客单价</span>
              <span class="detail-value">{{ customerAnalysis.avgOrderValue }}元</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">重复购买率</span>
              <span class="detail-value">{{ customerAnalysis.repeatPurchaseRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计时间选择弹窗 -->
    <div v-if="showStatTimePicker" class="time-overlay" @click="showStatTimePicker = false">
      <div class="time-modal" @click.stop>
        <div class="time-header">
          <h3>选择统计时间</h3>
          <button class="time-close" @click="showStatTimePicker = false">✕</button>
        </div>
        <div class="time-content">
          <div class="time-options">
            <button 
              v-for="option in timeOptions" 
              :key="option.value"
              class="time-option-btn"
              :class="{ active: statTimeValue === option.value }"
              @click="selectStatTime(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比时间选择弹窗 -->
    <div v-if="showCompareTimePicker" class="time-overlay" @click="showCompareTimePicker = false">
      <div class="time-modal" @click.stop>
        <div class="time-header">
          <h3>选择对比时间</h3>
          <button class="time-close" @click="showCompareTimePicker = false">✕</button>
        </div>
        <div class="time-content">
          <div class="time-options">
            <button 
              v-for="option in timeOptions" 
              :key="option.value"
              class="time-option-btn"
              :class="{ active: compareTimeValue === option.value }"
              @click="selectCompareTime(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicatorModal" class="indicator-overlay" @click="showIndicatorModal = false">
      <div class="indicator-modal" @click.stop>
        <div class="indicator-header">
          <h3>指标计算说明</h3>
          <button class="indicator-close" @click="showIndicatorModal = false">✕</button>
        </div>
        <div class="indicator-content">
          <div v-for="indicator in indicatorExplanations" :key="indicator.key" class="indicator-item">
            <div class="indicator-name">{{ indicator.name }}</div>
            <div class="indicator-formula">{{ indicator.formula }}</div>
            <div class="indicator-description">{{ indicator.description }}</div>
          </div>
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
      // 界面状态
      showStatTimePicker: false,
      showCompareTimePicker: false,
      showIndicatorModal: false,
      showCustomerDetail: false,
      
      // 选中的员工
      selectedEmployeeId: 1,
      
      // 时间选择
      statTimeValue: 'current_month',
      statTimeRange: '06-01~06-20',
      compareTimeValue: 'last_month',
      compareTimeRange: '05-01~05-20',
      
      // 员工列表
      employeeList: [
        { id: 1, name: '拉拉' },
        { id: 2, name: '仇胜丽' },
        { id: 3, name: '黄保杰' },
        { id: 4, name: '王飞' },
        { id: 5, name: '徐伟' }
      ],
      
      // 时间选项
      timeOptions: [
        { value: 'current_month', label: '本月 (06-01~06-20)', range: '06-01~06-20' },
        { value: 'last_month', label: '上月 (05-01~05-20)', range: '05-01~05-20' },
        { value: 'current_quarter', label: '本季度 (04-01~06-20)', range: '04-01~06-20' },
        { value: 'last_quarter', label: '上季度 (01-01~03-31)', range: '01-01~03-31' },
        { value: 'current_year', label: '今年 (01-01~06-20)', range: '01-01~06-20' },
        { value: 'last_year', label: '去年同期 (01-01~06-20)', range: '2024-01-01~2024-06-20' }
      ],
      
      // 员工指标数据
      employeeMetrics: [
        {
          key: 'diligence',
          name: '勤劳度',
          unit: '拜访次数',
          currentValue: 45,
          compareValue: 38,
          change: '+18.4%'
        },
        {
          key: 'payment',
          name: '回款',
          unit: '销售已结',
          currentValue: '12,580.66',
          compareValue: '9,240.33',
          change: '+36.1%'
        },
        {
          key: 'product_promotion',
          name: '推品',
          unit: '订单SKU数',
          currentValue: 156,
          compareValue: 142,
          change: '+9.9%'
        },
        {
          key: 'customer_development',
          name: '客户开发',
          unit: '新增客户',
          currentValue: 8,
          compareValue: 5,
          change: '+60.0%'
        },
        {
          key: 'sales_performance',
          name: '销售业绩',
          unit: '销售额',
          currentValue: '68,450.88',
          compareValue: '52,330.76',
          change: '+30.8%'
        },
        {
          key: 'order_frequency',
          name: '订单频次',
          unit: '订单数',
          currentValue: 89,
          compareValue: 72,
          change: '+23.6%'
        }
      ],
      
      // 客户分析数据
      customerAnalysis: {
        newCustomers: 8,
        activeCustomers: 42,
        lostCustomers: 3,
        retentionRate: 93.3,
        avgOrderValue: 768.99,
        repeatPurchaseRate: 67.8
      },
      
      // 指标说明
      indicatorExplanations: [
        {
          key: 'diligence',
          name: '勤劳度',
          formula: '拜访客户总次数',
          description: '统计期间内员工实际拜访客户的总次数，体现员工的勤奋程度和客户维护频率。'
        },
        {
          key: 'payment',
          name: '回款（销售已结）',
          formula: '已收款订单金额总和',
          description: '统计期间内已完成回款的订单金额总和，反映员工的回款能力和客户支付情况。'
        },
        {
          key: 'product_promotion',
          name: '推品（订单SKU数）',
          formula: '订单中不同商品SKU总数',
          description: '统计期间内员工销售订单涉及的不同商品SKU总数，体现商品推广的广度。'
        },
        {
          key: 'customer_development',
          name: '客户开发',
          formula: '新增有效客户数量',
          description: '统计期间内员工成功开发的新客户数量（有下单记录），反映客户拓展能力。'
        },
        {
          key: 'sales_performance',
          name: '销售业绩',
          formula: '销售订单总金额',
          description: '统计期间内员工完成的销售订单总金额，直接反映销售业绩表现。'
        },
        {
          key: 'order_frequency',
          name: '订单频次',
          formula: '订单总数量',
          description: '统计期间内员工完成的订单总数量，体现销售活动的频繁程度。'
        }
      ]
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 选择员工
    selectEmployee(employeeId) {
      this.selectedEmployeeId = employeeId
      this.loadEmployeeData(employeeId)
    },
    
    // 选择统计时间
    selectStatTime(option) {
      this.statTimeValue = option.value
      this.statTimeRange = option.range
      this.showStatTimePicker = false
      this.loadEmployeeData(this.selectedEmployeeId)
    },
    
    // 选择对比时间
    selectCompareTime(option) {
      this.compareTimeValue = option.value
      this.compareTimeRange = option.range
      this.showCompareTimePicker = false
      this.loadEmployeeData(this.selectedEmployeeId)
    },
    
    // 获取变化样式类
    getChangeClass(change) {
      if (change.includes('+')) return 'change-positive'
      if (change.includes('-')) return 'change-negative'
      return 'change-neutral'
    },
    
    // 加载员工数据
    loadEmployeeData(employeeId) {
      console.log('加载员工数据:', {
        employeeId,
        statTime: this.statTimeRange,
        compareTime: this.compareTimeRange
      })
      
      // 这里可以调用API加载员工的具体数据
      this.updateCharts()
    },
    
    // 更新图表
    updateCharts() {
      this.$nextTick(() => {
        this.drawRadarChart()
        this.drawVisitChart()
        this.drawSalesChart()
      })
    },
    
    // 绘制雷达图
    drawRadarChart() {
      const canvas = this.$refs.radarChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 40
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 绘制雷达图网格
      this.drawRadarGrid(ctx, centerX, centerY, radius)
      
      // 绘制数据
      this.drawRadarData(ctx, centerX, centerY, radius)
    },
    
    // 绘制雷达图网格
    drawRadarGrid(ctx, centerX, centerY, radius) {
      const metrics = this.employeeMetrics.slice(0, 6) // 取前6个指标
      const angleStep = (2 * Math.PI) / metrics.length
      
      // 绘制同心圆
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI)
        ctx.stroke()
      }
      
      // 绘制射线和标签
      ctx.strokeStyle = '#e0e0e0'
      ctx.fillStyle = '#666666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      
      metrics.forEach((metric, index) => {
        const angle = angleStep * index - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // 绘制射线
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()
        
        // 绘制标签
        const labelX = centerX + Math.cos(angle) * (radius + 20)
        const labelY = centerY + Math.sin(angle) * (radius + 20)
        ctx.fillText(metric.name, labelX, labelY)
      })
    },
    
    // 绘制雷达图数据
    drawRadarData(ctx, centerX, centerY, radius) {
      const metrics = this.employeeMetrics.slice(0, 6)
      const angleStep = (2 * Math.PI) / metrics.length
      
      // 当前期间数据
      ctx.strokeStyle = '#007AFF'
      ctx.fillStyle = 'rgba(0, 122, 255, 0.2)'
      ctx.lineWidth = 2
      
      ctx.beginPath()
      metrics.forEach((metric, index) => {
        const angle = angleStep * index - Math.PI / 2
        // 这里简化处理，实际应该根据数据范围计算比例
        const value = Math.random() * 0.8 + 0.2 // 0.2-1.0之间
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // 对比期间数据
      ctx.strokeStyle = '#FF9900'
      ctx.fillStyle = 'rgba(255, 153, 0, 0.2)'
      
      ctx.beginPath()
      metrics.forEach((metric, index) => {
        const angle = angleStep * index - Math.PI / 2
        const value = Math.random() * 0.7 + 0.1 // 0.1-0.8之间（对比期间稍低）
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    },
    
    // 绘制拜访趋势图
    drawVisitChart() {
      const canvas = this.$refs.visitChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 模拟数据
      const data = [12, 15, 8, 18, 22, 19, 25, 16, 14, 20]
      this.drawLineChart(ctx, data, '#007AFF', canvas.width, canvas.height)
    },
    
    // 绘制销售趋势图
    drawSalesChart() {
      const canvas = this.$refs.salesChart
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 模拟数据
      const data = [3200, 4100, 2800, 5600, 6200, 4800, 7200, 5100, 4600, 6800]
      this.drawLineChart(ctx, data, '#00b42a', canvas.width, canvas.height)
    },
    
    // 绘制折线图
    drawLineChart(ctx, data, color, width, height) {
      const padding = 40
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      const maxValue = Math.max(...data)
      const minValue = Math.min(...data)
      const range = maxValue - minValue
      
      // 绘制网格
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      
      // 水平网格线
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i
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
      
      // 绘制数据线
      ctx.strokeStyle = color
      ctx.lineWidth = 2
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
      ctx.fillStyle = color
      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = height - padding - ((value - minValue) / range) * chartHeight
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })
    }
  },
  
  mounted() {
    // 从路由参数获取员工信息
    if (this.$route.query.employeeId) {
      this.selectedEmployeeId = parseInt(this.$route.query.employeeId)
    }
    
    if (this.$route.query.dateRange) {
      this.statTimeRange = this.$route.query.dateRange
    }
    
    // 设置画布尺寸
    this.$nextTick(() => {
      if (this.$refs.radarChart) {
        this.$refs.radarChart.width = 300
        this.$refs.radarChart.height = 300
      }
      
      if (this.$refs.visitChart) {
        this.$refs.visitChart.width = 400
        this.$refs.visitChart.height = 200
      }
      
      if (this.$refs.salesChart) {
        this.$refs.salesChart.width = 400
        this.$refs.salesChart.height = 200
      }
      
      this.updateCharts()
    })
  }
}
</script>

<style scoped>
/* 整体布局 */
.employee-analysis {
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

/* 员工切换标签 */
.employee-tabs-section {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.employee-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.employee-tab {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.employee-tab:hover {
  border-color: #007AFF;
  background-color: #f0f8ff;
  color: #007AFF;
}

.employee-tab.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

/* 时间筛选区 */
.time-filter-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
}

.time-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-label {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
}

.time-picker {
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
  max-width: 200px;
}

.time-picker:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.time-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.time-arrow {
  color: #666666;
}

/* 分析区域 */
.analysis-section {
  padding: 16px;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analysis-title {
  color: #333333;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.indicator-info-btn {
  background: none;
  border: none;
  color: #007AFF;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.indicator-info-btn:hover {
  color: #0056d6;
}

/* 雷达图区域 */
.radar-chart-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.radar-chart {
  max-width: 100%;
  height: auto;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.current {
  background-color: #007AFF;
}

.legend-color.compare {
  background-color: #FF9900;
}

.legend-text {
  color: #666666;
  font-size: 12px;
}

/* 指标网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-name {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.metric-unit {
  color: #999999;
  font-size: 12px;
}

.metric-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.current-value,
.compare-value {
  text-align: center;
}

.value-number {
  display: block;
  color: #333333;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.value-label {
  color: #666666;
  font-size: 11px;
}

.metric-change {
  text-align: center;
}

.change-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.change-positive {
  color: #00b42a;
}

.change-negative {
  color: #f53f3f;
}

.change-neutral {
  color: #666666;
}

.change-label {
  color: #666666;
  font-size: 11px;
}

/* 业绩图表 */
.performance-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.chart-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title h3 {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.chart-period {
  color: #999999;
  font-size: 12px;
}

.chart-content {
  display: flex;
  justify-content: center;
}

.trend-chart {
  max-width: 100%;
  height: auto;
}

/* 客户分析明细 */
.customer-analysis {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.detail-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.detail-btn:hover {
  color: #0056d6;
}

.detail-arrow {
  transition: transform 0.3s;
}

.detail-arrow.open {
  transform: rotate(180deg);
}

.customer-detail {
  animation: slideDown 0.3s ease-out;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.detail-item {
  text-align: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.detail-label {
  display: block;
  color: #666666;
  font-size: 12px;
  margin-bottom: 4px;
}

.detail-value {
  display: block;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
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

/* 指标说明弹窗 */
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
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.indicator-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.indicator-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.indicator-content {
  padding: 16px 20px;
  max-height: 400px;
  overflow-y: auto;
}

.indicator-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.indicator-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.indicator-name {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.indicator-formula {
  color: #007AFF;
  font-size: 14px;
  font-weight: 500;
  background-color: #f0f8ff;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.indicator-description {
  color: #666666;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .time-filter-section {
    padding: 12px;
  }
  
  .time-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .time-picker {
    max-width: none;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .performance-charts {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .analysis-section {
    padding: 12px;
  }
  
  .employee-tabs {
    gap: 6px;
  }
  
  .employee-tab {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
}

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
.indicator-overlay {
  animation: fadeIn 0.2s ease-out;
}

.time-modal,
.indicator-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
