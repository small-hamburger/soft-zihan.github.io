<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_dashboard }}</h1>
      <p class="text-sakura-500">{{ t.lab_dashboard_desc }}</p>
      <p class="text-xs text-gray-400 mt-2">
        {{ isZh ? '🌸 所有示例均来自 Sakura Notes 真实源码' : '🌸 All examples from Sakura Notes real source code' }}
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex justify-center mb-8 px-4">
      <div class="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl flex flex-wrap justify-center gap-2 shadow-inner">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-3 md:px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[90px]"
          :class="activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-sakura-600 dark:text-sakura-300 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          <span class="text-lg md:text-xl">{{ tab.icon }}</span>
          <span class="text-[10px] md:text-xs">{{ tab.label.split(' ').pop() }}</span>
          <span class="text-[8px] text-gray-400 hidden md:block">{{ isZh ? `第${tab.stage}阶段` : `Stage ${tab.stage}` }}</span>
        </button>
      </div>
    </div>

    <!-- Learning Progress Indicator -->
    <div class="max-w-3xl mx-auto mb-8 px-4">
      <div class="flex items-center gap-2">
        <template v-for="(tab, index) in tabs" :key="tab.id">
          <div 
            class="flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="activeTabIndex >= index ? 'bg-sakura-400' : 'bg-gray-200 dark:bg-gray-700'"
            @click="activeTab = tab.id"
          ></div>
        </template>
      </div>
      <div class="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>{{ isZh ? '入门' : 'Beginner' }}</span>
        <span>{{ isZh ? '进阶' : 'Advanced' }}</span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[500px] transition-all duration-500">
      
      <!-- Stage Info Banner -->
      <div class="max-w-4xl mx-auto mb-8 px-4">
        <div class="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-4 md:p-6 border border-sakura-100 dark:border-sakura-800/30">
          <div class="flex items-start gap-4">
            <div class="text-4xl">{{ activeTabInfo?.icon }}</div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">
                {{ isZh ? `第${activeTabInfo?.stage}阶段：` : `Stage ${activeTabInfo?.stage}: ` }}
                {{ activeTabInfo?.label.replace(/^[^\s]+\s/, '') }}
              </h3>
              <p class="text-sm text-sakura-600 dark:text-sakura-400 mt-1">
                🎯 {{ activeTabInfo?.goal }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ activeTabInfo?.desc }}
              </p>
            </div>
            <div class="hidden md:block text-right">
              <span class="text-xs text-gray-400">{{ isZh ? '关联本站代码' : 'Related Code' }}</span>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <template v-if="activeTab === 'foundation'">index.html, App.vue</template>
                <template v-else-if="activeTab === 'js-basics'">useSearch.ts, appStore.ts</template>
                <template v-else-if="activeTab === 'css-layout'">WallpaperLayer.vue, AppSidebar.vue</template>
                <template v-else-if="activeTab === 'js-advanced'">useFile.ts, useContentClick.ts</template>
                <template v-else-if="activeTab === 'engineering'">vite.config.ts, package.json</template>
                <template v-else-if="activeTab === 'vue-core'">appStore.ts, FileTree.vue</template>
                <template v-else-if="activeTab === 'vue-advanced'">composables/*.ts, stores/*.ts</template>
                <template v-else>{{ isZh ? '综合应用' : 'Comprehensive' }}</template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stage 1: Web Foundation -->
      <div v-if="activeTab === 'foundation'" class="space-y-12 animate-fade-in">
        <section>
          <LabCodeEvolution :lang="lang" />
        </section>

        <section class="max-w-4xl mx-auto">
          <div class="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 border border-sakura-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
             
             <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{{ t.lab_standards_title }}</h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t.lab_standards_desc }}</p>
             </div>

             <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div class="w-48 h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative transition-all duration-500" :class="{'border-sakura-400 dark:border-sakura-500 shadow-lg shadow-sakura-500/20': standards.css}">
                    <div v-if="standards.css" class="absolute inset-2 bg-gradient-to-br from-sakura-100 to-purple-100 dark:from-sakura-900/50 dark:to-purple-900/50 rounded-xl transition-all duration-500 animate-fade-in"></div>
                    <div v-if="standards.html" class="relative z-10 text-6xl transition-all duration-500" :class="{'animate-bounce': standards.js}">
                       <span v-if="!standards.css">🦴</span>
                       <span v-else>🤵</span>
                    </div>
                    <div v-else class="text-gray-300 dark:text-gray-700 text-sm font-mono text-center px-4">
                      &lt;div&gt;<br>Empty<br>&lt;/div&gt;
                    </div>
                    <div v-if="standards.js" class="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
                    <div v-if="standards.js" class="absolute -left-4 -bottom-4 text-2xl animate-spin-slow">⚙️</div>
                </div>

                <div class="flex flex-col gap-3 w-full md:w-auto">
                   <button @click="standards.html = !standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="standards.html ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'">
                      <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-lg">H</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_html }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_html }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-orange-500 border-orange-500': standards.html}"></div>
                      </div>
                   </button>
                   <button @click="standards.css = !standards.css" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.css ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']">
                      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">C</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_css }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_css }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-blue-500 border-blue-500': standards.css}"></div>
                      </div>
                   </button>
                   <button @click="standards.js = !standards.js" :disabled="!standards.html" class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full md:w-64 text-left group"
                    :class="[!standards.html ? 'cursor-not-allowed opacity-40' : '', standards.js ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100']">
                      <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-lg">J</div>
                      <div>
                        <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ t.lab_st_js }}</div>
                        <div class="text-[10px] text-gray-500 leading-tight mt-0.5">{{ t.lab_st_info_js }}</div>
                      </div>
                      <div class="ml-auto">
                        <div class="w-4 h-4 rounded-full border border-gray-400" :class="{'bg-yellow-500 border-yellow-500': standards.js}"></div>
                      </div>
                   </button>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧱</span> {{ t.lab_html_title }}
          </h2>
          <LabHtml :lang="lang" />
        </section>

        <section>
          <LabHtmlBasics :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧠</span> {{ isZh ? '浏览器渲染流水线' : 'Rendering Pipeline' }}
          </h2>
          <LabBrowserPipeline :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已经理解了网页的基本结构！接下来学习 JavaScript 基础语法。' : 'You now understand web page structure! Next, learn JavaScript fundamentals.'"
          @next="activeTab = 'js-basics'"
        />
      </div>

      <!-- Stage 2: JS Basics -->
      <div v-else-if="activeTab === 'js-basics'" class="space-y-12 animate-fade-in">
        <section>
          <LabJsBasics :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已掌握 JS 核心语法！接下来学习 CSS 布局，让页面更美观。' : 'You\'ve mastered JS core syntax! Next, learn CSS layout to make pages beautiful.'"
          @next="activeTab = 'css-layout'"
        />
      </div>

      <!-- Stage 3: CSS Layout -->
      <div v-else-if="activeTab === 'css-layout'" class="space-y-12 animate-fade-in">
        <section>
          <LabCssBasics :lang="lang" />
        </section>

        <section>
          <LabCssLayout :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🌸</span> {{ isZh ? 'CSS 动画' : 'CSS Animation' }}
            <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '花瓣效果解析' : 'Petal Effect Analysis' }}</span>
          </h2>
          <LabCssAnimation :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧩</span> {{ isZh ? 'CSS 性能与渲染成本' : 'CSS Performance' }}
            <span class="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '回流/重绘/合成' : 'reflow/paint/composite' }}</span>
          </h2>
          <LabCssPerformance :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已经可以构建精美的页面布局了！接下来学习 JS 进阶，实现复杂交互。' : 'You can now build beautiful layouts! Next, learn advanced JS for complex interactions.'"
          @next="activeTab = 'js-advanced'"
        />
      </div>

      <!-- Stage 4: JS Advanced -->
      <div v-else-if="activeTab === 'js-advanced'" class="space-y-12 animate-fade-in">
        <section>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ isZh ? 'JavaScript 核心机制' : 'JavaScript Core Mechanics' }}
          </h2>
          <LabJs :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎮</span> {{ t.lab_dom_title }}
          </h2>
          <LabDom :lang="lang" />
        </section>

        <section class="max-w-4xl mx-auto">
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2 justify-center">
            <span class="text-2xl">📡</span> {{ t.lab_ajax_title }}
          </h2>
          <LabAjax :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚡</span> {{ isZh ? '异步编程' : 'Async Programming' }}
            <span class="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? 'Promise & async/await' : 'Promise & async/await' }}</span>
          </h2>
          <LabAsync :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧠</span> {{ isZh ? '闭包与作用域' : 'Closures & Scope' }}
          </h2>
          <LabJsAdvanced :lang="lang" />
        </section>

        <section>
          <LabTypeScript :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已掌握 JS 高级特性！接下来学习前端工程化，掌握专业开发流程。' : 'You\'ve mastered advanced JS! Next, learn frontend engineering for professional workflow.'"
          @next="activeTab = 'engineering'"
        />
      </div>

      <!-- Stage 5: Engineering -->
      <div v-else-if="activeTab === 'engineering'" class="space-y-12 animate-fade-in">
        <section>
          <LabModuleSystem :lang="lang" />
        </section>

        <section>
          <LabNpm :lang="lang" />
        </section>

        <section>
          <LabBuildTools :lang="lang" />
        </section>

        <section>
          <LabTailwind :lang="lang" />
        </section>

        <section>
          <LabCssFrameworks :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已掌握前端工程化！接下来学习 Vue 3 核心，构建现代化 Web 应用。' : 'You\'ve mastered frontend engineering! Next, learn Vue 3 core to build modern web apps.'"
          @next="activeTab = 'vue-core'"
        />
      </div>

      <!-- Stage 6: Vue Core -->
      <div v-else-if="activeTab === 'vue-core'" class="space-y-12 animate-fade-in">
        <section>
           <h2 class="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
             <span class="text-2xl">🧪</span> {{ t.lab_reactivity }}
           </h2>
           <LabReactivity :lang="lang" />
        </section>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">👁️</span> {{ t.lab_directives }}
            </h2>
            <LabDirectives :lang="lang" />
          </section>

          <section>
              <h2 class="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
                <span class="text-2xl">💅</span> {{ t.lab_class_title }}
              </h2>
              <LabClassStyle :lang="lang" />
          </section>
        </div>

        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🖱️</span> {{ isZh ? '事件处理' : 'Event Handling' }}
          </h2>
          <LabEventHandling :lang="lang" />
        </section>

        <section>
            <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📋</span> {{ t.lab_vue_list_title }}
            </h2>
            <LabVueList :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎢</span> {{ t.lab_lifecycle }}
          </h2>
          <LabLifecycle :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '你已掌握 Vue 3 核心！接下来学习 Vue 进阶，包括组件通信、Composables 和 Pinia。' : 'You\'ve mastered Vue 3 core! Next, learn advanced Vue including component communication, Composables and Pinia.'"
          @next="activeTab = 'vue-advanced'"
        />
      </div>

      <!-- Stage 7: Vue Advanced (NEW) -->
      <div v-else-if="activeTab === 'vue-advanced'" class="space-y-12 animate-fade-in">
        <!-- Props & Emit -->
        <section>
            <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <span class="text-2xl">📡</span> {{ t.lab_props_title }}
            </h2>
            <LabPropsEmit :lang="lang" />
        </section>

        <!-- Slot System -->
        <section>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎁</span> {{ isZh ? '插槽系统' : 'Slot System' }}
          </h2>
          <LabSlot :lang="lang" />
        </section>

        <!-- Composables (NEW) -->
        <section>
          <h2 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🧩</span> {{ isZh ? 'Composables 组合式函数' : 'Composables' }}
            <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '本站源码剖析' : 'Site Code Analysis' }}</span>
          </h2>
          <LabComposables :lang="lang" />
        </section>

        <!-- Pinia (NEW) -->
        <section>
          <h2 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🍍</span> {{ isZh ? 'Pinia 状态管理' : 'Pinia State Management' }}
            <span class="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '本站源码剖析' : 'Site Code Analysis' }}</span>
          </h2>
          <LabPinia :lang="lang" />
        </section>

        <!-- Provide/Inject (NEW) -->
        <section>
          <h2 class="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">💉</span> {{ isZh ? '依赖注入' : 'Dependency Injection' }}
          </h2>
          <LabProvideInject :lang="lang" />
        </section>

        <NextStageGuide 
          :is-zh="isZh" 
          :next-text="isZh ? '🎉 恭喜完成全部 Vue 学习！来挑战测验，检验你的综合能力吧！' : '🎉 Congratulations on completing Vue learning! Take the challenge quiz to test your skills!'"
          :button-text="isZh ? '进入挑战赛 🏆' : 'Take the Challenge 🏆'"
          @next="activeTab = 'challenge'"
        />
      </div>

      <!-- Stage 8: Challenge -->
      <div v-else-if="activeTab === 'challenge'" class="animate-fade-in space-y-12">
         <section class="max-w-3xl mx-auto">
           <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 justify-center">
             <span class="text-2xl">🥷</span> {{ t.lab_quiz }}
           </h2>
           <LabQuizGame :lang="lang" />
        </section>

        <section>
          <h2 class="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
            <span class="text-2xl">🏆</span> {{ isZh ? '迷你项目挑战' : 'Mini Project Challenge' }}
            <span class="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full ml-2">{{ isZh ? '综合实战' : 'Hands-on Practice' }}</span>
          </h2>
          <LabMiniProject :lang="lang" />
        </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { I18N } from '../../constants'

// Stage 1: Foundation
import LabCodeEvolution from './stage1-foundation/LabCodeEvolution.vue'
import LabHtml from './stage1-foundation/LabHtml.vue'
import LabHtmlBasics from './stage1-foundation/LabHtmlBasics.vue'
import LabBrowserPipeline from './stage1-foundation/LabBrowserPipeline.vue'

// Stage 2: JS Basics
import LabJsBasics from './stage2-js-basics/LabJsBasics.vue'

// Stage 3: CSS
import LabCssBasics from './stage3-css/LabCssBasics.vue'
import LabCssLayout from './stage3-css/LabCssLayout.vue'
import LabCssAnimation from './stage3-css/LabCssAnimation.vue'
import LabCssPerformance from './stage3-css/LabCssPerformance.vue'

// Stage 4: JS Advanced
import LabJs from './stage4-js-advanced/LabJs.vue'
import LabDom from './stage4-js-advanced/LabDom.vue'
import LabAjax from './stage4-js-advanced/LabAjax.vue'
import LabAsync from './stage4-js-advanced/LabAsync.vue'
import LabJsAdvanced from './stage4-js-advanced/LabJsAdvanced.vue'
import LabTypeScript from './stage4-js-advanced/LabTypeScript.vue'

// Stage 5: Engineering
import LabModuleSystem from './stage5-engineering/LabModuleSystem.vue'
import LabNpm from './stage5-engineering/LabNpm.vue'
import LabBuildTools from './stage5-engineering/LabBuildTools.vue'
import LabTailwind from './stage5-engineering/LabTailwind.vue'
import LabCssFrameworks from './stage5-engineering/LabCssFrameworks.vue'

// Stage 6: Vue Core
import LabReactivity from './stage6-vue-core/LabReactivity.vue'
import LabDirectives from './stage6-vue-core/LabDirectives.vue'
import LabClassStyle from './stage6-vue-core/LabClassStyle.vue'
import LabEventHandling from './stage6-vue-core/LabEventHandling.vue'
import LabVueList from './stage6-vue-core/LabVueList.vue'
import LabLifecycle from './stage6-vue-core/LabLifecycle.vue'

// Stage 7: Vue Advanced
import LabPropsEmit from './stage7-vue-advanced/LabPropsEmit.vue'
import LabSlot from './stage7-vue-advanced/LabSlot.vue'
import LabComposables from './stage7-vue-advanced/LabComposables.vue'
import LabPinia from './stage7-vue-advanced/LabPinia.vue'
import LabProvideInject from './stage7-vue-advanced/LabProvideInject.vue'

// Stage 8: Challenge
import LabQuizGame from './stage8-challenge/LabQuizGame.vue'
import LabMiniProject from './stage8-challenge/LabMiniProject.vue'

// Helper component for next stage navigation
const NextStageGuide = {
  props: {
    isZh: Boolean,
    nextText: String,
    buttonText: String
  },
  emits: ['next'],
  template: `
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-2xl mx-auto text-center">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          {{ isZh ? '🎉 完成本阶段后' : '🎉 After this stage' }}
        </h3>
        <p class="text-gray-500 text-sm mb-6">{{ nextText }}</p>
        <button 
          @click="$emit('next')"
          class="px-6 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-xl font-bold transition-all hover:scale-105"
        >
          {{ buttonText || (isZh ? '进入下一阶段 →' : 'Next Stage →') }}
        </button>
      </div>
    </div>
  `
}

const props = defineProps<{
  lang: 'en' | 'zh'
  initialTab?: string
}>()

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
}>()

const t = computed(() => I18N[props.lang as 'en' | 'zh'])
const isZh = computed(() => props.lang === 'zh')

const activeTab = ref('foundation')
const labTabStorageKey = computed(() => `lab_active_tab_${props.lang}`)

type LabTab = {
  id: string
  label: string
  icon: string
  stage: number
  desc: string
  goal: string
}

// 8 Learning Stages (as per 实验室修改方案2)
const tabs = computed<LabTab[]>(() => [
  { 
    id: 'foundation', 
    label: isZh.value ? '🌐 Web基础' : '🌐 Web Basics', 
    icon: '🌐',
    stage: 1,
    desc: isZh.value ? 'HTML/CSS/JS 概念入门' : 'HTML/CSS/JS Intro',
    goal: isZh.value ? '理解网页的组成结构' : 'Understand web page structure'
  },
  { 
    id: 'js-basics', 
    label: isZh.value ? '🟨 JS基础' : '🟨 JS Basics', 
    icon: '🟨',
    stage: 2,
    desc: isZh.value ? '变量/函数/数组/对象' : 'Variables/Functions/Arrays',
    goal: isZh.value ? '掌握 JS 核心语法' : 'Master JS core syntax'
  },
  { 
    id: 'css-layout', 
    label: isZh.value ? '🎨 CSS布局' : '🎨 CSS Layout', 
    icon: '🎨',
    stage: 3,
    desc: isZh.value ? '盒模型/Flex/Grid/响应式' : 'Box Model/Flex/Grid',
    goal: isZh.value ? '构建任意页面布局' : 'Build any page layout'
  },
  { 
    id: 'js-advanced', 
    label: isZh.value ? '⚡ JS进阶' : '⚡ JS Advanced', 
    icon: '⚡',
    stage: 4,
    desc: isZh.value ? 'DOM/异步/TypeScript' : 'DOM/Async/TypeScript',
    goal: isZh.value ? '实现复杂交互逻辑' : 'Implement complex interactions'
  },
  { 
    id: 'engineering', 
    label: isZh.value ? '🔧 工程化' : '🔧 Engineering', 
    icon: '🔧',
    stage: 5,
    desc: isZh.value ? '模块化/NPM/构建/Tailwind' : 'Modules/NPM/Build/Tailwind',
    goal: isZh.value ? '专业项目开发流程' : 'Professional dev workflow'
  },
  { 
    id: 'vue-core', 
    label: isZh.value ? '🥝 Vue核心' : '🥝 Vue Core', 
    icon: '🥝',
    stage: 6,
    desc: isZh.value ? '响应式/指令/事件/列表' : 'Reactivity/Directives/Events/List',
    goal: isZh.value ? '掌握 Vue 3 基础' : 'Master Vue 3 basics'
  },
  { 
    id: 'vue-advanced', 
    label: isZh.value ? '🚀 Vue进阶' : '🚀 Vue Advanced', 
    icon: '🚀',
    stage: 7,
    desc: isZh.value ? 'Composables/Pinia/组件通信' : 'Composables/Pinia/Communication',
    goal: isZh.value ? '构建复杂应用架构' : 'Build complex app architecture'
  },
  { 
    id: 'challenge', 
    label: isZh.value ? '🏆 挑战赛' : '🏆 Challenge', 
    icon: '🏆',
    stage: 8,
    desc: isZh.value ? '综合测验' : 'Quiz',
    goal: isZh.value ? '检验综合能力' : 'Test your skills'
  },
])

const activeTabInfo = computed<LabTab | undefined>(() => tabs.value.find((tab: LabTab) => tab.id === activeTab.value))
const activeTabIndex = computed(() => tabs.value.findIndex((tab: LabTab) => tab.id === activeTab.value))

onMounted(() => {
  const saved = localStorage.getItem(labTabStorageKey.value)
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved
  }
})

watch(
  () => props.initialTab,
  (val) => {
    if (val && tabs.value.some((tab: LabTab) => tab.id === val)) {
      activeTab.value = val
    }
  },
  { immediate: true }
)

watch(activeTab, (val: string) => {
  localStorage.setItem(labTabStorageKey.value, val)
  emit('tab-change', val)
})

watch(() => props.lang, () => {
  const saved = localStorage.getItem(labTabStorageKey.value)
  if (saved && tabs.value.some((tab: LabTab) => tab.id === saved)) {
    activeTab.value = saved
  }
})

// Web Standards State
const standards = reactive({
  html: true,
  css: false,
  js: false
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
