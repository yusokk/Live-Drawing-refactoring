import { draw, erase } from './draw-functions';

import {
  DrawData,
  EraseData,
  Point,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';
import { RoomInfo } from '../../interfaces/socket-interfaces';

let lastPoint: Point | null;
let isMoved = false;

function getTouchPos(canvas: HTMLCanvasElement, touchEvent: any) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
    c: touchEvent.target.id,
  };
}

export function drawStart(ctx: CanvasRenderingContext2D, point: Point) {
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  lastPoint = point;
}

export function drawEnd(
  ctx: CanvasRenderingContext2D,
  point: Point,
  isMoved: boolean,
) {
  if (!isMoved) {
    // ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
}

export function mouseDown(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  e.preventDefault();
  isMoved = false;
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  drawStart(targetCanvasCtx, lastPoint);
  socket.emit('draw-start', { point: lastPoint, canvasId: targetCanvasId });
}

export function touchStart(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;
  e.preventDefault();
  isMoved = false;
  console.log(e.touches[0]);
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  lastPoint = getTouchPos(targetCanvasCtx.canvas, e);
  targetCanvasCtx.beginPath();
  targetCanvasCtx.moveTo(lastPoint.x, lastPoint.y);
  socket.emit('draw-start', { point: lastPoint, canvasId: targetCanvasId });
}

export function touchMove(
  e: any,
  activeTool: string,
  canvasCtxTable: CanvasCtxTable,
  color: string,
  eraserWidth: number,
  lineWidth: number,
  roomInfo: RoomInfo,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!lastPoint) {
    lastPoint = getTouchPos(targetCanvasCtx.canvas, e);
    return;
  }

  if (!targetCanvasId || !targetCanvasCtx) return;

  const currentPoint: Point = getTouchPos(targetCanvasCtx.canvas, e);
  if (lastPoint.c !== currentPoint.c) return;
  isMoved = true;
  switch (activeTool) {
    case 'pencil':
      const drawData: DrawData = {
        event: 'pencil',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        color: color,
        lastPoint: lastPoint,
        lineWidth: lineWidth,
      };
      draw(drawData, targetCanvasCtx);
      socket.emit('draw-pencil', drawData);
      break;

    case 'eraser':
      const eraserData: EraseData = {
        event: 'eraser',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        r: eraserWidth,
      };
      erase(eraserData, targetCanvasCtx);
      socket.emit('draw-eraser', eraserData);
      break;
  }
  lastPoint = getTouchPos(targetCanvasCtx.canvas, e);
}

export function mouseMove(
  e: any,
  activeTool: string,
  canvasCtxTable: CanvasCtxTable,
  color: string,
  eraserWidth: number,
  lineWidth: number,
  roomInfo: RoomInfo,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;

  if (!e.buttons) {
    lastPoint = null;
    return;
  }

  if (!lastPoint) {
    lastPoint = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      c: e.target.id,
    };
    return;
  }

  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!targetCanvasId || !targetCanvasCtx) return;

  const currentPoint: Point = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  if (lastPoint.c !== currentPoint.c) return;
  isMoved = true;
  switch (activeTool) {
    case 'pencil':
      const drawData: DrawData = {
        event: 'pencil',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        color: color,
        lastPoint: lastPoint,
        lineWidth: lineWidth,
      };
      draw(drawData, targetCanvasCtx);
      socket.emit('draw-pencil', drawData);
      break;

    case 'eraser':
      const eraserData: EraseData = {
        event: 'eraser',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        r: eraserWidth,
      };
      erase(eraserData, targetCanvasCtx);
      socket.emit('draw-eraser', eraserData);
      break;
  }
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
}

export function mouseUp(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
): void {
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!lastPoint) return;
  drawEnd(targetCanvasCtx, lastPoint, isMoved);
  lastPoint = null;
  if (socket)
    socket.emit('draw-end', {
      ctx: targetCanvasCtx,
      point: lastPoint,
      isMoved: isMoved,
    });
}

export function touchEnd(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
): void {
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!lastPoint) return;
  drawEnd(targetCanvasCtx, lastPoint, isMoved);
  lastPoint = null;
  if (socket)
    socket.emit('draw-end', {
      ctx: targetCanvasCtx,
      point: lastPoint,
      isMoved: isMoved,
    });
}
