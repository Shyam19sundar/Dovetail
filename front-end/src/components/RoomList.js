import React, { useState, useEffect } from 'react'
import "../css/RoomList.css"
import $ from 'jquery'
import io from "socket.io-client";
import axios from '../axios'
import { useHistory, withRouter } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import { useStateValue } from '../StateProvider';

const ENDPOINT = 'http://localhost:5000';

let socket;

function RoomList() {
    const history = useHistory();
    const [response, setResponse] = useState([])
    const [{ room }, dispatch] = useStateValue()
    const [roomName, setroomName] = useState("")
    const [roomResponse, setroomResponse] = useState(null)

    const handleClick = () => {
        $('.add-room-form').toggle({ display: 'flex' })
    }
    const addNewRoom = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    '/newroom', {
                    roomName: roomName
                },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        console.log(response.data)
                        setResponse(response.data);
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await addNewRoom(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };


    const accessAddRoom = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await addNewRoom(access, refreshToken);
        }
    };

    const addRoom = (e) => {
        e.preventDefault()
        accessAddRoom()
    }
    useEffect(() => {
        // socket = io(ENDPOINT);
        axios.get('/roomList').then(res => setResponse(res.data))
    }, [ENDPOINT])

    const handleRoom = (room) => {
        dispatch({
            type: 'SET_ROOM',
            room: room
        })
    }
    return (
        <div className="room-list">
            <div className='add-room-container'>
                <button onClick={handleClick}>Create a new Room</button>
                <form className="add-room-form" onSubmit={addRoom}>
                    {/* <div>Room Name</div> */}
                    <input placeholder="Room Name" onChange={(e) => setroomName(e.target.value)} />
                    <button type="submit">Add</button>
                </form>

            </div>


            <div className='chatList-search'>
                <input type='text' placeholder='Search' />
                <SearchIcon id='searchIcon' />
            </div>
            <div className='chatList-scroll'>
                {
                    response?.map(room => (
                        <div onClick={() => handleRoom(room)} className='chatList-searchList'>
                            <img src='../images/male.png' />
                            <div>
                                <h4>{room.roomName}</h4>
                            </div>
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default withRouter(RoomList)
