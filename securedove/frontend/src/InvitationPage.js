import React, {useState, useEffect} from "react";
import { Container, Button, Card} from 'react-bootstrap';
import {user_id} from "./Login";
import api from "./api";

const InvitationPage = ({onClose}) => {
    const [invitations, setInvitations] = useState([]);
    useEffect(() => {
        async function getInvitations(){
            const invArr = [];
            // send request to endpoint to load active conversations
            try{
                const response = await api.get(`view_invite/${user_id}`)
                if (response.data.inviters !== undefined){
                    for (let i = 0; i < response.data.inviters.length; i++){
                        const inv = {
                            id: response.data.inviters[i][0],
                           sender: response.data.inviters[i][1]
                        };
                        invArr.push(inv);
                    }
                    setInvitations(invArr);
                    console.log(invArr);
                }
                else{
                    console.log("No invitations")
                }
            }
            catch (error) {
                console.error("Get invitations failed:", error);
            }
        }

        getInvitations();

    }, []);
    
    async function handleAccept(invite_id){
        const decision = true;
        try{
            const response = await api.post(`/decide_invite/${invite_id}/${decision}`)
            if (response.data.message === "Invite accepted successfully"){
                alert("Invite accepted.");
            }
        }
        catch(error){
            console.log("Error accepting invite:", error);
            alert("Couldn't accept. Try again.")
        }
    }

    async function handleDecline(invite_id){
        const decision = false;
        try{
            const response = await api.post(`/decide_invite/${invite_id}/${decision}`)
            if (response.data.message === "Invite declined successfully"){
                alert("Invite declined.");
            }
        }
        catch(error){
            console.log("Error declining invite:", error);
            alert("Couldn't decline. Try again.")
        }
    }
    return (
        <div>
            <Container className="mt-0">
                {invitations.map((invitation) => (
                    <Card key={invitation.id} className="mb-0">
                        <Card.Body>
                            <Card.Text>
                                You have received an invitation from {invitation.sender}. Do you want to accept or decline?
                            </Card.Text>
                            <Button variant="success" style={{ width: '150px' }} onClick>Accept</Button>
                            <Button variant="danger"style={{ width: '150px' }} onClick>Decline</Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
            <Button onClick={onClose}className="mt-3">Close</Button>
        </div>

        
    );
}
    
export default InvitationPage;