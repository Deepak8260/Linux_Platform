import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { LabsCatalogPage } from './pages/LabsCatalogPage';
import { LabWorkspacePage } from './pages/LabWorkspacePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { RecruiterPage } from './pages/RecruiterPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/labs" element={<LabsCatalogPage />} />
        <Route path="/labs/:labId" element={<LabWorkspacePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
