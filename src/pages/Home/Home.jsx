import React, { useEffect, useRef } from 'react';
import s from './Home.module.scss';
import { useNavigate } from 'react-router';
import Clicker from '../../components/Clicker/Clicker';
import { MAX_ENERGY } from '../../utils/constants';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { coinSvg, energySvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, setEndGameBox, updateBalance, updateEnergy } from '../../store/user/userSlice';
import { useClaimAutoClickerMutation, useGetClickerMutation, useGetPaylinkToAutoClickerMutation, useSendInfoMutation } from '../../store/user/user.api';
import { normilezeBalance, normilezeTime } from '../../utils/normileze';
import { message } from 'antd';
import Vibra from '../../utils/vibration.js';
import { CibCashapp, MaterialSymbolsAdsClick, MaterialSymbolsCheck, MaterialSymbolsLightRefreshRounded, MaterialSymbolsLock, MemoryArchive, SvgSpinnersPulseRings3 } from '../../assets/icons.jsx';
import { EndGameStory } from '../../components/StoryBox/EndGameStory.jsx';


const perClickLeaveEnergy = 1;
const perClick = 5;
const bustLeverage = 5;

const generateFloatingNumber = (number, event, speed = 1, bust = false) => {
  let floatingNumber = document.createElement('div');
  floatingNumber.classList.add('floatingNumber');
  floatingNumber.innerHTML = `+${number}`;
  if (bust) {
    floatingNumber.style.color = '#ff7800';
    floatingNumber.style.scale = 1.5;
  }

  // случайное число сдвига относительно центра курсора (от -20 до 20)
  let random1 = Math.random() * 40 - 20;
  let random2 = Math.random() * 40 - 20;

  floatingNumber.style.left = `${event.clientX - 20 - random2}px`;
  floatingNumber.style.top = `${event.clientY - 20 + random1}px`;
  document.body.appendChild(floatingNumber);

  setTimeout(() => {
    floatingNumber.remove();
  }, speed * 1000);
}




const AutoClicker = ({ autoClicker }) => {
  const [isReady, setIsReady] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isBuyed, setIsBuyed] = React.useState(false);
  const [isTimeActive, setIsTimeActive] = React.useState(false);
  const dispatch = useDispatch();
  const toGet = React.useRef(null);
  const toFinish = React.useRef(null);
  const ref = React.useRef(null);

  const [toF, setToF] = React.useState(null);

  const [getBuyLink] = useGetPaylinkToAutoClickerMutation();
  const [claimAutoClicker] = useClaimAutoClickerMutation();
  const [getClicker] = useGetClickerMutation();

  const user = useSelector(state => state.user.user);

  const onBuy = () => {
    setIsLoaded(true);
    setIsBuyed(true)
    getBuyLink({ access_token: user.access_token }).then((res) => {
      if (res.data && res?.data?.link) {
        setTimeout(() => {
          // window.open(res.data.link);
          try {
            window.Telegram.WebApp.openInvoice(res.data.link)
            try {
              window.Telegram.WebApp.onEvent('invoiceClosed', (status) => {
                if (status === 'paid') {
                  getClicker({ access_token: user.access_token }).then((res) => {
                    if (res.data) {
                      dispatch(resetCurrentUser(res.data.clicker));
                    }
                  })
                }
              })
            } catch (error) {
              message.error('unknown error');
            }
            // window.Telegram.WebApp.openInvoice('https://t.me/$99Uho-SVaUnSCAAAzddyIOffk04');
          } catch (error) {
            message.error('unknown error');
          }
          setIsLoaded(false)
        }, 1000);
      } else {
        getClicker({ access_token: user.access_token }).then((res) => {
          if (res.data) {
            dispatch(resetCurrentUser(res.data.clicker));
          }
        })
        message.error('unknown error');
        setIsLoaded(false)
        setIsBuyed(false)
      }
    });
  }

  const takeAutoClicker = () => {
    setIsLoaded(true)
    claimAutoClicker({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        console.log(res.data.user)
        dispatch(resetCurrentUser(res.data.user));
        setIsLoaded(false)
      } else {
        message.error('unknown error');
        setIsLoaded(false)
      }
    })
  }


  useEffect(() => {
    if (user.autoClicker?.toFinish == null) return;
    let toFin = parseInt(user.autoClicker.finishAt - ((new Date()).getTime() / 1000));
    let leaveTime = user.autoClicker.maxTime - toFin;
    let toTakes = leaveTime * user.autoClicker.extraPerSecond;
    toGet.current = toTakes;
    setToF(toFin)

    if (toFin > 0) {
      toFinish.current = parseInt(toFin);
      toGet.current = toGet.current + user.autoClicker?.extraPerSecond;
      setToF(prev => prev - 1)

      const interval = setInterval(() => {
        toFinish.current = parseInt(user.autoClicker?.finishAt - ((new Date()).getTime() / 1000));
        console.log(toGet.current, user.autoClicker?.extraPerSecond)
        toGet.current = toGet.current + user.autoClicker?.extraPerSecond;

        setToF(prev => prev - 1)
        if (toFinish.current < 0) {
          clearInterval(interval);
          setIsReady(false);
        }
      }, 1000);


      return () => {
        clearInterval(interval);
      }
    } else {
      toFinish.current = 0;
      toGet.current = user?.autoClicker?.earned || 0;
    }

  }, [user.autoClicker,]);
  useEffect(() => { }, [user])

  return (
    <div className={`${s['AutoClicker']}
    ${isLoaded ? 'disabled' : ''}
    ${parseInt(user.autoClicker?.readyfrom) < parseInt(toFinish.current) ? 'disabled' : ''}
    `}
      ref={ref}
      onClick={() => { user?.autoClicker?.isBuyed ? takeAutoClicker() : onBuy() }}>
      <div className={s['AutoClicker__icon']}>
        {isLoaded ?
          <SvgSpinnersPulseRings3 /> :
          <>
            {user?.autoClicker?.isBuyed ? <CibCashapp /> : isBuyed ? <MaterialSymbolsLightRefreshRounded /> : <MaterialSymbolsAdsClick />}
            {user?.autoClicker?.isBuyed ? <div className={s['time']}>{normilezeTime(toFinish.current || 0)}</div> : null}
          </>
        }
      </div>
      <div className={s['AutoClicker__count']}>
        {!user?.autoClicker?.isBuyed
          ?
          isBuyed
            ? <div className={s['AutoClicker__count__text']}>Check</div>
            : <div className={s['AutoClicker__count__text']}>Buy AutoClicker</div>

          :
          <>
            <div className={s['AutoClicker__count__total']}>{normilezeBalance(toGet.current)}</div>
            <div className={s['AutoClicker__count__text']}>CLAIM</div>
          </>
        }
      </div>
    </div>
  )
}


const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [clickerTimeout, setClickerTimeout] = React.useState(0);
  const user = useSelector(state => state.user.user);
  const [balance, setBalance] = React.useState(user?.finance?.coinBalance || 0);
  const [energy, setEnergy] = React.useState(user.energy);
  const [isCloseMemory, setIsCloseMemory] = React.useState(false);
  const lastSendActualInfo = React.useRef(new Date());
  const clickerRef = React.useRef(null);
  const lastClickDate = React.useRef(new Date());
  const [sendInfo] = useSendInfoMutation();
  const dataToSave = React.useRef({
    clicks: 0,
    totalEarned: 0,
    actualEnergy: 0,
  });
  const refF = React.useRef(null);

  const Click = (bust = false, event) => {
    let x = bust ? bustLeverage : 1
    lastClickDate.current = new Date();
    let toAdd = 1 * x * user.earnPerTap || 1;
    let actualData = {
      clicks: dataToSave.current.clicks + 1,
      totalEarned: dataToSave.current.totalEarned,
      actualEnergy: dataToSave.current.actualEnergy
    }


    setEnergy(prev => {
      if (prev - user.earnPerTap <= 0) {
        Vibra.notification('error');
        setClickerTimeout(10)
        toAdd = parseInt(prev * perClick);
        if (new Date() - lastSendActualInfo.current > 10000) {
          sendActualInfo(true)
          lastSendActualInfo.current = new Date();
        }
      } else {
        actualData.actualEnergy += user.earnPerTap;
        setBalance(pr => pr + toAdd);
        if (toAdd > 0) {
          generateFloatingNumber(toAdd, event, 1, bust)
          actualData.totalEarned += toAdd;
        }
        return prev - user.earnPerTap;
      }
      return 0;
    });
    dataToSave.current = actualData

  }

  const [getClicker] = useGetClickerMutation();
  // Каждую секунду добавлять 1 энергию 



  // обновление энергии



  useEffect(() => {
    let dateUpdate = new Date(user.dateUpdate);
    let now = new Date();
    let timeDiff = Math.abs(now.getTime() - dateUpdate.getTime());
    let diffSeconds = Math.ceil(timeDiff / 1000);
    setEnergy(prev => {
      let total = prev + diffSeconds * perClickLeaveEnergy;
      if (total <= user.energyMax) {
        return total
      }
      return user.energyMax
    })

    const interval = setInterval(() => {
      // максимальное количество энергии - 5000
      // if (clickerTimeout > 0) {
      setClickerTimeout(prev => {
        if (prev == 0) return 0;
        if (prev - 1 <= 0) {
          return 0;
        }
        return prev - 1;
      });
      // }

      setEnergy(prev => {
        if (prev + perClickLeaveEnergy <= user.energyMax) {
          return prev + perClickLeaveEnergy;
        }
        return prev
      });
    }, 1000);

    setBalance(user.finance.coinBalance);

    return () => {
      clearInterval(interval);
    }
  }, [, user]);


  const openEndGameStory = () => {

    dispatch(setEndGameBox(false))
  }



  const sendActualInfo = (isBurn = false) => {
    if (dataToSave.current.clicks === 0) return;
    let extra = isBurn ? 2 : 0;
    let dt = { ...dataToSave.current, clicks: dataToSave.current.clicks + extra };
    dataToSave.current = {
      clicks: 0,
      totalEarned: 0,
      actualEnergy: 0,
    }
    sendInfo({ access_token: user.access_token, data: dt }).then((res) => {
      if (res.data) {
        if (res.data.warning) {
          Vibra.notification('error');
          message.warning(res.data.warning.reason, 5);
          setClickerTimeout(10)
            (res?.data?.warning?.isBanned == true) && navigate('/ban');
        } else {
          dispatch(resetCurrentUser(res.data.clicker));
          setBalance(res.data.clicker.finance.coinBalance + dataToSave.current.totalEarned);
          setEnergy(res.data.clicker.energy - dataToSave.current.actualEnergy);
        }
      } else {
      }
    });
  }

  // при смене страницы
  useEffect(() => {
    // обновить user из стора
    // каждые 10 секунд сохранять данные

    const interval = setInterval(() => {
      if (lastClickDate.current) {
        if (new Date() - lastClickDate.current > 1000) {
          lastClickDate.current = null;
          sendActualInfo()
        }
      }
    }, 1000);

    // при выходе с сайта
    window.addEventListener('beforeunload', () => {
      sendActualInfo()
    });
    window.Telegram.WebApp.onEvent('backButtonClicked', () => {
      sendActualInfo()
    })



    return () => {
      clearInterval(interval);
      sendActualInfo()
      window.Telegram.WebApp.offEvent('backButtonClicked', () => { })
    }
  }, []);

  // поставить глобальный стиль для body
  useEffect(() => {
    document.getElementsByClassName('App')[0].style.overflow = 'visible';


    return () => {
      document.getElementsByClassName('App')[0].style.overflow = 'auto';
    }
  }, []);


  return (
    <>
      <div className={s['home']} ref={refF}>
        {isCloseMemory ? null :
          <div className={`${s['Memory']}`} style={{ padding: '0px' }}>
            <div className={`${s['Memory']}`} onClick={() => { openEndGameStory() }}>
              <MemoryArchive />
              Воспоминания
              <div className={s['booble']} style={{
                left: '-10%',
                top: '-20%',
              }} />
              <div className={s['booble']} style={{
                left: '60%',
                top: '60%',
              }} />
              <div className={s['booble']} style={{
                right: '-10%',
                top: '-40%',
              }} />
              <div className={s['booble']} style={{
                right: '60%',
                top: '-80%',
              }} />
            </div>
            <div className={s['close']} onClick={() => { setIsCloseMemory(true) }}>X</div>
          </div>
        }

        <div className={s['balance']}>
          <div className={s['coin']}>
            <img src={coinSvg} />
          </div>
          <div className={s['value']}>{normilezeBalance(balance || 0)}</div>
        </div>

        <Clicker Click={Click} ref={clickerRef} lock={clickerTimeout > 0} />

        <div className={s['energy']}>
          <div className={s['info']}>
            <div className={s['energyy']}>
              <img src={energySvg} />
            </div>
            <div className={s['value']}>{energy} / {user.energyMax}</div>

          </div>
          <div className={s['progress']}>
            <div className={s['progress-bar']} style={{ width: `${(energy / user.energyMax) * 100}%` }}></div>
          </div>
          <AutoClicker />
        </div>
        {/* <div className={s['bg']} style={{
        backgroundImage: `url(${l2})`,
      }} /> */}
      </div >
    </>
  );
};

export default Home;
