<template>
  <div class="test-table-page">
    <h1>测试表格布局</h1>
    
    <!-- 简单表格测试 -->
    <div class="simple-table">
      <div class="table-header">
        <div class="header-cell col-employee">员工名称</div>
        <div class="header-cell col-covered">铺货客户数</div>
        <div class="header-cell col-uncovered">未铺货客户数</div>
        <div class="header-cell col-rate">客户铺货率</div>
      </div>
      
      <div class="table-body">
        <div class="table-row">
          <div class="data-cell col-employee">
            <div class="employee-info">
              <div class="employee-name">黄保杰</div>
              <div class="employee-tag">销售一部</div>
            </div>
          </div>
          <div class="data-cell col-covered">28</div>
          <div class="data-cell col-uncovered">7</div>
          <div class="data-cell col-rate">80.0%</div>
        </div>
        
        <div class="table-row">
          <div class="data-cell col-employee">
            <div class="employee-info">
              <div class="employee-name">李明华</div>
              <div class="employee-tag">销售一部</div>
            </div>
          </div>
          <div class="data-cell col-covered">32</div>
          <div class="data-cell col-uncovered">4</div>
          <div class="data-cell col-rate">88.9%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestTable'
}
</script>

<style scoped>
.test-table-page {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.simple-table {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}

/* 表头 */
.table-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.header-cell {
  padding: 16px 12px;
  color: #495057;
  font-size: 14px;
  font-weight: 700;
  border-right: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.header-cell:last-child {
  border-right: none;
}

.header-cell.col-employee {
  flex: 2;
  justify-content: flex-start;
}

.header-cell.col-covered,
.header-cell.col-uncovered,
.header-cell.col-rate {
  flex: 1;
}

/* 表格主体 */
.table-body {
  background-color: #ffffff;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.data-cell {
  padding: 16px 12px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.data-cell:last-child {
  border-right: none;
}

.data-cell.col-employee {
  flex: 2;
  justify-content: flex-start;
}

.data-cell.col-covered,
.data-cell.col-uncovered,
.data-cell.col-rate {
  flex: 1;
}

/* 员工信息 */
.employee-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
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
}
</style>
