<template>
  <!-- 双栏阅读：占据整个可用空间，不受边栏影响 -->
  <div class="fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex flex-col">
    <!-- Top Control Bar with toggle buttons -->
    <div class="flex items-center justify-between p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <!-- Left Panel Selector (放在左边) -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{{ isZh ? '左栏' : 'Left' }}:</span>
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button 
            v-for="opt in panelOptions" 
            :key="opt.value"
            @click="emit('update:left-panel', opt.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
            :class="leftPanel === opt.value 
              ? 'bg-white dark:bg-gray-600 text-sakura-600 dark:text-sakura-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
      </div>
      
      <!-- Title -->
      <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span>📖</span>
        {{ isZh ? '双栏阅读' : 'Dual Column Reading' }}
      </h3>
      
      <!-- Right Panel Selector (放在右边) -->
      <div class="flex items-center gap-2">
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button 
            v-for="opt in panelOptions" 
            :key="opt.value"
            @click="emit('update:right-panel', opt.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
            :class="rightPanel === opt.value 
              ? 'bg-white dark:bg-gray-600 text-sakura-600 dark:text-sakura-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">:{{ isZh ? '右栏' : 'Right' }}</span>
      </div>
    </div>

    <!-- Dual Panels -->
    <div class="flex-1 flex gap-2 p-2 overflow-hidden">
      <!-- Left Panel -->
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
        <PanelContent 
          :type="leftPanel" 
          :lang="lang"
          :lab-dashboard-tab="labDashboardTab"
          :lab-folder="labFolder"
          :selected-note="selectedLeftNote"
          @tab-change="emit('tab-change', $event)"
          @select-note="selectedLeftNote = $event; emit('select-file', $event)"
        />
      </div>
      
      <!-- Right Panel -->
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
        <PanelContent 
          :type="rightPanel" 
          :lang="lang"
          :lab-dashboard-tab="labDashboardTab"
          :lab-folder="labFolder"
          :selected-note="selectedRightNote"
          @tab-change="emit('tab-change', $event)"
          @select-note="selectedRightNote = $event; emit('select-file', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FileNode } from '../../types'
import PanelContent from './PanelContent.vue'

const props = defineProps<{
  lang: 'en' | 'zh'
  leftPanel: 'notes' | 'lab' | 'source'
  rightPanel: 'notes' | 'lab' | 'source'
  labDashboardTab?: string
  labFolder: FileNode | null
}>()

const emit = defineEmits<{
  (e: 'update:left-panel', value: 'notes' | 'lab' | 'source'): void
  (e: 'update:right-panel', value: 'notes' | 'lab' | 'source'): void
  (e: 'tab-change', tab: string): void
  (e: 'select-file', file: FileNode): void
}>()

const isZh = computed(() => props.lang === 'zh')

const panelOptions = computed(() => [
  { value: 'notes' as const, icon: '📚', label: isZh.value ? '笔记' : 'Notes' },
  { value: 'lab' as const, icon: '🧪', label: isZh.value ? '可视化' : 'Lab' },
  { value: 'source' as const, icon: '💻', label: isZh.value ? '源码' : 'Source' }
])

const selectedLeftNote = ref<FileNode | null>(null)
const selectedRightNote = ref<FileNode | null>(null)
</script>
