import React, {useEffect} from 'react';
import s from './Games.module.scss';
import {
    BannerSvg, BR1, BR2, BR3,
    casinoSvg,
    celendarSvg,
    chipSvg,
    coinSvg,
    energySvg,
    exitSvg,
    frendSvg,
    telegramSvg
} from '../../assets';
import {useNavigate} from "react-router";


const Banner = () => {
    const [show, setShow] = React.useState(true);
    if (!show) return null;
    return (
        <div className={s['banner']}>
            <div className={s['title']}>Play in game <br/>and earn more<br/> coins and TON</div>
            <div className={s['image']}><img src={BannerSvg}/></div>
            <div className={s['shadow']}>
                <div className={s['circle-1']}></div>
                <div className={s['circle-2']}></div>
            </div>
            <div className={s['exit']} onClick={() => {
                setShow(false)
            }}>
                <img src={exitSvg}/>
            </div>
        </div>
    )
}


const Games = () => {
    const navigate = useNavigate()

    return (
        <div className={s['Games']}>
            <Banner/>
            <div className={s['catalog']}>
                <div className={s['game']} onClick={()=>{
                    navigate('/game/loot_duck')
                }}>
                    <img src={BR2}/>
                </div>
                <div className={`${s['game']} ${s['disabled']}`}>
                    <img src={BR1}/>
                </div>

            </div>

        </div>
    )
};

export default Games;
