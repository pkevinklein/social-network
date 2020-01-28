const express = require('express');
const app = express();
const compression = require('compression');
const csurf = require ("csurf");
const db =require("./utils/db.js");
const cookieSession = require("cookie-session");
const {hash, compare} = require("./utils/bc");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require("./s3");
const {s3Url} = require("./config");
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
module.exports = app;

app.use(express.static("./public"));
app.use(compression());
app.use(express.json());

//cookie session goes here
const cookieSessionMiddleware = (cookieSession({
    secret: "I'm always hungry",
    maxAg: 1000 * 60 * 60 * 24 * 24
}));

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get('/welcome', function(req, res) {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


// WITH ASYNC / AWAIT
app.post('/registration', async (req, res) => {
    const {first, last, email, password} = req.body;
    try {
        let hashedPassword = await hash(password);
        // console.log(hash);  // hash would be defined right here
        let {rows} = await db.addUsers(first, last, email, hashedPassword);
        req.session.userId = rows[0].id;
        res.json({
            success: true
        });
    } catch(e) {
        res.json({
            success: false
        });
        console.log('e in post registration: ', e);
    }
});
//find PEOPLE
app.get('/users/:val?', (req, res) => {
    const { val } = req.params;
    if (val) {
        db.searchUser(val)
            .then(({ rows }) => {
                console.log('rows in searchUser: ', rows);
                res.json(rows);
            })
            .catch(err => {
                console.log('error in index searchUser: ', err);
            });
    } else { //recent users
        db.recentUsers()
            .then(({ rows }) => {
                console.log('rows index findpeople:: ', rows);
                res.json(rows);
            })
            .catch(err => {
                console.log('error in else index findpeople:', err);
            });
    }
});
// app.get("/api/find-people", async (req, res) =>{
//     let {val} = req.params;
//     console.log("anything is happening");
//     try{
//         let {rows} = await db.searchUser(val);
//         res.json(rows);
//         console.log(rows);
//     } catch(error){
//         console.log("error in findpeopleindex: ", error);
//     }
// });
//find recent PEOPLE
// app.get("/api/find-people", async (req, res) =>{
//     // let {} = somethig;
//     try{
//         let {rows} = await db.recentUsers();
//         res.json(rows);
//         console.log(rows);
//     } catch(error){
//         console.log("error in findrecentusers index: ", error);
//     }
// });


app.post("/login", (req,res)=>{
    const {email, password} = req.body;
    if (email == "" || password == ""){
        res.redirect("/login");
    } else{
        db.getSignedUser(email).then(({rows})=>{
            let hashedPassword = rows[0].password;
            // console.log("user's info:", rows, hashedPassword);
            compare(password, hashedPassword)
                .then(match =>{
                    console.log("comparison made", match);
                    if (match){
                        let id = rows[0].id;
                        req.session.userId = id;
                        res.json({
                            success: true
                        });
                    }
                    else {
                        res.json({
                            success: false
                        });
                    }
                }).catch(err =>{
                    console.log("match error: ", err);
                });
        });
    }
});
// user information

app.get('/user.json', async (req, res) => {
    // console.log('user route');
    try {
        const {rows} = await db.getUser(req.session.userId);
        res.json(rows[0]);
        // console.log("rows in getuSER: ", rows);
    } catch(err) {
        console.log(err);
        res.json({
            success: false,
            msg: err
        });
    }
});

//OTHER pROFILE
app.get("/api/user/:id", (req, res) =>{
    if (req.session.userId != req.session.id){
        db.getOtherUser(req.params.id).then(({rows})=>{
            // console.log("rows is otheruser: ", rows);
            // console.log("one row: ", rows[0]);
            res.json({
                loggedUser : req.session.userId,
                otherProfile : rows[0]
            });
        });
    } else {
        res.json({ success: false});
    }
});


//logout
app.post("/logout", (req,res)=>{
    req.session.userId = null;
    res.json({
        success: false
    });
});
//upload image
app.post("/upload", uploader.single("file"), s3.upload, (req,res) =>{
    // console.log("cookie ",req.session.userId);
    const id =req.session.userId;
    const image_url = `${s3Url}${req.file.filename}`;
    db.addProfilePic(
        id, image_url
    ).then(
        ({rows}) =>
            res.json(rows[0])
    ).catch(err => {
        console.log("addProfilePic error: ", err);
    });
});
// add bio
app.post("/bio", (req,res) =>{
    const id = req.session.userId;
    const bio = req.body.bio;
    db.addBio(
        id, bio
    ).then(
        ({rows}) =>
            res.json(rows[0])
    ).catch(err => {
        console.log("addBio error: ", err);
    });
});
// app.get('*', function(req, res) {
//     res.sendFile(__dirname + '/index.html');

// friendcheck
app.get("/friendshipstatus/:otherId", (req, res) =>{
    db.friendshipCheck(req.params.otherId,req.session.userId).then(({rows})=>{
        console.log("rows in friendrstatus: ", rows);
        if(rows.length == 0){
            res.json({
                buttonText: "Wanna be friends?"
            });
        } else {
            if(rows.length > 0){
                if(rows[0].accepted == false && req.params.otherId == rows[0].receiver_id){
                    res.json({buttonText: "Cancel friend request"});
                } else if (rows[0].accepted == true){
                    res.json({buttonText: "Unfriend"});
                } else{
                    res.json({buttonText: "Accept friend request"});
                }
            }
        }
    }).catch( err =>{
        console.log("friendrequest error: ",err);
    });
});
//friendrequests
app.get('/friend-wannabes.json', async (req, res) => {
    try {
        const {rows} = await db.friendsInProcess(req.session.userId);
        res.json(rows);
        console.log("rows in friend-wannabes: ", rows);
    } catch(err) {
        console.log("error in friend-wannabes: ",err);
        res.json({
            success: false,
            msg: err
        });
    }
});
// sendfriendRequest
app.post("/send-friend-request/:otherId", (req,res) =>{
    db.friendRequest(req.params.otherId,req.session.userId).then(({rows}) =>{
        console.log("rows in friendrequest: ", rows);
        res.json({
            buttonText: "Cancel friend request"
        });
    }).catch(err => {
        console.log("friendRequest error: ", err);
    });
});

// friendshipMade
app.post("/accept-friend-request/:otherId", (req,res) =>{
    db.friendshipMade(req.params.otherId,req.session.userId).then(({rows}) =>{
        
        console.log("rows index friendshipMade: ", rows);
        res.json({
            buttonText: "Unfriend"
        });
    }).catch(err => {
        console.log("friendshipMade error: ", err);
    });
});
// deleteFriendRequest
app.post("/end-friendship/:otherId", (req,res) =>{
    db.deleteFriendRequest(req.params.otherId,req.session.userId).then(({rows}) =>{
        console.log("rows index deleteFriendRequest: ", rows);
        res.json({
            buttonText: "Wanna be friends?"
        });
    }).catch(err => {
        console.log("deleteFriendRequest error: ", err);
    });
});

app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    let userId = socket.request.session.userId;

    // make a db query to get the last 10 chat chatMessages
    db.getLastTen().then(({rows})=>{
        // now we need to emit the messages to the frontend
        io.sockets.emit("chatMessages", rows.reverse()); //this is the name of the happening event
    }).catch(err=>{
        console.log("error in getLastTen:", err);
    });

    socket.on('privateRoom', receiverId => {
        console.log('sliding into DMs: ' ,receiverId);
        db.getDMs(userId, receiverId).then(({rows})=>{
            console.log("rows in getDMs:", rows);
            io.sockets.emit("privateChatMessages", rows.reverse()); //this is the name of the happening event
        }).catch(err=>{
            console.log("error in getDMs:", err);
        });
    });


    socket.on("privateChatMessage", (payload) => {
        let pmsgUser ={
            msg: payload.msg,
            id: userId
        };
        console.log('on private chat');
        console.log('received: ' + JSON.stringify(payload));
        console.log('from: ' + userId);
        db.sendPMessage(userId, payload.receiverId, payload.msg)
            .then(({rows}) => {
                pmsgUser.created_at = rows[0].created_at;
                db.getUser(userId).then(({ rows }) => {
                    console.log(rows);
                    pmsgUser.first = rows[0].first;
                    pmsgUser.last = rows[0].last;
                    pmsgUser.image_url = rows[0].image_url;
                    pmsgUser.message = payload.msg;
                    io.sockets.emit('privateChatMessage', pmsgUser);
                }).catch(err => {
                    console.log(err);

                });
            })
            .catch(e => console.log("error en privateChat: ",e));
    });



    //add message
    socket.on("chatMessage", msg => {
        console.log("msg on the server: ", msg);
        let msgUser ={
            msg: msg,
            id: userId
        };
        db.sendMessage(userId, msg).then(({rows})=>{
            console.log("rows in chatMessage: ", rows);
            msgUser.created_at = rows[0].created_at;
            db.getUser(userId).then(({ rows }) => {
                console.log("rows from getuser: ", rows);
                msgUser.first = rows[0].first;
                msgUser.last = rows[0].last;
                msgUser.image_url = rows[0].image_url;
                msgUser.message = msg;
                console.log("msgUser: ", msgUser);
                io.sockets.emit("chatMessage", msgUser);
            })
                .catch(err => {
                    console.log(err);

                });
            //we need to look up info about the user
            //then add itt to the database
            //then emit this object out to everyone
            //io.sockets.emit("chatMessage", rows); // here we would like to pass the full object with all the user's info
        }).catch(err=>{
            console.log("error in sendMessage:", err);
        });
    });
});



// io.on('connection', function(socket) {
//     console.log(`socket with the id ${socket.id} is now connected`);
//
//     socket.on('disconnect', function() {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });
//
//     socket.on('thanks', function(data) {
//         console.log(data);
//     });
//     io.sockets.emit("someoneNew", {
//         id: socket.id
//     });
//
//     socket.broadcast.emit("someoneNew", {
//         id:socket.id
//     });
//
//     io.sockets.sockets[socket.id].emit("hello", {
//         message: "noce to see you"
//     });
//
//     socket.emit('welcome', {
//         message: 'Welcome. It is nice to see you'
//     });
// });
