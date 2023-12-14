import qs from "qs";
import {useReducer, useState} from "react";
import moment from "moment/moment";

export const useSearch = (str: string) => {
    return qs.parse(str.substring(1))
}

export const useForceUpdate = () => {
    const [, forceUpdateDispatch] = useReducer((v) => v + 1, 0);

    return forceUpdateDispatch;
};


export const getJsonParse = (params: any) => {
    if (params) {
        return JSON.parse(params)
    }
}




//数字转千分位
export const priceStr = (num: any, type?: any) => {
    let c
    if (type === "int") {
        c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString(
            'zh-CN', {
                // minimumFractionDigits: 2,
                maximumFractionDigits: 0
            }
        ) : (num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
    } else {
        c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString(
            'zh-CN', {
                // minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) : (num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ".00")
    }

    return c;

}
export const debounce = (fn: (...args: any[]) => any, wait: number = 300) => {
    let timer = null as any;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(arguments);
        }, wait);
    };
};


//金额转化为万
export function formatNumber(num: any) {
    const nums = Number(num);
    if (nums == 0 || (nums > 0 && nums < 10000)) {
        return nums + '';
    } else {
        return Math.round((nums / 10000)) + 'w';
    }
}

export function formatNumberComma(num: any) {
    const nums = Number(num);
    if (nums == 0 || (nums > 0 && nums < 10000)) {
        return priceStr(nums, "int") + '';
    } else {
        return priceStr(Math.round((nums / 10000)), "int") + 'w';
    }
}

//获取列表上hook
export function useList<
    I extends Record<string, any> = any,
    F extends Record<string, any> = {}
>(options: {
    onGetListData: (
        query: { pageNum: number; pageSize: number } & F
    ) => Promise<{
        data: I[];
        total: number;
    }>;
}) {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<I[]>([]);
    const [filter, setFilter] = useState<F>({} as F);
    const [paging, setPaging] = useState({
        pageNum: 0,
        pageSize: 20,
        totalItems: 0,
        totalPage: 1,
    });

    const getPageList = async () => {
        const isFirstPage = paging.pageNum === 1;

        if (paging.pageNum === 0) return;

        setLoading(true);

        try {
            const query = {
                ...filter,
                pageNum: paging.pageNum,
                pageSize: paging.pageSize,
            };

            Object.keys(query).forEach((key) => {
                if (query[key] === "") {
                    delete query[key];
                }
            });

            const data = await options.onGetListData((query as any));


            if (isFirstPage) {
                setItems(data.data);
            } else {
                setItems([...items, ...data.data]);
            }

            setPaging({
                ...paging,
                totalItems: data.total,
                totalPage: Math.ceil(data.total / paging.pageSize),
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        loading,
        paging,
        getPageList,
        setCurrentPage(current: number) {
            Object.assign(paging, {
                pageNum: current,
            });

            setPaging(paging);

            return getPageList();
        },
        setPageSize(size: number) {
            Object.assign(paging, {
                pageNum: 1,
                pageSize: size,
            });
            setPaging(paging);
            return getPageList();
        },
        setFilter(_filter: Partial<F>) {
            Object.assign(filter, _filter);
            Object.assign(paging, {
                pageNum: 1,
            });
            setFilter(filter);
            setPaging(paging);

            return getPageList();
        },
        setItems(callback: (item: I, index: number) => I) {
            setItems(items.map(callback));
        },
    };
}

//获取详情hook

export function useDetail<I extends Record<string, any> = any>(options: {
    onGetDetailData: () => Promise<I>;
}) {
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<I>({} as I);

    const getDetailData = async () => {
        setLoading(true);

        try {
            const data = await options.onGetDetailData();

            setItem(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        item,
        getDetailData,
    };
}


//判断是否是对象
export const isObject = (r: any) => {
    let flag = false
    const res = Object.prototype.toString.call(r)
    if (res.includes("Object")) {
        flag = true
    }
    return flag
}

//统计时间
export const statisticalTime = (nowTime: any, dayNum: number, spaceMark?: string) => {
    const times = nowTime.getTime() - (86400000 * dayNum)
    return moment(new Date(times)).format(`YYYY${spaceMark ? spaceMark : "-"}MM${spaceMark ? spaceMark : "-"}DD`)
}
