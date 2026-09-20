# JalRakshak Icon Guidelines & Mapping (Lucide React)

To ensure high clarity, accessibility, and modern aesthetics, JalRakshak pairs crisp **Lucide React** SVG icons with culturally resonant emoji accents.

## 1. Primary Navigation Icons

| Tab | Lucide Component | Emoji Accent | Role & Purpose |
|-----|-------------------|--------------|----------------|
| Home | `<Home size={22} />` | 🏠 | Main dashboard, weather overview & irrigation card |
| Weather | `<CloudSun size={22} />` | 🌦️ | 7-day hyperlocal forecast & precipitation graphs |
| AI Sahayak | `<MessageCircle size={22} />` | 🤖 | Voice & text intelligent farm advisory |
| Savings & Impact | `<Droplets size={22} />` | 💧 | Water conservation, financial savings & village metrics |
| Settings | `<Settings2 size={22} />` | ⚙️ | Profile, location, crop, language & alerts |

---

## 2. Farmer Tools & Quick Actions

| Feature | Lucide Icon | Color Class | Description |
|---------|-------------|-------------|-------------|
| Smart Irrigation | `<Droplet />` | `text-teal-600` | Irrigation decision & volume metrics |
| Fertilizer Advisory | `<FlaskConical />` | `text-emerald-600` | N-P-K nutrient balancing |
| Mandi Prices | `<TrendingUp />` | `text-amber-600` | APMC market prices & trends |
| Community Tips | `<Users />` | `text-sky-600` | Farmer peer-to-peer discussions |
| Government Schemes | `<Building2 />` | `text-indigo-600` | PM-KISAN, PMFBY, Soil Health Card |
| Crop Guide | `<Sprout />` | `text-emerald-600` | Sowing, stage management & harvest |
| Pest & Disease | `<Bug />` | `text-rose-600` | Symptoms, bio-pesticides & helplines |
| Farm Calendar | `<Calendar />` | `text-orange-600` | Kharif, Rabi & Zaid timing |
| Kisan Helpline | `<PhoneCall />` | `text-teal-600` | KVK & Toll-free 1800-180-1551 |

---

## 3. Usage Rules
- Standard icon stroke width: `2px` (or `2.25px` on high-density mobile screens).
- Size hierarchy: `16px` (badges), `20px-22px` (nav & buttons), `28px-32px` (hero headers).
- Always include `aria-hidden="true"` or proper `aria-label` on buttons.
