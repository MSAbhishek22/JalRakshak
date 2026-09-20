# JalRakshak Design System (जल रक्षक डिज़ाइन सिस्टम)

## 1. Brand Philosophy
JalRakshak (जल रक्षक) empowers India's 140 million smallholder farmers with actionable, hyper-localized water and soil conservation advisory. The visual language balances rural Indian warmth with cutting-edge ecological technology.

---

## 2. Color Palette

### Primary: Deep Teal (जल - Water Conservation)
- `primary-50`: `#F0FDFA` (Pales & highlights)
- `primary-100`: `#CCFBF1`
- `primary-200`: `#99F6E4`
- `primary-300`: `#5EEAD4`
- `primary-400`: `#2DD4BF`
- `primary-500`: `#14B8A6` (Active accents)
- `primary-600`: `#0D9488`
- `primary-700`: `#0F766E` (**Primary Brand / CTA**)
- `primary-800`: `#115E59`
- `primary-900`: `#134E4A` (Dark surfaces)

### Secondary: Sky / Aqua (आकाश व वर्षा - Rainfall & Atmosphere)
- `secondary-50`: `#F0F9FF`
- `secondary-100`: `#E0F2FE`
- `secondary-200`: `#BAE6FD`
- `secondary-300`: `#7DD3FC`
- `secondary-400`: `#38BDF8` (**Rain / Forecast Highlight**)
- `secondary-500`: `#0EA5E9`
- `secondary-600`: `#0284C7`
- `secondary-700`: `#0369A1`

### Accent: Marigold / Saffron (धरती व फसल - Indian Cultural Warmth & Urgency)
- `accent-50`: `#FFFBEB`
- `accent-100`: `#FEF3C7`
- `accent-200`: `#FDE68A`
- `accent-300`: `#FCD34D`
- `accent-400`: `#FBBF24`
- `accent-500`: `#F59E0B` (**CTA Highlights & Key Metrics**)
- `accent-600`: `#D97706`
- `accent-700`: `#B45309`

### Surface & Neutral System
- `surface-light`: `#FFFBF5` (Warm off-white background)
- `surface-dark`: `#0F172A` (Deep slate dark background)
- `surface-card`: `#FFFFFF` (Card background)
- `surface-card-dark`: `#1E293B`
- `text-primary`: `#1E293B` (High-contrast charcoal)
- `text-secondary`: `#475569`
- `text-muted`: `#94A3B8`

---

## 3. Typography
- **Headings**: `Poppins`, `Noto Sans Devanagari`, `sans-serif` (Bold, rounded, friendly)
- **Body & Metrics**: `Inter`, `Noto Sans Devanagari`, `sans-serif` (Legible at small sizes)
- **Devanagari**: Native high-contrast glyphs with proper line-height for Indian languages.

---

## 4. Spacing & Grid System
- **8px Baseline Grid**: Spacing multiples of 8px (`8px`, `16px`, `24px`, `32px`, `48px`).
- **Touch Target**: Minimum `48px x 48px` on all interactive buttons for field use with rough/wet hands.
- **Card Padding**: `16px` or `20px` with `16px` (`rounded-2xl`) border radius.

---

## 5. Shadows & Elevation
- **Card**: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- **Hover**: `0 4px 12px rgba(0,0,0,0.08)`
- **Button Glow**: `0 2px 8px rgba(15,118,110,0.2)`
- **Bottom Navigation**: `0 -1px 8px rgba(0,0,0,0.05)`
- **Modals**: `0 20px 60px rgba(0,0,0,0.15)`

---

## 6. Micro-Interactions & Haptics
- **Tappable**: All interactive cards and buttons have `active:scale-95`, ripple wave, and light haptic feedback `navigator.vibrate(10)`.
- **Transitions**: Smooth easing `< 200ms` for seamless responsiveness on budget smartphones.
