import React, { useEffect } from 'react';
import s from './UAccount.module.scss';
import { BannerSvg, casinoSvg, celendarSvg, chipSvg, coinSvg, energySvg, exitSvg, frendSvg, telegramSvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTasksMutation, useSetGenderMutation, useSetWalletAddressMutation } from '../../store/user/user.api';
import { resetCurrentUser, setGender, updateTasks } from '../../store/user/userSlice';
import { Female, Male, MaterialSymbolsAdsClick, PhCoinVertical, PhSpinnerBall, SolarStarsMinimalisticBoldDuotone } from '../../assets/icons';
import Quests from '../../components/Quests/Quests';
import { normilezeAddress, normilezeBalance } from '../../utils/normileze';
import DailyBonus from '../../components/DailyBonus/DailyBonus';
import { Switch } from 'antd';
import { useTonConnectUI } from '@tonconnect/ui-react';


const SwitchItem = ({ title = 'title', checkedChildren, unCheckedChildren, children, checked = false, disabled = false, onChange = () => { } }, isload = false) => {
  const _onChange = (checked) => {
    console.log(`switch to ${checked}`);
    onChange(checked);
  }
  return (
    <div className={s['lineItem']}>
      <div className={s['el']}>{title}</div>
      {children ? children :
        <div className={s['tag']}><Switch checked={checked} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} disabled={disabled} onChange={_onChange} loading={false} defaultChecked={false} /></div>
      }
    </div>
  )
}

const UAccount = ({ }) => {
  const dispatch = useDispatch();
  const [_setGender] = useSetGenderMutation();

  const [setAddress] = useSetWalletAddressMutation();
  const user = useSelector(state => state.user.user);
  console.log(user)
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const setGenders = (gender) => {
    _setGender({ access_token: user.access_token, gender: gender }).then((res) => {
      if (res.data) {
        dispatch(setGender(gender));
      } else {
        console.log('error', res.error.data.error)
      }
    })
  }

  const disconnect = async () => {
    tonConnectUI.connector.disconnect()
    await setAddress({ access_token: user.access_token, address: null, type: 'disconnect' }).then((res) => {
      if (res.data) {
        console.log(res.data)
        if (res.data.user) {
          dispatch(resetCurrentUser(res.data.user))
        }
      } else {
        console.log(res.error.data)
      }
    })
  }

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

      <div className={`${s['items']}`}>
        <div className={s['title']}>Settings</div>
        <SwitchItem title='Vibration' disabled checked={false} fill={'black'} color={'black'} onChange={() => { }} />
        <SwitchItem title='Gender'
          checkedChildren={<Male />}
          unCheckedChildren={<Female />}

          checked={user.gender == 'male'} onChange={(e) => {
            let gender = e ? 'male' : 'female'
            console.log(gender)
            setGenders(gender)
            // dispatch(setGender(gender))

          }} />
      </div>

      <div className={`${s['items']}`}>
        <div className={s['title']}>Crypto</div>
        <SwitchItem title='Wallet address' checked={false} onChange={() => { }}>
          <div className={s['elStars']}>
            {/*<SolarStarsMinimalisticBoldDuotone />*/}
            <div>{normilezeAddress(user?.walletAddress) || 'not connect'}</div>
          </div>
        </SwitchItem>
        {user?.walletAddress && <div className={`${s['btn']} ${user?.walletAddress ? '' : 'disabled'}`} onClick={() => { disconnect() }}>Disconnect wallet</div>}
      </div>

    </div>
  )
}

export default UAccount;
