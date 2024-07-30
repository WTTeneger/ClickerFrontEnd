import { useState, useEffect } from 'react';

function useMessage() {


    function addNewMessage({ text = 'Амаль', author = 'me', type = '' }) {
        setMessageList(text);
        console.log(messageList)
    }



    useEffect(() => {
        console.log('init')
    });

    return 'Amal';
}

export default useMessage;