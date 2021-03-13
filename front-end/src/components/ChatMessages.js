import React, { useState, useEffect } from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/ChatMessages.css'
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import axios from '../axios';

function ChatMessages() {
    const [id, setid] = useState("")

    useEffect(() => {
        setid(window.location.search.split('?')[1])
        accessProtected()
    }, [window.location.search])


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

    const requestLogin = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .get(
                    "/directMessage",
                    {
                        params:
                            { receiver: id }
                    },
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
