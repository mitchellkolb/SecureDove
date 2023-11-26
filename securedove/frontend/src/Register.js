import React, {useState} from "react";
import './Register.css';
import {Container, Form, Button} from 'react-bootstrap';
import app_logo from './securedovelogo.png';
import api from './api';
import { useHistory } from "react-router-dom"; // for redirecting 

// For hashing
import CryptoJS from 'crypto-js'


const Register = (props) =>{
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async (e) => {
        console.log(username, email, password, confirmPassword); // test
        e.preventDefault();

        // Hash the password user entered
        const hashedPw = CryptoJS.SHA256(password).toString();
        
        if (password !== confirmPassword){
            console.log("Passwords don't match.");
            // maybe create a popup that lets user know but for now we can check console
            alert("The passwords you entered don't match.")
        }
        else{
            // check length of password to be at least 8
            if (password.length < 8) {
                alert("Password needs to be at least 8 characters in length.");
            }
            // check if it contains a capital letter
            else if (/[A-Z]/.test(password) === false) {
                alert("Password must contain at least one upper case letter.")
            }
            // check if it contains at least 1 upper case
            else if (/[0-9]/.test(password) === false) {
                alert("Password must contain at least one number 0-9.")
            }
            // check if it contains at least 1 symbol
            else if (/[!@#$%^&*]/.test(password) === false) {
                alert("Password must contain a special character from the following list: !@#$%^&*");
            }
            // call backend
            else {
                try {
                    const response = await api.post('/register', {username, email, password:hashedPw});
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
        }
    };


    // pop up password requirements for user when they are about to enter a password
    const passwordClicked = async(e) => {
        alert("Passwords requirements: \n-At least 8 characters in length \n-At least one upper case letter \n-At least one number 0-9 \n-At least one special character from !@#$%^&*");
    }

    return (
        <Container className="mt-5">
            <div className="row">
                <div className="col-md-12">
                    <img src={app_logo} alt="App-Logo" className="img-fluid centered-horizontally-image" />
                </div>
            </div> 
            <Form className="register_form" onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label  style={{color: "white"}}>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter Username" onChange={(e)=>setUsername(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label  style={{color: "white"}}>Email address</Form.Label>
                    <Form.Control type="text" name="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label  style={{color: "white"}}>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)} onClick={passwordClicked}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label  style={{color: "white"}}>Confirm Password</Form.Label>
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

