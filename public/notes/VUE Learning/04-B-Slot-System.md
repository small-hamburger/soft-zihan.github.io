# 04-B. Slot System 🎁

> **Learning Goal**: Master the three levels of slots (default, named, scoped) and become proficient at component reuse.  
> **Lab**: [🎁 Slot System Lab](../../../)

## 1. What Are Slots? Why Do We Need Them?

In reality, some components are **generic**. For example:

- 📦 Box component - needs to hold different things (text, images, buttons)
- 🎴 Card component - needs to display different content
- 🏠 Page layout - needs different main content

Without slots, we'd need to create new components for every case:

```vue
<!-- ❌ Bad: Creating duplicates -->
<TextCard />
<ImageCard />
<ButtonCard />
```

But with slots, one component handles all cases!

---

## 2. Default Slot

### Concept

A slot is like a **placeholder** in a component. The parent component tells the child: "Put my content here."

### Child Component Defines Slot

```vue
<!-- Card.vue - Child Component -->
<template>
  <div class="card">
    <h2 class="card-title">Card Title</h2>
    
    <!-- This is the slot: parent can put content here -->
    <slot></slot>
    
    <div class="card-footer">Footer</div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
```

### Parent Component Uses Slot

```vue
<!-- Parent.vue - Parent Component -->
<template>
  <div>
    <!-- Content inside <Card> tags gets inserted into child's <slot> -->
    <Card>
      <p>This is my content</p>
      <button>My button</button>
    </Card>
  </div>
</template>

<script setup>
import Card from './Card.vue';
</script>
```

### Result

```
┌─────────────────────┐
│  Card Title         │
├─────────────────────┤
│ This is my content  │
│ My button           │
├─────────────────────┤
│  Footer             │
└─────────────────────┘
```

### Default Content

You can provide fallback content if the parent doesn't fill the slot:

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <slot>
      <!-- This shows if parent provides nothing -->
      <p>No content provided</p>
    </slot>
  </div>
</template>
```

---

## 3. Named Slots

When a component has **multiple areas** needing slots, use named slots to distinguish them.

### Scenario: User Profile Card

We need three areas: **header**, **content**, **footer**.

### Child Component Defines Named Slots

```vue
<!-- UserProfile.vue -->
<template>
  <div class="profile">
    <!-- Header slot -->
    <div class="header">
      <slot name="header">
        <p>Default header</p>
      </slot>
    </div>

    <!-- Content slot (unnamed = default) -->
    <div class="content">
      <slot>
        <p>Default content</p>
      </slot>
    </div>

    <!-- Footer slot -->
    <div class="footer">
      <slot name="footer">
        <p>Default footer</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.profile {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  background: #f5f5f5;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.content {
  padding: 20px;
}

.footer {
  background: #f5f5f5;
  padding: 20px;
  border-top: 1px solid #ddd;
}
</style>
```

### Parent Component Uses Named Slots

```vue
<!-- Parent.vue -->
<template>
  <UserProfile>
    <!-- Use template and #slot-name to specify where content goes -->
    
    <template #header>
      <h2>👨‍💻 John Doe</h2>
      <p>Vue Developer</p>
    </template>

    <!-- Default slot (no name needed) -->
    <template #default>
      <p>I'm passionate about frontend development.</p>
      <p>Focused on Vue and React.</p>
    </template>

    <template #footer>
      <button>Follow</button>
      <button>Message</button>
    </template>
  </UserProfile>
</template>

<script setup>
import UserProfile from './UserProfile.vue';
</script>
```

### Shorthand Syntax

If you only have the default slot, you can write content directly:

```vue
<!-- Shorthand -->
<Card>
  <p>Write directly here</p>
</Card>

<!-- Equivalent to -->
<Card>
  <template #default>
    <p>Write directly here</p>
  </template>
</Card>
```

---

## 4. Scoped Slots

Scoped slots are special: **the child component can pass data to the parent component**.

### Scenario: List Rendering

Imagine a list component with a fruits array, but how each fruit displays is decided by the **parent**.

### Child Component Defines Scoped Slot

```vue
<!-- FruitList.vue -->
<template>
  <div class="list">
    <!-- Iterate through fruits -->
    <div v-for="(fruit, index) in fruits" :key="index" class="item">
      <!-- Pass data to parent via attributes -->
      <slot 
        :fruit="fruit" 
        :index="index"
        :isEven="index % 2 === 0"
      >
        <!-- Default display -->
        {{ index + 1 }}. {{ fruit.name }}
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fruits = ref([
  { name: 'Apple', icon: '🍎', price: 5 },
  { name: 'Banana', icon: '🍌', price: 3 },
  { name: 'Grapes', icon: '🍇', price: 8 },
  { name: 'Orange', icon: '🍊', price: 4 }
]);
</script>
```

### Parent Component Receives Scoped Slot Data

```vue
<!-- Parent.vue -->
<template>
  <FruitList>
    <!-- Receive data via #default="{ fruit, index, isEven }" -->
    <template #default="{ fruit, index, isEven }">
      <div 
        class="fruit-item"
        :class="{ 'even-row': isEven }"
      >
        <span class="fruit-icon">{{ fruit.icon }}</span>
        <span class="fruit-name">{{ fruit.name }}</span>
        <span class="fruit-price">${{ fruit.price }}</span>
      </div>
    </template>
  </FruitList>
</template>

<script setup>
import FruitList from './FruitList.vue';
</script>

<style scoped>
.fruit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
}

.even-row {
  background: #f5f5f5;
}
</style>
```

### Real Example: Flexible Table

```vue
<!-- DataTable.vue - Generic table component -->
<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="col">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td v-for="col in columns" :key="col">
          <!-- Let parent decide how to display each cell -->
          <slot 
            :name="`cell-${col}`" 
            :value="item[col]"
            :item="item"
          >
            {{ item[col] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps<{
  columns: string[];
  data: Array<Record<string, any>>;
}>();
</script>
```

Using the generic table:

```vue
<DataTable :columns="['name', 'status', 'action']" :data="users">
  <!-- Customize name column -->
  <template #cell-name="{ value }">
    <strong>{{ value }}</strong>
  </template>

  <!-- Customize status column -->
  <template #cell-status="{ value }">
    <span :class="{ 'text-green': value === 'active' }">
      {{ value }}
    </span>
  </template>

  <!-- Customize action column -->
  <template #cell-action="{ item }">
    <button @click="edit(item)">Edit</button>
  </template>
</DataTable>
```

---

## 5. Slot Types Comparison

| Type | Usage | Scenario |
|------|-------|----------|
| **Default Slot** | `<slot></slot>` | Single content area |
| **Named Slot** | `<slot name="header"></slot>` | Multiple areas (layout) |
| **Scoped Slot** | `<slot :data="item"></slot>` | Child → Parent data passing |

---

## 6. Common Errors & Best Practices

### ❌ Error 1: Forgetting template tag

```vue
<!-- ❌ Wrong: directly write in named slot -->
<Card>
  #header
  <h1>Title</h1>
</Card>

<!-- ✅ Correct -->
<Card>
  <template #header>
    <h1>Title</h1>
  </template>
</Card>
```

### ❌ Error 2: Confusing old vs new syntax

```vue
<!-- ❌ Old syntax (deprecated) -->
<template slot="header">...</template>

<!-- ✅ New syntax -->
<template #header>...</template>
```

### ✅ Best Practice: Use descriptive names

```vue
<!-- ❌ Unclear -->
<slot name="a"></slot>
<slot name="b"></slot>

<!-- ✅ Clear -->
<slot name="header"></slot>
<slot name="content"></slot>
<slot name="footer"></slot>
```

---

## 7. Why Use Slots?

### Increases Component Reusability

```vue
<!-- Same Card shows different content -->
<Card>
  <img src="..." />
</Card>

<Card>
  <video src="..."></video>
</Card>

<Card>
  <form>...</form>
</Card>
```

### Flexible Layouts

```vue
<!-- Parent controls Card's internal structure -->
<Card>
  <div class="custom-layout">
    <span>Custom layout</span>
  </div>
</Card>
```

### Avoids Props Explosion

```vue
<!-- ❌ Bad: too many props -->
<ImageCard 
  :title="title"
  :description="description"
  :imageUrl="url"
  :footerText="text"
/>

<!-- ✅ Better: use slots -->
<Card>
  <template #header>{{ title }}</template>
  <img :src="url" />
  <template #footer>{{ text }}</template>
</Card>
```

---

## 8. Summary

| Concept | Definition | Syntax |
|---------|-----------|--------|
| **Default Slot** | Content placeholder | `<slot></slot>` |
| **Named Slot** | Multiple named slots | `<slot name="x"></slot>` |
| **Scoped Slot** | Pass data to parent | `<slot :prop="value"></slot>` |
| **Slot Content** | What parent fills in | `<template #name>...</template>` |

---

## 📚 Further Reading

- [Vue Official - Slots](https://vuejs.org/guide/components/slots.html)
- [Advanced Slot Patterns](https://vuejs.org/guide/components/slots.html#render-function-slots)

## 🧪 Practice

Open [🎁 Slot System Lab](../../../) for interactive learning!

