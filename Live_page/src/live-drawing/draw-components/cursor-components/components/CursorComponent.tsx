import React, { useState, useEffect } from 'react';
import { CursorComponentProps } from '../interfaces/cursor-interfaces';
import '../../DrawComponent.css';

function CursorComponent(props: CursorComponentProps) {
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const onMouseMove = (e: MouseEvent): void => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseLeave = (): void => {
    setHidden(true);
  };

  const onMouseEnter = (): void => {
    setHidden(false);
  };

  const addEventListeners = (): void => {
    const targetCanvasContainer: HTMLElement | null = document.getElementById(
      'drawable-canvas',
    );
    targetCanvasContainer?.addEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.addEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.addEventListener('mouseleave', onMouseLeave);
  };

  const removeEventListeners = (): void => {
    const targetCanvasContainer: HTMLElement | null = document.getElementById(
      'drawable-canvas',
    );
    targetCanvasContainer?.removeEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.removeEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.removeEventListener('mouseleave', onMouseLeave);
  };

  useEffect(() => {
    addEventListeners();
    return (): void => removeEventListeners();
  }, []);

  return (
    <div
      className={hidden ? 'cursor cursor--hidden ' : 'cursor'}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${props.cursorWidth}px`,
        height: `${props.cursorWidth}px`,
      }}
    />
  );
}

export default CursorComponent;