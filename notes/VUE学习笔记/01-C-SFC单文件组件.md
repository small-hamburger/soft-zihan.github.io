# SFC 单文件组件

> **对应实验室**: LabCodeEvolution  
> **涉及源文件**: App.vue, components/*.vue

## 1. 什么是 SFC？

SFC（Single-File Component，单文件组件）是 Vue 特有的文件格式（`.vue`），它将组件的模板、逻辑和样式封装在一个文件中：

```vue
<!-- 📍 一个完整的 SFC 示例 -->
<template>
  <!-- HTML 模板 -->
  <button @click="count++">{{ count }}</button>
</template>

<script setup lang="ts">
// JavaScript/TypeScript 逻辑
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
/* CSS 样式（scoped 表示只作用于当前组件） */
button { background: pink; }
</style>
```

## 2. 三大块详解

### 2.1 `<template>` 模板块

```vue
<template>
  <!-- 必须有一个根元素（Vue 3 支持多根） -->
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>
```

- 每个 `.vue` 文件最多一个 `<template>`
- Vue 3 支持多个根节点（Fragment）
- 使用 Vue 模板语法（指令、插值等）

### 2.2 `<script setup>` 逻辑块

```vue
<script setup lang="ts">
// 推荐使用 <script setup> 语法糖
import { ref, computed, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 响应式状态
const count = ref(0)

// 计算属性
const doubled = computed(() => count.value * 2)

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})

// 所有顶层变量/函数自动暴露给模板
</script>
```

**`<script setup>` vs 普通 `<script>`**:
- 更少的样板代码
- 顶层变量自动暴露给模板
- 更好的 TypeScript 支持
- 更好的运行时性能

### 2.3 `<style>` 样式块

```vue
<!-- 普通样式（全局生效） -->
<style>
.button { color: red; }
</style>

<!-- Scoped 样式（仅当前组件） -->
<style scoped>
.button { color: red; }
/* 编译后: .button[data-v-7ba5bd90] { color: red; } */
</style>

<!-- 支持 CSS 预处理器 -->
<style lang="scss" scoped>
$primary: #ec4899;
.button {
  background: $primary;
  &:hover { opacity: 0.8; }
}
</style>
```

## 3. 本站实例解析

### 3.1 AppHeader.vue

```vue
<!-- 📍 components/AppHeader.vue 结构 -->
<template>
  <header class="fixed top-0 ...">
    <div class="flex items-center">
      <h1>{{ t.welcome_title }}</h1>
    </div>
    <nav>
      <button @click="openSearch">{{ t.search_title }}</button>
      <button @click="toggleTheme">🌙</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/appStore'

const { t, isDark, toggleTheme } = useAppStore()

const openSearch = () => {
  // 打开搜索模态框
}
</script>

<style scoped>
header {
  backdrop-filter: blur(10px);
}
</style>
```

### 3.2 组件组合

```vue
<!-- 📍 App.vue - 组合多个组件 -->
<template>
  <div :class="{ dark: isDark }">
    <!-- 导入并使用子组件 -->
    <AppHeader />
    <AppSidebar />
    <main>
      <ArticleCard 
        v-for="article in articles" 
        :key="article.path"
        :article="article"
      />
    </main>
    <MusicPlayer />
  </div>
</template>

<script setup lang="ts">
// 导入组件
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import ArticleCard from './components/ArticleCard.vue'
import MusicPlayer from './components/MusicPlayer.vue'

// 组件在 <script setup> 中导入后可直接在模板使用
</script>
```

## 4. Props 与 Emits

### 4.1 定义 Props

```vue
<script setup lang="ts">
// 类型定义方式（推荐）
interface Props {
  title: string
  count?: number  // 可选
}

const props = defineProps<Props>()

// 带默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

### 4.2 定义 Emits

```vue
<script setup lang="ts">
// 类型定义方式
const emit = defineEmits<{
  'update': [value: string]
  'close': []
}>()

// 触发事件
emit('update', 'new value')
emit('close')
</script>
```

## 5. 组件自动导入

可以配置 Vite 插件实现组件自动导入：

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Components({
      dirs: ['./components'],  // 自动扫描目录
      dts: true  // 生成类型声明
    })
  ]
}
```

配置后，组件无需手动 import 即可在模板中使用。

## 6. 组件命名约定

| 约定 | 示例 | 说明 |
|------|------|------|
| PascalCase 文件名 | `AppHeader.vue` | 推荐，与组件名一致 |
| PascalCase 使用 | `<AppHeader />` | 模板中使用 |
| kebab-case 使用 | `<app-header>` | 也支持，但不推荐 |

---

## 🧪 动手实验

本章节对应实验室：**LabCodeEvolution**

完成以下练习：
1. [ ] 观察 HTML → Vue SFC 的演进过程
2. [ ] 创建一个简单的 SFC 组件
3. [ ] 理解 `<script setup>` 的便利性

---

## 📝 小结

SFC 三大优势：
1. **关注点分离** - 模板、逻辑、样式各司其职
2. **封装性** - scoped 样式不会泄露
3. **开发体验** - 热更新、TypeScript 支持
