---
trigger: always_on
---

# 编码风格与架构 (Coding Standards)

## 1. 目录结构 (Standard Go Project Layout)
```text
/
├── cmd/api/            # main.go 入口
├── internal/
│   ├── api/            # oapi-codegen 生成的 handlers 接口定义
│   ├── controller/     # 具体的 HTTP 处理逻辑
│   ├── entity/         # GORM 数据库模型
│   ├── service/        # 核心业务逻辑
│   ├── repository/     # 数据访问层 (DAO)
│   ├── middleware/     # Gin 中间件 (Auth, CORS)
│   └── pkg/            # 内部工具包
├── pkg/                # 可导出的公共包 (错误码, Utils)
├── configs/            # 配置文件
└── api/                # OpenAPI 规范文件

## 2. 代码规范
- **错误处理**: 不要忽略 error。使用 fmt.Errorf("%w", err) 进行包装，不要使用 panic (除 main 初始化外)。
- **并发**: 既然使用 Go 1.22，在 for 循环中启动 Goroutine 时，不需要再写 v := v (利用 1.22 的 Loopvar fix)。
- **注释**: 导出的函数（Exported Functions）必须有中文注释。

## 3. 依赖注入
- 使用 Google Wire 模式。在 cmd/api/wire.go 中定义注入器，避免使用全局变量传递依赖。