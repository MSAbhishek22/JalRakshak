import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { WeatherProvider } from './context/WeatherContext';
import SplashScreen from './components/common/SplashScreen';
import OnboardingWrapper from './components/onboarding/OnboardingWrapper';
import BottomNav from './components/common/BottomNav';
import AlertBanner from './components/alerts/AlertBanner';
import { storage } from './utils/storage';
import { measureCoreWebVitals } from './utils/performance';

// Lazy load pages for fast initial load
const HomePage = lazy(() => import('./pages/HomePage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const AIPage = lazy(() => import('./pages/AIPage'));
const SavingsPage = lazy(() => import('./pages/SavingsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const ImpactDashboard = lazy(() => import('./pages/ImpactDashboard'));
const MandiPricePage = lazy(() => import('./pages/MandiPricePage'));
const CommunityTipsPage = lazy(() => import('./pages/CommunityTipsPage'));
const SchemesPage = lazy(() => import('./pages/SchemesPage'));

function AppShell() {
  const { activeTab, setActiveTab, user, completeOnboarding, alerts, dismissAlert, onboardingComplete } = useApp();

  const [currentPage, setCurrentPage] = useState('app'); // 'app' | 'privacy' | 'terms'
  const [showSplash, setShowSplash] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const isDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true';
  const onboardingDone = onboardingComplete || isDemo || !!storage.get('onboarding_complete');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      import('./utils/demoSeed').then(({ seedDemoData }) => {
        localStorage.removeItem('demo_seeded');
        seedDemoData();
      });
    }
  }, []);

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setShowInstallBanner(false));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Service worker update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.addEventListener('updatefound', () => {
          const w = reg.installing;
          w?.addEventListener('statechange', () => {
            if (w.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      });
    }
  }, []);

  // Handle browser back button for /privacy and /terms
  useEffect(() => {
    const handlePopState = () => setCurrentPage('app');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Performance monitoring
  useEffect(() => { measureCoreWebVitals(); }, []);

  const navigateTo = (page) => {
    if (page === 'privacy' || page === 'terms') {
      window.history.pushState({ page, tab: activeTab }, '', `/${page}`);
      setCurrentPage(page);
    } else {
      setCurrentPage('app');
    }
  };

  const goBack = () => {
    if (currentPage !== 'app') {
      setCurrentPage('app');
      setActiveTab('settings');
      return;
    }
    if (activeTab !== 'home') {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      } else {
        setActiveTab('home');
      }
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!onboardingDone) {
    return (
      <OnboardingWrapper
        onComplete={(userData) => {
          if (userData.language) localStorage.setItem('user_language', userData.language);
          if (userData.crops) localStorage.setItem('user_crops', JSON.stringify(userData.crops));
          if (userData.name) localStorage.setItem('user_name', userData.name);
          if (userData.location) localStorage.setItem('user_location', JSON.stringify(userData.location));
          completeOnboarding(userData);
        }}
      />
    );
  }

  const isLegalPage = currentPage === 'privacy' || currentPage === 'terms';
  const isImpactTab = activeTab === 'impact';
  const isSubPage = activeTab === 'mandi' || activeTab === 'community';

  return (
    <div style={{
      maxWidth: isImpactTab ? '100%' : '430px',
      margin: '0 auto',
      minHeight: '100dvh',
      background: isImpactTab ? '#0F172A' : '#FFFBF5',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'max-width 250ms ease, background 250ms ease',
    }}>
      {/* Update banner */}
      {updateAvailable && (
        <div style={{
          position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: isImpactTab ? '100%' : '430px',
          background: 'linear-gradient(135deg, #0F766E, #0D9488)',
          padding: '12px 16px', zIndex: 600,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
            💧 JalRakshak नया अपडेट उपलब्ध है!
          </span>
          <button onClick={() => window.location.reload()} style={{
            background: '#FFFFFF', color: '#0F766E', border: 'none',
            borderRadius: '8px', padding: '6px 14px', fontSize: '13px',
            fontWeight: 700, cursor: 'pointer'
          }}>
            अपडेट करें
          </button>
        </div>
      )}

      {/* Alert banner — wired to AppContext alerts */}
      {alerts.length > 0 && (
        <AlertBanner
          alert={alerts[0]}
          onDismiss={() => dismissAlert(alerts[0].type)}
          onDetails={() => setActiveTab('weather')}
        />
      )}

      {/* Page content with Framer Motion transitions */}
      <div
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          paddingBottom: 'calc(76px + env(safe-area-inset-bottom))',
          WebkitOverflowScrolling: 'touch',
        }}
        className="hide-scrollbar"
      >
        <Suspense fallback={<PageSkeleton />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLegalPage ? currentPage : activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ width: '100%', minHeight: '100%' }}
            >
              {isLegalPage ? (
                currentPage === 'privacy'
                  ? <PrivacyPolicy onBack={goBack} />
                  : <TermsOfService onBack={goBack} />
              ) : (
                <>
                  {activeTab === 'home' && <HomePage />}
                  {activeTab === 'weather' && <WeatherPage onBack={goBack} />}
                  {activeTab === 'ai' && <AIPage onBack={goBack} />}
                  {activeTab === 'savings' && <SavingsPage onBack={goBack} />}
                  {activeTab === 'impact' && <ImpactDashboard onBack={goBack} />}
                  {activeTab === 'settings' && <SettingsPage onNavigate={navigateTo} onBack={goBack} />}
                  {activeTab === 'mandi' && <MandiPricePage onBack={goBack} />}
                  {activeTab === 'community' && <CommunityTipsPage onBack={goBack} />}
                  {activeTab === 'schemes' && <SchemesPage onBack={goBack} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* Bottom nav — always reachable across all screens except onboarding */}
      <BottomNav />

      {/* PWA install banner */}
      {showInstallBanner && installPrompt && (
        <div style={{
          position: 'fixed', bottom: 'calc(72px + env(safe-area-inset-bottom) + 12px)',
          left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)', maxWidth: '430px',
          background: '#FFFFFF', border: '2px solid #0F766E',
          borderRadius: '16px', padding: '16px',
          boxShadow: '0 8px 24px rgba(15, 118, 110, 0.2)',
          display: 'flex', alignItems: 'center', gap: '12px',
          zIndex: 50, animation: 'slideUpFade 300ms ease'
        }}>
          <span style={{ fontSize: '32px' }}>📲</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              JalRakshak इंस्टॉल करें
            </p>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
              बिना इंटरनेट भी काम करेगा
            </p>
          </div>
          <button onClick={async () => {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            setInstallPrompt(null);
            setShowInstallBanner(false);
          }} style={{
            background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
            color: '#FFFFFF', border: 'none', borderRadius: '10px',
            padding: '10px 16px', fontSize: '14px', fontWeight: 700, cursor: 'pointer'
          }}>
            इंस्टॉल
          </button>
          <button onClick={() => setShowInstallBanner(false)} style={{
            background: 'none', border: 'none', fontSize: '22px',
            cursor: 'pointer', color: '#94A3B8', padding: '4px',
            lineHeight: 1, position: 'relative'
          }}>×</button>
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div style={{ padding: '20px 16px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '20px', marginBottom: '16px' }} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <WeatherProvider>
        <AppShell />
      </WeatherProvider>
    </AppProvider>
  );
}