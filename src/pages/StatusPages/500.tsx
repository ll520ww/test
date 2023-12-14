import React from 'react';
import { Button, Result } from 'antd';

const App: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="对不起，服务器出了问题。"
    extra={
      <Button type="primary" onClick={() => history.back()}>
        刷新
      </Button>
    }
  />
);

export default App;
