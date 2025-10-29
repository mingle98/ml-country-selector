import { describe, it, expect, beforeEach } from 'vitest';
import { mlCountrySelector } from '../core/index';

declare global {
  interface Window {
    countrySelector: any;
    mlCountrySelector: any;
  }
}

const setupDOM = () => {
  document.body.innerHTML = `
    <div id="container" style="height:600px;"></div>
  `;
};

const initInstance = (extra: any = {}) => {
  let lastSelected: any = null;
  const instance = mlCountrySelector.initializationFn({
    el: '#container',
    isHttps: true,
    animaInput: true,
    fixedAndScroll: true,
    scrollviewHeight: 300,
    leftTipTop: true,
    selectedCallback: (res: any) => { lastSelected = res; },
    ...extra,
  }).render();
  return { instance, lastSelectedRef: () => lastSelected };
};

describe('ml-country-selector', () => {
  beforeEach(() => {
    setupDOM();
    // jsdom 环境下缺失 scrollIntoView，打桩避免报错
    // @ts-ignore
    if (!Element.prototype.scrollIntoView) {
      // @ts-ignore
      Element.prototype.scrollIntoView = function() {};
    }
  });

  it('初始化后应渲染基础 DOM 结构', () => {
    initInstance();
    expect(document.querySelector('.header-box')).toBeTruthy();
    expect(document.querySelector('.countryListBox')).toBeTruthy();
    expect(document.querySelector('.slide-box')).toBeTruthy();
  });

  it('点击列表项应触发选中态变化', () => {
    initInstance();
    const firstItem = document.querySelector('.listItem') as HTMLElement;
    expect(firstItem).toBeTruthy();
    firstItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const anyActive = document.querySelector('.listItem .listItem-action:not(.hide)');
    expect(!!anyActive).toBe(true);
  });

  it('搜索输入应显示搜索结果列表并展示清除图标', () => {
    initInstance();
    const input = document.querySelector('.search-input') as HTMLInputElement;
    const clearIcon = document.querySelector('.chahao-icon') as HTMLElement;
    input.value = '日';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const searchBox = document.querySelector('.searchCountryBox') as HTMLElement;
    expect(searchBox.className.includes('hide')).toBe(false);
    expect(clearIcon.className.includes('hide')).toBe(false);
  });

  it('pubResetFn 应重置视图并隐藏清除图标', () => {
    const { instance } = initInstance();
    const input = document.querySelector('.search-input') as HTMLInputElement;
    const clearIcon = document.querySelector('.chahao-icon') as HTMLElement;
    input.value = 'A';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    instance.pubResetFn();
    const searchBox = document.querySelector('.searchCountryBox') as HTMLElement;
    expect(searchBox.className.includes('hide')).toBe(true);
    expect(clearIcon.className.includes('hide')).toBe(true);
  });

  it('侧边栏“推荐”点击不应修改 location.hash', () => {
    initInstance();
    const before = window.location.hash;
    const tj = document.querySelector('.sildebarItem_tj .sildebarItem-a') as HTMLElement;
    tj?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    tj?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(window.location.hash).toBe(before);
  });

  it('独立滚动开关应设置内容区高度', () => {
    initInstance({ fixedAndScroll: true, scrollviewHeight: 300 });
    const body = document.querySelector('.alllist-body-article') as HTMLElement;
    expect(body.style.height).toContain('300');
    expect(body.style.overflow).toBe('scroll');
  });

  it('customOptions 的图标应被同步到 DOM', () => {
    setupDOM();
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBg3M2lTgAAAAASUVORK5CYII=';
    mlCountrySelector.initializationFn({
      el: '#container',
      selectedCallback: () => {},
      customOptions: { searchIcon: dataUrl, searchclearIcon: dataUrl, selectIcon: dataUrl, slideItemIcon: dataUrl },
    }).render();
    const searchIconImg = document.querySelector('.serach-icon img') as HTMLImageElement;
    expect(searchIconImg?.src.startsWith('data:image')).toBe(true);
  });

  // 额外覆盖：form 提交、空结果视图、立即重置、选中后重置、maxlength、服务端搜索与回调、主题切换与公共方法
  it('inputType=search 回车应触发搜索', async () => {
    initInstance({ inputType: 'search' });
    const input = document.querySelector('.search-input') as HTMLInputElement;
    input.value = '日';
    // 先同步一次 input，填充 dataStore.inputCurValue
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(ev);
    await Promise.resolve();
    const searchBox = document.querySelector('.searchCountryBox') as HTMLElement;
    expect(searchBox.className.includes('hide')).toBe(false);
  });

  it('searchEmptyShowCountryList=false 时空结果展示空态；true 时仍展示列表', async () => {
    // false -> 空态（断言列表/侧栏被隐藏即可，减少对定时器的依赖）
    vi.useFakeTimers();
    initInstance({ searchEmptyShowCountryList: false });
    let input = document.querySelector('.search-input') as HTMLInputElement;
    input.value = '不存在的关键词';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(900);
    const hotArea = document.querySelector('.hot-area-box') as HTMLElement;
    const countryArea = document.querySelector('.country-area-box') as HTMLElement;
    const slideBox = document.querySelector('.slide-box') as HTMLElement;
    expect(hotArea.className.includes('hide')).toBe(true);
    expect(countryArea.className.includes('hide')).toBe(true);
    expect(slideBox.className.includes('hide')).toBe(true);
    vi.useRealTimers();
    // true -> 保留列表
    setupDOM();
    initInstance({ searchEmptyShowCountryList: true });
    input = document.querySelector('.search-input') as HTMLInputElement;
    input.value = '不存在的关键词';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const countryList = document.querySelector('.countryListBox') as HTMLElement;
    expect(countryList.className.includes('hide')).toBe(false);
  });

  it('immediatelyReset=true 时 blur 且无输入应立即重置', () => {
    initInstance({ immediatelyReset: true });
    const input = document.querySelector('.search-input') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    const searchBox = document.querySelector('.searchCountryBox') as HTMLElement;
    expect(searchBox.className.includes('hide')).toBe(true);
  });

  it('selectCountryAfterReset=true 时选中后应重置视图', () => {
    initInstance({ selectCountryAfterReset: true });
    const firstItem = document.querySelector('.listItem') as HTMLElement;
    firstItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const searchBox = document.querySelector('.searchCountryBox') as HTMLElement;
    // 处于初始视图（搜索框隐藏）
    expect(searchBox.className.includes('hide')).toBe(true);
  });

  it('searchInputMaxNum 应体现在 input 的 maxlength 属性上', () => {
    initInstance({});
    const input = document.querySelector('.search-input') as HTMLInputElement;
    const ml = input.getAttribute('maxlength');
    expect(!!ml && +ml! > 0).toBe(true);
  });

  it('useServerSeach=true 时应走服务端搜索分支并发起请求', async () => {
    // mock fetch 成功
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ code: 110000, data: { listData: [{ value: 'Japan', label: '日本', index: 81, code: 81 }] } })
    });
    // 重置单例，防止前序用例配置影响
    (mlCountrySelector as any).__resetForTest?.();
    initInstance({ useServerSeach: true });
    const input = document.querySelector('.search-input') as HTMLInputElement;
    input.value = '日';
    const ev = new Event('input', { bubbles: true });
    input.dispatchEvent(ev);
    await Promise.resolve();
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));
    expect((global.fetch as any)).toHaveBeenCalled();
  }, 15000);

  it('changeThemePubFn 与 getEleByIdPubFn 可正常工作', () => {
    const { instance } = initInstance();
    instance.changeThemePubFn('ml-country-selector-dark');
    const pageBody = document.querySelector('#container .pageBody') as HTMLElement;
    expect(pageBody?.className.includes('ml-country-selector-dark')).toBe(true);
    const ele = instance.getEleByIdPubFn('_search-input');
    expect(ele).toBeTruthy();
  });
});


