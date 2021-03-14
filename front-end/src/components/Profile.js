import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import "../css/Profile.css"
import $ from "jquery"
import Cookies from 'js-cookie';

function Profile() {

    const handleAreas = () => {
        $('.addAreas-container').toggle({ display: 'block' })
    }
    const handleWorks = () => {
        $('.addWorks-container').toggle({ display: 'block' })
    }

    return (
        <div>
            {
                Cookies.get('refresh') ?
                    <div className="profile">

                        <div className="profile-image">
                            <img src="../images/male.png" />
                            <EditIcon className="dp-edit" />
                        </div>
                        <div className='profile-name'>
                            <h2>Shakthi Ganesh R</h2>
                            <EditIcon className="name-edit" />
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
