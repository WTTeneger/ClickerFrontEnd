import React, { useEffect } from 'react'
import s from './NewBot.module.scss'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getSkin } from '../../assets/icons/skins'
export default function NewBot() {
  const supportLink = 'https://t.me/Ducks_tap_bot'
  const user = useSelector(state => state.user.user)
  let skinData = getSkin(user?.skin, user.gender)
  useEffect(() => {
    document.getElementsByClassName('layout')[0].style.display = 'none'
    return () => {
      document.getElementsByClassName('layout')[0].style.display = 'block'
    }
  }, [])
  return (
    <div className={s['banPage']} onClick={() => {
      window.Telegram.WebApp.openLink(supportLink)
      window.location.href = supportLink
    }}
      style={{
        backgroundImage: `url(${skinData.background})`,
      }}

    >
      <div className={s['header']}>We've Moved!</div>
      <div className={s['title']}>It looks like the clicker has been relocated to a new bot. But don’t worry—your progress is safe and sound! Just head over to the new bot to continue where you left off.</div>
      <div className={s['btn']}>New bot</div>


    </div>
  )
}
