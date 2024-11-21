import React, { useEffect, useRef, useState } from 'react'
import s from './AdsBanner.module.scss'
import { MaterialSymbolsVolumeOff, MaterialSymbolsVolumeUp } from '../../assets/icons'
import { useSelector } from 'react-redux'

export default function AdsBanner() {
  const settings = useSelector(state => state.user.user.settings)
  const [isMuted, setIsMuted] = useState(!settings.sound || false)
  console.log(settings)
  const videoRef = useRef(null)
  const switchMute = () => {
    console.log('mute', !isMuted)
    setIsMuted(!isMuted)
  }

  useEffect(() => {
    console.log('mute', isMuted)
    setIsMuted(isMuted)
    setTimeout(() => {
      console.log('play')
      videoRef.current.play()
      setTimeout(() => {
        videoRef.current && (videoRef.current.muted = true)
        console.log('ended')
        setIsMuted(true)

      }, 14000);
    }, 2500);
  }, [])

  useEffect(() => {
    videoRef.current.muted = isMuted
    console.log('muted', isMuted)
  }, [isMuted])


  return (
    <div className={s['AdsBanner']} >
      <div className={s['mute']} onClick={() => { switchMute() }}>{isMuted ? <MaterialSymbolsVolumeOff /> : <MaterialSymbolsVolumeUp />} </div>
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        // при завершении видео
        onEnded={() => {
          console.log('ended video')
          videoRef.current.muted = true
        }}
      >
        <source src="https://s3.timeweb.com/a9fc5923-c-work/adsRoyalClick/v2.mp4" type="video/mp4" />
      </video>

    </div>
  )
}
