<template>
  <div class="flex flex-col md:flex-row w-full h-full max-w-[1920px] mx-auto overflow-hidden bg-sakura-50/30 backdrop-blur-sm">
    
    <!-- Left Sidebar: Navigation -->
    <aside class="w-full md:w-80 flex-shrink-0 flex flex-col bg-white/70 backdrop-blur-md shadow-xl border-r border-sakura-200 h-full z-20 transition-all duration-300">
      <!-- Header -->
      <div class="p-6 bg-white/60 border-b border-sakura-100 flex-shrink-0">
        <h1 class="text-2xl font-bold text-sakura-600 flex items-center gap-2 cursor-pointer" @click="resetToHome">
          <span class="animate-spin-slow text-3xl">🌸</span> 
          <span class="tracking-tight">Sakura Notes</span>
        </h1>
        <p class="text-xs text-sakura-400 mt-1 ml-10">Personal Space</p>
      </div>

      <!-- View Toggles -->
      <div class="p-3 bg-white/40 border-b border-sakura-100 flex-shrink-0">
        <div class="flex p-1 bg-sakura-100/50 rounded-xl">
          <button 
            @click="switchViewMode('latest')"
            class="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            :class="viewMode === 'latest' ? 'bg-white text-sakura-600 shadow-sm ring-1 ring-sakura-200' : 'text-sakura-400 hover:text-sakura-600 hover:bg-white/50'"
          >
            <span>⏰</span> Latest
          </button>
          <button 
            @click="switchViewMode('files')"
            class="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            :class="viewMode === 'files' ? 'bg-white text-sakura-600 shadow-sm ring-1 ring-sakura-200' : 'text-sakura-400 hover:text-sakura-600 hover:bg-white/50'"
          >
            <span>📁</span> Files
          </button>
        </div>
      </div>

      <!-- File List / Tree -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div v-if="loading" class="flex flex-col items-center justify-center py-10 text-sakura-400">
          <div class="animate-bounce text-2xl mb-2">🌸</div>
          <span class="text-xs font-medium">Reading notes...</span>
        </div>

        <!-- Latest View -->
        <div v-else-if="viewMode === 'latest'" class="space-y-2 pb-20">
           <div v-if="flatFiles.length === 0" class="text-center text-gray-400 py-10 text-sm italic">
            No markdown files found.<br>Push some to your repo!
          </div>
          <div 
            v-for="file in flatFiles" 
            :key="file.path"
            @click="openFile(file)"
            class="group p-3 bg-white/80 border border-sakura-100 rounded-xl hover:border-sakura-300 hover:shadow-md cursor-pointer transition-all duration-200 animate-fade-in relative overflow-hidden"
            :class="{'ring-2 ring-sakura-300 bg-sakura-50': currentFile?.path === file.path}"
          >
             <div class="absolute -right-2 -top-2 text-sakura-100 text-4xl opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform">✿</div>
            <div class="flex justify-between items-start mb-1 relative z-10">
              <span class="font-bold text-gray-700 group-hover:text-sakura-600 truncate pr-2 flex-1">{{ file.name }}</span>
            </div>
             <div class="flex justify-between items-center relative z-10">
               <span class="text-[10px] bg-sakura-100 text-sakura-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {{ formatDate(file.lastModified) }}
               </span>
               <div class="text-[10px] text-gray-400 truncate flex items-center gap-1 max-w-[50%]">
                 <span class="opacity-50">📂</span> {{ getParentPath(file.path) }}
               </div>
             </div>
          </div>
        </div>

        <!-- Tree View -->
        <div v-else class="animate-fade-in pb-20">
          <FileTree 
            :nodes="fileSystem" 
            :expanded-paths="expandedFolders"
            :current-path="currentPath"
            @toggle-folder="toggleFolder"
            @select-file="openFile"
            @select-folder="openFolder"
          />
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-white/60">
      
      <!-- Navbar / Breadcrumbs -->
      <header class="h-16 bg-white/80 backdrop-blur-md border-b border-sakura-100 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div class="flex items-center text-sm overflow-x-auto no-scrollbar whitespace-nowrap mask-linear flex-1 mr-4 py-2">
          <span class="text-sakura-300 mr-2 shrink-0 text-lg cursor-pointer hover:scale-110 transition-transform" @click="resetToHome">🏠</span>
          <span class="text-sakura-200 mx-1">/</span>
          <template v-for="(item, index) in breadcrumbs" :key="item.path">
            <span v-if="index > 0" class="mx-2 text-sakura-300">›</span>
            <span 
              @click="navigateToBreadcrumb(item.path)"
              class="cursor-pointer transition-colors px-2 py-1 rounded-md"
              :class="index === breadcrumbs.length - 1 ? 'font-bold text-sakura-600 bg-sakura-50' : 'text-gray-500 hover:text-sakura-500 hover:bg-sakura-50'"
            >
              {{ item.name }}
            </span>
          </template>
        </div>

        <div class="flex gap-2 shrink-0">
          <button @click="copySource" class="p-2 text-sakura-400 hover:bg-sakura-100 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" title="Copy Markdown Source">
             <span>Copy MD</span>
          </button>
          <button @click="downloadSource" class="p-2 text-sakura-400 hover:bg-sakura-100 hover:text-sakura-600 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold" title="Download">
            <span>Download</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      </header>

      <!-- Content Body -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- Case 1: Displaying a Markdown File -->
        <div v-if="currentFile" id="scroll-container" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-6 md:p-12 relative w-full">
          <div class="max-w-4xl mx-auto w-full bg-white/90 p-8 md:p-12 rounded-2xl shadow-sm border border-sakura-100 min-h-[calc(100%-2rem)] animate-fade-in">
             <!-- Path Badge -->
             <div class="mb-6 text-xs text-sakura-400 bg-sakura-50 inline-block px-3 py-1 rounded-full border border-sakura-100">
                {{ currentFile.path.replace(/\//g, ' > ') }}
             </div>

            <div v-html="renderedContent" class="markdown-body"></div>
            
            <div class="mt-12 pt-8 border-t border-sakura-100 flex justify-between text-xs text-sakura-300">
              <span class="italic">Sakura Notes</span>
              <span>Last updated: {{ formatDate(currentFile.lastModified) }}</span>
            </div>
          </div>
        </div>

        <!-- Case 2: Displaying a Directory Listing -->
        <div v-else-if="currentFolder" class="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div class="max-w-6xl mx-auto">
             <div class="flex items-center gap-4 mb-8">
               <span class="text-6xl">📁</span>
               <div>
                 <h2 class="text-3xl font-bold text-sakura-800">{{ currentFolder.name }}</h2>
                 <p class="text-sakura-400 mt-1">Contains {{ currentFolder.children?.length || 0 }} items</p>
               </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               <!-- Directories first -->
               <div 
                  v-for="child in sortedFolderChildren" 
                  :key="child.path"
                  @click="child.type === 'directory' ? openFolder(child) : openFile(child)"
                  class="folder-card bg-white p-4 rounded-xl shadow-sm border border-sakura-100 hover:shadow-md hover:border-sakura-300 cursor-pointer transition-all duration-200 flex flex-col h-32"
               >
                 <div class="flex items-start justify-between mb-2">
                   <span class="text-3xl">{{ child.type === 'directory' ? '📂' : '📄' }}</span>
                   <span v-if="child.type === 'file'" class="text-[10px] text-gray-400">{{ formatDate(child.lastModified) }}</span>
                 </div>
                 <h3 class="font-bold text-gray-700 truncate" :title="child.name">{{ child.name }}</h3>
                 <p class="text-xs text-sakura-400 mt-auto truncate">
                   {{ child.type === 'directory' ? `${child.children?.length || 0} items` : 'Markdown' }}
                 </p>
               </div>
             </div>
             
             <!-- Empty state -->
             <div v-if="!currentFolder.children?.length" class="text-center py-20 text-gray-400">
               <div class="text-4xl mb-2">🍃</div>
               <p>This folder is empty.</p>
             </div>
           </div>
        </div>

        <!-- Case 3: Home / Welcome State -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-sakura-300 animate-fade-in p-6 text-center">
            <div class="relative">
               <div class="text-9xl mb-6 opacity-80 animate-float">🌸</div>
               <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/5 blur-xl rounded-full"></div>
            </div>
            <h2 class="text-3xl font-bold text-sakura-500 mb-2">Welcome to Sakura Notes</h2>
            <p class="text-sakura-400 max-w-md mx-auto">
              Select a note from the "Latest" tab or explore the "Files" tree to start reading.
            </p>
        </div>

        <!-- TOC Sidebar (Right) -->
        <aside v-if="currentFile && toc.length > 0" class="hidden xl:block w-72 bg-white/40 border-l border-sakura-100 overflow-y-auto custom-scrollbar p-6 backdrop-blur-sm z-10">
          <div class="sticky top-6">
            <h3 class="text-xs font-bold text-sakura-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📑</span> Content Navigation
            </h3>
            <nav class="space-y-1 relative border-l-2 border-sakura-100 pl-4">
               <!-- Active Indicator -->
              <div 
                class="absolute left-[-2px] w-[2px] bg-sakura-500 transition-all duration-300"
                :style="{ top: activeIndicatorTop + 'px', height: '24px' }"
                v-if="activeHeaderId"
              ></div>

              <a 
                v-for="item in toc" 
                :key="item.id"
                :href="`#${item.id}`"
                :id="`toc-${item.id}`"
                class="block text-sm py-1 transition-all duration-200 leading-tight"
                :class="[
                  item.level === 1 ? 'font-bold mb-2 mt-2' : 'font-normal',
                  item.level > 1 ? `ml-${(item.level-1)*2}` : '',
                  activeHeaderId === item.id 
                    ? 'text-sakura-600 translate-x-1' 
                    : 'text-gray-500 hover:text-sakura-400'
                ]"
                @click.prevent="scrollToHeader(item.id)"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { MOCK_FILE_SYSTEM } from './constants';
import { FileNode, NodeType, BreadcrumbItem, TocItem } from './types';
import FileTree from './components/FileTree.vue';

// --- State ---
const fileSystem = ref<FileNode[]>([]);
const currentFile = ref<FileNode | null>(null);
const currentFolder = ref<FileNode | null>(null); // For directory view
const viewMode = ref<'latest' | 'files'>('latest');
const expandedFolders = ref<string[]>([]);
const toc = ref<TocItem[]>([]);
const activeHeaderId = ref<string>('');
const loading = ref(true);

// --- Computed ---
const currentPath = computed(() => {
  if (currentFile.value) return currentFile.value.path;
  if (currentFolder.value) return currentFolder.value.path;
  return '';
});

const flatFiles = computed(() => {
  const flatten = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = [];
    for (const node of nodes) {
      if (node.type === NodeType.FILE) {
        files.push(node);
      } else if (node.children) {
        files = files.concat(flatten(node.children));
      }
    }
    return files;
  };
  return flatten(fileSystem.value).sort((a, b) => {
    return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime();
  });
});

const sortedFolderChildren = computed(() => {
  if (!currentFolder.value || !currentFolder.value.children) return [];
  // Folders first, then files
  return [...currentFolder.value.children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === NodeType.DIRECTORY ? -1 : 1;
  });
});

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = currentPath.value;
  if (!path) return [];
  const parts = path.split('/');
  return parts.map((part, index) => ({
    name: part,
    path: parts.slice(0, index + 1).join('/')
  }));
});

const renderedContent = computed(() => {
  if (!currentFile.value?.content) return '';
  // @ts-ignore: marked loaded globally via CDN
  return window.marked ? window.marked.parse(currentFile.value.content) : currentFile.value.content;
});

const activeIndicatorTop = computed(() => {
  if (!activeHeaderId.value) return 0;
  const idx = toc.value.findIndex(t => t.id === activeHeaderId.value);
  // Approximation of position based on list items
  return idx * 24; // Assuming approx height
});

// --- Helpers ---
const getParentPath = (path: string) => {
  const parts = path.split('/');
  return parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// Find a node in the tree by path
const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

// --- Actions ---
const expandToPath = (path: string) => {
  const parts = path.split('/');
  let pathBuilder = '';
  const newExpanded = new Set(expandedFolders.value);
  // Expand all parents
  for (let i = 0; i < parts.length - 1; i++) {
    pathBuilder += (i === 0 ? '' : '/') + parts[i];
    newExpanded.add(pathBuilder);
  }
  // Also expand self if it is a directory
  if (currentFolder.value && currentFolder.value.path === path) {
    newExpanded.add(path);
  }
  expandedFolders.value = Array.from(newExpanded);
};

const openFile = (file: FileNode) => {
  currentFile.value = file;
  currentFolder.value = null;
  // Note: We do NOT switch viewMode automatically if clicking from "Latest". 
  // User stays in their context.
  // But if we are in Files mode, we ensure it's expanded.
  if (viewMode.value === 'files') {
    expandToPath(file.path);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const openFolder = (folder: FileNode) => {
  currentFile.value = null;
  currentFolder.value = folder;
  
  // When opening a folder explicitly (e.g. from breadcrumb or tree), 
  // we likely want to see the tree structure.
  viewMode.value = 'files';
  expandToPath(folder.path);
};

const toggleFolder = (path: string) => {
  const idx = expandedFolders.value.indexOf(path);
  if (idx === -1) expandedFolders.value.push(path);
  else expandedFolders.value.splice(idx, 1);
};

const switchViewMode = (mode: 'latest' | 'files') => {
  viewMode.value = mode;
  // If switching to Files, ensure current selection is visible in tree
  if (mode === 'files' && currentPath.value) {
    expandToPath(currentPath.value);
  }
};

const navigateToBreadcrumb = (path: string) => {
  const node = findNodeByPath(fileSystem.value, path);
  if (!node) return;

  if (node.type === NodeType.DIRECTORY) {
    openFolder(node);
  } else {
    openFile(node);
  }
};

const resetToHome = () => {
  currentFile.value = null;
  currentFolder.value = null;
  viewMode.value = 'latest';
};

const copySource = () => {
  const content = currentFile.value?.content;
  if (content) {
    navigator.clipboard.writeText(content).then(() => {
      alert("Markdown copied to clipboard! 🌸");
    });
  }
};

const downloadSource = () => {
  if (currentFile.value) {
    downloadFile(currentFile.value.name, currentFile.value.content || '');
  } else if (currentFolder.value) {
    // Maybe download a JSON of the structure? Or just ignore.
  }
};

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// --- TOC & Scroll ---
const generateToc = () => {
  if (!currentFile.value?.content) {
    toc.value = [];
    return;
  }
  const headers: TocItem[] = [];
  const lines = currentFile.value.content.split('\n');
  let inCodeBlock = false;
  lines.forEach(line => {
    if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock;
    if (inCodeBlock) return;
    const match = line.match(/^(#{1,3})\s+(.*)$/);
    if (match) {
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-'); // Support Chinese chars
      headers.push({ id, text, level: match[1].length });
    }
  });
  toc.value = headers;
};

const updateActiveHeader = () => {
  const container = document.getElementById('scroll-container');
  if (!container) return;
  
  const scrollPosition = container.scrollTop;
  let active = '';
  
  for (const item of toc.value) {
    const el = document.getElementById(item.id); // Elements inside markdown body
    // marked usually generates id="header-text"
    if (el && el.offsetTop - 150 <= scrollPosition) {
      active = item.id;
    }
  }
  if (active) activeHeaderId.value = active;
};

const scrollToHeader = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

watch(currentFile, () => {
  generateToc();
  // Reset scroll
  setTimeout(() => {
    const container = document.getElementById('scroll-container');
    if (container) container.scrollTop = 0;
  }, 50);
});

// --- Lifecycle ---
onMounted(async () => {
  try {
    // Add timestamp to prevent caching issues on GitHub Pages
    const res = await fetch(`./files.json?t=${Date.now()}`);
    if (res.ok) {
      fileSystem.value = await res.json();
    } else {
      throw new Error("No index");
    }
  } catch (e) {
    console.warn("Using mock data (failed to load files.json)", e);
    fileSystem.value = MOCK_FILE_SYSTEM;
  } finally {
    loading.value = false;
  }

  const container = document.getElementById('scroll-container');
  // Re-attach scroll listener when container appears
  watch(currentFile, (_, __, onCleanup) => {
    setTimeout(() => {
      const el = document.getElementById('scroll-container');
      if (el) el.addEventListener('scroll', updateActiveHeader);
    }, 100);
  });
});
</script>