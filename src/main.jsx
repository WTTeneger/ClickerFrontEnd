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
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Web3ModalProvider } from './components/WalletConnectTRC/WalletConnectTRC.jsx';
import WalletConnect from './pages/WalletConnect/WalletConnect.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#FFF',
            },
        }}
    >
        <TonConnectUIProvider manifestUrl="https://api.mellstroycoin.tech/api/files/tonconnect-manifest.json"
            actionsConfiguration={{
                twaReturnUrl: 'https://t.me/Ducks_tap_bot/clicker'
            }}
        >
            <Web3ModalProvider>
                <Provider store={store}>
                    <BrowserRouter>
                        <Layout>
                            <App />
                        </Layout>
                        <Routes>
                            <Route path="/ban" element={<BanPage />} />
                            <Route path="/redirect" element={<NewBotPage />} />
                            <Route path="/connect-wallet/:code" element={<WalletConnect />} />
                        </Routes>
                    </BrowserRouter>
                </Provider>
            </Web3ModalProvider>
        </TonConnectUIProvider>
    </ConfigProvider>
);
