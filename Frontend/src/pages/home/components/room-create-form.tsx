import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RoomCreateComponent() {
  const [values, setValues] = useState({
    member_name: '',
    room_title: '',
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post('http://localhost:8080/room', values)
      .then((response) => {
        if (response.status === 200) {
          window.location.href = `/room/${response.data['roomKey']}`;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    // <div>
    //   <p>라이브방 만들기</p>
    //   <form onSubmit={submitHandler}>
    //     <div>
    //       방주인 : &nbsp;
    //       <input type='text' name='member_name' value={values.member_name} onChange={changeHandler}></input>
    //     </div>
    //     <div>
    //       방제목 : &nbsp;
    //       <input type='text' name='room_title' value={values.room_title} onChange={changeHandler}></input>
    //     </div>
    //     {/* <Redirect to="/draw/1234"> */}
    //     <p>
    //       <button type='submit'>방 만들기</button>
    //     </p>
    //     {/* </Redirect> */}
    //   </form>
    // </div>
    <div>
      <div className='w-full flex justify-center items-center bg-gradient-to-tr from-blue-200 to-blue-0 h-mainBox'>
        <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop p-1'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div>
          <div className='w-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4'>
            <h3 className='mb-4 font-bold text-xl flex items-center text-blue-500'>방 제목과 비밀번호를 입력하세요</h3>
            <form action='#' className='px-3 flex flex-col justify-center items-center w-full gap-3'>
              <input
                type='text'
                placeholder='제목을 입력하세요.'
                // onChange={onChangeUserName}
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <input
                type='password'
                placeholder='비밀번호를 입력하세요.'
                // onChange={onChangePassword1}
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <button
                // onClick={onClick}
                // disabled={buttonFlag}
                className='flex m-3 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold focus:outline-none focus:ring rounded px-3 py-1'
              >
                방에 들어가기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
