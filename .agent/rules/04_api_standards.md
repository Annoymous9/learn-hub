---
trigger: always_on
---

# API 设计与错误处理 (API Standards)

## 1. 协议规范
- **标准**: OpenAPI 3.1。
- **时间格式**: 统一使用 ISO8601 字符串。

## 2. 响应格式
- **成功**: `{ "data": { ... } }` 或 `{ "data": [...], "meta": { "total": 100 } }`
- **失败**: 必须返回统一错误结构:
  ```json
  {
    "error": {
      "code": "AUTH_INVALID_CREDENTIALS",
      "message": "用户名或密码错误",
      "request_id": "req_123..."
    }
  }


## 3. 常见错误码映射
- **400**: 参数校验失败 (VALIDATION_FAILED)
- **401**: 未登录/Token过期 (AUTH_TOKEN_EXPIRED)
- **403**: 越权访问 (PERMISSION_DENIED)
- **404**: 资源不存在 (RESOURCE_NOT_FOUND)
- **409**: 状态冲突/幂等性冲突 (CONFLICT)
- **429**: 限流 (TOO_MANY_REQUESTS)