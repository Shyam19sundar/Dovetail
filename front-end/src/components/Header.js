import React from 'react'
import '../css/Header.css'

function Header() {
    return (
        <div className='header'>
            <h1>DOVETAIL</h1>
            <div>
                <p>Anonymous</p>
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
                <p>Shyam</p>
            </div>

        </div>
    )
}

export default Header

