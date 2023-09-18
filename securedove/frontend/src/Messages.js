import React, {useState} from "react";
import './Messages.css';
import {Container, Form, Button} from 'react-bootstrap'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faUserFriends,faSignOutAlt, faCircle, faComments } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';


import app_logo from './securedovelogo.png'

function Messages() {

    const [dbInfo, setDbInfo] = useState("");
    const [messageId, setMessageId] = useState(0);
    // For settings
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function fetchDBInfo() {
        const response = await fetch(`http://localhost:8000/get_DB_info?message_id=${messageId}`);
        const data = await response.json();
        setDbInfo(data.data[0][0]);
    }

    function handleMessageIdChange(event) {
        setMessageId(event.target.value);
    }

    return (
        <>
            <Container className="mt-5">
                <div className="row">
                    <div className="col-md-12">
                        <img src={app_logo} alt="App-Logo" className="img-fluid centered-horizontally-image" />
                    </div>
                </div> 
                <Form.Group className="mb-3" controlId="formBasicMessageId">
                    <Form.Label>Message ID</Form.Label>
                    <Form.Control type="number" placeholder="Enter Message ID" onChange={handleMessageIdChange} />
                </Form.Group>

                <Button onClick={fetchDBInfo}>Get DB Info</Button>
                <p>{dbInfo}</p>
            </Container>

            {/* This if for the settings interface */}

            <button variant="primary" onClick={handleShow} className="btn_settings">
                <FontAwesomeIcon icon={faCog} /> 
            </button>

            <button variant="primary" className="btn_chats">
                <FontAwesomeIcon icon={faComments} /> 
            </button>

            <button variant="primary" className="btn_friends">
                <FontAwesomeIcon icon={faUserFriends} /> 
            </button>

            {/* Show the off-canvas setting menu from the left of the screen */}
            <Offcanvas show={show} onHide={handleClose} className="off_canvas">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="off_canvas_title">Settings</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="off_canvas_body">

                    <Navbar className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand href="#home">
                                <FontAwesomeIcon icon={faCircle} style={{ color: 'green' }} /> 
                                     Name
                                    (Active)
                            </Navbar.Brand>
                        </Container>
                        
                    </Navbar>
                    <br/>
                    
                    <Navbar className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand href="#home">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                    Profile
                            </Navbar.Brand>
                        </Container>
                            
                    </Navbar>
                    <br/>
                    
                    
                    <Navbar className="bg-body-tertiary">
                        <Container>
                            <Link to="/" className="link_logout">
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                    Logout
                            </Link>
                                    
                        </Container>
                    </Navbar>
                    
                </Offcanvas.Body>
            </Offcanvas>

        </>
    );
};

export default Messages;
