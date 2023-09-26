
/*
Users Table The Users table will store information about each user. 
This includes a unique user_id, username, email, and password.
*/
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


/*
Groupchats Table The Groupchats table will store information about each group chat. 
This includes a unique groupchat_id, groupchat_name, and created_by (which is a foreign key referencing user_id in the Users table).
*/
CREATE TABLE Groupchats (
    groupchat_id INT PRIMARY KEY,
    groupchat_name VARCHAR(255) NOT NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);


/*
Messages Table The Messages table will store each message sent in a group chat. 
This includes a unique message_id, message_text, sent_by (which is a foreign key referencing user_id in the Users table), and sent_in (which is a foreign key referencing groupchat_id in the Groupchats table).
*/
CREATE TABLE Messages (
    message_id INT PRIMARY KEY,
    message_text TEXT NOT NULL,
    sent_by INT,
    sent_in INT,
    time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (sent_by) REFERENCES Users(user_id),
    FOREIGN KEY (sent_in) REFERENCES Groupchats(groupchat_id)
);

/*
UserGroups Table stores the information of the groups that the user is associated with.
*/
CREATE TABLE UserGroups (
    user_group_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    groupchat_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (groupchat_id) REFERENCES Groupchats(group_id)
);
/*

This is some of the test data I inserted into the database

   INSERT INTO Users (user_id, username, email, password)
   VALUES 
   (1, 'User1', 'user1@example.com', 'password1'),
   (2, 'User2', 'user2@example.com', 'password2'),
   (3, 'User3', 'user3@example.com', 'password3');

   INSERT INTO Groupchats (groupchat_id, groupchat_name, created_by)
   VALUES 
   (1, 'Groupchat1', 1),
   (2, 'Groupchat2', 2),
   (3, 'Groupchat3', 3);

   INSERT INTO Messages (message_id, message_text, sent_by, sent_in)
   VALUES 
   (1, 'Hello everyone!', 1, 1),
   (2, 'How are you?', 2, 1),
   (3, 'I am good. Thanks!', 3, 1);

*/