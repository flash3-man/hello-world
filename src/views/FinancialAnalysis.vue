<template>
  <div class="financial-analysis">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <svg class="back-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M10 4L6 8L10 12"/>
        </svg>
      </button>
      <h1 class="page-title">资金</h1>
      <button class="more-btn" @click="showMoreOptions">
        <svg class="more-icon" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="3" r="1.5"/>
          <circle cx="8" cy="8" r="1.5"/>
          <circle cx="8" cy="13" r="1.5"/>
        </svg>
      </button>
    </div>

    <!-- 应收账款概况模块 -->
    <div class="receivables-overview">
      <div class="section-header">
        <h2 class="section-title">应收账款概况</h2>
        <button class="info-btn" @click="showIndicatorInfo">
          <svg class="info-icon" width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" stroke="#007AFF" fill="none"/>
            <text x="6" y="9" text-anchor="middle" font-size="8" fill="#007AFF">?</text>
          </svg>
          <span class="info-text">指标说明</span>
        </button>
      </div>
      
      <div class="overview-data">
        <div class="data-row">
          <span class="data-label">应收余额</span>
          <span class="data-value negative">-661,697.11元</span>
        </div>
        <div class="data-row">
          <span class="data-label">当日回款金额</span>
          <span class="data-value">232.00元</span>
        </div>
        <div class="data-row">
          <span class="data-label">当月回款率</span>
          <span class="data-value">5.54%</span>
        </div>
      </div>
      
      <div class="risk-notice">
        <span class="notice-badge">备注</span>
        <span class="notice-text">未结金额最早日期：2024-03-15</span>
      </div>
    </div>

    <!-- 回款及应收余额趋势模块 -->
    <div class="trend-section">
      <div class="trend-header">
        <h3 class="trend-title">回款及应收余额趋势</h3>
        <div class="trend-tabs">
          <button 
            :class="['trend-tab', { active: activeTrendTab === 'payment' }]"
            @click="switchTrendTab('payment')"
          >
            回款金额
          </button>
          <button 
            :class="['trend-tab', { active: activeTrendTab === 'receivables' }]"
            @click="switchTrendTab('receivables')"
          >
            应收余额
          </button>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <svg class="trend-chart" width="100%" height="200" viewBox="0 0 300 200">
            <!-- 坐标轴 -->
            <line x1="30" y1="170" x2="270" y2="170" stroke="#e0e0e0" stroke-width="1"/>
            <line x1="30" y1="30" x2="30" y2="170" stroke="#e0e0e0" stroke-width="1"/>
            
            <!-- 趋势线 -->
            <polyline 
              v-if="activeTrendTab === 'payment'"
              points="30,150 70,120 110,140 150,100 190,130 230,90 270,110"
              fill="none" 
              stroke="#333333" 
              stroke-width="2"
            />
            <polyline 
              v-if="activeTrendTab === 'receivables'"
              points="30,140 70,160 110,130 150,170 190,120 230,150 270,100"
              fill="none" 
              stroke="#007AFF" 
              stroke-width="2"
            />
            
            <!-- 数据点 -->
            <circle v-if="activeTrendTab === 'payment'" cx="230" cy="90" r="3" fill="#333333"/>
            <circle v-if="activeTrendTab === 'receivables'" cx="270" cy="100" r="3" fill="#007AFF"/>
            
            <!-- X轴标签 -->
            <text x="50" y="185" text-anchor="middle" font-size="10" fill="#666">7/20</text>
            <text x="110" y="185" text-anchor="middle" font-size="10" fill="#666">7/25</text>
            <text x="170" y="185" text-anchor="middle" font-size="10" fill="#666">7/30</text>
            <text x="230" y="185" text-anchor="middle" font-size="10" fill="#666">8/5</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- 应收余额分布模块 -->
    <div class="distribution-section">
      <div class="distribution-header">
        <h3 class="distribution-title">应收余额分布</h3>
        <div class="distribution-tabs">
          <button
            :class="['distribution-tab', { active: activeDistributionTab === 'time' }]"
            @click="switchDistributionTab('time')"
          >
            按单据时间
          </button>
          <button
            :class="['distribution-tab', { active: activeDistributionTab === 'channel' }]"
            @click="switchDistributionTab('channel')"
          >
            按渠道
          </button>
        </div>
      </div>

      <!-- 按单据时间 - 饼图 -->
      <div v-if="activeDistributionTab === 'time'" class="pie-chart-container">
        <div class="pie-chart">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="#e3f2fd" stroke="#fff" stroke-width="2"/>
            <path d="M 60,60 L 60,10 A 50,50 0 0,1 95,35 Z" fill="#1976d2"/>
            <path d="M 60,60 L 95,35 A 50,50 0 0,1 110,60 Z" fill="#42a5f5"/>
          </svg>
        </div>
        <div class="pie-legend">
          <div class="legend-item">
            <span class="legend-color" style="background-color: #1976d2;"></span>
            <span class="legend-text">8月 65%</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #42a5f5;"></span>
            <span class="legend-text">6月 35%</span>
          </div>
        </div>
      </div>

      <!-- 按渠道 - 列表 -->
      <div v-if="activeDistributionTab === 'channel'" class="channel-list">
        <div
          v-for="channel in channelData"
          :key="channel.id"
          class="channel-card"
        >
          <div class="channel-info">
            <div class="channel-name">{{ channel.name }}</div>
            <div class="channel-amount" :class="{ negative: channel.amount < 0 }">
              {{ formatAmount(channel.amount) }}元
            </div>
          </div>
          <div class="channel-actions">
            <button class="explore-btn" @click="exploreCustomer(channel.id)">
              客户探查
            </button>
            <div v-if="channel.hasRisk" class="risk-badge">
              <span class="risk-text">备注</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细应收账款概况 -->
    <div class="detailed-receivables-overview">
      <div class="section-header">
        <h3 class="section-title">详细应收账款概况</h3>
        <button class="expand-btn" @click="toggleReceivablesDetail">
          {{ showReceivablesDetail ? '收起' : '展开' }}
        </button>
      </div>

      <!-- 概况数据卡片 -->
      <div class="overview-cards">
        <div class="data-card primary">
          <div class="card-header">
            <h3 class="card-title">应收余额</h3>
            <span class="card-icon">💰</span>
          </div>
          <div class="card-value negative">-661,697.11元</div>
          <div class="card-change">
            <span class="change-text">较昨日</span>
            <span class="change-value decrease">-2.3%</span>
          </div>
        </div>

        <div class="data-card">
          <div class="card-header">
            <h3 class="card-title">当日回款</h3>
            <span class="card-icon">📈</span>
          </div>
          <div class="card-value">232.00元</div>
          <div class="card-change">
            <span class="change-text">较昨日</span>
            <span class="change-value increase">+15.6%</span>
          </div>
        </div>

        <div class="data-card">
          <div class="card-header">
            <h3 class="card-title">当月回款率</h3>
            <span class="card-icon">📊</span>
          </div>
          <div class="card-value">5.54%</div>
          <div class="card-change">
            <span class="change-text">目标</span>
            <span class="change-value target">15.0%</span>
          </div>
        </div>
      </div>

      <!-- 展开的详细内容 -->
      <div v-if="showReceivablesDetail" class="receivables-detail-content">
        <!-- 账龄分析 -->
        <div class="aging-analysis">
          <div class="subsection-header">
            <h4 class="subsection-title">账龄分析</h4>
          </div>

          <div class="aging-chart">
            <div class="aging-item">
              <div class="aging-label">30天内</div>
              <div class="aging-bar">
                <div class="aging-progress" style="width: 45%; background-color: #28a745;"></div>
              </div>
              <div class="aging-value">45%</div>
            </div>

            <div class="aging-item">
              <div class="aging-label">31-60天</div>
              <div class="aging-bar">
                <div class="aging-progress" style="width: 25%; background-color: #ffc107;"></div>
              </div>
              <div class="aging-value">25%</div>
            </div>

            <div class="aging-item">
              <div class="aging-label">61-90天</div>
              <div class="aging-bar">
                <div class="aging-progress" style="width: 20%; background-color: #fd7e14;"></div>
              </div>
              <div class="aging-value">20%</div>
            </div>

            <div class="aging-item">
              <div class="aging-label">90天以上</div>
              <div class="aging-bar">
                <div class="aging-progress" style="width: 10%; background-color: #dc3545;"></div>
              </div>
              <div class="aging-value">10%</div>
            </div>
          </div>
        </div>

        <!-- 重点客户应收 -->
        <div class="key-customers">
          <div class="subsection-header">
            <h4 class="subsection-title">重点客户应收</h4>
          </div>

          <div class="customer-list">
            <div
              v-for="customer in keyCustomers"
              :key="customer.id"
              class="customer-item"
              @click="viewCustomerDetail(customer.id)"
            >
              <div class="customer-info">
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-days">{{ customer.overdueDays }}天</div>
              </div>
              <div class="customer-amount" :class="{ overdue: customer.isOverdue }">
                {{ formatAmount(customer.amount) }}元
              </div>
              <div class="customer-action">
                <svg class="arrow-icon" width="12" height="12" viewBox="0 0 12 12">
                  <path d="M4 2L8 6L4 10"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细趋势分析 -->
    <div class="detailed-trend-analysis">
      <div class="section-header">
        <h3 class="section-title">回款及应收余额趋势分析</h3>
        <button class="expand-btn" @click="toggleTrendDetail">
          {{ showTrendDetail ? '收起' : '展开' }}
        </button>
      </div>

      <!-- 时间范围选择 -->
      <div class="time-range-section">
        <div class="range-tabs">
          <button
            v-for="range in timeRanges"
            :key="range.key"
            :class="['range-tab', { active: activeTimeRange === range.key }]"
            @click="switchTimeRange(range.key)"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <!-- 展开的趋势详细内容 -->
      <div v-if="showTrendDetail" class="trend-detail-content">
        <!-- 增强的趋势图表 -->
        <div class="enhanced-chart-container">
          <div class="chart-tabs">
            <button
              :class="['chart-tab', { active: activeChart === 'payment' }]"
              @click="switchChart('payment')"
            >
              回款金额
            </button>
            <button
              :class="['chart-tab', { active: activeChart === 'receivables' }]"
              @click="switchChart('receivables')"
            >
              应收余额
            </button>
            <button
              :class="['chart-tab', { active: activeChart === 'both' }]"
              @click="switchChart('both')"
            >
              对比分析
            </button>
          </div>

          <div class="enhanced-chart">
            <svg class="trend-chart" width="100%" height="300" viewBox="0 0 400 300">
              <!-- 网格线 -->
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f0f0f0" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              <!-- 坐标轴 -->
              <line x1="40" y1="260" x2="360" y2="260" stroke="#e0e0e0" stroke-width="2"/>
              <line x1="40" y1="40" x2="40" y2="260" stroke="#e0e0e0" stroke-width="2"/>

              <!-- 回款金额趋势线 -->
              <polyline
                v-if="activeChart === 'payment' || activeChart === 'both'"
                points="60,200 100,180 140,160 180,120 220,140 260,100 300,110"
                fill="none"
                stroke="#007AFF"
                stroke-width="3"
              />

              <!-- 应收余额趋势线 -->
              <polyline
                v-if="activeChart === 'receivables' || activeChart === 'both'"
                points="60,180 100,200 140,190 180,220 220,180 260,200 300,170"
                fill="none"
                stroke="#ff6b6b"
                stroke-width="3"
              />

              <!-- 数据点 -->
              <circle cx="260" cy="100" r="4" fill="#007AFF" v-if="activeChart === 'payment' || activeChart === 'both'"/>
              <circle cx="300" cy="170" r="4" fill="#ff6b6b" v-if="activeChart === 'receivables' || activeChart === 'both'"/>

              <!-- X轴标签 -->
              <text x="80" y="280" text-anchor="middle" font-size="12" fill="#666">7/20</text>
              <text x="140" y="280" text-anchor="middle" font-size="12" fill="#666">7/25</text>
              <text x="200" y="280" text-anchor="middle" font-size="12" fill="#666">7/30</text>
              <text x="260" y="280" text-anchor="middle" font-size="12" fill="#666">8/5</text>
              <text x="320" y="280" text-anchor="middle" font-size="12" fill="#666">8/10</text>
            </svg>
          </div>

          <!-- 图例 -->
          <div class="enhanced-chart-legend">
            <div v-if="activeChart === 'payment' || activeChart === 'both'" class="legend-item">
              <span class="legend-color" style="background-color: #007AFF;"></span>
              <span class="legend-text">回款金额</span>
            </div>
            <div v-if="activeChart === 'receivables' || activeChart === 'both'" class="legend-item">
              <span class="legend-color" style="background-color: #ff6b6b;"></span>
              <span class="legend-text">应收余额</span>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="statistics-summary">
          <div class="subsection-header">
            <h4 class="subsection-title">数据统计</h4>
            <span class="period-text">{{ currentPeriodText }}</span>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">总回款金额</div>
              <div class="stat-value">{{ formatAmount(totalPayment) }}元</div>
              <div class="stat-change increase">+12.5%</div>
            </div>

            <div class="stat-item">
              <div class="stat-label">平均回款金额</div>
              <div class="stat-value">{{ formatAmount(avgPayment) }}元</div>
              <div class="stat-change decrease">-3.2%</div>
            </div>

            <div class="stat-item">
              <div class="stat-label">最高单日回款</div>
              <div class="stat-value">{{ formatAmount(maxDailyPayment) }}元</div>
              <div class="stat-date">{{ maxPaymentDate }}</div>
            </div>

            <div class="stat-item">
              <div class="stat-label">应收余额变化</div>
              <div class="stat-value negative">{{ formatAmount(receivablesChange) }}元</div>
              <div class="stat-change decrease">-8.7%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细分布分析 -->
    <div class="detailed-distribution-analysis">
      <div class="section-header">
        <h3 class="section-title">应收余额分布分析</h3>
        <button class="expand-btn" @click="toggleDistributionDetail">
          {{ showDistributionDetail ? '收起' : '展开' }}
        </button>
      </div>

      <!-- 分布维度选择 -->
      <div class="dimension-section">
        <div class="dimension-tabs">
          <button
            v-for="dimension in dimensions"
            :key="dimension.key"
            :class="['dimension-tab', { active: activeDimension === dimension.key }]"
            @click="switchDimension(dimension.key)"
          >
            {{ dimension.label }}
          </button>
        </div>
      </div>

      <!-- 展开的分布详细内容 -->
      <div v-if="showDistributionDetail" class="distribution-detail-content">
        <!-- 总览统计 -->
        <div class="distribution-overview">
          <div class="overview-card">
            <div class="overview-title">{{ currentDimensionLabel }}分布总计</div>
            <div class="overview-amount negative">-661,697.11元</div>
            <div class="overview-items">共{{ currentDistributionData.length }}项</div>
          </div>
        </div>

        <!-- 分布图表和列表 -->
        <div class="distribution-chart-section">
          <div class="chart-header">
            <h4 class="chart-title">{{ currentDimensionLabel }}分布</h4>
            <div class="view-toggle">
              <button
                :class="['toggle-btn', { active: viewMode === 'chart' }]"
                @click="switchViewMode('chart')"
              >
                图表
              </button>
              <button
                :class="['toggle-btn', { active: viewMode === 'list' }]"
                @click="switchViewMode('list')"
              >
                列表
              </button>
            </div>
          </div>

          <!-- 饼图视图 -->
          <div v-if="viewMode === 'chart'" class="pie-chart-view">
            <div class="pie-chart-container">
              <svg class="pie-chart" width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f0f0f0" stroke-width="2"/>

                <!-- 饼图扇形 -->
                <path
                  v-for="(segment, index) in pieSegments"
                  :key="index"
                  :d="segment.path"
                  :fill="segment.color"
                  :stroke="'#ffffff'"
                  stroke-width="2"
                  class="pie-segment"
                  @click="selectSegment(index)"
                />

                <!-- 中心文字 -->
                <text x="100" y="95" text-anchor="middle" font-size="12" fill="#666">总计</text>
                <text x="100" y="110" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">
                  {{ formatAmount(totalDistributionAmount) }}
                </text>
              </svg>
            </div>

            <div class="chart-legend">
              <div
                v-for="(item, index) in currentDistributionData"
                :key="index"
                class="legend-item"
                @click="selectSegment(index)"
              >
                <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- 列表视图 -->
          <div v-if="viewMode === 'list'" class="distribution-list-view">
            <div
              v-for="(item, index) in sortedDistributionData"
              :key="index"
              class="distribution-item"
              @click="viewItemDetail(item)"
            >
              <div class="item-indicator" :style="{ backgroundColor: item.color }"></div>
              <div class="item-content">
                <div class="item-header">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-amount" :class="{ negative: item.amount < 0 }">
                    {{ formatAmount(item.amount) }}元
                  </div>
                </div>
                <div class="item-details">
                  <span class="item-percentage">占比 {{ item.percentage }}%</span>
                  <span class="item-count">{{ item.count }}笔</span>
                </div>
                <div class="item-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: item.percentage + '%', backgroundColor: item.color }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="item-action">
                <svg class="arrow-icon" width="12" height="12" viewBox="0 0 12 12">
                  <path d="M4 2L8 6L4 10"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 分布分析洞察 -->
        <div class="distribution-insights">
          <div class="subsection-header">
            <h4 class="subsection-title">分布分析</h4>
          </div>

          <div class="analysis-insights">
            <div class="insight-item">
              <div class="insight-icon">📊</div>
              <div class="insight-content">
                <div class="insight-title">集中度分析</div>
                <div class="insight-desc">前3项占总额的{{ topThreePercentage }}%，集中度较高</div>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon">⚠️</div>
              <div class="insight-content">
                <div class="insight-title">风险提示</div>
                <div class="insight-desc">{{ riskItemName }}占比过高，存在集中风险</div>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon">💡</div>
              <div class="insight-content">
                <div class="insight-title">优化建议</div>
                <div class="insight-desc">建议分散客户结构，降低单一客户依赖</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicatorModal" class="modal-overlay" @click="hideIndicatorInfo">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>指标说明</h3>
          <button class="modal-close" @click="hideIndicatorInfo">×</button>
        </div>
        <div class="modal-body">
          <div class="indicator-item">
            <strong>应收余额：</strong>客户尚未支付的订单金额总和
          </div>
          <div class="indicator-item">
            <strong>当日回款金额：</strong>当天实际收到的客户付款
          </div>
          <div class="indicator-item">
            <strong>当月回款率：</strong>本月回款金额占应收余额的比例
          </div>
        </div>
      </div>
    </div>

    <!-- 更多操作弹窗 -->
    <div v-if="showMoreModal" class="modal-overlay" @click="hideMoreOptions">
      <div class="more-menu" @click.stop>
        <div class="menu-item" @click="exportData">导出数据</div>
        <div class="menu-item" @click="shareReport">分享报告</div>
        <div class="menu-item" @click="settings">设置</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinancialAnalysis',
  data() {
    return {
      activeTrendTab: 'payment',
      activeDistributionTab: 'time',
      showIndicatorModal: false,
      showMoreModal: false,

      // 展开/收起状态
      showReceivablesDetail: false,
      showTrendDetail: false,
      showDistributionDetail: false,

      // 趋势分析相关
      activeTimeRange: '30days',
      activeChart: 'both',

      // 分布分析相关
      activeDimension: 'customer',
      viewMode: 'chart',
      selectedSegment: null,
      
      // 渠道数据
      channelData: [
        {
          id: 1,
          name: '线上渠道',
          amount: -125000.50,
          hasRisk: false
        },
        {
          id: 2,
          name: '门店渠道',
          amount: -89500.30,
          hasRisk: true
        },
        {
          id: 3,
          name: '伊勒王酒店',
          amount: -447196.31,
          hasRisk: true
        },
        {
          id: 4,
          name: '代理商渠道',
          amount: 0,
          hasRisk: false
        }
      ],

      // 筛选数据
      basicFilters: [
        { key: 'dateRange', label: '日期范围', value: '最近30天' },
        { key: 'amountRange', label: '金额范围', value: '全部' },
        { key: 'status', label: '状态', value: '全部' }
      ],

      advancedFilters: [
        { key: 'customer', label: '客户类型', value: '全部' },
        { key: 'region', label: '地区', value: '全部' },
        { key: 'paymentMethod', label: '付款方式', value: '全部' }
      ],

      // 重点客户数据
      keyCustomers: [
        {
          id: 1,
          name: '伊勒王酒店',
          amount: -447196.31,
          overdueDays: 45,
          isOverdue: true
        },
        {
          id: 2,
          name: '华联超市',
          amount: -125000.50,
          overdueDays: 15,
          isOverdue: false
        },
        {
          id: 3,
          name: '永辉超市',
          amount: -89500.30,
          overdueDays: 32,
          isOverdue: true
        }
      ],

      // 时间范围选项
      timeRanges: [
        { key: '7days', label: '近7天' },
        { key: '30days', label: '近30天' },
        { key: '90days', label: '近90天' },
        { key: 'custom', label: '自定义' }
      ],

      // 趋势数据
      totalPayment: 156780.50,
      avgPayment: 5226.02,
      maxDailyPayment: 28669.13,
      maxPaymentDate: '7月28日',
      receivablesChange: -45230.80,

      // 分布维度
      dimensions: [
        { key: 'customer', label: '按客户' },
        { key: 'region', label: '按地区' },
        { key: 'channel', label: '按渠道' },
        { key: 'time', label: '按时间' },
        { key: 'product', label: '按产品' }
      ],

      // 分布数据
      distributionData: {
        customer: [
          { name: '伊勒王酒店', amount: -447196.31, count: 15, color: '#ff6b6b' },
          { name: '华联超市', amount: -125000.50, count: 8, color: '#4ecdc4' },
          { name: '永辉超市', amount: -89500.30, count: 12, color: '#45b7d1' },
          { name: '其他客户', amount: -0.00, count: 0, color: '#96ceb4' }
        ],
        region: [
          { name: '华东地区', amount: -350000.00, count: 25, color: '#ff6b6b' },
          { name: '华南地区', amount: -180000.00, count: 15, color: '#4ecdc4' },
          { name: '华北地区', amount: -131697.11, count: 10, color: '#45b7d1' }
        ],
        channel: [
          { name: '线上渠道', amount: -300000.00, count: 20, color: '#ff6b6b' },
          { name: '门店渠道', amount: -250000.00, count: 18, color: '#4ecdc4' },
          { name: '代理商', amount: -111697.11, count: 12, color: '#45b7d1' }
        ],
        time: [
          { name: '8月', amount: -430000.00, count: 30, color: '#ff6b6b' },
          { name: '7月', amount: -150000.00, count: 15, color: '#4ecdc4' },
          { name: '6月', amount: -81697.11, count: 8, color: '#45b7d1' }
        ],
        product: [
          { name: '产品A', amount: -280000.00, count: 22, color: '#ff6b6b' },
          { name: '产品B', amount: -220000.00, count: 18, color: '#4ecdc4' },
          { name: '产品C', amount: -161697.11, count: 15, color: '#45b7d1' }
        ]
      }
    }
  },

  computed: {
    currentPeriodText() {
      const range = this.timeRanges.find(r => r.key === this.activeTimeRange)
      return range ? range.label : '自定义时间'
    },

    currentDimensionLabel() {
      const dimension = this.dimensions.find(d => d.key === this.activeDimension)
      return dimension ? dimension.label : ''
    },

    currentDistributionData() {
      const data = this.distributionData[this.activeDimension] || []
      const total = Math.abs(data.reduce((sum, item) => sum + item.amount, 0))

      return data.map(item => ({
        ...item,
        percentage: total > 0 ? Math.round((Math.abs(item.amount) / total) * 100) : 0
      }))
    },

    sortedDistributionData() {
      return [...this.currentDistributionData].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    },

    totalDistributionAmount() {
      return this.currentDistributionData.reduce((sum, item) => sum + Math.abs(item.amount), 0)
    },

    pieSegments() {
      const segments = []
      let currentAngle = 0
      const centerX = 100
      const centerY = 100
      const radius = 80

      this.currentDistributionData.forEach(item => {
        const angle = (item.percentage / 100) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle

        const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180)
        const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
        const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180)
        const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)

        const largeArcFlag = angle > 180 ? 1 : 0

        const path = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ')

        segments.push({
          path,
          color: item.color
        })

        currentAngle += angle
      })

      return segments
    },

    topThreePercentage() {
      const sorted = this.sortedDistributionData.slice(0, 3)
      return sorted.reduce((sum, item) => sum + item.percentage, 0)
    },

    riskItemName() {
      const maxItem = this.sortedDistributionData[0]
      return maxItem ? maxItem.name : ''
    }
  },

  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    showMoreOptions() {
      this.showMoreModal = true
    },
    
    hideMoreOptions() {
      this.showMoreModal = false
    },
    
    showIndicatorInfo() {
      this.showIndicatorModal = true
    },
    
    hideIndicatorInfo() {
      this.showIndicatorModal = false
    },
    
    switchTrendTab(tab) {
      this.activeTrendTab = tab
    },
    
    switchDistributionTab(tab) {
      this.activeDistributionTab = tab
    },
    
    formatAmount(amount) {
      if (typeof amount !== 'number') {
        return '0.00'
      }
      return amount.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    exploreCustomer(channelId) {
      console.log('探查客户:', channelId)
      // 跳转到客户详情页
      this.$router.push(`/customer-detail/${channelId}`)
    },
    
    exportData() {
      this.hideMoreOptions()
      console.log('导出数据')
      alert('数据导出功能开发中')
    },
    
    shareReport() {
      this.hideMoreOptions()
      console.log('分享报告')
      alert('分享功能开发中')
    },
    
    settings() {
      this.hideMoreOptions()
      console.log('设置')
      alert('设置功能开发中')
    },

    // 筛选相关方法
    getFilterDisplayValue(filterKey) {
      const basicFilter = this.basicFilters.find(f => f.key === filterKey)
      if (basicFilter) return basicFilter.value

      const advancedFilter = this.advancedFilters.find(f => f.key === filterKey)
      if (advancedFilter) return advancedFilter.value

      return '未设置'
    },

    openFilterModal(filterKey) {
      console.log('打开筛选弹窗:', filterKey)
      // 这里可以实现具体的筛选弹窗逻辑
      alert(`${filterKey} 筛选功能开发中`)
    },

    resetAllFilters() {
      // 重置所有筛选条件
      this.basicFilters.forEach(filter => {
        if (filter.key === 'dateRange') filter.value = '最近30天'
        else filter.value = '全部'
      })
      this.advancedFilters.forEach(filter => {
        filter.value = '全部'
      })
      console.log('重置所有筛选条件')
    },

    applyFilters() {
      this.hideFilterSelector()
      console.log('应用筛选条件')
      // 这里可以实现筛选逻辑，重新加载数据
      alert('筛选条件已应用')
    },

    // 展开/收起方法
    toggleReceivablesDetail() {
      this.showReceivablesDetail = !this.showReceivablesDetail
    },

    toggleTrendDetail() {
      this.showTrendDetail = !this.showTrendDetail
    },

    toggleDistributionDetail() {
      this.showDistributionDetail = !this.showDistributionDetail
    },

    // 客户详情
    viewCustomerDetail(customerId) {
      console.log('查看客户详情:', customerId)
      this.$router.push(`/customer-detail/${customerId}`)
    },

    // 趋势分析方法
    switchTimeRange(range) {
      this.activeTimeRange = range
      console.log('切换时间范围:', range)
    },

    switchChart(chart) {
      this.activeChart = chart
      console.log('切换图表类型:', chart)
    },

    // 分布分析方法
    switchDimension(dimension) {
      this.activeDimension = dimension
      this.selectedSegment = null
      console.log('切换分布维度:', dimension)
    },

    switchViewMode(mode) {
      this.viewMode = mode
      console.log('切换视图模式:', mode)
    },

    selectSegment(index) {
      this.selectedSegment = index
      console.log('选中分段:', this.currentDistributionData[index])
    },

    viewItemDetail(item) {
      console.log('查看详情:', item)
      this.$router.push(`/receivables-detail/${this.activeDimension}/${item.name}`)
    }
  }
}
</script>

<style scoped>
.financial-analysis {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部标题栏 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn, .more-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-btn:hover, .more-btn:hover {
  background-color: #f0f0f0;
}

.back-icon, .more-icon {
  stroke: #333333;
  stroke-width: 2;
  fill: none;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

/* 应收账款概况模块 */
.receivables-overview {
  background-color: #ffffff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.info-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.info-btn:hover {
  background-color: #f0f8ff;
}

.info-text {
  color: #007AFF;
  font-size: 12px;
}

.overview-data {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-label {
  color: #666666;
  font-size: 14px;
}

.data-value {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.data-value.negative {
  color: #ff4444;
}

.risk-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #fff3cd;
  border-radius: 4px;
}

.notice-badge {
  background-color: #007AFF;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
}

.notice-text {
  color: #856404;
  font-size: 12px;
}

/* 趋势模块 */
.trend-section {
  background-color: #ffffff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.trend-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.trend-tabs {
  display: flex;
  gap: 4px;
}

.trend-tab {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  color: #666666;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.trend-tab.active {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

.chart-container {
  margin-top: 16px;
}

.chart-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 分布模块 */
.distribution-section {
  background-color: #ffffff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.distribution-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.distribution-tabs {
  display: flex;
  gap: 4px;
}

.distribution-tab {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  color: #666666;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.distribution-tab.active {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

/* 饼图容器 */
.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 16px;
}

.pie-chart {
  flex-shrink: 0;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.legend-text {
  color: #333333;
  font-size: 12px;
}

/* 渠道列表 */
.channel-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.channel-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
}

.channel-card:hover {
  background-color: #f0f8ff;
  border-color: #007AFF;
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.channel-name {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.channel-amount {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.channel-amount.negative {
  color: #ff4444;
}

.channel-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.explore-btn {
  padding: 6px 12px;
  border: 1px solid #007AFF;
  background-color: transparent;
  color: #007AFF;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.explore-btn:hover {
  background-color: #007AFF;
  color: #ffffff;
}

.risk-badge {
  background-color: #007AFF;
  padding: 2px 6px;
  border-radius: 2px;
}

.risk-text {
  color: #ffffff;
  font-size: 10px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  font-size: 20px;
  cursor: pointer;
  color: #666666;
  padding: 4px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.indicator-item {
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
}

/* 更多操作菜单 */
.more-menu {
  position: fixed;
  top: 60px;
  right: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 1001;
}

.menu-item {
  padding: 12px 16px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

/* 筛选弹窗特有样式 */
.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.filter-reset-btn,
.filter-apply-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-reset-btn {
  background-color: #f8f9fa;
  color: #666666;
  border: 1px solid #e9ecef;
}

.filter-reset-btn:hover {
  background-color: #e9ecef;
}

.filter-apply-btn {
  background-color: #007AFF;
  color: #ffffff;
}

.filter-apply-btn:hover {
  background-color: #0056d6;
}

/* 详细模块通用样式 */
.detailed-receivables-overview,
.detailed-trend-analysis,
.detailed-distribution-analysis {
  background-color: #ffffff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.expand-btn {
  background: none;
  border: 1px solid #007AFF;
  color: #007AFF;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.expand-btn:hover {
  background-color: #007AFF;
  color: #ffffff;
}

/* 概况数据卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.data-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.data-card:hover {
  transform: translateY(-2px);
}

.data-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.card-icon {
  font-size: 20px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-value.negative {
  color: #ff4444;
}

.data-card.primary .card-value.negative {
  color: #ffffff;
}

.card-change {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.change-text {
  opacity: 0.7;
}

.change-value.increase {
  color: #28a745;
}

.change-value.decrease {
  color: #dc3545;
}

.change-value.target {
  color: #6c757d;
}

.data-card.primary .change-value {
  color: #ffffff;
  opacity: 0.9;
}

/* 详细内容区域 */
.receivables-detail-content,
.trend-detail-content,
.distribution-detail-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.subsection-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

/* 账龄分析 */
.aging-analysis {
  margin-bottom: 20px;
}

.aging-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aging-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aging-label {
  width: 80px;
  font-size: 13px;
  color: #666666;
  flex-shrink: 0;
}

.aging-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.aging-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.aging-value {
  width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #333333;
}

/* 重点客户列表 */
.key-customers {
  margin-bottom: 20px;
}

.customer-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.customer-item:hover {
  background-color: #e9ecef;
  transform: translateX(4px);
}

.customer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.customer-days {
  font-size: 12px;
  color: #666666;
}

.customer-amount {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-right: 12px;
}

.customer-amount.overdue {
  color: #dc3545;
}

.customer-action .arrow-icon {
  stroke: #999999;
  stroke-width: 2;
  fill: none;
}

/* 时间范围选择 */
.time-range-section {
  margin-bottom: 16px;
}

.range-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.range-tab {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  color: #666666;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.range-tab.active {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

/* 增强图表容器 */
.enhanced-chart-container {
  margin-bottom: 20px;
}

.chart-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.chart-tab {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  color: #666666;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-tab.active {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

.enhanced-chart {
  width: 100%;
  overflow-x: auto;
}

.enhanced-chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.enhanced-chart-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enhanced-chart-legend .legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.enhanced-chart-legend .legend-text {
  font-size: 14px;
  color: #333333;
}

/* 数据统计 */
.statistics-summary {
  margin-bottom: 20px;
}

.period-text {
  font-size: 12px;
  color: #666666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 4px;
}

.stat-value.negative {
  color: #dc3545;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.increase {
  color: #28a745;
}

.stat-change.decrease {
  color: #dc3545;
}

.stat-date {
  font-size: 11px;
  color: #999999;
}

/* 分布维度选择 */
.dimension-section {
  margin-bottom: 16px;
}

.dimension-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.dimension-tab {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  color: #666666;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.dimension-tab.active {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

/* 分布总览 */
.distribution-overview {
  margin-bottom: 16px;
}

.distribution-overview .overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.distribution-overview .overview-title {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.distribution-overview .overview-amount {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.distribution-overview .overview-items {
  font-size: 12px;
  opacity: 0.8;
}

/* 分布图表区域 */
.distribution-chart-section {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.view-toggle {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 6px 12px;
  border: none;
  background-color: #f8f9fa;
  color: #666666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background-color: #007AFF;
  color: #ffffff;
}

/* 饼图视图 */
.pie-chart-view {
  display: flex;
  align-items: center;
  gap: 30px;
}

.pie-chart-container {
  flex-shrink: 0;
}

.pie-segment {
  cursor: pointer;
  transition: opacity 0.2s;
}

.pie-segment:hover {
  opacity: 0.8;
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chart-legend .legend-item:hover {
  background-color: #f8f9fa;
}

.chart-legend .legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;
}

.chart-legend .legend-label {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.chart-legend .legend-value {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}

/* 分布列表视图 */
.distribution-list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.distribution-item:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.item-indicator {
  width: 4px;
  height: 40px;
  border-radius: 2px;
  margin-right: 16px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.item-amount {
  font-size: 16px;
  font-weight: 700;
  color: #333333;
}

.item-amount.negative {
  color: #dc3545;
}

.item-details {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.item-percentage,
.item-count {
  font-size: 12px;
  color: #666666;
}

.item-progress {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.item-action {
  margin-left: 16px;
  flex-shrink: 0;
}

.item-action .arrow-icon {
  stroke: #999999;
  stroke-width: 2;
  fill: none;
}

/* 分布洞察 */
.distribution-insights {
  margin-bottom: 20px;
}

.analysis-insights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.insight-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
}

.insight-desc {
  font-size: 13px;
  color: #666666;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }

  .pie-chart-view {
    flex-direction: column;
    gap: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .distribution-item {
    padding: 12px;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .item-details {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  /* 保持日期区域左右排布 */
  .date-group {
    display: flex !important;
    flex-direction: row !important;
    gap: 8px;
  }

  .date-item {
    flex: 1;
    padding: 10px 8px;
  }

  .date-label {
    font-size: 12px;
  }

  .date-value {
    font-size: 13px;
  }

  /* 选择区域在小屏幕上垂直排布 */
  .selection-group {
    flex-direction: column;
    gap: 8px;
  }

  .selection-item {
    padding: 10px 12px;
  }

  .selection-label {
    font-size: 13px;
  }

  /* 详细模块响应式 */
  .detailed-receivables-overview,
  .detailed-trend-analysis,
  .detailed-distribution-analysis {
    margin: 8px 12px;
    padding: 12px;
  }

  .receivables-overview,
  .trend-section,
  .distribution-section {
    margin: 8px 12px;
    padding: 12px;
  }

  .pie-chart-container {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .channel-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .channel-actions {
    align-self: flex-end;
  }

  .modal-content {
    margin: 16px;
  }

  .range-tabs {
    flex-wrap: wrap;
  }

  .range-tab {
    flex: 1;
    min-width: 80px;
  }

  .dimension-tabs {
    gap: 6px;
  }

  .dimension-tab {
    padding: 6px 12px;
    font-size: 13px;
  }

  .chart-tabs {
    flex-wrap: wrap;
  }

  .chart-tab {
    flex: 1;
    min-width: 100px;
  }

  .customer-item {
    padding: 10px;
  }

  .aging-item {
    gap: 8px;
  }

  .aging-label {
    width: 60px;
    font-size: 12px;
  }

  .stat-item {
    padding: 12px;
  }

  .insight-item {
    padding: 12px;
  }
}
</style>
