import React from 'react';
import { MemoizedEntrance } from './entrance';
import { roomInfo } from '../interfaces/room-info-interface';
import './room-list.css';
import { RoomListProps } from '../interfaces/entrance-props-interface';

function RoomList(props: RoomListProps) {
  return (
    <div className='roomList grid grid-cols-4 gap-5 pt-10 flex-justify-center w-full'>
      {props.rooms.map((room: roomInfo) => {
        return (
          <MemoizedEntrance
            key={room.roomId}
            roomHostname={room.roomHostname}
            roomId={room.roomId}
            roomTitle={room.roomTitle}
            onClick={props.onClick}
          />
        );
      })}
    </div>
  );
}

export const MemoizedRoomList = React.memo(RoomList);
