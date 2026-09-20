// src/data/schemesData.js
// 5 Official Government Schemes for Indian Farmers with exact government figures

export const SCHEMES = [
  {
    id: 'pm-kisan',
    name: {
      hi: 'पीएम-किसान सम्मान निधि (PM-KISAN)',
      en: 'PM-KISAN Samman Nidhi',
      mr: 'पीएम-किसान सन्मान निधी',
      bn: 'পিএম-কিসান সম্মান নিধি',
      pa: 'ਪੀਐਮ-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ'
    },
    benefit: {
      hi: '₹6,000 प्रति वर्ष — ₹2,000 की 3 किस्तों में हर 4 महीने में सीधे बैंक खाते में।',
      en: '₹6,000 per year paid in 3 installments of ₹2,000 every 4 months, directly to bank account.',
      mr: 'दरवर्षी ₹6,000 — दर 4 महिन्यांनी ₹2,000 च्या 3 हप्त्यांमध्ये थेट बँक खात्यात.',
      bn: 'প্রতি বছর ₹৬,০০০ — প্রতি ৪ মাসে ₹২,০০০ এর ৩টি কিস্তিতে সরাসরি ব্যাঙ্ক অ্যাকাউন্টে।',
      pa: '₹6,000 ਪ੍ਰਤੀ ਸਾਲ — ਹਰ 4 ਮਹੀਨੇ ₹2,000 ਦੀਆਂ 3 ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ।'
    },
    eligibility: {
      hi: 'जमीन धारक किसान परिवार (संस्थागत भूस्वामी और आयकर दाता शामिल नहीं)।',
      en: 'Landholding farmer families (excludes institutional landholders and income taxpayers).',
      mr: 'जमीनधारक शेतकरी कुटुंबे (संस्थात्मक जमीनधारक व आयकरदाते वगळून).',
      bn: 'জমির মালিক কৃষক পরিবার (প্রাতিষ্ঠানিক জমির মালিক এবং আয়করদাতারা অন্তর্ভুক্ত নয়)।',
      pa: 'ਜ਼ਮੀਨ ਮਾਲਕ ਕਿਸਾਨ ਪਰਿਵਾਰ (ਸੰਸਥਾਗਤ ਜ਼ਮੀਨ ਮਾਲਕ ਅਤੇ ਇਨਕਮ ਟੈਕਸ ਦਾਤਾ ਸ਼ਾਮਲ ਨਹੀਂ)।'
    },
    mandatoryNote: {
      hi: '⚠️ 2026 से e-KYC अनिवार्य है — इसके बिना अगली किस्तें रोक दी जाएंगी।',
      en: '⚠️ e-KYC is mandatory as of 2026 — without it, installments are held.',
      mr: '⚠️ 2026 पासून e-KYC अनिवार्य आहे — त्याशिवाय हप्ते रोखले जातील.',
      bn: '⚠️ ২০২৬ সাল থেকে e-KYC বাধ্যতামূলক — এটি ছাড়া কিস্তি আটকে রাখা হবে।',
      pa: '⚠️ 2026 ਤੋਂ e-KYC ਲਾਜ਼ਮੀ ਹੈ — ਇਸ ਤੋਂ ਬਿਨਾਂ ਕਿਸ਼ਤਾਂ ਰੋਕ ਦਿੱਤੀਆਂ ਜਾਣਗੀਆਂ।'
    },
    ctaText: {
      hi: 'Check your PM-KISAN status (स्थिति जांचें)',
      en: 'Check your PM-KISAN status',
      mr: 'आपली PM-KISAN स्थिती तपासा',
      bn: 'আপনার PM-KISAN স্ট্যাটাস পরীক্ষা করুন',
      pa: 'ਆਪਣੀ PM-KISAN ਸਥਿਤੀ ਦੀ ਜਾਂਚ ਕਰੋ'
    },
    url: 'https://pmkisan.gov.in',
    tag: 'सीधी नकद सहायता',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '💰'
  },
  {
    id: 'pmfby',
    name: {
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      en: 'PM Fasal Bima Yojana (PMFBY)',
      mr: 'पंतप्रधान पीक विमा योजना (PMFBY)',
      bn: 'প্রধানমন্ত্রী ফসল বীমা যোজনা (PMFBY)',
      pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (PMFBY)'
    },
    benefit: {
      hi: 'खरीफ फसलों के लिए मात्र 2% प्रीमियम, रबी के लिए 1.5%, और बागवानी/वाणिज्यिक फसलों के लिए 5% — बाकी प्रीमियम सरकार देती है।',
      en: 'Farmer pays only 2% premium for Kharif crops, 1.5% for Rabi crops, 5% for horticulture/commercial crops — government subsidizes the rest.',
      mr: 'खरीप पिकांसाठी फक्त 2% प्रीमियम, रब्बीसाठी 1.5%, बागायती/व्यावसायिक पिकांसाठी 5% — बाकीचा हिस्सा सरकार भरते.',
      bn: 'খরিফ ফসলের জন্য মাত্র ২% প্রিমিয়াম, রবির জন্য ১.৫%, উদ্যানপালন/বাণিজ্যিক ফসলের জন্য ৫% — বাকিটা সরকার ভর্তুকি দেয়।',
      pa: 'ਖਰੀਫ ਫਸਲਾਂ ਲਈ ਸਿਰਫ 2% ਪ੍ਰੀਮੀਅਮ, ਰਬੀ ਲਈ 1.5%, ਬਾਗਬਾਨੀ/ਵਪਾਰਕ ਫਸਲਾਂ ਲਈ 5% — ਬਾਕੀ ਸਰਕਾਰ ਸਬਸਿਡੀ ਦਿੰਦੀ ਹੈ।'
    },
    eligibility: {
      hi: 'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान (बटाईदार भी शामिल)।',
      en: 'All farmers growing notified crops in notified areas (yield loss, prevented sowing, post-harvest losses covered).',
      mr: 'अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे सर्व शेतकरी.',
      bn: 'বিজ্ঞাপিত এলাকায় বিজ্ঞাপিত ফসল চাষ করা সমস্ত কৃষক।',
      pa: 'ਨੋਟੀਫਾਈਡ ਖੇਤਰਾਂ ਵਿੱਚ ਨੋਟੀਫਾਈਡ ਫਸਲਾਂ ਉਗਾਉਣ ਵਾਲੇ ਸਾਰੇ ਕਿਸਾਨ।'
    },
    mandatoryNote: {
      hi: '🛡️ उपज हानि, बुआई न हो पाना (prevented sowing) और कटाई बाद के नुकसान का पूरा बीमा कवर।',
      en: '🛡️ Covers yield loss, prevented sowing, and post-harvest losses.',
      mr: '🛡️ पीक नुकसान, पेरणी न होणे आणि कापणीनंतरचे नुकसान पूर्णपणे संरक्षित.',
      bn: '🛡️ ফলন ক্ষতি, বপন বাধাগ্রস্ত হওয়া এবং ফসল কাটার পরবর্তী ক্ষতি কভার করে।',
      pa: '🛡️ ਝਾੜ ਦਾ ਨੁਕਸਾਨ, ਬਿਜਾਈ ਨਾ ਹੋਣਾ ਅਤੇ ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਦਾ ਨੁਕਸਾਨ ਕਵਰ ਕਰਦਾ ਹੈ।'
    },
    ctaText: {
      hi: 'प्रीमियम जानें व आवेदन करें (pmfby.gov.in)',
      en: 'Calculate Premium & Apply (pmfby.gov.in)',
      mr: 'प्रीमियम तपासा व अर्ज करा',
      bn: 'প্রিমিয়াম হিসাব করুন ও আবেদন করুন',
      pa: 'ਪ੍ਰੀਮੀਅਮ ਜਾਣੋ ਅਤੇ ਅਪਲਾਈ ਕਰੋ'
    },
    url: 'https://pmfby.gov.in',
    tag: 'फसल सुरक्षा बीमा',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    icon: '🛡️'
  },
  {
    id: 'kcc',
    name: {
      hi: 'किसान क्रेडिट कार्ड (Kisan Credit Card - KCC)',
      en: 'Kisan Credit Card (KCC)',
      mr: 'किसान क्रेडिट कार्ड (KCC)',
      bn: 'কিসান ক্রেডিট কার্ড (KCC)',
      pa: 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC)'
    },
    benefit: {
      hi: '₹3 लाख तक का अल्पकालिक फसली ऋण मात्र ~4% प्रभावी ब्याज दर पर (सरकारी ब्याज छूट के बाद, मानक 9% से घटकर)।',
      en: 'Short-term crop loans up to ₹3 lakh at ~4% effective interest rate (after government interest subvention, down from standard 9%).',
      mr: '₹3 लाखांपर्यंत अल्पमुदत पीक कर्ज फक्त ~4% प्रभावी व्याजदराने (सरकारी सवलतीनंतर, प्रमाण 9% वरून कमी).',
      bn: '₹৩ লাখ পর্যন্ত স্বল্পমেয়াদী ফসল ঋণ মাত্র ~৪% কার্যকরী সুদের হারে (সরকারী ভর্তুকির পরে, সাধারণ ৯% থেকে হ্রাস)।',
      pa: '₹3 ਲੱਖ ਤੱਕ ਦਾ ਥੋੜ੍ਹੇ ਸਮੇਂ ਦਾ ਫਸਲੀ ਕਰਜ਼ਾ ਸਿਰਫ ~4% ਵਿਆਜ ਦਰ \'ਤੇ (ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਤੋਂ ਬਾਅਦ, 9% ਤੋਂ ਘਟ ਕੇ)।'
    },
    eligibility: {
      hi: '₹1.6 लाख तक के ऋण पर कोई बंधक (collateral) नहीं — केवल जमीन के कागजात जरूरी। किसी भी बैंक में आवेदन करें।',
      en: 'Loans up to ₹1.6 lakh require no collateral — only land records needed. Apply at any nationalized/cooperative/regional rural bank.',
      mr: '₹1.6 लाखांपर्यंत कर्जासाठी कोणतेही तारण (collateral) लागत नाही — फक्त जमिनीची कागदपत्रे लागतात.',
      bn: '₹১.৬ লাখ পর্যন্ত ঋণের জন্য কোন জামানতের প্রয়োজন নেই — শুধুমাত্র জমির দলিল প্রয়োজন।',
      pa: '₹1.6 ਲੱਖ ਤੱਕ ਦੇ ਕਰਜ਼ੇ ਲਈ ਕੋਈ ਗਹਿਣਾ ਨਹੀਂ — ਸਿਰਫ ਜ਼ਮੀਨ ਦੇ ਰਿਕਾਰਡ ਦੀ ਲੋੜ।'
    },
    mandatoryNote: {
      hi: '🏦 किसी भी राष्ट्रीयकृत, सहकारी या क्षेत्रीय ग्रामीण बैंक (RRB) की शाखा से तुरंत बनवाएं।',
      en: '🏦 Apply at any nationalized, cooperative, or regional rural bank branch.',
      mr: '🏦 कोणत्याही राष्ट्रीयीकृत, सहकारी किंवा ग्रामीण बँकेत अर्ज करा.',
      bn: '🏦 যে কোনও রাষ্ট্রায়ত্ত, সমবায় বা গ্রামীণ ব্যাঙ্কের শাখায় আবেদন করুন।',
      pa: '🏦 ਕਿਸੇ ਵੀ ਰਾਸ਼ਟਰੀਕ੍ਰਿਤ, ਸਹਿਕਾਰੀ ਜਾਂ ਖੇਤਰੀ ਗ੍ਰਾਮੀਣ ਬੈਂਕ ਤੋਂ ਅਪਲਾਈ ਕਰੋ।'
    },
    ctaText: {
      hi: 'KCC दिशा-निर्देश व फॉर्म (myscheme.gov.in)',
      en: 'KCC Guidelines & Form (myscheme.gov.in)',
      mr: 'KCC मार्गदर्शक तत्त्वे व फॉर्म',
      bn: 'KCC নির্দেশিকা ও ফর্ম',
      pa: 'KCC ਨਿਯਮ ਅਤੇ ਫਾਰਮ'
    },
    url: 'https://www.myscheme.gov.in/schemes/kcc',
    tag: 'सस्ता कृषि ऋण (4%)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: '💳'
  },
  {
    id: 'pmksy',
    name: {
      hi: 'पीएम कृषि सिंचाई योजना — सूक्ष्म सिंचाई (PMKSY Micro-Irrigation)',
      en: 'PM Krishi Sinchayee Yojana (PMKSY Micro-Irrigation)',
      mr: 'पंतप्रधान कृषी सिंचन योजना — सूक्ष्म सिंचन',
      bn: 'প্রধানমন্ত্রী কৃষি সেচ যোজনা — ক্ষুদ্র সেচ',
      pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕ੍ਰਿਸ਼ੀ ਸਿੰਚਾਈ ਯੋਜਨਾ — ਸੂਖਮ ਸਿੰਚਾਈ'
    },
    benefit: {
      hi: 'ड्रिप और स्प्रिंकलर (फव्वारा) सिंचाई उपकरण लगाने पर 55% तक सरकारी सब्सिडी — जल संरक्षण से सीधे जुड़ी योजना।',
      en: 'Government subsidy for drip and sprinkler irrigation systems, directly tied to water conservation (up to 55% subsidy).',
      mr: 'ठिबक आणि तुषार सिंचन पद्धती बसवण्यासाठी 55% पर्यंत सरकारी अनुदान — थेट पाणी बचतीशी जोडलेली योजना.',
      bn: 'ড্রিপ এবং স্প্রিংকলার সেচ ব্যবস্থার জন্য ৫৫% পর্যন্ত সরকারী ভর্তুকি — সরাসরি জল সংরক্ষণের সাথে যুক্ত।',
      pa: 'ਡ੍ਰਿਪ ਅਤੇ ਸਪ੍ਰਿੰਕਲਰ ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀਆਂ ਲਈ 55% ਤੱਕ ਸਰਕਾਰੀ ਸਬਸਿਡੀ — ਸਿੱਧੇ ਤੌਰ \'ਤੇ ਪਾਣੀ ਦੀ ਬਚਤ ਨਾਲ ਜੁੜੀ।'
    },
    eligibility: {
      hi: 'सभी किसान जिनके पास कृषि योग्य भूमि और सुनिश्चित जल स्रोत है (छोटे/सीमांत किसानों को अधिकतम 55% अनुदान)।',
      en: 'All farmers with cultivable land and water source (small/marginal farmers get up to 55% financial assistance).',
      mr: 'लागवडीयोग्य जमीन आणि पाण्याचा स्त्रोत असलेले सर्व शेतकरी.',
      bn: 'কৃষিযোগ্য জমি এবং জলের উৎস আছে এমন সমস্ত কৃষক।',
      pa: 'ਖੇਤੀਯੋਗ ਜ਼ਮੀਨ ਅਤੇ ਪਾਣੀ ਦਾ ਸਾਧਨ ਰੱਖਣ ਵਾਲੇ ਸਾਰੇ ਕਿਸਾਨ।'
    },
    mandatoryNote: {
      hi: '💧 40-50% पानी की बचत, बिजली/डीजल पंप खर्च में भारी कमी, और 20-30% अधिक फसल पैदावार।',
      en: '💧 Saves 40-50% water, slashes diesel/electric pump runtime, boosts crop yields by 20-30%.',
      mr: '💧 40-50% पाण्याची बचत, वीज/डिझेल पंपाच्या खर्चात कपात, आणि 20-30% जास्त उत्पादन.',
      bn: '💧 ৪০-৫০% জল সাশ্রয় করে, পাম্পের খরচ কমায় এবং ২০-৩০% বেশি ফলন দেয়।',
      pa: '💧 40-50% ਪਾਣੀ ਦੀ ਬਚਤ, ਪੰਪ ਦਾ ਖਰਚ ਘਟਾਉਂਦਾ ਹੈ ਅਤੇ 20-30% ਵੱਧ ਝਾੜ ਦਿੰਦਾ ਹੈ।'
    },
    ctaText: {
      hi: 'सूक्ष्म सिंचाई सब्सिडी पोर्टल (pmksy.gov.in)',
      en: 'Micro-Irrigation Subsidy Portal (pmksy.gov.in)',
      mr: 'सूक्ष्म सिंचन पोर्टल (pmksy.gov.in)',
      bn: 'ক্ষুদ্র সেচ পোর্টাল (pmksy.gov.in)',
      pa: 'ਸੂਖਮ ਸਿੰਚਾਈ ਪੋਰਟਲ (pmksy.gov.in)'
    },
    url: 'https://pmksy.gov.in',
    tag: 'जल संरक्षण सब्सिडी (55%)',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    icon: '💧'
  },
  {
    id: 'soil-health-card',
    name: {
      hi: 'मृदा स्वास्थ्य कार्ड योजना (Soil Health Card)',
      en: 'Soil Health Card Scheme',
      mr: 'मृदा आरोग्य पत्रिका योजना (Soil Health Card)',
      bn: 'মাটি স্বাস্থ্য কার্ড যোজনা (Soil Health Card)',
      pa: 'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਸਕੀਮ (Soil Health Card)'
    },
    benefit: {
      hi: 'खेत की मिट्टी के 12 पोषक तत्वों की मुफ्त सरकारी जांच — सही खाद की मात्रा जानें और अनावश्यक खाद का खर्च बचाएं।',
      en: 'Free government soil testing to determine correct fertilizer dosage and avoid costly chemical overdosing.',
      mr: 'मातीतील 12 पोषक घटकांची मोफत सरकारी तपासणी — योग्य खताचे प्रमाण समजून अनावश्यक खर्च वाचवा.',
      bn: 'সঠিক সারের মাত্রা নির্ধারণ এবং রাসায়নিক সারের অতিরিক্ত ব্যবহার এড়াতে বিনামূল্যে সরকারী মাটি পরীক্ষা।',
      pa: 'ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ ਜਾਣਨ ਅਤੇ ਬੇਲੋੜੀ ਖਾਦ ਦਾ ਖਰਚਾ ਬਚਾਉਣ ਲਈ ਮੁਫ਼ਤ ਸਰਕਾਰੀ ਮਿੱਟੀ ਜਾਂਚ।'
    },
    eligibility: {
      hi: 'देश के सभी किसान पात्र हैं। हर 3 वर्ष में एक बार खेत की मिट्टी का निःशुल्क नमूना लिया जाता है।',
      en: 'All farmers across India. Free soil sample analysis provided every 3 years by local agricultural department.',
      mr: 'देशातील सर्व शेतकरी पात्र. स्थानिक कृषी विभागामार्फत दर ३ वर्षांनी मोफत माती नमुना तपासणी.',
      bn: 'ভারতের সমস্ত কৃষক যোগ্য। স্থানীয় কৃষি বিভাগ কর্তৃক প্রতি ৩ বছরে বিনামূল্যে মাটির নমুনা পরীক্ষা।',
      pa: 'ਭਾਰਤ ਦੇ ਸਾਰੇ ਕਿਸਾਨ ਯੋਗ ਹਨ। ਸਥਾਨਕ ਖੇਤੀਬਾੜੀ ਵਿਭਾਗ ਵੱਲੋਂ ਹਰ 3 ਸਾਲ ਬਾਅਦ ਮੁਫ਼ਤ ਮਿੱਟੀ ਦੀ ਜਾਂਚ।'
    },
    mandatoryNote: {
      hi: '🌱 N, P, K, सल्फर, जिंक, आयरन और pH की सटीक रिपोर्ट पाकर खाद खर्च में ₹1,500–₹3,000/एकड़ बचाएं।',
      en: '🌱 Detailed report on N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH & Organic Carbon saves ₹1,500–₹3,000/acre in fertilizer cost.',
      mr: '🌱 खतांच्या खर्चात प्रति एकर ₹1,500–₹3,000 ची बचत.',
      bn: '🌱 সারের খরচে প্রতি একরে ₹১,৫০০–₹৩,০০০ সাশ্রয় হয়।',
      pa: '🌱 ਖਾਦ ਦੇ ਖਰਚੇ ਵਿੱਚ ₹1,500–₹3,000 ਪ੍ਰਤੀ ਏਕੜ ਦੀ ਬਚਤ।'
    },
    ctaText: {
      hi: 'मृदा स्वास्थ्य पोर्टल (soilhealth.dac.gov.in)',
      en: 'Soil Health Card Portal (soilhealth.dac.gov.in)',
      mr: 'मृदा आरोग्य पोर्टल (soilhealth.dac.gov.in)',
      bn: 'মাটি স্বাস্থ্য পোর্টাল (soilhealth.dac.gov.in)',
      pa: 'ਮਿੱਟੀ ਸਿਹਤ ਪੋਰਟਲ (soilhealth.dac.gov.in)'
    },
    url: 'https://soilhealth.dac.gov.in',
    tag: 'मुफ्त मिट्टी जांच',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
    icon: '🌱'
  }
];
