<template>
  <div class="employee-report">
    <!-- 顶部区域 -->
    <div class="header-section">
      <div class="header-actions">
        <button class="screen-btn" @click="meetingScreen">
          📺 会议投屏
        </button>
        <div class="date-info">
          <span class="date-range">{{ currentDateRange }}</span>
        </div>
        <div class="period-tabs">
          <button 
            :class="['period-btn', { active: selectedPeriod === 'last-month' }]"
            @click="selectPeriod('last-month')"
          >
            上月
          </button>
          <button 
            :class="['period-btn', { active: selectedPeriod === 'current-month' }]"
            @click="selectPeriod('current-month')"
          >
            本月
          </button>
        </div>
      </div>
    </div>

    <!-- 核心数据区 -->
    <div class="core-metrics-section">
      <div class="section-title">核心业绩指标</div>
      <div class="metrics-grid">
        <div 
          v-for="metric in coreMetrics" 
          :key="metric.id"
          class="metric-item"
        >
          <div class="metric-name">{{ metric.name }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div v-if="metric.change" class="metric-change" :class="metric.changeClass">
            {{ metric.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- 品牌详情区 -->
    <div class="brand-details-section">
      <div class="section-title">品牌业绩详情</div>
      <div class="brand-list">
        <div 
          v-for="brand in brandDetails" 
          :key="brand.id"
          class="brand-item"
          @click="viewBrandDetail(brand.id)"
        >
          <div class="brand-header">
            <span class="brand-name">{{ brand.name }}</span>
            <span class="view-detail">查看详情 ></span>
          </div>
          <div class="brand-metrics">
            <div class="brand-metric">
              <span class="metric-label">净销售额</span>
              <span class="metric-val">{{ brand.netSales }}</span>
            </div>
            <div class="brand-metric">
              <span class="metric-label">销售金额</span>
              <span class="metric-val">{{ brand.salesAmount }}</span>
            </div>
            <div class="brand-metric">
              <span class="metric-label">退货金额</span>
              <span class="metric-val">{{ brand.returnAmount }}</span>
            </div>
          </div>
          <div class="brand-progress">
            <div class="progress-info">
              <span class="progress-label">目标完成率</span>
              <span class="progress-percentage">{{ brand.completionRate }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: brand.completionRate }"
                :class="getProgressClass(brand.completionRate)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 销售趋势图区域 -->
    <div class="trend-section">
      <div class="section-title">本月销售趋势</div>
      <div class="trend-chart">
        <div class="chart-placeholder">
          <div class="chart-info">
            <span class="chart-title">月度销售趋势图</span>
            <span class="chart-subtitle">显示最近30天的销售变化</span>
          </div>
          <div class="chart-visual">
            <div 
              v-for="(day, index) in trendData" 
              :key="index"
              class="chart-bar"
              :style="{ height: `${day.percentage}%` }"
              :title="`${day.date}: ${day.amount}元`"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 员工排行区 -->
    <div class="ranking-section">
      <div class="section-title">员工业绩排行</div>
      <div class="ranking-list">
        <div 
          v-for="(employee, index) in employeeRanking" 
          :key="employee.id"
          class="ranking-item"
          :class="{ 'top-performer': index < 3 }"
        >
          <div class="ranking-info">
            <span class="ranking-number">{{ index + 1 }}</span>
            <span class="employee-name">{{ employee.name }}</span>
          </div>
          <div class="performance-data">
            <span class="sales-amount">{{ employee.salesAmount }}</span>
            <span class="completion-rate" :class="getPerformanceClass(employee.completionRate)">
              {{ employee.completionRate }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">返回首页</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeReport',
  data() {
    return {
      selectedPeriod: 'current-month',
      currentDateRange: '08-01~08-08',
      coreMetrics: [
        {
          id: 1,
          name: '净销售额',
          value: '37,188.06 元',
          change: '+15.8%',
          changeClass: 'positive'
        },
        {
          id: 2,
          name: '销售金额',
          value: '38,144.74 元',
          change: '+12.3%',
          changeClass: 'positive'
        },
        {
          id: 3,
          name: '退货金额',
          value: '956.68 元',
          change: '-5.2%',
          changeClass: 'negative'
        },
        {
          id: 4,
          name: '铺货客户数',
          value: '85 个',
          change: '+8',
          changeClass: 'positive'
        },
        {
          id: 5,
          name: '销售已结金额',
          value: '17,038.58 元',
          change: '+20.1%',
          changeClass: 'positive'
        },
        {
          id: 6,
          name: '销售未结金额',
          value: '20,149.48 元',
          change: '+5.5%',
          changeClass: 'positive'
        }
      ],
      brandDetails: [
        {
          id: 1,
          name: '王鹏',
          netSales: '15,234.56 元',
          salesAmount: '16,100.00 元',
          returnAmount: '865.44 元',
          completionRate: '85%'
        },
        {
          id: 2,
          name: '黄保杰',
          netSales: '12,890.30 元',
          salesAmount: '13,500.00 元',
          returnAmount: '609.70 元',
          completionRate: '72%'
        },
        {
          id: 3,
          name: '李明',
          netSales: '9,063.20 元',
          salesAmount: '9,544.74 元',
          returnAmount: '481.54 元',
          completionRate: '61%'
        }
      ],
      employeeRanking: [
        {
          id: 1,
          name: '王鹏',
          salesAmount: '16,100.00元',
          completionRate: '125%'
        },
        {
          id: 2,
          name: '黄保杰',
          salesAmount: '13,500.00元',
          completionRate: '108%'
        },
        {
          id: 3,
          name: '李明',
          salesAmount: '9,544.74元',
          completionRate: '95%'
        },
        {
          id: 4,
          name: '张伟',
          salesAmount: '8,200.00元',
          completionRate: '82%'
        },
        {
          id: 5,
          name: '赵丽',
          salesAmount: '7,850.50元',
          completionRate: '78%'
        }
      ],
      trendData: [
        { date: '08-01', amount: 1200, percentage: 60 },
        { date: '08-02', amount: 1500, percentage: 75 },
        { date: '08-03', amount: 800, percentage: 40 },
        { date: '08-04', amount: 2000, percentage: 100 },
        { date: '08-05', amount: 1800, percentage: 90 },
        { date: '08-06', amount: 1300, percentage: 65 },
        { date: '08-07', amount: 1700, percentage: 85 },
        { date: '08-08', amount: 1600, percentage: 80 }
      ]
    }
  },
  methods: {
    selectPeriod(period) {
      this.selectedPeriod = period
      if (period === 'last-month') {
        this.currentDateRange = '07-01~07-31'
      } else {
        this.currentDateRange = '08-01~08-08'
      }
      // 这里可以加载对应期间的数据
    },
    meetingScreen() {
      alert('启动会议投屏功能')
    },
    viewBrandDetail(brandId) {
      console.log('查看品牌详情:', brandId)
    },
    getProgressClass(rate) {
      const percentage = parseInt(rate)
      if (percentage >= 90) return 'progress-excellent'
      if (percentage >= 70) return 'progress-good'
      return 'progress-normal'
    },
    getPerformanceClass(rate) {
      const percentage = parseInt(rate)
      if (percentage >= 100) return 'excellent'
      if (percentage >= 80) return 'good'
      return 'normal'
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.employee-report {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部区域 */
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

.screen-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 8px 12px;
  border-radius: 4px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-info {
  flex: 1;
  text-align: center;
}

.date-range {
  color: #111111;
  font-size: 16px;
  font-weight: bold;
}

.period-tabs {
  display: flex;
  gap: 8px;
}

.period-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 6px 12px;
  border-radius: 4px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn.active {
  background-color: #e8f3ff;
  color: #1677ff;
  border-color: #1677ff;
}

/* 核心数据区 */
.core-metrics-section {
  background-color: #ffffff;
  margin: 8px 16px;
  padding: 16px;
  border-radius: 8px;
}

.section-title {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-item {
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #eeeeee;
  border-radius: 6px;
}

.metric-name {
  color: #666666;
  font-size: 12px;
  margin-bottom: 4px;
}

.metric-value {
  color: #111111;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #00b42a;
}

.metric-change.negative {
  color: #f53f3f;
}

/* 品牌详情区 */
.brand-details-section {
  background-color: #ffffff;
  margin: 8px 16px;
  padding: 16px;
  border-radius: 8px;
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-item {
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.brand-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.brand-name {
  color: #111111;
  font-size: 16px;
  font-weight: 500;
}

.view-detail {
  color: #1677ff;
  font-size: 12px;
  text-decoration: underline;
  text-decoration-color: #e0e0e0;
}

.brand-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.brand-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  color: #666666;
  font-size: 12px;
}

.metric-val {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.brand-progress {
  margin-top: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-label {
  color: #666666;
  font-size: 12px;
}

.progress-percentage {
  color: #1677ff;
  font-size: 12px;
  font-weight: bold;
}

.progress-bar {
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.progress-excellent {
  background-color: #00b42a;
}

.progress-fill.progress-good {
  background-color: #1677ff;
}

.progress-fill.progress-normal {
  background-color: #ffaa00;
}

/* 销售趋势图区域 */
.trend-section {
  background-color: #ffffff;
  margin: 8px 16px;
  padding: 16px;
  border-radius: 8px;
}

.trend-chart {
  background-color: #f9fafb;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  padding: 16px;
}

.chart-placeholder {
  text-align: center;
}

.chart-info {
  margin-bottom: 16px;
}

.chart-title {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.chart-subtitle {
  color: #666666;
  font-size: 12px;
}

.chart-visual {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 100px;
  gap: 4px;
}

.chart-bar {
  flex: 1;
  background-color: #1677ff;
  border-radius: 2px 2px 0 0;
  min-height: 10px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.chart-bar:hover {
  opacity: 1;
}

/* 员工排行区 */
.ranking-section {
  background-color: #ffffff;
  margin: 8px 16px;
  padding: 16px;
  border-radius: 8px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #eeeeee;
  border-radius: 6px;
}

.ranking-item.top-performer {
  background-color: #fff7e6;
  border-color: #ffaa00;
}

.ranking-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ranking-number {
  color: #666666;
  font-size: 14px;
  font-weight: bold;
  width: 20px;
  text-align: center;
}

.employee-name {
  color: #111111;
  font-size: 14px;
  font-weight: 500;
}

.performance-data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.sales-amount {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.completion-rate {
  font-size: 12px;
  font-weight: bold;
}

.completion-rate.excellent {
  color: #00b42a;
}

.completion-rate.good {
  color: #1677ff;
}

.completion-rate.normal {
  color: #ffaa00;
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
