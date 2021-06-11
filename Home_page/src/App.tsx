import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import { HomeComponent } from './pages/home';
import RoomCreateComponent from './pages/home/components/room-create-form';
import { FeedbackComponent } from './pages/home/components/feedback';
import { NavBarComponent } from './pages/home/components/nav';

function App() {
  return (
    <div className='App font-apply text-2xl'>
      <div>
        <NavBarComponent></NavBarComponent>
        <main>
          <Route path='/' component={HomeComponent} exact />
          <Route path='/room' component={RoomCreateComponent} exact />
          <Route path='/feedback' component={FeedbackComponent} exact />
        </main>
      </div>
    </div>
  );
}

export default App;
