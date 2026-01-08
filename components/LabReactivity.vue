
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-sakura-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors relative">
    
    <div class="flex flex-col xl:flex-row gap-8">
       
       <!-- Left: Interaction Code -->
       <div class="flex-1 space-y-6">
          <h3 class="text-lg font-bold text-sakura-800 dark:text-sakura-300">{{ t.lab_reactivity_title }}</h3>
          <p class="text-xs text-gray-500">{{ t.lab_reactivity_info }}</p>

          <!-- Code Box -->
          <div class="bg-[#1e1e1e] p-4 rounded-xl shadow-inner border border-gray-700 relative overflow-hidden group">
             <div class="absolute top-0 right-0 bg-gray-700 text-[10px] text-white px-2 py-0.5 rounded-bl">simulated_vue.js</div>
             
             <div class="font-mono text-sm leading-relaxed text-gray-300">
                <div class="mb-2">
                   <span class="text-purple-400">const</span> data = <span class="text-blue-400">reactive</span>({ <span class="text-white">price</span>: <span class="text-green-400">{{ price }}</span>, <span class="text-white">qty</span>: <span class="text-green-400">{{ qty }}</span> });
                </div>
                
                <div class="p-2 border border-dashed border-gray-600 rounded bg-gray-800/50 mb-2 relative" :class="{'ring-2 ring-yellow-500': activeEffect === 'totalEffect'}">
                   <div class="text-[10px] text-gray-500 mb-1">// Effect Function (Computed)</div>
                   <span class="text-blue-400">const</span> total = <span class="text-blue-400">computed</span>(() => {<br>
                   &nbsp;&nbsp;<span class="text-gray-500">// Read (Track)</span><br>
                   &nbsp;&nbsp;<span class="text-purple-400">return</span> data.price * data.qty;<br>
                   });
                </div>

                <div class="flex gap-4 mt-4">
                   <div class="flex flex-col gap-1">
                      <label class="text-[10px] uppercase text-gray-500">Price</label>
                      <div class="flex items-center gap-2">
                         <button @click="changeData('price', -1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                         <span class="w-8 text-center">{{ price }}</span>
                         <button @click="changeData('price', 1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
                      </div>
                   </div>
                   <div class="flex flex-col gap-1">
                      <label class="text-[10px] uppercase text-gray-500">Qty</label>
                      <div class="flex items-center gap-2">
                         <button @click="changeData('qty', -1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                         <span class="w-8 text-center">{{ qty }}</span>
                         <button @click="changeData('qty', 1)" class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <!-- Right: Visualization of the "Bucket" -->
       <div class="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 relative min-h-[300px] flex flex-col">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
             <span>{{ t.lab_reactivity_deps }}</span>
             <span v-if="actionPhase" class="text-sakura-500 animate-pulse font-bold">{{ actionPhase }}</span>
          </h4>

          <!-- The Map Structure -->
          <div class="flex-1 flex items-center justify-center">
             <div class="relative w-full max-w-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300" :class="{'border-sakura-400 shadow-sakura-100': actionPhase}">
                <div class="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-xs font-bold text-gray-500">targetMap (WeakMap)</div>

                <!-- Object Node -->
                <div class="border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800 rounded-lg p-3 mb-4">
                   <div class="text-[10px] text-indigo-400 font-bold mb-2">Key: { price, qty }</div>
                   
                   <!-- Properties Deps -->
                   <div class="flex gap-4">
                      <!-- Price Dep -->
                      <div class="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-2 transition-all duration-300 relative" :class="{'ring-2 ring-sakura-500 scale-105': activeKey === 'price'}">
                         <div class="text-[10px] font-bold text-center border-b border-gray-100 dark:border-gray-600 pb-1 mb-1">"price"</div>
                         <div class="min-h-[40px] flex items-center justify-center">
                            <div v-if="deps.price.size > 0" class="bg-yellow-100 text-yellow-700 border border-yellow-200 text-[10px] px-2 py-1 rounded shadow-sm flex items-center gap-1 animate-fade-in">
                               <span>⚡</span> totalEffect
                            </div>
                            <span v-else class="text-[10px] text-gray-300">Empty</span>
                         </div>
                         <!-- Trigger Visual -->
                         <div v-if="activeKey === 'price' && actionPhase === 'Trigger'" class="absolute -top-2 -right-2 text-xl animate-ping">💥</div>
                      </div>

                      <!-- Qty Dep -->
                      <div class="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-2 transition-all duration-300 relative" :class="{'ring-2 ring-sakura-500 scale-105': activeKey === 'qty'}">
                         <div class="text-[10px] font-bold text-center border-b border-gray-100 dark:border-gray-600 pb-1 mb-1">"qty"</div>
                         <div class="min-h-[40px] flex items-center justify-center">
                             <div v-if="deps.qty.size > 0" class="bg-yellow-100 text-yellow-700 border border-yellow-200 text-[10px] px-2 py-1 rounded shadow-sm flex items-center gap-1 animate-fade-in">
                               <span>⚡</span> totalEffect
                            </div>
                            <span v-else class="text-[10px] text-gray-300">Empty</span>
                         </div>
                         <!-- Trigger Visual -->
                         <div v-if="activeKey === 'qty' && actionPhase === 'Trigger'" class="absolute -top-2 -right-2 text-xl animate-ping">💥</div>
                      </div>
                   </div>
                </div>

             </div>
          </div>

          <div class="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded text-center">
             <div class="text-2xl font-bold text-gray-700 dark:text-gray-200">{{ total }}</div>
             <div class="text-[10px] text-gray-400 uppercase">Computed Result</div>
          </div>

       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { I18N } from '../constants';

const props = defineProps<{
  lang: 'en' | 'zh';
}>();

const t = computed(() => I18N[props.lang]);

const price = ref(10);
const qty = ref(2);
const total = computed(() => price.value * qty.value);

// Simulation State for Visualization
const activeEffect = ref<string | null>(null);
const activeKey = ref<string | null>(null);
const actionPhase = ref<string | null>(null);

// Simulating the internal Dep Map of Vue
const deps = ref({
    price: new Set<string>(),
    qty: new Set<string>()
});

// Initial Setup Simulation
const initSimulation = async () => {
    // Simulate first render (Mount)
    activeEffect.value = 'totalEffect';
    actionPhase.value = 'Track';
    
    // Simulate reading price
    activeKey.value = 'price';
    deps.value.price.add('totalEffect');
    await wait(800);
    
    // Simulate reading qty
    activeKey.value = 'qty';
    deps.value.qty.add('totalEffect');
    await wait(800);

    activeEffect.value = null;
    activeKey.value = null;
    actionPhase.value = null;
};

const changeData = async (key: 'price' | 'qty', delta: number) => {
    if (activeEffect.value) return; // prevent spam

    // Update real data
    if (key === 'price') price.value += delta;
    else qty.value += delta;

    // Simulate Reactivity Flow
    activeKey.value = key;
    actionPhase.value = 'Trigger';
    
    await wait(600);
    
    // Find effects
    if (deps.value[key].has('totalEffect')) {
        activeEffect.value = 'totalEffect';
        actionPhase.value = 'Re-run Effect';
        await wait(600);
    }
    
    activeEffect.value = null;
    activeKey.value = null;
    actionPhase.value = null;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(() => {
    setTimeout(initSimulation, 1000);
});
</script>
