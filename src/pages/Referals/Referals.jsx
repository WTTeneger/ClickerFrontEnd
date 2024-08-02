import React, { useEffect } from 'react'
import s from './Referals.module.scss'
import './Referals.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useGetClaimMutation, useGetRefsMutation } from '../../store/user/user.api'
import { CibCashapp, IcTwotonePeopleAlt, MaterialSymbolsAutoTimer, MaterialSymbolsEmojiPeople, MdiTelegram } from '../../assets/icons'
import { CoinSvg } from '../../assets/img'
import { normilezeBalance, normilezeTime } from '../../utils/normileze'
import { message, Steps } from 'antd'
import { resetCurrentUser } from '../../store/user/userSlice'


function ClaimArea({ claim, setClaim }) {
  if (!claim) return null;
  const user = useSelector(state => state.user.user)
  const [canClaim, setCanClaim] = React.useState(false)
  const dispatch = useDispatch()
  let [timeToClaim, setTimeToClaim] = React.useState(claim.toClame || 0)
  let [_getClaim] = useGetClaimMutation()

  let getClaim = () => {
    setCanClaim(false)
    _getClaim({ access_token: user.access_token }).then((res) => {
      if (res.data) {
        console.log(res.data)
        dispatch(resetCurrentUser(res.data.user))
        setClaim(res.data.claim)
        setTimeToClaim(res?.data?.claim?.toClame || 0)
        canClaim(true)
      } else {
        message.error(res?.error?.data?.message || 'Ошибка')
        canClaim(true)
      }
    }).catch((err) => { })
  }

  useEffect(() => {
    if (claim) {
      let timer = null;
      if (timeToClaim <= 0 && claim.total > 0) {
        setCanClaim(true)
      } else {
        timer = setInterval(() => {
          if (timeToClaim <= 0 && claim.total > 0) {
            setCanClaim(true)
          } else {
            setCanClaim(false)
          }
          setTimeToClaim(prev => prev - 1 > 0 ? prev - 1 : 0)
        }, 1000)
      }
      return () => {
        if (timer) {
          clearInterval(timer)
        }
      }
    }
  }, [claim,])

  return (
    <div className={`${s['claimArea']} ${canClaim ? null : 'disabled'}`} onClick={() => { canClaim ? getClaim() : message.error('Profits can be collected once every 8 hours') }}>
      <div className={s['timer']}>
        {timeToClaim <= 0 ?
          <CibCashapp />
          :
          <>
            <MaterialSymbolsAutoTimer />
            <div className={s['val']}>{normilezeTime(timeToClaim)}</div>
          </>
        }
      </div>
      <div className={s['total']}>
        <div className={s['val']}>{normilezeBalance(claim.total, ',')}</div>
        <div className={s['text']}>Claim</div>

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
        <div className={s['text']}>Invite frens<br />Earn poins</div>
      </div>
      <div className={s['how_its_work']}>
        <div className={s['title']}>How it works</div>

        <Steps
          progressDot
          className={s['steps']}
          colorPrimary={'#FFF'}
          navArrowColor={'#FFF'}
          current={2}
          items={[
            {
              title: 'Share your link',
              description: 'Get an instant bonus immediately after connecting your friend.',
            },
            {
              title: 'Your friend starts playing',
              description: 'And starts making money with you.',
            },
            {
              title: '5% of your frens profit',
              description: 'Every 8 hours you get 5% of the profits of all your friends.',
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
    return `https://t.me/share/url?url=${inviteUrl}&text=Привет. Приглашаю тебя в Royal Clicker. Подключайся по ссылке и получи бонус!`
  }
  const link = `https://t.me/royal_clickBot?start=kentid_${user.telegramId}`

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
    <div className={s['invite_btn']} onClick={() => { copy() }}>Copy link</div>
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
            <div className={s['text']}>Invite frens<br />Earn poins</div>
          </div>
          <ClaimArea claim={claim} setClaim={setClaim} />
          <div className={s['text_desc']}>Earn 5% of the profits of all your referrals every 8 hours.</div>
          <FriendsList friends={friends} />
        </>
      }
      <InviteBtn />

    </div>
  )
}
