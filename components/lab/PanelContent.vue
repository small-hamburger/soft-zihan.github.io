<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Notes Panel - With collapsible folder tree -->
    <template v-if="type === 'notes'">
      <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📚</span>
          {{ isZh ? 'VUE学习笔记' : 'VUE Learning Notes' }}
        </h4>
        <!-- Toggle folder tree button -->
        <button 
          @click="showFolderTree = !showFolderTree"
          class="text-xs px-2 py-1 rounded-lg transition-colors"
          :class="showFolderTree 
            ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-600 dark:text-sakura-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'"
        >
          {{ showFolderTree ? '📁 ▼' : '📁 ▶' }}
        </button>
      </div>
      
      <!-- Main content area with optional sidebar -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Collapsible folder tree sidebar -->
        <div 
          v-if="showFolderTree"
          class="w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 overflow-y-auto custom-scrollbar"
        >
          <div class="p-2 space-y-0.5">
            <div 
              v-for="note in notesList" 
              :key="note.path"
              @click="emit('select-note', note)"
              class="p-2 rounded-lg cursor-pointer transition-all text-xs hover:bg-white dark:hover:bg-gray-700 flex items-center gap-1.5"
              :class="selectedNote?.path === note.path 
                ? 'bg-sakura-50 dark:bg-sakura-900/20 text-sakura-700 dark:text-sakura-300 border-l-2 border-sakura-500' 
                : 'text-gray-600 dark:text-gray-400'"
            >
              <span class="text-[10px]">📝</span>
              <span class="truncate">{{ note.name.replace('.md', '') }}</span>
            </div>
          </div>
        </div>
        
        <!-- Note Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div v-if="selectedNote && noteContent" v-html="renderedContent" class="markdown-body dark:text-gray-300 prose prose-sm max-w-none"></div>
          <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm flex-col gap-4">
            <span class="text-4xl">📚</span>
            <span>{{ isZh ? '请点击左上角文件夹图标选择笔记' : 'Click folder icon to select note' }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Lab Panel -->
    <template v-else-if="type === 'lab'">
      <div class="h-full overflow-y-auto custom-scrollbar">
        <LabDashboard 
          :lang="lang" 
          :initial-tab="labDashboardTab" 
          @tab-change="emit('tab-change', $event)"
        />
      </div>
    </template>

    <!-- Source Code Panel -->
    <template v-else-if="type === 'source'">
      <div class="h-full">
        <SourceCodeViewer :lang="lang" :compact="true" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import type { FileNode } from '../../types'
import { NodeType } from '../../types'
import LabDashboard from './LabDashboard.vue'
import SourceCodeViewer from './SourceCodeViewer.vue'

const props = defineProps<{
  type: 'notes' | 'lab' | 'source'
  lang: 'en' | 'zh'
  labDashboardTab?: string
  labFolder: FileNode | null
  selectedNote?: FileNode | null
}>()

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
  (e: 'select-note', note: FileNode): void
}>()

const isZh = computed(() => props.lang === 'zh')

// Show/hide folder tree sidebar
const showFolderTree = ref(true)

// Notes list from labFolder
const notesList = computed(() => {
  if (!props.labFolder || !props.labFolder.children) return []
  return props.labFolder.children
    .filter(node => node.type === NodeType.FILE && node.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }))
})

// Note content
const noteContent = ref<string>('')

// Rendered markdown content
const renderedContent = computed(() => {
  if (!noteContent.value) return ''
  try {
    return marked.parse(noteContent.value) as string
  } catch {
    return noteContent.value
  }
})

// Fetch note content when selected
watch(() => props.selectedNote, async (note) => {
  if (!note) {
    noteContent.value = ''
    return
  }
  
  try {
    const encodedPath = note.path.split('/').map(p => encodeURIComponent(p)).join('/')
    const res = await fetch(`./notes/${encodedPath}`)
    if (res.ok) {
      noteContent.value = await res.text()
    } else {
      noteContent.value = `# Error\nCould not load: ${note.path}`
    }
  } catch (e) {
    noteContent.value = `# Error\n${e}`
  }
}, { immediate: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>
