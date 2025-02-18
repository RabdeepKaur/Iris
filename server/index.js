const { Server}=require ("socket.io")

const io= new Server(8000,{
    cors: {
        origin: "http://localhost:3000", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true
      }
});
//mapping email connecio
const emaitosocketid= new Map();
const socketidtoemail=new Map();

io.on("connection",(socket)=>{
    console.log(`socekt connecton`,socket.id)
    socket.on("room:join",data=>{
        const {email,room}=data;
        emaitosocketid.set(email,socket.id)
        socketidtoemail.set(socket.id,email)
        io.to(room).emit("user:joined",{email, id: socket.id});
        socket.join(room)
        io.to(socket.id).emit("room:join",data)
    })


    socket.on('user:call',({to,offer})=>{
        io.to(to).emit('incoming:call',{from: socket.id,offer})
    })

    socket.on("call:accept",({to,ans})=>{
        io.to(to).emit('call:accept',{from: socket.id,ans})
    })
}) 