<template>
  <div class="indicator-settings">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>
      <h1 class="page-title">指标展示设置</h1>
      <button class="more-btn" @click="showMoreOptions">
        <span class="more-icon">⋯</span>
      </button>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 选择要展示的指标 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <h2 class="section-title">选择要展示的指标</h2>
        </div>
        
        <div class="option-list">
          <div 
            v-for="indicator in indicators" 
            :key="indicator.id"
            class="option-item"
            @click="toggleIndicator(indicator.id)"
          >
            <span class="option-label">{{ indicator.name }}</span>
            <div class="option-control">
              <div 
                class="radio-btn" 
                :class="{ active: indicator.selected }"
              >
                <div v-if="indicator.selected" class="radio-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 环比时间展示规则 -->
      <div class="setting-section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <h2 class="section-title">环比时间展示规则</h2>
        </div>
        
        <div class="option-list">
          <div 
            v-for="timeRule in timeRules" 
            :key="timeRule.id"
            class="option-item"
            @click="selectTimeRule(timeRule.id)"
          >
            <span class="option-label">{{ timeRule.name }}</span>
            <span class="option-desc">{{ timeRule.description }}</span>
            <div class="option-control">
              <div 
                class="radio-btn" 
                :class="{ active: timeRule.selected }"
              >
                <div v-if="timeRule.selected" class="radio-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="save-section">
      <button class="save-btn" @click="saveSettings">
        保存
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndicatorDisplaySettings',
  data() {
    return {
      // 指标选项
      indicators: [
        {
          id: 1,
          name: '订单金额',
          selected: false
        },
        {
          id: 2,
          name: '销售金额',
          selected: true
        }
      ],
      
      // 时间规则选项
      timeRules: [
        {
          id: 1,
          name: '上月同期',
          description: '(本-3/1 ~ 3/22)',
          selected: true
        },
        {
          id: 2,
          name: '上个时间段',
          description: '(本-3/10 ~ 3/31)',
          selected: false
        },
        {
          id: 3,
          name: '上个月',
          description: '(本-3/1 ~ 3/31)',
          selected: false
        }
      ]
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
    
    // 切换指标选择
    toggleIndicator(indicatorId) {
      const indicator = this.indicators.find(item => item.id === indicatorId)
      if (indicator) {
        indicator.selected = !indicator.selected
      }
    },
    
    // 选择时间规则
    selectTimeRule(ruleId) {
      this.timeRules.forEach(rule => {
        rule.selected = rule.id === ruleId
      })
    },
    
    // 保存设置
    saveSettings() {
      const selectedIndicators = this.indicators.filter(item => item.selected)
      const selectedTimeRule = this.timeRules.find(rule => rule.selected)
      
      console.log('保存设置:', {
        indicators: selectedIndicators,
        timeRule: selectedTimeRule
      })
      
      // 保存到本地存储
      const settings = {
        indicators: this.indicators,
        timeRules: this.timeRules
      }
      localStorage.setItem('indicatorDisplaySettings', JSON.stringify(settings))
      
      alert('设置已保存')
      this.goBack()
    }
  },
  
  mounted() {
    // 加载保存的设置
    const saved = localStorage.getItem('indicatorDisplaySettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.indicators) {
          this.indicators = settings.indicators
        }
        if (settings.timeRules) {
          this.timeRules = settings.timeRules
        }
      } catch (e) {
        console.error('加载设置失败:', e)
      }
    }
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.indicator-settings {
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

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #f0f0f0;
}

.page-title {
  font-size: 17px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.more-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.more-btn:hover {
  background: #f0f0f0;
}

/* 设置内容区域 */
.settings-content {
  flex: 1;
  padding: 16px;
}

/* 设置分组 */
.setting-section {
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-indicator {
  width: 3px;
  height: 16px;
  background: #007AFF;
  border-radius: 2px;
  margin-right: 12px;
}

.section-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 选项列表 */
.option-list {
  padding: 0;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f8f9fa;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background: #f8f9fa;
}

.option-label {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.option-desc {
  font-size: 13px;
  color: #666;
  margin-left: 8px;
}

.option-control {
  margin-left: auto;
}

/* 单选按钮 */
.radio-btn {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.radio-btn.active {
  border-color: #007AFF;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #007AFF;
  border-radius: 50%;
}

/* 保存按钮区域 */
.save-section {
  padding: 20px 16px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.save-btn {
  width: 100%;
  background: #007AFF;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background: #0056b3;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .settings-content {
    padding: 12px;
  }
  
  .section-header {
    padding: 12px;
  }
  
  .option-item {
    padding: 12px;
  }
  
  .save-section {
    padding: 16px 12px;
  }
}
</style>
