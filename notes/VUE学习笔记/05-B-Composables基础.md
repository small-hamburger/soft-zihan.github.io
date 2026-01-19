# 05-B. Composables 组合式函数基础 🧩

> **学习目标**: 理解 Composables 的概念，学会将逻辑抽离为可复用的函数。  
> **实践基地**: [🧪 Composables 实验室](../../../)

## 1. 什么是 Composables？

Composables（组合式函数）是利用 Vue 组合式 API 来封装和复用**有状态逻辑**的函数。

### 命名约定

- 以 `use` 开头
- 使用驼峰命名
- 例如：`useCounter`, `useMouse`, `useLocalStorage`

### 简单示例

```javascript
// composables/useCounter.ts
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

使用：

```vue
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement, reset } = useCounter(10)
</script>

<template>
  <div>
    <p>计数: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">重置</button>
  </div>
</template>
```

---

## 2. 为什么需要 Composables？

### 问题：Options API 的逻辑分散

```javascript
// ❌ Options API: 相同功能的代码被拆散
export default {
  data() {
    return {
      // 鼠标追踪
      x: 0, y: 0,
      // 计数器
      count: 0,
      // 其他...
    }
  },
  methods: {
    // 鼠标追踪
    updateMouse(e) { this.x = e.pageX; this.y = e.pageY },
    // 计数器
    increment() { this.count++ },
    // 其他...
  },
  mounted() {
    // 鼠标追踪
    window.addEventListener('mousemove', this.updateMouse)
  },
  unmounted() {
    // 鼠标追踪
    window.removeEventListener('mousemove', this.updateMouse)
  }
}
```

### 解决方案：Composables 按功能组织

```javascript
// ✅ Composition API: 相同功能的代码聚合
import { useMouse } from './useMouse'
import { useCounter } from './useCounter'

// 每个功能都是独立的、可复用的
const { x, y } = useMouse()
const { count, increment } = useCounter()
```

---

## 3. Composables vs Mixins

| 特性 | Composables | Mixins |
|------|-------------|--------|
| 命名冲突 | ❌ 不会（显式导入） | ⚠️ 可能（隐式合并） |
| 来源清晰 | ✅ 清楚知道来自哪里 | ❌ 不清楚 |
| 类型支持 | ✅ 完美 TypeScript 支持 | ⚠️ 类型推导困难 |
| 复用方式 | 函数调用 | 对象合并 |

---

## 4. 核心模式

### 4.1 封装响应式状态

```javascript
// composables/useToggle.ts
import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const state = ref(initialValue)
  
  const toggle = () => state.value = !state.value
  const setTrue = () => state.value = true
  const setFalse = () => state.value = false
  
  return {
    state,
    toggle,
    setTrue,
    setFalse
  }
}
```

### 4.2 封装副作用（生命周期）

```javascript
// composables/useEventListener.ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  onMounted(() => {
    target.addEventListener(event, callback)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, callback)
  })
}
```

### 4.3 封装异步操作

```javascript
// composables/useFetch.ts
import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)
  
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url.value)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  watchEffect(() => {
    fetchData()
  })
  
  return { data, error, loading, refetch: fetchData }
}
```

---

## 5. 樱花笔记中的真实案例

### 5.1 useFile - 文件操作

```javascript
// composables/useFile.ts
export function useFile() {
  const files = ref<FileNode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const loadFiles = async () => {
    loading.value = true
    try {
      const response = await fetch('/files.json')
      files.value = await response.json()
    } catch (e) {
      error.value = '加载失败'
    } finally {
      loading.value = false
    }
  }
  
  const findFile = (path: string) => {
    // 递归搜索...
  }
  
  return {
    files,
    loading,
    error,
    loadFiles,
    findFile
  }
}
```

### 5.2 useSearch - 搜索功能

```javascript
// composables/useSearch.ts
export function useSearch(files: Ref<FileNode[]>) {
  const query = ref('')
  const results = ref<SearchResult[]>([])
  
  // 使用 computed 响应式过滤
  const filteredResults = computed(() => {
    if (!query.value) return []
    return searchFiles(files.value, query.value)
  })
  
  // 使用 watchDebounced 防抖
  watchDebounced(
    query,
    async (newQuery) => {
      results.value = await performSearch(newQuery)
    },
    { debounce: 300 }
  )
  
  return {
    query,
    results: filteredResults
  }
}
```

### 5.3 useMarkdown - Markdown 解析

```javascript
// composables/useMarkdown.ts
export function useMarkdown() {
  const html = ref('')
  const headings = ref<Heading[]>([])
  
  const parse = (content: string) => {
    const result = marked.parse(content)
    html.value = result
    headings.value = extractHeadings(content)
  }
  
  return {
    html,
    headings,
    parse
  }
}
```

---

## 6. 最佳实践

### 6.1 返回值使用 ref 而非 reactive

```javascript
// ✅ 推荐: 返回 ref
export function useCounter() {
  const count = ref(0)
  return { count }  // 解构后仍保持响应式
}

// ❌ 避免: 返回 reactive 会失去响应式
export function useCounter() {
  const state = reactive({ count: 0 })
  return { ...state }  // 解构后失去响应式！
}
```

### 6.2 接受 ref 作为参数

```javascript
// ✅ 可以接受 ref 或普通值
export function useTitle(title) {
  const titleRef = ref(title)  // 自动转换
  
  watchEffect(() => {
    document.title = unref(titleRef)
  })
}

// 两种方式都可以
useTitle('静态标题')
useTitle(ref('响应式标题'))
```

### 6.3 清理副作用

```javascript
export function useInterval(callback, delay) {
  const intervalId = ref<number | null>(null)
  
  const start = () => {
    intervalId.value = setInterval(callback, delay)
  }
  
  const stop = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }
  
  // 组件卸载时自动清理
  onUnmounted(stop)
  
  return { start, stop }
}
```

---

## 7. 组织结构

```
composables/
├── index.ts          # 统一导出
├── useFile.ts        # 文件操作
├── useSearch.ts      # 搜索功能
├── useMarkdown.ts    # Markdown 解析
├── useWallpapers.ts  # 壁纸管理
└── useLocalStorage.ts # 本地存储
```

```javascript
// composables/index.ts
export * from './useFile'
export * from './useSearch'
export * from './useMarkdown'
// ...
```

使用时：

```javascript
import { useFile, useSearch } from '@/composables'
```

---

## 8. 练习任务

1. 创建 `useLocalStorage` - 封装 localStorage 操作
2. 创建 `useDarkMode` - 封装主题切换逻辑
3. 创建 `useDebounce` - 封装防抖功能

---

## 参考资源

- [Vue 官方 - 组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)
- [VueUse](https://vueuse.org/) - 实用 Composables 库
- 樱花笔记源码: `composables/` 目录
