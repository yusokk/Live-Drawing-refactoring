import React from 'react';
import '../index.css';
import { EraseSizeComponentProps } from '../interfaces/erase-size-interfaces';

function EraseSizeComponent(props: EraseSizeComponentProps) {
  function changeEraserSize(e: React.ChangeEvent<HTMLInputElement>) {
    props.setEraserWidth(Number(e.target.value));
    props.setCursorWidth(Number(e.target.value));
  }

  return (
    <>
      <input
        id='eraseSlider'
        type='range'
        min='5'
        max='100'
        value={props.eraserWidth}
        onChange={changeEraserSize}
      />
      {props.eraserWidth}
    </>
  );
}

export default EraseSizeComponent;
