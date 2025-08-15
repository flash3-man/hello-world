<template>
  <div class="user-profile">
    <!-- 顶部用户信息卡片 -->
    <div class="user-info-card">
      <button class="edit-profile-btn" @click="editProfile">
        编辑资料
      </button>
      <div class="user-content">
        <div class="user-avatar">
          <div class="avatar-icon">👤</div>
        </div>
        <div class="user-details">
          <h2 class="user-name">{{ userInfo.name }}</h2>
          <p class="user-subtitle">{{ userInfo.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- 新功能提示 -->
    <div class="new-feature-section" v-if="newFeatures.length > 0">
      <div 
        v-for="feature in newFeatures" 
        :key="feature.id"
        class="feature-item"
        @click="navigateToFeature(feature.route)"
      >
        <div class="feature-icon">{{ feature.icon }}</div>
        <div class="feature-content">
          <span class="feature-name">{{ feature.name }}</span>
          <span class="new-badge">新功能</span>
        </div>
        <div class="feature-arrow">›</div>
      </div>
    </div>

    <!-- 功能菜单列表 -->
    <div class="menu-section">
      <div 
        v-for="menuItem in menuItems" 
        :key="menuItem.id"
        class="menu-item"
        @click="handleMenuClick(menuItem)"
      >
        <div class="menu-icon" :style="{ color: menuItem.iconColor }">
          {{ menuItem.icon }}
        </div>
        <div class="menu-content">
          <span class="menu-title">{{ menuItem.title }}</span>
          <span v-if="menuItem.subtitle" class="menu-subtitle">{{ menuItem.subtitle }}</span>
        </div>
        <div class="menu-action">
          <span v-if="menuItem.badge" class="menu-badge">{{ menuItem.badge }}</span>
          <div class="menu-arrow">›</div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="logout">
        退出登录
      </button>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-navigation">
      <div 
        class="nav-item"
        @click="navigateToPage('home')"
      >
        <div class="nav-icon">🏠</div>
        <div class="nav-label">首页</div>
      </div>
      <div 
        class="nav-item"
        @click="navigateToPage('focus')"
      >
        <div class="nav-icon">⭐</div>
        <div class="nav-label">关注</div>
      </div>
      <div 
        class="nav-item"
        @click="navigateToPage('analysis')"
      >
        <div class="nav-icon">📊</div>
        <div class="nav-label">解读</div>
      </div>
      <div 
        class="nav-item active"
      >
        <div class="nav-icon">👤</div>
        <div class="nav-label">我的</div>
      </div>
    </div>

    <!-- 添加小程序弹窗 -->
    <AddMiniProgramModal
      :visible="showAddMiniProgramModal"
      @cancel="hideAddMiniProgramModal"
      @confirm="handleAddMiniProgram"
    />
  </div>
</template>

<script>
import AddMiniProgramModal from '@/components/AddMiniProgramModal.vue'

export default {
  name: 'UserProfile',
  components: {
    AddMiniProgramModal
  },
  data() {
    return {
      userInfo: {
        name: '王轮丽',
        subtitle: '渠道测试账号'
      },

      // 弹窗状态
      showAddMiniProgramModal: false,
      
      // 新功能列表
      newFeatures: [
        {
          id: 1,
          name: '舟谱易商',
          icon: '🚢',
          route: '/business-platform'
        }
      ],
      
      // 菜单项列表
      menuItems: [
        {
          id: 1,
          title: '扫一扫',
          icon: '📷',
          iconColor: '#4A90E2',
          action: 'openScanner'
        },
        {
          id: 2,
          title: '消息',
          subtitle: '全部消息',
          icon: '💬',
          iconColor: '#50C878',
          route: '/messages'
        },
        {
          id: 3,
          title: '导出文件管理',
          icon: '📁',
          iconColor: '#FF9500',
          route: '/export-files'
        },
        {
          id: 4,
          title: '添加小程序',
          icon: '📱',
          iconColor: '#007AFF',
          action: 'openAddMiniProgramModal'
        },
        {
          id: 5,
          title: '指标展示设置',
          icon: '⚙️',
          iconColor: '#8E8E93',
          route: '/indicator-display-settings'
        },
        {
          id: 6,
          title: '黑名单设置',
          icon: '🚫',
          iconColor: '#FF3B30',
          route: '/blacklist-settings'
        },
        {
          id: 7,
          title: '关注设置',
          icon: '❤️',
          iconColor: '#FF2D92',
          route: '/follow-settings'
        },
        {
          id: 8,
          title: '帮助中心',
          icon: '❓',
          iconColor: '#5856D6',
          route: '/help-center'
        },
        {
          id: 9,
          title: '关于超悦',
          icon: '⭐',
          iconColor: '#AF52DE',
          route: '/about-chaoyue'
        },
        {
          id: 10,
          title: '意见反馈',
          icon: '📝',
          iconColor: '#FF9500',
          route: '/feedback'
        },
        {
          id: 11,
          title: '清除缓存',
          icon: '🗑️',
          iconColor: '#8E8E93',
          action: 'clearCache'
        }
      ]
    }
  },
  
  methods: {
    // 编辑个人资料
    editProfile() {
      console.log('编辑个人资料')
      this.$router.push('/edit-profile')
    },
    
    // 导航到新功能
    navigateToFeature(route) {
      console.log('导航到新功能:', route)
      this.$router.push(route)
    },
    
    // 处理菜单点击
    handleMenuClick(menuItem) {
      if (menuItem.action) {
        // 执行特定动作
        this[menuItem.action]()
      } else if (menuItem.route) {
        // 导航到页面
        console.log('导航到:', menuItem.title)
        this.$router.push(menuItem.route)
      }
    },
    
    // 打开扫一扫
    openScanner() {
      console.log('打开扫一扫功能')
      // 检查是否支持摄像头
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // 这里可以集成二维码扫描库，如 qrcode-reader
        alert('扫一扫功能开发中，将支持二维码和条形码扫描')
      } else {
        alert('您的设备不支持摄像头功能')
      }
    },

    // 清除缓存
    clearCache() {
      if (confirm('确定要清除缓存吗？这将清除所有本地数据。')) {
        localStorage.clear()
        sessionStorage.clear()
        alert('缓存已清除')
        // 刷新页面
        window.location.reload()
      }
    },
    
    // 退出登录
    logout() {
      if (confirm('确定要退出登录吗？')) {
        // 清除用户数据
        localStorage.removeItem('userToken')
        localStorage.removeItem('userInfo')
        
        // 跳转到登录页
        this.$router.push('/login')
      }
    },
    
    // 底部导航
    navigateToPage(page) {
      switch(page) {
        case 'home':
          this.$router.push('/')
          break
        case 'focus':
          this.$router.push('/focus-list')
          break
        case 'analysis':
          this.$router.push('/business-analysis')
          break
      }
    },

    // 显示添加小程序弹窗
    openAddMiniProgramModal() {
      this.showAddMiniProgramModal = true
    },

    // 隐藏添加小程序弹窗
    hideAddMiniProgramModal() {
      this.showAddMiniProgramModal = false
    },

    // 处理添加小程序
    handleAddMiniProgram(miniProgramData) {
      console.log('添加小程序:', miniProgramData)

      // 这里可以调用API保存小程序信息
      // 模拟保存成功
      alert(`小程序"${miniProgramData.name}"已添加到桌面`)

      // 隐藏弹窗
      this.hideAddMiniProgramModal()

      // 可以在这里更新本地数据或刷新页面
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.user-profile {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px; /* 为底部导航留空间 */
}

/* 用户信息卡片 */
.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px 30px;
  position: relative;
  color: white;
}

.edit-profile-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-profile-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.user-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.avatar-icon {
  font-size: 36px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-name {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.user-subtitle {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

/* 新功能区域 */
.new-feature-section {
  background: white;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item:hover {
  background-color: #f8f9fa;
}

.feature-icon {
  font-size: 24px;
  margin-right: 16px;
  width: 32px;
  text-align: center;
}

.feature-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.new-badge {
  background: #ff4757;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.feature-arrow {
  font-size: 18px;
  color: #c7c7cc;
}

/* 菜单区域 */
.menu-section {
  background: white;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-icon {
  font-size: 20px;
  margin-right: 16px;
  width: 28px;
  text-align: center;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
}

.menu-subtitle {
  font-size: 12px;
  color: #8e8e93;
}

.menu-action {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-badge {
  background: #ff3b30;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.menu-arrow {
  font-size: 18px;
  color: #c7c7cc;
}

/* 退出登录区域 */
.logout-section {
  margin: 20px 16px;
}

.logout-btn {
  width: 100%;
  background: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  color: #ff3b30;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logout-btn:hover {
  background-color: #f8f9fa;
}

/* 底部导航栏 */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #e9ecef;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 60px;
}

.nav-item:hover {
  background-color: #f8f9fa;
}

.nav-item.active {
  color: #007AFF;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .user-info-card {
    padding: 30px 16px 24px;
  }

  .edit-profile-btn {
    top: 16px;
    right: 16px;
    padding: 6px 12px;
    font-size: 11px;
  }

  .user-avatar {
    width: 70px;
    height: 70px;
    margin-bottom: 12px;
  }

  .avatar-icon {
    font-size: 32px;
  }

  .user-name {
    font-size: 20px;
  }

  .user-subtitle {
    font-size: 13px;
  }

  .new-feature-section,
  .menu-section {
    margin: 8px 12px;
  }

  .feature-item,
  .menu-item {
    padding: 14px;
  }

  .logout-section {
    margin: 16px 12px;
  }
}
</style>
