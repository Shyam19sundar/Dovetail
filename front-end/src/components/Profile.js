import React, { useState, useEffect } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import "../css/Profile.css"
import $ from "jquery"
import axios from '../axios';
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'

function Profile() {
    const [nameChange, setnameChange] = useState(false)
    const [name, setname] = useState("")
    const user = sessionStorage.getItem("user");
    const [profileDetails, setprofileDetails] = useState({})
    const handleAreas = () => {
        $('.addAreas-container').toggle({ display: 'block' })
    }
    const handleWorks = () => {
        $('.addWorks-container').toggle({ display: 'block' })
    }

    const handleName = () => {
        setnameChange(true)
    }
    const updateName = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/updateName",
                    {
                        name: name
                    },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        if (response.data) {
                            setprofileDetails(response.data)
                            setnameChange(false)
                        }
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await updateName(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessName = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await updateName(access, refreshToken);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        accessName()
    }

    const dpChange = () => {

    }
    useEffect(() => {
        axios.get('/profileDetails', {
            params: {
                user: user
            }
        }).then(res => setprofileDetails(res.data))
    }, [])

    return (
        <div>
            {
                Cookies.get('refresh') ?
                    <div className="profile">
                        <div className="profile-image">
                            {profileDetails.dp ?
                                <div>
                                    <img src={profileDetails.dp} />
                                    <EditIcon onClick={dpChange} className="dp-edit" />
                                </div> :
                                <div>
                                    <img src="../images/male.png" />
                                    <EditIcon onClick={dpChange} className="dp-edit" />
                                </div>}

                        </div>
                        <div className='profile-name'>
                            {nameChange ?
                                <div className='addName-container'>
                                    <form onSubmit={handleSubmit}>
                                        <input type='text' className='addName' onChange={(e) => setname(e.target.value)} placeholder='Update Name' />
                                        <SendIcon type="submit" onClick={handleSubmit} className='name-update' />
                                    </form>
                                </div>
                                :
                                <div>
                                    <h2>{profileDetails.name}</h2>
                                    <EditIcon className="name-edit" onClick={handleName} />
                                </div>
                            }
                        </div>
                        <div className='profile-areas'>
                            <div className='areas-head'>
                                <h2>What I love</h2>
                                <AddIcon className='add-icon' onClick={handleAreas} />
                                <div className='addAreas-container'>
                                    <input type='text' className='addAreas-input' placeholder='Add an area' />
                                    <SendIcon className='areas-send' />
                                </div>

                            </div>
                            <div>
                                <p>Music</p>
                                <p>Cricket</p>
                                <p>Movies</p>
                                <p>Science</p>
                                <p>Science</p>
                            </div>
                        </div>

                        <div className='profile-areas'>
                            <div className='works-head'>
                                <h2>What I have done</h2>
                                <AddIcon className='add-icon' onClick={handleWorks} />
                                <div className='addWorks-container'>
                                    <input type='text' className='addWorks-input' placeholder='Add a work' />
                                    <SendIcon className='works-send' />
                                </div>
                            </div>
                            <div>
                                <p>Music</p>
                                <p>Cricket</p>
                                <p>Movies</p>
                                <p>Science</p>
                                <p>Science</p>
                            </div>
                        </div>
                    </div> :
                    <div className='anonymous-profile'>
                        <img src='../images/anonymous.jpg' />
                        <div>
                            <p>You're not logged in :/</p>
                            <p> Login to catch your personalized contents !</p>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Profile
