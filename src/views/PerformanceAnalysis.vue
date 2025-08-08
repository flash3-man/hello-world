<template>
  <div class="performance-analysis">
    <!-- 标题栏 -->
    <div class="title-bar">
      <h1 class="page-title">业绩变化分析</h1>
      <button class="export-btn" @click="exportData">
        <svg class="export-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 10L12 6H9V1H7V6H4L8 10Z"/>
          <path d="M1 14H15V12H1V14Z"/>
        </svg>
        <span class="export-text">导出</span>
      </button>
    </div>

    <!-- 日期对比范围 -->
    <div class="date-comparison-section">
      <div class="date-group">
        <div class="date-item" @click="openDatePicker('current')">
          <span class="date-label">统计时间：</span>
          <span class="date-value">{{ currentDateDisplay }}</span>
          <svg class="dropdown-icon" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
        
        <div class="date-item" @click="openDatePicker('compare')">
          <span class="date-label">对比时间：</span>
          <span class="date-value">{{ compareDateDisplay }}</span>
          <svg class="dropdown-icon" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 分析指标维度选择 -->
    <div class="analysis-selection-section">
      <div class="selection-group">
        <div class="selection-item" @click="openMetricSelector">
          <span class="selection-label">分析指标：</span>
          <span class="selection-value">{{ selectedMetricText }}</span>
          <svg class="dropdown-icon" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
        
        <div class="selection-item" @click="openDimensionSelector">
          <span class="selection-label">分析维度：</span>
          <span class="selection-value">{{ selectedDimensionText }}</span>
          <svg class="dropdown-icon" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 数据展示区 -->
    <div class="data-display-section">
      <!-- 数据表头 -->
      <div class="data-header">
        <div class="header-cell name-col sortable" @click="sortData('name')">
          {{ selectedDimensionText.replace('按', '').replace('分析', '') }}
          <svg v-if="sortField === 'name'" class="sort-icon" :class="{ 'desc': sortOrder === 'desc' }" width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 2L10 8H2L6 2Z"/>
          </svg>
        </div>
        <div class="header-cell sortable" @click="sortData('currentValue')">
          {{ selectedMetricText }}(统计期)
          <svg v-if="sortField === 'currentValue'" class="sort-icon" :class="{ 'desc': sortOrder === 'desc' }" width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 2L10 8H2L6 2Z"/>
          </svg>
        </div>
        <div class="header-cell sortable" @click="sortData('compareValue')">
          {{ selectedMetricText }}(对比期)
          <svg v-if="sortField === 'compareValue'" class="sort-icon" :class="{ 'desc': sortOrder === 'desc' }" width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 2L10 8H2L6 2Z"/>
          </svg>
        </div>
        <div class="header-cell sortable" @click="sortData('changeValue')">
          变化值
          <svg v-if="sortField === 'changeValue'" class="sort-icon" :class="{ 'desc': sortOrder === 'desc' }" width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 2L10 8H2L6 2Z"/>
          </svg>
        </div>
        <div class="header-cell sortable" @click="sortData('changeRate')">
          变化率
          <svg v-if="sortField === 'changeRate'" class="sort-icon" :class="{ 'desc': sortOrder === 'desc' }" width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 2L10 8H2L6 2Z"/>
          </svg>
        </div>
      </div>
      
      <!-- 数据内容 -->
      <div class="data-body">
        <div 
          v-for="(item, index) in filteredAnalysisData" 
          :key="index"
          class="data-row"
          :class="{ 'even-row': index % 2 === 1 }"
          @click="viewItemDetail(item)"
        >
          <div class="data-cell name-col">{{ item.name }}</div>
          <div class="data-cell metric-col">{{ formatMetricValue(item.currentValue) }}</div>
          <div class="data-cell metric-col">{{ formatMetricValue(item.compareValue) }}</div>
          <div class="data-cell" :class="getChangeClass(item.changeValue)">
            {{ formatChangeValue(item.changeValue) }}
          </div>
          <div class="data-cell" :class="getChangeClass(item.changeRate)">
            {{ formatChangeRate(item.changeRate) }}
          </div>
        </div>
        
        <!-- 无数据状态 -->
        <div v-if="filteredAnalysisData.length === 0" class="no-data">
          <p>暂无符合条件的数据</p>
        </div>
      </div>
      
      <!-- 查看关联按钮 -->
      <div class="related-action-section">
        <button class="related-btn" @click="viewRelatedData">
          查看{{ selectedDimensionText.replace('按', '').replace('分析', '') }}关联数据
        </button>
      </div>
    </div>

    <!-- 筛选条件配置区 -->
    <div v-if="showFilterConfig" class="filter-config-section">
      <div class="filter-header">
        <h3 class="filter-title">筛选条件配置</h3>
        <button class="filter-close" @click="hideFilterConfig">×</button>
      </div>
      
      <div class="filter-content">
        <!-- 基础筛选 -->
        <div class="filter-group">
          <div class="filter-group-title">基础筛选</div>
          <div class="filter-items">
            <div class="filter-item" v-for="filter in basicFilters" :key="filter.key" @click="openFilterModal(filter.key)">
              <span class="filter-label">{{ filter.label }}</span>
              <span class="filter-value">{{ getFilterDisplayValue(filter.key) }}</span>
              <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
                <path d="M1 1L6 6L11 1"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 高级筛选 -->
        <div class="filter-group">
          <div class="filter-group-title">高级筛选</div>
          <div class="filter-items">
            <div class="filter-item" v-for="filter in advancedFilters" :key="filter.key" @click="openFilterModal(filter.key)">
              <span class="filter-label">{{ filter.label }}</span>
              <span class="filter-value">{{ getFilterDisplayValue(filter.key) }}</span>
              <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
                <path d="M1 1L6 6L11 1"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 筛选操作 -->
        <div class="filter-actions">
          <button class="filter-reset-btn" @click="resetAllFilters">重置筛选</button>
          <button class="filter-apply-btn" @click="applyFilters">应用筛选</button>
        </div>
      </div>
    </div>

    <!-- 穿透分析结果区 -->
    <div v-if="showDrilldownResults" class="drilldown-results-section">
      <div class="drilldown-header">
        <h3 class="drilldown-title">{{ drilldownTitle }}</h3>
        <button class="drilldown-close" @click="hideDrilldownResults">×</button>
      </div>
      
      <div class="drilldown-content">
        <!-- 穿透数据表头 -->
        <div class="drilldown-data-header">
          <div class="drilldown-header-cell name-col">{{ drilldownDimension }}</div>
          <div class="drilldown-header-cell">{{ selectedMetricText }}(统计期)</div>
          <div class="drilldown-header-cell">{{ selectedMetricText }}(对比期)</div>
          <div class="drilldown-header-cell">变化值</div>
          <div class="drilldown-header-cell">变化率</div>
        </div>
        
        <!-- 穿透数据内容 -->
        <div class="drilldown-data-body">
          <div 
            v-for="(item, index) in drilldownData" 
            :key="index"
            class="drilldown-data-row"
            :class="{ 'even-row': index % 2 === 1 }"
            @click="viewDrilldownDetail(item)"
          >
            <div class="drilldown-data-cell name-col">{{ item.name }}</div>
            <div class="drilldown-data-cell metric-col">{{ formatMetricValue(item.currentValue) }}</div>
            <div class="drilldown-data-cell metric-col">{{ formatMetricValue(item.compareValue) }}</div>
            <div class="drilldown-data-cell" :class="getChangeClass(item.changeValue)">
              {{ formatChangeValue(item.changeValue) }}
            </div>
            <div class="drilldown-data-cell" :class="getChangeClass(item.changeRate)">
              {{ formatChangeRate(item.changeRate) }}
            </div>
          </div>
        </div>

        <!-- 穿透操作按钮 -->
        <div class="drilldown-actions">
          <button 
            v-for="action in currentDrilldownActions" 
            :key="action.key"
            class="drilldown-action-btn"
            @click="executeDrilldownAction(action.key)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 业务变化分析分类 -->
    <div class="analysis-categories">
      <div class="category-tabs">
        <button 
          v-for="category in businessCategoriesWithCount" 
          :key="category.key"
          class="category-tab"
          :class="{ 'active': selectedBusinessCategory === category.key }"
          @click="selectBusinessCategory(category.key)"
        >
          {{ category.label }}
          <span v-if="category.count > 0">({{ category.count }})</span>
        </button>
      </div>
      
      <!-- 汇总统计 -->
      <div class="summary-totals">
        <div class="total-item">
          <span class="total-label">{{ selectedMetricText }}合计(统计期)：</span>
          <span class="total-value">{{ formatMetricValue(totalCurrentValue) }}</span>
        </div>
        <div class="total-item">
          <span class="total-label">{{ selectedMetricText }}合计(对比期)：</span>
          <span class="total-value">{{ formatMetricValue(totalCompareValue) }}</span>
        </div>
        <div class="total-item">
          <span class="total-label">总变化值：</span>
          <span class="total-value" :class="getChangeClass(totalChangeValue)">
            {{ formatChangeValue(totalChangeValue) }}
          </span>
        </div>
        <div class="total-item">
          <span class="total-label">总变化率：</span>
          <span class="total-value" :class="getChangeClass(totalChangeRate)">
            {{ formatChangeRate(totalChangeRate) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 日期选择弹窗 -->
    <div v-if="showDatePicker" class="date-picker-overlay" @click="hideDatePicker">
      <div class="date-picker-content" @click.stop>
        <div class="date-picker-header">
          <h3 class="picker-title">{{ datePickerTitle }}</h3>
          <button class="picker-close" @click="hideDatePicker">×</button>
        </div>
        <div class="date-picker-body">
          <div class="date-tabs">
            <button 
              v-for="tab in datePickerTabs" 
              :key="tab.key"
              :class="['date-tab', { active: activeDateTab === tab.key }]"
              @click="selectDateTab(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <!-- 快捷选择 -->
          <div v-if="activeDateTab === 'quick'" class="quick-date-options">
            <div 
              v-for="option in quickDateOptions" 
              :key="option.key"
              :class="['quick-option', { selected: isQuickOptionSelected(option) }]"
              @click="selectQuickDate(option)"
            >
              <span class="option-label">{{ option.label }}</span>
              <span class="option-range">{{ option.range }}</span>
              <svg v-if="isQuickOptionSelected(option)" class="check-icon" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 3L6 10.5L2.5 7"/>
              </svg>
            </div>
          </div>
          
          <!-- 按日选择 -->
          <div v-if="activeDateTab === 'daily'" class="daily-date-picker">
            <div class="date-range-inputs">
              <div class="date-input-group">
                <label class="input-label">开始日期</label>
                <input type="date" v-model="tempStartDate" class="date-input">
              </div>
              <div class="date-input-group">
                <label class="input-label">结束日期</label>
                <input type="date" v-model="tempEndDate" class="date-input">
              </div>
            </div>
          </div>
          
          <!-- 按月选择 -->
          <div v-if="activeDateTab === 'monthly'" class="monthly-date-picker">
            <div class="month-grid">
              <div 
                v-for="month in monthOptions" 
                :key="month.value"
                :class="['month-option', { selected: tempSelectedMonth === month.value }]"
                @click="selectMonth(month.value)"
              >
                {{ month.label }}
              </div>
            </div>
          </div>
          
          <div v-if="activeDateTab !== 'quick'" class="date-picker-footer">
            <button class="picker-cancel-btn" @click="hideDatePicker">取消</button>
            <button class="picker-confirm-btn" @click="confirmDateSelection">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 指标选择弹窗 -->
    <div v-if="showMetricSelector" class="selector-overlay" @click="hideMetricSelector">
      <div class="selector-content" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择分析指标</h3>
          <button class="selector-close" @click="hideMetricSelector">×</button>
        </div>
        <div class="selector-body">
          <div class="selector-options">
            <div 
              v-for="metric in availableMetrics" 
              :key="metric.key"
              :class="['selector-option', { selected: selectedMetric === metric.key }]"
              @click="selectMetric(metric.key)"
            >
              <span class="option-text">{{ metric.label }}</span>
              <svg v-if="selectedMetric === metric.key" class="check-icon" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 3L6 10.5L2.5 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 维度选择弹窗 -->
    <div v-if="showDimensionSelector" class="selector-overlay" @click="hideDimensionSelector">
      <div class="selector-content" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择分析维度</h3>
          <button class="selector-close" @click="hideDimensionSelector">×</button>
        </div>
        <div class="selector-body">
          <div class="selector-options">
            <div 
              v-for="dimension in availableDimensions" 
              :key="dimension.key"
              :class="['selector-option', { selected: selectedDimension === dimension.key }]"
              @click="selectDimension(dimension.key)"
            >
              <span class="option-text">{{ dimension.label }}</span>
              <svg v-if="selectedDimension === dimension.key" class="check-icon" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 3L6 10.5L2.5 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 筛选器弹窗 -->
    <div v-if="showFilterModal" class="filter-modal-overlay" @click="hideFilterModal">
      <div class="filter-modal-content" @click.stop>
        <div class="filter-modal-header">
          <h3 class="filter-modal-title">{{ currentFilterTitle }}</h3>
          <button class="filter-modal-close" @click="hideFilterModal">×</button>
        </div>
        <div class="filter-modal-body">
          <div class="filter-search">
            <input v-model="filterSearchQuery" placeholder="搜索..." class="filter-search-input" />
          </div>
          <div class="filter-options-list">
            <div 
              v-for="option in currentFilterOptions" 
              :key="option.value"
              :class="['filter-option-item', { selected: option.selected }]"
              @click="toggleFilterOption(option)"
            >
              <span class="option-label">{{ option.label }}</span>
              <svg v-if="option.selected" class="option-check" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 3L6 10.5L2.5 7"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="filter-modal-footer">
          <button class="filter-cancel-btn" @click="hideFilterModal">取消</button>
          <button class="filter-confirm-btn" @click="confirmFilterSelection">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerformanceAnalysis',
  data() {
    return {
      // 基本状态
      currentDateDisplay: '06-20',
      compareDateDisplay: '06-19',
      selectedMetric: 'sales-amount',
      selectedDimension: 'region',
      selectedBusinessCategory: 'all',
      
      // 排序状态
      sortField: '',
      sortOrder: 'asc', // 'asc' 升序, 'desc' 降序
      
      // 弹窗状态
      showDatePicker: false,
      showMetricSelector: false,
      showDimensionSelector: false,
      showFilterConfig: false,
      showDrilldownResults: false,
      showFilterModal: false,
      currentDatePickerType: '', // 'current' 或 'compare'
      
      // 日期选择相关
      activeDateTab: 'quick',
      tempStartDate: '',
      tempEndDate: '',
      tempSelectedMonth: '',
      
      // 日期选择器配置
      datePickerTabs: [
        { key: 'quick', label: '快捷选择' },
        { key: 'daily', label: '按日选择' },
        { key: 'monthly', label: '按月选择' }
      ],
      
      // 快捷日期选项
      quickDateOptions: [
        { key: 'today', label: '今日', range: '06-23' },
        { key: 'current-month', label: '本月', range: '06-01 ~ 06-23' },
        { key: 'last-month', label: '上月', range: '2025-05' },
        { key: 'last-90-days', label: '近90天', range: '03-26 ~ 06-23' },
        { key: 'last-30-days', label: '近30天', range: '05-24 ~ 06-23' },
        { key: 'current-quarter', label: '本季度', range: '04-01 ~ 06-23' },
        { key: 'last-quarter', label: '上季度', range: '01-01 ~ 03-31' },
        { key: 'current-year', label: '本年', range: '2025-01-01 ~ 06-23' }
      ],
      
      // 月份选项
      monthOptions: [
        { value: '2025-01', label: '2025年1月' },
        { value: '2025-02', label: '2025年2月' },
        { value: '2025-03', label: '2025年3月' },
        { value: '2025-04', label: '2025年4月' },
        { value: '2025-05', label: '2025年5月' },
        { value: '2025-06', label: '2025年6月' },
        { value: '2025-07', label: '2025年7月' },
        { value: '2025-08', label: '2025年8月' }
      ],
      
      // 15个分析指标
      availableMetrics: [
        { key: 'sales-amount', label: '销售金额' },
        { key: 'order-amount', label: '订单金额' },
        { key: 'net-sales', label: '净销售额' },
        { key: 'return-amount', label: '退货金额' },
        { key: 'sales-quantity', label: '销售数量' },
        { key: 'order-count', label: '订单单数' },
        { key: 'customer-count', label: '客户数量' },
        { key: 'gross-profit', label: '毛利金额' },
        { key: 'gross-margin', label: '毛利率' },
        { key: 'avg-order-value', label: '客单价' },
        { key: 'return-rate', label: '退货率' },
        { key: 'collection-amount', label: '回款金额' },
        { key: 'receivables', label: '应收余额' },
        { key: 'inventory-turnover', label: '库存周转' },
        { key: 'fulfillment-rate', label: '履约完成率' }
      ],
      
      // 7个分析维度
      availableDimensions: [
        { key: 'customer', label: '按客户分析' },
        { key: 'region', label: '按片区分析' },
        { key: 'channel', label: '按渠道分析' },
        { key: 'brand', label: '按品牌分析' },
        { key: 'product', label: '按商品分析' },
        { key: 'employee', label: '按员工分析' },
        { key: 'category', label: '按分类分析' }
      ],
      
      // 业务变化分析分类
      businessCategories: [
        { key: 'all', label: '全部' },
        { key: 'stable', label: '持平' },
        { key: 'growth', label: '增长' },
        { key: 'decline', label: '下降' }
      ],
      
      // 分析数据（动态数据）
      analysisData: [
        {
          id: 1,
          name: '滁州代理',
          currentValue: 5000.00,
          compareValue: 0.00,
          changeValue: 5000.00,
          changeRate: 100,
          category: 'growth'
        },
        {
          id: 2,
          name: '白云区',
          currentValue: 580.00,
          compareValue: 3294.34,
          changeValue: -2714.34,
          changeRate: -82.4,
          category: 'decline'
        },
        {
          id: 3,
          name: '南京市',
          currentValue: 12450.00,
          compareValue: 8900.00,
          changeValue: 3550.00,
          changeRate: 39.9,
          category: 'growth'
        },
        {
          id: 4,
          name: '上海市',
          currentValue: 8750.00,
          compareValue: 8750.00,
          changeValue: 0.00,
          changeRate: 0,
          category: 'stable'
        },
        {
          id: 5,
          name: '深圳市',
          currentValue: 15600.00,
          compareValue: 18200.00,
          changeValue: -2600.00,
          changeRate: -14.3,
          category: 'decline'
        },
        {
          id: 6,
          name: '广州市',
          currentValue: 9800.00,
          compareValue: 7200.00,
          changeValue: 2600.00,
          changeRate: 36.1,
          category: 'growth'
        },
        {
          id: 7,
          name: '北京市',
          currentValue: 22350.00,
          compareValue: 19800.00,
          changeValue: 2550.00,
          changeRate: 12.9,
          category: 'growth'
        },
        {
          id: 8,
          name: '杭州市',
          currentValue: 6780.00,
          compareValue: 6780.00,
          changeValue: 0.00,
          changeRate: 0,
          category: 'stable'
        }
      ],

      // 筛选配置
      basicFilters: [
        { key: 'customer', label: '客户' },
        { key: 'region', label: '片区' },
        { key: 'channel', label: '渠道' },
        { key: 'brand', label: '品牌' }
      ],
      
      advancedFilters: [
        { key: 'product', label: '商品' },
        { key: 'employee', label: '员工' },
        { key: 'category', label: '分类' },
        { key: 'department', label: '部门' }
      ],
      
      // 筛选数据
      filterData: {
        customer: [
          { value: 'customer1', label: '大客户A', selected: false },
          { value: 'customer2', label: '中型客户B', selected: false },
          { value: 'customer3', label: '小客户C', selected: false },
          { value: 'customer4', label: '新客户D', selected: false },
          { value: 'customer5', label: '重点客户E', selected: false }
        ],
        region: [
          { value: 'region1', label: '华东区', selected: false },
          { value: 'region2', label: '华南区', selected: false },
          { value: 'region3', label: '华北区', selected: false },
          { value: 'region4', label: '西南区', selected: false },
          { value: 'region5', label: '东北区', selected: false }
        ],
        channel: [
          { value: 'channel1', label: '线上渠道', selected: false },
          { value: 'channel2', label: '门店渠道', selected: false },
          { value: 'channel3', label: '代理渠道', selected: false },
          { value: 'channel4', label: '直销渠道', selected: false },
          { value: 'channel5', label: '电商渠道', selected: false }
        ],
        brand: [
          { value: 'brand1', label: '品牌A', selected: false },
          { value: 'brand2', label: '品牌B', selected: false },
          { value: 'brand3', label: '品牌C', selected: false },
          { value: 'brand4', label: '品牌D', selected: false },
          { value: 'brand5', label: '品牌E', selected: false }
        ],
        product: [
          { value: 'product1', label: '产品系列A', selected: false },
          { value: 'product2', label: '产品系列B', selected: false },
          { value: 'product3', label: '产品系列C', selected: false },
          { value: 'product4', label: '产品系列D', selected: false },
          { value: 'product5', label: '产品系列E', selected: false }
        ],
        employee: [
          { value: 'employee1', label: '张经理', selected: false },
          { value: 'employee2', label: '李主管', selected: false },
          { value: 'employee3', label: '王专员', selected: false },
          { value: 'employee4', label: '赵顾问', selected: false },
          { value: 'employee5', label: '陈总监', selected: false }
        ],
        category: [
          { value: 'category1', label: '电子产品', selected: false },
          { value: 'category2', label: '服装鞋帽', selected: false },
          { value: 'category3', label: '家居用品', selected: false },
          { value: 'category4', label: '食品饮料', selected: false },
          { value: 'category5', label: '图书文具', selected: false }
        ],
        department: [
          { value: 'department1', label: '销售部', selected: false },
          { value: 'department2', label: '市场部', selected: false },
          { value: 'department3', label: '运营部', selected: false },
          { value: 'department4', label: '客服部', selected: false },
          { value: 'department5', label: '技术部', selected: false }
        ]
      },
      
      // 筛选器状态
      currentFilterKey: '',
      currentFilterTitle: '',
      filterSearchQuery: '',
      
      // 穿透分析相关
      drilldownTitle: '',
      drilldownDimension: '',
      drilldownData: [],
      currentDrilldownActions: [],
      
      // 穿透操作配置
      drilldownActionsMap: {
        'customer': [
          { key: 'view-brands', label: '查看品牌' },
          { key: 'view-products', label: '查看商品' },
          { key: 'view-orders', label: '查看订单' }
        ],
        'region': [
          { key: 'view-customers', label: '查看客户' },
          { key: 'view-employees', label: '查看员工' }
        ],
        'channel': [
          { key: 'view-customers', label: '查看客户' },
          { key: 'view-orders', label: '查看订单' }
        ],
        'brand': [
          { key: 'view-products', label: '查看商品' },
          { key: 'view-opportunities', label: '查看销售机会' },
          { key: 'view-customers', label: '查看客户' }
        ],
        'product': [
          { key: 'view-opportunities', label: '查看销售机会' },
          { key: 'view-inventory', label: '查看库存' }
        ],
        'employee': [
          { key: 'view-customers', label: '查看客户' },
          { key: 'view-brands', label: '查看品牌' },
          { key: 'view-products', label: '查看商品' },
          { key: 'view-performance', label: '查看绩效' }
        ],
        'category': [
          { key: 'view-products', label: '查看商品' },
          { key: 'view-brands', label: '查看品牌' }
        ],
        'department': [
          { key: 'view-employees', label: '查看员工' },
          { key: 'view-performance', label: '查看绩效' }
        ]
      }
    }
  },
  
    computed: {
    // 计算当前标题
    datePickerTitle() {
      return this.currentDatePickerType === 'current' ? '选择统计时间' : '选择对比时间'
    },
    
    // 当前选择的指标文本
    selectedMetricText() {
      const metric = this.availableMetrics.find(m => m.key === this.selectedMetric)
      return metric ? metric.label : '销售金额'
    },
    
    // 当前选择的维度文本
    selectedDimensionText() {
      const dimension = this.availableDimensions.find(d => d.key === this.selectedDimension)
      return dimension ? dimension.label : '按片区分析'
    },
    
    // 过滤后的分析数据
    filteredAnalysisData() {
      let data = this.selectedBusinessCategory === 'all' 
        ? this.analysisData 
        : this.analysisData.filter(item => item.category === this.selectedBusinessCategory)
      
      // 应用排序
      if (this.sortField) {
        data = [...data].sort((a, b) => {
          let aValue = a[this.sortField]
          let bValue = b[this.sortField]
          
          // 处理名称字段的排序
          if (this.sortField === 'name') {
            return this.sortOrder === 'asc' 
              ? aValue.localeCompare(bValue, 'zh-CN')
              : bValue.localeCompare(aValue, 'zh-CN')
          }
          
          // 处理数字字段的排序
          if (this.sortOrder === 'asc') {
            return aValue - bValue
          } else {
            return bValue - aValue
          }
        })
      }
      
      return data
    },
    
    // 计算业务分类的数量
    businessCategoriesWithCount() {
      return this.businessCategories.map(category => {
        const count = category.key === 'all' 
          ? this.analysisData.length 
          : this.analysisData.filter(item => item.category === category.key).length
        return {
          ...category,
          count
        }
      })
    },
    
    // 计算合计值
    totalCurrentValue() {
      return this.filteredAnalysisData.reduce((sum, item) => sum + item.currentValue, 0)
    },
    
    totalCompareValue() {
      return this.filteredAnalysisData.reduce((sum, item) => sum + item.compareValue, 0)
    },
    
    totalChangeValue() {
      return this.totalCurrentValue - this.totalCompareValue
    },
    
    totalChangeRate() {
      if (this.totalCompareValue === 0) {
        return this.totalCurrentValue > 0 ? 100 : 0
      }
      return ((this.totalCurrentValue - this.totalCompareValue) / this.totalCompareValue) * 100
    },

    // 当前筛选器选项
    currentFilterOptions() {
      if (!this.currentFilterKey) return []
      
      const options = this.filterData[this.currentFilterKey] || []
      if (!this.filterSearchQuery) return options
      
      return options.filter(option => 
        option.label.toLowerCase().includes(this.filterSearchQuery.toLowerCase())
      )
    }
  },
  
  methods: {
    // 导出数据
    exportData() {
      const data = this.filteredAnalysisData.map(item => ({
        [this.selectedDimensionText.replace('按', '').replace('分析', '')]: item.name,
        [this.selectedMetricText + '(统计期)']: this.formatMetricValue(item.currentValue),
        [this.selectedMetricText + '(对比期)']: this.formatMetricValue(item.compareValue),
        '变化值': this.formatChangeValue(item.changeValue),
        '变化率': this.formatChangeRate(item.changeRate)
      }))
      
      console.log('导出数据:', data)
      alert('数据导出功能开发中，将支持Excel/PDF/CSV格式')
    },
    
    // 日期选择相关方法
    openDatePicker(type) {
      this.currentDatePickerType = type
      this.showDatePicker = true
      this.activeDateTab = 'quick'
    },
    
    hideDatePicker() {
      this.showDatePicker = false
      this.currentDatePickerType = ''
    },
    
    selectDateTab(tabKey) {
      this.activeDateTab = tabKey
    },
    
    isQuickOptionSelected(option) {
      const currentDisplay = this.currentDatePickerType === 'current' 
        ? this.currentDateDisplay 
        : this.compareDateDisplay
      return currentDisplay === option.range.split(' ~ ')[0] || currentDisplay === option.range
    },
    
    selectQuickDate(option) {
      if (this.currentDatePickerType === 'current') {
        this.currentDateDisplay = option.range.split(' ~ ')[0] || option.range
      } else {
        this.compareDateDisplay = option.range.split(' ~ ')[0] || option.range
      }
      this.hideDatePicker()
      this.refreshAnalysisData()
    },
    
    selectMonth(monthValue) {
      this.tempSelectedMonth = monthValue
    },
    
    confirmDateSelection() {
      if (this.activeDateTab === 'daily') {
        const dateRange = `${this.tempStartDate.slice(-5)} ~ ${this.tempEndDate.slice(-5)}`
        if (this.currentDatePickerType === 'current') {
          this.currentDateDisplay = dateRange
        } else {
          this.compareDateDisplay = dateRange
        }
      } else if (this.activeDateTab === 'monthly') {
        const month = this.monthOptions.find(m => m.value === this.tempSelectedMonth)
        if (month) {
          const displayText = month.label.replace('2025年', '').replace('月', '')
          if (this.currentDatePickerType === 'current') {
            this.currentDateDisplay = displayText
          } else {
            this.compareDateDisplay = displayText
          }
        }
      }
      this.hideDatePicker()
      this.refreshAnalysisData()
    },
    
    // 指标选择相关方法
    openMetricSelector() {
      this.showMetricSelector = true
    },
    
    hideMetricSelector() {
      this.showMetricSelector = false
    },
    
    selectMetric(metricKey) {
      this.selectedMetric = metricKey
      this.hideMetricSelector()
      this.refreshAnalysisData()
    },
    
    // 维度选择相关方法
    openDimensionSelector() {
      this.showDimensionSelector = true
    },
    
    hideDimensionSelector() {
      this.showDimensionSelector = false
    },
    
    selectDimension(dimensionKey) {
      this.selectedDimension = dimensionKey
      this.hideDimensionSelector()
      this.refreshAnalysisData()
    },
    
    // 业务分类选择
    selectBusinessCategory(categoryKey) {
      this.selectedBusinessCategory = categoryKey
    },
    
    // 数据格式化方法
    formatMetricValue(value) {
      if (typeof value === 'number') {
        return value.toLocaleString('zh-CN', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      }
      return value
    },
    
    formatChangeValue(value) {
      if (typeof value === 'number') {
        const formatted = Math.abs(value).toLocaleString('zh-CN', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
        return value >= 0 ? `+${formatted}` : `-${formatted}`
      }
      return value
    },
    
    formatChangeRate(rate) {
      if (typeof rate === 'number') {
        return rate >= 0 ? `+${rate.toFixed(1)}%` : `${rate.toFixed(1)}%`
      }
      return rate
    },
    
    // 颜色类名计算
    getChangeClass(value) {
      if (typeof value === 'number') {
        if (value > 0) return 'positive'
        if (value < 0) return 'negative'
        return 'neutral'
      }
      return 'neutral'
    },
    
    // 查看关联数据
    viewRelatedData() {
      // 显示筛选配置界面
      this.showFilterConfig = true
      this.currentDrilldownActions = this.drilldownActionsMap[this.selectedDimension] || []
    },
    
    // 查看单项详情
    viewItemDetail(item) {
      // 触发穿透分析
      this.executeDrilldown(item)
    },

    // === 筛选配置相关方法 ===
    hideFilterConfig() {
      this.showFilterConfig = false
    },

    openFilterModal(filterKey) {
      this.currentFilterKey = filterKey
      this.currentFilterTitle = this.basicFilters.find(f => f.key === filterKey)?.label || 
                               this.advancedFilters.find(f => f.key === filterKey)?.label || ''
      this.showFilterModal = true
      this.filterSearchQuery = ''
    },

    hideFilterModal() {
      this.showFilterModal = false
      this.currentFilterKey = ''
      this.filterSearchQuery = ''
    },

    toggleFilterOption(option) {
      option.selected = !option.selected
    },

    confirmFilterSelection() {
      this.hideFilterModal()
      // 这里可以添加筛选逻辑
      console.log('筛选条件已更新:', this.currentFilterKey)
    },

    getFilterDisplayValue(filterKey) {
      const selectedOptions = this.filterData[filterKey]?.filter(option => option.selected) || []
      if (selectedOptions.length === 0) return '全部'
      if (selectedOptions.length === 1) return selectedOptions[0].label
      return `已选${selectedOptions.length}项`
    },

    resetAllFilters() {
      // 重置所有筛选条件
      Object.keys(this.filterData).forEach(key => {
        this.filterData[key].forEach(option => {
          option.selected = false
        })
      })
      console.log('所有筛选条件已重置')
    },

    applyFilters() {
      // 应用筛选条件
      this.hideFilterConfig()
      this.refreshAnalysisData()
      console.log('筛选条件已应用')
    },

    // === 穿透分析相关方法 ===
    executeDrilldown(item) {
      // 根据当前维度执行对应的穿透分析
      const dimensionMap = {
        'customer': '客户',
        'region': '片区', 
        'channel': '渠道',
        'brand': '品牌',
        'product': '商品',
        'employee': '员工',
        'category': '分类',
        'department': '部门'
      }
      
      this.drilldownTitle = `${item.name} - 穿透分析`
      this.drilldownDimension = dimensionMap[this.selectedDimension] || '项目'
      this.currentDrilldownActions = this.drilldownActionsMap[this.selectedDimension] || []
      
      // 生成穿透数据
      this.generateDrilldownData()
      this.showDrilldownResults = true
    },

    hideDrilldownResults() {
      this.showDrilldownResults = false
      this.drilldownData = []
    },

    generateDrilldownData() {
      // 根据维度生成不同的穿透数据
      const drilldownDataMap = {
        'customer': ['品牌A', '品牌B', '品牌C', '商品X', '商品Y'],
        'region': ['客户1', '客户2', '客户3', '员工A', '员工B'], 
        'channel': ['订单001', '订单002', '客户甲', '客户乙'],
        'brand': ['商品1', '商品2', '机会A', '机会B'],
        'product': ['机会1', '机会2', '库存A', '库存B'],
        'employee': ['客户X', '客户Y', '品牌M', '商品N'],
        'category': ['产品1', '产品2', '品牌P', '品牌Q'],
        'department': ['员工1', '员工2', '绩效A', '绩效B']
      }
      
      const names = drilldownDataMap[this.selectedDimension] || ['项目1', '项目2', '项目3']
      
      this.drilldownData = names.map((name, index) => {
        const baseValue = Math.random() * 10000 + 1000
        const compareValue = Math.random() * 10000 + 1000
        const changeValue = baseValue - compareValue
        const changeRate = compareValue === 0 ? 
          (baseValue > 0 ? 100 : 0) : 
          (changeValue / compareValue) * 100
        
        return {
          id: index + 1,
          name,
          currentValue: baseValue,
          compareValue,
          changeValue,
          changeRate
        }
      })
    },

    viewDrilldownDetail(item) {
      alert(`查看${item.name}的详细信息`)
    },

    executeDrilldownAction(actionKey) {
      const actionMap = {
        'view-brands': '品牌分析',
        'view-products': '商品分析', 
        'view-orders': '订单明细',
        'view-customers': '客户分析',
        'view-employees': '员工分析',
        'view-opportunities': '销售机会',
        'view-inventory': '库存分析',
        'view-performance': '绩效分析'
      }
      
      const actionName = actionMap[actionKey] || '详细分析'
      alert(`即将跳转到${actionName}页面`)
      
      // 这里可以实现实际的页面跳转
      // this.$router.push(`/${actionKey}`)
    },
    
    // 刷新分析数据
    refreshAnalysisData() {
      // 根据当前选择的指标、维度、时间范围重新获取数据
      console.log('刷新分析数据:', {
        metric: this.selectedMetric,
        dimension: this.selectedDimension,
        currentDate: this.currentDateDisplay,
        compareDate: this.compareDateDisplay
      })
      
      // 这里可以调用API获取新数据
      // 模拟数据更新
      this.generateMockData()
    },
    
    // 生成模拟数据
    generateMockData() {
      // 根据不同的维度生成不同的模拟数据
      const dimensionData = {
        'customer': ['大客户A', '中型客户B', '小客户C', '新客户D', '重点客户E'],
        'region': ['华东区', '华南区', '华北区', '西南区', '东北区'],
        'channel': ['线上渠道', '门店渠道', '代理渠道', '直销渠道', '电商渠道'],
        'brand': ['品牌A', '品牌B', '品牌C', '品牌D', '品牌E'],
        'product': ['产品系列A', '产品系列B', '产品系列C', '产品系列D', '产品系列E'],
        'employee': ['张经理', '李主管', '王专员', '赵顾问', '陈总监'],
        'category': ['电子产品', '服装鞋帽', '家居用品', '食品饮料', '图书文具']
      }
      
      const names = dimensionData[this.selectedDimension] || dimensionData['region']
      
      this.analysisData = names.map((name, index) => {
        const baseValue = Math.random() * 50000 + 5000
        const compareValue = Math.random() * 50000 + 5000
        const changeValue = baseValue - compareValue
        const changeRate = compareValue === 0 ? 
          (baseValue > 0 ? 100 : 0) : 
          (changeValue / compareValue) * 100
        
        let category = 'stable'
        if (Math.abs(changeRate) < 5) {
          category = 'stable'
        } else if (changeRate > 0) {
          category = 'growth'
        } else {
          category = 'decline'
        }
        
        return {
          id: index + 1,
          name,
          currentValue: baseValue,
          compareValue,
          changeValue,
          changeRate,
          category
        }
      })
      
      // 重置排序状态
      this.sortField = ''
      this.sortOrder = 'asc'
    },
    
    // 排序数据
    sortData(field) {
      if (this.sortField === field) {
        // 如果点击的是当前排序字段，切换排序方向
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        // 如果点击的是新字段，设置为升序
        this.sortField = field
        this.sortOrder = 'asc'
      }
    }
  },
  
  mounted() {
    // 初始化时生成模拟数据
    this.generateMockData()
  }
}
</script>

<style scoped>
/* 整体布局 - 移动端业绩分析专用设计 */
.performance-analysis {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 标题栏 - 像素级精确设计 */
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 15px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #f0f8ff;
}

.export-icon {
  fill: currentColor;
  width: 16px;
  height: 16px;
}

.export-text {
  font-weight: 500;
}

/* 日期对比范围 */
.date-comparison-section {
  background-color: #ffffff;
  margin-top: 12px;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.date-group {
  padding: 16px;
}

.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.date-item:last-child {
  border-bottom: none;
}

.date-item:hover {
  background-color: #f8f9fa;
}

.date-label {
  color: #333333;
  font-size: 15px;
  font-weight: 500;
}

.date-value {
  color: #666666;
  font-size: 15px;
  margin-right: 8px;
}

.dropdown-icon {
  stroke: #999999;
  stroke-width: 1.5;
  fill: none;
  transition: transform 0.3s ease;
}

/* 分析指标维度选择 */
.analysis-selection-section {
  background-color: #ffffff;
  margin-top: 12px;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.selection-group {
  padding: 16px;
}

.selection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.selection-item:last-child {
  border-bottom: none;
}

.selection-item:hover {
  background-color: #f8f9fa;
}

.selection-label {
  color: #333333;
  font-size: 15px;
  font-weight: 500;
}

.selection-value {
  color: #666666;
  font-size: 15px;
  margin-right: 8px;
}

/* 数据展示区 */
.data-display-section {
  background-color: #ffffff;
  margin-top: 12px;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

/* 数据表头 */
.data-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1.2fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #eaeaea;
}

.header-cell {
  color: #333333;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.header-cell.name-col {
  text-align: left;
  justify-content: flex-start;
}

/* 可排序的表头样式 */
.header-cell.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
  gap: 4px;
}

.header-cell.sortable:hover {
  background-color: #f0f8ff;
}

/* 排序图标 */
.sort-icon {
  fill: #007AFF;
  transition: transform 0.2s;
  margin-left: 4px;
}

.sort-icon.desc {
  transform: rotate(180deg);
}

/* 数据行 */
.data-body {
  min-height: 200px;
}

.data-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1.2fr 1fr;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.data-row:hover {
  background-color: #f8fbff;
}

.data-row.even-row {
  background-color: #f9f9f9;
}

.data-row.even-row:hover {
  background-color: #f0f8ff;
}

.data-cell {
  color: #333333;
  font-size: 14px;
  text-align: center;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-cell.name-col {
  text-align: left;
  justify-content: flex-start;
  font-weight: 500;
}

.data-cell.metric-col {
  color: #007AFF;
  font-weight: 500;
}

/* 变化值和变化率的颜色 */
.data-cell.positive {
  color: #00b42a;
  font-weight: 500;
}

.data-cell.negative {
  color: #f53f3f;
  font-weight: 500;
}

.data-cell.neutral {
  color: #666666;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #999999;
  font-size: 14px;
}

/* 查看关联按钮 */
.related-action-section {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #eaeaea;
  background-color: #f8f9fa;
}

.related-btn {
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.related-btn:hover {
  background-color: #0056d6;
}

/* 业务变化分析分类（底部） */
.analysis-categories {
  background-color: #ffffff;
  margin-top: 12px;
  border-top: 1px solid #eaeaea;
  padding: 16px;
}

.category-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.category-tab {
  background: none;
  border: 1px solid #cccccc;
  border-radius: 20px;
  color: #333333;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.category-tab.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

.summary-totals {
  border-top: 1px solid #eaeaea;
  padding-top: 16px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.total-item:last-child {
  margin-bottom: 0;
}

.total-label {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.total-value {
  color: #007AFF;
  font-size: 16px;
  font-weight: 600;
}

.total-value.positive {
  color: #00b42a;
}

.total-value.negative {
  color: #f53f3f;
}

.total-value.neutral {
  color: #666666;
}

/* 弹窗样式 */
.date-picker-overlay,
.selector-overlay {
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
  padding: 20px;
}

.date-picker-content,
.selector-content {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 360px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.date-picker-header,
.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
}

.picker-title,
.selector-title {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.picker-close,
.selector-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-picker-body,
.selector-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 日期选择器特有样式 */
.date-tabs {
  display: flex;
  border-bottom: 1px solid #eaeaea;
}

.date-tab {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.date-tab.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
  background-color: #f8fbff;
}

.quick-date-options {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.quick-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-option:hover {
  background-color: #f8f9fa;
}

.quick-option.selected {
  background-color: #f0f8ff;
}

.option-label {
  color: #333333;
  font-size: 15px;
  font-weight: 500;
}

.option-range {
  color: #666666;
  font-size: 14px;
}

.check-icon {
  stroke: #007AFF;
  stroke-width: 2;
  fill: none;
  width: 16px;
  height: 16px;
}

.daily-date-picker,
.monthly-date-picker {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.date-range-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 14px;
}

.date-input:focus {
  outline: none;
  border-color: #007AFF;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.month-option {
  padding: 12px;
  text-align: center;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  cursor: pointer;
  color: #333333;
  font-size: 14px;
  transition: all 0.2s;
}

.month-option:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.month-option.selected {
  background-color: #007AFF;
  color: #ffffff;
  border-color: #007AFF;
}

.date-picker-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #eaeaea;
}

.picker-cancel-btn {
  flex: 1;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 6px;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.picker-cancel-btn:hover {
  border-color: #999999;
  background-color: #f8f9fa;
}

.picker-confirm-btn {
  flex: 1;
  padding: 12px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.picker-confirm-btn:hover {
  background-color: #0056d6;
}

/* 选择器特有样式 */
.selector-options {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.selector-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.selector-option:hover {
  background-color: #f8f9fa;
}

.selector-option.selected {
  background-color: #f0f8ff;
}

.option-text {
  color: #333333;
  font-size: 15px;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .page-title {
    font-size: 16px;
  }
  
  .export-btn {
    font-size: 14px;
  }
  
  .data-header,
  .data-row {
    grid-template-columns: 1.5fr 1fr 1fr 0.8fr 0.8fr;
    gap: 4px;
  }
  
  .header-cell,
  .data-cell {
    font-size: 13px;
  }
  
  .date-label,
  .date-value,
  .selection-label,
  .selection-value {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .title-bar {
    padding: 10px 12px;
  }
  
  .date-group,
  .selection-group {
    padding: 12px;
  }
  
  .data-header,
  .data-row {
    padding: 12px;
  }
  
  .analysis-categories {
    padding: 12px;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-picker-overlay,
.selector-overlay {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.date-picker-content,
.selector-content {
  animation: slideUp 0.3s ease-out;
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
</style>
