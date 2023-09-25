import React, {useState} from "react";
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import app_logo from './securedovelogo.png';
import api from './api';
import './Login.css'

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', {email, password});
            if (response.data.message === 'Login successful!') {
                // redirect to messages here
                console.log("Login successful!")
            }
        } 
        catch (error) {
            console.error('Login failed:', error);
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
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" name="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)}/>
                </Form.Group>

                <Button className="btn_login" variant="primary" type="submit">
                    Login
                </Button>
            </Form>

            <div className="d-flex justify-content-center mt-3">
                <Link to="/register" className="btn btn-primary mr-2">Register</Link>
                <Link to="/messages" className="btn btn-primary">Messages</Link>
            </div>
        </Container>
    );
}

export default Login;
