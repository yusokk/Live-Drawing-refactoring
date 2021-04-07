import React, { useState, useEffect } from 'react';
import { EntranceComponent } from './entrance';
import { ResponseRoomInfo } from '../interfaces/room-info-interface';
import axios from 'axios';
import './room-list.css';
import { EntranceProps } from '../interfaces/entrance-props-interface';

export function RoomListComponent() {
  const [rooms, setRooms] = useState<EntranceProps[]>([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseRoomInfo) => {
      setRooms(res.data);
    });
  }, []);
  return (
    <>
      <div className='roomList'>
        {rooms.map((room: EntranceProps, index: number) => {
          return (
            <div key={index}>
              <EntranceComponent roomHostname={room.roomHostname} roomId={room.roomId} roomTitle={room.roomTitle} />
              <br />
            </div>
          );
        })}
      </div>
    </>
  );
}