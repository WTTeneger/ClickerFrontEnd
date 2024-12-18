import React, { useEffect } from 'react';
import { coin, coinSvg } from '../../assets/index.js'
import s from './EarnedBox.module.scss';
import { MaterialSymbolsLightCloseRounded } from '../../assets/icons.jsx';
import InfoBox from '../InfoBox/InfoBox.jsx';
import { normilezeBalance } from '../../utils/normileze.js';
import { useDispatch } from 'react-redux';
import { addCoin } from '../../store/user/userSlice.js';


const EarnedBox = ({ data }) => {
  const ref = React.useRef(null);
  const dispatch = useDispatch();
  const onclick = () => {
    dispatch(addCoin(data.earn));
  }
  return (
    <InfoBox actionBtn={ref}>
      <div className={s['content']}>
        <div className={s['content__title']}>AFK-bonus</div>
        <div className={s['content__description']}>Your clicker continues to earn for 4 hours while you are offline<br /> <br />Come back more often, our algorithms miss you</div>
        <div className={s['content__earned']}>
          <div className={s['total']}>+{normilezeBalance(data.earn)}</div>
          <img src={coinSvg} alt="coin" />
        </div>
        <div className={s['content__take']} ref={ref} onClick={() => { onclick() }}>Claim</div>
      </div>
    </InfoBox>
  )
};

export default EarnedBox;
