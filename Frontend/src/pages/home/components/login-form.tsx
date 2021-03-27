import React from 'react';
import axios from 'axios';

export function SignInComponent() {
  return (
    <div>
      <h1>로그인 페이지</h1>
      <hr />
      {/* 시큐리티는 x-www-form-url-encoded 타입만 인식 */}
      <form action='/login' method='POST'>
        <input type='text' name='username' placeholder='Username' /> <br />
        <input type='password' name='password' placeholder='Password' />
        <br />
        <button>로그인</button>
      </form>
      <a href='http://localhost:8080/oauth2/authorization/google'>구글 로그인</a>
      <a href='http://localhost:8080/oauth2/authorization/facebook'>페이스북 로그인</a>
      <a href='http://localhost:8080/oauth2/authorization/naver'>네이버 로그인</a>
      <a href='/user/join-form'>회원가입을 아직 하지 않으셨나요?</a>
    </div>
  );
}
