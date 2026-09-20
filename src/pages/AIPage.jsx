import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Trash2, Mic, MicOff, Send, Volume2, Bookmark, Wifi, WifiOff, ArrowLeft } from 'lucide-react';
import { useApp, useT } from '../context/AppContext';
import { useVoice } from '../hooks/useVoice';
import { storage } from '../utils/storage';
import { trackEvent, EVENTS } from '../firebase/analytics';
import Tappable from '../components/common/Tappable';

const CHIPS = {
  hi: [
    '💧 आज पानी देना चाहिए?',
    '🌦️ अगले 7 दिन मौसम कैसा है?',
    '🐛 फसल को कीड़ों से कैसे बचाएं?',
    '🌱 गेहूं में खाद कब डालें?',
    '🏪 आज का मंडी भाव क्या है?',
    '📋 PM-KISAN योजना क्या है?',
  ],
  en: [
    '💧 Should I irrigate today?',
    '🌦️ 7-day weather forecast?',
    '🐛 How to protect crops from pests?',
    '🌱 When to apply fertilizer to wheat?',
    '🏪 What are today\'s mandi prices?',
    '📋 What is PM-KISAN scheme?',
  ],
  bn: [
    '💧 আজ সেচ দেওয়া উচিত?',
    '🌦️ আগামী ৭ দিনের আবহাওয়া?',
    '🐛 ফসলকে পোকা থেকে কীভাবে রক্ষা করবেন?',
  ],
  mr: [
    '💧 आज पाणी द्यावे का?',
    '🌦️ पुढचे ७ दिवस हवामान कसे असेल?',
    '🐛 पिकाला कीडीपासून कसे वाचवायचे?',
  ],
  pa: [
    '💧 ਅੱਜ ਪਾਣੀ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?',
    '🌦️ ਅਗਲੇ 7 ਦਿਨ ਮੌਸਮ ਕਿਵੇਂ ਰਹੇਗਾ?',
  ],
};

export default function AIPage({ onBack }) {
  const { user, setActiveTab } = useApp();
  const t = useT();
  const lang = user?.language || 'hi';
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isUnmounted = useRef(false);

  useEffect(() => () => { isUnmounted.current = true; }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Pick up voice query from global FAB
  useEffect(() => {
    const pending = storage.get('pending_voice_query');
    if (pending) {
      storage.remove('pending_voice_query');
      setTimeout(() => sendMessage(pending), 500);
    }
  }, []);

  const { isListening, isSupported, error: micError, startListening, stopListening, speak } = useVoice(
    lang,
    (transcript) => {
      if (transcript) sendMessage(transcript);
    }
  );

  useEffect(() => {
    if (micError) { setVoiceError(micError); setTimeout(() => setVoiceError(''), 4000); }
  }, [micError]);

  const sendMessage = useCallback(async (textOverride) => {
    const text = (typeof textOverride === 'string' ? textOverride : inputText).trim();
    if (!text || isLoading) return;

    if (!isUnmounted.current) {
      setInputText('');
      if (inputRef.current) { inputRef.current.style.height = '48px'; }
    }

    const userMsg = { id: `u_${Date.now()}`, role: 'user', content: text };
    if (!isUnmounted.current) setMessages(prev => [...prev, userMsg]);
    if (!isUnmounted.current) setIsLoading(true);

    trackEvent(EVENTS.AI_MESSAGE_SENT, { len: text.length, lang });

    // Build context
    const weatherCache = storage.get('weather_cache');
    const weatherCtx = weatherCache
      ? `आज का मौसम: ${weatherCache.current?.temperature}°C, ${weatherCache.current?.description}, बारिश की संभावना: ${weatherCache.rainProbabilityNext24h}%`
      : 'मौसम डेटा उपलब्ध नहीं';

    const history = messages.slice(-8).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.content
    }));

    try {
      if (!navigator.onLine) throw new Error('offline');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          language: lang,
          crop: Array.isArray(user?.crops) ? user.crops : ['गेहूं'],
          weatherContext: weatherCtx,
          conversationHistory: history,
        }),
      });

      clearTimeout(timeoutId);

      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        const retryMsg = { id: `s_${Date.now()}`, role: 'ai', content: `⏳ ${d.error || 'थोड़ी देर बाद कोशिश करें।'}`, isSystem: true };
        if (!isUnmounted.current) setMessages(prev => [...prev, retryMsg]);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.error) {
          throw new Error(`API_ERROR:${errData.error}`);
        }
        throw new Error(`HTTP_${res.status}`);
      }

      const data = await res.json();
      if (!data?.reply) throw new Error('empty_reply');

      const aiMsg = { id: `a_${Date.now()}`, role: 'ai', content: data.reply };
      if (!isUnmounted.current) setMessages(prev => [...prev, aiMsg]);
      trackEvent(EVENTS.AI_RESPONSE_RECEIVED, { tokens: data.tokens || 0 });

    } catch (err) {
      if (err.message.startsWith('API_ERROR:')) {
        const errorText = err.message.substring(10);
        const errMsg = { id: `e_${Date.now()}`, role: 'ai', content: `⚠️ सर्वर त्रुटि (Server Error):\n${errorText}` };
        if (!isUnmounted.current) setMessages(prev => [...prev, errMsg]);
      } else {
        const { getOfflineResponse } = await import('../data/offlineResponses.js');
        const fallback = getOfflineResponse(text, lang);
        const label = err.message === 'offline' ? '📴 ऑफलाइन — ' : err.name === 'AbortError' ? '⏱️ समय सीमा — ' : '⚠️ (Network Error) ';
        const errMsg = { id: `e_${Date.now()}`, role: 'ai', content: `${label}${fallback}` };
        if (!isUnmounted.current) setMessages(prev => [...prev, errMsg]);
      }
    } finally {
      if (!isUnmounted.current) setIsLoading(false);
    }
  }, [inputText, isLoading, lang, messages, user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFBF5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E, #115E59)',
        padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(15, 118, 110, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tappable
            onClick={() => onBack ? onBack() : setActiveTab('home')}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white"
            ariaLabel="Back"
          >
            <ArrowLeft size={18} />
          </Tappable>
          <div className="w-8 h-8 rounded-full bg-teal-800/80 flex items-center justify-center text-teal-200">
            <Bot size={20} />
          </div>
          <div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', display: 'block', lineHeight: 1.1 }}>
              JalRakshak AI
            </span>
            <span style={{ fontSize: '11px', color: '#99F6E4' }}>कृषि विज्ञान केंद्र सहायक</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: navigator.onLine ? '#34D399' : '#94A3B8' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
              {navigator.onLine ? 'ऑनलाइन' : 'ऑफलाइन'}
            </span>
          </div>
          {messages.length > 0 && (
            <Tappable
              onClick={() => setMessages([])}
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white"
              ariaLabel="Clear chat"
            >
              <Trash2 size={16} />
            </Tappable>
          )}
        </div>
      </div>

      {/* Voice Error banner */}
      {voiceError && (
        <div style={{ background: '#FEF2F2', borderBottom: '1px solid #F87171', padding: '10px 16px' }}>
          <p style={{ fontSize: '13px', color: '#991B1B', margin: 0 }}>⚠️ {voiceError}</p>
        </div>
      )}

      {/* Offline banner */}
      {!navigator.onLine && (
        <div style={{ background: '#FFFBEB', borderBottom: '1px solid #FCD34D', padding: '10px 16px' }}>
          <p style={{ fontSize: '13px', color: '#B45309', margin: 0 }}>⚠️ ऑफलाइन मोड — सीमित जवाब मिलेंगे</p>
        </div>
      )}

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="hide-scrollbar">
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '320px' }}>
            <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-3 shadow-sm">
              <Bot size={36} />
            </div>
            <p style={{ fontSize: '19px', fontWeight: 800, color: '#0F766E', marginBottom: '6px', textAlign: 'center' }}>
              {lang === 'hi' ? t('aiWelcome') : lang === 'en' ? 'Hello! I am JalRakshak AI' : t('aiWelcome')}
            </p>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '24px', textAlign: 'center', lineHeight: 1.5 }}>
              {lang === 'hi' ? 'सिंचाई, खाद, मौसम या फसल से जुड़ा कोई भी सवाल पूछें' : 'Ask any question about irrigation, soil, pests, or crops'}
            </p>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', width: '100%', paddingBottom: '8px' }} className="hide-scrollbar">
              {(CHIPS[lang] || CHIPS.hi).map(chip => (
                <Tappable
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="bg-white border border-teal-200 rounded-full px-4 py-2 text-xs text-teal-800 font-bold whitespace-nowrap flex-shrink-0 shadow-xs hover:bg-teal-50"
                >
                  {chip}
                </Tappable>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px', alignItems: 'flex-end', gap: '8px'
              }}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 self-start shadow-xs">
                    <Bot size={15} />
                  </div>
                )}
                <div style={{ maxWidth: '84%' }}>
                  <div style={{
                    padding: '12px 16px', lineHeight: 1.7,
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #0F766E, #0D9488)'
                      : msg.isSystem ? '#FFFBEB' : '#FFFFFF',
                    color: msg.role === 'user' ? '#FFFFFF' : '#0F172A',
                    fontSize: '14px',
                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(15,118,110,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                    border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.content}
                  </div>
                  {msg.role === 'ai' && !msg.isSystem && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <Tappable
                        onClick={() => speak(msg.content)}
                        className="bg-teal-50 border border-teal-200 text-teal-800 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Volume2 size={13} />
                        <span>{t('listen')}</span>
                      </Tappable>
                      <Tappable
                        onClick={() => {
                          const saved = storage.get('saved_messages') || [];
                          storage.set('saved_messages', [...saved, msg]);
                        }}
                        className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Bookmark size={13} />
                        <span>{t('save')}</span>
                      </Tappable>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'flex-end' }}>
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bot size={15} />
                </div>
                <div style={{ background: '#FFFFFF', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2DD4BF', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        background: '#FFFFFF', borderTop: '1px solid #CCFBF1',
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0
      }}>
        {isSupported && (
          <Tappable
            onClick={isListening ? stopListening : startListening}
            className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 ${
              isListening
                ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse'
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }`}
            ariaLabel={isListening ? 'Stop listening' : 'Start speaking'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </Tappable>
        )}
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          onInput={e => { e.target.style.height = '48px'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          placeholder={t('chatPlaceholder')}
          rows={1}
          style={{
            flex: 1, minHeight: '48px', maxHeight: '120px',
            background: '#F8FAFC', border: '1.5px solid #CBD5E1',
            borderRadius: '24px', padding: '12px 16px',
            fontSize: '14px', color: '#0F172A', resize: 'none',
            outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
            overflowY: 'auto'
          }}
          onFocus={e => e.target.style.borderColor = '#0F766E'}
          onBlur={e => e.target.style.borderColor = '#CBD5E1'}
        />
        <Tappable
          onClick={() => sendMessage()}
          disabled={!inputText.trim() || isLoading}
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            inputText.trim() && !isLoading
              ? 'bg-teal-700 text-white shadow-btn hover:bg-teal-800'
              : 'bg-slate-200 text-slate-400'
          }`}
          ariaLabel="Send message"
        >
          <Send size={18} />
        </Tappable>
      </div>
    </div>
  );
}
