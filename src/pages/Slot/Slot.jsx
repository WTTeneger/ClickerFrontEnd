import React, { useEffect } from 'react';
import s from './Slot.module.scss';
import { useGenSlotMutation } from '../../store/user/user.api';
import { useSelector } from 'react-redux';

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


const Slot = () => {
  const [matrix, setMatrix] = React.useState([]);
  const [rollMatrix, setRollMatrix] = React.useState([]);
  const [seed, setSeed] = React.useState(null);
  const [combination, setCombination] = React.useState([]);
  const [isSpin, setIsSpin] = React.useState(false);

  const [countWinLine, setCountWinLine] = React.useState(0);
  const [spinAPI] = useGenSlotMutation();
  const user = useSelector(state => state.user.user);
  const barabans = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()];
  const baraban = React.createRef();
  const refss = [];

  for (let i = 0; i < 5; i++) {
    let roll = [];
    for (let j = 0; j < 3; j++) {
      roll.push(React.createRef());
    }
    refss.push(roll);
  }

  const drawLine = (target, index = 0, count = 5) => {
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
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      let lastEl = ellArray[0];

      ellArray.forEach((el, i) => {
        if (i < count && el?.style) {
          el.style.border = '2px solid ' + color;
        }
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

        if (i < count) {
          line.setAttribute('stroke-opacity', 0.7);
        } else {
          line.setAttribute('stroke-opacity', 0.2);
        }
        svg.appendChild(line);

        lastEl = el;
      })
      if (svg.children.length > 0) {
        //пауза 5 с

        console.log('draw')
        // document.querySelector('.variationToWin').appendChild(svg);
      }

    }, 5000);
  }


  const spin = () => {
    setIsSpin(true);
    setRollMatrix([]);
    spinAPI({ access_token: user.access_token, countLine: 10, bet: 100 }).then((res) => {
      if (res.data) {
        setSeed(res.data.spin.seed)
        setCountWinLine(res.data.spin.winCombinations.length)
        setCombination(res.data.spin.winCombinations)
        setMatrix(res.data.spin.result)
        setRollMatrix(res.data.spin.rollMatrix)
        document.querySelector('.variationToWin').innerHTML = ''

      }
      // таймер на 3 секунды
      setTimeout(() => {

        let ad = document.getElementsByClassName(`${s["roll"]}`)
        for (let i = 0; i < ad.length; i++) {

          let el = ad[i];
          setTimeout(() => {
            // замедлить анимацию animation-duration: 3s;
            el.classList.remove(s['spin']);
            el.style.transform = `translateY(-100px)`;

            setTimeout(() => {
              el.style.transition = 'transform .4s';
              el.style.transform = `translateY(0px)`;
            }, 100);
          }, 300 * i + 1);
        }
        setTimeout(() => {
          setIsSpin(false);
          console.log('combination', combination)
        }, 300 * ad.length + 1000);
      }, 2000);
    })
  }

  useEffect(() => {
    console.log(refss)
    if (rollMatrix.length > 0) {
      refss.forEach((line, i) => {
        line.forEach((el, j) => {
          el?.current?.innerHTML && (el.current.innerHTML = matrix[j][i])
        });
      });
      combination.forEach((el, index) => {
        drawLine(el.combination, index, el.count);
      });
    }
  }, [rollMatrix]);


  const Locker = () => {
    return (
      [...Array(10).fill(0)].map((el, i) => <div key={i} className={s['symbol']}>~</div>)
    )
  }



  return (
    <div className={s['slot']}>
      <div className={s['slot_area']}>
        <div className={`${s['variationToWin']} variationToWin`}></div>
        {/* {!isSpin && */}
        {refss.map((roll, i) => (
          <div key={i} className={`${s["roll"]} ${isSpin && s['spin']}`}>

            {roll.map((symbol, j) => {
              return <div key={j} ref={refss[i][j]} className={s["symbol"]}>~</div>
            })}
            {isSpin && <Locker />}
            {/* {isSpin && <Locker />} */}
          </div>

        ))}

      </div>
      <div className={s['ss']}>{seed} {countWinLine}</div>
      <div className={s['utils']}>
        <div className={s['l1']}>
          <div className={s['bet']}>Ставка: 50$</div>
          <div className={s['bet']}>Общая ставка: 300$</div>
        </div>
        <div className={s['l1']}>
          <div className={s['line-setting']}>Настройки линий</div>
          <div className={s['vabank']}>Максимальная ставка</div>
        </div>
        <div className={s['l3']}>
          <div className={s['info']}>!</div>
          <div className={s['spin']}>Автоспин</div>
          <div className={`${s['spin']} ${s['base']} ${isSpin ? 'disabled' : null}`} onClick={() => { spin() }}>Спин</div>
          <div className={s['info']}>@</div>
        </div>
      </div>
    </div >
  );
};

export default Slot;
