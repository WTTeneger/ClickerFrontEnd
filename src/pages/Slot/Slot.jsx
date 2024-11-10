import React, { useEffect, useRef } from 'react';

import s from './Slot.module.scss';
import { useGenSlotMutation } from '../../store/user/user.api';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialSymbolsAdd, MaterialSymbolsChromeMinimizeRounded, MaterialSymbolsInfoI, MaterialSymbolsRemove, MaterialSymbolsSync, MaterialSymbolsSyncDisabled, MaterialSymbolsVolumeUp } from '../../assets/icons';
import { chipSvg, coinSvg } from '../../assets/index.js';
import { normilezeBalance } from '../../utils/normileze.js';
import { InfoBar } from '../Upgrades/Upgrades.jsx';
import { message } from 'antd';
import { addCoin, resetCurrentUser, spendCoin } from '../../store/user/userSlice.js';
import Vibra from '../../utils/vibration.js';
import { slotsImg } from '../../assets/images/slots/index.js';
import { useNavigate, useNavigation } from 'react-router';
import AnimValue from '../../components/AnimValue/AnimValue.jsx';
import AnimObj from '../../components/AnimObj/AnimObj.jsx';
import { setFooter } from '../../store/user/interfaceSlice.js';
const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'brown',
  'grey',
  'black',
  'white',
  'cyan',
  'magenta',
  'lime',
]

const LineSettings = ({ countLine, setCountLine }) => {
  let onClick = (e = true) => {
    Vibra.impact()
    if (e) {
      setCountLine(countLine + 1);
    } else {
      setCountLine(countLine - 1);
    }
  }

  return (
    <div className={s['line-setting']}>
      <div className={s['title']}>ПКФ</div>
      <div className={s['setPanel']}>
        <div className={`${s['action']} ${countLine <= 1 ? 'disabled' : ''}`} onClick={() => { onClick(false) }}><MaterialSymbolsRemove /></div>
        <div className={s['value']}>{countLine}</div>
        <div className={`${s['action']} ${countLine >= 10 ? 'disabled' : ''}`} onClick={() => { onClick(true) }}><MaterialSymbolsAdd /> </div>
      </div>

    </div>
  )
}


const defValToWin = {
  coin: 0,
  roll: 0
}

const Slot = () => {
  const [matrix, setMatrix] = React.useState([]);
  const [rollMatrix, setRollMatrix] = React.useState([]);
  const [seed, setSeed] = React.useState(null);
  const [combination, setCombination] = React.useState([]);
  const [isSpin, setIsSpin] = React.useState(false);
  const [activeBtn, setActiveBtn] = React.useState(true);
  const [countWinLine, setCountWinLine] = React.useState(0);
  const mark = React.useRef();

  const [lineCount, setLineCount] = React.useState(10);
  const [totalWin, setTotalWin] = React.useState(defValToWin);
  const [betToLine, setBetToLine] = React.useState(10_000);
  const isVabank = React.useRef(false);
  const isAutoSpin = React.useRef(false);
  const [IAC, setIAC] = React.useState(false);

  const [spinAPI] = useGenSlotMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user);
  const barabans = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()];
  const baraban = React.createRef();
  const [isNoActive, setIsNoActive] = React.useState(true)
  const refss = [
    [React.createRef(), React.createRef(), React.createRef()],
    [React.createRef(), React.createRef(), React.createRef()],
    [React.createRef(), React.createRef(), React.createRef()],
    [React.createRef(), React.createRef(), React.createRef()],
    [React.createRef(), React.createRef(), React.createRef()],
  ];
  const poz = [];
  // for (let i = 0; i < 5; i++) {
  //   let roll = [];
  //   for (let j = 0; j < 3; j++) {
  //     roll.push(React.createRef());
  //   }
  //   refss.push(roll);
  // }

  const vibra = (el = 5, pause = 5000, type = 'medium') => {
    // 5 вибраций кажные 0.2
    setTimeout(() => {
      for (let i = 0; i < el; i++) {
        setTimeout(() => {
          Vibra.impact(type)
        }, 200 * (i + 1))
      }
    }, pause);
  }

  const drawLine = (target, index = 0, count = 5, pause = 5000, seeds) => {
    const color = colors[index % colors.length];
    let ellArray = [];

    target.split('').forEach((el, i) => {
      if (el === '*') {
        ellArray.push([Math.floor(i / 5), i % 5]);
      }
    });
    // // отфильтровать elAray по возврастанию el[1]
    ellArray = ellArray.sort((a, b) => a[1] - b[1]).map(el => refss[el[1]][el[0]].current)
    // // через svg
    setTimeout(() => {
      if (seeds != seed) return false;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('style', `width: 0%; animation-delay: ${index}s`);
      vibra(ellArray.length, index * 1000)
      let lastEl = ellArray[0];


      ellArray.forEach((el, i) => {
        // if (i < count && el?.style) {
        //   el.style.border = '2px solid ' + color;
        // }
        if (i === 0 || el?.offsetLeft == null) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        // центр элемента 

        line.setAttribute('x1', lastEl.offsetLeft + lastEl.offsetWidth / 2);
        line.setAttribute('y1', lastEl.offsetTop + lastEl.offsetHeight / 2);
        line.setAttribute('x2', el?.offsetLeft + el?.offsetWidth / 2);
        line.setAttribute('y2', el?.offsetTop + el?.offsetHeight / 2);
        // если i <count то делаем цвет более тусклым
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', 3);
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('stroke-linejoin', 'round');
        // плавное закругление
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('stroke-linejoin', 'round');
        // свечение




        if (i < count) {
          line.setAttribute('stroke-opacity', 0.7);
          line.setAttribute('filter', `drop-shadow(0px 0px 8px ${color})`);
        } else {
          line.setAttribute('stroke-opacity', 0.2);
        }
        svg.appendChild(line);
        // svg.setAttribute('style', `animation-delay: ${i}s`);

        lastEl = el;
      })
      if (svg.children.length > 0) {
        //пауза 5 с
        document.querySelector('.variationToWin').appendChild(svg);
      }

    }, pause);
  }

  const drawBonus = (target, index = 0, count = 5, pause = 5000, seeds) => {
    const color = colors[index % colors.length];
    let ellArray = [];

    target.split('').forEach((el, i) => {
      if (el === '*') {
        ellArray.push([Math.floor(i / 5), i % 5]);
      }
    });
    // // отфильтровать elAray по возврастанию el[1]
    ellArray = ellArray.sort((a, b) => a[1] - b[1]).map(el => refss[el[1]][el[0]].current)
    // // через svg
    setTimeout(() => {
      if (seeds != seed) return false;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('style', `width: 0%; animation-delay: ${index}s`);
      vibra(ellArray.length, index * 1000, 'heavy')
      let lastEl = ellArray[0];

      ellArray.forEach((el, i) => {
        const cube = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cube.setAttribute('x', el.offsetLeft);
        cube.setAttribute('y', el.offsetTop);
        cube.setAttribute('width', el.offsetWidth);
        cube.setAttribute('height', el.offsetHeight);
        cube.setAttribute('fill', '#ffffff00');
        cube.setAttribute('stroke', '#ffac3d');
        cube.setAttribute('stroke-width', 2);
        cube.setAttribute('rx', 8);
        cube.setAttribute('ry', 8);
        cube.setAttribute('filter', `drop-shadow(0px 0px 8px #ffac3d)`);
        svg.appendChild(cube);
        lastEl = el;

        el.classList.add(s['superGift'])
      })
      if (svg.children.length > 0) {
        document.querySelector('.variationToWin').appendChild(svg);
      }
    }, pause);
  }

  const autoSpin = () => {
    let tr = isAutoSpin.current
    isAutoSpin.current = !tr
    setIAC(prev => !tr)
    if (activeBtn) {
      spin()
    }
  }

  const spin = () => {
    setIsNoActive(false)
    if (user.finance.coinBalance < betToLine) {
      message.error('Недостаточно средств')
      return
    }

    setActiveBtn(false);
    setIsSpin(true);
    setTotalWin(defValToWin);
    setRollMatrix([]);
    document.querySelector('.variationToWin').innerHTML = ''
    mark.current.style.opacity = 1;
    dispatch(spendCoin(betToLine))
    spinAPI({ access_token: user.access_token, countLine: lineCount, bet: betToLine }).then((res) => {
      if (res.data) {
        setSeed(res.data.spin.seed)
        setCountWinLine(res.data.spin.winCombinations.length)
        setCombination(res.data.spin.winCombinations)
        setMatrix(res.data.spin.result)
        setRollMatrix(res.data.spin.rollMatrix)
        setTotalWin(res.data.spin.totalWin)
        try {
          setTimeout(() => {
            dispatch(resetCurrentUser(res.data.user))
          }, [(res.data.spin.winCombinations.length * 1000) + 2000]);

        } catch (e) {
          dispatch(resetCurrentUser(res.data.user))
        }
        isVabank.current == true && onVabank()

      } else {
        message.error(res?.error?.data?.message || 'Неизвестная ошибка')
        setActiveBtn(true);
        setIsSpin(false);
        dispatch(addCoin(betToLine))
      }
      // таймер на 3 секунды
      setTimeout(() => {
        let ad = document.getElementsByClassName(`${s["roll"]}`)
        setTimeout(() => {
          setIsSpin(false);
          setTimeout(() => {
            mark.current.style.opacity = 0;
          }, 300);
        }, 20 * ad.length + 200);
      }, 300);
    })
  }


  const draw = (tout) => {
    let ind = 0;
    document.querySelector('.variationToWin').innerHTML = ''
    combination.forEach((el, index) => {
      let s = `${seed}`;
      if (el.lnumber == 'bonus') {
        drawBonus(el.combination, index, el.count, tout, s);
      } else {
        drawLine(el.combination, index, el.count, tout, s);
      }
    });
  }

  useEffect(() => {


    let totalWait = 450 * (refss.length - 1)
    if (rollMatrix.length > 0) {
      setTimeout(() => {
        refss.forEach((line, i) => {
          line.forEach((el, j) => {
            if (el?.current) {
              el.current.innerHTML = ''
              el.current.classList.remove(s['superGift'])
              el.current.setAttribute('roll_key', matrix[j][i])
              // установить фон
              // console.log(el.current, rollMatrix[j][i])
              let img = slotsImg[matrix[j][i]]
              if (img) {
                // console.log(el.current, rollMatrix[j][i], img)
                el.current.style = `background-image: url(${img})`
              } else {
                el.current.innerHTML = matrix[j][i]
              }
            }
          });
        });
        draw(totalWait)

        let tt = totalWait + (1000 * (countWinLine))
        setTimeout(() => {
          setActiveBtn(true);
          if (isAutoSpin.current) {
            setTimeout(() => { spin() }, 500)
          }
        }, tt);
      }, 100)
    }
  }, [rollMatrix]);


  const Locker = () => {
    return (
      [...Array(10).fill(0)].map((el, i) => <div key={i} className={s['symbol']}>~</div>)
    )
  }

  const onVabank = () => {
    isVabank.current = true
    setLineCount(prev => 10)
    let totalToBet = parseInt(user.finance.coinBalance / 10)
    setBetToLine(totalToBet)
  }

  const keys = Object.keys(slotsImg)

  useEffect(() => {

    dispatch(setFooter(false));
    if (window.Telegram.WebApp) {
      window.Telegram?.WebApp.BackButton.show()
      window.Telegram?.WebApp.onEvent('backButtonClicked', () => {
        navigate('/game')
      })
    }

    return () => {
      dispatch(setFooter(true));
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide()
        window.Telegram?.WebApp.offEvent('backButtonClicked', () => {
          navigate('/game')
        })
      }
    }


  }, [])

  return (
    <>
      {/* <InfoBar rt={false} /> */}
      {(totalWin['coin'] || 0) > 0 ?
        totalWin['coin'] >= 100_000 ?
          <AnimObj targetId={'balanceInHeader'} targetFrom={'balanceAnimBoxTarget'} count={50} duration={countWinLine * 1.7} type='waterfall' unmount={() => { setIsAnim(false) }} obj={coinSvg} delay={0.2} />
          :
          <AnimObj targetId={'balanceInHeader'} targetFrom={'balanceAnimBoxTarget'} count={ Math.floor(Math.random() * (30 - 20 + 1)) + 20} duration={1.5} type='toTarget' unmount={() => { setIsAnim(false) }} obj={coinSvg} delay={countWinLine * 1.4 + 0.3} />
        : null}
      <div className={s['slot']}>
        <div className={s['slot_area']}>
          <div className={s['waterMark']} ref={mark}>
            <div className={s['mark']}>$Mellstroy</div>
          </div>
          <div className={`${s['variationToWin']} variationToWin`}></div>
          {refss.map((roll, i) => (
            <div key={i} className={`${s["roll"]} ${isSpin && s['spin']}`} style={isSpin ? {
              transform: `translateY(-${(i + 1) * 120}%)`,
            } : {}}>

              {roll.map((symbol, j) => {
                // случайная из keys кроме U
                let key = keys.filter(el => el != 'U');

                key = key[Math.floor(Math.random() * key.length)]


                let ico = j == 1 ? slotsImg['U'] : slotsImg[key]
                return <div key={j} ref={refss[i][j]} className={s["symbol"]}
                  style={{
                    'backgroundImage': isNoActive ? `url(${ico})` : ''
                  }}>{isNoActive ? '' : '~'}</div>
              })}
            </div>
          ))}
        </div>

        <div className={s['utils']}>
          <div className={`${s['l1']} ${s['t']}`}>
            <div className={s['bet']}>
              <div className={s['title']}>Выигрыш:</div>
              <div className={s['dw']} id='balanceAnimBoxTarget'>
                {Object.keys(totalWin).map((key, i) => {
                  if (key == 'roll' && totalWin[key] == 0) return null
                  return (
                    <div className={s['winData']} key={'ob_' + i}>
                      <div className={s['value']}>
                        <img src={key == 'coin' ? coinSvg : chipSvg} />
                        <AnimValue value={totalWin[key] || 0} delay={(countWinLine + 3) / 2 * 1000} speed={countWinLine + 2} />
                        {/* <>{normilezeBalance(totalWin[key] || 0)}</> */}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className={s['l1']}>
            <div className={s['bet']} style={{ flexDirection: 'column' }}
              onClick={() => {
                user?.finance?.spinBalance || 0 > 0 ? navigate('/game/roll') : null
              }}
            >
              <div className={s['title']}>Колесо фортуны:</div>
              <div className={s['value']}>
                <img src={chipSvg} />
                <>{normilezeBalance(user.finance.spinBalance)}</>
              </div>
            </div>
            <div className={s['bet']}>
              <div className={s['title']}>Cтавка:</div>
              <div className={s['value']}>
                <img src={coinSvg} />
                <>{normilezeBalance(betToLine)}</>
              </div>
            </div>
            {/* <div className={s['bet']}>
              <div className={s['title']}>Общая ставка:</div>
              <div className={s['value']}>
                <img src={coinSvg} />
                <>{normilezeBalance(betToLine * lineCount)}</>
              </div>
            </div> */}
          </div>
          <div className={s['l1']} onClick={() => {
            // user?.finance?.spinBalance || 0 > 0 ? navigation('/roll') : null
          }}>
            {/* <div className={s['bet']} style={{ flexDirection: 'column' }}>
              <div className={s['title']}>Колесо фартуны:</div>
              <div className={s['value']}>
                <img src={chipSvg} />
                <>{normilezeBalance(user.finance.spinBalance)}</>
              </div>
            </div> */}


            {/* <LineSettings countLine={lineCount} setCountLine={(e) => { setLineCount(e); isVabank.current = false }} /> */}
            {/* <div className={s['vabank']} onClick={() => { onVabank() }}>Максимальная ставка</div> */}
          </div>
          <div className={s['l3']}>
            <div className={`${s['info']} disabled`}><MaterialSymbolsInfoI /></div>
            <div className={`${s['spin']} ${s['autoplay']}`} onClick={() => { autoSpin() }} style={IAC ? {
              animation: `${!activeBtn ? 'anim_spin 2s linear infinite' : ''}`
            } : {}} >
              {IAC ? <MaterialSymbolsSync /> : <MaterialSymbolsSyncDisabled />}
            </div>
            <div className={`${s['spin']} ${s['base']} ${!activeBtn ? 'disabled' : isSpin ? 'disabled' : user.finance.coinBalance < betToLine ? 'disabled' : null}`} onClick={() => { spin() }}>SPIN</div>
            <div className={`${s['info']} disabled`}><MaterialSymbolsVolumeUp /></div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Slot;
