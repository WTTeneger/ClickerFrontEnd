import React, { useEffect, useRef } from 'react';
import s from './AnimObj.module.scss';
import AnimatedNumbers from "react-animated-numbers";
import { normilezeBalance } from '../../utils/normileze';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import useSound from 'use-sound';
import { dropMoneySfx } from '../../assets/sounds/index.js';
import Vibra from '../../utils/vibration';
import { useSelector } from 'react-redux';

const animTypes = [
  'waterfall',
  'toTarget',
]

const AnimElement = ({ to = { x: 0, y: 1500 }, speed = 2, children, spawnPoz = 'top' }) => {
  let el = React.useRef(null);
  let [isMint, setIsMint] = React.useState(true);
  // случайное
  let spawnPozis;
  if (spawnPoz === 'top') {
    spawnPozis = {
      x: Math.random() * window.innerWidth,
      y: 0,
    }
  }

  useEffect(() => {
    setTimeout(() => {
      // el.current.style.left = `${to.x}px`
      el.current.style.top = `${to.y}px`
    }, 50)
    setTimeout(() => {
      setIsMint(false)
    }, speed * 1000)
  }, [])



  return (
    !isMint ? null :
      <div ref={el} className={s['k_obj']} style={{
        left: `${spawnPozis.x}px`,
        top: `${spawnPozis.y}px`,
        transition: `${speed}s`,
      }}>
        {children}
      </div>

  )
}




const AnimObj = ({ targetId, targetFrom, count = 10, duration = 10, type = 'waterfall', obj, delay = 0 }) => {
  const [targetPoz, setTargetPoz] = React.useState({ x: 0, y: 0 })
  const [isFinish, setIsFinish] = React.useState(false)
  const [play, { stop }] = useSound(dropMoneySfx, { volume: 0.3 });
  const user = useSelector(state => state.user.user);
  const playMusic = useRef(play)




  const getParams = () => {
    let from = {}
    let to = {}
    let speed = 2;
    if (type === 'waterfall') {
      let x = (Math.random() * (window.innerWidth + 30)) - 30
      from = { x: `${x}px`, y: '-200px' }
      to = { x: `${x}px`, y: '120vh' }
      speed = 2
    }


    if (type === 'toTarget') {
      let _target = document.getElementById(targetId)
      let _targetPoz = _target.getBoundingClientRect()

      // y = любая часть экрана ниже половины
      let y = Math.random() * (window.innerHeight / 2) + window.innerHeight / 2
      from = { x: `${Math.random() * window.innerWidth}px`, y: `${y}px`, width: '50px', height: '50px' }

      if (targetFrom) {
        let _targetFrom = document.getElementById(targetFrom)
        let _targetFromPoz = _targetFrom.getBoundingClientRect()
        // x случайное место в пределах элемента
        let x = Math.random() * _targetFromPoz.width + _targetFromPoz.x
        let y = Math.random() * _targetFromPoz.height + _targetFromPoz.y
        from = { x: `${x}px`, y: `${y}px`, from: `${_targetFromPoz.width}px`, height: `${_targetFromPoz.height}px` }
      }

      to = {
        x: `${_targetPoz.x}px`,
        y: `${_targetPoz.y}px`,
        width: `${_targetPoz.width}px`,
        height: `${_targetPoz.height}px`
      }
      speed = 1
    }



    return { from, to, speed }
  }

  useEffect(() => {
    playMusic.current = play
  }, [play])

  useEffect(() => {
    let interval;
    let countEl = 0;
    setTimeout(() => {
      interval = setInterval(() => {
        let params = getParams()
        let el = document.createElement('div');
        el.className = s['k_obj'];
        el.style.left = params.from.x;
        el.style.top = params.from.y;
        el.style.transition = `${params.speed}s`;
        el.style.width = params.from.width || 50;
        el.style.height = params.from.height || 50;
        el.style.transition = `width 3s, height 3s, all ${params.speed}s`;
        el.innerHTML = `<img src=${obj} alt='coin' />`
        document.getElementsByClassName(s['AnimObj'])[0].appendChild(el)
        setTimeout(() => {
          if (type === 'toTarget') {
            let y = `${params.to.y}`.replace('px', '')
            let h = `${params.to.height}`.replace('px', '')
            let hw = parseFloat(y) - parseFloat(h) / 2
            el.style.left = params.to.x;
            el.style.top = `${hw}px`;
            el.style.width = params.to.width;
            el.style.height = params.to.height;
          } else {
            el.style.left = params.to.x;
            el.style.top = params.to.y;
          }
        }, 50)
        setTimeout(() => {
          countEl++;
          el.remove()

          // на каждый 3й элемент вибрация
          if (countEl % 3 === 0) {
            // случайная пауза на 100 - 300 млс
            let pause = Math.random() * 50 + 100
            setTimeout(() => {
              if (user.settings.sound) {
                playMusic.current()
              }
              if (user.settings.vibration) {
                Vibra.impact('light')
              }
            }, pause)
          }
        }, params.speed * 1000 + 200)
      }, 1000 / count)

      setTimeout(() => {
        clearInterval(interval)
        setTimeout(() => {
          setIsFinish(true)
        }, 1500);
      }, duration * 1000)
    }, delay * 1000)



    return () => clearInterval(interval)

  }, [])



  return (
    isFinish ? null :
      <div className={s['AnimObj']} />
  )




};

export default AnimObj;
