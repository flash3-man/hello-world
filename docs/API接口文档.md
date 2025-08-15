# API接口文档 - 主界面相关

## 📋 接口概览

本文档详细描述了主界面（HomePage）与后端Java系统交互的所有API接口。

## 🔐 认证说明

所有API请求都需要在请求头中携带JWT Token：
```http
Authorization: Bearer <your-jwt-token>
```

## 📊 数据看板相关接口

### 1. 获取销售数据概览

**接口地址：** `GET /api/dashboard/sales-overview`

**请求参数：** 无

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "currentMonth": {
      "totalSales": 38144.74,
      "netSales": 37188.06,
      "settledSales": 17038.58,
      "unsettledSales": 20149.48,
      "returnAmount": 956.68
    },
    "lastMonth": {
      "totalSales": 227356.95
    },
    "today": {
      "totalSales": 5580.00
    },
    "yesterday": {
      "totalSales": 3294.34
    },
    "receivables": 419596.78,
    "customerPayment": {
      "monthTotal": 23258.48,
      "todayAmount": 232.00
    },
    "updateTime": "2024-08-15T10:30:00Z"
  },
  "timestamp": 1692097800000
}
```

**字段说明：**
- `currentMonth.totalSales`: 本月销售总额
- `currentMonth.netSales`: 本月净销售额
- `currentMonth.settledSales`: 本月已结算销售额
- `currentMonth.unsettledSales`: 本月未结算销售额
- `currentMonth.returnAmount`: 本月退货金额
- `receivables`: 应收余额
- `customerPayment.monthTotal`: 本月客户回款总额
- `customerPayment.todayAmount`: 今日客户回款

### 2. 获取数据详情

**接口地址：** `GET /api/dashboard/data-detail/{type}`

**路径参数：**
- `type`: 数据类型
  - `current-month-sales`: 本月销售金额
  - `net-sales`: 净销售额
  - `settled-sales`: 已结算销售额
  - `unsettled-sales`: 未结算销售额
  - `return-amount`: 退货金额
  - `receivables`: 应收余额
  - `customer-payment`: 客户回款

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "title": "本月销售金额",
    "formula": "本月销售金额 = 销售订单总额 - 退货金额",
    "breakdown": [
      {
        "id": 1,
        "name": "销售订单总额",
        "value": "39,101.42元",
        "percentage": 102.5
      },
      {
        "id": 2,
        "name": "退货金额",
        "value": "-956.68元",
        "percentage": -2.5
      }
    ],
    "trend": {
      "direction": "up",
      "percentage": 15.2,
      "description": "较上月增长15.2%"
    }
  }
}
```

### 3. 获取销售趋势数据

**接口地址：** `GET /api/dashboard/sales-trend`

**请求参数：**
- `period`: 时间周期 (7days, 30days, 90days)
- `type`: 数据类型 (sales, orders, customers)

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "period": "30days",
    "type": "sales",
    "chartData": [
      {
        "date": "2024-07-16",
        "value": 1250.00,
        "label": "7月16日"
      },
      {
        "date": "2024-07-17",
        "value": 1580.50,
        "label": "7月17日"
      }
    ],
    "summary": {
      "total": 38144.74,
      "average": 1271.49,
      "peak": 2850.00,
      "peakDate": "2024-08-10"
    }
  }
}
```

## 🚨 预警信息相关接口

### 1. 获取预警列表

**接口地址：** `GET /api/alerts/list`

**请求参数：**
- `page`: 页码 (可选，默认1)
- `size`: 每页数量 (可选，默认10)
- `priority`: 优先级过滤 (可选：low, medium, high)
- `unreadOnly`: 仅未读 (可选：true/false)

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "message": "小易监控到的经营异常",
        "priority": "high",
        "type": "business_exception",
        "isRead": false,
        "timestamp": "2024-08-15T10:30:00Z",
        "details": {
          "title": "客户异常预警",
          "description": "客户张三连续3天未下单，可能存在流失风险",
          "suggestion": "建议主动联系客户了解情况，提供优惠活动挽留",
          "relatedData": {
            "customerId": "C001",
            "customerName": "张三",
            "lastOrderDate": "2024-08-12",
            "avgOrderAmount": 1500.00
          }
        }
      }
    ],
    "totalElements": 15,
    "totalPages": 2,
    "currentPage": 1,
    "hasNext": true
  }
}
```

### 2. 标记预警为已读

**接口地址：** `PUT /api/alerts/{alertId}/read`

**路径参数：**
- `alertId`: 预警ID

**响应示例：**
```json
{
  "code": 200,
  "message": "标记成功",
  "data": null
}
```

### 3. 获取预警详情

**接口地址：** `GET /api/alerts/{alertId}/detail`

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "客户异常预警",
    "description": "客户张三连续3天未下单，可能存在流失风险",
    "priority": "high",
    "type": "business_exception",
    "createdAt": "2024-08-15T10:30:00Z",
    "suggestions": [
      {
        "action": "contact_customer",
        "title": "主动联系客户",
        "description": "通过电话或微信了解客户近期情况"
      },
      {
        "action": "send_promotion",
        "title": "发送优惠活动",
        "description": "推送个性化优惠券或促销信息"
      }
    ],
    "relatedData": {
      "customer": {
        "id": "C001",
        "name": "张三",
        "phone": "138****1234",
        "lastOrderDate": "2024-08-12",
        "totalOrders": 25,
        "totalAmount": 37500.00
      },
      "recentOrders": []
    }
  }
}
```

## 🔍 搜索相关接口

### 1. 全局搜索

**接口地址：** `POST /api/search/global`

**请求参数：**
```json
{
  "keyword": "张三",
  "types": ["customer", "order", "employee", "product"],
  "limit": 20,
  "filters": {
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    },
    "status": ["active", "completed"]
  }
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "keyword": "张三",
    "total": 5,
    "results": [
      {
        "id": "C001",
        "type": "customer",
        "typeLabel": "客户",
        "title": "张三",
        "description": "北京市朝阳区 | 累计消费：50,000元 | 最近下单：2024-08-12",
        "route": "/customer/detail/C001",
        "avatar": "https://example.com/avatar/c001.jpg",
        "tags": ["VIP客户", "活跃"],
        "relevanceScore": 0.95
      },
      {
        "id": "O20240815001",
        "type": "order",
        "typeLabel": "订单",
        "title": "订单 O20240815001",
        "description": "客户：张三 | 金额：1,500元 | 状态：已完成",
        "route": "/order/detail/O20240815001",
        "tags": ["已完成"],
        "relevanceScore": 0.88
      }
    ],
    "suggestions": [
      "张三丰",
      "张小三",
      "李三"
    ]
  }
}
```

### 2. 搜索建议

**接口地址：** `GET /api/search/suggestions`

**请求参数：**
- `q`: 搜索关键词前缀
- `type`: 搜索类型 (可选)

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "text": "张三",
      "type": "customer",
      "count": 1
    },
    {
      "text": "张小三",
      "type": "customer", 
      "count": 1
    }
  ]
}
```

## ⚙️ 功能配置相关接口

### 1. 获取用户功能配置

**接口地址：** `GET /api/user/function-config`

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "selectedFunctions": [
      {
        "id": "employee_report",
        "name": "员工月报",
        "icon": "users",
        "route": "/employee-report",
        "order": 1,
        "isEnabled": true
      },
      {
        "id": "performance_analysis",
        "name": "业绩变化分析",
        "icon": "trending-up",
        "route": "/performance-analysis",
        "order": 2,
        "isEnabled": true
      }
    ],
    "availableFunctions": [
      {
        "id": "inventory_management",
        "name": "库存管理",
        "icon": "package",
        "route": "/inventory",
        "category": "运营管理"
      }
    ]
  }
}
```

### 2. 保存功能配置

**接口地址：** `POST /api/user/function-config`

**请求参数：**
```json
{
  "selectedFunctions": [
    {
      "id": "employee_report",
      "order": 1
    },
    {
      "id": "performance_analysis", 
      "order": 2
    }
  ]
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "配置保存成功",
  "data": null
}
```

## 🎯 目标管理相关接口

### 1. 获取目标列表

**接口地址：** `GET /api/goals/list`

**请求参数：**
- `status`: 状态过滤 (可选：active, completed, paused)
- `year`: 年份过滤 (可选)

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "2个目标进行中",
      "summary": {
        "total": 2,
        "active": 2,
        "completed": 0,
        "overAchieved": 1
      },
      "goals": [
        {
          "id": "G001",
          "name": "销售金额",
          "period": "2025-01-01 - 2025-12-31",
          "target": 20000.00,
          "achieved": 40423.13,
          "completionRate": "2021.16%",
          "status": "超额完成",
          "difference": "超额完成",
          "trend": {
            "direction": "up",
            "percentage": 102.1
          }
        }
      ]
    }
  ]
}
```

### 2. 创建目标

**接口地址：** `POST /api/goals`

**请求参数：**
```json
{
  "name": "月度销售目标",
  "targetValue": 50000.00,
  "startDate": "2024-09-01",
  "endDate": "2024-09-30",
  "description": "9月份销售目标",
  "category": "sales"
}
```

## 📱 错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 未授权 | 重新登录获取Token |
| 403 | 权限不足 | 联系管理员开通权限 |
| 404 | 资源不存在 | 检查请求路径 |
| 500 | 服务器内部错误 | 联系技术支持 |

---

**文档版本**: v1.0  
**最后更新**: 2025-08-15  
**维护人员**: 后端开发团队
