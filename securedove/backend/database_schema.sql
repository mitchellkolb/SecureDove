
-- ------------------------------------------------------------------------------------------------
/*
Users Table The Users table will store information about each user. 
This includes a unique user_id, username, email, and password.
Email is set to no null and unique so searches should be done with email and not username
*/
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

/*
Messages Table The Messages table will store each message sent in a chat. 
This includes a unique message_id, message_text, sent_by (which is a foreign key referencing user_id in the Users table), and sent_in (which is a foreign key referencing the chat_id in the Chats table).
*/
CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    message_text VARCHAR(1000) NOT NULL,
    sent_by INT,
    sent_in INT,
    time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sent_by) REFERENCES Users(user_id),
    FOREIGN KEY (sent_in) REFERENCES Chats(chat_id)
);

/*
Chats Table The Chats table will store information about each chat. 
This includes a unique chat_id, and the two users involved in the chat (user1_id and user2_id, both of which are foreign keys referencing user_id in the Users table).
*/
CREATE TABLE Chats (
    chat_id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    FOREIGN KEY (user1_id) REFERENCES Users(user_id),
    FOREIGN KEY (user2_id) REFERENCES Users(user_id)
);

/*
Invitations table will store information about when one user wants to start a new direct message chat with another user.
This stores the information about invitations. This table would have the following fields:

    invitation_id: a unique identifier for each invitation.
    inviter_id: the user who sent the invitation. This is a foreign key referencing user_id in the Users table.
    invitee_id: the user who received the invitation. This is also a foreign key referencing user_id in the Users table.
    chat_id: the chat that the invitation is for. This is a foreign key referencing chat_id in the Chats table.
    status: the status of the invitation. This could be 'pending', 'accepted', or 'denied'. Once an item is accepted it should be removed shortly after.
*/
CREATE TABLE Invitations (
    invitation_id SERIAL PRIMARY KEY,
    inviter_id INT NOT NULL,
    invitee_id INT NOT NULL,
    chat_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (inviter_id) REFERENCES Users(user_id),
    FOREIGN KEY (invitee_id) REFERENCES Users(user_id),
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id)
);

/*
--This is some test data just so others can see how you don't need to specify the id columns becuase they auto increment


INSERT INTO Users (username, email, password)
VALUES 
('User1', 'user1@example.com', 'password1'),
('User2', 'user2@example.com', 'password2'),
('User3', 'user3@example.com', 'password3'),
('User4', 'user4@example.com', 'password4'),
('User6', 'user6@example.com', 'password6'),
('User5', 'user5@example.com', 'password5'),
('2', '3@email.com', 'pass1'),
('User7', 'User7@email.com', 'Password'),
('flavalv', 'f.alvarezpenate@wsu.edu', 'test'),
('mdzulfiq', 'm.dzulfiqar@wsu.edu', 'dragon123'),
('mdzulfiq', 'test@wsu.edu', 'testing'),
('user36', 'user36@email.com', 'test1');

INSERT INTO Chats (user1_id, user2_id)
VALUES 
(1, 2),
(3, 4),
(5, 6);

INSERT INTO Messages (message_text, sent_by, sent_in, time_sent)
VALUES 
('Hello everyone!', 1, 1, '2023-09-24 04:56:42 +0000'),
('How are you?', 2, 1, '2023-09-24 04:57:42 +0000'),
('I am good. Thanks!', 3, 2, '2023-09-24 04:58:42 +0000'),
('Welcome to SecureDove!', 4, 2, '2023-09-24 04:59:42 +0000');

INSERT INTO Invitations (inviter_id, invitee_id, chat_id, status)
VALUES 
(1, 3, 1, 'pending'),
(2, 4, 2, 'accepted'),
(3, 5, 3, 'denied');

*/



/*

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Chats (
    chat_id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    FOREIGN KEY (user1_id) REFERENCES Users(user_id),
    FOREIGN KEY (user2_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    message_text VARCHAR(1000) NOT NULL,
    sent_by INT,
    sent_in INT,
    time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sent_by) REFERENCES Users(user_id),
    FOREIGN KEY (sent_in) REFERENCES Chats(chat_id)
);

CREATE TABLE Invitations (
    invitation_id SERIAL PRIMARY KEY,
    inviter_id INT NOT NULL,
    invitee_id INT NOT NULL,
    chat_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (inviter_id) REFERENCES Users(user_id),
    FOREIGN KEY (invitee_id) REFERENCES Users(user_id),
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id)
);
*/

 