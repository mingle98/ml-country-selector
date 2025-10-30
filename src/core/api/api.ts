import { Config, CountryItem, DataStore, EventStoreObj, Options, TplStore } from './../../types/index';
import globalconfig from '../../config';
import { Base } from '../base/base';
import { utils } from '../../utils/index';
import { myhttp } from "../../utils/axios";
export class CountrySeletor {
    private isinputOutBtnCallbacking: boolean = false;
    private config: Config = {
        el: '',
        selectedCallback: function (): void {
            throw new Error('Function not implemented.');
        },
        errCallback: function (err: any): void {
            console.log(err);
        },
        inputOutBtnCallback: function() {
            console.log('inputOutBtnCallback init...');
        },
        inputBlurCallback: function() {
            console.log('inputBlurCallback init...');
        },
        inputFocusCallback: function() {
            console.log('inputFocusCallback init...');
        },
        domRenderAfterCallback: function() {
            console.log('domRenderAfterCallback init...');
        },
        searchClearIconCallback: function() {
            console.log('searchClearIconCallback init...');
        },
        apiStartCallback: function() {
            console.log('apiStartCallback init...');
        },
        apiEndCallback: function() {
            console.log('apiEndCallback init...');
        },
        immediatelyReset: false,
        globalSearchWord: false,
        serachDataIncludeRecommend: false,
        fixedAndScroll: false,
        scrollviewHeight: null,
        placeholder: '请输入国家(地区)名称',
        selectCountryAfterReset: false,
        scrollBodyBubble: false,
        searchEmptyShowCountryList: false,
        searchInputMaxNum: 20,
        searchWordAddStyle: false,
        leftTipTop: false,
        leftActionSpan: 0,
        inputType: 'text',
        useServerSeach: false,
        searchCountryApi: '',
        tjCountryApi: '',
        hotCountryList: [
            {
            code: 10086,
            label: '中国大陆',
            value: 'ChineseMainland',
        },
        {
            code: 1008601,
            label: '中国澳门',
            value: 'Macao',
        }, {
            code: 1008602,
            label: '中国台湾',
            value: 'Taiwan',
        }, {
            code: 1008603,
            label: '中国香港',
            value: 'Hongkong',
        }],
        animaInput: true,
        getPolyFill: false,
        inputOutBtnTxt: '退出',
        colaKey: '',
        // 是否支持拼音搜索,默认false
        supportEnSearch: false,
        // 自定义一些配置项
        customOptions: {
            // 搜索框清楚图标 可以url也可以base64
            searchclearIcon: '',
            // 搜索放大镜图标 可以url也可以base64
            searchIcon: '',
            // 国家选中态图标 可以url也可以base64
            selectIcon: '',
            // 侧边栏字母选中态图标 可以url也可以base64
            slideItemIcon: '',
        },
    }
    private dataStore: DataStore = {
        xArr: [],
        originCountryList: [],
        currentFillterArr: [],
        domDetailData: [],
        currSelectedItem: null,
        currSelectedSlideItem: null,
        curTouchItem: { evetEle: '', content: '' },
        inputCurValue: '',
        getPolyfillok: 0,
        isSelectingStatus: false,
        inputDone: true,
        inputDoneTimer: null,
    };
    protected baseCls = new Base();
    constructor(public options: Options) {
        this.init();
    };
    /**
     * http请求方法
     *
     * @param options 请求参数对象
     * @returns 返回一个Promise对象
     */
    private $http(options: {
        method: 'post' | 'get';
        url: string;
        params: any;
        data: any;
    }) {
        let me = this;
        return new Promise((resove, reject) => {
            me.config.apiStartCallback
            && typeof me.config.apiStartCallback === 'function'
            && me.config.apiStartCallback();
            myhttp({
                method: options.method || 'get',
                url: options.url,
                data: options.data || {},
                params: options.params || {},
            }).then((res: any) => {
                resove(res);
            }).catch(err => {
                console.log('http error:', err);
                reject(err);
            }).finally(() => {
                me.config.apiEndCallback
                && typeof me.config.apiEndCallback === 'function'
                && me.config.apiEndCallback();
            })
        })
    };

    private init() {
        let me = this;
        me.initData();
    };
    /**
     * 初始化数据
     */
    private initData() {
        let me = this;
        this.config.countryList = globalconfig.countryData;
        Object.assign(this.config, { 
            ...this.options
        });
        this.dataStore.originCountryList = this.config.countryList;
        // 分组格式化国家数据
        const { res , xArr } = utils.formateCountryData(this.config.countryList); 
        this.config.countryList = res;
        this.dataStore.xArr = xArr;
        // 同步自定义配置项
        this.syncCustomOptionsFn();
        try {
            if (this.config.getPolyFill && globalconfig.polyfillSrc) {
                let s = document.createElement('script');
                s.src = globalconfig.polyfillSrc;
                document.body.appendChild(s);
                s.onload = function() {
                    me.dataStore.getPolyfillok = 1;
                };
                s.onerror = function() {
                    console.warn('polyfill 加载失败：', globalconfig.polyfillSrc);
                    me.dataStore.getPolyfillok = -1;
                };
            } else if (this.config.getPolyFill && !globalconfig.polyfillSrc) {
                console.warn('polyfill 未配置有效地址，已跳过加载');
            }
        } catch (error) {
            console.log('catch err:', error);
        }
    };
    public render() {
        let me = this;
        if (!me.config.el || !me.baseCls.getEleByIdFromPage(me.config.el)) {
            console.log('请配置有效的容器id');
            alert('请配置有效的容器id');
            return;
        };
        let ishttps = this.options.isHttps || false;
        let pro = ishttps ? 'https' : 'http';
        this.insertHtml();
        this.config.domRenderAfterCallback
        && typeof this.config.domRenderAfterCallback === 'function'
        && this.config.domRenderAfterCallback();
        return me;
    };
    /**
     * 获取模板内容
     * 
     * @param type 模板类型
     * @returns 模板字符串
     */
    private getTpl(type: keyof TplStore) {
        const recommendTpls = {
            sildebarItem: '<li class="sildebarItem sildebarItem_tj" id="' + globalconfig.$id_prefix
            + '_sildebarItem_TJ" content="TJ"><p class="sildebarItem-bubble sildebarItem-bubbl_tj hide" id="'
            + globalconfig.$id_prefix + '_sildebarItem-bubble_TJ"><span class="sildebarItem-bubble-txt sildebarItem-bubble-txt_tj">推荐</span></p>'
            + '<a content="TJ" class="sildebarItem-a" role="button" tabindex="0">推荐</a></li>',
        };
        let isSearchInput = this.config.inputType === 'search';
        const tplStore: TplStore = {
            pageBody: '<div class="pageBody" id="' + globalconfig.$id_prefix
                    + '_pageBody"  onselectstart="return false"><section class="header-box" id="'
                    + globalconfig.$id_prefix + '_header-box">{{inputBox}}'
                    + '<div class="topTip-wrap hide" id="' +globalconfig.$id_prefix
                    + '_topTip-wrap"><p class="body-article-tipTop" id="' +globalconfig.$id_prefix + '_body-article-tipTop">推荐</p></div>'
                    + '</section><article class="alllist-body-article" id="' + globalconfig.$id_prefix + '_alllist-body-article">'
                    + '<section class="hot-area-box" id="' + globalconfig.$id_prefix + '_hot-area-box">{{hotCountryBox}}</section>'
                    + '<section class="country-area-box" id="' + globalconfig.$id_prefix
                    + '_country-area-box">{{countryListBox}}</section>{{searchCountryBox}}</article>'
                    + '<div class="slide-box" id="' + globalconfig.$id_prefix + '_slide-box">{{sildebarBox}}</div></div></div>',
            inputBox: '<div class="inputBox" id="' + globalconfig.$id_prefix + '_inputBox"><div id="' + globalconfig.$id_prefix
                    + '_search-input-wrapper" class="search-input-wrapper"><div class="serach-icon"><img src="'
                    + globalconfig.searchIconBase64 + '" alt="图标"></div>' + (isSearchInput ? '<form action="javascript:return false;" id="' + globalconfig.$id_prefix
                    + '_search-inputform">' : '') + '<input type="' + this.config.inputType + '" name="searchValue" enterkeyhint="' + (isSearchInput ? 'search' : 'done') + '" id="'
                    + globalconfig.$id_prefix + '_search-input" class="search-input" maxlength="'
                    + this.config.searchInputMaxNum + '" placeholder="' + this.config.placeholder + '" autocomplete="off">' + (isSearchInput ? '</form>' : '')
                    + '<span id="'+ globalconfig.$id_prefix  +'_chahao-icon" class="chahao-icon hide"><img src="'
                    + globalconfig.searchclearIconBase64 + '" alt="图标"></span></div><p class="input-out-btn input-out-btn-hide" id="'
                    + globalconfig.$id_prefix + '_input-out-btn">' + this.config.inputOutBtnTxt + '</p></div>',
            hotCountryBox: '<div class="hotCountryBox" id="' + globalconfig.$id_prefix +'_hotCountryBox" bebal="TJ"><p class="hot-country-babel" id="'
                            + globalconfig.$id_prefix +'_hot-country-babel"><a id="TJ">推荐</a></p><ul class="hot-countrylist-ul"  id="'
                            + globalconfig.$id_prefix + '_hot-countrylist-ul">{{hotCountryList}}</ul></div>',
            countryListBox: '<div class="countryListBox" id="' + globalconfig.$id_prefix + '_countryListBox">{{countryList}}</div>',
            sildebarBox: '<div class="sildebarBox" id="' + globalconfig.$id_prefix
                        + '_sildebarBox">' + recommendTpls.sildebarItem + '{{sildebarItems}}</div>',
            countryListItem: '<ul class="countryListItem" id="' + globalconfig.$id_prefix + '_countryListItem_{{bebal}}" bebal="{{bebal}}">'
                        + '<a class="itemBebal" id="{{itemBebal}}">{{itemBebal}}</a>{{countryListItems}}</ul>',
            listItem: '<li class="listItem" id="' + globalconfig.$id_prefix + '_listItem_{{countryCode}}" data-index="{{listItemIndex}}" '
                    + 'data-name="{{listItemName}}" data-enname="{{listItemEnName}}" data-countryCode="{{countryCode}}">{{item}}'
                    + '<div class="listItem-action hide"><img src="' + globalconfig.selectIconBase64 + '" alt="图标"></div></li>',
            sildebarItem: '<li class="sildebarItem" id="' + globalconfig.$id_prefix
                + '_sildebarItem_{{item}}" content="{{item}}"><p class="sildebarItem-bubble hide" id="'
                + globalconfig.$id_prefix + '_sildebarItem-bubble_{{item}}"><img src="'
                + globalconfig.slideItemIconBase64 + '" alt="图标"><span class="sildebarItem-bubble-txt">{{item}}</span></p>'
                + '<a content="{{item}}" class="sildebarItem-a">{{item}}</a></li>',
            searchCountryBox: '<section class="searchCountryBox" id="' + globalconfig.$id_prefix
                + '_searchCountryBox"><ul class="searchCountry-ul" id="'
                + globalconfig.$id_prefix + '_searchCountry-ul"></ul></section>',
            searchEmptyIcon: '<p id="' + globalconfig.$id_prefix + '_searchCountry-emptyicon" class="searchCountry-emptyicon"></p>'
        }
        return tplStore[type];
    };
    private insertHtml() {
        let hotListItems = this.getCountryliFn(this.config.hotCountryList!);
        let hotCountryBoxTpl = this.getTpl('hotCountryBox').replace(/{{hotCountryList}}/g, hotListItems);
        let countryListItemtpls = this.getCountrySortitemFn(this.config.countryList!);
        let countryListBoxTpl = this.getTpl('countryListBox').replace(/{{countryList}}/g, countryListItemtpls);
        let sildebarItems = this.getCountryliFn(this.dataStore.xArr, false);
        let sildebarBoxTpl = this.getTpl('sildebarBox').replace(/{{sildebarItems}}/g, sildebarItems);
        let searchCountryBoxTpl = this.getTpl('searchCountryBox');
        let tempTpl = this.getTpl('pageBody').replace(/{{inputBox}}/g, this.getTpl('inputBox'))
            .replace(/{{hotCountryBox}}/g, hotCountryBoxTpl)
            .replace(/{{countryListBox}}/g, countryListBoxTpl)
            .replace(/{{sildebarBox}}/g, sildebarBoxTpl)
            .replace(/{{searchCountryBox}}/g, searchCountryBoxTpl);
        this.baseCls.insertHTML('afterBegin', tempTpl, this.baseCls.getEleByIdFromPage(this.config.el));
        // 先隐藏搜索列表
        let searchCountryBoxEle = this.baseCls.getEleById('_searchCountryBox');
        searchCountryBoxEle && this.baseCls.addClass(searchCountryBoxEle, 'hide');
        // 先存储需要的dom节点详细信息
        this.saveDomDetailData(this.setfixedAndScroll.bind(this));
        // 默认推荐的侧边选中态
        let tjSlideItemEle = this.baseCls.getEleById('_sildebarItem_TJ');
        tjSlideItemEle && this.baseCls.addClass(tjSlideItemEle, 'sildebarItem_tj_active');
        // console.log('tempTpl:', tempTpl)
        this.setEvent();
    };
    private getCountryliFn(dataArr: CountryItem[] | string[], isCountryli: boolean = true, isSearchShowLi: boolean = false) {
        let temp = '';
        if (!Array.isArray(dataArr)) {
            dataArr = [dataArr];
        };
        if (dataArr.length) {
            for (let i = 0; i < dataArr.length; i++) {
                let item = dataArr[i];
                let type = '';
                // console.log('item:', item)
                if (!isCountryli) {
                    type = 'sildebarItem';
                    temp += this.getTpl(type as keyof TplStore).replace(/{{item}}/g, item as string);
                } else {
                    type = 'listItem';
                    temp += this.getTpl(type as keyof TplStore)
                        .replace(/{{item}}/g, isSearchShowLi && (item as CountryItem).label2 ?  (item as CountryItem).label2 : (item as CountryItem).label)
                        .replace(/{{listItemIndex}}/g, (item as CountryItem).index)
                        .replace(/{{listItemName}}/g, (item as CountryItem).label)
                        .replace(/{{listItemEnName}}/g, (item as CountryItem).value)
                        .replace(/{{countryCode}}/g, (item as CountryItem).code)
                }
            }
        };
        return temp;
    };
    private getCountrySortitemFn(countrys: any[]) {
        let tempArr: string[] = [];
        if (!countrys.length) {
            countrys = this.config.countryList!;
        };
        if (countrys.length) {
            for (let i = 0; i < countrys.length; i++) {
                let countryObj = countrys[i];
                let dataArr = countryObj[countryObj.babel];
                let lis = this.getCountryliFn(dataArr);
                let itemTpl = lis ? this.getTpl('countryListItem')
                            .replace(/{{bebal}}|{{itemBebal}}/g, countryObj.babel)
                            .replace(/{{countryListItems}}/g, lis) : '';
                tempArr.push(itemTpl);
            }
        };
        return tempArr.join('');
    };
    /**
     * 设置事件处理器，绑定所有的事件处理函数
     */
    private setEvent() {
        let headerBoxEle = this.baseCls.getEleById('_hot-countrylist-ul');
        let countryListBoxEle = this.baseCls.getEleById('_countryListBox');
        let searchInputEle = this.baseCls.getEleById('_search-input');
        let searchCountryBoxEle = this.baseCls.getEleById('_searchCountryBox');
        let inputOutBtnEle = this.baseCls.getEleById('_input-out-btn');
        let sildebarBoxEle = this.baseCls.getEleById('_sildebarBox');
        let alllistbodyArticleEle = this.baseCls.getEleById('_alllist-body-article');
        let chahaoIconEle = this.baseCls.getEleById('_chahao-icon');
        let searchInputformEle = this.baseCls.getEleById('_search-inputform');
        this.baseCls.addEventHandler(chahaoIconEle, 'click', this.getEventStoreFn('selectClearIconFn') as EventStoreObj['selectClearIconFn']);
        this.baseCls.addEventHandler(countryListBoxEle, 'click', this.getEventStoreFn('selectCountryFn') as EventStoreObj['selectCountryFn']);
        this.baseCls.addEventHandler(headerBoxEle, 'click', this.getEventStoreFn('selectCountryFn')as EventStoreObj['selectCountryFn']);
        this.baseCls.addEventHandler(searchCountryBoxEle, 'click', this.getEventStoreFn('selectCountryFn')as EventStoreObj['selectCountryFn']);
        this.baseCls.addEventHandler(searchInputEle, 'input', this.baseCls.throttle(this.getEventStoreFn('seachInputFn')as EventStoreObj['seachInputFn']));
        this.baseCls.addEventHandler(searchInputEle, 'blur', this.getEventStoreFn('inputBlurFn') as EventStoreObj['inputBlurFn']);
        this.baseCls.addEventHandler(searchInputEle, 'focus', this.getEventStoreFn('inputFocusFn')as EventStoreObj['inputFocusFn']);
        this.baseCls.addEventHandler(inputOutBtnEle, 'click', this.getEventStoreFn('inputOutBtnFn')as EventStoreObj['inputOutBtnFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'touchstart', this.getEventStoreFn('selectSlideItemFn')as EventStoreObj['selectSlideItemFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'touchstart', this.getEventStoreFn('touchstartFn')as EventStoreObj['touchstartFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'touchend', this.getEventStoreFn('touchendFn')as EventStoreObj['touchendFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'touchcancel', this.getEventStoreFn('touchendFn') as EventStoreObj['touchendFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'mousedown', this.getEventStoreFn('selectSlideItemFn')as EventStoreObj['selectSlideItemFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'mousedown', this.getEventStoreFn('touchstartFn')as EventStoreObj['touchstartFn']);
        this.baseCls.addEventHandler(sildebarBoxEle, 'mouseup', this.getEventStoreFn('touchendFn') as EventStoreObj['touchendFn']);
        // this.baseCls.addEventHandler(searchInputformEle, 'submit', this.getEventStoreFn('formSubmitFn') as EventStoreObj['formSubmitFn']);
        this.baseCls.addEventHandler(searchInputEle, 'keydown', this.getEventStoreFn('formSubmitFn') as EventStoreObj['formSubmitFn']);
        if (this.config.scrollBodyBubble) {
            this.baseCls.addEventHandler(alllistbodyArticleEle, 'touchstart', (e: any) => {
                (this.getEventStoreFn('touchstartFn') as EventStoreObj['touchstartFn'])(e, false);
            });
            // this.baseCls.addEventHandler(alllistbodyArticleEle, 'touchmove', (e: any) => {
            //     (this.getEventStoreFn('touchstartFn') as EventStoreObj['touchstartFn'])(e, false);
            // });
            this.baseCls.addEventHandler(alllistbodyArticleEle, 'touchend', (e: any) => {
                (this.getEventStoreFn('touchendFn') as EventStoreObj['touchendFn'])(e);
            });
            this.baseCls.addEventHandler(alllistbodyArticleEle, 'touchcancel', (e: any) => {
                (this.getEventStoreFn('touchendFn') as EventStoreObj['touchendFn'])(e);
            });
        };
        // 进行滚动跟随
        this.setScrollFlowFn();
        // this.baseCls.addEventHandler(countryListBoxEle, 'touch', this.getEventStoreFn('selectCountryFn'));
        // this.baseCls.addEventHandler(headerBoxEle, 'touch', this.getEventStoreFn('selectCountryFn'));

    };
    /**
     * 设置滚动流函数
     * 
     * @returns {void}
     */
    private setScrollFlowFn() {
        let observeLists = document.querySelectorAll('.countryListItem');
        let observetj = this.baseCls.getEleById('_hotCountryBox');
        let options = {
            root: this.config.fixedAndScroll ? this.baseCls.getEleById('_alllist-body-article') : null,
            rootMargin: '0px',
            threshold: [0, 0.95, 0.9, 0.99, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.01, 0.02, 0.03, 0.05, 0.07]
        };
        if (!('IntersectionObserver' in window)) {
            console.log('当前浏览器不支持IntersectionObserver');
            return;
        };
        const oberver = new IntersectionObserver((entrys, observer) => {
            for (let i = 0; i < entrys.length; i++) {
                let item = entrys[i];
                let currentEle = item.target;
                const { intersectionRatio, isIntersecting, boundingClientRect } = item;
                // if (intersectionRatio > 0
                //     && intersectionRatio < 1
                //     && boundingClientRect.y < 0
                //     && isIntersecting) {
                let theleftActionSpan = this.config.leftActionSpan || 0;
                if (boundingClientRect.y < (50 + theleftActionSpan)) {
                    const bebal = currentEle.getAttribute('bebal');
                    if (!bebal) return;
                    let autoActiveSlideItem = this.baseCls.getEleById('_sildebarItem_' + bebal);
                    bebal && (this.dataStore.currSelectedSlideItem = autoActiveSlideItem);
                    // console.log('交叉需要active是:', bebal, autoActiveSlideItem, this.dataStore.currSelectedSlideItem);
                    if (this.dataStore.isSelectingStatus) {
                        return false;
                    }
                    this.setSelectorActive('abc');
                }
            }
        }, options);
        for (let i = 0; i < observeLists.length; i++) {
            let item = observeLists[i];
            oberver.observe(item);
        };
        oberver.observe(observetj!);
    };
    /**
     * 获取事件存储函数
     *
     * @param type - 事件类型
     * @returns 返回事件存储对象中的对应函数
     */
    private getEventStoreFn(type: keyof EventStoreObj) {
        let me = this;
        let hotAreaBoxEle = me.baseCls.getEleById('_hot-area-box');
        let countryAreaBoxEle = me.baseCls.getEleById('_country-area-box');
        let searchCountryBoxEle = me.baseCls.getEleById('_searchCountryBox');
        let searchInputWrapperEle = this.baseCls.getEleById('_search-input-wrapper');
        let chahaoIconEle = this.baseCls.getEleById('_chahao-icon');
        let searchInputEle = this.baseCls.getEleById('_search-input');
        let slideBoxEle = me.baseCls.getEleById('_slide-box');
        let inputOutBtnEle = me.baseCls.getEleById('_input-out-btn');
        const eventStoreObj: EventStoreObj = {
            selectCountryfning: false,
            seachInputFning: false,
            resArr: [],
            isSelecting: false,
            selectCountryFn: function (e: any): void {
                try {
                    if (!e.target.className || !((/^listItem\s*/g).test(e.target.className))) return;
                    let resData = {
                        rescode: -1,
                        eventItemData: {},
                        selectCountry: '' as any,
                        originCountryData: me.dataStore.originCountryList
                    };
                    if (e.target && e.target.dataset){
                        resData = {
                            rescode: 0,
                            eventItemData: e.target.dataset,
                            selectCountry: me.dataStore.originCountryList[e.target.dataset.index],
                            originCountryData: me.dataStore.originCountryList
                        };
                    } else if (e.target && e.target.getAttribute('data-index')) {
                        resData = {
                            rescode: 0,
                            eventItemData: {
                                index: e.target.getAttribute('data-index'),
                                name: e.target.getAttribute('data-name'),
                                enname: e.target.getAttribute('data-enname'),
                                countrycode: e.target.getAttribute('data-countrycode'),
                            },
                            selectCountry: me.dataStore.originCountryList[e.target.getAttribute('data-index')],
                            originCountryData: me.dataStore.originCountryList
                        };
                    }
                    me.dataStore.currSelectedItem = {
                        ...resData,
                        ele: e.target
                    };
                    me.setSelectorActive('country');
                    me.config.selectedCallback
                    && typeof me.config.selectedCallback === 'function'
                    && me.config.selectedCallback(resData);
                    me.config.selectCountryAfterReset && eventStoreObj.resetstatusFn();
                } catch (error) {
                    me.config.errCallback
                    && typeof me.config.errCallback === 'function'
                    && me.config.errCallback(error);
                }
            },
            selectSlideItemFn: function(e) {
                // console.log('selectSlideItemFn:', e.target);
                if (me.dataStore.isSelectingStatus) {
                    return false;
                }
                me.dataStore.isSelectingStatus = true;
                me.dataStore.isSelectingStatus && setTimeout(() => {
                    me.dataStore.isSelectingStatus = false;
                }, 2000);
                let eventItem: any= me.dataStore.currSelectedSlideItem = e.target;
                // console.log('sildebarItem_active item:',me.dataStore.currSelectedSlideItem);
                if (/^sildebarItem-a\s*/g.test(eventItem?.getAttribute('class'))) {
                    eventItem.onclick = function(e: any) {
                        e.preventDefault();
                        let content = eventItem.getAttribute('content');
                        let scroolTargrt = document.getElementById(content);
                        if (scroolTargrt) {
                            let tipTopWrapEle = me.baseCls.getEleById('_topTip-wrap');
                            tipTopWrapEle && me.baseCls.addClass(tipTopWrapEle, 'hide');
                            scroolTargrt.scrollIntoView({
                                behavior: 'smooth'
                            });
                            me.setSelectorActive('abc');
                        }
                    }
                };
            },
            touchstartFn: function (e, isSlideArea: boolean = true) {
                eventStoreObj.selectSlideItemFn(e);
                if (!isSlideArea && !me.dataStore.currSelectedSlideItem) return;
                me.dataStore.curTouchItem.evetEle = isSlideArea ? e.target : me.dataStore.currSelectedSlideItem;
                me.dataStore.curTouchItem.content = (me.dataStore.curTouchItem.evetEle as any).getAttribute('content');
                let selectItemBuble = me.baseCls.getEleById('_sildebarItem-bubble_' + me.dataStore.curTouchItem.content);
                selectItemBuble && me.baseCls.removeClass(selectItemBuble, 'hide');
                // console.log('touchstartFn:', selectItemBuble);
            },
            touchendFn: function (e) {
                let selectItemBuble = me.baseCls.getEleById('_sildebarItem-bubble_' + me.dataStore.curTouchItem.content);
                selectItemBuble && me.baseCls.addClass(selectItemBuble, 'hide');
            },
            seachInputFn: async function (e: InputEvent, isResSence = false): Promise<any> {
                let tipTopWrapEle = me.baseCls.getEleById('_topTip-wrap');
                let value = '';
                if (isResSence) {
                    value = me.dataStore.inputCurValue.toString() || '';
                } else {
                    value = me.dataStore.inputCurValue = (e.target as HTMLInputElement).value.trim();
                }
                if (value) {
                    chahaoIconEle && me.baseCls.removeClass(chahaoIconEle, 'hide');
                } else {
                    chahaoIconEle && me.baseCls.addClass(chahaoIconEle, 'hide');
                }
                if (!value) return [];
                let allDataList = [...me.dataStore.originCountryList];
                if (me.config.serachDataIncludeRecommend) {
                    allDataList = [...me.dataStore.originCountryList, ...me.config.hotCountryList!];
                };
                let resArr: any[] = [];
                let searchCountryApi = me.config.searchCountryApi || globalconfig.apisCfg.searchCountryApi;
                let tjCountryApi = me.config.tjCountryApi || globalconfig.apisCfg.tjCountryApi;
                let httpAPI = isResSence ? searchCountryApi : tjCountryApi;
                if (me.config.useServerSeach) {
                    try {
                       let result: any = await me.$http({
                            method: 'get',
                            data: {},
                            params: {
                                word: value
                            },
                            url: httpAPI
                        });
                        console.log('自定义接口结果：', result);
                        if (+result.code === 110000) {
                            resArr = utils.formateServerCountryData(value, result.data.listData, !isResSence);
                        }
                    } catch (error) {}
                    console.log('搜索结果数据1：', resArr);
                } else {
                    resArr = eventStoreObj.resArr = me.dataStore.currentFillterArr = utils.getSearchCountryArr(value,
                        allDataList, me.config.globalSearchWord!, me.config.searchWordAddStyle, me.config.supportEnSearch);
                    console.log('搜索结果数据2：', resArr);
                }
                function showView() {
                    me.baseCls.addClass(hotAreaBoxEle!, 'hide');
                    me.baseCls.addClass(countryAreaBoxEle!, 'hide');
                    me.baseCls.addClass(slideBoxEle!, 'hide');
                    me.baseCls.removeClass(searchCountryBoxEle!, 'hide');
                    utils.emptyAllChildNodes(searchCountryBoxEle!, function() {
                        let lis = me.getCountryliFn(resArr, true, true);
                        me.baseCls.insertHTML('afterBegin', lis, searchCountryBoxEle);
                    });
                }
                function appendEmptyIcon(ishide: boolean = false) {
                    if (!me.dataStore.inputDone && !ishide) return;
                    me.baseCls.addClass(hotAreaBoxEle!, 'hide');
                    me.baseCls.addClass(countryAreaBoxEle!, 'hide');
                    me.baseCls.addClass(slideBoxEle!, 'hide');
                    me.baseCls.removeClass(searchCountryBoxEle!, 'hide');
                    utils.emptyAllChildNodes(searchCountryBoxEle!, function() {
                        if (!ishide) {
                            let emptyIconTpl =  me.getTpl('searchEmptyIcon');
                            me.baseCls.insertHTML('afterBegin', emptyIconTpl, searchCountryBoxEle);
                        }
                    });
                }
                function hideTopTipsFn() {
                    let tipTopWrapEle = me.baseCls.getEleById('_topTip-wrap');
                    if (tipTopWrapEle && !(/^hide$/g.test(tipTopWrapEle.getAttribute('class') || ''))) {
                        setTimeout(() => {
                            tipTopWrapEle && me.baseCls.addClass(tipTopWrapEle, 'hide');
                        }, 10);
                    }
                }
                me.dataStore.inputDoneTimer && clearTimeout(me.dataStore.inputDoneTimer);
                appendEmptyIcon(true);
                if (resArr.length) {
                    showView();
                    hideTopTipsFn();
                    return;
                } else if (!me.config.searchEmptyShowCountryList) {
                    hideTopTipsFn();
                    me.dataStore.inputDone = false;
                    me.dataStore.inputDoneTimer && clearTimeout(me.dataStore.inputDoneTimer);
                    appendEmptyIcon(true);
                    me.dataStore.inputDoneTimer = setTimeout(() => {
                        me.dataStore.inputDone = true;
                        appendEmptyIcon();
                    }, 800);
                } else {
                    console.log('没有查询到任何信息');
                }
                // console.log('seachInputFn:', value, resArr);
            },
            inputBlurFn: function (e: InputEvent) {
                let value = me.dataStore.inputCurValue = (e.target as HTMLInputElement).value.trim();
                // if (!value && me.config.animaInput) {
                    // me.baseCls.removeClass(searchInputWrapperEle!, 'search-input_after');
                    // me.baseCls.removeClass(searchInputEle!, 'search-input_after');
                    // me.baseCls.addClass(inputOutBtnEle!, 'input-out-btn-hide');
                // };
                // console.log('inputBlurFn',  me.dataStore.currentFillterArr);
                if ((!value || !me.dataStore.currentFillterArr.length) && me.config.immediatelyReset) {
                    eventStoreObj.resetstatusFn();
                };
                me.config.inputBlurCallback && typeof me.config.inputBlurCallback === 'function' && me.config.inputBlurCallback(e);
            },
            formSubmitFn: async function(e: any) {
                let isSearchInput = me.config.inputType === 'search';
                if (isSearchInput && e && e.keyCode && +e.keyCode === 13) {
                    await eventStoreObj.seachInputFn(e, true);
                    setTimeout(() => {
                        searchInputEle && searchInputEle.blur();
                    }, 1000);
                } else if (e && e.keyCode && +e.keyCode === 13) {
                    searchInputEle && searchInputEle.blur();
                }
            },
            inputFocusFn: function(e: InputEvent) {
                if (me.config.animaInput) {
                    me.baseCls.addClass(searchInputWrapperEle!, 'search-input_after');
                    me.baseCls.addClass(searchInputEle!, 'search-input_after');
                    setTimeout( () => {
                        me.baseCls.removeClass(inputOutBtnEle!, 'input-out-btn-hide');
                    }, 300);
                };
                me.config.inputFocusCallback && typeof me.config.inputFocusCallback === 'function' && me.config.inputFocusCallback(e);
            },
            inputOutBtnFn: function (e: any) {
                me.config.inputOutBtnCallback && typeof me.config.inputOutBtnCallback === 'function' && me.config.inputOutBtnCallback(e);
                if (me.config.animaInput) {
                    me.baseCls.removeClass(searchInputWrapperEle!, 'search-input_after');
                    me.baseCls.removeClass(searchInputEle!, 'search-input_after');
                };
                me.baseCls.addClass(inputOutBtnEle!, 'input-out-btn-hide');
            },
            countrySelectActiveFn: function() {
                let currSelectedItemEle = me.dataStore.currSelectedItem?.ele;
                if (!currSelectedItemEle) return;
                currSelectedItemEle.lastChild
                    && (/^listItem-action\s*/g).test(currSelectedItemEle.lastChild.getAttribute('class'))
                    && me.baseCls.removeClass(currSelectedItemEle.lastChild, 'hide');
            },
            abcSelectActiveFn: function() {
                let tipTopWrapEle = me.baseCls.getEleById('_topTip-wrap');
                let bodyArticleTipTopEle = me.baseCls.getEleById('_body-article-tipTop');
                let curItem = me.dataStore.currSelectedSlideItem;
                let content = curItem.getAttribute('content');
                let selectItem = content ? me.baseCls.getEleById('_sildebarItem_' + content) : curItem;
                // console.log('abcSelectActiveFn=>', selectItem, curItem);
                let isShowleftTipTop = false;
                if (selectItem && tipTopWrapEle && me.config.leftTipTop && me.config.fixedAndScroll) {
                    if (!me.dataStore.isSelectingStatus) {
                        me.baseCls.removeClass(tipTopWrapEle, 'hide');
                    }
                    content && bodyArticleTipTopEle && (bodyArticleTipTopEle.innerText = content);
                    isShowleftTipTop = true;
                } else if (tipTopWrapEle) {
                    me.baseCls.addClass(tipTopWrapEle, 'hide');
                    isShowleftTipTop = false;
                };
                if (selectItem && (/sildebarItem_tj/g).test(selectItem.getAttribute('class') || '')) {
                    selectItem && me.baseCls.addClass(selectItem, 'sildebarItem_tj_active');
                    // if (isShowleftTipTop) {
                    //     bodyArticleTipTopEle && (bodyArticleTipTopEle.innerText = '推荐');
                    // }
                    tipTopWrapEle && me.baseCls.addClass(tipTopWrapEle, 'hide');
                    isShowleftTipTop = false;
                } else {
                    selectItem && me.baseCls.addClass(selectItem, 'sildebarItem_active');    
                }
                // console.log('abcSelectActiveFn:', curItem.getAttribute('content'));
            },
            resetstatusFn: function() {
                me.baseCls.removeClass(hotAreaBoxEle!, 'hide');
                me.baseCls.removeClass(countryAreaBoxEle!, 'hide');
                me.baseCls.removeClass(slideBoxEle!, 'hide');
                me.baseCls.addClass(searchCountryBoxEle!, 'hide');
                // (searchInputEle! as HTMLInputElement).value = '';
                eventStoreObj.resArr = me.dataStore.currentFillterArr = [];
                me.resetAllSlideAction();
            },
            selectClearIconFn: function() {
                (searchInputEle as HTMLInputElement).value = '';
                chahaoIconEle && me.baseCls.addClass(chahaoIconEle, 'hide');
                me.config.searchClearIconCallback
                && typeof me.config.searchClearIconCallback === 'function'
                && me.config.searchClearIconCallback();

            }
        }
        return eventStoreObj[type];
    };
    /**
     * 重置所有滑动操作
     */
    private resetAllSlideAction() {
        let me = this;
        let slidelis = document.querySelectorAll('.sildebarItem');
        for (let i = 0; i < slidelis.length; i++) {
            let item = slidelis[i];
            if ((/sildebarItem_active/g).test(item.getAttribute('class') || '')) {
                me.baseCls.removeClass(item, 'sildebarItem_active');
            } else if ((/sildebarItem_tj_active/g).test(item.getAttribute('class') || '')) {
                me.baseCls.removeClass(item, 'sildebarItem_tj_active');
            };
            if ((/sildebarItem_tj/g).test(item.getAttribute('class') || '')) {
                me.baseCls.addClass(item, 'sildebarItem_tj_active');
            };
        }
    };

    /**
     * 重置函数
     *
     * @param ags 参数列表
     */
    public pubResetFn(...ags: any[]) {
        let searchInputEle = this.baseCls.getEleById('_search-input');
        (this.getEventStoreFn('resetstatusFn') as EventStoreObj['resetstatusFn'])();
        (searchInputEle as HTMLInputElement).value = '1';
        setTimeout( () => {
            (searchInputEle as HTMLInputElement).value = '';
        }, 100);
        (searchInputEle as HTMLInputElement).value = '';
        // 保证失去焦点且没有输入字符的时候隐藏清除icon
        let chahaoIconEle = this.baseCls.getEleById('_chahao-icon');
        !(searchInputEle as HTMLInputElement).value && chahaoIconEle && this.baseCls.addClass(chahaoIconEle, 'hide');
    };
    /**
     * 保存DOM详情数据
     *
     * @param callback 可选的回调函数
     * @returns 返回保存的数据
     */
    private saveDomDetailData(callback?: Function) {
        let headBoxEle = this.baseCls.getEleById('_header-box') as HTMLElement;
        let ArticlebodyEle = this.baseCls.getEleById('_alllist-body-article') as HTMLElement;
        let pageBody = this.baseCls.getEleById('_pageBody') as HTMLElement;
        let myContainerEle = this.baseCls.getEleByIdFromPage(this.config.el) as HTMLElement;
        function getDOMRectObj(name: string, data: DOMRect) {
            return {
                name,
                data
            }
        };
        headBoxEle && this.dataStore.domDetailData.push(getDOMRectObj('headBox', headBoxEle.getBoundingClientRect()));
        ArticlebodyEle && this.dataStore.domDetailData.push(getDOMRectObj('articlebody', ArticlebodyEle.getBoundingClientRect()));
        pageBody && this.dataStore.domDetailData.push(getDOMRectObj('pageBody', pageBody.getBoundingClientRect()));
        myContainerEle && this.dataStore.domDetailData.push(getDOMRectObj('myContainer', myContainerEle.getBoundingClientRect()));
        // console.log('domDetailData:', this.dataStore.domDetailData);
        callback && callback(this.dataStore.domDetailData);
        return this.dataStore.domDetailData;
    };
    // 设置数据区域独立滚动,搜索头区域固定
    public setfixedAndScroll(params?: {name: string, data: DOMRect}[]) {
        if (!this.config.fixedAndScroll) return;
        let headBoxDomRect = params?.find(item => item.name === 'headBox');
        let pageBodyDomRect = params?.find(item => item.name === 'articlebody');
        let articlebodyDomRect = params?.find(item => item.name === 'pageBody');
        let myContainerDomRect = params?.find(item => item.name === 'myContainer');
        // console.log('headBoxDomRect:',headBoxDomRect, pageBodyDomRect, articlebodyDomRect);
        let articlebodyEle = this.baseCls.getEleById('_alllist-body-article');
        let pageBody = this.baseCls.getEleById('_pageBody') as HTMLElement;
        let allHeight = myContainerDomRect?.data?.height || document.documentElement.clientHeight;
        if (!headBoxDomRect || !articlebodyEle) return;
        let scrollHeight = allHeight - headBoxDomRect.data.height;
        if (this.config.scrollviewHeight && this.config.scrollviewHeight > 0) {
            scrollHeight = this.config.scrollviewHeight;
        }
        articlebodyEle!.style.cssText = `height:${scrollHeight}px;overflow: scroll;`;
    };
    // 设置选中项的选中态
    private setSelectorActive(type: 'country' | 'abc') {
        this.resetAllSelectActive(type);
        switch (type) {
            case 'country':
                (this.getEventStoreFn('countrySelectActiveFn') as EventStoreObj['countrySelectActiveFn'])();
                break;
            case 'abc':
                (this.getEventStoreFn('abcSelectActiveFn') as EventStoreObj['abcSelectActiveFn'])();
                break;
            default:
                break;
        }
    };
    // 重置所有的选中态
    private resetAllSelectActive(type: 'country' | 'abc') {
        switch (type) {
            case 'country':
                let listItems = document.querySelectorAll('.listItem-action');
                for (let i = 0; i < listItems.length; i++) {
                    let item = listItems[i];
                    this.baseCls.addClass(item, 'hide');
                }
                break;
            case 'abc':
                let slidelis = document.querySelectorAll('.sildebarItem');
                let sildebarItemBubbles = document.querySelectorAll('.sildebarItem-bubble');
                for (let i = 0; i < slidelis.length; i++) {
                    let item = slidelis[i];
                    if ((/sildebarItem_active/g).test(item.getAttribute('class') || '')) {
                        this.baseCls.removeClass(item, 'sildebarItem_active');
                    } else if ((/sildebarItem_tj_active/g).test(item.getAttribute('class') || '')) {
                        this.baseCls.removeClass(item, 'sildebarItem_tj_active');
                    };
                }

                for (let i = 0; i < sildebarItemBubbles.length; i++) {
                    let item = sildebarItemBubbles[i];
                    if (!(/hide/g).test(item.getAttribute('class') || '')) {
                        this.baseCls.addClass(item, 'hide');
                    };
                    if ((/sildebarItem-bubbl_tj/g).test(item.getAttribute('class') || '')) {
                        (<any>item).lastChild && ((<any>item).lastChild.style.fontSize = '14px');
                    };
                }
                break;
            default:
                break;
        };
    };
    private syncCustomOptionsFn() {
        let me = this;
        if (me.config.customOptions) {
            for (let key in me.config.customOptions) {
                let value = me.config.customOptions![key as keyof typeof me.config.customOptions];
                let globalconfigKey: any = key + 'Base64';
                value && globalconfigKey in globalconfig && ((globalconfig as any)[globalconfigKey] = value);
            }
        }
    };
    // 给开发人员使用的通过id获取元素的方法
    public getEleByIdPubFn(tail: string) {
        return this.baseCls.getEleById(tail);
    };
    // 切换暗黑模式
    public changeThemePubFn(mode: 'ml-country-selector-dark' | 'ml-country-selector-light') {
        let me = this;
        let isDarkTheme = mode === 'ml-country-selector-dark';
        let pageBodyEle = me.baseCls.getEleById('_pageBody');
        isDarkTheme && pageBodyEle && me.baseCls.addClass(pageBodyEle, 'ml-country-selector-dark');
        !isDarkTheme && pageBodyEle && me.baseCls.removeClass(pageBodyEle, 'ml-country-selector-dark');
    }
}