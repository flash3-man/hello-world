<template>
  <div class="edit-profile">
    <!-- 顶部导航栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>
      <h1 class="page-title">编辑资料</h1>
      <button class="save-btn" @click="saveProfile" :disabled="!hasChanges">
        保存
      </button>
    </div>

    <!-- 头像编辑区域 -->
    <div class="avatar-section">
      <div class="avatar-container">
        <div class="avatar-display">
          <div class="avatar-icon">👤</div>
        </div>
        <button class="change-avatar-btn" @click="changeAvatar">
          更换头像
        </button>
      </div>
    </div>

    <!-- 基本信息编辑 -->
    <div class="form-section">
      <div class="form-group">
        <label class="form-label">姓名</label>
        <input 
          v-model="profileData.name" 
          type="text" 
          class="form-input"
          placeholder="请输入姓名"
          @input="markAsChanged"
        >
      </div>

      <div class="form-group">
        <label class="form-label">职位</label>
        <input 
          v-model="profileData.position" 
          type="text" 
          class="form-input"
          placeholder="请输入职位"
          @input="markAsChanged"
        >
      </div>

      <div class="form-group">
        <label class="form-label">部门</label>
        <select v-model="profileData.department" class="form-select" @change="markAsChanged">
          <option value="">请选择部门</option>
          <option value="sales">销售部</option>
          <option value="marketing">市场部</option>
          <option value="finance">财务部</option>
          <option value="hr">人事部</option>
          <option value="tech">技术部</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">手机号</label>
        <input 
          v-model="profileData.phone" 
          type="tel" 
          class="form-input"
          placeholder="请输入手机号"
          @input="markAsChanged"
        >
      </div>

      <div class="form-group">
        <label class="form-label">邮箱</label>
        <input 
          v-model="profileData.email" 
          type="email" 
          class="form-input"
          placeholder="请输入邮箱"
          @input="markAsChanged"
        >
      </div>

      <div class="form-group">
        <label class="form-label">个人简介</label>
        <textarea 
          v-model="profileData.bio" 
          class="form-textarea"
          placeholder="请输入个人简介"
          rows="3"
          @input="markAsChanged"
        ></textarea>
      </div>
    </div>

    <!-- 偏好设置 -->
    <div class="preferences-section">
      <h3 class="section-title">偏好设置</h3>
      
      <div class="preference-group">
        <div class="preference-item">
          <span class="preference-label">接收推送通知</span>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="profileData.preferences.notifications"
              @change="markAsChanged"
            >
            <span class="slider"></span>
          </label>
        </div>

        <div class="preference-item">
          <span class="preference-label">数据自动刷新</span>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="profileData.preferences.autoRefresh"
              @change="markAsChanged"
            >
            <span class="slider"></span>
          </label>
        </div>

        <div class="preference-item">
          <span class="preference-label">深色模式</span>
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="profileData.preferences.darkMode"
              @change="markAsChanged"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 危险操作区域 -->
    <div class="danger-section">
      <h3 class="section-title danger-title">危险操作</h3>
      <button class="danger-btn" @click="resetPassword">
        重置密码
      </button>
      <button class="danger-btn" @click="deleteAccount">
        注销账户
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProfile',
  data() {
    return {
      hasChanges: false,
      profileData: {
        name: '王轮丽',
        position: '销售经理',
        department: 'sales',
        phone: '138****8888',
        email: 'wanglunli@company.com',
        bio: '走进明试成号',
        preferences: {
          notifications: true,
          autoRefresh: true,
          darkMode: false
        }
      },
      originalData: null
    }
  },
  
  mounted() {
    // 保存原始数据用于比较
    this.originalData = JSON.parse(JSON.stringify(this.profileData))
  },
  
  methods: {
    // 返回上一页
    goBack() {
      if (this.hasChanges) {
        if (confirm('您有未保存的更改，确定要离开吗？')) {
          this.$router.go(-1)
        }
      } else {
        this.$router.go(-1)
      }
    },
    
    // 标记为已更改
    markAsChanged() {
      this.hasChanges = true
    },
    
    // 更换头像
    changeAvatar() {
      alert('更换头像功能开发中')
    },
    
    // 保存资料
    saveProfile() {
      // 模拟保存API调用
      console.log('保存用户资料:', this.profileData)
      
      // 这里应该调用API保存数据
      setTimeout(() => {
        alert('资料保存成功')
        this.hasChanges = false
        this.originalData = JSON.parse(JSON.stringify(this.profileData))
      }, 500)
    },
    
    // 重置密码
    resetPassword() {
      if (confirm('确定要重置密码吗？重置链接将发送到您的邮箱。')) {
        console.log('重置密码')
        alert('重置密码邮件已发送')
      }
    },
    
    // 注销账户
    deleteAccount() {
      if (confirm('警告：注销账户将永久删除您的所有数据，此操作不可恢复！确定要继续吗？')) {
        if (confirm('请再次确认：您真的要注销账户吗？')) {
          console.log('注销账户')
          alert('账户注销申请已提交，将在7个工作日内处理')
        }
      }
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.edit-profile {
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

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #007AFF;
  cursor: pointer;
  padding: 8px;
}

.back-icon {
  font-size: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.save-btn {
  background: #007AFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:disabled {
  background: #c7c7cc;
  cursor: not-allowed;
}

.save-btn:not(:disabled):hover {
  background: #0056b3;
}

/* 内容区域 */
.avatar-section,
.form-section,
.preferences-section,
.danger-section {
  margin-top: 44px;
  background: white;
  margin-bottom: 12px;
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-section:first-child {
  margin-top: 60px;
}

/* 头像区域 */
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
}

.avatar-display {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.avatar-icon {
  font-size: 40px;
  color: white;
}

.change-avatar-btn {
  background: #007AFF;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: #0056b3;
}

/* 表单区域 */
.form-section {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007AFF;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* 偏好设置区域 */
.preferences-section {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.preference-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.preference-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007AFF;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* 危险操作区域 */
.danger-section {
  padding: 20px;
}

.danger-title {
  color: #ff3b30;
}

.danger-btn {
  width: 100%;
  background: white;
  border: 1px solid #ff3b30;
  color: #ff3b30;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.danger-btn:last-child {
  margin-bottom: 0;
}

.danger-btn:hover {
  background: #ff3b30;
  color: white;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .header-bar {
    padding: 0 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .avatar-section,
  .form-section,
  .preferences-section,
  .danger-section {
    margin-left: 12px;
    margin-right: 12px;
  }

  .avatar-container {
    padding: 24px 16px;
  }

  .avatar-display {
    width: 70px;
    height: 70px;
  }

  .avatar-icon {
    font-size: 35px;
  }

  .form-section,
  .preferences-section,
  .danger-section {
    padding: 16px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    font-size: 16px; /* 防止iOS缩放 */
  }
}
</style>
