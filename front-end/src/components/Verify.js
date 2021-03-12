import React, { useState, useEffect } from "react";
import axios from "../axios.js";
import Countdown from "react-countdown";
import $ from "jquery";
import "../css/Verify.css";
import { useHistory, withRouter } from "react-router-dom";

function Verify() {
    const history = useHistory();
    const email = sessionStorage.getItem("email");
    useEffect(() => {
        window.onbeforeunload = function () {
            return true;
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    const handleOTP = () => {
        console.log("clicked");
        console.log($(".otp_input").val());
        axios
            .post("/otp-verify", {
                email: email,
                otp: $(".otp_input").val(),
            })
            .then((res) =>
                res.status == 200 ? history.push("/form") : console.log("")
            );
        // if (otpStatus == 200) {
        //   history.push("/form");
        // } else {
        //   alert("An error occured, try again later");
        // }
    };

    return (
        <div className="verify signup-full">
            <div>
                <p>Hi, {email}</p>
                <input type="text" placeholder="OTP" className="otp_input" />
                <button
                    onClick={(e) => {
                        handleOTP();
                    }}
                >
                    Submit
        </button>
                <Countdown
                    className="count"
                    date={Date.now() + 300000}
                    onComplete={() => {
                        if (window.confirm("OTP expired, Please try again later :/")) {
                            history.push("/SignUp");
                        } else {
                            console.log("Nothing");
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default withRouter(Verify);
