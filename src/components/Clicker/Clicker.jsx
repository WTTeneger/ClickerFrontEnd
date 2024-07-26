import React, { useEffect } from 'react';
import { coin } from '../../assets/index.js'
import './Clicker.scss';
import Vibra from '../../utils/vibration.js';


const Clicker = ({ Click }) => {
  const [bonus, setBonus] = React.useState(false);
  const [bonusPoz, setBonusPoz] = React.useState({ x: 0, y: 0 });
  const [clickerStarted, setClickerStarted] = React.useState(false);

  // всплыващие цифры которые летят вверх и исчезают с места клика
  

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
        // setBonusPoz({
        //   x: (Math.random() * 100),
        //   y: (Math.random() * 100)
        // });
        setTimeout(() => {
          setBonus(false);
        }, 5000);
      }
    }
  }



  // onClick={() => { onClick(1) }}
  return (
    <div className="clicker">
      {/* {bonus && <div className='randomPozPoint'
        style={{
          display: bonus ? 'block' : 'none',
          left: `${bonusPoz.x}%`,
          top: `${bonusPoz.y}%`
        }}

        onClick={() => { onClick(true) }} />} */}
      <div className={`coin ${bonus ? 'coin-bonus' : ''}`}
        onClick={(e) => { bonus ? onClick(true, e) : onClick(false, e) }}>
        <img src={coin} alt="coin" />
      </div>
    </div>
  );
};

export default Clicker;
