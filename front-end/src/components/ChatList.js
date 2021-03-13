import React, { useState, useEffect } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import '../css/ChatList.css'
import axios from '../axios';
import ChatMessages from './ChatMessages';
import { useHistory, withRouter } from "react-router-dom";

function ChatList() {
    const history = useHistory();

    const [members, setmembers] = useState([])
    const [searches, setsearches] = useState([])
    useEffect(() => {
        axios.get('/allMembers').then(res => setmembers(res.data))
    }, [])
    const handleChange = (e) => {
        setsearches(members.filter(member => member.name.includes(e.target.value)))
    }
    const handleClick = (search) => {
        history.push(`/chats?${search._id}`);
    }
    return (
        <div className='chatList'>
            <div className='chatList-search'>
                <input type='text' placeholder='Search' onChange={(e) => handleChange(e)} />
                <SearchIcon id='searchIcon' />
            </div>
            {
                searches?.map(search => (
                    <div onClick={() => handleClick(search)} className='chatList-searchList'>
                        <img src='../images/male.png' />
                        <div>
                            <h4>{search.name}</h4>
                            <p>Hello! Good Morning</p>
                        </div>
                    </div>
                ))
            }

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

export default withRouter(ChatList)
