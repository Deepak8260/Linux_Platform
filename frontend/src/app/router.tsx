import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PlaygroundPage } from '../pages/PlaygroundPage';
import { LabsCatalogPage } from '../pages/LabsCatalogPage';
import { LabWorkspacePage } from '../pages/LabWorkspacePage';
import { ChallengesPage } from '../pages/ChallengesPage';
import { LeaderboardPage } from '../pages/LeaderboardPage';
import { RecruiterPage } from '../pages/RecruiterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { CertificatesPage } from '../pages/CertificatesPage';
import { BadgesPage } from '../pages/BadgesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/playground',
    element: <PlaygroundPage />,
  },
  {
    path: '/labs',
    element: <LabsCatalogPage />,
  },
  {
    path: '/labs/:labId',
    element: <LabWorkspacePage />,
  },
  {
    path: '/challenges',
    element: <ChallengesPage />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: '/recruiter',
    element: <RecruiterPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/certificates',
    element: <CertificatesPage />,
  },
  {
    path: '/badges',
    element: <BadgesPage />,
  },
]);
