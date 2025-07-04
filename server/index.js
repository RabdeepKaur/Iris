const { Server}=require ("socket.io")
const {spawn}=require('child_process');
const fs= require('fs');
const path=require('path')
const express= require("express")
const { createServer } = require('http');

const app= express();
const server=createServer(app);

const PORT = process.env.PORT || 8000;

const io= new Server(server,{
    cors: {
        origin: "*", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true
      }
});
app.get('/', (req, res) => {
    res.send('Server is running!');
});


//mapping email connecio
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
   // console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
  //  console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });

  
  });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
module.exports=app;