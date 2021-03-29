import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatScreenComponent } from './chatscreen';
import { ChatInputComponent } from './chatInput';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';
import io from 'socket.io-client';
import { RoomData } from '../interfaces/room-data';
import './chat.css';

export function ChatComponent(props: ChatComponentProps) {
  const [roomData, setRoomData] = useState<RoomData>();
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const room = useParams<{ roomKey: string }>();

  useEffect(() => {
    const socketIo = io('http://localhost:8080/', {
      transports: ['websocket'],
    });
    // console.log({ ...socketIo });
    // console.log(socketIo);

    socketIo.emit('join', { userId: props.userId, room: room.roomKey });

    socketIo.on('roomData', (message: RoomData) => {
      setRoomData;
    });
    socketIo.on('connect', () => {
      setSocket(socketIo);
    });
  }, []);

  return (
    <div className='chatContainer'>
      <ChatScreenComponent
        userId={props.userId}
        socket={socket}
      ></ChatScreenComponent>
      <ChatInputComponent
        userId={props.userId}
        socket={socket}
      ></ChatInputComponent>
    </div>
  );
}
