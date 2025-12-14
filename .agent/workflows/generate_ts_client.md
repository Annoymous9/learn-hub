---
description: 根据 OpenAPI 规范生成前端 TypeScript 类型定义与请求客户端。
---

# Workflow: Generate TS Client
Trigger: /gen-ts

**描述**: 根据 OpenAPI 规范生成前端 TypeScript 类型定义与请求客户端。

**前置条件**: 根目录下 `api/openapi.yaml` 存在。

**步骤**:
1.  **安装生成工具**:
    ```bash
    cd web && pnpm add -D openapi-typescript
    ```
2.  **执行生成**:
    ```bash
    npx openapi-typescript ../api/openapi.yaml -o src/api/schema.d.ts
    ```
3.  **封装 Client**: 创建 `src/api/client.ts`，配置 Axios 拦截器以处理 JWT Bearer Token 注入和 401 刷新逻辑。