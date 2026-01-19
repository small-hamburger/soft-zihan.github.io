<template>
  <div class="flex h-full min-h-[600px] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
    <!-- Left: File Tree -->
    <div class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800/50">
      <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>📁</span> {{ isZh ? '项目结构' : 'Project Structure' }}
        </h3>
      </div>
      <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
        <SourceFileTree 
          :nodes="projectTree" 
          :selected-path="selectedFile?.path"
          @select="selectFile"
        />
      </div>
    </div>

    <!-- Center: Code View -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- File Tab Bar -->
      <div class="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-gray-700 overflow-x-auto">
        <div v-if="selectedFile" class="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] rounded text-sm">
          <span>{{ getFileIcon(selectedFile.name) }}</span>
          <span class="text-gray-300 font-mono text-xs">{{ selectedFile.name }}</span>
        </div>
        <div v-else class="text-gray-500 dark:text-gray-400 text-sm italic">
          {{ isZh ? '选择文件查看源码' : 'Select a file to view source' }}
        </div>
        <div class="ml-auto flex items-center gap-2">
          <label class="text-xs text-gray-400 flex items-center gap-1 cursor-pointer">
            <input type="checkbox" v-model="wordWrap" class="accent-sakura-500" />
            {{ isZh ? '换行' : 'Wrap' }}
          </label>
          <button 
            @click="showNotes = !showNotes"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
            :class="showNotes ? 'bg-sakura-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
          >
            <span>📝</span>
            {{ isZh ? '笔记' : 'Notes' }}
          </button>
        </div>
      </div>

      <!-- Code Content with Inline Notes -->
      <div class="flex-1 overflow-auto bg-[#1e1e1e] custom-scrollbar relative" ref="codeContainer">
        <div v-if="selectedFile && fileContent" class="py-4">
          <!-- Render each line with possible inline note -->
          <template v-for="(line, idx) in fileLines" :key="idx">
            <!-- Code Line -->
            <div 
              class="flex hover:bg-[#2a2d2e]"
              :class="{ 'bg-sakura-900/20': hasNoteAtLine(idx + 1) }"
              @dragover.prevent="onDragOver($event, idx + 1)"
              @drop.prevent="onDrop($event, idx + 1)"
            >
              <!-- Line Number -->
              <div 
                class="flex-shrink-0 w-12 pl-4 pr-2 text-right select-none font-mono text-xs leading-6 cursor-pointer transition-colors"
                :class="hasNoteAtLine(idx + 1) ? 'text-sakura-400 font-bold' : 'text-gray-600 hover:text-gray-400'"
                @click="toggleNoteAtLine(idx + 1)"
              >
                {{ idx + 1 }}
              </div>
              <!-- Code Content -->
              <pre 
                class="flex-1 pr-4 text-sm font-mono leading-6"
                :class="wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'"
              ><code v-html="highlightLine(line)" class="hljs"></code></pre>
            </div>
            
            <!-- Inline Note (below the line) -->
            <div 
              v-if="showNotes && hasNoteAtLine(idx + 1)"
              class="flex mx-4 my-1"
              draggable="true"
              @dragstart="onDragStart($event, idx + 1)"
              @dragend="onDragEnd"
            >
              <div class="w-8"></div>
              <div class="flex-1 bg-gradient-to-r from-sakura-50 to-amber-50 dark:from-sakura-900/30 dark:to-amber-900/20 rounded-lg p-3 border border-sakura-200 dark:border-sakura-700/50 shadow-sm group relative">
                <!-- Drag Handle -->
                <div class="absolute -left-6 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-sakura-400">
                  ⋮⋮
                </div>
                <div class="flex items-start justify-between gap-2 mb-1">
                  <span class="text-[10px] font-mono text-sakura-600 dark:text-sakura-400 bg-sakura-100 dark:bg-sakura-900/50 px-1.5 py-0.5 rounded">
                    L{{ idx + 1 }}
                  </span>
                  <button 
                    @click="deleteNote(idx + 1)"
                    class="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
                <textarea
                  :value="getNoteContent(idx + 1)"
                  @input="updateNoteContent(idx + 1, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-200 min-h-[40px] placeholder-gray-400"
                  :placeholder="isZh ? '在此输入笔记...' : 'Type your note here...'"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <div class="text-4xl mb-4">📂</div>
            <p>{{ isZh ? '从左侧选择文件开始阅读' : 'Select a file from the left to start reading' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Bottom hint -->
      <div v-if="selectedFile && showNotes" class="px-4 py-2 bg-[#252526] border-t border-gray-700 text-xs text-gray-500 flex items-center justify-between">
        <span>💡 {{ isZh ? '点击行号添加笔记，拖拽笔记可移动位置' : 'Click line numbers to add notes, drag notes to move' }}</span>
        <span>{{ isZh ? '笔记自动保存' : 'Auto-saved' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

// Register languages
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)

// Child component for file tree
import SourceFileTree from './SourceFileTree.vue'

interface SourceFile {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: SourceFile[]
}

interface CodeNote {
  line: number
  content: string
}

interface FileNotes {
  [filePath: string]: CodeNote[]
}

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

// Project file tree (hardcoded for this project)
const projectTree = ref<SourceFile[]>([
  {
    name: 'Root',
    path: '',
    type: 'directory',
    children: [
      { name: 'index.html', path: 'index.html', type: 'file' },
      { name: 'index.tsx', path: 'index.tsx', type: 'file' },
      { name: 'App.vue', path: 'App.vue', type: 'file' },
      { name: 'constants.ts', path: 'constants.ts', type: 'file' },
      { name: 'types.ts', path: 'types.ts', type: 'file' },
      { name: 'vite.config.ts', path: 'vite.config.ts', type: 'file' },
      { name: 'package.json', path: 'package.json', type: 'file' },
      { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' },
      {
        name: 'components',
        path: 'components',
        type: 'directory',
        children: [
          { name: 'AppHeader.vue', path: 'components/AppHeader.vue', type: 'file' },
          { name: 'AppSidebar.vue', path: 'components/AppSidebar.vue', type: 'file' },
          { name: 'ArticleCard.vue', path: 'components/ArticleCard.vue', type: 'file' },
          { name: 'FileTree.vue', path: 'components/FileTree.vue', type: 'file' },
          { name: 'FolderView.vue', path: 'components/FolderView.vue', type: 'file' },
          { name: 'SearchModal.vue', path: 'components/SearchModal.vue', type: 'file' },
          { name: 'SettingsModal.vue', path: 'components/SettingsModal.vue', type: 'file' },
          { name: 'WriteEditor.vue', path: 'components/WriteEditor.vue', type: 'file' },
          { name: 'MusicPlayer.vue', path: 'components/MusicPlayer.vue', type: 'file' },
          { name: 'GiscusComments.vue', path: 'components/GiscusComments.vue', type: 'file' },
          { name: 'PetalBackground.vue', path: 'components/PetalBackground.vue', type: 'file' },
          { name: 'WallpaperLayer.vue', path: 'components/WallpaperLayer.vue', type: 'file' },
          {
            name: 'lab',
            path: 'components/lab',
            type: 'directory',
            children: [
              { name: 'index.ts', path: 'components/lab/index.ts', type: 'file' },
              { name: 'LabDashboard.vue', path: 'components/lab/LabDashboard.vue', type: 'file' },
              { name: 'LabProjectTour.vue', path: 'components/lab/LabProjectTour.vue', type: 'file' },
            ]
          },
          {
            name: 'petal',
            path: 'components/petal',
            type: 'directory',
            children: [
              { name: 'usePetals.ts', path: 'components/petal/usePetals.ts', type: 'file' },
            ]
          }
        ]
      },
      {
        name: 'composables',
        path: 'composables',
        type: 'directory',
        children: [
          { name: 'index.ts', path: 'composables/index.ts', type: 'file' },
          { name: 'useArticleMeta.ts', path: 'composables/useArticleMeta.ts', type: 'file' },
          { name: 'useBackup.ts', path: 'composables/useBackup.ts', type: 'file' },
          { name: 'useCodeModal.ts', path: 'composables/useCodeModal.ts', type: 'file' },
          { name: 'useContentClick.ts', path: 'composables/useContentClick.ts', type: 'file' },
          { name: 'useContentRenderer.ts', path: 'composables/useContentRenderer.ts', type: 'file' },
          { name: 'useFile.ts', path: 'composables/useFile.ts', type: 'file' },
          { name: 'useGitHubPublish.ts', path: 'composables/useGitHubPublish.ts', type: 'file' },
          { name: 'useLightbox.ts', path: 'composables/useLightbox.ts', type: 'file' },
          { name: 'useMarkdown.ts', path: 'composables/useMarkdown.ts', type: 'file' },
          { name: 'useRawEditor.ts', path: 'composables/useRawEditor.ts', type: 'file' },
          { name: 'useSearch.ts', path: 'composables/useSearch.ts', type: 'file' },
          { name: 'useSelectionMenu.ts', path: 'composables/useSelectionMenu.ts', type: 'file' },
          { name: 'useWallpapers.ts', path: 'composables/useWallpapers.ts', type: 'file' },
        ]
      },
      {
        name: 'stores',
        path: 'stores',
        type: 'directory',
        children: [
          { name: 'index.ts', path: 'stores/index.ts', type: 'file' },
          { name: 'appStore.ts', path: 'stores/appStore.ts', type: 'file' },
          { name: 'articleStore.ts', path: 'stores/articleStore.ts', type: 'file' },
          { name: 'learningStore.ts', path: 'stores/learningStore.ts', type: 'file' },
          { name: 'musicStore.ts', path: 'stores/musicStore.ts', type: 'file' },
        ]
      },
      {
        name: 'scripts',
        path: 'scripts',
        type: 'directory',
        children: [
          { name: 'generate-tree.js', path: 'scripts/generate-tree.js', type: 'file' },
          { name: 'generate-raw.js', path: 'scripts/generate-raw.js', type: 'file' },
          { name: 'generate-music.js', path: 'scripts/generate-music.js', type: 'file' },
          { name: 'generate-wallpapers.js', path: 'scripts/generate-wallpapers.js', type: 'file' },
        ]
      }
    ]
  }
])

const selectedFile = ref<SourceFile | null>(null)
const fileContent = ref<string>('')
const showNotes = ref(true)
const wordWrap = ref(false)
const codeContainer = ref<HTMLElement | null>(null)

// Drag state
const draggingNoteLine = ref<number | null>(null)

// Notes stored in localStorage
const NOTES_STORAGE_KEY = 'sakura_source_code_notes'
const allNotes = ref<FileNotes>({})

// Load notes from localStorage
onMounted(() => {
  const saved = localStorage.getItem(NOTES_STORAGE_KEY)
  if (saved) {
    try {
      allNotes.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse saved notes:', e)
    }
  }
})

// Current file notes
const currentFileNotes = computed(() => {
  if (!selectedFile.value) return []
  return allNotes.value[selectedFile.value.path] || []
})

// File lines
const fileLines = computed(() => fileContent.value.split('\n'))

// Get language for highlighting
const getLanguage = () => {
  if (!selectedFile.value) return 'plaintext'
  const ext = selectedFile.value.name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'vue':
    case 'html':
      return 'xml'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'sh':
      return 'bash'
    default:
      return 'plaintext'
  }
}

// Highlight a single line
const highlightLine = (line: string) => {
  const language = getLanguage()
  try {
    return hljs.highlight(line || ' ', { language }).value
  } catch {
    return line || ' '
  }
}

// Syntax highlighted code (kept for compatibility)
const highlightedCode = computed(() => {
  if (!fileContent.value || !selectedFile.value) return ''
  const language = getLanguage()
  try {
    return hljs.highlight(fileContent.value, { language }).value
  } catch {
    return fileContent.value
  }
})

// Check if line has a note
const hasNoteAtLine = (line: number) => {
  return currentFileNotes.value.some(n => n.line === line)
}

// Toggle note at line
const toggleNoteAtLine = (line: number) => {
  if (!selectedFile.value) return
  
  const path = selectedFile.value.path
  if (!allNotes.value[path]) {
    allNotes.value[path] = []
  }
  
  const existingIdx = allNotes.value[path].findIndex(n => n.line === line)
  if (existingIdx >= 0) {
    // If note exists and empty, remove it
    if (!allNotes.value[path][existingIdx].content.trim()) {
      allNotes.value[path].splice(existingIdx, 1)
    }
  } else {
    // Add new note
    allNotes.value[path].push({ line, content: '' })
    allNotes.value[path].sort((a, b) => a.line - b.line)
  }
  
  saveNotes()
}

// Delete note
const deleteNote = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (allNotes.value[path]) {
    allNotes.value[path] = allNotes.value[path].filter(n => n.line !== line)
    saveNotes()
  }
}

// Get note content
const getNoteContent = (line: number): string => {
  const note = currentFileNotes.value.find(n => n.line === line)
  return note?.content || ''
}

// Update note content
const updateNoteContent = (line: number, content: string) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (!allNotes.value[path]) return
  const note = allNotes.value[path].find(n => n.line === line)
  if (note) {
    note.content = content
    saveNotes()
  }
}

// Drag and drop handlers
const onDragStart = (e: DragEvent, line: number) => {
  draggingNoteLine.value = line
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(line))
  }
}

const onDragEnd = () => {
  draggingNoteLine.value = null
}

const onDragOver = (e: DragEvent, targetLine: number) => {
  if (draggingNoteLine.value === null) return
  e.preventDefault()
}

const onDrop = (e: DragEvent, targetLine: number) => {
  if (!selectedFile.value || draggingNoteLine.value === null) return
  const sourceLine = draggingNoteLine.value
  if (sourceLine === targetLine) return
  
  const path = selectedFile.value.path
  if (!allNotes.value[path]) return
  
  const noteIdx = allNotes.value[path].findIndex(n => n.line === sourceLine)
  if (noteIdx < 0) return
  
  // Move note to new line
  allNotes.value[path][noteIdx].line = targetLine
  allNotes.value[path].sort((a, b) => a.line - b.line)
  saveNotes()
  
  draggingNoteLine.value = null
}

// Save notes to localStorage
const saveNotes = () => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes.value))
}

// Get file icon
const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'vue': return '💚'
    case 'ts':
    case 'tsx': return '🔷'
    case 'js':
    case 'jsx': return '🟨'
    case 'css': return '🎨'
    case 'html': return '🌐'
    case 'json': return '📋'
    case 'md': return '📝'
    default: return '📄'
  }
}

// Select file and load content
const selectFile = async (file: SourceFile) => {
  if (file.type !== 'file') return
  selectedFile.value = file
  
  try {
    // Generate the raw file path: replace / with _ and append .txt
    // e.g., "components/AppHeader.vue" -> "components_AppHeader.vue.txt"
    // e.g., "App.vue" -> "App.vue.txt"
    const rawFileName = file.path.replace(/\//g, '_') + '.txt'
    
    // Get base URL for production deployment (e.g., GitHub Pages)
    // @ts-ignore - Vite injects this at build time
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    
    // Try to fetch from raw folder with base URL first (for deployed site)
    let res = await fetch(`${baseUrl}raw/${rawFileName}`)
    
    if (!res.ok) {
      // Try relative path for local development
      res = await fetch(`./raw/${rawFileName}`)
    }
    
    if (!res.ok) {
      // Fallback to direct file path with base URL
      res = await fetch(`${baseUrl}${file.path}`)
    }
    
    if (!res.ok) {
      // Try relative direct file path
      res = await fetch(`./${file.path}`)
    }
    
    if (res.ok) {
      fileContent.value = await res.text()
    } else {
      fileContent.value = `// Could not load file: ${file.path}\n// Tried: ${baseUrl}raw/${rawFileName}`
    }
  } catch (e) {
    fileContent.value = `// Error loading file: ${e}`
  }
}

// Export notes for backup
const exportNotes = () => {
  const blob = new Blob([JSON.stringify(allNotes.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sakura-source-notes.json'
  a.click()
  URL.revokeObjectURL(url)
}

// Import notes from backup
const importNotes = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      allNotes.value = { ...allNotes.value, ...imported }
      saveNotes()
    } catch (err) {
      console.error('Failed to import notes:', err)
    }
  }
  reader.readAsText(file)
}

// Expose for parent backup functionality
defineExpose({
  exportNotes,
  importNotes,
  allNotes
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
