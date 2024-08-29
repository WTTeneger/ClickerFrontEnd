import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAccount, useSignMessage, useWriteContract } from 'wagmi';
import abi from "./abi.json"
import { useGetRefersMutation, useSetBuyMutation, useSetWalletAddressMutation } from '../../store/user/user.api';
import { message } from 'antd';
import * as ethers from "ethers";
import { useDispatch } from 'react-redux';
import { resetCurrentUser } from '../../store/user/userSlice';


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
  //     100000
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




  const buy = async () => {
    try {
      const tx = await writeContractAsync()
      const res = await tx.wait()

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


  const { signMessage } = useSignMessage();



  useEffect(() => {
    document.getElementsByClassName('layout')[0].style.display = 'none'
    return () => {
      document.getElementsByClassName('layout')[0].style.display = 'block'
    }
  }, [])
  return (
    <div style={{
      textAlign: 'center',
      color: 'white',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    }}>
      <w3m-button />
      {/* {address} */}

      {/* {address ? <div onClick={() => { buy() }}>Back to app</div> : null} */}
    </div>
  )
}
