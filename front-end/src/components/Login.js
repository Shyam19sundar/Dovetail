import axios from '../axios'
import React, { useState } from 'react'
import "../css/Login.css"

function Login() {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/login", {
            email: email,
            password: password
        }).then(res => {
            console.log(res.data)
            console.log(res)
        })
    }
    return (
        <div className="login__body">
            <div className="container">
                <div className="row">
                    <div className="col-md-9">
                        <form className="box" onSubmit={handleSubmit}>
                            <h1>Login</h1>
                            <p className="text-muted"> Please enter your login and password!</p>
                            <input required type="email" onChange={(e) => setemail(e.target.value)} placeholder="Email" />
                            <input required type="password" onChange={(e) => setpassword(e.target.value)} placeholder="Password" />
                            <a className="forgot text-muted" href="#">Forgot password?</a>
                            <input type="submit" name="" value="Login" href="#" />
                            <p className="text-muted">Not Having Account</p>
                            <input name="" value="Sign Up" href="#" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
