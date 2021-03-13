import React, { useEffect } from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/ChatMessages.css'
import axios from '../axios';

function ChatMessages() {
    useEffect(() => {
        if ((window.location.search.includes('&')))
            axios.post('/roomMessages', {
                roomName: window.location.search.substring(1)
            }).then(res => console.log(res.data))
    }, [window.location.search])

    return (
        <div className='chatMessages'>
            <div>

            </div>
            <div className='chatMessages-container'>
                <div className='chatMessages-message justifyLeft'>
                    <img src='../images/male.png' />
                    <p>Hello, Good Morning</p>
                </div>
                <div className='chatMessages-message justifyRight'>
                    <img src='../images/male.png' />
                    <p>Hello, Good Morning</p>
                </div>
                <div className='chatMessages-message justifyLeft'>
                    <img src='../images/male.png' />
                    <p>Hello, Good Morning</p>
                </div>
            </div>
            <div className='chatMessages-input'>
                <input type='text' placeholder='Send a message' />
                <SendIcon id='sendIcon' />
            </div>
        </div>
    )
}

export default ChatMessages
