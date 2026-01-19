# 05-C. 自定义 Hooks 实战 🎣

> **学习目标**: 通过分析樱花笔记的真实代码，学会设计和实现生产级的 Composables。  
> **实践基地**: [🧪 Composables 实验室](../../../)

## 1. 实战案例：useContentClick

这个 Composable 处理文章内容区域的点击事件（图片预览、链接跳转、代码复制等）。

### 1.1 需求分析

```
用户点击内容区域 →
  ├── 点击图片 → 打开灯箱预览
  ├── 点击链接 → 判断内外链处理
  ├── 点击代码块 → 复制代码
  └── 其他 → 忽略
```

### 1.2 接口设计

```typescript
interface ContentClickOptions {
  onImageClick?: (img: HTMLImageElement) => void
  onLinkClick?: (href: string, isExternal: boolean) => void
  onCodeClick?: (code: string) => void
}

export function useContentClick(options: ContentClickOptions) {
  // 返回事件处理函数
  return {
    handleContentClick: (event: MouseEvent) => void
  }
}
```

### 1.3 完整实现

```typescript
// composables/useContentClick.ts
export function useContentClick(options: ContentClickOptions = {}) {
  const { onImageClick, onLinkClick, onCodeClick } = options
  
  const handleContentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    // 1. 图片点击
    if (target.tagName === 'IMG') {
      event.preventDefault()
      onImageClick?.(target as HTMLImageElement)
      return
    }
    
    // 2. 链接点击
    const link = target.closest('a')
    if (link) {
      const href = link.getAttribute('href')
      if (!href) return
      
      const isExternal = href.startsWith('http')
      event.preventDefault()
      onLinkClick?.(href, isExternal)
      return
    }
    
    // 3. 代码块点击
    const codeBlock = target.closest('pre')
    if (codeBlock) {
      const code = codeBlock.textContent || ''
      onCodeClick?.(code)
      return
    }
  }
  
  return { handleContentClick }
}
```

### 1.4 在组件中使用

```vue
<script setup>
import { useContentClick } from '@/composables/useContentClick'
import { useLightbox } from '@/composables/useLightbox'

const { open: openLightbox } = useLightbox()

const { handleContentClick } = useContentClick({
  onImageClick: (img) => {
    openLightbox(img.src)
  },
  onLinkClick: (href, isExternal) => {
    if (isExternal) {
      window.open(href, '_blank')
    } else {
      // 内部导航
      navigateTo(href)
    }
  },
  onCodeClick: (code) => {
    navigator.clipboard.writeText(code)
    toast('已复制到剪贴板')
  }
})
</script>

<template>
  <article @click="handleContentClick">
    <!-- 内容 -->
  </article>
</template>
```

---

## 2. 实战案例：useWallpapers

管理壁纸加载、切换和持久化。

### 2.1 状态设计

```typescript
interface WallpaperState {
  wallpapers: Wallpaper[]       // 壁纸列表
  currentIndex: number          // 当前索引
  loading: boolean              // 加载状态
  error: string | null          // 错误信息
}
```

### 2.2 完整实现

```typescript
// composables/useWallpapers.ts
import { ref, computed, watch } from 'vue'

export function useWallpapers() {
  // 状态
  const wallpapers = ref<Wallpaper[]>([])
  const currentIndex = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const currentWallpaper = computed(() => 
    wallpapers.value[currentIndex.value] || null
  )
  
  const hasNext = computed(() => 
    currentIndex.value < wallpapers.value.length - 1
  )
  
  const hasPrev = computed(() => 
    currentIndex.value > 0
  )
  
  // 方法
  const loadWallpapers = async (theme: 'light' | 'dark') => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/wallpapers.json')
      const data = await response.json()
      wallpapers.value = data[theme] || []
      
      // 从 localStorage 恢复索引
      const savedIndex = localStorage.getItem(`wallpaper-${theme}`)
      if (savedIndex !== null) {
        currentIndex.value = parseInt(savedIndex, 10)
      }
    } catch (e) {
      error.value = '加载壁纸失败'
      wallpapers.value = []
    } finally {
      loading.value = false
    }
  }
  
  const next = () => {
    if (hasNext.value) {
      currentIndex.value++
    }
  }
  
  const prev = () => {
    if (hasPrev.value) {
      currentIndex.value--
    }
  }
  
  const setIndex = (index: number) => {
    if (index >= 0 && index < wallpapers.value.length) {
      currentIndex.value = index
    }
  }
  
  // 自动持久化
  watch(currentIndex, (newIndex) => {
    localStorage.setItem('wallpaper-index', String(newIndex))
  })
  
  return {
    // 状态
    wallpapers,
    currentWallpaper,
    currentIndex,
    loading,
    error,
    // 计算属性
    hasNext,
    hasPrev,
    // 方法
    loadWallpapers,
    next,
    prev,
    setIndex
  }
}
```

---

## 3. 实战案例：usePetals

实现花瓣飘落动画效果。

### 3.1 动画原理

```
Canvas 动画循环:
1. 清空画布
2. 更新每个花瓣位置
3. 绘制花瓣
4. requestAnimationFrame 循环
```

### 3.2 核心实现

```typescript
// components/petal/usePetals.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface Petal {
  x: number      // X 坐标
  y: number      // Y 坐标
  size: number   // 大小
  speed: number  // 下落速度
  rotation: number  // 旋转角度
  opacity: number   // 透明度
}

export function usePetals(canvasRef: Ref<HTMLCanvasElement | null>) {
  const petals = ref<Petal[]>([])
  let animationId: number | null = null
  
  // 创建花瓣
  const createPetal = (): Petal => ({
    x: Math.random() * window.innerWidth,
    y: -20,
    size: Math.random() * 10 + 5,
    speed: Math.random() * 2 + 1,
    rotation: Math.random() * 360,
    opacity: Math.random() * 0.5 + 0.5
  })
  
  // 更新花瓣位置
  const updatePetal = (petal: Petal) => {
    petal.y += petal.speed
    petal.x += Math.sin(petal.rotation * Math.PI / 180) * 0.5
    petal.rotation += 1
    
    // 超出画布则重置
    if (petal.y > window.innerHeight) {
      Object.assign(petal, createPetal())
    }
  }
  
  // 绘制花瓣
  const drawPetal = (ctx: CanvasRenderingContext2D, petal: Petal) => {
    ctx.save()
    ctx.translate(petal.x, petal.y)
    ctx.rotate(petal.rotation * Math.PI / 180)
    ctx.globalAlpha = petal.opacity
    
    // 绘制花瓣形状
    ctx.fillStyle = '#ffc0cb'
    ctx.beginPath()
    ctx.ellipse(0, 0, petal.size, petal.size / 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
  
  // 动画循环
  const animate = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 清空
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 更新和绘制
    petals.value.forEach(petal => {
      updatePetal(petal)
      drawPetal(ctx, petal)
    })
    
    animationId = requestAnimationFrame(animate)
  }
  
  // 初始化
  const init = (count = 30) => {
    petals.value = Array.from({ length: count }, createPetal)
    animate()
  }
  
  // 清理
  const destroy = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    petals.value = []
  }
  
  onMounted(() => init())
  onUnmounted(() => destroy())
  
  return {
    petals,
    init,
    destroy
  }
}
```

---

## 4. 设计模式总结

### 4.1 输入/输出模式

```typescript
// 输入: 配置选项
// 输出: 状态 + 方法
function useXxx(options: Options) {
  // 内部状态
  const state = ref(...)
  
  // 方法
  const doSomething = () => { ... }
  
  // 返回公共 API
  return {
    state,      // 响应式状态
    doSomething // 操作方法
  }
}
```

### 4.2 生命周期封装

```typescript
function useXxx() {
  onMounted(() => {
    // 初始化
  })
  
  onUnmounted(() => {
    // 清理
  })
  
  // 外部无需关心生命周期
}
```

### 4.3 组合复用

```typescript
// 组合多个 Composables
function useArticle(path: string) {
  const { content, loading: loadingContent } = useFile(path)
  const { html, headings } = useMarkdown(content)
  const { handleContentClick } = useContentClick({ ... })
  
  const loading = computed(() => loadingContent.value)
  
  return {
    html,
    headings,
    loading,
    handleContentClick
  }
}
```

---

## 5. 调试技巧

### 5.1 使用 Vue DevTools

Composables 的状态会自动出现在 Vue DevTools 中。

### 5.2 添加调试日志

```typescript
export function useCounter(name = 'counter') {
  const count = ref(0)
  
  watch(count, (newVal, oldVal) => {
    console.log(`[${name}] ${oldVal} -> ${newVal}`)
  })
  
  return { count }
}
```

### 5.3 单元测试

```typescript
// useCounter.test.ts
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('should increment', () => {
    const { count, increment } = useCounter()
    
    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
  })
})
```

---

## 6. 练习任务

1. 实现 `useClipboard` - 封装剪贴板操作
2. 实现 `useIntersectionObserver` - 封装元素可见性检测
3. 分析 `composables/useSearch.ts` 源码，理解防抖实现

---

## 参考资源

- 樱花笔记源码: `composables/` 目录
- [VueUse 源码](https://github.com/vueuse/vueuse)
- [Vue 官方 Composables 指南](https://cn.vuejs.org/guide/reusability/composables.html)
