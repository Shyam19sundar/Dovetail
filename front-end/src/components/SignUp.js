import React, { useState } from 'react'
import axios from '../axios'

function SignUp() {
    const [email, setemail] = useState("")
    const handleSubmit = () => {
        if (typeof Storage !== "undefined") {
            // Store
            sessionStorage.setItem("email", email);
        }
        axios.post("/verify", {
            email: email,
        });
    }
    return (
        <div>
            <div className="login__body">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <form className="box" onSubmit={handleSubmit}>
                                <h1>Sign Up</h1>
                                <p className="text-muted"> Please enter your Email and password!</p>
                                <input required type="email" onChange={(e) => setemail(e.target.value)} placeholder="Email" />
                                <a className="forgot text-muted" href="#">Forgot password?</a>
                                <input type="submit" name="" value="Sign Up" href="#" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
