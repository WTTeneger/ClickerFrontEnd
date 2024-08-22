import React, { useEffect } from 'react';
import s from './Upgrades.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { BannerSvg, casinoSvg, coinSvg, energySvg, exitSvg, upgradesImg } from '../../assets';
import { useGetUpgradesMutation } from '../../store/user/user.api';
import { MaterialSymbolsInfoOutline, MaterialSymbolsInfoRounded, MaterialSymbolsLock } from '../../assets/icons';
import { updateUpgrades } from '../../store/user/userSlice';
import BuyUpgradeBox from '../../components/BuyUpgradeBox/BuyUpgradeBox';
import { normilezeBalance } from '../../utils/normileze';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

let _t = (el, extra = null) => {
  let text = `upgrades.${el}`
  if (extra) text += `.${extra}`
  return t(text)
}


const Banner = () => {
  const [show, setShow] = React.useState(true);
  if (!show) return null;
  return (
    <div className={s['banner']}>
      <div className={s['title']}>Improve your casino and earn even<br />more coins</div>
      <div className={s['image']}><img src={BannerSvg} /></div>
      <div className={s['shadow']}>
        <div className={s['circle-1']}></div>
        <div className={s['circle-2']}></div>
      </div>
      <div className={s['exit']} onClick={() => { setShow(false) }}>
        <img src={exitSvg} />
      </div>
    </div>
  )
}

const ShopItem = ({ item, isLoad, onClick }) => {
  let icon = energySvg;
  let bonusDesc = '';
  switch (Object.keys(item.levelInfo.bonus)[0]) {
    case 'hourlyProfit':
      icon = casinoSvg
      bonusDesc = _t(`bonus.hourlyProfit`)
      break;
    case 'clickProfit':
      icon = coinSvg
      bonusDesc = _t(`bonus.clickProfit`)
      break;
    case 'energyVolume':
      icon = energySvg
      bonusDesc = _t(`bonus.energyVolume`)
      break;
    default:
      icon = energySvg
      break;
  }
  return (
    <div className={`${s['shopItem']} ${item.level} ${isLoad ? 'skeleton' : ''} ${item?.con ? s['locked'] : ''} ${item?.maxLevel <= item?.level ? s['locked'] : ''} ${item.level - 1 == 0 && !item?.con ? s['notBuy'] : ''}`} onClick={item.con ? null : onClick}>
      {item?.con && <div className={s['lock']}>
        <MaterialSymbolsLock />
        <div className={s['t1']}>Need {_t(`items.${item?.con?.title}.title`)}</div>
        <div className={s['t2']}>{item?.con?.level} Level</div>
      </div>}
      <div className={s['image']}>
        {upgradesImg[item?.name] ? <img src={upgradesImg[item?.name]} /> : <img src={upgradesImg['default']} />}
      </div>
      <div className={s['title']}>{_t(`items.${item.name}.title`)}</div>
      <div className={s['bonus']}>+{item.levelInfo.val} {bonusDesc}</div>
      <div className={s['actual']} style={item?.maxLevel <= item?.level ? { justifyContent: 'center' } : {}}>
        {item?.maxLevel <= item?.level ?
          <div>Max level</div>
          : <>
            <div className={s['side']}>
              <img src={coinSvg} />
              {normilezeBalance(item?.levelInfo?.price || 0)}
            </div>
            <div className={s['side']}>{item?.isBuyed ? item?.level || 0 : null} {item?.isBuyed ? `level` : "Buy now"}</div>
          </>
        }
      </div>
    </div>
  )

}

export const InfoBar = ({ rt = true }) => {
  const user = useSelector(state => state.user.user);
  useEffect(() => { }, [user]);

  return (
    <div className={s['infoBar']} >
      <div className={s['balance']}>
        <div className={s['value']}>{normilezeBalance(user?.finance?.coinBalance, ',')}</div>
        <div className={s['icon']}><img src={coinSvg} /></div>
      </div>
      {rt && <div className={s['info']}>
        <div className={s['infoBox']} style={{ color: '#ffd260 ' }}>
          <div className={s['name']}>{_t('energy')}</div>
          <div className={s['value']}>
            <div className={s['main']}>{user.energy || '-'}</div>
            <div className={s['sub']}>/</div>
            <div className={s['sub']}>{user.energyMax || '-'}</div>
          </div>
        </div>
        <div className={s['infoBox']} style={{ color: '#e26fff ' }}>
          <div className={s['name']}>{_t('profit')}</div>
          <div className={s['value']}>
            <div className={s['main']}>+{normilezeBalance(user.earnPassivePerHour || '0')}</div>
            <div className={s['sub']}>{_t('per_hour')}</div>
            <div className={s['sub']}><MaterialSymbolsInfoRounded /></div>
          </div>
        </div>
      </div>}
    </div>
  )
}



const Upgrades = ({ }) => {
  const { t, i18n } = useTranslation();




  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [getUpgrades] = useGetUpgradesMutation();
  const [aboutUpgrade, setAboutUpgrade] = React.useState(null);
  const [shopItems, setShopItems] = React.useState(user?.shop_upgrades?.data || null);
  const [categories, setCatigories] = React.useState(['business', 'friends', 'sport']);
  const [activeCategory, setActiveCategory] = React.useState(0);
  const isLoad = shopItems === null;

  const loadUpgrades = async () => {
    setShopItems(user?.shop_upgrades?.data || null);
    getUpgrades({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        setShopItems(res.data.upgrades);
        dispatch(updateUpgrades(res.data.upgrades));
      }
    }).catch((err) => { });
  }

  useEffect(() => {
    console.log('upgrades')
    // осортировать по тем у кого есть con и у кого нет
    let dt = user.shop_upgrades?.data

    setShopItems(dt)
    if (user.shop_upgrades?.data === null || user.shop_upgrades?.last_get + 10000 < Date.now()) {
      loadUpgrades()
    }
  }, [user?.shop_upgrades]);

  const isClose = () => {
    setAboutUpgrade(null)
  }

  const onClickSet = (el) => {
    setAboutUpgrade(el)
  }

  return (
    <div className={s['upgrades']}>
      {aboutUpgrade && <BuyUpgradeBox isClose={isClose} data={aboutUpgrade} />}
      <Banner />
      <div className={s['box']}>
        <InfoBar />
        <div className={s['slider']}>
          {categories.map((item, index) => {
            return <div key={index} className={`${s['i']} ${index == activeCategory ? s['active'] : ''}`} onClick={() => { setActiveCategory(index) }}><div className={s['item']}>{_t(item)}</div></div>
          })}
        </div>
        <div className={s['area']}>
          {shopItems ? shopItems.map((item, index) => {
            if (item.group == categories[activeCategory]) {
              return <ShopItem onClick={() => { onClickSet(item) }} key={index} item={item} />
            }
          }) :
            [1, 2, 3, 4, 5].map((item, index) => {
              return <ShopItem key={index} isLoad={isLoad} />
            })
          }


        </div>

      </div>
    </div>
  )
};

export default Upgrades;
