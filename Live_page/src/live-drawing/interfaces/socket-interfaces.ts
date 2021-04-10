export interface RoomInfo {
  roomTitle: string | null;
  roomId: string | null;
  username: string | null;
  userId: string | null;
  userImage: string | null;
  roomHostId: string | null;
}

export interface ResponseData {
  roomInfo: RoomInfo;
}

export interface UserInfo {
  username: string;
  userId: string;
  userImage: string;
  roomId: string;
  roomTitle: string;
  socketId: SocketIOClient.Socket | null;
}

export interface RoomUsers {
  roomId: string;
  users: UserInfo[];
}
