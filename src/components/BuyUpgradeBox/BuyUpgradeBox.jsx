import React, { useEffect } from 'react';
import { coin, coinSvg, energySvg } from '../../assets/index.js'
import s from './BuyUpgradeBox.module.scss';
import { LogosTelegram, MaterialSymbolsArrowOutward, MaterialSymbolsAttachMoney, MaterialSymbolsCheck, MaterialSymbolsCloseRounded, MaterialSymbolsLightRefreshRounded, MaterialSymbolsMoneyOff } from '../../assets/icons.jsx';
import InfoBox from '../InfoBox/InfoBox.jsx';
import { useBuyUpgradeMutation, useCheckTaskMutation } from '../../store/user/user.api.js';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, updateEverTaskById, updateUpgrades } from '../../store/user/userSlice.js';
import { message } from 'antd';


const BuyUpgradeBox = ({ data = null, isClose = null }) => {
  if (!data) return null;
  const ref = React.useRef(null);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [buyUpgrade] = useBuyUpgradeMutation()
  const [isLock, setIsLock] = React.useState(false);
  console.log(user)

  const buyUpgrades = (id) => {
    setIsLock(true)
    buyUpgrade({ upgradeId: id, access_token: user.access_token }).then((res) => {
      console.log('res', res)
      if (res.data) {
        console.log('res.data', res.data)
        dispatch(resetCurrentUser(res.data.user));
        dispatch(updateUpgrades(res.data.upgrades));
        message.success("Успешно куплено");
        // dispatch(updateEverTaskById({
        //   key: data.key,
        //   data: { done: true }
        // }));
      } else if (res.error) {
        let error = res?.error?.data?.message;
        if (error) message.error(error);
      }
      // нажать на ref.current
      ref.current.click()
      setIsLock(false)
    })

  }



  const canBuy = user.finance.coinBalance >= data.levelInfo.price;



  return (
    <InfoBox actionBtn={ref} isClose={isClose}>
      <div className={s['quest']}>
        <div className={s['logo']}>
          {data?.sicon ? <img src={data?.icon} /> : <LogosTelegram />}
        </div>
        <div className={s['title']}>{data?.extra?.title || data?.title}</div>
        <div className={s['description']}>{data?.extra?.description || data?.description}</div>
        <div className={s['reward']}>
          <div className={s['reward_title']}>{data.levelInfo.description}</div>
          <div className={s['rewards']}>

            <div key={1} className={s['rewards__item']}>
              +{data.levelInfo.val} <img src={energySvg} />
            </div>
          </div>
        </div>
        <div className={s['actions']}>
          <div className={`${s['action']} ${isLock ? 'disabled' : !canBuy ? 'disabled' : ''} ${data?.maxLevel >= data?.level ? 'disabled' : ''}`} onClick={() => {
            // открыть ссылку в новой вкладке
            buyUpgrades(data._id)
            // window.open(data.extra.link, '_blank');
          }} >
            <div className={s['action_title']}>{data?.maxLevel >= data?.level ? 'Максимальный уровень' : canBuy ? "Купить" : "Не хватает денег"}</div>
            <div className={s['action_icon']} >
              {data?.maxLevel >= data?.level ? '' : canBuy ? <MaterialSymbolsAttachMoney /> : <MaterialSymbolsMoneyOff />}
            </div>
          </div>

          <div ref={ref}></div>
        </div>
      </div>
    </InfoBox >
  )
};

export default BuyUpgradeBox;
