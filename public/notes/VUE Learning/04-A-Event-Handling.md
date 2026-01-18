# 04-A. Event Handling 🖱️

> **Learning Goal**: Understand Vue's event system, master @click syntax, event modifiers, and keyboard events.  
> **Lab**: [🧪 Event Handling Lab](../../../)

## 1. Why Event Handling?

Web applications are **interactive**. Users interact with pages through:

- Clicking buttons
- Typing text
- Pressing keys
- Moving the mouse

Vue needs to **listen** to these events and execute corresponding code.

### Traditional JavaScript (Verbose)

```javascript
// ❌ Old way
const button = document.getElementById('btn');
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
```

### Vue's Way (Clean)

```vue
<!-- ✅ Vue way -->
<template>
  <button @click="handleClick">Click me</button>
</template>

<script setup>
const handleClick = () => {
  console.log('Button clicked!');
};
</script>
```

---

## 2. Basic: @click Binding

### Syntax

Vue uses `@event-name` to listen to events. The most common is `@click`.

```vue
<template>
  <!-- Call method -->
  <button @click="increment">Count: {{ count }}</button>
  
  <!-- With arguments -->
  <button @click="add(5)">Add 5</button>
  
  <!-- Access event object -->
  <button @click="handleEvent($event)">Get event</button>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const add = (n) => {
  count.value += n;
};

const handleEvent = (event) => {
  console.log(event); // PointerEvent object
  console.log(event.target); // Clicked element
};
</script>
```

### Common Mistake

```vue
<!-- ❌ Wrong: forget parentheses -->
<button @click="increment">{{ count }}</button>

<!-- ✅ Correct -->
<button @click="increment()">{{ count }}</button>
```

---

## 3. Event Modifiers

Vue provides **event modifiers** to simplify common event handling scenarios.

### Common Modifiers

| Modifier | Effect | JS Equivalent |
|----------|--------|-------------------|
| `.stop` | Prevent event propagation (bubbling) | `event.stopPropagation()` |
| `.prevent` | Prevent default behavior | `event.preventDefault()` |
| `.once` | Execute only once | Manual flag needed |
| `.self` | Trigger only on the element itself | Check `event.target` manually |

### Example 1: Prevent Event Bubbling (.stop)

```vue
<template>
  <div @click="parentClick" class="parent">
    Parent clicked: {{ parentCount }}
    
    <!-- Without .stop -->
    <button @click="childClick" class="child">
      Child button (bubbles)
    </button>
    
    <!-- With .stop -->
    <button @click.stop="childClickStop" class="child">
      Child button (doesn't bubble) ✅
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const parentCount = ref(0);

const parentClick = () => {
  parentCount.value++;
};

const childClick = () => {
  console.log('Child clicked, event bubbles to parent');
};

const childClickStop = () => {
  console.log('Child clicked, event does NOT bubble');
};
</script>
```

**Behavior**:
- Click "Child button (bubbles)" → Parent counter increases ↑
- Click "Child button (doesn't bubble)" → Parent counter stays same ✅

### Example 2: Prevent Default Behavior (.prevent)

```vue
<template>
  <!-- Link won't navigate -->
  <a href="https://example.com" @click.prevent="handleLinkClick">
    Click won't navigate
  </a>
  
  <!-- Form won't submit -->
  <form @submit.prevent="handleSubmit">
    <input type="text" v-model="formData" />
    <button type="submit">Submit (no page refresh)</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref('');

const handleLinkClick = () => {
  console.log('Link clicked, but no navigation');
};

const handleSubmit = () => {
  console.log('Form submitted, data:', formData.value);
};
</script>
```

### Example 3: Execute Only Once (.once)

```vue
<template>
  <!-- Button can only be clicked once -->
  <button @click.once="init">
    Initialize (click only once)
  </button>
</template>

<script setup>
const init = () => {
  console.log('Initialization complete!');
  // Further clicks won't do anything
};
</script>
```

### Chaining Modifiers

```vue
<template>
  <!-- Prevent default, stop bubbling, execute once -->
  <form @submit.prevent.stop.once="specialSubmit">
    ...
  </form>
</template>
```

---

## 4. Keyboard Events

Triggered when user presses keys on the keyboard.

### Basic Syntax

```vue
<template>
  <!-- Listen to any key -->
  <input @keydown="handleKeydown" placeholder="Press any key" />
  
  <!-- Listen only to Enter -->
  <input @keyup.enter="handleEnter" placeholder="Press Enter" />
  
  <!-- Listen only to ESC -->
  <input @keyup.esc="handleEsc" placeholder="Press ESC" />
</template>

<script setup>
const handleKeydown = (event) => {
  console.log('Key pressed:', event.key);
};

const handleEnter = (event) => {
  console.log('Enter pressed');
};

const handleEsc = (event) => {
  console.log('ESC pressed');
};
</script>
```

### Common Keyboard Modifiers

| Modifier | Corresponding Key |
|----------|-------------------|
| `.enter` | Enter (Return) |
| `.tab` | Tab |
| `.esc` | ESC |
| `.space` | Space |
| `.delete` | Delete / Backspace |
| `.up` / `.down` / `.left` / `.right` | Arrow keys |

### Real Example: Search Box

```vue
<template>
  <div>
    <input 
      v-model="searchText" 
      @keyup.enter="search"
      @keyup.esc="searchText = ''"
      placeholder="Search (Enter to search, ESC to clear)"
    />
    <p v-if="searchResult">Result: {{ searchResult }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchText = ref('');
const searchResult = ref('');

const search = () => {
  searchResult.value = `Searched for: "${searchText.value}"`;
};
</script>
```

---

## 5. Mouse Events

### Common Mouse Events

```vue
<template>
  <div 
    @click="handleClick"
    @dblclick="handleDblClick"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    class="interactive-box"
  >
    Try different mouse operations on this box
  </div>
</template>

<script setup>
const handleClick = () => console.log('click');
const handleDblclick = () => console.log('double click');
const handleMouseDown = () => console.log('mouse down');
const handleMouseUp = () => console.log('mouse up');
const handleMouseEnter = () => console.log('mouse enter');
const handleMouseLeave = () => console.log('mouse leave');
</script>
```

### Mouse Modifiers

```vue
<template>
  <!-- Only left click -->
  <button @click.left="handleLeftClick">Left click</button>
  
  <!-- Only right click -->
  <button @click.right="handleRightClick">Right click</button>
  
  <!-- Only middle click -->
  <button @click.middle="handleMiddleClick">Middle click</button>
</template>
```

---

## 6. Form Events

```vue
<template>
  <div>
    <!-- input event (fires in real-time) -->
    <input 
      @input="handleInput"
      placeholder="See changes in real-time"
    />
    <p>Current input: {{ currentInput }}</p>
    
    <!-- change event (fires on blur) -->
    <select @change="handleChange">
      <option value="">Select a framework</option>
      <option value="vue">Vue</option>
      <option value="react">React</option>
    </select>
    <p>Selected: {{ selectedFramework }}</p>
    
    <!-- focus and blur events -->
    <input 
      @focus="isFocused = true"
      @blur="isFocused = false"
      placeholder="Click to focus"
    />
    <p v-if="isFocused">Input is focused ✨</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentInput = ref('');
const selectedFramework = ref('');
const isFocused = ref(false);

const handleInput = (event) => {
  currentInput.value = event.target.value;
};

const handleChange = (event) => {
  selectedFramework.value = event.target.value;
};
</script>
```

---

## 7. Common Errors & Best Practices

### ❌ Error 1: Forgetting parentheses when calling methods

```vue
<!-- ❌ Wrong -->
<button @click="handleClick">Click</button>

<!-- ✅ Correct -->
<button @click="handleClick()">Click</button>
```

### ❌ Error 2: Event bubbling causes unexpected behavior

```vue
<!-- ❌ Problem: clicking button also triggers parentClick -->
<div @click="parentClick">
  <button @click="childClick">Button</button>
</div>

<!-- ✅ Solution: use .stop -->
<div @click="parentClick">
  <button @click.stop="childClick">Button</button>
</div>
```

### ❌ Error 3: Writing complex logic in templates

```vue
<!-- ❌ Bad practice -->
<button @click="if (count > 10) alert('too much'); else count++">
  Click
</button>

<!-- ✅ Good practice: put logic in methods -->
<button @click="handleIncrement">Click</button>

<script setup>
const handleIncrement = () => {
  if (count.value > 10) {
    alert('too much');
  } else {
    count.value++;
  }
};
</script>
```

---

## 8. Summary

| Concept | Example | Purpose |
|---------|---------|---------|
| **Event Listening** | `@click="method"` | Listen and execute |
| **Event Modifiers** | `@click.stop` | Modify event behavior |
| **Keyboard Modifiers** | `@keyup.enter` | Handle specific keys |
| **Mouse Modifiers** | `@click.left` | Handle specific mouse buttons |
| **Event Object** | `$event` | Access native event info |

---

## 📚 Further Reading

- [Vue Official - Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [MDN - Event Interface](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [KeyCode Reference](https://keycode.info/)

## 🧪 Practice

Open [🖱️ Event Handling Lab](../../../) for interactive learning!

