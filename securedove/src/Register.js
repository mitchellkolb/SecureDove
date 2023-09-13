import React, {useState} from "react";
import './Register.css'
import {Container, Form, Button} from 'react-bootstrap'

import app_logo from './securedovelogo.png'

function Register(){
    return (
        <Container className="mt-0">
            <div className="row">
                <div className="col-md-12">
                    <img src={app_logo} alt="App-Logo" className="img-fluid centered-horizontally-image" />
                </div>
            </div> 
            <Form className="register_form">
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter Username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" />
                </Form.Group>

                <Button className="btn_Register" variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </Container>
    );
};

export default Register;

