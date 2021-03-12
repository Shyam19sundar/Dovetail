import React from 'react'
import '../css/Header.css'
import $ from 'jquery'

function Header() {
    const handleClick = () => {
        $('.header-signin').click(() => {
            $('.switch input').prop('checked', true)
        })
    }

    return (
        <div className='header'>
            <h1>DOVETAIL</h1>
            <div>
                <p>Anonymous</p>
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
                <p className='header-signin' onClick={handleClick}>Sign-In</p>
            </div>

        </div >
    )
}

export default Header

