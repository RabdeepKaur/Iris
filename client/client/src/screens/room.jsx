
import React, { useEffect, useCallback, useState,useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvder"
import { Socket } from "socket.io-client";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
const [emotion,setEmotion]=useState({dominant:"neutral",scores:{}});
const [remoteEmotion,setRemoteEmotion]=useState();

const emotionalInterval=useRef(null);
const videoRef=useRef(null);


  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);


  // emition analysis
  const handleEmotionUpdate=useCallback(()=>{
    if(!myStream || emotionalInterval.current) return;

    const canvas=document.createElement('canvas');
    const context=canvas.getContext('2d');
    const videoElement=videoRef.current?.getIntervalplayer();

    if(!videoElement){
      console.error("video elemnt is not avaliable");
      return;
    }

    emotionalInterval.current=setInterval(()=>{
      canvas.width=videoElement.videoWidth;
      canvas.height=videoElement.videoHeight;

      context.drawImage(videoElement,0,0,canvas.width,canvas.height);

      const imageData=canvas.toDataURL('image/jpeg',0.8);

      socket.emit("analyze:emtoion",{image:imageData},(response)=>{
        if(response.error){
          console.erroe("erroe analysis emotion",response.error);
          return;
        }
        setEmotion(response.emotion);

        if(remoteSocketId){
          socket.emot("emotion:update",{
            to:remoteSocketId,
            emotion:response.emotion
          })
        }
      })
    },1000)
    return()=>{
      if(emotionalInterval.current){
        clearInterval(emotionalInterval.current);
        emotionalInterval.current=null;
      }
    }
  
  },[myStream,remoteSocketId,Socket])

 
  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("emotion:update",handleEmotionUpdate);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("Emotion:update",handleEmotionUpdate);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleEmotionUpdate,
  ]);

  const renderEmotionalIndicator=(emotionData)=>{
    const{dominat}=emotionData || { dominant: "neutral"}
  

  const emotionCOlors={
    happy:"bg-green-500",
    sad:"bg-blue-500",
    angry:"bg-red-500",
    surprised: "bg-yellow-500",
    disgusted: "bg-purple-500",
    fearful: "bg-orange-500",
    neutral: "bg-gray-500",
    no_face: "bg-gray-300"
  }
 return (
  <div className="flex items-center space-x-2">
    <div className={`W-4 h-4 reounded-full ${emotionCOlors[dominat] || "bg-gray-500"} `}></div>
<span className="caitalize">{dominat}</span>
  </div>
 )
  };
  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
          <div className="absolute bottom-0 left-0 p-1 bg-black bg-opacity-50 text-white text-xs">
              {renderEmotionalIndicator(emotion)}
            </div>
          
        </>
        
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
          <div className="absolute bottom-0 left-0 p-1 bg-black bg-opacity-50 text-white text-xs">
              {renderEmotionalIndicator(remoteEmotion)}
            </div>
        </>
      )}
    </div>
  );
};

export default RoomPage;