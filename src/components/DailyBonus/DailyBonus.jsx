import React, { useEffect, useRef } from 'react';
import { chipSvg, coin, coinSvg, energySvg } from '../../assets/index.js'
import s from './DailyBonus.module.scss';
import { BiCalendar2CheckFill, LogosTelegram, MaterialSymbolsArrowOutward, MaterialSymbolsAttachMoney, MaterialSymbolsCheck, MaterialSymbolsCloseRounded, MaterialSymbolsLightRefreshRounded, MaterialSymbolsMoneyOff } from '../../assets/icons.jsx';
import InfoBox from '../InfoBox/InfoBox.jsx';
import { useBuyUpgradeMutation, useCheckTaskMutation, useGetDailyRewardMutation, useGetTasksMutation } from '../../store/user/user.api.js';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, updateEverTaskById, updateTasks, updateUpgrades } from '../../store/user/userSlice.js';
import { message } from 'antd';
import { normilezeBalance, normilezeTime, normilezeVal } from '../../utils/normileze.js';


const DailyBonus = ({ data = null }) => {
  if (!data) return null;
  const ref = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [getDailyReward] = useGetDailyRewardMutation()
  const [getTasks] = useGetTasksMutation()
  const user = useSelector(state => state.user.user);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const [canTakeAt, setCanTakeAt] = React.useState(false);


  const onCli = () => {
    ref.current.click()
  }

  const getReward = () => {
    setIsLoaded(true)
    setCanTakeAt(prev => 86400)
    getDailyReward({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        res?.data?.everyDayTask && dispatch(updateTasks(res.data));
      } else {
        res.error && message.error(res?.error?.data?.message || 'Unknown error')
      }
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setIsLoaded(false)
    });
  }
  const isClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    let dt = ((new Date(data.canTakeAt) - new Date()) / 1000) || 86400
    setCanTakeAt(dt);
    
    const interval = setInterval(() => {
      
      setCanTakeAt((prev) => {
        console.log(prev)
        if (prev < 0) {
          clearInterval(interval)
          prev = 0;
        } else {
          prev = prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval)
    }



  }, [data, user])

  useEffect(() => { }, [canTakeAt])

  return (
    <>
      <div className={s['btn']} onClick={() => { setIsOpen(true) }}>
        <div className={s['icon']}><img src={chipSvg} /></div>
        <div className={s['info']}>
          <div className={s['title']}>Daily reward</div>
          <div className={s['desc']}><img src={coinSvg} /> +{normilezeBalance(data.totalRewards)}</div>
        </div>
        <div className={s['pin']}></div>
      </div>


      {isOpen && <InfoBox actionBtn={ref} isClose={isClose}>
        <div className={s['quest']}>
          <div className={s['logo']}>
            {data?.sicon ? <img src={data?.icon} /> : <BiCalendar2CheckFill />}
          </div>
          <div className={s['title']}>{'Daily reward'}</div>
          <div className={s['description']}>{"Log in to the game daily and receive valuable bonuses"}</div>
          <div className={s['reward']}>
            <div className={s['rewards']}>
              {data?.reward?.map((item, index) => {
                return (
                  <div key={index} className={`${s['rewards__item']} ${s[item.status]}`}>
                    <div>Day {index + 1}</div>
                    <img src={item.type == 'coin' ? coinSvg : chipSvg} />
                    <div>{normilezeVal(item.value)}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={`${s['actions']} ${isLoaded ? 'disabled' : ''}`}>
            <div className={`${s['btn']} ${data.canTake ? '' : 'disabled'}`} onClick={() => { getReward() }}>{data.canTake ? 'Claim' : normilezeTime(canTakeAt)}</div>
          </div>
          <div ref={ref}></div>
        </div>
      </InfoBox >}
    </>
  )
};

export default DailyBonus;
