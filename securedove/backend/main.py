import uvicorn
import sys
import uuid
import psycopg2
import os


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Union
from secrets import token_hex
from fastapi.middleware.cors import CORSMiddleware
# import sys to get more detailed Python exception info
import sys
# import the connect library for psycopg2
from psycopg2 import connect
# import the error handling libraries for psycopg2
from psycopg2 import OperationalError, errorcodes, errors
#This is the new addition for seperating the API key
from config import API_KEY

#Global variable containing currently logged in user's id. Set to 0 by default when no user is logged in
CURRENT_USER = 0 

# instead of variable parameters we need to use BaseModels for login and register
# anytime that the front end sends data over to the backend we need a BaseModel to match it
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

    

#First Instance of fastapi and the title for the docs page of FASTAPI
app = FastAPI(title="SecureDove Backend")

#Set up for connecting to the database
origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

try:
    #conn = psycopg2.connect('postgres://wjjloedt:JXFCuJI7Di3CtZ-enIemY9J_m8VxNXpZ@berry.db.elephantsql.com/wjjloedt')
    conn = psycopg2.connect(API_KEY)
    print('Connection Success!')
    connectionsucceeded = True
except:
    print("Unable to connect to the database")

# Open a cursor to execute SQL queries
cur = conn.cursor()

#default endpoint for the backend
@app.get("/")
def Default():
    return {"Default": "Test Data For SecureDove CptS 428"}




# ---------------------   LOGIN / USER   ENDPOINTS -----------------------

# Verifies the user and returns a unqiue value for the user so they can use the website
@app.post("/login")
async def login(user: UserLogin):
    print("user:",user.email,"pass:", user.password)
    # Grabbing the row that has the corresponding email 
    try:
        cur.execute(f"SELECT * FROM Users WHERE email = %s", (user.email, ))
        rows = cur.fetchall()
    except:
        print("Email not found, click register to create a new account")
        return {"error": "Email not linked to an account. Please create one."}
     # Checking if the password matches
    if rows != []:
        if rows[0][2] == user.email and rows[0][3] == user.password:
            # we can have a global variable that gets updated with this line below in order to keep track of who's logged in.
            # then, when we need to load messages we can check who's logged in by checking that global variable containing the current user's id. If it's 0 then no one is logged in.
            print(rows[0][0])
            print("Correct Credentials.")
            return {"User_id": rows[0][0]}
        else:
            print("Incorrect Password.")
            return {"error":"Incorrect credentials."}
    print("Email is incorrect or User doesn't Exist")
    return {"error":"User doesn't Exist"}

#Endpoint that adds a user to the Users table
@app.post("/register")
async def register(user: UserRegister):
    try:
        cur.execute(f"INSERT INTO Users (username, email, password) VALUES (%s, %s, %s)", (user.username, user.email, user.password))
        conn.commit()
    except:
        print("Error inserting user to table.")
        return {"error": "Error inserting user to table."}
    
    print("Register success.")
    return {"message": "Register successful!"}

#Deletes user based on user_id p=assed by the frontend by a logged in user
# @app.delete("/delete_user2/{user_id}")
# async def delete_user2(user_id):
#     print("trying to delete user_id=",user_id)
#     try:
#         print(f"DELETE FROM Users WHERE user_id = {user_id};")
#         cur.execute(f"DELETE FROM users WHERE user_id = {user_id};")
#         conn.commit()
#         return {"Successfully deleted user with id=": user_id}
#     except Exception as e:
#         raise HTTPException(status_code=496, detail=str(e))
    
@app.delete("/delete_user/{user_id}")
async def delete_user(user_id):
    print("trying to delete user_id=",user_id)
    try:
        cur.execute(f"SELECT chat_id From Chats WHERE user1_id = %s OR user2_id= %s;", (user_id, user_id))
        rows = cur.fetchall()
        print("rows",rows)
        if rows != []:
            cur.execute(f"DELETE FROM Messages WHERE sent_in = %s;", (rows[0][0]),)
            cur.execute(f"DELETE FROM Chats WHERE user1_id = %s OR user2_id = %s;", (user_id, user_id))
            conn.commit()
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))
    try:
        cur.execute(f"DELETE FROM Invitations WHERE inviter_id = %s OR invitee_id = %s;", (user_id, user_id))
        cur.execute(f"DELETE FROM Users WHERE user_id = %s;", (user_id, ))
        conn.commit()
        return {"message":"Deletion successful!"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# gets username to display on FE
@app.get("/get_username/{user_id}")
async def get_username(user_id):
    print("getting username for user_id=", user_id)
    try:
        cur.execute(f"SELECT username from Users WHERE user_id = %s", (user_id, ))
        rows = cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=496, detail=str(e))
    if rows != []:
        return {"username": rows[0][0]}



# ---------------------   INVITATION ENDPOINTS -----------------------

# View list of invitations for that user based on the user_id. Should only be pending invites in the database
@app.get("/view_invite/{user_id}")
def view_invite(user_id):
    
    try:
        cur.execute(f"SELECT * FROM Invitations where invitee_id = %s", (user_id, )) 
    except:
        print("Could not retrieve any invitations from database")
        return {"error":"Could not retrieve any invitations from database"}
    
    rows = cur.fetchall()
    result = []
    for tup in rows:
        inviter_id = tup[1]
        try:
            cur.execute(f"SELECT username FROM Users where user_id = %s", (inviter_id, )) 
        except:
            print("Could not retrieve any invitations from database")
            return {"error":"Could not retrieve any invitations from database"}
        rows2 = cur.fetchall()
        username = rows2[0][0]
        result.append(tuple([tup[0], username]))
        print("You have an invite from: ", username)
    
    print("You have successfully displayed all of the invites")
    return {"inviters":result}

# Create new invitation to chat from one user to another. 
# newUser is a string that is the user email becuase all emails are unique in the database.
@app.post("/new_invite/{inviter_user_id}/{newUser}")
def new_invite(inviter_user_id, newUser):
    
    print(inviter_user_id, newUser)
    try:
        cur.execute(f"SELECT * FROM Users where email = %s", (newUser, )) 
        rows = cur.fetchall()
        invitee_user_id = rows[0][0]
    except:
        print("Could not retrieve User from database")
        return {"error":"Could not retrieve User from database"}


    try:
        cur.execute(f"INSERT INTO Invitations (inviter_id, invitee_id) VALUES (%s, %s)", (inviter_user_id, invitee_user_id))
        conn.commit()
        return {"message": "Invite sent successfully"}
    except:
        print("Failure inserting into the Invitations table")
        return {"error":"Failure inserting into the Invitations table"}
    


# Decide, Reject or Accept for an existing invite. the decision parameter is a bool so 0 = REJECT and 1 = ACCEPT
# After an invite is rejected it is deleted from the table
# Accepted invites are converted into a new row in the chats table with the two user_id's from the invite and then the accepted invite row is deleted. 
# Only pending invites should be in the table.
@app.post("/decide_invite/{invite_id}/{decision}")
def decide_invite(invite_id, decision):
    # True means the invite was accepted
    print("invite_id", invite_id)
    print("decision", decision)
    if decision == "true":
        print("true")
        try:
            cur.execute(f"SELECT * FROM Invitations where invitation_id = %s", (invite_id, )) 
        except:
            print("Could not retrieve Invitation from database")
            return {"error":"Could not retrieve Invitation from database"}
        rows = cur.fetchall()
    
        user_id1 = rows[0][1]
        user_id2 = rows[0][2]
        print(user_id1, user_id2)

        try:
            cur.execute(f"DELETE FROM Invitations WHERE invitation_id = %s", (invite_id, ))
            conn.commit()
        except:
            print("Could not delete the invitation from the database")
            return {"error":"Could not delete the invitation from the database"}

        try:
            cur.execute(f"INSERT INTO Chats (user1_id, user2_id) VALUES (%s, %s)", (user_id1, user_id2))
            conn.commit()
            return {"message": "Invite accepted successfully"}
        except:
            print("Failure inserting into the Chats table")
            return {"error":"Failure inserting into the Chats table"}
    # Invite was declined
    else:
        print("false")
        try:
            cur.execute(f"DELETE FROM Invitations WHERE invitation_id = %s", (invite_id, ))
            conn.commit()
        except:
            print("Could not delete the invitation from the database")
            return {"error":"Could not delete the invitation from the database"}
        return {"message": "Invite declined successfully"}






# ---------------------   CHAT / MESSAGES   ENDPOINTS -----------------------

# Gives a snapshot of the chats for the side bar of the logged in user. It gives the other user that is in the chat and the last message sent with its timestamp
# Returns all chats for that user based off of user_id. Each chat returned will have the chat_id, Other username, last message sent, last message timestamp
@app.get("/left_bar_chat/{user_id}")
def left_bar_chat(user_id):
    
    cur.execute(f"SELECT username FROM Users WHERE user_id = %s", (user_id))
    rows = cur.fetchall()
    if rows != []:
        username = rows[0][0]
        try:
            #This query matches the chat, user, messages tables and returns all the chats that the user is apart of with both usernames of each chat and the chat_id with the last message in each chat and the timestamp of that message
            cur.execute(f"""
                SELECT 
                    c.chat_id, 
                    u1.username AS user1_username, 
                    u2.username AS user2_username, 
                    COALESCE(m.message_text, NULL) AS last_message, 
                    COALESCE(m.time_sent, NULL) AS last_message_timestamp
                FROM 
                    Chats c
                INNER JOIN 
                    Users u1 ON c.user1_id = u1.user_id
                INNER JOIN 
                    Users u2 ON c.user2_id = u2.user_id
                LEFT JOIN (
                    SELECT 
                        m1.sent_in, 
                        m1.message_text, 
                        m1.time_sent
                    FROM 
                        Messages m1
                    WHERE 
                        m1.time_sent = (
                            SELECT 
                                MAX(m2.time_sent) 
                            FROM 
                                Messages m2 
                            WHERE 
                                m2.sent_in = m1.sent_in
                        )
                ) m ON c.chat_id = m.sent_in
                WHERE 
                    c.user1_id = {user_id} OR c.user2_id = {user_id};
            """)
            rows = cur.fetchall()
            fixedrows = [tuple(ele for ele in sub if ele != username) for sub in rows]
            columns = ["Chat_id", "Other User", "Last Message", "Timestamp"]
            data = [dict(zip(columns, row)) for row in fixedrows]
            return {"left_chat_data": data}
        except Exception as e:
            raise HTTPException(status_code=498, detail=str(e))
    else:
        return {"left_bar_chat" : "Failed, User doesn't exist"}
        

# Loads the chat that is requested and returns username, message, timestamp of each message sent in ORDERED by the time they where sent so from top to bottom is the earilest to latest messages
@app.get("/load_chat/{chat_id}")
def load_chat(chat_id):
    cur.execute(f"""SELECT chat_id FROM chats WHERE chat_id = {chat_id}""")
    rows = cur.fetchall()
    if rows != []:
        try:
            cur.execute(f"""
                SELECT Users.username, Messages.message_text, Messages.time_sent
                FROM Messages
                INNER JOIN Users ON Messages.sent_by = Users.user_id
                WHERE Messages.sent_in = {chat_id}
                ORDER BY Messages.time_sent;
            """)
            rows = cur.fetchall()
            columns = ["Sender Username", "Message", "Timestamp"]
            data = [dict(zip(columns, row)) for row in rows]
            return {"chat_data": data}
        except Exception as e:
            raise HTTPException(status_code=499, detail=str(e))
    else:
        return {"ERROR": "chat identifier doesn't exist"}


# Sends a message to the database, if insertion fails an error will be sent back
#possible secuirty isuses are sql injection and content checking of the content variable for overflow and malicous code 
@app.post("/send_message/{user_id}/{chat_id}/{content}")
def send_message(user_id, chat_id, content):
    try:
        cur.execute(f"""
             INSERT INTO messages (message_text, sent_by, sent_in)
             VALUES (%s, %s, %s);
        """, (content, user_id, chat_id))
        conn.commit()
        return {"message": "Message sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=498, detail=str(e))
    

#For debug uses but this deletes a message when given message_id
@app.delete("/delete_message")
def delete_message(message_id: int):
    try:
        cur.execute(f"DELETE FROM messages WHERE message_id = {message_id};")
        conn.commit()
        return {"message": "Message deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=497, detail=str(e))

