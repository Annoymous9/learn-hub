---
description: 初始化 Go 1.22 项目结构与基础依赖。
---

# Workflow: Scaffold Project
Trigger: /scaffold

**描述**: 初始化 Go 1.22 项目结构与基础依赖。

**步骤**:
1.  **Go Mod Init**: 执行 `go mod init learn-hub`。
2.  **创建目录**: 按照 `.agent/rules/03_coding_style.md` 递归创建目录。
3.  **安装依赖**:
    - `go get -u github.com/gin-gonic/gin`
    - `go get -u gorm.io/gorm gorm.io/driver/mysql`
    - `go get -u github.com/google/wire/cmd/wire`
    - `go get -u github.com/spf13/viper`
    - `go get -u github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen`
4.  **配置文件**: 在 `configs/` 下创建 `config.yaml` 模板。
5.  **入口文件**: 创建 `cmd/api/main.go`，包含基本的 Gin 启动代码。