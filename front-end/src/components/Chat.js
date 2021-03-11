import React from 'react'
import ChatContent from './ChatContent'
import ChatList from './ChatList'
import '../css/Chat.css'

function Chat() {
    return (
        <div className='chat'>
            <ChatList />
            <ChatContent />
        </div>
    )
}

export default Chat
