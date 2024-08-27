import TonConnect from '@tonconnect/sdk';
import React from 'react';
import {
    TonConnectButton,
    TonConnectUIProvider,
    useTonAddress,
    useTonConnectUI
} from "@tonconnect/ui-react";

const Obj = () => {
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);
    const [tonConnectUI, setOptions] = useTonConnectUI();

    return (
        userFriendlyAddress ? (
            <div>
                <span>User-friendly address: {userFriendlyAddress}</span>
                <span>Raw address: {rawAddress}</span>
            </div>
        ): (<div onClick={()=>{tonConnectUI.modal.open()}}>
            Connect
        </div>)
    );
}


const WalletConnect = () => {
    return (
        <TonConnectUIProvider manifestUrl="https://api.mellstroycoin.tech/api/files/tonconnect-manifest.json">
            <TonConnectButton
                // actionsConfiguration={{
                //     twaReturnUrl: 'https://t.me/'
                // }}

            />
            <Obj/>
        </TonConnectUIProvider>
    )
};

export default WalletConnect;
