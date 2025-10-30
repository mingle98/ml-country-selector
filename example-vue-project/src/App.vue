<template>
  <div class="container">
    <div class="header">
      <h1>🌍 ml-country-selector</h1>
      <p>Vue 3 + Vite + ESM Import 示例</p>
      <span class="badge">import 方式测试</span>
    </div>

    <!-- 选中结果展示 -->
    <div class="result-card">
      <h3>选中的国家信息</h3>
      <div v-if="selectedCountry">
        <div class="result-item">
          <span class="result-label">国家名称:</span>
          <span class="result-value">{{ selectedCountry.label }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">英文名称:</span>
          <span class="result-value">{{ selectedCountry.value }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">区号:</span>
          <span class="result-value">+{{ selectedCountry.code }}</span>
        </div>
        <div class="result-item" v-if="selectedCountry.pingyin">
          <span class="result-label">拼音:</span>
          <span class="result-value">{{ selectedCountry.pingyin }}</span>
        </div>
      </div>
      <div v-else class="empty-state">
        暂未选择国家
      </div>
    </div>

    <!-- 主题切换 -->
    <div class="theme-controls">
      <button 
        class="theme-btn" 
        :class="{ active: currentTheme === 'light' }"
        @click="changeTheme('light')">
        ☀️ 日间模式
      </button>
      <button 
        class="theme-btn" 
        :class="{ active: currentTheme === 'dark' }"
        @click="changeTheme('dark')">
        🌙 暗黑模式
      </button>
    </div>

    <!-- 选择按钮 -->
    <button class="select-btn" @click="openSelector">
      {{ selectedCountry ? '🔄 重新选择国家' : '📍 选择国家' }}
    </button>

    <!-- 功能说明 -->
    <div class="info-section">
      <h4>✨ 本示例验证的功能：</h4>
      <ul>
        <li>使用 <code>import { mlCountrySelector } from 'ml-country-selector'</code> ESM 导入</li>
        <li>Vue 3 Composition API 集成</li>
        <li>Vite 构建工具支持</li>
        <li>响应式数据绑定</li>
        <li>主题切换功能</li>
        <li>完整的生命周期管理</li>
      </ul>
    </div>

    <!-- 选择器弹窗 -->
    <Teleport to="body">
      <div v-show="showModal" class="modal-overlay" @click.self="closeSelector">
        <div class="modal-body">
          <div class="modal-header">
            <h2 class="modal-title">选择国籍</h2>
            <span class="modal-close" @click="closeSelector"></span>
          </div>
          <div id="country-selector"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
// 关键：使用 ESM 导入方式
import { mlCountrySelector } from 'ml-country-selector'

// 响应式数据
const selectedCountry = ref(null)
const showModal = ref(false)
const currentTheme = ref('light')
let selectorInstance = null

// 初始化国家选择器
const initSelector = () => {
  console.log('🚀 初始化国家选择器...')
  
  selectorInstance = mlCountrySelector.initializationFn({
    el: '#country-selector',
    // 初始化请求类型
    isHttps: true,
    // 开启input动画伸缩功能
    animaInput: true,
    // 自定义按钮文案
    inputOutBtnTxt: '取消',
    // input失去焦点立即重置
    immediatelyReset: false,
    // input搜索全局匹配
    globalSearchWord: false,
    // 支持拼音搜索
    supportEnSearch: true,
    // 开启列表独立滚动
    fixedAndScroll: true,
    // 搜索数据源包含推荐
    serachDataIncludeRecommend: false,
    // 选中国家后重置状态
    selectCountryAfterReset: false,
    // 搜索为空时显示国家列表
    searchEmptyShowCountryList: false,
    // 搜索输入最大字符数
    searchInputMaxNum: 20,
    // 连续匹配高亮样式
    searchWordAddStyle: true,
    // 滚动出现侧边提示大气泡
    scrollBodyBubble: true,
    // 左侧列表区域字母吸顶
    leftTipTop: true,
    // 侧边栏跟随监听偏移值
    leftActionSpan: 163,
    // input类型
    inputType: 'text',
    // 启用server搜索
    useServerSeach: false,
    
    // 选中国家的回调函数
    selectedCallback: (res) => {
      console.log('✅ 选中的国家:', res)
      selectedCountry.value = res.eventItemData
      closeSelector()
    },
    
    // 自定义清除按钮点击回调
    inputOutBtnCallback: (e) => {
      console.log('🔄 点击清除按钮', e)
      if (selectorInstance) {
        selectorInstance.pubResetFn()
      }
    },
    
    // 搜索input失去焦点回调
    inputBlurCallback: (e) => {
      console.log('👋 input失去焦点', e)
    },
    
    // 搜索input获得焦点回调
    inputFocusCallback: (e) => {
      console.log('👆 input获得焦点', e)
    },
    
    // 点击搜索框清除按钮图标回调
    searchClearIconCallback: () => {
      console.log('🗑️ 点击清除图标')
    },
    
    // 请求开始回调
    apiStartCallback: () => {
      console.log('🔄 API请求开始')
    },
    
    // 请求完成回调
    apiEndCallback: () => {
      console.log('✅ API请求完成')
    },
    
    // DOM渲染完成回调
    domRenderAfterCallback: () => {
      console.log('🎨 DOM渲染完成')
    }
  }).render()
  
  // 应用当前主题
  if (currentTheme.value === 'dark') {
    selectorInstance.changeThemePubFn('ml-country-selector-dark')
  }
  
  console.log('✅ 国家选择器初始化成功！')
}

// 打开选择器
const openSelector = () => {
  showModal.value = true
  
  // 只在第一次打开时初始化
  if (!selectorInstance) {
    nextTick(() => {
      initSelector()
    })
  }
}

// 关闭选择器
const closeSelector = () => {
  showModal.value = false
  // 可选：重置选择器状态（保持搜索内容）
  // if (selectorInstance) {
  //   selectorInstance.pubResetFn()
  // }
}

// 手动重置选择器状态（如果需要）
const resetSelector = () => {
  if (selectorInstance) {
    selectorInstance.pubResetFn()
  }
}

// 切换主题
const changeTheme = (theme) => {
  currentTheme.value = theme
  console.log(`🎨 切换主题为: ${theme}`)
  
  // 如果选择器已打开，立即应用主题
  if (selectorInstance) {
    const themeClass = theme === 'dark' ? 'ml-country-selector-dark' : ''
    selectorInstance.changeThemePubFn(themeClass)
  }
  // 如果选择器未打开，主题会在下次打开时自动应用
}
</script>

<style scoped>
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #667eea;
}
</style>

