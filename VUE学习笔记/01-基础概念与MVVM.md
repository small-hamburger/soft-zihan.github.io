# 01. 基础概念：Vue 与 MVVM 🌸

Vue.js 是一套用于构建用户界面的 **渐进式 JavaScript 框架**。

## 为什么要用框架？

在原生 JS (Vanilla JS) 时代，我们这样写代码：

```javascript
// 1. 找到 DOM
const div = document.getElementById('app');
// 2. 修改数据
let count = 0;
// 3. 手动更新视图
div.innerText = count;

// 如果数据变了，我们必须记得手动再去改 innerText
btn.onclick = () => {
  count++;
  div.innerText = count; // 繁琐且容易遗漏
};
```

这种模式叫 **命令式编程 (Imperative)**。随着页面越来越复杂，手动操作 DOM 变得难以维护，且性能低下（因为频繁读写 DOM 是昂贵的操作）。

## Vue 的解决方案：MVVM

Vue 引入了 **MVVM (Model-View-ViewModel)** 架构，实现了 **数据驱动视图**。

1.  **Model (模型)**: 
    即 JS 中的数据对象。
    ```javascript
    const state = { count: 0 };
    ```

2.  **View (视图)**:
    即 HTML 模板。
    ```html
    <div>{{ state.count }}</div>
    ```

3.  **ViewModel (视图模型)**:
    Vue 的核心引擎。它像一个“观察者”。
    - 它**监听** Model 的变化。
    - 一旦 Model 变了，它**自动**更新 View。
    - 我们不需要手动写 `div.innerText = ...`。

这被称为 **声明式编程 (Declarative)**。你只需要声明“这个变量绑定这里”，剩下的交给 Vue。

## 虚拟 DOM (Virtual DOM)

Vue 能够高效更新的秘密在于 **虚拟 DOM**。

- **真实 DOM**: 浏览器渲染的实际节点，极其沉重（包含数百个属性）。
- **虚拟 DOM**: Vue 在内存中用纯 JS 对象模拟的 DOM 树。
  ```javascript
  // 虚拟 DOM 大概长这样
  const vnode = {
    tag: 'div',
    props: { id: 'app' },
    children: [ textNode ]
  }
  ```

当数据变化时，Vue 会先生成新的虚拟 DOM，通过 **Diff 算法** 对比新旧虚拟 DOM 的差异，最后只把**真正变化的部分**更新到真实浏览器中。这极大地提高了性能。