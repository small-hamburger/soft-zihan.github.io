# 02. 响应式原理：Ref 与 Reactive 🌸

在 Vue 3 中，我们通过 `ref` 和 `reactive` 来定义响应式数据。理解它们的区别，需要先理解 JavaScript 的数据类型。

## JavaScript 的前置知识

### 值类型 (Primitives)
包括：`Number`, `String`, `Boolean`。
它们存在栈内存中。
```javascript
let a = 10;
let b = a; 
b = 20;
// a 还是 10。修改 b 不会影响 a。
```

### 引用类型 (Reference)
包括：`Object`, `Array`。
它们存在堆内存中，变量只是一个指针。
```javascript
let objA = { count: 10 };
let objB = objA;
objB.count = 20;
// objA.count 也变成了 20！因为它们指向同一个对象。
```

## Vue 的响应式实现

Vue 3 使用 **ES6 Proxy** 来拦截对象的读写操作。

### 1. reactive()
`reactive` 直接利用 Proxy 代理一个对象。

```javascript
const user = reactive({ name: 'Alice' });
// 当我们读取 user.name 时，Proxy 的 get 方法被触发（Vue 收集依赖）
// 当我们修改 user.name 时，Proxy 的 set 方法被触发（Vue 通知视图更新）
```

**局限性**：Proxy 只能代理**对象**，不能代理基本类型（数字/字符串）。

### 2. ref()
为了让基本类型（如数字 `0`）也能变成响应式的，Vue 设计了 `ref`。
它就像一个包装盒（Wrapper），把基本类型装在一个对象的 `.value` 属性里。

```javascript
const count = ref(0);
// 实际上 count 是一个对象： { value: 0 }
```

这就是为什么在 script 中你需要写 `count.value`。
- 读 `count.value` -> 触发 getter -> 收集依赖
- 写 `count.value` -> 触发 setter -> 更新视图

## 总结

| 特性 | ref | reactive |
| :--- | :--- | :--- |
| **支持类型** | 所有类型 (基本+对象) | 仅对象 (Object/Array/Map) |
| **JS中访问** | 需要 `.value` | 直接访问 |
| **模板中访问** | 自动解包 (无需.value) | 直接访问 |
| **推荐场景** | **推荐默认使用** | 仅用于通过对象归类的一组状态 |