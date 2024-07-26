import React, { useEffect } from 'react';
import { coin, coinSvg } from '../../assets/index.js'
import s from './EarnedBox.module.scss';
import { MaterialSymbolsLightCloseRounded } from '../../assets/icons.jsx';
import InfoBox from '../InfoBox/InfoBox.jsx';


const EarnedBox = ({ data }) => {
  console.log(data)
  const ref = React.useRef(null);
  return (
    <InfoBox actionBtn={ref}>
      <div className={s['content']}>
        <div className={s['content__title']}>офлайн-бонус</div>
        <div className={s['content__description']}>Ваш кликер продолжает зарабатывать в течение 3х часов, пока вы не в сети<br /> <br />Возвращайтесь чаще, наши алгоритмы скучают по вам</div>
        <div className={s['content__earned']}>
          <div className={s['total']}>+{data.earn}</div>
          <img src={coinSvg} alt="coin" />
        </div>
        <div className={s['content__take']} ref={ref}>Забрать</div>
      </div>
    </InfoBox>
  )
};

export default EarnedBox;
