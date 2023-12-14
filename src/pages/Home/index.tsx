import {PageContainer} from '@ant-design/pro-components';
import styles from './index.less';
import {ForControl} from "@/components/control";

const HomePage: React.FC = () => {
    return (
        <PageContainer ghost>
            <div className={styles.container}>
                <ForControl list={[1, 2, 3]}>
                    {
                        (item: any) => {
                            return <div>{item}</div>
                        }
                    }
                </ForControl>
            </div>
        </PageContainer>
    );
};

export default HomePage;
