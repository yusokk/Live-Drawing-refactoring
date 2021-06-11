export interface roomInfo {
  roomId: string;
  roomTitle: string;
  roomHostname: string;
}

export interface ResponseRoomInfo {
  data: roomInfo[];
}
