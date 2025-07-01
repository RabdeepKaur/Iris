import React ,{useState,useCallback,useEffect,useRef} from "react"
import{useNavigate} from 'react-router-dom'
import { useSocket } from "../context/SocketProvder"
import "./ui/lobby.css";




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
    const generateRoomNumber = () => {
  const randomRoom = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  setRoom(randomRoom);
};
  
    return (
      <>
      <div className="min-h-screen bg-[#B8FF9F] flex justify-center items-center font-['Montserrat']">
  <div className="flex flex-col items-center gap-8">
    <div className="text-lg text-[#323232]">
      <h1 className="text-2xl font-bold">Lobby</h1>
    </div>
    
    <div className="p-8 bg-white flex flex-col items-start justify-center gap-6 rounded-md border-2 border-black shadow-[4px_4px_0px_black] w-full max-w-md">
    
    <form className="w-full flex flex-col gap-6" onSubmit={handleSubmitForm}>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[#323232] font-semibold">
          Email ID
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-64 h-12 rounded-md border-2 border-black bg-[beige] shadow-[4px_4px_0px_black] text-[15px] font-semibold text-[#323232] px-3 py-2 outline-none focus:border-[#2d8cf0] placeholder:text-[#666] placeholder:opacity-80"
          placeholder="Enter your email"
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="room" className="text-[#323232] font-semibold">
          Room Number
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-48 h-12 rounded-md border-2 border-black bg-[beige] shadow-[4px_4px_0px_black] text-[15px] font-semibold text-[#323232] px-3 py-2 outline-none focus:border-[#2d8cf0] placeholder:text-[#666] placeholder:opacity-80"
            placeholder="Enter room number"
          />
          <button 
            type="button"
            onClick={generateRoomNumber}
            className="cursor-pointer w-20 h-12 rounded-md border-2 border-black bg-[beige] shadow-[4px_4px_0px_black] text-[#323232] text-sm font-semibold flex justify-center items-center active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75"
          >
            Generate
          </button>
        </div>
      </div>
      <a href="/room">
      <button 
        type="submit"
        className="cursor-pointer w-24 h-10 rounded-[20%] border-2 border-black bg-[beige] shadow-[4px_4px_0px_black] text-[#323232] text-[25px] flex justify-center items-center active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75"
      >
        Join
      </button>
      </a>
    </form>
  </div>
</div>
</div>
      </>
    );
  };
  
  export default LobbyScreen;