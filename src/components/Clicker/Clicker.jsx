import React, { useEffect, useRef, useState } from 'react';
import { coin } from '../../assets/index.js'
import './Clicker.scss';
import Vibra from '../../utils/vibration.js';
import { CibCashapp } from '../../assets/icons.jsx';
import { getSkin } from '../../assets/icons/skins/index.js';
import { useSelector } from 'react-redux';




const Clicker = ({ Click, lock = false }) => {
  const [bonus, setBonus] = React.useState(false);
  const _bonus = useRef(false);
  const [bonusPoz, setBonusPoz] = React.useState({ x: 0, y: 0 });
  const [clickerStarted, setClickerStarted] = React.useState(false);
  const ref = React.useRef(null);
  const user = useSelector(state => state.user.user);
  // всплыващие цифры которые летят вверх и исчезают с места клика
  // try {
  //   window.addEventListener('touchstart', (event) => {
  //     event.preventDefault();
  //   })
  // } catch (e) {
  //   console.log(e);
  // }

  const click = (event) => {
    event.preventDefault();
    event.clientX = event.clientX;
    event.clientY = event.clientY;
    if (_bonus.current) {
      onClick(true, event)
    } else {
      onClick(false, event)
    }


    // ref.current.addEventListener('click', (event) => {
    //   console.log(event)
    //   event.preventDefault();
    //   event.clientX = event.targetTouches[0].clientX
    //   event.clientY = event.targetTouches[0].clientY
    //   if (_bonus.current) {
    //     onClick(true, event)
    //   } else {
    //     onClick(false, event)
    //   }
    // });
  }

  useEffect(() => {
    if (!ref.current) return null;
    ref.current.addEventListener('touchstart', (event) => {
      console.log('ss')
      event.clientX = event.targetTouches[0].clientX
      event.clientY = event.targetTouches[0].clientY
      if (_bonus.current) {
        onClick(true, event)
      } else {
        onClick(false, event)
      }
    });

  }, [ref]);

  const onClick = (isBonus = false, event) => {

    Vibra.impact('light');
    if (isBonus == true) {
      _bonus.current = false;
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
        _bonus.current = true;
        setTimeout(() => {
          setBonus(false);
          _bonus.current = false;
        }, 5000);
      }
    }
  }


  let skinData = getSkin(user?.skin, user.gender)
  // onClick={() => { onClick(1) }}
  return (
    <div className={`clicker ${lock ? 'disabled' : ''}`} ref={ref}>
      {/* {bonus && <div className='randomPozPoint'
        style={{
          display: bonus ? 'block' : 'none',
          left: `${bonusPoz.x}%`,
          top: `${bonusPoz.y}%`
        }}

        onClick={() => { onClick(true) }} />} */}
      <div className={`coin ${_bonus.current ? 'coin-bonus' : ''}`}
      // onClick={(e) => { bonus ? onClick(true, e) : onClick(false, e) }}
      >
        {/* <img src={coin} alt="coin" /> */}
        <img src={skinData?.skin} alt="coin" />
      </div>
    </div>
  );
};

export default Clicker;
