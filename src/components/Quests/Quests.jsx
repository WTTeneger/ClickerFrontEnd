import React, { useEffect } from 'react';
import { coin, coinSvg } from '../../assets/index.js'
import s from './Quests.module.scss';
import { LogosTelegram, MaterialSymbolsArrowOutward, MaterialSymbolsCheck, MaterialSymbolsCloseRounded, MaterialSymbolsLightRefreshRounded } from '../../assets/icons.jsx';
import InfoBox from '../InfoBox/InfoBox.jsx';
import { useCheckTaskMutation } from '../../store/user/user.api.js';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, updateEverTaskById } from '../../store/user/userSlice.js';
import Vibra from '../../utils/vibration.js';
import { message } from 'antd';
import { normilezeBalance } from '../../utils/normileze.js';


const Quests = ({ data = null, isClose = null }) => {
  if (!data) return null;
  Vibra.impact('rigid');
  const ref = React.useRef(null);
  const taskId = data?._id || null;
  const reloadRef = React.useRef(null);
  const [isCheck, setIsCheck] = React.useState(false);
  const [isDone, setIsDone] = React.useState(data.done || false);
  const [reload, setReload] = React.useState(false);
  const [checkTask] = useCheckTaskMutation();
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const check = () => {
    if (!isCheck) {
      setIsCheck(true)
      reloadRef.current.style.animation = `${s['reload']} 1s ease-in-out infinite`;

      checkTask({ id: taskId, access_token: user.access_token }).then((res) => {
        if (res.data) {
          if (res.data.isReady) {
            setIsDone(true);
            message.success('Task completed');
            dispatch(resetCurrentUser(res.data.user));
            dispatch(updateEverTaskById({
              key: data.key,
              data: { done: true }
            }));
            ref.current.click();
          }
        }
        setIsCheck(false)
        if (reloadRef?.current?.style?.animation) {
          reloadRef.current.style.animation = ``;
        }
        setReload(30);
      }).catch((err) => {
        setIsCheck(false)
        if (reloadRef?.current?.style?.animation) {
          reloadRef.current.style.animation = ``;
        }
        console.log(err)
        setReload(30);
      })

    }
  }


  useEffect(() => {
    if (typeof reload === 'number') {
      if (reload > 0) {
        const timer = setTimeout(() => {
          setReload(reload - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [reload]);

  let text = ''
  console.log(data)
  if (!isDone) {
    switch (data.condition) {
      case 'subscribe_telegram':
        text = 'Subscribe to the channel';
        break;

      case "set_status_icon":
        text = 'Set the status';
        break;

      default:
        text = 'Subscribe to the channel';
        break;
    }
  } else {
    text = 'Already done';
  }


  return (
    <InfoBox actionBtn={ref} isClose={isClose}>
      <div className={s['quest']}>
        <div className={s['logo']}>
          {data?.icon ? <img src={data?.icon} /> : <LogosTelegram />}
        </div>
        <div className={s['title']}>{data?.extra?.title || data?.title}</div>
        <div className={s['description']}>{data?.extra?.description || data?.description}</div>
        <div className={s['reward']}>
          <div className={s['reward_title']}>Rewards</div>
          <div className={s['rewards']}>
            {Object.keys(data.reward).map((key, index) => {
              if (data.reward[key] === 0) return null;
              return (
                <div key={index} className={s['rewards__item']}>
                  +{normilezeBalance(data.reward[key])} {key === 'coin' ? <img src={coinSvg} /> : <img src={coinSvg} />}
                </div>
              )
            })}
          </div>
        </div>
        <div className={s['actions']}>
          <div className={`${s['action']} ${s['check']} ${isCheck ? 'disabled' : ""} ${reload ? 'disabled' : ""}`} onClick={isDone ? null : () => { check() }} >
            <div className={s['action_icon']} ref={reloadRef} >
              {isDone ? <MaterialSymbolsCheck /> : reload ? <><MaterialSymbolsCloseRounded /><b className='pulse'>{reload}</b></> : <MaterialSymbolsLightRefreshRounded />}
            </div>
          </div>
          <div className={s['action']} onClick={() => {
            // открыть ссылку в новой вкладке
            window.open(data.extra.link, '_blank');
          }} >
            <div className={s['action_title']}>{text}</div>
            <div className={s['action_icon']} >
              {isDone ? null : <MaterialSymbolsArrowOutward />}
            </div>
          </div>


        </div>
      </div>
    </InfoBox >
  )
};

export default Quests;
