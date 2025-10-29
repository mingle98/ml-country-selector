# ml-country-selector 是什么？
[English README](./README.en.md)

一个零依赖（运行时）国家/地区选择器，基于 TypeScript 开发、Rollup 打包。支持本地与服务端搜索、推荐区、拼音/全局匹配、独立滚动、暗黑模式等特性，面向多种技术栈（原生/React/Vue/…）快速集成。

![图片](https://pic1.imgdb.cn/item/6902405f3203f7be00b1c476.png)



✨ 特性
- 纯原生 DOM，零框架耦合，任意项目可用
- 本地/服务端搜索，推荐与回车检索分离
- 拼音匹配、全局匹配、多语言字形友好
- 超大数据时可启用“独立滚动”优化
- 完整回调与公共方法，易定制、可扩展
- 已含单元测试与 CI

---

## 安装

NPM（推荐）
```bash
npm i ml-country-selector -S
```

CDN（UMD）
```html
<script src="https://unpkg.com/ml-country-selector/dist/index.js"></script>
```

## 快速开始

ESM/构建项目
```ts
import { mlCountrySelector } from 'ml-country-selector';
mlCountrySelector.initializationFn({
  el: '#container',
  selectedCallback: console.log,
}).render();
```

UMD/CDN
```html
<div id="container"></div>
<script>
  const { mlCountrySelector } = window.countrySelector;
  mlCountrySelector.initializationFn({ el: '#container', selectedCallback: console.log }).render();
</script>
```
注意：必须提供一个容器元素（id 或选择器）。

---

## 完整示例
```js
let instance = mlCountrySelector.initializationFn({
  el: '#container',
  isHttps: true,
  animaInput: true,
  inputOutBtnTxt: '取消',
  immediatelyReset: false,
  globalSearchWord: false,
  supportEnSearch: false,
  fixedAndScroll: true,
  scrollviewHeight: null,
  serachDataIncludeRecommend: false,
  selectCountryAfterReset: false,
  searchEmptyShowCountryList: false,
  searchInputMaxNum: 20,
  searchWordAddStyle: true,
  scrollBodyBubble: true,
  leftTipTop: true,
  leftActionSpan: 163,
  inputType: 'text',
  useServerSeach: false,
  serverSeaAPI: '',
  serverTjAPI: '',
  customOptions: {
    searchclearIcon: '',
    searchIcon: '',
    selectIcon: '',
    slideItemIcon: '',
  },
  selectedCallback: (res) => {
    console.log('selectedCallback', res);
  },
  inputOutBtnCallback: (e) => {
    instance.pubResetFn();
  },
  inputBlurCallback: (e) => {},
  inputFocusCallback: (e) => {},
  searchClearIconCallback: () => {},
  apiStartCallback: () => {},
  apiEndCallback: () => {},
  domRenderAfterCallback: () => {},
}).render();
```

---

## 配置项与 API

### 参数（Options）
| 序号 | 参数 | 类型 | 必填 | 说明 | 其他 |
|---|---|---|---|---|---|
| 1 | el | string | 是 | 容器元素 id/选择器 | |
| 2 | placeholder | string | 否 | 搜索输入 placeholder | |
| 3 | countryList | object[] | 否 | 自定义国家列表 | 见下方格式 |
| 4 | hotCountryList | object[] | 否 | 自定义推荐列表 | 见下方格式 |
| 5 | animaInput | boolean | 否 | 输入框伸缩动画与清除按钮 | |
| 6 | inputOutBtnTxt | string | 否 | 清除按钮文案 | animaInput 为 true 生效 |
| 7 | immediatelyReset | boolean | 否 | 输入框 blur 且无内容时立刻重置 | |
| 8 | fixedAndScroll | boolean | 否 | 列表独立滚动，搜索区域固定 | |
| 9 | scrollviewHeight | number | 否 | 滚动区域高度（px） | fixedAndScroll=true 时生效 |
| 10 | globalSearchWord | boolean | 否 | 全局匹配 | 本地搜索模式 |
| 11 | serachDataIncludeRecommend | boolean | 否 | 搜索数据源是否包含推荐 | |
| 12 | selectCountryAfterReset | boolean | 否 | 选中后是否重置视图 | |
| 13 | searchEmptyShowCountryList | boolean | 否 | 无结果是否继续展示列表 | 默认 false |
| 14 | searchInputMaxNum | number | 否 | 输入最大长度 | 默认 20 |
| 15 | supportEnSearch | boolean | 否 | 拼音匹配 | 仅非全局匹配生效 |
| 16 | searchWordAddStyle | boolean | 否 | 连续匹配高亮样式 | 仅非全局匹配生效 |
| 17 | isHttps | boolean | 是 | 请求协议（仅服务端搜索时相关） | |
| 18 | inputType | string | 否 | 输入框类型 | 服务端搜索建议 'search' |
| 19 | useServerSeach | boolean | 否 | 是否启用服务端搜索/推荐 | |
| 20 | serverSeaAPI | string | 否 | 检索接口（回车触发） | GET |
| 21 | serverTjAPI | string | 否 | 推荐接口（输入变化触发） | GET |

提示：
- Hash 路由兼容：组件侧边“推荐/字母”不使用 href，不会修改 `location.hash`。
- 服务端搜索：`inputType: 'search'` 时回车触发 `serverSeaAPI`，输入变化触发 `serverTjAPI`。

### 回调函数
| 序号 | 回调 | 必填 | 说明 |
|---|---|---|---|
| 1 | selectedCallback(res) | 是 | 选择国家完成回调，含 `eventItemData`/`selectCountry` |
| 2 | errCallback | 否 | 发生错误的回调 |
| 3 | inputOutBtnCallback | 否 | 清除按钮点击回调 |
| 4 | inputBlurCallback | 否 | 输入 blur 回调 |
| 5 | inputFocusCallback | 否 | 输入 focus 回调 |
| 6 | domRenderAfterCallback | 否 | DOM 渲染完成回调 |
| 7 | searchClearIconCallback | 否 | 点击清除图标回调 |
| 8 | apiStartCallback | 否 | 请求开始回调 |
| 9 | apiEndCallback | 否 | 请求结束回调（成功或失败均触发） |

### 公共方法
| 方法 | 说明 |
|---|---|
| pubResetFn() | 主动重置状态 |
| setfixedAndScroll() | 启用独立滚动布局（需 fixedAndScroll=true） |
| getEleByIdPubFn(tail) | 通过 id 尾缀获取元素 |
| changeThemePubFn(mode) | 切换主题：`ml-country-selector-dark`/日间 |

---

## 搜索模式说明
- 本地搜索（默认）：支持连续/全局匹配；可选拼音匹配（`supportEnSearch`，在非全局模式下生效）。
- 服务端搜索：`useServerSeach=true` 时启用；输入变化→推荐接口 `serverTjAPI`；回车（需 `inputType='search'`）→检索接口 `serverSeaAPI`。

数据格式示例：
```js
// 自定义国家数据
countryList: [
  { value: 'Japan', label: '日本', code: 81, pingyin: 'riben' },
  { value: 'China', label: '中国', code: 86, pingyin: 'zhongguo' },
]

// 服务端返回示例（推荐/检索统一）
{
  code: 110000,
  message: '',
  data: {
    listData: [
      { value: 'Japan', label: '日本', index: 81, code: 81 },
      { value: 'Jli', label: '日里', index: 82, code: 82 }
    ]
  }
}
```

---

## 在不同框架中的使用

### Vue（hash 路由）
```ts
onMounted(() => {
  mlCountrySelector.initializationFn({ el: '#container', selectedCallback: console.log }).render();
});
```
说明：组件侧边导航不改变 `location.hash`，与 Vue Router（hash 模式）兼容。

### React
```tsx
useEffect(() => {
  mlCountrySelector.initializationFn({ el: '#container', selectedCallback: console.log }).render();
}, []);
```

### 原生 HTML
见“快速开始” UMD 示例。

---

## 可访问性与国际化
- 交互元素提供 `role="button" tabindex="0"`
- 图标可通过 `customOptions` 使用 Base64 或 URL
- 样式使用 rem，请按业务场景设置根字号

---

## 开发与测试
```bash
npm i
npm run dev        # 本地示例
npm run test       # 单元测试
npm run coverage   # 覆盖率（text + lcov）
```
项目已接入 GitHub Actions：push/PR 到 `master|main` 自动运行测试并上传覆盖率产物。

---

## 常见问题（FAQ）
- 侧边字母点击会改变 URL 吗？不会，已移除 href，与 hash 路由兼容。
- 服务端搜索不生效？确认 `useServerSeach=true` 且 `inputType='search'`；返回格式参见上文示例。
- 如何自定义图标？通过 `customOptions` 传入 Base64 或 URL。
- 如何优化滚动？设置 `fixedAndScroll=true`，按需配置 `scrollviewHeight`。

---

## 贡献指南
欢迎提交 Issue/PR：
- 代码：TypeScript；提交前运行 `npm run test`
- 新功能请附带最小示例与测试

## 许可证
ISC
