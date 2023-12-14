// 运行时配置

import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import {message} from 'antd';
import {useEffect, useState} from 'react';
import {HeaderContent} from './components/LayoutRender';
import {Link, useDispatch, RequestConfig} from '@umijs/max';
import queryString from 'query-string';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({
            type: "Global/getList",
        })
    }, []);
    return {
        layout: 'mix',
        collapsed: collapsed,
        menu: {
            locale: true,
        },
        token: {
            sider: {
                colorMenuBackground: '#fff',
                colorMenuItemDivider: '#dfdfdf',
                colorTextMenu: '#595959',
                colorTextMenuSelected: 'rgba(42,122,251,1)',
                colorBgMenuItemSelected: 'rgba(230,243,254,1)',
            },
        },
        // menuDataRender: () => loopMenuItem(routers),
        menuItemRender: (item: any) => {
            return (
                <Link to={`${item.path}`} state={{id: item.id}}>
                    {item.name}
                </Link>
            );
        },
        collapsedButtonRender: () => (
            <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: '20px',
                }}
            >
                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            </div>
        ),
        headerContentRender: () => <HeaderContent/>,
        rightContentRender: () => <></>,
    };
};

export const layout = Layout;

export const request: RequestConfig = {
    // other axios options you want
    errorConfig: {
        errorHandler(res: any) {
            if (res.response.status >= 500 && location.pathname !== '/500') {
                location.href = '/500';
            }
            if (res.response.status === 401) {

            }
            if (res.response.status === 404) {
                message.error("404")
            }
        },
        errorThrower(res: any) {
            message.error(res.err.msg);
        },
    },
    requestInterceptors: [
        (config: any) => {
            // 拦截请求配置，进行个性化处理。
            const url = config.url.concat('');
            return {...config, url};
        },
    ],
    responseInterceptors: [
        (response: any) => {
            return response;
        },
    ],
    paramsSerializer(params: any) {
        return queryString.stringify(params);
    },
};
