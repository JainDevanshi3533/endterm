const socket = io('/');

const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');

var peer = new Peer(undefined, {
    host: '/',
    port: '3001'
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
        // console.log("pp");
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
            // console.log("he");
            addVideoStream(video, userVideoStream)
        })
    })

    // peers[call.peer] = call

    socket.on('user-connected', (userId) =>{
        connectToNewUser(userId,stream);
    })
    

    let txt = $('input');
    // console.log(txt.val) ;

    $('html').keydown((e) =>{
        //enter key==13
        if(e.which ==13 && txt.val().length!==0 ){
            socket.emit('message', txt.val());
            txt.val('');
        }
    })

    socket.on('createMessage' , message =>{
        // console.log('this is coming from server ', message);
        $('ul').append(`
        <li class="message">
            <b>user</b><br>
            ${message}
        </li>`
        )

        scrollToBottom()
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

    // peers[userId] = call
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

 const scrollToBottom = () =>{                      //as we type it is always gonna scroll to botttom
    let d= $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
 }


 //mutes our audio
 const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
 }

 const setMuteButton = () =>{
    const html=`
        <i class ="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML= html; 

 }
 const setUnmuteButton = () =>{
    const html=`
        <i class =" unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML= html; 
    
 }

 //stops video
 const playStop= () =>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
 }

const setStopVideo = () =>{
    const html=`
        <i class ="fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML= html; 

}

const setPlayVideo = () =>{
    const html=`
        <i class ="unmute fas fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML= html; 

}