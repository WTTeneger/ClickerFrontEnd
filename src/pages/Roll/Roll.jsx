import React, { useEffect } from 'react'
import s from './Roll.module.scss'
import { MaterialSymbolsAdd, MaterialSymbolsInfoI, MaterialSymbolsVolumeUp } from '../../assets/icons'
import { useDispatch, useSelector } from 'react-redux'
import { normilezeBalance } from '../../utils/normileze'
import { giftsImg, rollBase2Bg, rollBaseBg, rollCel, rollWinBg, spinShop, rollBaseSuper } from '../../assets'
import { useGetPaylinkToAutoClickerMutation, useGetPaylinkToRollMutation, useGetRollMutation } from '../../store/user/user.api'
import { message, Tooltip } from 'antd'
import { resetCurrentUser } from '../../store/user/userSlice'
import { ChipSvg, CoinSvg } from '../../assets/img.jsx'
import { t, use } from 'i18next'
import Vibra from '../../utils/vibration.js'
import { isRouteErrorResponse, useNavigate } from 'react-router'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);
const _t = (msg) => {
  return t(`roll.${msg}`)
}


function BuyChips({ close }) {
  // при рендере появляется в -100% и появляется в 0%
  // при нажатии на кнопку закрыть уходит в -100% и удаляется


  useEffect(() => {
    // анимация появления
    gsap.to('.buyChips', {
      y: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    })

    // если свапнул вниз по draggable
    let draggable = document.querySelector('.draggable')
    let isDrag = false
    let startDrag = 0

    // если провел пальцем вниз
    draggable.addEventListener('touchstart', (e) => {
      isDrag = true
      startDrag = e.touches[0].clientY
    })
    draggable.addEventListener('touchend', (e) => {
      if (isDrag) {
        isDrag = false
        if (e.changedTouches[0].clientY - startDrag > 100) {
          closeBox()
        }
      }
    })
  }, [])

  const closeBox = () => {
    gsap.to('.buyChips', {
      y: '100%',
      duration: 0.3,
      ease: 'power2.inOut'
    }).then(() => {
      close()
    })
  }


  const product = [

    // 6: 768,
    // 25: 2800,
    // 50: 4800,
    // 100: 8000

    {
      id: 1,
      value: 6,
      price: 768
    },
    {
      id: 2,
      value: 25,
      price: 2800
    },
    {
      id: 3,
      value: 50,
      price: 4800
    },
    {
      id: 4,
      value: 100,
      price: 8000
    },


  ]
  const [getBuyLink] = useGetPaylinkToRollMutation();
  const user = useSelector(state => state.user.user)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const onBuy = (count) => {
    getBuyLink({ access_token: user.access_token, count: count }).then((res) => {
      if (res.data && res?.data?.link) {
        setTimeout(() => {
          window.open(res.data.link);
          try {
            window.Telegram.WebApp.openInvoice(res.data.link)
            try {
              window.Telegram.WebApp.onEvent('invoiceClosed', (status) => {
                if (status === 'paid') {
                  message.success('Оплата прошла успешно')
                }
              })
            } catch (error) {
              message.error('unknown error');
            }
          } catch (error) {
            message.error('unknown error');
          }
          setIsLoaded(false)
        }, 1000);
      } else {
        message.error('Ошибка при покупке, попробуйте позже')
        setIsLoaded(false)
      }
    });
  }


  return (
    <div className={`${s['buyChips']} buyChips draggable`}>
      <div className={s['overlay']} onClick={() => closeBox()} />
      <div className={`${s['content']}`} >
        <div className={s['tooltip']} />
        {/* <div className={s['close']} onClick={() => closeBox()}><MaterialSymbolsInfoI /></div> */}
        <div className={s['title']}>Купить фишки</div>
        <div className={`${s['chips']} ${isLoaded ? 'disabled' : ''}`}>
          {product.map((el) => {
            return (
              <div className={`${s['chip']} ${el.max && s['max']}`} onClick={() => { onBuy(el.value) }}>
                <div className={s['img']}>
                  <img src={spinShop[el.id]} alt="chip" />
                </div>
                <div>
                  <div className={`${s['value']} ${s['vw']}`}>{normilezeBalance(el.value)}<ChipSvg /></div>
                  <div className={`${s['price']}  ${s['vw']}`}>{normilezeBalance(el.price)} ⭐️</div>
                </div>
              </div>
            )
          })}
          {isLoaded && <div className={s['loader']} />}
        </div>

      </div>
    </div>
  )
}


function RollHeader({ openBuyPage }) {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)
  return (
    <div className={s['roll_header']}>
      <div className={s['spin']}>{normilezeBalance(user.finance.spinBalance)}<ChipSvg /></div>
      <div className={s['btn']} onClick={() => { openBuyPage() }}><MaterialSymbolsAdd /> Больше спинов</div>
      <div className={`${s['action']} disabled`}>
        <div className={s['action_el']}><MaterialSymbolsInfoI /></div>
        <div className={s['action_el']}><MaterialSymbolsVolumeUp /></div>
      </div>

    </div>
  )
}


function RollBaseElement({ number, el, bg }) {

  let inc;

  switch (el.name) {
    case 'coin':
      inc = <CoinSvg />
      break;
    case 'spin':
      inc = <ChipSvg />
      break;


    default:
      break;
  }

  return <div className={`${s['rollBaseEl']} ${el.letter ? s['super'] : ''}`}
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
    <div className={s['title']}>{_t(el.name)}</div>
    {el.amount ?
      <div className={s['value']}>{normilezeBalance(el.amount)} {inc ? inc : null}</div> :
      el.name && giftsImg[el.name] ?
        <div className={s['image']}><img src={giftsImg[el.name]} /></div>
        : <div className={`${s['letter']} lett-${number}`}>{el.letter || ''}</div>
    }
    {<div className={`${s['lock']} ${el.name ? s['active'] : ''}`}
      style={{
        backgroundImage: `url(${bg})`,
        transition: `${el.name ? 1 : .1}s ${el.name ? 0.2 * number : 0.05 * number}s`,
        // transitionDelay: `${el.name ? 0.2 * number : 0}s`,
      }} />}
  </div>
}

function RollBase() {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  const isFirstRoll = React.useRef(true)
  const wheel = React.useRef(null)
  const wheelsInfo = React.useRef(null)
  const [winId, setWinId] = React.useState(null)
  const [onSpinRoll] = useGetRollMutation()
  const [isSpin, setIsSpin] = React.useState(false)



  function vibraRoll() {
    setTimeout(() => {
      Vibra.impact('medium')
      if (isSpin) vibraRoll()
    }, 200)
  }

  // колесо фортуны
  let _wheels = [
    {
      cash: 100,
    },
    {
      cash: 100,
    },
    {
      cash: 100,
    },
    {
      cash: 100,
    },
    {
      cash: 100,
    },
    {
      cash: 100,
    },
    {
      cash: 100,
    },
    {
      cash: 100,
    },
  ]

  const [wheels, setWheels] = React.useState(_wheels)


  const onSpin = () => {
    setIsSpin(true)
    setWheels(_wheels)
    wheelsInfo.current = null;
    setTimeout(() => {
      isFirstRoll.current = false
      wheel.current.style.transform = `rotate(0deg)`;
      setWinId(null)
      onSpinRoll({ access_token: user.access_token }).then((res) => {
        dispatch(resetCurrentUser(res.data.user))
        if (res.data) {
          wheelsInfo.current = res.data.roll.prizes;
          setWheels(prev => res.data.roll.prizes)
          setTimeout(() => {
          }, 8000)
          setTimeout(() => {
            spinRoll(res.data.roll.prize.index)
          }, 2500)
        } else {
          message.error('Ошибка при спине')
        }
      }).catch((err) => { })
    }, isFirstRoll ? 0 : 1000)
  }


  const transformLetterToPoz = (wins, index) => {
    let winsLetter = document.querySelector('.lett-' + index)
    // console.clear();
    // передвинуть букву в позицию .letter-b
    let lowerLetter = wins.letter.toLowerCase();
    let targetLetter = document.querySelector('.letter-' + lowerLetter);
    // переместить букву в позицию targetLetter
    let targetLetterPos = targetLetter.getBoundingClientRect();
    let winsLetterPos = winsLetter.getBoundingClientRect();
    gsap.to(winsLetter, {
      x: targetLetterPos.x - winsLetterPos.x - 28,
      y: targetLetterPos.y - winsLetterPos.y + 6,
      fontSize: '2.5rem',
      duration: 0.5,
      // скорость 2ы
      onComplete: () => {
        // color: #ffefb7;
        // opacity: 1;
        // border - color: #ffefb7;
        // winsLetter.style && (winsLetter.style = `color: #ffefb7; opacity: 1; border-color: #ffefb7;`)
        // winsLetter.style.transform = `translate(${targetLetterPos.x - winsLetterPos.x}px, ${targetLetterPos.y - winsLetterPos.y}px)`
        targetLetter.classList.add(s['active'])
      }
    })
    // через 3 секунды вернуть букву на место но быстро

    gsap.to(winsLetter, {
      x: 0,
      y: 0,
      fontSize: 'revert-layer',
      duration: 0,
      delay: 0.5,
      onComplete: () => {
        winsLetter.classList.remove('active')
      }
    })

  }


  const spinRoll = (index = 5) => {
    // index = Math.floor(Math.random() * wheels.length)
    setWinId(null)
    // сгенерировать случайное число от 360 до 720
    let oneCellDeg = (360 / wheels.length)
    let indexDeg = oneCellDeg * (wheels.length - index)
    //
    let randomDegree = parseInt(indexDeg + (360 * 5));
    // рандомное число от -18 до 18
    let randomDegree18 = Math.floor(Math.random() * 36) - 18;
    wheel.current.style.transform = `rotate(0deg)`;
    setTimeout(() => {
      wheel.current.style.transition = 'all 5s cubic-bezier(.14,.45,.45,1)';
      wheel.current.style.transform = `rotate(${randomDegree + randomDegree18}deg)`;
      setTimeout(() => {
        wheel.current.style.transform = `rotate(${randomDegree}deg)`;
        wheel.current.style.transition = 'all .3s';
        setWinId(prev => index)
        setIsSpin(false)
        Vibra.notification('success')
        setTimeout(() => {
          if (wheelsInfo.current[index].name == 'letter') {
            transformLetterToPoz(wheelsInfo.current[index], index)
          }
          wheel.current.style.transition = 'all 0s';
        }, 400)

      }, 5200)
    }, 50)
  }

  let getAngle = (numberEl) => {
    let results = parseInt((360 / wheels.length) * numberEl);
    return results
  }

  return (
    <>
      <div className={s['base']}>
        <div className={s['whell']}>
          <div className={s["wheel-container"]}>
            <div className={s['whell-cel']} style={{
              backgroundImage: `url(${rollCel})`,
            }} />
            <div className={s["wheel"]} ref={wheel} key={'whelKey'}>
              {wheels.map((el, index) => {
                console.log('el->', el)
                let img = winId == index ? rollWinBg : el.letter ? rollBaseSuper : index % 2 == 0 ? rollBaseBg : rollBase2Bg
                return <div className={s['segment']}
                  style={{
                    transform: `rotate(${getAngle(index)}deg) translateX(50%)`,

                  }}
                  data-value={index}>
                  <RollBaseElement key={index} number={index} el={el} bg={img} />
                </div>
              })}
            </div>
            <button className={`${s["spin-button"]} ${isSpin ? 'disabled' : ''}`} onClick={() => { onSpin(5) }}>SPIN</button>
          </div>
        </div>
      </div>
    </>
  )
}

export const BonusWords = () => {
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

  console.log(user.bonus)
  useEffect(() => {
    console.log(bonuses)
    if (!bonuses) return
    Object.keys(bonuses).map((el, i) => {
      if (bonuses[el]) {
        setIsActive(true)
      }
    });
    // bonuses.map((el, i) => {
    //   console.log(el)
    // })
  }, [])

  return (

    <div className={s['extra_game']}>
      <div className={s['FAREA']}>
        {word.split('').map((el, index) => {
          return (<div className={`${s['FKey']} letter-${el} ${bonuses[el] ? s['active'] : ''}`}>{el}</div>)
        })}
      </div>
      <div className={`${s['action']} ${isActive ? "" : 'disabled'}`} onClick={() => navigate('/game/gift-page')}>Bonus game</div>
    </div>
  )
}

export default function Roll() {
  const [isOpenBuyPanel, setIsOpenBuyPanel] = React.useState(false)

  return (
    <div className={s['roll']}>
      {isOpenBuyPanel && <BuyChips isOpenBuyPanel={isOpenBuyPanel} close={() => { setIsOpenBuyPanel(false) }} />}
      <RollHeader openBuyPage={() => { setIsOpenBuyPanel(true) }} />
      <div className={s['rb']}>
        <RollBase openBuyPage={() => { setIsOpenBuyPanel(true) }} />
      </div>
      <div className={s['footer']}>
        <BonusWords />
      </div>
    </div>
  )
}