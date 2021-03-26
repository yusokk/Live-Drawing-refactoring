// import { useCanvasCtxsState } from '../pages/draw/DrawContext';
// import { broadcast } from '../connections/load';

import {
  DrawData,
  EraseData,
  Point,
  RectData,
} from '../pages/draw/interfaces/draw-interfaces';
import { PeerConnectionContext } from '../pages/draw/interfaces/index-interfaces';

// const canvasCtxs = useCanvasCtxsState();
// pencil_slider = document.getElementById('pencilSlider');
// pencil_slider.addEventListener('mouseup', changePencilSize)

// interface point {
//   x: number;
//   y: number;
// }

//! any 수정
// let points: any = [];
// const pathsry: any = [];
let activeShape: RectData | undefined;
let lastPoint: Point | undefined;
let originPoint: Point | undefined;
let force: number = 1;

//! msg: any 수정
// export function actionPeerData(msg: any) {
//   if (msg.event === 'draw') {
//     draw(msg, null);
//   } else if (msg.event === 'drawRect') {
//     drawRect(msg, false, null);
//   } else if (msg.event === 'clear') {
//     // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//   } else if (msg.event === 'drawHistoryData') {
//     // drawHistoryData(msg);
//   }
// }

// function drawHistoryData(data: any) {
//   if (is_new) {
//     data.history.forEach((elem: any) => {
//       //! 이벤트 종류 추가해야 함
//       draw(elem);
//     });

//     is_new = false;
//   }
// }

export function broadcast(
  data: string,
  peerConnectionContext: PeerConnectionContext,
) {
  for (const peerId in peerConnectionContext.channels) {
    // peerConnectionContext.channels[peerId].send(data);
    if (peerConnectionContext.channels[peerId].readyState === 'open') {
      peerConnectionContext.channels[peerId].send(data);
    }
  }
}

//! msg: any 수정
export function draw(
  data: DrawData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  // console.log(canvasCtxs);
  // console.log('draw');
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  // points.push({ x: data.x, y: data.y });
  canvasCtx.beginPath();
  canvasCtx.moveTo(data.lastPoint.x, data.lastPoint.y);
  canvasCtx.lineTo(data.x, data.y);
  canvasCtx.strokeStyle = data.color;
  canvasCtx.lineWidth = data.lineWidth;
  canvasCtx.stroke();
  canvasCtx.closePath();
}

//! msg: any 수정
export function drawRect(
  data: RectData,
  commit: boolean,
  canvasCtx: CanvasRenderingContext2D,
): void {
  // activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  if (data.commit || commit) {
    canvasCtx.strokeStyle = data.color;
    canvasCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
  } else {
    // activeCtx.strokeStyle = data.color;
    // activeCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
  }
  activeShape = data;
}

export function erase(
  data: EraseData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  // console.log('erase');
  const x = data.x;
  const y = data.y;
  const r = data.r / 2;
  for (let i = 0; i < Math.round(Math.PI * r); i++) {
    const angle = (i / Math.round(Math.PI * r)) * 360;
    canvasCtx.clearRect(
      x,
      y,
      Math.sin(angle * (Math.PI / 180)) * r,
      Math.cos(angle * (Math.PI / 180)) * r,
    );
  }
}

export function mouseDown(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
): void {
  // console.log('down');
  originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  // points = [];
  // points.push(originPoint);
}

export function mouseUp(
  canvasCtx: CanvasRenderingContext2D | null,
  peerConnectionContext: PeerConnectionContext,
): void {
  // console.log('up');
  // pathsry.push(points);
  if (activeShape && canvasCtx !== null) {
    drawRect(activeShape, true, canvasCtx);
    broadcast(
      JSON.stringify(
        Object.assign(
          {
            event: 'drawRect',
            commit: true,
          },
          activeShape,
        ),
      ),
      peerConnectionContext,
    );
    activeShape = undefined;
  }
  lastPoint = undefined;
  originPoint = undefined;
}

export function mouseMove(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  canvasCtx: CanvasRenderingContext2D | null,
  activeTool: string,
  color: string,
  lineWidth: number,
  eraserWidth: number,
  peerConnectionContext: PeerConnectionContext,
): void {
  // console.log('move');

  if (e.buttons && canvasCtx !== null) {
    if (!lastPoint) {
      lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      return;
    }

    if (activeTool === 'pencil') {
      draw(
        {
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          force: force,
          color: color,
          lineWidth: lineWidth,
        },
        canvasCtx,
      );

      broadcast(
        JSON.stringify({
          event: 'draw',
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          force: force,
          color: color,
          lineWidth: lineWidth,
        }),
        peerConnectionContext,
      );
    } else if (activeTool === 'rect' && originPoint) {
      const origin = {
        x: Math.min(originPoint.x, e.nativeEvent.offsetX),
        y: Math.min(originPoint.y, e.nativeEvent.offsetY),
      };
      drawRect(
        {
          origin: origin,
          color: color,
          width: Math.abs(originPoint.x - e.nativeEvent.offsetX),
          height: Math.abs(originPoint.y - e.nativeEvent.offsetY),
        },
        false,
        canvasCtx,
      );
      broadcast(
        JSON.stringify({
          event: 'drawRect',
          origin: origin,
          color: color,
          width: Math.abs(originPoint.x - e.nativeEvent.offsetX),
          height: Math.abs(originPoint.y - e.nativeEvent.offsetY),
        }),
        peerConnectionContext,
      );
    } else if (activeTool === 'eraser') {
      // console.log(eraserWidth);
      erase(
        {
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          r: eraserWidth,
        },
        canvasCtx,
      );
    }
    lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  } else {
    lastPoint = { x: 0, y: 0 };
  }
}

export function key(e: any): void {
  // console.log('key');
  // console.log(e);
  // if (e.key === 'Backspace') {
  //   canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  //   broadcast(
  //     JSON.stringify({
  //       event: 'clear',
  //     })
  //   );
  // }
  // if (e.key === 'ArrowRight') {
  //   colorIndex++;
  // }
  // if (e.key === 'ArrowLeft') {
  //   colorIndex--;
  // }
  // if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
  //   if (colorIndex >= colorMap.length) {
  //     colorIndex = 0;
  //   }
  //   if (colorIndex < 0) {
  //     colorIndex = colorMap.length - 1;
  //   }
  //   if (colorElements[color]) {
  //     colorElements[color].classList.remove('active');
  //   }
  //   color = colorMap[colorIndex];
  //   colorPicker.dataset.color = color;
  //   colorPicker.style.color = color;
  //   colorElements[color].classList.toggle('active');
  // }
  // if (
  //   mouseDown &&
  //   (e.key === 'ArrowUp' ||
  //     (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))
  // ) {
  //   force += 0.025;
  // }
  // if (
  //   mouseDown &&
  //   (e.key === 'ArrowDown' ||
  //     (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))
  // ) {
  //   force -= 0.025;
  // }
}

export function forceChanged(e: any): void {
  force = e.webkitForce || 1;
}
