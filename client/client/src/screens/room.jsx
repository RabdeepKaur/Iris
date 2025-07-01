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
  Monitor
} from 'lucide-react';

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  
  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showControls, setShowControls] = useState(true);

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
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
    }
    if (remoteStream) {
      setRemoteStream(null);
    }
    setRemoteSocketId(null);
    peer.peer.close();
  }, [myStream, remoteStream]);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
      {/* Header */}
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

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {remoteStream ? (
          /* Remote participant view - main video */
          <div className="w-full h-full relative">
            <ReactPlayer
              url={remoteStream}
              playing
              muted={false}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
            />
            
            {/* Remote participant info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">Remote Participant</span>
            </div>

            {/* Self view - picture in picture */}
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
          /* Self view only - waiting for call */
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
              
              {/* Action buttons */}
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={sendStreams}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <Monitor size={20} />
                  <span>Send Stream</span>
                </button>
                
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
          /* No stream - setup view */
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

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center space-x-4">
          {/* Microphone toggle */}
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

          {/* Video toggle */}
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

          {/* End call */}
          <button 
            onClick={endCall}
            disabled={!myStream && !remoteStream}
            className={`p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 ${
              !myStream && !remoteStream ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <PhoneOff size={24} />
          </button>

          {/* Settings */}
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-all duration-200">
            <Settings size={24} />
          </button>
        </div>

        {/* Connection status */}
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
  );
};

export default RoomPage;