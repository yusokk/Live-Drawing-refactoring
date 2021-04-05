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
      console.log(res.data);
      setRooms(res.data);
    });
  }, []);
  return (
    <>
      {/* <div>진행중인 라이브</div> */}
      {/* <Link to={'/'}>
        <button className='py-1 px-3 font-semibold rounded-lg shadow-md text-white bg-blue-400 hover:bg-blue-500 text-sm'>
          더보기
        </button>
      </Link> */}
      <div className='roomList'>
        {/* <EntranceComponent roomPk={1} roomKey={'1'} roomTitle={'라이언 그리기'}></EntranceComponent> */}

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
