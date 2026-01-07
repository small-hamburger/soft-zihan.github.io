import { createApp } from 'vue';
import App from './App.vue';

try {
  const app = createApp(App);
  app.mount('#app');
} catch (error) {
  console.error("Failed to mount Vue app:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error loading application. Please check console.</div>`;
}