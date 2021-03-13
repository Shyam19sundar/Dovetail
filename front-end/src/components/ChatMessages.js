import React, { useState, useEffect } from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/ChatMessages.css'
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import axios from '../axios';
import { useStateValue } from '../StateProvider';

function ChatMessages() {
    const [{ receiver_id }, dispatch] = useStateValue()

    const requestLogin = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/directMessage",
                    { receiver: receiver_id },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        console.log(response);
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            console.log("hello");
                            const access = await refresh(refreshToken);
                            return await requestLogin(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessProtected = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await requestLogin(access, refreshToken);
        }
    };

    useEffect(() => {
        if (receiver_id)
            accessProtected()
    }, [receiver_id])

    const handleSubmit = () => {
        axios.post('/addMessage')
    }
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
            <form className='chatMessages-input' onSubmit={handleSubmit}>
                <input required type='text' placeholder='Send a message' />
                <SendIcon id='sendIcon' />
                <button type="submit" style={{ display: 'none' }}></button>
            </form>
        </div>
    )
}

export default ChatMessages
