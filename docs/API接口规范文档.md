# API接口规范文档

## 📡 接口设计原则

### RESTful API设计规范
1. **资源导向**: URL表示资源，HTTP方法表示操作
2. **无状态**: 每个请求包含完整的处理信息
3. **统一接口**: 统一的请求/响应格式
4. **分层系统**: 客户端无需了解服务器内部结构
5. **可缓存**: 支持HTTP缓存机制

### URL命名规范
```
# 基础格式
https://api.domain.com/api/v1/{resource}

# 资源集合操作
GET    /api/v1/employees              # 获取员工列表
POST   /api/v1/employees              # 创建员工
PUT    /api/v1/employees              # 批量更新员工
DELETE /api/v1/employees              # 批量删除员工

# 单个资源操作
GET    /api/v1/employees/{id}         # 获取指定员工
PUT    /api/v1/employees/{id}         # 更新指定员工
DELETE /api/v1/employees/{id}         # 删除指定员工

# 子资源操作
GET    /api/v1/employees/{id}/performance    # 获取员工业绩
GET    /api/v1/departments/{id}/employees    # 获取部门员工列表

# 操作资源
POST   /api/v1/data/sync                     # 触发数据同步
POST   /api/v1/reports/generate              # 生成报表
POST   /api/v1/tasks/{id}/execute            # 执行任务
```

## 🔐 认证与授权

### JWT Token规范
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1234567890",           // 用户ID
    "username": "john.doe",        // 用户名
    "real_name": "张三",           // 真实姓名
    "roles": ["admin", "user"],    // 角色列表
    "permissions": ["user:read", "data:write"], // 权限列表
    "dept_id": 10,                 // 部门ID
    "iat": 1640995200,            // 签发时间
    "exp": 1641081600             // 过期时间
  }
}
```

### 请求头规范
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
X-Request-ID: uuid-request-id
X-Client-Version: 1.0.0
X-Platform: mobile|web|admin
```

## 📋 通用数据格式

### 统一响应格式
```typescript
interface ApiResponse<T> {
  code: number;           // 业务状态码
  message: string;        // 响应消息
  data: T | null;        // 响应数据
  timestamp: number;      // 时间戳
  traceId?: string;      // 链路追踪ID
  version?: string;       // API版本
}

// 成功响应示例
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "张三"
  },
  "timestamp": 1640995200000,
  "traceId": "abc123def456",
  "version": "v1.0"
}

// 错误响应示例
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "errors": [
    {
      "field": "startDate",
      "message": "开始日期不能为空",
      "code": "FIELD_REQUIRED"
    }
  ],
  "timestamp": 1640995200000,
  "traceId": "abc123def456"
}
```

### 分页响应格式
```typescript
interface PageResponse<T> {
  total: number;         // 总记录数
  list: T[];            // 数据列表
  pageNum: number;       // 当前页码
  pageSize: number;      // 页大小
  pages: number;         // 总页数
  hasNext: boolean;      // 是否有下一页
  hasPrev: boolean;      // 是否有上一页
}

// 分页响应示例
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 150,
    "list": [...],
    "pageNum": 1,
    "pageSize": 20,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": 1640995200000
}
```

### 通用请求参数
```typescript
interface BasePageQuery {
  pageNum?: number;        // 页码，默认1
  pageSize?: number;       // 页大小，默认20，最大100
  sortField?: string;      // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方式，默认desc
}

interface BaseTimeQuery {
  startDate?: string;      // 开始日期 YYYY-MM-DD
  endDate?: string;        // 结束日期 YYYY-MM-DD
  timeType?: 'day' | 'week' | 'month' | 'quarter' | 'year'; // 时间类型
}

interface BaseFilterQuery {
  keyword?: string;        // 关键词搜索
  status?: number;         // 状态筛选
  createTimeStart?: string; // 创建时间开始
  createTimeEnd?: string;   // 创建时间结束
}
```

## 🏢 核心业务接口

### 1. 用户认证接口

#### 登录接口
```yaml
POST /api/v1/auth/login
Content-Type: application/json

Request:
{
  "username": "admin",           # 必填：用户名
  "password": "password123",     # 必填：密码
  "captcha": "1234",            # 必填：验证码
  "captchaKey": "uuid-key",     # 必填：验证码key
  "rememberMe": true            # 可选：记住登录
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "realName": "管理员",
      "avatar": "https://example.com/avatar.jpg",
      "roles": ["admin"],
      "permissions": ["*:*:*"],
      "deptId": 1,
      "deptName": "总经理办公室"
    }
  },
  "timestamp": 1640995200000
}
```

#### 刷新Token接口
```yaml
POST /api/v1/auth/refresh
Authorization: Bearer {refresh_token}

Response:
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "token": "new_access_token",
    "expiresIn": 7200
  },
  "timestamp": 1640995200000
}
```

### 2. 员工业绩接口

#### 员工业绩列表查询
```yaml
GET /api/v1/performance/employee/list
Authorization: Bearer {access_token}

Query Parameters:
- pageNum: 1                    # 页码
- pageSize: 20                  # 页大小
- startDate: 2024-01-01         # 开始日期
- endDate: 2024-01-31           # 结束日期
- employeeIds: 1,2,3            # 员工ID列表
- deptIds: 10,20                # 部门ID列表
- minSalesAmount: 10000         # 最小销售金额
- maxSalesAmount: 100000        # 最大销售金额
- sortField: salesAmount        # 排序字段
- sortOrder: desc               # 排序方式
- versionId: 20240101_120000_001 # 数据版本ID

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 150,
    "list": [
      {
        "id": 1,
        "employeeId": 1001,
        "employeeName": "张三",
        "employeeCode": "EMP001",
        "deptName": "销售一部",
        "dataDate": "2024-01-15",
        "versionId": "20240101_120000_001",
        "orderAmount": 50000.00,
        "orderCount": 25,
        "orderCustomers": 15,
        "salesAmount": 48000.00,
        "salesCount": 23,
        "netSales": 45000.00,
        "salesProfit": 12000.00,
        "profitRate": 26.67,
        "visitCustomers": 20,
        "distributionCustomers": 18,
        "purchaseCustomers": 15,
        "avgOrderValue": 3200.00,
        "outboundProducts": 45,
        "salesQuantity": 120,
        "returnQuantity": 5,
        "giftCost": 500.00
      }
    ],
    "pageNum": 1,
    "pageSize": 20,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": 1640995200000
}
```

#### 员工业绩详情查询
```yaml
GET /api/v1/performance/employee/{employeeId}
Authorization: Bearer {access_token}

Path Parameters:
- employeeId: 1001              # 员工ID

Query Parameters:
- startDate: 2024-01-01         # 开始日期
- endDate: 2024-01-31           # 结束日期
- versionId: 20240101_120000_001 # 数据版本ID
- includeHistory: true          # 是否包含历史对比数据

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "employee": {
      "id": 1001,
      "name": "张三",
      "code": "EMP001",
      "deptName": "销售一部",
      "position": "销售经理",
      "hireDate": "2020-01-01"
    },
    "performance": {
      "current": {
        "period": "2024-01-01 至 2024-01-31",
        "salesAmount": 150000.00,
        "orderCount": 75,
        "profitRate": 25.5,
        "customerCount": 45
      },
      "comparison": {
        "lastMonth": {
          "salesAmount": 120000.00,
          "growthRate": 25.0
        },
        "lastYear": {
          "salesAmount": 100000.00,
          "growthRate": 50.0
        }
      },
      "ranking": {
        "deptRank": 2,
        "companyRank": 15,
        "totalEmployees": 200
      }
    },
    "trends": [
      {
        "date": "2024-01-01",
        "salesAmount": 5000.00,
        "orderCount": 3
      }
    ]
  },
  "timestamp": 1640995200000
}
```

### 3. 数据版本接口

#### 获取最新数据版本
```yaml
GET /api/v1/data/version/latest
Authorization: Bearer {access_token}

Query Parameters:
- dataType: employee_performance # 数据类型

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "versionId": "20240101_120000_001",
    "versionName": "2024年1月员工业绩数据",
    "dataDate": "2024-01-31",
    "status": 1,
    "createTime": "2024-01-31 12:00:00",
    "processedRecords": 1500,
    "description": "包含150名员工的业绩数据"
  },
  "timestamp": 1640995200000
}
```

#### 数据版本列表
```yaml
GET /api/v1/data/version/list
Authorization: Bearer {access_token}

Query Parameters:
- pageNum: 1
- pageSize: 20
- dataType: employee_performance
- startDate: 2024-01-01
- endDate: 2024-01-31
- status: 1

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 31,
    "list": [
      {
        "versionId": "20240131_120000_001",
        "versionName": "2024年1月31日业绩数据",
        "dataDate": "2024-01-31",
        "status": 1,
        "isActive": true,
        "processedRecords": 1500,
        "createTime": "2024-01-31 12:00:00"
      }
    ],
    "pageNum": 1,
    "pageSize": 20,
    "pages": 2
  },
  "timestamp": 1640995200000
}
```

### 4. 任务管理接口

#### 任务列表查询
```yaml
GET /api/v1/admin/job/list
Authorization: Bearer {access_token}

Query Parameters:
- pageNum: 1
- pageSize: 20
- taskType: erp_sync
- status: 1
- keyword: 员工业绩

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 10,
    "list": [
      {
        "id": 1,
        "taskName": "员工业绩数据同步",
        "taskCode": "EMPLOYEE_PERFORMANCE_SYNC",
        "taskType": "erp_sync",
        "cronExpression": "0 0 2 * * ?",
        "status": 1,
        "lastExecTime": "2024-01-31 02:00:00",
        "nextExecTime": "2024-02-01 02:00:00",
        "execCount": 31,
        "successCount": 30,
        "failCount": 1
      }
    ],
    "pageNum": 1,
    "pageSize": 20,
    "pages": 1
  },
  "timestamp": 1640995200000
}
```

#### 立即执行任务
```yaml
POST /api/v1/admin/job/{id}/execute
Authorization: Bearer {access_token}

Path Parameters:
- id: 1                         # 任务ID

Request:
{
  "params": {                   # 可选：任务参数
    "dataDate": "2024-01-31",
    "forceSync": true
  }
}

Response:
{
  "code": 200,
  "message": "任务执行成功",
  "data": {
    "execId": "exec_uuid_123456",
    "taskId": 1,
    "status": "RUNNING",
    "startTime": "2024-01-31 14:30:00",
    "estimatedDuration": 300
  },
  "timestamp": 1640995200000
}
```

## 📊 业务数据接口

### 1. 综合解读接口

#### 业务概览数据
```yaml
GET /api/v1/analysis/overview
Authorization: Bearer {access_token}

Query Parameters:
- startDate: 2024-01-01
- endDate: 2024-01-31
- deptIds: 10,20
- versionId: 20240101_120000_001

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "summary": {
      "totalSales": 5000000.00,
      "totalOrders": 2500,
      "totalEmployees": 150,
      "avgOrderValue": 2000.00,
      "profitRate": 25.5
    },
    "trends": {
      "salesTrend": [
        {"date": "2024-01-01", "value": 50000.00},
        {"date": "2024-01-02", "value": 52000.00}
      ],
      "orderTrend": [
        {"date": "2024-01-01", "value": 25},
        {"date": "2024-01-02", "value": 28}
      ]
    },
    "rankings": {
      "topEmployees": [
        {
          "employeeId": 1001,
          "employeeName": "张三",
          "salesAmount": 80000.00,
          "rank": 1
        }
      ],
      "topDepartments": [
        {
          "deptId": 10,
          "deptName": "销售一部",
          "salesAmount": 500000.00,
          "rank": 1
        }
      ]
    },
    "alerts": [
      {
        "type": "warning",
        "message": "销售二部本月业绩下降15%",
        "level": "medium"
      }
    ]
  },
  "timestamp": 1640995200000
}
```

### 2. 数据分析接口

#### 趋势分析
```yaml
GET /api/v1/analysis/trend
Authorization: Bearer {access_token}

Query Parameters:
- metric: salesAmount           # 分析指标
- dimension: employee          # 分析维度
- startDate: 2024-01-01
- endDate: 2024-01-31
- granularity: day             # 时间粒度: day/week/month
- employeeIds: 1001,1002
- compareType: mom             # 对比类型: mom/yoy/none

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "metric": "salesAmount",
    "dimension": "employee",
    "period": "2024-01-01 至 2024-01-31",
    "data": [
      {
        "employeeId": 1001,
        "employeeName": "张三",
        "trends": [
          {
            "date": "2024-01-01",
            "value": 5000.00,
            "compareValue": 4500.00,
            "growthRate": 11.11
          }
        ],
        "summary": {
          "total": 150000.00,
          "average": 4838.71,
          "max": 8000.00,
          "min": 2000.00,
          "growthRate": 15.5
        }
      }
    ]
  },
  "timestamp": 1640995200000
}
```

## 🔍 查询优化接口

### 1. 智能搜索接口
```yaml
GET /api/v1/search/intelligent
Authorization: Bearer {access_token}

Query Parameters:
- query: 张三的销售业绩        # 自然语言查询
- scope: employee             # 搜索范围
- limit: 10                   # 结果数量限制

Response:
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "query": "张三的销售业绩",
    "results": [
      {
        "type": "employee",
        "id": 1001,
        "title": "张三 - 销售经理",
        "description": "销售一部，本月销售额150,000元",
        "url": "/performance/employee/1001",
        "score": 0.95
      }
    ],
    "suggestions": [
      "张三的客户分析",
      "张三的商品销售分析",
      "销售一部业绩排行"
    ]
  },
  "timestamp": 1640995200000
}
```

### 2. 数据导出接口
```yaml
POST /api/v1/export/employee-performance
Authorization: Bearer {access_token}

Request:
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "employeeIds": [1001, 1002],
  "format": "excel",            # 导出格式: excel/csv/pdf
  "fields": [                   # 导出字段
    "employeeName",
    "salesAmount", 
    "orderCount",
    "profitRate"
  ],
  "template": "standard"        # 导出模板
}

Response:
{
  "code": 200,
  "message": "导出任务创建成功",
  "data": {
    "taskId": "export_task_123456",
    "downloadUrl": "https://api.domain.com/api/v1/download/export_task_123456",
    "estimatedTime": 30,
    "status": "processing"
  },
  "timestamp": 1640995200000
}
```

## ⚠️ 错误码规范

### HTTP状态码
- **200 OK**: 请求成功
- **201 Created**: 资源创建成功
- **204 No Content**: 请求成功但无返回内容
- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 未授权或Token过期
- **403 Forbidden**: 禁止访问，权限不足
- **404 Not Found**: 资源不存在
- **409 Conflict**: 资源冲突
- **422 Unprocessable Entity**: 请求格式正确但语义错误
- **429 Too Many Requests**: 请求频率超限
- **500 Internal Server Error**: 服务器内部错误
- **502 Bad Gateway**: 网关错误
- **503 Service Unavailable**: 服务不可用

### 业务错误码
```typescript
enum BusinessErrorCode {
  // 通用错误 (1000-1999)
  PARAM_ERROR = 1001,           // 参数错误
  DATA_NOT_FOUND = 1002,        // 数据不存在
  DATA_ALREADY_EXISTS = 1003,   // 数据已存在
  OPERATION_FAILED = 1004,      // 操作失败
  
  // 认证错误 (2000-2999)
  LOGIN_FAILED = 2001,          // 登录失败
  TOKEN_EXPIRED = 2002,         // Token过期
  PERMISSION_DENIED = 2003,     // 权限不足
  ACCOUNT_LOCKED = 2004,        // 账户被锁定
  
  // 业务错误 (3000-3999)
  DATA_VERSION_NOT_FOUND = 3001, // 数据版本不存在
  TASK_EXECUTION_FAILED = 3002,  // 任务执行失败
  DATA_SYNC_ERROR = 3003,        // 数据同步错误
  REPORT_GENERATION_FAILED = 3004, // 报表生成失败
  
  // 系统错误 (9000-9999)
  SYSTEM_ERROR = 9001,          // 系统错误
  DATABASE_ERROR = 9002,        // 数据库错误
  NETWORK_ERROR = 9003,         // 网络错误
  SERVICE_UNAVAILABLE = 9004    // 服务不可用
}
```

## 🔄 数据同步接口

### 1. ERP数据同步接口

#### 触发数据同步
```yaml
POST /api/v1/data/sync/trigger
Authorization: Bearer {access_token}

Request:
{
  "syncType": "employee_performance", # 同步类型
  "dataDate": "2024-01-31",          # 数据日期
  "forceSync": false,                # 是否强制同步
  "sourceConfig": {                  # 数据源配置
    "host": "erp.company.com",
    "database": "erp_db",
    "tables": ["orders", "sales", "customers"]
  }
}

Response:
{
  "code": 200,
  "message": "数据同步任务已启动",
  "data": {
    "syncId": "sync_20240131_001",
    "versionId": "20240131_140000_001",
    "estimatedTime": 600,
    "status": "RUNNING",
    "progress": 0
  },
  "timestamp": 1640995200000
}
```

#### 查询同步状态
```yaml
GET /api/v1/data/sync/status/{syncId}
Authorization: Bearer {access_token}

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "syncId": "sync_20240131_001",
    "status": "COMPLETED",
    "progress": 100,
    "startTime": "2024-01-31 14:00:00",
    "endTime": "2024-01-31 14:08:30",
    "duration": 510,
    "processedRecords": 15000,
    "successRecords": 14950,
    "failRecords": 50,
    "versionId": "20240131_140000_001",
    "logs": [
      {
        "time": "2024-01-31 14:00:00",
        "level": "INFO",
        "message": "开始同步ERP订单数据"
      },
      {
        "time": "2024-01-31 14:08:30",
        "level": "INFO",
        "message": "数据同步完成，共处理15000条记录"
      }
    ]
  },
  "timestamp": 1640995200000
}
```

## 📈 统计分析接口

### 1. 多维度分析接口

#### 部门业绩对比
```yaml
GET /api/v1/analysis/department/comparison
Authorization: Bearer {access_token}

Query Parameters:
- startDate: 2024-01-01
- endDate: 2024-01-31
- deptIds: 10,20,30
- metrics: salesAmount,orderCount,profitRate
- compareType: mom              # 对比类型: mom/yoy/custom

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "period": "2024-01-01 至 2024-01-31",
    "compareType": "mom",
    "departments": [
      {
        "deptId": 10,
        "deptName": "销售一部",
        "current": {
          "salesAmount": 1000000.00,
          "orderCount": 500,
          "profitRate": 25.5,
          "employeeCount": 20
        },
        "previous": {
          "salesAmount": 900000.00,
          "orderCount": 450,
          "profitRate": 24.0
        },
        "growth": {
          "salesAmountGrowth": 11.11,
          "orderCountGrowth": 11.11,
          "profitRateGrowth": 6.25
        },
        "ranking": {
          "salesRank": 1,
          "profitRank": 2,
          "growthRank": 1
        }
      }
    ],
    "summary": {
      "totalSales": 3000000.00,
      "totalGrowth": 12.5,
      "bestDept": "销售一部",
      "worstDept": "销售三部"
    }
  },
  "timestamp": 1640995200000
}
```

### 2. 预警监控接口

#### 业绩预警查询
```yaml
GET /api/v1/monitor/alerts
Authorization: Bearer {access_token}

Query Parameters:
- alertType: performance       # 预警类型
- level: high,medium          # 预警级别
- status: active              # 预警状态
- pageNum: 1
- pageSize: 20

Response:
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 5,
    "list": [
      {
        "id": 1,
        "alertType": "performance",
        "level": "high",
        "title": "员工业绩异常下降",
        "description": "张三本月销售额较上月下降30%",
        "targetType": "employee",
        "targetId": 1001,
        "targetName": "张三",
        "threshold": 30.0,
        "currentValue": 70000.00,
        "previousValue": 100000.00,
        "changeRate": -30.0,
        "status": "active",
        "createTime": "2024-01-31 09:00:00",
        "actions": [
          {
            "type": "view_detail",
            "label": "查看详情",
            "url": "/performance/employee/1001"
          },
          {
            "type": "ignore",
            "label": "忽略预警"
          }
        ]
      }
    ],
    "pageNum": 1,
    "pageSize": 20,
    "pages": 1
  },
  "timestamp": 1640995200000
}
```

## 🛡️ 接口安全规范

### 1. 请求签名
```typescript
// 请求签名算法
function generateSignature(params: any, secret: string): string {
  // 1. 参数排序
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // 2. 拼接密钥
  const signString = `${sortedParams}&key=${secret}`;

  // 3. MD5加密
  return md5(signString).toUpperCase();
}

// 请求头添加签名
headers: {
  'X-Signature': signature,
  'X-Timestamp': timestamp,
  'X-Nonce': nonce
}
```

### 2. 接口限流
```yaml
# 限流策略配置
rate_limit:
  # 全局限流
  global:
    requests_per_minute: 1000
    requests_per_hour: 10000

  # 用户级限流
  user:
    requests_per_minute: 100
    requests_per_hour: 1000

  # 接口级限流
  endpoints:
    "/api/v1/performance/employee/list":
      requests_per_minute: 60
    "/api/v1/data/sync/trigger":
      requests_per_minute: 10
```

### 3. 数据脱敏
```typescript
// 敏感数据脱敏规则
interface DataMaskingRules {
  phone: (phone: string) => string;     // 手机号脱敏: 138****8888
  email: (email: string) => string;     // 邮箱脱敏: abc***@example.com
  idCard: (id: string) => string;       // 身份证脱敏: 110***********1234
  bankCard: (card: string) => string;   // 银行卡脱敏: 6222***********1234
}

// 根据用户权限决定是否脱敏
function maskSensitiveData(data: any, userPermissions: string[]): any {
  if (userPermissions.includes('data:view:sensitive')) {
    return data; // 有权限，返回原始数据
  }

  // 无权限，返回脱敏数据
  return {
    ...data,
    phone: maskPhone(data.phone),
    email: maskEmail(data.email)
  };
}
```

## 📝 接口文档规范

### 1. Swagger注解规范
```java
@Api(tags = "员工业绩管理")
@RestController
@RequestMapping("/api/v1/performance/employee")
public class EmployeePerformanceController {

    @ApiOperation(value = "查询员工业绩列表", notes = "支持多维度筛选和排序")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "startDate", value = "开始日期", required = true,
                         dataType = "string", paramType = "query", example = "2024-01-01"),
        @ApiImplicitParam(name = "endDate", value = "结束日期", required = true,
                         dataType = "string", paramType = "query", example = "2024-01-31"),
        @ApiImplicitParam(name = "employeeIds", value = "员工ID列表",
                         dataType = "string", paramType = "query", example = "1001,1002"),
        @ApiImplicitParam(name = "pageNum", value = "页码", defaultValue = "1",
                         dataType = "int", paramType = "query"),
        @ApiImplicitParam(name = "pageSize", value = "页大小", defaultValue = "20",
                         dataType = "int", paramType = "query")
    })
    @GetMapping("/list")
    public Result<PageResponse<EmployeePerformanceDTO>> getEmployeePerformanceList(
            @Valid EmployeePerformanceQueryDTO queryDTO) {
        // 实现逻辑
    }
}
```

### 2. 接口测试用例
```yaml
# Postman测试集合
{
  "info": {
    "name": "经营分析APP接口测试",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "用户认证",
      "item": [
        {
          "name": "登录接口",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\",\n  \"captcha\": \"1234\",\n  \"captchaKey\": \"test-key\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/v1/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "auth", "login"]
            }
          },
          "response": []
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://api.business-analysis.com"
    }
  ]
}
```

## 🔄 接口版本管理

### 版本控制策略
1. **URL版本控制**: `/api/v1/`, `/api/v2/`
2. **向后兼容**: 新版本保持向后兼容
3. **废弃通知**: 提前通知接口废弃计划
4. **平滑迁移**: 提供迁移指南和工具

### 版本升级示例
```yaml
# v1版本 (当前版本)
GET /api/v1/performance/employee/list

# v2版本 (新版本，增加了新字段和功能)
GET /api/v2/performance/employee/list

# 响应头标识版本信息
Response Headers:
API-Version: v1.0
Deprecated: false
Sunset: 2025-12-31      # 废弃日期
Link: </api/v2/performance/employee/list>; rel="successor-version"
```

---

**文档版本**: v1.0
**最后更新**: 2024年8月
**维护团队**: 后端开发组

> 本文档定义了经营分析APP的完整API接口规范，所有接口开发必须严格遵循此规范。如有疑问或建议，请联系架构师团队。
```
