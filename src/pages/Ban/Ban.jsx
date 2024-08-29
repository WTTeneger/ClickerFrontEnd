import React, { useEffect } from 'react'
import s from './Ban.module.scss'
import { useSelector } from 'react-redux'

export default function BanPage() {

  const user = useSelector(state => state.user.user)
  useEffect(() => {
    document.getElementsByClassName('layout')[0].style.display = 'none'
    return () => {
      document.getElementsByClassName('layout')[0].style.display = 'block'
    }
  }, [])
  return (
    <div className={s['banPage']}>

    </div>
  )
}
