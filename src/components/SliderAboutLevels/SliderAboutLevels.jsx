import React, { useEffect } from 'react'
import s from './SliderAboutLevels.module.scss'
import { skins } from '../../assets/icons/skins/index.js';
import { SliderBox } from '../SliderBox/SliderBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { aboutLevels } from './content.js';
import { setAbout, setFooter, setHeader } from '../../store/user/interfaceSlice.js';




function SliderAboutLevels({ level, title, desc, bg, img, show, swiper }) {
  return (
    <div className={`${s['SliderAboutLevels']} ${show ? s['show'] : ''}`} style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className={s['header']}>
        <div className={s['title']}>{level} Уровень</div>
        <div className={s['exit']} onClick={() => { swiper.close() }}>Пропустить</div>
        <div className={s['pin']} />
      </div>

      <div className={s['content']}>
        {/* корректно вывести <br/> */}

        <div className={s['title']}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div className={s['desc']}
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </div>
      <div className={s['img']} style={{
        // backgroundImage: `url(${bg})`,
        // backgroundSize: 'contain',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // градиент чтобы к верху пропадало плавно
      }}>
        <img src={img} alt="" />
      </div>
      <div className={s['footer']}>

        {swiper.allowSlidePrev ? <div className={s['back']} onClick={() => { swiper.prev() }}>Назад</div> : <div />}
        <div className={s['pagination']}>
          {[...Array(swiper.countSlides).keys()].map((index) => {
            return (<div className={`${s['pin']} ${swiper.currentSlide == index ? s['active'] : ''}`} />)
          })}
        </div>


        {swiper.allowSlideNext ?
          <div className={s['next']} onClick={() => { swiper.next() }}>Далее</div> :
          <div className={s['next']} onClick={() => { swiper.close() }}>Закрыть</div>}

      </div>

    </div>
  )
}

const AboutLevels = ({ onClose = () => { } }) => {
  const user = useSelector(state => state.user.user)
  const [currecntLevel, setCurrentLevel] = React.useState(0)
  const [isClose, setIsClose] = React.useState(false)
  const dispatch = useDispatch()
  const swiper = {
    countSlides: aboutLevels.length,
    currentSlide: currecntLevel,
    allowSlideNext: currecntLevel < aboutLevels.length - 1,
    allowSlidePrev: currecntLevel > 0,
    next: () => setCurrentLevel(currecntLevel + 1),
    prev: () => setCurrentLevel(currecntLevel - 1),
    close: () => {
      setIsClose(true)
      dispatch(setAbout(false))
    },
  }

  useEffect(() => {
    console.log('Open About')
    dispatch(setHeader(false))
    return () => {
      console.log('Close About')
      dispatch(setHeader(true))
    }
  },[])

  return (
    isClose ? null :
      <SliderBox>
        {aboutLevels.map((item, index) => {
          item = {
            ...item,
            img: skins[user.gender][item.type] ? skins[user.gender][item.type] : skins['male'][type],
            bg: skins['background'][item.type] ? skins['background'][item.type] : skins['background']['default']
          }
          return <SliderAboutLevels key={index} {...item} show={index == swiper.currentSlide} swiper={swiper} />
        })}
      </SliderBox>
  )
}

export { AboutLevels }