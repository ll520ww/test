import React from 'react';
import { Button, Result } from 'antd';

const App: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="很抱歉，您访问的页面不存在。"
  />
);

export default App;