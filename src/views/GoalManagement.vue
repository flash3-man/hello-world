<template>
  <div class="goal-management">
    <!-- 顶部标签页 -->
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

    <!-- 筛选区 -->
    <div class="filter-section">
      <div class="filter-header">
        <h1 class="page-title">{{ getCurrentTabName() }}</h1>
        <button class="filter-btn" @click="toggleFilter">筛选 ▽</button>
      </div>
      
      <!-- 筛选面板 -->
      <div v-if="showFilter" class="filter-panel">
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">目标名称</label>
            <input 
              type="text" 
              v-model="filterGoalName" 
              class="filter-input"
              placeholder="请输入目标名称"
            >
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">状态</label>
            <select v-model="filterStatus" class="filter-select">
              <option value="">全部状态</option>
              <option value="progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="overdue">已逾期</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">部门</label>
            <select v-model="filterDepartment" class="filter-select">
              <option value="">全部部门</option>
              <option value="sales">销售部</option>
              <option value="marketing">市场部</option>
              <option value="operations">运营部</option>
            </select>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">目标进展</label>
            <select v-model="filterProgress" class="filter-select">
              <option value="">全部进展</option>
              <option value="ahead">超前</option>
              <option value="ontrack">正常</option>
              <option value="behind">滞后</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">排序方式</label>
            <select v-model="sortOrder" class="filter-select">
              <option value="name">按名称</option>
              <option value="progress">按进度</option>
              <option value="deadline">按截止日期</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="confirm-btn" @click="applyFilters">确定</button>
        </div>
      </div>
    </div>

    <!-- 目标列表区 -->
    <div class="goals-list-section">
      <div class="goals-container">
        <div 
          v-for="goal in filteredGoals" 
          :key="goal.id"
          class="goal-card"
          @click="viewGoalDetail(goal.id)"
        >
          <div class="goal-header">
            <div class="goal-info">
              <span class="goal-name">{{ goal.name }}</span>
              <span class="goal-period">{{ goal.period }}</span>
            </div>
            <div class="goal-status" :class="goal.statusClass">
              {{ goal.statusText }}
            </div>
          </div>
          
          <div class="goal-metrics">
            <div class="metric-row">
              <span class="metric-label">目标 ({{ goal.unit }})</span>
              <span class="metric-value">{{ goal.target }}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">已完成 ({{ goal.unit }})</span>
              <span class="metric-value">{{ goal.completed }}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">差额 ({{ goal.unit }})</span>
              <span 
                class="metric-value" 
                :class="goal.differenceClass"
              >
                {{ goal.difference }}
              </span>
            </div>
          </div>
          
          <div class="goal-progress">
            <div class="progress-info">
              <span class="progress-label">完成率</span>
              <span 
                class="progress-rate" 
                :class="goal.progressClass"
              >
                {{ goal.completionRate }}
              </span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :class="goal.progressClass"
                :style="{ width: goal.progressWidth }"
              ></div>
            </div>
          </div>
          
          <div class="goal-footer">
            <div class="goal-notes">
              <span 
                v-if="goal.isUndecomposed" 
                class="note-text warning"
              >
                * 该目标未拆解
              </span>
              <span 
                v-if="goal.canModify" 
                class="action-link"
              >
                修改目标 >
              </span>
            </div>
            <div class="goal-actions">
              <span 
                class="action-btn" 
                @click.stop="viewDepartmentPerformance(goal.id)"
              >
                看部门表现
              </span>
              <span 
                class="action-btn" 
                @click.stop="viewEmployeePerformance(goal.id)"
              >
                看员工表现
              </span>
            </div>
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
  name: 'GoalManagement',
  data() {
    return {
      selectedTab: 'business',
      showFilter: false,
      filterGoalName: '',
      filterStatus: '',
      filterDepartment: '',
      filterProgress: '',
      sortOrder: 'name',
      tabs: [
        { id: 'business', name: '业务目标' },
        { id: 'brand', name: '品牌目标' },
        { id: 'product', name: '商品目标' }
      ],
      goals: [
        {
          id: 1,
          type: 'business',
          name: '五月目标配置',
          period: '2025-01-01~2025-12-31',
          target: '60,000.00万',
          completed: '960,003.98',
          difference: '59,904.00万',
          completionRate: '0.16%',
          unit: '元',
          status: 'behind',
          statusText: '进行中',
          statusClass: 'status-progress',
          differenceClass: 'negative',
          progressClass: 'progress-low',
          progressWidth: '0.16%',
          isUndecomposed: true,
          canModify: false
        },
        {
          id: 2,
          type: 'business',
          name: '年度销售目标',
          period: '2025-01-01~2025-12-31',
          target: '2000.00',
          completed: '27467.13',
          difference: '超额完成',
          completionRate: '1373.36%',
          unit: '元',
          status: 'ahead',
          statusText: '超额完成',
          statusClass: 'status-success',
          differenceClass: 'positive',
          progressClass: 'progress-high',
          progressWidth: '100%',
          isUndecomposed: false,
          canModify: true
        },
        {
          id: 3,
          type: 'business',
          name: '客户开发目标',
          period: '2025-01-01~2025-12-31',
          target: '100',
          completed: '75',
          difference: '25',
          completionRate: '75.00%',
          unit: '个',
          status: 'ontrack',
          statusText: '进行中',
          statusClass: 'status-progress',
          differenceClass: 'negative',
          progressClass: 'progress-normal',
          progressWidth: '75%',
          isUndecomposed: false,
          canModify: true
        },
        {
          id: 4,
          type: 'brand',
          name: 'A品牌推广目标',
          period: '2025-01-01~2025-12-31',
          target: '50000.00',
          completed: '32000.00',
          difference: '18000.00',
          completionRate: '64.00%',
          unit: '元',
          status: 'ontrack',
          statusText: '进行中',
          statusClass: 'status-progress',
          differenceClass: 'negative',
          progressClass: 'progress-normal',
          progressWidth: '64%',
          isUndecomposed: false,
          canModify: true
        }
      ]
    }
  },
  computed: {
    filteredGoals() {
      let filtered = this.goals.filter(goal => goal.type === this.selectedTab)
      
      if (this.filterGoalName) {
        filtered = filtered.filter(goal => 
          goal.name.toLowerCase().includes(this.filterGoalName.toLowerCase())
        )
      }
      
      if (this.filterStatus) {
        filtered = filtered.filter(goal => goal.status === this.filterStatus)
      }
      
      return filtered
    }
  },
  methods: {
    selectTab(tabId) {
      this.selectedTab = tabId
    },
    getCurrentTabName() {
      const tab = this.tabs.find(t => t.id === this.selectedTab)
      return tab ? tab.name : '业务目标'
    },
    toggleFilter() {
      this.showFilter = !this.showFilter
    },
    resetFilters() {
      this.filterGoalName = ''
      this.filterStatus = ''
      this.filterDepartment = ''
      this.filterProgress = ''
      this.sortOrder = 'name'
    },
    applyFilters() {
      this.showFilter = false
      console.log('应用筛选条件')
    },
    viewGoalDetail(goalId) {
      console.log('查看目标详情:', goalId)
    },
    viewDepartmentPerformance(goalId) {
      console.log('查看部门表现:', goalId)
    },
    viewEmployeePerformance(goalId) {
      console.log('查看员工表现:', goalId)
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.goal-management {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部标签页 */
.tab-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eeeeee;
}

.tab-container {
  display: flex;
  padding: 0 16px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 16px 20px;
  color: #666666;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #1677ff;
  border-bottom-color: #1677ff;
  font-weight: bold;
}

/* 筛选区 */
.filter-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eeeeee;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.page-title {
  color: #111111;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.filter-btn {
  background: none;
  border: none;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
}

.filter-panel {
  padding: 16px;
  border-top: 1px solid #eeeeee;
}

.filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #ffffff;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #1677ff;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eeeeee;
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
  border: 1px solid #eeeeee;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.goal-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.goal-name {
  color: #666666;
  font-size: 16px;
  font-weight: 500;
}

.goal-period {
  color: #666666;
  font-size: 12px;
}

.goal-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-progress {
  background-color: #fff7e6;
  color: #ffaa00;
}

.status-success {
  background-color: #e6f7f0;
  color: #00b42a;
}

.goal-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metric-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  color: #666666;
  font-size: 12px;
}

.metric-value {
  color: #111111;
  font-size: 14px;
  font-weight: 500;
}

.metric-value.positive {
  color: #00b42a;
}

.metric-value.negative {
  color: #f53f3f;
}

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
}

.progress-rate {
  font-size: 14px;
  font-weight: bold;
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

.progress-bar {
  height: 6px;
  background-color: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.progress-low {
  background-color: #f53f3f;
}

.progress-fill.progress-normal {
  background-color: #ffaa00;
}

.progress-fill.progress-high {
  background-color: #00b42a;
}

.goal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-notes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-text.warning {
  color: #ff7d00;
  font-size: 12px;
}

.action-link {
  color: #1677ff;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
}

.goal-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  color: #1677ff;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #e0e0e0;
}

.action-btn:hover {
  text-decoration-color: #1677ff;
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
