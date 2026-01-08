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
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
  speed: 'slow' | 'fast';
}>();

// Check theme via DOM class as props might not update fast enough for RAF loop logic sometimes, 
// but here we use a reactive checker or just check prop passed from App.vue if available. 
// For simplicity, we check the class on the html element or use a simple heuristic.
// Better: Add a prop or check document.documentElement.classList.
const isDark = ref(false);

interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  size: number;
  opacity: number;
  
  // Physics
  speedY: number;
  speedX: number;
  swayAmp: number; // Amplitude of horizontal sway
  swayFreq: number; // Frequency of sway
  timeOffset: number;
  
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
const MAX_PETALS = 40; // Total active falling petals
const MAX_LANDED = 30; // Max petals accumulated at bottom
const GROUND_HEIGHT_LIMIT = 120; // Max height of pile from bottom

const createPetal = (yStart = -50): Petal => {
  const size = Math.random() * 10 + 12; // 12-22px
  const speedMult = props.speed === 'fast' ? 1.5 : 0.8;
  
  return {
    id: nextId++,
    x: Math.random() * window.innerWidth,
    y: yStart,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.8,
    size: size,
    opacity: Math.random() * 0.4 + 0.6,
    
    speedY: (Math.random() * 1 + 0.5) * speedMult,
    speedX: (Math.random() - 0.5) * 0.5,
    swayAmp: Math.random() * 2,
    swayFreq: Math.random() * 0.02 + 0.01,
    timeOffset: Math.random() * 1000,
    
    isDragging: false,
    isLanded: false,
    dragOffsetX: 0,
    dragOffsetY: 0
  };
};

// Dragging State
const draggedPetalId = ref<number | null>(null);

const startDrag = (p: Petal, e: MouseEvent | TouchEvent) => {
  draggedPetalId.value = p.id;
  p.isDragging = true;
  p.isLanded = false; // Lift off ground
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
  p.speedY = 0; // Stop falling momentum
};

const endDrag = () => {
  if (draggedPetalId.value === null) return;
  
  const p = petals.value.find(pet => pet.id === draggedPetalId.value);
  if (p) {
    p.isDragging = false;
    // Give a little throw momentum
    p.speedY = props.speed === 'fast' ? 1.5 : 0.8; 
  }
  draggedPetalId.value = null;
};

const update = () => {
  const h = window.innerHeight;
  const w = window.innerWidth;
  
  // Update Theme Check (Cheap enough for RAF?)
  // Optimization: standard check
  isDark.value = document.documentElement.classList.contains('dark');

  // Spawn new if needed
  const activeCount = petals.value.filter(p => !p.isLanded).length;
  if (activeCount < MAX_PETALS && Math.random() < 0.05) {
    petals.value.push(createPetal());
  }

  // Physics Loop
  petals.value.forEach(p => {
    if (p.isDragging) return;

    if (p.isLanded) {
       // Cleanup old landed petals if too many
       const landed = petals.value.filter(p => p.isLanded);
       if (landed.length > MAX_LANDED) {
          // Remove the oldest landed one (first in array usually)
          const oldest = landed[0];
          const idx = petals.value.indexOf(oldest);
          if (idx > -1) petals.value.splice(idx, 1);
       }
       return;
    }

    // Apply movement
    p.timeOffset++;
    const sway = Math.sin(p.timeOffset * p.swayFreq) * p.swayAmp;
    
    p.x += p.speedX + sway;
    p.y += p.speedY;
    p.rotation += (p.speedX + sway) * 2;

    // Wrap X
    if (p.x > w + 20) p.x = -20;
    if (p.x < -20) p.x = w + 20;

    // Landing Logic
    const bottomLimit = h - Math.random() * GROUND_HEIGHT_LIMIT; // Irregular pile
    if (p.y > bottomLimit) {
      p.y = bottomLimit;
      p.isLanded = true;
      p.rotation = Math.random() * 180; // Settle angle
      // Randomly decide if it stays or disappears immediately to reduce clutter
      if (Math.random() > 0.7) {
          p.opacity = 0; // Mark for removal
      }
    }
  });

  // Remove invisible/fallen-through petals
  for (let i = petals.value.length - 1; i >= 0; i--) {
    const p = petals.value[i];
    if (p.opacity <= 0.01) {
      petals.value.splice(i, 1);
    }
  }

  animationFrameId = requestAnimationFrame(update);
};

onMounted(() => {
  // Pre-seed a few
  for (let i=0; i<10; i++) petals.value.push(createPetal(Math.random() * window.innerHeight));
  animationFrameId = requestAnimationFrame(update);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>