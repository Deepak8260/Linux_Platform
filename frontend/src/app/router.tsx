import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
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
    path: '/labs',
    element: <LabsCatalogPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/playground',
    element: (
      <ProtectedRoute>
        <PlaygroundPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/labs/:labId',
    element: (
      <ProtectedRoute>
        <LabWorkspacePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/challenges',
    element: (
      <ProtectedRoute>
        <ChallengesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        <LeaderboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recruiter',
    element: (
      <ProtectedRoute>
        <RecruiterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/certificates',
    element: (
      <ProtectedRoute>
        <CertificatesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/badges',
    element: (
      <ProtectedRoute>
        <BadgesPage />
      </ProtectedRoute>
    ),
  },
]);
