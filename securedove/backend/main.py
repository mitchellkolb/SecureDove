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
    #Should really put line 50 into a secure file that doesn't go on github but until everyone can run this code i'll leave it in the file as is. Security wise this is bad procedure
    conn = psycopg2.connect('postgres://wjjloedt:JXFCuJI7Di3CtZ-enIemY9J_m8VxNXpZ@berry.db.elephantsql.com/wjjloedt')
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

#This is a endpoint that allow you to query the database at a certain index that is passed in at the frontend by the user in messages.js
@app.get("/get_DB_info")
def get_DB_info(message_id: int):
    if message_id > 4:
         rows = [('We dont have messages at that index right now. Try 1-4',)]
         return {"data": rows}
    else:
        cur.execute(f"SELECT message_text FROM Messages WHERE message_id = {message_id};")
        rows = cur.fetchall()
        print(rows)
        return {"data": rows}

@app.post("/new_groupchat")
async def new_groupchat(groupchat_name: str, created_by: int):
    #Looping through Groupchats until we find the lowest available groupchat_id number
    cur.execute(f"SELECT * FROM Groupchats")
    rows = cur.fetchall()
    i = 1
    for row in rows:
         if i == row[0]:
            i = i + 1
            continue
         else:
              break
    groupchat_id = i

    #Inserting into the database
    cur.execute(f"INSERT INTO Groupchats (groupchat_id, groupchat_name, created_by) VALUES ({groupchat_id}, '{groupchat_name}', '{created_by}')")
    conn.commit()
    return {"success": True}

@app.post("/login")
async def login(user: UserLogin):
    print("user:",user.email,"pass:", user.password)
    # Grabbing the row that has the corresponding email 
    try:
        cur.execute(f"SELECT * FROM Users WHERE email = '{user.email}'")
    except:
        print("Email not found, click register to create a new account")
        return {"error": "Email not linked to an account. Please create one."}
    rows = cur.fetchall()

    # Checking if the password matches
    if rows[0][3] == user.password:
        # we can have a global variable that gets updated with this line below in order to keep track of who's logged in.
        # then, when we need to load messages we can check who's logged in by checking that global variable containing the current user's id. If it's 0 then no one is logged in.
        global CURRENT_USER
        CURRENT_USER = rows[0][0] # update current logged in user to this user_id. We will reference this for deleting an user and showing groupchats.
        print("CURRENT_USER", CURRENT_USER)
        print("Correct Credentials.")
        return {"message":"Login successful!"}
    else:
        print("Incorrect Credentials.")
        return {"error":"Incorrect credentials."}

#Endpoint that adds a user to the Users table
@app.post("/register")
async def register(user: UserRegister):
    #Looping through Users until we find the lowest available user_id number
    try:
        cur.execute("SELECT user_id FROM Users ORDER BY user_id DESC LIMIT 1;") # selects the last user_id in the Users table
    except:
        print("Could not retrieve Users table.")
        return {"error": "Couldn't load database."}
    row = cur.fetchall()
    # row returns as [(8,)] or whatever the latest value is
    next_id = row[0][0]+1
    try:
        cur.execute(f"INSERT INTO Users (user_id, username, email, password) VALUES ({next_id}, '{user.username}', '{user.email}', '{user.password}');")
        conn.commit()
    except:
        print("Error inserting user to table.")
        return {"error": "Error inserting user to table."}
    
    print("Register success.")
    return {"message": "Register successful!"}

# endpoint to reset CURRENT_USER when user logs out
@app.post("/logout")
async def logout():
    global CURRENT_USER
    CURRENT_USER = 0
    print("CURRENT USER:", CURRENT_USER)
    return {"message":"Logout successful!"}

#Endpoint that deletes a user from the Users table
# @app.delete("/delete_user")
# def delete_user(username: str):
#     cur.execute(f"SELECT username FROM Users")
#     rows = cur.fetchall()
#     if(username in rows):
#         # Delete user based on username input
#         cur.execute(f"DELETE FROM Users WHERE username = '{username}';")
#         conn.commit()
#         return {"accountDeletion":"Success"}
#     return {"accountDeletion": "Failed"}

#Deletes user based on CURRENT_USER global variable, then resets it to 0
@app.post("/delete_user")
async def delete_user():
    global CURRENT_USER
    # print("inside delete")
    print("CURRENT USER",CURRENT_USER)
    if (CURRENT_USER!=0):
        try:
            # print("before query")
            cur.execute(f'DELETE FROM Users WHERE user_id = {CURRENT_USER};')
            conn.commit()
            # print("after query")
        except:
            print("Error deleting user.")
            return{"error": "Error accessing database."}
        print("Successfully deleted user with id=", CURRENT_USER)
        CURRENT_USER = 0
        return {"message": "Deletion successful!"}
    else:
        print("No user is currently logged in.")
        return {"error": "No user is currently logged in."}
    
# Invite User
@app.post("/invite_user")
def invite_user(user_id):
    # Checks if current user_id matches Groupchats.created by'
    cur.execute(f"SELECT * FROM Groupchats where groupchat_id = {CURRENT_USER}")
    rows = cur.fetchall()
    print(rows[0][3])
    if(CURRENT_USER == rows[0][3]):
        cur.execute(f"SELECT user_id FROM UserGroups")
        rows = cur.fetchall()
        if(user_id not in rows):
            cur.execute(f"INSERT INTO UserGroups where user_id = {user_id}")
            conn.commit()
            return {"inviteUser": "Success"}
        return {"inviteUser": "Failed"}
    else:
        print("User is not authorized to invite users")

# Exit groupchat
@app.post("/exit_groupchat")
def exit_groupchat():
    # Queries user_id in UserGroups
    cur.execute(f"SELECT user_id FROM UserGroups")
    rows = cur.fetchall()
    if(CURRENT_USER in rows):
        cur.execute(f"DELETE FROM UserGroups WHERE user_id = {CURRENT_USER}")
        conn.commit()
        return {"exitChat" : "Success"}
    return {"exitChat" : "Failed"}

# Accepts user to join usergroup
@app.post("/join_groupchat")
def join_groupchat():
    # Checks current users' user_id
    cur.execute(f"SELECT user_id FROM Users")
    rows = cur.fetchall()
    if(CURRENT_USER in rows):
        cur.execute(f"INSERT INTO UserGroups WHERE user_id = {CURRENT_USER}")
        conn.commit()
        return {"acceptInvite" : "Success"}
    return {"exitChat" : "Failed"}

# Return to print the reject message
def reject_invite():
    print("PRINT TO UI: Invitation Rejected")

#
# Gives a snapshot of the chats for the side bar of the logged in user. It gives the other user that is in the chat and the last message sent with its timestamp
# Returns all chats for that user based off of user_id. Each chat returned will have the chat_id, Other username, last message sent, last message timestamp
@app.get("/left_bar_chat")
def left_bar_chat(user_id: int):
    
    cur.execute(f"SELECT username FROM Users WHERE user_id = {user_id}")
    rows = cur.fetchall()
    if rows != []:
        username = rows[0][0]
        print(username)
        try:
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
            print(rows)
            fixedrows = [tuple(ele for ele in sub if ele != username) for sub in rows]
            print("okay")
            print(fixedrows)
            columns = ["Chat_id", "Other User", "Last Message", "Timestamp"]
            data = [dict(zip(columns, row)) for row in fixedrows]
            return {"left_chat_data": data}
        except Exception as e:
            raise HTTPException(status_code=498, detail=str(e))
    else:
        return {"left_bar_chat" : "Failed, User doesn't exist"}
        
            


# Loads the chat that is requested and returns username, message, timestamp of each message sent in ORDERED by the time they where sent so from top to bottom is the earilest to latest messages
@app.get("/load_chat")
def load_chat(chat_id: int):
    cur.execute(f"""SELECT chat_id FROM chats WHERE chat_id = {chat_id}""")
    rows = cur.fetchall()
    print(rows)
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
@app.post("/send_message")
def send_message(user_id: int, chat_id: int, content: str):
    try:
        cur.execute(f"""
             INSERT INTO messages (message_text, sent_by, sent_in)
             VALUES ('{content}', {user_id}, {chat_id});
        """)
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

