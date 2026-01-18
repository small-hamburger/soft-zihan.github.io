# 🌸 Sakura Notes

<div align="center">
    <a href="README_zh.md">简体中文</a>
</div>

> **v1.0**

A pure static personal blog system built with **Vue 3** + **Tailwind CSS**, designed specifically for **GitHub Pages** deployment.

[**Live Demo**](https://soft-zihan.github.io/)

---

## ✨ Features

* **Purely Static Architecture** : Fully based on client-side rendering (CSR), with pre-generated metadata indexes via GitHub Actions.
* **Article and Comment Upload Support** : Inspired by [RyuChan](https://github.com/kobaridev/RyuChan), implemented using [giscus](https://github.com/giscus/giscus) technology.
* **Internationalization Support** : Built-in Chinese/English bilingual switching (i18n). Switching retains the current tab and lab position (only notes are refreshed).
* **Theme Modes** : Supports "Day Sakura" (light) and "Night Sakura" (dark) themes, with wallpaper switching in different themes and music playback.
* **Interactive Petal Effects** : A draggable cherry blossom petal system with stable pointer events, grid stacking, and mobile touch optimization.
* **Sakura Lab** : Built-in interactive lab with visual teaching components.
* **Publishing Studio** : Import preview, selective upload, tags/author metadata injection, and automatic local image upload for Markdown.
* **Backend-Free Personalization** : Uses `localStorage` to store user preferences for font, font size, theme, petal speed, and more.

---

## 📁 Project Structure

This section describes the key files and directories in the project:

### Root Files

- [index.html](/index.html): Main HTML entry point with Sakura-themed styling and Tailwind CSS configuration
- [index.tsx](/index.tsx): Application bootstrap file that mounts the Vue app to the DOM
- [App.vue](/App.vue): Root Vue component (1246 lines) that orchestrates the entire application:
  - **State Management**: Language (`lang`), theme (`isDark`), view mode (`viewMode`), current file/folder, user settings (font, size, petal speed)
  - **Dynamic Rendering**: Conditional rendering of Lab Dashboard, Folder View, Markdown Viewer, or Source Code Modal
  - **Sidebar Integration**: Passes file system, expanded folders, breadcrumbs, and resource categories to `AppSidebar`
  - **Main Content Area**: Contains wallpaper layer, decorative gradients, header, content zone, and right TOC sidebar
  - **Interactive Features**: Selection popup menu (highlight/underline), lightbox for images, code modal for source files
  - **Markdown Processing**: Uses `marked` library to render Markdown with custom heading IDs, image path resolution, and link interception
  - **TOC Generation**: Auto-generates table of contents from Markdown headings with active section highlighting
  - **URL Sync**: Updates browser URL with current file path for shareable links
  - **Settings Persistence**: Stores theme, language, font, font size, and petal speed in `localStorage`
- [vite.config.ts](/vite.config.ts): Vite build configuration for the project
- [package.json](/package.json): Project dependencies and scripts
- [tsconfig.json](/package.json): TypeScript configuration
- [README.md](/README.md) / [README_zh.md](/README_zh.md): Documentation in English and Chinese
- [constants.ts](/constants.ts): Internationalization constants and configuration
- [types.ts](/types.ts): TypeScript type definitions used across the application
- [metadata.json](/metadata.json): Auto-generated content index for the blog
- [env.d.ts](/env.d.ts): TypeScript declaration file for environment types

### Components

- [components/AppHeader.vue](/components/AppHeader.vue): Header component with navigation controls and settings
- [components/AppSidebar.vue](/components/AppSidebar.vue): Sidebar with file navigation and view mode toggles
- [components/FileTree.vue](/components/FileTree.vue): Recursive file tree component for displaying the directory structure
- [components/FolderView.vue](/components/FolderView.vue): Component for displaying folder contents
- [components/SettingsModal.vue](/components/SettingsModal.vue): Modal for user preferences (theme, font, petal speed, wallpaper, etc.)
- [components/WriteEditor.vue](/components/WriteEditor.vue): Publishing studio with Markdown preview, tag/author metadata, and bulk import (folder) upload with local images
- [components/PetalBackground.vue](/components/PetalBackground.vue): Optimized animated sakura petal background with:
  - Stable drag via global Pointer Events (mouse/touch unified)
  - Grid-based bottom stacking for natural piling effect
  - Mobile-optimized with `touch-action: none`
  - Theme-reactive coloring
- [components/WallpaperLayer.vue](/components/WallpaperLayer.vue): Theme-based wallpaper layer (covers main content area only, excludes sidebar):
  - Automatically switches between light (`/image/wallpaper-light.jpg`) and dark (`/image/wallpaper-dark.jpg`) wallpapers
  - Uses `background-size: cover` for no stretching
- [components/petal/usePetals.ts](/components/petal/usePetals.ts): Composable for petal physics and stacking logic
- [components/LabDashboard.vue](/components/LabDashboard.vue): Dashboard for Vue learning labs
- [components/LabAjax.vue](/components/LabAjax.vue): Vue lab component demonstrating AJAX concepts
- [components/LabClassStyle.vue](/components/LabClassStyle.vue): Vue lab component for class and style binding
- [components/LabDirectives.vue](/components/LabDirectives.vue): Vue lab component demonstrating directives
- [components/LabDom.vue](/components/LabDom.vue): Vue lab component for DOM manipulation
- [components/LabHtml.vue](/components/LabHtml.vue): Vue lab component for HTML rendering
- [components/LabJs.vue](/components/LabJs.vue): Vue lab component for JavaScript concepts
- [components/LabLifecycle.vue](/components/LabLifecycle.vue): Vue lab component demonstrating lifecycle hooks
- [components/LabPropsEmit.vue](/components/LabPropsEmit.vue): Vue lab component for props and emit communication
- [components/LabQuizGame.vue](/components/LabQuizGame.vue): Interactive quiz game lab component
- [components/LabReactivity.vue](/components/LabReactivity.vue): Vue lab component demonstrating reactivity
- [components/LabVueList.vue](/components/LabVueList.vue): Vue lab component for list rendering
- [components/LabTypeScript.vue](/components/LabTypeScript.vue): TypeScript fundamentals lab
- [components/LabModuleSystem.vue](/components/LabModuleSystem.vue): ESM vs CommonJS lab
- [components/LabNpm.vue](/components/LabNpm.vue): NPM package management lab
- [components/LabBuildTools.vue](/components/LabBuildTools.vue): Vite build tools lab
- [components/LabTailwind.vue](/components/LabTailwind.vue): TailwindCSS quickstart lab

### Notes

- [notes/](/notes/): Directory containing markdown notes in multiple languages
  - [notes/VUE Learning/](/notes/VUE Learning/): English Vue learning notes
  - [notes/VUE学习笔记/](/notes/VUE学习笔记/): Chinese Vue learning notes
  - [notes/en/](/notes/en/): English technical notes
  - [notes/zh/](/notes/zh/): Chinese technical notes

### Scripts

- [scripts/generate-tree.js](/scripts/generate-tree.js): Node.js script to scan notes directory and generate metadata index

---

## 🛠 Principle & Architecture

1. **Scanner**: A Node.js script scans the `notes/` directory to generate the content index.
2. **Deploy**: All Markdown files and **image assets** are copied directly to the `dist/notes/` directory.
3. **Runtime**: The Vue application intercepts image paths in Markdown and automatically completes them with the real server paths.

---

## 🚀 How to Contribute

We welcome your contributions! If you'd like to share notes or contribute code:

1. Clone the repository.
2. Push your changes directly to the `main` branch.
3. Alternatively, you can submit a **Pull Request (PR)** to the main branch.

---

## 🚀 Self-Deployment

1. **Fork** this repository.
2. Create `.md` files inside the `notes` folder in the project root.
3. Push your code. Select **GitHub Actions** for the source in your repository's Pages settings. Each push will trigger an automatic build and deploy to Pages.

Hope this project becomes your little garden for organizing knowledge and sharing life 🌸
