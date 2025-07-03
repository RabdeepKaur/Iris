
import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvder";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Settings,
  MoreVertical,
  Users,
  MessageSquare,
  
} from 'lucide-react';

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isCallActive, setIsCallActive] = useState(false);
  
  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
 

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
     
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, []);

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();
    
  // No need to add tracks here; tracks are managed during call setup.
  }, [initializeCamera, myStream]);
  const handleCallUser = useCallback(async () => {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      
      setMyStream(stream);
      
      // Clear existing tracks first to avoid m-line order issues
      const senders = peer.peer.getSenders();
      for (const sender of senders) {
        if (sender.track) {
          peer.peer.removeTrack(sender);
        }
      }
      
      // Add tracks to peer connection in consistent order (audio first, then video)
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
     if (audioTrack) peer.peer.addTrack(audioTrack, stream);
if (videoTrack) peer.peer.addTrack(videoTrack, stream);

      
      // Get offer and send it to remote user
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
      
      setIsCallActive(true);
      console.log("Call initiated");
    } catch (error) {
      console.error("Error starting call:", error);
    }
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      try {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        console.log(`Incoming Call`, from, offer);
        
        // Clear existing tracks first to avoid m-line order issues
        const senders = peer.peer.getSenders();
        for (const sender of senders) {
          if (sender.track) {
            peer.peer.removeTrack(sender);
          }
        }
      
        // Add tracks to peer connection in consistent order (audio first, then video)
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];
        
        if (audioTrack) {
          peer.peer.addTrack(audioTrack, stream);
        }
        if (videoTrack) {
          peer.peer.addTrack(videoTrack, stream);
        }
        
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
        
        setIsCallActive(true);
        console.log("Call accepted and answered");
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [socket]
  );
  

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      try {
        await peer.setLocalDescription(ans);
        console.log("Call Accepted!");
        setIsCallActive(true);
      } catch (error) {
        console.error("Error handling call acceptance:", error);
      }
    },
    []
  );

  const handleNegoNeeded = useCallback(async () => {
    try {
      console.log("Negotiation needed");
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    } catch (error) {
      console.error("Error in negotiation:", error);
    }
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      try {
        console.log("Handling incoming negotiation");
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
      } catch (error) {
        console.error("Error in incoming negotiation:", error);
      }
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    try {
      console.log("Final negotiation step");
      await peer.setLocalDescription(ans);
    } catch (error) {
      console.error("Error in final negotiation:", error);
    }
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

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  // Audio/Video control functions
  const toggleMute = useCallback(() => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [myStream]);

  const toggleVideo = useCallback(() => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [myStream]);

  const endCall = useCallback(() => {
    try {
      // Stop all tracks
      if (myStream) {
        myStream.getTracks().forEach(track => {
          track.stop();
        });
        setMyStream(null);
      }
      
      // Clear remote stream
      if (remoteStream) {
        setRemoteStream(null);
      }
      
      // Remove all senders from peer connection
      const senders = peer.peer.getSenders();
      for (const sender of senders) {
        if (sender.track) {
          peer.peer.removeTrack(sender);
        }
      }
      
      // Reset states
      setRemoteSocketId(null);
      setIsCallActive(false);
      setIsMuted(false);
      setIsVideoOff(false);
      
      // Close and recreate peer connection to avoid state issues
      peer.peer.close();
      
      // Notify the other user that call ended
      if (remoteSocketId) {
        socket.emit("call:ended", { to: remoteSocketId });
      }
      
      console.log("Call ended and cleaned up");
    } catch (error) {
      console.error("Error ending call:", error);
    }
  }, [myStream, remoteStream, remoteSocketId, socket]);

  // Handle when remote user ends call
  useEffect(() => {
    const handleCallEnded = () => {
      try {
        if (myStream) {
          myStream.getTracks().forEach(track => track.stop());
          setMyStream(null);
        }
        setRemoteStream(null);
        setIsCallActive(false);
        setIsMuted(false);
        setIsVideoOff(false);
        
        // Clean up peer connection
        const senders = peer.peer.getSenders();
        for (const sender of senders) {
          if (sender.track) {
            peer.peer.removeTrack(sender);
          }
        }
        
        console.log("Remote call ended - cleaned up");
      } catch (error) {
        console.error("Error handling remote call end:", error);
      }
    };

    socket.on("call:ended", handleCallEnded);
    return () => socket.off("call:ended", handleCallEnded);
  }, [socket, myStream,remoteStream]);


  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
     
      <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${remoteSocketId ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm font-medium">
            {remoteSocketId ? "Connected" : "Waiting for participants..."}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Users size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <MessageSquare size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

     Main Video Area 
      <div className="flex-1 relative">
       {remoteStream ? (
          
          <div className="w-full h-full relative">
            <ReactPlayer
              url={remoteStream}
              playing
              muted={false}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
            />
            
            
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">Remote Participant</span>
            </div>

            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600">
              {myStream ? (
                <ReactPlayer
                  url={myStream}
                  playing
                  muted
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff size={24} className="text-gray-400" />
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs">
                You {isMuted && <MicOff size={12} className="inline ml-1" />}
              </div>
              
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg font-semibold">Y</span>
                    </div>
                    <p className="text-xs text-gray-300">Camera off</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : myStream ? (
       
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center max-w-md">
              <div className="w-64 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl mb-6 mx-auto relative">
                <ReactPlayer
                  url={myStream}
                  playing
                  muted
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
                {isVideoOff && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-semibold">You</span>
                      </div>
                      <p className="text-sm text-gray-300">Your camera is off</p>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-semibold mb-2">Ready to join?</h2>
              <p className="text-gray-400 mb-6">
                {remoteSocketId 
                  ? "Someone is in the room. Click call to start the video call." 
                  : "Waiting for others to join the room..."
                }
              </p>
             
              <div className="flex space-x-4 justify-center">
                
                
                {remoteSocketId && (
                  <button
                    onClick={handleCallUser}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <Phone size={20} />
                    <span>Start Call</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <VideoOff size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Ready to connect</h2>
              <p className="text-gray-400 mb-6">
                {remoteSocketId 
                  ? "Someone is in the room. Click call to start." 
                  : "Waiting for others to join the room..."
                }
              </p>
              
              {remoteSocketId && (
                <button
                  onClick={handleCallUser}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Phone size={20} />
                  <span>Start Call</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center space-x-4">
         
          <button
            onClick={toggleMute}
            disabled={!myStream}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            } ${!myStream ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

           
          <button
            onClick={toggleVideo}
            disabled={!myStream}
            className={`p-4 rounded-full transition-all duration-200 ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            } ${!myStream ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          
          <button 
            onClick={endCall}
            disabled={!myStream && !remoteStream}
            className={`p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 ${
              !myStream && !remoteStream ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <PhoneOff size={24} />
          </button>

          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-all duration-200">
            <Settings size={24} />
          </button>
        </div>

    
        <div className="text-center mt-4">
          <div className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${remoteSocketId ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs">
              {remoteSocketId ? 'Connected' : 'Waiting for connection...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )


};

export default RoomPage;
