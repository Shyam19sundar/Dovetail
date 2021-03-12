import React from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/ChatMessages.css'

function ChatMessages() {
    return (
        <div className='chatMessages'>
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
