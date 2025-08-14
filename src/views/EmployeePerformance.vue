<template>
  <div class="employee-performance">
    <!-- 移动端顶部导航区 -->
    <div class="mobile-header">
      <!-- 第一行：返回按钮 + 标题 + 导出按钮 -->
      <div class="header-top-row">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <h1 class="page-title">员工业绩汇总表</h1>

        <button class="export-btn" @click="exportData">
          <svg class="export-icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 10L12 6H9V1H7V6H4L8 10Z" fill="currentColor"/>
            <path d="M1 14H15V12H1V14Z" fill="currentColor"/>
          </svg>
          导出
        </button>
      </div>

      <!-- 第二行：时间筛选 + 筛选按钮 -->
      <div class="header-bottom-row">
        <div class="time-filter" @click="openTimeSelector">
          <span class="time-range-text">{{ currentDateRange }}</span>
          <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </div>

        <button class="filter-btn" @click="openAdvancedFilter" :class="{ 'has-filters': hasActiveFilters }">
          筛选
          <span v-if="hasActiveFilters" class="filter-indicator">●</span>
        </button>
      </div>
    </div>

    <!-- 指标说明区 -->
    <div class="metrics-info">
      <div class="metrics-info-left">
        <span class="metrics-label">指标说明</span>
        <svg class="info-icon" width="14" height="14" viewBox="0 0 14 14" @click="showMetricsInfo">
          <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor"/>
          <text x="7" y="10" text-anchor="middle" font-size="10">?</text>
        </svg>
      </div>
      <div class="metrics-info-right">
        <button class="metrics-type-btn" @click="openMetricTypeSelector">
          {{ currentMetricTypeName }}
        </button>
      </div>
    </div>

    <!-- 筛选面板 -->
    <div v-if="showFilter" class="filter-panel">
      <!-- 快捷选择 -->
      <div class="quick-select">
        <div class="select-tabs">
          <button 
            :class="['tab-btn', { active: quickSelectType === 'day' }]"
            @click="quickSelectType = 'day'"
          >
            按日选择
          </button>
          <button 
            :class="['tab-btn', { active: quickSelectType === 'month' }]"
            @click="quickSelectType = 'month'"
          >
            按月选择
          </button>
        </div>
        <div class="quick-options">
          <button 
            v-for="option in quickOptions" 
            :key="option.id"
            :class="['option-btn', { active: selectedQuickOption === option.id }]"
            @click="selectQuickOption(option.id)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      
      <!-- 多维度筛选 -->
      <div class="multi-filter">
        <div class="filter-group">
          <div class="filter-label">多维度筛选</div>
          <div class="filter-options">
            <label v-for="filter in multiFilters" :key="filter.id" class="filter-option">
              <input 
                type="checkbox" 
                v-model="selectedFilters" 
                :value="filter.id"
              >
              <span class="checkbox-label">{{ filter.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="filter-actions">
        <button class="reset-btn" @click="resetFilters">重置</button>
        <button class="confirm-btn" @click="applyFilters">确定</button>
      </div>
    </div>

    <!-- 移动端表格区 -->
    <div class="mobile-table-container">
      <div class="table-wrapper">
        <!-- 表头 -->
        <div class="table-header-row">
          <div class="header-cell col-employee-fixed">员工名称</div>
          <div
            v-for="column in currentMetricColumns"
            :key="column.field"
            class="header-cell col-data"
            @click="toggleSort(column.field)"
          >
            {{ column.label }}
            <span class="sort-indicator">{{ getSortIndicator(column.field) }}</span>
          </div>
        </div>

        <!-- 数据行 -->
        <div
          v-for="(employee, index) in sortedEmployees"
          :key="employee.id"
          :class="['table-data-row', { 'odd-row': index % 2 === 1 }]"
        >
          <div class="data-cell col-employee-fixed clickable" @click="goToEmployeeAnalysis(employee.id)">
            <div class="employee-info">
              <span class="employee-name">{{ employee.name }}</span>
              <span class="arrow-icon">></span>
            </div>
          </div>
          <div
            v-for="column in currentMetricColumns"
            :key="column.field"
            class="data-cell col-data"
            :class="{
              'warning': isWarningValue(employee[column.field], column),
              'clickable': isClickableColumn(column.field)
            }"
            @click="handleCellClick(employee.id, column.field, employee[column.field])"
          >
            <div class="cell-content">
              <span>{{ formatValue(employee[column.field], column.type) }}</span>
              <span v-if="isClickableColumn(column.field)" class="arrow-icon">></span>
            </div>
          </div>
        </div>

        <!-- 合计行 -->
        <div class="table-total-row">
          <div class="data-cell col-employee-fixed total-label">合计</div>
          <div
            v-for="column in currentMetricColumns"
            :key="`total-${column.field}`"
            class="data-cell col-data total-value"
          >
            {{ calculateTotal(column.field, column.type) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">返回首页</button>
    </div>

    <!-- 时间选择弹窗 -->
    <div v-if="showTimeSelector" class="time-selector-overlay" @click="closeTimeSelector">
      <div class="time-selector-modal" @click.stop>
        <div class="time-selector-header">
          <h3 class="time-selector-title">选择时间周期</h3>
          <button class="time-selector-close" @click="closeTimeSelector">×</button>
        </div>

        <div class="time-selector-content">
          <!-- 快捷选择 -->
          <div class="quick-time-section">
            <h4 class="section-title">快捷选择</h4>
            <div class="quick-time-options">
              <div
                v-for="option in quickTimeOptions"
                :key="option.id"
                class="quick-time-option"
                :class="{ active: selectedTimeOption === option.id }"
                @click="selectTimeOption(option.id)"
              >
                <div class="option-content">
                  <span class="option-name">{{ option.label }}</span>
                  <span class="option-description">{{ option.description }}</span>
                </div>
                <div class="option-radio">
                  <input
                    type="radio"
                    :value="option.id"
                    v-model="selectedTimeOption"
                    :id="`time-${option.id}`"
                  >
                  <label :for="`time-${option.id}`"></label>
                </div>
              </div>
            </div>
          </div>

          <!-- 按日选择 -->
          <div class="custom-date-section">
            <h4 class="section-title">按日选择</h4>
            <div class="date-range-picker">
              <div class="date-input-group">
                <label>开始日期</label>
                <input type="date" v-model="customStartDate" class="date-input">
              </div>
              <div class="date-separator">至</div>
              <div class="date-input-group">
                <label>结束日期</label>
                <input type="date" v-model="customEndDate" class="date-input">
              </div>
            </div>
          </div>

          <!-- 按月选择 -->
          <div class="custom-month-section">
            <h4 class="section-title">按月选择</h4>
            <div class="month-picker">
              <input type="month" v-model="customMonth" class="month-input">
            </div>
          </div>
        </div>

        <div class="time-selector-footer">
          <button class="time-cancel-btn" @click="closeTimeSelector">取消</button>
          <button class="time-confirm-btn" @click="confirmTimeSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 高级筛选弹窗 -->
    <div v-if="showAdvancedFilter" class="advanced-filter-overlay" @click="closeAdvancedFilter">
      <div class="advanced-filter-modal" @click.stop>
        <div class="advanced-filter-header">
          <h3 class="advanced-filter-title">筛选条件</h3>
          <button class="advanced-filter-close" @click="closeAdvancedFilter">×</button>
        </div>

        <div class="advanced-filter-content">
          <!-- 客户筛选 -->
          <div class="filter-item" @click="openCustomerSelector">
            <div class="filter-item-label">客户</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ customerFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 片区筛选 -->
          <div class="filter-item" @click="openRegionSelector">
            <div class="filter-item-label">片区</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ regionFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 渠道筛选 -->
          <div class="filter-item" @click="openChannelSelector">
            <div class="filter-item-label">渠道</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ channelFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 商品筛选 -->
          <div class="filter-item" @click="openProductSelector">
            <div class="filter-item-label">商品</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ productFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 员工筛选 -->
          <div class="filter-item" @click="openEmployeeSelector">
            <div class="filter-item-label">员工</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ employeeFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 品牌筛选 -->
          <div class="filter-item" @click="openBrandSelector">
            <div class="filter-item-label">品牌</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ brandFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 分类筛选 -->
          <div class="filter-item" @click="openCategorySelector">
            <div class="filter-item-label">分类</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ categoryFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>
        </div>

        <div class="advanced-filter-footer">
          <button class="filter-reset-btn" @click="resetAdvancedFilters">重置</button>
          <button class="filter-clear-btn" @click="clearAllFilters">清空所有</button>
          <button class="filter-confirm-btn" @click="confirmAdvancedFilters">确定</button>
        </div>
      </div>
    </div>

    <!-- 指标类型选择弹窗 -->
    <div v-if="showMetricTypeSelector" class="metric-type-overlay" @click="closeMetricTypeSelector">
      <div class="metric-type-modal" @click.stop>
        <div class="metric-type-header">
          <h3 class="metric-type-title">指标类型选择</h3>
        </div>

        <div class="metric-type-content">
          <div class="metric-type-options">
            <label
              v-for="option in metricTypeOptions"
              :key="option.id"
              class="metric-type-option"
            >
              <input
                type="radio"
                :value="option.id"
                v-model="selectedMetricType"
                :id="`metric-${option.id}`"
              >
              <span class="radio-label">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="metric-type-footer">
          <button class="metric-cancel-btn" @click="closeMetricTypeSelector">取消</button>
          <button class="metric-confirm-btn" @click="confirmMetricTypeSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 客户选择器弹窗 -->
    <div v-if="showCustomerSelector" class="selector-overlay" @click="closeCustomerSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择客户</h3>
          <button class="selector-close" @click="closeCustomerSelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-input-group">
              <input
                type="text"
                v-model="customerSearchText"
                placeholder="搜索客户名称"
                class="search-input"
              >
              <button class="search-btn" @click="searchCustomers">搜索</button>
            </div>
          </div>

          <!-- 客户列表 -->
          <div class="options-list">
            <label
              v-for="customer in filteredCustomerOptions"
              :key="customer.id"
              class="option-item"
            >
              <input
                type="checkbox"
                :value="customer.id"
                v-model="selectedCustomerIds"
                class="option-checkbox"
              >
              <span class="option-label">{{ customer.label }}</span>
            </label>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearCustomerSelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmCustomerSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 片区选择器弹窗 -->
    <div v-if="showRegionSelector" class="selector-overlay" @click="closeRegionSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择片区</h3>
          <button class="selector-close" @click="closeRegionSelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-input-group">
              <input
                type="text"
                v-model="regionSearchText"
                placeholder="搜索片区名称"
                class="search-input"
              >
              <button class="search-btn" @click="searchRegions">搜索</button>
            </div>
          </div>

          <!-- 片区树形列表 -->
          <div class="tree-options-list">
            <div
              v-for="region in filteredRegionOptions"
              :key="region.id"
              class="tree-option-item"
            >
              <div class="tree-option-header">
                <label class="option-item" @click.stop>
                  <input
                    type="checkbox"
                    :value="region.id"
                    v-model="selectedRegionIds"
                    @change="handleRegionParentChange(region)"
                    class="option-checkbox"
                  >
                  <span class="option-label">{{ region.label }}</span>
                </label>
                <span
                  v-if="region.children && region.children.length > 0"
                  class="expand-icon"
                  @click="toggleRegionExpand(region.id)"
                >
                  {{ expandedRegions.includes(region.id) ? '▼' : '▶' }}
                </span>
              </div>

              <!-- 子级选项 -->
              <div v-if="region.children && expandedRegions.includes(region.id)" class="tree-children">
                <div
                  v-for="child in region.children"
                  :key="child.id"
                  class="tree-child-item"
                >
                  <label class="option-item child-option">
                    <input
                      type="checkbox"
                      :value="child.id"
                      v-model="selectedRegionIds"
                      @change="handleRegionChildChange(region)"
                      class="option-checkbox"
                    >
                    <span class="option-label">{{ child.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearRegionSelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmRegionSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 渠道选择器弹窗 -->
    <div v-if="showChannelSelector" class="selector-overlay" @click="closeChannelSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择渠道</h3>
          <button class="selector-close" @click="closeChannelSelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-input-group">
              <input
                type="text"
                v-model="channelSearchText"
                placeholder="搜索渠道名称"
                class="search-input"
              >
              <button class="search-btn" @click="searchChannels">搜索</button>
            </div>
          </div>

          <!-- 渠道列表 -->
          <div class="options-list">
            <label
              v-for="channel in filteredChannelOptions"
              :key="channel.id"
              class="option-item"
            >
              <input
                type="checkbox"
                :value="channel.id"
                v-model="selectedChannelIds"
                class="option-checkbox"
              >
              <span class="option-label">{{ channel.label }}</span>
            </label>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearChannelSelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmChannelSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 商品选择器弹窗 -->
    <div v-if="showProductSelector" class="selector-overlay" @click="closeProductSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择商品</h3>
          <button class="selector-close" @click="closeProductSelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-input-group">
              <input
                type="text"
                v-model="productSearchText"
                placeholder="搜索商品名称"
                class="search-input"
              >
              <button class="search-btn" @click="searchProducts">搜索</button>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="options-list">
            <label
              v-for="product in filteredProductOptions"
              :key="product.id"
              class="option-item"
            >
              <input
                type="checkbox"
                :value="product.id"
                v-model="selectedProductIds"
                class="option-checkbox"
              >
              <span class="option-label">{{ product.label }}</span>
            </label>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearProductSelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmProductSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 员工选择器弹窗 -->
    <div v-if="showEmployeeFilterSelector" class="selector-overlay" @click="closeEmployeeFilterSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择员工</h3>
          <button class="selector-close" @click="closeEmployeeFilterSelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-input-group">
              <input
                type="text"
                v-model="employeeSearchText"
                placeholder="搜索员工名称"
                class="search-input"
              >
              <button class="search-btn" @click="searchEmployees">搜索</button>
            </div>
          </div>

          <!-- 员工列表 -->
          <div class="options-list">
            <label
              v-for="employee in filteredEmployeeFilterOptions"
              :key="employee.id"
              class="option-item"
            >
              <input
                type="checkbox"
                :value="employee.id"
                v-model="selectedEmployeeFilterIds"
                class="option-checkbox"
              >
              <span class="option-label">{{ employee.label }}</span>
            </label>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearEmployeeFilterSelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmEmployeeFilterSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 品牌选择器弹窗 -->
    <div v-if="showBrandSelector" class="selector-overlay" @click="closeBrandSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择品牌</h3>
          <button class="selector-close" @click="closeBrandSelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 搜索栏 -->
          <div class="search-section">
            <div class="search-input-group">
              <input
                type="text"
                v-model="brandSearchText"
                placeholder="搜索品牌名称"
                class="search-input"
              >
              <button class="search-btn" @click="searchBrands">搜索</button>
            </div>
          </div>

          <!-- 品牌列表 -->
          <div class="options-list">
            <label
              v-for="brand in filteredBrandOptions"
              :key="brand.id"
              class="option-item"
            >
              <input
                type="checkbox"
                :value="brand.id"
                v-model="selectedBrandIds"
                class="option-checkbox"
              >
              <span class="option-label">{{ brand.label }}</span>
            </label>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearBrandSelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmBrandSelection">确认</button>
        </div>
      </div>
    </div>

    <!-- 分类选择器弹窗 -->
    <div v-if="showCategorySelector" class="selector-overlay" @click="closeCategorySelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择分类</h3>
          <button class="selector-close" @click="closeCategorySelector">×</button>
        </div>

        <div class="selector-content">
          <!-- 分类列表（固定4个选项） -->
          <div class="options-list">
            <label
              v-for="category in categoryOptions"
              :key="category.id"
              class="option-item"
            >
              <input
                type="checkbox"
                :value="category.id"
                v-model="selectedCategoryIds"
                class="option-checkbox"
              >
              <span class="option-label">{{ category.label }}</span>
            </label>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-clear-btn" @click="clearCategorySelection">清除</button>
          <button class="selector-confirm-btn" @click="confirmCategorySelection">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeePerformance',
  data() {
    return {
      showFilter: false,
      quickSelectType: 'month',
      selectedQuickOption: 'current-month',
      selectedFilters: [],
      currentDateRange: '08-01~08-14',
      sortField: '',
      sortOrder: 'asc',
      showTimeSelector: false,
      showAdvancedFilter: false,
      selectedTimeOption: 'current-month',
      customStartDate: '2025-08-01',
      customEndDate: '2025-08-14',
      customMonth: '2025-08',
      selectedMetricGroup: 'sales', // 默认选择销售指标组
      selectedMetricType: 'all', // 默认选择所有
      showMetricTypeSelector: false,
      // 筛选条件
      selectedCustomer: '',
      selectedRegion: '',
      selectedChannel: '',
      selectedProduct: '',
      selectedEmployee: '',
      selectedBrand: '',
      selectedCategory: '',
      // 选择器状态
      showCustomerSelector: false,
      showRegionSelector: false,
      showChannelSelector: false,
      showProductSelector: false,
      showEmployeeFilterSelector: false,
      showBrandSelector: false,
      showCategorySelector: false,
      // 搜索文本
      customerSearchText: '',
      regionSearchText: '',
      channelSearchText: '',
      productSearchText: '',
      employeeSearchText: '',
      brandSearchText: '',
      // 选中的ID数组
      selectedCustomerIds: [],
      selectedRegionIds: [],
      selectedChannelIds: [],
      selectedProductIds: [],
      selectedEmployeeFilterIds: [],
      selectedBrandIds: [],
      selectedCategoryIds: [],
      // 展开的片区
      expandedRegions: [],
      quickOptions: [
        { id: 'today', label: '今天 (08-08)' },
        { id: 'current-month', label: '本月 (08-01~08-08)' },
        { id: 'last-month', label: '上月 (2025-07)' },
        { id: 'last-90-days', label: '近90天 (05-10~08-08)' }
      ],
      quickTimeOptions: [
        {
          id: 'today',
          label: '今日',
          description: '查看今天的业绩数据'
        },
        {
          id: 'current-month',
          label: '本月',
          description: '查看本月累计业绩数据'
        },
        {
          id: 'last-month',
          label: '上月',
          description: '查看上月完整业绩数据'
        },
        {
          id: 'last-90-days',
          label: '近90天',
          description: '查看近3个月业绩趋势'
        }
      ],
      // 完整的字段配置（根据指标类型动态显示）
      allColumns: [
        { field: 'orderAmount', label: '订单金额', type: 'amount', clickable: true },
        { field: 'orderCount', label: '订单单数', type: 'number' },
        { field: 'orderCustomers', label: '订单客户数', type: 'number' },
        { field: 'orderProducts', label: '订单商品数', type: 'number' },
        { field: 'orderQuantity', label: '订单商品数量', type: 'number' },
        { field: 'salesAmount', label: '销售金额', type: 'amount', clickable: true },
        { field: 'salesCount', label: '销售单数', type: 'number' },
        { field: 'returnAmount', label: '退货金额', type: 'amount', clickable: true },
        { field: 'returnOrderCount', label: '退货订单数量', type: 'number' },
        { field: 'returnRate', label: '金额退货率', type: 'percentage' },
        { field: 'netSales', label: '净销售额', type: 'amount' },
        { field: 'giftCost', label: '赠品成本', type: 'amount' },
        { field: 'salesProfit', label: '销售毛利', type: 'amount' },
        { field: 'profitRate', label: '毛利率', type: 'percentage' },
        { field: 'visitCustomers', label: '拜访客户数', type: 'number' },
        { field: 'distributionCustomers', label: '铺货客户数', type: 'number', clickable: true },
        { field: 'avgOrderValue', label: '成交客单价', type: 'amount' },
        { field: 'purchaseCustomers', label: '进货客户数', type: 'number' },
        { field: 'outboundProducts', label: '出货商品数', type: 'number' },
        { field: 'returnProducts', label: '退货商品数', type: 'number' },
        { field: 'salesQuantity', label: '销售商品数量', type: 'number' },
        { field: 'returnQuantity', label: '退货商品数量', type: 'number' }
      ],
      // 指标类型选项
      metricTypeOptions: [
        { id: 'order', label: '按订单' },
        { id: 'settlement', label: '按结算' },
        { id: 'all', label: '所有' }
      ],
      multiFilters: [
        { id: 'customer', name: '客户' },
        { id: 'region', name: '片区' },
        { id: 'channel', name: '渠道' },
        { id: 'brand', name: '品牌' },
        { id: 'product', name: '商品' },
        { id: 'employee', name: '员工' },
        { id: 'category', name: '分类' }
      ],
      // 筛选选项数据
      customerOptions: [
        { id: 'customer1', label: '深圳市ABC贸易有限公司' },
        { id: 'customer2', label: '广州XYZ商贸公司' },
        { id: 'customer3', label: '东莞DEF批发商' },
        { id: 'customer4', label: '佛山GHI零售店' },
        { id: 'customer5', label: '珠海JKL超市' },
        { id: 'customer6', label: '中山MNO便利店' },
        { id: 'customer7', label: '惠州PQR商行' },
        { id: 'customer8', label: '江门STU贸易' }
      ],
      regionOptions: [
        {
          id: 'guangxi',
          label: '广西',
          children: [
            {
              id: 'nanning',
              label: '南宁市',
              children: [
                { id: 'qingxiu', label: '青秀区' },
                { id: 'xingning', label: '兴宁区' },
                { id: 'jiangnan', label: '江南区' }
              ]
            },
            {
              id: 'guilin',
              label: '桂林市',
              children: [
                { id: 'xiufeng', label: '秀峰区' },
                { id: 'diecai', label: '叠彩区' }
              ]
            }
          ]
        },
        {
          id: 'guangdong',
          label: '广东',
          children: [
            {
              id: 'guangzhou',
              label: '广州市',
              children: [
                { id: 'tianhe', label: '天河区' },
                { id: 'yuexiu', label: '越秀区' }
              ]
            },
            {
              id: 'shenzhen',
              label: '深圳市',
              children: [
                { id: 'futian', label: '福田区' },
                { id: 'nanshan', label: '南山区' }
              ]
            }
          ]
        }
      ],
      channelOptions: [
        { id: 'channel1', label: '线上电商渠道' },
        { id: 'channel2', label: '线下零售渠道' },
        { id: 'channel3', label: '批发代理渠道' },
        { id: 'channel4', label: 'KA大客户渠道' },
        { id: 'channel5', label: '直营门店渠道' },
        { id: 'channel6', label: '经销商渠道' }
      ],
      productOptions: [
        { id: 'product1', label: '高端护肤品系列' },
        { id: 'product2', label: '基础护理产品' },
        { id: 'product3', label: '彩妆化妆品' },
        { id: 'product4', label: '男士护理用品' },
        { id: 'product5', label: '婴幼儿护理' },
        { id: 'product6', label: '香水香氛系列' },
        { id: 'product7', label: '洗护用品' },
        { id: 'product8', label: '健康保健品' }
      ],
      employeeFilterOptions: [
        { id: '', label: '全部员工' },
        { id: '1', label: '王鹏' },
        { id: '2', label: '李明' },
        { id: '3', label: '张伟' },
        { id: '4', label: '赵丽' },
        { id: '5', label: '陈静' }
      ],
      brandOptions: [
        { id: '', label: '全部品牌' },
        { id: 'brand1', label: '品牌A' },
        { id: 'brand2', label: '品牌B' },
        { id: 'brand3', label: '品牌C' }
      ],
      categoryOptions: [
        { id: 'high-sales', label: '销售多' },
        { id: 'low-sales', label: '销售少' },
        { id: 'high-return', label: '退货多' },
        { id: 'low-return', label: '退货少' }
      ],
      employees: [
        {
          id: 1,
          name: '王鹏',
          orderAmount: 15200.00,
          orderCount: 12,
          orderCustomers: 9,
          orderProducts: 45,
          orderQuantity: 120,
          salesAmount: 14145.12,
          salesCount: 11,
          returnAmount: 1054.88,
          returnOrderCount: 2,
          returnRate: 6.9,
          netSales: 14145.12,
          giftCost: 200.00,
          salesProfit: 4243.54,
          profitRate: 30.0,
          visitCustomers: 15,
          distributionCustomers: 8,
          avgOrderValue: 1571.68,
          purchaseCustomers: 9,
          outboundProducts: 45,
          returnProducts: 5,
          salesQuantity: 120,
          returnQuantity: 15
        },
        {
          id: 2,
          name: '李明',
          orderAmount: 25100.00,
          orderCount: 18,
          orderCustomers: 15,
          orderProducts: 72,
          orderQuantity: 180,
          salesAmount: 23580.45,
          salesCount: 16,
          returnAmount: 1519.55,
          returnOrderCount: 3,
          returnRate: 6.1,
          netSales: 23580.45,
          giftCost: 300.00,
          salesProfit: 8253.16,
          profitRate: 35.0,
          visitCustomers: 20,
          distributionCustomers: 15,
          avgOrderValue: 1573.36,
          purchaseCustomers: 15,
          outboundProducts: 72,
          returnProducts: 8,
          salesQuantity: 180,
          returnQuantity: 20
        },
        {
          id: 3,
          name: '张伟',
          // 销售指标
          netSales: 8920.33,
          salesProfit: 2676.10,
          profitRate: 30.0,
          // 订单指标
          orderAmount: 9500.00,
          orderCustomers: 7,
          orderProducts: 28,
          // 毛利指标
          grossProfit: 2676.10,
          profitMargin: 30.0,
          profitGrowth: -2.1,
          // 退货指标
          returnAmount: 579.67,
          returnCustomers: 1,
          returnRate: 6.1
        },
        {
          id: 4,
          name: '赵丽',
          // 销售指标
          netSales: 31250.88,
          salesProfit: 12500.35,
          profitRate: 40.0,
          // 订单指标
          orderAmount: 33000.00,
          orderCustomers: 22,
          orderProducts: 88,
          // 毛利指标
          grossProfit: 12500.35,
          profitMargin: 40.0,
          profitGrowth: 12.3,
          // 退货指标
          returnAmount: 1749.12,
          returnCustomers: 2,
          returnRate: 5.3
        },
        {
          id: 5,
          name: '陈静',
          // 销售指标
          netSales: 16730.66,
          salesProfit: 5019.20,
          profitRate: 30.0,
          // 订单指标
          orderAmount: 17800.00,
          orderCustomers: 14,
          orderProducts: 56,
          // 毛利指标
          grossProfit: 5019.20,
          profitMargin: 30.0,
          profitGrowth: 3.8,
          // 退货指标
          returnAmount: 1069.34,
          returnCustomers: 2,
          returnRate: 6.0
        }
      ]
    }
  },
  computed: {
    sortedEmployees() {
      if (!this.sortField) return this.employees

      return [...this.employees].sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]

        // 如果是金额字段，需要转换为数字比较
        if (this.sortField === 'amount') {
          aVal = parseFloat(aVal.replace(/,/g, ''))
          bVal = parseFloat(bVal.replace(/,/g, ''))
        }

        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    },

    // 检查是否有活跃的筛选条件
    hasActiveFilters() {
      return this.selectedFilters.length > 0 ||
             this.selectedQuickOption !== 'current-month' ||
             this.selectedCustomerIds.length > 0 ||
             this.selectedRegionIds.length > 0 ||
             this.selectedChannelIds.length > 0 ||
             this.selectedProductIds.length > 0 ||
             this.selectedEmployeeFilterIds.length > 0 ||
             this.selectedBrandIds.length > 0 ||
             this.selectedCategoryIds.length > 0
    },

    // 当前指标组的列配置
    currentMetricColumns() {
      // 根据选择的指标类型返回对应的列
      if (this.selectedMetricType === 'order') {
        return this.allColumns.filter(col =>
          col.field.includes('order') || col.field.includes('Order')
        )
      } else if (this.selectedMetricType === 'settlement') {
        return this.allColumns.filter(col =>
          col.field.includes('sales') || col.field.includes('Sales') ||
          col.field.includes('profit') || col.field.includes('Profit')
        )
      } else {
        // 所有字段
        return this.allColumns
      }
    },

    // 当前指标类型名称
    currentMetricTypeName() {
      const option = this.metricTypeOptions.find(opt => opt.id === this.selectedMetricType)
      return option ? option.label : '所有'
    },

    // 筛选条件显示文本
    customerFilterDisplay() {
      if (this.selectedCustomerIds.length === 0) {
        return '全部客户'
      } else if (this.selectedCustomerIds.length === 1) {
        const customer = this.customerOptions.find(c => c.id === this.selectedCustomerIds[0])
        return customer ? customer.label : '全部客户'
      } else {
        return `已选择${this.selectedCustomerIds.length}个客户`
      }
    },

    regionFilterDisplay() {
      if (this.selectedRegionIds.length === 0) {
        return '全部片区'
      } else if (this.selectedRegionIds.length === 1) {
        // 在所有层级中查找对应的标签
        for (const region of this.regionOptions) {
          if (region.id === this.selectedRegionIds[0]) return region.label
          if (region.children) {
            for (const child of region.children) {
              if (child.id === this.selectedRegionIds[0]) return child.label
              if (child.children) {
                for (const grandChild of child.children) {
                  if (grandChild.id === this.selectedRegionIds[0]) return grandChild.label
                }
              }
            }
          }
        }
        return '全部片区'
      } else {
        return `已选择${this.selectedRegionIds.length}个片区`
      }
    },

    channelFilterDisplay() {
      if (this.selectedChannelIds.length === 0) {
        return '全部渠道'
      } else if (this.selectedChannelIds.length === 1) {
        const channel = this.channelOptions.find(c => c.id === this.selectedChannelIds[0])
        return channel ? channel.label : '全部渠道'
      } else {
        return `已选择${this.selectedChannelIds.length}个渠道`
      }
    },

    productFilterDisplay() {
      if (this.selectedProductIds.length === 0) {
        return '全部商品'
      } else if (this.selectedProductIds.length === 1) {
        const product = this.productOptions.find(p => p.id === this.selectedProductIds[0])
        return product ? product.label : '全部商品'
      } else {
        return `已选择${this.selectedProductIds.length}个商品`
      }
    },

    employeeFilterDisplay() {
      if (this.selectedEmployeeFilterIds.length === 0) {
        return '全部员工'
      } else if (this.selectedEmployeeFilterIds.length === 1) {
        const employee = this.employeeFilterOptions.find(e => e.id === this.selectedEmployeeFilterIds[0])
        return employee ? employee.label : '全部员工'
      } else {
        return `已选择${this.selectedEmployeeFilterIds.length}个员工`
      }
    },

    brandFilterDisplay() {
      if (this.selectedBrandIds.length === 0) {
        return '全部品牌'
      } else if (this.selectedBrandIds.length === 1) {
        const brand = this.brandOptions.find(b => b.id === this.selectedBrandIds[0])
        return brand ? brand.label : '全部品牌'
      } else {
        return `已选择${this.selectedBrandIds.length}个品牌`
      }
    },

    categoryFilterDisplay() {
      if (this.selectedCategoryIds.length === 0) {
        return '全部分类'
      } else if (this.selectedCategoryIds.length === 1) {
        const category = this.categoryOptions.find(c => c.id === this.selectedCategoryIds[0])
        return category ? category.label : '全部分类'
      } else {
        return `已选择${this.selectedCategoryIds.length}个分类`
      }
    },

    // 过滤后的客户选项
    filteredCustomerOptions() {
      if (!this.customerSearchText) {
        return this.customerOptions
      }
      return this.customerOptions.filter(customer =>
        customer.label.toLowerCase().includes(this.customerSearchText.toLowerCase())
      )
    },

    // 过滤后的片区选项
    filteredRegionOptions() {
      if (!this.regionSearchText) {
        return this.regionOptions
      }
      return this.regionOptions.filter(region =>
        region.label.toLowerCase().includes(this.regionSearchText.toLowerCase())
      )
    },

    // 过滤后的渠道选项
    filteredChannelOptions() {
      if (!this.channelSearchText) {
        return this.channelOptions
      }
      return this.channelOptions.filter(channel =>
        channel.label.toLowerCase().includes(this.channelSearchText.toLowerCase())
      )
    },

    // 过滤后的商品选项
    filteredProductOptions() {
      if (!this.productSearchText) {
        return this.productOptions
      }
      return this.productOptions.filter(product =>
        product.label.toLowerCase().includes(this.productSearchText.toLowerCase())
      )
    },

    // 过滤后的员工选项
    filteredEmployeeFilterOptions() {
      if (!this.employeeSearchText) {
        return this.employeeFilterOptions.filter(emp => emp.id !== '') // 排除"全部员工"选项
      }
      return this.employeeFilterOptions.filter(employee =>
        employee.id !== '' && employee.label.toLowerCase().includes(this.employeeSearchText.toLowerCase())
      )
    },

    // 过滤后的品牌选项
    filteredBrandOptions() {
      if (!this.brandSearchText) {
        return this.brandOptions.filter(brand => brand.id !== '') // 排除"全部品牌"选项
      }
      return this.brandOptions.filter(brand =>
        brand.id !== '' && brand.label.toLowerCase().includes(this.brandSearchText.toLowerCase())
      )
    },

    // 当前指标组名称
    currentMetricGroupName() {
      const group = this.metricGroups.find(g => g.id === this.selectedMetricGroup)
      return group ? group.name : '销售'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toggleFilter() {
      this.showFilter = !this.showFilter
    },
    exportData() {
      alert('导出功能已触发')
    },

    // 打开时间选择器
    openTimeSelector() {
      this.showTimeSelector = true
    },

    // 关闭时间选择器
    closeTimeSelector() {
      this.showTimeSelector = false
    },

    // 打开高级筛选
    openAdvancedFilter() {
      this.showAdvancedFilter = true
    },

    // 关闭高级筛选
    closeAdvancedFilter() {
      this.showAdvancedFilter = false
    },

    // 选择时间选项
    selectTimeOption(optionId) {
      this.selectedTimeOption = optionId
    },

    // 确认时间选择
    confirmTimeSelection() {
      // 根据选择的时间选项更新当前日期范围
      switch (this.selectedTimeOption) {
        case 'today':
          this.currentDateRange = '08-14'
          break
        case 'current-month':
          this.currentDateRange = '08-01~08-14'
          break
        case 'last-month':
          this.currentDateRange = '2025-07'
          break
        case 'last-90-days':
          this.currentDateRange = '05-15~08-14'
          break
        case 'custom-date':
          this.currentDateRange = `${this.customStartDate}~${this.customEndDate}`
          break
        case 'custom-month':
          this.currentDateRange = this.customMonth
          break
      }
      this.closeTimeSelector()
    },

    // 选择指标组
    selectMetricGroup(groupId) {
      this.selectedMetricGroup = groupId
    },

    // 格式化数值显示
    formatValue(value, type) {
      if (value === null || value === undefined) return '-'

      switch (type) {
        case 'amount':
          return new Intl.NumberFormat('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value)
        case 'percentage':
          return `${value}%`
        case 'number':
          return value.toString()
        default:
          return value
      }
    },

    // 判断是否为警告值
    isWarningValue(value, column) {
      if (column.field === 'profitRate' || column.field === 'profitMargin') {
        return value < 0 // 毛利率小于0标红
      }
      if (column.field === 'returnRate') {
        return value > 10 // 退货率大于10%标红
      }
      return false
    },

    // 计算合计值
    calculateTotal(field, type) {
      const total = this.employees.reduce((sum, emp) => {
        const value = emp[field] || 0
        return sum + (typeof value === 'number' ? value : 0)
      }, 0)

      if (type === 'percentage') {
        // 百分比类型计算平均值
        const avg = total / this.employees.length
        return `${avg.toFixed(1)}%`
      }

      return this.formatValue(total, type)
    },

    // 展开员工明细
    expandEmployeeDetail(employeeId) {
      console.log('展开员工明细:', employeeId)
      // 这里可以实现下钻分析功能
      alert(`查看员工 ${employeeId} 的详细数据`)
    },

    // 打开指标类型选择器
    openMetricTypeSelector() {
      this.showMetricTypeSelector = true
    },

    // 关闭指标类型选择器
    closeMetricTypeSelector() {
      this.showMetricTypeSelector = false
    },

    // 确认指标类型选择
    confirmMetricTypeSelection() {
      this.closeMetricTypeSelector()
      // 数据会通过计算属性自动更新
    },

    // 判断是否为可点击的列
    isClickableColumn(field) {
      const clickableFields = ['orderAmount', 'salesAmount', 'returnAmount', 'distributionCustomers', 'outboundProducts']
      return clickableFields.includes(field)
    },

    // 处理单元格点击
    handleCellClick(employeeId, field, value) {
      if (this.isClickableColumn(field)) {
        this.goToPerformanceAnalysis(employeeId, field, value)
      }
    },

    // 跳转到员工分析页面
    goToEmployeeAnalysis(employeeId) {
      const employee = this.employees.find(emp => emp.id === employeeId)
      const employeeName = employee ? employee.name : '未知员工'

      this.$router.push({
        name: 'EmployeeAnalysis',
        params: {
          id: employeeId,
          name: employeeName
        }
      })
    },

    // 跳转到业绩分析变化界面
    goToPerformanceAnalysis(employeeId, field, value) {
      const employee = this.employees.find(emp => emp.id === employeeId)
      const employeeName = employee ? employee.name : '未知员工'
      const column = this.allColumns.find(col => col.field === field)
      const fieldLabel = column ? column.label : field

      this.$router.push({
        name: 'PerformanceAnalysis',
        params: {
          employeeId: employeeId,
          employeeName: employeeName,
          field: field,
          fieldLabel: fieldLabel,
          value: value
        }
      })
    },

    // 筛选相关方法
    openCustomerSelector() {
      this.showCustomerSelector = true
    },

    closeCustomerSelector() {
      this.showCustomerSelector = false
    },

    openRegionSelector() {
      this.showRegionSelector = true
    },

    closeRegionSelector() {
      this.showRegionSelector = false
    },

    // 搜索客户
    searchCustomers() {
      // 搜索逻辑已通过计算属性实现
    },

    // 搜索片区
    searchRegions() {
      // 搜索逻辑已通过计算属性实现
    },

    // 清除客户选择
    clearCustomerSelection() {
      this.selectedCustomerIds = []
    },

    // 确认客户选择
    confirmCustomerSelection() {
      // 不需要设置selectedCustomer，通过计算属性customerFilterDisplay显示
      this.closeCustomerSelector()
    },

    // 切换片区展开状态
    toggleRegionExpand(regionId) {
      const index = this.expandedRegions.indexOf(regionId)
      if (index > -1) {
        this.expandedRegions.splice(index, 1)
      } else {
        this.expandedRegions.push(regionId)
      }
    },

    // 处理片区父级选择变化
    handleRegionParentChange(region) {
      if (this.selectedRegionIds.includes(region.id)) {
        // 选中父级，自动选中所有子级
        if (region.children) {
          region.children.forEach(child => {
            if (!this.selectedRegionIds.includes(child.id)) {
              this.selectedRegionIds.push(child.id)
            }
            // 如果子级还有子级，也要选中
            if (child.children) {
              child.children.forEach(grandChild => {
                if (!this.selectedRegionIds.includes(grandChild.id)) {
                  this.selectedRegionIds.push(grandChild.id)
                }
              })
            }
          })
        }
      } else {
        // 取消选中父级，取消所有子级
        if (region.children) {
          region.children.forEach(child => {
            const childIndex = this.selectedRegionIds.indexOf(child.id)
            if (childIndex > -1) {
              this.selectedRegionIds.splice(childIndex, 1)
            }
            // 如果子级还有子级，也要取消
            if (child.children) {
              child.children.forEach(grandChild => {
                const grandChildIndex = this.selectedRegionIds.indexOf(grandChild.id)
                if (grandChildIndex > -1) {
                  this.selectedRegionIds.splice(grandChildIndex, 1)
                }
              })
            }
          })
        }
      }
    },

    // 处理片区子级选择变化
    handleRegionChildChange(parent) {
      // 检查是否所有子级都被选中
      if (parent.children) {
        const allChildrenSelected = parent.children.every(c => this.selectedRegionIds.includes(c.id))
        if (allChildrenSelected && !this.selectedRegionIds.includes(parent.id)) {
          this.selectedRegionIds.push(parent.id)
        } else if (!allChildrenSelected && this.selectedRegionIds.includes(parent.id)) {
          const parentIndex = this.selectedRegionIds.indexOf(parent.id)
          this.selectedRegionIds.splice(parentIndex, 1)
        }
      }
    },

    // 清除片区选择
    clearRegionSelection() {
      this.selectedRegionIds = []
    },

    // 确认片区选择
    confirmRegionSelection() {
      // 不需要设置selectedRegion，通过计算属性regionFilterDisplay显示
      this.closeRegionSelector()
    },

    // 渠道相关方法
    searchChannels() {
      // 搜索逻辑已通过计算属性实现
    },

    clearChannelSelection() {
      this.selectedChannelIds = []
    },

    confirmChannelSelection() {
      this.closeChannelSelector()
    },

    // 商品相关方法
    searchProducts() {
      // 搜索逻辑已通过计算属性实现
    },

    clearProductSelection() {
      this.selectedProductIds = []
    },

    confirmProductSelection() {
      this.closeProductSelector()
    },

    // 员工筛选相关方法
    searchEmployees() {
      // 搜索逻辑已通过计算属性实现
    },

    clearEmployeeFilterSelection() {
      this.selectedEmployeeFilterIds = []
    },

    confirmEmployeeFilterSelection() {
      this.closeEmployeeFilterSelector()
    },

    // 品牌相关方法
    searchBrands() {
      // 搜索逻辑已通过计算属性实现
    },

    clearBrandSelection() {
      this.selectedBrandIds = []
    },

    confirmBrandSelection() {
      this.closeBrandSelector()
    },

    // 分类相关方法
    clearCategorySelection() {
      this.selectedCategoryIds = []
    },

    confirmCategorySelection() {
      this.closeCategorySelector()
    },

    openChannelSelector() {
      this.showChannelSelector = true
    },

    closeChannelSelector() {
      this.showChannelSelector = false
    },

    openProductSelector() {
      this.showProductSelector = true
    },

    closeProductSelector() {
      this.showProductSelector = false
    },

    openEmployeeSelector() {
      this.showEmployeeFilterSelector = true
    },

    closeEmployeeFilterSelector() {
      this.showEmployeeFilterSelector = false
    },

    openBrandSelector() {
      this.showBrandSelector = true
    },

    closeBrandSelector() {
      this.showBrandSelector = false
    },

    openCategorySelector() {
      this.showCategorySelector = true
    },

    closeCategorySelector() {
      this.showCategorySelector = false
    },

    // 重置筛选条件
    resetAdvancedFilters() {
      this.selectedCustomer = ''
      this.selectedRegion = ''
      this.selectedChannel = ''
      this.selectedProduct = ''
      this.selectedEmployee = ''
      this.selectedBrand = ''
      this.selectedCategory = ''
      // 重置选择器的ID数组
      this.selectedCustomerIds = []
      this.selectedRegionIds = []
      this.selectedChannelIds = []
      this.selectedProductIds = []
      this.selectedEmployeeFilterIds = []
      this.selectedBrandIds = []
      this.selectedCategoryIds = []
    },

    // 清空所有筛选条件
    clearAllAdvancedFilters() {
      this.resetAdvancedFilters()
      this.selectedTimeOption = 'current-month'
      this.selectedMetricGroup = 'sales'
    },

    // 确认筛选条件
    confirmAdvancedFilters() {
      this.closeAdvancedFilter()
      console.log('应用筛选条件:', {
        customer: this.selectedCustomer,
        region: this.selectedRegion,
        channel: this.selectedChannel,
        product: this.selectedProduct,
        employee: this.selectedEmployee
      })
    },

    // 显示指标说明
    showMetricsInfo() {
      const group = this.metricGroups.find(g => g.id === this.selectedMetricGroup)
      if (group) {
        const info = group.columns.map(col => `${col.label}: ${this.getColumnDescription(col)}`).join('\n')
        alert(`${group.name}指标说明:\n\n${info}`)
      }
    },

    // 获取列描述
    getColumnDescription(column) {
      const descriptions = {
        'netSales': '销售额减去退货额后的净收入',
        'salesProfit': '销售金额与商品成本的差额',
        'profitRate': '销售毛利占净销售额的百分比',
        'orderAmount': '包含所有已确认订单的总金额',
        'orderCustomers': '完成订单的不重复客户数量',
        'orderProducts': '订单中包含的商品SKU总数',
        'grossProfit': '销售收入减去直接成本',
        'profitMargin': '毛利占销售收入的百分比',
        'profitGrowth': '相比上期的毛利增长百分比',
        'returnAmount': '退货订单的总金额',
        'returnCustomers': '发生退货的客户数量',
        'returnRate': '退货金额占订单金额的百分比'
      }
      return descriptions[column.field] || '暂无说明'
    },
    selectQuickOption(optionId) {
      this.selectedQuickOption = optionId
    },
    resetFilters() {
      this.selectedFilters = []
      this.selectedQuickOption = 'current-month'
    },
    applyFilters() {
      // 应用筛选逻辑
      this.showFilter = false
      console.log('应用筛选:', { 
        quickOption: this.selectedQuickOption, 
        filters: this.selectedFilters 
      })
    },
    toggleSort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
    },
    getSortIndicator(field) {
      if (this.sortField !== field) return '◆'
      return this.sortOrder === 'asc' ? '▲' : '▼'
    },
    viewEmployeeDetail(employeeId) {
      console.log('查看员工详情:', employeeId)
      // 这里可以跳转到员工详情页
    }
  }
}
</script>

<style scoped>
.employee-performance {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 移动端顶部导航区 */
.mobile-header {
  background-color: #ffffff;
  padding: 12px 16px;
  border-bottom: 1px solid #eeeeee;
}

/* 第一行：返回 + 标题 + 导出 */
.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #333333;
}

.page-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  text-align: center;
  flex: 1;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
}

.export-icon {
  width: 16px;
  height: 16px;
  color: #333333;
}

/* 第二行：时间筛选 + 筛选按钮 */
.header-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f8f9fa;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-filter:hover {
  background-color: #e9ecef;
}

.time-range-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-arrow {
  color: #666666;
}

.filter-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 6px 16px;
  border-radius: 16px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.filter-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.filter-btn.has-filters {
  background-color: #FF9500;
  border-color: #FF9500;
  color: #ffffff;
}

.filter-btn.has-filters:hover {
  background-color: #e6850e;
}

.filter-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  color: #FF3B30;
  font-size: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 指标说明区 */
.metrics-info {
  background-color: #ffffff;
  padding: 12px 16px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metrics-info-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.metrics-label {
  color: #666666;
  font-size: 14px;
}

.info-icon {
  color: #999999;
  cursor: pointer;
  transition: color 0.2s;
}

.info-icon:hover {
  color: #1677ff;
}

.metrics-info-right {
  display: flex;
  align-items: center;
}

.metrics-type-btn {
  background: none;
  border: none;
  color: #1677ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.metrics-type-btn:hover {
  background-color: rgba(22, 119, 255, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #1677ff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #0958d9;
}

.export-icon {
  color: #ffffff;
}

.page-title {
  color: #111111;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.filter-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 8px 12px;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.filter-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.filter-btn.has-filters {
  background-color: #FF9500;
  border-color: #FF9500;
  color: #ffffff;
}

.filter-btn.has-filters:hover {
  background-color: #e6850e;
}

.filter-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  color: #FF3B30;
  font-size: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 时间选择弹窗样式 */
.time-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.time-selector-modal {
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.time-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.time-selector-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.time-selector-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-selector-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px 0;
}

/* 快捷选择区域 */
.quick-time-section {
  margin-bottom: 24px;
}

.quick-time-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-time-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-time-option:hover {
  background-color: #f8f9fa;
}

.quick-time-option.active {
  background-color: #e3f2fd;
  border-color: #1677ff;
}

.quick-time-option .option-content {
  flex: 1;
}

.quick-time-option .option-name {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  display: block;
}

.quick-time-option .option-description {
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
  display: block;
}

.option-radio input[type="radio"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s;
}

.option-radio input[type="radio"]:checked {
  border-color: #1677ff;
  background-color: #1677ff;
  background-image: radial-gradient(circle, #ffffff 0%, #ffffff 40%, transparent 50%);
}

/* 按日选择区域 */
.custom-date-section {
  margin-bottom: 24px;
}

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-input-group label {
  font-size: 14px;
  color: #666666;
}

.date-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.date-separator {
  color: #666666;
  font-size: 14px;
  margin-top: 20px;
}

/* 按月选择区域 */
.custom-month-section {
  margin-bottom: 24px;
}

.month-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.time-selector-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.time-cancel-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-confirm-btn {
  flex: 1;
  background-color: #1677ff;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.time-confirm-btn:hover {
  background-color: #0958d9;
}

/* 高级筛选弹窗样式 */
.advanced-filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.advanced-filter-modal {
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.advanced-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.advanced-filter-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.advanced-filter-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advanced-filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 筛选项样式 */
.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-item:hover {
  background-color: #f8f9fa;
}

.filter-item:last-child {
  border-bottom: none;
}

.filter-item-label {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
}

.filter-item-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-value-text {
  font-size: 14px;
  color: #666666;
}

.filter-arrow {
  font-size: 14px;
  color: #999999;
}

.advanced-filter-footer {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.filter-reset-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-clear-btn {
  flex: 1;
  background-color: #FF3B30;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-clear-btn:hover {
  background-color: #d70015;
}

.filter-confirm-btn {
  flex: 1;
  background-color: #1677ff;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-confirm-btn:hover {
  background-color: #0958d9;
}

/* 指标类型选择弹窗样式 */
.metric-type-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.metric-type-modal {
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.metric-type-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
}

.metric-type-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.metric-type-content {
  flex: 1;
  padding: 20px 16px;
}

.metric-type-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-type-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.metric-type-option:hover {
  background-color: #f8f9fa;
}

.metric-type-option input[type="radio"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin-right: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.metric-type-option input[type="radio"]:checked {
  border-color: #1677ff;
  background-color: #1677ff;
  background-image: radial-gradient(circle, #ffffff 0%, #ffffff 40%, transparent 50%);
}

.radio-label {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
}

.metric-type-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.metric-cancel-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.metric-confirm-btn {
  flex: 1;
  background-color: #1677ff;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.metric-confirm-btn:hover {
  background-color: #0958d9;
}

/* 选择器弹窗样式 */
.selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.selector-modal {
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.selector-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.selector-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selector-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 16px;
}

.search-input-group {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.search-btn {
  background-color: #1677ff;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #0958d9;
}

/* 选项列表 */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.option-checkbox {
  margin-right: 12px;
  width: 16px;
  height: 16px;
  appearance: none;
  border: 2px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

.option-checkbox:checked {
  background-color: #1677ff;
  border-color: #1677ff;
}

.option-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 1px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.option-label {
  font-size: 14px;
  color: #333333;
}

/* 树形选项列表 */
.tree-options-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.tree-option-item {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

.tree-option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  cursor: pointer;
}

.expand-icon {
  color: #666666;
  font-size: 12px;
  user-select: none;
}

.tree-children {
  padding: 8px 0;
  background-color: #ffffff;
}

.tree-child-item {
  padding: 4px 0;
}

.child-option {
  margin-left: 24px;
  padding: 8px 12px;
}

.selector-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.selector-clear-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.selector-confirm-btn {
  flex: 1;
  background-color: #1677ff;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.selector-confirm-btn:hover {
  background-color: #0958d9;
}

.date-range {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-text {
  color: #999999;
  font-size: 14px;
}

.range-scope {
  color: #999999;
  font-size: 14px;
}

/* 筛选面板 */
.filter-panel {
  background-color: #ffffff;
  border-bottom: 1px solid #eeeeee;
  padding: 16px;
}

.quick-select {
  margin-bottom: 16px;
}

.select-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tab-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 8px 16px;
  border-radius: 4px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: #e8f3ff;
  color: #1677ff;
  border-color: #1677ff;
}

.quick-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 6px 12px;
  border-radius: 4px;
  color: #666666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn.active {
  background-color: #e8f3ff;
  color: #1677ff;
  border-color: #1677ff;
}

.multi-filter {
  border-top: 1px solid #eeeeee;
  padding-top: 16px;
  margin-bottom: 16px;
}

.filter-label {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.filter-option input[type="checkbox"] {
  accent-color: #1677ff;
}

.checkbox-label {
  color: #333333;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eeeeee;
  padding-top: 16px;
}

.reset-btn {
  background: none;
  border: 1px solid #dddddd;
  padding: 8px 16px;
  border-radius: 4px;
  color: #666666;
  cursor: pointer;
}

.confirm-btn {
  background-color: #1677ff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
}

/* 数据表格区 */
.table-section {
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background-color: #ffffff;
  border-bottom: 2px solid #eeeeee;
}

.header-cell {
  padding: 12px 8px;
  text-align: left;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
}

.header-cell.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-indicator {
  color: #999999;
  margin-left: 4px;
}

.table-row {
  border-bottom: 1px solid #f5f5f5;
}

.table-row.odd-row {
  background-color: #f9fafb;
}

.table-cell {
  padding: 12px 8px;
  color: #111111;
  font-size: 14px;
}

.amount-cell {
  color: #1677ff;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #e0e0e0;
}

.amount-cell:hover {
  text-decoration-color: #1677ff;
}

/* 员工名称可点击样式 */
.employee-name {
  color: #1677ff;
  cursor: pointer;
  font-weight: 500;
}

.employee-name:hover {
  text-decoration: underline;
}

/* 警告样式 */
.table-cell.warning {
  background-color: #fff2f0;
  color: #ff4d4f;
  font-weight: 600;
}

/* 合计行样式 */
.total-row {
  background-color: #f0f2f5;
  border-top: 2px solid #d9d9d9;
  font-weight: 600;
}

.total-label {
  color: #333333;
  font-weight: 700;
}

.total-value {
  color: #1677ff;
  font-weight: 600;
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

/* 移动端表格样式覆盖 */
.mobile-table-container {
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* 表头行 */
.table-header-row {
  display: flex !important;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  min-width: 1000px; /* 确保横向滚动 */
}

/* 数据行 */
.table-data-row {
  display: flex !important;
  border-bottom: 1px solid #f0f0f0;
  min-width: 1000px; /* 确保横向滚动 */
  transition: background-color 0.2s;
}

.table-data-row:hover {
  background-color: #f8fbff;
}

.table-data-row.odd-row {
  background-color: #f9fafb;
}

/* 合计行 */
.table-total-row {
  display: flex !important;
  background-color: #f0f2f5;
  border-top: 2px solid #d9d9d9;
  min-width: 1000px; /* 确保横向滚动 */
  font-weight: 600;
}

/* 单元格样式 */
.table-header-row .header-cell,
.table-data-row .data-cell,
.table-total-row .data-cell {
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0 !important;
  font-size: 14px;
}

.table-header-row .header-cell:last-child,
.table-data-row .data-cell:last-child,
.table-total-row .data-cell:last-child {
  border-right: none;
}

/* 员工名称列（固定） */
.col-employee-fixed {
  position: sticky !important;
  left: 0 !important;
  z-index: 10 !important;
  background-color: #ffffff !important;
  flex: 0 0 100px !important;
  min-width: 100px !important;
  justify-content: flex-start !important;
  border-right: 2px solid #dee2e6 !important;
  padding: 8px 6px !important;
}

.table-data-row.odd-row .col-employee-fixed {
  background-color: #f9fafb !important;
}

.table-total-row .col-employee-fixed {
  background-color: #f0f2f5 !important;
}

/* 数据列 */
.col-data {
  flex: 0 0 90px !important;
  min-width: 90px !important;
}

/* 表头样式 */
.table-header-row .header-cell {
  color: #333333;
  font-weight: 600;
  background-color: #f8f9fa;
  cursor: pointer;
  user-select: none;
}

/* 员工信息 */
.employee-info {
  text-align: left;
  width: 100%;
}

.employee-info .employee-name {
  color: #1677ff;
  cursor: pointer;
  font-weight: 500;
}

.employee-info .employee-name:hover {
  text-decoration: underline;
}

/* 数据单元格 */
.table-data-row .data-cell {
  color: #111111;
}

/* 可点击的单元格 */
.clickable {
  cursor: pointer !important;
  transition: background-color 0.2s;
}

.clickable:hover {
  background-color: #f0f8ff !important;
}

.employee-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.employee-name {
  color: #1677ff !important;
  font-weight: 500;
  font-size: 13px;
}

.arrow-icon {
  color: #999999;
  font-size: 12px;
  margin-left: 4px;
}

/* 可点击数据单元格的箭头 */
.clickable .arrow-icon {
  color: #999999;
}

/* 单元格内容布局 */
.cell-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 警告样式 */
.table-data-row .data-cell.warning {
  background-color: #fff2f0;
  color: #ff4d4f;
  font-weight: 600;
}

/* 合计行样式 */
.table-total-row .total-label {
  color: #333333;
  font-weight: 700;
}

.table-total-row .total-value {
  color: #1677ff;
  font-weight: 600;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .mobile-table-container {
    margin: 8px 12px;
  }

  .table-header-row .header-cell,
  .table-data-row .data-cell,
  .table-total-row .data-cell {
    padding: 10px 6px;
    font-size: 13px;
  }

  .col-employee {
    flex: 0 0 100px !important;
    min-width: 100px !important;
  }

  .col-data {
    flex: 0 0 80px !important;
    min-width: 80px !important;
  }
}

@media (max-width: 480px) {
  .table-header-row .header-cell,
  .table-data-row .data-cell,
  .table-total-row .data-cell {
    padding: 8px 4px;
    font-size: 12px;
  }

  .col-employee {
    flex: 0 0 90px !important;
    min-width: 90px !important;
  }

  .col-data {
    flex: 0 0 70px !important;
    min-width: 70px !important;
  }
}
</style>
