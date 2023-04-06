const express = require('express');
const cors=require('cors')
const mongoose=require('mongoose')
const app=express();
const userRoutes = require('./routes/userRoutes');
const messageRoutes =require('./routes/messageRoutes');
const fbRoutes=require("./routes/fbRoutes");
const socket=require("socket.io");
const fetch=require("node-fetch");
const http = require('http').Server(app)
//import fetch from "node-fetch";
//const { statusRoute } = require('../client/src/utils/ApiRoutes');

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() =>{
    console.log("DB connection Successfull")
}).catch((err)=>{
    console.log(err.message)
})

const server= app.listen(process.env.PORT,()=>{
    console.log(`server started on port ${process.env.PORT}`)
})

const usersJoined=[];
global.onlineUsers=new Map();
const io=socket(server)

// {
//     cors:{
//         origin:"http://localhost:3000",
//         credentials:true,
//     }
// }

const sendUser={}

io.on('connection',(socket)=>{
    global.chatSocket=socket;
    socket.on('user-joined',({data})=>{
        socket.join(data);
        usersJoined[socket.id]=data;
        sendUser[data]=socket.id;
       //console.log(data+" has joined");
       socket.broadcast.emit("userOnline",{user:usersJoined[socket.id]});
       socket.emit('welcome',{user:"admin",mes:`welcome${usersJoined[socket.id]}`});
      // console.log(sendUser)
    })


    socket.on('msg-send',({to,msgtime,message,id})=>{

         io.emit("send-msgs",{message,msgtime,to});
        
    })

    socket.on('del-msg',({from,to})=>{
        io.emit("msg-del",{from,to});
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit("userOffline",{message:`${usersJoined[socket.id]} is offline ` })
       // console.log('user offline');
    })
    


   

    
})


//Add this before the app.get() block




 


// const usersOnline=[];

// io.on("connection",(socket)=>{
//     global.chatSocket=socket;
//     socket.on("add-user",(userId)=>{
//         onlineUsers.set(userId,socket.id);
//     });

//     socket.on("send-msg",(data)=>{
//         const sendUserSocket=onlineUsers.get(data.to);
//         if(sendUserSocket){
//             socket.to(sendUserSocket).emit("msg-recieve",data.message);
//         }
//     });

//     // socket.on('user-connected',async (data)=>{
//     //    //  console.log('user online:'+data);
//     //    var sid=socket.id;
//     //     usersOnline[sid]=data//.push(data);
//     //     // console.log(usersOnline);
//     //     //"http://localhost:5000/api/auth/onlineUsers"
//     //     // fetch('http://localhost:5000/api/auth/onlineUsers', {
//     //     //     method: 'POST',
//     //     //     headers: {
//     //     //         Accept: 'application/json',
//     //     //         'Content-Type': 'application/json'
//     //     //     },
//     //     //     body:{
//     //     //         users:"ussseerrrs"  
//     //     //     }
//     //     //     });
//     //     // console.log(usersOnline)
//     // });

//     // socket.on('disconnect',()=>{
//     //     console.log('user offline:'+usersOnline[socket.id])
//     //     delete usersOnline[socket.id];
//     // })
// })





// io.on('connection', function(socket){
//   console.log('a user connected');

//   socket.on('login', function(data){
//     console.log('a user ' + data.userId + ' connected');
//     // saving userId to object with socket ID
//     users[socket.id] = data.userId;
//   });

//   socket.on('disconnect', function(){
//     console.log('user ' + users[socket.id] + ' disconnected');
//     // remove saved socket from users object
//     delete users[socket.id];
//   });
// });