<template>
  <div class="bg-white/80 p-6 rounded-2xl border border-sakura-200 shadow-sm backdrop-blur-md">
    <h3 class="text-xl font-bold text-sakura-800 mb-4 flex items-center gap-2">
      🧪 Reactivity Playground
    </h3>
    <p class="text-xs text-gray-500 mb-6">Type in the JS box to see how Data drives the View.</p>

    <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
      <!-- JavaScript / Data Model -->
      <div class="flex-1 w-full relative group">
        <div class="absolute -top-3 left-4 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">JavaScript (Model)</div>
        <div class="bg-[#1e1e1e] p-4 rounded-xl shadow-lg border-2 border-transparent group-hover:border-sakura-300 transition-colors font-mono text-sm text-blue-300">
          <div class="mb-2 text-gray-400">// const msg = ref('...')</div>
          <span class="text-purple-400">msg</span>.<span class="text-blue-400">value</span> = "
          <input 
            v-model="message" 
            class="bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-sakura-500 min-w-[100px]"
          />
          "
        </div>
      </div>

      <!-- Arrow -->
      <div class="flex flex-col items-center gap-1 text-sakura-400">
        <span class="text-xs font-bold uppercase tracking-widest">Bind</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{'animate-pulse-fast text-sakura-600': isUpdating}"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>

      <!-- DOM / View -->
      <div class="flex-1 w-full relative">
        <div class="absolute -top-3 left-4 bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">DOM (View)</div>
        <div class="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100 min-h-[80px] flex items-center justify-center relative overflow-hidden transition-all duration-300" :class="{'scale-[1.02] border-sakura-300 shadow-sakura-100/50': isUpdating}">
          <div class="text-gray-800 font-bold text-lg break-all text-center">{{ message }}</div>
          <div class="absolute bottom-1 right-2 text-[10px] text-gray-300 font-mono">&lt;div&gt;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const message = ref('Hello Vue! 🌸');
const isUpdating = ref(false);

watch(message, () => {
  isUpdating.value = true;
  setTimeout(() => isUpdating.value = false, 500);
});
</script>