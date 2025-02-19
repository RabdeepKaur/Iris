import React,{createContext,useContext,useMemo} from 'react'
import {io} from 'socket.io-client'

const SocketContext= createContext(null)

export const useSocket=()=>{
    const socket=useContext(SocketContext);
    return socket
}
const socket = io("http://localhost:8000", {
    withCredentials: true  // If you're using credentials
  });
// gives the whole appplication access to the socket 
// hre value is the actual socket 
export const SocketProvder=(props)=>{

const socket=useMemo(()=>io('localhost:8000'),[])

return(
    <>
    <SocketContext.Provider value={socket}>
{props.children}
    </SocketContext.Provider>
    </>
)
}
