import React, { useEffect } from 'react';
import { AppProvider } from '../context/AppContext';
import Router from './Router';
import { authService } from '../services/auth.service';

const App = () => {
  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getCurrentUser().catch(() => {});
    }
  }, []);

  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;