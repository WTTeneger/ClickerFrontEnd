import React, { useEffect, useRef } from 'react';
import './Layout.scss';
import { useNavigate } from 'react-router';
import HeaderBar from '../HeaderBar/HeaderBar';
import FooterBar from '../FooterBar/FooterBar';
import { useGetClickerMutation, useGetTasksMutation, useGetUpgradesMutation } from '../../store/user/user.api';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentUser, updateTasks, updateUpgrades } from '../../store/user/userSlice';
import InfoBox from '../InfoBox/InfoBox';
import EarnedBox from '../EarnedBox/EarnedBox';
import { introBannerPng } from '../../assets';
import Quests from '../Quests/Quests';




const Layout = ({ children }) => {
  const updateDate = useRef(null);
  const ref = useRef(null);
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  // API
  const [getClicker] = useGetClickerMutation();
  const [getTasks] = useGetTasksMutation();
  const [getUpgrades] = useGetUpgradesMutation();


  // **
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 80) {
          return prev + 1;
        }
        return prev;
      });
    }, 100);
    if (user.last_get + 180000 < Date.now()) {
      setIsLoaded(true);
      getClicker({ access_token: user.access_token }).then((res) => {
        setIsView(true);

        if (res.data) {
          if (res?.data?.totalEarned?.isEarned == true) {
            updateDate.current = res.data.totalEarned;
          }
          dispatch(resetCurrentUser(res.data.clicker));
        }

        // таймер на 3 часа
        setProgress(100);
        ref.current.style.animation = `fadeOut 1s ease-in-out forwards .5s`;

        setTimeout(() => {
          setIsLoaded(false)
        }, 1600);

      })

      getTasks({ access_token: user.access_token }).then((res) => {
        if (res.data) {
          dispatch(updateTasks(res.data));
        }
      })

      getUpgrades({ access_token: user.access_token }).then((res) => {
        if (res.data) {
          dispatch(updateUpgrades(res.data.upgrades));
        }
      })
    }
    return () => {
      clearInterval(interval);
    }

  }, []);




  return (
    <div className="layout">
      {isLoaded &&
        <div className='loadBanner' ref={ref} style={{
          backgroundImage: `url(${introBannerPng})`,
        }}>
          {/* <img src={} /> */}
          <div className={'progress'}>
            <div className={'progress-bar'} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      }
      <Quests />
      {isView &&
        <>
          <HeaderBar />
          {children}
          {/* <HeaderBar /> */}
          <FooterBar />
          {updateDate.current && <EarnedBox data={updateDate.current} />}
        </>
      }


    </div >
  );
};

export default Layout;
