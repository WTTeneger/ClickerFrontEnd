import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import './index.scss';
import Layout from './components/Layout/Layout.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './store/store.js';
import { ConfigProvider, message } from 'antd';
import BanPage from './pages/Ban/Ban.jsx';
import NewBotPage from './pages/NewBot/NewBot.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#FFF',
      },
    }}
  >
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
        <Routes>
          <Route path="/ban" element={<BanPage />} />
          <Route path="/redirect" element={<NewBotPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);
