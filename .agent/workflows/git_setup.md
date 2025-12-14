---
description: 初始化 Git 仓库，配置 .gitignore，创建 GitHub 远程私有仓库并上传代码。
---

# Workflow: Git Setup & Push
Trigger: /git-push

**描述**: 初始化 Git 仓库，配置 .gitignore，创建 GitHub 远程私有仓库并上传代码。

**前置条件**:
1. 用户必须已在终端通过 `gh auth login` 登录。
2. 项目根目录必须存在。

**步骤**:

1.  **生成 .gitignore 文件**:
    在根目录创建或更新 `.gitignore`，必须包含以下内容（合并后端 Go 和前端 Node 的规则）：
    ```text
    # OS & Tooling
    .DS_Store
    .vscode/
    .idea/
    
    # Go (Backend)
    /server
    go.sum
    *.exe
    *.test
    coverage.out
    coverage.html
    
    # Node (Frontend)
    node_modules/
    dist/
    .env
    .env.local
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    pnpm-debug.log*
    
    # Project Data (Private)
    config.yaml
    configs/config.yaml
    !configs/config.yaml.example
    *.db
    *.sqlite
    data/
    attachments/
    backups/
    meili_data/
    caddy_data/
    
    # Environment Variables
    .env
    ```

2.  **初始化本地仓库**:
    - 执行 `git init` (如果尚未初始化)。
    - 执行 `git branch -M main`。

3.  **提交代码**:
    - 执行 `git add .`。
    - 执行 `git commit -m ...(根据开发内容补全)`。

4.  **创建并关联远程仓库**:
    - 询问用户：“是否将仓库创建为私有 (Private)？(y/n)”。
    - 如果是，执行: `gh repo create learn-hub --private --source=. --remote=origin`。
    - 如果否，执行: `gh repo create learn-hub --public --source=. --remote=origin`。
    - *注意*: 如果仓库已存在，则尝试 `git push -u origin main`。

5.  **推送代码**:
    - 执行 `git push -u origin main`。

6.  **验证**:
    - 输出仓库的 URL 供用户访问。