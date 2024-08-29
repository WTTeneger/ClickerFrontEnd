import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAccount, useSignMessage, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import abi from "./abi.json"
import abi_usdt from "./usdt_abi.json"
import { useGetRefersMutation, useSetBuyMutation, useSetWalletAddressMutation } from '../../store/user/user.api';
import { message } from 'antd';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { resetCurrentUser } from '../../store/user/userSlice';
import s from './WalletConnect.module.scss'

export default function WalletConnect() {
  let { code } = useParams()
  const [getRefs] = useGetRefersMutation();
  const [setBuy] = useSetBuyMutation();
  const [setWallet] = useSetWalletAddressMutation();
  const dispatch = useDispatch();
  const [referals, setReferals] = React.useState([])
  const [refsId, setRefsId] = React.useState(null)
  // получить код из url?auth='asdads' auth
  const { address } = useAccount();
  // const { writeContractAsync } = useWriteContract({
  //   abi,
  //   address: '0xbDD437Ed3366dafDDeaAB0fd3e9CA36f46AaaA20',
  //   functionName: 'distribute',
  //   args: [
  //     referals,
  //     ethers.parseUnits('11', 6)
  //   ],
  // })
  useEffect(() => {
    // getClicker({ access_token: code }).then((res) => {
    //   setIsView(true);
    //   if (res.data) {
    //     if (res?.data?.totalEarned?.isEarned == true) {
    //       updateDate.current = res.data.totalEarned;
    //     }
    //     dispatch(resetCurrentUser(res.data.clicker));
    //   }
    // })
    getRefs({ access_token: code }).then(res => {
      if (res.data) {
        setReferals(res.data.wallets)
        setRefsId(res.data.id)
      } else {
        message.error('Ошибка получения данных')
      }
    })
  }, [code])


  useEffect(() => {
    if (address) {
      message.success('Кошелек подключен')
      setWallet({ access_token: code, address, type: 'connect' }).then(res => {
        if (res.data) {
          console.log(res.data)
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
    if (!hashApproved) {
      approveAsync({
        address: '0x55d398326f99059ff775485246999027b3197955',
        abi: abi_usdt,
        functionName: 'approve',
        args: [
          '0xbDD437Ed3366dafDDeaAB0fd3e9CA36f46AaaA20',
          ethers.parseUnits('11', 18),
        ]
      })
    } else {

      writeContract({
        address: '0xbDD437Ed3366dafDDeaAB0fd3e9CA36f46AaaA20',
        abi,
        functionName: 'distribute',
        args: [
          referals,
          ethers.parseUnits('11', 18),
        ],
      })
    }



      // try {
      //   const tx = await writeContractAsync()
      //   clg
      //   const res = await tx.wait()

      //   setBuy({ access_token: code, id: refsId }).then(res => {
      //     if (res.data) {
      //       console.log(res.data)
      //       message.success('Покупка прошла успешно')
      //     } else {
      //       message.error('Ошибка получения данных')
      //     }
      //   })
      //   alert("Buyed")
      // } catch (e) {
      //   console.log(e)
      //   alert("error")
      // }
    }

    useEffect(() => {
      if (isConfirmed) {
        try {
          setBuy({ access_token: code, id: refsId }).then(res => {
            if (res.data) {
              console.log(res.data)
              message.success('Покупка прошла успешно')
            } else {
              message.error('Ошибка получения данных')
            }
          })
          alert("Buyed")
        } catch (e) {
          console.log(e)
          alert("error")
        }
      }
    }, [isConfirmed])

    const { signMessage } = useSignMessage();



    useEffect(() => {
      document.getElementsByClassName('layout')[0].style.display = 'none'
      return () => {
        document.getElementsByClassName('layout')[0].style.display = 'block'
      }
    }, [])
    return (
      <div
        className={s['WalletConnect']}
        style={{
          textAlign: 'center',
          color: 'white',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'flex-direction': 'column',
          'gap': '1rem',
          marginTop: '50px'
        }}>
        <w3m-button />
        {/* {address} */}

        {address ? <div className={s['buy']} onClick={() => { buy() }}>Buy</div> : null}
        {isConfirming && <div>Waiting for confirmation... Dont leave from page</div>}
        {isConfirmed && <div>Transaction confirmed. </div>}
        {error && (
          <div>Error: {(error).shortMessage || error.message}</div>
        )}
      </div>
    )
  }
