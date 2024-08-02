import React, { useEffect } from 'react';
import s from './Tasks.module.scss';
import { BannerSvg, casinoSvg, celendarSvg, chipSvg, coinSvg, energySvg, exitSvg, frendSvg, telegramSvg } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTasksMutation } from '../../store/user/user.api';
import { updateTasks } from '../../store/user/userSlice';
import { MaterialSymbolsCheckCircle, MaterialSymbolsCheckCircleOutline, MaterialSymbolsLightFluorescentOutlineRounded, SvgSpinnersPulseRings3 } from '../../assets/icons';
import Quests from '../../components/Quests/Quests';
import { normilezeBalance } from '../../utils/normileze';


const Banner = () => {
  const [show, setShow] = React.useState(true);
  if (!show) return null;
  return (
    <div className={s['banner']}>
      <div className={s['title']}>Выполняй задания и зарабатывай больше монет</div>
      <div className={s['image']}><img src={BannerSvg} /></div>
      <div className={s['shadow']}>
        <div className={s['circle-1']}></div>
        <div className={s['circle-2']}></div>
      </div>
      <div className={s['exit']} onClick={() => { setShow(false) }}>
        <img src={exitSvg} />
      </div>
    </div>
  )
}


const icons = {
  casino: {
    icon: casinoSvg,
    color: '#e25609'
  },
  telegram: {
    icon: telegramSvg,
    color: '#fbb62d'
  },
  friends: {
    icon: frendSvg,
    color: '#fbb62d'
  },
  spin: {
    icon: chipSvg,
    color: ''
  },
  energy: {
    icon: energySvg,
    color: '#f9a030'
  },
  celendar: {
    icon: celendarSvg,
    color: '#69cb25'
  },

}


const NotFounded = () => {
  return (<div className={s['not-founded']}>
    <div className={s['icon']}><MaterialSymbolsLightFluorescentOutlineRounded /></div>
    <div className={s['title']}>Заданий нет</div>
  </div>)
}


const DaylyTask = ({
  title = 'title', desc = 'Тестовое описание лоадера', icon = casinoSvg,
  iconClass, iconColor, now = 2, target = 10, reward = {},
  isLoaded = false, done = false }) => {
  return (
    <div className={`${s['dayly-task']} ${isLoaded ? 'skeleton' : ""} ${done ? s['done'] : ''}`} style={{
      filter: 'blur(2px)'
    }} >
      <div className={s['d-h']}>
        <div className={s['header']}>
          <div className={s['title']}>{title}</div>
          <div className={s['icon']}>
            <img src={icon} className={iconClass} />
            <div className={s['icon-shadow']} style={{
              // backgroundColor: iconColor
              boxShadow: `${iconColor} 0px 0px 40px 15px`
            }} />
          </div>
        </div>
        <div className={s['desc']}>
          {desc}
        </div>
      </div>
      <div className={s['info']}>
        <div className={s['stats']}>
          {now}/{target}
        </div>
        <div className={s['rewards']}>
          {Object.keys(reward)?.map((key, index) => {
            if (reward[key] === 0) return null;
            return (
              <div key={index} className={s['reward-item']}>
                +{normilezeBalance(reward[key])} {key === 'coin' ? <img src={coinSvg} /> : <img src={chipSvg} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const WeeklyTask = ({ task = {}, _key = 0, isLoaded = false, setAboutTask = null }) => {
  let { title = 'title', desc = 'Тестовое описание лоадера', icon = casinoSvg, iconColor, now = 2, target = 10, reward = {}, done = false, condition = '' } = task;
  typeof icon === 'string' && (icon = icons[icon]?.icon);
  if (task?.extra?.img) { icon = task.extra.img; }
  if (task?.extra?.fileUrl) { icon = task.extra.fileUrl; }

  // console.log(icon)
  return (
    <div className={`${s['weekly-task']} ${isLoaded ? 'skeleton' : ""} ${done ? s['done'] : ''}`}
      onClick={() => { setAboutTask({ ...task, key: _key, icon: icon }) }}>
      <div className={s['left-side']}>
        <div className={s['icon']}>
          <img src={icon} />
          <div className={s['shadow']} style={{
            boxShadow: `${iconColor} 3px 3px 20px 13px`
          }} />
        </div>
        <div className={s['info']}>
          <div className={s['title']}>{title}{condition == 'set_status_icon' && <img className={s['customIcon']} src={icon} />}</div>
          <div className={s['rewards']}>
            {Object.keys(reward).map((key, index) => {
              if (reward[key] === 0) return null;
              return (
                <div key={index} className={s['reward-item']}>
                  +{normilezeBalance(reward[key])} {key === 'coin' ? <img src={coinSvg} /> : <img src={chipSvg} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className={s['more']}>
        {done ? <MaterialSymbolsCheckCircle color='#00ff00' /> : <MaterialSymbolsCheckCircleOutline />}
      </div>
    </div>
  )
}




const Tasks = () => {
  const [tasks, setTasks] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [aboutTask, setAboutTask] = React.useState(null);
  const [getTasks] = useGetTasksMutation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);


  useEffect(() => {
    if (user.tasks.last_get + 180000 < Date.now()) {
      setIsLoaded(true)
      getTasks({ access_token: user.access_token }).then((res) => {
        if (res.data) {
          setTasks({ ...res.data });
          dispatch(updateTasks(res.data));
        } else {
          setTasks(null);
        }
        setIsLoaded(false)
      })
    } else {
      setTasks(user.tasks);
    }
  }, [user.access_token, user.tasks]);

  const isClose = () => {
    setAboutTask(null);
  }

  const sortedTasks = (tasks) => {
    let newTasks = []
    let newTasksNotDoned = []

    // отсортировать по done и по reward (Сначала все done=false) + 

    tasks.forEach((task, index) => {
      if (task.done) {
        newTasks.push({ ...task, key: index })
      } else {
        newTasksNotDoned.push({ ...task, key: index })
      }
    });

    newTasksNotDoned.sort((a, b) => {
      let aa = a.reward.coin || 0 + (a.reward.chip || 0 * 50000);
      let bb = b.reward.coin || 0 + (b.reward.chip || 0 * 50000);
      return bb - aa;
    })

    newTasks = newTasksNotDoned.concat(newTasks)
    return newTasks;
  }


  return (
    <div className={s['tasks']}>
      <Banner />
      {aboutTask && <Quests isClose={isClose} data={aboutTask} />}

      {isLoaded ?
        <>
          <div className={s['box']} >
            <div className={`${s['title']}`}>Ежедневные задания</div>
            <div className={s['areaRow']}>
              <DaylyTask isLoaded={isLoaded} />
              <DaylyTask isLoaded={isLoaded} />
              <DaylyTask isLoaded={isLoaded} />
            </div>
          </div>
          <div className={s['box']}>
            <div className={s['title']}>Постоянные задания</div>
            <div className={s['areaColumn']}>
              <WeeklyTask task={{}} isLoaded={isLoaded} />
              <WeeklyTask task={{}} isLoaded={isLoaded} />
            </div>
          </div>
        </>
        :
        <>
          <div className={s['box']}>
            <div className={s['title']}>Ежедневные задания</div>
            <div className={s['areaRow']}>
              {tasks?.daylyTasks?.length && tasks.daylyTasks.length > 0 ? tasks?.daylyTasks?.map((task, index) => {
                return (
                  <DaylyTask
                    key={index}
                    title={task.title}
                    desc={task.description}
                    icon={icons[task.icon].icon}
                    iconClass={s[task.icon]}
                    iconColor={icons[task.icon].color}
                    now={task.progress}
                    target={task.target}
                    reward={task.reward}
                    done={task.done}
                    setAboutTask={setAboutTask}
                  />
                )
              }) : <NotFounded />}
            </div>
          </div>
          <div className={s['box']} style={{
            marginBottom: '14vh'
          }}>
            <div className={s['title']}>Постоянные задания</div>
            <div className={s['areaColumn']}>

              {tasks?.everTasks?.length && tasks.everTasks.length > 0 ?
                sortedTasks(tasks?.everTasks).map((task, index) => {
                  return (
                    <WeeklyTask
                      task={task}
                      key={task.key}
                      _key={task.key}
                      setAboutTask={setAboutTask}
                    />
                  )
                }) : <NotFounded />}
            </div>
          </div>
        </>
      }
    </div>
  )
};

export default Tasks;
