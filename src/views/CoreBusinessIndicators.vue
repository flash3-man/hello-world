<template>
  <div class="core-business-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
        </button>
      </div>
      <div class="nav-center">
        <span class="nav-title">核心业务指标</span>
      </div>
      <div class="nav-right">
        <button class="more-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-content">
        <div class="report-info">
          <h1 class="report-title">核心业务指标<br>报告</h1>
          <p class="report-date">更新时间：{{ currentDate }}</p>
        </div>
        <div class="report-icon">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="30" width="60" height="40" rx="8" fill="#4A90E2" opacity="0.8"/>
            <rect x="15" y="25" width="70" height="45" rx="8" fill="#5BA0F2" opacity="0.6"/>
            <rect x="10" y="20" width="80" height="50" rx="8" fill="#6BB0FF" opacity="0.4"/>
            <circle cx="75" cy="25" r="8" fill="#FF6B6B"/>
            <path d="M30 45 L40 35 L50 40 L60 30 L70 35" stroke="white" stroke-width="2" fill="none"/>
          </svg>
        </div>
      </div>
      
      <!-- 时间选择器 -->
      <div class="time-selector">
        <button 
          class="time-btn" 
          :class="{ active: selectedPeriod === 'month' }"
          @click="selectedPeriod = 'month'"
        >
          本月
        </button>
        <button 
          class="time-btn" 
          :class="{ active: selectedPeriod === 'lastMonth' }"
          @click="selectedPeriod = 'lastMonth'"
        >
          上月
        </button>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tab-navigation">
      <div class="tab-container">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 概要标签页 -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <div class="empty-state">
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
              <!-- 人物插画 -->
              <ellipse cx="100" cy="180" rx="60" ry="8" fill="#E8F4FD"/>
              <rect x="80" y="120" width="40" height="60" rx="20" fill="#4A90E2"/>
              <circle cx="100" cy="80" r="25" fill="#FFB366"/>
              <path d="M85 75 Q100 65 115 75" stroke="#333" stroke-width="2" fill="none"/>
              <circle cx="92" cy="78" r="2" fill="#333"/>
              <circle cx="108" cy="78" r="2" fill="#333"/>
              <!-- 图表元素 -->
              <rect x="130" y="100" width="50" height="30" rx="4" fill="#6BB0FF" opacity="0.7"/>
              <rect x="135" y="90" width="40" height="35" rx="4" fill="#5BA0F2" opacity="0.8"/>
              <circle cx="155" cy="85" r="3" fill="#FF6B6B"/>
              <!-- 装饰元素 -->
              <path d="M20 60 Q30 50 40 60" stroke="#4A90E2" stroke-width="2" fill="none" opacity="0.5"/>
              <circle cx="170" cy="50" r="4" fill="#FFB366" opacity="0.6"/>
              <rect x="25" y="140" width="15" height="8" rx="2" fill="#6BB0FF" opacity="0.5"/>
            </svg>
          </div>
          <p class="empty-text">暂无数据，请稍后查看～</p>
        </div>
      </div>

      <!-- 投资效率标签页 -->
      <div v-if="activeTab === 'investment'" class="tab-content">
        <div class="empty-state">
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
              <ellipse cx="100" cy="180" rx="60" ry="8" fill="#E8F4FD"/>
              <rect x="80" y="120" width="40" height="60" rx="20" fill="#4A90E2"/>
              <circle cx="100" cy="80" r="25" fill="#FFB366"/>
              <path d="M85 75 Q100 65 115 75" stroke="#333" stroke-width="2" fill="none"/>
              <circle cx="92" cy="78" r="2" fill="#333"/>
              <circle cx="108" cy="78" r="2" fill="#333"/>
              <rect x="130" y="100" width="50" height="30" rx="4" fill="#6BB0FF" opacity="0.7"/>
              <rect x="135" y="90" width="40" height="35" rx="4" fill="#5BA0F2" opacity="0.8"/>
              <circle cx="155" cy="85" r="3" fill="#FF6B6B"/>
              <path d="M20 60 Q30 50 40 60" stroke="#4A90E2" stroke-width="2" fill="none" opacity="0.5"/>
              <circle cx="170" cy="50" r="4" fill="#FFB366" opacity="0.6"/>
              <rect x="25" y="140" width="15" height="8" rx="2" fill="#6BB0FF" opacity="0.5"/>
            </svg>
          </div>
          <p class="empty-text">暂无数据，请稍后查看～</p>
        </div>
      </div>

      <!-- 销售效率标签页 -->
      <div v-if="activeTab === 'sales'" class="tab-content">
        <div class="empty-state">
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
              <ellipse cx="100" cy="180" rx="60" ry="8" fill="#E8F4FD"/>
              <rect x="80" y="120" width="40" height="60" rx="20" fill="#4A90E2"/>
              <circle cx="100" cy="80" r="25" fill="#FFB366"/>
              <path d="M85 75 Q100 65 115 75" stroke="#333" stroke-width="2" fill="none"/>
              <circle cx="92" cy="78" r="2" fill="#333"/>
              <circle cx="108" cy="78" r="2" fill="#333"/>
              <rect x="130" y="100" width="50" height="30" rx="4" fill="#6BB0FF" opacity="0.7"/>
              <rect x="135" y="90" width="40" height="35" rx="4" fill="#5BA0F2" opacity="0.8"/>
              <circle cx="155" cy="85" r="3" fill="#FF6B6B"/>
              <path d="M20 60 Q30 50 40 60" stroke="#4A90E2" stroke-width="2" fill="none" opacity="0.5"/>
              <circle cx="170" cy="50" r="4" fill="#FFB366" opacity="0.6"/>
              <rect x="25" y="140" width="15" height="8" rx="2" fill="#6BB0FF" opacity="0.5"/>
            </svg>
          </div>
          <p class="empty-text">暂无数据，请稍后查看～</p>
        </div>
      </div>

      <!-- 合规效率标签页 -->
      <div v-if="activeTab === 'compliance'" class="tab-content">
        <div class="compliance-content">
          <!-- 顶部导航 -->
          <div class="compliance-nav">
            <button class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
            </button>
          </div>
          
          <!-- 概览卡片 -->
          <div class="overview-card">
            <h3 class="card-title">概览</h3>
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-label">自身来源</span>
                <span class="metric-value">-</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">体系同行</span>
                <span class="metric-value">-</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">同行中位数</span>
                <span class="metric-value">-</span>
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
  name: 'CoreBusinessIndicators',
  data() {
    return {
      activeTab: 'overview',
      selectedPeriod: 'month',
      tabs: [
        { key: 'overview', label: '概要' },
        { key: 'investment', label: '投资效率' },
        { key: 'sales', label: '销售效率' },
        { key: 'compliance', label: '合规效率' }
      ]
    }
  },
  computed: {
    currentDate() {
      const now = new Date()
      return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.core-business-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #A8E6CF 0%, #E8F8F5 100%);
  position: relative;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: transparent;
  position: relative;
  z-index: 10;
}

.back-btn, .more-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.back-btn:hover, .more-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 头部区域 */
.header-section {
  padding: 20px 16px 30px;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.report-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
  margin: 0 0 8px 0;
}

.report-date {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.report-icon {
  flex-shrink: 0;
  margin-left: 20px;
}

/* 时间选择器 */
.time-selector {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.time-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-btn.active {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.time-btn:hover:not(.active) {
  background: #f5f5f5;
}

/* 标签页导航 */
.tab-navigation {
  background: white;
  border-radius: 12px 12px 0 0;
  margin: 0 16px;
  overflow: hidden;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.tab-container {
  display: flex;
  background: #f8f9fa;
  padding: 4px;
}

.tab-item {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.tab-item.active {
  background: white;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #4A90E2;
  border-radius: 2px;
}

/* 内容区域 */
.content-area {
  background: white;
  margin: 0 16px;
  border-radius: 0 0 12px 12px;
  min-height: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 20px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.empty-illustration {
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin: 0;
}

/* 合规效率内容 */
.compliance-content {
  min-height: 300px;
}

.compliance-nav {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  border: none;
  background: #f0f0f0;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.nav-icon:hover {
  background: #e0e0e0;
}

.overview-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.metric-item {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.metric-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .report-icon {
    margin: 20px 0 0 0;
    align-self: flex-end;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tab-item {
    font-size: 12px;
    padding: 10px 6px;
  }
}
</style>
