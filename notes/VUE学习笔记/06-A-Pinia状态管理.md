# 06-A. Pinia 状态管理 🍍

> **学习目标**: 掌握 Vue 3 官方状态管理库 Pinia 的核心概念和使用方法。  
> **实践基地**: [🧪 Pinia 实验室](../../../)

## 1. 为什么需要状态管理？

### 问题场景

```
AppHeader
    ├── 需要知道当前主题 (dark/light)
    └── 需要切换主题

AppSidebar
    ├── 需要知道当前主题
    └── 显示不同的图标

ArticleCard
    └── 需要知道当前主题来调整样式
```

如果没有状态管理，你需要通过 props 层层传递：

```vue
<!-- ❌ Props drilling (地狱) -->
<App :theme="theme" @toggle="toggle">
  <AppHeader :theme="theme" @toggle="toggle" />
  <Main :theme="theme">
    <Sidebar :theme="theme">
      <Card :theme="theme" />
    </Sidebar>
  </Main>
</App>
```

### 解决方案：集中状态管理

```
┌─────────────────────────┐
│      Pinia Store        │  ← 单一数据源
│  { theme, toggleTheme } │
└─────────────────────────┘
      ↑           ↑
      │           │
┌─────┴───┐  ┌────┴────┐
│ Header  │  │ Sidebar │  ← 任意组件直接访问
└─────────┘  └─────────┘
```

---

## 2. Pinia vs Vuex

| 特性 | Pinia | Vuex |
|------|-------|------|
| Vue 版本 | Vue 3（推荐）| Vue 2/3 |
| TypeScript | ✅ 原生支持 | ⚠️ 需要额外配置 |
| Mutations | ❌ 不需要 | ✅ 必须 |
| 模块化 | 扁平化设计 | 嵌套模块 |
| DevTools | ✅ 完整支持 | ✅ 支持 |
| 体积 | ~1KB | ~10KB |

> 💡 Pinia 是 Vuex 5 的实现，是 Vue 官方推荐的状态管理方案。

---

## 3. 创建第一个 Store

### 3.1 安装

```bash
npm install pinia
```

### 3.2 注册 Pinia

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

### 3.3 定义 Store（组合式写法）

```typescript
// stores/appStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State - 使用 ref
  const theme = ref<'light' | 'dark'>('light')
  const language = ref<'zh' | 'en'>('zh')
  
  // Getters - 使用 computed
  const isDark = computed(() => theme.value === 'dark')
  const isZh = computed(() => language.value === 'zh')
  
  // Actions - 普通函数
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  const setLanguage = (lang: 'zh' | 'en') => {
    language.value = lang
  }
  
  // 返回需要暴露的内容
  return {
    // State
    theme,
    language,
    // Getters
    isDark,
    isZh,
    // Actions
    toggleTheme,
    setLanguage
  }
})
```

### 3.4 选项式写法（对比）

```typescript
// 选项式写法 - 类似 Vuex
export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light',
    language: 'zh'
  }),
  
  getters: {
    isDark: (state) => state.theme === 'dark',
    isZh: (state) => state.language === 'zh'
  },
  
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    setLanguage(lang) {
      this.language = lang
    }
  }
})
```

> 💡 **推荐组合式写法**，与 `<script setup>` 一致，更灵活。

---

## 4. 在组件中使用 Store

### 4.1 基本用法

```vue
<script setup>
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
</script>

<template>
  <div :class="appStore.isDark ? 'dark' : 'light'">
    <p>当前主题: {{ appStore.theme }}</p>
    <button @click="appStore.toggleTheme">
      切换主题
    </button>
  </div>
</template>
```

### 4.2 解构（注意响应式）

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

// ❌ 错误: 直接解构会丢失响应式
// const { theme, isDark } = appStore

// ✅ 正确: 使用 storeToRefs 保持响应式
const { theme, isDark } = storeToRefs(appStore)

// Actions 可以直接解构（它们是函数）
const { toggleTheme } = appStore
</script>
```

---

## 5. 樱花笔记中的 Store 设计

### 5.1 appStore - 应用状态

```typescript
// stores/appStore.ts
export const useAppStore = defineStore('app', () => {
  // 主题
  const theme = ref<'light' | 'dark'>('light')
  
  // 语言
  const lang = ref<'zh' | 'en'>('zh')
  
  // 侧边栏状态
  const sidebarOpen = ref(true)
  
  // 当前路径
  const currentPath = ref('')
  
  // ...更多状态
  
  return { theme, lang, sidebarOpen, currentPath }
})
```

### 5.2 musicStore - 音乐播放器

```typescript
// stores/musicStore.ts
export const useMusicStore = defineStore('music', () => {
  // 播放状态
  const isPlaying = ref(false)
  const currentTrack = ref<Track | null>(null)
  const playlist = ref<Track[]>([])
  const volume = ref(0.7)
  const currentTime = ref(0)
  const duration = ref(0)
  
  // 播放控制
  const play = () => { ... }
  const pause = () => { ... }
  const next = () => { ... }
  const prev = () => { ... }
  const setVolume = (v: number) => { ... }
  
  return {
    isPlaying, currentTrack, playlist,
    volume, currentTime, duration,
    play, pause, next, prev, setVolume
  }
})
```

### 5.3 articleStore - 文章状态

```typescript
// stores/articleStore.ts
export const useArticleStore = defineStore('article', () => {
  // 当前文章
  const currentArticle = ref<Article | null>(null)
  const content = ref('')
  const headings = ref<Heading[]>([])
  
  // 阅读状态
  const scrollProgress = ref(0)
  const readingTime = computed(() => {
    const words = content.value.length
    return Math.ceil(words / 300)  // 假设每分钟 300 字
  })
  
  return { currentArticle, content, headings, scrollProgress, readingTime }
})
```

---

## 6. 持久化状态

### 6.1 手动实现

```typescript
export const useAppStore = defineStore('app', () => {
  // 从 localStorage 恢复
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  const theme = ref(savedTheme || 'light')
  
  // 监听变化并保存
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
  })
  
  return { theme }
})
```

### 6.2 使用插件（推荐）

```bash
npm install pinia-plugin-persistedstate
```

```typescript
// main.ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```typescript
// stores/appStore.ts
export const useAppStore = defineStore('app', () => {
  const theme = ref('light')
  return { theme }
}, {
  persist: true  // 启用持久化
})
```

---

## 7. Store 之间的交互

```typescript
// stores/articleStore.ts
import { useAppStore } from './appStore'

export const useArticleStore = defineStore('article', () => {
  const appStore = useAppStore()
  
  const loadArticle = async (path: string) => {
    // 使用 appStore 的语言设置
    const lang = appStore.lang
    const response = await fetch(`/notes/${lang}/${path}`)
    // ...
  }
  
  return { loadArticle }
})
```

---

## 8. 最佳实践

### 8.1 Store 职责单一

```
stores/
├── appStore.ts      # 应用级状态 (主题、语言)
├── userStore.ts     # 用户状态 (登录、权限)
├── musicStore.ts    # 音乐播放器状态
└── articleStore.ts  # 文章相关状态
```

### 8.2 避免在 Store 中存储

- ❌ 派生状态（用 computed 代替）
- ❌ 组件 UI 状态（保持在组件内）
- ❌ 频繁变化的临时状态

### 8.3 命名约定

```typescript
// Store 文件: xxxStore.ts
// Hook 函数: useXxxStore
// Store ID: 'xxx'

// stores/appStore.ts
export const useAppStore = defineStore('app', () => { ... })

// stores/musicStore.ts
export const useMusicStore = defineStore('music', () => { ... })
```

---

## 9. 与 Composables 的区别

| 场景 | 使用 Store | 使用 Composable |
|------|-----------|-----------------|
| 全局共享状态 | ✅ | ❌ |
| 单个组件状态 | ❌ | ✅ |
| 跨组件通信 | ✅ | ❌ |
| 逻辑复用 | ❌ | ✅ |
| DevTools 调试 | ✅ | ⚠️ 有限 |

> 💡 **经验法则**: 如果状态需要在多个不相关的组件中共享，用 Store；如果只是逻辑复用，用 Composable。

---

## 10. 练习任务

1. 创建 `settingsStore` 管理用户偏好设置
2. 实现 Store 状态持久化到 localStorage
3. 分析樱花笔记的 `stores/` 目录结构

---

## 参考资源

- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [Pinia 持久化插件](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- 樱花笔记源码: `stores/` 目录
