import React, { useEffect } from 'react'
import s from './Referals.module.scss'
import { useSelector } from 'react-redux'
import { useGetClaimMutation, useGetRefsMutation } from '../../store/user/user.api'
import { IcTwotonePeopleAlt, MaterialSymbolsAutoTimer, MaterialSymbolsEmojiPeople } from '../../assets/icons'
import { CoinSvg } from '../../assets/img'
import { normilezeBalance, normilezeTime } from '../../utils/normileze'
import { message } from 'antd'


function ClaimArea({ claim }) {
  if (!claim) return null;
  const user = useSelector(state => state.user.user)
  let [timeToClaim, setTimeToClaim] = React.useState(claim.toClame || 0)
  let [_getClaim] = useGetClaimMutation()

  let getClaim = () => {
    _getClaim({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        console.log(res.data)
      } else {
        console.log(res?.error)
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
          {friends.map((friend, index) => {
            return <Friends friend={friend} />
          })}
        </div>
      </div>

    </div>
  )
}

function Locker() {
  return <div>FriendsList</div>
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
        setFriends(res.data.friends)
        setClaim(res.data.claim)
      }

    }).catch((err) => { })
  }, [])

  return (
    <div className={s['referalsBox']}>
      {friends !== null && friends?.length == 0 && <Locker />}

      <div className={s['header']}>
        <MaterialSymbolsEmojiPeople />
        <div className={s['text']}>Зови друзей<br /> и зарабатывай</div>


      </div>
      <ClaimArea claim={claim} setClaim={setClaim} />
      <div className={s['text_desc']}>Зарабатывай 5% от прибыли всех своих рефералов каждые 8 часов.</div>
      <FriendsList friends={friends} />
    </div>
  )
}
