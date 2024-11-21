import React, { useEffect, useRef, useState } from 'react';
import s from './UAccount.module.scss';
import { BannerSvg, casinoSvg, celendarSvg, chipSvg, coinSvg, energySvg, exitSvg, frendSvg, telegramSvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTasksMutation, useSetGenderMutation, useSetLanguageMutation, useSetSoundMutation, useSetVibrationMutation, useSetWalletAddressMutation } from '../../store/user/user.api';
import { resetCurrentUser, setGender, setLanguage, setMusic, setVibration, updateTasks } from '../../store/user/userSlice';
import { Female, Male, MaterialSymbolsAdsClick, MaterialSymbolsVolumeOff, MaterialSymbolsVolumeUp, PhCoinVertical, PhSpinnerBall, SolarStarsMinimalisticBoldDuotone } from '../../assets/icons';
import Quests from '../../components/Quests/Quests';
import { normilezeAddress, normilezeBalance } from '../../utils/normileze';
import DailyBonus from '../../components/DailyBonus/DailyBonus';
import { Dropdown, Radio, Space, Switch } from 'antd';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { translation } from '../../utils/translater.jsx';
import i18next from 'i18next';

const _t = translation('account')

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
const LangItem = ({ lang = 'RU', checked = false, setLang = () => { } }) => {
  const [isLoaded, setIsLoad] = useState(false);
  const langUser = useSelector(state => state.user.user.settings.language);

  useEffect(() => {
    setIsLoad(false)
  }, [langUser])

  const select = async () => {
    setIsLoad(true)
    setLang(lang)
  }

  return (
    <div className={`${s['langItem']} ${checked ? s['checked'] : ''}`} onClick={() => { select(lang) }}>
      <div className={s['lang-page']}>
        <div className={s['lang']}>{lang}</div>
        {isLoaded && <div className={s['tag']}><PhSpinnerBall /></div>}
      </div>
      <div className={s['check']}>
        <input className={s['radio']} type="radio" checked={checked}></input>
        {/* <Radio defaultChecked={checked} className={s['radio']} checked={checked} /> */}
      </div>
    </div>
  )
}

const langsObj = {
  ru: 'Русский',
  en: 'English'
}

const LanguageSelector = ({ langs = ['ru', 'en'], isOpen = false, close = () => { } }) => {
  // выезжат снизу меню с множеством языков
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const [_setLanguage] = useSetLanguageMutation();
  const selectLang = (lang) => {
    // сменить язык на ru
    _setLanguage({ access_token: user.access_token, language: lang }).then((res) => {
      if (res.data) {
        dispatch(setLanguage(res.data.user.settings.language))
        setTimeout(() => {
          i18next.changeLanguage(lang || 'ru')
          close()
        }, 400)
      }
    })
  }


  const obj = useRef(null);
  return (
    <div ref={obj} className={`${s['langSelector']} ${isOpen ? s['open'] : ''}`} style={{
      bottom: isOpen ? '0%' : '-100%'
    }}>
      <div className={s['close-area']} onClick={() => {
        close()
      }}>
      </div>
      <div className={s['lang-list']}>
        {langs.map((lang) => (
          langsObj[lang] && <LangItem lang={langsObj[lang]} checked={user.settings.language == lang} isLoaded={false} setLang={() => { selectLang(lang) }} />
        ))}
      </div>
    </div >
  )
}

const UAccount = ({ }) => {
  const dispatch = useDispatch();
  const [_setGender] = useSetGenderMutation();
  const [_setSound] = useSetSoundMutation();
  const [_setVibration] = useSetVibrationMutation();
  const [setAddress] = useSetWalletAddressMutation();
  const user = useSelector(state => state.user.user);
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const setGenders = (gender) => {
    _setGender({ access_token: user.access_token, gender: gender }).then((res) => {
      if (res.data) {
        dispatch(setGender(gender));
      } else {
      }
    })
  }

  const disconnect = async () => {
    tonConnectUI.connector.disconnect()
    await setAddress({ access_token: user.access_token, address: null, type: 'disconnect' }).then((res) => {
      if (res.data) {
        if (res.data.user) {
          dispatch(resetCurrentUser(res.data.user))
        }
      } else {
      }
    })
  }

  const langEls = [
    {
      key: '1',
      label: 'a danger item',
    },
    {
      key: '2',
      label: 'a danger item',
    },
  ]
  const menuProps = {
    langEls,
    onClick: () => { },
  };


  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <div className={s['account']}>
      <LanguageSelector isOpen={isLangOpen} close={() => { setIsLangOpen(false) }} />
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
        <div className={s['title']}>{_t('stats')}</div>
        <div className={s['content']}>
          <div className={`${s['lineItem']} ${s['top']}`}>
            <div className={s['el']}>
              <img src={coinSvg} alt="chip" />
              {normilezeBalance(user?.finance?.totalEarned || 0)}
            </div>

            <div className={s['tag']}>{user?.rating?.level || 0} {_t('level')}</div>

          </div>

          {/* <SwitchItem title='Total earned' checked={false} onChange={() => { }}>
            <div className={s['elStars']}>
              <PhCoinVertical />
              <div>{normilezeBalance(user?.finance?.totalEarned || 0)}</div>
            </div>
          </SwitchItem> */}
          <SwitchItem title={_t('totalClick')} checked={false} onChange={() => { }}>
            <div className={s['elStars']}>
              <MaterialSymbolsAdsClick />
              <div>{normilezeBalance(user?.finance?.totalClick || 0)}</div>
            </div>
          </SwitchItem>
          <SwitchItem title={_t('totalSpin')} checked={false} onChange={() => { }}>
            <div className={s['elStars']}>
              <PhSpinnerBall />
              <div>{normilezeBalance(user?.finance?.spinBalance || 0)}</div>
            </div>
          </SwitchItem>


          <SwitchItem title={_t('earnStars')} checked={false} onChange={() => { }}>
            <div className={s['elStars']}>
              <SolarStarsMinimalisticBoldDuotone />
              <div>{user?.finance?.totalStar || 0}</div>
            </div>
          </SwitchItem>
        </div>
      </div>

      <div className={`${s['items']}`}>
        <div className={s['title']}>{_t('settings')}</div>
        <div className={s['content']}>
          <SwitchItem title={_t('vibration')} checked={user.settings.vibration} fill={'black'} color={'black'} onChange={() => {
            let vibration = !user.settings.vibration;
            _setVibration({ access_token: user.access_token, vibration: vibration }).then((res) => {
              if (res.data) {
                dispatch(setVibration(res.data.user.settings.vibration))
              }
            })



          }} />
          <SwitchItem title={_t('gender')}
            checkedChildren={<Male />}
            unCheckedChildren={<Female />}

            checked={user.gender == 'male'} onChange={(e) => {
              let gender = e ? 'male' : 'female'
              setGenders(gender)
              // dispatch(setGender(gender))
            }} />
          <SwitchItem title={_t('music')}
            checkedChildren={<MaterialSymbolsVolumeUp />}
            unCheckedChildren={<MaterialSymbolsVolumeOff />}

            checked={user.settings.sound} onChange={(e) => {
              let music = !user.settings.sound;
              _setSound({ access_token: user.access_token, sound: music }).then((res) => {
                if (res.data) {
                  dispatch(setMusic(res.data.user.settings.sound))
                }
              })
            }} />


          <SwitchItem title={_t('language')} checked={false} onChange={() => {
            setIsLangOpen(true)
          }}>
            <div className={s['elStars']} onClick={() => {
              setIsLangOpen(true)
            }}>
              {langsObj[user.settings.language]}
              <DownOutlined />
            </div>
          </SwitchItem>
        </div>
      </div>
      <div className={`${s['items']}`}>
        <div className={s['title']}>{_t('crypto')}</div>
        <div className={s['content']}>
          <SwitchItem title={_t('walletAddress')} checked={false} onChange={() => { }}>
            <div className={s['elStars']}>
              {/*<SolarStarsMinimalisticBoldDuotone />*/}
              <div>{normilezeAddress(user?.walletAddress) || 'not connect'}</div>
            </div>
          </SwitchItem>
          {/* {user?.walletAddress && <div className={`${s['btn']} ${user?.walletAddress ? '' : 'disabled'}`} onClick={() => { disconnect() }}>Disconnect wallet</div>} */}
        </div>
      </div>
    </div>
  )
}

export default UAccount;
