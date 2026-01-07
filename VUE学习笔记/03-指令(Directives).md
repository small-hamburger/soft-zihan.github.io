# 03. 模板指令 (Directives) 🌸

指令是 Vue 模板语法的核心，它们带有 `v-` 前缀，负责将 JS 的逻辑映射到 HTML 上。

## 1. 条件渲染

### v-if vs v-show (面试必问)

*   **v-if="false"**: 
    **销毁**。元素在 DOM 中完全不存在。
    *优点*：初始渲染快（因为不渲染）。
    *缺点*：切换时开销大（因为要重复创建/销毁 DOM）。

*   **v-show="false"**:
    **隐藏**。元素在 DOM 中存在，只是 `display: none`。
    *优点*：切换开销极小。
    *缺点*：初始渲染开销大。

**场景**：
- 频繁切换（如手风琴菜单、Tab页）：用 `v-show`。
- 只有一次判断（如用户权限、登录状态）：用 `v-if`。

## 2. 列表渲染 (v-for)

```html
<li v-for="item in list" :key="item.id">
  {{ item.name }}
</li>
```

### 为什么必须加 :key？

这是 Vue 虚拟 DOM Diff 算法的要求。
想象你有一个列表 `[A, B, C, D]`。如果你删除了 B，变成了 `[A, C, D]`。

- **没有 key**：Vue 会看，“哦，第二个变成了C，第三个变成了D，第四个没了”。它会**修改**第二个和第三个 DOM 的内容，然后删除第四个 DOM。这很低效。
- **有 key**：Vue 会看，“哦，key=B 的那个没了，key=C 和 key=D 的还在”。它直接把 B 的 DOM 删掉，C 和 D 甚至不用动。

**结论**：`key` 必须是唯一的 id，**千万不要用 index (数组下标) 作为 key**，否则会导致渲染错误。

## 3. 双向绑定 (v-model)

`v-model` 是语法糖，用于表单元素。

```html
<input v-model="text" />
```

等价于：

```html
<input 
  :value="text" 
  @input="event => text = event.target.value" 
/>
```

它实现了数据与视图的双向同步。