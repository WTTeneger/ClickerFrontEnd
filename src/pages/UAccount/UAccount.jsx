import React, { useEffect } from 'react';
import s from './UAccount.module.scss';
import { BannerSvg, casinoSvg, celendarSvg, chipSvg, coinSvg, energySvg, exitSvg, frendSvg, telegramSvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTasksMutation } from '../../store/user/user.api';
import { updateTasks } from '../../store/user/userSlice';
import { MaterialSymbolsAdsClick, PhCoinVertical, PhSpinnerBall, SolarStarsMinimalisticBoldDuotone } from '../../assets/icons';
import Quests from '../../components/Quests/Quests';
import { normilezeBalance } from '../../utils/normileze';
import DailyBonus from '../../components/DailyBonus/DailyBonus';
import { Switch } from 'antd';


const SwitchItem = ({ title = 'title', children, checked = false, onChange = () => { } }, isload = false) => {
  const _onChange = (checked) => {
    console.log(`switch to ${checked}`);
    onChange(checked);
  }
  return (
    <div className={s['lineItem']}>
      <div className={s['el']}>{title}</div>
      {children ? children :
        <div className={s['tag']}><Switch onChange={_onChange} loading={false} defaultChecked={false} /></div>
      }
    </div>
  )
}

const UAccount = ({ }) => {

  const user = useSelector(state => state.user.user);
  console.log(user)
  return (
    <div className={s['account']}>
      <div className={s['header']}>
        {/* <div className={s['el']}>
          <SolarStarsMinimalisticBoldDuotone />
          <div>{user?.finance?.totalStar || 0}</div>
        </div> */}
      </div>
      {/* El */}
      <div className={s['items']} style={{
        marginTop: '0px'
      }}>
        <div className={s['title']}>Stats</div>
        <SwitchItem title='Total earned' checked={false} onChange={() => { }}>
          <div className={s['elStars']}>
            <PhCoinVertical />
            <div>{normilezeBalance(user?.finance?.totalEarned || 0)}</div>
          </div>
        </SwitchItem>
        <SwitchItem title='Total click' checked={false} onChange={() => { }}>
          <div className={s['elStars']}>
            <MaterialSymbolsAdsClick />
            <div>{normilezeBalance(user?.finance?.totalClick || 0)}</div>
          </div>
        </SwitchItem>
        <SwitchItem title='Total spin' checked={false} onChange={() => { }}>
          <div className={s['elStars']}>
            <PhSpinnerBall />
            <div>{normilezeBalance(user?.finance?.spinBalance || 0)}</div>
          </div>
        </SwitchItem>


        <SwitchItem title='Earn stars' checked={false} onChange={() => { }}>
          <div className={s['elStars']}>
            <SolarStarsMinimalisticBoldDuotone />
            <div>{user?.finance?.totalStar || 0}</div>
          </div>
        </SwitchItem>
      </div>
      
      <div className={`${s['items']} disabled`}>
        <div className={s['title']}>Settings</div>
        <SwitchItem title='Vibration' checked={false} onChange={() => { }} />
      </div>
    </div>
  )
}

export default UAccount;
