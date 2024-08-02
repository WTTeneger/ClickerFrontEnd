import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import './index.scss';
import Layout from './components/Layout/Layout.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store.js';
import { ConfigProvider, message } from 'antd';


ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#FFF',
      },
    }}
  >
    ...

    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);
