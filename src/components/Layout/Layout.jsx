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
import { introBannerPng, introBannerPng2 } from '../../assets';
import Quests from '../Quests/Quests';
import MaleSelector from '../MaleSelector/MaleSelector';
import { getSkin, skins } from '../../assets/icons/skins';
import { AboutLevels } from '../SliderAboutLevels/SliderAboutLevels.jsx';
import { Link } from 'react-router-dom';
import { MdiTelegram, Spinner } from '../../assets/icons.jsx';
import { setFooter, setHeader } from '../../store/user/interfaceSlice.js';


const Loader = ({ re, progress }) => {
  return (
    <div className='loadBanner' ref={re} style={{
      backgroundImage: `url(${introBannerPng})`,
    }}>
      <div className={'loader'}>
        <Spinner />
        <div className={'text'}>Loaded</div>

      </div>
      <div className={'content'}>
        <div className={'text'}>More info in official channels</div>
        <div className={'icons'}>
          <Link to={'https://t.me/royal_click'} className='ic'>
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

  const gender = React.useRef(null);

  //window.Telegram.WebApp

  useEffect(async () => {


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
    window.Telegram.WebApp.expand();

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
            // navigate('/redirect');
            // navigate('/game/loot_duck');
            navigate('/redirect');
          }
        }
      });
    }


    if (user.last_get + 180000 < Date.now()) {
      setIsLoaded(true);
      getClicker({ access_token: REFaccess_token.current }).then((res) => {
        setIsView(true);

        if (res.data) {
          if (res?.data?.totalEarned?.isEarned == true) {
            updateDate.current = res.data.totalEarned;
          }
          gender.current = res?.data?.clicker?.gender ? res?.data?.clicker?.gender : null;
          dispatch(resetCurrentUser(res.data.clicker));
        } else {
          if (res.error.status == 405) {
            console.log(res.error.data)
            dispatch(setError(res.error.data));
            navigate('/ban');
          }
        }

        // таймер на 3 часа
        setProgress(100);
        ref.current.style.animation = `fadeOut 1s ease-in-out forwards .5s`;

        setTimeout(() => {
          setIsLoaded(false)
        }, 1600);

      }).catch((err) => {
        console.log(err)
        navigate('/ban');
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



  let skinData = getSkin(user?.skin, user.gender)

  return (
    <div className="layout" ref={refF}>
      {isLoaded &&
        <Loader re={ref} progress={progress} />
      }
      <Quests />
      {inter.aboutLevels && <AboutLevels />}
      {isView &&
        <>
          <div className={'phone'} style={{
            backgroundImage: `url(${skinData.background})`,
          }} />
          <HeaderBar />
          {children}
          <FooterBar />
          {updateDate.current && <EarnedBox data={updateDate.current} />}
          {gender.current == null && <MaleSelector gender={gender.current} />}
        </>
      }


    </div >
  );
};

export default Layout;
