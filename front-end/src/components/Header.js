import React, { useState } from 'react'
import '../css/Header.css'
import $ from 'jquery'
import { useStateValue } from "../StateProvider";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header() {
    const [{ user }, dispatch] = useStateValue()
    const [signedin, setSignedin] = useState(false)


    return (
        <div className='header'>
            <h1>DOVETAIL</h1>
            <div>
                {Cookies.get('refresh') ?
                    <div>
                        <h3>Hello</h3>
                        <h2>{`${user}`}</h2>
                    </div>

                    :
                    <Link to='/login'>
                        <button>Sign-in</button>
                    </Link>
                }
            </div>

        </div >
    )
}

export default Header

