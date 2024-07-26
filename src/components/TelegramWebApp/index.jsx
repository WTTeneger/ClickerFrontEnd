import React from 'react'

export default function TelegramWebApp() {
    let inUnsafty = window.Telegram.WebApp.initDataUnsafe

    // запрос на сервер
    const api = async () => { 
        const response = await fetch('http://localhost:3030/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hash: inUnsafty.hash,
                data_check_string: window.Telegram.WebApp.initData
            })
        })
        const data = await response.json()
    }
    api()


    return null
}
