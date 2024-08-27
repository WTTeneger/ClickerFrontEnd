import './App.scss';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home/Home';
import Slot from './pages/Slot/Slot';
import Tasks from './pages/Tasks/Tasks';
import Upgrades from './pages/Upgrades/Upgrades';
import Ratings from './pages/Ratings/Ratings';
import './i18n';

import i18next from './i18n'
import Roll from './pages/Roll/Roll';
import Referals from './pages/Referals/Referals';
import BanPage from './pages/Ban/Ban';
import UAccount from './pages/UAccount/UAccount';
import Games from "./pages/Games/Games.jsx";
import Game_LootDuck from "./pages/Game_LootDuck/Game_LootDuck.jsx";

function App() {
  return (
    <div className={`App`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/casino" element={<Slot />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/shop" element={<Upgrades />} />
        <Route path="/rating" element={<Ratings />} />
        <Route path="/roll" element={<Roll />} />
        <Route path="/friends" element={<Referals />} />
        <Route path="/account" element={<UAccount />} />
        <Route path="/games" element={<Games />} />
        <Route path="/game/loot_duck" element={<Game_LootDuck />} />
        {/* <Route path="/ban" element={<BanPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
