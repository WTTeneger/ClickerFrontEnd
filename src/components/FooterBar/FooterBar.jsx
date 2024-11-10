import React, { useEffect } from 'react';
import { chipSvg, coin, coinSvg, casinoSvg, taskSvg } from '../../assets/index.js'
import s from './FooterBar.module.scss';
import { useLocation, useNavigate } from 'react-router';
import { t } from 'i18next';
import Vibra from '../../utils/vibration.js';
import { IcTwotonePeopleAlt, MaterialSymbolsShoppingCartRounded } from '../../assets/icons.jsx';
import { useSelector } from 'react-redux';



const _t = (msg) => {
  return t(`menubar.${msg}`)
}
const items = [

  {
    icon: `${coinSvg}`,
    title: _t('earn'),
    page: '/',
    key: 'clicker'
  },
  {
    icon: `${coinSvg}`,
    title: _t('ban'),
    page: '/ban',
    key: null
  },
  {
    icon: `${coinSvg}`,
    title: _t('new_bot'),
    page: '/redirect',
    key: null
  },
  {
    icon: `${coinSvg}`,
    title: _t('connect-wallet'),
    page: '/connect-wallet/:code',
    key: null
  },
  {
    icon: `${coinSvg}`,
    title: _t('account'),
    page: '/account',
    key: null
  },
  {
    // icon: `${taskSvg}`,
    ic: <IcTwotonePeopleAlt />,
    title: _t('friends'),
    page: '/friends',
    key: 'friends'
  },
  {
    icon: `${taskSvg}`,
    title: _t('tasks'),
    page: '/tasks',
    key: 'tasks'
  },

  {
    icon: `${casinoSvg}`,
    title: _t('game'),
    page: '/games',
    key: 'game',
    style: {
      paddingLeft: '6px'
    }
  },

  {
    icon: `${casinoSvg}`,
    title: _t('game'),
    page: '/game/loot_duck',
    // key: 'game_lootDuck',
    key: null,
    style: {
      paddingLeft: '6px'
    }
  },
  // {
  //   icon: `${chipSvg}`,
  //   title: _t('roulette'),
  //   page: '/casino',
  //   page: null,
  //   key: 'roulette'
  // },
  {
    ic: <MaterialSymbolsShoppingCartRounded />,
    title: _t('shop'),
    page: '/shop',
    // page: null,
    key: 'shop'
  },
  {
    icon: `${coin}`,
    title: _t('rating'),
    page: '/rating',
    key: null
  },

]

const FooterBar = ({ Click }) => {
  const inter = useSelector(state => state.interface.interface);

  const [bonus, setBonus] = React.useState(false);
  const [active, setActive] = React.useState('clicker');
  const navigate = useNavigate();
  const location = useLocation();
  const changeMenu = (elId) => {
    Vibra.impact('light');
    setActive(elId)
  }

  useEffect(() => {
    let item = items.map(el => el.page == location.pathname ? el : null).filter(el => el != null)[0];
    if (item) {
      setActive(item.key)
    } else {
      // navigate('/')  
    }
  }, [location.pathname])

  if (inter.footer == false) return null;

  return (
    
    <div className={s['menu']} id='BASE_FOOTER'>
      <div className={s['base']}>
        {items.map((el, index) => {
          if (el?.key == null) return null;
          return (
            <div key={index}
              onClick={() => { changeMenu(el.key); navigate(el.page) }}
              className={`${s['item']} ${active == el.key ? s['active'] : ''} ${el.page == null ? s['disabled'] : ''}`}>
              <div className={s['icon']} style={el.style}>
                {el.ic ? el.ic :
                  <img src={el.icon} />
                }
              </div>
              <div className={s['title']}>{el.title}</div>
              {/* {el.page == null && <div className={s['soonBox']}>SOON</div>} */}
            </div>
          )
        })}
      </div>
    </div >
  )
};

export default FooterBar;
