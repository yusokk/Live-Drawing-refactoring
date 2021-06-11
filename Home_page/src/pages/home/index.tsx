import React, { useState, useEffect } from 'react';
import { RoomListComponent } from './components/room-list';

export function HomeComponent() {
  return (
    <div className='container'>
      <div className='lecture-container w-screen'>
        <div className='titleAndButton'>
          <div className='titleContainer pt-20'>
            <div className='title pb- text-center text-3xl font-bold text-blue-400'>
              언제, 어디서든 그림을 배워봅시다
            </div>
            <div>
              <p className='pt-3 text-center text-2xl font-normal text-gray-400 pb-12'>
                선생님이 쉽게 알려주실거에요. 걱정은 넣어둬~~
              </p>
            </div>
          </div>
        </div>
        <div className='mx-52'>
          <RoomListComponent></RoomListComponent>
        </div>
      </div>
    </div>
  );
}
