import React, { useEffect } from 'react';
import { chipSvg, coin, coinSvg, casinoSvg, taskSvg } from '../../assets/index.js'
import s from './FooterBar.module.scss';
import { useLocation, useNavigate } from 'react-router';
import { t } from 'i18next';
const _t = (msg) => {
  return t(`menubar.${msg}`)
}
const items = [
  {
    icon: `${casinoSvg}`,
    title: _t('casino'),
    page: '/casino',
    key: 'casino',
    style: {
      paddingLeft: '6px'
    }
  },
  {
    icon: `${coinSvg}`,
    title: _t('earn'),
    page: '/',
    key: 'clicker'
  },
  {
    icon: `${chipSvg}`,
    title: _t('roulette'),
    page: null,
    key: 'roulette'
  },
  {
    icon: `${taskSvg}`,
    title: _t('tasks'),
    page: '/tasks',
    key: 'tasks'
  },
  {
    icon: `${coin}`,
    title: _t('shop'),
    page: '/shop',
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
  const [bonus, setBonus] = React.useState(false);
  const [active, setActive] = React.useState('clicker');
  const navigate = useNavigate();
  const location = useLocation();
  const changeMenu = (elId) => {
    setActive(elId)
  }

  useEffect(() => {
    let item = items.map(el => el.page == location.pathname ? el : null).filter(el => el != null)[0];
    if (item) {
      setActive(item.key)
    } else {
      navigate('/')
    }
  }, [location.pathname])


  return (
    <div className={s['menu']}>
      <div className={s['base']}>
        {items.map((el, index) => {
          if (el?.key == null) return null;
          return (
            <div key={index}
              onClick={() => { changeMenu(el.key); navigate(el.page) }}
              className={`${s['item']} ${active == el.key ? s['active'] : ''} ${el.page == null ? s['disabled'] : ''}`}>
              <div className={s['icon']} style={el.style}>
                <img src={el.icon} />
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
