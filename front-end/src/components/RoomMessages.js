import React, { useEffect, useState } from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/RoomMessages.css'
import axios from '../axios';
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import { useStateValue } from '../StateProvider';
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:5000';

let socket;

function RoomMessages() {
    const [message, setmessage] = useState("")
    const [{ user, room }, dispatch] = useStateValue()
    const [roomMessages, setRoomMessages] = useState([])
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.on('users', (data) => {
            var arr = []
            data.map(message => {
                if (message.roomId) {
                    if (message.roomId === room?._id)
                        arr.push(message)
                }
            })
            setRoomMessages(arr)
        })
        if (room)
            axios.post('/roomMessages', {
                roomName: room?.roomName
            }).then(
                res => setRoomMessages(res.data)
            )
    }, [room])

    const getRoom = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/roomMessage",
                    {
                        room: room.roomName,
                        message: message
                    },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        // setResponse(response.data);
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await getRoom(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessRoom = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await getRoom(access, refreshToken);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (room)
            accessRoom()
    }
    return (
        <div className='roomMessages'>
            <div className='chatMessages-header'>
                <h2>{room?.roomName}</h2>
            </div>
            <div className='chatMessages-container'>
                {
                    roomMessages?.map(single => (
                        <div className={single.fromEmail === user ? `chatMessages-message justifyRight` : `chatMessages-message justifyLeft`}>
                            <p>{single.message}</p>
                            {/* <span>{single.time}</span> */}
                        </div>
                    ))
                }
            </div>

            <form className='chatMessages-input' onSubmit={handleSubmit}>
                <input onChange={(e) => setmessage(e.target.value)} required type='text' placeholder='Send a message' />
                <SendIcon id='sendIcon' onClick={handleSubmit} />
                <button type="submit" style={{ display: 'none' }} ></button>
            </form>
        </div>
    )
}

export default RoomMessages