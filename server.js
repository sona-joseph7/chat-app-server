const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'https://r-e-a-l-t-i-m-e-chat-app.netlify.app'  // This should match your frontend's deployed URL
}));


const server = http.createServer(app)
const io = new Server(server, {
  cors:{
    origin : "https://r-e-a-l-t-i-m-e-chat-app.netlify.app", //http://localhost:5173
    methods : ["GET","POST"]
  }
})

let onlineUsers = {}

io.on("connection", (socket) => {
  console.log(`New user connected : ${socket.id}`);

  socket.on("userJoined", (username)=>{
    if(username){
      onlineUsers[socket.id] = username;
      io.emit("updateUsers",Object.values(onlineUsers));
      console.log(`${username} joined the chat`);
    }
  })

  socket.on("sendMessage", (message) =>{
    console.log(`Message from ${message.user}:${message.text}`);
    io.emit("receiveMessage",message)
  })

  socket.on("disconnect",()=>{
    if(onlineUsers[socket.id]){
      console.log(`${onlineUsers[socket.id]} disconnected`);
      delete onlineUsers[socket.id]
      io.emit("updateUsers",Object.values(onlineUsers))
    }
  })
  
})

server.listen(5000,()=> console.log("Server running on port 5000"));
