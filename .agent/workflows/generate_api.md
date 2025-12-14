---
description: 根据 `api/openapi.yaml` 生成 Go Gin 路由代码。
---

# Workflow: Generate API Code
Trigger: /gen-api

**描述**: 根据 `api/openapi.yaml` 生成 Go Gin 路由代码。

**前置条件**: 确保 `api/openapi.yaml` 存在。

**步骤**:
1.  **检查工具**: 确认已安装 `oapi-codegen`。
2.  **生成 Server Interface**:
    执行命令:
    ```bash
    oapi-codegen -package api -generate gin,types,spec -o internal/api/server.gen.go api/openapi.yaml
    ```
3.  **提示**: 提醒用户需要在 `internal/controller` 中实现生成的接口 `ServerInterface`。