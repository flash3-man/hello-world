# 企业数据分析系统 - API接口文档

## 接口概述

### 基础信息
- **API版本**: v1.0
- **基础URL**: `https://api.company.com/v1`
- **认证方式**: Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2024-12-20T10:30:00Z",
  "requestId": "req_123456789"
}
```

### 状态码说明
| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 认证接口

### 1. 用户登录
**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "admin",
  "password": "password123",
  "captcha": "ABCD",
  "captchaId": "cap_123456"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "role": "admin",
      "permissions": ["read", "write", "delete"]
    }
  }
}
```

### 2. 刷新Token
**接口地址**: `POST /auth/refresh`

**请求参数**:
```json
{
  "refreshToken": "refresh_token_string"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "token": "new_access_token",
    "expiresIn": 7200
  }
}
```

## 首页数据接口

### 1. 获取首页概览数据
**接口地址**: `GET /dashboard/overview`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dateRange | string | 否 | 日期范围，格式：2024-06-01,2024-06-30 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dataSummary": {
      "totalSales": 2856789.45,
      "totalOrders": 1234,
      "totalCustomers": 567,
      "totalEmployees": 89,
      "salesGrowth": 15.8,
      "orderGrowth": 12.3
    },
    "alerts": [
      {
        "id": 1,
        "type": "business_exception",
        "message": "小易监控到新的经营异常",
        "priority": "high",
        "details": {
          "category": "经营异常",
          "description": "检测到销售额异常下滑",
          "affectedData": ["销售金额", "客户数量"],
          "suggestions": ["分析客户流失原因", "制定挽回策略"]
        },
        "createdAt": "2024-06-20T10:30:00Z"
      }
    ],
    "goals": [
      {
        "id": 1,
        "name": "月度销售目标",
        "target": 5000000,
        "current": 3856789,
        "completionRate": 77.14,
        "status": "in-progress",
        "deadline": "2024-06-30"
      }
    ]
  }
}
```

### 2. 获取数据详情
**接口地址**: `GET /dashboard/data-detail/{type}`

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| type | string | 数据类型：sales/orders/customers/employees |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "title": "销售金额详情",
    "formula": "销售金额 = 订单金额 - 退货金额 - 折扣金额",
    "breakdown": [
      {
        "id": 1,
        "name": "订单金额",
        "value": 3000000.00,
        "percentage": 85.2
      },
      {
        "id": 2,
        "name": "退货金额",
        "value": -120000.00,
        "percentage": -3.4
      }
    ],
    "trend": [
      {
        "date": "2024-06-01",
        "value": 95000.00
      }
    ]
  }
}
```

## 员工分析接口

### 1. 获取员工整体分析数据
**接口地址**: `GET /employees/analysis`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dimension | string | 否 | 分析维度：visit/sales/market/profit |
| dateRange | string | 否 | 日期范围 |
| sortBy | string | 否 | 排序字段 |
| sortOrder | string | 否 | 排序方向：asc/desc |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summary": {
      "totalEmployees": 89,
      "activeEmployees": 85,
      "avgPerformance": 78.5,
      "topPerformer": "张三"
    },
    "employees": [
      {
        "id": 1,
        "name": "张三",
        "avatar": "https://api.company.com/avatars/1.jpg",
        "department": "销售部",
        "position": "销售经理",
        "rank": 1,
        "performance": {
          "visits": 156,
          "sales": 285678.90,
          "customers": 89,
          "orders": 234,
          "conversionRate": 23.4,
          "growth": 15.8
        },
        "trends": {
          "salesTrend": "up",
          "visitTrend": "stable",
          "customerTrend": "up"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 89,
      "totalPages": 5
    }
  }
}
```

### 2. 获取员工详细分析数据
**接口地址**: `GET /employees/{employeeId}/detail-analysis`

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| employeeId | number | 员工ID |

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| statisticalPeriod | string | 否 | 统计周期，格式：2024-06-01,2024-06-20 |
| comparisonPeriod | string | 否 | 对比周期，格式：2024-05-01,2024-05-20 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "employeeInfo": {
      "id": 1,
      "name": "黄保杰",
      "avatar": "https://api.company.com/avatars/1.jpg",
      "department": "销售部",
      "position": "销售代表",
      "comprehensiveRank": 1
    },
    "radarData": {
      "labels": ["拜访效率", "销售能力", "客户维护", "产品推广", "回款能力", "团队协作"],
      "values": [90, 85, 95, 88, 92, 87],
      "maxValue": 100
    },
    "orderData": {
      "avgSkuPerVisit": 1.17,
      "totalSku": 14,
      "totalOrders": 12,
      "revisitOrderRate": 85.5,
      "visitedCustomers": 45,
      "totalVisits": 52
    },
    "salesData": {
      "orderAmount": 14145.12,
      "comparisonValue": 776.00,
      "changeValue": 13369.12,
      "changeRate": 1722.82,
      "avgOrderValue": 1122.35,
      "avgOrderComparison": 0.00,
      "avgOrderChange": 1122.35,
      "avgOrderChangeRate": null
    },
    "trendData": {
      "salesTrend": [
        {
          "period": "2024-06",
          "value": 15234,
          "date": "2024-06-01"
        }
      ],
      "avgOrderTrend": [
        {
          "period": "2024-06",
          "value": 1245,
          "date": "2024-06-01"
        }
      ]
    },
    "returnData": {
      "returnAmount": 0.00,
      "returnRate": 0.0,
      "returnTrend": []
    },
    "paymentData": {
      "receivedAmount": 4879.60,
      "receivedRate": 34.5,
      "paymentTrend": []
    }
  }
}
```

## 业绩分析接口

### 1. 获取业绩变化分析数据
**接口地址**: `GET /performance/analysis`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| metric | string | 是 | 分析指标：sales-amount/order-count/customer-count/avg-order-value |
| dimension | string | 是 | 分析维度：region/employee/customer/product/brand/category |
| currentDate | string | 是 | 当前日期，格式：2024-06-20 |
| compareDate | string | 是 | 对比日期，格式：2024-06-19 |
| businessCategory | string | 否 | 业务分类：all/retail/wholesale |
| sortField | string | 否 | 排序字段 |
| sortOrder | string | 否 | 排序方向：asc/desc |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summary": {
      "totalItems": 156,
      "avgChangeRate": 12.5,
      "positiveCount": 89,
      "negativeCount": 67,
      "topGainer": {
        "name": "兰州片区",
        "changeRate": 45.8
      },
      "topLoser": {
        "name": "天水片区",
        "changeRate": -12.3
      }
    },
    "analysisData": [
      {
        "id": 1,
        "name": "兰州片区",
        "currentValue": 285678.90,
        "compareValue": 245123.45,
        "changeValue": 40555.45,
        "changeRate": 16.54,
        "trend": "up",
        "rank": 1,
        "contribution": 23.5
      }
    ],
    "drilldownOptions": [
      {
        "key": "view-employees",
        "label": "查看员工明细",
        "available": true
      },
      {
        "key": "view-customers",
        "label": "查看客户明细",
        "available": true
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 2. 获取下钻分析数据
**接口地址**: `GET /performance/drilldown`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| parentId | number | 是 | 父级数据ID |
| drilldownType | string | 是 | 下钻类型：employees/customers/products |
| metric | string | 是 | 分析指标 |
| dateRange | string | 是 | 日期范围 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "parentInfo": {
      "id": 1,
      "name": "兰州片区",
      "type": "region"
    },
    "drilldownData": [
      {
        "id": 101,
        "name": "张三",
        "type": "employee",
        "value": 85678.90,
        "changeRate": 18.5,
        "contribution": 30.2
      }
    ],
    "summary": {
      "totalValue": 285678.90,
      "itemCount": 15,
      "avgValue": 19045.26
    }
  }
}
```

## 铺市分析接口

### 1. 获取铺市分析数据
**接口地址**: `GET /market/analysis`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dateRange | string | 否 | 日期范围：本月/上月/本季度/自定义 |
| analysisType | string | 否 | 分析类型：coverage/expansion/maintenance |
| region | string | 否 | 片区筛选 |
| employeeId | number | 否 | 员工筛选 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalStats": {
      "totalEmployees": 15,
      "totalCustomers": 2340,
      "coveredCustomers": 1456,
      "averageCoverageRate": 62.2,
      "newCustomers": 89,
      "lostCustomers": 23
    },
    "employeeData": [
      {
        "id": 1,
        "name": "张三",
        "avatar": "https://api.company.com/avatars/1.jpg",
        "region": "兰州片区",
        "totalCustomers": 156,
        "coveredCustomers": 89,
        "uncoveredCustomers": 67,
        "coverageRate": 57.1,
        "newCustomers": 12,
        "lostCustomers": 3,
        "trend": "up",
        "lastUpdateTime": "2024-06-20T10:30:00Z"
      }
    ],
    "regionStats": [
      {
        "region": "兰州片区",
        "totalCustomers": 890,
        "coveredCustomers": 567,
        "coverageRate": 63.7,
        "employeeCount": 8
      }
    ]
  }
}
```

### 2. 获取客户详情列表
**接口地址**: `GET /market/customers`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| employeeId | number | 是 | 员工ID |
| status | string | 是 | 客户状态：covered/uncovered/new/lost |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "客户001",
        "address": "甘肃省兰州市城关区街道1号",
        "region": "兰州片区",
        "status": "covered",
        "lastOrderDate": "2024-06-15T00:00:00Z",
        "totalOrders": 23,
        "totalAmount": 45678.90,
        "contactPerson": "李经理",
        "phone": "13800138001"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 89,
      "totalPages": 5
    }
  }
}
```

## 客户管理接口

### 1. 获取客户列表
**接口地址**: `GET /customers`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| region | string | 否 | 片区筛选 |
| status | string | 否 | 状态筛选：active/inactive |
| employeeId | number | 否 | 负责员工ID |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "兰州商贸有限公司",
        "code": "C001",
        "address": "甘肃省兰州市城关区中山路123号",
        "region": "兰州片区",
        "contactPerson": "李经理",
        "phone": "13800138001",
        "email": "li@company.com",
        "status": "active",
        "employeeId": 1,
        "employeeName": "张三",
        "totalOrders": 156,
        "totalAmount": 285678.90,
        "lastOrderDate": "2024-06-15T00:00:00Z",
        "createdAt": "2023-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 567,
      "totalPages": 29
    }
  }
}
```

### 2. 获取客户详情
**接口地址**: `GET /customers/{customerId}`

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| customerId | number | 客户ID |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "customer": {
      "id": 1,
      "name": "兰州商贸有限公司",
      "code": "C001",
      "address": "甘肃省兰州市城关区中山路123号",
      "region": "兰州片区",
      "contactPerson": "李经理",
      "phone": "13800138001",
      "email": "li@company.com",
      "status": "active",
      "employeeId": 1,
      "employeeName": "张三",
      "creditLimit": 100000.00,
      "currentDebt": 25000.00,
      "createdAt": "2023-01-15T00:00:00Z"
    },
    "statistics": {
      "totalOrders": 156,
      "totalAmount": 285678.90,
      "avgOrderValue": 1831.27,
      "lastOrderDate": "2024-06-15T00:00:00Z",
      "orderFrequency": 12.5,
      "returnRate": 2.3
    },
    "recentOrders": [
      {
        "id": 1001,
        "orderNo": "ORD20240615001",
        "amount": 5678.90,
        "status": "completed",
        "orderDate": "2024-06-15T00:00:00Z"
      }
    ]
  }
}
```

## 订单管理接口

### 1. 获取订单列表
**接口地址**: `GET /orders`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| orderNo | string | 否 | 订单号 |
| customerId | number | 否 | 客户ID |
| employeeId | number | 否 | 员工ID |
| status | string | 否 | 订单状态：pending/confirmed/shipped/completed/cancelled |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orders": [
      {
        "id": 1001,
        "orderNo": "ORD20240615001",
        "customerId": 1,
        "customerName": "兰州商贸有限公司",
        "employeeId": 1,
        "employeeName": "张三",
        "amount": 5678.90,
        "quantity": 45,
        "status": "completed",
        "orderDate": "2024-06-15T00:00:00Z",
        "deliveryDate": "2024-06-18T00:00:00Z",
        "paymentStatus": "paid",
        "products": [
          {
            "id": 101,
            "name": "商品A",
            "sku": "SKU001",
            "quantity": 20,
            "price": 125.50,
            "amount": 2510.00
          }
        ]
      }
    ],
    "summary": {
      "totalOrders": 1234,
      "totalAmount": 2856789.45,
      "avgOrderValue": 2314.56,
      "completedOrders": 1156,
      "pendingOrders": 78
    },
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 1234,
      "totalPages": 62
    }
  }
}
```

### 2. 创建订单
**接口地址**: `POST /orders`

**请求参数**:
```json
{
  "customerId": 1,
  "employeeId": 1,
  "products": [
    {
      "productId": 101,
      "quantity": 20,
      "price": 125.50
    }
  ],
  "deliveryAddress": "甘肃省兰州市城关区中山路123号",
  "remark": "客户备注信息"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": 1002,
    "orderNo": "ORD20240620001",
    "amount": 2510.00,
    "status": "pending"
  }
}
```

## 报表导出接口

### 1. 导出员工绩效报表
**接口地址**: `POST /reports/employee-performance/export`

**请求参数**:
```json
{
  "dateRange": "2024-06-01,2024-06-30",
  "employeeIds": [1, 2, 3],
  "format": "excel",
  "includeCharts": true,
  "template": "standard"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "导出任务已创建",
  "data": {
    "taskId": "export_123456",
    "estimatedTime": 30,
    "downloadUrl": null,
    "status": "processing"
  }
}
```

### 2. 获取导出任务状态
**接口地址**: `GET /reports/export-status/{taskId}`

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| taskId | string | 导出任务ID |

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "export_123456",
    "status": "completed",
    "progress": 100,
    "downloadUrl": "https://api.company.com/downloads/report_123456.xlsx",
    "expiresAt": "2024-06-21T10:30:00Z",
    "fileSize": 2048576
  }
}
```

## 系统配置接口

### 1. 获取系统配置
**接口地址**: `GET /system/config`

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dateFormats": ["YYYY-MM-DD", "YYYY/MM/DD", "DD/MM/YYYY"],
    "currencies": ["CNY", "USD", "EUR"],
    "timezones": ["Asia/Shanghai", "UTC"],
    "languages": ["zh-CN", "en-US"],
    "features": {
      "exportEnabled": true,
      "chartEnabled": true,
      "notificationEnabled": true
    },
    "limits": {
      "maxExportRecords": 10000,
      "maxUploadSize": 10485760,
      "sessionTimeout": 7200
    }
  }
}
```

### 2. 更新用户偏好设置
**接口地址**: `PUT /users/preferences`

**请求参数**:
```json
{
  "dateFormat": "YYYY-MM-DD",
  "currency": "CNY",
  "timezone": "Asia/Shanghai",
  "language": "zh-CN",
  "notifications": {
    "email": true,
    "sms": false,
    "push": true
  },
  "dashboard": {
    "defaultDateRange": "本月",
    "refreshInterval": 300,
    "chartTheme": "light"
  }
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "偏好设置更新成功",
  "data": {
    "updated": true,
    "effectiveAt": "2024-06-20T10:30:00Z"
  }
}
```

## 错误处理

### 错误响应格式
```json
{
  "code": 400,
  "message": "请求参数错误",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": [
      {
        "field": "employeeId",
        "message": "员工ID不能为空",
        "code": "REQUIRED"
      }
    ]
  },
  "timestamp": "2024-06-20T10:30:00Z",
  "requestId": "req_123456789"
}
```

### 常见错误码
| 错误码 | 错误类型 | 说明 |
|--------|----------|------|
| 1001 | INVALID_TOKEN | Token无效或已过期 |
| 1002 | PERMISSION_DENIED | 权限不足 |
| 1003 | RESOURCE_NOT_FOUND | 资源不存在 |
| 1004 | VALIDATION_ERROR | 参数验证失败 |
| 1005 | BUSINESS_ERROR | 业务逻辑错误 |
| 1006 | RATE_LIMIT_EXCEEDED | 请求频率超限 |
| 1007 | SERVICE_UNAVAILABLE | 服务暂不可用 |

## 接口调用示例

### JavaScript/Axios示例
```javascript
// 设置基础配置
const apiClient = axios.create({
  baseURL: 'https://api.company.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加Token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token过期，跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 调用示例
async function getEmployeeAnalysis(params) {
  try {
    const response = await apiClient.get('/employees/analysis', { params });
    return response.data;
  } catch (error) {
    console.error('获取员工分析数据失败:', error);
    throw error;
  }
}
```

### Vue组件中的使用示例
```javascript
// 在Vue组件中使用
export default {
  data() {
    return {
      loading: false,
      employeeData: [],
      error: null
    }
  },

  async mounted() {
    await this.loadEmployeeData();
  },

  methods: {
    async loadEmployeeData() {
      this.loading = true;
      this.error = null;

      try {
        const params = {
          dimension: this.currentDimension,
          dateRange: this.selectedDateRange,
          page: 1,
          pageSize: 20
        };

        const result = await getEmployeeAnalysis(params);
        this.employeeData = result.employees;
      } catch (error) {
        this.error = '加载数据失败，请重试';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
}
```

## 接口测试

### 测试环境
- **测试地址**: `https://test-api.company.com/v1`
- **测试账号**: test_user / test123456
- **Postman集合**: [下载链接]

### 性能要求
- **响应时间**: 95%的请求在2秒内响应
- **并发处理**: 支持1000并发用户
- **可用性**: 99.9%服务可用性
- **数据一致性**: 强一致性保证

---

*本文档最后更新时间: 2024年12月*
