import React from 'react';
import { RoomListComponent } from './components/room-list';

export function HomeComponent() {
  return (
    <div className='lecture-container w-screen'>
      <div className='introduction-container pt-24'>
        <div className='introduction text-center text-4xl font-bold text-blue-400'>
          언제, 어디서든 그림을 배울 수 있어요
        </div>
        <div>
          <p className='pt-3 text-center text-2xl font-normal text-gray-400 pb-16'>
            선생님이 쉽고 재미있게 알려주실거에요
          </p>
        </div>
      </div>
      <div className='mx-52'>
        <RoomListComponent></RoomListComponent>
      </div>
    </div>
  );
}
