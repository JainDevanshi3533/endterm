const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4 : uuidv4 } = require('uuid');
const io = require('socket.io')(server);
// const {ExpressPeerServer} = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     debug:true
// });

app.set('view engine', 'ejs')
// app.use(express.json());
app.use(express.static('public'));
// app.use('/peerjs', peerServer);
app.get('/', (req,res)=>{
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room', (req,res)=>{
    res.render('room', {roomId : req.params.room})
})

io.on('connection',socket =>{
    socket.on('join-room', (roomId, userId) =>{
        // console.log("joined room");
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    })
})
server.listen(2222);

/*  to run...

peerjs --port 3001
        and then
nodemon server.js

*/