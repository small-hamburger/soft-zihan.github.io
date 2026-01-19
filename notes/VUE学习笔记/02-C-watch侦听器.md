# watch 侦听器

> **对应实验室**: LabReactivity  
> **涉及源文件**: App.vue, stores/appStore.ts, composables/*.ts

## 1. 什么是侦听器？

侦听器用于**在响应式数据变化时执行副作用**，比如发请求、操作 DOM、写日志等。

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// 侦听 count 的变化
watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变成了 ${newValue}`)
})
</script>
```

## 2. watch vs computed

| 特性 | computed | watch |
|------|----------|-------|
| 用途 | 派生值 | 副作用 |
| 返回值 | 有 | 无 |
| 缓存 | 有 | 无 |
| 异步 | ❌ 不支持 | ✅ 支持 |

```typescript
// computed：计算派生值
const fullName = computed(() => first.value + ' ' + last.value)

// watch：执行副作用
watch(lang, async (newLang) => {
  await loadTranslations(newLang)  // 异步操作
  localStorage.setItem('lang', newLang)  // 存储
})
```

## 3. 侦听来源

### 3.1 侦听 ref

```typescript
const count = ref(0)

watch(count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
```

### 3.2 侦听 getter 函数

```typescript
const state = reactive({ count: 0 })

// 侦听 reactive 对象的属性
watch(
  () => state.count,  // getter 函数
  (newVal) => console.log(newVal)
)
```

### 3.3 侦听多个来源

```typescript
const firstName = ref('樱花')
const lastName = ref('笔记')

watch(
  [firstName, lastName],  // 数组
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(`${oldFirst} ${oldLast} → ${newFirst} ${newLast}`)
  }
)
```

## 4. 本站实例

### 4.1 主题切换持久化

```typescript
// 📍 stores/appStore.ts
const isDark = ref(false)

// 侦听主题变化，保存到 localStorage
watch(isDark, (newVal) => {
  localStorage.setItem('theme', newVal ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', newVal)
})
```

### 4.2 语言切换时重新加载

```typescript
// 📍 App.vue
const { lang } = useAppStore()

watch(lang, async (newLang) => {
  // 语言变化时重新初始化搜索索引
  await initSearchIndex(fileSystem.value, newLang)
})
```

### 4.3 搜索查询防抖

```typescript
// 📍 composables/useSearch.ts
const searchQuery = ref('')

watch(searchQuery, (query) => {
  // 每次输入变化都执行搜索
  performSearch(query)
}, { 
  // 可选配置
  immediate: false,  // 是否立即执行
})
```

## 5. watchEffect

`watchEffect` 会**自动追踪依赖**，无需显式指定侦听源：

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('樱花')

// 自动追踪回调中使用的所有响应式数据
watchEffect(() => {
  console.log(`count: ${count.value}, name: ${name.value}`)
  // 自动追踪 count 和 name
})

// 等价于：
watch([count, name], ([c, n]) => {
  console.log(`count: ${c}, name: ${n}`)
}, { immediate: true })
```

### 本站实例

```typescript
// 📍 MusicPlayer 音量同步
watchEffect(() => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value
  }
})
```

## 6. 侦听选项

```typescript
watch(source, callback, {
  immediate: true,   // 立即执行一次
  deep: true,        // 深度侦听（对象内部变化）
  flush: 'post',     // 回调时机：'pre' | 'post' | 'sync'
  once: true,        // 只触发一次（Vue 3.4+）
})
```

### 深度侦听

```typescript
const state = reactive({
  user: {
    name: '樱花',
    settings: { theme: 'dark' }
  }
})

// 默认只侦听第一层
watch(() => state.user, () => {})  // settings.theme 变化不触发

// 深度侦听：任何嵌套属性变化都触发
watch(() => state.user, () => {}, { deep: true })
```

## 7. 停止侦听

```typescript
const stop = watch(count, () => {
  console.log('count changed')
})

// 停止侦听
stop()
```

### 异步获取数据示例

```typescript
// 📍 组件加载时获取数据
const articleId = ref('123')
const article = ref(null)

watch(articleId, async (id) => {
  article.value = await fetchArticle(id)
}, { immediate: true })
```

## 8. watch vs watchEffect 选择

| 场景 | 推荐 |
|------|------|
| 需要访问旧值 | `watch` |
| 需要精确控制依赖 | `watch` |
| 简单副作用，依赖明确 | `watchEffect` |
| 需要立即执行 | `watchEffect` 或 `watch + immediate` |

---

## 🧪 动手实验

本章节对应实验室：**LabReactivity**

完成以下练习：
1. [ ] 使用 watch 侦听主题变化
2. [ ] 使用 watchEffect 实现自动追踪
3. [ ] 理解 deep 选项的作用

---

## 📝 小结

```typescript
// 基础用法
watch(source, (newVal, oldVal) => { ... })

// 多来源
watch([a, b], ([newA, newB], [oldA, oldB]) => { ... })

// 自动追踪
watchEffect(() => { ... })

// 带选项
watch(source, callback, { immediate: true, deep: true })
```
