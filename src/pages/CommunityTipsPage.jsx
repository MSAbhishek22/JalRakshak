import React, { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, Send, Users, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import Tappable from '../components/common/Tappable';
import { useT } from '../context/AppContext';

const INITIAL_TIPS = [
  {
    id: 'tip-1',
    author: 'रामेश्वर पटेल',
    location: 'इंदौर, मध्य प्रदेश',
    crop: 'सोयाबीन',
    text: 'नीम के तेल (5ml प्रति लीटर) का छिड़काव शाम के समय करें। रस चूसक कीड़ों से 15 दिन तक सुरक्षा मिलती है और खर्च सिर्फ ₹40 प्रति बीघा आता है।',
    upvotes: 42,
    timestamp: '2 घंटे पहले',
    hasUpvoted: false,
    category: 'कीट रोकथाम'
  },
  {
    id: 'tip-2',
    author: 'सुखविंदर सिंह',
    location: 'पटियाला, पंजाब',
    crop: 'धान / गेहूं',
    text: 'धान की कटाई के बाद पराली को खेत में ही मल्चिंग करें। अगली गेहूं की फसल में 2 सिंचाई कम लगती हैं और मिट्टी में नमी 12 दिन ज्यादा टिकती है।',
    upvotes: 89,
    timestamp: '5 घंटे पहले',
    hasUpvoted: true,
    category: 'जल संरक्षण'
  },
  {
    id: 'tip-3',
    author: 'दिनेश कुमार',
    location: 'मेरठ, उत्तर प्रदेश',
    crop: 'गन्ना',
    text: 'गन्ने की दो कतारों के बीच उड़द या मूंग की अंतःफसल (intercropping) लगाएं। नाइट्रोजन की जरूरत 30% घट जाती है और अतिरिक्त आमदनी होती है।',
    upvotes: 67,
    timestamp: '1 दिन पहले',
    hasUpvoted: false,
    category: 'खाद व पोषण'
  },
  {
    id: 'tip-4',
    author: 'बालासाहेब शिंदे',
    location: 'नासिक, महाराष्ट्र',
    crop: 'प्याज / टमाटर',
    text: 'ड्रिप सिंचाई के साथ ट्राइकोडर्मा और स्यूडोमोनास 1 किलो प्रति एकड़ चलाएं। जड़ गलन रोग जड़ से खत्म हो जाता है।',
    upvotes: 53,
    timestamp: '2 दिन पहले',
    hasUpvoted: false,
    category: 'जैविक उपाय'
  },
  {
    id: 'tip-5',
    author: 'हरेकृष्ण बिस्वास',
    location: 'बर्दवान, पश्चिम बंगाल',
    crop: 'धान',
    text: 'धान के खेत में हर 10 मीटर पर 2-3 बांस की खूंटियां (bird perches) गाड़ दें। पक्षी बैठकर सुंडी और कीड़े खा जाते हैं, कीटनाशक की जरूरत नहीं पड़ती।',
    upvotes: 114,
    timestamp: '3 दिन पहले',
    hasUpvoted: false,
    category: 'जैविक उपाय'
  }
];

export default function CommunityTipsPage({ onBack }) {
  const t = useT();
  const [tips, setTips] = useState(() => {
    try {
      const saved = localStorage.getItem('jalrakshak_community_tips');
      return saved ? JSON.parse(saved) : INITIAL_TIPS;
    } catch (e) {
      return INITIAL_TIPS;
    }
  });

  const [newTipText, setNewTipText] = useState('');
  const [authorName, setAuthorName] = useState(() => {
    try {
      const p = localStorage.getItem('farmer_profile');
      return p ? JSON.parse(p)?.name || 'किसान साथी' : 'किसान साथी';
    } catch {
      return 'किसान साथी';
    }
  });
  const [category, setCategory] = useState('जल संरक्षण');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('jalrakshak_community_tips', JSON.stringify(tips));
    } catch (e) {}
  }, [tips]);

  const handleUpvote = (id) => {
    setTips((prev) =>
      prev.map((tip) => {
        if (tip.id === id) {
          const nextUpvoted = !tip.hasUpvoted;
          return {
            ...tip,
            hasUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? tip.upvotes + 1 : tip.upvotes - 1
          };
        }
        return tip;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTipText.trim()) return;

    const newTip = {
      id: `tip-${Date.now()}`,
      author: authorName.trim() || 'किसान साथी',
      location: 'आपका क्षेत्र',
      crop: 'मिश्रित',
      text: newTipText.trim(),
      upvotes: 1,
      timestamp: 'अभी-अभी',
      hasUpvoted: true,
      category
    };

    setTips([newTip, ...tips]);
    setNewTipText('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="pb-24 min-h-screen bg-surface-light">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-teal-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tappable
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center hover:bg-teal-100 border border-teal-200"
            ariaLabel="Go back"
          >
            <ArrowLeft size={20} />
          </Tappable>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              {t('communityTips') || 'किसान चर्चा व सुझाव'}
            </h1>
            <p className="text-xs text-teal-600 font-medium">अनुभवी किसानों के व्यावहारिक नुस्खे</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 text-teal-700 text-xs font-semibold">
          <Users size={14} />
          <span>चौपाल</span>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-4">
        {/* Post a Tip Card */}
        <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-card">
          <div className="flex items-center gap-2 mb-2 text-teal-800 font-bold text-sm">
            <Sparkles size={16} className="text-amber-500" />
            <span>अपना अनुभव या सुझाव साझा करें</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newTipText}
              onChange={(e) => setNewTipText(e.target.value.slice(0, 250))}
              placeholder="जैसे: सिंचाई कब रोकें, जैविक खाद कैसे बनाएं, कम खर्च में अधिक पैदावार..."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-800 placeholder-slate-400 resize-none"
            />

            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
              >
                <option value="जल संरक्षण">💧 जल संरक्षण</option>
                <option value="खाद व पोषण">🧪 खाद व पोषण</option>
                <option value="कीट रोकथाम">🐛 कीट रोकथाम</option>
                <option value="जैविक उपाय">🌱 जैविक उपाय</option>
              </select>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px]">{newTipText.length}/250</span>
                <Tappable
                  type="submit"
                  disabled={!newTipText.trim()}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-1.5 rounded-xl flex items-center gap-1.5 shadow-btn text-xs"
                >
                  <Send size={13} />
                  <span>पोस्ट करें</span>
                </Tappable>
              </div>
            </div>

            {showSuccess && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs animate-fade-in">
                <CheckCircle2 size={16} />
                <span>{t('tipPosted') || 'सुझाव सफलतापूर्वक पोस्ट हुआ! धन्यवाद।'}</span>
              </div>
            )}
          </form>
        </div>

        {/* Tips Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">हालिया सुझाव ({tips.length})</span>
            <span>सत्यापित किसान समुदाय</span>
          </div>

          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                    {tip.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{tip.author}</h3>
                    <p className="text-[11px] text-slate-500">
                      {tip.location} • <span className="text-teal-700 font-medium">{tip.crop}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                  {tip.category}
                </span>
              </div>

              <p className="text-slate-800 text-sm mt-3 leading-relaxed">{tip.text}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{tip.timestamp}</span>
                <Tappable
                  onClick={() => handleUpvote(tip.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    tip.hasUpvoted
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  ariaLabel="Upvote tip"
                >
                  <ThumbsUp size={13} className={tip.hasUpvoted ? 'fill-current' : ''} />
                  <span>{tip.upvotes}</span>
                  <span className="text-[11px] ml-0.5">{t('upvote') || 'सहमत'}</span>
                </Tappable>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
