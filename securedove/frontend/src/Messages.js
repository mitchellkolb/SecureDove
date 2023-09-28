import React, {useState, useEffect} from "react";
import {Container, Form, Button} from 'react-bootstrap'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faUserFriends,faSignOutAlt, faCircle, faComments, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal'; // for delete pop up
import { useHistory } from "react-router-dom"; // for redirecting 
import './Messages.css';
import api from './api'; // fetch origin of fastapi backend

import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBTypography,
    MDBInputGroup,
  } from "mdb-react-ui-kit";

const Messages = (props) => {

    const [dbInfo, setDbInfo] = useState("");
    const [messageId, setMessageId] = useState(0);
    // For settings
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // For delete account modal
    const [showModal, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);

    // for redirecting to log in page
    const history = useHistory();

    const handleLogout = async(e) => {
        console.log("Inside logout");
        e.preventDefault();
        try{
            const response = await api.post('/logout');
            if (response.data.message === 'Logout successful!'){
                console.log("Logging out.");
                alert('Logging out.');
                history.push('/login')
            }
        }
        catch(error){
            console.error('Logout timed out:', error);
            alert("Request timed out! Please try again.");
        }
    }

    // delete account for backend
    const handleDeleteAccount = async(e) => {
        // REACHING BACKEND TO DELETE A USER. CODE IMPLEMENTED ON FE SIDE ALREADY. UNCOMMENT WHEN BE IS FINISHED WITH /DELETE ENDPOINT
        e.preventDefault();
        try {
            const response = await api.post('/delete_user');
            if (response.data.message === 'Deletion successful!') {
                console.log("Delete Successful.")
                alert('Account deleted!');
                // close pop up windows and sidebar
                handleModalClose();
                handleClose();
                // redirect to app register page
                history.push('/register');
            }
        } 
        catch (error) {
            console.error('Delete failed:', error);
            alert("Error deleting account. Please try again.")
        }
    };

    // LOAD ACTIVE CHATS AND MESSAGES FOR CHAT THATS OPENED
    // const [activeChats, setActiveChats] = useState([]);
    // useEffect(() => {
    // // send request to endpoint to load active conversations
    //     async function fetchActiveChats() {
    //         try {
    //             const response = await api.get('/get_active_chats'); // needs to be changed to FastAPI endpoint name
    //             setActiveChats(response.data);
    //         } 
    //         catch (error) {
    //             console.error('Error loading active chats:', error);
    //         }
    //     }
    //     // call function for the first time when component loads
    //     fetchActiveChats();
    //     // call fetchActiveChats() every 1000 milliseconds (or every 1 second)
    //     const activeChatsInterval = setInterval(fetchActiveChats, 1000);
    //     // turn off interval when app closes.
    //     return () => {
    //         clearInterval(activeChatsInterval);
    //     };
    // }, []);

    // const [currMessages, setCurrMessages] = useState([]);
    // useEffect(() => {
    // // Function to fetch data from the FastAPI endpoint
    //     async function fetchCurrMessages() {
    //         // need a way to know which conversation the user has clicked on in order to load the right messages
    //         try {
    //             // this endpoints needs to return an array with each item having this format:
    //             //{message_id, sender/receiver username, message_text, timestamp, isSender bool (true for sender, false for receiver)}
    //             const response = await api.get('/get_messages'); // needs to be changed to FastAPI endpoint name
    //             setCurrMessages(response.data);
    //         } 
    //         catch (error) {
    //             console.error('Error loading messages:', error);
    //         }
    //     }
    //     // might be beneficial to move the right side of the ui that displays the message history to a different component.
    //     fetchCurrMessages();
    //     const currMessagesInterval = setInterval(fetchCurrMessages, 1000);

    //     return () => {
    //         clearInterval(currMessagesInterval);
    //     };
    // }, []);


    async function fetchDBInfo() {
        const response = await fetch(`http://localhost:8000/get_DB_info?message_id=${messageId}`);
        const data = await response.json();
        setDbInfo(data.data[0][0]);
    }

    function handleMessageIdChange(event) {
        setMessageId(event.target.value);
    }

    {/* Can be modified to fetch get messages from the backend database */}
    const messages = [
        {
          id: 1,
          sender: 'Sender Name',
          text: 'Hello!',
          timestamp: '12:12 PM | Sep 25',
          isSender: true, // We check to see if the message is sent by the current user
        },
        {
          id: 2,
          sender: 'Receiver Name',
          text: 'Hi, wassup?',
          timestamp: '12:16 PM | Sep 25',
          isSender: false,
        },
        {
          id: 3,
          sender: 'Sender Name',
          text: 'Not much!',
          timestamp: '12:22 PM | Sep 25',
          isSender: true,
        },
        {
            id: 4,
            sender: 'Sender Name',
            text: 'You wanna grab lunch with me?',
            timestamp: '12:23 PM | Sep 25',
            isSender: true,
        },
        {
            id: 5,
            sender: 'Sender Name',
            text: '??',
            timestamp: '12:23 PM | Sep 25',
            isSender: true,
        },
        {
            id: 6,
            sender: 'Receiver Name',
            text: "Sure! I'm am down",
            timestamp: '12:29 PM | Sep 25',
            isSender: false,
        },
        {
            id: 7,
            sender: 'Receiver Name',
            text: "what time and where?",
            timestamp: '12:29 PM | Sep 25',
            isSender: false,
        },
        
      ];

    return (
        <>
        {/* <Container className="mt-5">
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
            </Container> */}
        <MDBContainer fluid className="py-5" style={{ backgroundColor: "#2a303" }}>
            <MDBRow>
                <MDBCol md="12">
                    <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
                        <MDBCardBody>
                            <div className="chat-container">
                                {/* 1st column: Chat panel (left side) */}
                                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                                    <div className="settings-container">
                                        <button variant="primary" onClick={handleShow} className="btn_settings">
                                            <FontAwesomeIcon icon={faCog} /> 
                                        </button>
                                        {/* This if for the settings interface */}
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
                                                        <Button className="btn btn-primary" style={{ width: '200px' }} onClick={handleLogout}>
                                                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2"/>
                                                                Logout
                                                        </Button>
                                                                
                                                    </Container>
                                                </Navbar>
                                                <br/>

                                                <Navbar className="bg-body-tertiary">
                                                    <Container>
                                                        <Button variant="danger" style={{ width: '200px' }} onClick={handleModalShow}>
                                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                                                Delete Account
                                                        </Button>         
                                                    </Container>

                                                    <Modal show={showModal} onHide={handleModalClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Warning</Modal.Title>
                                                        </Modal.Header>

                                                        <Modal.Body>
                                                            <p>Are you sure you would like to delete your account? This process cannot be reversed.</p>
                                                        </Modal.Body>

                                                        <Modal.Footer>
                                                            <Button variant="danger"  onClick={handleDeleteAccount} >Yes, delete my account permanently. </Button>
                                                            <Button variant="secondary" onClick={handleModalClose}>No, keep my account.</Button>
                                                        </Modal.Footer>
                                                    </Modal>                                        
                                                </Navbar>
                                            </Offcanvas.Body>
                                        </Offcanvas>
                                    </div>

                                    {/* Chat panel */}
                                    <div className="p-3">
                                        <MDBInputGroup className="rounded mb-3">
                                            <input className="form-control rounded" placeholder="Search" type="search"/>
                                        </MDBInputGroup>

                                        <MDBTypography listUnStyled className="mb-0" >
                                            {/* Friend 1 */}
                                            <li className="p-2 border-bottom">                                            
                                                <a href="#chat1" className="d-flex justify-content-between">
                                                    <div className="d-flex flex-row">
                                                        <div>
                                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" className="d-flex align-self-center me-3"
                                                                width="80"/>
                                                            <span className="badge bg-success badge-dot"></span>
                                                        </div>
                                                        
                                                        <div className="pt-1">
                                                            <p className="fw-bold mb-0">Tom Cruise</p>
                                                            <p className="small text-muted"> Hi, wassup?</p>
                                                        </div>
                                                    </div>
                                                    <div className="pt-1">
                                                        <p className="small text-muted mb-1">Just now</p>
                                                        <span className="badge bg-danger rounded-pill float-end">3</span>
                                                    </div>
                                                </a>
                                            </li>

                                            {/* Friend 2 */}
                                            <li className="p-2 border-bottom">
                                                <a href="#chat2" className="d-flex justify-content-between">
                                                    <div className="d-flex flex-row">
                                                        <div>
                                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" className="d-flex align-self-center me-3"
                                                            width="60"/>
                                                            <span className="badge bg-warning badge-dot"></span>
                                                        </div>
                                                        <div className="pt-1">
                                                            <p className="fw-bold mb-0">Megan Fox</p>
                                                            <p className="small text-muted">Yoo bro</p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-1">
                                                        <p className="small text-muted mb-1"> 5 mins ago</p>
                                                        <span className="badge bg-danger rounded-pill float-end"> 2</span>
                                                    </div>
                                                </a>
                                            </li>
                                        </MDBTypography>
                                    </div>
                                </MDBCol>

                                {/* 2nd column: Chat window (individual messages) */}
                                <MDBCol md="6" lg="7" xl="8" style={{ backgroundColor: "#eee" }}>
                                    {/* Can be modified to fetch get messages from the backend database */}
                                    {/* We map over the array to render messages */}

                                    {/* Use overflow to make messages scrollable */}
                                    <div className="chat-messages" style={{ maxHeight: '900px', overflowY: 'auto' }}>
                                        {messages.map((message) => (
                                            // It the messages is sent by current user, we justify-content-start
                                            // But if the messages is received by current user, we justify-content-end
                                            <div key={message.id} className={`d-flex flex-row justify-content-${message.isSender ? 'start' : 'end'}`}>
                                                {message.isSender ? (
                                                    <img
                                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                        style={{ width: "45px", height: "100%" }}
                                                        alt="Sender Avatar"/>                                                
                                                    ) : (

                                                    <img
                                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                        style={{ width: "45px", height: "100%" }}
                                                        alt="Receiver Avatar"/>
                                                    )}
                                                    
                                                    {/* Show green background chat if it's a message sent by current user */}
                                                    <div>
                                                        <p className={`small p-2 ms-3 mb-1 rounded-3 ${message.isSender ? 'bg-success' : 'bg-primary'}`}>
                                                            {message.text}
                                                        </p>

                                                        <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                                            {message.timestamp}
                                                        </p>
                                                    </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                                        <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                            style={{ width: "40px", height: "100%" }}/>

                                        {/* Message input field */}
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="exampleFormControlInput2"
                                            placeholder="Type message"/>

                                        <a className="ms-1 text-muted" href="#Attachment">
                                            <MDBIcon fas icon="paperclip" />
                                        </a>
                                        <a className="ms-3 text-muted" href="#emoji">
                                            <MDBIcon fas icon="smile" />
                                        </a>
                                        <a className="ms-3" href="#!">
                                            <MDBIcon fas icon="paper-plane" />
                                        </a>
                                    </div>
                                </MDBCol>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    </>
    );
};

export default Messages;
