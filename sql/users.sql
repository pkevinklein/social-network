
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio VARCHAR(255),
    image_url VARCHAR,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    receiver_id INT NOT NULL REFERENCES users(id),
    sender_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT FALSE
);
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (4, 2, true), (5, 2, false), (2, 6, true), (2, 7, false);

DROP TABLE IF EXISTS chat;
CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
