import React, {useState} from "react";
import './Login.css'
import {Container, Form, Button} from 'react-bootstrap'



function Login(){
    return (
        <Container className="mt-5">
            <Form className="login_form">
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>

                <Button className="btn_login" variant="primary" type="submit">
                    Login
                </Button>

            </Form>
        </Container>
    );
};

export default Login;
