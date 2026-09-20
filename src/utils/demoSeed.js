// src/utils/demoSeed.js
// Seeds demo data for development and hackathon demos.
// Invoke via ?demo=true URL param.

import { WATER_PER_CYCLE_LITERS, CO2_KG_PER_SKIPPED_CYCLE } from './savingsCalculator';

export function seedDemoData() {
  const SAVINGS = { 'गेहूं': 450, 'धान': 650, 'मक्का': 400, 'सब्जियां': 750, 'आलू': 500 };
  const crops = ['गेहूं', 'धान', 'सब्जियां', 'आलू', 'मक्का'];
  const log = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const aiSaidSkip = Math.random() > 0.4;
    const didSkip = aiSaidSkip && Math.random() > 0.2;
    const crop = crops[i % crops.length];
    log.push({
      id: `demo_${i}`,
      date: date.toISOString(),
      timestamp: date.getTime(),
      crop,
      durationHours: didSkip ? 0 : 2 + (i % 4),
      aiSaidSkip,
      didSkip,
      savings: (aiSaidSkip && didSkip) ? (SAVINGS[crop] || 500) : 0,
    });
  }

  localStorage.setItem('irrigation_log', JSON.stringify(log));

  // Seed fertilizer advisory demo data
  const fertilizerLog = [
    { ts: Date.now() - 10 * 86400000, cropId: 'wheat', appliedN: 180, recommendedN: 120, excessN: 60, runoffN: 18 },
    { ts: Date.now() - 7 * 86400000, cropId: 'rice', appliedN: 150, recommendedN: 120, excessN: 30, runoffN: 9 },
    { ts: Date.now() - 3 * 86400000, cropId: 'potato', appliedN: 220, recommendedN: 180, excessN: 40, runoffN: 12 },
    { ts: Date.now() - 1 * 86400000, cropId: 'maize', appliedN: 160, recommendedN: 120, excessN: 40, runoffN: 12 },
  ];
  localStorage.setItem('fertilizer_log', JSON.stringify(fertilizerLog));

  // Seed community tips demo data if not already set
  if (!localStorage.getItem('jalrakshak_community_tips')) {
    const initialTips = [
      { id: 'tip-1', author: 'रामेश्वर पटेल', location: 'इंदौर, मध्य प्रदेश', crop: 'सोयाबीन', text: 'नीम के तेल (5ml प्रति लीटर) का छिड़काव शाम के समय करें। रस चूसक कीड़ों से 15 दिन तक सुरक्षा मिलती है।', upvotes: 42, timestamp: '2 घंटे पहले', hasUpvoted: false, category: 'कीट रोकथाम' },
      { id: 'tip-2', author: 'सुखविंदर सिंह', location: 'पटियाला, पंजाब', crop: 'धान / गेहूं', text: 'धान की कटाई के बाद पराली को खेत में ही मल्चिंग करें। अगली गेहूं की फसल में 2 सिंचाई कम लगती हैं।', upvotes: 89, timestamp: '5 घंटे पहले', hasUpvoted: true, category: 'जल संरक्षण' },
      { id: 'tip-3', author: 'दिनेश कुमार', location: 'मेरठ, उत्तर प्रदेश', crop: 'गन्ना', text: 'गन्ने की दो कतारों के बीच उड़द या मूंग की अंतःफसल लगाएं। नाइट्रोजन की जरूरत 30% घट जाती है।', upvotes: 67, timestamp: '1 दिन पहले', hasUpvoted: false, category: 'खाद व पोषण' }
    ];
    localStorage.setItem('jalrakshak_community_tips', JSON.stringify(initialTips));
  }

  // Ensure demo user profile & onboarding are complete
  localStorage.setItem('onboarding_complete', JSON.stringify(true));
  if (!localStorage.getItem('user_name')) {
    localStorage.setItem('user_name', 'राम कुमार');
  }
  if (!localStorage.getItem('user_crops')) {
    localStorage.setItem('user_crops', JSON.stringify(['गेहूं', 'धान']));
  }
  if (!localStorage.getItem('user_language')) {
    localStorage.setItem('user_language', 'hi');
  }
  if (!localStorage.getItem('user_location')) {
    localStorage.setItem('user_location', JSON.stringify({ lat: 28.6139, lng: 77.2090, city: 'दिल्ली (Delhi)', state: 'Delhi' }));
  }

  localStorage.setItem('demo_seeded', 'true');
  window.dispatchEvent(new StorageEvent('storage', { key: 'irrigation_log' }));
}
