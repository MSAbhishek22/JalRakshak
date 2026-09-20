// src/data/indianLocations.js
// Pre-configured agricultural states and major districts with coordinates
// Ensures zero reliance on external geocoding if GPS fails or is denied.

export const INDIAN_STATES_AND_DISTRICTS = [
  {
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    code: 'UP',
    districts: [
      { name: 'मेरठ (Meerut)', lat: 28.9845, lng: 77.7064 },
      { name: 'आगरा (Agra)', lat: 27.1767, lng: 78.0081 },
      { name: 'वाराणसी (Varanasi)', lat: 25.3176, lng: 82.9739 },
      { name: 'लखनऊ (Lucknow)', lat: 26.8467, lng: 80.9462 },
      { name: 'गोरखपुर (Gorakhpur)', lat: 26.7606, lng: 83.3732 },
      { name: 'प्रयागराज (Prayagraj)', lat: 25.4358, lng: 81.8463 },
      { name: 'बरेली (Bareilly)', lat: 28.3670, lng: 79.4304 },
      { name: 'मुरादाबाद (Moradabad)', lat: 28.8386, lng: 78.7733 },
      { name: 'मुजफ्फरनगर (Muzaffarnagar)', lat: 29.4727, lng: 77.7085 },
      { name: 'झांसी (Jhansi)', lat: 25.4484, lng: 78.5685 }
    ]
  },
  {
    state: 'पंजाब (Punjab)',
    code: 'PB',
    districts: [
      { name: 'लुधियाना (Ludhiana)', lat: 30.9010, lng: 75.8573 },
      { name: 'अमृतसर (Amritsar)', lat: 31.6340, lng: 74.8723 },
      { name: 'बठिंडा (Bathinda)', lat: 30.2110, lng: 74.9455 },
      { name: 'जालंधर (Jalandhar)', lat: 31.3260, lng: 75.5762 },
      { name: 'पटियाला (Patiala)', lat: 30.3398, lng: 76.3869 },
      { name: 'संगरूर (Sangrur)', lat: 30.2458, lng: 75.8421 },
      { name: 'फिरोजपुर (Firozpur)', lat: 30.9237, lng: 74.6122 }
    ]
  },
  {
    state: 'हरियाणा (Haryana)',
    code: 'HR',
    districts: [
      { name: 'करनाल (Karnal)', lat: 29.6857, lng: 76.9905 },
      { name: 'हिसार (Hisar)', lat: 29.1492, lng: 75.7217 },
      { name: 'रोहतक (Rohtak)', lat: 28.8955, lng: 76.6066 },
      { name: 'अंबाला (Ambala)', lat: 30.3782, lng: 76.7767 },
      { name: 'सिरसा (Sirsa)', lat: 29.5349, lng: 75.0298 },
      { name: 'सोनीपत (Sonipat)', lat: 28.9931, lng: 77.0151 }
    ]
  },
  {
    state: 'मध्य प्रदेश (Madhya Pradesh)',
    code: 'MP',
    districts: [
      { name: 'इंदौर (Indore)', lat: 22.7196, lng: 75.8577 },
      { name: 'भोपाल (Bhopal)', lat: 23.2599, lng: 77.4126 },
      { name: 'उज्जैन (Ujjain)', lat: 23.1765, lng: 75.7885 },
      { name: 'जबलपुर (Jabalpur)', lat: 23.1815, lng: 79.9864 },
      { name: 'ग्वालियर (Gwalior)', lat: 26.2183, lng: 78.1828 },
      { name: 'होशंगाबाद / नर्मदापुरम (Narmadapuram)', lat: 22.7519, lng: 77.7289 }
    ]
  },
  {
    state: 'महाराष्ट्र (Maharashtra)',
    code: 'MH',
    districts: [
      { name: 'नासिक (Nashik)', lat: 19.9975, lng: 73.7898 },
      { name: 'पुणे (Pune)', lat: 18.5204, lng: 73.8567 },
      { name: 'नागपुर (Nagpur)', lat: 21.1458, lng: 79.0882 },
      { name: 'औरंगाबाद / संभाजीनगर (Chhatrapati Sambhajinagar)', lat: 19.8762, lng: 75.3433 },
      { name: 'अकोला (Akola)', lat: 20.7002, lng: 77.0082 },
      { name: 'कोल्हापुर (Kolhapur)', lat: 16.7050, lng: 74.2433 }
    ]
  },
  {
    state: 'राजस्थान (Rajasthan)',
    code: 'RJ',
    districts: [
      { name: 'जयपुर (Jaipur)', lat: 26.9124, lng: 75.7873 },
      { name: 'कोटा (Kota)', lat: 25.2138, lng: 75.8648 },
      { name: 'गंगानगर (Sri Ganganagar)', lat: 29.9094, lng: 73.8799 },
      { name: 'जोधपुर (Jodhpur)', lat: 26.2389, lng: 73.0243 },
      { name: 'अलवर (Alwar)', lat: 27.5530, lng: 76.6346 },
      { name: 'हनुमानगढ़ (Hanumangarh)', lat: 29.5815, lng: 74.3294 }
    ]
  },
  {
    state: 'बिहार (Bihar)',
    code: 'BR',
    districts: [
      { name: 'पटना (Patna)', lat: 25.5941, lng: 85.1376 },
      { name: 'मुजफ्फरपुर (Muzaffarpur)', lat: 26.1209, lng: 85.3647 },
      { name: 'गया (Gaya)', lat: 24.7914, lng: 85.0002 },
      { name: 'भागलपुर (Bhagalpur)', lat: 25.2425, lng: 86.9842 },
      { name: 'रोहतास (Rohtas / Sasaram)', lat: 24.9490, lng: 84.0315 },
      { name: 'समस्तीपुर (Samastipur)', lat: 25.8628, lng: 85.7811 }
    ]
  },
  {
    state: 'पश्चिम बंगाल (West Bengal)',
    code: 'WB',
    districts: [
      { name: 'बर्धमान (Burdwan)', lat: 23.2324, lng: 87.8615 },
      { name: 'हुगली (Hooghly)', lat: 22.9038, lng: 88.3968 },
      { name: 'नादिया (Nadia)', lat: 23.4710, lng: 88.5565 },
      { name: 'मालदा (Malda)', lat: 25.0108, lng: 88.1411 },
      { name: 'कोलकाता (Kolkata)', lat: 22.5726, lng: 88.3639 }
    ]
  },
  {
    state: 'गुजरात (Gujarat)',
    code: 'GJ',
    districts: [
      { name: 'अहमदाबाद (Ahmedabad)', lat: 23.0225, lng: 72.5714 },
      { name: 'राजकोट (Rajkot)', lat: 22.3039, lng: 70.8022 },
      { name: 'सूरत (Surat)', lat: 21.1702, lng: 72.8311 },
      { name: 'आणंद (Anand)', lat: 22.5645, lng: 72.9289 },
      { name: 'जूनागढ़ (Junagadh)', lat: 21.5222, lng: 70.4579 }
    ]
  }
];

export const DEFAULT_LOCATION = {
  city: 'मेरठ (Meerut)',
  state: 'उत्तर प्रदेश',
  lat: 28.9845,
  lng: 77.7064
};
