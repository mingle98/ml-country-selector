export interface Options {
    el: string;
    placeholder?: string;
    selectedCallback: Function;
    countryList?: CountryItem[];
    errCallback?: Function;
    globalSearchWord?: boolean;
    immediatelyReset?: boolean;
    inputOutBtnCallback?: Function;
    inputBlurCallback?: Function;
    inputFocusCallback?: Function;
    apiStartCallback?: Function;
    apiEndCallback?: Function;
    domRenderAfterCallback?: Function;
    hotCountryList?: CountryItem[];
    leftActionSpan?: number;
    useServerSeach?: boolean;
    fixedAndScroll?: boolean;
    searchCountryApi?: string;
    tjCountryApi?: string;
    scrollviewHeight?: number | null;
    selectCountryAfterReset?: boolean;
    scrollBodyBubble?: boolean;
    searchWordAddStyle?: boolean;
    searchEmptyShowCountryList?: boolean;
    serachDataIncludeRecommend?: boolean;
    searchInputMaxNum?: number;
    supportEnSearch?: boolean;
    animaInput?: boolean;
    colaKey?: string;
    searchClearIconCallback?: Function;
    inputOutBtnTxt?: string;
    getPolyFill?: boolean;
    leftTipTop?: boolean;
    customOptions?: {
        searchclearIcon: string;
        searchIcon: string;
        selectIcon: string;
        slideItemIcon: string;
    };
    [key: string]: any; 
}

export type CountryItem = {
    value: string;
    label: string;
    pingyin?: string;
    [key: string]: any; 
}

export interface Config extends Options{
    [key: string]: any;
}

export interface DataStore {
    xArr: string[];
    originCountryList: CountryItem[];
    currentFillterArr: CountryItem[];
    domDetailData: { name: string, data: DOMRect }[];
    currSelectedItem: SelectItem | null;
    currSelectedSlideItem: any | null;
    inputCurValue: string | number;
    curTouchItem: {evetEle: any, content: string};
    getPolyfillok: number;
    isSelectingStatus: boolean;
    inputDone: boolean;
    inputDoneTimer: number | null | any;
    [key: string]: any;
}

export interface TplStore {
    pageBody: string;
    inputBox: string;
    hotCountryBox: string;
    countryListBox: string;
    sildebarBox: string;
    countryListItem: string;
    sildebarItem: string;
    listItem: string;
    searchCountryBox: string;
    searchEmptyIcon: string;
}

export interface EventStoreObj {
    selectCountryfning: boolean;
    seachInputFning: boolean;
    resArr: any[];
    isSelecting: boolean;
    inputFocusFn: (e: InputEvent) => void;
    selectCountryFn: (e: any) => void;
    inputBlurFn: (e: InputEvent) => void;
    resetstatusFn: () => void;
    inputOutBtnFn: (e: any) => void;
    countrySelectActiveFn: () => void;
    abcSelectActiveFn: () => void;
    selectSlideItemFn: (e: TouchEvent | MouseEvent) => void;
    seachInputFn: (e: InputEvent, isResSence: boolean) => void;
    touchstartFn: (e: TouchEvent, isSlideArea?: boolean) => void;
    touchendFn: (e: TouchEvent) => void;
    selectClearIconFn: () => void;
    formSubmitFn: (e: any) => void;
}

type SelectItem = {
    rescode: number;
    eventItemData: any;
    selectCountry: any;
    originCountryData: any[];
    ele: any;
}