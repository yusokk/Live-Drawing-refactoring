import React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import HomeComponent from './pages/home';
import RoomCreateComponent from './pages/home/components/room-create-form';
import testComponent from './pages/home/components/testcomponent';
import { EntranceComponent } from './pages/home/components/entrance';

function App() {
  return (
    <div className='App'>
      <main>
        <div>
          <Route path='/' component={HomeComponent} exact />
          <Route path='/member/sign-in' component={HomeComponent} exact />
          <Route path='/member/sign-up' component={HomeComponent} exact />
          <Route path='/room/:roomKey' component={testComponent} exact />
          <Route path='/room' component={RoomCreateComponent} exact />
          <Route path='/mypage' component={HomeComponent} exact />
        </div>
      </main>
    </div>
  );
}

export default App;
