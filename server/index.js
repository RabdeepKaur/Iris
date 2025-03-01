const { Server}=require ("socket.io")
const {spawn}=require('child_process');
const fs= require('fs');
const path=require('path')

const io= new Server(8000,{
    cors: {
        origin: "http://localhost:3000", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true
      }
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

    socket.on('analyze:emtoion',async(data,callback)=>{
      try{
        const  imageData=data.image;
        const base64Data=imageData.replace(/^data:image\/jpeg;base64,/, '')

        const tempImagePath=path.join(_drename,`temp_image_${socket.id}.jpg`)
        fs.writeFileSync(tempImagePath,base64Data,'base64');

        const pythonProcess=spawn('python',['analysis.py',tempImagePath]);
        let pythonData="";
        pythonProcess.stdout.on('data',(data)=>{
        console.error(`python error:${data.toString()}`)
        });

        pythonProcess.on('close',(code)=>{
          if(fs.existsSync(tempImagePath)){
            fs.unlinkSync(tempImagePath);
          }
          if(code!==0){
            return callback({error:'emotion analysis faild'});
          }
          try{
            const emotonResults=JSON.parse(pythonData);
            callback({emotion:emotonResults});
          }
          catch(error){
            callback({erroe:'failed to parse emotion data'})
          }
        })
       } catch(error){
        console.erroe('error in emtion ',error);
        callback({error:'server error'});
       }
    });
    socket.on('emotion:update',({to,emotion})=>{
      socket.to(to).emit("emotion:update",{from:socket.id,emotion});
    })
  });
});