import React, { useEffect } from 'react'
import s from './EggsPage.module.scss'
import './EggsPage.scss'
import { MaterialSymbolsAdd, MaterialSymbolsInfoI, MaterialSymbolsVolumeUp } from '../../assets/icons.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { normilezeBalance } from '../../utils/normileze.js'
import { eggsStage, frendSvg, giftsImg, rollBase2Bg, rollBaseBg, rollCel, rollWinBg } from '../../assets/index.js'
import { useGetGiftsMutation, useGetRollMutation, useMintGiftMutation } from '../../store/user/user.api.js'
import { message } from 'antd'
import { resetCurrentUser } from '../../store/user/userSlice.js'
import { ChipSvg, CoinSvg } from '../../assets/img.jsx'
import { t } from 'i18next'
import Vibra from '../../utils/vibration.js'
import { useNavigate } from 'react-router'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { setFooter, setHeader } from '../../store/user/interfaceSlice.js'
import { translation } from '../../utils/translater.jsx';
const _t = translation('games')


import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Confetti from 'react-confetti-boom'


const BonusWords = () => {
  const user = useSelector(state => state.user.user)
  const navigate = useNavigate()
  let bonuses = user.bonus ? user.bonus : {
    b: false,
    o: false,
    n: false,
    u: false,
    s: false,
  }
  const word = 'bonus'


  const [isActive, setIsActive] = React.useState(false)

  useEffect(() => {
    if (!bonuses) return
    let total = 0
    Object.keys(bonuses).map((el, i) => {
      if (bonuses[el] == true) {
        total++
      }
    });

    if (total >= word.length) {
      setIsActive(true)
    }
  }, [])



  return (

    <div className={s['extra_game']}>
      <div className={s['FAREA']}>
        {word.split('').map((el, index) => {
          return (<div className={`${s['FKey']} letter-${el} ${bonuses[el] ? s['active'] : ''}`}>{el}</div>)
        })}
      </div>
      {!isActive ? <div className={`${s['action']}`} onClick={() => navigate('/game/roll')}>{_t('getAccess')}</div> : ''}
    </div>
  )
}


gsap.registerPlugin(useGSAP);



const Confi = () => {
  return (
    <>
      {/* <Confetti mode="boom"
        particleCount={100}
        deg={300}
        spreadDeg={60}
        launchSpeed={1.5}
        
        />; */}
      <Confetti mode="boom"
        particleCount={250}
        deg={300}
        spreadDeg={30}
        x={-.2}
        launchSpeed={2.5}
        shapeSize={30}
      />

      <Confetti mode="boom"
        particleCount={250}
        deg={230}
        spreadDeg={30}
        x={1.2}
        launchSpeed={2.5}
        shapeSize={30}

      />
    </>
  )
}

const HeaderBar = ({ friends = 0, maxFriends = 10 }) => {
  friends = friends > maxFriends ? maxFriends : friends

  let percent = (friends / maxFriends) * 100
  percent = percent > 100 ? 100 : percent
  // цвета от 0 - 100 с красного на зеленый
  let color = `rgb(${255 - percent * 2.55},${percent * 2.55},0)`

  return (
    <div className={s['headerBox']}>
      <div className={s['text']}>{_t('increaseChance')}<br /><p>{_t('inviteFriends')}</p></div>
      <div className={s['friends']}>
        <div className={s['ico']}>
          <img src={frendSvg} className={''} />
        </div>
        <div className={s['value']}>{friends}/{maxFriends}</div>

      </div>
      <div className={s['progress-bar']}>
        <div className={s['bar']} style={{ width: `${percent}%`, backgroundColor: color }} />

      </div>
    </div>
  )
}

function EggsPage() {
  const user = useSelector(state => state.user.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getGifts] = useGetGiftsMutation()
  const [mintGoft] = useMintGiftMutation()
  const [eggState, setEggState] = React.useState(0)
  const [gifts, setGifts] = React.useState([])
  const [canBrake, setCanBrake] = React.useState(true)
  const [countFriends, setCountFriends] = React.useState(0)
  const [prize, setPrize] = React.useState(null)

  useEffect(() => {
    getGifts({ access_token: user.access_token }).then(res => {
      console.log(res)
      setGifts(res.data.items || [])
      setCanBrake(res?.data?.canPlay || false)
      setCountFriends(res?.data?.countFriends || 0)
    })
    dispatch(setHeader(false))
    dispatch(setFooter(false))


    if (window.Telegram.WebApp) {
      window.Telegram?.WebApp.BackButton.show()
      window.Telegram?.WebApp.onEvent('backButtonClicked', () => {
        navigate('/')
      })
    }

    if (window.Telegram.WebApp.isFullscreen) {
      document.querySelector('.App').classList.add('full-screen-AP')
    }
    return () => {
      document.querySelector('.App').classList.remove('full-screen-AP')
      dispatch(setHeader(true))
      dispatch(setFooter(true))
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide()
        window.Telegram.WebApp.offEvent('backButtonClicked', () => { })
      }
    }


  }, [])

  const animate = (e) => {
    // потрясти e.target
    let target = e.target
    let tl = gsap.timeline()
    // менять ротейт на 10 градусов относительно низа элемента
    target.style.transformOrigin = '50% 100%'

    tl.to(target, { duration: 0.1, rotation: 10, x: 10, y: 10 })
      .to(target, { duration: 0.1, rotation: -10, x: -10, y: -10 })
      .to(target, { duration: 0.1, rotation: 10, x: 10, y: 10 })
      .to(target, { duration: 0.1, rotation: -10, x: -10, y: -10 })
      .to(target, { duration: 0.1, rotation: 0, x: -0, y: 0 })
    setEggState(prev => prev + 1)



    if (eggState >= 40) {
      mintGoft({ access_token: user.access_token }).then(res => {
        console.log(res)
        if (res.error) {
          console.log(res.error.data)
          message.error(res.error.data.error ||
            _t('unknownError')
          )
        } else {
          message.success(_t('congratulations'))
          if (res?.data?.roll?.prize) {
            setPrize(res.data.roll.prize);
          }
          // dispatch(resetCurrentUser())
        }
      })
    }
    Vibra.impact('medium')


  }


  return (
    <div className={`${s['EggsPage']} EggsPage ${!canBrake ? s['locked'] : null}`}>
      <div className={s['main']}>
        <HeaderBar friends={countFriends} maxFriends={10} />
        {prize ?
          <>
            <Confi />
            <div className={`${s['eggs']} eggs`}>

              <img src={giftsImg[prize.image || 'gift']} />
              {/* <div style={{ textAlign: 'center' }}>{eggState}</div> */}
            </div>
            <div className={s['btn']} onClick={() => {
              window.location.href = 'https://t.me/amal_agishev'
            }}>{_t('getPrize')}</div>
          </>
          :
          <>
            <div className={`${s['eggs']} eggs ${!canBrake ? 'disabled' : ''}`} onClick={animate}>
              <img style={{ display: eggState / 6 >= 0 && eggState / 6 < 1 ? 'block' : 'none' }} src={eggsStage[1]} />
              <img style={{ display: eggState / 6 >= 1 && eggState / 6 < 2 ? 'block' : 'none' }} src={eggsStage[2]} />
              <img style={{ display: eggState / 6 >= 2 && eggState / 6 < 3 ? 'block' : 'none' }} src={eggsStage[3]} />
              <img style={{ display: eggState / 6 >= 3 && eggState / 6 < 4 ? 'block' : 'none' }} src={eggsStage[4]} />
              <img style={{ display: eggState / 6 >= 4 && eggState / 6 < 5 ? 'block' : 'none' }} src={eggsStage[5]} />
              <img style={{ display: eggState / 6 >= 5 ? 'block' : 'none' }} src={eggsStage[6]} />

              {/* <div style={{ textAlign: 'center' }}>{eggState}</div> */}
            </div>
            <div className={s['footerer']}>
              <BonusWords />
            </div>
            {/* <div className={s['btn']} onClick={() => { navigate('/roll') }}>Получить доступ</div> */}
          </>
        }
      </div>
      <div className={s['footer']}>
        <div className={s['prizes']}>
          {/* <div className={s['tag']}>Призы:</div> */}
          {/* <div className={s['pr']}> */}
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            // centeredSlides={true}
            loop={true}
            // pagination={{
            //   clickable: true,
            // }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            // navigation={true}
            modules={[Pagination, Navigation, Autoplay]}
            className={s['pr']}
          >

            {[...gifts, ...gifts, ...gifts].map((el, i) => {
              return (
                <SwiperSlide className={s['br']}>

                  <div className={s['prize-b']}>
                    <div className={s['prize-r']} key={i}>
                      <div className={s['img']}>
                        <img src={giftsImg[el.image]} />

                      </div>
                      <div className={s['title']}>
                        <div className={s['tt']}>{el.title}</div>

                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
          {/* </div> */}
        </div>

      </div>
    </div >
  )
}

export default EggsPage;