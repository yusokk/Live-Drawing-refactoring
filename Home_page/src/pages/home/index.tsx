import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MemoizedRoomList } from './components/room-list';
import { ResponseRoomInfo, roomInfo } from './interfaces/room-info-interface';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCustomState } from '../../context';

export function Home() {
  const [rooms, setRooms] = useState<roomInfo[]>([]);

  const getRooms = () => {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseRoomInfo) => {
      setRooms(res.data);
    });
  };

  useEffect(() => {
    getRooms();

    // 테스트용 하드코딩
    setRooms([
      {
        roomId: '1',
        roomTitle: '1번방',
        roomHostname: '김형우',
      },
      {
        roomId: '2',
        roomTitle: '2번방',
        roomHostname: '김홍지',
      },
    ]);
  }, []);

  const MySwal = withReactContent(Swal);
  const userState = useCustomState();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, [userState]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, roomId: string) => {
      e.preventDefault();

      if (token === null || userId === null) {
        MySwal.fire({
          title: '로그인을 해주세요.',
        });
        return;
      }

      MySwal.fire({
        title: '비밀번호를 입력하세요.',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
          autocomplete: 'off',
        },
        showCancelButton: true,
        preConfirm: (password) => {
          const values = { userId: userId, password: password, roomId: roomId };
          return axios
            .post(`${process.env.REACT_APP_API_URL}/room/entrance/`, values, { headers: headers })
            .then((res) => {
              if (res.status === 200) {
                if (res.data === 'refresh') {
                  Swal.showValidationMessage('삭제된 방입니다. 다시 홈으로 이동합니다.');
                  getRooms();
                  return;
                }

                if (res.data === 'fail') {
                  Swal.showValidationMessage('비밀번호를 입력해주세요.');
                  getRooms();
                  return;
                }

                if (res.data === 'already exist') {
                  Swal.showValidationMessage('잘못된 접근입니다. 이미 방에 입장한 유저입니다.');
                  getRooms();
                  return;
                }

                if (res.data === 'password fail') {
                  Swal.showValidationMessage('비밀번호가 일치하지 않습니다.');
                  getRooms();
                  return;
                }
                window.location.href = `${process.env.REACT_APP_DRAWING_URL}/${roomId}`;
              } else throw new Error();
            })
            .catch((err) => Swal.showValidationMessage('오류가 발생했습니다.'));
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    },
    [token, userId],
  );

  return (
    <>
      <div className='introduction-container text-center pt-24'>
        <h1 className='introduction text-4xl font-bold text-blue-400'>언제, 어디서든 그림을 배울 수 있어요</h1>
        <h2 className='pt-3 text-2xl font-normal text-gray-400 pb-16'>선생님이 쉽고 재미있게 알려주실거에요</h2>
      </div>
      <div className='mx-52'>
        <MemoizedRoomList rooms={rooms} onClick={onClick}></MemoizedRoomList>
      </div>
    </>
  );
}
