import { Suspense } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { Switch, HashRouter as Router } from 'react-router-dom';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn';

import Routes from './routes';
import PageMenu from './components/PageMenu';

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden'
        }}
      >
        <Router>
          <PageMenu />
          <Layout>
            <Suspense fallback={null}>
              <Layout.Content
                style={{
                  padding: 24,
                  display: 'flex'
                }}
              >
                <Switch>
                  <Routes />
                </Switch>
              </Layout.Content>
            </Suspense>
          </Layout>
        </Router>
      </Layout>
    </ConfigProvider>
  );
}

export default App;