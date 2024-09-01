import React, { useEffect, useState } from 'react';
import s from './Game_LootDuck.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { setFooter, setHeader } from "../../store/user/interfaceSlice.js";
import { getSkin } from "../../assets/icons/skins/index.js";
import { TonConnectButton, TonConnectUIProvider, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useGetClickerMutation, useSetWalletAddressMutation } from "../../store/user/user.api.js";
import { InstagramLikeAboutSlider } from "../../components/InstagramLikeSlider/InstagramLikeSlider.jsx";
import { normilezeTime } from "../../utils/normileze.js";
import { useNavigate } from 'react-router';
import { resetCurrentUser } from '../../store/user/userSlice.js';


const RewardPerLevel = ({ lootduck, totalUser = 0 }) => {
    const [aboutMenu, setAboutMenu] = useState(false);


    return (
        <div className={s['column']}>
            {aboutMenu && <InstagramLikeAboutSlider onClose={() => setAboutMenu(false)} />}
            <div className={s['infoBox']}>
                <div className={s['info']}>Всего участников: {totalUser}</div>
                <div className={s['info']} onClick={() => { setAboutMenu(true) }}>INFO</div>
            </div>
            <div className={s['Reward']}>
                <div className={`${s['level']} ${lootduck?.l10 > 0 ? s['active'] : ''}`}>{lootduck?.l10 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l9 > 0 ? s['active'] : ''}`}>{lootduck?.l9 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l8 > 0 ? s['active'] : ''}`}>{lootduck?.l8 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l7 > 0 ? s['active'] : ''}`}>{lootduck?.l7 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l6 > 0 ? s['active'] : ''}`}>{lootduck?.l6 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l5 > 0 ? s['active'] : ''}`}>{lootduck?.l5 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l4 > 0 ? s['active'] : ''}`}>{lootduck?.l4 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l3 > 0 ? s['active'] : ''}`}>{lootduck?.l3 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l2 > 0 ? s['active'] : ''}`}>{lootduck?.l2 || 0}</div>
                <div className={`${s['level']} ${lootduck?.l1 > 0 ? s['active'] : ''}`}>{lootduck?.l1 || 0}</div>
            </div>
        </div>
    )
}

const BuyAction = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);
    const [setAddress] = useSetWalletAddressMutation();
    const [leftTimeToStart, setLeftTimeToStart] = useState(null);
    const [getClicker] = useGetClickerMutation();
    // при подключение кошелька вызвать функцию

    const callBack = () => {
        navigate('/')
    }

    useEffect(() => {
        // let timestamp = 1724940000000
        getClicker({ access_token: user.access_token }).then((res) => {
            if (res.data) {
                dispatch(resetCurrentUser(res.data.clicker));
            }
        })

        if (window.Telegram.WebApp) {
            window.Telegram?.WebApp.BackButton.show()
            window.Telegram?.WebApp.onEvent('backButtonClicked', callBack)
        }
        return () => {
            if (window.Telegram.WebApp) {
                window.Telegram.WebApp.BackButton.hide()
                window.Telegram.WebApp.offEvent('backButtonClicked', callBack)
            }
        }


    }, []);


    // время 27 августа 2024 года 12:00:00 по москве
    return (
        <div className={s['BuyAction']} style={{
        }}>
            {user.lootduck.isBuy ?
                <div></div> :
                <div className={s['buy']}
                    onClick={() => {
                        window.Telegram.WebApp.openLink(`https://web.mellstroycoin.tech/connect-wallet/${user.access_token}`, {
                            try_instant_view: false
                        });
                    }}
                >{user.walletAddress ? 'SUPER LOOT' : 'Connect Wallet'}
                </div>}

        </div>
    )
}

const Game_LootDuck = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    useEffect(() => {
        dispatch(setFooter(false))
        dispatch(setHeader(true))
        return () => {
            dispatch(setFooter(true))
            dispatch(setHeader(true))

        }
    }, []);

    let skin = getSkin('gentleman', 'male')
    return (

        <div className={s['Game_LootDuck']}>
            <div className={s['img']}>
                <img src={skin.skin} />
            </div>
            <RewardPerLevel lootduck={user.lootduck} totalUser={user.lootDuckTotalUser} />
            <BuyAction />

        </div>
    )
};

export default Game_LootDuck;
