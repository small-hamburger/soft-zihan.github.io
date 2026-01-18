# 🌸 Sakura Notes

> **v1.0**

这是一个基于 **Vue 3** + **Tailwind CSS** 的纯静态个人博客系统，专为 **GitHub Pages** 部署设计。

[**在线演示 (Live Demo)**](https://soft-zihan.github.io/)

---

## ✨ 特性 (Features)

- **纯静态架构**：完全基于客户端渲染 (CSR)，通过 GitHub Actions 预生成元数据索引。
- **支持上传文章和评论**：启发来自[RyuChan](https://github.com/kobaridev/RyuChan)，技术采用[giscus](https://github.com/giscus/giscus).
- **国际化支持**：内置中/英双语切换 (i18n)，切换时保持当前标签页和实验室位置不变（仅笔记刷新）。
- **主题模式**：支持 "Day Sakura" (浅色) 和 "Night Sakura" (深色) 两种主题模式，支持不同主题下切换壁纸，支持音乐播放。
- **交互式花瓣效果**：可拖拽樱花花瓣系统，稳定的指针事件、网格堆叠、移动端触控优化。
- **Sakura Lab**: 内置互动实验室，包含可视化教学组件。
- **发布工作台**：导入预览、选择性上传、标签/作者元信息写入，并自动上传 Markdown 中的本地图片。
- **无后端个性化**：利用 `localStorage` 存储用户选择的字体、字号、主题和花瓣速度偏好等。

---

## 📁 项目结构

本节介绍项目中的关键文件和目录：

### 根目录文件

- [index.html](/index.html): 主 HTML 入口文件，包含樱花主题样式和 Tailwind CSS 配置
- [index.tsx](/index.tsx): 应用程序引导文件，将 Vue 应用挂载到 DOM
- [App.vue](/App.vue): 根 Vue 组件（1246 行），协调整个应用程序：
  - **状态管理**：语言 (`lang`)、主题 (`isDark`)、视图模式 (`viewMode`)、当前文件/文件夹、用户设置（字体、字号、花瓣速度）
  - **动态渲染**：条件渲染实验室仪表板、文件夹视图、Markdown 查看器或源代码模态框
  - **侧边栏集成**：向 `AppSidebar` 传递文件系统、展开的文件夹、面包屑导航和资源分类
  - **主内容区域**：包含壁纸层、装饰性渐变、头部、内容区和右侧目录侧边栏
  - **交互特性**：选择弹出菜单（高亮/下划线）、图片灯箱、源文件代码模态框
  - **Markdown 处理**：使用 `marked` 库渲染 Markdown，自定义标题 ID、图片路径解析和链接拦截
  - **目录生成**：从 Markdown 标题自动生成目录，带活动章节高亮
  - **URL 同步**：更新浏览器 URL 与当前文件路径，支持分享链接
  - **设置持久化**：将主题、语言、字体、字号和花瓣速度存储到 `localStorage`
- [vite.config.ts](/vite.config.ts): 项目的 Vite 构建配置
- [package.json](/package.json): 项目依赖和脚本
- [tsconfig.json](/package.json): TypeScript 配置
- [README.md](/README.md) / [README_zh.md](/README_zh.md): 英文和中文的文档
- [constants.ts](/constants.ts): 国际化常量和配置
- [types.ts](/types.ts): 应用程序中使用的 TypeScript 类型定义
- [metadata.json](/metadata.json): 博客的自动生成内容索引
- [env.d.ts](/env.d.ts): 环境类型的 TypeScript 声明文件

### 组件 (Components)

- [components/AppHeader.vue](/components/AppHeader.vue): 包含导航控件和设置的头部组件
- [components/AppSidebar.vue](/components/AppSidebar.vue): 带有文件导航和视图模式切换的侧边栏
- [components/FileTree.vue](/components/FileTree.vue): 用于显示目录结构的递归文件树组件
- [components/FolderView.vue](/components/FolderView.vue): 用于显示文件夹内容的组件
- [components/SettingsModal.vue](/components/SettingsModal.vue): 用户偏好设置模态框（主题、字体、花瓣速度、壁纸等）
- [components/WriteEditor.vue](/components/WriteEditor.vue): 发布工作台，支持 Markdown 预览、标签/作者元信息、批量导入与本地图片上传
- [components/PetalBackground.vue](/components/PetalBackground.vue): 优化的交互式樱花花瓣背景：
  - 稳定拖拽：全局 Pointer 事件监听（统一鼠标/触摸）
  - 网格堆叠：底部轻量网格系统，避免重叠，形成自然堆积效果
  - 移动端优化：支持 `touch-action: none`，无手势冲突
  - 主题响应：随主题切换花瓣颜色与阴影
- [components/WallpaperLayer.vue](/components/WallpaperLayer.vue): 主题壁纸层（仅覆盖主内容区域，不影响侧边栏）：
  - 自动切换浅色 (`/image/wallpaper-light.jpg`) 与深色 (`/image/wallpaper-dark.jpg`) 壁纸
  - 使用 `background-size: cover`，不拉伸
- [components/petal/usePetals.ts](/components/petal/usePetals.ts): 花瓣物理与堆叠逻辑的可复用组合式函数
- [components/LabDashboard.vue](/components/LabDashboard.vue): Vue 学习实验室的仪表板
- [components/LabAjax.vue](/components/LabAjax.vue): 展示 AJAX 概念的 Vue 实验室组件
- [components/LabClassStyle.vue](/components/LabClassStyle.vue): 用于类和样式绑定的 Vue 实验室组件
- [components/LabDirectives.vue](/components/LabDirectives.vue): 展示指令的 Vue 实验室组件
- [components/LabDom.vue](/components/LabDom.vue): 用于 DOM 操作的 Vue 实验室组件
- [components/LabHtml.vue](/components/LabHtml.vue): 用于 HTML 渲染的 Vue 实验室组件
- [components/LabJs.vue](/components/LabJs.vue): 用于 JavaScript 概念的 Vue 实验室组件
- [components/LabLifecycle.vue](/components/LabLifecycle.vue): 展示生命周期钩子的 Vue 实验室组件
- [components/LabPropsEmit.vue](/components/LabPropsEmit.vue): 用于 props 和 emit 通信的 Vue 实验室组件
- [components/LabQuizGame.vue](/components/LabQuizGame.vue): 交互式测验游戏实验室组件
- [components/LabReactivity.vue](/components/LabReactivity.vue): 展示响应式原理的 Vue 实验室组件
- [components/LabVueList.vue](/components/LabVueList.vue): 用于列表渲染的 Vue 实验室组件
- [components/LabTypeScript.vue](/components/LabTypeScript.vue): TypeScript 基础实验室
- [components/LabModuleSystem.vue](/components/LabModuleSystem.vue): ESM/CommonJS 模块实验室
- [components/LabNpm.vue](/components/LabNpm.vue): NPM 包管理实验室
- [components/LabBuildTools.vue](/components/LabBuildTools.vue): Vite 构建工具实验室
- [components/LabTailwind.vue](/components/LabTailwind.vue): TailwindCSS 快速入门实验室

### 笔记 (Notes)

- [notes/](/notes/): 包含多种语言的 markdown 笔记的目录
  - [notes/VUE_Learning/](/notes/VUE Learning/): 英文 Vue 学习笔记
  - [notes/VUE学习笔记/](/notes/VUE学习笔记/): 中文 Vue 学习笔记
  - [notes/en/](/notes/en/): 英文技术笔记
  - [notes/zh/](/notes/zh/): 中文技术笔记

### 脚本 (Scripts)

- [scripts/generate-tree.js](/scripts/generate-tree.js): 用于扫描 notes 目录并生成元数据索引的 Node.js 脚本

---

## 🛠 原理与架构

1. **Scanner**: Node.js 脚本扫描 `notes/` 目录生成索引。
2. **Deploy**: 所有的 Markdown 和 **图片资源** 都会被原样复制到 `dist/notes/` 目录。
3. **Runtime**: Vue 应用拦截 Markdown 中的图片路径，自动补全为服务器上的真实路径。

---

## 🚀 如何投稿 (Contributing)

我们非常欢迎您的贡献！如果您想分享笔记或贡献代码：

1. 克隆仓库。
2. 直接推送到 `main` 分支。
3. 或者您可以提交 **Pull Request (PR)** 到主分支。

---

## 🚀 自行部署

1. **Fork** 此仓库。
2. 在项目根目录下 `notes` 文件夹中创建 `.md` 文件。
3. Push 代码，在 GitHub 仓库的 **Settings -> Pages** 中选择 **GitHub Actions** 作为构建源。每次 push 会自动构建并部署到 Pages。

希望这个项目能成为你整理知识、分享生活的小小花园 🌸
