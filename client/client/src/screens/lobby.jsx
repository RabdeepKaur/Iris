import React ,{useState,useCallback,useEffect} from "react"
import{useNavigate} from 'react-router-dom'
import { useSocket } from "../context/SocketProvder"

const  Lobby=()=>{

    const [ email,setemail]=useState('')
const [room,setroom]=useState('')


//callback
const socket =useSocket();
const navigate=useNavigate();

const handleSubmitForm=useCallback((e)=>{
    e.preventDefault();// to prevent default duh
   
    socket.emit('room:join',{email,room})
},[ email,room,socket])


const handleJoinRoom= useCallback((data)=>{
    const{email,room}=data
   navigate(`/room/${room}`)
},[navigate])

useEffect(()=>{
    socket.on("room:join",handleJoinRoom);
    return ()=>{
        socket.off('room:join')
    }
    },[socket])

    return(
        <>
        <h1> Lobby </h1>
        <form  onSubmit={handleSubmitForm}>
            <label htmlFor="email">Emial-id</label>
            <input type="email"
             id="email" 
              value={email} 
               onChange={e=>setemail(e.target.value)}>
               </input>
            <label htmlFor="room">room</label>
            <input type="text" 
            id="room"
            value={room} 
            onChange={e=>setroom(e.target.value)}
            ></input>
          <button>Join</button>
        </form>
        </>
    )
}

export default Lobby;