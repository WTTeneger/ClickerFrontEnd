import React from 'react'
import s from './Roll.module.scss'
import { MaterialSymbolsAdd, MaterialSymbolsInfoI, MaterialSymbolsVolumeUp } from '../../assets/icons'
import { useDispatch, useSelector } from 'react-redux'
import { normilezeBalance } from '../../utils/normileze'
import { rollBase2Bg, rollBaseBg, rollCel, rollWinBg } from '../../assets'
import { useGetRollMutation } from '../../store/user/user.api'
import { message } from 'antd'
import { resetCurrentUser } from '../../store/user/userSlice'
import { ChipSvg, CoinSvg } from '../../assets/img.jsx'
import { t } from 'i18next'
const _t = (msg) => {
  return t(`roll.${msg}`)
}


function RollHeader() {
  const user = useSelector(state => state.user.user)
  console.log(user.finance)
  return (
    <div className={s['roll_header']}>
      <div className={s['spin']}>{normilezeBalance(user.finance.spinBalance)}<ChipSvg /></div>
      <div className={s['btn']}><MaterialSymbolsAdd /> Больше спинов</div>
      <div className={s['action']}>
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

  return <div className={`${s['rollBaseEl']}`}
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
    <div className={s['title']}>{_t(el.name)}</div>
    {el.amount ?
      <div className={s['value']}>{normilezeBalance(el.amount)} {inc ? inc : null}</div> :
      el.name ?
        <div className={s['image']}><img src={`/src/assets/roll/${el.name}_gift.png`} /></div>
        : null
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
  const [winId, setWinId] = React.useState(null)
  const [onSpinRoll] = useGetRollMutation()
  const [isSpin, setIsSpin] = React.useState(false)
  // колесо фортуны
  let _wheels = [
    {
      cash: 100,
    },
    // {
    //   cash: 100,
    // },
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
    // {
    //   cash: 100,
    // },
    // {
    //   cash: 100,
    // },
    // {
    //   cash: 100,
    // },
  ]

  const [wheels, setWheels] = React.useState(_wheels)


  const onSpin = () => {
    setIsSpin(true)
    setWheels(_wheels)
    setTimeout(() => {
      isFirstRoll.current = false
      wheel.current.style.transform = `rotate(0deg)`;
      setWinId(null)
      onSpinRoll({ access_token: user.access_token }).then((res) => {
        dispatch(resetCurrentUser(res.data.user))
        console.log(res)
        if (res.data) {
          setWheels(res.data.roll.prizes)
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
        setWinId(index)
        setIsSpin(false)
        setTimeout(() => { 
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
    <div className={s['base']}>
      <div className={s['whell']}>
        <div className={s["wheel-container"]}>
          <div className={s['whell-cel']} style={{
            backgroundImage: `url(${rollCel})`,
          }} />
          <div className={s["wheel"]} ref={wheel} key={'whelKey'}>
            {wheels.map((el, index) => {
              let img = winId == index ? rollWinBg : index % 2 == 0 ? rollBaseBg : rollBase2Bg
              return <div className={s['segment']}
                style={{
                  transform: `rotate(${getAngle(index)}deg) translateX(50%)`
                }}
                data-value={index}>
                <RollBaseElement key={index} number={index} el={el} bg={img} />
              </div>
            })}

            {/* <div className={s['segment']} data-value="2">
              <div className={s['el']}>2</div>
            </div>
            <div className={s['segment']} data-value="3">
              <div className={s['el']}>3</div>
            </div>
            <div className={s['segment']} data-value="4">
              <div className={s['el']}>4</div>
            </div>
            <div className={s['segment']} data-value="5">
              <div className={s['el']}>5</div>
            </div>
            <div className={s['segment']} data-value="6">
              <div className={s['el']}>6</div>
            </div>
            <div className={s['segment']} data-value="7">
              <div className={s['el']}>7</div>
            </div>
            */}

          </div>
          <button className={`${s["spin-button"]} ${isSpin ? 'disabled' : ''}`} onClick={() => { onSpin(5) }}>SPIN</button>
        </div>
      </div>
    </div>
  )
}

export default function Roll() {
  return (
    <div className={s['roll']}>
      <RollHeader />
      <div className={s['rb']}>
        <RollBase />
      </div>
    </div>
  )
}