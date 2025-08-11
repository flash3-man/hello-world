<template>
  <div class="monthly-report">
    <!-- 顶部导航区 -->
    <div class="top-navigation">
      <button class="back-arrow" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M12 16L6 10L12 4" stroke="#333333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="report-mode" @click="toggleReportMode">
        <span class="mode-text">{{ currentMode }}</span>
        <svg class="mode-arrow" width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1L6 6L11 1" stroke="#666666" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
      
      <div class="title-area">
        <h1 class="main-title">我的经营月报</h1>
        <p class="sub-title">每日8:00更新</p>
        <div class="month-switcher">
          <button 
            class="month-btn" 
            :class="{ active: selectedMonth === 'current' }"
            @click="switchMonth('current')"
          >
            本月
          </button>
          <span class="month-divider">|</span>
          <button 
            class="month-btn" 
            :class="{ active: selectedMonth === 'last' }"
            @click="switchMonth('last')"
          >
            上月
          </button>
        </div>
        <p class="time-range">{{ currentTimeRange }}</p>
      </div>
    </div>

    <!-- 模式切换下拉菜单 -->
    <div v-if="showModeMenu" class="mode-menu-overlay" @click="showModeMenu = false">
      <div class="mode-menu" @click.stop>
        <div 
          v-for="mode in reportModes" 
          :key="mode.value"
          class="mode-option"
          :class="{ active: selectedReportMode === mode.value }"
          @click="selectReportMode(mode.value)"
        >
          {{ mode.label }}
        </div>
      </div>
    </div>

    <!-- 经营风险区 -->
    <div class="risk-section">
      <div class="section-header">
        <div class="section-title">
          <svg class="risk-icon" width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 2L13 8L19 9L14.5 13.5L16 19L10 16L4 19L5.5 13.5L1 9L7 8L10 2Z" fill="#FF3333"/>
          </svg>
          <span class="title-text">经营风险</span>
        </div>
        <button class="broadcast-btn" @click="broadcastRisks">
          <svg class="broadcast-icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 6H1V10H3L7 12V4L3 6Z" fill="#3399FF"/>
          </svg>
          <span class="broadcast-text">播报</span>
        </button>
      </div>
      
      <div class="risk-list">
        <div 
          v-for="(risk, index) in riskItems" 
          :key="index"
          class="risk-item"
          @click="handleRiskClick(risk)"
        >
          <span class="risk-number">{{ index + 1 }}</span>
          <span class="risk-content" v-html="risk.content"></span>
          <svg class="risk-arrow" width="16" height="16" viewBox="0 0 16 16">
            <path d="M6 4L10 8L6 12" stroke="#999999" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 业务数据区 -->
    <div class="data-section">
      <div class="section-header">
        <div class="section-title">
          <svg class="data-icon" width="20" height="20" viewBox="0 0 20 20">
            <rect x="2" y="3" width="16" height="14" rx="2" fill="none" stroke="#3399FF" stroke-width="1.5"/>
          </svg>
          <span class="title-text">业务数据</span>
        </div>
        <button class="indicator-help" @click="showIndicatorHelp">
          <span class="help-text">指标说明</span>
          <svg class="help-icon" width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="#999999" stroke-width="1"/>
            <text x="7" y="10" text-anchor="middle" font-size="8" fill="#999999">?</text>
          </svg>
        </button>
        <button class="broadcast-btn" @click="broadcastData">
          <svg class="broadcast-icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M3 6H1V10H3L7 12V4L3 6Z" fill="#3399FF"/>
          </svg>
          <span class="broadcast-text">播报</span>
        </button>
      </div>
      
      <div class="data-list">
        <div 
          v-for="(item, index) in dataItems" 
          :key="index"
          class="data-item"
        >
          <div class="data-main">
            <span class="data-label">{{ item.label }}</span>
            <span class="data-value">{{ item.value }}</span>
          </div>
          <div class="data-comparison">
            <span class="comparison-text">{{ item.comparison }}</span>
          </div>
          <button v-if="item.actionText" class="data-action" @click="handleDataAction(item)">
            {{ item.actionText }}
          </button>
        </div>
      </div>
    </div>

    <!-- 底部收尾区 -->
    <div class="bottom-footer">
      <span class="footer-text">已经到底了～</span>
    </div>

    <!-- 指标说明弹窗 -->
    <div v-if="showIndicatorModal" class="modal-overlay" @click="showIndicatorModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">指标说明</h3>
          <button class="modal-close" @click="showIndicatorModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="indicator-item" v-for="indicator in indicators" :key="indicator.name">
            <strong>{{ indicator.name }}：</strong>{{ indicator.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlyReport',
  data() {
    return {
      showModeMenu: false,
      selectedReportMode: 'brief',
      currentMode: '简报模式',
      reportModes: [
        { value: 'brief', label: '简报模式' },
        { value: 'detailed', label: '详细模式' }
      ],
      selectedMonth: 'current',
      currentTimeRange: '06-01~06-20',
      riskItems: [
        {
          content: '<span style="color: #FF6600; font-weight: bold;">4</span>个目标进度有点慢呦',
          action: 'goal-management'
        },
        {
          content: '有<span style="color: #FF6600; font-weight: bold;">7</span>个客户利润为负',
          action: 'customer-analysis'
        },
        {
          content: '昨日新增<span style="color: #FF6600; font-weight: bold;">1</span>个客户最近90天无销售',
          action: 'customer-analysis'
        },
        {
          content: '上月的单据，还有<span style="color: #FF6600; font-weight: bold;">19</span>个客户未结清，共计<span style="color: #FF3333; font-weight: bold;">126,773.18元</span>',
          action: 'financial-report'
        }
      ],
      dataItems: [
        {
          label: '净销售额',
          value: '37,188.06元',
          comparison: '环比+74.72% 同比+78.84%',
          actionText: '查看业务变化分析',
          action: 'performance-analysis'
        },
        {
          label: '客户利润',
          value: '24,028.39元',
          comparison: '环比+45.33% 同比+62.17%',
          actionText: '查看客户利润榜',
          action: 'customer-profit-ranking'
        },
        {
          label: '铺货客户总数',
          value: '33个',
          comparison: '环比+12.00% 同比+22.22%',
          actionText: '查看员工情况',
          action: 'employee-analysis'
        },
        {
          label: '铺货品牌',
          value: '17个品牌',
          comparison: '环比+6.25% 同比+13.33%',
          actionText: '查看品牌铺货情况',
          action: 'brand-analysis'
        },
        {
          label: '铺货商品',
          value: '36个商品',
          comparison: '环比+9.09% 同比+20.00%',
          actionText: '查看商品铺货情况',
          action: 'product-analysis'
        },
        {
          label: '回款金额',
          value: '23,258.48元',
          comparison: '环比+38.92% 同比+55.73%',
          actionText: '查看客户回款榜',
          action: 'payment-analysis'
        },
        {
          label: '拜访客户',
          value: '11个',
          comparison: '环比+22.22% 同比+37.50%',
          actionText: '查看业绩变化分析',
          action: 'performance-analysis'
        },
        {
          label: '客户数',
          value: '45个',
          comparison: '环比+15.38% 同比+28.57%',
          actionText: '查看客户分析',
          action: 'customer-analysis'
        }
      ],
      indicators: [
        { name: '净销售额', description: '销售金额 - 退货金额' },
        { name: '客户利润', description: '回款 - 成本（成本含商品、服务、营销）' },
        { name: '铺货客户', description: '有商品库存的客户数量（去重）' },
        { name: '回款金额', description: '本月到账的所有客户回款总和' },
        { name: '拜访客户', description: '本月完成拜访的客户数量（去重）' }
      ],
      showIndicatorModal: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toggleReportMode() {
      this.showModeMenu = !this.showModeMenu
    },
    selectReportMode(mode) {
      this.selectedReportMode = mode
      this.currentMode = mode === 'brief' ? '简报模式' : '详细模式'
      this.showModeMenu = false
    },
    switchMonth(month) {
      this.selectedMonth = month
      if (month === 'current') {
        this.currentTimeRange = '06-01~06-20'
      } else {
        this.currentTimeRange = '05-01~05-31'
      }
    },
    handleRiskClick(risk) {
      switch(risk.action) {
        case 'goal-management':
          this.$router.push('/goal-management')
          break
        case 'customer-analysis':
          this.$router.push('/customer-analysis')
          break
        default:
          alert('功能开发中...')
      }
    },
    handleDataAction(item) {
      switch(item.action) {
        case 'performance-analysis':
          this.$router.push('/performance-analysis')
          break
        case 'employee-analysis':
          this.$router.push('/employee-analysis')
          break
        case 'customer-analysis':
          this.$router.push('/customer-analysis')
          break
        case 'product-analysis':
          this.$router.push('/product-analysis')
          break
        default:
          alert('功能开发中...')
      }
    },
    broadcastRisks() {
      alert('风险播报功能')
    },
    broadcastData() {
      alert('数据播报功能')
    },
    showIndicatorHelp() {
      this.showIndicatorModal = true
    }
  }
}
</script>

<style scoped>
.monthly-report {
  min-height: 100vh;
  background: linear-gradient(to bottom, #FFF5E6 0%, #FFFDFA 50%, #FFFFFF 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding-bottom: 24px;
}

.top-navigation {
  height: 48px;
  position: relative;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-arrow {
  position: absolute;
  left: 16px;
  top: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
}

.report-mode {
  position: absolute;
  right: 24px;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.mode-text {
  color: #666666;
  font-size: 14px;
}

.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 20px;
}

.main-title {
  background: linear-gradient(to bottom, #FF9B37, #FF6D00);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.sub-title {
  color: #999999;
  font-size: 12px;
  margin: 0;
}

.month-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.month-btn {
  background: none;
  border: none;
  color: #CCCCCC;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
}

.month-btn.active {
  color: #FF9933;
  font-weight: 500;
}

.month-divider {
  color: #CCCCCC;
}

.time-range {
  color: #333333;
  font-size: 13px;
  margin: 8px 0 0 0;
}

.mode-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
}

.mode-menu {
  position: absolute;
  top: 60px;
  right: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
}

.mode-option {
  padding: 12px 16px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}

.mode-option:hover {
  background-color: #f8f9fa;
}

.mode-option.active {
  background-color: #f0f8ff;
  color: #3399FF;
}

.risk-section, .data-section {
  margin: 24px 16px 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  color: #FF6600;
  font-size: 16px;
  font-weight: bold;
}

.broadcast-btn, .indicator-help {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
}

.broadcast-text {
  color: #3399FF;
  font-size: 14px;
}

.help-text {
  color: #999999;
  font-size: 13px;
}

.risk-list, .data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-item {
  background: #FFFFFF;
  border: 1px solid #ECECEC;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-height: 40px;
}

.risk-number {
  color: #FF6600;
  font-weight: bold;
  font-size: 15px;
  margin-right: 8px;
  min-width: 20px;
}

.risk-content {
  flex: 1;
  color: #333333;
  font-size: 14px;
}

.risk-arrow {
  margin-left: 8px;
}

.data-item {
  background: #FFFFFF;
  border: 1px solid #F5F5F5;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-label, .data-value {
  color: #333333;
  font-size: 15px;
  font-weight: bold;
}

.comparison-text {
  color: #666666;
  font-size: 13px;
}

.data-action {
  background: none;
  border: none;
  color: #3399FF;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  text-align: left;
}

.bottom-footer {
  text-align: center;
  margin-top: 24px;
  padding: 20px;
}

.footer-text {
  color: #CCCCCC;
  font-size: 13px;
}

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
  padding: 20px;
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-title {
  margin: 0;
  color: #333333;
  font-size: 18px;
  font-weight: bold;
}

.modal-close {
  background: none;
  border: none;
  color: #999999;
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

.modal-body {
  padding: 20px;
}

.indicator-item {
  margin-bottom: 16px;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
}
</style>
