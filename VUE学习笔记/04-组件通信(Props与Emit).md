# 04. 组件通信：Props 与 Emit 🌸

Vue 采用 **单向数据流**。

## 1. 父传子：Props

Props 是父组件传递给子组件的数据。

```javascript
// 子组件
defineProps({
  msg: String
})
```

**只读原则**：子组件**绝对不可以**修改 Props。
为什么？因为 Props 是父组件的数据。如果子组件偷偷改了，父组件并不知道，会导致数据状态难以追踪。

## 2. 子传父：Emit

如果子组件想改数据怎么办？它必须**派发事件 (Emit)** 通知父组件。

```javascript
// 子组件
const emit = defineEmits(['update']);
function change() {
  emit('update', '新数据'); // 发射信号
}
```

```html
<!-- 父组件 -->
<Child @update="handleUpdate" />
```

这就像是：
- Props 是老板（父）给员工（子）下达的任务。
- Emit 是员工（子）做完任务后，给老板（父）写的日报。

## 3. 跨级通信：Provide / Inject

如果组件层级很深（爷爷 -> 父亲 -> 孙子），一层层传 Props 很麻烦（这叫 Props Drilling）。
Vue 提供了 `provide` 和 `inject`。

- 爷爷组件：`provide('theme', 'dark')`
- 孙子组件：`const theme = inject('theme')`

这在开发插件或全局配置（如换肤）时非常有用。