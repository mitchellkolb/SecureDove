import React, {useState} from "react";
import './Messages.css'
import {Container, Form, Button} from 'react-bootstrap'

import app_logo from './securedovelogo.png'

function Messages() {
    const [dbInfo, setDbInfo] = useState("");
    const [messageId, setMessageId] = useState(0);

    async function fetchDBInfo() {
        const response = await fetch(`http://localhost:8000/get_DB_info?message_id=${messageId}`);
        const data = await response.json();
        setDbInfo(data.data[0][0]);
    }

    function handleMessageIdChange(event) {
        setMessageId(event.target.value);
    }

    return (
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
    );
};

export default Messages;
