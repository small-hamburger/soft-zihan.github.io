
# 05. Lifecycle & Network Requests (Ajax) 🌸

> **Goal**: Understand Ajax, Axios, and the `mounted` lifecycle hook.
> **Ref**: [📖 Vue Lifecycle](https://vuejs.org/guide/essentials/lifecycle.html)

## 1. What is Ajax?

*   **Concept**: Asynchronous JavaScript And XML.
*   **Role**: Exchanging data with a server without reloading the page.
*   **Demo**: Check the **Lab -> Network & Async** tab for a visualization of the "Province-City-Area" flow. ([LabAjax.vue](/components/LabAjax.vue))

## 2. Axios & Async / Await

Vue ecosystem recommends Axios over native `XMLHttpRequest`. It also recommends `async/await` to avoid Callback Hell.

**Source Code ([components/LabAjax.vue](/components/LabAjax.vue))**:

**Callback Hell (The Old Way)**:
```javascript
axios.get('/province').then(res => {
    const pid = res.data.id;
    axios.get(`/city?pid=${pid}`).then(res => {
        // Nested... hard to read.
    });
});
```

**Async / Await (The Modern Way)**:
```javascript
async function getData() {
    // Looks synchronous, reads easily.
    const p = await axios.get('/province');
    const pid = p.data.id;
    
    const c = await axios.get(`/city?pid=${pid}`);
}
```

## 3. Key Hook: onMounted (mounted)

Vue instances have a lifecycle. `onMounted` is the standard place for initial data fetching.

*   **Timing**: After the HTML is rendered and the DOM is ready.
*   **Usage**: "Auto-loading" data when page opens.

**Source Code ([App.vue](/App.vue))**:
Fetching the file list when the blog loads:

```typescript
import { onMounted } from 'vue';

onMounted(async () => {
  try {
    // Go fetch data immediately after app is ready
    const res = await fetch('./files.json');
    fileSystem.value = await res.json();
  } catch (e) {
    console.error("Failed to load");
  }
});
```

## 4. Summary

1.  **Ajax**: Makes pages dynamic and fast.
2.  **Async/Await**: Makes async code readable.
3.  **Mounted**: The "Start Button" for your data requests.
