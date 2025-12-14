# 🎓 LearnHub

> 自托管的个人学习平台 - 笔记、题库、日程、监控一体化解决方案

[![Go Version](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go)](https://golang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Annoymous9/learn-hub/pulls)

---

## ✨ 功能特性

### 📝 笔记管理
- **Markdown 编辑器**: 支持双栏预览、Mermaid 图表、代码高亮
- **双向链接**: 构建知识图谱
- **全文检索**: 基于 Meilisearch 的高性能搜索
- **附件管理**: 图片、PDF、文档统一管理
- **离线优先**: PWA 支持，断网编辑无忧

### 🔍 OCR 识别
- **图片转文字**: 集成 PaddleOCR，支持中英文混排
- **表格提取**: 自动识别表格结构并导出 CSV
- **公式识别**: 支持数学公式检测与转换
- **一键生成笔记**: OCR 结果直接转为笔记

### 📚 题库与考试
- **多题型支持**: 单选、多选、判断、填空、简答
- **智能组卷**: 按配额、难度、标签自动生成试卷
- **错题本**: 自动收集错题，针对性复习
- **实时判分**: 客观题自动评分，主观题手动批改

### 📅 日程与待办
- **看板视图**: 拖拽式任务管理
- **番茄钟**: 专注时间追踪
- **重复任务**: 支持 RRule 规则的循环事件
- **日历视图**: 基于 FullCalendar 的日程展示

### 📊 网站监控
- **多协议支持**: HTTP/HTTPS、TCP、Ping、SSL 证书
- **灵活配置**: 自定义检测间隔、超时时间、预期状态码
- **告警通知**: 异常时推送通知（待实现）
- **趋势图表**: ECharts 可视化监控数据

---

## 🏗️ 技术架构

### 后端 (Go 1.22)
```
learn-hub/
├── cmd/api/              # 服务入口
├── internal/
│   ├── controller/       # HTTP 处理器
│   ├── service/          # 业务逻辑
│   ├── repository/       # 数据访问
│   ├── entity/           # GORM 模型
│   └── middleware/       # 中间件（鉴权、CORS）
├── api/                  # OpenAPI 规范
└── configs/              # 配置文件
```

**核心依赖**:
- **Web 框架**: Gin
- **ORM**: GORM v2 (MySQL 8.0)
- **配置管理**: Viper
- **依赖注入**: Wire
- **API 生成**: oapi-codegen
- **搜索引擎**: Meilisearch

### 前端 (React 18 + TypeScript)
```
web/
├── src/
│   ├── features/         # 功能模块（笔记、考试、任务...）
│   ├── components/       # 通用组件
│   ├── api/              # 自动生成的 API 客户端
│   └── stores/           # Zustand 状态管理
└── public/               # PWA Manifest
```

**核心技术**:
- **构建工具**: Vite
- **UI 组件**: Ant Design v5
- **富文本**: TipTap / CodeMirror
- **图表**: ECharts
- **离线存储**: IndexedDB

---

## 🚀 快速开始

### 前置要求
- **Go 1.22+**
- **Node.js 18+**
- **MySQL 8.0**
- **Redis 5.x** (可选，用于队列与缓存)
- **Meilisearch** (可选，用于全文检索)

### 本地开发

#### 1️⃣ 克隆项目
```bash
git clone https://github.com/Annoymous9/learn-hub.git
cd learn-hub
```

#### 2️⃣ 配置后端
```bash
# 复制配置示例
cp configs/config.yaml.example configs/config.yaml

# 编辑配置文件，填入数据库连接信息
# vim configs/config.yaml

# 安装依赖
go mod download

# 运行后端
go run cmd/api/main.go
```

后端服务默认运行在 `http://localhost:8080`

#### 3️⃣ 配置前端
```bash
cd web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

前端服务默认运行在 `http://localhost:5173`

---

## 🐳 Docker 部署

### 使用 Docker Compose（推荐）
```bash
# 编辑配置文件
cp configs/config.yaml.example configs/config.yaml
vim configs/config.yaml

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f api
```

服务访问地址：
- **前端**: `https://your-domain.com`
- **API**: `https://your-domain.com/api`

---

## 📖 API 文档

API 基于 OpenAPI 3.1 规范定义，查看 [api/openapi.yaml](api/openapi.yaml)

### 主要端点
- **认证**: `POST /api/auth/login`
- **笔记**: `GET/POST/PATCH/DELETE /api/notes`
- **OCR**: `POST /api/ocr/jobs`
- **考试**: `POST /api/exams/{id}/start`
- **任务**: `GET/POST/PATCH /api/tasks`
- **监控**: `GET /api/monitors`

---

## 🔐 安全性

- **JWT 认证**: 基于 Bearer Token 的无状态认证
- **行级隔离**: 所有数据通过 `owner_id` 严格隔离
- **密码加密**: bcrypt 哈希存储
- **HTTPS 强制**: 生产环境自动启用 (Caddy)

---

## 🛠️ 开发指南

### 生成 API 代码
```bash
# 后端 Gin 路由
go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen -config api/codegen.yaml api/openapi.yaml

# 前端 TypeScript 客户端
pnpm openapi-typescript api/openapi.yaml -o web/src/api/schema.d.ts
```

### 运行测试
```bash
# 后端单元测试
go test ./internal/... -cover

# 前端测试
cd web && pnpm test
```

### 代码规范
- 后端遵循 [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
- 前端使用 ESLint + Prettier
- Git 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🗺️ 路线图

- [x] 笔记管理基础功能
- [x] 用户认证与权限
- [ ] OCR 服务集成
- [ ] 题库导入与批量管理
- [ ] WebSocket 实时同步
- [ ] 移动端适配 (React Native)
- [ ] 暗黑模式
- [ ] 国际化 (i18n)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议

---

## 📮 联系方式

- **Issues**: [GitHub Issues](https://github.com/Annoymous9/learn-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Annoymous9/learn-hub/discussions)

---

## 🙏 致谢

- [Gin](https://github.com/gin-gonic/gin) - 高性能 Go Web 框架
- [GORM](https://gorm.io) - 优秀的 Go ORM
- [Meilisearch](https://www.meilisearch.com) - 快速的全文搜索引擎
- [Ant Design](https://ant.design) - 企业级 UI 设计语言
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) - 强大的 OCR 工具

---

<p align="center">Made with ❤️ by developers, for learners</p>
