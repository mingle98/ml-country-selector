import { Options } from "../types/index";
import { CountrySeletor } from "./api/api";
import baseCss from "@/static/style/api.scss";
import darkCss from "@/static/style/api-dark.scss";

// 初始化
(function() {
    const STYLE_ID = 'ml-country-selector-style';
    try {
        if (!document.getElementById(STYLE_ID)) {
            const styleEl = document.createElement('style');
            styleEl.id = STYLE_ID;
            styleEl.type = 'text/css';
            styleEl.appendChild(document.createTextNode(String(baseCss || '') + String(darkCss || '')));
            const head = document.head || document.getElementsByTagName('head')[0];
            head.insertBefore(styleEl, head.firstChild || null);
        }
    } catch (e) {
        // ignore
    }
    window.mlCountrySelector = {};
    let countrySeletorInstance: CountrySeletor | null = null;
    window.mlCountrySelector.initializationFn = function (options: Options) {
        if (!countrySeletorInstance) {
            countrySeletorInstance = new CountrySeletor(options)
        };
        return countrySeletorInstance; 
    }
    // 仅测试用途：重置单例，避免跨用例的配置污染
    ;(window.mlCountrySelector as any).__resetForTest = function() {
        countrySeletorInstance = null;
    }
})();

export const mlCountrySelector = window.mlCountrySelector;