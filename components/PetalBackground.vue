<template>
  <div 
    class="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    @mousemove="handleDragMove"
    @touchmove="handleDragMove"
    @mouseup="endDrag"
    @touchend="endDrag"
  >
    <div 
      v-for="p in petals" 
      :key="p.id" 
      class="absolute select-none cursor-grab active:cursor-grabbing will-change-transform pointer-events-auto"
      :style="{
        transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${p.scale})`,
        opacity: p.opacity,
        width: p.size + 'px',
        height: (p.size * 1.3) + 'px',
        background: isDark ? 'linear-gradient(120deg, #be1245 0%, #f43f72 100%)' : 'linear-gradient(120deg, #ffd7e6 0%, #ffc4d6 100%)',
        borderRadius: '150% 0 150% 0',
        boxShadow: isDark ? '0 0 5px rgba(244, 63, 114, 0.3)' : '1px 1px 2px rgba(0,0,0,0.05)',
        transition: p.isDragging ? 'none' : 'opacity 0.5s'
      }"
      @mousedown.prevent="startDrag(p, $event)"
      @touchstart.prevent="startDrag(p, $event)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  speed: 'slow' | 'fast';
}>();

const isDark = ref(false);

interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  size: number;
  opacity: number;
  
  // Physics Base Values (independent of global speed setting)
  baseSpeedY: number;
  baseSpeedX: number;
  swayAmp: number; 
  swayFreq: number;
  timeOffset: number;
  
  // Stacking
  landingOffset: number; // Random offset from bottom for natural piling

  // State
  isDragging: boolean;
  isLanded: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
}

const petals = ref<Petal[]>([]);
let animationFrameId: number;
let nextId = 0;

// Config
const MAX_PETALS = 50; 
const MAX_LANDED = 80; // Increased for "fuller" pile
// Distribution: Bias towards 0 (bottom). 
// Using power of random to cluster near 0. Math.pow(random, 3) makes most values small.
const getLandingOffset = () => Math.pow(Math.random(), 3) * 60; 

const createPetal = (yStart = -50): Petal => {
  const size = Math.random() * 10 + 12;
  
  return {
    id: nextId++,
    x: Math.random() * window.innerWidth,
    y: yStart,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.8,
    size: size,
    opacity: Math.random() * 0.4 + 0.6,
    
    // Store BASE speed. Actual speed = base * props.multiplier
    baseSpeedY: (Math.random() * 1 + 1), // 1.0 - 2.0 base
    baseSpeedX: (Math.random() - 0.5) * 1, // -0.5 to 0.5
    swayAmp: Math.random() * 2,
    swayFreq: Math.random() * 0.02 + 0.01,
    timeOffset: Math.random() * 1000,
    
    landingOffset: getLandingOffset(),
    
    isDragging: false,
    isLanded: false,
    dragOffsetX: 0,
    dragOffsetY: 0
  };
};

const draggedPetalId = ref<number | null>(null);

const startDrag = (p: Petal, e: MouseEvent | TouchEvent) => {
  draggedPetalId.value = p.id;
  p.isDragging = true;
  p.isLanded = false; 
  p.opacity = 1;

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
  p.dragOffsetX = clientX - p.x;
  p.dragOffsetY = clientY - p.y;
};

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (draggedPetalId.value === null) return;
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (!p) return;

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  p.x = clientX - p.dragOffsetX;
  p.y = clientY - p.dragOffsetY;
};

const endDrag = () => {
  if (draggedPetalId.value === null) return;
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (p) {
    p.isDragging = false;
  }
  draggedPetalId.value = null;
};

const update = () => {
  const h = window.innerHeight;
  const w = window.innerWidth;
  
  isDark.value = document.documentElement.classList.contains('dark');

  // Dynamic Speed Multiplier: Calculate every frame to react to settings change
  const currentSpeedMult = props.speed === 'fast' ? 2.5 : 1.0;

  // Spawn logic
  const activeCount = petals.value.filter(p => !p.isLanded).length;
  if (activeCount < MAX_PETALS && Math.random() < 0.05) {
    petals.value.push(createPetal());
  }

  // Physics Loop
  petals.value.forEach(p => {
    if (p.isDragging) return;

    if (p.isLanded) {
       // Cleanup if pile too big
       const landed = petals.value.filter(p => p.isLanded);
       if (landed.length > MAX_LANDED) {
          // Remove the oldest landed one (first in array usually)
          const oldest = landed[0]; 
          const idx = petals.value.indexOf(oldest);
          if (idx > -1) petals.value.splice(idx, 1);
       }
       return;
    }

    // Move
    p.timeOffset++;
    const sway = Math.sin(p.timeOffset * p.swayFreq) * p.swayAmp;
    
    // Apply dynamic multiplier to base speed
    p.x += (p.baseSpeedX + sway) * currentSpeedMult * 0.5; // Dampen X speed a bit
    p.y += p.baseSpeedY * currentSpeedMult;
    p.rotation += (p.baseSpeedX + sway) * 2;

    // Wrap X
    if (p.x > w + 20) p.x = -20;
    if (p.x < -20) p.x = w + 20;

    // Landing Logic
    // Use stored landingOffset so it feels like the petal has a specific resting spot in the pile
    const landY = h - p.size - p.landingOffset; 
    
    if (p.y > landY) {
      p.y = landY;
      p.isLanded = true;
      p.rotation = Math.random() * 360; // Settle flat or random
    }
  });

  // Cleanup fallen off screen (unlikely with landing logic, but for safety)
  for (let i = petals.value.length - 1; i >= 0; i--) {
    const p = petals.value[i];
    if (p.y > h + 100) { 
        petals.value.splice(i, 1);
    }
  }

  animationFrameId = requestAnimationFrame(update);
};

onMounted(() => {
  // Pre-seed a few
  for (let i=0; i<15; i++) petals.value.push(createPetal(Math.random() * window.innerHeight * 0.8));
  animationFrameId = requestAnimationFrame(update);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>