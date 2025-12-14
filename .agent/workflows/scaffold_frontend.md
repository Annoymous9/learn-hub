---
description: 初始化 React 18 + TS 前端项目结构。
---

# Workflow: Scaffold Frontend
Trigger: /scaffold-fe

**描述**: 初始化 React 18 + TS 前端项目结构。

**步骤**:
1.  **创建目录**: 确保根目录下存在 `web` 文件夹。
2.  **Vite 初始化**: 在 `web` 目录下运行 `npm create vite . --template react-ts`。
3.  **安装核心依赖**:
    ```bash
    npm add antd react-router-dom axios dayjs idb zustand
    npm add -D sass typescript @types/node @types/react @types/react-dom
    ```
4.  **安装业务依赖**:
    ```bash
    npm add echarts-for-react @fullcalendar/react @fullcalendar/daygrid
    npm add @tiptap/react @tiptap/starter-kit
    ```
5.  **配置结构**: 按照 `.agent/rules/06_frontend_architecture.md` 创建 `src` 下的子目录。
6.  **PWA 配置**: 安装 `vite-plugin-pwa` 并生成基础 `manifest.json`。