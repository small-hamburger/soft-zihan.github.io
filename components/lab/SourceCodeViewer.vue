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
        <div class="ml-auto flex items-center gap-3">
          <button 
            @click="showNotes = !showNotes"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
            :class="showNotes ? 'bg-sakura-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
          >
            <span>📝</span>
            {{ isZh ? '笔记' : 'Notes' }}
          </button>
          <!-- Submit Notes to GitHub -->
          <button 
            v-if="hasUserNotes && hasToken"
            @click="submitNotesToGitHub"
            :disabled="isSubmitting"
            class="text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600"
          >
            <span v-if="isSubmitting" class="animate-spin">⏳</span>
            <span v-else>📤</span>
            {{ isZh ? '提交笔记' : 'Submit' }}
          </button>
        </div>
      </div>

      <!-- Code Content with Inline Notes -->
      <div class="flex-1 overflow-auto bg-[#1e1e1e] custom-scrollbar relative" ref="codeContainer">
        <div v-if="selectedFile && fileContent" class="py-4">
          <!-- Line 0 note (before first line) -->
          <template v-if="showNotes && hasAnyNoteAtLine(0) && !isLineCollapsed(0)">
            <div 
              v-if="hasPresetNoteAtLine(0)"
              class="flex mx-4 my-1"
            >
              <div class="w-12"></div>
              <div class="flex-1 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/50 shadow-sm">
                <div class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ getPresetNoteContent(0) }}</div>
              </div>
            </div>
            <div 
              v-if="hasUserNoteAtLine(0)"
              class="flex mx-4 my-1"
              draggable="true"
              @dragstart="onDragStart($event, 0)"
              @dragend="onDragEnd"
            >
              <div class="w-12"></div>
              <div class="flex-1 bg-gradient-to-r from-sakura-50 to-amber-50 dark:from-sakura-900/30 dark:to-amber-900/20 rounded-lg p-3 border border-sakura-200 dark:border-sakura-700/50 shadow-sm group relative">
                <div class="absolute -left-6 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-sakura-400">⋮⋮</div>
                <div class="flex items-end justify-end gap-2 mb-1">
                  <button @click="deleteUserNote(0)" class="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                </div>
                <textarea :value="getUserNoteContent(0)" @input="handleNoteInput($event, 0)" class="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 overflow-hidden" :placeholder="isZh ? '在此输入笔记...' : 'Type your note here...'" rows="1"></textarea>
              </div>
            </div>
          </template>
          
          <!-- Render each line with possible inline note -->
          <template v-for="(line, idx) in fileLines" :key="idx">
            <!-- Drop indicator line -->
            <div 
              v-if="showNotes && dragOverLine === idx + 1 && draggingNoteLine !== idx + 1"
              class="h-1 mx-4 bg-sakura-400 rounded-full animate-pulse"
            ></div>
            
            <!-- Code Line -->
            <div 
              class="flex hover:bg-[#2a2d2e] group"
              :class="{ 'bg-sakura-900/20': hasNonEmptyNoteAtLine(idx + 1) && !isLineCollapsed(idx + 1) }"
              @dragover.prevent="onDragOver($event, idx + 1)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop($event, idx + 1)"
            >
              <!-- Line Number - click to toggle notes -->
              <div 
                class="flex-shrink-0 w-12 pl-4 pr-2 text-right select-none font-mono text-xs leading-6 cursor-pointer transition-colors"
                :class="getLineNumberClass(idx + 1)"
                @click="toggleNoteAtLine(idx + 1)"
              >
                {{ idx + 1 }}</div>
              <!-- Code Content -->
              <pre 
                class="flex-1 pr-4 text-sm font-mono leading-6 whitespace-pre-wrap break-all"
              ><code v-html="highlightLine(line)" class="hljs"></code></pre>
            </div>
            
            <!-- Preset Note (below the line) - Blue/Cyan theme -->
            <div 
              v-if="showNotes && hasPresetNoteAtLine(idx + 1) && !isLineCollapsed(idx + 1)"
              class="flex mx-4 my-1"
            >
              <div class="w-8"></div>
              <div class="flex-1 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/50 shadow-sm">
                <div class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ getPresetNoteContent(idx + 1) }}</div>
              </div>
            </div>
            
            <!-- User Note (below the line) - Pink/Sakura theme -->
            <div 
              v-if="showNotes && hasUserNoteAtLine(idx + 1) && !isLineCollapsed(idx + 1)"
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
                <div class="flex items-end justify-end gap-2 mb-1">
                  <button 
                    @click="deleteUserNote(idx + 1)"
                    class="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
                <textarea
                  :value="getUserNoteContent(idx + 1)"
                  @input="handleNoteInput($event, idx + 1)"
                  class="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 overflow-hidden"
                  :placeholder="isZh ? '在此输入笔记...' : 'Type your note here...'"
                  rows="1"
                ></textarea>
              </div>
            </div>
          </template>
          
          <!-- Drop indicator at the end -->
          <div 
            v-if="showNotes && dragOverLine === fileLines.length + 1"
            class="h-1 mx-4 bg-sakura-400 rounded-full animate-pulse"
          ></div>
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
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-cyan-400/50"></span>
            {{ isZh ? '预置笔记' : 'Preset' }}
          </span>
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-sakura-400/50"></span>
            {{ isZh ? '我的笔记' : 'My Notes' }}
          </span>
        </div>
        <span>💡 {{ isZh ? '点击行号展开/折叠笔记，拖拽可移动' : 'Click line number to toggle, drag to move' }}</span>
      </div>
    </div>
  </div>
  
  <!-- Submit Result Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="submitMessage" 
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-xl text-sm font-medium"
        :class="submitSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        {{ submitMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import { useGitHubPublish } from '../../composables/useGitHubPublish'

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

interface CollapsedState {
  [filePath: string]: number[] // array of collapsed line numbers
}

const props = defineProps<{
  lang: 'en' | 'zh'
}>()

const isZh = computed(() => props.lang === 'zh')

// GitHub API
const { hasToken: checkHasToken, uploadFile, getToken } = useGitHubPublish()
const hasToken = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

onMounted(() => {
  hasToken.value = checkHasToken()
})

// Project file tree (hardcoded for this project) - without root level
const projectTree = ref<SourceFile[]>([
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
              { name: 'SourceCodeViewer.vue', path: 'components/lab/SourceCodeViewer.vue', type: 'file' },
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
          { name: 'useTokenSecurity.ts', path: 'composables/useTokenSecurity.ts', type: 'file' },
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
])

const selectedFile = ref<SourceFile | null>(null)
const fileContent = ref<string>('')
const showNotes = ref(true)
const codeContainer = ref<HTMLElement | null>(null)

// Drag state
const draggingNoteLine = ref<number | null>(null)
const dragOverLine = ref<number | null>(null)

// Notes storage keys
const USER_NOTES_KEY = 'sakura_source_code_notes_user'
const COLLAPSED_KEY = 'sakura_source_code_notes_collapsed'
const PRESET_VERSION_KEY = 'sakura_source_code_notes_preset_version'

// Preset notes (from server)
const presetNotes = ref<FileNotes>({})

// User notes (from localStorage)
const userNotes = ref<FileNotes>({})

// Collapsed state (from localStorage)
const collapsedState = ref<CollapsedState>({})

// Load preset notes from server
const loadPresetNotes = async () => {
  try {
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    let res = await fetch(`${baseUrl}source-notes-preset.json`)
    if (!res.ok) {
      res = await fetch('./source-notes-preset.json')
    }
    if (res.ok) {
      const data = await res.json()
      const serverVersion = data.version || '1.0.0'
      const localVersion = localStorage.getItem(PRESET_VERSION_KEY)
      
      // Store preset notes
      presetNotes.value = data.notes || {}
      
      // Update version marker
      localStorage.setItem(PRESET_VERSION_KEY, serverVersion)
    }
  } catch (e) {
    console.error('Failed to load preset notes:', e)
  }
}

// Load user notes from localStorage
const loadUserNotes = () => {
  const saved = localStorage.getItem(USER_NOTES_KEY)
  if (saved) {
    try {
      userNotes.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse user notes:', e)
    }
  }
}

// Load collapsed state from localStorage
const loadCollapsedState = () => {
  const saved = localStorage.getItem(COLLAPSED_KEY)
  if (saved) {
    try {
      collapsedState.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse collapsed state:', e)
    }
  }
}

// Save user notes
const saveUserNotes = () => {
  localStorage.setItem(USER_NOTES_KEY, JSON.stringify(userNotes.value))
}

// Save collapsed state
const saveCollapsedState = () => {
  localStorage.setItem(COLLAPSED_KEY, JSON.stringify(collapsedState.value))
}

// Initialize
onMounted(async () => {
  await loadPresetNotes()
  loadUserNotes()
  loadCollapsedState()
})

// Current file notes
const currentPresetNotes = computed(() => {
  if (!selectedFile.value) return []
  return presetNotes.value[selectedFile.value.path] || []
})

const currentUserNotes = computed(() => {
  if (!selectedFile.value) return []
  return userNotes.value[selectedFile.value.path] || []
})

const currentCollapsedLines = computed(() => {
  if (!selectedFile.value) return []
  return collapsedState.value[selectedFile.value.path] || []
})

// Check if user has any notes
const hasUserNotes = computed(() => {
  return Object.values(userNotes.value).some(notes => notes.length > 0)
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

// Check if line has preset note
const hasPresetNoteAtLine = (line: number) => {
  return currentPresetNotes.value.some(n => n.line === line)
}

// Check if line has user note
const hasUserNoteAtLine = (line: number) => {
  return currentUserNotes.value.some(n => n.line === line)
}

// Check if line has any note
const hasAnyNoteAtLine = (line: number) => {
  return hasPresetNoteAtLine(line) || hasUserNoteAtLine(line)
}

// Check if line has non-empty note (for highlighting)
const hasNonEmptyNoteAtLine = (line: number) => {
  const hasPreset = currentPresetNotes.value.some(n => n.line === line && n.content.trim())
  const hasUser = currentUserNotes.value.some(n => n.line === line && n.content.trim())
  return hasPreset || hasUser
}

// Check if line is collapsed
const isLineCollapsed = (line: number) => {
  return currentCollapsedLines.value.includes(line)
}

// Get line number class - only highlight if note has content
const getLineNumberClass = (line: number) => {
  const hasPreset = currentPresetNotes.value.some(n => n.line === line && n.content.trim())
  const hasUser = currentUserNotes.value.some(n => n.line === line && n.content.trim())
  
  if (hasPreset || hasUser) {
    if (hasPreset && hasUser) {
      // Both types - purple highlight
      return 'text-purple-400 font-bold bg-purple-900/20'
    } else if (hasPreset) {
      // Preset only - cyan highlight
      return 'text-cyan-400 font-bold bg-cyan-900/20'
    } else {
      // User only - sakura highlight  
      return 'text-sakura-400 font-bold bg-sakura-900/20'
    }
  }
  return 'text-gray-600 hover:text-gray-400'
}

// Toggle note at line
const toggleNoteAtLine = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  
  const hasPreset = hasPresetNoteAtLine(line)
  const hasUser = hasUserNoteAtLine(line)
  const isCollapsed = isLineCollapsed(line)
  
  if (hasPreset || hasUser) {
    // Has note(s) - toggle collapse
    if (!collapsedState.value[path]) {
      collapsedState.value[path] = []
    }
    
    if (isCollapsed) {
      // Expand
      collapsedState.value[path] = collapsedState.value[path].filter(l => l !== line)
    } else {
      // Collapse - if user note is empty, delete it instead
      if (hasUser) {
        const userNote = currentUserNotes.value.find(n => n.line === line)
        if (userNote && !userNote.content.trim()) {
          // Empty user note - delete it
          userNotes.value[path] = userNotes.value[path].filter(n => n.line !== line)
          saveUserNotes()
          return
        }
      }
      collapsedState.value[path].push(line)
    }
    saveCollapsedState()
  } else {
    // No note - create new user note
    if (!userNotes.value[path]) {
      userNotes.value[path] = []
    }
    userNotes.value[path].push({ line, content: '' })
    userNotes.value[path].sort((a, b) => a.line - b.line)
    saveUserNotes()
    
    // Make sure it's not collapsed
    if (collapsedState.value[path]) {
      collapsedState.value[path] = collapsedState.value[path].filter(l => l !== line)
      saveCollapsedState()
    }
  }
}

// Delete user note
const deleteUserNote = (line: number) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (userNotes.value[path]) {
    userNotes.value[path] = userNotes.value[path].filter(n => n.line !== line)
    saveUserNotes()
  }
}

// Get preset note content
const getPresetNoteContent = (line: number): string => {
  const note = currentPresetNotes.value.find(n => n.line === line)
  return note?.content || ''
}

// Get user note content
const getUserNoteContent = (line: number): string => {
  const note = currentUserNotes.value.find(n => n.line === line)
  return note?.content || ''
}

// Update user note content
const updateUserNoteContent = (line: number, content: string) => {
  if (!selectedFile.value) return
  const path = selectedFile.value.path
  if (!userNotes.value[path]) return
  const note = userNotes.value[path].find(n => n.line === line)
  if (note) {
    note.content = content
    saveUserNotes()
  }
}

// Handle note input with auto-resize
const handleNoteInput = (event: Event, line: number) => {
  const textarea = event.target as HTMLTextAreaElement
  updateUserNoteContent(line, textarea.value)
  // Auto resize
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
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
  dragOverLine.value = null
}

const onDragOver = (e: DragEvent, targetLine: number) => {
  if (draggingNoteLine.value === null) return
  e.preventDefault()
  dragOverLine.value = targetLine
}

const onDragLeave = () => {
  // Small delay to prevent flicker when moving between lines
  setTimeout(() => {
    if (dragOverLine.value !== null) {
      // Will be updated by next dragover
    }
  }, 50)
}

const onDrop = (e: DragEvent, targetLine: number) => {
  if (!selectedFile.value || draggingNoteLine.value === null) return
  const sourceLine = draggingNoteLine.value
  if (sourceLine === targetLine) {
    dragOverLine.value = null
    draggingNoteLine.value = null
    return
  }
  
  const path = selectedFile.value.path
  if (!userNotes.value[path]) {
    dragOverLine.value = null
    draggingNoteLine.value = null
    return
  }
  
  const noteIdx = userNotes.value[path].findIndex(n => n.line === sourceLine)
  if (noteIdx < 0) {
    dragOverLine.value = null
    draggingNoteLine.value = null
    return
  }
  
  // Move note to new line
  userNotes.value[path][noteIdx].line = targetLine
  userNotes.value[path].sort((a, b) => a.line - b.line)
  saveUserNotes()
  
  // Also update collapsed state if needed
  if (collapsedState.value[path]) {
    const collapsedIdx = collapsedState.value[path].indexOf(sourceLine)
    if (collapsedIdx >= 0) {
      collapsedState.value[path][collapsedIdx] = targetLine
      saveCollapsedState()
    }
  }
  
  dragOverLine.value = null
  draggingNoteLine.value = null
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
    const rawFileName = file.path.replace(/\//g, '_') + '.txt'
    const baseUrl = (import.meta as any).env?.BASE_URL || '/'
    
    let res = await fetch(`${baseUrl}raw/${rawFileName}`)
    
    if (!res.ok) {
      res = await fetch(`./raw/${rawFileName}`)
    }
    
    if (!res.ok) {
      res = await fetch(`${baseUrl}${file.path}`)
    }
    
    if (!res.ok) {
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

// Submit notes to GitHub via PR
const submitNotesToGitHub = async () => {
  if (!hasUserNotes.value || isSubmitting.value) return
  
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    const token = await getToken()
    if (!token) {
      submitMessage.value = isZh.value ? '请先配置 GitHub Token' : 'Please configure GitHub Token first'
      submitSuccess.value = false
      return
    }
    
    const repoOwner = localStorage.getItem('github_repo_owner') || 'soft-zihan'
    const repoName = localStorage.getItem('github_repo_name') || 'soft-zihan.github.io'
    const authorName = localStorage.getItem('author_name') || 'Anonymous'
    
    // Merge user notes into preset format for PR
    const mergedNotes: FileNotes = { ...presetNotes.value }
    
    for (const [filePath, notes] of Object.entries(userNotes.value)) {
      if (!mergedNotes[filePath]) {
        mergedNotes[filePath] = []
      }
      for (const note of notes) {
        if (note.content.trim()) {
          // Check if there's already a note at this line
          const existingIdx = mergedNotes[filePath].findIndex(n => n.line === note.line)
          if (existingIdx >= 0) {
            // Append to existing note
            mergedNotes[filePath][existingIdx].content += '\n\n---\n' + note.content
          } else {
            mergedNotes[filePath].push({ line: note.line, content: note.content })
          }
        }
      }
      mergedNotes[filePath].sort((a, b) => a.line - b.line)
    }
    
    const presetData = {
      version: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: mergedNotes
    }
    
    const content = JSON.stringify(presetData, null, 2)
    
    const result = await uploadFile(
      { owner: repoOwner, repo: repoName, branch: 'main', token },
      'public/source-notes-preset.json',
      content,
      `docs: add source code notes by ${authorName}`
    )
    
    if (result.success) {
      submitMessage.value = isZh.value 
        ? `笔记已提交！${result.isPR ? 'PR 已创建' : '已直接合并'}`
        : `Notes submitted! ${result.isPR ? 'PR created' : 'Merged directly'}`
      submitSuccess.value = true
    } else {
      submitMessage.value = result.message
      submitSuccess.value = false
    }
  } catch (e) {
    submitMessage.value = isZh.value ? '提交失败，请稍后重试' : 'Submit failed, please try again'
    submitSuccess.value = false
  } finally {
    isSubmitting.value = false
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  }
}

// Export notes for backup
const exportNotes = () => {
  const data = {
    userNotes: userNotes.value,
    collapsedState: collapsedState.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
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
      if (imported.userNotes) {
        userNotes.value = { ...userNotes.value, ...imported.userNotes }
        saveUserNotes()
      }
      if (imported.collapsedState) {
        collapsedState.value = { ...collapsedState.value, ...imported.collapsedState }
        saveCollapsedState()
      }
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
  userNotes,
  presetNotes
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
