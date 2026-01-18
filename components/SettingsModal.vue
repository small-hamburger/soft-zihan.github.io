<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full animate-fade-in border border-white/50 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6">{{ t.settings_title }}</h3>
      
      <!-- Banner Mode -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.banner_settings || 'Banner Mode' }}</label>
          <div class="grid grid-cols-2 gap-2">
            <button @click="settings.bannerMode = 'normal'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'normal' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🖼️</span> {{ t.banner_normal || 'Normal' }}
            </button>
            <button @click="settings.bannerMode = 'fullscreen'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'fullscreen' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🖥️</span> {{ t.banner_fullscreen || 'Full' }}
            </button>
            <button @click="settings.bannerMode = 'background'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'background' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🎨</span> {{ t.banner_background || 'BG' }}
            </button>
            <button @click="settings.bannerMode = 'hide'" class="py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2" :class="settings.bannerMode === 'hide' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">
              <span>🚫</span> {{ t.banner_hide || 'Hide' }}
            </button>
          </div>
      </div>

      <!-- Wallpaper Switcher -->
      <div class="mb-6">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.banner_background || 'Wallpaper' }}</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="wp in currentThemeWallpapers"
            :key="wp.filename"
            @click="setWallpaper(wp.filename)"
            class="relative rounded-xl overflow-hidden border transition-all"
            :class="wp.filename === appStore.currentWallpaperFilename ? 'border-sakura-500 ring-2 ring-sakura-300' : 'border-gray-200 dark:border-gray-700'"
          >
            <img :src="wp.path" :alt="wp.name" class="w-full h-16 object-cover" />
            <div class="absolute inset-0 bg-black/10"></div>
          </button>
        </div>
      </div>

      <!-- Font Family -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.font_style }}</label>
          <div class="flex gap-2">
            <button @click="settings.fontFamily = 'sans'" class="flex-1 py-3 border rounded-xl transition-colors" :class="settings.fontFamily === 'sans' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">Sans</button>
            <button @click="settings.fontFamily = 'serif'" class="flex-1 py-3 border rounded-xl font-serif transition-colors" :class="settings.fontFamily === 'serif' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">Serif</button>
          </div>
      </div>

      <!-- Font Size -->
      <div class="mb-6">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.font_size }}</label>
          <div class="flex gap-2">
            <button @click="settings.fontSize = 'small'" class="flex-1 py-3 border rounded-xl text-xs transition-colors" :class="settings.fontSize === 'small' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A</button>
            <button @click="settings.fontSize = 'normal'" class="flex-1 py-3 border rounded-xl text-base transition-colors" :class="settings.fontSize === 'normal' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A+</button>
            <button @click="settings.fontSize = 'large'" class="flex-1 py-3 border rounded-xl text-xl transition-colors" :class="settings.fontSize === 'large' ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'">A++</button>
          </div>
      </div>

      <!-- GitHub Configuration -->
      <div class="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">GitHub {{ t.connection || '连接' }}</label>
        
        <!-- Token Status -->
        <div class="flex items-center gap-2 mb-3 p-2 rounded-lg" :class="hasToken ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'">
          <div class="w-2 h-2 rounded-full" :class="hasToken ? 'bg-green-500' : 'bg-yellow-500'"></div>
          <span class="text-sm" :class="hasToken ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">
            {{ hasToken ? (t.github_connected || 'GitHub 已连接') : (t.github_not_connected || '未配置 Token') }}
          </span>
        </div>
        
        <!-- Token Input -->
        <div class="mb-3">
          <input 
            v-model="tokenInput"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxx"
            class="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
          <p class="text-xs text-gray-400 mt-1">{{ t.token_hint || '需要 repo 权限的 Personal Access Token' }}</p>
        </div>
        
        <!-- Repo Settings -->
        <div class="flex items-center gap-2 mb-3">
          <input v-model="repoOwner" type="text" placeholder="Owner" class="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900" />
          <span class="text-gray-400">/</span>
          <input v-model="repoName" type="text" placeholder="Repo" class="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900" />
        </div>
        
        <!-- Author Settings -->
        <div class="mb-3">
          <label class="block text-xs text-gray-500 mb-1">{{ t.author_name || '作者名称' }}</label>
          <input 
            v-model="authorName"
            type="text"
            placeholder="your-name"
            class="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
        
        <div class="mb-3">
          <label class="block text-xs text-gray-500 mb-1">{{ t.author_url || '作者链接 (可选)' }}</label>
          <input 
            v-model="authorUrl"
            type="text"
            placeholder="https://github.com/username"
            class="w-full px-3 py-2 text-sm border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
        
        <button 
          @click="saveGitHubConfig"
          class="w-full py-2 border rounded-xl text-sm transition-colors border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20 text-sakura-600 dark:text-sakura-400 hover:bg-sakura-100 dark:hover:bg-sakura-900/30"
        >
          {{ t.save_config || '保存配置' }}
        </button>
      </div>

      <!-- Backup & Restore -->
      <div class="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t.backup_title || '云端备份' }}</label>
        
        <!-- Warning Notice -->
        <div class="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-600 dark:text-amber-400">
          ⚠️ {{ t.backup_warning || '备份不包含 GitHub Token，恢复后需重新配置' }}
        </div>
        
        <!-- Backup Button -->
        <button 
          @click="handleBackup"
          :disabled="isBackingUp || !hasToken || !authorName.trim()"
          class="w-full py-2 mb-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          :class="hasToken && authorName.trim() ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'"
        >
          <span v-if="isBackingUp" class="animate-spin">⏳</span>
          <span v-else>☁️</span>
          {{ isBackingUp ? (t.backing_up || '备份中...') : (t.backup_now || '立即备份') }}
        </button>
        
        <p v-if="!hasToken" class="text-xs text-amber-500 mb-2">
          {{ t.backup_need_token || '请先配置 GitHub Token' }}
        </p>
        <p v-else-if="!authorName.trim()" class="text-xs text-amber-500 mb-2">
          {{ t.backup_need_author || '请先填写作者名称' }}
        </p>
        
        <!-- Backup List Toggle -->
        <button 
          @click="toggleBackupList"
          :disabled="!hasToken"
          class="w-full py-2 border rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          :class="hasToken ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30' : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'"
        >
          <span>📋</span>
          {{ showBackupList ? (t.hide_backups || '隐藏备份列表') : (t.show_backups || '查看备份列表') }}
        </button>
        
        <!-- Backup List -->
        <div v-if="showBackupList && backupList.length > 0" class="mt-3 max-h-40 overflow-y-auto border rounded-xl border-gray-200 dark:border-gray-700">
          <div 
            v-for="backup in backupList" 
            :key="backup.name"
            class="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {{ parseBackupFilename(backup.name).author }}
              </p>
              <p class="text-xs text-gray-400">
                {{ parseBackupFilename(backup.name).date }}
              </p>
            </div>
            <div class="flex gap-1 ml-2">
              <button 
                @click="handleRestore(backup.name)"
                :disabled="isRestoring"
                class="px-2 py-1 text-xs rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200"
              >
                {{ t.restore || '恢复' }}
              </button>
              <button 
                @click="handleDelete(backup)"
                class="px-2 py-1 text-xs rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
        
        <div v-else-if="showBackupList" class="mt-3 text-center text-sm text-gray-400 py-4">
          {{ t.no_backups || '暂无备份' }}
        </div>
        
        <!-- Backup Message -->
        <p v-if="backupMessage" class="mt-2 text-xs" :class="backupSuccess ? 'text-green-500' : 'text-red-500'">
          {{ backupMessage }}
        </p>
      </div>

      <button @click="$emit('close')" class="w-full py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold shadow-lg transition-colors">{{ t.done }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWallpapers } from '../composables/useWallpapers'
import { useBackup } from '../composables/useBackup'
import { useAppStore } from '../stores/appStore'

defineProps<{
  t: any;
  isDark: boolean;
  settings: {
    fontSize: string;
    fontFamily: string;
    petalSpeed: string;
    bannerMode?: string;
  };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const appStore = useAppStore()
const { currentThemeWallpapers, setWallpaper } = useWallpapers()

// GitHub Configuration
const tokenInput = ref('')
const repoOwner = ref('soft-zihan')
const repoName = ref('soft-zihan.github.io')
const authorName = ref('')
const authorUrl = ref('')

const hasToken = computed(() => !!localStorage.getItem('github_pat'))

const saveGitHubConfig = () => {
  if (tokenInput.value) {
    localStorage.setItem('github_pat', tokenInput.value)
  }
  if (repoOwner.value) {
    localStorage.setItem('github_repo_owner', repoOwner.value)
  }
  if (repoName.value) {
    localStorage.setItem('github_repo_name', repoName.value)
  }
  if (authorName.value) {
    localStorage.setItem('author_name', authorName.value)
  }
  if (authorUrl.value) {
    localStorage.setItem('author_url', authorUrl.value)
  }
  backupMessage.value = '配置已保存'
  backupSuccess.value = true
  setTimeout(() => { backupMessage.value = '' }, 2000)
}

// Backup functionality
const { 
  isBackingUp, 
  isRestoring, 
  backupList, 
  backupToGitHub, 
  listBackups, 
  restoreFromGitHub, 
  deleteBackup,
  parseBackupFilename 
} = useBackup()

const showBackupList = ref(false)
const backupMessage = ref('')
const backupSuccess = ref(false)

const handleBackup = async () => {
  if (!authorName.value.trim()) {
    backupMessage.value = '请填写作者名称'
    backupSuccess.value = false
    return
  }
  
  const result = await backupToGitHub(repoOwner.value, repoName.value, authorName.value)
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  if (result.success) {
    await listBackups(repoOwner.value, repoName.value)
  }
}

const toggleBackupList = async () => {
  showBackupList.value = !showBackupList.value
  if (showBackupList.value) {
    await listBackups(repoOwner.value, repoName.value)
  }
}

const handleRestore = async (filename: string) => {
  if (!confirm('确定要恢复此备份吗？当前设置将被覆盖。恢复后需要刷新页面。')) {
    return
  }
  
  const result = await restoreFromGitHub(repoOwner.value, repoName.value, filename)
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  if (result.success) {
    if (confirm('恢复成功！是否立即刷新页面以应用更改？')) {
      window.location.reload()
    }
  }
}

const handleDelete = async (backup: any) => {
  if (!confirm(\`确定要删除备份 "\${parseBackupFilename(backup.name).author}" 吗？\`)) {
    return
  }
  
  const result = await deleteBackup(repoOwner.value, repoName.value, backup.name, backup.sha)
  backupMessage.value = result.message
  backupSuccess.value = result.success
  
  if (result.success) {
    await listBackups(repoOwner.value, repoName.value)
  }
}

onMounted(() => {
  // Load saved config
  tokenInput.value = localStorage.getItem('github_pat') || ''
  repoOwner.value = localStorage.getItem('github_repo_owner') || 'soft-zihan'
  repoName.value = localStorage.getItem('github_repo_name') || 'soft-zihan.github.io'
  authorName.value = localStorage.getItem('author_name') || ''
  authorUrl.value = localStorage.getItem('author_url') || ''
  
  // Preload backup list
  if (hasToken.value) {
    listBackups(repoOwner.value, repoName.value)
  }
})
</script>
