import React ,{useState,useCallback,useEffect,useRef} from "react"
import{useNavigate} from 'react-router-dom'
import { useSocket } from "../context/SocketProvder"
import gsap from 'gsap';
import {useGSAP} from "@gsap/react";



const LobbyScreen = () => {
  //states
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");
  //hooks
    const socket = useSocket();
    const navigate = useNavigate();
    
    const handleSubmitForm = useCallback(
      (e) => {
        e.preventDefault();
        socket.emit("room:join", { email, room });
      },
      [email, room, socket]
    );
  
    const handleJoinRoom = useCallback(
      (data) => {
        const { email, room } = data;
        navigate(`/room/${room}`);
      },
      [navigate]
    );
  
    useEffect(() => {
      socket.on("room:join", handleJoinRoom);
      return () => {
        socket.off("room:join", handleJoinRoom);
      };
    }, [socket, handleJoinRoom]);
  
    // add frontend as google meeetformat 
    
  
    return (
      <div>
        <div  padding="4px" margin-left="20px"><h1>Lobby</h1></div>
       
        <form onSubmit={handleSubmitForm}>
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        
          <br />
          <label htmlFor="room">Room Number</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <br />
          <button>Join</button>
        </form>
      </div>
    );
  };
  
  export default LobbyScreen;