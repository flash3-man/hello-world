<template>
  <div class="employee-profit">
    <!-- 标题栏 -->
    <div class="header-bar">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>

      <!-- 页面标题 -->
      <h1 class="page-title">员工利润变化分析</h1>

      <!-- 导出按钮 -->
      <button class="export-btn" @click="exportData">
        导出
      </button>
    </div>

    <!-- 第二行：日期选择和环比/同比切换 -->
    <div class="filter-row">
      <!-- 左侧：日期选择 -->
      <button class="date-selector" @click="showTimeFilter">
        {{ timeRangeText }}
        <span class="dropdown-icon">▼</span>
      </button>

      <!-- 右侧：环比/同比切换 -->
      <div class="comparison-toggle">
        <button
          class="toggle-btn"
          :class="{ active: comparisonType === 'mom' }"
          @click="switchComparison('mom')"
        >
          看环比
        </button>
        <button
          class="toggle-btn"
          :class="{ active: comparisonType === 'yoy' }"
          @click="switchComparison('yoy')"
        >
          看同比
        </button>
      </div>
    </div>

    <!-- 第三行：增长率筛选 -->
    <div class="growth-filter-row">
      <button class="growth-filter-btn" @click="showGrowthFilter">
        增长率: {{ growthFilterText }}
        <span class="dropdown-icon">▼</span>
      </button>
    </div>

    <!-- 数据列表 -->
    <div class="data-container">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-cell name-cell" @click="toggleSort('name')">
          员工名称
          <span class="sort-icon" :class="{ active: sortBy === 'name' }">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell growth-cell" @click="toggleSort('growth')">
          增长率
          <span class="sort-icon" :class="{ active: sortBy === 'growth' }">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell change-cell" @click="toggleSort('change')">
          变化值(元)
          <span class="sort-icon" :class="{ active: sortBy === 'change' }">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell current-cell" @click="toggleSort('current')">
          本期利润(元)
          <span class="sort-icon" :class="{ active: sortBy === 'current' }">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
        <div class="header-cell previous-cell" @click="toggleSort('previous')">
          {{ previousPeriodLabel }}
          <span class="sort-icon" :class="{ active: sortBy === 'previous' }">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </span>
        </div>
      </div>
      
      <!-- 数据行 -->
      <div class="table-body">
        <div
          v-for="employee in filteredEmployees"
          :key="employee.id"
          class="data-row"
        >
          <div class="data-cell name-cell">
            <span class="employee-name" @click="navigateToEmployeeDetail(employee.id)">
              {{ employee.name }}
            </span>
            <span class="expand-icon" :class="{ expanded: expandedEmployees.includes(employee.id) }" @click="toggleEmployeeDetail(employee.id)">
              ›
            </span>
          </div>
          <div class="data-cell growth-cell">
            <span class="growth-rate" :class="getGrowthClass(employee.growthRate)">
              {{ formatGrowthRate(employee.growthRate) }}
            </span>
          </div>
          <div class="data-cell change-cell">
            <span class="change-value" :class="getChangeClass(employee.changeValue)">
              {{ formatCurrency(employee.changeValue) }}
            </span>
          </div>
          <div class="data-cell current-cell">
            {{ formatCurrency(employee.currentProfit) }}
          </div>
          <div class="data-cell previous-cell">
            {{ formatCurrency(employee.previousProfit) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 横屏看按钮 -->
    <button class="landscape-btn" @click="toggleLandscape">
      横屏看
    </button>

    <!-- 增长率筛选弹窗 -->
    <div v-if="showGrowthModal" class="modal-overlay" @click="hideGrowthFilter">
      <div class="growth-modal" @click.stop>
        <h3 class="modal-title">增长率筛选</h3>
        <div class="filter-options">
          <div 
            v-for="option in growthFilterOptions" 
            :key="option.value"
            class="filter-option"
            @click="selectGrowthFilter(option.value)"
          >
            <span class="option-text">{{ option.label }}</span>
            <span v-if="growthFilter === option.value" class="check-icon">✓</span>
          </div>
        </div>
        <div class="modal-note">
          点击选项即可筛选对应增长率范围的员工
        </div>
      </div>
    </div>

    <!-- 时间筛选弹窗 -->
    <div v-if="showTimeModal" class="modal-overlay" @click="hideTimeFilter">
      <div class="time-modal" @click.stop>
        <!-- 弹窗头部 -->
        <div class="modal-header">
          <button class="cancel-btn" @click="hideTimeFilter">取消</button>
          <div class="selected-time">您已选: {{ selectedTimeRange }}</div>
          <button class="confirm-btn" @click="confirmTimeFilter">确定</button>
        </div>
        
        <!-- 时间选择标签 -->
        <div class="time-tabs">
          <button 
            v-for="tab in timeTabs" 
            :key="tab.key"
            class="time-tab"
            :class="{ active: activeTimeTab === tab.key }"
            @click="switchTimeTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <!-- 快捷选择选项 -->
        <div v-if="activeTimeTab === 'quick'" class="time-options">
          <div 
            v-for="option in quickTimeOptions" 
            :key="option.value"
            class="time-option"
            @click="selectTimeOption(option)"
          >
            <span class="option-text">{{ option.label }}</span>
            <span v-if="tempTimeSelection === option.value" class="check-icon">✓</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeProfit',
  data() {
    return {
      // 筛选状态
      comparisonType: 'yoy', // 'yoy' 同比, 'mom' 环比
      growthFilter: 'all', // 'all', 'flat', 'growth', 'decline'
      timeRange: 'current_month',
      
      // 排序状态
      sortBy: 'growth',
      sortOrder: 'desc',
      
      // 展开状态
      expandedEmployees: [],
      
      // 弹窗状态
      showGrowthModal: false,
      showTimeModal: false,
      activeTimeTab: 'quick',
      tempTimeSelection: 'current_month',
      
      // 筛选选项
      growthFilterOptions: [
        { value: 'all', label: '全部' },
        { value: 'flat', label: '持平' },
        { value: 'growth', label: '增长' },
        { value: 'decline', label: '下降' }
      ],
      
      timeTabs: [
        { key: 'quick', label: '快捷选择' },
        { key: 'daily', label: '按日选择' },
        { key: 'monthly', label: '按月选择' }
      ],
      
      quickTimeOptions: [
        { value: 'today', label: '今天(08-14)', range: '2025-08-14~2025-08-14' },
        { value: 'current_month', label: '本月(08-01~08-14)', range: '2025-08-01~2025-08-14' },
        { value: 'last_month', label: '上月(2025-07)', range: '2025-07-01~2025-07-31' },
        { value: 'last_90_days', label: '近90天(05-17~08-14)', range: '2025-05-17~2025-08-14' },
        { value: 'last_3_months', label: '近3月(2025-06~2025-08)', range: '2025-06-01~2025-08-31' },
        { value: 'last_6_months', label: '近6月(2025-03~2025-08)', range: '2025-03-01~2025-08-31' },
        { value: 'last_12_months', label: '近12月(2024-09~2025-08)', range: '2024-09-01~2025-08-31' }
      ],
      
      // 员工数据
      employees: [
        {
          id: 1,
          name: '张三',
          currentProfit: 125000,
          previousProfit: 98000,
          growthRate: 27.55,
          changeValue: 27000
        },
        {
          id: 2,
          name: '李四',
          currentProfit: 89000,
          previousProfit: 95000,
          growthRate: -6.32,
          changeValue: -6000
        },
        {
          id: 3,
          name: '王五',
          currentProfit: 156000,
          previousProfit: 156000,
          growthRate: 0,
          changeValue: 0
        },
        {
          id: 4,
          name: '赵六',
          currentProfit: 203000,
          previousProfit: 178000,
          growthRate: 14.04,
          changeValue: 25000
        },
        {
          id: 5,
          name: '钱七',
          currentProfit: 78000,
          previousProfit: 92000,
          growthRate: -15.22,
          changeValue: -14000
        },
        {
          id: 6,
          name: '孙八',
          currentProfit: 234000,
          previousProfit: 198000,
          growthRate: 18.18,
          changeValue: 36000
        },
        {
          id: 7,
          name: '周九',
          currentProfit: 145000,
          previousProfit: 145000,
          growthRate: 0,
          changeValue: 0
        },
        {
          id: 8,
          name: '吴十',
          currentProfit: 167000,
          previousProfit: 134000,
          growthRate: 24.63,
          changeValue: 33000
        }
      ]
    }
  },
  
  computed: {
    // 时间范围显示文本
    timeRangeText() {
      const option = this.quickTimeOptions.find(opt => opt.value === this.timeRange)
      return option ? option.range.replace('2025-', '') : '08-01~08-14'
    },
    
    // 增长率筛选显示文本
    growthFilterText() {
      const option = this.growthFilterOptions.find(opt => opt.value === this.growthFilter)
      return option ? option.label : '全部'
    },
    
    // 上期标签
    previousPeriodLabel() {
      return this.comparisonType === 'yoy' ? '同期利润(元)' : '上期利润(元)'
    },
    
    // 选中的时间范围
    selectedTimeRange() {
      const option = this.quickTimeOptions.find(opt => opt.value === this.tempTimeSelection)
      return option ? option.range : '2025-08-01~2025-08-14'
    },
    
    // 筛选后的员工数据
    filteredEmployees() {
      let filtered = [...this.employees]
      
      // 增长率筛选
      if (this.growthFilter !== 'all') {
        filtered = filtered.filter(emp => {
          if (this.growthFilter === 'flat') return emp.growthRate === 0
          if (this.growthFilter === 'growth') return emp.growthRate > 0
          if (this.growthFilter === 'decline') return emp.growthRate < 0
          return true
        })
      }
      
      // 排序
      filtered.sort((a, b) => {
        let valueA, valueB

        switch (this.sortBy) {
          case 'name':
            valueA = a.name
            valueB = b.name
            return this.sortOrder === 'asc'
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA)
          case 'growth':
            valueA = a.growthRate
            valueB = b.growthRate
            break
          case 'change':
            valueA = a.changeValue
            valueB = b.changeValue
            break
          case 'current':
            valueA = a.currentProfit
            valueB = b.currentProfit
            break
          case 'previous':
            valueA = a.previousProfit
            valueB = b.previousProfit
            break
          default:
            return 0
        }

        return this.sortOrder === 'asc'
          ? valueA - valueB
          : valueB - valueA
      })

      return filtered
    }
  },

  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },

    // 切换环比/同比
    switchComparison(type) {
      this.comparisonType = type
      console.log('切换对比类型:', type)
    },

    // 显示增长率筛选弹窗
    showGrowthFilter() {
      this.showGrowthModal = true
    },

    // 隐藏增长率筛选弹窗
    hideGrowthFilter() {
      this.showGrowthModal = false
    },

    // 选择增长率筛选
    selectGrowthFilter(value) {
      this.growthFilter = value
      this.hideGrowthFilter()
      console.log('选择增长率筛选:', value)

      // 更新按钮文本
      const option = this.growthFilterOptions.find(opt => opt.value === value)
      if (option) {
        console.log('更新按钮文本为:', option.label)
      }
    },

    // 显示时间筛选弹窗
    showTimeFilter() {
      this.tempTimeSelection = this.timeRange
      this.showTimeModal = true
    },

    // 隐藏时间筛选弹窗
    hideTimeFilter() {
      this.showTimeModal = false
    },

    // 切换时间标签
    switchTimeTab(tab) {
      this.activeTimeTab = tab
      console.log('切换时间标签:', tab)
    },

    // 选择时间选项
    selectTimeOption(option) {
      this.tempTimeSelection = option.value
      console.log('选择时间选项:', option)
    },

    // 确认时间筛选
    confirmTimeFilter() {
      this.timeRange = this.tempTimeSelection
      this.hideTimeFilter()
      console.log('确认时间筛选:', this.timeRange)
    },

    // 切换排序
    toggleSort(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = field
        this.sortOrder = 'desc'
      }
      console.log('排序:', this.sortBy, this.sortOrder)
    },

    // 导航到员工详情页面
    navigateToEmployeeDetail(employeeId) {
      console.log('跳转到员工详情页面:', employeeId)
      this.$router.push(`/employee-detail-analysis?employeeId=${employeeId}`)
    },

    // 切换员工详情展开
    toggleEmployeeDetail(employeeId) {
      const index = this.expandedEmployees.indexOf(employeeId)
      if (index > -1) {
        this.expandedEmployees.splice(index, 1)
      } else {
        this.expandedEmployees.push(employeeId)
      }
      console.log('展开员工详情:', employeeId)
    },

    // 切换横屏
    toggleLandscape() {
      console.log('切换横屏模式')
      alert('横屏功能开发中')
    },

    // 导出数据
    exportData() {
      console.log('导出数据')
      alert('导出功能开发中')
    },

    // 格式化增长率
    formatGrowthRate(rate) {
      if (rate === 0) return '0%'
      return rate > 0 ? `+${rate.toFixed(2)}%` : `${rate.toFixed(2)}%`
    },

    // 格式化货币
    formatCurrency(amount) {
      return new Intl.NumberFormat('zh-CN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    },

    // 获取增长率样式类
    getGrowthClass(rate) {
      if (rate > 0) return 'growth'
      if (rate < 0) return 'decline'
      return 'flat'
    },

    // 获取变化值样式类
    getChangeClass(value) {
      if (value > 0) return 'positive'
      if (value < 0) return 'negative'
      return 'zero'
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.employee-profit {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

/* 标题栏 - 高度44px */
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* 第二行：日期选择和环比/同比切换 */
.filter-row {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  height: 44px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
  z-index: 999;
}

/* 第三行：增长率筛选 */
.growth-filter-row {
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  height: 44px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
  z-index: 998;
}

/* 返回按钮 */
.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #007AFF;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #f0f8ff;
}

.back-icon {
  font-size: 20px;
}

/* 日期选择器 */
.date-selector {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #333;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.date-selector:hover {
  background: #e9ecef;
  border-color: #007AFF;
}

.dropdown-icon {
  font-size: 12px;
  color: #666;
}

/* 页面标题 - 居中，17px，#333 */
.page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 环比/同比切换 */
.comparison-toggle {
  display: flex;
  gap: 4px;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  color: #007AFF;
  font-weight: 500;
}

/* 增长率筛选按钮 */
.growth-filter-btn {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #333;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.growth-filter-btn:hover {
  background: #e9ecef;
  border-color: #007AFF;
}

/* 导出按钮 - 14px，#007AFF */
.export-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #007AFF;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.export-btn:hover {
  background: #f0f8ff;
}

/* 数据容器 */
.data-container {
  margin-top: 132px; /* 44px * 3 = 132px for three fixed rows */
  background: white;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 表头 - 14px，#666 */
.table-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 12px 0;
}

.header-cell {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  text-align: center;
  padding: 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: color 0.3s ease;
}

.header-cell:hover {
  color: #007AFF;
}

.header-cell.name-cell {
  flex: 2;
  justify-content: flex-start;
  padding-left: 16px;
}

.header-cell.growth-cell,
.header-cell.change-cell,
.header-cell.current-cell,
.header-cell.previous-cell {
  flex: 1.5;
}

/* 排序图标 */
.sort-icon {
  font-size: 12px;
  color: #ccc;
  transition: color 0.3s ease;
}

.sort-icon.active {
  color: #007AFF;
}

/* 数据行 - 高度48px */
.table-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.data-row {
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.data-row:hover {
  background: #f8f9fa;
}

.data-row:last-child {
  border-bottom: none;
}

.data-cell {
  font-size: 14px;
  color: #333;
  text-align: center;
  padding: 0 8px;
}

.data-cell.name-cell {
  flex: 2;
  text-align: left;
  padding-left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.data-cell.growth-cell,
.data-cell.change-cell,
.data-cell.current-cell,
.data-cell.previous-cell {
  flex: 1.5;
}

/* 员工名称 */
.employee-name {
  font-weight: 500;
  color: #007AFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.employee-name:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* 展开图标 */
.expand-icon {
  font-size: 16px;
  color: #ccc;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

/* 增长率颜色 - 增长蓝色、下降红色、持平灰色 */
.growth-rate.growth {
  color: #4DA6FF;
  font-weight: 600;
}

.growth-rate.decline {
  color: #FF3B30;
  font-weight: 600;
}

.growth-rate.flat {
  color: #8E8E93;
  font-weight: 500;
}

/* 变化值颜色 */
.change-value.positive {
  color: #4DA6FF;
}

.change-value.negative {
  color: #FF3B30;
}

.change-value.zero {
  color: #8E8E93;
}

/* 横屏看按钮 - 右下角，14px，#999 */
.landscape-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  color: #999;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 999;
}

.landscape-btn:hover {
  background: white;
  color: #666;
}

/* 弹窗遮罩 - 灰色蒙层，透明度0.5 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 增长率筛选弹窗 - 宽280px、高160px */
.growth-modal {
  background: white;
  border-radius: 12px;
  width: 280px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 16px;
  color: #333;
  text-align: center;
  margin: 0 0 16px 0;
  font-weight: 600;
}

/* 筛选选项 - 垂直排列，间距16px */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 4px;
}

.filter-option:hover {
  background: #f8f9fa;
}

.option-text {
  font-size: 14px;
  color: #333;
}

/* 选中对勾 - #007AFF */
.check-icon {
  font-size: 16px;
  color: #007AFF;
  font-weight: bold;
}

/* 弹窗说明文字 - 12px，#999 */
.modal-note {
  font-size: 12px;
  color: #999;
  text-align: center;
  line-height: 1.4;
}

/* 时间筛选弹窗 - 宽320px、高240px */
.time-modal {
  background: white;
  border-radius: 12px;
  width: 320px;
  height: 240px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.cancel-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
}

.selected-time {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.confirm-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #007AFF;
  cursor: pointer;
  padding: 4px 8px;
  font-weight: 500;
}

/* 时间标签栏 - 高度44px */
.time-tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.time-tab {
  flex: 1;
  background: none;
  border: none;
  font-size: 15px;
  color: #999;
  padding: 12px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.time-tab.active {
  color: #007AFF;
  font-weight: 500;
}

/* 选中标签底部下划线 */
.time-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #007AFF;
}

/* 时间选项区域 */
.time-options {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.time-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.time-option:hover {
  background: #f8f9fa;
}

.time-option .option-text {
  font-size: 14px;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .header-bar,
  .filter-row,
  .growth-filter-row {
    padding: 0 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .date-selector,
  .growth-filter-btn {
    font-size: 13px;
    padding: 6px 10px;
  }

  .toggle-btn,
  .export-btn {
    font-size: 13px;
    padding: 3px 6px;
  }

  .data-container {
    margin-left: 12px;
    margin-right: 12px;
  }

  .header-cell,
  .data-cell {
    font-size: 13px;
    padding: 0 6px;
  }

  .header-cell.name-cell,
  .data-cell.name-cell {
    padding-left: 12px;
  }

  .growth-modal {
    width: 260px;
    margin: 0 20px;
  }

  .time-modal {
    width: 300px;
    margin: 0 20px;
  }
}
</style>
