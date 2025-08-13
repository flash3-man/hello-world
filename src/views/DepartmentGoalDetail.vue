<template>
  <div class="department-goal-detail">
    <!-- 重新设计的目标概览区 -->
    <div class="goal-overview-section">
      <!-- 页面标题 -->
      <div class="page-title">部门目标明细</div>

      <!-- 目标名称 -->
      <div class="goal-name">{{ goalInfo.targetAmount }}</div>

      <!-- 业务目标和销售金额 -->
      <div class="goal-type-row">
        <span class="goal-type">业务目标</span>
        <span class="goal-separator">|</span>
        <span class="goal-category">销售金额</span>
      </div>

      <!-- 状态和日期 -->
      <div class="status-date-row">
        <span class="goal-status" :class="goalInfo.statusClass">{{ goalInfo.statusText }}</span>
        <span class="goal-separator">|</span>
        <span class="goal-date">{{ goalInfo.startDate }} ~ {{ goalInfo.endDate }}</span>
      </div>

      <!-- 核心数据组 -->
      <div class="core-data-group">
        <div class="data-item">
          <span class="data-label">目标(元)：</span>
          <span class="data-value">{{ formatAmount(goalInfo.target) }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">已完成(元)：</span>
          <span class="data-value">{{ formatAmount(goalInfo.completed) }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">差额：</span>
          <span class="data-value">{{ goalInfo.difference }}</span>
        </div>
      </div>

      <!-- 完成率进度条 -->
      <div class="progress-section">
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: Math.min(goalInfo.completionRate, 100) + '%' }"
            ></div>
          </div>
          <div class="progress-text">{{ goalInfo.completionRate }}%</div>
        </div>
      </div>
    </div>

    <!-- 模块2：时间进度与筛选区 -->
    <div class="time-filter-section">
      <div class="time-progress">
        <span class="progress-label">时间进度：</span>
        <span class="progress-value">{{ timeProgress }}%</span>
      </div>

      <div class="filter-controls">
        <button
          class="filter-btn"
          @click="openFilterModal"
        >
          <span class="filter-icon">🔍</span>
          <span class="filter-text">筛选</span>
        </button>
      </div>
    </div>

    <!-- 模块3：部门明细列表区 -->
    <div class="department-list-section">
      <!-- 表头 -->
      <div class="list-header">
        <div class="header-cell department-name">部门名称</div>
        <div class="header-cell sortable" @click="sortBy('completionRate')">
          完成率
          <span class="sort-icon" v-if="sortField === 'completionRate'">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell sortable" @click="sortBy('target')">
          目标(元)
          <span class="sort-icon" v-if="sortField === 'target'">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell sortable" @click="sortBy('completed')">
          已完成(元)
          <span class="sort-icon" v-if="sortField === 'completed'">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell sortable" @click="sortBy('difference')">
          差额(元)
          <span class="sort-icon" v-if="sortField === 'difference'">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell actions">操作</div>
      </div>
      
      <!-- 部门数据列表 -->
      <div class="department-list">
        <div
          v-for="dept in filteredAndSortedDepartments"
          :key="dept.id"
          class="department-item"
          @click="viewDepartmentDetail(dept.id)"
        >
          <div class="cell department-name">
            <div class="dept-info">
              <span class="dept-name">{{ dept.name }}</span>
              <div class="dept-trend" v-if="dept.trend">
                <span class="trend-icon" :class="dept.trend.direction">
                  {{ dept.trend.direction === 'up' ? '📈' : dept.trend.direction === 'down' ? '📉' : '➡️' }}
                </span>
              </div>
            </div>
          </div>

          <div class="cell">
            <span class="completion-rate" :class="getCompletionClass(dept.completionRate)">
              {{ dept.completionRate }}%
            </span>
          </div>

          <div class="cell">
            <span class="target-amount">{{ formatAmount(dept.target) }}</span>
          </div>

          <div class="cell">
            <span class="completed-amount">{{ formatAmount(dept.completed) }}</span>
          </div>

          <div class="cell">
            <span class="difference" :class="dept.status">{{ dept.differenceText }}</span>
          </div>

          <div class="cell actions">
            <button
              class="view-employees-btn"
              @click.stop="viewDepartmentEmployees(dept.id)"
            >
              查看员工
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块4：合计与底部操作区 -->
    <div class="summary-actions-section">
      <div class="summary-data">
        <div class="summary-label">合计：</div>
        <div class="summary-content" v-if="currentView === 'completion'">
          <span>完成率 {{ goalInfo.completionRate }}%</span>
          <span>目标 {{ formatAmount(goalInfo.target) }} 元</span>
          <span>已完成 {{ formatAmount(goalInfo.completed) }} 元</span>
        </div>
        <div class="summary-content" v-if="currentView === 'contribution'">
          <span>已完成 {{ formatAmount(goalInfo.completed) }} 元</span>
          <span>差额 {{ goalInfo.difference }}</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="export-btn" @click="exportData">
          <span class="export-icon">📥</span>
          <span class="export-text">导出Excel</span>
        </button>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <div v-if="showFilterModal" class="modal-overlay" @click="closeFilterModal">
      <div class="filter-modal" @click.stop>
        <div class="modal-header">
          <h3>筛选条件</h3>
          <button class="modal-close" @click="closeFilterModal">×</button>
        </div>
        <div class="modal-content">
          <!-- 基础筛选层 -->
          <div v-if="filterStep === 'basic'" class="filter-basic">
            <div class="filter-item">
              <label class="filter-label">部门</label>
              <button class="filter-selector" @click="openDepartmentSelector">
                <span v-if="selectedDepartments.length === 0">请选择部门</span>
                <span v-else-if="selectedDepartments.length === 1">{{ selectedDepartments[0].name }}</span>
                <span v-else>已选择 {{ selectedDepartments.length }} 个部门</span>
                <span class="selector-arrow">></span>
              </button>
            </div>

            <div class="filter-item">
              <label class="filter-label">目标进展状态</label>
              <button class="filter-selector" @click="openStatusSelector">
                <span>{{ selectedStatus.name }}</span>
                <span class="selector-arrow">></span>
              </button>
            </div>

            <div class="time-progress-info">
              <span class="time-label">时间进度：{{ timeProgress }}%</span>
            </div>

            <div class="filter-actions">
              <button class="btn-reset" @click="resetFilters">重置</button>
              <button class="btn-confirm" @click="applyFilters">确定</button>
            </div>
          </div>

          <!-- 部门选择层 -->
          <div v-if="filterStep === 'department'" class="filter-department">
            <div class="search-box">
              <input
                type="text"
                v-model="departmentSearchKeyword"
                placeholder="搜索部门名称"
                class="search-input"
              >
            </div>

            <div class="department-options">
              <div
                v-for="dept in filteredDepartmentOptions"
                :key="dept.id"
                class="department-option"
                :class="{ selected: isDepartmentSelected(dept.id) }"
                @click="toggleDepartmentSelection(dept)"
              >
                <span class="option-checkbox">
                  {{ isDepartmentSelected(dept.id) ? '☑️' : '☐' }}
                </span>
                <span class="option-name">{{ dept.name }}</span>
                <span class="option-info">({{ dept.employeeCount }}人)</span>
              </div>
            </div>

            <div class="filter-actions">
              <button class="btn-reset" @click="clearDepartmentSelection">清除</button>
              <button class="btn-confirm" @click="confirmDepartmentSelection">确定</button>
            </div>
          </div>

          <!-- 状态选择层 -->
          <div v-if="filterStep === 'status'" class="filter-status">
            <div class="status-options">
              <div
                v-for="status in statusOptions"
                :key="status.value"
                class="status-option"
                :class="{ selected: selectedStatus.value === status.value }"
                @click="selectStatus(status)"
              >
                <span class="option-radio">
                  {{ selectedStatus.value === status.value ? '🔘' : '⚪' }}
                </span>
                <div class="option-content">
                  <span class="option-name">{{ status.name }}</span>
                  <span class="option-desc">{{ status.description }}</span>
                </div>
              </div>
            </div>

            <div class="filter-actions">
              <button class="btn-reset" @click="resetStatusSelection">清除</button>
              <button class="btn-confirm" @click="confirmStatusSelection">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 部门详情弹窗 -->
    <div v-if="showDepartmentModal" class="modal-overlay" @click="closeDepartmentModal">
      <div class="department-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDepartment?.name }} - 详细信息</h3>
          <button class="modal-close" @click="closeDepartmentModal">×</button>
        </div>
        <div class="modal-content">
          <div class="dept-detail-info">
            <div class="info-item">
              <span class="info-label">部门负责人：</span>
              <span class="info-value">{{ selectedDepartment?.manager }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">员工人数：</span>
              <span class="info-value">{{ selectedDepartment?.employeeCount }}人</span>
            </div>
            <div class="info-item">
              <span class="info-label">目标分配：</span>
              <span class="info-value">{{ formatAmount(selectedDepartment?.target) }}元</span>
            </div>
            <div class="info-item">
              <span class="info-label">实际完成：</span>
              <span class="info-value">{{ formatAmount(selectedDepartment?.completed) }}元</span>
            </div>
            <div class="info-item">
              <span class="info-label">完成率：</span>
              <span class="info-value" :class="getCompletionClass(selectedDepartment?.completionRate)">
                {{ selectedDepartment?.completionRate }}%
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-primary" @click="viewDepartmentEmployees(selectedDepartment?.id)">
              查看员工明细
            </button>
            <button class="btn-secondary" @click="analyzeDepartmentTrend(selectedDepartment?.id)">
              分析趋势
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DepartmentGoalDetail',
  data() {
    return {
      // 排序相关
      sortField: 'completionRate',
      sortOrder: 'desc', // 'asc' 或 'desc'

      // 弹窗控制
      showDepartmentModal: false,
      showFilterModal: false,
      selectedDepartment: null,

      // 筛选相关
      filterStep: 'basic', // 'basic', 'department', 'status'
      selectedDepartments: [],
      selectedStatus: { value: 'all', name: '全部', description: '显示所有部门' },
      departmentSearchKeyword: '',

      // 目标基础信息
      goalInfo: {
        targetAmount: '20000',
        target: 2000.00,
        completed: 40423.13,
        difference: '超额完成',
        differenceValue: 38423.13,
        completionRate: 2021.16,
        status: 'exceeded',
        statusText: '进行中',
        statusClass: 'in-progress',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      },

      // 时间进度
      timeProgress: 61.10,

      // 状态选项
      statusOptions: [
        { value: 'all', name: '全部', description: '不筛选进度，显示所有部门' },
        { value: 'slow', name: '进展缓慢', description: '完成率显著低于时间进度' },
        { value: 'normal', name: '进展正常', description: '完成率匹配或超过时间进度' }
      ],
      
      // 部门数据
      departments: [
        {
          id: 1,
          name: '超悦数据渠道部',
          manager: '张经理',
          employeeCount: 5,
          target: 1500.00,
          completed: 40223.13,
          completionRate: 2681.54,
          contributionRate: 99.5,
          difference: 38723.13,
          differenceText: '超额完成',
          status: 'exceeded',
          progressStatus: 'normal',
          trend: {
            direction: 'up',
            value: 15.8
          }
        },
        {
          id: 2,
          name: '财务部',
          manager: '李经理',
          employeeCount: 3,
          target: 500.00,
          completed: 200.00,
          completionRate: 40.0,
          contributionRate: 0.5,
          difference: -300.00,
          differenceText: '-300.00',
          status: 'behind',
          progressStatus: 'slow',
          trend: {
            direction: 'down',
            value: -5.2
          }
        },
        {
          id: 3,
          name: '市场部',
          manager: '王经理',
          employeeCount: 4,
          target: 0.00,
          completed: 0.00,
          completionRate: 0.0,
          contributionRate: 0.0,
          difference: 0,
          differenceText: '未分配',
          status: 'not-assigned',
          progressStatus: 'slow',
          trend: {
            direction: 'stable',
            value: 0
          }
        },
        {
          id: 4,
          name: '销售部',
          manager: '赵经理',
          employeeCount: 8,
          target: 800.00,
          completed: 950.00,
          completionRate: 118.75,
          contributionRate: 2.4,
          difference: 150.00,
          differenceText: '超额完成',
          status: 'exceeded',
          progressStatus: 'normal',
          trend: {
            direction: 'up',
            value: 8.3
          }
        },
        {
          id: 5,
          name: '技术部',
          manager: '孙经理',
          employeeCount: 6,
          target: 300.00,
          completed: 180.00,
          completionRate: 60.0,
          contributionRate: 0.4,
          difference: -120.00,
          differenceText: '-120.00',
          status: 'behind',
          progressStatus: 'slow',
          trend: {
            direction: 'stable',
            value: 0.5
          }
        }
      ]
    }
  },
  
  computed: {
    // 筛选后的部门选项
    filteredDepartmentOptions() {
      if (!this.departmentSearchKeyword) {
        return this.departments
      }
      return this.departments.filter(dept =>
        dept.name.toLowerCase().includes(this.departmentSearchKeyword.toLowerCase())
      )
    },

    // 筛选和排序后的部门列表
    filteredAndSortedDepartments() {
      let filtered = [...this.departments]

      // 应用部门筛选
      if (this.selectedDepartments.length > 0) {
        const selectedIds = this.selectedDepartments.map(d => d.id)
        filtered = filtered.filter(dept => selectedIds.includes(dept.id))
      }

      // 应用状态筛选
      if (this.selectedStatus.value !== 'all') {
        filtered = filtered.filter(dept => dept.progressStatus === this.selectedStatus.value)
      }

      // 应用排序
      return this.sortDepartments(filtered)
    }
  },
  
  methods: {
    // 排序功能
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'desc'
      }
    },

    // 排序部门列表
    sortDepartments(departments) {
      return departments.sort((a, b) => {
        let aValue = a[this.sortField]
        let bValue = b[this.sortField]

        // 处理差额字段的特殊情况
        if (this.sortField === 'difference') {
          aValue = typeof a.difference === 'number' ? a.difference : 0
          bValue = typeof b.difference === 'number' ? b.difference : 0
        }

        if (this.sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      })
    },

    // 格式化金额
    formatAmount(amount) {
      if (amount === null || amount === undefined) return '0.00'
      return parseFloat(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    // 获取完成率样式类
    getCompletionClass(rate) {
      if (rate >= 100) return 'exceeded'
      if (rate >= 80) return 'good'
      if (rate >= 60) return 'warning'
      return 'behind'
    },
    
    // === 筛选功能 ===
    openFilterModal() {
      this.showFilterModal = true
      this.filterStep = 'basic'
    },

    closeFilterModal() {
      this.showFilterModal = false
      this.filterStep = 'basic'
    },

    openDepartmentSelector() {
      this.filterStep = 'department'
    },

    openStatusSelector() {
      this.filterStep = 'status'
    },

    // 部门选择相关
    isDepartmentSelected(deptId) {
      return this.selectedDepartments.some(d => d.id === deptId)
    },

    toggleDepartmentSelection(dept) {
      const index = this.selectedDepartments.findIndex(d => d.id === dept.id)
      if (index > -1) {
        this.selectedDepartments.splice(index, 1)
      } else {
        this.selectedDepartments.push(dept)
      }
    },

    clearDepartmentSelection() {
      this.selectedDepartments = []
    },

    confirmDepartmentSelection() {
      this.filterStep = 'basic'
    },

    // 状态选择相关
    selectStatus(status) {
      this.selectedStatus = status
    },

    resetStatusSelection() {
      this.selectedStatus = this.statusOptions[0] // 全部
    },

    confirmStatusSelection() {
      this.filterStep = 'basic'
    },

    // 重置和应用筛选
    resetFilters() {
      this.selectedDepartments = []
      this.selectedStatus = this.statusOptions[0]
      this.departmentSearchKeyword = ''
    },

    applyFilters() {
      this.closeFilterModal()
    },

    // 查看部门详情
    viewDepartmentDetail(deptId) {
      this.selectedDepartment = this.departments.find(d => d.id === deptId)
      this.showDepartmentModal = true
    },

    // 关闭部门详情弹窗
    closeDepartmentModal() {
      this.showDepartmentModal = false
      this.selectedDepartment = null
    },
    
    // 查看部门员工
    viewDepartmentEmployees(deptId) {
      this.closeDepartmentModal()
      this.$router.push(`/department-employees/${deptId}`)
    },
    
    // 分析部门趋势
    analyzeDepartmentTrend(deptId) {
      this.closeDepartmentModal()
      this.$router.push(`/department-trend/${deptId}`)
    },
    
    // 导出数据
    exportData() {
      // 模拟导出功能
      const data = {
        goalInfo: this.goalInfo,
        departments: this.departments,
        exportTime: new Date().toISOString()
      }
      
      console.log('导出数据:', data)
      alert('数据导出功能开发中...')
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    }
  },
  
  mounted() {
    // 从路由参数获取目标ID
    const goalId = this.$route.params.goalId
    if (goalId) {
      // 根据goalId加载对应的目标数据
      console.log('加载目标ID:', goalId)
    }
  }
}
</script>

<style scoped>
/* === 页面整体布局 === */
.department-goal-detail {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 20px;
}

/* === 重新设计的目标概览区 === */
.goal-overview-section {
  background: white;
  padding: 20px 16px;
  border-bottom: 1px solid #e9ecef;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 12px;
}

.goal-name {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: left;
  margin-bottom: 8px;
}

.goal-type-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.goal-type {
  font-size: 14px;
  color: #333333;
}

.goal-separator {
  font-size: 14px;
  color: #999999;
}

.goal-category {
  font-size: 14px;
  color: #333333;
}

.status-date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.goal-status {
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
}

.goal-status.in-progress {
  background: #e6f7ff;
  color: #1677ff;
}

.goal-status.completed {
  background: #f6ffed;
  color: #52c41a;
}

.goal-status.overdue {
  background: #fff2f0;
  color: #ff4d4f;
}

.goal-date {
  font-size: 14px;
  color: #666666;
}

.core-data-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 16px;
}

.data-item {
  flex: 1;
  text-align: center;
}

.data-label {
  font-size: 14px;
  color: #666666;
}

.data-value {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

.progress-section {
  margin-top: 12px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #FF9900;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #FF9900;
  min-width: 80px;
  text-align: right;
}

/* === 模块2：时间进度与筛选区 === */
.time-filter-section {
  background: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  height: 44px;
}

.time-progress {
  display: flex;
  align-items: center;
  gap: 4px;
}

.progress-label {
  font-size: 14px;
  color: #666666;
}

.progress-value {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.filter-controls {
  display: flex;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #4A90E2;
  border-radius: 6px;
  background: white;
  color: #4A90E2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #4A90E2;
  color: white;
}

.filter-icon {
  font-size: 14px;
}

.filter-text {
  font-size: 14px;
}

/* === 模块3：部门明细列表区 === */
.department-list-section {
  background: white;
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.list-header {
  display: grid;
  grid-template-columns: 20% 16% 16% 16% 16% 16%;
  background: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-cell {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.header-cell.department-name {
  justify-content: flex-start;
}

.header-cell.actions {
  justify-content: center;
}

.header-cell.sortable {
  cursor: pointer;
  transition: color 0.3s ease;
}

.header-cell.sortable:hover {
  color: #4A90E2;
}

.sort-icon {
  font-size: 12px;
  color: #4A90E2;
}

.department-list {
  max-height: 400px;
  overflow-y: auto;
}

.department-item {
  display: grid;
  grid-template-columns: 20% 16% 16% 16% 16% 16%;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.department-item:hover {
  background: #f8f9fa;
}

.department-item:last-child {
  border-bottom: none;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.cell.department-name {
  justify-content: flex-start;
}

.cell.actions {
  justify-content: center;
}

.dept-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dept-name {
  color: #333333;
  font-weight: 500;
}

.dept-trend {
  display: flex;
  align-items: center;
}

.trend-icon {
  font-size: 12px;
}

.trend-icon.up {
  color: #52c41a;
}

.trend-icon.down {
  color: #ff4d4f;
}

.trend-icon.stable {
  color: #999999;
}

.completion-rate.exceeded {
  color: #FF9900;
  font-weight: bold;
}

.completion-rate.good {
  color: #52c41a;
  font-weight: bold;
}

.completion-rate.warning {
  color: #faad14;
  font-weight: bold;
}

.completion-rate.behind {
  color: #ff4d4f;
  font-weight: bold;
}

.target-amount {
  color: #333333;
}

.completed-amount {
  color: #333333;
  font-weight: 500;
}

.contribution-rate {
  font-size: 12px;
  color: #999999;
  margin-top: 2px;
}

.difference.exceeded {
  color: #52c41a;
  font-weight: bold;
}

.difference.behind {
  color: #ff4d4f;
  font-weight: bold;
}

.difference.not-assigned {
  color: #999999;
}

.view-employees-btn {
  background: none;
  border: 1px solid #4A90E2;
  color: #4A90E2;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.view-employees-btn:hover {
  background: #4A90E2;
  color: white;
}

/* === 模块4：合计与底部操作区 === */
.summary-actions-section {
  background: white;
  margin: 0 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.summary-data {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.summary-label {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}

.summary-content {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666666;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-btn:hover {
  background: #357abd;
}

.export-icon {
  font-size: 14px;
}

.export-text {
  font-size: 14px;
}

/* === 筛选弹窗样式 === */
.filter-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.filter-basic {
  padding: 20px;
}

.filter-item {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.filter-selector {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.3s ease;
}

.filter-selector:hover {
  border-color: #4A90E2;
}

.selector-arrow {
  color: #999999;
  font-size: 12px;
}

.time-progress-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.time-label {
  font-size: 14px;
  color: #666666;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-reset {
  background: white;
  color: #666666;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  border-color: #999999;
  color: #333333;
}

.btn-confirm {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-confirm:hover {
  background: #357abd;
}

/* 部门选择层 */
.filter-department {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
}

.department-options {
  max-height: 300px;
  overflow-y: auto;
}

.department-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.department-option:hover {
  background: #f8f9fa;
}

.department-option.selected {
  background: #e6f7ff;
}

.option-checkbox {
  font-size: 16px;
}

.option-name {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.option-info {
  font-size: 12px;
  color: #999999;
}

/* 状态选择层 */
.filter-status {
  padding: 20px;
}

.status-options {
  margin-bottom: 20px;
}

.status-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 8px;
}

.status-option:hover {
  background: #f8f9fa;
}

.status-option.selected {
  background: #e6f7ff;
}

.option-radio {
  font-size: 16px;
  margin-top: 2px;
}

.option-content {
  flex: 1;
}

.option-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
}

.option-desc {
  display: block;
  font-size: 12px;
  color: #666666;
  line-height: 1.4;
}

/* === 部门详情弹窗 === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.department-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 4px;
}

.modal-content {
  padding: 20px;
}

.dept-detail-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666666;
}

.info-value {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

.info-value.exceeded {
  color: #FF9900;
}

.info-value.good {
  color: #52c41a;
}

.info-value.warning {
  color: #faad14;
}

.info-value.behind {
  color: #ff4d4f;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background: #357abd;
}

.btn-secondary {
  background: white;
  color: #4A90E2;
  border: 1px solid #4A90E2;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #4A90E2;
  color: white;
}

/* === 响应式设计 === */
@media (max-width: 768px) {
  .goal-data-summary {
    flex-direction: column;
    gap: 8px;
  }

  .data-item {
    flex-direction: row;
    justify-content: space-between;
  }

  .analysis-filter-section {
    flex-direction: column;
    gap: 8px;
    height: auto;
    padding: 16px;
  }

  .list-header,
  .department-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .cell {
    justify-content: space-between;
    padding: 4px 0;
  }

  .cell.department-name {
    justify-content: flex-start;
    font-weight: bold;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .summary-actions-section {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .summary-content {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .goal-overview-section {
    padding: 16px 12px;
  }

  .department-list-section,
  .summary-actions-section {
    margin: 8px 12px;
  }

  .filter-controls {
    width: 100%;
    justify-content: space-around;
  }

  .filter-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
