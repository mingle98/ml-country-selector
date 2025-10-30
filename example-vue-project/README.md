# ml-country-selector Vue 3 + Vite 示例

这个示例项目演示了如何在 Vue 3 + Vite 项目中使用 **ESM import** 方式导入 `ml-country-selector` 组件。

## 📦 项目特点

- ✅ 使用 `import { mlCountrySelector } from 'ml-country-selector'` ESM 导入方式
- ✅ Vue 3 Composition API（`<script setup>`）
- ✅ Vite 5.x 构建工具
- ✅ 完整的响应式数据绑定
- ✅ 主题切换功能
- ✅ Teleport 组件使用
- ✅ 模态框中完美居中（v2.3.7+ 组件已内置支持）

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 3. 构建生产版本

```bash
npm run build
```

## 📝 核心代码说明

### ESM 导入方式

```javascript
import { mlCountrySelector } from 'ml-country-selector'
```

这是标准的 ES Module 导入方式，在使用 Vite、Webpack、Rollup 等现代构建工具的项目中都可以使用。

### Vue 3 集成

```vue
<script setup>
import { ref, nextTick } from 'vue'
import { mlCountrySelector } from 'ml-country-selector'

const selectedCountry = ref(null)
let selectorInstance = null

const initSelector = () => {
  selectorInstance = mlCountrySelector.initializationFn({
    el: '#country-selector',
    selectedCallback: (res) => {
      selectedCountry.value = res.eventItemData
    }
  }).render()
}
</script>
```

## 🎯 验证内容

本示例验证了以下功能：

1. ✅ **ESM 导入**: 确认 `import { mlCountrySelector }` 可以正常工作
2. ✅ **类型支持**: TypeScript 类型定义正常
3. ✅ **构建支持**: Vite 可以正确处理和打包组件
4. ✅ **运行时功能**: 所有组件功能正常运行
5. ✅ **响应式集成**: Vue 响应式数据与组件的完美配合
6. ✅ **生命周期**: 组件的初始化、销毁等生命周期管理
7. ✅ **模态框集成**: 侧边栏在弹窗中完美居中（v2.3.7+）
8. ✅ **主题切换**: 动态主题切换功能正常

## 📂 项目结构

```
example-vue-project/
├── index.html          # HTML 入口
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
└── src/
    ├── main.js         # 应用入口
    ├── App.vue         # 主组件（核心示例代码）
    └── style.css       # 全局样式
```

## 🔧 技术栈

- Vue 3.4+
- Vite 5.x
- ml-country-selector (本地包)

## 💡 提示

- 本项目使用 `"ml-country-selector": "file:.."` 引用父目录的包
- 确保父目录已经运行过 `npm run build` 生成了 dist 文件
- 如果修改了父项目代码，需要重新构建并重新安装依赖

## 🐛 调试技巧

打开浏览器开发者工具的控制台，可以看到详细的日志输出：

- 🚀 初始化日志
- ✅ 选中国家日志
- 🎨 主题切换日志
- 🔄 各种回调函数的执行日志

## 📖 更多信息

查看父目录的 README.md 获取完整的 API 文档和配置说明。

