<template>
  <div class="visit-analysis-page">
    <div class="top-bar">
      <button class="back-btn" @click="goBack">←</button>
      <div class="title-center">
        <span class="page-title">拜访分析</span>
      </div>
      <div class="actions-right">
        <button class="export-btn" @click="exportData">导出</button>
      </div>
    </div>

    <!-- 日期行：位于标题下方，靠左 -->
    <div class="date-row">
      <button class="date-range" @click="openDatePicker">{{ dateRange }}</button>
    </div>

    <div class="metric-tabs">
      <button
        class="metric-tab"
        :class="{ active: currentMetric === 'visit-rate' }"
        @click="switchMetric('visit-rate')"
      >客户拜访率</button>
      <button
        class="metric-tab"
        :class="{ active: currentMetric === 'order-rate' }"
        @click="switchMetric('order-rate')"
      >拜访下单率</button>
    </div>

    <div class="insight-section">
      <div class="insight-label">解读</div>
      <div class="insight-content">
        <p class="line">平均{{ currentMetricLabel }} <span class="strong">{{ formatRate(avgRate) }}</span></p>
        <p class="line">其中 <span class="danger">{{ belowAverageCount }}</span> 人低于平均水平</p>
        <p class="line">最低员工为 <span class="name">{{ minEmployee.name }}</span> (<span class="danger">{{ formatRate(minEmployee.value) }}</span>) ，最高员工为 <span class="name">{{ maxEmployee.name }}</span> (<span class="primary">{{ formatRate(maxEmployee.value) }}</span>)</p>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="sticky">员工名称</th>
            <th class="sortable" @click="toggleSort('visitedCustomers')">
              拜访客户数
              <span class="sort-arrow" :class="arrowClass('visitedCustomers')">▲</span>
            </th>
            <th class="sortable" @click="toggleSort(currentMetric === 'visit-rate' ? 'responsibleCustomers' : 'orderedCustomers')">
              <span v-if="currentMetric === 'visit-rate'">负责客户数</span>
              <span v-else>拜访下单客户数</span>
              <span class="sort-arrow" :class="arrowClass(currentMetric === 'visit-rate' ? 'responsibleCustomers' : 'orderedCustomers')">▲</span>
            </th>
            <th class="sortable" @click="toggleSort('rate')">
              <span v-if="currentMetric === 'visit-rate'">客户拜访率</span>
              <span v-else>拜访下单率</span>
              <span class="sort-arrow" :class="arrowClass('rate')">▲</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in sortedEmployees" :key="emp.id" @click="openEmployee(emp)" class="data-row">
            <td class="emp-name">
              <span class="name-text">{{ emp.name }}</span>
              <span class="arrow">›</span>
            </td>
            <td>{{ emp.visitedCustomers }}</td>
            <td>
              <span v-if="currentMetric === 'visit-rate'">{{ emp.responsibleCustomers }}</span>
              <span v-else>{{ emp.orderedCustomers }}</span>
            </td>
            <td :class="rateClass(getRate(emp))">{{ formatRate(getRate(emp)) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">已展示全部数据</div>
    </div>

    <div v-if="showDatePicker" class="modal-mask" @click.self="closeDatePicker">
      <div class="modal">
        <div class="modal-header">
          <div>选择时间范围</div>
          <button class="close" @click="closeDatePicker">✕</button>
        </div>
        <div class="modal-content">
          <div class="quick-dates">
            <button @click="applyQuick('本月')">本月</button>
            <button @click="applyQuick('上月')">上月</button>
            <button @click="applyQuick('近90天')">近90天</button>
          </div>
          <div class="tips">暂为演示选择，接入后端后替换为真实日期控件</div>
        </div>
        <div class="modal-actions">
          <button class="primary-btn" @click="confirmDate">确定</button>
        </div>
      </div>
    </div>
  </div>
  </template>

<script>
export default {
  name: 'VisitAnalysis',
  data() {
    return {
      dateRange: '06-01～06-26',
      currentMetric: 'visit-rate',
      sortField: 'rate',
      sortOrder: 'desc',
      showDatePicker: false,
      employees: [
        { id: 1, name: '黄保杰', visitedCustomers: 45, responsibleCustomers: 52, orderedCustomers: 18, visitRate: 0.865, orderRate: 0.400 },
        { id: 2, name: '张三', visitedCustomers: 30, responsibleCustomers: 60, orderedCustomers: 9, visitRate: 0.500, orderRate: 0.300 },
        { id: 3, name: '李四', visitedCustomers: 12, responsibleCustomers: 80, orderedCustomers: 3, visitRate: 0.150, orderRate: 0.250 },
        { id: 4, name: '王五', visitedCustomers: 60, responsibleCustomers: 60, orderedCustomers: 20, visitRate: 1.000, orderRate: 0.500 },
        { id: 5, name: '梁俊杰', visitedCustomers: 1, responsibleCustomers: 70, orderedCustomers: 0, visitRate: 0.014, orderRate: 0.000 },
        { id: 6, name: '豆东东', visitedCustomers: 2, responsibleCustomers: 85, orderedCustomers: 0, visitRate: 0.024, orderRate: 0.000 }
      ]
    }
  },
  computed: {
    currentMetricLabel() {
      return this.currentMetric === 'visit-rate' ? '客户拜访率' : '拜访下单率'
    },
    avgRate() {
      const list = this.employees.map(e => this.getRate(e))
      if (list.length === 0) return 0
      return list.reduce((a, b) => a + b, 0) / list.length
    },
    belowAverageCount() {
      return this.employees.filter(e => this.getRate(e) < this.avgRate).length
    },
    minEmployee() {
      if (this.employees.length === 0) return { name: '-', value: 0 }
      const e = [...this.employees].sort((a, b) => this.getRate(a) - this.getRate(b))[0]
      return { name: e.name, value: this.getRate(e) }
    },
    maxEmployee() {
      if (this.employees.length === 0) return { name: '-', value: 0 }
      const e = [...this.employees].sort((a, b) => this.getRate(b) - this.getRate(a))[0]
      return { name: e.name, value: this.getRate(e) }
    },
    sortedEmployees() {
      const list = [...this.employees]
      list.sort((a, b) => {
        let av; let bv;
        if (this.sortField === 'rate') {
          av = this.getRate(a)
          bv = this.getRate(b)
        } else {
          av = a[this.sortField]
          bv = b[this.sortField]
        }
        return this.sortOrder === 'asc' ? av - bv : bv - av
      })
      return list
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    openEmployee(emp) {
      this.$router.push({ path: '/employee-detail-analysis', query: { employeeId: emp.id } })
    },
    exportData() {
      console.log('export visit analysis')
      alert('已创建导出任务（示例）')
    },
    openDatePicker() {
      this.showDatePicker = true
    },
    closeDatePicker() {
      this.showDatePicker = false
    },
    applyQuick(label) {
      this.dateRange = label
    },
    confirmDate() {
      this.showDatePicker = false
    },
    switchMetric(metric) {
      if (this.currentMetric !== metric) {
        this.currentMetric = metric
      }
    },
    toggleSort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'desc'
      }
    },
    arrowClass(field) {
      return this.sortField === field ? this.sortOrder : 'neutral'
    },
    getRate(emp) {
      return this.currentMetric === 'visit-rate' ? emp.visitRate : emp.orderRate
    },
    formatRate(value) {
      const v = Number(value || 0)
      return `${(v * 100).toFixed(2)}%`
    },
    rateClass(value) {
      if (value === null || value === undefined) return ''
      if (value <= this.minEmployee.value + 1e-9) return 'danger'
      if (value >= this.maxEmployee.value - 1e-9) return 'primary'
      return 'normal'
    }
  }
}
</script>

<style scoped>
.visit-analysis-page {
  background: #f7f8fa;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
}

.date-row {
  padding: 8px 16px 0 16px;
}

.back-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #111111;
}

.title-center { flex: 1; text-align: center; }

.page-title {
  margin: 0;
  font-size: 17px; /* 规范：标题17px */
  font-weight: 700;
  color: #000000;
}

.date-range {
  padding: 6px 10px;
  background: #F5F5F5; /* 浅灰背景 */
  border: 1px solid #ECECEC; /* 边框 */
  border-radius: 4px;
  color: #333333; /* 字体14深灰 */
  font-size: 14px;
}

.actions-right { display: flex; align-items: center; gap: 8px; }

.export-btn {
  padding: 6px 10px;
  background: transparent;
  color: #007AFF; /* iOS 风格蓝色 */
  border: none;
  font-size: 14px;
}

.metric-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  justify-content: center; /* 居中 */
}

.metric-tab {
  flex: none;
  padding: 8px 12px;
  border-radius: 8px; /* 规范：圆角8 */
  background: #ECECEC; /* 未选中背景 */
  color: #333333; /* 未选中文字 */
  border: 1px solid #ECECEC; /* 未选中边框 */
  font-size: 15px;
}

.metric-tab.active {
  background: #007AFF; /* 选中蓝色 */
  color: #ffffff;
}

.insight-section {
  padding: 12px 16px 0 16px;
}

.insight-label {
  font-size: 13px; /* 规范：13px */
  color: #007AFF; /* 蓝色提示 */
  margin-bottom: 6px;
}

.insight-content {
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  padding: 12px;
  line-height: 1.5; /* 行间距1.5 */
  color: #333333;
  text-align: center; /* 居中内容 */
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.insight-content .strong { color: #000000; font-weight: 600; font-size: 14px; }
.insight-content .danger { color: #f53f3f; }
.insight-content .primary { color: #007AFF; }
.insight-content .name { color: #000000; font-size: 14px; }

.table-wrapper {
  margin: 12px 16px 16px 16px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

thead th {
  position: sticky;
  top: 0;
  background: #F5F5F5; /* 表头背景 */
  color: #333333;
  font-weight: 600;
  text-align: left;
  padding: 0 12px;
  height: 44px; /* 行高 44px */
  border-bottom: 1px solid #ECECEC; /* 分隔线 */
}

thead th.sticky { left: 0; z-index: 1; }

tbody td {
  padding: 0 12px;
  height: 44px; /* 行高 44px */
  border-bottom: 1px solid #ECECEC;
  color: #333333;
  background: #ffffff;
}

.emp-name { white-space: nowrap; }
.emp-name .name-text { margin-right: 4px; font-size: 14px; color: #000000; }
.emp-name .arrow { color: #999999; }

.sortable { cursor: pointer; user-select: none; }
.sort-arrow { margin-left: 6px; font-size: 10px; transform: rotate(90deg); color: #999999; }
.sort-arrow.asc { transform: rotate(-90deg); color: #007AFF; }
.sort-arrow.desc { transform: rotate(90deg); color: #007AFF; }
.sort-arrow.neutral { opacity: 0.4; }

td.primary { color: #007AFF; font-weight: 600; }
td.danger { color: #FF0000; font-weight: 600; }

.table-footer {
  padding: 12px;
  text-align: center;
  color: #999999;
}

.data-row { cursor: pointer; }
.data-row:hover td { background: #fafafa; }

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 90%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #eeeeee;
}

.modal-content { padding: 14px; }
.quick-dates { display: flex; gap: 8px; }
.quick-dates button { padding: 8px 10px; background: #f4f6f8; border: 1px solid #e5e7eb; border-radius: 6px; }
.tips { margin-top: 10px; font-size: 12px; color: #999999; }
.modal-actions { padding: 12px 14px; border-top: 1px solid #eeeeee; text-align: right; }
.primary-btn { padding: 8px 12px; background: #1677ff; color: #ffffff; border: none; border-radius: 6px; }
</style>


