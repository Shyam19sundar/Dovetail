import axios from '../axios.js'
import React from 'react'
import { hasAccess, refresh } from './Access.js'
import Cookies from 'js-cookie'

function Home() {
    // axios.post('/protected').then(res => console.log(res).catch(err => console.log(err)))

    const accessProtected = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await requestLogin(access, refreshToken);
        }
    };

    const requestLogin = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/protected",
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        console.log(response);
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            console.log("hello");
                            const access = await refresh(refreshToken);
                            return await requestLogin(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };
    return (
        <div className='home'>
            <button onClick={accessProtected}>get</button>
        </div>
    )
}

export default Home
