import React, { useState, useEffect } from 'react'
import "../css/RoomList.css"
import $ from 'jquery'
import io from "socket.io-client";
import axios from '../axios'
import { useHistory, withRouter } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';

const ENDPOINT = 'http://localhost:5000';

let socket;

function RoomList() {
    const history = useHistory();

    const [roomName, setroomName] = useState("")
    const [roomResponse, setroomResponse] = useState(null)

    const handleClick = () => {
        $('.add-room-form').toggle({ display: 'flex' })
    }

    const addRoom = (e) => {
        e.preventDefault()
        axios.post('/newroom', {
            roomName: roomName
        }).then(res => setroomResponse(res.data))
    }
    useEffect(() => {
        socket = io(ENDPOINT);
        if (!(window.location.search.includes('&'))) {
            if (roomResponse === "Created Room") {
                setroomResponse(null)
                history.push(`/rooms?${roomName}`);
            } else if (roomResponse === "Already Exists") {
                alert("Room Already Exists")
            }
        }
    }, [ENDPOINT, window.location.search, roomResponse])
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
            {
                // searches?.map(search => (
                //     <div className='chatList-searchList'>
                //         <img src='../images/male.png' />
                //         <div>
                //             {/* <h4>{search.name}</h4> */}
                //             <p>Hello! Good Morning</p>
                //         </div>
                //     </div>
                // ))
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

export default withRouter(RoomList)
