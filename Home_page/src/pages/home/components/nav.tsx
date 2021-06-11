import React, { useEffect, useState } from 'react';
import { LogoutComponent } from './logout-component';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useCustomDispatch, useCustomState } from '../../../context';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../interfaces/decoded-token-interface';

export function NavBarComponent() {
  const [isToken, setIsToken] = useState(localStorage.getItem('token'));
  const userState = useCustomState();
  const userDispatch = useCustomDispatch();
  const history = useHistory();
  const MySwal = withReactContent(Swal);
  const config = {
    headers: {
      'Content-Type': 'application/json; charset-utf-8',
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const decodedToken: DecodedToken = jwt_decode(token);
      userDispatch({ type: 'SET_ID', name: decodedToken.username, token: token });
    }
  }, []);

  const responseGoogle = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    axios.post(`${process.env.REACT_APP_API_URL}/oauth/jwt/google`, JSON.stringify(res), config).then((res) => {
      const decodedToken: DecodedToken = jwt_decode(res.data.Authorization);
      userDispatch({ type: 'SET_ID', name: decodedToken.username, token: res.data.Authorization });
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('token', res.data.Authorization);
      if (res.status === 200) {
        MySwal.fire({
          title: <p>로그인 되었습니다.</p>,
          text: '홈으로 돌아갑니다.',
        }).then(() => history.push(''));
      }
    });
  };

  useEffect(() => {
    setIsToken(localStorage.getItem('token'));
  }, [userState]);

  return (
    <div className='header h-full'>
      <nav className='nav-bottom h-1/12 pt-1'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 '>
          <div className='relative flex items-center justify-between h-nav'>
            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'></div>
            <div className='flex flex h-full w-10/12  items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='h-full flex-shrink-0 flex items-center text-4xl font-bold text-blue-400'>
                <Link to='/'>
                  <img className='w-44 items-center' src='/logo.png'></img>
                </Link>
              </div>
              <div className='hidden sm:block sm:ml-6 self-center px-1 w-7/12 h-full'>
                <div className='flex flex-row py-4'>
                  <Link
                    to='/room'
                    className='text-gray-400  hover:text-blue-400 px-10 py-2 rounded-md text-lg truncate font-medium '
                  >
                    라이브강의 만들기 &nbsp;
                    <i className='ri-artboard-line'></i>
                  </Link>
                  <Link
                    to='/feedback'
                    className='text-gray-400 hover:text-blue-400 px-1 py-2 rounded-md text-lg truncate font-medium'
                  >
                    <div className='truncate'>
                      피드백 남기기 &nbsp;
                      <i className='ri-chat-smile-2-line'></i>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className='absolute inset-y-0 mt-1 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
              {isToken ? (
                <>
                  <div className='mr-5 text-gray-400 font-medium text-lg'>{`${userState.name}`}</div>{' '}
                  <LogoutComponent />
                </>
              ) : (
                <GoogleLogin
                  clientId='234586769421-7gqq45aokbu6mn00rbg6gdcbekmd5ert.apps.googleusercontent.com'
                  buttonText={'구글로 로그인하기'}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className='my-auto px-3 py-2 h-10 text-lg rounded-lg truncate shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
                    >
                      Google 로그인
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  // cookiePolicy={'single_host_origin'}
                />
              )}
              <div className='ml-3 relative'></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
