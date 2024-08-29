import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAccount, useSignMessage, useWriteContract } from 'wagmi';
import abi from "./abi.json"
// import * as ethers from "ethers";


export default function WalletConnect() {
  let { code } = useParams()

  const { address } = useAccount();

  const referals = []

  const { write } = useWriteContract({
    abi,
    address: '0xbDD437Ed3366dafDDeaAB0fd3e9CA36f46AaaA20',
    functionName: 'distribute',
    args: [
      referals,
      // ethers.parseUnits(11, 6),
    ],
  })

  // const buy = () => write().then(res => {
  //   // finished request to api 
  // })

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
      color: 'white'
    }}>
      <w3m-button />
      {code}
      {address}
    </div>
  )
}
