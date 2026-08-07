import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/modals/AuthModal';
import { router } from './app/router';
import { RouterProvider } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <AuthModal />
    </AuthProvider>
  );
};

export default App;
