
# 05. 生命周期与网络请求 (Ajax) 🌸

> **学习目标**: 理解 Ajax 异步请求，掌握 Axios 的使用，理解 Vue 生命周期钩子 `mounted`。
> **参考教材**: [📖 Vue 生命周期](https://cn.vuejs.org/guide/essentials/lifecycle.html)

## 1. 什么是 Ajax？

*   **概念**: Asynchronous JavaScript And XML（异步 JavaScript 和 XML）。
*   **作用**: 在不刷新整个页面的情况下，与服务器交换数据并更新部分网页。
*   **实战**: 在 **Sakura Lab -> 网络与异步** 中，你可以看到“省-市-区”三级联动的全过程可视化。([LabAjax.vue](/components/LabAjax.vue))

## 2. Axios 与 Async / Await

Vue 生态推荐使用 Axios 来代替原生的 Ajax，并使用 `async/await` 来解决回调地狱。

**源码实战 ([components/LabAjax.vue](/components/LabAjax.vue))**:
在这个组件中，我们模拟了教材中的代码逻辑：

**回调地狱 (Callback Hell) 写法**:
```javascript
axios.get('/province').then(res => {
    const pid = res.data.id;
    axios.get(`/city?pid=${pid}`).then(res => {
        // 层层嵌套，代码难以维护...
    });
});
```

**Async / Await (优雅) 写法**:
```javascript
// async 声明异步函数
async function getData() {
    // await 等待请求完成
    const p = await axios.get('/province');
    const pid = p.data.id;
    
    // 代码看起来像同步一样清晰
    const c = await axios.get(`/city?pid=${pid}`);
}
```

## 3. 关键钩子：onMounted (mounted)

Vue 实例有一个完整的生命周期（创建 -> 挂载 -> 更新 -> 销毁）。
`onMounted` (对应 Vue 2 的 `mounted`) 是最常用的钩子。

*   **触发时机**: HTML 页面渲染完成，DOM 树已经生成。
*   **用途**: 发送初始化的 Ajax 请求。

**源码实战 ([App.vue](/App.vue))**:
我们的博客在加载时，需要去获取 `files.json` 文件列表：

```typescript
import { onMounted } from 'vue';

onMounted(async () => {
  try {
    // 页面挂载完成后，立即去服务器获取文件列表
    const res = await fetch('./files.json');
    fileSystem.value = await res.json();
  } catch (e) {
    console.error("加载失败");
  }
});
```

## 4. 总结

1.  **Ajax**: 让网页“局部刷新”，体验更丝滑。
2.  **Async/Await**: 让异步代码读起来像同步代码，拒绝回调地狱。
3.  **Mounted**: 就像 Java 中的构造函数或者初始块，是页面“出生”后执行的第一件事，适合用来加载数据。
