import React from 'react';
import { Home, CloudSun, Mic, Bot, Droplets, Settings2 } from 'lucide-react';
import { useApp, useT } from '../../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();
  const t = useT();

  const handleTabClick = (id) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(8); } catch (e) {}
    }
    setActiveTab(id);
  };

  const tabs = [
    { id: 'home', Icon: Home, label: t('home') },
    { id: 'weather', Icon: CloudSun, label: t('weather') },
    { id: 'ai', Icon: Mic, ActiveIcon: Bot, label: t('aiChat'), center: true },
    { id: 'impact', Icon: Droplets, label: t('impact') },
    { id: 'settings', Icon: Settings2, label: t('settings') },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        background: '#FFFFFF',
        borderTop: '1px solid #CCFBF1',
        boxShadow: '0 -2px 16px rgba(15, 118, 110, 0.08)',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
        height: 'calc(64px + env(safe-area-inset-bottom))'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = isActive && tab.ActiveIcon ? tab.ActiveIcon : tab.Icon;

        if (tab.center) {
          return (
            <button
              key={tab.id}
              data-testid="nav-ai"
              onClick={() => handleTabClick(tab.id)}
              className="active:scale-95 transition-transform duration-150"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: '8px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
              aria-label={t('aiChat')}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  width: '54px',
                  height: '54px',
                  borderRadius: '27px',
                  background: isActive
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : 'linear-gradient(135deg, #0F766E, #14B8A6)',
                  border: '3px solid #FFFFFF',
                  boxShadow: isActive
                    ? '0 4px 18px rgba(245, 158, 11, 0.45)'
                    : '0 4px 18px rgba(15, 118, 110, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <IconComponent size={26} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0F766E' : '#64748B',
                  marginTop: '4px',
                  lineHeight: 1
                }}
              >
                {isActive ? t('aiChat') : tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            data-testid={`nav-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            className="active:scale-95 transition-all duration-150"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label={tab.label}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '28px',
                  height: '3px',
                  borderRadius: '0 0 4px 4px',
                  background: 'linear-gradient(to right, #0F766E, #38BDF8)'
                }}
              />
            )}
            <div
              style={{
                marginBottom: '4px',
                color: isActive ? '#0F766E' : '#94A3B8',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 200ms ease'
              }}
            >
              <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span
              style={{
                fontSize: '11px',
                lineHeight: 1,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0F766E' : '#64748B'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
