'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebaseConfig';
import {
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

export default function WebRTCPage() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [peerConnection, setPeerConnection] = useState(null);
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    ],
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }

    if (remoteStream === null) {
      setRemoteStream(new MediaStream());
    }

    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const openUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    console.log('Media stream opened');
  };

  const createRoom = async () => {
    const pc = new RTCPeerConnection(configuration);
    setPeerConnection(pc);
  
    const roomRef = doc(collection(db, 'rooms'));
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
  
    // SDP Offer 생성 및 설정
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  
    // Firestore에 Offer 저장
    await setDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });
    setRoomId(roomRef.id);
    setIsRoomCreated(true);
  
    console.log(`Room created with ID: ${roomRef.id}`);
  
    // Caller ICE Candidates 저장
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(collection(roomRef, 'callerCandidates'), event.candidate.toJSON());
      }
    };
  
    // Remote 트랙 추가 처리
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
  
    // Firestore에서 SDP Answer 수신
    onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !pc.currentRemoteDescription) {
        const rtcAnswer = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(rtcAnswer);
        console.log('Remote description set with Answer.');
      }
    });
  
    // Firestore에서 Callee ICE Candidates 수신
    onSnapshot(collection(roomRef, 'calleeCandidates'), (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          await pc.addIceCandidate(candidate);
          console.log('Added Callee ICE Candidate.');
        }
      });
    });
  };

  const joinRoom = async () => {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnapshot = await getDoc(roomRef);
  
    if (roomSnapshot.exists()) {
      const pc = new RTCPeerConnection(configuration);
      setPeerConnection(pc);
  
      const roomData = roomSnapshot.data();
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
  
      console.log('Joining Room with ID:', roomId);
  
      // Callee ICE Candidates 저장
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(collection(roomRef, 'calleeCandidates'), event.candidate.toJSON());
        }
      };
  
      // Remote 트랙 추가 처리
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
  
      // Firestore에서 Caller의 SDP Offer 처리
      if (roomData.offer) {
        const rtcOffer = new RTCSessionDescription(roomData.offer);
        await pc.setRemoteDescription(rtcOffer);
        console.log('Remote description set with Offer.');
  
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
  
        // Firestore에 SDP Answer 저장
        await updateDoc(roomRef, {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        });
        console.log('Answer created and sent to Firestore.');
      }
  
      // Firestore에서 Caller ICE Candidates 수신
      onSnapshot(collection(roomRef, 'callerCandidates'), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            await pc.addIceCandidate(candidate);
            console.log('Added Caller ICE Candidate.');
          }
        });
      });
    } else {
      alert('Room does not exist');
    }
  };  

  const hangUp = async () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    setRoomId('');
    setIsRoomCreated(false);
    console.log('Call ended');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Call Me May Be</h1>
      <div className="flex flex-col gap-4 mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          onClick={openUserMedia}
        >
          Open Mike
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
          onClick={createRoom}
          disabled={!localStream}
        >
          Create Room
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
          onClick={hangUp}
        >
          Hang Up
        </button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <video
          ref={localVideoRef}
          className="bg-black w-64 h-48 rounded-md"
          autoPlay
          muted
          playsInline
        ></video>
        <video
          ref={remoteVideoRef}
          className="bg-black w-64 h-48 rounded-md"
          autoPlay
          playsInline
        ></video>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          disabled={isRoomCreated}
        />
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </main>
  );
}
