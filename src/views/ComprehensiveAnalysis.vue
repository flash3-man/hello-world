<template>
  <div class="comprehensive-analysis">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
      <h1 class="header-title">综合解读</h1>
      <div class="header-placeholder"></div>
    </div>

    <!-- 顶部对象标签 -->
    <div class="object-tabs">
      <div class="tab-container">
        <button 
          v-for="tab in objectTabs" 
          :key="tab.id"
          :class="['object-tab', { active: selectedObjectTab === tab.id }]"
          @click="selectObjectTab(tab.id)"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 流程分类标签 -->
    <div class="process-tabs">
      <div class="tab-container">
        <button 
          v-for="tab in processTabs" 
          :key="tab.id"
          :class="['process-tab', { active: selectedProcessTab === tab.id }]"
          @click="selectProcessTab(tab.id)"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 综合解读 - 履约流程 -->
      <div v-if="selectedObjectTab === 'comprehensive' && selectedProcessTab === 'fulfillment'" class="fulfillment-content">
        <div class="section-title">履约流程 - 订单交付的"进度条"</div>
        
        <!-- 7日履约进度条 -->
        <div class="progress-section">
          <h3>7日履约进度 (08-08 ~ 08-14)</h3>
          <div class="daily-progress">
            <div 
              v-for="day in fulfillmentProgress" 
              :key="day.date"
              class="day-item"
            >
              <div class="date">{{ day.date }}</div>
              <div class="progress-bar">
                <div 
                  v-for="status in day.statuses" 
                  :key="status.type"
                  :class="['status-bar', status.type]"
                  :style="{ width: status.percentage + '%' }"
                  :title="`${status.label}: ${status.count}单`"
                >
                  {{ status.count }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 遗留数据 -->
        <div class="legacy-section">
          <h3>遗留数据</h3>
          <div class="legacy-cards">
            <div class="legacy-card urgent">
              <div class="number">172</div>
              <div class="label">待审核</div>
              <div class="action">立即催办</div>
            </div>
            <div class="legacy-card warning">
              <div class="number">39</div>
              <div class="label">待出库</div>
              <div class="action">加急处理</div>
            </div>
            <div class="legacy-card normal">
              <div class="number">367</div>
              <div class="label">待签收</div>
              <div class="action">跟踪物流</div>
            </div>
          </div>
        </div>

        <!-- 订单及时率 -->
        <div class="efficiency-section">
          <h3>订单及时率</h3>
          <div class="efficiency-card">
            <div class="metric">
              <span class="value">0.2</span>
              <span class="unit">天</span>
            </div>
            <div class="description">近7天平均交付时长</div>
            <div class="benchmark">行业标准: 0.5天 | 当日达: 85%</div>
            <button class="action-btn success">总结快速交付经验</button>
          </div>
        </div>
      </div>

      <!-- 综合解读 - 采购流程 -->
      <div v-if="selectedObjectTab === 'comprehensive' && selectedProcessTab === 'procurement'" class="procurement-content">
        <div class="section-title">采购流程 - 供应链的"健康度"</div>
        
        <div class="procurement-metrics">
          <div class="metric-card">
            <div class="metric-header">
              <h3>在售商品数</h3>
              <span class="risk-level medium">中风险</span>
            </div>
            <div class="metric-value">10,003</div>
            <div class="metric-analysis">
              <p>商品数过多可能导致滞销/库存积压</p>
              <button class="action-btn">分析动销率</button>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <h3>年累计采购额</h3>
              <span class="risk-level high">高风险</span>
            </div>
            <div class="metric-value">56,384.83<span class="unit">万</span></div>
            <div class="metric-analysis">
              <p>超预算风险，可能造成资金压力</p>
              <button class="action-btn warning">启动采购复盘</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合解读 - 销售流程 -->
      <div v-if="selectedObjectTab === 'comprehensive' && selectedProcessTab === 'sales'" class="sales-content">
        <div class="section-title">销售流程 - 业绩的"晴雨表"</div>
        
        <div class="sales-metrics">
          <div class="metric-row">
            <div class="metric-item">
              <div class="metric-name">订单金额</div>
              <div class="metric-value">670.40<span class="unit">万</span></div>
              <div class="metric-change positive">↑122639.29%</div>
              <div class="health-status suspicious">存疑</div>
              <div class="analysis">需核查是否拆单/重复统计</div>
            </div>
            
            <div class="metric-item">
              <div class="metric-name">铺货商品数</div>
              <div class="metric-value">48</div>
              <div class="metric-change positive">↑154.84%</div>
              <div class="health-status healthy">健康</div>
              <div class="analysis">动销率高，继续铺货该类商品</div>
            </div>
            
            <div class="metric-item">
              <div class="metric-name">退货金额</div>
              <div class="metric-value">20<span class="unit">元</span></div>
              <div class="metric-change positive">↑199.29%</div>
              <div class="health-status low-risk">低风险</div>
              <div class="analysis">绝对值低，需核查退货原因</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合解读 - 拜访流程 -->
      <div v-if="selectedObjectTab === 'comprehensive' && selectedProcessTab === 'visit'" class="visit-content">
        <div class="section-title">拜访流程 - 客户触达的"密度"</div>
        
        <div class="visit-metrics">
          <div class="visit-overview">
            <div class="visit-stat">
              <div class="stat-value">7</div>
              <div class="stat-label">拜访客户数</div>
              <div class="stat-change">环比↑175%</div>
            </div>
            <div class="visit-analysis">
              <p>拜访量偏低，可能影响后续业绩</p>
              <button class="action-btn" @click="viewEmployeeVisits">看员工</button>
            </div>
          </div>
          
          <div class="visit-strategy">
            <h4>提升策略</h4>
            <ul>
              <li>制定拜访计划：每周≥10家</li>
              <li>与销售业绩挂钩考核</li>
              <li>对低拜访员工进行辅导</li>
              <li>对高拜访员工进行奖励</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 综合解读 - 资金流程 -->
      <div v-if="selectedObjectTab === 'comprehensive' && selectedProcessTab === 'finance'" class="finance-content">
        <div class="section-title">资金流程 - 企业的"生命线"</div>
        
        <div class="finance-metrics">
          <div class="finance-grid">
            <div class="finance-card healthy">
              <h4>回款金额</h4>
              <div class="amount">15,029.80<span class="unit">元</span></div>
              <div class="change positive">环比↑76.94%</div>
              <div class="status">增长健康</div>
              <button class="action-btn">加速催款</button>
            </div>
            
            <div class="finance-card warning">
              <h4>应收余额</h4>
              <div class="amount negative">-661,697.11<span class="unit">元</span></div>
              <div class="change">负值异常</div>
              <div class="status">需核查</div>
              <button class="action-btn warning">核查预收款合规性</button>
            </div>
            
            <div class="finance-card attention">
              <h4>员工利润</h4>
              <div class="amount negative">-674.96<span class="unit">元</span></div>
              <div class="change positive">环比↑109.73%</div>
              <div class="status">部分员工亏损</div>
              <button class="action-btn" @click="viewEmployeeProfit">定位亏损员工</button>
            </div>
            
            <div class="finance-card healthy">
              <h4>商品利润</h4>
              <div class="amount">676.04<span class="unit">元</span></div>
              <div class="change positive">环比↑90.25%</div>
              <div class="status">增长健康</div>
              <button class="action-btn">聚焦高利润商品</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他对象标签的内容 -->
      <div v-if="selectedObjectTab !== 'comprehensive'" class="other-content">
        <div class="coming-soon">
          <h3>{{ getCurrentTabName() }}</h3>
          <p>该模块正在开发中，敬请期待...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComprehensiveAnalysis',
  data() {
    return {
      selectedObjectTab: 'comprehensive',
      selectedProcessTab: 'fulfillment',
      objectTabs: [
        { id: 'comprehensive', name: '综合解读' },
        { id: 'employee', name: '员工' },
        { id: 'customer', name: '客户' },
        { id: 'product', name: '商品' },
        { id: 'finance', name: '资金' }
      ],
      processTabs: [
        { id: 'procurement', name: '采购' },
        { id: 'visit', name: '拜访' },
        { id: 'sales', name: '销售' },
        { id: 'fulfillment', name: '履约' },
        { id: 'finance', name: '资金' }
      ],
      fulfillmentProgress: [
        {
          date: '08-08',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 8, percentage: 40 },
            { type: 'pending-delivery', label: '待出库', count: 5, percentage: 25 },
            { type: 'pending-receipt', label: '待签收', count: 7, percentage: 35 }
          ]
        },
        {
          date: '08-09',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 12, percentage: 50 },
            { type: 'pending-delivery', label: '待出库', count: 6, percentage: 25 },
            { type: 'pending-receipt', label: '待签收', count: 6, percentage: 25 }
          ]
        },
        {
          date: '08-10',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 5, percentage: 25 },
            { type: 'pending-delivery', label: '待出库', count: 8, percentage: 40 },
            { type: 'pending-receipt', label: '待签收', count: 7, percentage: 35 }
          ]
        },
        {
          date: '08-11',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 3, percentage: 20 },
            { type: 'pending-delivery', label: '待出库', count: 4, percentage: 27 },
            { type: 'pending-receipt', label: '待签收', count: 8, percentage: 53 }
          ]
        },
        {
          date: '08-12',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 6, percentage: 30 },
            { type: 'pending-delivery', label: '待出库', count: 7, percentage: 35 },
            { type: 'pending-receipt', label: '待签收', count: 7, percentage: 35 }
          ]
        },
        {
          date: '08-13',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 4, percentage: 22 },
            { type: 'pending-delivery', label: '待出库', count: 6, percentage: 33 },
            { type: 'pending-receipt', label: '待签收', count: 8, percentage: 45 }
          ]
        },
        {
          date: '08-14',
          statuses: [
            { type: 'pending-review', label: '待审核', count: 2, percentage: 15 },
            { type: 'pending-delivery', label: '待出库', count: 3, percentage: 23 },
            { type: 'pending-receipt', label: '待签收', count: 8, percentage: 62 }
          ]
        }
      ]
    }
  },
  methods: {
    selectObjectTab(tabId) {
      this.selectedObjectTab = tabId
    },
    
    selectProcessTab(tabId) {
      this.selectedProcessTab = tabId
    },
    
    getCurrentTabName() {
      const objectTab = this.objectTabs.find(tab => tab.id === this.selectedObjectTab)
      const processTab = this.processTabs.find(tab => tab.id === this.selectedProcessTab)
      return `${objectTab?.name} - ${processTab?.name}`
    },
    
    viewEmployeeVisits() {
      // 跳转到员工拜访详情
      this.$router.push('/employee-visits')
    },
    
    viewEmployeeProfit() {
      // 跳转到员工利润分析
      this.$router.push('/employee-profit-analysis')
    },

    goBack() {
      // 返回主页
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.comprehensive-analysis {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: #333333;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.header-placeholder {
  width: 36px; /* 与返回按钮宽度相同，保持标题居中 */
}

/* 对象标签样式 */
.object-tabs {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 16px;
}

.tab-container {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.object-tab {
  flex-shrink: 0;
  padding: 16px 20px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.object-tab.active {
  color: #1677ff;
  border-bottom-color: #1677ff;
  font-weight: 600;
}

/* 流程标签样式 */
.process-tabs {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 16px;
}

.process-tab {
  flex-shrink: 0;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  border-radius: 20px;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.process-tab.active {
  background-color: #1677ff;
  color: #ffffff;
}

/* 内容区域 */
.content-area {
  padding: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1677ff;
}

/* 履约流程样式 */
.progress-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.daily-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.day-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date {
  width: 60px;
  font-weight: 500;
  color: #333333;
}

.progress-bar {
  flex: 1;
  height: 30px;
  background-color: #f5f5f5;
  border-radius: 15px;
  display: flex;
  overflow: hidden;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-bar.pending-review {
  background-color: #ff4d4f;
}

.status-bar.pending-delivery {
  background-color: #faad14;
}

.status-bar.pending-receipt {
  background-color: #1677ff;
}

/* 遗留数据样式 */
.legacy-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.legacy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.legacy-card {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.legacy-card.urgent {
  background-color: #fff2f0;
  border-left-color: #ff4d4f;
}

.legacy-card.warning {
  background-color: #fffbe6;
  border-left-color: #faad14;
}

.legacy-card.normal {
  background-color: #f6ffed;
  border-left-color: #52c41a;
}

.legacy-card .number {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}

.legacy-card .label {
  font-size: 14px;
  color: #666666;
  margin: 4px 0;
}

.legacy-card .action {
  font-size: 12px;
  color: #1677ff;
  cursor: pointer;
}

/* 效率指标样式 */
.efficiency-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.efficiency-card {
  text-align: center;
}

.metric {
  margin-bottom: 12px;
}

.metric .value {
  font-size: 36px;
  font-weight: 600;
  color: #52c41a;
}

.metric .unit {
  font-size: 18px;
  color: #666666;
  margin-left: 4px;
}

.description {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.benchmark {
  font-size: 12px;
  color: #999999;
  margin-bottom: 16px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.success {
  background-color: #52c41a;
  color: #ffffff;
}

.action-btn.warning {
  background-color: #faad14;
  color: #ffffff;
}

.action-btn:hover {
  opacity: 0.8;
}

/* 其他内容样式 */
.other-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.coming-soon h3 {
  color: #333333;
  margin-bottom: 16px;
}

.coming-soon p {
  color: #666666;
}

/* 采购流程样式 */
.procurement-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.metric-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
}

.risk-level {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.risk-level.high {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.risk-level.medium {
  background-color: #fffbe6;
  color: #faad14;
}

.risk-level.low {
  background-color: #f6ffed;
  color: #52c41a;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.metric-value .unit {
  font-size: 16px;
  color: #666666;
  margin-left: 4px;
}

.metric-analysis p {
  color: #666666;
  font-size: 14px;
  margin-bottom: 12px;
}

/* 销售流程样式 */
.sales-metrics {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.metric-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fafafa;
}

.metric-name {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.metric-change.positive {
  color: #52c41a;
}

.metric-change.negative {
  color: #ff4d4f;
}

.health-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.health-status.healthy {
  background-color: #f6ffed;
  color: #52c41a;
}

.health-status.suspicious {
  background-color: #fffbe6;
  color: #faad14;
}

.health-status.low-risk {
  background-color: #e6f7ff;
  color: #1677ff;
}

.analysis {
  font-size: 12px;
  color: #666666;
}

/* 拜访流程样式 */
.visit-metrics {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.visit-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.visit-stat {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #1677ff;
}

.stat-label {
  font-size: 14px;
  color: #666666;
  margin: 4px 0;
}

.stat-change {
  font-size: 12px;
  color: #52c41a;
}

.visit-analysis {
  flex: 1;
  margin-left: 40px;
}

.visit-analysis p {
  color: #666666;
  margin-bottom: 12px;
}

.visit-strategy h4 {
  color: #333333;
  margin-bottom: 12px;
}

.visit-strategy ul {
  list-style: none;
  padding: 0;
}

.visit-strategy li {
  padding: 8px 0;
  color: #666666;
  border-bottom: 1px solid #f5f5f5;
}

.visit-strategy li:before {
  content: "•";
  color: #1677ff;
  margin-right: 8px;
}

/* 资金流程样式 */
.finance-metrics {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.finance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.finance-card {
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid;
}

.finance-card.healthy {
  background-color: #f6ffed;
  border-left-color: #52c41a;
}

.finance-card.warning {
  background-color: #fff2f0;
  border-left-color: #ff4d4f;
}

.finance-card.attention {
  background-color: #fffbe6;
  border-left-color: #faad14;
}

.finance-card h4 {
  margin: 0 0 12px 0;
  color: #333333;
  font-size: 14px;
}

.finance-card .amount {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.finance-card .amount.negative {
  color: #ff4d4f;
}

.finance-card .amount .unit {
  font-size: 14px;
  color: #666666;
  margin-left: 4px;
}

.finance-card .change {
  font-size: 12px;
  color: #52c41a;
  margin-bottom: 8px;
}

.finance-card .status {
  font-size: 12px;
  color: #666666;
  margin-bottom: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-area {
    padding: 12px;
  }

  .legacy-cards {
    grid-template-columns: 1fr;
  }

  .day-item {
    flex-direction: column;
    align-items: stretch;
  }

  .date {
    width: auto;
    text-align: center;
    margin-bottom: 8px;
  }

  .procurement-metrics {
    grid-template-columns: 1fr;
  }

  .metric-row {
    grid-template-columns: 1fr;
  }

  .visit-overview {
    flex-direction: column;
    text-align: center;
  }

  .visit-analysis {
    margin-left: 0;
    margin-top: 20px;
  }

  .finance-grid {
    grid-template-columns: 1fr;
  }
}
</style>
