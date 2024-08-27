import React, {useEffect, useState} from 'react'
import s from './InstagramLikeSlider.module.scss'
import {skins} from '../../assets/icons/skins/index.js';
import {SliderBox} from '../SliderBox/SliderBox.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {aboutLevels} from './content.js';
import {setAbout, setFooter, setHeader} from '../../store/user/interfaceSlice.js';
import {banners1_s} from "../../assets/index.js";
import {MaterialSymbolsLightCloseRounded} from "../../assets/icons.jsx";


function InstagramLikeSlider({level, title, desc, bg, img, show, swiper, time = 8}) {
    const [percent, setPercent] = useState(0);
    const ref = React.useRef(null)
    const [animIsStop, setAnimIsStop] = useState(false)
    useEffect(() => {
        if (!ref.current) return;

        // если я нажал и держу палец то ставить на паузу
        ref.current.addEventListener('touchstart', () => {
            swiper.pause(true)
            setAnimIsStop(true)
        }, {passive: true})

        //
        ref.current.addEventListener('touchend', () => {
            swiper.pause(false)
            setAnimIsStop(false)

        }, {passive: true})

    }, [ref]);

    return (
        <div
            ref={ref}
            className={`${s['SliderAboutLevels']} ${show ? s['show'] : ''}`} style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className={s['footer']}>
                {swiper.allowSlidePrev ? <div className={s['back']} onClick={() => {
                    swiper.prev()
                }}>Назад</div> : <div/>}

                {swiper.allowSlideNext ?
                    <div className={s['next']} onClick={() => {
                        swiper.next()
                    }}>Далее</div> :
                    <div className={s['next']} onClick={() => {
                        swiper.close()
                    }}>Закрыть</div>}

            </div>

        </div>
    )
}

const InstagramLikeAboutSlider = ({
                                      onClose = () => {
                                      }
                                  }) => {
    const user = useSelector(state => state.user.user)
    const [currentLevel, setCurrentLevel] = React.useState(0)
    const [timeReady, setTimeReady] = React.useState(0)
    const [isClose, setIsClose] = React.useState(false)
    const [isPause, setIsPause] = React.useState(false)
    const times = React.useRef();
    const dispatch = useDispatch()
    const swiper = {
        timePerSlide: 7,
        countSlides: aboutLevels.length,
        currentSlide: currentLevel,
        allowSlideNext: currentLevel < aboutLevels.length - 1,
        allowSlidePrev: currentLevel > 0,
        next: () => {
            setCurrentLevel(prev => prev + 1)
            setTimeReady(0)
        },
        prev: () => {
            setCurrentLevel(prev => prev - 1)
            setTimeReady(0)
        },
        close: () => {
            setIsClose(true)
            dispatch(setAbout(false))
            console.log('Close About')
            dispatch(setHeader(true))
            onClose()
        },
        isPause: isPause,
        pause: (type) => {
            if (type == true) {
                // поставить интервал на паузу
                clearInterval(times.current)
            } else {
                // возобновить интервал
                createInterval()
            }
            setIsPause(type)
        }
    }

    useEffect(() => {
        dispatch(setHeader(false))
        return () => {
            dispatch(setHeader(true))
        }
    }, [])

    const createInterval = () => {
        times.current = setInterval(() => {
            setTimeReady(prev => {
                if (prev + 300 >= swiper.timePerSlide * 1000) {
                    swiper.next()
                    clearInterval(times.current)
                } else {
                    return prev + 300
                }
            })

        }, 300)
        return times.current;
    }

    useEffect(() => {
        setTimeReady(0)
        clearInterval(times?.current)
        createInterval()
    }, [currentLevel]);

    return (
        isClose ? null :
            <SliderBox>
                <div className={s['pagination']}>
                    {[...Array(swiper.countSlides).keys()].map((index) => {
                        return (
                            <div className={`${s['pin']} ${swiper.currentSlide > index ? s['ready'] : ''} ${swiper.currentSlide == index ? s['active'] : ''}`}>
                                {swiper.currentSlide == index ?
                                    <div className={s['p']}

                                         style={{
                                             animationDuration: `${swiper.timePerSlide}s`,
                                             animationPlayState: swiper.isPause ? 'paused' : 'running'
                                         }}/> : null}
                            </div>

                        )
                    })}
                </div>

                <div className={s['exitBTN']} onClick={() => swiper.close()}>
                    <MaterialSymbolsLightCloseRounded/>
                </div>
                {aboutLevels.map((item, index) => {
                    item = {
                        bg: item.bg
                    }
                    return <InstagramLikeSlider key={index} {...item} show={index == swiper.currentSlide}
                                                swiper={swiper}/>
                })}
            </SliderBox>
    )
}

export {InstagramLikeAboutSlider}