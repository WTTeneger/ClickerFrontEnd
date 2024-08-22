import React, { useEffect } from 'react';
import { coin, coinSvg, cupSvg } from '../../assets/index.js'
import s from './HeaderBar.module.scss';
import { useSelector } from 'react-redux';
import { normilezeBalance, normilezeName } from '../../utils/normileze.js';
import { useNavigate } from 'react-router';


const HeaderBar = ({ Click }) => {
  const [bonus, setBonus] = React.useState(false);
  const inter = useSelector(state => state.interface.interface);
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  if (inter.header == false) return null;
  return (
    <div className={s['header']}>
      <div className={s['base']}>
        <div className={s['side']} onClick={() => {
          navigate('/account')
        }}>
          <div className={s['avatar']}>
            <img src={user?.photo || coin} />
          </div>
          <div className={s['info']}>
            <div className={s['title']}>{normilezeName(user.name)}</div>
            <div className={s['balance']}>
              <div className={s['coin']}>
                <img src={coinSvg} />
              </div>
              <div className={s['value']}>{normilezeBalance(user?.finance?.totalEarned || 0, ',')}</div>

            </div>
          </div>
        </div>
        <div className={s['rating']} onClick={() => {
          navigate('/rating')
        }}>
          <div className={s['gift']}>
            {/* <div className={s['gift-icon']}>
              <img src={cupSvg} />
            </div> */}
            <div className={s['gift-title']}>{user.rating.name}</div>

          </div>
          <div className={s['progress']}>
            <div className={s['progress-bar']} style={{ width: `${user.rating.percentReady}%` }}></div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default HeaderBar;
