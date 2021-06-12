import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import { Home } from './pages/home';
import RoomCreateComponent from './pages/home/components/room-create-form';
import { FeedbackComponent } from './pages/home/components/feedback';
import { NavBarComponent } from './pages/home/components/nav';

function App() {
  return (
    <div className='App font-apply text-2xl'>
      <div>
        <NavBarComponent></NavBarComponent>
        <main className='w-screen'>
          <Route path='/' component={Home} exact />
          <Route path='/room' component={RoomCreateComponent} exact />
          <Route path='/feedback' component={FeedbackComponent} exact />
        </main>
      </div>
    </div>
  );
}

export default App;
