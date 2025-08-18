<template>
  <div class="customer-analysis-page">
    <!-- 顶部导航区 -->
    <div class="top-nav">
      <div class="nav-left">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
        </button>
      </div>
      <div class="nav-center">
        <span class="nav-title">客户分析</span>
      </div>
      <div class="nav-right">
        <button class="more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 时间筛选区 -->
    <div class="time-filter-section">
      <div class="time-selector">
        <button class="time-btn" @click="showDatePicker = true">
          {{ formatDateRange(selectedDateRange) }}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7,10L12,15L17,10H7Z"/>
          </svg>
        </button>
      </div>
      <!-- 时间对比数据 -->
      <div class="time-comparison">
        <span class="comparison-text">环比上个月</span>
        <span class="comparison-text">同比去年这个时候</span>
      </div>
    </div>

    <!-- 固定标签导航 -->
    <div class="sticky-tabs" :class="{ 'sticky': isTabsSticky }">
      <div class="tab-container">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="scrollToSection(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content" @scroll="handleScroll" ref="mainContent">

      <!-- 客户信息看板 -->
      <section id="customer-info" class="analysis-section">
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-number">1</span>
            <h2 class="section-title">客户信息</h2>
            <button class="detail-btn" @click="showCustomerInfoDetail">
              详情说明
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.07,10.5 8.5,8.93 8.5,7A3.5,3.5 0 0,1 12,3.5A3.5,3.5 0 0,1 15.5,7C15.5,8.93 13.93,10.5 12,10.5Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="mobile-metrics">
          <div class="metric-row" @click="showEffectiveCustomers">
            <div class="metric-info">
              <span class="metric-label">有效客户数</span>
              <span class="metric-value">1593</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>

          <div class="metric-row" @click="showNewCustomers">
            <div class="metric-info">
              <span class="metric-label">新增客户数</span>
              <span class="metric-value">7</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>

          <div class="metric-row highlight" @click="showUndeliveredCustomers">
            <div class="metric-info">
              <span class="metric-label">探查期间未铺货客户</span>
              <div class="metric-desc">可以去拜访客户，但是没有铺货，明显是有需求的但是没有铺货的客户，这类客户有很大的合作潜力</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 客户交易看板 -->
      <section id="customer-trade" class="analysis-section">
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-number">2</span>
            <h2 class="section-title">客户交易分析</h2>
            <button class="detail-btn" @click="showTransactionDetail">
              详情说明
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.07,10.5 8.5,8.93 8.5,7A3.5,3.5 0 0,1 12,3.5A3.5,3.5 0 0,1 15.5,7C15.5,8.93 13.93,10.5 12,10.5Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="transaction-summary">
          <div class="summary-row">
            <div class="summary-item">
              <span class="summary-label">净销售额(元)</span>
              <span class="summary-value">19,576.80</span>
              <div class="summary-comparison">
                <span class="comparison-item">环比 +102.54%</span>
                <span class="comparison-item">同比 +104.89%</span>
              </div>
            </div>
            <div class="summary-item">
              <span class="summary-label">销售毛利(元)</span>
              <span class="summary-value">3,969.97</span>
              <div class="summary-comparison">
                <span class="comparison-item">环比 +104.89%</span>
                <span class="comparison-item">同比 +14,314.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mobile-analysis-list">
          <div class="analysis-item" @click="showSegmentDetail('high-sales-high-profit')">
            <div class="analysis-info">
              <span class="analysis-label">净销多毛利多</span>
              <span class="analysis-desc">12家客户贡献了总毛利</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>

          <div class="analysis-item" @click="showSegmentDetail('high-sales-low-profit')">
            <div class="analysis-info">
              <span class="analysis-label">净销多毛利少</span>
              <span class="analysis-desc">8家客户需要重点关注</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>

          <div class="analysis-item" @click="showSegmentDetail('low-sales-low-profit')">
            <div class="analysis-info">
              <span class="analysis-label">净销少毛利少</span>
              <span class="analysis-desc">11家客户具有提升空间</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 铺市分析 -->
      <section id="customer-coverage" class="analysis-section">
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-number">3</span>
            <h2 class="section-title">铺市分析</h2>
            <button class="detail-btn" @click="showCoverageDetail">
              详情说明
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.07,10.5 8.5,8.93 8.5,7A3.5,3.5 0 0,1 12,3.5A3.5,3.5 0 0,1 15.5,7C15.5,8.93 13.93,10.5 12,10.5Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="mobile-analysis-list">
          <div class="analysis-item" @click="showBrandCoverage">
            <div class="analysis-info">
              <span class="analysis-label">提升品牌覆盖</span>
              <span class="analysis-desc">查看客户漏铺品牌</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>

          <div class="analysis-item" @click="showProductCoverage">
            <div class="analysis-info">
              <span class="analysis-label">提升商品覆盖</span>
              <span class="analysis-desc">查看客户漏铺商品</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 利润分析 -->
      <section id="customer-profit" class="analysis-section">
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-number">4</span>
            <h2 class="section-title">利润</h2>
            <button class="detail-btn" @click="showProfitDetail">
              详情说明
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.07,10.5 8.5,8.93 8.5,7A3.5,3.5 0 0,1 12,3.5A3.5,3.5 0 0,1 15.5,7C15.5,8.93 13.93,10.5 12,10.5Z"/>
              </svg>
            </button>
          </div>
          <div class="profit-link" @click="showProfitDetail">
            <span>客户利润条目</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>
        </div>

        <div class="profit-summary">
          <div class="profit-main">
            <span class="profit-label">客户利润(元)</span>
            <span class="profit-value negative">-201.05</span>
            <div class="profit-comparison">
              <span class="comparison-item">环比 +102.54%</span>
              <span class="comparison-item">同比 +104.89%</span>
            </div>
          </div>
        </div>

        <div class="profit-breakdown">
          <div class="breakdown-table">
            <div class="breakdown-row" @click="showBreakdownDetail('gross')">
              <div class="breakdown-info">
                <span class="breakdown-label">商品毛利(元)</span>
                <span class="breakdown-value positive">3,969.95</span>
              </div>
              <div class="breakdown-trend">
                <span class="trend-text">环比 +15.2%</span>
              </div>
            </div>

            <div class="breakdown-row" @click="showBreakdownDetail('customer-cost')">
              <div class="breakdown-info">
                <span class="breakdown-label">客户费用(元)</span>
                <span class="breakdown-value negative">-2,820.00</span>
              </div>
              <div class="breakdown-trend">
                <span class="trend-text">环比 +1994.62%</span>
              </div>
            </div>

            <div class="breakdown-row" @click="showBreakdownDetail('other-cost')">
              <div class="breakdown-info">
                <span class="breakdown-label">客户其他费用(元)</span>
                <span class="breakdown-value negative">-1,351.00</span>
              </div>
              <div class="breakdown-trend">
                <span class="trend-text">环比 +25.8%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profit-trend">
          <div class="trend-section">
            <h3 class="trend-title">费用利润趋势</h3>
            <div class="trend-chart" @click="showProfitTrend">
              <div class="chart-placeholder">
                <svg width="100%" height="120" viewBox="0 0 300 120">
                  <!-- 简化的趋势线 -->
                  <polyline
                    points="20,80 60,75 100,70 140,65 180,68 220,72 260,75"
                    fill="none"
                    stroke="#1890ff"
                    stroke-width="2"
                  />
                  <polyline
                    points="20,90 60,85 100,80 140,85 180,90 220,95 260,100"
                    fill="none"
                    stroke="#ff4d4f"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div class="trend-insights">
                <div class="insight-item">
                  <span class="insight-label">该时间段内利润为负数</span>
                  <span class="insight-value">-1.11%</span>
                </div>
                <div class="insight-item">
                  <span class="insight-label">该时间段内利润率较低</span>
                  <span class="insight-value">需要关注</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 单据应收 -->
      <section id="customer-receivables" class="analysis-section">
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-number">5</span>
            <h2 class="section-title">单据应收</h2>
            <button class="detail-btn" @click="showReceivablesDetail">
              详情说明
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.07,10.5 8.5,8.93 8.5,7A3.5,3.5 0 0,1 12,3.5A3.5,3.5 0 0,1 15.5,7C15.5,8.93 13.93,10.5 12,10.5Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="receivables-list">
          <div class="receivables-item" @click="showCustomerReceivables('吉利')">
            <div class="customer-info">
              <span class="customer-name">吉利</span>
              <div class="receivables-amounts">
                <span class="amount-item">应收金额: 7,006.40</span>
                <span class="amount-item">已结金额: 8,582.40</span>
                <span class="amount-item warning">未结金额: -1,576.00</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>

          <div class="receivables-item" @click="showCustomerReceivables('客户2811')">
            <div class="customer-info">
              <span class="customer-name">客户2811</span>
              <div class="receivables-amounts">
                <span class="amount-item">应收金额: 4,000.00</span>
                <span class="amount-item">已结金额: 4,000.00</span>
                <span class="amount-item">未结金额: 0.00</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </div>
        </div>
      </section>
    </div>

    <!-- 日期选择器弹窗 -->
    <div v-if="showDatePicker" class="date-picker-overlay" @click="showDatePicker = false">
      <div class="date-picker-modal" @click.stop>
        <div class="date-picker-header">
          <h3>选择时间范围</h3>
          <button class="close-btn" @click="showDatePicker = false">×</button>
        </div>
        <div class="date-picker-content">
          <div class="quick-dates">
            <button
              v-for="quick in quickDates"
              :key="quick.key"
              class="quick-date-btn"
              @click="selectQuickDate(quick)"
            >
              {{ quick.label }}
            </button>
          </div>
          <div class="custom-date">
            <div class="date-input-group">
              <label>开始日期</label>
              <input type="date" v-model="customStartDate">
            </div>
            <div class="date-input-group">
              <label>结束日期</label>
              <input type="date" v-model="customEndDate">
            </div>
          </div>
          <div class="date-picker-actions">
            <button class="confirm-btn" @click="confirmDateSelection">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析维度选择弹窗 -->
    <div v-if="showDimensionPicker" class="modal-overlay" @click="showDimensionPicker = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>选择分析维度</h3>
          <button class="modal-close" @click="showDimensionPicker = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="dimension-options">
            <button 
              v-for="option in analysisOptions" 
              :key="option.value"
              class="dimension-option-btn"
              :class="{ active: selectedAnalysis === option.value }"
              @click="selectAnalysis(option)"
            >
              <div class="option-label">{{ option.label }}</div>
              <div class="option-desc">{{ option.desc }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级筛选弹窗 -->
    <div v-if="showAdvancedFilter" class="modal-overlay" @click="showAdvancedFilter = false">
      <div class="filter-modal" @click.stop>
        <div class="modal-header">
          <h3>筛选条件</h3>
          <button class="modal-close" @click="showAdvancedFilter = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="filter-options">
            <div class="filter-option-group">
              <label class="option-label">员工筛选：</label>
              <div class="checkbox-group">
                <label v-for="employee in allEmployees" :key="employee.id" class="checkbox-item">
                  <input type="checkbox" v-model="selectedEmployees" :value="employee.id">
                  <span class="checkbox-label">{{ employee.name }} ({{ employee.department }})</span>
                </label>
              </div>
            </div>
            
            <div class="filter-option-group">
              <label class="option-label">区域筛选：</label>
              <div class="checkbox-group">
                <label v-for="region in regions" :key="region.value" class="checkbox-item">
                  <input type="checkbox" v-model="selectedRegions" :value="region.value">
                  <span class="checkbox-label">{{ region.label }}</span>
                </label>
              </div>
            </div>
            
            <div class="filter-option-group">
              <label class="option-label">客户等级：</label>
              <div class="checkbox-group">
                <label v-for="level in customerLevels" :key="level.value" class="checkbox-item">
                  <input type="checkbox" v-model="selectedLevels" :value="level.value">
                  <span class="checkbox-label">{{ level.label }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="filter-actions">
            <button class="reset-btn" @click="resetFilters">重置</button>
            <button class="apply-btn" @click="applyFilters">应用筛选</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户明细弹窗 -->
    <div v-if="showCustomerDetail" class="modal-overlay" @click="showCustomerDetail = false">
      <div class="detail-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ detailModalTitle }}</h3>
          <button class="modal-close" @click="showCustomerDetail = false">✕</button>
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
  name: 'CustomerAnalysis',
  data() {
    return {
      activeTab: 'customer-info',
      isTabsSticky: false,
      showDatePicker: false,
      selectedDateRange: {
        start: new Date(2025, 0, 1),
        end: new Date(2025, 0, 31)
      },
      customStartDate: '',
      customEndDate: '',
      tabs: [
        { key: 'customer-info', label: '客户信息' },
        { key: 'customer-trade', label: '客户交易' },
        { key: 'customer-coverage', label: '客户铺市' },
        { key: 'customer-profit', label: '客户盈利' },
        { key: 'customer-receivables', label: '单据应收' }
      ],
      quickDates: [
        { key: 'today', label: '今天' },
        { key: 'yesterday', label: '昨天' },
        { key: 'last7days', label: '最近7天' },
        { key: 'last30days', label: '最近30天' },
        { key: 'thisMonth', label: '本月' },
        { key: 'lastMonth', label: '上月' }
      ]
    }
  },
  mounted() {
    this.setupScrollListener()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },

    setupScrollListener() {
      const mainContent = this.$refs.mainContent
      if (mainContent) {
        mainContent.addEventListener('scroll', this.handleScroll)
      } else {
        window.addEventListener('scroll', this.handleScroll)
      }
    },

    handleScroll() {
      // 检查标签是否应该固定
      const tabsElement = document.querySelector('.sticky-tabs')
      if (tabsElement) {
        const rect = tabsElement.getBoundingClientRect()
        this.isTabsSticky = rect.top <= 0
      }

      // 更新活动标签
      this.updateActiveTab()
    },

    updateActiveTab() {
      const sections = this.tabs.map(tab => document.getElementById(tab.key))

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 100) {
            this.activeTab = this.tabs[i].key
            break
          }
        }
      }
    },

    scrollToSection(sectionKey) {
      const element = document.getElementById(sectionKey)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },

    formatDateRange(range) {
      const start = range.start.toLocaleDateString('zh-CN')
      const end = range.end.toLocaleDateString('zh-CN')
      return `${start} - ${end}`
    },

    selectQuickDate(quick) {
      const today = new Date()
      let start, end

      switch (quick.key) {
        case 'today':
          start = end = new Date(today)
          break
        case 'yesterday':
          start = end = new Date(today.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'last7days':
          start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          end = new Date(today)
          break
        case 'last30days':
          start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          end = new Date(today)
          break
        case 'thisMonth':
          start = new Date(today.getFullYear(), today.getMonth(), 1)
          end = new Date(today)
          break
        case 'lastMonth':
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          end = new Date(today.getFullYear(), today.getMonth(), 0)
          break
      }

      this.selectedDateRange = { start, end }
      this.showDatePicker = false
    },

    confirmDateSelection() {
      if (this.customStartDate && this.customEndDate) {
        this.selectedDateRange = {
          start: new Date(this.customStartDate),
          end: new Date(this.customEndDate)
        }
      }
      this.showDatePicker = false
    },

    // 业务方法
    showUndeliveredCustomers() {
      console.log('显示未铺货客户详情')
    },

    // 新增的移动端交互方法
    showCustomerInfoDetail() {
      console.log('显示客户信息详情说明')
    },

    showEffectiveCustomers() {
      console.log('显示有效客户详情')
    },

    showNewCustomers() {
      console.log('显示新增客户详情')
    },

    showTransactionDetail() {
      console.log('显示交易分析详情说明')
    },

    showCoverageDetail() {
      console.log('显示铺市分析详情说明')
    },

    showProfitDetail() {
      console.log('显示利润分析详情说明')
    },

    showBreakdownDetail(type) {
      console.log('显示利润拆解详情:', type)
    },

    showProfitTrend() {
      console.log('显示利润趋势详情')
    },

    showCustomerReceivables(customerName) {
      console.log('显示客户应收详情:', customerName)
    },

    showSegmentDetail(segment) {
      console.log('显示客户分层详情:', segment)
    },

    showSalesPerformance() {
      console.log('显示销售表现详情')
    },

    showReturnAnalysis() {
      console.log('显示退货分析详情')
    },

    showBrandCoverage() {
      console.log('显示品牌覆盖详情')
    },

    showProductCoverage() {
      console.log('显示商品覆盖详情')
    },

    showCollectionTemplate() {
      console.log('显示催收模板')
    },

    showReceivablesDetail() {
      console.log('显示应收详情')
    },

    showRiskCustomers() {
      console.log('显示风险客户')
    }
  }
}
</script>

<style scoped>
@import '../styles/customer-analysis.css';

/* CSS重置 - 超强制表格横向布局 */
.customer-dimension-analysis *,
.customer-dimension-analysis *::before,
.customer-dimension-analysis *::after {
  box-sizing: border-box;
}

/* 核心表格强制规则 - 最高优先级 */
.customer-dimension-analysis .employee-table {
  display: table !important;
  width: 100% !important;
  min-width: 750px !important;
  border-collapse: collapse !important;
  table-layout: fixed !important;
  margin: 0 !important;
  padding: 0 !important;
}

.customer-dimension-analysis .employee-table,
.customer-dimension-analysis .employee-table * {
  display: table !important;
}

.customer-dimension-analysis .employee-table thead {
  display: table-header-group !important;
  width: 100% !important;
}

.customer-dimension-analysis .employee-table tbody {
  display: table-row-group !important;
  width: 100% !important;
}

.customer-dimension-analysis .employee-table tr {
  display: table-row !important;
  width: 100% !important;
}

.customer-dimension-analysis .employee-table th,
.customer-dimension-analysis .employee-table td {
  display: table-cell !important;
  padding: 16px 12px !important;
  border-right: 1px solid #f0f0f0 !important;
  text-align: center !important;
  vertical-align: middle !important;
  white-space: nowrap !important;
}

/* 整体布局 */
.customer-dimension-analysis {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 顶部操作区（固定置顶） */
.header-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
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

/* 筛选操作区域 */
.filter-section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
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

.time-picker,
.dimension-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
}

.time-picker:hover,
.dimension-picker:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.time-text,
.dimension-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.time-arrow,
.dimension-arrow {
  color: #666666;
  flex-shrink: 0;
}

.filter-btn,
.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.filter-btn:hover,
.export-btn:hover {
  background-color: #0056d6;
}

.filter-btn {
  background-color: #f8f9fa;
  color: #333333;
  border: 1px solid #ddd;
}

.filter-btn:hover {
  background-color: #f0f8ff;
  border-color: #007AFF;
  color: #007AFF;
}

/* 维度切换栏（紧邻顶部，固定） */
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

/* 统计信息栏（维度切换栏下方，固定） */
.stats-section {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeaea;
}

.stats-info {
  color: #666666;
  font-size: 14px;
}

.stats-text {
  color: #333333;
  font-weight: 500;
}

/* 表格容器 - 强制横向布局 */
.data-list-section {
  background-color: #ffffff;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #e8e8e8;
  /* 关键：确保表格容器可以水平滚动 */
  overflow-x: auto !important;
  overflow-y: hidden !important;
  width: calc(100vw - 32px) !important; /* 确保容器占满可用宽度 */
  max-width: calc(100vw - 32px) !important;
  /* 强制不要缩小 */
  flex-shrink: 0 !important;
  min-width: 0 !important;
}

/* 表格滚动容器 - 强制横向滚动 */
.table-scroll-container {
  width: 100%;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  /* 强制显示滚动条 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
  /* 强制最小宽度 */
  min-width: 100%;
}

.table-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}

/* Grid表格样式 - 完全替代HTML表格 */
.employee-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr; /* 4列网格 */
  min-width: 700px;
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.grid-row-group {
  display: contents; /* 让子元素直接参与grid布局 */
}

.grid-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 16px 12px;
  color: #495057;
  font-size: 14px;
  font-weight: 700;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.grid-header:last-child {
  border-right: none;
}

.grid-cell {
  padding: 16px 12px;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}

.grid-cell:last-child {
  border-right: none;
}

.grid-cell:hover {
  background: linear-gradient(90deg, #f8fbff 0%, #e3f2fd 50%, #f8fbff 100%);
  box-shadow: 0 4px 12px rgba(0,123,255,0.15);
}

.employee-cell {
  justify-content: flex-start;
  text-align: left;
}

.metric-cell,
.rate-cell {
  justify-content: center;
  text-align: center;
}

/* 表头样式 - 已集成到grid-header */

/* 数据行样式 - 已集成到grid-cell */

/* 员工信息 */
.employee-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.employee-name {
  color: #333333;
  font-size: 15px;
  font-weight: 600;
}

.employee-tag {
  color: #666666;
  font-size: 12px;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

/* 指标数值 */
.metric-value {
  color: #007AFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: transparent;
  display: inline-block;
}

.metric-value:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.metric-value.covered {
  color: #00b42a;
}

.metric-value.covered:hover {
  background-color: rgba(0, 180, 42, 0.1);
}

.metric-value.uncovered {
  color: #f53f3f;
}

.metric-value.uncovered:hover {
  background-color: rgba(245, 63, 63, 0.1);
}

/* 铺货率 */
.rate-value {
  font-size: 16px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-block;
}

.rate-excellent {
  color: #00b42a;
  background-color: rgba(0, 180, 42, 0.1);
}

.rate-good {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.rate-fair {
  color: #ff9900;
  background-color: rgba(255, 153, 0, 0.1);
}

.rate-poor {
  color: #f53f3f;
  background-color: rgba(245, 63, 63, 0.1);
}

/* 底部提示 */
.list-footer {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #666666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #007AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
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

.modal,
.filter-modal,
.detail-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.modal-content {
  padding: 16px 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* 时间选择选项 */
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

/* 分析维度选项 */
.dimension-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dimension-option-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333333;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dimension-option-btn:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.dimension-option-btn.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

.option-label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 13px;
  opacity: 0.8;
}

/* 高级筛选 */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.checkbox-label {
  color: #333333;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eaeaea;
}

.reset-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.apply-btn {
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn:hover {
  background-color: #0056d6;
}

/* 客户明细列表 */
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

/* Grid响应式设计 - 永远保持4列横向 */
@media screen and (max-width: 768px) {
  .data-list-section {
    margin: 8px;
    width: calc(100vw - 16px);
  }
  
  .employee-grid {
    min-width: 600px; /* 稍微减小最小宽度 */
  }
  
  .grid-header,
  .grid-cell {
    padding: 12px 8px;
    font-size: 13px;
  }
  
  .employee-name {
    font-size: 14px;
  }
  
  .employee-tag {
    font-size: 11px;
  }
  
  .metric-value,
  .rate-value {
    font-size: 14px;
  }
}

@media screen and (max-width: 480px) {
  .data-list-section {
    margin: 4px;
    width: calc(100vw - 8px);
  }
  
  .employee-grid {
    min-width: 500px; /* 小屏幕最小宽度 */
  }
  
  .grid-header,
  .grid-cell {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .employee-name {
    font-size: 12px;
  }
  
  .employee-tag {
    font-size: 10px;
  }
  
  .metric-value,
  .rate-value {
    font-size: 12px;
  }
}

@media screen and (max-width: 400px) {
  .employee-grid {
    min-width: 450px; /* 390px屏幕专用 */
    grid-template-columns: 200px 80px 80px 90px; /* 固定列宽 */
  }
  
  .grid-header,
  .grid-cell {
    padding: 6px 2px;
    font-size: 11px;
  }
}

/* 全局覆盖 - 阻止任何CSS框架的垂直堆叠 */
@media screen and (max-width: 1200px) {
  .employee-table,
  .employee-table *,
  .employee-table thead,
  .employee-table tbody,
  .employee-table tr,
  .employee-table th,
  .employee-table td {
    display: revert !important;
  }
  
  .employee-table {
    display: table !important;
    min-width: 650px !important;
  }
  
  .employee-table thead {
    display: table-header-group !important;
  }
  
  .employee-table tbody {
    display: table-row-group !important;
  }
  
  .employee-table tr {
    display: table-row !important;
  }
  
  .employee-table th,
  .employee-table td {
    display: table-cell !important;
  }
}

/* 最强覆盖 - 针对所有可能的选择器 */
* .employee-table,
*[class*="employee"] table,
.customer-dimension-analysis table {
  display: table !important;
  min-width: 650px !important;
  table-layout: fixed !important;
}

* .employee-table thead,
* .employee-table tbody,
*[class*="employee"] thead,
*[class*="employee"] tbody {
  display: table-row-group !important;
}

* .employee-table thead {
  display: table-header-group !important;
}

* .employee-table tr,
*[class*="employee"] tr {
  display: table-row !important;
}

* .employee-table th,
* .employee-table td,
*[class*="employee"] th,
*[class*="employee"] td {
  display: table-cell !important;
}

/* 移动端优化样式 */
/* 固定标签导航样式 */
.sticky-tabs {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow 0.2s ease;
}

.sticky-tabs.sticky {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tab-container {
  display: flex;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-container::-webkit-scrollbar {
  display: none;
}

.tab-item {
  flex-shrink: 0;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-item.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.tab-item:hover {
  color: #1890ff;
}

/* 时间筛选区样式 */
.time-filter-section {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.time-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.time-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.time-comparison {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.comparison-text {
  color: #999;
}

/* 分析部分标题样式 */
.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  margin-right: 8px;
}

.detail-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: #1890ff;
  font-size: 12px;
  cursor: pointer;
}

.profit-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

/* 移动端指标列表样式 */
.mobile-metrics {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.metric-row:hover {
  background: #f8f9fa;
}

.metric-row.highlight {
  background: #fff7e6;
  border-left: 3px solid #fa8c16;
}

.metric-info {
  flex: 1;
}

.metric-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.metric-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  line-height: 1.4;
}

/* 交易分析样式 */
.transaction-summary {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.summary-comparison {
  display: flex;
  gap: 16px;
}

.comparison-item {
  font-size: 12px;
  color: #666;
}

/* 移动端分析列表样式 */
.mobile-analysis-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.analysis-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.analysis-item:hover {
  background: #f8f9fa;
}

.analysis-info {
  flex: 1;
}

.analysis-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.analysis-desc {
  font-size: 14px;
  color: #666;
}

/* 利润分析样式 */
.profit-summary {
  margin-bottom: 20px;
}

.profit-main {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.profit-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.profit-value {
  display: block;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
}

.profit-value.negative {
  color: #ff4d4f;
}

.profit-comparison {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.breakdown-table {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.breakdown-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.breakdown-row:hover {
  background: #f8f9fa;
}

.breakdown-info {
  flex: 1;
}

.breakdown-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.breakdown-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
}

.breakdown-value.positive {
  color: #52c41a;
}

.breakdown-value.negative {
  color: #ff4d4f;
}

.breakdown-trend {
  text-align: right;
}

.trend-text {
  font-size: 12px;
  color: #666;
}

/* 趋势分析样式 */
.profit-trend {
  margin-bottom: 20px;
}

.trend-section {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.trend-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.trend-chart {
  cursor: pointer;
}

.chart-placeholder {
  margin-bottom: 12px;
}

.trend-insights {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.insight-label {
  color: #666;
}

.insight-value {
  color: #ff4d4f;
  font-weight: 500;
}

/* 应收账款样式 */
.receivables-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.receivables-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.receivables-item:hover {
  background: #f8f9fa;
}

.customer-info {
  flex: 1;
}

.customer-name {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.receivables-amounts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.amount-item {
  font-size: 12px;
  color: #666;
}

.amount-item.warning {
  color: #ff4d4f;
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

.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal,
.filter-modal,
.detail-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
