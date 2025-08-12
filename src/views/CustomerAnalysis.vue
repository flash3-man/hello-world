<template>
  <div class="customer-dimension-analysis">
    <!-- 顶部操作区（固定置顶） -->
    <div class="header-section">
      <div class="header-bar">
        <button class="back-btn" @click="goBack">
          <svg class="back-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="page-title">铺市分析</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- 筛选操作区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">时间筛选：</label>
            <div class="time-picker" @click="showTimePicker = true">
              <span class="time-text">{{ selectedTimeRange }}</span>
              <svg class="time-arrow" width="12" height="12" viewBox="0 0 12 12">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">分析维度：</label>
            <div class="dimension-picker" @click="showDimensionPicker = true">
              <span class="dimension-text">按员工分析</span>
              <svg class="dimension-arrow" width="12" height="12" viewBox="0 0 12 12">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
          </div>

          <button class="filter-btn" @click="showAdvancedFilter = true">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M1 3L15 3M4 8L12 8M6 13L10 13" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            筛选
          </button>

          <button class="export-btn" @click="exportData">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2L8 10M8 2L5 5M8 2L11 5M2 14L14 14" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            导出
          </button>
        </div>
      </div>
    </div>

    <!-- 维度切换栏（紧邻顶部，固定） -->
    <div class="dimension-section">
      <div class="dimension-tabs">
        <button 
          class="dimension-tab active"
          @click="switchToDimension('customer')"
        >
          客户
        </button>
        <button 
          class="dimension-tab"
          @click="switchToDimension('brand')"
        >
          品牌
        </button>
        <button 
          class="dimension-tab"
          @click="switchToDimension('product')"
        >
          商品
        </button>
      </div>
    </div>

    <!-- 统计信息栏（维度切换栏下方，固定） -->
    <div class="stats-section">
      <div class="stats-info">
        <span class="stats-text">合计员工数 {{ totalEmployeeCount }}</span>
      </div>
    </div>

    <!-- 列表区（滚动加载，核心数据区） -->
    <div class="data-list-section">
      <!-- 表格滚动容器 -->
      <div class="table-scroll-container">
        <!-- Grid表格容器 -->
        <div class="employee-grid">
          <!-- Grid表头 -->
          <div class="grid-header">员工名称</div>
          <div class="grid-header">铺货客户数</div>
          <div class="grid-header">未铺货客户数</div>
          <div class="grid-header">客户铺货率</div>
          
          <!-- Grid数据行 -->
          <div v-for="employee in employeeList" :key="employee.id" class="grid-row-group">
            <div class="grid-cell employee-cell" @click="navigateToEmployeeAnalysis(employee)">
              <div class="employee-info">
                <div class="employee-name">{{ employee.name }}</div>
                <div class="employee-tag">{{ employee.department }}</div>
              </div>
            </div>
            
            <div class="grid-cell metric-cell" @click.stop="showCustomerDetailModal(employee, 'covered')">
              <div class="metric-value covered">{{ employee.coveredCustomers }}</div>
            </div>
            
            <div class="grid-cell metric-cell" @click.stop="showCustomerDetailModal(employee, 'uncovered')">
              <div class="metric-value uncovered">{{ employee.uncoveredCustomers }}</div>
            </div>
            
            <div class="grid-cell rate-cell">
              <div class="rate-value" :class="getRateClass(employee.coverageRate)">
                {{ employee.coverageRate }}%
              </div>
            </div>
          </div>
        </div>
      </div> <!-- 结束 table-scroll-container -->

      <!-- 底部提示 -->
      <div class="list-footer" v-if="!isLoading && employeeList.length > 0">
        <span class="footer-text">已经到底了～</span>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner"></div>
        <span class="loading-text">加载中...</span>
      </div>
    </div>

    <!-- 时间选择弹窗 -->
    <div v-if="showTimePicker" class="modal-overlay" @click="showTimePicker = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>选择时间范围</h3>
          <button class="modal-close" @click="showTimePicker = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="time-options">
            <button 
              v-for="option in timeOptions" 
              :key="option.value"
              class="time-option-btn"
              :class="{ active: selectedTimeValue === option.value }"
              @click="selectTimeRange(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析维度选择弹窗 -->
    <div v-if="showDimensionPicker" class="modal-overlay" @click="showDimensionPicker = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>选择分析维度</h3>
          <button class="modal-close" @click="showDimensionPicker = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="dimension-options">
            <button 
              v-for="option in analysisOptions" 
              :key="option.value"
              class="dimension-option-btn"
              :class="{ active: selectedAnalysis === option.value }"
              @click="selectAnalysis(option)"
            >
              <div class="option-label">{{ option.label }}</div>
              <div class="option-desc">{{ option.desc }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级筛选弹窗 -->
    <div v-if="showAdvancedFilter" class="modal-overlay" @click="showAdvancedFilter = false">
      <div class="filter-modal" @click.stop>
        <div class="modal-header">
          <h3>筛选条件</h3>
          <button class="modal-close" @click="showAdvancedFilter = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="filter-options">
            <div class="filter-option-group">
              <label class="option-label">员工筛选：</label>
              <div class="checkbox-group">
                <label v-for="employee in allEmployees" :key="employee.id" class="checkbox-item">
                  <input type="checkbox" v-model="selectedEmployees" :value="employee.id">
                  <span class="checkbox-label">{{ employee.name }} ({{ employee.department }})</span>
                </label>
              </div>
            </div>
            
            <div class="filter-option-group">
              <label class="option-label">区域筛选：</label>
              <div class="checkbox-group">
                <label v-for="region in regions" :key="region.value" class="checkbox-item">
                  <input type="checkbox" v-model="selectedRegions" :value="region.value">
                  <span class="checkbox-label">{{ region.label }}</span>
                </label>
              </div>
            </div>
            
            <div class="filter-option-group">
              <label class="option-label">客户等级：</label>
              <div class="checkbox-group">
                <label v-for="level in customerLevels" :key="level.value" class="checkbox-item">
                  <input type="checkbox" v-model="selectedLevels" :value="level.value">
                  <span class="checkbox-label">{{ level.label }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="filter-actions">
            <button class="reset-btn" @click="resetFilters">重置</button>
            <button class="apply-btn" @click="applyFilters">应用筛选</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户明细弹窗 -->
    <div v-if="showCustomerDetail" class="modal-overlay" @click="showCustomerDetail = false">
      <div class="detail-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ detailModalTitle }}</h3>
          <button class="modal-close" @click="showCustomerDetail = false">✕</button>
        </div>
        <div class="modal-content">
          <div class="customer-detail-list">
            <div 
              v-for="customer in currentCustomerDetail" 
              :key="customer.id"
              class="customer-detail-item"
            >
              <div class="customer-info">
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-address">{{ customer.address }}</div>
              </div>
              <div class="customer-status">
                <span class="status-badge" :class="customer.status === '已铺货' ? 'status-covered' : 'status-uncovered'">
                  {{ customer.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerDimensionAnalysis',
  data() {
    return {
      // 界面状态
      showTimePicker: false,
      showDimensionPicker: false,
      showAdvancedFilter: false,
      showCustomerDetail: false,
      isLoading: false,
      
      // 当前选择
      selectedTimeValue: 'current_month',
      selectedTimeRange: '06-01~06-20',
      selectedAnalysis: 'employee',
      
      // 筛选条件
      selectedEmployees: [],
      selectedRegions: [],
      selectedLevels: [],
      
      // 客户明细弹窗
      detailModalTitle: '',
      currentCustomerDetail: [],
      
      // 时间选项
      timeOptions: [
        { value: 'current_month', label: '本月 (06-01~06-20)' },
        { value: 'last_month', label: '上月 (05-01~05-20)' },
        { value: 'current_quarter', label: '本季度 (04-01~06-20)' },
        { value: 'current_year', label: '今年 (01-01~06-20)' }
      ],
      
      // 分析维度选项
      analysisOptions: [
        { value: 'employee', label: '按员工分析', desc: '查看各员工的客户铺货情况' },
        { value: 'region', label: '按区域分析', desc: '查看各区域的铺货数据对比' },
        { value: 'department', label: '按部门分析', desc: '查看各部门的铺货效率' }
      ],
      
      // 区域选项
      regions: [
        { value: 'lanzhou', label: '兰州地区' },
        { value: 'tianshui', label: '天水地区' },
        { value: 'baiyin', label: '白银地区' },
        { value: 'jinchang', label: '金昌地区' },
        { value: 'jiuquan', label: '酒泉地区' }
      ],
      
      // 客户等级选项
      customerLevels: [
        { value: 'A', label: 'A类客户' },
        { value: 'B', label: 'B类客户' },
        { value: 'C', label: 'C类客户' }
      ],
      
      // 所有员工列表（用于筛选）
      allEmployees: [
        { id: 1, name: '黄保杰', department: '销售一部' },
        { id: 2, name: '李明华', department: '销售一部' },
        { id: 3, name: '王建国', department: '销售二部' },
        { id: 4, name: '张晓红', department: '销售二部' },
        { id: 5, name: '陈志强', department: '销售三部' },
        { id: 6, name: '刘芳芳', department: '销售三部' },
        { id: 7, name: '赵敏敏', department: '销售一部' },
        { id: 8, name: '孙伟伟', department: '销售二部' },
        { id: 9, name: '周晓峰', department: '销售三部' },
        { id: 10, name: '吴丽娟', department: '销售一部' },
        { id: 11, name: '马国强', department: '销售二部' },
        { id: 12, name: '郑小燕', department: '销售三部' },
        { id: 13, name: '朱建华', department: '销售一部' },
        { id: 14, name: '徐晓雯', department: '销售二部' },
        { id: 15, name: '林志远', department: '销售三部' }
      ],
      
      // 员工铺货数据列表
      employeeList: [
        {
          id: 1,
          name: '黄保杰',
          department: '销售一部',
          coveredCustomers: 28,
          uncoveredCustomers: 7,
          totalCustomers: 35,
          coverageRate: 80.0
        },
        {
          id: 2,
          name: '李明华',
          department: '销售一部',
          coveredCustomers: 32,
          uncoveredCustomers: 4,
          totalCustomers: 36,
          coverageRate: 88.9
        },
        {
          id: 3,
          name: '王建国',
          department: '销售二部',
          coveredCustomers: 25,
          uncoveredCustomers: 10,
          totalCustomers: 35,
          coverageRate: 71.4
        },
        {
          id: 4,
          name: '张晓红',
          department: '销售二部',
          coveredCustomers: 30,
          uncoveredCustomers: 5,
          totalCustomers: 35,
          coverageRate: 85.7
        },
        {
          id: 5,
          name: '陈志强',
          department: '销售三部',
          coveredCustomers: 22,
          uncoveredCustomers: 13,
          totalCustomers: 35,
          coverageRate: 62.9
        },
        {
          id: 6,
          name: '刘芳芳',
          department: '销售三部',
          coveredCustomers: 26,
          uncoveredCustomers: 9,
          totalCustomers: 35,
          coverageRate: 74.3
        },
        {
          id: 7,
          name: '赵敏敏',
          department: '销售一部',
          coveredCustomers: 29,
          uncoveredCustomers: 6,
          totalCustomers: 35,
          coverageRate: 82.9
        },
        {
          id: 8,
          name: '孙伟伟',
          department: '销售二部',
          coveredCustomers: 27,
          uncoveredCustomers: 8,
          totalCustomers: 35,
          coverageRate: 77.1
        },
        {
          id: 9,
          name: '周晓峰',
          department: '销售三部',
          coveredCustomers: 31,
          uncoveredCustomers: 4,
          totalCustomers: 35,
          coverageRate: 88.6
        },
        {
          id: 10,
          name: '吴丽娟',
          department: '销售一部',
          coveredCustomers: 24,
          uncoveredCustomers: 11,
          totalCustomers: 35,
          coverageRate: 68.6
        },
        {
          id: 11,
          name: '马国强',
          department: '销售二部',
          coveredCustomers: 33,
          uncoveredCustomers: 2,
          totalCustomers: 35,
          coverageRate: 94.3
        },
        {
          id: 12,
          name: '郑小燕',
          department: '销售三部',
          coveredCustomers: 28,
          uncoveredCustomers: 7,
          totalCustomers: 35,
          coverageRate: 80.0
        },
        {
          id: 13,
          name: '朱建华',
          department: '销售一部',
          coveredCustomers: 26,
          uncoveredCustomers: 9,
          totalCustomers: 35,
          coverageRate: 74.3
        },
        {
          id: 14,
          name: '徐晓雯',
          department: '销售二部',
          coveredCustomers: 29,
          uncoveredCustomers: 6,
          totalCustomers: 35,
          coverageRate: 82.9
        },
        {
          id: 15,
          name: '林志远',
          department: '销售三部',
          coveredCustomers: 20,
          uncoveredCustomers: 15,
          totalCustomers: 35,
          coverageRate: 57.1
        }
      ]
    }
  },
  
  computed: {
    // 合计员工数
    totalEmployeeCount() {
      return this.employeeList.length
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 切换到其他维度（品牌/商品）
    switchToDimension(dimension) {
      if (dimension === 'brand') {
        // 跳转到品牌维度
        this.$router.push('/market-analysis?tab=brand')
      } else if (dimension === 'product') {
        // 跳转到商品维度
        this.$router.push('/market-analysis?tab=product')
      }
    },
    
    // 选择时间范围
    selectTimeRange(option) {
      this.selectedTimeValue = option.value
      this.selectedTimeRange = option.label.match(/\(([^)]+)\)/)[1]
      this.showTimePicker = false
      this.loadEmployeeData()
    },
    
    // 选择分析维度
    selectAnalysis(option) {
      this.selectedAnalysis = option.value
      this.showDimensionPicker = false
      this.loadEmployeeData()
    },
    
    // 重置筛选条件
    resetFilters() {
      this.selectedEmployees = []
      this.selectedRegions = []
      this.selectedLevels = []
    },
    
    // 应用筛选条件
    applyFilters() {
      this.showAdvancedFilter = false
      this.loadEmployeeData()
    },
    
    // 获取铺货率样式类
    getRateClass(rate) {
      if (rate >= 85) return 'rate-excellent'
      if (rate >= 70) return 'rate-good'
      if (rate >= 50) return 'rate-fair'
      return 'rate-poor'
    },
    
    // 跳转到员工分析页面
    navigateToEmployeeAnalysis(employee) {
      this.$router.push({
        path: '/employee-detail-analysis',
        query: {
          employeeId: employee.id,
          employeeName: employee.name,
          dateRange: this.selectedTimeRange
        }
      })
    },
    
    // 显示客户明细
    showCustomerDetailModal(employee, type) {
      this.currentEmployee = employee
      this.detailType = type
      
      if (type === 'covered') {
        this.detailModalTitle = `${employee.name} - 已铺货客户明细`
        this.currentCustomerDetail = this.generateCustomerDetail(employee, true)
      } else {
        this.detailModalTitle = `${employee.name} - 未铺货客户明细`
        this.currentCustomerDetail = this.generateCustomerDetail(employee, false)
      }
      
      this.showCustomerDetail = true
    },
    
    // 生成客户明细数据（模拟）
    generateCustomerDetail(employee, isCovered) {
      const count = isCovered ? employee.coveredCustomers : employee.uncoveredCustomers
      const customers = []
      
      for (let i = 1; i <= count; i++) {
        customers.push({
          id: i,
          name: `客户${String(i).padStart(3, '0')}`,
          address: `甘肃省兰州市城关区街道${i}号`,
          status: isCovered ? '已铺货' : '未铺货'
        })
      }
      
      return customers
    },
    
    // 导出数据
    exportData() {
      console.log('导出铺货数据:', {
        timeRange: this.selectedTimeRange,
        analysis: this.selectedAnalysis,
        employeeCount: this.totalEmployeeCount
      })
      
      alert('正在导出员工铺货数据...')
    },
    
    // 加载员工数据
    loadEmployeeData() {
      this.isLoading = true
      
      // 模拟异步加载
      setTimeout(() => {
        console.log('加载员工铺货数据:', {
          timeRange: this.selectedTimeRange,
          analysis: this.selectedAnalysis,
          filters: {
            employees: this.selectedEmployees,
            regions: this.selectedRegions,
            levels: this.selectedLevels
          }
        })
        
        this.isLoading = false
      }, 1000)
    }
  },
  
  mounted() {
    // 初始化数据
    this.loadEmployeeData()
  }
}
</script>

<style scoped>
/* CSS重置 - 超强制表格横向布局 */
.customer-dimension-analysis *,
.customer-dimension-analysis *::before,
.customer-dimension-analysis *::after {
  box-sizing: border-box;
}

/* 核心表格强制规则 - 最高优先级 */
.customer-dimension-analysis .employee-table {
  display: table !important;
  width: 100% !important;
  min-width: 750px !important;
  border-collapse: collapse !important;
  table-layout: fixed !important;
  margin: 0 !important;
  padding: 0 !important;
}

.customer-dimension-analysis .employee-table,
.customer-dimension-analysis .employee-table * {
  display: table !important;
}

.customer-dimension-analysis .employee-table thead {
  display: table-header-group !important;
  width: 100% !important;
}

.customer-dimension-analysis .employee-table tbody {
  display: table-row-group !important;
  width: 100% !important;
}

.customer-dimension-analysis .employee-table tr {
  display: table-row !important;
  width: 100% !important;
}

.customer-dimension-analysis .employee-table th,
.customer-dimension-analysis .employee-table td {
  display: table-cell !important;
  padding: 16px 12px !important;
  border-right: 1px solid #f0f0f0 !important;
  text-align: center !important;
  vertical-align: middle !important;
  white-space: nowrap !important;
}

/* 整体布局 */
.customer-dimension-analysis {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 顶部操作区（固定置顶） */
.header-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #007AFF;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  min-width: 32px;
  height: 32px;
}

.back-btn:hover {
  background-color: #f0f8ff;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #007AFF;
}

.page-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-spacer {
  width: 32px;
}

/* 筛选操作区域 */
.filter-section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.time-picker,
.dimension-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
}

.time-picker:hover,
.dimension-picker:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.time-text,
.dimension-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.time-arrow,
.dimension-arrow {
  color: #666666;
  flex-shrink: 0;
}

.filter-btn,
.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.filter-btn:hover,
.export-btn:hover {
  background-color: #0056d6;
}

.filter-btn {
  background-color: #f8f9fa;
  color: #333333;
  border: 1px solid #ddd;
}

.filter-btn:hover {
  background-color: #f0f8ff;
  border-color: #007AFF;
  color: #007AFF;
}

/* 维度切换栏（紧邻顶部，固定） */
.dimension-section {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 0 16px;
}

.dimension-tabs {
  display: flex;
  gap: 0;
}

.dimension-tab {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #666666;
  font-size: 15px;
  font-weight: 500;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dimension-tab:hover {
  color: #007AFF;
}

.dimension-tab.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

/* 统计信息栏（维度切换栏下方，固定） */
.stats-section {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeaea;
}

.stats-info {
  color: #666666;
  font-size: 14px;
}

.stats-text {
  color: #333333;
  font-weight: 500;
}

/* 表格容器 - 强制横向布局 */
.data-list-section {
  background-color: #ffffff;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #e8e8e8;
  /* 关键：确保表格容器可以水平滚动 */
  overflow-x: auto !important;
  overflow-y: hidden !important;
  width: calc(100vw - 32px) !important; /* 确保容器占满可用宽度 */
  max-width: calc(100vw - 32px) !important;
  /* 强制不要缩小 */
  flex-shrink: 0 !important;
  min-width: 0 !important;
}

/* 表格滚动容器 - 强制横向滚动 */
.table-scroll-container {
  width: 100%;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  /* 强制显示滚动条 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
  /* 强制最小宽度 */
  min-width: 100%;
}

.table-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}

/* Grid表格样式 - 完全替代HTML表格 */
.employee-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr; /* 4列网格 */
  min-width: 700px;
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.grid-row-group {
  display: contents; /* 让子元素直接参与grid布局 */
}

.grid-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 16px 12px;
  color: #495057;
  font-size: 14px;
  font-weight: 700;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.grid-header:last-child {
  border-right: none;
}

.grid-cell {
  padding: 16px 12px;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}

.grid-cell:last-child {
  border-right: none;
}

.grid-cell:hover {
  background: linear-gradient(90deg, #f8fbff 0%, #e3f2fd 50%, #f8fbff 100%);
  box-shadow: 0 4px 12px rgba(0,123,255,0.15);
}

.employee-cell {
  justify-content: flex-start;
  text-align: left;
}

.metric-cell,
.rate-cell {
  justify-content: center;
  text-align: center;
}

/* 表头样式 - 已集成到grid-header */

/* 数据行样式 - 已集成到grid-cell */

/* 员工信息 */
.employee-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.employee-name {
  color: #333333;
  font-size: 15px;
  font-weight: 600;
}

.employee-tag {
  color: #666666;
  font-size: 12px;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

/* 指标数值 */
.metric-value {
  color: #007AFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: transparent;
  display: inline-block;
}

.metric-value:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.metric-value.covered {
  color: #00b42a;
}

.metric-value.covered:hover {
  background-color: rgba(0, 180, 42, 0.1);
}

.metric-value.uncovered {
  color: #f53f3f;
}

.metric-value.uncovered:hover {
  background-color: rgba(245, 63, 63, 0.1);
}

/* 铺货率 */
.rate-value {
  font-size: 16px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-block;
}

.rate-excellent {
  color: #00b42a;
  background-color: rgba(0, 180, 42, 0.1);
}

.rate-good {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.rate-fair {
  color: #ff9900;
  background-color: rgba(255, 153, 0, 0.1);
}

.rate-poor {
  color: #f53f3f;
  background-color: rgba(245, 63, 63, 0.1);
}

/* 底部提示 */
.list-footer {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #666666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #007AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal,
.filter-modal,
.detail-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
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
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.modal-content {
  padding: 16px 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* 时间选择选项 */
.time-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-option-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #333333;
  font-size: 14px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.time-option-btn:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.time-option-btn.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

/* 分析维度选项 */
.dimension-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dimension-option-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333333;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dimension-option-btn:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.dimension-option-btn.active {
  background-color: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
}

.option-label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 13px;
  opacity: 0.8;
}

/* 高级筛选 */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.checkbox-label {
  color: #333333;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eaeaea;
}

.reset-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666666;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.apply-btn {
  background-color: #007AFF;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-btn:hover {
  background-color: #0056d6;
}

/* 客户明细列表 */
.customer-detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.customer-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.customer-detail-item:hover {
  border-color: #007AFF;
  background-color: #f8fbff;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
}

.customer-address {
  font-size: 12px;
  color: #666666;
}

.customer-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-covered {
  background-color: #e8f7e8;
  color: #00b42a;
}

.status-uncovered {
  background-color: #fff1f0;
  color: #f53f3f;
}

/* Grid响应式设计 - 永远保持4列横向 */
@media screen and (max-width: 768px) {
  .data-list-section {
    margin: 8px;
    width: calc(100vw - 16px);
  }
  
  .employee-grid {
    min-width: 600px; /* 稍微减小最小宽度 */
  }
  
  .grid-header,
  .grid-cell {
    padding: 12px 8px;
    font-size: 13px;
  }
  
  .employee-name {
    font-size: 14px;
  }
  
  .employee-tag {
    font-size: 11px;
  }
  
  .metric-value,
  .rate-value {
    font-size: 14px;
  }
}

@media screen and (max-width: 480px) {
  .data-list-section {
    margin: 4px;
    width: calc(100vw - 8px);
  }
  
  .employee-grid {
    min-width: 500px; /* 小屏幕最小宽度 */
  }
  
  .grid-header,
  .grid-cell {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .employee-name {
    font-size: 12px;
  }
  
  .employee-tag {
    font-size: 10px;
  }
  
  .metric-value,
  .rate-value {
    font-size: 12px;
  }
}

@media screen and (max-width: 400px) {
  .employee-grid {
    min-width: 450px; /* 390px屏幕专用 */
    grid-template-columns: 200px 80px 80px 90px; /* 固定列宽 */
  }
  
  .grid-header,
  .grid-cell {
    padding: 6px 2px;
    font-size: 11px;
  }
}

/* 全局覆盖 - 阻止任何CSS框架的垂直堆叠 */
@media screen and (max-width: 1200px) {
  .employee-table,
  .employee-table *,
  .employee-table thead,
  .employee-table tbody,
  .employee-table tr,
  .employee-table th,
  .employee-table td {
    display: revert !important;
  }
  
  .employee-table {
    display: table !important;
    min-width: 650px !important;
  }
  
  .employee-table thead {
    display: table-header-group !important;
  }
  
  .employee-table tbody {
    display: table-row-group !important;
  }
  
  .employee-table tr {
    display: table-row !important;
  }
  
  .employee-table th,
  .employee-table td {
    display: table-cell !important;
  }
}

/* 最强覆盖 - 针对所有可能的选择器 */
* .employee-table,
*[class*="employee"] table,
.customer-dimension-analysis table {
  display: table !important;
  min-width: 650px !important;
  table-layout: fixed !important;
}

* .employee-table thead,
* .employee-table tbody,
*[class*="employee"] thead,
*[class*="employee"] tbody {
  display: table-row-group !important;
}

* .employee-table thead {
  display: table-header-group !important;
}

* .employee-table tr,
*[class*="employee"] tr {
  display: table-row !important;
}

* .employee-table th,
* .employee-table td,
*[class*="employee"] th,
*[class*="employee"] td {
  display: table-cell !important;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal,
.filter-modal,
.detail-modal {
  animation: slideUp 0.3s ease-out;
}
</style>
