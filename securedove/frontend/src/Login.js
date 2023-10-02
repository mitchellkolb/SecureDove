import React, {useEffect, useState} from "react";
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import app_logo from './securedovelogo.png';
import api from './api';
import './Login.css'
import { useHistory } from "react-router-dom"; // for redirecting 

// keeps track of who's logged in
var user_id = undefined;

const Login = (props) => {
    // reset user_id to 0 when page loads.
    useEffect(() => {
        user_id = undefined;
        console.log("userid=",user_id)
    }, []);

    const history = useHistory();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', {email, password});
            if (response.data.User_id !== undefined) {
                // redirect to messages here
                console.log("Login successful!");
                user_id = response.data.User_id; // temp for now. Later make it so that its loaded from backend reply
                console.log("userid=",user_id)
                history.push("/messages");
            }
            else{
                alert("The credentials you entered don't match our records.");
            }
        } 
        catch (error) {
            console.error('Login failed:', error);
            alert("Database error.");
        }
    };

    return (
        
        <Container className="mt-5">
            <div className="row">
                <div className="col-md-12">
                    <img src={app_logo} alt="App-Logo" className="img-fluid centered-horizontally-image" />
                </div>
            </div>
            <Form className="login_form" onSubmit={handleLogin}>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{color: "white"}}>Email address</Form.Label>
                    <Form.Control type="text" name="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label  style={{color: "white"}}>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)}/>
                </Form.Group>

                <Button className="btn_login" variant="primary" type="submit">
                    Login
                </Button>
            </Form>

            <div className="d-flex justify-content-center mt-3">
                <Link to="/register" className="btn btn-secondary mr-2">Register</Link>
            </div>
        </Container>
    );
}
export {user_id};
export default Login;
