import React, { useEffect, useState } from 'react';
import { coin } from '../../assets/index.js'
import './Clicker.scss';
import Vibra from '../../utils/vibration.js';


const Clicker = ({ Click }) => {
  const [bonus, setBonus] = React.useState(false);
  const [bonusPoz, setBonusPoz] = React.useState({ x: 0, y: 0 });
  const [clickerStarted, setClickerStarted] = React.useState(false);
  const ref = React.useRef(null);
  // всплыващие цифры которые летят вверх и исчезают с места клика
  useEffect(() => {
    if (!ref.current) return null;
    ref.current.addEventListener('touchstart', (event) => {
      event.clientX = event.targetTouches[0].clientX
      event.clientY = event.targetTouches[0].clientY
      if (bonus) {
        onClick(true, event)
      } else {
        onClick(false, event)
      }
    });

  }, [ref]);

  const onClick = (isBonus = false, event) => {
    Vibra.impact('light');
    if (isBonus == true) {
      setBonus(false);
      Click(true, event);
    } else {
      Click(false, event);
    }


    if (bonus == false) {
      // случайное число от 0 до 1
      let random = Math.random();
      // если число больше 0.9, то показываем бонус
      if (random > 0.9) {
        setBonus(true);
        setTimeout(() => {
          setBonus(false);
        }, 5000);
      }
    }
  }



  // onClick={() => { onClick(1) }}
  return (
    <div className="clicker" ref={ref}>
      {/* {bonus && <div className='randomPozPoint'
        style={{
          display: bonus ? 'block' : 'none',
          left: `${bonusPoz.x}%`,
          top: `${bonusPoz.y}%`
        }}

        onClick={() => { onClick(true) }} />} */}
      <div className={`coin ${bonus ? 'coin-bonus' : ''}`}
      // onClick={(e) => { bonus ? onClick(true, e) : onClick(false, e) }}
      >
        <img src={coin} alt="coin" />
      </div>
    </div>
  );
};

export default Clicker;
