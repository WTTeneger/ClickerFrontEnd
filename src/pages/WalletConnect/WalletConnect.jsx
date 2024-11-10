import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAccount, useDisconnect, useSignMessage, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useWalletInfo } from '@web3modal/wagmi/react'
import abi from "./abi.json"
import abi_usdt from "./usdt_abi.json"
import { useGetClickerMutation, useGetRefersMutation, useSetBuyMutation, useSetWalletAddressMutation } from '../../store/user/user.api';
import { message } from 'antd';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { resetCurrentUser } from '../../store/user/userSlice';
import s from './WalletConnect.module.scss'
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import { Spinner } from '../../assets/icons';
import { setFooter } from '../../store/user/interfaceSlice';


const stageText = {
  'ru': {
    1: {
      title: "Подключение кошелька",
      desc: "Для подключения кошелька нажмите кнопку ниже и выберите любой удобный для вас кошелек"
    },
    2: {
      title: "Оплатите вход в игру",
      desc: "Для этого нажмите кнопку оплатить вход и подтвердите транзакцию в вашем кошельке"
    },
    3: {
      title: "Разрешите смарт-контракту списать 11$ с вашего кошелька",
      desc: "Для этого нажмите кнопку разрешить использовать баланс и соблюдайте инструкции в вашем кошельке"
    },
    5: {
      title: "Оплата прошла успешно",
      desc: "Вы успешно оплатили игру, возвращайтесь в бота"
    },
    6: {
      title: "Ошибка верификации",
      desc: "Воспользуйтесь кнопкой в боте для повторной попытки"
    },

    alert: {
      walletConnected: 'Кошелек подключен',
      approveWithdraw: 'Ошибка оплаты, подтвердите списание средств смарт- контрактом',
      approveWithdrawError: 'Ошибка получения разрешения на списание средств',
      approveWithdrawTake: 'Разрешение на списание средств получено',
      buySuccess: 'Покупка прошла успешно',
      awaitApprove: 'Ожидаем подтверждения...',
      buyEnter: 'Оплатить вход',
      approve: 'Разрешить списание',
      awaitPay: 'Ожидаем подтверждения оплаты... Не уходите со страницы',
      done: 'Операция завершена, возвращайтесь в бот',
      backToBot: 'Вернуться в бота'

    }

  },
  'en': {
    1: {
      "title": "Connect Your Wallet",
      "desc": "To connect your wallet, click the button below and choose any wallet that is convenient for you."
    },
    2: {
      "title": "Pay for Entry",
      "desc": "To do this, click the 'Pay for Entry' button and confirm the transaction in your wallet."
    },
    3: {
      "title": "Authorize the Smart Contract to Deduct $11 from Your Wallet",
      "desc": "To do this, click the 'Authorize Balance Use' button and follow the instructions in your wallet."
    },
    5: {
      "title": "Payment Successful",
      "desc": "You have successfully paid for the game, return to the bot."
    },
    6: {
      "title": "Verification Error",
      "desc": "Use the button in the bot to try again."
    },

    "alert": {
      "walletConnected": "Wallet Connected",
      "approveWithdraw": "Payment Error, Please Confirm the Funds Deduction by the Smart Contract",
      "approveWithdrawError": "Error in Obtaining Authorization for Funds Deduction",
      "approveWithdrawTake": "Authorization for Funds Deduction Obtained",
      "buySuccess": "Purchase Successful",
      "awaitApprove": "Awaiting Confirmation...",
      "buyEnter": "Pay for Entry",
      "approve": "Authorize Deduction",
      "awaitPay": "Awaiting Payment Confirmation... Please Do Not Leave the Page",
      "done": "Operation Completed, Return to the Bot",
      "backToBot": "Return to Bot"
    }
  }
}


const LangSwiper = ({ langs = ['en', 'ru'], lang, setLang = () => { } }) => {
  return (
    <div className={s['lang-swiper']}>
      {langs.map((_lang, i) => (
        <div className={_lang == lang ? s['active'] : null} key={i} onClick={() => setLang(_lang)}>{_lang}</div>
      ))}
    </div>
  )
}


export default function WalletConnect() {
  let { code } = useParams()
  const [getRefs] = useGetRefersMutation();
  const [setBuy] = useSetBuyMutation();
  const [setWallet] = useSetWalletAddressMutation();
  const dispatch = useDispatch();
  const [stage, setStage] = useState(1);
  const [referals, setReferals] = React.useState([])
  const [refsId, setRefsId] = React.useState(null)
  // получить код из url?auth='asdads' auth
  const { address } = useAccount();
  const [canBuy, setCanBuy] = useState(true);
  const [getClicker] = useGetClickerMutation();
  const { disconnect } = useDisconnect()
  const { walletInfo } = useWalletInfo()
  const [alreadyApproved, setAlreadyApproved] = useState(true)
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [lang, setLang] = React.useState('en');
  const navigate = useNavigate()


  const _t = (folder = null, key) => {
    if (!folder) {
      let res = stageText[lang || 'ru'][key]
      if (!res) return key;
      return res
    } else {
      let res = stageText[lang || 'ru'][folder][key]
      if (!res) return key;
      return res
    }
  }


  useEffect(() => {


    if (window.Telegram.WebApp) {
      window.Telegram?.WebApp.BackButton.show()
      window.Telegram?.WebApp.onEvent('backButtonClicked', () => {
        navigate('/game/loot_duck')
      })
    }

    


    getClicker({ access_token: code }).then((res) => {
      if (res.data) {
        dispatch(resetCurrentUser(res.data.clicker));
        setIsLoaded(false)
      } else {
        setIsLoaded(false)
        setStage(6)
        setCanBuy(false)
      }
    })
    getRefs({ access_token: code }).then(res => {
      if (res.data) {
        setReferals(res.data.wallets)
        setRefsId(res.data.id)
        let canB = res?.data?.isBuy
        setCanBuy(!canB)
        if (canB) {
          setStage(5)
        }
      } else {
        // message.error('Ошибка получения данных')
      }
    })

    return () => {
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.BackButton.hide()
        window.Telegram?.WebApp.offEvent('backButtonClicked', () => {
          navigate('/game/loot_duck')
        })
      }
    }

  }, [code])


  useEffect(() => {
    if (address) {
      if (canBuy) {
        setStage(2)
      } else {
        setStage(5)
      }
      message.success(_t('alert', 'walletConnected'))
      setWallet({ access_token: code, address, type: 'connect' }).then(res => {
        if (res.data) {
        } else {
          // message.error('Ошибка получения данных')
        }
      })
    }
  }, [address])

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()


  const {
    data: hashApproved,
    error: errorApproved,
    isPending: isPendingApproved,
    writeContract: approveAsync
  } = useWriteContract()

  useEffect(() => {
    console.log('actuall stage', stage)
  }, [stage])

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const buy = async () => {
    writeContract({
      address: '0x82DcCBA658bDb07D39c971C0ffB26BD9fceC380A',
      abi,
      functionName: 'distribute',
      args: [
        referals,
        ethers.parseUnits('11', 18),
      ],
    })
  }

  const approve = async () => {
    approveAsync({
      address: '0x55d398326f99059ff775485246999027b3197955',
      abi: abi_usdt,
      functionName: 'approve',
      args: [
        '0x82DcCBA658bDb07D39c971C0ffB26BD9fceC380A',
        ethers.parseUnits('11', 18),
      ]
    })
  }

  useEffect(() => {
    if (!error) return;
    if (error.name == 'ContractFunctionExecutionError') {
      setAlreadyApproved(false)
      message.error(_t('alert', 'approveWithdraw'))
      setStage(3)
    }
  }, [error])

  useEffect(() => {
    if (errorApproved) {
      message.error(_t('alert', 'approveWithdrawError'))
    }
    if (hashApproved) {
      setAlreadyApproved(true)
      message.success(_t('alert', 'approveWithdrawTake'))
      setStage(2)
    }

  }, [hashApproved, errorApproved, isPendingApproved])

  useEffect(() => {
    if (isConfirmed) {
      message.success(_t('alert', 'buySuccess'))
      setCanBuy(false)
      setStage(5)
    }
    if (isPendingApproved) {
      console.log(hashApproved, errorApproved, isPendingApproved, approveAsync)
    }
  }, [isConfirmed, isPendingApproved])

  const { signMessage } = useSignMessage();



  useEffect(() => {
    disconnect()
    // отключить кошелек
    try {
      document.getElementsByClassName('layout')[0].style.display = 'none'
    } catch (error) { }
    return () => {
      try {
        document.getElementsByClassName('layout')[0].style.display = 'block'
      } catch (error) { }
    }
  }, [])

  return (
    <div
      className={`${s['WalletConnect']} ${isLoaded ? s['loaded'] : ''}`}>
      <LangSwiper setLang={setLang} lang={lang} />
      <HeaderBar custom={true} />
      {address && <w3m-button />}
      <div className={s['about']}>
        <div className={s['title']}>{_t(stage, 'title')}</div>
        <div className={s['desc']}>{_t(stage, 'desc')}</div>
      </div>
      {!address && <w3m-button />}

      {address ?
        canBuy ?
          referals.length > 0 ?
            isPendingApproved ?
              <div className={s['st']}>
                <Spinner />
                {_t('alert', 'awaitApprove')}
              </div> :

              alreadyApproved ?
                <div className={s['buy']} onClick={() => { buy() }}>{_t('alert', 'buyEnter')}</div>
                :
                <div className={s['buy']} onClick={() => { approve() }}>{_t('alert', 'approve')}</div>
            : null
          : <div></div>
        : null
      }
      {isConfirming && <div className={s['st']}><Spinner /> {_t('alert', 'awaitPay')}</div>}
      {isConfirmed || !canBuy || stage == 6 ? <div className={s['back']} onClick={() => { window.location.href = 'https://t.me/Ducks_tap_bot' }}>{_t('alert', 'backToBot')}</div> : null}
      {isLoaded && <div className={s['load']}><Spinner /></div>}
    </ div>
  )
}
