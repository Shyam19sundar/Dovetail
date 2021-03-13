import React, { useState, useEffect } from 'react'
import "../css/RoomList.css"
import $ from 'jquery'
import io from "socket.io-client";
import axios from '../axios'
import { useHistory, withRouter } from "react-router-dom";

const ENDPOINT = 'http://localhost:5000';

let socket;

function RoomList() {
    const history = useHistory();

    const [roomName, setroomName] = useState("")
    const [roomResponse, setroomResponse] = useState(null)
    const handleClick = () => {
        $('.add-room-form').show()
    }

    const addRoom = (e) => {
        e.preventDefault()
        axios.post('/newroom', {
            roomName: roomName
        }).then(res => setroomResponse(res.data))
    }
    useEffect(() => {
        socket = io(ENDPOINT);

        if (roomResponse === "Created Room") {
            console.log("DDDDD")
            socket.emit('join', { roomName }, (error) => {
                if (error) {
                    alert(error);
                }
            });
            history.push(`/room/?${roomName}`);
        } else {
            console.log("BYE")
        }
    }, [ENDPOINT, roomResponse])
    return (
        <div className="room-list">
            <button onClick={handleClick}>Create Room</button>
            <form className="add-room-form" onSubmit={addRoom}>
                <div>Room Name</div>
                <input placeholder="Room Name" onChange={(e) => setroomName(e.target.value)} />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default withRouter(RoomList)
