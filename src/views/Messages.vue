<template>
  <div class="messages-page">
    <!-- 顶部导航栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>
      <h1 class="page-title">消息</h1>
      <button class="more-btn" @click="showMoreOptions">
        <span class="more-icon">⋯</span>
      </button>
    </div>

    <!-- 消息分类标签 -->
    <div class="message-tabs">
      <button 
        v-for="tab in messageTabs" 
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 消息列表 -->
    <div class="messages-list">
      <div 
        v-for="message in filteredMessages" 
        :key="message.id"
        class="message-item"
        :class="{ unread: !message.read }"
        @click="openMessage(message)"
      >
        <div class="message-avatar">
          <div class="avatar-icon" :style="{ backgroundColor: message.avatarColor }">
            {{ message.avatar }}
          </div>
          <div v-if="!message.read" class="unread-dot"></div>
        </div>
        
        <div class="message-content">
          <div class="message-header">
            <span class="sender-name">{{ message.sender }}</span>
            <span class="message-time">{{ formatTime(message.time) }}</span>
          </div>
          <div class="message-title">{{ message.title }}</div>
          <div class="message-preview">{{ message.preview }}</div>
        </div>
        
        <div class="message-action">
          <div class="action-arrow">›</div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredMessages.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">暂无{{ currentTabLabel }}消息</div>
    </div>

    <!-- 更多操作菜单 -->
    <div v-if="showMoreMenu" class="more-menu-overlay" @click="hideMoreOptions">
      <div class="more-menu" @click.stop>
        <button class="menu-option" @click="markAllAsRead">
          全部标记为已读
        </button>
        <button class="menu-option" @click="clearAllMessages">
          清空所有消息
        </button>
        <button class="menu-option cancel" @click="hideMoreOptions">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessagesPage',
  data() {
    return {
      activeTab: 'all',
      showMoreMenu: false,
      
      messageTabs: [
        { key: 'all', label: '全部', count: 0 },
        { key: 'system', label: '系统', count: 2 },
        { key: 'work', label: '工作', count: 1 },
        { key: 'notice', label: '通知', count: 0 }
      ],
      
      messages: [
        {
          id: 1,
          type: 'system',
          sender: '系统通知',
          avatar: '🔔',
          avatarColor: '#007AFF',
          title: '数据更新完成',
          preview: '您的业绩数据已更新，请查看最新报告',
          time: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
          read: false
        },
        {
          id: 2,
          type: 'work',
          sender: '张经理',
          avatar: '👨‍💼',
          avatarColor: '#34C759',
          title: '月度目标调整',
          preview: '请查看本月销售目标的最新调整方案',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
          read: false
        },
        {
          id: 3,
          type: 'system',
          sender: '系统维护',
          avatar: '⚙️',
          avatarColor: '#FF9500',
          title: '系统维护通知',
          preview: '系统将于今晚22:00-24:00进行维护升级',
          time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4小时前
          read: true
        },
        {
          id: 4,
          type: 'notice',
          sender: '人事部',
          avatar: '👥',
          avatarColor: '#FF3B30',
          title: '培训通知',
          preview: '新员工培训将于下周一开始，请准时参加',
          time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
          read: true
        }
      ]
    }
  },
  
  computed: {
    filteredMessages() {
      if (this.activeTab === 'all') {
        return [...this.messages].sort((a, b) => b.time - a.time)
      }
      return this.messages
        .filter(msg => msg.type === this.activeTab)
        .sort((a, b) => b.time - a.time)
    },
    
    currentTabLabel() {
      const tab = this.messageTabs.find(t => t.key === this.activeTab)
      return tab ? tab.label : ''
    }
  },
  
  mounted() {
    this.updateTabCounts()
  },
  
  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 切换标签
    switchTab(tabKey) {
      this.activeTab = tabKey
    },
    
    // 显示更多选项
    showMoreOptions() {
      this.showMoreMenu = true
    },
    
    // 隐藏更多选项
    hideMoreOptions() {
      this.showMoreMenu = false
    },
    
    // 打开消息详情
    openMessage(message) {
      console.log('打开消息:', message)
      
      // 标记为已读
      if (!message.read) {
        message.read = true
        this.updateTabCounts()
      }
      
      // 跳转到消息详情页
      this.$router.push(`/message-detail/${message.id}`)
    },
    
    // 格式化时间
    formatTime(time) {
      const now = new Date()
      const diff = now - time
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (minutes < 60) {
        return `${minutes}分钟前`
      } else if (hours < 24) {
        return `${hours}小时前`
      } else if (days < 7) {
        return `${days}天前`
      } else {
        return time.toLocaleDateString()
      }
    },
    
    // 更新标签计数
    updateTabCounts() {
      this.messageTabs.forEach(tab => {
        if (tab.key === 'all') {
          tab.count = this.messages.filter(msg => !msg.read).length
        } else {
          tab.count = this.messages.filter(msg => msg.type === tab.key && !msg.read).length
        }
      })
    },
    
    // 全部标记为已读
    markAllAsRead() {
      this.messages.forEach(msg => {
        msg.read = true
      })
      this.updateTabCounts()
      this.hideMoreOptions()
      alert('所有消息已标记为已读')
    },
    
    // 清空所有消息
    clearAllMessages() {
      if (confirm('确定要清空所有消息吗？此操作不可恢复。')) {
        this.messages = []
        this.updateTabCounts()
        this.hideMoreOptions()
      }
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.messages-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.back-btn,
.more-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #007AFF;
  cursor: pointer;
  padding: 8px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 消息分类标签 */
.message-tabs {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding: 12px 16px;
  gap: 8px;
  border-bottom: 1px solid #e9ecef;
  z-index: 999;
}

.tab-btn {
  position: relative;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn.active {
  background: #007AFF;
  color: white;
  border-color: #007AFF;
}

.tab-badge {
  background: #ff3b30;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
  min-width: 16px;
  text-align: center;
}

.tab-btn.active .tab-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

/* 消息列表 */
.messages-list {
  margin-top: 100px; /* 为固定的标签栏留空间 */
  padding: 0 16px;
}

.message-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.message-item.unread {
  border-left: 4px solid #007AFF;
}

.message-avatar {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.unread-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #ff3b30;
  border-radius: 50%;
  border: 2px solid white;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sender-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #8e8e93;
}

.message-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-preview {
  font-size: 13px;
  color: #8e8e93;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-action {
  margin-left: 8px;
  flex-shrink: 0;
}

.action-arrow {
  font-size: 18px;
  color: #c7c7cc;
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
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #8e8e93;
}

/* 更多操作菜单 */
.more-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.more-menu {
  background: white;
  border-radius: 12px 12px 0 0;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
}

.menu-option {
  width: 100%;
  background: none;
  border: none;
  padding: 16px;
  font-size: 16px;
  color: #007AFF;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;
}

.menu-option:hover {
  background: #f8f9fa;
}

.menu-option.cancel {
  color: #ff3b30;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .header-bar {
    padding: 0 12px;
  }

  .message-tabs {
    padding: 8px 12px;
  }

  .messages-list {
    padding: 0 12px;
  }

  .message-item {
    padding: 12px;
  }

  .avatar-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .sender-name {
    font-size: 13px;
  }

  .message-title {
    font-size: 14px;
  }

  .message-preview {
    font-size: 12px;
  }
}
</style>
