import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import Layout from './components/Layout/Layout.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store.js';
import { message } from 'antd';
import TelegramWebApp from './components/TelegramWebApp/index.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <TelegramWebApp />
    <BrowserRouter>
      <Layout>
        <App />
      </Layout>
    </BrowserRouter>
  </Provider>
);
