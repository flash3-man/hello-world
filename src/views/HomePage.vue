<template>
  <div class="home-page">
    <!-- 顶部区域：小人Logo + 动态预警 + 搜索 -->
    <div class="top-navigation-bar">
      <!-- 左侧：AI助手Logo（语音播报入口） -->
      <div class="voice-info-logo" @click="playVoiceInfo">
        <div class="logo-icon" :class="{ 'has-unread': hasUnreadInfo }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM14 21V19H16L19 22H17V24H21V22L18 19H21V17H14V21Z"/>
          </svg>
        </div>
        <div v-if="hasUnreadInfo" class="unread-dot"></div>
      </div>
      
      <!-- 中间：动态预警提示条 -->
      <div class="alert-banner" :class="alertPriorityClass" @click="showExceptionDetails">
        <span class="alert-text">{{ currentAlert.message }}</span>
      </div>
      
      <!-- 右侧：搜索功能 -->
      <div class="search-container" @click="openSearchModal">
        <span class="search-placeholder">搜索</span>
        <div class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <div v-if="showSearchModal" class="search-modal-overlay" @click="closeSearchModal">
      <div class="search-modal" @click.stop>
        <div class="search-modal-header">
          <h3>搜索</h3>
          <button class="close-btn" @click="closeSearchModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="search-modal-content">
          <div class="search-input-container">
            <input 
              ref="searchModalInput"
              type="text" 
              v-model="searchKeyword" 
              placeholder="输入客户名称、订单编号、员工姓名等"
              class="search-modal-input"
              @keyup.enter="performSearchInModal"
            >
            <button class="search-btn" @click="performSearchInModal">搜索</button>
          </div>
          
          <!-- 搜索结果 -->
          <div v-if="searchResults.length > 0" class="search-results-section">
            <div class="results-header">
              找到 {{ searchResults.length }} 条结果
            </div>
            <div class="search-results">
              <div 
                v-for="result in searchResults" 
                :key="result.id"
                class="search-result-item"
                @click="handleSearchResult(result)"
              >
                <span class="result-type">{{ result.type }}</span>
                <span class="result-title">{{ result.title }}</span>
                <span class="result-desc">{{ result.description }}</span>
              </div>
            </div>
          </div>
          
          <!-- 无结果提示 -->
          <div v-else-if="searchKeyword && hasSearched" class="no-results">
            <div class="no-results-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <div class="no-results-text">未找到相关结果</div>
            <div class="no-results-tip">请尝试其他关键词</div>
          </div>
          
          <!-- 搜索建议 -->
          <div v-else class="search-suggestions">
            <div class="suggestions-title">搜索建议</div>
            <div class="suggestion-item" @click="searchKeyword = '张三'; performSearchInModal()">客户：张三</div>
            <div class="suggestion-item" @click="searchKeyword = 'ORD2024'; performSearchInModal()">订单：ORD2024***</div>
            <div class="suggestion-item" @click="searchKeyword = '黄保杰'; performSearchInModal()">员工：黄保杰</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果面板（保留原来的，但不再使用） -->
    <div v-if="false" class="search-results-overlay">
      <div class="search-results-panel">
        <div class="results-header">
          <span class="results-count">找到 {{ searchResults.length }} 条结果</span>
          <button class="clear-search" @click="clearSearch">✕</button>
        </div>
        <div class="search-results">
          <div 
            v-for="result in searchResults" 
            :key="result.id"
            class="search-result-item"
            @click="handleSearchResult(result)"
          >
            <span class="result-type">{{ result.type }}</span>
            <span class="result-title">{{ result.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 二、核心数据看板（经营核心数据） -->
    <div class="data-dashboard-section">
      <!-- 第一行：主要销售数据对比 -->
      <div class="main-sales-row">
        <div class="sales-group">
          <div class="sales-card primary" @click="showDataDetail('current-month-sales')">
            <div class="sales-label">本月销售金额</div>
            <div class="sales-value">38,144.74</div>
            <div class="sales-unit">元</div>
          </div>
          <div class="sales-card secondary" @click="showDataDetail('last-month-sales')">
            <div class="sales-label">上月</div>
            <div class="sales-value small">227,356.95</div>
            <div class="sales-unit">元</div>
          </div>
        </div>
        
        <div class="sales-group">
          <div class="sales-card primary" @click="showDataDetail('today-sales')">
            <div class="sales-label">今日销售金额</div>
            <div class="sales-value">5,580.00</div>
            <div class="sales-unit">元</div>
          </div>
          <div class="sales-card secondary" @click="showDataDetail('yesterday-sales')">
            <div class="sales-label">昨日</div>
            <div class="sales-value small">3,294.34</div>
            <div class="sales-unit">元</div>
          </div>
        </div>
      </div>

      <!-- 第二行：细分数据栏 -->
      <div class="detail-data-section">
        <div class="section-header" @click="toggleDetailView">
          <span class="section-title">经营详情</span>
          <span class="toggle-icon" :class="{ expanded: showDetailData }">▼</span>
        </div>
        
        <div v-show="showDetailData" class="detail-data-grid">
          <div class="detail-card" @click="showDataDetail('net-sales')">
            <div class="detail-label">本月净销售额</div>
            <div class="detail-value">37,188.06</div>
            <div class="detail-unit">元</div>
          </div>
          
          <div class="detail-card" @click="showDataDetail('settled-sales')">
            <div class="detail-label">本月销售已结</div>
            <div class="detail-value">17,038.58</div>
            <div class="detail-unit">元</div>
          </div>
          
          <div class="detail-card" @click="showDataDetail('return-amount')">
            <div class="detail-label">本月退货金额</div>
            <div class="detail-value negative">956.68</div>
            <div class="detail-unit">元</div>
          </div>
          
          <div class="detail-card" @click="showDataDetail('unsettled-sales')">
            <div class="detail-label">本月销售未结</div>
            <div class="detail-value">20,149.48</div>
            <div class="detail-unit">元</div>
          </div>
          
          <div class="detail-card" @click="showDataDetail('receivables')">
            <div class="detail-label">应收余额</div>
            <div class="detail-value warning">419,596.78</div>
            <div class="detail-unit">元</div>
          </div>
          
          <div class="detail-card highlight" @click="showDataDetail('customer-payment')">
            <div class="detail-label">本月客户回款</div>
            <div class="detail-value">23,258.48</div>
            <div class="detail-unit">元</div>
            <div class="detail-supplement">含今日：232.00元</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据详情弹窗 -->
    <div v-if="showDataModal" class="data-modal-overlay" @click="showDataModal = false">
      <div class="data-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ currentDataDetail.title }}</h3>
          <button class="modal-close" @click="showDataModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <div class="calculation-logic">
            <h4>计算逻辑</h4>
            <p>{{ currentDataDetail.formula }}</p>
          </div>
          <div class="detail-breakdown">
            <h4>数据构成</h4>
            <div 
              v-for="item in currentDataDetail.breakdown" 
              :key="item.id"
              class="breakdown-item"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="view-detail-btn" @click="viewDetailPage(currentDataDetail.type)">
            查看明细
          </button>
        </div>
      </div>
    </div>

    <!-- 三、快速功能入口区域（工具快捷触达区） -->
    <div class="quick-functions-section">
      <div class="functions-header">
        <span class="section-title">快速功能</span>
        <button class="all-functions-btn" @click="showAllFunctions">全部</button>
      </div>
      
      <!-- 宫格布局 -->
      <div class="functions-grid">
        <!-- 第一行 -->
        <div class="function-row">
          <div 
            v-for="func in displayedFunctions.slice(0, 4)" 
            :key="func.id"
            class="function-item"
            @click="navigateToFunction(func.route)"
          >
            <div class="function-icon" v-html="getIconComponent(func.icon).template">
            </div>
            <div class="function-name">{{ func.name }}</div>
          </div>
        </div>
        
        <!-- 第二行 -->
        <div class="function-row">
          <div 
            v-for="func in displayedFunctions.slice(4, 8)" 
            :key="func.id"
            class="function-item"
            @click="navigateToFunction(func.route)"
          >
            <div class="function-icon" v-html="getIconComponent(func.icon).template">
            </div>
            <div class="function-name">{{ func.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全功能配置页面 -->
    <div v-if="showFunctionConfig" class="function-config-overlay" @click="showFunctionConfig = false">
      <div class="function-config-panel" @click.stop>
        <div class="config-header">
          <h3>功能配置</h3>
          <button class="config-close" @click="showFunctionConfig = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="config-content">
          <!-- 已选快捷功能 -->
          <div class="selected-functions">
            <h4>已选快捷功能（可拖拽排序）</h4>
            <div class="selected-grid">
              <div 
                v-for="(func, index) in selectedFunctionsList" 
                :key="func.id"
                class="selected-function-item"
                :draggable="true"
                @dragstart="handleDragStart(index)"
                @dragover.prevent
                @drop="handleDrop(index)"
              >
                <span class="function-icon-small" v-html="getIconComponent(func.icon).template"></span>
                <span class="function-name">{{ func.name }}</span>
                <button class="remove-btn" @click="removeFunction(func.id)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 未选功能清单 -->
          <div class="available-functions">
            <h4>
              功能清单
              <input 
                type="text" 
                v-model="functionSearchKeyword" 
                placeholder="搜索功能..." 
                class="function-search"
              >
            </h4>
            <div class="available-grid">
              <div 
                v-for="func in filteredAvailableFunctions" 
                :key="func.id"
                class="available-function-item"
                @click="addFunction(func.id)"
              >
                <span class="function-icon-small" v-html="getIconComponent(func.icon).template"></span>
                <span class="function-name">{{ func.name }}</span>
                <span class="add-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="config-actions">
          <button class="save-config-btn" @click="saveFunctionConfiguration">保存配置</button>
        </div>
      </div>
    </div>

    <!-- 四、进行中的目标汇总区域（业务目标追踪区） -->
    <div class="goals-tracking-section">
      <div class="goals-header">
        <div class="goals-title">
          <span class="title-text">{{ activeGoalsList.length }}个目标进行中</span>
          <button class="view-all-goals" @click="viewAllGoals">查看全部</button>
        </div>
      </div>

      <div class="goals-list">
        <div 
          v-for="goal in activeGoalsList" 
          :key="goal.id"
          class="goal-card"
          @click="viewGoalDetail(goal.id)"
        >
          <!-- 1. 目标基础信息栏 -->
          <div class="goal-info-bar">
            <div class="goal-name-period">
              <span class="goal-name">{{ goal.name }}</span>
              <span class="goal-period">{{ goal.period }}</span>
            </div>
            <div class="goal-operations" v-if="goal.hasPermission">
              <button class="edit-goal" @click.stop="editGoal(goal.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="delete-goal" @click.stop="deleteGoal(goal.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
              <button class="more-goal" @click.stop="moreGoalOptions(goal.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="19" cy="12" r="1"/>
                  <circle cx="5" cy="12" r="1"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 2. 核心数据进度栏 -->
          <div class="goal-progress-bar">
            <div class="progress-data">
              <div class="data-item">
                <span class="data-label">目标(元)</span>
                <span class="data-value">{{ goal.target }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">已完成(元)</span>
                <span class="data-value completed">{{ goal.completed }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">差额(元)</span>
                <span class="data-value" :class="getGoalDifferenceClass(goal.difference)">
                  {{ goal.difference }}
                </span>
              </div>
            </div>
            
            <!-- 完成率进度条 -->
            <div class="completion-indicator">
              <div class="completion-text">
                <span>完成率：{{ goal.completionRate }}</span>
                <span class="achievement-icon" v-if="parseFloat(goal.completionRate) >= 100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
              </div>
              <div class="progress-visual">
                <div 
                  class="progress-fill" 
                  :class="getProgressTypeClass(goal.completionRate)"
                  :style="{ width: getProgressWidth(goal.completionRate) }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 3. 操作入口栏 -->
          <div class="goal-action-bar">
            <button 
              class="department-performance-btn"
              @click.stop="viewDepartmentPerformance(goal.id)"
            >
              看部门表现
            </button>
            <button 
              class="employee-performance-btn"
              @click.stop="viewEmployeePerformance(goal.id)"
            >
              看员工表现
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 五、底部导航栏（全局页面切换） -->
    <div class="bottom-navigation">
      <div
        class="nav-item"
        :class="{ active: currentPage === 'home' }"
        @click="navigateToPage('home')"
      >
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <div class="nav-label">首页</div>
      </div>
      <div
        class="nav-item"
        :class="{ active: currentPage === 'focus' }"
        @click="navigateToPage('focus')"
      >
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
        <div class="nav-label">关注</div>
      </div>
      <div
        class="nav-item"
        :class="{ active: currentPage === 'analysis' }"
        @click="navigateToPage('analysis')"
      >
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
          </svg>
        </div>
        <div class="nav-label">解读</div>
      </div>
      <div
        class="nav-item"
        :class="{ active: currentPage === 'profile' }"
        @click="navigateToPage('profile')"
      >
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
        </div>
        <div class="nav-label">我的</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // 当前页面状态
      currentPage: 'home',
      
      // 语音播报相关
      hasUnreadInfo: true,
      isSearchActive: false,
      
      // 搜索弹窗相关
      showSearchModal: false,
      searchKeyword: '',
      hasSearched: false,
      
      // 动态预警信息
      currentAlert: {
        type: 'business_exception', // 预警类型：business_exception, inventory_warning, payment_abnormal
        message: '小易监控到新的经营异常',
        priority: 'high', // high, medium, low
        details: {
          category: '经营异常',
          description: '检测到销售额异常下滑，建议查看客户流失情况',
          affectedData: ['销售金额', '客户数量'],
          suggestions: ['分析客户流失原因', '制定挽回策略']
        }
      },
      
      // 预警信息列表（用于轮播或切换）
      alertList: [
        {
          type: 'business_exception',
          message: '小易监控到新的经营异常',
          priority: 'high',
          details: {
            category: '经营异常',
            description: '检测到销售额异常下滑，建议查看客户流失情况'
          }
        },
        {
          type: 'inventory_warning',
          message: '库存预警：多个商品库存不足',
          priority: 'medium',
          details: {
            category: '库存预警',
            description: '15个商品库存低于安全线，建议及时补货'
          }
        },
        {
          type: 'payment_abnormal',
          message: '回款异常：逾期回款金额较大',
          priority: 'high',
          details: {
            category: '回款异常',
            description: '本月逾期回款金额超过10万元，需要跟进客户付款情况'
          }
        },
        {
          type: 'customer_inactive',
          message: '重点客户3天未下单',
          priority: 'medium',
          details: {
            category: '客户异常',
            description: '5个重点客户连续3天未下单，建议主动联系'
          }
        }
      ],
      
      // 搜索相关
      searchResults: [],
      
      // 数据详情弹窗
      showDataModal: false,
      currentDataDetail: {},
      
      // 数据看板控制
      showDetailData: false,
      
      // 功能配置相关
      showFunctionConfig: false,
      functionSearchKeyword: '',
      dragStartIndex: -1,
      
      // 数据详情映射
      dataDetailMap: {
        'current-month-sales': {
          title: '本月销售金额',
          formula: '本月销售金额 = 已结金额 + 未结金额 - 退货金额',
          breakdown: [
            { id: 1, name: '已结销售', value: '17,038.58元' },
            { id: 2, name: '未结销售', value: '20,149.48元' },
            { id: 3, name: '退货扣减', value: '-956.68元' }
          ],
          type: 'current-month-sales'
        },
        'today-sales': {
          title: '今日销售金额',
          formula: '今日销售金额 = 当日所有销售订单金额汇总',
          breakdown: [
            { id: 1, name: '线上订单', value: '3,200.00元' },
            { id: 2, name: '线下门店', value: '1,800.00元' },
            { id: 3, name: '代理商', value: '580.00元' }
          ],
          type: 'today-sales'
        },
        'net-sales': {
          title: '本月净销售额',
          formula: '净销售额 = 总销售额 - 退货金额 - 折扣优惠',
          breakdown: [
            { id: 1, name: '总销售额', value: '38,144.74元' },
            { id: 2, name: '退货扣减', value: '-956.68元' },
            { id: 3, name: '折扣优惠', value: '-0.00元' }
          ],
          type: 'net-sales'
        }
      },
      
      // 快速功能列表
      allFunctionsList: [
        { id: 1, name: '员工月报', icon: 'users', route: 'employee-report', selected: true },
        { id: 2, name: '业绩变化分析', icon: 'trending-up', route: 'performance-analysis', selected: true },
        { id: 3, name: '员工整体分析', icon: 'user-check', route: 'employee-analysis', selected: true },
        { id: 4, name: '目标管理', icon: 'target', route: 'goal-management', selected: true },
        { id: 5, name: '我的经营月报', icon: 'file-text', route: 'monthly-report', selected: true },
        { id: 6, name: '铺市分析', icon: 'map-pin', route: 'market-analysis', selected: true },
        { id: 7, name: '员工业绩汇总', icon: 'bar-chart', route: 'employee-performance', selected: true },
        { id: 8, name: '客户销退汇总', icon: 'refresh-cw', route: 'customer-return', selected: true },
        { id: 9, name: '客户管理', icon: 'user', route: 'customer-management', selected: false },
        { id: 10, name: '库存管理', icon: 'package', route: 'inventory-management', selected: false },
        { id: 11, name: '资金整体分析', icon: 'dollar-sign', route: 'financial-analysis', selected: false },
        { id: 12, name: '系统设置', icon: 'settings', route: 'system-settings', selected: false },
        { id: 13, name: '数据导出', icon: 'download', route: 'data-export', selected: false },
        { id: 14, name: '消息中心', icon: 'bell', route: 'message-center', selected: false },
        { id: 15, name: '营销活动', icon: 'megaphone', route: 'marketing-activities', selected: false },
        { id: 16, name: '供应商管理', icon: 'truck', route: 'supplier-management', selected: false },
        { id: 17, name: '拜访分析', icon: '🚶', route: 'visit-analysis', selected: true },
        { id: 18, name: '员工利润', icon: '💵', route: 'employee-profit', selected: true }
      ],
      
      // 目标数据
      goalsData: [
        {
          id: 1,
          name: '20000 销售金额',
          period: '2025-01-01 ~ 2025-12-31',
          target: '2,000.00',
          completed: '27,467.13',
          difference: '超额完成',
          completionRate: '1373.36%',
          status: '超额完成',
          hasPermission: true
        },
        {
          id: 2,
          name: '净销售额目标',
          period: '2025-01-01 ~ 2025-12-31',
          target: '50,000.00',
          completed: '37,188.06',
          difference: '12,811.94',
          completionRate: '74.38%',
          status: '进行中',
          hasPermission: true
        },
        {
          id: 3,
          name: '客户回款目标',
          period: '2025-01-01 ~ 2025-12-31',
          target: '30,000.00',
          completed: '23,258.48',
          difference: '6,741.52',
          completionRate: '77.53%',
          status: '进行中',
          hasPermission: false
        },
        {
          id: 4,
          name: '铺货客户数',
          period: '2025-01-01 ~ 2025-12-31',
          target: '100',
          completed: '85',
          difference: '15',
          completionRate: '85.00%',
          status: '进行中',
          hasPermission: true
        },
        {
          id: 5,
          name: '新客户开发',
          period: '2025-01-01 ~ 2025-12-31',
          target: '50',
          completed: '28',
          difference: '22',
          completionRate: '56.00%',
          status: '进行中',
          hasPermission: true
        },
        {
          id: 6,
          name: '客户维护率',
          period: '2025-01-01 ~ 2025-12-31',
          target: '95%',
          completed: '92%',
          difference: '3%',
          completionRate: '96.84%',
          status: '进行中',
          hasPermission: false
        }
      ]
    }
  },
  computed: {
    // 预警优先级样式类
    alertPriorityClass() {
      return `alert-${this.currentAlert.priority}`
    },
    
    // 显示的功能列表（前8个选中的）
    displayedFunctions() {
      return this.allFunctionsList.filter(func => func.selected).slice(0, 8)
    },
    
    // 已选择的功能列表
    selectedFunctionsList() {
      return this.allFunctionsList.filter(func => func.selected)
    },
    
    // 过滤后的可用功能列表
    filteredAvailableFunctions() {
      const availableFunctions = this.allFunctionsList.filter(func => !func.selected)
      if (!this.functionSearchKeyword) {
        return availableFunctions
      }
      return availableFunctions.filter(func => 
        func.name.toLowerCase().includes(this.functionSearchKeyword.toLowerCase())
      )
    },
    
    // 活跃目标列表
    activeGoalsList() {
      return this.goalsData
    }
  },
  methods: {
    // === 顶部预警和搜索相关 ===
    // 语音播报功能
    playVoiceInfo() {
      this.hasUnreadInfo = false
      
      // 模拟语音播报关键信息
      const voiceMessages = [
        '小易提醒：今日退货金额较昨日增长20%',
        'A部门已完成本月销售目标',
        '重点客户张三商贸连续3天未下单，建议跟进',
        '本月净销售额已达成74.38%，继续保持',
        '库存预警：15个商品低于安全线'
      ]
      
      const randomMessage = voiceMessages[Math.floor(Math.random() * voiceMessages.length)]
      
      // 这里可以集成真实的语音播报API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomMessage)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
      
      // 显示播报内容的提示
      alert(`🔊 语音播报：${randomMessage}`)
      
      console.log('语音播报:', randomMessage)
    },
    
    showExceptionDetails() {
      console.log('显示预警详情:', this.currentAlert)
      // 根据预警类型跳转不同的详情页
      switch(this.currentAlert.type) {
        case 'business_exception':
          this.$router.push('/business-exception-details')
          break
        case 'inventory_warning':
          this.$router.push('/inventory-warning-details')
          break
        case 'payment_abnormal':
          this.$router.push('/payment-abnormal-details')
          break
        case 'customer_inactive':
          this.$router.push('/customer-inactive-details')
          break
        default:
          this.$router.push('/exception-details')
      }
    },
    
    // 切换预警信息（可以定时轮播或手动触发）
    switchAlert(alertIndex) {
      if (alertIndex >= 0 && alertIndex < this.alertList.length) {
        this.currentAlert = this.alertList[alertIndex]
      }
    },
    
    // 定时轮播预警信息
    startAlertRotation() {
      if (this.alertList.length > 1) {
        setInterval(() => {
          const currentIndex = this.alertList.findIndex(alert => 
            alert.type === this.currentAlert.type
          )
          const nextIndex = (currentIndex + 1) % this.alertList.length
          this.switchAlert(nextIndex)
        }, 10000) // 每10秒切换一次
      }
    },
    
    // === 搜索弹窗相关 ===
    openSearchModal() {
      this.showSearchModal = true
      this.searchKeyword = ''
      this.hasSearched = false
      // 延迟一下聚焦，确保DOM已渲染
      this.$nextTick(() => {
        if (this.$refs.searchModalInput) {
          this.$refs.searchModalInput.focus()
        }
      })
    },
    
    closeSearchModal() {
      this.showSearchModal = false
      this.searchKeyword = ''
      this.hasSearched = false
      this.searchResults = []
    },
    
    performSearchInModal() {
      if (!this.searchKeyword.trim()) {
        return
      }
      
      this.hasSearched = true
      
      // 模拟搜索结果
      const allData = [
        // 客户数据
        { id: 'c1', type: '客户', title: '张三商贸', description: '兰州地区 | A类客户 | 月均订单15单' },
        { id: 'c2', type: '客户', title: '李四超市', description: '天水地区 | B类客户 | 月均订单8单' },
        { id: 'c3', type: '客户', title: '王五批发', description: '白银地区 | A类客户 | 月均订单22单' },
        
        // 订单数据
        { id: 'o1', type: '订单', title: 'ORD202412001', description: '张三商贸 | 金额：5,580元 | 今日' },
        { id: 'o2', type: '订单', title: 'ORD202412002', description: '李四超市 | 金额：3,240元 | 昨日' },
        { id: 'o3', type: '订单', title: 'ORD202412003', description: '王五批发 | 金额：8,750元 | 前天' },
        
        // 员工数据
        { id: 'e1', type: '员工', title: '黄保杰', description: '销售一部 | 本月销售：185,600元 | 客户铺货率：80%' },
        { id: 'e2', type: '员工', title: '李明华', description: '销售一部 | 本月销售：203,400元 | 客户铺货率：88.9%' },
        { id: 'e3', type: '员工', title: '王建国', description: '销售二部 | 本月销售：156,800元 | 客户铺货率：71.4%' }
      ]
      
      // 搜索逻辑
      const keyword = this.searchKeyword.toLowerCase()
      this.searchResults = allData.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      )
      
      console.log('搜索关键词:', this.searchKeyword)
      console.log('搜索结果:', this.searchResults)
    },
    
    handleSearchResult(result) {
      console.log('选择搜索结果:', result)
      
      // 根据结果类型跳转到相应页面
      switch(result.type) {
        case '客户':
          this.$router.push(`/customer-details/${result.id}`)
          break
        case '订单':
          this.$router.push(`/order-details/${result.id}`)
          break
        case '员工':
          this.$router.push(`/employee-details/${result.id}`)
          break
      }
      
      this.closeSearchModal()
    },
    
    // 搜索栏激活
    activateSearch() {
      this.isSearchActive = true
    },
    
    // 搜索栏失焦
    deactivateSearch() {
      // 延迟失焦，避免点击搜索结果时立即失焦
      setTimeout(() => {
        if (!this.searchKeyword) {
          this.isSearchActive = false
          this.searchResults = []
        }
      }, 200)
    },
    
    // 清空搜索
    clearSearch() {
      this.searchKeyword = ''
      this.searchResults = []
      this.isSearchActive = false
    },
    
    showSearchPanel() {
      this.showSearch = true
      this.$nextTick(() => {
        const input = document.querySelector('.search-input')
        if (input) input.focus()
      })
    },
    
    performSearch() {
      if (!this.searchKeyword.trim()) return
      
      // 模拟搜索结果 - 包含客户、订单、员工等系统信息
      const mockResults = [
        // 功能搜索
        { id: 1, type: '功能', title: '员工月报', route: 'employee-report', category: 'function' },
        { id: 2, type: '功能', title: '业绩分析', route: 'performance-analysis', category: 'function' },
        { id: 3, type: '功能', title: '目标管理', route: 'goal-management', category: 'function' },
        
        // 客户搜索
        { id: 11, type: '客户', title: '张三商贸有限公司', route: 'customer-detail/1', category: 'customer' },
        { id: 12, type: '客户', title: '李四超市', route: 'customer-detail/2', category: 'customer' },
        { id: 13, type: '客户', title: '王五批发部', route: 'customer-detail/3', category: 'customer' },
        
        // 订单搜索
        { id: 21, type: '订单', title: 'SO202501001', route: 'order-detail/1', category: 'order' },
        { id: 22, type: '订单', title: 'SO202501002', route: 'order-detail/2', category: 'order' },
        
        // 员工搜索
        { id: 31, type: '员工', title: '黄保杰', route: 'employee-detail/1', category: 'employee' },
        { id: 32, type: '员工', title: '李明华', route: 'employee-detail/2', category: 'employee' },
        { id: 33, type: '员工', title: '王建国', route: 'employee-detail/3', category: 'employee' },
        
        // 目标搜索
        { id: 41, type: '目标', title: '销售金额目标', route: 'goal-detail/1', category: 'goal' },
        { id: 42, type: '目标', title: '客户回款目标', route: 'goal-detail/3', category: 'goal' }
      ]
      
      this.searchResults = mockResults.filter(item => 
        item.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    },

    // === 数据汇总区相关 ===
    showDataDetail(dataType) {
      this.currentDataDetail = this.dataDetailMap[dataType] || {}
      this.showDataModal = true
    },
    
    toggleDetailView() {
      this.showDetailData = !this.showDetailData
    },
    
    viewDetailPage(dataType) {
      this.showDataModal = false
      // 跳转到对应的明细汇总页
      this.$router.push(`/data-detail/${dataType}`)
    },

    // === 快速功能区相关 ===
    navigateToFunction(route) {
      this.$router.push(`/${route}`)
    },
    
    showAllFunctions() {
      // 跳转到快捷访问页面
      this.$router.push('/quick-access')
    },
    
    // 拖拽排序功能
    handleDragStart(index) {
      this.dragStartIndex = index
    },
    
    handleDrop(dropIndex) {
      if (this.dragStartIndex === -1) return
      
      const draggedItem = this.selectedFunctionsList[this.dragStartIndex]
      const newList = [...this.selectedFunctionsList]
      
      // 移除拖拽项
      newList.splice(this.dragStartIndex, 1)
      // 插入到新位置
      newList.splice(dropIndex, 0, draggedItem)
      
      // 更新原始数组中的顺序
      let selectedIndex = 0
      this.allFunctionsList.forEach(func => {
        if (func.selected) {
          const newItem = newList[selectedIndex]
          Object.assign(func, newItem)
          selectedIndex++
        }
      })
      
      this.dragStartIndex = -1
    },
    
    removeFunction(funcId) {
      const func = this.allFunctionsList.find(f => f.id === funcId)
      if (func) {
        func.selected = false
      }
    },
    
    addFunction(funcId) {
      if (this.selectedFunctionsList.length >= 8) {
        alert('最多只能选择8个快速功能')
        return
      }
      
      const func = this.allFunctionsList.find(f => f.id === funcId)
      if (func) {
        func.selected = true
      }
    },
    
    saveFunctionConfiguration() {
      // 保存配置到本地存储
      const config = this.allFunctionsList.map(func => ({
        id: func.id,
        selected: func.selected
      }))
      localStorage.setItem('quickFunctionConfig', JSON.stringify(config))
      this.showFunctionConfig = false
      alert('配置已保存')
    },

    // === 目标追踪区相关 ===
    viewAllGoals() {
      this.$router.push('/goal-management')
    },
    
    viewGoalDetail(goalId) {
      // 进入目标详情页
      this.$router.push(`/goal-detail/${goalId}`)
    },
    
    editGoal(goalId) {
      console.log('编辑目标:', goalId)
      this.$router.push(`/goal-edit/${goalId}`)
    },
    
    deleteGoal(goalId) {
      if (confirm('确定要删除这个目标吗？')) {
        console.log('删除目标:', goalId)
        // 实际删除逻辑
      }
    },
    
    moreGoalOptions(goalId) {
      console.log('更多目标操作:', goalId)
      // 显示更多操作菜单
    },
    
    viewDepartmentPerformance(goalId) {
      // 进入部门目标明细页
      this.$router.push(`/department-goal-detail/${goalId}`)
    },
    
    viewEmployeePerformance(goalId) {
      // 进入员工维度分解页
      this.$router.push(`/employee-performance/${goalId}`)
    },

    // === 底部导航相关 ===
    navigateToPage(page) {
      this.currentPage = page
      
      switch(page) {
        case 'home':
          // 刷新首页数据
          this.refreshHomeData()
          break
        case 'focus':
          // 进入关注分析页
          this.$router.push('/focus-analysis')
          break
        case 'analysis':
          // 进入综合解读页
          this.$router.push('/comprehensive-analysis')
          break
        case 'profile':
          // 进入个人中心页
          this.$router.push('/user-profile')
          break
      }
    },
    
    refreshHomeData() {
      // 刷新首页数据
      console.log('刷新首页数据')
    },

    // === 辅助方法 ===
    getGoalDifferenceClass(difference) {
      if (difference === '超额完成') return 'over-achieved'
      if (typeof difference === 'string' && difference.includes('超额')) return 'over-achieved'
      return 'in-progress'
    },
    
    getProgressTypeClass(completionRate) {
      const rate = parseFloat(completionRate.replace('%', ''))
      if (rate >= 100) return 'over-achieved'
      if (rate >= 80) return 'warning'
      return 'normal'
    },
    
    getProgressWidth(completionRate) {
      const rate = parseFloat(completionRate.replace('%', ''))
      return Math.min(rate, 100) + '%'
    },
    
    // 导航到铺市分析
    navigateToMarketAnalysis() {
      this.$router.push('/market-analysis')
    },
    
    loadFunctionConfig() {
      // 从本地存储加载配置
      const saved = localStorage.getItem('quickFunctionConfig')
      if (saved) {
        try {
          const config = JSON.parse(saved)
          config.forEach(item => {
            const func = this.allFunctionsList.find(f => f.id === item.id)
            if (func) {
              func.selected = item.selected
            }
          })
        } catch (e) {
          console.error('Failed to load function config:', e)
        }
      }
    },

    // 获取图标组件
    getIconComponent(iconName) {
      const iconMap = {
        'users': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4c0-2.21 1.79-4 4-4s4 1.79 4 4v4h-8zM10 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2z"/>
        </svg>`,
        'trending-up': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>`,
        'user-check': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 13L11 9L7.91 12.09C7.66 10.78 6.26 9.85 5 10.15V8C5 6.9 5.9 6 7 6H17C18.1 6 19 6.9 19 8V9H21ZM17.71 11.29L16.29 12.71L18.59 15L23.29 10.29L21.88 8.88L18.59 12.17L17.71 11.29Z"/>
        </svg>`,
        'target': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
        </svg>`,
        'file-text': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>`,
        'map-pin': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z"/>
        </svg>`,
        'bar-chart': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
        </svg>`,
        'refresh-cw': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,18A6,6 0 0,1 6,12C6,8.69 8.69,6 12,6A6,6 0 0,1 18,12H16A4,4 0 0,0 12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16H16L12,20L8,16H12Z"/>
        </svg>`,
        'user': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
        </svg>`,
        'package': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L2,7L12,12L22,7L12,2M2,17L12,22L22,17M2,12L12,17L22,12"/>
        </svg>`,
        'dollar-sign': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
        </svg>`,
        'settings': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>`,
        'download': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
        </svg>`,
        'bell': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
        </svg>`,
        'megaphone': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z"/>
        </svg>`,
        'truck': () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z"/>
        </svg>`
      }

      return {
        template: iconMap[iconName] ? iconMap[iconName]() : `<div>${iconName}</div>`
      }
    }
  },
  mounted() {
    this.loadFunctionConfig()
    // 启动预警信息轮播
    this.startAlertRotation()
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* === 顶部区域：小人Logo + 动态预警 + 搜索 === */
.top-navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  gap: 8px; /* 减小间距 */
}

/* 左侧：小人Logo（语音播报入口） */
.voice-info-logo {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.voice-info-logo:hover {
  transform: scale(1.1);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
}

.logo-icon.has-unread {
  animation: pulse 2s infinite;
  box-shadow: 0 0 15px rgba(255, 140, 66, 0.6);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 140, 66, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 140, 66, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 140, 66, 0.6);
  }
}

.unread-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border: 2px solid #ffffff;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-8px,0);
  }
  70% {
    transform: translate3d(0,-4px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}

/* 中间：动态预警提示条 */
.alert-banner {
  flex: 1;
  max-width: calc(100% - 180px); /* 给搜索栏留出更少空间 */
  border-radius: 20px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 36px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.alert-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.alert-banner:hover::before {
  left: 100%;
}

/* 高优先级预警 - 红色 */
.alert-high {
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
}

.alert-high:hover {
  background: linear-gradient(90deg, #ff1f22 0%, #ff4d4f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
}

/* 中优先级预警 - 橙色 */
.alert-medium {
  background: linear-gradient(90deg, #ff9900 0%, #ffb84d 100%);
  color: white;
}

.alert-medium:hover {
  background: linear-gradient(90deg, #e6800a 0%, #ff9900 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.4);
}

/* 低优先级预警 - 灰色 */
.alert-low {
  background: linear-gradient(90deg, #595959 0%, #8c8c8c 100%);
  color: white;
}

.alert-low:hover {
  background: linear-gradient(90deg, #434343 0%, #595959 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(89, 89, 89, 0.4);
}

.alert-text {
  font-weight: 600;
  font-size: 13px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧：搜索功能 */
.search-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 14px; /* 进一步减小圆角 */
  padding: 4px 8px; /* 进一步减小内边距 */
  transition: all 0.3s ease;
  min-width: 80px; /* 大幅减小最小宽度 */
  max-width: 120px; /* 大幅减小最大宽度 */
  flex-shrink: 0;
  cursor: pointer;
}

.search-container.active {
  border-color: #4A90E2;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 11px; /* 进一步减小字体 */
  color: #333333;
  padding: 0 4px 0 0; /* 进一步减小内边距 */
  width: 40px; /* 设置固定宽度 */
}

.search-input::placeholder {
  color: #999999;
  font-size: 10px; /* 进一步减小占位符字体 */
}

.search-icon {
  font-size: 12px; /* 进一步减小图标尺寸 */
  color: #666666;
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
  padding: 0; /* 移除图标内边距 */
  width: 16px; /* 设置固定宽度 */
  height: 16px; /* 设置固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-placeholder {
  font-size: 11px;
  color: #999999;
  flex: 1;
}

.search-container.active .search-icon {
  color: #4A90E2;
}

/* 搜索弹窗样式 */
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.search-modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.search-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
  background-color: #f8f9fa;
}

.search-modal-header h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #999999;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #666666;
}

.search-modal-content {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.search-input-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-modal-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-modal-input:focus {
  border-color: #4A90E2;
}

.search-btn {
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #2E5BBA;
}

.search-results-section {
  margin-top: 20px;
}

.results-header {
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-result-item {
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-result-item:hover {
  border-color: #4A90E2;
  background-color: #f8fbff;
}

.result-type {
  font-size: 12px;
  color: #4A90E2;
  font-weight: 600;
}

.result-title {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
}

.result-desc {
  font-size: 12px;
  color: #666666;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #999999;
}

.no-results-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  color: #999999;
}

.no-results-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.no-results-tip {
  font-size: 14px;
}

.search-suggestions {
  margin-top: 20px;
}

.suggestions-title {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
  margin-bottom: 12px;
}

.suggestion-item {
  padding: 10px 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666666;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background-color: #e9ecef;
  color: #333333;
}

/* 搜索结果面板 */
.search-results-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1999;
}

.search-results-panel {
  background-color: #ffffff;
  margin: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-height: 400px;
  overflow: hidden;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.results-count {
  color: #666666;
  font-size: 14px;
}

.clear-search {
  background: none;
  border: none;
  font-size: 18px;
  color: #999999;
  cursor: pointer;
  padding: 4px;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-type {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

.result-title {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

/* === 二、核心数据看板（经营核心数据） === */
.data-dashboard-section {
  margin-top: 56px; /* 为顶部固定区域留空间 */
  background: linear-gradient(135deg, #4A90E2 0%, #2E5BBA 100%);
  padding: 24px 16px;
  color: white;
}

/* 主要销售数据对比 */
.main-sales-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.sales-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sales-card {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sales-card:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.sales-card.primary {
  min-height: 90px;
}

.sales-card.secondary {
  min-height: 60px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.1);
}

.sales-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.sales-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
  color: white;
}

.sales-value.small {
  font-size: 18px;
}

.sales-unit {
  font-size: 12px;
  opacity: 0.8;
}

/* 细分数据栏 */
.detail-data-section {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.section-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.toggle-icon {
  font-size: 14px;
  color: white;
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.detail-data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-card {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.detail-card:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.detail-card.highlight {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.detail-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 6px;
  color: white;
}

.detail-value {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
  color: white;
}

.detail-value.negative {
  color: #ffcdd2;
}

.detail-value.warning {
  color: #fff3e0;
}

.detail-unit {
  font-size: 10px;
  opacity: 0.8;
  color: white;
}

.detail-supplement {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.8);
}

/* 数据详情弹窗 */
.data-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.data-modal {
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  color: #333333;
  font-size: 18px;
}

.modal-close {
  background: none;
  border: none;
  color: #999999;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background-color: #f0f0f0;
  color: #666666;
}

.modal-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.calculation-logic {
  margin-bottom: 20px;
}

.calculation-logic h4 {
  color: #333333;
  font-size: 16px;
  margin-bottom: 8px;
}

.calculation-logic p {
  color: #666666;
  font-size: 14px;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin: 0;
}

.detail-breakdown h4 {
  color: #333333;
  font-size: 16px;
  margin-bottom: 12px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.item-name {
  color: #666666;
  font-size: 14px;
}

.item-value {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.modal-actions {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.view-detail-btn {
  width: 100%;
  background-color: #4A90E2;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-detail-btn:hover {
  background-color: #2E5BBA;
}

/* === 三、快速功能入口区域（工具快捷触达区） === */
.quick-functions-section {
  background-color: #ffffff;
  padding: 20px 16px;
  margin-bottom: 16px;
}

.functions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  color: #333333;
  font-size: 18px;
  font-weight: bold;
}

.all-functions-btn {
  background: none;
  border: 1px solid #4A90E2;
  padding: 8px 16px;
  border-radius: 20px;
  color: #4A90E2;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.all-functions-btn:hover {
  background-color: #4A90E2;
  color: white;
}

.functions-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.function-row {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.function-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 12px;
  border-radius: 12px;
}

.function-item:hover {
  transform: scale(1.05);
  background-color: #f8f9fa;
}

.function-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
  transition: all 0.2s;
  color: white;
}

/* 不同功能使用不同颜色 */
.function-item:nth-child(1) .function-icon { background: linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%); }
.function-item:nth-child(2) .function-icon { background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%); }
.function-item:nth-child(3) .function-icon { background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); }
.function-item:nth-child(4) .function-icon { background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); }
.function-item:nth-child(5) .function-icon { background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); }
.function-item:nth-child(6) .function-icon { background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%); }
.function-item:nth-child(7) .function-icon { background: linear-gradient(135deg, #795548 0%, #5D4037 100%); }
.function-item:nth-child(8) .function-icon { background: linear-gradient(135deg, #607D8B 0%, #455A64 100%); }

.function-icon svg {
  width: 24px;
  height: 24px;
}

.function-item:hover .function-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.function-icon-small {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
}

.function-icon-small svg {
  width: 16px;
  height: 16px;
}

.function-name {
  color: #333333;
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
}

/* 全功能配置页面 */
.function-config-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.function-config-panel {
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.config-header h3 {
  margin: 0;
  color: #333333;
  font-size: 18px;
}

.config-close {
  background: none;
  border: none;
  color: #999999;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-close:hover {
  background-color: #f0f0f0;
  color: #666666;
}

.config-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.selected-functions {
  margin-bottom: 30px;
}

.selected-functions h4 {
  color: #333333;
  font-size: 16px;
  margin-bottom: 12px;
}

.selected-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.selected-function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: move;
  position: relative;
  transition: all 0.2s;
}

.selected-function-item:hover {
  border-color: #1677ff;
  background-color: #f8fbff;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ff4757;
  border: none;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.available-functions h4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333333;
  font-size: 16px;
  margin-bottom: 12px;
}

.function-search {
  border: 1px solid #e0e0e0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  width: 150px;
}

.available-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.available-function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.available-function-item:hover {
  border-color: #1677ff;
  background-color: #f8fbff;
}

.add-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #1677ff;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-actions {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.save-config-btn {
  width: 100%;
  background-color: #1677ff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

/* === 四、进行中的目标汇总区域（业务目标追踪区） === */
.goals-tracking-section {
  background-color: #ffffff;
  margin-bottom: 60px; /* 为底部导航留空间 */
}

.goals-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.goals-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-text {
  color: #333333;
  font-size: 18px;
  font-weight: bold;
}

.view-all-goals {
  background: none;
  border: none;
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.goals-list {
  padding: 0 16px 20px;
}

.goal-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border-color: #1677ff;
}

/* 1. 目标基础信息栏 */
.goal-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.goal-name-period {
  flex: 1;
}

.goal-name {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
}

.goal-period {
  color: #666666;
  font-size: 12px;
}

.goal-operations {
  display: flex;
  gap: 8px;
}

.edit-goal, .delete-goal, .more-goal {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-goal:hover {
  background-color: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
}

.delete-goal:hover {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.more-goal:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333333;
}

.achievement-icon {
  color: #FFD700;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
}

/* 2. 核心数据进度栏 */
.goal-progress-bar {
  margin-bottom: 16px;
}

.progress-data {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.data-item {
  text-align: center;
}

.data-label {
  color: #666666;
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
}

.data-value {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}

.data-value.completed {
  color: #1677ff;
}

.data-value.over-achieved {
  color: #00b42a;
}

.data-value.in-progress {
  color: #ff7d00;
}

.completion-indicator {
  margin-bottom: 8px;
}

.completion-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #1677ff;
}

.achievement-icon {
  font-size: 16px;
}

.progress-visual {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.normal {
  background-color: #1677ff;
}

.progress-fill.warning {
  background-color: #ff7d00;
}

.progress-fill.over-achieved {
  background-color: #00b42a;
}

/* 3. 操作入口栏 */
.goal-action-bar {
  display: flex;
  justify-content: space-around;
  gap: 12px;
}

.department-performance-btn, .employee-performance-btn {
  flex: 1;
  background: none;
  border: 1px solid #4A90E2;
  padding: 8px 16px;
  border-radius: 20px;
  color: #4A90E2;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.department-performance-btn:hover, .employee-performance-btn:hover {
  background-color: #4A90E2;
  color: white;
}

/* === 五、底部导航栏（全局页面切换） === */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #1E3A8A;
  display: flex;
  border-top: 1px solid #e0e0e0;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  gap: 4px;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #FF8C42;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 20px;
  transition: transform 0.2s;
  color: #FFFFFF;
}

.nav-label {
  font-size: 12px;
  color: #FFFFFF;
}

.nav-item.active .nav-label {
  color: #FF8C42;
  font-weight: bold;
}

/* 铺市分析卡片样式 */
.market-analysis {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.market-analysis:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.market-analysis::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  transform: rotate(45deg);
  pointer-events: none;
}

.market-icon {
  font-size: 32px;
  margin-bottom: 12px;
  display: block;
  opacity: 0.9;
}

.market-label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
}

.market-desc {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .summary-row {
    flex-direction: column;
  }
  
  .function-row {
    justify-content: space-between;
  }
  
  .progress-data {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .goal-action-bar {
    flex-direction: column;
  }
  
  .market-analysis {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .market-icon {
    font-size: 28px;
  }
  
  .market-label {
    font-size: 16px;
  }
  
  .market-desc {
    font-size: 13px;
  }
}
</style>
