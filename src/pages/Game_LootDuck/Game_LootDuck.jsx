import React, { useEffect, useState } from 'react';
import s from './Game_LootDuck.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { setFooter, setHeader } from "../../store/user/interfaceSlice.js";
import { getSkin } from "../../assets/icons/skins/index.js";
import { TonConnectButton, TonConnectUIProvider, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useSetWalletAddressMutation } from "../../store/user/user.api.js";
import { InstagramLikeAboutSlider } from "../../components/InstagramLikeSlider/InstagramLikeSlider.jsx";
import { normilezeTime } from "../../utils/normileze.js";


const RewardPerLevel = ({ lootduck }) => {
    const [aboutMenu, setAboutMenu] = useState(false);


    return (
        <div className={s['column']}>
            {aboutMenu && <InstagramLikeAboutSlider onClose={() => setAboutMenu(false)} />}
            <div className={s['info']} onClick={() => {
                setAboutMenu(true)
            }}>INFO
            </div>
            <div className={s['Reward']}>

                <div className={s['level']}>{lootduck?.l10 || 0}</div>
                <div className={s['level']}>{lootduck?.l9 || 0}</div>
                <div className={s['level']}>{lootduck?.l8 || 0}</div>
                <div className={s['level']}>{lootduck?.l7 || 0}</div>
                <div className={s['level']}>{lootduck?.l6 || 0}</div>
                <div className={s['level']}>{lootduck?.l5 || 0}</div>
                <div className={s['level']}>{lootduck?.l4 || 0}</div>
                <div className={s['level']}>{lootduck?.l3 || 0}</div>
                <div className={s['level']}>{lootduck?.l2 || 0}</div>
                <div className={s['level']}>{lootduck?.l1 || 0}</div>
            </div>
        </div>
    )
}

const BuyAction = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const dispatch = useDispatch();
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);
    const user = useSelector((state) => state.user.user);
    const [setAddress] = useSetWalletAddressMutation();
    const [leftTimeToStart, setLeftTimeToStart] = useState(null);
    // при подключение кошелька вызвать функцию
    const onConnect = async (e) => {
        console.log('e ->', userFriendlyAddress)
        // отключить аккаунт
        await setAddress({ access_token: user.access_token, address: userFriendlyAddress }).then((res) => {
            if (res.data) {
                console.log(res.data)
            } else {
                console.log(res.error.data)
            }
        })
        // tonConnectUI.connector.disconnect()
    }

    const callBack = () => {
        navigate('/')
    }

    useEffect(() => {
        if (userFriendlyAddress) {
            onConnect()

        }
    }, [userFriendlyAddress]);

    useEffect(() => {
        // let time = new Date(2024, 7, 28, 15, 0, 0, 0) // +3 часа
        let timestamp = 1724846419000 // 28 15:00
        let interval = setInterval(() => {
            let leftSeconds = (timestamp - Date.now()) / 1000
            if (leftSeconds < 0) {
                clearInterval(interval)
                return
            }
            setLeftTimeToStart(leftSeconds)

        }, 500)

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
        <div className={s['BuyAction']}>
            {user?.walletAddress != null ? (
                <div className={`${s['buy']} disabled`} onClick={() => {

                }}>start at {normilezeTime(leftTimeToStart)}
                </div>
            ) : (

                <div className={s['buy']}
                    onClick={() => {  tonConnectUI.modal.open() }}
                >Connect wallet
                </div>
            )}
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
            <RewardPerLevel lootduck={user.lootduck} />
            <BuyAction />
        </div>
    )
};

export default Game_LootDuck;
