import React, { useEffect, useRef, useState } from 'react';
import s from './Ratings.module.scss';
import { BannerSvg, casinoSvg, celendarSvg, chipSvg, coin, coinSvg, energySvg, exitSvg, frendSvg, telegramSvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useGetRatingsMutation, useGetTasksMutation } from '../../store/user/user.api';
import { updateTasks } from '../../store/user/userSlice';
import { MaterialSymbolsCheckCircle, MaterialSymbolsCheckCircleOutline, MaterialSymbolsChevronLeft, MaterialSymbolsChevronRight, MaterialSymbolsLightFluorescentOutlineRounded, SvgSpinnersPulseRings3 } from '../../assets/icons';
import Quests from '../../components/Quests/Quests';
import { normilezeBalance, normilezeName } from '../../utils/normileze';
import { useNavigate } from 'react-router';
import { setAbout, setFooter } from '../../store/user/interfaceSlice';
import { getSkin } from '../../assets/icons/skins';
import { AboutLevels } from '../../components/SliderAboutLevels/SliderAboutLevels';


const Banner = () => {
  const [show, setShow] = React.useState(true);
  if (!show) return null;
  return (
    <div className={s['banner']}>
      <div className={s['title']}>Займи первое место к концу недели и получи приз</div>
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


const icons = {
  casino: {
    icon: casinoSvg,
    color: '#e25609'
  },
  telegram: {
    icon: telegramSvg,
    color: '#fbb62d'
  },
  friends: {
    icon: frendSvg,
    color: '#fbb62d'
  },
  spin: {
    icon: chipSvg,
    color: ''
  },
  energy: {
    icon: energySvg,
    color: '#f9a030'
  },
  celendar: {
    icon: celendarSvg,
    color: '#69cb25'
  },

}


const NotFounded = () => {
  return (
    <div className={`${s['not-founded']} ${s['user']}`}>
      <div className={s['title']}>тут пока пусто. Играй и забирай это место себе</div>
    </div>)
}

const RatingPageUser = ({ item, poz, me = false, isMe = false }) => {
  console.log(item, poz, me)
  return (
    <div className={`${s['user']} ${me ? s['me'] : ""} ${isMe ? s['mes'] : ""}`}>
      <div className={s['l']}>
        <div className={s['avatar']}>
          <img src={coin} />
        </div>
        <div className={s['info']}>
          <div className={s['name']}>{normilezeName(item.name)}</div>
          <div className={s['value']}>

            <div className={s['coin']}><img src={coin} /></div>
            <div className={s['value']}>{normilezeBalance(item.totalEarned, ',')}</div>

          </div>
        </div>
      </div>
      <div className={s['poz']}>{poz + 1}</div>
    </div>
  )
}

const RatingPage = ({ actualPage, changePage, iLength = 0, item, me, close = true }) => {
  console.log('me -> ', me)
  const navigate = useNavigate();
  const dispatch = useDispatch();




  const callBack = () => {
    navigate('/')
  }
  useEffect(() => {
    console.log('ss')
    dispatch(setFooter(false));
    if (window.Telegram.WebApp) {
      window.Telegram?.WebApp.BackButton.show()
      window.Telegram?.WebApp.onEvent('backButtonClicked', callBack)
    }

    return () => {
      dispatch(setFooter(true));
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide()
        window.Telegram.WebApp.offEvent('backButtonClicked', callBack)
      }
    }
  }, []);

  let user = useSelector(state => state.user.user);

  let skinData = getSkin(item?.name?.toLowerCase(), user.gender)
  return (
    <div className={s['group']}>
      <div className={s['header']}>
        <div className={s['area']}>
          <div className={`${s['tools']} ${actualPage <= 0 ? 'disabled' : ''}`}
            onClick={() => { changePage(-1) }}
          ><MaterialSymbolsChevronLeft /></div>
          <div className={s['marea']}>
            <div className={`${s['image']} ${skinData.active == true ? 'disabl' : s['disabl']} ${close ? s['close'] : ''}`}><img src={skinData.skin} /></div>
            <div className={s['title']}>{item.name}</div>
            <div className={s['desc']}>
              <div className={s['text']}>от</div>
              <div className={s['from']}>{normilezeBalance(item.min != 0 ? item.min - 1 : item.min, ',')}</div>
              <div className={s['icon']}><img src={coin} /></div>
            </div>
            <div className={s['value']}>
              <div className={s['my']}>{normilezeBalance(user.finance.totalEarned, ',')}</div>
              <div className={s['target']}>/</div>
              <div className={s['target']}>{normilezeBalance(item.max, ',')}</div>
            </div>
          </div>
          <div className={`${s['tools']} ${actualPage + 1 >= iLength ? 'disabled' : ''}`}
            onClick={() => { changePage(1) }}

          ><MaterialSymbolsChevronRight /></div>
        </div>
        <div className={s['progress']}></div>

      </div>
      <div className={s['users']}>
        {me && me?.position > 10 && <RatingPageUser key={'me'} me={true} item={me} poz={me.position - 1} />}
        {item.users.length > 0 ? item.users.map((user, index) => {
          return <RatingPageUser key={index} item={user} poz={index} isMe={index + 1 == me?.position || -1} />
        }) : <NotFounded />}

      </div>
    </div>
  )
}

const Ratings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const actualPage = useRef(0);
  const [AP, setAP] = React.useState(null);
  const [ratings, setRatings] = React.useState(null);
  const [me, setMe] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [getRating] = useGetRatingsMutation();
  useEffect(() => {
    // if (user.tasks.last_get + 180000 < Date.now()) {
    setIsLoaded(true)
    getRating({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        console.log(res.data)
        setRatings(res.data.rating);
        setMe(res.data.me)
        // dispatch(updateTasks(res.data));
      } else {
        setRatings(null);
      }
      setIsLoaded(false)
    })
    // } else {
    // }
  }, [user.access_token, user.tasks]);

  const isClose = () => {
    setAboutTask(null);
  }

  const changePage = (l = 1) => {
    // d 1/-1
    if (l > 0) {
      if (actualPage.current + 1 <= ratings.length) {
        actualPage.current = actualPage.current + 1
        setAP(prev => prev + 1)
      }
    } else {
      if (actualPage.current - 1 >= 0) {
        actualPage.current = actualPage.current - 1
        setAP(prev => prev - 1)
      }
    }
  }


  const setIsActiveAboutGame = () => {
    dispatch(setAbout(true))
  }


  return (
    <>
      <div className={s['ratings']}>
        {/* <Banner /> */}
        <div className={s['box']} >

          <div className={s['info']} onClick={() => { setIsActiveAboutGame(true) }}>Info</div>
          <div className={s['ratingArea']}>
            {ratings ? ratings.map((item, index) => {
              let poz = ratings.findIndex((el) => el.code == me?.group);
              if (index != actualPage.current) return null;
              return <RatingPage
                actualPage={actualPage.current}
                changePage={changePage}
                iLength={ratings.length}
                key={index}
                item={item}
                close={index > poz}
                me={me?.group == item?.code.toLowerCase() || '' ? me : null}
              />
            }) : <NotFounded />}

          </div>
        </div>
      </div>
    </>
  )
};

export default Ratings;
