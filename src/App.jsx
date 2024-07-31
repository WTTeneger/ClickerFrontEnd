import './App.scss';
import React from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home/Home';
import Slot from './pages/Slot/Slot';
import Tasks from './pages/Tasks/Tasks';
import Upgrades from './pages/Upgrades/Upgrades';
import Ratings from './pages/Ratings/Ratings';
import './i18n';

import i18next from './i18n'

function App() {
  
  return (
    <div className={`App`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/casino" element={<Slot />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/shop" element={<Upgrades />} />
        <Route path="/rating" element={<Ratings />} />
      </Routes>
    </div>
  );
}

export default App;
