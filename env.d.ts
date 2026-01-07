// Removed the reference to vite/client as the type definitions are not available in this environment.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}