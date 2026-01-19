# TypeScript 快速入门

> **对应实验室**: LabTypeScript  
> **涉及源文件**: types.ts, composables/*.ts, stores/*.ts

## 1. 为什么需要 TypeScript？

TypeScript 是 JavaScript 的超集，添加了**类型系统**。在 Sakura Notes 项目中，TS 帮助我们：

- 在编译时捕获错误，而不是运行时
- 提供更好的代码补全和文档
- 使重构更安全

### 本站实例：types.ts

```typescript
// 📍 types.ts
export type NodeType = 'file' | 'directory'  // 字面量联合类型

export interface FileNode {
  name: string          // 必需属性
  path: string
  type: NodeType
  children?: FileNode[] // 可选属性（?表示）
}
```

## 2. 基础类型注解

### 2.1 基本类型

```typescript
// 显式类型注解
let count: number = 0
let name: string = 'Sakura'
let isActive: boolean = true
let items: string[] = ['a', 'b', 'c']

// 类型推断（TS 自动推断）
let count = 0          // 推断为 number
let name = 'Sakura'    // 推断为 string
```

### 2.2 联合类型

来自 `appStore.ts`:

```typescript
// 📍 stores/appStore.ts
const lang = ref<'en' | 'zh'>('zh')  // 只能是 'en' 或 'zh'

// 错误示例：
// lang.value = 'fr'  // ❌ 类型错误！
```

### 2.3 函数类型

```typescript
// 📍 composables/useFile.ts
async function fetchFileContent(file: FileNode): Promise<string> {
  // 参数类型: FileNode
  // 返回类型: Promise<string>
  const response = await fetch(`/notes/${file.path}`)
  return await response.text()
}
```

## 3. 接口与类型别名

### 3.1 Interface（接口）

```typescript
// 📍 types.ts - 定义对象结构
export interface Track {
  id: string
  title: string
  artist: string
  src: string
  cover?: string  // 可选
}

// 使用接口
const track: Track = {
  id: '1',
  title: '你若三冬',
  artist: '兰音Reine',
  src: '/music/track1.mp3'
}
```

### 3.2 Type Alias（类型别名）

```typescript
// 类型别名可以定义联合类型、元组等
type NodeType = 'file' | 'directory'
type Point = [number, number]  // 元组

// Interface vs Type:
// - Interface 可以被扩展 (extends)
// - Type 更灵活，可以定义联合、交叉类型
```

## 4. 泛型基础

泛型让类型也能"参数化"：

```typescript
// 📍 Vue 中的 ref 就是泛型函数
import { ref, Ref } from 'vue'

// 不使用泛型 - TS 自动推断
const count = ref(0)  // Ref<number>

// 显式指定泛型
const list = ref<string[]>([])  // Ref<string[]>

// 复杂类型必须显式指定
const user = ref<{ name: string; age: number } | null>(null)
```

### 本站实例

```typescript
// 📍 stores/musicStore.ts
const currentTrack = ref<Track | null>(null)  // 可能为 null

// 📍 composables/useSearch.ts
const searchResults = ref<SearchResult[]>([])  // 搜索结果数组
```

## 5. 在 Vue 3 中使用 TypeScript

### 5.1 defineProps 类型

```typescript
// 📍 组件 Props 类型定义
<script setup lang="ts">
interface Props {
  file: FileNode
  isActive?: boolean  // 可选 prop
}

const props = defineProps<Props>()
// 或带默认值
const props = withDefaults(defineProps<Props>(), {
  isActive: false
})
</script>
```

### 5.2 defineEmits 类型

```typescript
// 📍 事件类型定义
<script setup lang="ts">
const emit = defineEmits<{
  'update': [value: string]      // 带参数的事件
  'close': []                    // 无参数事件
  'select': [file: FileNode]
}>()

emit('select', selectedFile)  // ✅ 类型安全
</script>
```

## 6. 常见类型工具

```typescript
// Partial - 所有属性变为可选
type PartialTrack = Partial<Track>

// Required - 所有属性变为必需
type RequiredTrack = Required<Track>

// Pick - 选取部分属性
type TrackBasic = Pick<Track, 'id' | 'title'>

// Omit - 排除部分属性
type TrackWithoutId = Omit<Track, 'id'>
```

---

## 🧪 动手实验

本章节对应实验室：**LabTypeScript**

完成以下练习：
1. [ ] 在实验室中修改类型定义，观察错误提示
2. [ ] 尝试为函数添加类型注解
3. [ ] 理解泛型 `ref<T>` 的使用场景

---

## 📚 扩展阅读

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Vue 3 + TypeScript 指南](https://vuejs.org/guide/typescript/overview.html)
