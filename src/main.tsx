import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.tsx';
import { DoctorDashboard } from './screens/DoctorDashboard.tsx';

/** The clinician board lives at #dashboard. A hash keeps it reachable on a
 * static host, which cannot rewrite /dashboard back to index.html. */
function matchDashboard() {
  return window.location.hash.startsWith('#dashboard') || window.location.pathname.endsWith('/dashboard');
}

function Root() {
  const [isDashboard, setIsDashboard] = useState(matchDashboard);

  useEffect(() => {
    const onHashChange = () => setIsDashboard(matchDashboard());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return isDashboard ? <DoctorDashboard /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
