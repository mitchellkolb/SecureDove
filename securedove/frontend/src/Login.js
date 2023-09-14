import React from "react";
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import app_logo from './securedovelogo.png';

function Login() {
    return (
        <Container className="mt-5">
            <div className="row">
                <div className="col-md-12">
                    <img src={app_logo} alt="App-Logo" className="img-fluid centered-horizontally-image" />
                </div>
            </div>
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
            <div className="d-flex justify-content-center mt-3">
                <Link to="/register" className="btn btn-primary mr-2">Register</Link>
                <Link to="/messages" className="btn btn-primary">Messages</Link>
            </div>
        </Container>
    );
}

export default Login;
