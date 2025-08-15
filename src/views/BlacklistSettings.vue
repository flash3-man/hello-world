<template>
  <div class="blacklist-settings">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>
      <h1 class="page-title">黑名单设置</h1>
      <button class="help-btn" @click="showHelp">
        <span class="help-icon">?</span>
      </button>
    </div>

    <!-- 标签页切换 -->
    <div class="tab-section">
      <div class="tab-container">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          <span class="tab-name">{{ tab.name }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchKeyword"
            :placeholder="searchPlaceholder"
            class="search-input"
            @input="handleSearch"
          />
        </div>
        <button class="search-btn" @click="performSearch">
          搜索
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 已添加的黑名单项 -->
      <div v-if="filteredBlacklist.length > 0" class="blacklist-items">
        <div 
          v-for="item in filteredBlacklist" 
          :key="item.id"
          class="blacklist-item"
        >
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-type">{{ item.type }}</span>
          </div>
          <button class="remove-btn" @click="removeFromBlacklist(item.id)">
            移除
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M20 25H60V55C60 58.866 56.866 62 53 62H27C23.134 62 20 58.866 20 55V25Z" fill="#E3F2FD"/>
            <path d="M25 20H55C58.866 20 62 23.134 62 27V30H18V27C18 23.134 21.134 20 25 20Z" fill="#BBDEFB"/>
            <path d="M35 15V25" stroke="#90CAF9" stroke-width="2" stroke-linecap="round"/>
            <path d="M45 15V25" stroke="#90CAF9" stroke-width="2" stroke-linecap="round"/>
            <circle cx="65" cy="15" r="8" fill="#FF5722"/>
            <path d="M61 11L69 19M69 11L61 19" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="empty-text">暂无黑名单项</div>
        <div class="empty-desc">{{ emptyDescription }}</div>
      </div>
    </div>

    <!-- 添加按钮 -->
    <div class="add-section" v-if="activeTab !== 'all'">
      <button class="add-btn" @click="showAddDialog">
        + 添加{{ currentTabName }}
      </button>
    </div>

    <!-- 添加弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click="hideAddDialog">
      <div class="add-modal" @click.stop>
        <div class="modal-header">
          <h3>添加{{ currentTabName }}</h3>
          <button class="modal-close" @click="hideAddDialog">×</button>
        </div>
        <div class="modal-content">
          <div class="input-group">
            <label>{{ currentTabName }}名称</label>
            <input
              type="text"
              v-model="newItemName"
              :placeholder="`请输入${currentTabName}名称`"
              class="modal-input"
            />
          </div>
          <div class="input-group" v-if="activeTab === 'customer'">
            <label>客户类型</label>
            <select v-model="newItemType" class="modal-select">
              <option value="个人">个人客户</option>
              <option value="企业">企业客户</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="hideAddDialog">取消</button>
          <button class="confirm-btn" @click="addToBlacklist">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlacklistSettings',
  data() {
    return {
      activeTab: 'employee',
      searchKeyword: '',
      showAddModal: false,
      newItemName: '',
      newItemType: '个人',
      
      // 标签页配置
      tabs: [
        { id: 'employee', name: '员工', count: 0 },
        { id: 'website', name: '网站', count: 0 },
        { id: 'customer', name: '客户', count: 0 }
      ],
      
      // 黑名单数据
      blacklistData: {
        employee: [
          { id: 1, name: '已离职小李', type: '员工' }
        ],
        website: [],
        customer: []
      }
    }
  },
  
  computed: {
    // 当前标签页名称
    currentTabName() {
      const tab = this.tabs.find(t => t.id === this.activeTab)
      return tab ? tab.name : ''
    },
    
    // 搜索占位符
    searchPlaceholder() {
      return `请输入${this.currentTabName}名称进行搜索`
    },
    
    // 当前标签页的黑名单数据
    currentBlacklist() {
      return this.blacklistData[this.activeTab] || []
    },
    
    // 过滤后的黑名单数据
    filteredBlacklist() {
      if (!this.searchKeyword) {
        return this.currentBlacklist
      }
      return this.currentBlacklist.filter(item =>
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      )
    },
    
    // 空状态描述
    emptyDescription() {
      if (this.searchKeyword) {
        return `未找到包含"${this.searchKeyword}"的${this.currentTabName}`
      }
      return `点击下方按钮添加${this.currentTabName}到黑名单`
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 显示帮助
    showHelp() {
      alert('黑名单功能说明：\n\n1. 员工黑名单：被加入的员工将无法访问系统\n2. 网站黑名单：被加入的网站将被系统屏蔽\n3. 客户黑名单：被加入的客户将被标记为风险客户')
    },
    
    // 切换标签页
    switchTab(tabId) {
      this.activeTab = tabId
      this.searchKeyword = ''
    },
    
    // 搜索处理
    handleSearch() {
      // 实时搜索，这里可以添加防抖逻辑
    },
    
    // 执行搜索
    performSearch() {
      console.log('搜索:', this.searchKeyword)
    },
    
    // 显示添加弹窗
    showAddDialog() {
      this.showAddModal = true
      this.newItemName = ''
      this.newItemType = '个人'
    },
    
    // 隐藏添加弹窗
    hideAddDialog() {
      this.showAddModal = false
    },
    
    // 添加到黑名单
    addToBlacklist() {
      if (!this.newItemName.trim()) {
        alert('请输入名称')
        return
      }
      
      const newItem = {
        id: Date.now(),
        name: this.newItemName.trim(),
        type: this.activeTab === 'customer' ? this.newItemType : this.currentTabName
      }
      
      this.blacklistData[this.activeTab].push(newItem)
      this.updateTabCounts()
      this.hideAddDialog()
      
      console.log('添加到黑名单:', newItem)
    },
    
    // 从黑名单移除
    removeFromBlacklist(itemId) {
      if (confirm('确定要从黑名单中移除此项吗？')) {
        const index = this.currentBlacklist.findIndex(item => item.id === itemId)
        if (index > -1) {
          this.currentBlacklist.splice(index, 1)
          this.updateTabCounts()
        }
      }
    },
    
    // 更新标签页计数
    updateTabCounts() {
      this.tabs.forEach(tab => {
        tab.count = this.blacklistData[tab.id].length
      })
    }
  },
  
  mounted() {
    this.updateTabCounts()
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.blacklist-settings {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏 */
.header-bar {
  background: white;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn, .help-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover, .help-btn:hover {
  background: #f0f0f0;
}

.help-btn {
  color: #007AFF;
  border: 1px solid #007AFF;
  font-size: 14px;
  font-weight: bold;
}

.page-title {
  font-size: 17px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 标签页切换 */
.tab-section {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.tab-container {
  display: flex;
  padding: 0 16px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn.active {
  border-bottom-color: #007AFF;
}

.tab-name {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.tab-btn.active .tab-name {
  color: #007AFF;
}

.tab-count {
  background: #f0f0f0;
  color: #666;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.tab-btn.active .tab-count {
  background: #007AFF;
  color: white;
}

/* 搜索栏 */
.search-section {
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 8px 16px;
}

.search-icon {
  font-size: 16px;
  color: #999;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  background: #007AFF;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background: #0056b3;
}

/* 内容区域 */
.content-section {
  flex: 1;
  padding: 16px;
}

/* 黑名单项列表 */
.blacklist-items {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.blacklist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.blacklist-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.item-type {
  font-size: 12px;
  color: #666;
}

.remove-btn {
  background: #ff3b30;
  border: none;
  color: white;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background: #d70015;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
}

/* 添加按钮 */
.add-section {
  padding: 16px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.add-btn {
  width: 100%;
  background: #007AFF;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background: #0056b3;
}

/* 添加弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.add-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #666;
}

.modal-content {
  padding: 20px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
}

.modal-input, .modal-select {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  background: white;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.modal-input:focus, .modal-select:focus {
  outline: none;
  border-color: #007AFF;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  border: none;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-btn {
  background: #007AFF;
  color: white;
}

.confirm-btn:hover {
  background: #0056b3;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .tab-container {
    padding: 0 12px;
  }

  .search-section {
    padding: 12px;
  }

  .content-section {
    padding: 12px;
  }

  .add-section {
    padding: 12px;
  }

  .modal-overlay {
    padding: 16px;
  }

  .blacklist-item {
    padding: 12px;
  }

  .empty-state {
    padding: 40px 16px;
  }
}
</style>
