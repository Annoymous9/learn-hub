---
trigger: always_on
---

# 前端架构规范 (Frontend Architecture)

## 1. 技术栈选型 (Tech Stack)
- **核心框架**: React 18 + TypeScript。
- **构建工具**: Vite (推荐，以获得最快开发体验)。
- **UI 组件库**: Ant Design (v5)。
- **路由管理**: React Router v6 (使用 Data Router API)。
- **状态管理**: Zustand (轻量级) 或 Redux Toolkit (如果状态极其复杂)。考虑到离线同步需求，建议配合 `idb` 操作 IndexedDB。
- **API 客户端**: `openapi-typescript` + `fetch` 或 `axios` (基于 OpenAPI 定义自动生成类型)。

## 2. 关键组件库
根据需求文档，必须集成以下库：
- **富文本/Markdown**: TipTap 或 CodeMirror + markdown-it (支持双栏预览与 Mermaid)。
- **图表**: ECharts (用于监控仪表盘)。
- **日历**: FullCalendar (用于日程视图)。
- **看板**: react-beautiful-dnd (用于待办任务)。
- **PWA**: 必须配置 Service Worker 和 Manifest，实现离线加载与 IndexedDB 缓存。

## 3. 目录结构
项目根目录下的 `/web` 目录：
```text
/web
├── src/
│   ├── api/            # 生成的 API Client (schema.d.ts, client.ts)
│   ├── assets/         # 静态资源
│   ├── components/     # 通用组件 (AuthGuard, Layout, Loading)
│   ├── features/       # 业务功能模块 (按领域划分)
│   │   ├── notes/      # 笔记编辑器, 列表, 侧边栏
│   │   ├── exams/      # 考试播放器, 题库管理
│   │   ├── tasks/      # 看板, 日历视图
│   │   └── monitor/    # 仪表盘, 趋势图
│   ├── hooks/          # 通用 Hooks (useAuth, useOfflineStatus)
│   ├── stores/         # 全局状态 (UserStore, SettingsStore)
│   ├── utils/          # 工具函数 (日期格式化, 离线同步逻辑)
│   ├── App.tsx
│   └── main.tsx
├── public/             # PWA manifest, icons
├── vite.config.ts
└── pnpm-lock.yaml

## 4. 离线与同步策略
根据需求文档，必须集成以下库：
- **离线优先**: 笔记编辑、待办清单必须支持断网操作。
- **冲突解决**: 使用“最后写入优先(LWW)”策略，或在检测到版本冲突时保留双方副本提示用户手动合并。
- **存储*: FullCalendar (用于日程视图)。