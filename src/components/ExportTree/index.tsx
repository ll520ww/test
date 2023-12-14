import {useEffect, useState} from "react";
import {CheckboxItem} from "@/components/Tree/checkboxItem";
import styles from "./index.module.less"
import {useDispatch, useSelector} from "@@/plugin-dva/exports";

function copyData(data: any) {
    return JSON.parse(JSON.stringify(data));
}

const RenderTreeNode = (props: any) => {
    const dispatch = useDispatch()
    const {
        treeMap,
        defaultCheckedKeys,
        defaultSelectedKeys = [],
        halfCheckedKeys,
        treeData = [],
        setTreeMap,
        handleHalfCheckedKeys,
        onSelect,
        onCheck,
        defaultExpandedKeys,
        setDefaultExpandedKeys,
        handleUpDownNode
    } = props

    const handleChecked = async (key: any, el: any) => {
        const index = defaultCheckedKeys.indexOf(key);
        if (index === -1) {
            defaultCheckedKeys.push(key);
        } else {
            defaultCheckedKeys.splice(index, 1);
        }
        if (el.children && el.parent) {
            handleUpDownNode(el)
        } else {
            await handleHalfCheckedKeys(key)
        }
        // await handleHalfCheckedKeys(key)

        // setDefaultCheckedKeys([...defaultCheckedKeys])
        // onCheck(defaultCheckedKeys)

        // dispatch({
        //     type: "Global/save",
        //     payload: {
        //         defaultCheckedKeys: [...defaultCheckedKeys],
        //     }
        // })

    };
    useEffect(() => {
        onCheck(defaultCheckedKeys)
    }, [defaultCheckedKeys]);
    // emit onSelect 方法
    // 处理key节点展开
    const handleExpanded = (key: any) => {
        const updateExpandedKeys = copyData(defaultExpandedKeys);
        const index = updateExpandedKeys.indexOf(key);

        if (index === -1) {
            updateExpandedKeys.push(key);
        } else {
            updateExpandedKeys.splice(index, 1);
        }
        setDefaultExpandedKeys([...updateExpandedKeys])
    };
    const handleSelectNode = (key: any) => {
        // defaultSelectedKeys.pop();
        // defaultSelectedKeys.push(key);
        onSelect(key)
        // setDefaultSelectedKeys([...defaultSelectedKeys])
    };
    return <div className={"renderTreeNode"}>{treeData.map((current: any) => {
        // cr: key，name在这里提前进行解构赋值；
        const {uuid, title, children} = current;

        return (
            <span key={uuid} className={"childrenBox"}>
        <CheckboxItem
            item={current}
            // 标题
            title={title}
            // key
            id={uuid}
            // deep
            level={treeMap[uuid]?.level}
            // 有无子节点
            isSingle={!children}
            // 是否展开
            isExpanded={defaultExpandedKeys.includes(uuid)}
            // 全选中
            isChecked={defaultCheckedKeys.includes(uuid)}
            // 半选中
            isHalfChecked={halfCheckedKeys.includes(uuid)}
            // 是否被选中
            isSelect={defaultSelectedKeys.includes(uuid)}
            // 复选框点击
            handleChecked={handleChecked}
            // 节点点击
            handleSelectNode={handleSelectNode}
            // 展开点击
            handleExpanded={handleExpanded}
        />
                {children &&
                    <div className={"children"}>
                        <RenderTreeNode
                            treeData={children}
                            defaultCheckedKeys={defaultCheckedKeys}
                            halfCheckedKeys={halfCheckedKeys}
                            setTreeMap={setTreeMap}
                            treeMap={treeMap}
                            handleHalfCheckedKeys={handleHalfCheckedKeys}
                            onSelect={onSelect}
                            onCheck={onCheck}
                            defaultExpandedKeys={defaultExpandedKeys}
                            setDefaultExpandedKeys={setDefaultExpandedKeys}
                            handleUpDownNode={handleUpDownNode}
                        ></RenderTreeNode>
                    </div>
                }
      </span>
        );
    })}
    </div>
}
export const ExportTree = (props: any) => {
    const {treeData, onCheck, onSelect, editInfo, checkHalf} = props
    const {halfCheckedKeys, defaultCheckedKeys} = useSelector((state: any) => state.Global)
    const dispatch = useDispatch()
    // const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([])
    // const [halfCheckedKeys, setHalfCheckedKeys] = useState<any>([])
    const [treeMap, setTreeMap] = useState<any>({})
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any>([])
    const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<any>([])
    //初始化数据
    const getInitTreeData = (tree: any, map: any = {}, level: any = 0, parent?: any) => {
        (level as any)++
        tree.forEach((item: any) => {
            item.level = level
            item.parent = parent ? parent : null
            map[item.uuid] = item
            if (item.children) {
                getInitTreeData(item.children, map, level, item.uuid)
            }
        })
        return map
    }

// 子节点集合
    const handleGetNodes = (key: any) => {
        const map = treeMap[key];
        if (!map?.children) return [];
        const help = (children: any, arr: any = []) => {
            children.forEach((current: any) => {
                arr.push(current.uuid);
                if (current.children) {
                    return help(current.children, arr);
                }
            });
            return arr;
        };
        return help(map.children)
    };

    // 更新子节点
    const updateNode = (key: any) => {
        return new Promise((resolve, reject) => {
            // 处理该节点子节点 1、选中 2、未选中
            const nodeKeys = handleGetNodes(key);
            // 没有子节点
            if (nodeKeys.length === 0) {
                resolve("succeed");
            }

            let updateCheckedKeys = copyData(defaultCheckedKeys);
            //key被选中时候，子节点全部被选中
            if (defaultCheckedKeys.includes(key)) {
                // cr: 1. 上面已经取值，这里直接使用； 2. 下面的逻辑直接用else即可；3. setState逻辑可抽离共用，这里有冗余情况；
                let halfIndex = halfCheckedKeys.indexOf(key);
                halfIndex !== -1 && halfCheckedKeys.splice(halfIndex, 1);

                updateCheckedKeys = [...new Set(updateCheckedKeys.concat(nodeKeys))];
            } else {
                // key不被选中时，子节点全部不被选中
                for (let i = 0; i < nodeKeys.length; i++) {
                    // cr: 用es5的数组方法
                    let index = updateCheckedKeys.indexOf(nodeKeys[i]);
                    let halfIndex = halfCheckedKeys.indexOf(nodeKeys[i]);

                    halfIndex !== -1 && halfCheckedKeys.splice(halfIndex, 1);
                    index !== -1 && updateCheckedKeys.splice(index, 1);
                }
            }

            // 保存数据
            dispatch({
                type: "Global/save",
                payload: {
                    defaultCheckedKeys: [...updateCheckedKeys],
                    halfCheckedKeys: [...halfCheckedKeys]
                }
            })
            // resolve("succeed");
        });
    };
    useEffect(() => {
        setTreeMap(getInitTreeData(treeData))
    }, [editInfo]);
    // 父节点集合
    const handleParentNodes = (key: any) => {
        let params = key
        const parentKeys = [];
        while (treeMap[params]?.parent) {
            // cr: treeMap提前做变量缓存
            params = treeMap[params]?.parent;
            parentKeys.push(params);
        }
        return parentKeys;
    };

    const getNodeStatus = (key: any) => {
        const keyNodes = handleGetNodes(key);
        let flag = 0;
        for (let i = 0; i < keyNodes.length; i++) {
            if (defaultCheckedKeys.includes(keyNodes[i])) {
                flag++;
            }
        }

        if (flag === 0) return "NO" // cr: 状态常量，抽离出去；
        if (flag === keyNodes.length) return "ALL"
        return "SOME"
    };

    // 更新父节点
    const updateParentNode = (key: any) => {
        return new Promise((resolve, reject) => {
            const parentKeys = handleParentNodes(key); // cr: 命名有get开头比较合适
            // 没有父节点
            if (parentKeys.length === 0) {
                resolve("succeed");
            }
            // 有父节点，处理每个父节点
            for (let i = 0; i < parentKeys.length; i++) {
                // cr: 用es5的数组方法去遍历，或者for of
                let flag = getNodeStatus(parentKeys[i]); // cr: 命名有get开头比较合适
                // 部分子节点被选中
                let checkIndex = defaultCheckedKeys.indexOf(parentKeys[i]);
                let halfIndex = halfCheckedKeys.indexOf(parentKeys[i]);
                switch (flag) {
                    case "SOME":
                        checkIndex !== -1 && defaultCheckedKeys.splice(checkIndex, 1);
                        halfIndex === -1 && halfCheckedKeys.push(parentKeys[i]);
                        break;
                    // 全部子节点被选中
                    case "ALL":
                        halfIndex !== -1 && halfCheckedKeys.splice(halfIndex, 1);
                        checkIndex === -1 && defaultCheckedKeys.push(parentKeys[i]);
                        break;
                    // 没有子节点被选中
                    case "NO":
                        halfIndex !== -1 && halfCheckedKeys.splice(halfIndex, 1);
                        checkIndex !== -1 && defaultCheckedKeys.splice(checkIndex, 1);
                        break;
                    default:
                }
                dispatch({
                    type: "Global/save",
                    payload: {
                        defaultCheckedKeys: [...defaultCheckedKeys],
                        halfCheckedKeys: [...halfCheckedKeys]
                    }
                })
            }
        });
    };

    const handleHalfCheckedKeys = async (key: any) => {
        return new Promise(async (resolve, reject) => {
            // 更新它的子节点
            await updateNode(key);
            await updateParentNode(key);
            // 再更新它的父节点
            resolve("succeed");
        });
    };

    useEffect(() => {
        const main = async () => {
            defaultCheckedKeys.forEach(async (i: any, index: number) => {
                await handleHalfCheckedKeys(defaultCheckedKeys[index]);
            })
        }
        main()
    }, [editInfo, treeMap, checkHalf]);


    const getChildNode = (item: any, list: any) => {
        if (item.children) {
            item.children.forEach((el: any) => {
                list.push(el.uuid)
                getChildNode(el, list)
            })
        }
        return list
    }

    const getParentNode = (arr: any, list: any) => {
        arr.forEach((it: any) => {
            const parentKeys = handleParentNodes(it)
            // list.concat(parentKeys)
            list.push(parentKeys)
        })
        return [...new Set(list.flat())]
    }
    //选择父节点与子节点
    const handleUpDownNode = (item: any) => {
        if (!defaultCheckedKeys.includes(item.uuid)) {
            const parentKeys = handleParentNodes(item.uuid)
            const childKeys = handleGetNodes(item.uuid)
            childKeys.forEach((it: any) => {
                const index = defaultCheckedKeys.indexOf(it)
                defaultCheckedKeys.splice(index, 1)
            })
            const parent = getParentNode(defaultCheckedKeys, [])
            if (parent.length === 0) {
                parentKeys.forEach((it: any) => {
                    const index = halfCheckedKeys.indexOf(it)
                    halfCheckedKeys.splice(index, 1)
                })
            }


            dispatch({
                type: "Global/save",
                payload: {
                    defaultCheckedKeys: [...defaultCheckedKeys],
                    halfCheckedKeys: [...halfCheckedKeys]
                }
            })

        } else {
            const parentKeys = handleParentNodes(item.uuid)
            dispatch({
                type: "Global/save",
                payload: {
                    defaultCheckedKeys: [...defaultCheckedKeys, ...getChildNode(item, [])],
                    halfCheckedKeys: [...parentKeys]
                }
            })
        }

    };
    useEffect(() => {
        const keys = Object.keys(treeMap);
        if (keys.length === defaultCheckedKeys.length + 1) {
            dispatch({
                type: "Global/save",
                payload: {
                    defaultCheckedKeys: [...keys],
                    halfCheckedKeys: []
                }
            })
        }
    }, [defaultCheckedKeys, treeMap]);

    console.log(defaultCheckedKeys, "defaultCheckedKeys")
    console.log(halfCheckedKeys, "halfCheckedKeys")
    return <div className={styles.tree}>
        <RenderTreeNode
            treeData={treeData}
            defaultCheckedKeys={defaultCheckedKeys}
            halfCheckedKeys={halfCheckedKeys}
            setTreeMap={setTreeMap}
            treeMap={treeMap}
            setDefaultSelectedKeys={setDefaultSelectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            handleHalfCheckedKeys={handleHalfCheckedKeys}
            onSelect={onSelect}
            onCheck={onCheck}
            setDefaultExpandedKeys={setDefaultExpandedKeys}
            defaultExpandedKeys={defaultExpandedKeys}
            handleUpDownNode={handleUpDownNode}
        ></RenderTreeNode>
    </div>
}
