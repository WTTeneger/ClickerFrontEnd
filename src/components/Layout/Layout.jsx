import React, { useEffect, useRef } from 'react';
import './Layout.scss';
import { useNavigate } from 'react-router';
import HeaderBar from '../HeaderBar/HeaderBar';
import FooterBar from '../FooterBar/FooterBar';
import { useAuthorizationMutation, useGetClickerMutation, useGetTasksMutation, useGetUpgradesMutation } from '../../store/user/user.api';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, setAccessToken, setError, setGender, updateTasks, updateUpgrades } from '../../store/user/userSlice';
import InfoBox from '../InfoBox/InfoBox';
import EarnedBox from '../EarnedBox/EarnedBox';
import { introBannerPng, introBannerPng2, introBannerV2, watersMark, watersMarkSvg } from '../../assets';
import Quests from '../Quests/Quests';
import MaleSelector from '../MaleSelector/MaleSelector';
import { getSkin, skins } from '../../assets/icons/skins';
import { AboutLevels } from '../SliderAboutLevels/SliderAboutLevels.jsx';
import { Link } from 'react-router-dom';
import { MdiTelegram, Spinner } from '../../assets/icons.jsx';
import { setFooter, setHeader } from '../../store/user/interfaceSlice.js';


const Loader = ({ re, progress, leftTimeToStart = '' }) => {
  let isFullScreen = window?.Telegram.WebApp?.isFullscreen || false;
  isFullScreen = true;
  return (
    <div className='loadBanner' ref={re} style={{
      backgroundImage: `url(${introBannerV2})`,
    }}>
      <div className={'loader'}>
        <Spinner />
        <div className={'text'}>Loaded</div>

      </div>
      <div className={`alert ${isFullScreen ? 'full-screen' : ''}`}>{leftTimeToStart ? leftTimeToStart : "Технические работы"}</div>
      {/* {textData && <div className={'alert'}>{textData}</div>} */}
      <div className={'content'}>
        <div className={'text'}>More info in official channels</div>
        <div className={'icons'}>
          <Link to={'https://t.me/ducks_tap'} className='ic'>
            <MdiTelegram />
          </Link>
        </div>

      </div>
      <div className={'progress'}>
        <div className={'progress-bar'} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

// let newSeasonStartAt = 1731090600;
let newSeasonStartAt = 1731949200;

const Layout = ({ children }) => {
  const updateDate = useRef(null);
  const ref = useRef(null);
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const inter = useSelector(state => state.interface.interface);
  // API
  const [getClicker] = useGetClickerMutation();
  const [getTasks] = useGetTasksMutation();
  const [getUpgrades] = useGetUpgradesMutation();
  const [auth] = useAuthorizationMutation();

  // **
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const REFaccess_token = useRef(user?.access_token || null);
  const refF = React.useRef(null);
  const [canViewBase, setCanViewBase] = React.useState(false);
  const [leftTimeToStart, setLeftTimeToStart] = React.useState('');

  const [activeHeight, setActiveHeight] = React.useState(window.innerHeight);
  const gender = React.useRef(null);

  //window.Telegram.WebApp

  useEffect(async () => {
    // // получить текущее время по UTC
    const now = new Date();
    // в unux формат
    let unix = Math.floor(now.getTime() / 1000);

    if (unix > newSeasonStartAt) {
      setCanViewBase(true)
    } else {
      let days = Math.floor((newSeasonStartAt - unix) / 86400);
      let hours = Math.floor((newSeasonStartAt - unix) % 86400 / 3600);
      let minutes = Math.floor((newSeasonStartAt - unix) % 86400 % 3600 / 60);
      setLeftTimeToStart(`${hours}h ${minutes}m`)
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 80) {
          return prev + 1;
        }
        return prev;
      });
    }, 100);

    window.Telegram.WebApp.setHeaderColor('#1c1c1d');
    window.Telegram.WebApp.setBackgroundColor('#1c1c1d');
    window.Telegram.WebApp.isClosingConfirmationEnabled = true;
    window.Telegram.WebApp.isVerticalSwipesEnabled = false;
    window.Telegram.WebApp.isOrientationLocked = true;
    window.Telegram.WebApp.expand();

    try {
      window.Telegram.WebApp.lockOrientation();
      window.Telegram.WebApp.requestFullscreen();
    } catch (e) { }


    if (!REFaccess_token.current) {
      await auth({ web: window.Telegram.WebApp }).then((res) => {
        if (res.data) {
          dispatch(setAccessToken(res.data.token));
          REFaccess_token.current = res.data.token;
        } else {
          if (res?.error?.data?.code == 333) {
            dispatch(setGender('male'))
            dispatch(setFooter(false))
            dispatch(setHeader(false))
            gender.current = 'male'

            if (window.location.pathname.includes('connect-wallet')) {
            } else {
              navigate('/redirect');
            }
          }
        }
      });
    }


    if (user.last_get + 180000 < Date.now()) {
      setIsLoaded(true);
      getClicker({ access_token: REFaccess_token.current }).then((res) => {
        if (res.data) {
          setIsView(true);
          if (res?.data?.totalEarned?.isEarned == true) {
            updateDate.current = res.data.totalEarned;
          }
          gender.current = res?.data?.clicker?.gender ? res?.data?.clicker?.gender : null;
          dispatch(resetCurrentUser(res.data.clicker));
          setCanViewBase(true)
          setProgress(100);
          ref.current.style.animation = `fadeOut .5s ease-in-out forwards .5s`;
          setTimeout(() => {
            setIsLoaded(false)
          }, 1500);


        } else {
          let data = res.error.data;
          if (res.error.status == 405) {
            console.log(data)
            dispatch(setError(res.error.data));
            navigate('/ban');
          }
        }

        // таймер на 3 часа



      }).catch((err) => {
        console.log(err)
        // navigate('/ban');
      });

      getTasks({ access_token: REFaccess_token.current }).then((res) => {
        if (res.data) {
          dispatch(updateTasks(res.data));
        }
      })

      getUpgrades({ access_token: REFaccess_token.current }).then((res) => {
        if (res.data) {
          dispatch(updateUpgrades(res.data.upgrades));
        }
      })
    }

    return () => {
      clearInterval(interval);
    }


  }, []);


  useEffect(() => {
    // let heightHeader = document.getElementById('BASE_HEADER');
    // let heightFooter = document.getElementById('BASE_FOOTER');

    // console.log(heightFooter, heightHeader)
    // if(heightFooter && heightHeader){
    //   let height = window.innerHeight - heightHeader.clientHeight - heightFooter.clientHeight;
    //   console.log(height)
    //   // refF.current.style.height = `${height}px`;
    // }

  }, [user]);


  let skinData = getSkin(user?.skin, user.gender)

  return (
    <div className="layout" ref={refF}
    >
      {isLoaded &&
        <Loader re={ref} progress={progress} leftTimeToStart={leftTimeToStart} />
      }
      {canViewBase ?
        <>
          <Quests />
          {inter.aboutLevels && <AboutLevels />}
          {isView &&
            <>
              <div className={'phone'} style={{
                background: 'black',
                backgroundImage: `url(${watersMarkSvg})`,
              }} />
              <HeaderBar />
              {children}
              <FooterBar />
              {updateDate.current && <EarnedBox data={updateDate.current} />}
              {gender.current == null && <MaleSelector gender={gender.current} />}
            </>}
        </>
        :
        null}


    </div >
  );
};

export default Layout;
