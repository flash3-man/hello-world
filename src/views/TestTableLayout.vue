<template>
  <div class="test-container">
    <h1>表格布局测试</h1>
    
    <!-- 测试表格 -->
    <div class="table-container">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-cell col-employee">员工名称</div>
        <div class="header-cell col-covered">铺货客户数</div>
        <div class="header-cell col-uncovered">未铺货客户数</div>
        <div class="header-cell col-rate">客户铺货率</div>
      </div>

      <!-- 数据行 -->
      <div class="table-row">
        <div class="data-cell col-employee">
          <div>
            <div class="name">黄保杰</div>
            <div class="dept">销售一部</div>
          </div>
        </div>
        <div class="data-cell col-covered">28</div>
        <div class="data-cell col-uncovered">7</div>
        <div class="data-cell col-rate">80.0%</div>
      </div>

      <div class="table-row">
        <div class="data-cell col-employee">
          <div>
            <div class="name">李明华</div>
            <div class="dept">销售一部</div>
          </div>
        </div>
        <div class="data-cell col-covered">32</div>
        <div class="data-cell col-uncovered">4</div>
        <div class="data-cell col-rate">88.9%</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestTableLayout'
}
</script>

<style scoped>
.test-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-header,
.table-row {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  min-width: 500px !important;
}

.table-header {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.table-row {
  border-bottom: 1px solid #f0f0f0;
}

.header-cell,
.data-cell {
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0 !important;
}

.header-cell:last-child,
.data-cell:last-child {
  border-right: none;
}

.col-employee {
  flex: 2 !important;
  min-width: 120px !important;
  justify-content: flex-start !important;
}

.col-covered,
.col-uncovered,
.col-rate {
  flex: 1 !important;
  min-width: 80px !important;
}

.name {
  font-weight: 600;
  margin-bottom: 4px;
}

.dept {
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

/* 强制保持横向 */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    display: flex !important;
    flex-direction: row !important;
  }
  
  .header-cell,
  .data-cell {
    padding: 12px 8px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .header-cell,
  .data-cell {
    padding: 8px 4px;
    font-size: 12px;
  }
}
</style>
