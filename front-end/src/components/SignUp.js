import React, { useState } from 'react'
import { useHistory } from 'react-router'
import axios from '../axios'
import '../css/Signup.css'
import $ from 'jquery'

function SignUp() {
    const [email, setEmail] = useState("")
    const history = useHistory()
    const handleSubmit = () => {
        if ($('#signup-email').val() !== ('' && undefined)) {
            if (typeof Storage !== "undefined") {
                // Store
                sessionStorage.setItem("email", email);
            }
            axios.post("/verify", {
                email: email,
            }).then(
                res => {
                    if (res.status === 200)
                        history.push('/verify')
                }
            ).catch(err => console.log(err.message))

        }
        else
            $("#email-bottom").css({ width: '100%', backgroundColor: 'red' })
    }
    return (
        <div className="signup">
            <div className='signup-container'>
                <h2>Dovetail</h2>
                <p>Sign up to join us!</p>
                <div className='signupInput-container'>
                    <input type='email' placeholder='Email' id='signup-email' onChange={(e) => setEmail(e.target.value)} />
                    <span id='email-bottom'></span>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>

        </div>
    )
}

export default SignUp
