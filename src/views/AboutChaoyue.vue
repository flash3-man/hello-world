<template>
  <div class="about-chaoyue">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </button>
      <h1 class="page-title">关于超悦</h1>
      <button class="more-btn" @click="showMoreOptions">
        <span class="more-icon">⋯</span>
      </button>
    </div>

    <!-- 应用信息区域 -->
    <div class="app-info-section">
      <div class="app-logo">
        <div class="logo-container">
          <span class="logo-text">超易</span>
        </div>
      </div>
      <div class="app-name">超易</div>
      <div class="app-version">版本 {{ appVersion }}</div>
    </div>

    <!-- 功能选项列表 -->
    <div class="options-section">
      <div class="option-item" @click="showServiceAgreement">
        <span class="option-title">服务协议</span>
        <span class="option-arrow">›</span>
      </div>

      <div class="option-item" @click="showPrivacyPolicy">
        <span class="option-title">隐私政策</span>
        <span class="option-arrow">›</span>
      </div>

      <div class="option-item" @click="showFeatureIntro">
        <span class="option-title">功能介绍</span>
        <span class="option-arrow">›</span>
      </div>

      <div class="option-item" @click="showTechnicalSupport">
        <span class="option-title">技术支持</span>
        <div class="option-value">4006980600</div>
        <span class="option-arrow">›</span>
      </div>

      <div class="option-item" @click="checkForUpdate">
        <span class="option-title">检查更新</span>
        <span class="option-arrow">›</span>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer-info">
      <div class="copyright">© 2024 超悦科技有限公司</div>
      <div class="company-info">专注于企业数字化解决方案</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutChaoyue',
  data() {
    return {
      appVersion: '1.2.3'
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

    // 显示服务协议
    showServiceAgreement() {
      alert('服务协议\n\n这里将显示详细的服务协议内容...')
    },

    // 显示隐私政策
    showPrivacyPolicy() {
      alert('隐私政策\n\n这里将显示详细的隐私政策内容...')
    },

    // 显示功能介绍
    showFeatureIntro() {
      alert('功能介绍\n\n超悦应用主要功能：\n1. 数据分析\n2. 报表生成\n3. 团队协作\n4. 实时监控')
    },

    // 显示技术支持
    showTechnicalSupport() {
      if (confirm('是否拨打技术支持电话：4006980600？')) {
        console.log('拨打电话: 4006980600')
      }
    },

    // 检查更新
    checkForUpdate() {
      const hasUpdate = Math.random() > 0.5

      if (hasUpdate) {
        if (confirm('发现新版本 v1.2.4，是否立即更新？')) {
          this.performUpdate()
        }
      } else {
        alert('当前已是最新版本')
      }
    },

    // 执行更新
    performUpdate() {
      alert('开始下载更新...\n\n在实际应用中，这里会启动应用更新流程')
    },

    // 获取应用版本信息
    getAppVersion() {
      this.appVersion = '1.2.3'
    }
  },

  mounted() {
    this.getAppVersion()
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.about-chaoyue {
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

.page-title {
  font-size: 17px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 应用信息区域 */
.app-info-section {
  background: white;
  padding: 40px 20px;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.app-logo {
  margin-bottom: 16px;
}

.logo-container {
  width: 80px;
  height: 80px;
  background: #007AFF;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.logo-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.app-name {
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.app-version {
  font-size: 14px;
  color: #666;
}

/* 功能选项列表 */
.options-section {
  background: white;
  margin-top: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item:hover {
  background: #f8f9fa;
}

.option-title {
  flex: 1;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.option-value {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.option-arrow {
  font-size: 18px;
  color: #ccc;
  font-weight: 300;
}

/* 底部信息 */
.footer-info {
  margin-top: auto;
  padding: 40px 20px;
  text-align: center;
}

.copyright {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.company-info {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .header-bar {
    padding: 0 12px;
  }
  
  .app-info-section {
    padding: 30px 16px;
  }
  
  .logo-container {
    width: 70px;
    height: 70px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .app-name {
    font-size: 20px;
  }
  
  .option-item {
    padding: 14px 16px;
  }
  
  .footer-info {
    padding: 30px 16px;
  }
}

/* 动画效果 */
.app-logo {
  animation: fadeInUp 0.6s ease;
}

.app-name {
  animation: fadeInUp 0.8s ease;
}

.app-version {
  animation: fadeInUp 1s ease;
}

.option-item {
  animation: fadeInLeft 0.5s ease;
}

.option-item:nth-child(1) { animation-delay: 0.1s; }
.option-item:nth-child(2) { animation-delay: 0.2s; }
.option-item:nth-child(3) { animation-delay: 0.3s; }
.option-item:nth-child(4) { animation-delay: 0.4s; }
.option-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
