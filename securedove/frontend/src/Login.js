import React, {useState} from "react";
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import app_logo from './securedovelogo.png';
import axios from "axios";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = (e) => {
      e.preventDefault();
      console.log(email,password); // testing events
      axios
        .post("http://localhost:8000/login", { email, password })
        .then((r) => props.onLogin({ ...r.data, password })) // NOTE: over-ride password
        .catch((e) => console.log(JSON.stringify(e.response.data)));
    };

    // async function handleLogin(){
    //     // console.log(username, email, password, confirmPassword); // this line is just for testing
    //     const response = await fetch(`http://localhost:8000/login??email=${email}?password=${password}`);
    //     const data = await response.json();
    //     console.log(data.data[0][0]);
    // }
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
