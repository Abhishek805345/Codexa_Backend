const express=require('express');
const app=express();
const cors=require('cors');
const {Server}=require('socket.io');
const http=require('http');

//local module
const {connection_fxn}=require('./models/serverconnection');
const authrouter=require('./routers/authrouter');
const roomrouter=require('./routers/roominfo');
const {roomouterclass}=require('./models/dbfxnroom');
//session
const session=require('express-session');
const mongosession=require('connect-mongodb-session')(session);




const server=http.createServer(app);
const io=new Server(server,{
  cors:{
  origin:"http://localhost:5173",
  methods:["GET","POST"],
  credentials:true
}
});


io.on('connection',(socket)=>{
  console.log('user connected',socket.id);
  //user joining the specific room for chat
  socket.on('join-room',async ({roomid,username})=>{
    console.log('join room event received');
    socket.join(roomid);
    const onlineuser=await io.in(roomid).allSockets();
    io.to(roomid).emit('joined-room',{username});         //user joined the room message 
    io.to(roomid).emit("online-user-count",({onlineuser:onlineuser.size}));     //current number of user in a room 
    console.log(`${socket.id} joined to ${roomid}`);
  });

  socket.on('send-message',async ({roomid,message,username})=>{
    io.to(roomid).emit('receive-message',{
      message,
      time:new Date().toLocaleTimeString(),
      username:username
    })
  })
//replying to code message
socket.on('send-code',async ({codeid,message,roomid})=>{
  io.to(codeid).emit('receive-code',{
    message
  })
})
socket.on('update-code',({roomid,code})=>{
  socket.to(roomid).emit('receive-updatedcode',{code});
})

//webrtc socket handling

socket.on('send-offer',({roomid,offer})=>{
  socket.to(roomid).emit('receive-offer',{offer});
  console.log('offer sent to the user B');
})
//receive and send answer 
socket.on('send-answer',({roomid,answer})=>{
  socket.to(roomid).emit('receive-answer',{answer});
})
//forwarding candidate 
socket.on('send-candidate',({roomid,candidate})=>{
  socket.to(roomid).emit('receive-candidate',{candidate});
})

})



//cors middleware for accepting 3000 server to store cookies
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

//creating session object
const store=new mongosession({
  uri:"mongodb+srv://Abhi_shek:17158894Jaat@firstproject.7epbjmq.mongodb.net/?appName=Firstproject",
  databaseName:'newProject',
  collection:'sessionStore'
});
store.on('error',(error=>{
  console.log("error in saving session in db",error);
}))
//session middleware
const sessionMiddleware = session({
  name: "sid",
  secret: "unknown Project",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: false,        // localhost
    httpOnly: true,
    sameSite: "lax"
  }
});
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/api',authrouter);
app.use('/api',roomrouter);



connection_fxn(()=>{
server.listen(3001,()=>{
  console.log(`Your server is running at http:localhost:3001`);
})
})
