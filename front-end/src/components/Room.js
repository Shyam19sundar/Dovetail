import React from 'react'
import '../css/Chat.css'
import RoomList from './RoomList'
import RoomContent from './RoomContent'


function Room() {
    return (
        <div className='chat'>
            <RoomList />
            <RoomContent />
        </div>
    )
}

export default Room
