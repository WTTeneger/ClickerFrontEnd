import React, { useEffect, useState } from 'react';
import { useInstagramStories } from './useInstagramStorie.jsx';
import s from './EndGameStory.module.scss';
import { normilezeBalance } from '../../utils/normileze.js';
import { endGameStory } from '../../assets/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialSymbolsAttachMoney, MdiAccountMultiple, MdiClockTimeSevenOutline, MdiCursorDefaultClick, MingcuteCash2Line, PhSpinnerBall, SolarCupBold, SvgSpinnersPulseRings3 } from '../../assets/icons.jsx';
import { useSetSeenEndDataMutation } from '../../store/user/user.api.js';
import { setEndGameBox } from '../../store/user/userSlice.js';

const ProgressBar = ({ progress }) => {
  return (
    <div style={{ height: '4px', backgroundColor: '#ddd', marginBottom: '2px' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#f00',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};


const StoryData = {
  click: {
    title: 'Clicks',
    desc: 'Количество кликов',
    bg: endGameStory[1],
    afterVal: '',
    extraVal: '',
    Icon: MdiCursorDefaultClick
  },
  days: {
    title: 'Days',
    desc: 'Дней в сервисе',
    bg: endGameStory[3],
    afterVal: ' days',
    extraVal: 'Дата регистрации',
    Icon: MdiClockTimeSevenOutline
  },
  friends: {
    title: 'Friends',
    desc: 'Количество друзей',
    bg: endGameStory[2],
    afterVal: '',
    extraVal: '',
    Icon: MdiAccountMultiple
  },
  rating: {
    title: 'Rating',
    desc: 'Рейтинг',
    bg: endGameStory[1],
    afterVal: '',
    extraVal: 'Хорошая позиция',
    Icon: SolarCupBold
  },
  earned: {
    title: 'Earned',
    desc: 'Всего заработанно монет',
    bg: endGameStory[4],
    afterVal: '',
    extraVal: '',
    Icon: MingcuteCash2Line
  },
  spin: {
    title: 'Spin',
    desc: 'Бонусные спины',
    bg: endGameStory[3],
    afterVal: '',
    extraVal: 'Колличество бонусных спинов за вашу активность',
    Icon: PhSpinnerBall
  },
  ttm: {
    title: 'TTM',
    desc: 'Бонусные USDT',
    bg: endGameStory[5],
    afterVal: '$',
    extraVal: 'Данные $ вы сможете использовать в проекте TTM',
    Icon: MaterialSymbolsAttachMoney
  },
}

const InstagramStories = ({ stories, setIsActive }) => {
  const { story, manager, isPlaying, progress, currentStoryIndex } = useInstagramStories([], 15);
  const [isLoadStory, setIsLoadStory] = React.useState(false);

  React.useEffect(() => {
    if (isLoadStory) return;
    setIsLoadStory(true);

    let _stories = [];

    for (let index = 0; index < stories.length; index++) {
      _stories.push(EndGameStoryObj({ ...StoryData[stories[index]?.type || 'click'], ...stories[index], manager, index, maxSlides: stories.length, setIsActive }));
    }
    // _stories.push(EndGameStoryObj({ ...stories[1], manager }));
    // _stories.push(EndGameStoryObj({ ...stories[2], manager }));
    // _stories.push(EndGameStoryObj({ ...stories[3], manager }));
    // _stories.push(EndGameStoryObj({ ...stories[4], manager }));
    // _stories.push(EndGameStoryObj({ ...stories[5], manager }));

    manager.setSories(_stories);
  }, [])


  // manager.setSories([]);
  let isFullScreen = window?.Telegram.WebApp?.isFullscreen || false;
  return (
    <div className={`${s['EndGameStory']} ${isFullScreen ? s['full-screen'] : ''}`}
    >
      {/* Пагинация (Прогресс бар для каждой сторис) */}
      {progress}

      {/* Текущая сторис */}
      <div style={{
        height: '-webkit-fill-available',
      }}>{story}</div>

      {/* Кнопки управления */}
      {/* <div>
        <button onClick={manager.prevStory}>Previous</button>
        <button onClick={manager.nextStory}>Next</button>
        {isPlaying ? (
          <button onClick={manager.pause}>Pause</button>
        ) : (
          <button onClick={manager.play}>Play</button>
        )}
      </div> */}
    </div>
  );
};


const EndGameStoryObj = ({ Icon = MdiAccountMultiple, title = 'Название', desc = 'Описание', icon, bg, value = 10000000000, afterVal, extraValue, extraVal = 'Какая то доп инфа', manager, index, maxSlides, setIsActive }) => {
  return (
    <div className={s['end-game']}>

      {bg && <img className={s['bg']} src={bg} alt={title} />}
      <div className={s['header']}>
        <div className={s['title']}>{title}</div>
        <div className={s['desc']}>{desc}</div>
      </div>

      <div className={s['result']}>
        <div className={s['ico']}>
          <div className={s['iconn']}><Icon /></div>
        </div>
        <div className={s['value']}>{normilezeBalance(value)}{afterVal && <span>{afterVal}</span>}</div>
        <div className={s['extra-value']}>{extraVal}</div>
        {extraValue && <div className={s['extra-value']}>{extraValue}</div>}
      </div>
      <div className={s['action']}>

        {index > 0 && <div className={`${s['btn']} ${s['back']}`} onClick={() => { manager.swipeRight() }}>назад</div>}
        {index < maxSlides - 1 ?
          <div className={`${s['btn']} ${s['next']}`} onClick={() => { manager.swipeLeft(); }}>Далее</div>
          :
          <div className={`${s['btn']} ${s['next']}`} onClick={() => { setIsActive(false) }}>Финиш</div>
        }


      </div>


    </div >
  )
}

const EndGameStory = ({ isActive, setIsActive }) => {
  const user = useSelector(state => state.user.user);
  const [stories, setStories] = useState([]);

  const [setSeen] = useSetSeenEndDataMutation();
  const dispatch = useDispatch();

  const closeBox = () => {
    setSeen({ access_token: user.access_token }).then(() => {
      dispatch(setEndGameBox(true))
    })
  }


  useEffect(() => {
    if (!user.endbox) return
    let str = [];
    str.push({ type: 'days', value: user.endbox.daysInService, extraValue: (user.endbox.registerData.toString().split('T')[0]) })
    str.push({ type: 'click', value: user.endbox.totalClick })
    str.push({ type: 'friends', value: user.endbox.totalReferals })
    str.push({ type: 'earned', value: user.endbox.totalEarned })
    str.push({ type: 'rating', value: user.endbox.ratingPoz + 1 || 1 })
    str.push({ type: 'spin', value: user.endbox.earnSpin })
    str.push({ type: 'ttm', value: user.endbox.earnDollar })
    setStories(str);
  }, [user.endbox])

  useEffect(() => {
  }, [user?.endbox?.isSeen])



  return (
    user?.endbox?.isSeen == false ?
      stories && stories.length > 0 ? (
        <InstagramStories stories={stories} setIsActive={closeBox} />
      ) : (
        ''
      ) :
      ''
  )
}

export { EndGameStory }


export default InstagramStories;