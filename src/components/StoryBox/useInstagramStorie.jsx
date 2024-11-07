import s from './useInstagramStories.module.scss'

import React, { useState, useEffect, useCallback, useRef } from 'react';

const Pagination = ({ swiper }) => {
  return (
    <div className={s['pagination']}>
      {[...Array(swiper.countSlides).keys()].map((index) => {
        return (
          <div className={`${s['pin']} ${swiper.currentSlide > index ? s['ready'] : ''} ${swiper.currentSlide == index ? s['active'] : ''}`}>
            {swiper.currentSlide == index ?
              <div className={s['p']}

                style={{
                  animationDuration: `${swiper.timePerSlide}s`,
                  animationPlayState: swiper.isPause ? 'paused' : 'running'
                }} /> : null}
          </div>

        )
      })}
    </div>
  )
}

// Хук для работы со сторисами
export const useInstagramStories = (_stories, speed = 15) => {
  // const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStoryIndex = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stories, setStories] = useState(_stories);
  const countSlides = useRef(0);



  const setSories = (stories) => {
    setStories(stories);
    countSlides.current = stories.length;
    currentStoryIndex.current = 0;
  }

  // Переход к следующей сторис
  const nextStory = useCallback(() => {
    if (currentStoryIndex.current < countSlides.current - 1) {
      currentStoryIndex.current += 1;
      setCurrentIndex(prev => prev + 1)
    } else {
      // setCurrentIndex(0)
      // currentStoryIndex.current = 0; // В начале после окончания
    }
  }, [currentStoryIndex, countSlides.current]);

  // Переход к предыдущей сторис
  const prevStory = useCallback(() => {
    if (currentStoryIndex.current > 0) {
      currentStoryIndex.current -= 1
      setCurrentIndex(prev => prev - 1)
    } else {
      setCurrentIndex(0)
      currentStoryIndex.current = 0 // Последняя сторис при свайпе назад
    }
  }, [currentStoryIndex, countSlides.current]);

  // Управление автоматическим переходом сторис
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        nextStory();
      }, speed * 1000); // Автоматическая смена сторис через 5 секунд
    }
    return () => clearTimeout(timer);
  }, [currentStoryIndex, currentIndex, isPlaying, nextStory]);

  // Управление свайпами (или событиями нажатия)
  const swipeLeft = () => {
    nextStory();
  };

  const swipeRight = () => {
    prevStory();
  };

  const pause = () => setIsPlaying(false);
  const play = () => setIsPlaying(true);

  return {
    story: stories[currentIndex], // Текущая сторис для рендеринга
    progress: Pagination({
      swiper: {
        countSlides: countSlides.current,
        currentSlide: currentStoryIndex.current,
        timePerSlide: speed,
        isPause: !isPlaying
      }
    }), // Прогресс сторис
    manager: {
      nextStory,
      prevStory,
      pause,
      play,
      swipeLeft,
      swipeRight,
      setSories,
      canNext: () => {
        return currentStoryIndex.current < countSlides.current - 1
      },
      canPrev: () => {
        return currentStoryIndex.current > 0
      },
      countSlides: countSlides,
      currentSlide: currentStoryIndex
    },
    isPlaying,
  };
};


export default useInstagramStories;