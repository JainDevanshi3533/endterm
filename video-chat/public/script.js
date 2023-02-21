const socket = io('/');

const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});
myVideo.muted = true;
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call',call =>{
        console.log("pp");
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            console.log("he");
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) =>{
        connectToNewUser(userId,stream);
    })
    
})

peer.on('open', id=>{
    // console.log(id);
    socket.emit('join-room', ROOM_ID , id);
})


const connectToNewUser= (userId ,stream) =>{
    // console.log('new User connected', userId);
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
}

const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
    // console.log(videoGrid);
    videoGrid.append(video);
    // console.log(videoGrid);
}