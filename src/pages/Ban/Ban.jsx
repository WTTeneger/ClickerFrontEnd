import React, { useEffect } from 'react'
import s from './Ban.module.scss'
import { useSelector } from 'react-redux'
import AnimObj from '../../components/AnimObj/AnimObj'
import { coinSvg } from '../../assets'

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
      Your banned
      <div onClick={() => { spawnAnim() }} style={{ backgroundColor: 'gray', padding: '10px' }}>Spawn</div>
    </div>
  )
}
