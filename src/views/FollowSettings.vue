<template>
  <div class="follow-settings">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>
      <div class="header-tabs">
        <button
          :class="['header-tab', { active: activeTab === 'followed' }]"
          @click="switchTab('followed')"
        >
          已关注
        </button>
        <button
          :class="['header-tab', { active: activeTab === 'unfollowed' }]"
          @click="switchTab('unfollowed')"
        >
          未关注
        </button>
      </div>
      <button class="more-btn" @click="showMoreOptions">
        <span class="more-icon">⋯</span>
      </button>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['category-tab', { active: activeCategory === category.id }]"
        @click="switchCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="搜索名称或关键字"
          class="search-input"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 关注列表 -->
    <div class="follow-list">
      <div 
        v-for="item in filteredFollowList" 
        :key="item.id"
        class="follow-item"
      >
        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-category">{{ item.categoryName }}</span>
        </div>
        <div class="item-actions">
          <button class="menu-btn" @click="showItemMenu(item.id)">
            <span class="menu-icon">☰</span>
          </button>
          <button 
            class="follow-btn"
            :class="{ followed: item.isFollowed }"
            @click="toggleFollow(item.id)"
          >
            <span class="follow-icon">{{ item.isFollowed ? '✓' : '○' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredFollowList.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">{{ emptyStateText }}</div>
    </div>

    <!-- 操作菜单弹窗 -->
    <div v-if="showMenuModal" class="modal-overlay" @click="hideItemMenu">
      <div class="menu-modal" @click.stop>
        <div class="menu-item" @click="editItem">
          <span class="menu-item-icon">✏️</span>
          <span class="menu-item-text">编辑</span>
        </div>
        <div class="menu-item" @click="deleteItem">
          <span class="menu-item-icon">🗑️</span>
          <span class="menu-item-text">删除</span>
        </div>
        <div class="menu-item" @click="shareItem">
          <span class="menu-item-icon">📤</span>
          <span class="menu-item-text">分享</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item cancel" @click="hideItemMenu">
          <span class="menu-item-text">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FollowSettings',
  data() {
    return {
      activeTab: 'followed', // 'followed' | 'unfollowed'
      activeCategory: 'employee',
      searchKeyword: '',
      showMenuModal: false,
      selectedItemId: null,
      
      // 分类配置
      categories: [
        { id: 'employee', name: '员工' },
        { id: 'customer', name: '客户' },
        { id: 'website', name: '网站' }
      ],
      
      // 关注数据
      followData: [
        { id: 1, name: '马雯', category: 'employee', categoryName: '员工', isFollowed: true },
        { id: 2, name: '常东生', category: 'employee', categoryName: '员工', isFollowed: true },
        { id: 3, name: '贵州航空股份公司', category: 'customer', categoryName: '客户', isFollowed: true },
        { id: 4, name: '营销司机', category: 'employee', categoryName: '员工', isFollowed: true },
        { id: 5, name: '深圳代理运营', category: 'employee', categoryName: '员工', isFollowed: true },
        { id: 6, name: '徐君', category: 'employee', categoryName: '员工', isFollowed: true },
        { id: 7, name: '深圳源泽谢委', category: 'customer', categoryName: '客户', isFollowed: true },
        { id: 8, name: '张文华', category: 'employee', categoryName: '员工', isFollowed: true },
        { id: 9, name: '深圳代理复合山', category: 'customer', categoryName: '客户', isFollowed: true },
        { id: 10, name: '朱启航', category: 'employee', categoryName: '员工', isFollowed: true },
        
        // 未关注的数据
        { id: 11, name: '李明', category: 'employee', categoryName: '员工', isFollowed: false },
        { id: 12, name: '王小红', category: 'customer', categoryName: '客户', isFollowed: false },
        { id: 13, name: '腾讯官网', category: 'website', categoryName: '网站', isFollowed: false }
      ]
    }
  },
  
  computed: {
    // 过滤后的关注列表
    filteredFollowList() {
      let filtered = this.followData.filter(item => {
        // 根据标签页过滤
        const tabMatch = this.activeTab === 'followed' ? item.isFollowed : !item.isFollowed
        // 根据分类过滤
        const categoryMatch = item.category === this.activeCategory
        // 根据搜索关键词过滤
        const searchMatch = !this.searchKeyword || 
          item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        
        return tabMatch && categoryMatch && searchMatch
      })
      
      return filtered
    },
    
    // 空状态文本
    emptyStateText() {
      if (this.searchKeyword) {
        return `未找到包含"${this.searchKeyword}"的${this.getCurrentCategoryName()}`
      }
      return this.activeTab === 'followed' 
        ? `暂无已关注的${this.getCurrentCategoryName()}`
        : `暂无未关注的${this.getCurrentCategoryName()}`
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 显示更多选项
    showMoreOptions() {
      console.log('显示更多选项')
    },
    
    // 切换标签页
    switchTab(tab) {
      this.activeTab = tab
      this.searchKeyword = ''
    },
    
    // 切换分类
    switchCategory(categoryId) {
      this.activeCategory = categoryId
      this.searchKeyword = ''
    },
    
    // 搜索处理
    handleSearch() {
      // 实时搜索
    },
    
    // 切换关注状态
    toggleFollow(itemId) {
      const item = this.followData.find(item => item.id === itemId)
      if (item) {
        item.isFollowed = !item.isFollowed
        console.log(`${item.isFollowed ? '关注' : '取消关注'}:`, item.name)
      }
    },
    
    // 显示项目菜单
    showItemMenu(itemId) {
      this.selectedItemId = itemId
      this.showMenuModal = true
    },
    
    // 隐藏项目菜单
    hideItemMenu() {
      this.showMenuModal = false
      this.selectedItemId = null
    },
    
    // 编辑项目
    editItem() {
      const item = this.followData.find(item => item.id === this.selectedItemId)
      console.log('编辑项目:', item)
      this.hideItemMenu()
    },
    
    // 删除项目
    deleteItem() {
      if (confirm('确定要删除此项吗？')) {
        const index = this.followData.findIndex(item => item.id === this.selectedItemId)
        if (index > -1) {
          this.followData.splice(index, 1)
        }
      }
      this.hideItemMenu()
    },
    
    // 分享项目
    shareItem() {
      const item = this.followData.find(item => item.id === this.selectedItemId)
      console.log('分享项目:', item)
      this.hideItemMenu()
    },
    
    // 获取当前分类名称
    getCurrentCategoryName() {
      const category = this.categories.find(cat => cat.id === this.activeCategory)
      return category ? category.name : ''
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.follow-settings {
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

.back-btn, .more-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-btn:hover, .more-btn:hover {
  background: #f0f0f0;
}

/* 头部标签页 */
.header-tabs {
  display: flex;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 2px;
}

.header-tab {
  background: none;
  border: none;
  padding: 6px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.header-tab.active {
  background: #007AFF;
  color: white;
}

/* 分类标签 */
.category-tabs {
  background: white;
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
}

.category-tab {
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.category-tab.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

/* 搜索栏 */
.search-section {
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.search-container {
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

/* 关注列表 */
.follow-list {
  flex: 1;
  padding: 0 16px;
  background: white;
}

.follow-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.follow-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.item-category {
  font-size: 12px;
  color: #999;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: #f0f0f0;
  color: #666;
}

.follow-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 12px;
}

.follow-btn.followed {
  background: #007AFF;
  border-color: #007AFF;
  color: white;
}

.follow-btn:hover {
  transform: scale(1.1);
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  color: #666;
  line-height: 1.4;
}

/* 操作菜单弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.menu-modal {
  background: white;
  border-radius: 12px 12px 0 0;
  width: 100%;
  max-width: 400px;
  padding: 20px 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.cancel {
  justify-content: center;
  color: #666;
  font-weight: 500;
}

.menu-item-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.menu-item-text {
  font-size: 16px;
  color: #333;
}

.menu-divider {
  height: 1px;
  background: #e9ecef;
  margin: 8px 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .header-bar {
    padding: 0 12px;
  }

  .category-tabs {
    padding: 0 12px;
  }

  .search-section {
    padding: 12px;
  }

  .follow-list {
    padding: 0 12px;
  }

  .follow-item {
    padding: 12px 0;
  }

  .empty-state {
    padding: 40px 16px;
  }
}
</style>
