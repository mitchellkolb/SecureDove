import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import app_logo from './securedovelogo.png';
import './LogoPage.css';

/*
    redirectLogin: hold current state value
    setRedirectLogin: function use to update state
*/
const LogoPage = () => {
    const [redirectLogin, setRedirectLogin] = useState(false);

    //  Use timer to show logo for 3s before redirect user to login page
    useEffect(() => {
        const timer = setTimeout(() => {
            setRedirectLogin(true);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    // Redirect the user to the login page after 3s
    return (
        <div className='logo-page'>
            <div className='welcome-message'>
                <h1>Welcome To</h1>
                <img src={app_logo} alt='app_logo' className='app_logo'/>
            </div>
            {redirectLogin && <Redirect to = '/login' />}
        </div>
    );
};

export default LogoPage;