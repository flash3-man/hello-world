<template>
  <div class="goal-management">
    <!-- 顶部操作栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <svg class="back-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M10 4L6 8L10 12"/>
        </svg>
      </button>
      <div class="title-section">
        <h1 class="page-title">目标列表</h1>
        <button class="video-player-btn" @click="playVideo">
          <svg class="play-icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 2L13 8L3 14V2Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <button class="export-btn" @click="exportData">
        <svg class="export-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 10L12 6H9V1H7V6H4L8 10Z"/>
          <path d="M1 14H15V12H1V14Z"/>
        </svg>
        <span class="export-text">导出</span>
      </button>
    </div>



    <!-- 标签切换栏 -->
    <div class="tab-section">
      <div class="tab-container">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: selectedTab === tab.id }]"
          @click="selectTab(tab.id)"
          :title="tab.description"
        >
          <span class="tab-name">{{ tab.name }}</span>
          <span class="tab-count">({{ tabCounts[tab.id] }})</span>
        </button>
      </div>
    </div>

    <!-- 新的筛选行 -->
    <div class="new-filter-bar">
      <div class="new-filter-item" @click="openNameFilterBottomSheet">
        <span class="filter-label">目标名称</span>
        <span class="filter-value">{{ nameFilterDisplay }}</span>
        <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1"/>
        </svg>
      </div>

      <div class="new-filter-item" @click="openStatusFilterBottomSheet">
        <span class="filter-label">进行中</span>
        <span class="filter-value">{{ statusFilterDisplay }}</span>
        <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1"/>
        </svg>
      </div>

      <button class="new-filter-btn" @click="openAdvancedFilterBottomSheet" :class="{ 'has-filters': hasActiveFilters }">
        筛选
        <span v-if="hasActiveFilters" class="filter-indicator">●</span>
      </button>
    </div>

    <!-- 目标列表区 -->
    <div class="goals-list-section">
      <div class="goals-container">
        <div 
          v-for="goal in filteredGoals" 
          :key="goal.id"
          class="goal-card"
          @click="selectGoal(goal)"
        >
          <!-- 目标卡片头部 -->
          <div class="goal-header">
            <div class="goal-info">
              <h3 class="goal-title">{{ goal.name }}</h3>
              <span class="goal-period">{{ goal.metric }} | {{ goal.period }}</span>
            </div>
            <span v-if="goal.isOverCompleted" class="rocket-icon">🚀</span>
          </div>
          
          <!-- 核心数据指标 -->
          <div class="goal-metrics">
            <div class="metric-group">
              <div class="metric-item">
                <span class="metric-label">目标 ({{ goal.unit }})</span>
                <span class="metric-value">{{ goal.target }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">已完成 ({{ goal.unit }})</span>
                <span class="metric-value">{{ goal.completed }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">{{ goal.isOverCompleted ? '状态' : '差额' }} {{ goal.isOverCompleted ? '' : '(' + goal.unit + ')' }}</span>
                <span 
                  class="metric-value" 
                  :class="goal.differenceClass"
                >
                  {{ goal.difference }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- 进度条和完成率 -->
          <div class="goal-progress">
            <div class="progress-info">
              <span class="progress-label">完成率：</span>
              <span 
                class="progress-rate" 
                :class="goal.progressClass"
              >
                {{ goal.completionRate }}
              </span>
            </div>
            <div class="progress-bar-container">
              <div 
                class="progress-bar" 
                :class="goal.progressClass"
              >
                <div 
                  class="progress-fill" 
                  :style="{ width: goal.progressWidth }"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- 目标操作按钮 -->
          <div class="goal-actions">
            <button
              v-if="goal.canModify"
              class="modify-btn"
              @click.stop="modifyGoal(goal.id)"
            >
              修改目标
            </button>

            <!-- 下钻分析按钮（仅对超额完成的目标显示） -->
            <div v-if="goal.isOverCompleted" class="drill-down-actions">
              <button
                class="drill-down-btn department-btn"
                @click.stop="viewDepartmentPerformance(goal.id)"
              >
                看部门表现
              </button>
              <button
                class="drill-down-btn employee-btn"
                @click.stop="viewEmployeePerformance(goal.id)"
              >
                看员工表现
              </button>
            </div>

            <!-- 数据异常提示 -->
            <div v-if="goal.hasDataError" class="data-error-notice">
              <span class="error-icon">⚠️</span>
              <span class="error-text">数据异常，请核对</span>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredGoals.length === 0" class="no-data">
          <p>暂无符合条件的目标数据</p>
        </div>
      </div>
    </div>



    <!-- 筛选层弹窗 -->
    <div v-if="showAdvancedFilter" class="filter-overlay" @click="closeAdvancedFilter">
      <div class="filter-modal" @click.stop>
        <div class="filter-header">
          <h3 class="filter-title">筛选条件</h3>
          <button class="filter-close" @click="closeAdvancedFilter">×</button>
        </div>

        <div class="filter-content">
          <!-- 部门筛选 -->
          <div class="filter-item" @click="openDepartmentSelector">
            <div class="filter-item-label">部门</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ departmentFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 目标进展状态筛选 -->
          <div class="filter-item" @click="openStatusSelector">
            <div class="filter-item-label">目标进展状态</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ statusFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 目标指标筛选 -->
          <div class="filter-item" @click="openMetricSelector">
            <div class="filter-item-label">目标指标</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ metricFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 排序方式 -->
          <div class="filter-item" @click="openSortSelector">
            <div class="filter-item-label">排序方式</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ sortFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>
        </div>

        <div class="filter-footer">
          <button class="filter-reset-btn" @click="resetAdvancedFilters">重置</button>
          <button class="filter-clear-btn" @click="clearAllFilters">清空所有</button>
          <button class="filter-confirm-btn" @click="applyAdvancedFilters">确定</button>
        </div>
      </div>
    </div>

    <!-- 选择目标弹窗 -->
    <div v-if="showGoalSelector" class="selector-overlay" @click="closeGoalSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择目标</h3>
          <button class="selector-close" @click="closeGoalSelector">×</button>
        </div>

        <div class="selector-content">
          <div class="search-box">
            <input
              type="text"
              v-model="goalSearchQuery"
              placeholder="搜索目标名称..."
              class="search-input"
            >
            <div class="search-icon">🔍</div>
          </div>

          <!-- 快速操作 -->
          <div class="quick-actions">
            <button class="quick-action-btn" @click="selectAllGoals">全选</button>
            <button class="quick-action-btn" @click="clearAllGoals">清空</button>
            <span class="selected-count">已选择 {{ selectedGoalOptions.length }} 个目标</span>
          </div>

          <div class="goal-options">
            <div
              v-for="option in filteredGoalOptions"
              :key="option.id"
              class="goal-option"
              :class="{ active: selectedGoalOptions.includes(option.id) }"
              @click="toggleGoalOption(option.id)"
            >
              <div class="option-content">
                <div class="option-main">
                  <span class="option-name">{{ option.name }}</span>
                  <span class="option-period">{{ option.period }}</span>
                </div>
                <div class="option-metrics">
                  <span class="option-metric">{{ option.metric }}</span>
                  <span class="option-progress">{{ option.completionRate }}</span>
                </div>
              </div>
              <div class="option-checkbox">
                <input
                  type="checkbox"
                  :value="option.id"
                  v-model="selectedGoalOptions"
                  :id="`goal-${option.id}`"
                >
                <label :for="`goal-${option.id}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-cancel-btn" @click="closeGoalSelector">取消</button>
          <button class="selector-confirm-btn" @click="confirmGoalSelection" :disabled="selectedGoalOptions.length === 0">
            确定 ({{ selectedGoalOptions.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- 状态选择弹窗 -->
    <div v-if="showStatusSelector" class="selector-overlay" @click="closeStatusSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择目标状态</h3>
          <button class="selector-close" @click="closeStatusSelector">×</button>
        </div>

        <div class="selector-content">
          <div class="status-options">
            <div
              v-for="status in statusOptions"
              :key="status.value"
              class="status-option"
              :class="{ active: selectedStatusOption === status.value }"
              @click="selectStatusOption(status.value)"
            >
              <div class="option-content">
                <span class="option-name">{{ status.label }}</span>
                <span class="option-description">{{ status.description }}</span>
              </div>
              <div class="option-radio">
                <input
                  type="radio"
                  :value="status.value"
                  v-model="selectedStatusOption"
                  :id="`status-${status.value}`"
                >
                <label :for="`status-${status.value}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-cancel-btn" @click="closeStatusSelector">取消</button>
          <button class="selector-confirm-btn" @click="confirmStatusSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 部门选择弹窗 -->
    <div v-if="showDepartmentSelector" class="selector-overlay" @click="closeDepartmentSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择部门</h3>
          <button class="selector-close" @click="closeDepartmentSelector">×</button>
        </div>

        <div class="selector-content">
          <div class="department-options">
            <div
              v-for="department in departmentOptions"
              :key="department.value"
              class="department-option"
              :class="{ active: selectedDepartmentOption === department.value }"
              @click="selectDepartmentOption(department.value)"
            >
              <div class="option-content">
                <span class="option-name">{{ department.label }}</span>
              </div>
              <div class="option-radio">
                <input
                  type="radio"
                  :value="department.value"
                  v-model="selectedDepartmentOption"
                  :id="`dept-${department.value}`"
                >
                <label :for="`dept-${department.value}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-cancel-btn" @click="closeDepartmentSelector">取消</button>
          <button class="selector-confirm-btn" @click="confirmDepartmentSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 指标选择弹窗 -->
    <div v-if="showMetricSelector" class="selector-overlay" @click="closeMetricSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择目标指标</h3>
          <button class="selector-close" @click="closeMetricSelector">×</button>
        </div>

        <div class="selector-content">
          <div class="metric-options">
            <div
              v-for="metric in metricOptions"
              :key="metric.value"
              class="metric-option"
              :class="{ active: selectedMetricOption === metric.value }"
              @click="selectMetricOption(metric.value)"
            >
              <div class="option-content">
                <span class="option-name">{{ metric.label }}</span>
              </div>
              <div class="option-radio">
                <input
                  type="radio"
                  :value="metric.value"
                  v-model="selectedMetricOption"
                  :id="`metric-${metric.value}`"
                >
                <label :for="`metric-${metric.value}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-cancel-btn" @click="closeMetricSelector">取消</button>
          <button class="selector-confirm-btn" @click="confirmMetricSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 排序选择弹窗 -->
    <div v-if="showSortSelector" class="selector-overlay" @click="closeSortSelector">
      <div class="selector-modal" @click.stop>
        <div class="selector-header">
          <h3 class="selector-title">选择排序方式</h3>
          <button class="selector-close" @click="closeSortSelector">×</button>
        </div>

        <div class="selector-content">
          <div class="sort-options">
            <div
              v-for="sort in sortOptions"
              :key="sort.value"
              class="sort-option"
              :class="{ active: selectedSortOption === sort.value }"
              @click="selectSortOption(sort.value)"
            >
              <div class="option-content">
                <span class="option-name">{{ sort.label }}</span>
              </div>
              <div class="option-radio">
                <input
                  type="radio"
                  :value="sort.value"
                  v-model="selectedSortOption"
                  :id="`sort-${sort.value}`"
                >
                <label :for="`sort-${sort.value}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="selector-footer">
          <button class="selector-cancel-btn" @click="closeSortSelector">取消</button>
          <button class="selector-confirm-btn" @click="confirmSortSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 从下向上的目标名称选择界面 -->
    <div v-if="showNameFilterBottomSheet" class="bottom-sheet-overlay" @click="closeNameFilterBottomSheet">
      <div class="bottom-sheet" @click.stop>
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">选择目标名称</h3>
          <button class="bottom-sheet-close" @click="closeNameFilterBottomSheet">×</button>
        </div>

        <div class="bottom-sheet-content">
          <div class="search-box">
            <input
              type="text"
              v-model="goalSearchQuery"
              placeholder="搜索目标名称..."
              class="search-input"
            >
            <div class="search-icon">🔍</div>
          </div>

          <div class="quick-actions">
            <button class="quick-action-btn" @click="selectAllGoals">全选</button>
            <button class="quick-action-btn" @click="clearAllGoals">清空</button>
            <span class="selected-count">已选择 {{ selectedGoalOptions.length }} 个目标</span>
          </div>

          <div class="goal-options">
            <div
              v-for="option in filteredGoalOptions"
              :key="option.id"
              class="goal-option"
              :class="{ active: selectedGoalOptions.includes(option.id) }"
              @click="toggleGoalOption(option.id)"
            >
              <div class="option-content">
                <div class="option-main">
                  <span class="option-name">{{ option.name }}</span>
                  <span class="option-period">{{ option.period }}</span>
                </div>
                <div class="option-metrics">
                  <span class="option-metric">{{ option.metric }}</span>
                  <span class="option-progress">{{ option.completionRate }}</span>
                </div>
              </div>
              <div class="option-checkbox">
                <input
                  type="checkbox"
                  :value="option.id"
                  v-model="selectedGoalOptions"
                  :id="`bottom-goal-${option.id}`"
                >
                <label :for="`bottom-goal-${option.id}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-sheet-footer">
          <button class="bottom-sheet-cancel-btn" @click="closeNameFilterBottomSheet">取消</button>
          <button class="bottom-sheet-confirm-btn" @click="confirmNameFilterSelection" :disabled="selectedGoalOptions.length === 0">
            确定 ({{ selectedGoalOptions.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- 从下向上的状态选择界面 -->
    <div v-if="showStatusFilterBottomSheet" class="bottom-sheet-overlay" @click="closeStatusFilterBottomSheet">
      <div class="bottom-sheet" @click.stop>
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">选择目标状态</h3>
          <button class="bottom-sheet-close" @click="closeStatusFilterBottomSheet">×</button>
        </div>

        <div class="bottom-sheet-content">
          <div class="status-options">
            <div
              v-for="status in statusOptions"
              :key="status.value"
              class="status-option"
              :class="{ active: selectedStatusOption === status.value }"
              @click="selectStatusOptionBottomSheet(status.value)"
            >
              <div class="option-content">
                <span class="option-name">{{ status.label }}</span>
                <span class="option-description">{{ status.description }}</span>
              </div>
              <div class="option-radio">
                <input
                  type="radio"
                  :value="status.value"
                  v-model="selectedStatusOption"
                  :id="`bottom-status-${status.value}`"
                >
                <label :for="`bottom-status-${status.value}`"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-sheet-footer">
          <button class="bottom-sheet-cancel-btn" @click="closeStatusFilterBottomSheet">取消</button>
          <button class="bottom-sheet-confirm-btn" @click="confirmStatusFilterSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 从下向上的高级筛选界面 -->
    <div v-if="showAdvancedFilterBottomSheet" class="bottom-sheet-overlay" @click="closeAdvancedFilterBottomSheet">
      <div class="bottom-sheet" @click.stop>
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">筛选条件</h3>
          <button class="bottom-sheet-close" @click="closeAdvancedFilterBottomSheet">×</button>
        </div>

        <div class="bottom-sheet-content">
          <!-- 部门筛选 -->
          <div class="filter-item" @click="openDepartmentSelectorFromBottomSheet">
            <div class="filter-item-label">部门</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ departmentFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 目标进展状态筛选 -->
          <div class="filter-item" @click="openStatusSelectorFromBottomSheet">
            <div class="filter-item-label">目标进展状态</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ statusFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 目标指标筛选 -->
          <div class="filter-item" @click="openMetricSelectorFromBottomSheet">
            <div class="filter-item-label">目标指标</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ metricFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>

          <!-- 排序方式 -->
          <div class="filter-item" @click="openSortSelectorFromBottomSheet">
            <div class="filter-item-label">排序方式</div>
            <div class="filter-item-value">
              <span class="filter-value-text">{{ sortFilterDisplay }}</span>
              <span class="filter-arrow">></span>
            </div>
          </div>
        </div>

        <div class="bottom-sheet-footer">
          <button class="bottom-sheet-reset-btn" @click="resetAdvancedFilters">重置</button>
          <button class="bottom-sheet-clear-btn" @click="clearAllFilters">清空所有</button>
          <button class="bottom-sheet-confirm-btn" @click="confirmAdvancedFilterSelection">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoalManagement',
  data() {
    return {
      selectedTab: 'business', // 默认选中业务目标
      showAdvancedFilter: false,
      showGoalSelector: false,
      showStatusSelector: false,
      showDepartmentSelector: false,
      showMetricSelector: false,
      showSortSelector: false,
      showNameFilterBottomSheet: false,
      showStatusFilterBottomSheet: false,
      showAdvancedFilterBottomSheet: false,
      fromBottomSheet: false, // 标记是否从底部弹窗打开的选择器
      goalSearchQuery: '',
      selectedGoalOption: null,
      selectedGoalOptions: [], // 支持多选
      selectedStatusOption: '',
      selectedDepartmentOption: '',
      selectedMetricOption: '',
      selectedSortOption: 'completion-rate-desc',

      // 筛选条件
      nameFilter: '',
      statusFilter: '',
      advancedFilters: {
        department: '',
        progressStatus: '',
        metric: '',
        sortBy: 'completion-rate-desc'
      },
      
      // 标签配置
      tabs: [
        { id: 'all', name: '全部', description: '显示所有类型的目标' },
        { id: 'business', name: '业务目标', description: '销售金额、订单量等直接业绩' },
        { id: 'brand', name: '品牌目标', description: '品牌曝光、市场调研等间接指标' },
        { id: 'product', name: '商品目标', description: '单品销售、SKU库存等' }
      ],
      
      // 目标数据
      goals: [
        // 业务目标
        {
          id: 1,
          type: 'business',
          name: '五月目标配置',
          metric: '订单金额',
          period: '2025-01-01 ~ 2025-12-31',
          target: '60,000.00',
          completed: '665,555.62',
          difference: '59,933.44万',
          completionRate: '0.11%',
          unit: '元',
          status: 'in-progress',
          department: 'sales',
          progressClass: 'progress-low',
          differenceClass: 'negative',
          progressWidth: '0.11%',
          isOverCompleted: false,
          canModify: true,
          hasDataError: true // 标记数据异常
        },
        {
          id: 2,
          type: 'business',
          name: '20000',
          metric: '销售金额',
          period: '2025-01-01 ~ 2025-12-31',
          target: '2,000.00',
          completed: '28,669.13',
          difference: '超额完成',
          completionRate: '1433.46%',
          unit: '元',
          status: 'completed',
          department: 'sales',
          progressClass: 'progress-high',
          differenceClass: 'positive',
          progressWidth: '100%',
          isOverCompleted: true,
          canModify: true,
          hasDataError: false
        },
        
        // 品牌目标
        {
          id: 3,
          type: 'brand',
          name: '卡夫 - 测试',
          metric: '订单金额',
          period: '2025-01-01 ~ 2025-12-31',
          target: '192,000.00',
          completed: '0.00',
          difference: '192,000.00',
          completionRate: '0%',
          unit: '元',
          status: 'not-started',
          department: 'marketing',
          progressClass: 'progress-none',
          differenceClass: 'negative',
          progressWidth: '0%',
          isOverCompleted: false,
          canModify: true
        },
        {
          id: 4,
          type: 'brand',
          name: '康云特火腿馅 - 海底捞',
          metric: '销售金额',
          period: '2025-01-01 ~ 2025-12-31',
          target: '150,000.00',
          completed: '89,500.00',
          difference: '60,500.00',
          completionRate: '59.67%',
          unit: '元',
          status: 'in-progress',
          department: 'marketing',
          progressClass: 'progress-normal',
          differenceClass: 'negative',
          progressWidth: '59.67%',
          isOverCompleted: false,
          canModify: true
        },
        {
          id: 5,
          type: 'brand',
          name: '南侨食品 - 茗姐',
          metric: '市场占有率',
          period: '2025-01-01 ~ 2025-12-31',
          target: '25.00',
          completed: '18.50',
          difference: '6.50',
          completionRate: '74.00%',
          unit: '%',
          status: 'in-progress',
          department: 'marketing',
          progressClass: 'progress-normal',
          differenceClass: 'negative',
          progressWidth: '74%',
          isOverCompleted: false,
          canModify: true
        },
        
        // 商品目标
        {
          id: 6,
          type: 'product',
          name: '闪光挖掘机 602 - 脉动 2024 年销售',
          metric: '销售数量',
          period: '2024-01-01 ~ 2024-12-31',
          target: '10,000',
          completed: '12,500',
          difference: '超额完成',
          completionRate: '125.00%',
          unit: '台',
          status: 'completed',
          department: 'operations',
          progressClass: 'progress-high',
          differenceClass: 'positive',
          progressWidth: '100%',
          isOverCompleted: true,
          canModify: false
        },
        {
          id: 7,
          type: 'product',
          name: '智能手机 Pro Max - 年度销量',
          metric: '销售金额',
          period: '2025-01-01 ~ 2025-12-31',
          target: '500,000.00',
          completed: '320,000.00',
          difference: '180,000.00',
          completionRate: '64.00%',
          unit: '元',
          status: 'in-progress',
          department: 'sales',
          progressClass: 'progress-normal',
          differenceClass: 'negative',
          progressWidth: '64%',
          isOverCompleted: false,
          canModify: true
        }
      ],
      
      // 目标选择器选项（模拟更多目标）
      goalOptions: [
        { id: 101, name: '3月销售目标', period: '2025-03-01 ~ 2025-03-31', metric: '销售金额', completionRate: '89.5%' },
        { id: 102, name: '8月销售目标', period: '2025-08-01 ~ 2025-08-31', metric: '订单金额', completionRate: '67.2%' },
        { id: 103, name: '康云特火腿馅 - 海底捞', period: '2025-01-01 ~ 2025-12-31', metric: '销售金额', completionRate: '59.67%' },
        { id: 104, name: '南侨食品 - 茗姐', period: '2025-01-01 ~ 2025-12-31', metric: '市场占有率', completionRate: '74.00%' },
        { id: 105, name: '卡夫 - 测试', period: '2025-01-01 ~ 2025-12-31', metric: '订单金额', completionRate: '0%' },
        { id: 106, name: '闪光挖掘机 602 - 脉动 2024 年销售', period: '2024-01-01 ~ 2024-12-31', metric: '销售数量', completionRate: '125.00%' }
      ],

      // 状态选择器选项
      statusOptions: [
        { value: '', label: '全部', description: '显示所有阶段的目标' },
        { value: 'not-started', label: '未开始', description: '仅显示"未启动"的目标' },
        { value: 'in-progress', label: '进行中', description: '仅显示"执行中"的目标' },
        { value: 'completed', label: '已结束', description: '仅显示"已完成/终止"的目标' },
        { value: 'terminated', label: '已终止', description: '仅显示"中途叫停"的目标' }
      ],

      // 部门选择器选项
      departmentOptions: [
        { value: '', label: '全部部门' },
        { value: 'sales', label: '销售部' },
        { value: 'marketing', label: '市场部' },
        { value: 'operations', label: '运营部' },
        { value: 'finance', label: '财务部' }
      ],

      // 指标选择器选项
      metricOptions: [
        { value: '', label: '全部指标' },
        { value: '订单金额', label: '订单金额' },
        { value: '销售金额', label: '销售金额' },
        { value: '销售数量', label: '销售数量' },
        { value: '市场占有率', label: '市场占有率' }
      ],

      // 排序选择器选项
      sortOptions: [
        { value: 'completion-rate-desc', label: '按完成率降序' },
        { value: 'completion-rate-asc', label: '按完成率升序' },
        { value: 'target-amount-desc', label: '按目标金额降序' },
        { value: 'target-amount-asc', label: '按目标金额升序' },
        { value: 'name-asc', label: '按名称升序' },
        { value: 'name-desc', label: '按名称降序' }
      ]
    }
  },
  
  computed: {
    // 当前日期
    currentDate() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekday = weekdays[now.getDay()]
      return `${year}-${month}-${day} ${weekday}`
    },
    
    // 筛选后的目标
    filteredGoals() {
      let filtered = this.goals
      
      // 按标签筛选
      if (this.selectedTab !== 'all') {
        filtered = filtered.filter(goal => goal.type === this.selectedTab)
      }
      
      // 按名称筛选
      if (this.nameFilter) {
        filtered = filtered.filter(goal => 
          goal.name.toLowerCase().includes(this.nameFilter.toLowerCase())
        )
      }
      
      // 按状态筛选
      if (this.statusFilter) {
        filtered = filtered.filter(goal => goal.status === this.statusFilter)
      }
      
      // 高级筛选
      if (this.advancedFilters.department) {
        filtered = filtered.filter(goal => goal.department === this.advancedFilters.department)
      }
      
      if (this.advancedFilters.progressStatus) {
        filtered = filtered.filter(goal => goal.status === this.advancedFilters.progressStatus)
      }
      
      if (this.advancedFilters.metric) {
        filtered = filtered.filter(goal => goal.metric === this.advancedFilters.metric)
      }
      
      // 排序
      if (this.advancedFilters.sortBy) {
        filtered = this.sortGoals(filtered, this.advancedFilters.sortBy)
      }
      
      return filtered
    },
    
    // 筛选后的目标选择器选项
    filteredGoalOptions() {
      if (!this.goalSearchQuery) return this.goalOptions
      
      return this.goalOptions.filter(option =>
        option.name.toLowerCase().includes(this.goalSearchQuery.toLowerCase())
      )
    },
    
    // 名称筛选显示文本
    nameFilterDisplay() {
      return this.nameFilter || '全部目标'
    },
    
    // 状态筛选显示文本
    statusFilterDisplay() {
      const statusMap = {
        'not-started': '未开始',
        'in-progress': '进行中',
        'completed': '已结束',
        'terminated': '已终止'
      }
      return this.advancedFilters.progressStatus ? statusMap[this.advancedFilters.progressStatus] : '全部状态'
    },

    // 部门筛选显示文本
    departmentFilterDisplay() {
      const departmentMap = {
        'sales': '销售部',
        'marketing': '市场部',
        'operations': '运营部',
        'finance': '财务部'
      }
      return this.advancedFilters.department ? departmentMap[this.advancedFilters.department] : '全部部门'
    },

    // 指标筛选显示文本
    metricFilterDisplay() {
      return this.advancedFilters.metric || '全部指标'
    },

    // 排序筛选显示文本
    sortFilterDisplay() {
      const sortMap = {
        'completion-rate-desc': '按完成率降序',
        'completion-rate-asc': '按完成率升序',
        'target-amount-desc': '按目标金额降序',
        'target-amount-asc': '按目标金额升序',
        'name-asc': '按名称升序',
        'name-desc': '按名称降序'
      }
      return sortMap[this.advancedFilters.sortBy] || '按完成率降序'
    },

    // 标签数量统计
    tabCounts() {
      const counts = {
        all: this.goals.length,
        business: this.goals.filter(goal => goal.type === 'business').length,
        brand: this.goals.filter(goal => goal.type === 'brand').length,
        product: this.goals.filter(goal => goal.type === 'product').length
      }
      return counts
    },

    // 检查是否有活跃的筛选条件
    hasActiveFilters() {
      return this.nameFilter ||
             this.statusFilter ||
             this.advancedFilters.department ||
             this.advancedFilters.progressStatus ||
             this.advancedFilters.metric ||
             this.advancedFilters.sortBy !== 'completion-rate-desc'
    }
  },
  
  methods: {
    // 标签切换
    selectTab(tabId) {
      this.selectedTab = tabId
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },

    // 播放视频
    playVideo() {
      console.log('播放目标管理教学视频')
      // 这里可以打开视频播放器或跳转到视频页面
      alert('目标管理教学视频播放功能开发中')
    },
    
    // 导出数据
    exportData() {
      const data = this.filteredGoals.map(goal => ({
        '目标名称': goal.name,
        '目标指标': goal.metric,
        '时间周期': goal.period,
        '目标值': goal.target + goal.unit,
        '已完成': goal.completed + goal.unit,
        '差额/状态': goal.difference,
        '完成率': goal.completionRate
      }))
      
      console.log('导出目标数据:', data)
      alert('目标数据导出功能开发中，将支持Excel/CSV格式')
    },
    
    // 打开名称筛选
    openNameFilter() {
      const name = prompt('请输入目标名称关键词：', this.nameFilter)
      if (name !== null) {
        this.nameFilter = name
      }
    },
    
    // 打开状态筛选
    openStatusFilter() {
      // 这里可以实现更复杂的状态选择器
      // const statuses = [
      //   { value: '', label: '全部状态' },
      //   { value: 'not-started', label: '未开始' },
      //   { value: 'in-progress', label: '进行中' },
      //   { value: 'completed', label: '已完成' },
      //   { value: 'overdue', label: '已逾期' }
      // ]
      
      // 简化实现，可以扩展为更复杂的选择器
      console.log('打开状态筛选器')
    },
    
    // 打开高级筛选
    openAdvancedFilter() {
      this.showAdvancedFilter = true
    },
    
    // 关闭高级筛选
    closeAdvancedFilter() {
      this.showAdvancedFilter = false
    },
    
    // 重置高级筛选
    resetAdvancedFilters() {
      this.advancedFilters = {
        department: '',
        progressStatus: '',
        metric: '',
        sortBy: 'completion-rate-desc'
      }
    },

    // 清空所有筛选条件
    clearAllFilters() {
      this.nameFilter = ''
      this.statusFilter = ''
      this.advancedFilters = {
        department: '',
        progressStatus: '',
        metric: '',
        sortBy: 'completion-rate-desc'
      }
      this.selectedTab = 'all'
    },
    
    // 应用高级筛选
    applyAdvancedFilters() {
      this.showAdvancedFilter = false
      console.log('应用高级筛选条件:', this.advancedFilters)
      // 筛选条件会通过computed属性自动应用到filteredGoals
      this.$nextTick(() => {
        console.log('筛选后的目标数量:', this.filteredGoals.length)
      })
    },

    // === 状态选择器相关方法 ===
    openStatusSelector() {
      this.selectedStatusOption = this.advancedFilters.progressStatus
      this.showStatusSelector = true
      // 隐藏主筛选窗口
      this.showAdvancedFilter = false
      // 确保不是从底部弹窗打开的标记
      this.fromBottomSheet = false
    },

    closeStatusSelector() {
      this.showStatusSelector = false
      this.selectedStatusOption = ''
      // 判断应该返回到哪个界面
      if (this.fromBottomSheet) {
        this.showAdvancedFilterBottomSheet = true
        this.fromBottomSheet = false
      } else {
        this.showAdvancedFilter = true
      }
    },

    selectStatusOption(value) {
      this.selectedStatusOption = value
    },

    confirmStatusSelection() {
      this.advancedFilters.progressStatus = this.selectedStatusOption
      this.closeStatusSelector()
    },

    // === 部门选择器相关方法 ===
    openDepartmentSelector() {
      this.selectedDepartmentOption = this.advancedFilters.department
      this.showDepartmentSelector = true
      // 隐藏主筛选窗口
      this.showAdvancedFilter = false
      // 确保不是从底部弹窗打开的标记
      this.fromBottomSheet = false
    },

    closeDepartmentSelector() {
      this.showDepartmentSelector = false
      this.selectedDepartmentOption = ''
      // 判断应该返回到哪个界面
      if (this.fromBottomSheet) {
        this.showAdvancedFilterBottomSheet = true
        this.fromBottomSheet = false
      } else {
        this.showAdvancedFilter = true
      }
    },

    selectDepartmentOption(value) {
      this.selectedDepartmentOption = value
    },

    confirmDepartmentSelection() {
      this.advancedFilters.department = this.selectedDepartmentOption
      this.closeDepartmentSelector()
    },

    // === 指标选择器相关方法 ===
    openMetricSelector() {
      this.selectedMetricOption = this.advancedFilters.metric
      this.showMetricSelector = true
      // 隐藏主筛选窗口
      this.showAdvancedFilter = false
      // 确保不是从底部弹窗打开的标记
      this.fromBottomSheet = false
    },

    closeMetricSelector() {
      this.showMetricSelector = false
      this.selectedMetricOption = ''
      // 判断应该返回到哪个界面
      if (this.fromBottomSheet) {
        this.showAdvancedFilterBottomSheet = true
        this.fromBottomSheet = false
      } else {
        this.showAdvancedFilter = true
      }
    },

    selectMetricOption(value) {
      this.selectedMetricOption = value
    },

    confirmMetricSelection() {
      this.advancedFilters.metric = this.selectedMetricOption
      this.closeMetricSelector()
    },

    // === 排序选择器相关方法 ===
    openSortSelector() {
      this.selectedSortOption = this.advancedFilters.sortBy
      this.showSortSelector = true
      // 隐藏主筛选窗口
      this.showAdvancedFilter = false
      // 确保不是从底部弹窗打开的标记
      this.fromBottomSheet = false
    },

    closeSortSelector() {
      this.showSortSelector = false
      this.selectedSortOption = 'completion-rate-desc'
      // 判断应该返回到哪个界面
      if (this.fromBottomSheet) {
        this.showAdvancedFilterBottomSheet = true
        this.fromBottomSheet = false
      } else {
        this.showAdvancedFilter = true
      }
    },

    selectSortOption(value) {
      this.selectedSortOption = value
    },

    confirmSortSelection() {
      this.advancedFilters.sortBy = this.selectedSortOption
      this.closeSortSelector()
    },

    // === 从下向上弹出的选择界面方法 ===
    // 目标名称选择
    openNameFilterBottomSheet() {
      this.showNameFilterBottomSheet = true
    },

    closeNameFilterBottomSheet() {
      this.showNameFilterBottomSheet = false
      this.goalSearchQuery = ''
      this.selectedGoalOptions = []
    },

    confirmNameFilterSelection() {
      if (this.selectedGoalOptions.length > 0) {
        const selectedGoals = this.goalOptions.filter(opt => this.selectedGoalOptions.includes(opt.id))
        this.nameFilter = selectedGoals.map(g => g.name).join(', ')
        this.closeNameFilterBottomSheet()
      } else {
        this.nameFilter = ''
        this.closeNameFilterBottomSheet()
      }
    },

    // 状态选择
    openStatusFilterBottomSheet() {
      this.selectedStatusOption = this.advancedFilters.progressStatus
      this.showStatusFilterBottomSheet = true
    },

    closeStatusFilterBottomSheet() {
      this.showStatusFilterBottomSheet = false
      this.selectedStatusOption = ''
    },

    selectStatusOptionBottomSheet(value) {
      this.selectedStatusOption = value
    },

    confirmStatusFilterSelection() {
      this.advancedFilters.progressStatus = this.selectedStatusOption
      this.closeStatusFilterBottomSheet()
    },

    // 高级筛选
    openAdvancedFilterBottomSheet() {
      this.showAdvancedFilterBottomSheet = true
    },

    closeAdvancedFilterBottomSheet() {
      this.showAdvancedFilterBottomSheet = false
    },

    confirmAdvancedFilterSelection() {
      this.showAdvancedFilterBottomSheet = false
      console.log('应用高级筛选条件:', this.advancedFilters)
    },

    // === 从底部弹窗打开选择器的专门方法 ===
    openDepartmentSelectorFromBottomSheet() {
      this.selectedDepartmentOption = this.advancedFilters.department
      this.showDepartmentSelector = true
      this.showAdvancedFilterBottomSheet = false
      this.fromBottomSheet = true
    },

    openStatusSelectorFromBottomSheet() {
      this.selectedStatusOption = this.advancedFilters.progressStatus
      this.showStatusSelector = true
      this.showAdvancedFilterBottomSheet = false
      this.fromBottomSheet = true
    },

    openMetricSelectorFromBottomSheet() {
      this.selectedMetricOption = this.advancedFilters.metric
      this.showMetricSelector = true
      this.showAdvancedFilterBottomSheet = false
      this.fromBottomSheet = true
    },

    openSortSelectorFromBottomSheet() {
      this.selectedSortOption = this.advancedFilters.sortBy
      this.showSortSelector = true
      this.showAdvancedFilterBottomSheet = false
      this.fromBottomSheet = true
    },
    
    // 选择目标（打开目标选择器）
    selectGoal(goal) {
      console.log('选择目标:', goal.name)
      this.showGoalSelector = true
    },
    
    // 关闭目标选择器
    closeGoalSelector() {
      this.showGoalSelector = false
      this.goalSearchQuery = ''
      this.selectedGoalOption = null
      this.selectedGoalOptions = []
    },

    // 选择目标选项（单选，保持兼容性）
    selectGoalOption(option) {
      this.selectedGoalOption = option.id
    },

    // 切换目标选项（多选）
    toggleGoalOption(optionId) {
      const index = this.selectedGoalOptions.indexOf(optionId)
      if (index > -1) {
        this.selectedGoalOptions.splice(index, 1)
      } else {
        this.selectedGoalOptions.push(optionId)
      }
    },

    // 全选目标
    selectAllGoals() {
      this.selectedGoalOptions = this.filteredGoalOptions.map(option => option.id)
    },

    // 清空选择
    clearAllGoals() {
      this.selectedGoalOptions = []
    },

    // 确认目标选择
    confirmGoalSelection() {
      if (this.selectedGoalOptions.length > 0) {
        const selectedGoals = this.goalOptions.filter(opt => this.selectedGoalOptions.includes(opt.id))
        console.log('确认选择目标:', selectedGoals.map(g => g.name))
        // 这里可以将选择的目标应用到筛选条件中
        this.nameFilter = selectedGoals.map(g => g.name).join(', ')
        this.closeGoalSelector()
      } else {
        alert('请至少选择一个目标')
      }
    },
    
    // 修改目标
    modifyGoal(goalId) {
      console.log('修改目标:', goalId)
      alert('目标修改功能开发中')
    },
    
    // 查看部门表现
    viewDepartmentPerformance(goalId = null) {
      console.log('查看部门表现', goalId ? `目标ID: ${goalId}` : '全部目标')
      if (goalId) {
        // 跳转到部门目标明细页
        this.$router.push(`/department-goal-detail/${goalId}`)
      } else {
        // 跳转到部门整体表现页
        this.$router.push('/department-performance')
      }
    },

    // 查看员工表现
    viewEmployeePerformance(goalId = null) {
      console.log('查看员工表现', goalId ? `目标ID: ${goalId}` : '全部目标')
      if (goalId) {
        // 跳转到员工目标明细页
        this.$router.push(`/employee-goal-detail/${goalId}`)
      } else {
        // 跳转到员工整体表现页
        this.$router.push('/employee-performance')
      }
    },
    
    // 目标排序
    sortGoals(goals, sortBy) {
      const sorted = [...goals]
      
      switch (sortBy) {
        case 'completion-rate-asc':
          return sorted.sort((a, b) => parseFloat(a.completionRate) - parseFloat(b.completionRate))
        case 'completion-rate-desc':
          return sorted.sort((a, b) => parseFloat(b.completionRate) - parseFloat(a.completionRate))
        case 'target-amount-asc':
          return sorted.sort((a, b) => this.parseAmount(a.target) - this.parseAmount(b.target))
        case 'target-amount-desc':
          return sorted.sort((a, b) => this.parseAmount(b.target) - this.parseAmount(a.target))
        default:
          return sorted
      }
    },
    
    // 解析金额数字
    parseAmount(amountStr) {
      return parseFloat(amountStr.replace(/,/g, '')) || 0
    }
  }
}
</script>

<style scoped>
/* 整体布局 - 移动端目标管理专用设计 */
.goal-management {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 顶部操作栏 - 精确像素设计 */
.header-bar {
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

.back-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #f0f8ff;
}

.back-icon {
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  width: 16px;
  height: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.page-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.video-player-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #007AFF;
  border: none;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.video-player-btn:hover {
  background-color: #0056d6;
  transform: scale(1.1);
}

.play-icon {
  width: 12px;
  height: 12px;
  margin-left: 1px; /* 视觉居中调整 */
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

/* 日期与筛选栏 */
.date-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.date-section {
  display: flex;
  align-items: center;
}

.current-date {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-section .filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 80px;
}

.filter-section .filter-item:hover {
  background-color: #e9ecef;
}

.filter-section .filter-label {
  color: #333333;
  font-size: 13px;
  font-weight: 500;
}

.filter-section .filter-value {
  color: #666666;
  font-size: 13px;
  margin-left: auto;
}

.filter-section .filter-arrow {
  stroke: #999999;
  stroke-width: 1.5;
  fill: none;
  transition: transform 0.3s ease;
}

.filter-section .advanced-filter-btn {
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.filter-section .advanced-filter-btn:hover {
  background-color: #0056d6;
}

.filter-section .advanced-filter-btn.has-filters {
  background-color: #FF9500;
}

.filter-section .advanced-filter-btn.has-filters:hover {
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

/* 标签切换栏 */
.tab-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.tab-container {
  display: flex;
  padding: 0 16px;
  overflow: hidden; /* 移除滚动条 */
}

.tab-btn {
  background: none;
  border: none;
  padding: 14px 12px; /* 减少左右内边距 */
  color: #666666;
  font-size: 14px; /* 稍微减小字体 */
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  flex: 1; /* 平均分配宽度 */
  text-align: center;
  min-width: 0; /* 允许收缩 */
}

.tab-btn.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
  font-weight: 600;
}

.tab-btn:hover {
  color: #007AFF;
}

.tab-name {
  margin-right: 2px; /* 减少间距 */
}

.tab-count {
  font-size: 11px; /* 减小数量字体 */
  color: #666666;
  font-weight: normal;
}

.tab-btn.active .tab-count {
  color: #007AFF;
}

/* 在小屏幕上进一步优化 */
@media (max-width: 480px) {
  .tab-btn {
    padding: 12px 8px;
    font-size: 13px;
  }

  .tab-count {
    font-size: 10px;
  }
}

@media (max-width: 360px) {
  .tab-btn {
    padding: 10px 6px;
    font-size: 12px;
  }

  .tab-name {
    margin-right: 1px;
  }

  .tab-count {
    font-size: 9px;
  }
}

/* 新的筛选行 */
.new-filter-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  gap: 12px;
}

.new-filter-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.new-filter-item:hover {
  background-color: #e9ecef;
}

.new-filter-item .filter-label {
  font-size: 13px;
  color: #333333;
  font-weight: 500;
}

.new-filter-item .filter-value {
  font-size: 12px;
  color: #666666;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.new-filter-item .filter-arrow {
  stroke: #999999;
  stroke-width: 1.5;
  fill: none;
  width: 12px;
  height: 8px;
}

.new-filter-btn {
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  margin-left: auto;
}

.new-filter-btn:hover {
  background-color: #0056d6;
}

.new-filter-btn.has-filters {
  background-color: #FF9500;
}

.new-filter-btn.has-filters:hover {
  background-color: #e6850e;
}

/* 目标列表区 */
.goals-list-section {
  padding: 16px;
}

.goals-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-card {
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #007AFF;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.goal-info {
  flex: 1;
}

.goal-title {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.goal-period {
  color: #666666;
  font-size: 13px;
  line-height: 1.3;
}

.rocket-icon {
  font-size: 20px;
  margin-left: 8px;
}

/* 核心数据指标 */
.goal-metrics {
  margin-bottom: 16px;
}

.metric-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.metric-label {
  color: #666666;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

.metric-value {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.metric-value.positive {
  color: #00b42a;
}

.metric-value.negative {
  color: #f53f3f;
}

/* 进度条和完成率 */
.goal-progress {
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
}

.progress-rate {
  font-size: 16px;
  font-weight: 700;
}

.progress-rate.progress-low {
  color: #f53f3f;
}

.progress-rate.progress-normal {
  color: #ffaa00;
}

.progress-rate.progress-high {
  color: #00b42a;
}

.progress-rate.progress-none {
  color: #999999;
}

.progress-bar-container {
  position: relative;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
  background: linear-gradient(90deg, #007AFF 0%, #34C759 100%);
}

.progress-bar.progress-low .progress-fill {
  background: linear-gradient(90deg, #FF3B30 0%, #FF9500 100%);
}

.progress-bar.progress-normal .progress-fill {
  background: linear-gradient(90deg, #FF9500 0%, #FFCC02 100%);
}

.progress-bar.progress-high .progress-fill {
  background: linear-gradient(90deg, #34C759 0%, #30D158 100%);
}

/* 目标操作按钮 */
.goal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  margin-top: 12px;
}

.department-performance-btn {
  background-color: #34C759;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

<<<<<<< HEAD
.modify-btn:hover {
  background-color: #0056d6;
}

/* 下钻分析按钮 */
.drill-down-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.drill-down-btn {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #495057;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.drill-down-btn:hover {
  background-color: #e9ecef;
  border-color: #007AFF;
  color: #007AFF;
}

.drill-down-btn.department-btn {
  background-color: #e8f5e8;
  border-color: #28a745;
  color: #28a745;
}

.drill-down-btn.department-btn:hover {
  background-color: #28a745;
  color: #ffffff;
}

.drill-down-btn.employee-btn {
  background-color: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.drill-down-btn.employee-btn:hover {
  background-color: #ffc107;
  color: #212529;
}

/* 数据异常提示 */
.data-error-notice {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 4px 8px;
  margin-top: 8px;
}

.error-icon {
  font-size: 14px;
}

.error-text {
  color: #856404;
  font-size: 11px;
  font-weight: 500;
}

/* 底部操作区 */
.bottom-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #eaeaea;
  position: sticky;
  bottom: 0;
}

.department-performance-btn:hover {
  background-color: #28a745;
}

.modify-btn {
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

.modify-btn:hover {
  background-color: #0056d6;
}



/* 无数据状态 */
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
  font-size: 15px;
}

/* 弹窗样式 - 高级筛选 */
.filter-overlay {
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

.filter-modal {
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

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.filter-title {
  margin: 0;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
}

.filter-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.filter-close:hover {
  background-color: #f0f0f0;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 新的筛选项样式 */
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

.filter-group {
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group-label {
  display: block;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  color: #333333;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #007AFF;
}

.filter-footer {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #eaeaea;
}

.filter-reset-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-reset-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.filter-clear-btn {
  flex: 1;
  background-color: #FF3B30;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-clear-btn:hover {
  background-color: #d70015;
}

.filter-confirm-btn {
  flex: 1;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-confirm-btn:hover {
  background-color: #0056d6;
}

/* 目标选择器弹窗 */
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

.selector-modal {
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.selector-title {
  margin: 0;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
}

.selector-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.selector-close:hover {
  background-color: #f0f0f0;
}

.selector-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-box {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f8f9fa;
  transition: all 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #007AFF;
  background-color: #ffffff;
}

.search-icon {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  color: #999999;
  font-size: 14px;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.quick-action-btn {
  background: none;
  border: 1px solid #007AFF;
  border-radius: 4px;
  color: #007AFF;
  font-size: 12px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background-color: #007AFF;
  color: #ffffff;
}

.selected-count {
  font-size: 12px;
  color: #666666;
}

.goal-options {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.goal-option {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.goal-option:hover {
  background-color: #f8f9fa;
}

.goal-option:last-child {
  border-bottom: none;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-name {
  color: #333333;
  font-size: 15px;
  font-weight: 500;
}

.option-period {
  color: #666666;
  font-size: 12px;
}

.option-metrics {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-metric {
  color: #666666;
  font-size: 13px;
}

.option-progress {
  color: #007AFF;
  font-size: 13px;
  font-weight: 600;
}

.option-radio {
  margin-left: 12px;
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
  border-color: #007AFF;
  background-color: #007AFF;
  background-image: radial-gradient(circle, #ffffff 0%, #ffffff 40%, transparent 50%);
}

.option-radio label {
  cursor: pointer;
}

/* 复选框样式 */
.option-checkbox {
  margin-left: 12px;
}

.option-checkbox input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.option-checkbox input[type="checkbox"]:checked {
  border-color: #007AFF;
  background-color: #007AFF;
}

.option-checkbox input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.option-checkbox label {
  cursor: pointer;
}

.selector-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eaeaea;
}

.selector-cancel-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.selector-cancel-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.selector-confirm-btn {
  flex: 1;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.selector-confirm-btn:hover {
  background-color: #0056d6;
}

/* 状态选择器选项样式 */
.status-options, .department-options, .metric-options, .sort-options {
  padding: 0;
}

.status-option, .department-option, .metric-option, .sort-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-option:hover, .department-option:hover, .metric-option:hover, .sort-option:hover {
  background-color: #f8f9fa;
}

.status-option:last-child, .department-option:last-child, .metric-option:last-child, .sort-option:last-child {
  border-bottom: none;
}

.status-option.active, .department-option.active, .metric-option.active, .sort-option.active {
  background-color: #e3f2fd;
}

.status-option .option-content, .department-option .option-content, .metric-option .option-content, .sort-option .option-content {
  flex: 1;
}

.status-option .option-name, .department-option .option-name, .metric-option .option-name, .sort-option .option-name {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  display: block;
}

.status-option .option-description {
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
  display: block;
}

/* 从下向上弹出的界面样式 */
.bottom-sheet-overlay {
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.bottom-sheet {
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

.bottom-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.bottom-sheet-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.bottom-sheet-close {
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

.bottom-sheet-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.bottom-sheet-footer {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.bottom-sheet-cancel-btn {
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

.bottom-sheet-reset-btn {
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

.bottom-sheet-clear-btn {
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

.bottom-sheet-clear-btn:hover {
  background-color: #d70015;
}

.bottom-sheet-confirm-btn {
  flex: 1;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.bottom-sheet-confirm-btn:hover {
  background-color: #0056d6;
}

.bottom-sheet-confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .page-title {
    font-size: 16px;
  }
  
  .export-btn {
    font-size: 14px;
  }
  
  .export-text {
    display: none; /* 隐藏"导出"文字，只保留图标 */
  }
  
  .date-filter-bar {
    padding: 8px 16px; /* 减少内边距 */
  }
  
  .current-date {
    font-size: 12px;
    padding: 4px 8px; /* 减少日期的内边距 */
  }
  
  .filter-section {
    gap: 6px; /* 减少筛选项之间的间距 */
  }
  
  .filter-section .filter-item {
    padding: 4px 6px; /* 减少筛选项的内边距 */
    min-width: 60px;
  }
  
  .filter-section .filter-label {
    font-size: 12px;
  }
  
  .filter-section .filter-value {
    font-size: 12px;
  }
  
  .filter-section .advanced-filter-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .metric-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .header-bar {
    padding: 8px 12px;
  }
  
  .page-title {
    font-size: 15px;
  }
  
  .date-filter-bar {
    padding: 6px 12px;
  }
  
  .current-date {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .filter-section {
    gap: 4px;
  }
  
  .filter-section .filter-item {
    padding: 3px 4px;
    min-width: 50px;
  }
  
  .filter-section .filter-label {
    font-size: 11px;
  }
  
  .filter-section .filter-value {
    font-size: 11px;
  }
  
  .filter-section .advanced-filter-btn {
    padding: 3px 6px;
    font-size: 11px;
  }
  
  .goals-list-section {
    padding: 12px;
  }
  
  .goal-card {
    padding: 12px;
  }
}

@media (max-width: 320px) {
  .page-title {
    font-size: 14px;
  }
  
  .current-date {
    font-size: 10px;
    padding: 2px 4px;
  }
  
  .filter-section .filter-item {
    padding: 2px 3px;
    min-width: 45px;
  }
  
  .filter-section .filter-label {
    font-size: 10px;
  }
  
  .filter-section .filter-value {
    font-size: 10px;
  }
  
  .filter-section .advanced-filter-btn {
    padding: 2px 4px;
    font-size: 10px;
  }
  
  /* 在极小屏幕上隐藏筛选项的值，只显示标签 */
  .filter-section .filter-value {
    display: none;
  }
  
  .filter-section .filter-arrow {
    display: none;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

.filter-overlay,
.selector-overlay {
  animation: fadeIn 0.2s ease-out;
}

.filter-modal,
.selector-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
