import React from 'react'
import ChatContent from './ChatContent'
import ChatList from './ChatList'
import '../css/Chat.css'
import RoomList from './RoomList'


function Room() {
    return (
        <div className='chat'>
            <RoomList />
            <ChatContent />
        </div>
    )
}

export default Room
