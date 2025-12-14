---
description: 运行单元测试并生成覆盖率报告。
---

# Workflow: Run Tests
Trigger: /test

**描述**: 运行单元测试并生成覆盖率报告。

**步骤**:
1.  **运行测试**:
    ```bash
    go test -v -coverprofile=coverage.out ./internal/...
    ```
2.  **生成报告**:
    ```bash
    go tool cover -html=coverage.out -o coverage.html
    ```
3.  **策略检查**: 确保测试覆盖了鉴权中间件、核心业务逻辑（如计分算法）。