# computed 计算属性

> **对应实验室**: LabReactivity  
> **涉及源文件**: appStore.ts, composables/useSearch.ts

## 1. 什么是计算属性？

计算属性是**基于响应式依赖进行缓存**的派生值。只有当依赖变化时才会重新计算。

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('樱花')
const lastName = ref('笔记')

// 计算属性：自动追踪 firstName 和 lastName
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
</script>

<template>
  <p>{{ fullName }}</p>  <!-- 樱花 笔记 -->
</template>
```

## 2. computed vs 普通函数

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)

// ❌ 普通函数：每次访问都会执行
function getDoubleCount() {
  console.log('函数执行了')
  return count.value * 2
}

// ✅ 计算属性：只在 count 变化时执行
const doubleCount = computed(() => {
  console.log('计算属性执行了')
  return count.value * 2
})
</script>

<template>
  <!-- 每次渲染都会调用函数 3 次 -->
  <p>{{ getDoubleCount() }}</p>
  <p>{{ getDoubleCount() }}</p>
  <p>{{ getDoubleCount() }}</p>
  
  <!-- 计算属性只计算 1 次，后续使用缓存 -->
  <p>{{ doubleCount }}</p>
  <p>{{ doubleCount }}</p>
  <p>{{ doubleCount }}</p>
</template>
```

**关键区别**：
- 普通函数：每次访问都执行
- computed：缓存结果，依赖不变就不重新计算

## 3. 本站实例

### 3.1 国际化翻译 (appStore.ts)

```typescript
// 📍 stores/appStore.ts
import { ref, computed } from 'vue'
import { I18N } from '../constants'

export const useAppStore = defineStore('app', () => {
  const lang = ref<'en' | 'zh'>('zh')
  
  // 计算属性：自动追踪 lang 变化
  const t = computed(() => I18N[lang.value])
  
  // 当 lang.value 改变时，t 自动更新
  // 当 lang.value 不变时，t 使用缓存值
  
  return { lang, t }
})
```

### 3.2 搜索结果判断 (useSearch.ts)

```typescript
// 📍 composables/useSearch.ts
export function useSearch() {
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  
  // 计算属性：判断是否有结果
  const hasResults = computed(() => searchResults.value.length > 0)
  
  // 计算属性：结果数量
  const resultCount = computed(() => searchResults.value.length)
  
  return { searchQuery, searchResults, hasResults, resultCount }
}
```

### 3.3 文件过滤

```typescript
// 📍 根据类型过滤文件
const files = ref<FileNode[]>([...])
const showOnlyMarkdown = ref(false)

const filteredFiles = computed(() => {
  if (!showOnlyMarkdown.value) return files.value
  return files.value.filter(f => f.name.endsWith('.md'))
})
```

## 4. 可写计算属性

计算属性默认是只读的，但可以创建可写的：

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('樱花')
const lastName = ref('笔记')

// 可写的计算属性
const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    // 解析输入并更新源数据
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

// 现在可以赋值了
fullName.value = '新的 名字'
// firstName.value === '新的'
// lastName.value === '名字'
</script>
```

## 5. 最佳实践

### ✅ 应该用 computed 的场景

```typescript
// 1. 依赖其他响应式数据的派生值
const fullName = computed(() => first.value + ' ' + last.value)

// 2. 列表过滤/排序
const sortedList = computed(() => 
  [...items.value].sort((a, b) => a.date - b.date)
)

// 3. 格式化显示
const formattedPrice = computed(() => 
  '¥' + price.value.toFixed(2)
)
```

### ❌ 不应该用 computed 的场景

```typescript
// 1. 有副作用的操作（应该用 watch）
const bad = computed(() => {
  fetch('/api')  // ❌ 不要在 computed 中发请求
  return data.value
})

// 2. 不依赖响应式数据
const bad = computed(() => {
  return Math.random()  // ❌ 没有响应式依赖
})
```

## 6. 依赖追踪原理

```typescript
const count = ref(0)
const flag = ref(true)

const result = computed(() => {
  // Vue 追踪这里访问的所有响应式数据
  if (flag.value) {
    return count.value * 2  // 依赖：flag, count
  }
  return 'N/A'  // 只依赖：flag
})
```

当 `flag` 为 `true` 时，`result` 依赖 `flag` 和 `count`。
当 `flag` 为 `false` 时，`result` 只依赖 `flag`。

依赖会**动态追踪**！

---

## 🧪 动手实验

本章节对应实验室：**LabReactivity**

完成以下练习：
1. [ ] 在实验室中观察 computed 的依赖追踪
2. [ ] 修改 `lang` 观察 `t` 的自动更新
3. [ ] 对比 computed 和普通函数的执行次数

---

## 📝 小结

| 特性 | 说明 |
|------|------|
| **缓存** | 依赖不变则不重新计算 |
| **响应式** | 依赖变化时自动更新 |
| **只读** | 默认只读，可配置为可写 |
| **无副作用** | 不应包含异步或 DOM 操作 |
