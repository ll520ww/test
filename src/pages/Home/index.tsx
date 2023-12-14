import {PageContainer} from '@ant-design/pro-components';
import styles from './index.less';
import {useLayoutEffect, useState} from "react";
import {treeData} from "@/pages/Home/constance";
import {ExportTree} from "@/components/ExportTree";

const HomePage: React.FC = () => {
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([])
    const getTreeData = (el: any) => {
        el.forEach((item: any) => {
            item.uuid = item?.title
            if (item.children) {
                getTreeData(item.children)
            }
        })
    }
    useLayoutEffect(() => {
        getTreeData(treeData)
    }, [treeData])
    return (
        <PageContainer ghost>
            <div className={styles.container}>
                <ExportTree
                    treeData={treeData}
                    defaultCheckedKeys={defaultCheckedKeys}
                    onCheck={() => {
                    }}
                    onSelect={() => {
                    }}
                    setDefaultCheckedKeys={setDefaultCheckedKeys}
                ></ExportTree>
            </div>
        </PageContainer>
    );
};

export default HomePage;
