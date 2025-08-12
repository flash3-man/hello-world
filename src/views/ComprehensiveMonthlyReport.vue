<template>
  <div class="comprehensive-monthly-report">
    <!-- 顶部操作栏（包含返回按钮） -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">综合月报</h1>
      <div class="date-switcher" @click="toggleDatePicker">
        <span class="current-date">{{ currentDateDisplay }}</span>
        <svg class="date-arrow" width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
    </div>

    <!-- 月份选择器 -->
    <div v-if="showDatePicker" class="date-picker-overlay" @click="showDatePicker = false">
      <div class="date-picker" @click.stop>
        <div class="date-picker-header">
          <h3>选择月份</h3>
          <button class="close-btn" @click="showDatePicker = false">×</button>
        </div>
        <div class="date-options">
          <div 
            v-for="option in monthOptions" 
            :key="option.value"
            class="date-option"
            :class="{ active: selectedMonth === option.value }"
            @click="selectMonth(option.value)"
          >
            <span class="option-label">{{ option.label }}</span>
            <span class="option-date">{{ option.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 月度概览 -->
    <div class="section overview-section">
      <div class="section-header">
        <h2 class="section-title">月度概览</h2>
      </div>
      <div class="overview-grid">
        <div class="overview-card primary">
          <div class="overview-label">本月销售金额</div>
          <div class="overview-value">{{ overviewData.currentMonthSales }}</div>
          <div class="overview-unit">元</div>
          <div class="overview-trend positive">+{{ overviewData.salesGrowth }}%</div>
        </div>
        
        <div class="overview-card">
          <div class="overview-label">上月销售金额</div>
          <div class="overview-value">{{ overviewData.lastMonthSales }}</div>
          <div class="overview-unit">元</div>
        </div>
        
        <div class="overview-card">
          <div class="overview-label">月度目标完成率</div>
          <div class="overview-value">{{ overviewData.goalCompletion }}</div>
          <div class="overview-unit">%</div>
          <div class="overview-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: overviewData.goalCompletion + '%' }"></div>
            </div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-label">月均客单价</div>
          <div class="overview-value">{{ overviewData.avgOrderValue }}</div>
          <div class="overview-unit">元</div>
          <div class="overview-trend" :class="overviewData.avgOrderTrendClass">{{ overviewData.avgOrderTrend }}</div>
        </div>
      </div>
    </div>

    <!-- 经营风险 -->
    <div class="section risk-section">
      <div class="section-header">
        <h2 class="section-title">经营风险</h2>
      </div>
      <div class="risk-cards">
        <div class="risk-card" @click="navigateToGoalProgress">
          <div class="risk-icon">📈</div>
          <div class="risk-content">
            <div class="risk-title">目标进度</div>
            <div class="risk-value">{{ riskData.goalProgress }}%</div>
            <div class="risk-desc">月度目标完成情况</div>
          </div>
          <div class="risk-status" :class="getRiskStatusClass(riskData.goalProgress, 'goal')">
            {{ getRiskStatusText(riskData.goalProgress, 'goal') }}
          </div>
        </div>
        
        <div class="risk-card warning" @click="navigateToNegativeProfitCustomers">
          <div class="risk-icon">⚠️</div>
          <div class="risk-content">
            <div class="risk-title">负利润客户</div>
            <div class="risk-value">{{ riskData.negativeProfitCustomers }}</div>
            <div class="risk-desc">本月新增负利润客户</div>
          </div>
          <div class="risk-status warning">需关注</div>
        </div>
        
        <div class="risk-card danger" @click="navigateToUnsettledCustomers">
          <div class="risk-icon">💰</div>
          <div class="risk-content">
            <div class="risk-title">未结清客户</div>
            <div class="risk-value">{{ riskData.unsettledCustomers }}</div>
            <div class="risk-desc">超期未结清客户数量</div>
          </div>
          <div class="risk-status danger">高风险</div>
        </div>
      </div>
    </div>

    <!-- 业务数据 -->
    <div class="section business-section">
      <div class="section-header">
        <h2 class="section-title">业务数据</h2>
      </div>
      <div class="business-grid">
        <div class="business-card primary" @click="navigateToBusinessAnalysis">
          <div class="business-label">净销售额</div>
          <div class="business-value">{{ businessData.netSales }}</div>
          <div class="business-unit">元</div>
          <div class="business-change positive">+{{ businessData.netSalesChange }}%</div>
        </div>
        
        <div class="business-card" @click="navigateToCustomerProfit">
          <div class="business-label">客户利润</div>
          <div class="business-value">{{ businessData.customerProfit }}</div>
          <div class="business-unit">元</div>
          <div class="business-change" :class="businessData.profitChangeClass">{{ businessData.profitChange }}</div>
        </div>
        
        <div class="business-card" @click="navigateToMarketAnalysis">
          <div class="business-label">铺货客户</div>
          <div class="business-value">{{ businessData.distributionCustomers }}</div>
          <div class="business-unit">户</div>
          <div class="business-change positive">+{{ businessData.customerIncrease }}</div>
        </div>
        
        <div class="business-card" @click="navigateToMarketAnalysis">
          <div class="business-label">铺货品牌</div>
          <div class="business-value">{{ businessData.distributionBrands }}</div>
          <div class="business-unit">个</div>
          <div class="business-change neutral">{{ businessData.brandChange }}</div>
        </div>
        
        <div class="business-card" @click="navigateToMarketAnalysis">
          <div class="business-label">铺货商品</div>
          <div class="business-value">{{ businessData.distributionProducts }}</div>
          <div class="business-unit">种</div>
          <div class="business-change positive">+{{ businessData.productIncrease }}</div>
        </div>
        
        <div class="business-card" @click="navigateToPaymentRanking">
          <div class="business-label">回款金额</div>
          <div class="business-value">{{ businessData.paymentAmount }}</div>
          <div class="business-unit">元</div>
          <div class="business-change positive">+{{ businessData.paymentIncrease }}%</div>
        </div>
        
        <div class="business-card" @click="navigateToPerformanceAnalysis">
          <div class="business-label">拜访客户</div>
          <div class="business-value">{{ businessData.visitedCustomers }}</div>
          <div class="business-unit">户</div>
          <div class="business-change positive">+{{ businessData.visitIncrease }}</div>
        </div>
        
        <div class="business-card" @click="navigateToNewCustomerAnalysis">
          <div class="business-label">新增客户</div>
          <div class="business-value">{{ businessData.newCustomers }}</div>
          <div class="business-unit">户</div>
          <div class="business-change positive">+{{ businessData.newCustomerIncrease }}</div>
        </div>
      </div>
    </div>

    <!-- 月度趋势 -->
    <div class="section trend-section">
      <div class="section-header">
        <h2 class="section-title">月度趋势</h2>
      </div>
      <div class="trend-chart">
        <div class="chart-placeholder">
          <div class="chart-title">销售额趋势图</div>
          <div class="chart-desc">显示最近6个月的销售额变化趋势</div>
          <div class="chart-data">
            <div v-for="month in trendData" :key="month.month" class="trend-bar">
              <div class="bar-label">{{ month.month }}</div>
              <div class="bar-container">
                <div class="bar-fill" :style="{ height: month.percentage + '%' }"></div>
              </div>
              <div class="bar-value">{{ month.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细数据报表 -->
    <div class="section report-section">
      <div class="section-header">
        <h2 class="section-title">详细数据</h2>
      </div>
      <div class="report-table">
        <div class="table-header">
          <div class="header-cell">指标名称</div>
          <div class="header-cell">本月数据</div>
          <div class="header-cell">环比</div>
          <div class="header-cell">同比</div>
        </div>
        <div class="table-body">
          <div v-for="item in reportData" :key="item.id" class="table-row">
            <div class="table-cell">{{ item.name }}</div>
            <div class="table-cell">{{ item.currentValue }}</div>
            <div class="table-cell" :class="item.ringRatioClass">{{ item.ringRatio }}</div>
            <div class="table-cell" :class="item.yearRatioClass">{{ item.yearRatio }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComprehensiveMonthlyReport',
  data() {
    return {
      showDatePicker: false,
      selectedMonth: 'current',
      currentDateDisplay: '2025年8月',
      
      monthOptions: [
        { value: 'current', label: '本月', date: '2025年8月' },
        { value: 'last', label: '上月', date: '2025年7月' },
        { value: 'lastTwo', label: '上上月', date: '2025年6月' },
        { value: 'quarter', label: '本季度', date: '2025年Q3' },
        { value: 'lastQuarter', label: '上季度', date: '2025年Q2' }
      ],
      
      // 月度概览数据
      overviewData: {
        currentMonthSales: '156,234.89',
        lastMonthSales: '142,567.23',
        salesGrowth: 9.6,
        goalCompletion: 78.5,
        avgOrderValue: '1,245.67',
        avgOrderTrend: '+5.2%',
        avgOrderTrendClass: 'positive'
      },
      
      // 经营风险数据
      riskData: {
        goalProgress: 78.5,
        negativeProfitCustomers: 25,
        unsettledCustomers: 47
      },
      
      // 业务数据
      businessData: {
        netSales: '152,680.45',
        netSalesChange: 8.3,
        customerProfit: '89,256.78',
        profitChange: '-2.1%',
        profitChangeClass: 'negative',
        distributionCustomers: 234,
        customerIncrease: 12,
        distributionBrands: 18,
        brandChange: '持平',
        distributionProducts: 567,
        productIncrease: 23,
        paymentAmount: '135,689.12',
        paymentIncrease: 15.6,
        visitedCustomers: 189,
        visitIncrease: 8,
        newCustomers: 15,
        newCustomerIncrease: 5
      },
      
      // 趋势数据
      trendData: [
        { month: '3月', value: '128K', percentage: 60 },
        { month: '4月', value: '145K', percentage: 75 },
        { month: '5月', value: '139K', percentage: 70 },
        { month: '6月', value: '163K', percentage: 85 },
        { month: '7月', value: '143K', percentage: 73 },
        { month: '8月', value: '156K', percentage: 78 }
      ],
      
      // 报表数据
      reportData: [
        {
          id: 1,
          name: '销售金额',
          currentValue: '156,234.89',
          ringRatio: '+9.6%',
          yearRatio: '+18.3%',
          ringRatioClass: 'positive',
          yearRatioClass: 'positive'
        },
        {
          id: 2,
          name: '订单数量',
          currentValue: '125',
          ringRatio: '+12.5%',
          yearRatio: '+22.6%',
          ringRatioClass: 'positive',
          yearRatioClass: 'positive'
        },
        {
          id: 3,
          name: '客户数量',
          currentValue: '89',
          ringRatio: '+5.9%',
          yearRatio: '+15.6%',
          ringRatioClass: 'positive',
          yearRatioClass: 'positive'
        },
        {
          id: 4,
          name: '平均客单价',
          currentValue: '1,754.67',
          ringRatio: '+3.2%',
          yearRatio: '-5.8%',
          ringRatioClass: 'positive',
          yearRatioClass: 'negative'
        },
        {
          id: 5,
          name: '客户利润',
          currentValue: '89,256.78',
          ringRatio: '-2.1%',
          yearRatio: '+8.9%',
          ringRatioClass: 'negative',
          yearRatioClass: 'positive'
        }
      ]
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 切换日期选择器
    toggleDatePicker() {
      this.showDatePicker = !this.showDatePicker
    },
    
    // 选择月份
    selectMonth(value) {
      this.selectedMonth = value
      const option = this.monthOptions.find(opt => opt.value === value)
      if (option) {
        this.currentDateDisplay = option.date
      }
      this.showDatePicker = false
      this.refreshData()
    },
    
    // 获取风险状态样式类
    getRiskStatusClass(value, type) {
      if (type === 'goal') {
        if (value >= 90) return 'safe'
        if (value >= 70) return 'normal'
        return 'danger'
      }
      return 'warning'
    },
    
    // 获取风险状态文本
    getRiskStatusText(value, type) {
      if (type === 'goal') {
        if (value >= 90) return '良好'
        if (value >= 70) return '正常'
        return '需关注'
      }
      return '需关注'
    },
    
    // 刷新数据
    refreshData() {
      console.log('刷新月报数据:', this.selectedMonth)
      // 这里可以调用API获取对应月份的数据
    },
    
    // 导航方法
    navigateToGoalProgress() {
      this.$router.push('/goal-management')
    },
    
    navigateToNegativeProfitCustomers() {
      alert('跳转到负利润客户列表（功能开发中）')
    },
    
    navigateToUnsettledCustomers() {
      alert('跳转到单据应收列表（功能开发中）')
    },
    
    navigateToBusinessAnalysis() {
      alert('跳转到业务变化分析（功能开发中）')
    },
    
    navigateToCustomerProfit() {
      alert('跳转到客户费利列表（功能开发中）')
    },
    
    navigateToMarketAnalysis() {
      this.$router.push('/market-analysis')
    },
    
    navigateToPaymentRanking() {
      alert('跳转到客户回款榜、销售已结榜（功能开发中）')
    },
    
    navigateToPerformanceAnalysis() {
      this.$router.push('/performance-analysis')
    },
    
    navigateToNewCustomerAnalysis() {
      this.$router.push('/customer-analysis')
    }
  },
  
  mounted() {
    this.refreshData()
  }
}
</script>

<style scoped>
.comprehensive-monthly-report {
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

/* 顶部操作栏 */
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
}

.date-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-switcher:hover {
  background-color: #e9ecef;
}

.current-date {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.date-arrow {
  color: #666;
}

/* 日期选择器 */
.date-picker-overlay {
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

.date-picker {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.date-picker-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.date-options {
  padding: 8px 0;
}

.date-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-option:hover {
  background-color: #f8f9fa;
}

.date-option.active {
  background-color: #f0f8ff;
  color: #007AFF;
}

.option-label {
  font-weight: 500;
}

.option-date {
  color: #666;
  font-size: 14px;
}

/* 通用区域样式 */
.section {
  margin: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.section-title {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

/* 月度概览区域 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.overview-card {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  position: relative;
}

.overview-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.overview-label {
  font-size: 12px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.overview-value {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.overview-unit {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.overview-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.overview-trend.positive {
  background-color: #d4edda;
  color: #155724;
}

.overview-card.primary .overview-trend.positive {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.overview-progress {
  margin-top: 8px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #28a745;
  transition: width 0.3s ease;
}

.overview-card.primary .progress-fill {
  background-color: white;
}

/* 经营风险区域 */
.risk-cards {
  padding: 16px;
}

.risk-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.risk-card:last-child {
  margin-bottom: 0;
}

.risk-card:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.risk-card.warning {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
}

.risk-card.danger {
  background-color: #f8d7da;
  border-left: 4px solid #dc3545;
}

.risk-icon {
  font-size: 24px;
  margin-right: 12px;
}

.risk-content {
  flex: 1;
}

.risk-title {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.risk-value {
  color: #007AFF;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.risk-desc {
  color: #666;
  font-size: 12px;
}

.risk-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.risk-status.safe {
  background-color: #d4edda;
  color: #155724;
}

.risk-status.normal {
  background-color: #cce5ff;
  color: #004085;
}

.risk-status.warning {
  background-color: #fff3cd;
  color: #856404;
}

.risk-status.danger {
  background-color: #f8d7da;
  color: #721c24;
}

/* 业务数据区域 */
.business-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.business-card {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  position: relative;
}

.business-card:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.business-card.primary {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.business-label {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
}

.business-card.primary .business-label {
  color: rgba(255, 255, 255, 0.9);
}

.business-value {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.business-card.primary .business-value {
  color: white;
}

.business-unit {
  color: #999;
  font-size: 12px;
  margin-bottom: 8px;
}

.business-card.primary .business-unit {
  color: rgba(255, 255, 255, 0.8);
}

.business-change {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 3px;
}

.business-change.positive {
  background-color: #d4edda;
  color: #155724;
}

.business-change.negative {
  background-color: #f8d7da;
  color: #721c24;
}

.business-change.neutral {
  background-color: #e2e3e5;
  color: #6c757d;
}

.business-card.primary .business-change {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

/* 趋势图区域 */
.trend-chart {
  padding: 16px;
}

.chart-placeholder {
  text-align: center;
  padding: 20px;
}

.chart-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.chart-desc {
  color: #666;
  font-size: 12px;
  margin-bottom: 20px;
}

.chart-data {
  display: flex;
  justify-content: space-around;
  align-items: end;
  height: 120px;
  margin-top: 20px;
}

.trend-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-label {
  color: #666;
  font-size: 12px;
}

.bar-container {
  width: 20px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #007AFF, #4CAF50);
  border-radius: 10px;
  position: absolute;
  bottom: 0;
  transition: height 0.8s ease;
}

.bar-value {
  color: #333;
  font-size: 10px;
  font-weight: 500;
}

/* 报表区域 */
.report-table {
  margin: 16px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 2px solid #eaeaea;
}

.header-cell {
  color: #333;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.header-cell:first-child {
  text-align: left;
}

.table-body {
  padding: 8px 0;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.table-cell {
  color: #333;
  font-size: 14px;
  text-align: center;
}

.table-cell:first-child {
  text-align: left;
  font-weight: 500;
}

.table-cell.positive {
  color: #28a745;
}

.table-cell.negative {
  color: #dc3545;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .overview-grid,
  .business-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 4px;
  }
  
  .header-cell,
  .table-cell {
    font-size: 12px;
  }
  
  .chart-data {
    height: 100px;
  }
  
  .bar-container {
    height: 60px;
    width: 16px;
  }
}
</style>
