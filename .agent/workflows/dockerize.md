---
description: 生成生产可用的容器化配置。
---

# Workflow: Dockerize
Trigger: /docker

**描述**: 生成生产可用的容器化配置。

**步骤**:
1.  **Dockerfile**: 创建多阶段构建文件 (Multi-stage Build)。
    - *Builder*: `golang:1.22-alpine`。
    - *Runner*: `alpine:latest` (需安装 `tzdata` 设置时区)。
    - *CMD*: 运行编译后的二进制文件。
2.  **Docker Compose**: 创建 `docker-compose.yml`。
    - 定义服务: `api`, `mysql`, `redis`, `meili`, `caddy`。
    - 配置网络: 确保服务间互通。
    - 挂载: 配置数据卷持久化 (`mysql_data`, `meili_data`)。
    - 资源限制: 为 `api` 服务设置 `mem_limit: 512m`。