import { CountryItem } from "../types/index";

export const utils = {
    /**
     * 将国家数据进行格式化，将国家按照字母顺序排列并分组
     *
     * @param countyiList - 国家列表
     * @returns 返回格式化后的对象：{res: 按字母顺序排列的国家列表数组, xArr: 国家代码数组}
     */
    formateCountryData(countyiList: any[]) {
        let xArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let _xArr = xArr.join('').toUpperCase().split('');
        let res = [];
        for(let i = 0; i < _xArr.length; i++) {
            let key = _xArr[i];
            let temp: any = {};
            temp.babel = key;
            temp[key] = [];
            for(let j = 0; j < countyiList.length; j++) {
                let countryValue = countyiList[j]?.value;
                if (countryValue[0].toUpperCase() === key) {
                    countyiList[j].index = j;
                    countyiList[j].code = countyiList[j].code || j;
                    temp[key].push(countyiList[j]);
                };
            }
            res.push(temp);
        }
        let noData: any[] = [];
        res = res.filter(item => {
            if (item[item.babel].length === 0) {
                noData.push(item.babel);
            }
            return item[item.babel].length > 0;
            
        });
        _xArr = _xArr.filter(i => {
            let temp = i;
            noData.forEach(a => {
                if (i === a) {
                    temp = '';
                }
            })
            return temp;
        })
        return {
            res,
            xArr: _xArr
        };
    },
    /**
     * 根据传入的参数获取符合条件的国家列表
     *
     * @param value 搜索词
     * @param originCountryList 原始国家列表
     * @param globalSearchWord 是否进行全局搜索，默认为false
     * @param addStyle 是否添加搜索样式，默认为false
     * @param supportEnSearch 是否支持英文搜索，默认为false
     */
    getSearchCountryArr(value: string, originCountryList: CountryItem[], globalSearchWord: boolean, addStyle: boolean = false, supportEnSearch:boolean = false) {
        if (!originCountryList.length) return [];
        let filterArr = originCountryList.filter(item => {
            if (!globalSearchWord) {
                let i = false;
                let matchArr;
                // 支持拼音搜索
                if (supportEnSearch && /^[a-zA-Z]+$/.test(value)) {
                    let matchBody = item.pingyin ||  item.value;
                    matchArr = matchBody.toLowerCase().match(value.toLowerCase());
                } else {
                    matchArr = item.label.match(value);
                };
                matchArr && matchArr[0] === value && matchArr.index === 0 && (i = true);
                return i;
            } else {
                return item.label.includes(value);
            }
        });
        let resArr = filterArr;
        // 非全局匹配且开启搜索样式
        if (!globalSearchWord && addStyle) {
            let _filterArr = filterArr.map(item => {
                item.label2 = item.label.replace(value, `<b style="color: #525252;font-family: PingFangSC-Regular;">${value}</b>`);
                return item;
            });
            resArr = _filterArr;
        }
        return resArr;
    },
    /**
     * 清空父节点下的所有子节点，并执行回调函数。
     *
     * @param parentNode 要清空的父节点元素。
     * @param callback 执行完清空操作后的回调函数。
     */
    emptyAllChildNodes(parentNode: Element, callback: Function) {
        if (!parentNode) return;
        while(parentNode.children.length) {
            parentNode.removeChild(parentNode.firstChild!);
        };
        callback && typeof callback === 'function' && callback();
    },
    /**
     * 将服务器国家数据进行格式化处理，并返回一个新数组。
     *
     * @param value - 需要被替换的字符串值。
     * @param serverDataList - 服务器国家数据列表，为一个 Array 类型的数据。
     * @param isTjScence - 是否是台湾场景，默认为 true。
     * @returns 返回一个新数组，包含已被替换的国家名称和对应的 label2 属性值。
     */
    formateServerCountryData(value: string, serverDataList: any[], isTjScence = true) {
        try {
            let tempArr: any[] = [];
            if (!Array.isArray(serverDataList) || serverDataList.length === 0) {
                return [];
            }
            serverDataList.forEach((item, indx) => {
                let tempItem = item;
                if (isTjScence) {
                    tempItem.label2 = item.label.replace(value, `<b style="color: #999">${value}</b>`);
                } else {
                    tempItem.label2 = item.label;
                }
                tempArr.push(tempItem);
            });
            return tempArr;
        } catch (error) {
            console.log('formateServerCountryData catch err:', error);
            return [];
        }
    }
}