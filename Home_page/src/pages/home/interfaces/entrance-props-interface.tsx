import { roomInfo } from './room-info-interface';

export interface EntranceProps extends roomInfo {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, roomId: string) => void;
}

export interface RoomListProps {
  rooms: roomInfo[];
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, roomId: string) => void;
}

export interface Values {
  roomId: string;
  password: string;
  userId: string | null;
}
