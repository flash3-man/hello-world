<template>
  <div class="home-page">
    <!-- 一、顶部状态栏（系统级基础信息） -->
    <div class="system-status-bar">
      <div class="status-left">
        <span class="time">15:40</span>
        <span class="network">5G</span>
        <div class="alert-notification" @click="showExceptionDetails">
          <span class="alert-icon">⚠️</span>
          <span class="alert-text">小盈监控到新的经营异常</span>
        </div>
      </div>
      <div class="status-right">
        <button class="search-btn" @click="showSearchPanel">
          <span class="search-icon">🔍</span>
          <span>搜索</span>
        </button>
        <span class="battery">27%</span>
        <span class="battery-icon">🔋</span>
      </div>
    </div>

    <!-- 搜索面板 -->
    <div v-if="showSearch" class="search-overlay" @click="showSearch = false">
      <div class="search-panel" @click.stop>
        <div class="search-header">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索功能、目标、员工..." 
            class="search-input"
            @keyup.enter="performSearch"
          >
          <button class="search-close" @click="showSearch = false">✕</button>
        </div>
        <div class="search-results" v-if="searchResults.length">
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

    <!-- 二、首页表头汇总区域（经营核心数据看板） -->
    <div class="data-summary-section">
      <!-- 第一行：大数字突出 -->
      <div class="summary-row primary-row">
        <div class="summary-card major" @click="showDataDetail('current-month-sales')">
          <div class="data-label">本月销售金额</div>
          <div class="data-value major-value">38,144.74</div>
          <div class="data-unit">元</div>
        </div>
        <div class="summary-card major" @click="showDataDetail('today-sales')">
          <div class="data-label">今日销售金额</div>
          <div class="data-value major-value">5,580.00</div>
          <div class="data-unit">元</div>
        </div>
      </div>

      <!-- 第二行：辅助数据 -->
      <div class="summary-row secondary-row">
        <div class="summary-card minor" @click="showDataDetail('last-month-sales')">
          <div class="data-label">上月销售金额</div>
          <div class="data-value">227,356.95</div>
          <div class="data-unit">元</div>
        </div>
        <div class="summary-card minor" @click="showDataDetail('yesterday-sales')">
          <div class="data-label">昨日销售金额</div>
          <div class="data-value">3,294.34</div>
          <div class="data-unit">元</div>
        </div>
      </div>

      <!-- 第三行：业务细分数据 -->
      <div class="summary-row detail-row">
        <div class="summary-card compact" @click="showDataDetail('net-sales')">
          <div class="data-label">本月净销售额</div>
          <div class="data-value">37,188.06</div>
          <div class="data-unit">元</div>
        </div>
        <div class="summary-card compact" @click="showDataDetail('settled-sales')">
          <div class="data-label">本月销售已结</div>
          <div class="data-value">17,038.58</div>
          <div class="data-unit">元</div>
        </div>
        <div class="summary-card compact" @click="showDataDetail('return-amount')">
          <div class="data-label">本月退货金额</div>
          <div class="data-value">956.68</div>
          <div class="data-unit">元</div>
        </div>
        <div class="summary-card compact" @click="showDataDetail('unsettled-sales')">
          <div class="data-label">本月销售未结</div>
          <div class="data-value">20,149.48</div>
          <div class="data-unit">元</div>
        </div>
      </div>

      <!-- 第四行：应收/回款数据 -->
      <div class="summary-row financial-row">
        <div class="summary-card financial" @click="showDataDetail('receivables')">
          <div class="data-label">应收余额</div>
          <div class="data-value">419,596.78</div>
          <div class="data-unit">元</div>
        </div>
        <div class="summary-card financial" @click="showDataDetail('customer-payment')">
          <div class="data-label">本月客户回款</div>
          <div class="data-value">23,258.48</div>
          <div class="data-unit">元</div>
          <div class="data-supplement">今日：232.00元</div>
        </div>
      </div>
    </div>

    <!-- 数据详情弹窗 -->
    <div v-if="showDataModal" class="data-modal-overlay" @click="showDataModal = false">
      <div class="data-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ currentDataDetail.title }}</h3>
          <button class="modal-close" @click="showDataModal = false">✕</button>
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
            <div class="function-icon">{{ func.icon }}</div>
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
            <div class="function-icon">{{ func.icon }}</div>
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
          <button class="config-close" @click="showFunctionConfig = false">✕</button>
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
                <span class="function-icon">{{ func.icon }}</span>
                <span class="function-name">{{ func.name }}</span>
                <button class="remove-btn" @click="removeFunction(func.id)">✕</button>
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
                <span class="function-icon">{{ func.icon }}</span>
                <span class="function-name">{{ func.name }}</span>
                <span class="add-btn">+</span>
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
              <button class="edit-goal" @click.stop="editGoal(goal.id)">✏️</button>
              <button class="delete-goal" @click.stop="deleteGoal(goal.id)">🗑️</button>
              <button class="more-goal" @click.stop="moreGoalOptions(goal.id)">⋯</button>
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
                <span class="achievement-icon" v-if="parseFloat(goal.completionRate) >= 100">🏆</span>
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
        <div class="nav-icon">🏠</div>
        <div class="nav-label">首页</div>
      </div>
      <div 
        class="nav-item"
        :class="{ active: currentPage === 'focus' }"
        @click="navigateToPage('focus')"
      >
        <div class="nav-icon">⭐</div>
        <div class="nav-label">关注</div>
      </div>
      <div 
        class="nav-item"
        :class="{ active: currentPage === 'analysis' }"
        @click="navigateToPage('analysis')"
      >
        <div class="nav-icon">📊</div>
        <div class="nav-label">解读</div>
      </div>
      <div 
        class="nav-item"
        :class="{ active: currentPage === 'profile' }"
        @click="navigateToPage('profile')"
      >
        <div class="nav-icon">👤</div>
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
      
      // 搜索相关
      showSearch: false,
      searchKeyword: '',
      searchResults: [],
      
      // 数据详情弹窗
      showDataModal: false,
      currentDataDetail: {},
      
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
        { id: 1, name: '员工月报', icon: '👥', route: 'employee-report', selected: true },
        { id: 2, name: '综合月报', icon: '📊', route: 'employee-performance', selected: true },
        { id: 3, name: '电视大屏', icon: '📺', route: 'employee-performance', selected: true },
        { id: 4, name: '目标管理', icon: '🎯', route: 'goal-management', selected: true },
        { id: 5, name: '员工动态', icon: '💼', route: 'employee-performance', selected: true },
        { id: 6, name: '综合日报', icon: '📋', route: 'employee-performance', selected: true },
        { id: 7, name: '员工业绩汇总', icon: '📈', route: 'employee-performance', selected: true },
        { id: 8, name: '客户销退汇总', icon: '🔄', route: 'employee-performance', selected: true },
        { id: 9, name: '客户管理', icon: '👤', route: 'customer-management', selected: false },
        { id: 10, name: '库存管理', icon: '📦', route: 'inventory-management', selected: false },
        { id: 11, name: '财务报表', icon: '💰', route: 'financial-reports', selected: false },
        { id: 12, name: '系统设置', icon: '⚙️', route: 'system-settings', selected: false },
        { id: 13, name: '数据导出', icon: '📤', route: 'data-export', selected: false },
        { id: 14, name: '消息中心', icon: '📢', route: 'message-center', selected: false },
        { id: 15, name: '营销活动', icon: '🎪', route: 'marketing-activities', selected: false },
        { id: 16, name: '供应商管理', icon: '🏭', route: 'supplier-management', selected: false }
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
    // === 顶部状态栏相关 ===
    showExceptionDetails() {
      console.log('显示经营异常详情')
      // 跳转异常详情页，展示异常类型、涉及数据及预警建议
      this.$router.push('/exception-details')
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
      
      // 模拟搜索结果
      this.searchResults = [
        { id: 1, type: '功能', title: '员工月报', route: 'employee-report' },
        { id: 2, type: '目标', title: '销售金额目标', route: 'goal-detail/1' },
        { id: 3, type: '员工', title: '张三', route: 'employee-detail/1' }
      ].filter(item => 
        item.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    },
    
    handleSearchResult(result) {
      this.showSearch = false
      this.searchKeyword = ''
      this.searchResults = []
      this.$router.push(`/${result.route}`)
    },

    // === 数据汇总区相关 ===
    showDataDetail(dataType) {
      this.currentDataDetail = this.dataDetailMap[dataType] || {}
      this.showDataModal = true
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
      this.showFunctionConfig = true
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
      this.$router.push('/goals-overview')
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
      // 进入部门维度分解页
      this.$router.push(`/department-performance/${goalId}`)
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
          // 进入关注列表页
          this.$router.push('/focus-list')
          break
        case 'analysis':
          // 进入经营解读页
          this.$router.push('/business-analysis')
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
    }
  },
  mounted() {
    this.loadFunctionConfig()
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* === 一、顶部状态栏（系统级基础信息） === */
.system-status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time {
  color: #333333;
  font-weight: 600;
  font-size: 16px;
}

.network {
  color: #333333;
  font-weight: 500;
  font-size: 14px;
}

.alert-notification {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #fff3e0;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.alert-notification:hover {
  background-color: #ffe0b2;
}

.alert-icon {
  font-size: 14px;
}

.alert-text {
  color: #ff7d00;
  font-weight: bold;
  font-size: 12px;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid #e0e0e0;
  padding: 6px 12px;
  border-radius: 16px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.battery {
  color: #333333;
  font-weight: 500;
  font-size: 14px;
}

.battery-icon {
  font-size: 16px;
}

/* 搜索面板 */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.search-panel {
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-height: 400px;
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333333;
}

.search-close {
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

.result-type {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.result-title {
  color: #333333;
  font-size: 14px;
}

/* === 二、首页表头汇总区域（经营核心数据看板） === */
.data-summary-section {
  margin-top: 44px; /* 为固定状态栏留空间 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 16px;
  color: white;
}

.summary-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-card {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.summary-card:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.summary-card.major {
  min-height: 80px;
}

.summary-card.compact {
  min-height: 60px;
  padding: 12px;
}

.data-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.data-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.data-value.major-value {
  font-size: 24px;
}

.data-unit {
  font-size: 12px;
  opacity: 0.8;
}

.data-supplement {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
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
  font-size: 20px;
  color: #999999;
  cursor: pointer;
  padding: 4px;
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
  background-color: #1677ff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-detail-btn:hover {
  background-color: #0e5fd8;
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
  border: 1px solid #1677ff;
  padding: 8px 16px;
  border-radius: 20px;
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.all-functions-btn:hover {
  background-color: #1677ff;
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
  background-color: #1677ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.function-item:hover .function-icon {
  background-color: #0e5fd8;
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
  font-size: 20px;
  color: #999999;
  cursor: pointer;
  padding: 4px;
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
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.edit-goal:hover, .delete-goal:hover, .more-goal:hover {
  background-color: #f0f0f0;
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
  border: 1px solid #1677ff;
  padding: 8px 16px;
  border-radius: 20px;
  color: #1677ff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.department-performance-btn:hover, .employee-performance-btn:hover {
  background-color: #1677ff;
  color: white;
}

/* === 五、底部导航栏（全局页面切换） === */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
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
  background-color: #f8f9fa;
}

.nav-item.active {
  color: #1677ff;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 20px;
  transition: transform 0.2s;
}

.nav-label {
  font-size: 12px;
  color: #666666;
}

.nav-item.active .nav-label {
  color: #1677ff;
  font-weight: bold;
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
}
</style>
