import React from 'react'
import SearchIcon from '@material-ui/icons/Search';
import '../css/ChatList.css'

function ChatList() {
    return (
        <div className='chatList'>
            <div className='chatList-search'>
                <input type='text' placeholder='Search' />
                <SearchIcon id='searchIcon' />
            </div>

            <div className='chatList-contact'>
                <img src='../images/male.png' />
                <div>
                    <h4>Name</h4>
                    <p>Hello! Good Morning</p>
                </div>
            </div>
            <div className='chatList-contact'>
                <img src='../images/male.png' />
                <div>
                    <h4>Name</h4>
                    <p>Hello! Good Morning</p>
                </div>
            </div>
            <div className='chatList-contact'>
                <img src='../images/male.png' />
                <div>
                    <h4>Name</h4>
                    <p>Hello! Good Morning</p>
                </div>
            </div>
        </div>
    )
}

export default ChatList
