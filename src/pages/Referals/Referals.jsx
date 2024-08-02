import React, { useEffect } from 'react'
import s from './Referals.module.scss'
import './Referals.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useGetClaimMutation, useGetRefsMutation } from '../../store/user/user.api'
import { IcTwotonePeopleAlt, MaterialSymbolsAutoTimer, MaterialSymbolsEmojiPeople, MdiTelegram } from '../../assets/icons'
import { CoinSvg } from '../../assets/img'
import { normilezeBalance, normilezeTime } from '../../utils/normileze'
import { message, Steps } from 'antd'


function ClaimArea({ claim }) {
  if (!claim) return null;
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  let [timeToClaim, setTimeToClaim] = React.useState(claim.toClame || 0)
  let [_getClaim] = useGetClaimMutation()

  let getClaim = () => {
    _getClaim({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        console.log(res.data)
        // dispatch(update)
      } else {
        message.error(res?.error?.data?.message || 'Ошибка')
      }
    }).catch((err) => { })
  }

  useEffect(() => {
    if (claim) {
      let timer = setInterval(() => {
        setTimeToClaim(prev => prev - 1 > 0 ? prev - 1 : 0)
      }, 1000)
      return () => {
        clearInterval(timer)
      }
    }
  }, [claim,])

  return (
    <div className={s['claimArea']} onClick={() => { getClaim() }}>
      <div className={s['timer']}>
        <MaterialSymbolsAutoTimer />
        <div className={s['val']}>{normilezeTime(timeToClaim)}</div>
      </div>
      <div className={s['total']}>
        <div className={s['val']}>{normilezeBalance(claim.total, ',')}</div>
        <div className={s['text']}>клейм</div>

      </div>
    </div>
  )
}

function Friends({ friend }) {
  return (
    <div className={s['friendBox']}>
      <div className={s['side']}>
        <div className={s['img']}>
          <div className={s['s']}>{friend.name[0]}</div>

        </div>
        <div className={s['infobar']}>
          <div className={s['name']}>{friend.name}</div>
          <div className={s['total_user']}><IcTwotonePeopleAlt /> {friend.totalReferals}</div>
        </div>

      </div>
      <div className={s['rside']}>
        {normilezeBalance(friend.finance.totalEarned)} <CoinSvg />
      </div>

    </div>
  )
}

function FriendsList({ friends = [] }) {
  if (!friends) return null;
  return (
    <div className={s['friendsList']}>
      <div className={s['header']}>{friends?.length} friends</div>
      <div className={s['content']}>
        <div className={s['list']}>
          {friends.map((friend, index) => {
            return <Friends friend={friend} />
          })}
        </div>
      </div>

    </div>
  )
}

function Locker() {
  return (
    <>
      <div className={s['header']}>
        <MaterialSymbolsEmojiPeople />
        <div className={s['text']}>Зови друзей<br /> и зарабатывай</div>
      </div>
      <div className={s['how_its_work']}>
        <div className={s['title']}>Как это работает</div>

        <Steps
          progressDot
          className={s['steps']}
          colorPrimary={'#FFF'}
          navArrowColor={'#FFF'}
          current={2}
          items={[
            {
              title: 'Делитесь своей ссылкой',
              description: 'Получай моментальный бонус сразу после подключения вашего друга.',
            },
            {
              title: 'Ваш друг начинает играть',
              description: 'И начинает зарабатывать деньги вместе с вами.',
            },
            {
              title: '5% от прибыли вашего друга',
              description: 'Каждые 8 часов вы получаете 5% от прибыли всех ваших друзей.',
            },
          ]}
        />
      </div>
    </>
  )
}

function InviteBtn() {
  const user = useSelector(state => state.user.user)
  const makeInviteFriendsMsg = (inviteUrl) => {
    return `https://t.me/share/url?url=${inviteUrl}&text=Привет. Приглашаю тебя в MellstroyClick от команды $Mellstroy. Подключайся по ссылке и получи бонус! \n\n${inviteUrl}`
  }
  const link = `https://t.me/mellstroy_clicker_bot?start=kentid_${user.telegramId}`

  const copy = () => {
    // navigator.clipboard.writeText не работает
    const input = document.createElement('input');
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    message.success('Ссылка скопирована')
  }

  return <div className={s['invite_btn_base']}>
    <div className={s['invite_btn']} onClick={() => { copy() }}>Скопировать ссылку</div>
    <div className={`${s['invite_btn']} ${s['share']}`} onClick={() => { window.open(makeInviteFriendsMsg(link)) }}><MdiTelegram /></div>
  </div>
}

export default function Referals() {
  const user = useSelector(state => state.user.user)
  const [getRefs] = useGetRefsMutation()

  const [friends, setFriends] = React.useState(null)
  const [claim, setClaim] = React.useState(null)



  useEffect(() => {
    console.log('sss')
    getRefs({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        // setFriends([])
        setFriends(res.data.friends)
        setClaim(res.data.claim)
      }

    }).catch((err) => { })
  }, [])

  return (
    <div className={s['referalsBox']}>
      {friends?.length == 0 ? <Locker /> :
        <>
          <div className={s['header']}>
            <MaterialSymbolsEmojiPeople />
            <div className={s['text']}>Зови друзей<br /> и зарабатывай</div>
          </div>
          <ClaimArea claim={claim} setClaim={setClaim} />
          <div className={s['text_desc']}>Зарабатывай 5% от прибыли всех своих рефералов каждые 8 часов.</div>
          <FriendsList friends={friends} />
        </>
      }
      <InviteBtn />

    </div>
  )
}
