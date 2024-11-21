import React from 'react'
import s from './AboutBox.module.scss'
import { chipSvg } from '../../assets'
import { slotsImg } from '../../assets/images/slots'


const TableEl = ({ img, values = [{ value: 3, multiplier: 0.5 }, { value: 4, multiplier: 1 }, { value: 5, multiplier: 4 }] }) => {
  return (
    <div className={s['content__table__item']}>
      <img src={img} />
      <div className={s['content__table__item__values']}>
        {values.map(({ value, multiplier }) => (
          <div><span>{value}</span> - {multiplier}x</div>
        ))}
      </div>
    </div>
  )
}

const LineCombination = ({ matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }) => {

  return (
    <div className={s['content__matrix']}>
      {matrix.map((row, index) => (
        <div key={index} className={`${s['content__matrix__item']} ${row == 1 ? s['active'] : ''}`} />
      ))}
    </div>
  )
}


export default function AboutBoxRoll({ close = () => { } }) {
  let isFullScreen = window?.Telegram.WebApp?.isFullscreen || false;



  return (
    <div className={`${s['AboutBox']} ${isFullScreen ? s['full-screen-body'] : ''}`}>
      <header>
        <div className={s['title']}>{"Royal clicker"}</div>
        <div className={s['close']} onClick={() => { close(false) }}>
          X
        </div>
      </header>
      <content>
        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Таблица выплат"}</div>
          <div className={s['content__table']}>
            <TableEl img={slotsImg['A']} values={[{ value: 3, multiplier: 0.5 }, { value: 4, multiplier: 2 }, { value: 5, multiplier: 4 }]} />
            <TableEl img={slotsImg['B']} values={[{ value: 3, multiplier: 0.5 }, { value: 4, multiplier: 2 }, { value: 5, multiplier: 4 }]} />
            <TableEl img={slotsImg['C']} values={[{ value: 3, multiplier: 0.5 }, { value: 4, multiplier: 2 }, { value: 5, multiplier: 4 }]} />
            <TableEl img={slotsImg['D']} values={[{ value: 3, multiplier: 0.5 }, { value: 4, multiplier: 4 }, { value: 5, multiplier: 15 }]} />
            <TableEl img={slotsImg['E']} values={[{ value: 3, multiplier: 0.5 }, { value: 4, multiplier: 4 }, { value: 5, multiplier: 15 }]} />
            <TableEl img={slotsImg['F']} values={[{ value: 2, multiplier: 0.5 }, { value: 3, multiplier: 3 }, { value: 4, multiplier: 10 }, { value: 5, multiplier: 17 }]} />
            <TableEl img={slotsImg['G']} values={[{ value: 2, multiplier: 0.5 }, { value: 3, multiplier: 3 }, { value: 4, multiplier: 10 }, { value: 5, multiplier: 17 }]} />
            <TableEl img={slotsImg['H']} values={[{ value: 2, multiplier: 0.5 }, { value: 3, multiplier: 4 }, { value: 4, multiplier: 40 }, { value: 5, multiplier: 200 }]} />
            <TableEl img={slotsImg['X']} values={[{ value: 3, multiplier: 20 }, { value: 4, multiplier: 200 }, { value: 5, multiplier: 2000 }]} />
            <TableEl img={slotsImg['U']} values={[{ value: 2, multiplier: 1.5 }, { value: 3, multiplier: 3 }, { value: 4, multiplier: 8 }, { value: 5, multiplier: 15 }]} />
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Wild"}</div>
          <div className={s['content__wild']}>
            <div className={s['content__wild__item']}>
              <img src={slotsImg['X']} />
            </div>
            <div className={s['content__wild__item']}>
              <div className={s['content__wild__item__title']}>Заменяет символы:</div>
              <div className={s['content__wild__item__symbols']}>
                <img src={slotsImg['A']} />
                <img src={slotsImg['B']} />
                <img src={slotsImg['C']} />
                <img src={slotsImg['D']} />
                <img src={slotsImg['E']} />
                <img src={slotsImg['F']} />
                <img src={slotsImg['G']} />
                <img src={slotsImg['H']} />
              </div>
            </div>
          </div>
          <div className={s['content__text']}>
            {"Wild может заменить любой символ, кроме символа Mellstory, чтобы сформировать выигрышную комбинацию."}
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Правила"}</div>
          <div className={s['content__text']}>
            {"Royal clicker slots - это слот с 5 барабанами и 3 рядами и 15 линиями выплат."}
          </div>
          <div className={s['content__text']}>
            {"Все призы - это комбинации одинаковых символов."}
          </div>
          <div className={s['content__text']}>
            {"Символы, кроме символа mellstroy, должны находиться на активированных линиях выплат и на соседних барабанах, начиная с крайнего левого барабана."}
          </div>
          <div className={s['content__text']}>
            {"Символы Mellstroy засчитываются в любом месте на барабанах."}
          </div>
          <div className={s['content__text']}>
            {"За число символов Mellstroy и комбинациях на каждой активированной линии выплачивается только самый высокий выйигрыш."}
          </div>
          <div className={s['content__text']}>
            {"Выигрыши за символы Mellstroy и комбинации на разных линиях складываются."}
          </div>
          <div className={s['content__text']}>
            {"Все призы в таблице выплат указаны в отображаются для выбранных в настоящий момент ставки и числа линий выйплат."}
          </div>
          <div className={s['content__text']}>
            {"Все призы в в табилце выплат отображаются в деньгах или в кредитах в зависимости от выбранного в настоящий момент режима игры."}
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Линии выплат"}</div>
          <div className={s['content__tables']} >

            <LineCombination matrix={[1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} />
            <LineCombination matrix={[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]} />
            <LineCombination matrix={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]} />
            <LineCombination matrix={[1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1]} />
            <LineCombination matrix={[0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0]} />
            <LineCombination matrix={[1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1]} />
            <LineCombination matrix={[0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]} />
            <LineCombination matrix={[0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]} />
            <LineCombination matrix={[0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0]} />
            <LineCombination matrix={[1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0]} />
            <LineCombination matrix={[0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1]} />
            <LineCombination matrix={[1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0]} />
            <LineCombination matrix={[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1]} />
            <LineCombination matrix={[1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]} />
            <LineCombination matrix={[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]} />
          </div>
        </div >

        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Фишки"}</div>
          <div className={s['content__wild']}>
            <div className={s['content__wild__item']}>
              <img src={slotsImg['U']} />
            </div>
            <div className={s['content__text']}>
              {"2 и более символов Mellstory на всем барабане дает пользвателю от 1 до 15 фишек"}
            </div>
          </div>
        </div>
        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Внимание!"}</div>
          <div className={s['content__text']}>
            {"Все незавершенные игры? неполученные выйгрыши, неиспользованные накопленные бонусы сохраняются в течение 7 дней, после чего удаляются. Сохранение результаты мобыть быть удалены досрочно, в случае планогового обслуживания системы и обслюживания сервера. Перед выходом из игры убедитесь что забрли все выигрыши и призы"}
          </div>
          <br />
          <div className={s['content__text']}>
            {"В случае каких-либо расхождений или несоответствий между английский версией и ее переводами на другие языки, английская версия имеет преимущество."}
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{"Информация по юрисдиксции!"}</div>
          <div className={s['content__text']}>
            {'КОЭФФИЦИЕНТЫ ВОЗВРАТА ИГРОКУ (RTP): 96.03 %'}
          </div>
          <div className={s['content__text']}>
            {'МИНИМАЛЬНАЯ ОБЩАЯ СТАВКА: 1000 (Монет)'}
          </div>
          <div className={s['content__text']}>
            {'МАКСИМАЛЬНАЯ ОБЩАЯ СТАВКА: 1 000 000 (Монет)'}
          </div>

        </div>
      </content >


    </div >
  )
}
