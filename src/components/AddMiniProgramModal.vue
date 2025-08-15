<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="add-miniprogram-modal" @click.stop>
      <!-- 弹窗标题 -->
      <div class="modal-header">
        <h3 class="modal-title">添加到桌面</h3>
      </div>

      <!-- 图标选择区域 -->
      <div class="icon-selection-section">
        <div class="icon-grid">
          <!-- 默认图标 -->
          <div class="icon-item default-icon">
            <div class="icon-placeholder">
              <div class="icon-bar bar1"></div>
              <div class="icon-bar bar2"></div>
              <div class="icon-bar bar3"></div>
            </div>
          </div>
          
          <!-- 蓝色图标 -->
          <div 
            class="icon-item" 
            :class="{ selected: selectedIcon === 'blue' }"
            @click="selectIcon('blue')"
          >
            <div class="icon-circle blue-icon"></div>
          </div>
          
          <!-- 其他颜色图标 -->
          <div 
            v-for="color in iconColors" 
            :key="color"
            class="icon-item" 
            :class="{ selected: selectedIcon === color }"
            @click="selectIcon(color)"
          >
            <div class="icon-circle" :class="`${color}-icon`"></div>
          </div>
        </div>
      </div>

      <!-- 名称输入区域 -->
      <div class="name-input-section">
        <label class="input-label">名称</label>
        <input
          type="text"
          v-model="miniProgramName"
          placeholder="请输入小程序名称"
          class="name-input"
          maxlength="20"
        />
      </div>

      <!-- 底部按钮 -->
      <div class="modal-actions">
        <button class="cancel-btn" @click="handleCancel">取消</button>
        <button class="confirm-btn" @click="handleConfirm" :disabled="!canConfirm">添加</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddMiniProgramModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      selectedIcon: 'blue', // 默认选中蓝色图标
      miniProgramName: '',
      iconColors: ['gray', 'green', 'yellow'] // 其他可选颜色
    }
  },
  
  computed: {
    // 是否可以确认添加
    canConfirm() {
      return this.miniProgramName.trim().length > 0 && this.selectedIcon
    }
  },
  
  methods: {
    // 选择图标
    selectIcon(color) {
      this.selectedIcon = color
    },
    
    // 处理遮罩层点击
    handleOverlayClick() {
      this.handleCancel()
    },
    
    // 取消操作
    handleCancel() {
      this.resetForm()
      this.$emit('cancel')
    },
    
    // 确认添加
    handleConfirm() {
      if (!this.canConfirm) return
      
      const miniProgramData = {
        name: this.miniProgramName.trim(),
        icon: this.selectedIcon,
        id: Date.now() // 简单的ID生成
      }
      
      this.$emit('confirm', miniProgramData)
      this.resetForm()
    },
    
    // 重置表单
    resetForm() {
      this.selectedIcon = 'blue'
      this.miniProgramName = ''
    }
  },
  
  watch: {
    visible(newVal) {
      if (newVal) {
        // 弹窗打开时重置表单
        this.resetForm()
      }
    }
  }
}
</script>

<style scoped>
/* 遮罩层 */
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

/* 弹窗主体 */
.add-miniprogram-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 弹窗标题 */
.modal-header {
  padding: 20px 20px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 图标选择区域 */
.icon-selection-section {
  padding: 20px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  justify-items: center;
}

.icon-item {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.icon-item:hover {
  transform: scale(1.05);
}

.icon-item.selected {
  border-color: #007AFF;
  background: #e3f2fd;
}

/* 默认图标样式 */
.default-icon {
  background: #f0f0f0;
}

.icon-placeholder {
  width: 24px;
  height: 24px;
  position: relative;
}

.icon-bar {
  height: 3px;
  background: #999;
  border-radius: 2px;
  margin-bottom: 3px;
}

.bar1 { width: 20px; }
.bar2 { width: 16px; }
.bar3 { width: 12px; }

/* 彩色图标样式 */
.icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.blue-icon {
  background: #007AFF;
}

.gray-icon {
  background: #8E8E93;
}

.green-icon {
  background: #34C759;
}

.yellow-icon {
  background: #FFCC02;
}

/* 名称输入区域 */
.name-input-section {
  padding: 0 20px 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
}

.name-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  background: white;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.name-input:focus {
  outline: none;
  border-color: #007AFF;
}

.name-input::placeholder {
  color: #999;
}

/* 底部按钮 */
.modal-actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  border: none;
  font-size: 16px;
  font-weight: 500;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.cancel-btn {
  color: #666;
  border-right: 1px solid #f0f0f0;
  border-radius: 0 0 0 12px;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.confirm-btn {
  color: #007AFF;
  border-radius: 0 0 12px 0;
}

.confirm-btn:hover {
  background: #f0f8ff;
}

.confirm-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.confirm-btn:disabled:hover {
  background: white;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .add-miniprogram-modal {
    max-width: 100%;
  }
  
  .icon-grid {
    gap: 12px;
  }
  
  .icon-item {
    width: 44px;
    height: 44px;
  }
  
  .icon-circle {
    width: 28px;
    height: 28px;
  }
}
</style>
