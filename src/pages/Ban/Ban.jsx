import React, { useEffect } from 'react'
import s from './Ban.module.scss'
import { useSelector } from 'react-redux'

export default function BanPage() {
  const supportLink = 'https://t.me/amal_agishev'
  const user = useSelector(state => state.user.user)
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
    }}>
      <div className={s['header']}>{user?.error?.error || "Error"}</div>
      <div className={s['title']}>Reason: {user?.error?.reason || 'unknown'} </div>
      <div className={s['btn']}>Suport</div>


    </div>
  )
}
