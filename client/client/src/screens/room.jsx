import React,{useCallback, useEffect,useState} from "react"
import ReactPlayer from "react-player"
import { useSocket } from "../context/SocketProvder"
import peer from "../services/peer"


const Roompage=()=>{

const socket= useSocket();
const[remotesocketid,setremotesocketid]=useState();
const [mystream,setmystream]=useState()

const handleusejon= useCallback(({email,id})=>{
console.log(`email ${email}`)
setremotesocketid(id)
},[])

const handlecalluser = useCallback( async()=>{
    const stream= await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
    })
    const offer=await peer.getoffer();
    socket.emit("user:call",{to:remotesocketid ,offer})
    setmystream(stream)
},[remotesocketid,socket])

const handleincomingcall=useCallback(async({from ,offer})=>{
    setremotesocketid(from)
    const stream= await navigator.mediaDevices.getUserMedia({audio:true,video:true})
    setmystream(stream)
console.log("incoming call from ",from,offer)
const ans= await peer.getAnswer(offer)
socket.emit("call:accept",{to: from,ans})
},[socket])

const handleaccept=useCallback(({from,ans})=>{
peer.setLocalDescription(ans);
console.log("call accepted");
for(const track of mystream.getStracks()){
peer.peer.addTrack(track,mystream)
}
},[mystream])


useEffect(()=>{
    socket.on('user:joined',handleusejon);
    socket.on("incoming:call",handleincomingcall)
socket.on("call:accept",handleaccept)

    return()=>{
        socket.off('user:joined',handleusejon)
        socket.off('user:joined',handleincomingcall) 
        socket.off('user:accept',handleaccept)
    }
},[socket,handleusejon,handleincomingcall,handleaccept])    

    return(
        <>
        <h1>room</h1>
        <h4>{remotesocketid ? 'connecte':'no one n room'}</h4>
       {remotesocketid && <button onClick={handlecalluser}>call</button>}
       {mystream && <ReactPlayer  playing muted height="300px"   width="400px" url={mystream}></ReactPlayer>}
        </>
    )
}

export default Roompage;