<template>
  <div class="employee-dynamics">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
        </button>
        <h1 class="page-title">业务员动态</h1>
      </div>
    </div>

    <!-- 动态卡片流 -->
    <div class="dynamics-stream">
      <div
        v-for="dynamic in sortedDynamics"
        :key="dynamic.id"
        class="dynamic-card"
        @click="viewDynamicDetail(dynamic)"
      >
        <!-- 左侧头像 -->
        <div class="avatar-section">
          <div class="employee-avatar">
            <span class="avatar-text">{{ getAvatarText(dynamic.employee.name) }}</span>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="content-section">
          <!-- 第一行：姓名 -->
          <div class="first-line">
            <span class="employee-name">{{ dynamic.employee.name }}</span>
          </div>

          <!-- 第二行：动作描述 -->
          <div class="second-line">
            <span class="action-description">{{ getActionDescription(dynamic) }}</span>
          </div>

          <!-- 第三行：时间 + 关联对象 -->
          <div class="third-line">
            <span class="action-time">{{ dynamic.timestamp }}</span>
            <span class="related-object" @click.stop="viewRelatedObject(dynamic)">
              {{ getRelatedObject(dynamic) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="detail-modal" @click.stop>
        <div class="modal-header">
          <h3>动态详情</h3>
          <button class="modal-close" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-content" v-if="selectedDynamic">
          <div class="detail-info">
            <div class="info-row">
              <span class="info-label">员工:</span>
              <span class="info-value">{{ selectedDynamic.employee.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">动作:</span>
              <span class="info-value">{{ getActionDescription(selectedDynamic) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">时间:</span>
              <span class="info-value">{{ selectedDynamic.timestamp }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">关联对象:</span>
              <span class="info-value">{{ getRelatedObject(selectedDynamic) }}</span>
            </div>
            <div class="info-row" v-if="selectedDynamic.orderNo">
              <span class="info-label">订单号:</span>
              <span class="info-value">{{ selectedDynamic.orderNo }}</span>
            </div>
            <div class="info-row" v-if="selectedDynamic.skuCount">
              <span class="info-label">SKU数:</span>
              <span class="info-value">{{ selectedDynamic.skuCount }}个</span>
            </div>
            <div class="info-row" v-if="selectedDynamic.visitDuration">
              <span class="info-label">拜访时长:</span>
              <span class="info-value">{{ Math.floor(selectedDynamic.visitDuration / 60) }}分{{ selectedDynamic.visitDuration % 60 }}秒</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-close" @click="closeDetailModal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeDynamics',
  data() {
    return {
      showDetailModal: false,
      selectedDynamic: null,

      // 动态数据 - 按时间倒序排列
      dynamics: [
        {
          id: 1,
          employee: { id: 1, name: '朱启靓' },
          actionType: 'payment',
          amount: -3000.00,
          timestamp: '2025-08-12 21:16:57',
          relatedObject: '九江门店',
          customer: { id: 'C001', name: '九江门店' },
          orderNo: 'SK250812000001'
        },
        {
          id: 2,
          employee: { id: 2, name: '黄保杰' },
          actionType: 'order',
          amount: 2000.00,
          timestamp: '2025-08-12 20:45:32',
          relatedObject: '客户0811',
          customer: { id: 'C0811', name: '客户0811' },
          orderNo: 'XD250811000005',
          skuCount: 3
        },
        {
          id: 3,
          employee: { id: 3, name: '杜天赐' },
          actionType: 'order',
          amount: 0.00,
          timestamp: '2025-08-12 19:30:15',
          relatedObject: '客户0811',
          customer: { id: 'C0811', name: '客户0811' },
          orderNo: 'XD250812000003',
          skuCount: 1
        },
        {
          id: 4,
          employee: { id: 4, name: '龙小平' },
          actionType: 'order',
          amount: 2000.00,
          timestamp: '2025-08-12 18:22:41',
          relatedObject: '客户0811',
          customer: { id: 'C0811', name: '客户0811' },
          orderNo: 'XD250812000002',
          skuCount: 2
        },
        {
          id: 5,
          employee: { id: 1, name: '朱启靓' },
          actionType: 'visit',
          timestamp: '2025-08-12 17:45:20',
          relatedObject: '钟记食品',
          customer: { id: 'C002', name: '钟记食品' },
          visitDuration: 11
        },
        {
          id: 6,
          employee: { id: 2, name: '黄保杰' },
          actionType: 'payment',
          amount: 1500.00,
          timestamp: '2025-08-12 16:30:45',
          relatedObject: '华联超市',
          customer: { id: 'C003', name: '华联超市' },
          orderNo: 'SK250812000002'
        },
        {
          id: 7,
          employee: { id: 3, name: '杜天赐' },
          actionType: 'return',
          amount: -800.00,
          timestamp: '2025-08-12 15:15:30',
          relatedObject: '永辉超市',
          customer: { id: 'C004', name: '永辉超市' },
          orderNo: 'TH250812000001',
          skuCount: 2
        },
        {
          id: 8,
          employee: { id: 4, name: '龙小平' },
          actionType: 'visit',
          timestamp: '2025-08-12 14:20:15',
          relatedObject: '美宜佳',
          customer: { id: 'C005', name: '美宜佳' },
          visitDuration: 1800
        }
      ]
    }
  },

  computed: {
    sortedDynamics() {
      return [...this.dynamics].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
  },

  methods: {
    goBack() {
      this.$router.go(-1)
    },

    getAvatarText(name) {
      return name.slice(-1)
    },

    getActionDescription(dynamic) {
      const actionTypes = {
        order: '新开一笔订单',
        payment: '新开一笔收款单',
        visit: '拜访客户',
        return: '新开一笔退货单'
      }

      let description = actionTypes[dynamic.actionType] || '执行动作'

      if (dynamic.amount !== undefined && dynamic.amount !== null) {
        const amount = dynamic.amount
        if (amount > 0) {
          description += `，金额￥${amount.toLocaleString()}`
        } else if (amount < 0) {
          description += `，金额￥${amount.toLocaleString()}`
        } else {
          description += `，金额￥0`
        }
      }

      return description
    },

    getRelatedObject(dynamic) {
      return dynamic.relatedObject || '未知对象'
    },

    viewDynamicDetail(dynamic) {
      this.selectedDynamic = dynamic
      this.showDetailModal = true
    },

    viewRelatedObject(dynamic) {
      if (dynamic.customer) {
        alert(`查看客户详情: ${dynamic.customer.name}`)
      }
    },

    closeDetailModal() {
      this.showDetailModal = false
      this.selectedDynamic = null
    }
  }
}
</script>

<style scoped>
/* === 页面整体布局 === */
.employee-dynamics {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* === 页面头部 === */
.page-header {
  background: white;
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #f0f0f0;
}

.back-icon {
  color: #333;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* === 动态卡片流 === */
.dynamics-stream {
  padding: 16px;
}

.dynamic-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dynamic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

/* === 左侧头像区域 === */
.avatar-section {
  flex-shrink: 0;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.avatar-text {
  color: white;
}

/* === 右侧内容区域 === */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 第一行：姓名 */
.first-line {
  display: flex;
  align-items: center;
}

.employee-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 第二行：动作描述 */
.second-line {
  display: flex;
  align-items: center;
}

.action-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 第三行：时间 + 关联对象 */
.third-line {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-time {
  font-size: 12px;
  color: #999;
}

.related-object {
  font-size: 12px;
  color: #4A90E2;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s;
}

.related-object:hover {
  color: #357abd;
}

/* === 弹窗样式 === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.detail-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.modal-content {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-close {
  padding: 8px 16px;
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-close:hover {
  background: #e0e0e0;
}

/* === 响应式设计 === */
@media (max-width: 768px) {
  .dynamics-stream {
    padding: 12px;
  }

  .dynamic-card {
    padding: 12px;
  }

  .employee-avatar {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .employee-name {
    font-size: 15px;
  }

  .action-description {
    font-size: 13px;
  }

  .detail-modal {
    width: 95%;
    margin: 10px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 12px;
  }

  .dynamics-stream {
    padding: 8px;
  }

  .dynamic-card {
    padding: 10px;
    gap: 10px;
  }

  .employee-avatar {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }

  .content-section {
    gap: 4px;
  }

  .third-line {
    gap: 12px;
  }
}
</style>