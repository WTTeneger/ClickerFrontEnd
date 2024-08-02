import React, { useEffect, useRef } from 'react';
import s from './Home.module.scss';
import { useNavigate } from 'react-router';
import Clicker from '../../components/Clicker/Clicker';
import { MAX_ENERGY } from '../../utils/constants';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { coinSvg, energySvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, updateBalance, updateEnergy } from '../../store/user/userSlice';
import { useClaimAutoClickerMutation, useGetClickerMutation, useGetPaylinkToAutoClickerMutation, useSendInfoMutation } from '../../store/user/user.api';
import { normilezeBalance, normilezeTime } from '../../utils/normileze';
import { message } from 'antd';
import Vibra from '../../utils/vibration.js';
import { CibCashapp, MaterialSymbolsLock, SvgSpinnersPulseRings3 } from '../../assets/icons.jsx';


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
  const [isTimeActive, setIsTimeActive] = React.useState(false);
  const dispatch = useDispatch();
  const toGet = React.useRef(null);
  const toFinish = React.useRef(null);

  const [toF, setToF] = React.useState(null);

  const [getBuyLink] = useGetPaylinkToAutoClickerMutation();
  const [claimAutoClicker] = useClaimAutoClickerMutation();


  const user = useSelector(state => state.user.user);

  const onBuy = () => {
    setIsLoaded(true);
    getBuyLink({ access_token: user.access_token }).then((res) => {
      if (res.data && res?.data?.link) {
        setTimeout(() => {
          window.open(res.data.link, '_blank');
          setIsLoaded(false)
        }, 1000);
      } else {
        message.error('unknown error');
        setIsLoaded(false)
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
    if (!user.autoClicker?.toFinish) return;

    toGet.current = user.autoClicker?.earned
    setToF(user.autoClicker?.toFinish)

    if (user.autoClicker?.toFinish) {
      const interval = setInterval(() => {
        toFinish.current = parseInt(user.autoClicker?.finishAt - ((new Date()).getTime() / 1000));
        console.log(parseInt(user.autoClicker?.readyfrom), parseInt(toFinish.current))
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
    }

  }, [user.autoClicker]);
  useEffect(() => { }, [user])

  return (
    <div className={`${s['AutoClicker']} 
    ${isLoaded ? 'disabled' : ''}
    ${parseInt(user.autoClicker?.readyfrom) < parseInt(toFinish.current) ? 'disabled' : ''}
    `}
      onClick={() => { user?.autoClicker?.isBuyed ? takeAutoClicker() : onBuy() }}>
      <div className={s['AutoClicker__icon']}>
        {isLoaded ?
          <SvgSpinnersPulseRings3 /> :
          <>
            {user?.autoClicker?.isBuyed ? <CibCashapp /> : <MaterialSymbolsLock />}
            {user?.autoClicker?.isBuyed ? <div className={s['time']}>{normilezeTime(toFinish.current || 0)}</div> : null}
          </>
        }
      </div>
      <div className={s['AutoClicker__count']}>
        {!user?.autoClicker?.isBuyed
          ?
          <div className={s['AutoClicker__count__text']}>Buy autoClicker</div>
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

  const user = useSelector(state => state.user.user);
  const [balance, setBalance] = React.useState(user?.finance?.coinBalance || 0);
  const [energy, setEnergy] = React.useState(user.energy);
  const lastSendActualInfo = React.useRef(new Date());
  const clickerRef = React.useRef(null);
  const lastClickDate = React.useRef(new Date());
  const [sendInfo] = useSendInfoMutation();
  const dataToSave = React.useRef({
    clicks: 0,
    totalEarned: 0,
    actualEnergy: 0,
  });

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
      if (prev - perClickLeaveEnergy <= 0) {
        Vibra.notification('error');
        toAdd = parseInt(prev * perClick);
        if (new Date() - lastSendActualInfo.current > 10000) {
          sendActualInfo(true)
          lastSendActualInfo.current = new Date();
        }
      } else {
        actualData.actualEnergy += perClickLeaveEnergy;
        setBalance(pr => pr + toAdd);
        if (toAdd > 0) {
          generateFloatingNumber(toAdd, event, 1, bust)
          actualData.totalEarned += toAdd;
        }
        return prev - perClickLeaveEnergy;
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


  // useEffect(() => {
  //   dispatch(updateBalance(balance));
  //   dispatch(updateEnergy(energy));
  // }, [balance, energy]);

  // useState(() => {
  //   // добавить обработчик на клик или на тач
  //   clickerRef.current.addEventListener('click', (e) => {
  //     // console.log('click', e)
  //     Click(0, e);
  //   });
  //   clickerRef.current.addEventListener('touchstart', (e) => {
  //     // console.log('click', e)
  //     Click(0, e);
  //   });

  //   // не работает если нажимаю 2 мя пальцами
  //   clickerRef.current.addEventListener('touchmove', (e) => {
  //     // console.log('click', e)
  //     Click(0, e);
  //   });
  // }, [clickerRef]);


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
        dispatch(resetCurrentUser(res.data.clicker));
        setBalance(res.data.clicker.finance.coinBalance + dataToSave.current.totalEarned);
        setEnergy(res.data.clicker.energy - dataToSave.current.actualEnergy);
      }
    });
  }

  // при смене страницы
  useEffect(() => {
    // обновить user из стора
    // каждые 10 секунд сохранять данные

    const interval = setInterval(() => {
      if (lastClickDate.current) {
        if (new Date() - lastClickDate.current > 2000) {
          lastClickDate.current = null;
          sendActualInfo()
        }
      }
    }, 2000);


    return () => {
      clearInterval(interval);
      sendActualInfo()
    }
  }, []);

  // поставить глобальный стиль для body
  useEffect(() => {
    document.getElementsByClassName('App')[0].style.overflow = 'visible';

    // если нажал пробел нажать лкм мышкой  
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        // нажать в центре экрана
        let event = {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2
        }
        Click(1, event);
        // нажать мышкой
        // window.dispatchEvent(new MouseEvent('click', event));
      }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.getElementsByClassName('App')[0].style.overflow = 'auto';
    }
  }, []);



  return (

    <div className={s['home']}>

      <div className={s['balance']}>
        <div className={s['coin']}>
          <img src={coinSvg} />
        </div>
        <div className={s['value']}>{normilezeBalance(balance)}</div>
      </div>

      <Clicker Click={Click} ref={clickerRef} />

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
    </div >
  );
};

export default Home;
