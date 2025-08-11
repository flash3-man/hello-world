<template>
  <div class="employee-analysis">
    <!-- 顶部导航区 -->
    <div class="header-bar">
      <button class="back-arrow" @click="goBack">
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="#333333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">员工整体分析</h1>
      <div class="date-section">
        <div class="date-range" @click="showDatePicker">
          <span class="date-text">{{ currentDateRange }}</span>
        </div>
      </div>
    </div>

    <!-- 维度切换标签 -->
    <div class="dimension-tabs">
      <button 
        v-for="tab in dimensionTabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentDimension === tab.value }"
        @click="switchDimension(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 拜访分析模块 -->
      <div v-if="currentDimension === 'visit'" class="analysis-module">
        <div class="module-header">
          <div class="module-title">
            <svg class="module-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2L3 7L8 12L13 7L8 2Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text">拜访分析</span>
          </div>
          <button class="indicator-help" @click="showIndicatorModal('visit')">
            <span class="help-text">指标说明</span>
            <svg class="question-icon" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" stroke="#999999" stroke-width="1" fill="none"/>
              <text x="6" y="8" text-anchor="middle" font-size="8" fill="#999999">?</text>
            </svg>
          </button>
        </div>

        <!-- 核心数据概览 -->
        <div class="visit-overview">
          <div class="overview-title">
            <span class="title-icon">📊</span>
            <span>核心拜访数据</span>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-label">拜访覆盖率</div>
              <div class="stat-value highlight">{{ visitData.coverageRate }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均拜访频次</div>
              <div class="stat-value">{{ visitData.avgFrequency }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">拜访成功率</div>
              <div class="stat-value success">{{ visitData.successRate }}%</div>
            </div>
          </div>
        </div>

        <!-- 拜访数据卡片 -->
        <div class="visit-data-section">
          <div class="section-title">
            <span class="title-icon">👥</span>
            <span>详细拜访统计</span>
          </div>
          <div class="data-cards enhanced">
            <div class="data-card primary" @click="navigateToPerformanceAnalysis('visit-customers')">
              <div class="card-header">
                <div class="card-icon visit-customers">🏢</div>
                <div class="card-trend positive">
                  <span class="trend-icon">↗</span>
                  <span class="trend-text">+{{ visitData.customerGrowth }}%</span>
                </div>
              </div>
              <div class="card-content">
                <div class="card-title">拜访客户数（去重累计）</div>
                <div class="card-value">{{ visitData.uniqueCustomers }}</div>
                <div class="card-subtitle">
                  <span class="subtitle-label">员工平均数</span>
                  <span class="subtitle-value">{{ visitData.avgUniqueCustomers }}</span>
                </div>
                <div class="card-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: visitData.customerProgress + '%' }"></div>
                  </div>
                  <div class="progress-text">目标达成 {{ visitData.customerProgress }}%</div>
                </div>
              </div>
            </div>
            
            <div class="data-card primary" @click="navigateToPerformanceAnalysis('visit-times')">
              <div class="card-header">
                <div class="card-icon visit-times">📅</div>
                <div class="card-trend positive">
                  <span class="trend-icon">↗</span>
                  <span class="trend-text">+{{ visitData.timesGrowth }}%</span>
                </div>
              </div>
              <div class="card-content">
                <div class="card-title">拜访客户次数（总数）</div>
                <div class="card-value">{{ visitData.totalVisits }}</div>
                <div class="card-subtitle">
                  <span class="subtitle-label">平均数</span>
                  <span class="subtitle-value">{{ visitData.avgVisits }}</span>
                </div>
                <div class="card-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: visitData.timesProgress + '%' }"></div>
                  </div>
                  <div class="progress-text">目标达成 {{ visitData.timesProgress }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 拜访效率分析 -->
        <div class="visit-efficiency-section">
          <div class="section-title">
            <span class="title-icon">⚡</span>
            <span>拜访效率分析</span>
          </div>
          <div class="efficiency-cards">
            <div class="efficiency-card">
              <div class="efficiency-icon">🎯</div>
              <div class="efficiency-content">
                <div class="efficiency-label">拜访转化率</div>
                <div class="efficiency-value">{{ visitData.conversionRate }}%</div>
                <div class="efficiency-desc">拜访后成单比例</div>
              </div>
            </div>
            <div class="efficiency-card">
              <div class="efficiency-icon">⏱️</div>
              <div class="efficiency-content">
                <div class="efficiency-label">平均拜访时长</div>
                <div class="efficiency-value">{{ visitData.avgDuration }}分钟</div>
                <div class="efficiency-desc">单次拜访平均时间</div>
              </div>
            </div>
            <div class="efficiency-card">
              <div class="efficiency-icon">📈</div>
              <div class="efficiency-content">
                <div class="efficiency-label">重复拜访率</div>
                <div class="efficiency-value">{{ visitData.repeatRate }}%</div>
                <div class="efficiency-desc">客户重复拜访比例</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 行动建议区域 -->
        <div class="action-recommendations">
          <div class="section-title">
            <span class="title-icon">💡</span>
            <span>行动建议</span>
          </div>
          <div class="action-buttons enhanced">
            <button class="action-btn primary" @click="navigateToAction('improve-visit')">
              <div class="btn-icon">📈</div>
              <div class="btn-content">
                <div class="btn-title">提升拜访</div>
                <div class="btn-desc">查看拜访机会分析</div>
              </div>
              <div class="btn-arrow">→</div>
            </button>
            <button class="action-btn secondary" @click="navigateToAction('improve-efficiency')">
              <div class="btn-icon">⚡</div>
              <div class="btn-content">
                <div class="btn-title">提高效率</div>
                <div class="btn-desc">优化拜访路线规划</div>
              </div>
              <div class="btn-arrow">→</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 销售分析模块 -->
      <div v-if="currentDimension === 'sales'" class="analysis-module">
        <!-- 1. 标题区（模块顶部，高度 44px） -->
        <div class="module-header sales-header">
          <div class="module-title">
            <svg class="module-icon sales-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 4L8 2L14 4V12L8 14L2 12V4Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text sales-title">销售分析</span>
          </div>
          <button class="indicator-help" @click="showIndicatorModal('sales')">
            <span class="help-text">指标说明</span>
            <svg class="question-icon" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" stroke="#999999" stroke-width="1" fill="none"/>
              <text x="6" y="8" text-anchor="middle" font-size="8" fill="#999999">?</text>
            </svg>
          </button>
        </div>

        <!-- 数据更新时间 -->
        <div class="data-timestamp">
          <span class="timestamp-icon">🕐</span>
          <span class="timestamp-text">数据更新时间：{{ currentDateRange }} 18:00</span>
        </div>

        <!-- 2. 核心数据区（标题区下方，高度 96px） -->
        <div class="sales-core-data">
          <div class="core-data-title">
            <span class="title-icon">💰</span>
            <span>核心销售指标</span>
          </div>
          <div class="core-data-cards sales-cards">
            <!-- 数据卡 1：销售金额 -->
            <div class="core-card sales-amount-card">
              <div class="card-header">
                <div class="card-icon sales-icon-bg">📈</div>
                <div class="card-trend positive">
                  <span class="trend-icon">↗</span>
                  <span class="trend-text">+{{ salesData.salesGrowth }}%</span>
                </div>
              </div>
              <div class="card-content">
                <div class="card-title">销售金额</div>
                <div class="card-value sales">¥{{ formatAmount(salesData.salesAmount) }}</div>
                <div class="card-subtitle">
                  <span class="subtitle-label">员工中位数</span>
                  <span class="subtitle-value">¥{{ formatAmount(salesData.medianSales) }}</span>
                </div>
                <div class="performance-indicator">
                  <div class="indicator-text">
                    {{ salesData.salesAmount > salesData.medianSales ? '高于' : '低于' }}平均水平
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 数据卡 2：退货金额 -->
            <div class="core-card return-amount-card">
              <div class="card-header">
                <div class="card-icon return-icon-bg">📉</div>
                <div class="card-trend warning">
                  <span class="trend-icon">⚠</span>
                  <span class="trend-text">需关注</span>
                </div>
              </div>
              <div class="card-content">
                <div class="card-title">退货金额</div>
                <div class="card-value return">¥{{ formatAmount(salesData.returnAmount) }}</div>
                <div class="card-subtitle">
                  <span class="subtitle-label">员工中位数</span>
                  <span class="subtitle-value">¥{{ formatAmount(salesData.medianReturn) }}</span>
                </div>
                <div class="risk-indicator">
                  <div class="risk-level high">退货风险偏高</div>
                  <div class="risk-rate">退货率 {{ ((salesData.returnAmount / salesData.salesAmount) * 100).toFixed(1) }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 分类分析区（核心数据区下方，高度 160px） -->
        <div class="employee-classification-section">
          <div class="classification-title">
            <span class="title-icon">👥</span>
            <span>员工表现分类分析</span>
            <div class="classification-legend">
              <span class="legend-item">
                <span class="legend-dot high-performance"></span>
                <span class="legend-text">表现优异</span>
              </span>
              <span class="legend-item">
                <span class="legend-dot warning-performance"></span>
                <span class="legend-text">需要关注</span>
              </span>
            </div>
          </div>
          
          <div class="employee-type-grid enhanced">
            <!-- 销售多退货少：标杆员工 -->
            <div class="type-card excellent" @click="navigateToEmployeePerformance('high-sales-low-return')">
              <div class="card-header">
                <div class="performance-badge excellent">标杆</div>
                <div class="employee-count">{{ salesData.highSalesLowReturn }}人</div>
              </div>
              <div class="card-content">
                <div class="type-label">销售多退货少</div>
                <div class="type-desc">表现优异，可推广经验</div>
                <div class="performance-metrics">
                  <div class="metric-item">
                    <span class="metric-label">平均销售额</span>
                    <span class="metric-value">¥{{ formatAmount(salesData.avgHighSalesLowReturn) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">退货率</span>
                    <span class="metric-value good">{{ salesData.lowReturnRate }}%</span>
                  </div>
                </div>
              </div>
              <div class="action-hint">
                <span class="hint-icon">👆</span>
                <span class="hint-text">点击查看详情</span>
              </div>
            </div>

            <!-- 销售多退货多：压货风险 -->
            <div class="type-card warning" @click="navigateToEmployeePerformance('high-sales-high-return')">
              <div class="card-header">
                <div class="performance-badge warning">风险</div>
                <div class="employee-count">{{ salesData.highSalesHighReturn }}人</div>
              </div>
              <div class="card-content">
                <div class="type-label">销售多退货多</div>
                <div class="type-desc">疑似压货，需排查原因</div>
                <div class="performance-metrics">
                  <div class="metric-item">
                    <span class="metric-label">平均销售额</span>
                    <span class="metric-value">¥{{ formatAmount(salesData.avgHighSalesHighReturn) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">退货率</span>
                    <span class="metric-value warning">{{ salesData.highReturnRate }}%</span>
                  </div>
                </div>
              </div>
              <div class="action-hint">
                <span class="hint-icon">👆</span>
                <span class="hint-text">点击查看详情</span>
              </div>
            </div>

            <!-- 销售少退货少：一般表现 -->
            <div class="type-card normal" @click="navigateToEmployeePerformance('low-sales-low-return')">
              <div class="card-header">
                <div class="performance-badge normal">一般</div>
                <div class="employee-count">{{ salesData.lowSalesLowReturn }}人</div>
              </div>
              <div class="card-content">
                <div class="type-label">销售少退货少</div>
                <div class="type-desc">表现一般，需提升销售</div>
                <div class="performance-metrics">
                  <div class="metric-item">
                    <span class="metric-label">平均销售额</span>
                    <span class="metric-value">¥{{ formatAmount(salesData.avgLowSalesLowReturn) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">退货率</span>
                    <span class="metric-value good">{{ salesData.lowReturnRate }}%</span>
                  </div>
                </div>
              </div>
              <div class="action-hint">
                <span class="hint-icon">👆</span>
                <span class="hint-text">点击查看详情</span>
              </div>
            </div>

            <!-- 销售少退货多：重点关注 -->
            <div class="type-card attention" @click="navigateToEmployeePerformance('low-sales-high-return')">
              <div class="card-header">
                <div class="performance-badge attention">关注</div>
                <div class="employee-count">{{ salesData.lowSalesHighReturn }}人</div>
              </div>
              <div class="card-content">
                <div class="type-label">销售少退货多</div>
                <div class="type-desc">需重点培训或调整</div>
                <div class="performance-metrics">
                  <div class="metric-item">
                    <span class="metric-label">平均销售额</span>
                    <span class="metric-value">¥{{ formatAmount(salesData.avgLowSalesHighReturn) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">退货率</span>
                    <span class="metric-value danger">{{ salesData.highReturnRate }}%</span>
                  </div>
                </div>
              </div>
              <div class="action-hint">
                <span class="hint-icon">👆</span>
                <span class="hint-text">点击查看详情</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 行动区（分类分析区下方，高度 72px） -->
        <div class="sales-action-section">
          <div class="action-title">
            <span class="title-icon">🚀</span>
            <span>深度分析入口</span>
          </div>
          <div class="action-buttons sales-actions">
            <!-- 按钮 1：员工销售表现 -->
            <button class="action-btn primary sales-detail" @click="navigateToAction('employee-performance')">
              <div class="btn-icon">👨‍💼</div>
              <div class="btn-content">
                <div class="btn-title">员工销售表现</div>
                <div class="btn-desc">查看每位员工的销售明细、铺货客户数、退货率等详细信息</div>
                <div class="btn-features">
                  <span class="feature-tag">支持排序</span>
                  <span class="feature-tag">客户分布</span>
                  <span class="feature-tag">商品结构</span>
                </div>
              </div>
              <div class="btn-arrow">→</div>
            </button>
            
            <!-- 按钮 2：销售和退货变化分析 -->
            <button class="action-btn secondary trend-analysis" @click="navigateToAction('sales-return-analysis')">
              <div class="btn-icon">📊</div>
              <div class="btn-content">
                <div class="btn-title">销售和退货变化分析</div>
                <div class="btn-desc">查看销售金额、退货金额的环比、同比变化趋势</div>
                <div class="btn-features">
                  <span class="feature-tag">趋势图表</span>
                  <span class="feature-tag">区域筛选</span>
                  <span class="feature-tag">根因分析</span>
                </div>
              </div>
              <div class="btn-arrow">→</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 铺市分析模块 -->
      <div v-if="currentDimension === 'market'" class="analysis-module">
        <div class="module-header">
          <div class="module-title">
            <svg class="module-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 3H13V13H3V3ZM5 5V11H11V5H5Z" fill="#4A90E2"/>
            </svg>
            <span class="title-text">铺市分析</span>
          </div>
        </div>

        <!-- 行动按钮 -->
        <div class="market-actions">
          <button class="market-action-btn" @click="navigateToAction('customer-coverage')">
            <div class="action-icon">👥</div>
            <div class="action-text">提升客户覆盖</div>
            <div class="action-desc">查看应铺未铺客户</div>
          </button>
          <button class="market-action-btn" @click="navigateToAction('brand-coverage')">
            <div class="action-icon">🏷️</div>
            <div class="action-text">提升品牌覆盖</div>
            <div class="action-desc">查看应铺未铺品牌</div>
          </button>
          <button class="market-action-btn" @click="navigateToAction('product-coverage')">
            <div class="action-icon">📦</div>
            <div class="action-text">提升商品覆盖</div>
            <div class="action-desc">查看应铺未铺商品</div>
          </button>
        </div>
      </div>

      <!-- 利润分析模块 -->
      <div v-if="currentDimension === 'profit'" class="analysis-module profit-analysis">
        <!-- 1. 标题区 -->
        <div class="profit-header">
          <div class="profit-title-wrapper">
            <div class="profit-icon">
              <i class="fas fa-yen-sign"></i>
            </div>
            <h3 class="profit-title">利润分析</h3>
            <div class="indicator-help" @click="showIndicatorModal('profit')">
              <i class="fas fa-question-circle"></i>
            </div>
          </div>
          <div class="comparison-toggle">
            <span :class="{ active: profitCompareType === 'mom' }" @click="profitCompareType = 'mom'">环比</span>
            <span :class="{ active: profitCompareType === 'yoy' }" @click="profitCompareType = 'yoy'">同比</span>
          </div>
        </div>
        
        <!-- 数据更新时间戳 -->
        <div class="data-timestamp">
          <i class="fas fa-clock timestamp-icon"></i>
          <span class="timestamp-text">数据更新时间：{{ profitData.lastUpdateTime || '2024-08-11 15:30:00' }}</span>
        </div>
        
        <!-- 2. 核心数据区 -->
        <div class="profit-core-data">
          <div class="core-data-title">
            <i class="fas fa-chart-bar"></i>
            <span>核心利润指标</span>
          </div>
          
          <div class="profit-data-grid enhanced">
            <!-- 员工利润（整体） -->
            <div class="profit-data-card total-profit" @click="showProfitDetail('employee-profit')">
              <div class="card-top">
                <div class="card-icon total-profit-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="card-label">员工利润（整体）</div>
              </div>
              <div class="card-value negative">¥{{ formatAmount(profitData.employeeProfit) }}</div>
              <div class="card-trend negative">
                <i class="fas fa-arrow-down"></i>
                {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↓{{ profitData.profitChange }}%
              </div>
              <div class="loss-indicator">
                <span class="loss-text">整体亏损状态</span>
              </div>
            </div>
            
            <!-- 净销售额 -->
            <div class="profit-data-card net-sales" @click="showProfitDetail('net-sales')">
              <div class="card-top">
                <div class="card-icon net-sales-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="card-label">净销售额</div>
              </div>
              <div class="card-value">¥{{ formatAmount(profitData.netSales) }}</div>
              <div class="card-trend positive">
                <i class="fas fa-arrow-up"></i>
                {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.netSalesChange }}%
              </div>
              <div class="performance-indicator positive">
                <span class="indicator-text">销售增长良好</span>
              </div>
            </div>
            
            <!-- 销售金额 -->
            <div class="profit-data-card sales-amount" @click="showProfitDetail('sales-amount')">
              <div class="card-top">
                <div class="card-icon sales-amount-icon">
                  <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="card-label">销售金额</div>
              </div>
              <div class="card-value">¥{{ formatAmount(profitData.salesAmount) }}</div>
              <div class="card-trend positive">
                <i class="fas fa-arrow-up"></i>
                {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.salesChange }}%
              </div>
            </div>
            
            <!-- 商品成本 -->
            <div class="profit-data-card product-cost" @click="showProfitDetail('product-cost')">
              <div class="card-top">
                <div class="card-icon product-cost-icon">
                  <i class="fas fa-boxes"></i>
                </div>
                <div class="card-label">商品成本</div>
              </div>
              <div class="card-value">¥{{ formatAmount(profitData.productCost) }}</div>
              <div class="card-trend warning">
                <i class="fas fa-arrow-up"></i>
                {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.costChange }}%
              </div>
              <div class="cost-warning">
                <span class="warning-text">成本控制需关注</span>
              </div>
            </div>
            
            <!-- 销售毛利（高亮强调） -->
            <div class="profit-data-card gross-profit highlighted" @click="showProfitDetail('gross-profit')">
              <div class="card-top">
                <div class="card-icon gross-profit-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="card-label">销售毛利</div>
              </div>
              <div class="card-value white-text">¥{{ formatAmount(profitData.grossProfit) }}</div>
              <div class="card-trend positive white-text">
                <i class="fas fa-arrow-up"></i>
                {{ profitCompareType === 'mom' ? '环比' : '同比' }} ↑{{ profitData.grossProfitChange }}%
              </div>
              <div class="highlight-label">
                <span class="highlight-text">核心盈利指标</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 3. 员工利润列表区 -->
        <div class="employee-profit-section">
          <div class="profit-list-title">
            <i class="fas fa-users-cog"></i>
            <span>员工利润排行</span>
            <div class="sort-indicator">
              <span class="sort-text">按增长率排序</span>
            </div>
          </div>
          
          <div class="profit-table">
            <div class="table-header">
              <div class="header-col employee-name">员工姓名</div>
              <div class="header-col growth-rate">增长率</div>
              <div class="header-col change-amount">变化值</div>
              <div class="header-col current-profit">本期销售毛利</div>
            </div>
            
            <div class="table-body">
              <div v-for="employee in sortedEmployeeProfit" :key="employee.id" 
                   class="profit-row" :class="{ warning: employee.growthRate < -50 }"
                   @click="viewEmployeeDetail(employee.id)">
                <div class="row-col employee-name">
                  <span class="employee-name-text">{{ employee.name }}</span>
                  <i v-if="employee.growthRate < -50" class="fas fa-flag warning-flag" title="业绩预警"></i>
                </div>
                <div class="row-col growth-rate">
                  <span :class="employee.growthRate >= 0 ? 'positive' : 'negative'">
                    <i :class="employee.growthRate >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ employee.growthRate >= 0 ? '+' : '' }}{{ employee.growthRate }}%
                  </span>
                </div>
                <div class="row-col change-amount">
                  <span :class="employee.changeValue >= 0 ? 'positive' : 'negative'">
                    {{ employee.changeValue >= 0 ? '+' : '' }}{{ formatAmount(employee.changeValue) }}
                  </span>
                </div>
                <div class="row-col current-profit">
                  <span>{{ formatAmount(employee.currentProfit || Math.abs(employee.changeValue)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 4. 行动区 -->
        <div class="profit-action-section">
          <div class="action-title">
            <i class="fas fa-tools"></i>
            <span>深度分析工具</span>
          </div>
          
          <div class="profit-actions">
            <button class="action-btn profit-detail" @click="handleProfitDetail">
              <div class="btn-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <div class="btn-content">
                <div class="btn-title">利润明细分析</div>
                <div class="btn-desc">查看员工个人成本构成、收入来源及盈亏分析</div>
                <div class="btn-features">
                  <span class="feature-tag">成本拆解</span>
                  <span class="feature-tag">收入追踪</span>
                  <span class="feature-tag">盈亏分析</span>
                </div>
              </div>
              <div class="btn-arrow">→</div>
            </button>
            
            <button class="action-btn cost-analysis" @click="handleCostAnalysis">
              <div class="btn-icon">
                <i class="fas fa-calculator"></i>
              </div>
              <div class="btn-content">
                <div class="btn-title">成本结构分析</div>
                <div class="btn-desc">分析商品成本构成，识别高成本商品和优化空间</div>
                <div class="btn-features">
                  <span class="feature-tag">成本构成</span>
                  <span class="feature-tag">Top5分析</span>
                  <span class="feature-tag">优化建议</span>
                </div>
              </div>
              <div class="btn-arrow">→</div>
            </button>
          </div>
          
          <div class="load-more-section">
            <button class="load-more-btn" @click="loadMoreEmployees">
              <i class="fas fa-plus-circle"></i>
              查看更多员工利润数据
            </button>
          </div>
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

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicator" class="modal-overlay" @click="showIndicator = false">
      <div class="indicator-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ currentIndicatorTitle }}</h3>
          <button class="close-btn" @click="showIndicator = false">×</button>
        </div>
        <div class="indicator-content">
          <div v-html="currentIndicatorContent"></div>
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
      currentDateRange: '06-01～06-26',
      currentDimension: 'visit', // visit, sales, market, profit
      showDateModal: false,
      showIndicator: false,
      selectedDateOption: 'current',
      profitCompareType: 'mom', // mom: 环比, yoy: 同比
      profitSortBy: 'growthRate', // growthRate, changeValue
      currentIndicatorTitle: '',
      currentIndicatorContent: '',
      
      // 维度标签
      dimensionTabs: [
        { value: 'visit', label: '拜访分析' },
        { value: 'sales', label: '销售分析' },
        { value: 'market', label: '铺市分析' },
        { value: 'profit', label: '利润' }
      ],
      
      // 日期选择选项
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
      
      // 拜访分析数据
      visitData: {
        uniqueCustomers: 16,
        avgUniqueCustomers: 1.7,
        totalVisits: 20,
        avgVisits: 2,
        // 新增字段
        coverageRate: 78.5,
        avgFrequency: 2.3,
        successRate: 92.1,
        customerGrowth: 15.8,
        timesGrowth: 23.4,
        customerProgress: 78,
        timesProgress: 85,
        conversionRate: 24.6,
        avgDuration: 45,
        repeatRate: 68.3
      },
      
      // 销售分析数据
      salesData: {
        salesAmount: 53552.74,
        medianSales: 494.00,
        returnAmount: 956.68,
        medianReturn: 0.00,
        highSalesLowReturn: 0,
        highSalesHighReturn: 9,
        lowSalesLowReturn: 0,
        lowSalesHighReturn: 9,
        // 新增字段
        salesGrowth: 18.5,
        lowReturnRate: 3.2,
        highReturnRate: 15.8,
        avgHighSalesLowReturn: 8500.00,
        avgHighSalesHighReturn: 6200.00,
        avgLowSalesLowReturn: 2800.00,
        avgLowSalesHighReturn: 1500.00
      },
      
      // 利润分析数据
      profitData: {
        lastUpdateTime: '2024-08-11 15:30:00',
        employeeProfit: -6617.54,
        profitChange: 104.06,
        netSales: 52596.06,
        netSalesChange: 76.82,
        salesAmount: 53552.74,
        salesChange: 76.41,
        productCost: 49908.24,
        costChange: 18.91,
        grossProfit: 2251.46,
        grossProfitChange: 98.64
      },
      
      // 员工利润数据
      employeeProfitData: [
        {
          id: 1,
          name: '黄保杰',
          role: '销售代表',
          growthRate: 687.23,
          changeValue: 5127.18,
          currentProfit: 5874.35
        },
        {
          id: 2,
          name: '李明',
          role: '渠道经理',
          growthRate: 245.67,
          changeValue: 3245.89,
          currentProfit: 4567.23
        },
        {
          id: 3,
          name: '王芳',
          role: '销售代表',
          growthRate: 156.78,
          changeValue: 2134.56,
          currentProfit: 3456.78
        },
        {
          id: 4,
          name: '陈强',
          role: '客户经理',
          growthRate: 89.45,
          changeValue: 1234.67,
          currentProfit: 2345.89
        },
        {
          id: 5,
          name: '刘娜',
          role: '销售代表',
          growthRate: 34.56,
          changeValue: 567.89,
          currentProfit: 1678.90
        },
        {
          id: 6,
          name: '赵辉',
          role: '销售代表',
          growthRate: -12.34,
          changeValue: -234.56,
          currentProfit: 1567.89
        },
        {
          id: 7,
          name: '孙丽',
          role: '客户经理',
          growthRate: -45.67,
          changeValue: -789.12,
          currentProfit: 945.67
        },
        {
          id: 8,
          name: '张霞',
          role: '销售代表',
          growthRate: -98.89,
          changeValue: -4567.89,
          currentProfit: 123.45
        }
      ]
    }
  },
  
  computed: {
    // 排序后的员工利润数据
    sortedEmployeeProfit() {
      const data = [...this.employeeProfitData]
      if (this.profitSortBy === 'growthRate') {
        return data.sort((a, b) => b.growthRate - a.growthRate)
      } else {
        return data.sort((a, b) => b.changeValue - a.changeValue)
      }
    }
  },
  
  methods: {
    // 格式化金额
    formatAmount(amount) {
      if (amount == null || amount === '') return '0.00'
      
      const num = parseFloat(amount)
      if (isNaN(num)) return '0.00'
      
      const absNum = Math.abs(num)
      
      return absNum.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 显示日期选择器
    showDatePicker() {
      this.showDateModal = true
    },
    
    // 选择日期
    selectDateOption(value) {
      this.selectedDateOption = value
      const dateMap = {
        'today': '08-11～08-11',
        'yesterday': '08-10～08-10', 
        'current': '08-01～08-11',
        'last': '07-01～07-31',
        'last7': '08-05～08-11',
        'last30': '07-12～08-11',
        'quarter': '06-01～08-11',
        'year': '01-01～08-11'
      }
      this.currentDateRange = dateMap[value] || '06-01～06-26'
      this.showDateModal = false
    },
    
    // 切换分析维度
    switchDimension(dimension) {
      this.currentDimension = dimension
    },
    
    // 显示指标说明
    showIndicatorModal(type) {
      const indicators = {
        visit: {
          title: '拜访分析指标说明',
          content: `
            <div class="indicator-item">
              <strong>拜访客户数（去重累计）：</strong>统计期间内员工拜访过的<span class="highlight">不重复客户数量</span>，同一客户多次拜访只计算一次
            </div>
            <div class="indicator-item">
              <strong>拜访客户次数（总数）：</strong>统计期间内员工的<span class="highlight">拜访总次数</span>，包含对同一客户的多次拜访
            </div>
            <div class="indicator-item">
              <strong>计算规则：</strong>
              <ul>
                <li>拜访记录以<span class="highlight">实际拜访时间</span>为准</li>
                <li>电话拜访、上门拜访均纳入统计</li>
                <li>取消的拜访记录<span class="highlight">不计入</span>统计</li>
              </ul>
            </div>
          `
        },
        sales: {
          title: '销售分析指标说明',
          content: `
            <div class="indicator-item">
              <strong>销售金额：</strong>统计期间内员工完成的<span class="highlight">销售订单总金额</span>，不含税费
            </div>
            <div class="indicator-item">
              <strong>退货金额：</strong>统计期间内员工负责客户的<span class="highlight">退货订单总金额</span>
            </div>
            <div class="indicator-item">
              <strong>员工分类规则：</strong>
              <ul>
                <li><span class="highlight">销售多退货少：</span>销售额>平均值且退货率<10%</li>
                <li><span class="highlight">销售多退货多：</span>销售额>平均值但退货率≥10%</li>
                <li><span class="highlight">销售少退货少：</span>销售额≤平均值且退货率<10%</li>
                <li><span class="highlight">销售少退货多：</span>销售额≤平均值且退货率≥10%</li>
              </ul>
            </div>
          `
        },
        profit: {
          title: '利润分析指标说明',
          content: `
            <div class="indicator-item">
              <strong>员工利润：</strong>员工负责客户产生的<span class="highlight">净利润总额</span>，计算公式：销售金额 - 商品成本 - 费用分摊
            </div>
            <div class="indicator-item">
              <strong>净销售额：</strong>销售金额扣除退货后的<span class="highlight">实际销售金额</span>
            </div>
            <div class="indicator-item">
              <strong>销售毛利：</strong>销售金额与商品成本的<span class="highlight">差额</span>，不含其他费用
            </div>
            <div class="indicator-item">
              <strong>环比/同比计算：</strong>
              <ul>
                <li><span class="highlight">环比：</span>与上月同期数据对比</li>
                <li><span class="highlight">同比：</span>与去年同期数据对比</li>
                <li>增长率 = (当期数值 - 对比期数值) / 对比期数值 × 100%</li>
              </ul>
            </div>
          `
        }
      }
      
      const indicator = indicators[type]
      if (indicator) {
        this.currentIndicatorTitle = indicator.title
        this.currentIndicatorContent = indicator.content
        this.showIndicator = true
      }
    },
    
    // 导航到具体行动页面
    navigateToAction(action) {
      console.log(`导航到行动页面: ${action}`)
      
      // 根据不同的action跳转到对应页面
      switch(action) {
        // 拜访分析相关跳转
        case 'improve-visit':
        case 'improve-efficiency':
          // 提升拜访、提高效率 -> 进入拜访分析
          this.$router.push('/visit-analysis')
          break
          
        // 销售分析相关跳转
        case 'employee-performance':
          // 员工销售表现 -> 进入员工业绩汇总表
          this.$router.push('/employee-performance')
          break
          
        case 'sales-return-analysis':
          // 销售和退货变化分析 -> 进入业绩变化分析
          this.$router.push('/performance-analysis')
          break
          
        // 铺市分析相关跳转
        case 'customer-coverage':
        case 'brand-coverage':  
        case 'product-coverage':
          // 各页签跳转进入铺市分析
          this.$router.push('/market-analysis')
          break
          
        default:
          alert('功能开发中...')
      }
    },
    
    // 跳转到业绩变化分析
    navigateToPerformanceAnalysis(type) {
      console.log(`跳转到业绩变化分析: ${type}`)
      // 拜访客户数、拜访客户次数 -> 进入业绩变化分析
      this.$router.push({
        path: '/performance-analysis',
        query: { type: type, source: 'employee-analysis' }
      })
    },
    
    // 跳转到员工业绩汇总表
    navigateToEmployeePerformance(category) {
      console.log(`跳转到员工业绩汇总表: ${category}`)
      // 员工类型分析各页签 -> 进入员工业绩汇总表
      this.$router.push({
        path: '/employee-performance',
        query: { category: category, source: 'employee-analysis' }
      })
    },
    
    // 显示利润明细
    showProfitDetail(type) {
      console.log(`显示利润明细: ${type}`)
      
      const detailTitles = {
        'employee-profit': '员工利润明细',
        'net-sales': '净销售额明细',
        'sales-amount': '销售金额明细', 
        'product-cost': '商品成本明细',
        'gross-profit': '销售毛利明细'
      }
      
      const detailData = {
        'employee-profit': [
          { name: '黄保杰', value: 5127.18, change: 687.23 },
          { name: '渠道经理', value: 2.00, change: 100.00 },
          { name: '李小红', value: 890.34, change: 45.67 },
          { name: '张小明', value: -1245.68, change: -15.32 },
          { name: '王小强', value: -567.89, change: -8.91 }
        ],
        'net-sales': [
          { name: '线上销售', value: 25896.32, change: 82.15 },
          { name: '线下门店', value: 18542.67, change: 65.43 },
          { name: '代理商销售', value: 8157.07, change: 98.76 }
        ],
        'sales-amount': [
          { name: '主营商品', value: 42356.89, change: 78.92 },
          { name: '辅助商品', value: 11195.85, change: 71.23 }
        ],
        'product-cost': [
          { name: '原材料成本', value: 32845.67, change: 15.34 },
          { name: '加工成本', value: 12876.43, change: 22.87 },
          { name: '包装成本', value: 4186.14, change: 28.56 }
        ],
        'gross-profit': [
          { name: '主营业务毛利', value: 1856.78, change: 95.23 },
          { name: '其他业务毛利', value: 394.68, change: 105.87 }
        ]
      }
      
      // 模拟弹窗显示明细数据
      const title = detailTitles[type] || '明细数据'
      const data = detailData[type] || []
      
      let detailContent = `${title}\n\n`
      data.forEach(item => {
        const changeText = item.change > 0 ? `↑${item.change}%` : `↓${Math.abs(item.change)}%`
        detailContent += `${item.name}: ¥${this.formatAmount(item.value)} (${changeText})\n`
      })
      
      alert(detailContent)
    },
    
    // 查看员工详情
    viewEmployeeDetail(employeeId) {
      const employee = this.employeeProfitData.find(emp => emp.id === employeeId)
      if (employee) {
        console.log(`查看员工详情: ${employee.name}`)
        alert(`查看 ${employee.name} 的利润明细`)
      }
    },
    
    // 加载更多员工
    loadMoreEmployees() {
      console.log('加载更多员工数据')
      alert('加载更多员工数据...')
    },
    
    // 利润分析相关方法
    handleProfitDetail() {
      console.log('查看利润明细分析')
      this.$router.push({
        path: '/profit-detail',
        query: { source: 'employee-analysis' }
      })
    },
    
    handleCostAnalysis() {
      console.log('查看成本结构分析')
      this.$router.push({
        path: '/cost-analysis', 
        query: { source: 'employee-analysis' }
      })
    },
    
    handleGrossProfitDetail() {
      console.log('查看销售毛利详情')
      this.$router.push({
        path: '/gross-profit-analysis',
        query: { source: 'employee-analysis' }
      })
    },
    
    showProfitHelp() {
      const helpContent = `
        <div class="profit-help-content">
          <h4>利润分析指标说明</h4>
          <div class="help-item">
            <strong>员工利润：</strong>销售毛利减去员工相关运营成本（工资、差旅等）
          </div>
          <div class="help-item">
            <strong>净销售额：</strong>销售金额减去退货金额后的净收入
          </div>
          <div class="help-item">
            <strong>销售毛利：</strong>销售金额与商品成本的差额，反映核心盈利能力
          </div>
          <div class="help-item">
            <strong>商品成本：</strong>包含采购成本、生产成本等直接成本
          </div>
        </div>
      `
      
      // 使用自定义弹窗显示帮助信息
      this.currentIndicatorTitle = '利润分析指标说明'
      this.currentIndicatorContent = helpContent
      this.showIndicator = true
    }
  }
}
</script>

<style scoped>
/* 整体页面布局 */
.employee-analysis {
  min-height: 100vh;
  background-color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 顶部导航区 */
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

.back-arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
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

.page-title {
  color: #333333;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

.date-section {
  display: flex;
  align-items: center;
}

.date-range {
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: 1px solid #E5E7EB;
  background-color: #F9FAFB;
}

.date-range:hover {
  background-color: #F3F4F6;
  border-color: #D1D5DB;
}

.date-text {
  color: #999999;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

/* 维度切换标签 */
.dimension-tabs {
  display: flex;
  padding: 0 1rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
  gap: 0;
}

.tab-item {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  color: #999999;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-item:hover {
  color: #4A90E2;
}

.tab-item.active {
  color: #4A90E2;
  border-bottom-color: #4A90E2;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 1rem;
  background-color: #F8F9FA;
}

/* 分析模块 */
.analysis-module {
  background-color: #FFFFFF;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 模块头部 */
.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #F0F0F0;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.title-text {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
}

.indicator-help {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
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

.compare-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  background: none;
  border: 1px solid #E5E7EB;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  color: #999999;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.toggle-btn.active {
  background-color: #4A90E2;
  border-color: #4A90E2;
  color: #FFFFFF;
}

/* 拜访分析 - 优化样式 */

/* 核心数据概览 */
.visit-overview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.overview-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.title-icon {
  font-size: 1.125rem;
}

.overview-stats {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.stat-value.highlight {
  color: #FFD700;
}

.stat-value.success {
  color: #90EE90;
}

/* 区域标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid #E5E7EB;
}

.visit-data-section,
.visit-efficiency-section,
.action-recommendations {
  margin-bottom: 1.5rem;
}

/* 增强的数据卡片 */
.data-cards.enhanced {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.data-card.primary {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.data-card.primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.15);
  border-color: #4A90E2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.card-icon.visit-customers {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-icon.visit-times {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-trend.positive {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.trend-icon {
  font-size: 0.875rem;
}

.card-content {
  text-align: center;
}

.card-title {
  color: #666666;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.card-value {
  color: #333333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.card-subtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}

.subtitle-label {
  color: #999999;
}

.subtitle-value {
  color: #333333;
  font-weight: 600;
}

.card-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 0.375rem;
  background-color: #f1f5f9;
  border-radius: 0.1875rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A90E2 0%, #667eea 100%);
  border-radius: 0.1875rem;
  transition: width 0.6s ease;
}

.progress-text {
  color: #666666;
  font-size: 0.6875rem;
  text-align: center;
}

/* 拜访效率分析 */
.efficiency-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.efficiency-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.efficiency-card:hover {
  border-color: #4A90E2;
  background-color: #f8faff;
  transform: translateY(-2px);
}

.efficiency-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.efficiency-label {
  color: #666666;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.efficiency-value {
  color: #333333;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.efficiency-desc {
  color: #999999;
  font-size: 0.6875rem;
}

/* 增强的行动按钮 */
.action-buttons.enhanced {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn.primary,
.action-btn.secondary {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.action-btn.primary:hover {
  border-color: #4A90E2;
  background-color: #f8faff;
  transform: translateX(4px);
}

.action-btn.secondary:hover {
  border-color: #10b981;
  background-color: #f0fdf4;
  transform: translateX(4px);
}

.btn-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.action-btn.primary .btn-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
}

.action-btn.secondary .btn-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.btn-content {
  flex: 1;
}

.btn-title {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.btn-desc {
  color: #666666;
  font-size: 0.75rem;
}

.btn-arrow {
  color: #999999;
  font-size: 1.125rem;
  font-weight: 600;
  flex-shrink: 0;
}

.card-title {
  color: #666666;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.card-value {
  color: #333333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: #999999;
  font-size: 0.6875rem;
}

/* 销售分析 - 深度优化样式 */

/* 1. 标题区优化 */
.sales-header {
  background: linear-gradient(135deg, #f8faff 0%, #e8f4fd 100%);
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  padding: 1rem;
  margin-bottom: 1rem;
}

.sales-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
  border-radius: 50%;
  padding: 0.25rem;
}

.sales-title {
  color: #1e40af;
  font-weight: 700;
}

/* 数据更新时间 */
.data-timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #4A90E2;
}

.timestamp-icon {
  font-size: 0.875rem;
}

.timestamp-text {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 2. 核心数据区优化 */
.sales-core-data {
  margin-bottom: 1.5rem;
}

.core-data-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid #e2e8f0;
}

.sales-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.sales-amount-card,
.return-amount-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sales-amount-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.return-amount-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.sales-amount-card:hover,
.return-amount-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-icon.sales-icon-bg {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.card-icon.return-icon-bg {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.card-trend.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.performance-indicator {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(34, 197, 94, 0.1);
  border-radius: 0.375rem;
  text-align: center;
}

.indicator-text {
  color: #16a34a;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-indicator {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.375rem;
  text-align: center;
}

.risk-level.high {
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.risk-rate {
  color: #ef4444;
  font-size: 0.6875rem;
}

/* 3. 分类分析区优化 */
.employee-classification-section {
  margin-bottom: 1.5rem;
}

.classification-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-bottom: 2px solid #e2e8f0;
}

.classification-title > span:first-child {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
}

.classification-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.legend-dot.high-performance {
  background-color: #22c55e;
}

.legend-dot.warning-performance {
  background-color: #ef4444;
}

.legend-text {
  color: #64748b;
  font-size: 0.75rem;
}

.employee-type-grid.enhanced {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-card.excellent,
.type-card.warning,
.type-card.normal,
.type-card.attention {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.type-card.excellent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.type-card.warning::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%);
}

.type-card.normal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6b7280 0%, #4b5563 100%);
}

.type-card.attention::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.type-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.performance-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.performance-badge.excellent {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.performance-badge.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #ea580c;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.performance-badge.normal {
  background-color: rgba(107, 114, 128, 0.1);
  color: #4b5563;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.performance-badge.attention {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.employee-count {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
}

.type-card .card-content {
  text-align: left;
  margin-bottom: 1rem;
}

.type-card .type-label {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.type-card .type-desc {
  color: #6b7280;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  color: #6b7280;
  font-size: 0.6875rem;
}

.metric-value {
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-value.good {
  color: #16a34a;
}

.metric-value.warning {
  color: #ea580c;
}

.metric-value.danger {
  color: #dc2626;
}

.action-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background-color: rgba(74, 144, 226, 0.05);
  border-radius: 0.375rem;
  margin-top: 0.75rem;
}

.hint-icon {
  font-size: 0.75rem;
}

.hint-text {
  color: #4A90E2;
  font-size: 0.6875rem;
  font-weight: 500;
}

/* 4. 行动区优化 */
.sales-action-section {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.action-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.sales-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn.sales-detail,
.action-btn.trend-analysis {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.action-btn.sales-detail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #4A90E2 0%, #667eea 100%);
}

.action-btn.trend-analysis::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

.action-btn.sales-detail:hover {
  border-color: #4A90E2;
  background: linear-gradient(135deg, #f8faff 0%, #e8f4fd 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
}

.action-btn.trend-analysis:hover {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.sales-actions .btn-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.action-btn.sales-detail .btn-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
}

.action-btn.trend-analysis .btn-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.sales-actions .btn-content {
  flex: 1;
}

.sales-actions .btn-title {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.sales-actions .btn-desc {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.btn-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background-color: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
}

.sales-actions .btn-arrow {
  color: #94a3b8;
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-btn:hover .btn-arrow {
  color: #475569;
  transform: translateX(4px);
}

/* 行动按钮 */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  background-color: #4A90E2;
  border: none;
  border-radius: 0.375rem;
  color: #FFFFFF;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  max-width: 200px;
}

.action-btn:hover {
  background-color: #3B7DD8;
}

/* 铺市分析 - 行动按钮 */
.market-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.market-action-btn {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.market-action-btn:hover {
  border-color: #4A90E2;
  background-color: #F8FAFF;
}

.action-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.action-text {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.action-desc {
  color: #666666;
  font-size: 0.75rem;
}

/* 利润分析 - 深度优化样式 */

/* 1. 标题区优化 */
.profit-header {
  background: linear-gradient(135deg, #f8faff 0%, #e8f4fd 100%);
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profit-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profit-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
  border-radius: 50%;
  padding: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.profit-title {
  color: #1e40af;
  font-weight: 700;
  font-size: 1.125rem;
  margin: 0;
}

.indicator-help {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-help:hover {
  color: #4A90E2;
  background-color: rgba(74, 144, 226, 0.1);
}

.comparison-toggle {
  display: flex;
  gap: 0.5rem;
}

.comparison-toggle span {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #6b7280;
  background-color: #f3f4f6;
}

.comparison-toggle span.active {
  color: white;
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
}

/* 数据更新时间 */
.data-timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #4A90E2;
}

.timestamp-icon {
  font-size: 0.875rem;
  color: #4A90E2;
}

.timestamp-text {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 2. 核心数据区优化 */
.profit-core-data {
  margin-bottom: 1.5rem;
}

.core-data-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid #e2e8f0;
}

.profit-data-grid.enhanced {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.profit-data-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 130px;
  min-width: 0;
}

.profit-data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.profit-data-card.total-profit::before {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.profit-data-card.net-sales::before {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.profit-data-card.sales-amount::before {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.profit-data-card.product-cost::before {
  background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%);
}

.profit-data-card.highlighted {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
  color: white;
}

.profit-data-card.highlighted::before {
  background: linear-gradient(90deg, #1e40af 0%, #3730a3 100%);
}

.profit-data-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: block;
  margin-bottom: 0.5rem;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.card-icon.total-profit-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.card-icon.net-sales-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.card-icon.sales-amount-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.card-icon.product-cost-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
}

.card-icon.gross-profit-icon {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.card-info {
  overflow: hidden;
}

/* 移除旧的card-info样式，使用新的布局 */

.card-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
  flex: 1;
}

.highlighted .card-label {
  color: rgba(255, 255, 255, 0.9);
}

.card-value {
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  display: block;
  width: 100%;
}

.card-value.negative {
  color: #ef4444;
}

.card-value.white-text {
  color: white;
}

.card-trend {
  display: block;
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.card-trend.positive {
  color: #10b981;
}

.card-trend.negative {
  color: #ef4444;
}

.card-trend.warning {
  color: #f59e0b;
}

.card-trend.white-text {
  color: rgba(255, 255, 255, 0.9);
}

.loss-indicator {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.375rem;
  text-align: center;
}

.loss-text {
  color: #dc2626;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
}

.performance-indicator {
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
}

.performance-indicator.positive {
  background-color: rgba(16, 185, 129, 0.1);
}

.indicator-text {
  color: #059669;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
}

.cost-warning {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(245, 158, 11, 0.1);
  border-radius: 0.375rem;
  text-align: center;
}

.warning-text {
  color: #ea580c;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
}

.highlight-label {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  text-align: center;
}

.highlight-text {
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
}

/* 3. 员工利润列表区优化 */
.employee-profit-section {
  margin-bottom: 1.5rem;
}

.profit-list-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-bottom: 2px solid #e2e8f0;
}

.profit-list-title > span:first-child {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
}

.sort-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.sort-text {
  color: #64748b;
  font-size: 0.75rem;
  background-color: rgba(74, 144, 226, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.profit-table {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 30% 25% 25% 20%;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-col {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.profit-row {
  display: grid;
  grid-template-columns: 30% 25% 25% 20%;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.profit-row:hover {
  background-color: #f8fafc;
}

.profit-row.warning {
  background-color: rgba(239, 68, 68, 0.05);
  border-left: 4px solid #ef4444;
}

.row-col {
  display: flex;
  align-items: center;
  color: #374151;
  font-size: 0.875rem;
}

.row-col.employee-name {
  gap: 0.5rem;
}

.employee-name-text {
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
}

.employee-name-text:hover {
  color: #4A90E2;
}

.warning-flag {
  color: #ef4444;
  font-size: 0.75rem;
}

.row-col.growth-rate span,
.row-col.change-amount span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
}

.row-col .positive {
  color: #10b981;
}

.row-col .negative {
  color: #ef4444;
}

/* 4. 行动区优化 */
.profit-action-section {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.action-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.profit-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn.profit-detail,
.action-btn.cost-analysis {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.action-btn.profit-detail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #4A90E2 0%, #667eea 100%);
}

.action-btn.cost-analysis::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f59e0b 0%, #ea580c 100%);
}

.action-btn.profit-detail:hover {
  border-color: #4A90E2;
  background: linear-gradient(135deg, #f8faff 0%, #e8f4fd 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
}

.action-btn.cost-analysis:hover {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
}

.profit-actions .btn-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.action-btn.profit-detail .btn-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
  color: white;
}

.action-btn.cost-analysis .btn-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
}

.profit-actions .btn-content {
  flex: 1;
}

.profit-actions .btn-title {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.profit-actions .btn-desc {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.btn-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background-color: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
}

.profit-actions .btn-arrow {
  color: #94a3b8;
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-btn:hover .btn-arrow {
  color: #475569;
  transform: translateX(4px);
}

.load-more-section {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.load-more-btn {
  background: linear-gradient(135deg, #4A90E2 0%, #667eea 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

/* 员工利润列表（旧样式，保留部分兼容性） */

/* 员工利润列表 */
.employee-profit-list {
  background-color: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 0.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #F0F0F0;
}

.list-title {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 600;
}

.sort-options {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  background: none;
  border: 1px solid #E5E7EB;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  color: #666666;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
}

.sort-btn.active {
  background-color: #4A90E2;
  border-color: #4A90E2;
  color: #FFFFFF;
}

.employee-list {
  max-height: 400px;
  overflow-y: auto;
}

.employee-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.employee-item:hover {
  background-color: #F8F9FA;
}

.employee-item:last-child {
  border-bottom: none;
}

.employee-info {
  flex: 1;
}

.employee-name {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.employee-role {
  color: #666666;
  font-size: 0.75rem;
}

.profit-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-right: 2rem;
}

.growth-rate,
.change-value {
  font-size: 0.75rem;
  font-weight: 500;
}

.growth-rate.positive,
.change-value.positive {
  color: #22C55E;
}

.growth-rate.negative,
.change-value.negative {
  color: #EF4444;
}

.detail-arrow {
  position: absolute;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.load-more-btn {
  width: 100%;
  background: none;
  border: none;
  padding: 1rem;
  color: #4A90E2;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-btn:hover {
  background-color: #F8F9FA;
}

/* 弹窗样式 */
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
  font-weight: 600;
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

.indicator-item .highlight {
  color: #4A90E2;
  font-weight: 600;
}

.indicator-item ul {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.indicator-item li {
  margin-bottom: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-bar {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1rem;
    padding: 0 0.5rem;
  }
  
  .dimension-tabs {
    padding: 0 0.5rem;
  }
  
  .tab-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .main-content {
    padding: 0.75rem;
  }
  
  .data-cards,
  .core-data-cards,
  .type-grid,
  .profit-data-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .data-cards.enhanced {
    grid-template-columns: 1fr;
  }
  
  .efficiency-cards {
    grid-template-columns: 1fr;
  }
  
  .overview-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    max-width: none;
  }
  
  .profit-metrics {
    margin-right: 1rem;
  }
  
  .employee-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .date-text {
    font-size: 0.75rem;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .compare-toggle {
    align-self: flex-end;
  }
  
  .sort-options {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .visit-overview {
    padding: 1rem;
  }
  
  .overview-title {
    font-size: 0.875rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .efficiency-icon {
    font-size: 1.5rem;
  }
  
  .card-value {
    font-size: 1.5rem;
  }
  
  .btn-content {
    font-size: 0.75rem;
  }
}
</style>
