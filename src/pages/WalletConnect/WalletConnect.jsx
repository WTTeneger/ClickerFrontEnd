import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
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


const stageText = {
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
  }
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


  useEffect(() => {
    getClicker({ access_token: code }).then((res) => {
      if (res.data) {
        dispatch(resetCurrentUser(res.data.clicker));
        setIsLoaded(false)
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
        message.error('Ошибка получения данных')
      }
    })
  }, [code])


  useEffect(() => {
    if (address) {
      if (canBuy) {
        setStage(2)
      } else {
        setStage(5)
      }
      message.success('Кошелек подключен')
      setWallet({ access_token: code, address, type: 'connect' }).then(res => {
        if (res.data) {
        } else {
          message.error('Ошибка получения данных')
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
      message.error('Ошибка оплаты, подтвердите списание средств смарт-контрактом')
      setStage(3)
    }
  }, [error])

  useEffect(() => {
    if (errorApproved) {
      message.error('Ошибка получения разрешения')
    }
    if (hashApproved) {
      setAlreadyApproved(true)
      message.success('Разрешение получено')
      setStage(2)
    }

  }, [hashApproved, errorApproved, isPendingApproved])

  useEffect(() => {
    if (isConfirmed) {
      message.success('Покупка прошла успешно')
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
      <HeaderBar custom={true} />
      {address && <w3m-button />}
      <div className={s['about']}>
        <div className={s['title']}>{stageText[stage]?.title || 'title'}</div>
        <div className={s['desc']}>{stageText[stage]?.desc || 'desc'}</div>
      </div>
      {!address && <w3m-button />}

      {address ?
        canBuy ?
          referals.length > 0 ?
            isPendingApproved ?
              <div className={s['st']}>
                <Spinner />
                Ожидаем подтверждения...
              </div> :

              alreadyApproved ?
                <div className={s['buy']} onClick={() => { buy() }}>Оплатить вход</div>
                :
                <div className={s['buy']} onClick={() => { approve() }}>Разрешить списание</div>
            : null
          : <div></div>
        : null
      }
      {isConfirming && <div className={s['st']}><Spinner /> Ожидаем подтверждения оплаты... Не уходите со страницы</div>}
      {isConfirmed && <div>Транзакция подтверждена, можете вернутся в бота.</div>}
      {/* {error && (<div>Error: {(error).shortMessage || error.message}</div>)} */}
      {isConfirmed || !canBuy ? <div className={s['back']} onClick={() => { window.location.href = 'https://t.me/Ducks_tap_bot' }}>Вернуться в бота</div> : null}
      {isLoaded && <div className={s['load']}><Spinner/></div>}
    </ div>
  )
}
