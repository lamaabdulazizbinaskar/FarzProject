import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.tsx';
import { DoctorDashboard } from './screens/DoctorDashboard.tsx';

const isDashboard = window.location.pathname.startsWith('/dashboard');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isDashboard ? <DoctorDashboard /> : <App />}</StrictMode>,
);
