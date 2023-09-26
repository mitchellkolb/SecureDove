import React, {useState} from "react";
import './Register.css';
import {Container, Form, Button} from 'react-bootstrap';
import app_logo from './securedovelogo.png';
import api from './api';
import { useHistory } from "react-router-dom"; // for redirecting 

const Register = (props) =>{
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async (e) => {
        console.log(username, email, password, confirmPassword); // test
        e.preventDefault();
        if (password !== confirmPassword){
            console.log("Passwords don't match.");
            // maybe create a popup that lets user know but for now we can check console
            alert("The passwords you entered don't match.")
        }
        else{
            try {
                const response = await api.post('/register', {username, email, password});
                if (response.data.message === 'Register successful!') {
                    // redirect to login here
                    // history.push('/login')
                    console.log("Register successful!")
                    history.push("/login");
                }
                else {
                    console.error('Register failed:', response.data.message);
                    alert("Error registering. Please try again.")
                }
            } 
            catch (error) {
                console.error('Register failed:', error);
                alert("Error registering. Please try again.")
            }
        }
    };

    return (
        <Container className="mt-5">
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

