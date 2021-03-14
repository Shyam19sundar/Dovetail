import React from 'react'
import '../css/Chat.css'
import RoomList from './RoomList'
import RoomContent from './RoomContent'


function Room() {
    return (
        <div className='chat'>
            <div className='chat'>
                <RoomList />
                <RoomContent />
            </div>

        </div>
    )
}

export default Room
