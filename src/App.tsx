import { useEffect } from 'react';
import i18n, { applyDocumentDirection, SUPPORTED_LANGUAGES } from './i18n';
import { useSessionStore } from './state/sessionStore';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LanguagePickerScreen } from './screens/LanguagePickerScreen';
import { PatientTypeScreen } from './screens/PatientTypeScreen';
import { BodyMapScreen } from './screens/BodyMapScreen';
import { PainTypeScreen } from './screens/PainTypeScreen';
import { IntensityScreen } from './screens/IntensityScreen';
import { DurationScreen } from './screens/DurationScreen';
import { PatternScreen } from './screens/PatternScreen';
import { ExtrasScreen } from './screens/ExtrasScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { DoctorViewScreen } from './screens/DoctorViewScreen';

function Screen() {
  const step = useSessionStore((s) => s.step);
  switch (step) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'language':
      return <LanguagePickerScreen />;
    case 'patientType':
      return <PatientTypeScreen />;
    case 'bodyMap':
      return <BodyMapScreen />;
    case 'painType':
      return <PainTypeScreen />;
    case 'intensity':
      return <IntensityScreen />;
    case 'duration':
      return <DurationScreen />;
    case 'pattern':
      return <PatternScreen />;
    case 'extras':
      return <ExtrasScreen />;
    case 'review':
      return <ReviewScreen />;
    case 'doctor':
      return <DoctorViewScreen />;
    default:
      return <WelcomeScreen />;
  }
}

function App() {
  const largeMode = useSessionStore((s) => s.largeMode);
  const patientLanguage = useSessionStore((s) => s.patientLanguage);

  useEffect(() => {
    document.documentElement.classList.toggle('large-mode', largeMode);
  }, [largeMode]);

  useEffect(() => {
    if (!patientLanguage) return;
    applyDocumentDirection(patientLanguage);
    i18n.changeLanguage(SUPPORTED_LANGUAGES.includes(patientLanguage) ? patientLanguage : 'en');
  }, [patientLanguage]);

  return <Screen />;
}

export default App;
