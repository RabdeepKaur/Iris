import React,{createContext,useContext,useMemo} from 'react'
import {io} from 'socket.io-client'

const SocketContext= createContext(null)

export const useSocket=()=>{
    const socket=useContext(SocketContext);
    return socket
}
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ||"iris-dxiwo4ob6-rabdeep-kaurs-projects.vercel.app", {
    withCredentials: true ,
     transports: ['websocket', 'polling'] // If you're using credentials
  });
// gives the whole appplication access to the socket 
// hre value is the actual socket 
export const SocketProvder=(props)=>{

const socket=useMemo(()=>io(process.env.NEXT_PUBLIC_SOCKET_URL ||'iris-dxiwo4ob6-rabdeep-kaurs-projects.vercel.app'),{
     withCredentials: true,
            transports: ['websocket', 'polling']
},
[])

return(
    <>
    <SocketContext.Provider value={socket}>
{props.children}
    </SocketContext.Provider>
    </>
)
}
