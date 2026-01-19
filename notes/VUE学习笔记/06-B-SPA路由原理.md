# 06-B. SPA 路由原理 🛤️

> **学习目标**: 理解单页应用(SPA)的路由原理，掌握前端路由的核心概念。  
> **实践基地**: [🧪 实验室仪表板](../../../)

## 1. 什么是 SPA？

### 传统多页应用 (MPA)

```
用户点击链接 → 浏览器请求新 HTML → 服务器返回完整页面 → 整页刷新
```

每次导航都是**完整的页面刷新**，会看到白屏。

### 单页应用 (SPA)

```
用户点击链接 → JavaScript 拦截 → 只更新变化的部分 → 无刷新切换
```

只有一个 HTML 文件，通过 JavaScript 动态更新内容。

---

## 2. 前端路由的核心原理

### 2.1 Hash 模式

URL 格式：`http://example.com/#/about`

```javascript
// 监听 hash 变化
window.addEventListener('hashchange', () => {
  const path = window.location.hash.slice(1)  // 去掉 #
  console.log('路由变化:', path)
  renderPage(path)
})

// 编程式导航
function navigate(path) {
  window.location.hash = path
}
```

**优点**：
- 兼容性好（支持老浏览器）
- 不需要服务器配置

**缺点**：
- URL 带 `#`，不够优雅
- SEO 不友好

### 2.2 History 模式

URL 格式：`http://example.com/about`

```javascript
// 监听 popstate (浏览器前进/后退)
window.addEventListener('popstate', (event) => {
  const path = window.location.pathname
  console.log('路由变化:', path)
  renderPage(path)
})

// 编程式导航
function navigate(path) {
  history.pushState(null, '', path)
  renderPage(path)  // 需要手动触发渲染
}
```

**优点**：
- URL 干净美观
- SEO 友好

**缺点**：
- 需要服务器配置（所有路径返回 index.html）
- 兼容性稍差（IE10+）

---

## 3. 手写简易路由

### 3.1 基本实现

```typescript
// 简易路由实现
class SimpleRouter {
  private routes: Map<string, () => void> = new Map()
  private currentPath: string = '/'
  
  // 注册路由
  route(path: string, handler: () => void) {
    this.routes.set(path, handler)
  }
  
  // 导航
  navigate(path: string) {
    this.currentPath = path
    history.pushState(null, '', path)
    this.render()
  }
  
  // 渲染
  render() {
    const handler = this.routes.get(this.currentPath)
    if (handler) {
      handler()
    } else {
      console.log('404 Not Found')
    }
  }
  
  // 初始化
  init() {
    // 监听浏览器前进/后退
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname
      this.render()
    })
    
    // 初始渲染
    this.currentPath = window.location.pathname
    this.render()
  }
}

// 使用
const router = new SimpleRouter()

router.route('/', () => {
  document.body.innerHTML = '<h1>首页</h1>'
})

router.route('/about', () => {
  document.body.innerHTML = '<h1>关于</h1>'
})

router.init()
```

### 3.2 添加参数支持

```typescript
// 支持动态参数: /user/:id
class Router {
  // 解析路径参数
  private matchRoute(path: string) {
    for (const [pattern, handler] of this.routes) {
      // 将 /user/:id 转换为正则 /user/([^/]+)
      const regex = new RegExp(
        '^' + pattern.replace(/:([^/]+)/g, '([^/]+)') + '$'
      )
      
      const match = path.match(regex)
      if (match) {
        // 提取参数
        const paramNames = pattern.match(/:([^/]+)/g) || []
        const params: Record<string, string> = {}
        
        paramNames.forEach((name, i) => {
          params[name.slice(1)] = match[i + 1]
        })
        
        return { handler, params }
      }
    }
    return null
  }
}
```

---

## 4. 樱花笔记的路由实现

樱花笔记是一个**静态站点**，使用简化的客户端路由：

### 4.1 路由状态管理

```typescript
// stores/appStore.ts
export const useAppStore = defineStore('app', () => {
  // 当前路径
  const currentPath = ref('')
  const currentView = ref<'home' | 'article' | 'lab'>('home')
  
  // 导航
  const navigateTo = (path: string) => {
    currentPath.value = path
    
    // 根据路径判断视图
    if (path.startsWith('/lab')) {
      currentView.value = 'lab'
    } else if (path) {
      currentView.value = 'article'
    } else {
      currentView.value = 'home'
    }
    
    // 更新 URL（不刷新页面）
    history.pushState({ path }, '', `#${path}`)
  }
  
  return { currentPath, currentView, navigateTo }
})
```

### 4.2 视图切换

```vue
<!-- App.vue -->
<template>
  <div>
    <AppHeader />
    <main>
      <!-- 根据路由显示不同内容 -->
      <HomeView v-if="appStore.currentView === 'home'" />
      <ArticleView v-else-if="appStore.currentView === 'article'" />
      <LabView v-else-if="appStore.currentView === 'lab'" />
    </main>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

// 监听浏览器前进/后退
window.addEventListener('popstate', (event) => {
  if (event.state?.path) {
    appStore.navigateTo(event.state.path)
  }
})
</script>
```

### 4.3 链接处理

```typescript
// composables/useContentClick.ts
const handleLinkClick = (href: string) => {
  const appStore = useAppStore()
  
  // 外部链接 - 新窗口打开
  if (href.startsWith('http')) {
    window.open(href, '_blank')
    return
  }
  
  // 内部链接 - 客户端导航
  appStore.navigateTo(href)
}
```

---

## 5. Vue Router 简介

对于复杂应用，推荐使用官方的 Vue Router：

### 5.1 基本配置

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/about', component: () => import('./views/About.vue') },
  { path: '/user/:id', component: () => import('./views/User.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('./views/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 5.2 在组件中使用

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取参数
console.log(route.params.id)

// 编程式导航
const goToUser = (id) => {
  router.push(`/user/${id}`)
}
</script>

<template>
  <router-link to="/">首页</router-link>
  <router-link :to="`/user/${userId}`">用户</router-link>
  
  <router-view />
</template>
```

### 5.3 路由守卫

```typescript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查登录状态
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})
```

---

## 6. 路由模式对比

| 特性 | Hash 模式 | History 模式 |
|------|-----------|--------------|
| URL 格式 | `/#/path` | `/path` |
| 服务器配置 | 不需要 | 需要 |
| SEO | 较差 | 较好 |
| 兼容性 | 极好 | IE10+ |
| GitHub Pages | ✅ 直接支持 | ⚠️ 需要配置 |

---

## 7. 为什么樱花笔记用 Hash 模式？

1. **部署在 GitHub Pages** - 不支持服务器配置
2. **静态站点** - 不需要复杂路由
3. **简单直接** - 满足需求即可

```javascript
// 樱花笔记的 URL 结构
// 首页: https://xxx.github.io/
// 文章: https://xxx.github.io/#/notes/VUE学习笔记/01-基础概念.md
// 实验室: https://xxx.github.io/#/lab
```

---

## 8. 练习任务

1. 实现一个支持动态参数的简易路由
2. 添加路由守卫功能
3. 理解樱花笔记中的路由实现

---

## 参考资源

- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [History API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
- 樱花笔记源码: `App.vue`, `stores/appStore.ts`
