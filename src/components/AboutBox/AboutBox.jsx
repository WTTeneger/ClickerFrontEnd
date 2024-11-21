import React from 'react'
import s from './AboutBox.module.scss'
import { chipSvg } from '../../assets'
import { slotsImg } from '../../assets/images/slots'
import { translation } from '../../utils/translater'

let t = translation('games.about-casino');

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
          <div className={s['content__title']}>{t('table')}</div>
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
          <div className={s['content__title']}>{t('wild')}</div>
          <div className={s['content__wild']}>
            <div className={s['content__wild__item']}>
              <img src={slotsImg['X']} />
            </div>
            <div className={s['content__wild__item']}>
              <div className={s['content__wild__item__title']}>
                {t('replace')}
              </div>
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
            {t('replaceMore')}
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{t('rules')}</div>
          <div className={s['content__text']}>
            {t('rulesT1')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT2')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT3')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT4')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT5')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT6')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT7')}
          </div>
          <div className={s['content__text']}>
            {t('rulesT8')}
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{t('lines')}</div>
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
          <div className={s['content__title']}>{t('chips')}</div>
          <div className={s['content__wild']}>
            <div className={s['content__wild__item']}>
              <img src={slotsImg['U']} />
            </div>
            <div className={s['content__text']}>
              {t('chipsT1')}
            </div>
          </div>
        </div>
        <div className={s['content__area']}>
          <div className={s['content__title']}>{t('attention')}</div>
          <div className={s['content__text']}>
            {t('attentionT1')}
          </div>
          <br />
          <div className={s['content__text']}>
            {t('attentionT2')}
          </div>
        </div>

        <div className={s['content__area']}>
          <div className={s['content__title']}>{t('info')}</div>
          <div className={s['content__text']}>
            {t('infoT1')}
          </div>
          <div className={s['content__text']}>
            {t('infoT2')}
          </div>
          <div className={s['content__text']}>
            {t('infoT3')}
          </div>

        </div>
      </content >


    </div >
  )
}
