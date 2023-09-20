import React, {useState} from "react";
import './Register.css'
import {Container, Form, Button} from 'react-bootstrap'
import axios from "axios";
import app_logo from './securedovelogo.png'

const Register = (props) =>{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        // console.log(username, email, password, confirmPassword); // this line is just for testing
        axios
            .post("http://localhost:8000/register", {
                username,
                email,
                password,
                confirmPassword
            })
            .then((r) => props.onRegister({ ...r.data, password })) 
            .catch((e) => console.log(JSON.stringify(e.response.data)));
    };
    
    return (
        <Container className="mt-0">
            <div className="row">
                <div className="col-md-12">
                    <img src={app_logo} alt="App-Logo" className="img-fluid centered-horizontally-image" />
                </div>
            </div> 
            <Form className="register_form" onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter Username" onChange={(e)=>setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" name="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
                </Form.Group>

                <Button className="btn_Register" variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </Container>
    );
};

export default Register;

