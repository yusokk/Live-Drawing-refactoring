import React from 'react';
import './room-list.css';
import { EntranceProps } from '../interfaces/entrance-props-interface';

export function EntranceComponent(props: EntranceProps) {
  return (
    <div
      onClick={(e) => props.onClick(e, props.roomId)}
      className={' flex flex-col items-center w-full mb-20 cursor-pointer'}
    >
      <div className='square rounded-3xl h-full w-full bg-bird-pattern bg-cover hover:bg-red-700 hover:opacity-50'></div>
      <div className={'roomTitle pt-4 text-blue-400 font-semibold w-full truncate'}>{props.roomTitle}</div>
      <div className='text-gray-400 w-full font-normal truncate'>{`${props.roomHostname}`}</div>
    </div>
  );
}
