// db.js
const spicedPg = require('spiced-pg');

const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/socialmedia');

exports.addUsers = function addUsers(first, last, email, password) {
    return db.query('INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [ first, last, email, password]);
};
module.exports.getSignedUser = function getSignedUser(email) {
    return db.query('SELECT password, id FROM users WHERE email = $1', [email]);
};
module.exports.getUser = function (id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};
module.exports.addProfilePic = function addProfilePic(id, image_url) {
    return db.query('UPDATE users SET image_url = $2 WHERE id = $1 RETURNING *',
        [id, image_url]);
};
module.exports.addBio = function addBio(id, bio) {
    return db.query('UPDATE users SET bio = $2 WHERE id = $1 RETURNING *',
        [id, bio]);
};

module.exports.getOtherUser = function (id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// findfriends
module.exports.searchUser = function searchUser(val) {
    return db.query('SELECT first, last, id, bio, image_url FROM users WHERE first ILIKE $1 OR last ILIKE $1 LIMIT 5',
        [val + '%']);
};
// find recent friends
module.exports.recentUsers = function recentUsers() {
    return db.query('SELECT first, last, id, image_url FROM users ORDER BY id DESC LIMIT 3',);
};
//button
module.exports.friendshipCheck = function friendRequest(receiver_id, sender_id) {
    return db.query('SELECT * FROM friendships WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)',
        [receiver_id, sender_id]);
};

exports.friendRequest = function friendRequest(receiver_id, sender_id) {
    return db.query('INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2)',
        [receiver_id, sender_id]);
};
exports.friendshipMade = function friendshipMade(receiver_id, sender_id) {
    return db.query('UPDATE friendships SET accepted = true WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)',
        [receiver_id, sender_id]);
};

exports.deleteFriendRequest = function deleteFriendRequest(receiver_id, sender_id) {
    return db.query('DELETE FROM friendships WHERE receiver_id = $1 AND sender_id = $2 OR receiver_id = $2 AND sender_id = $1',
        [receiver_id, sender_id]);
};
//reduxPromise
exports.friendsInProcess = function friendsInProcess(receiver_id) {
    return db.query(
        `
  SELECT users.id, first, last, image_url, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`,[receiver_id]);};

//chat
exports.getLastTen = function getLastTen() {
    return db.query(
        `
  SELECT *, chat.id AS chat_id, users.id AS users_id
  FROM chat JOIN users ON (sender_id = users.id) WHERE receiver_id IS NULL ORDER BY chat_id DESC LIMIT 10
`,[]);};

//
exports.sendMessage = function sendMessage(sender_id, message) {
    return db.query(
        `
  INSERT INTO chat (sender_id, message) VALUES ($1, $2) RETURNING *
`,[sender_id, message]);};

// PRIVATE
exports.getDMs = function getDMs(sender_id, receiver_id) {
    return db.query(
        `
  SELECT *, chat.id AS chat_id, users.id AS users_id
  FROM chat JOIN users ON (sender_id = users.id)
  WHERE (receiver_id = $1 AND sender_id = $2)
  OR (receiver_id = $2 AND sender_id = $1)
  ORDER BY chat_id DESC LIMIT 10
`,[sender_id, receiver_id]);};

//
exports.sendPMessage = function sendPMessage(sender_id, receiver_id, message) {
    return db.query(
        `
  INSERT INTO chat (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *
`,[sender_id, receiver_id, message]);};
// SELECT * FROM users WHERE id= ANY($1)
