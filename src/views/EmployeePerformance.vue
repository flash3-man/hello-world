<template>
  <div class="employee-performance">
    <!-- 顶部操作区 -->
    <div class="header-section">
      <div class="header-actions">
        <button class="export-btn" @click="exportData">导出</button>
        <h1 class="page-title">员工业绩汇总表</h1>
        <button class="filter-btn" @click="toggleFilter">
          筛选 ▽
        </button>
      </div>
      <div class="date-range">
        <span class="date-text">{{ currentDateRange }}</span>
        <span class="range-scope">所有</span>
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

    <!-- 数据表格区 -->
    <div class="table-section">
      <table class="data-table">
        <thead>
          <tr class="table-header">
            <th class="header-cell">员工名称</th>
            <th class="header-cell sortable" @click="toggleSort('amount')">
              订单金额 (元)
              <span class="sort-indicator">{{ getSortIndicator('amount') }}</span>
            </th>
            <th class="header-cell sortable" @click="toggleSort('orders')">
              订单单数
              <span class="sort-indicator">{{ getSortIndicator('orders') }}</span>
            </th>
            <th class="header-cell">订单客户数</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(employee, index) in sortedEmployees" 
            :key="employee.id"
            :class="['table-row', { 'odd-row': index % 2 === 1 }]"
          >
            <td class="table-cell">{{ employee.name }}</td>
            <td class="table-cell amount-cell" @click="viewEmployeeDetail(employee.id)">
              {{ employee.amount }}
            </td>
            <td class="table-cell">{{ employee.orders }}</td>
            <td class="table-cell">{{ employee.customers }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">返回首页</button>
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
      currentDateRange: '06-01~06-20',
      sortField: '',
      sortOrder: 'asc',
      quickOptions: [
        { id: 'today', label: '今天 (08-08)' },
        { id: 'current-month', label: '本月 (08-01~08-08)' },
        { id: 'last-month', label: '上月 (2025-07)' },
        { id: 'last-90-days', label: '近90天 (05-10~08-08)' }
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
      employees: [
        {
          id: 1,
          name: '王鹏',
          amount: '14,145.12',
          orders: 12,
          customers: 9
        },
        {
          id: 2,
          name: '李明',
          amount: '23,580.45',
          orders: 18,
          customers: 15
        },
        {
          id: 3,
          name: '张伟',
          amount: '8,920.33',
          orders: 7,
          customers: 6
        },
        {
          id: 4,
          name: '赵丽',
          amount: '31,250.88',
          orders: 22,
          customers: 18
        },
        {
          id: 5,
          name: '陈静',
          amount: '16,730.66',
          orders: 14,
          customers: 12
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
    }
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter
    },
    exportData() {
      alert('导出功能已触发')
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
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.employee-performance {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部操作区 */
.header-section {
  background-color: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #eeeeee;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.export-btn {
  background: none;
  border: none;
  color: #1677ff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
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
