import React, { useState } from 'react'
import '../css/Header.css'
import $ from 'jquery'

function Header() {
    const [signedin, setSignedin] = useState(false)

    const handleSignedin = () => {
        setSignedin(true)
        $('.switch input').prop('checked', true)
    }
    const handleAnonymous = () => {
        setSignedin(false)
        $('.switch input').prop('checked', false)
    }

    return (
        <div className='header'>
            <h1>DOVETAIL</h1>
            <div>
                <button onClick={handleAnonymous}>Anonymous</button>
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
                <button className='header-signin' onClick={handleSignedin}>Sign-In</button>
            </div>

        </div >
    )
}

export default Header

