import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import "../css/Profile.css"
import $ from "jquery"

function Profile() {


    $("#add1").click(function () {
        $("#list").append(" <b>mani</b>.");
    });

    return (
        <div className="profile">
            <div className="profile_image">
                <img src="../images/male.png" />

            </div>
            <EditIcon style={{ fontSize: 40 }} className="profile_icon" />
            <div className="profile_details">
                <div className="profile-info">
                    <h4>Name:</h4>
                    <h4> SakthiGanesh </h4>
                    <EditIcon />
                </div>

                <div className="profile-interest">
                    <h4>Area of Interest:</h4>
                    <h4>Web devd</h4>
                    <button id="add1" style={{ marginLeft: "20px" }}><AddIcon style={{ fontSize: 25, }} /></button>
                </div>
                <div className="profile-list">
                    <p id="list">music</p>
                    <p>art</p>

                </div>


                <div className="profile-work">
                    <h4>Field work:</h4>
                    <h4>web app</h4>
                    <button id="add2"><AddIcon style={{ fontSize: 25 }} /></button>
                </div>





            </div>
        </div>
    )
}

export default Profile
