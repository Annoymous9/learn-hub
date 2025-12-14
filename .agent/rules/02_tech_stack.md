---
trigger: always_on
---

# 技术栈选型 (Tech Stack Lock)

所有代码生成必须严格遵循以下选型：

## 1. 后端 (Go 1.22)
- **Web 框架**: `github.com/gin-gonic/gin` (高性能，中间件丰富)。
- **ORM**: `gorm.io/gorm` (v2) + `gorm.io/driver/mysql`。
- **依赖注入**: `github.com/google/wire` (编译时注入，保证启动速度)。
- **配置管理**: `github.com/spf13/viper` (支持 YAML/Env)。
- **API 生成**: `github.com/oapi-codegen/oapi-codegen/v2` (Schema First 开发)。
- **测试库**: `github.com/stretchr/testify` (断言与 Mock)。

## 2. 基础设施
- **数据库**: MySQL 8.0 (InnoDB, utf8mb4)。
- **缓存/队列**: Redis 5.x。
- **搜索引擎**: Meilisearch (官方 Go 客户端 `meilisearch-go`)。
- **反向代理**: Caddy 2 (自动 HTTPS)。