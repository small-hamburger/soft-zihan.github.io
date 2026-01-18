<template>
  <div class="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 md:p-8 border border-blue-200 dark:border-blue-700 shadow-xl">
    <div class="flex items-start gap-4 mb-6">
      <div class="text-3xl">🔷</div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isZh ? 'TypeScript 类型系统' : 'TypeScript Type System' }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isZh ? '体验类型注解、接口和泛型的核心概念。' : 'Experience type annotations, interfaces, and generics.' }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        :class="activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <h4 class="font-bold text-gray-700 dark:text-gray-200 mb-2">{{ current.title }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ current.desc }}</p>

          <div v-if="activeTab === 'annotation'" class="space-y-3">
            <label class="text-xs text-gray-500">{{ isZh ? '选择类型' : 'Choose type' }}</label>
            <div class="flex gap-2">
              <button
                v-for="type in typeOptions"
                :key="type"
                @click="selectedType = type"
                class="px-3 py-1.5 rounded-lg text-xs font-bold border"
                :class="selectedType === type ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
              >
                {{ type }}
              </button>
            </div>
            <input
              v-model="inputValue"
              type="text"
              class="w-full mt-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              :placeholder="isZh ? '输入值...' : 'Enter a value...'"
            />
            <div class="text-xs text-gray-500">
              {{ isZh ? '推断结果：' : 'Inferred:' }}
              <span class="font-mono text-blue-600 dark:text-blue-300">{{ preview }}</span>
            </div>
          </div>

          <div v-else class="text-xs text-gray-500">
            {{ isZh ? '切换标签查看不同的类型系统示例。' : 'Switch tabs to explore different type system samples.' }}
          </div>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-gray-900 text-green-200 font-mono text-xs leading-relaxed overflow-x-auto">
        <pre>{{ current.code }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ lang: 'en' | 'zh' }>()
const isZh = computed(() => props.lang === 'zh')

const tabs = computed(() => [
  { id: 'annotation', label: isZh.value ? '类型注解' : 'Annotations' },
  { id: 'interface', label: isZh.value ? '接口' : 'Interface' },
  { id: 'generic', label: isZh.value ? '泛型' : 'Generics' }
])

const activeTab = ref<'annotation' | 'interface' | 'generic'>('annotation')
const selectedType = ref<'number' | 'string' | 'boolean'>('number')
const inputValue = ref('42')

const typeOptions: Array<'number' | 'string' | 'boolean'> = ['number', 'string', 'boolean']

const current = computed(() => {
  if (activeTab.value === 'interface') {
    return {
      title: isZh.value ? '对象结构' : 'Object Shape',
      desc: isZh.value ? '用接口约束对象的字段。' : 'Use interfaces to describe object fields.',
      code: `interface User {\n  id: number;\n  name: string;\n  role?: 'admin' | 'user';\n}\n\nconst u: User = { id: 1, name: 'Zihan' }` 
    }
  }
  if (activeTab.value === 'generic') {
    return {
      title: isZh.value ? '复用类型' : 'Reusable Types',
      desc: isZh.value ? '通过泛型保留类型信息。' : 'Generics keep type information.',
      code: `function wrap<T>(value: T) {\n  return { value }\n}\n\nconst num = wrap(123)\nconst str = wrap('hello')` 
    }
  }
  return {
    title: isZh.value ? '基本类型注解' : 'Basic Annotations',
    desc: isZh.value ? '变量声明时附加类型。' : 'Attach types to variables.',
    code: `let count: number = 1\nlet title: string = 'Sakura Notes'\nlet enabled: boolean = true` 
  }
})

const preview = computed(() => {
  const val = inputValue.value
  if (selectedType.value === 'number') {
    const num = Number(val)
    return Number.isNaN(num) ? 'NaN' : String(num)
  }
  if (selectedType.value === 'boolean') {
    return val.toLowerCase() === 'true' ? 'true' : 'false'
  }
  return val
})
</script>
