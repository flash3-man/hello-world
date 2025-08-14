<template>
  <div class="goal-management">
    <!-- 顶部操作栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <svg class="back-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M10 4L6 8L10 12"/>
        </svg>
      </button>
      <h1 class="page-title">目标列表</h1>
      <button class="export-btn" @click="exportData">
        <svg class="export-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 10L12 6H9V1H7V6H4L8 10Z"/>
          <path d="M1 14H15V12H1V14Z"/>
        </svg>
        <span class="export-text">导出</span>
      </button>
    </div>

    <!-- 日期与筛选栏 -->
    <div class="date-filter-bar">
      <div class="date-section">
        <span class="current-date">{{ currentDate }}</span>
      </div>
      <div class="filter-section">
        <div class="filter-item" @click="openNameFilter">
          <span class="filter-label">目标名称</span>
          <span class="filter-value">{{ nameFilterDisplay }}</span>
          <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
        
        <div class="filter-item" @click="openStatusFilter">
          <span class="filter-label">进行中</span>
          <span class="filter-value">{{ statusFilterDisplay }}</span>
          <svg class="filter-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1"/>
          </svg>
        </div>
        
        <button class="advanced-filter-btn" @click="openAdvancedFilter">
          筛选
        </button>
      </div>
    </div>

    <!-- 标签切换栏 -->
    <div class="tab-section">
      <div class="tab-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: selectedTab === tab.id }]"
          @click="selectTab(tab.id)"
        >
          {{ tab.name }}
        </button>
      </div>
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

    <!-- 底部操作区 -->
    <div class="bottom-actions">
      <button class="performance-btn" @click="viewDepartmentPerformance">
        看部门表现
      </button>
      <button class="performance-btn" @click="viewEmployeePerformance">
        看员工表现
      </button>
    </div>

    <!-- 高级筛选弹窗 -->
    <div v-if="showAdvancedFilter" class="filter-overlay" @click="closeAdvancedFilter">
      <div class="filter-modal" @click.stop>
        <div class="filter-header">
          <h3 class="filter-title">高级筛选</h3>
          <button class="filter-close" @click="closeAdvancedFilter">×</button>
        </div>
        
        <div class="filter-content">
          <div class="filter-group">
            <label class="filter-group-label">部门</label>
            <select v-model="advancedFilters.department" class="filter-select">
              <option value="">全部部门</option>
              <option value="sales">销售部</option>
              <option value="marketing">市场部</option>
              <option value="operations">运营部</option>
              <option value="finance">财务部</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-group-label">目标进度状态</label>
            <select v-model="advancedFilters.progressStatus" class="filter-select">
              <option value="">全部状态</option>
              <option value="not-started">未开始</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="overdue">已逾期</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-group-label">目标指标</label>
            <select v-model="advancedFilters.metric" class="filter-select">
              <option value="">全部指标</option>
              <option value="order-amount">订单金额</option>
              <option value="sales-amount">销售金额</option>
              <option value="sales-quantity">销售数量</option>
              <option value="customer-count">客户数量</option>
              <option value="market-share">市场占有率</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-group-label">排序方式</label>
            <select v-model="advancedFilters.sortBy" class="filter-select">
              <option value="completion-rate-asc">按完成率升序</option>
              <option value="completion-rate-desc">按完成率降序</option>
              <option value="target-amount-asc">按目标金额升序</option>
              <option value="target-amount-desc">按目标金额降序</option>
              <option value="deadline-asc">按截止日期升序</option>
              <option value="deadline-desc">按截止日期降序</option>
            </select>
          </div>
        </div>
        
        <div class="filter-footer">
          <button class="filter-reset-btn" @click="resetAdvancedFilters">重置</button>
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
              placeholder="搜索目标..." 
              class="search-input"
            >
          </div>
          
          <div class="goal-options">
            <div 
              v-for="option in filteredGoalOptions" 
              :key="option.id"
              class="goal-option"
              @click="selectGoalOption(option)"
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
              <div class="option-radio">
                <input 
                  type="radio" 
                  :value="option.id" 
                  v-model="selectedGoalOption" 
                  :id="`goal-${option.id}`"
                >
                <label :for="`goal-${option.id}`"></label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="selector-footer">
          <button class="selector-cancel-btn" @click="closeGoalSelector">取消</button>
          <button class="selector-confirm-btn" @click="confirmGoalSelection">确定</button>
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
      goalSearchQuery: '',
      selectedGoalOption: null,
      
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
        { id: 'all', name: '全部' },
        { id: 'business', name: '业务目标' },
        { id: 'brand', name: '品牌目标' },
        { id: 'product', name: '商品目标' }
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
        'completed': '已完成',
        'overdue': '已逾期'
      }
      return this.statusFilter ? statusMap[this.statusFilter] : '全部状态'
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
    
    // 应用高级筛选
    applyAdvancedFilters() {
      this.showAdvancedFilter = false
      console.log('应用高级筛选条件:', this.advancedFilters)
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
    },
    
    // 选择目标选项
    selectGoalOption(option) {
      this.selectedGoalOption = option.id
    },
    
    // 确认目标选择
    confirmGoalSelection() {
      if (this.selectedGoalOption) {
        const selected = this.goalOptions.find(opt => opt.id === this.selectedGoalOption)
        console.log('确认选择目标:', selected.name)
        this.closeGoalSelector()
      } else {
        alert('请选择一个目标')
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
  transition: background-color 0.2s;
  white-space: nowrap;
}

.filter-section .advanced-filter-btn:hover {
  background-color: #0056d6;
}

/* 标签切换栏 */
.tab-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.tab-container {
  display: flex;
  padding: 0 16px;
  overflow-x: auto;
}

.tab-btn {
  background: none;
  border: none;
  padding: 14px 20px;
  color: #666666;
  font-size: 15px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  min-width: fit-content;
}

.tab-btn.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
  font-weight: 600;
}

.tab-btn:hover {
  color: #007AFF;
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

.performance-btn {
  flex: 1;
  background-color: #007AFF;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.performance-btn:hover {
  background-color: #0056d6;
}

.performance-btn:first-child {
  background-color: #34C759;
}

.performance-btn:first-child:hover {
  background-color: #28a745;
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
  align-items: center;
  justify-content: center;
  padding: 20px;
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
  gap: 12px;
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
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
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
  
  .bottom-actions {
    flex-direction: column;
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
  
  .bottom-actions {
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
