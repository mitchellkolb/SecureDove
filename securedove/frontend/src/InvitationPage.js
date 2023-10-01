import React from "react";
import { Container, Button, Card} from 'react-bootstrap';

const InvitationPage = () => {
    // We can modify this to get the invitations from our database
    const invitations = [
        {id:1, sender: 'Flavio'},
        {id:2, sender: 'Mitchell'},   
        {id:3, sender: 'Ali'},
        {id:4, sender: 'Jaysen'},  
    ];
    
    return (
        <div>
            <Container className="mt-5">
                {invitations.map((invitation) => (
                    <Card key={invitation.id} className="mb-3">
                        <Card.Body>
                            <Card.Text>
                                You have received an invitation from {invitation.sender}. Do you want to accept or decline?
                            </Card.Text>
                            <Button variant="success" >Accept</Button>
                            <Button variant="danger" className="ms-2">Decline</Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
            <Button href="/messages">Back to Homepage</Button>
        </div>

        
    );
}
    
export default InvitationPage;