// src/utils/savingsCalculator.js
// Savings calculation utilities per Section 21 spec

const CROP_WATER_COST = {
  'गेहूं': 450,
  'धान': 650,
  'मक्का': 400,
  'सब्जियां': 750,
  'आलू': 500,
  'टमाटर': 600,
  'दाल': 350,
  'default': 500
};

// ─── Water & Environmental Constants ───────────────────────────────────
// 1 skipped irrigation cycle for a 1-hectare smallholder plot ≈ 22,000 liters saved.
// Derivation: typical surface irrigation uses ~8,000–10,000 liters/acre;
// 1 hectare ≈ 2.47 acres → ~22,000 liters per cycle.
export const WATER_PER_CYCLE_LITERS = 22000;

// WHO standard: 2.5 liters of drinking water per person per day (minimum survival need).
export const DRINKING_WATER_PER_PERSON_PER_DAY = 2.5;

// ─── CO₂ Equivalent Constants ──────────────────────────────────────────
// Assumption: diesel-powered irrigation pump.
// A typical 5HP diesel pump delivers ~18,000 liters/hour and consumes ~3.5 liters diesel/hour.
// For 22,000 liters of water: runtime ≈ 22,000 / 18,000 ≈ 1.22 hours.
// Diesel consumed ≈ 1.22 × 3.5 ≈ 4.28 liters.
// IPCC emission factor: 1 liter diesel ≈ 2.68 kg CO₂.
// Therefore: 1 skipped cycle ≈ 4.28 × 2.68 ≈ 11.47 kg CO₂ avoided.
export const CO2_KG_PER_SKIPPED_CYCLE = 11.47;

export function calculateSavings(cropType) {
  const base = CROP_WATER_COST[cropType] || CROP_WATER_COST.default;
  return base;
}

export function calculateTotalSavings(irrigationLog) {
  if (!Array.isArray(irrigationLog)) return 0;
  return irrigationLog
    .filter(entry => entry.aiSaidSkip && entry.didSkip)
    .reduce((sum, entry) => sum + (entry.savings || 0), 0);
}

export function calculateWaterLitersSaved(irrigationLog) {
  if (!Array.isArray(irrigationLog)) return 0;
  const skipEvents = irrigationLog.filter(entry => entry.aiSaidSkip && entry.didSkip);
  return skipEvents.length * WATER_PER_CYCLE_LITERS;
}

export function calculateCO2Saved(irrigationLog) {
  if (!Array.isArray(irrigationLog)) return 0;
  const skipEvents = irrigationLog.filter(entry => entry.aiSaidSkip && entry.didSkip);
  return Math.round(skipEvents.length * CO2_KG_PER_SKIPPED_CYCLE * 100) / 100;
}

export function calculateVillageDrinkingDays(liters, villagePopulation = 500) {
  if (liters <= 0) return 0;
  return Math.floor(liters / (villagePopulation * DRINKING_WATER_PER_PERSON_PER_DAY));
}

export function calculateMonthSavings(irrigationLog) {
  if (!Array.isArray(irrigationLog)) return 0;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return irrigationLog
    .filter(entry => entry.aiSaidSkip && entry.didSkip && entry.timestamp >= monthStart)
    .reduce((sum, entry) => sum + (entry.savings || 0), 0);
}

export function calculateWeekSavings(irrigationLog) {
  if (!Array.isArray(irrigationLog)) return 0;
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  return irrigationLog
    .filter(entry => entry.aiSaidSkip && entry.didSkip && entry.timestamp >= weekAgo)
    .reduce((sum, entry) => sum + (entry.savings || 0), 0);
}

export function getSkipCount(irrigationLog) {
  if (!Array.isArray(irrigationLog)) return 0;
  return irrigationLog.filter(entry => entry.aiSaidSkip && entry.didSkip).length;
}

// Get daily savings data for the last N days (for charts)
export function getDailySavingsData(irrigationLog, days = 15) {
  if (!Array.isArray(irrigationLog)) return [];
  const now = new Date();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const dayEntries = irrigationLog.filter(entry => {
      const ts = new Date(entry.date || entry.timestamp).getTime();
      return entry.aiSaidSkip && entry.didSkip && ts >= dayStart && ts < dayEnd;
    });

    const rupees = dayEntries.reduce((s, e) => s + (e.savings || 0), 0);
    const waterLiters = dayEntries.length * WATER_PER_CYCLE_LITERS;
    const co2Kg = Math.round(dayEntries.length * CO2_KG_PER_SKIPPED_CYCLE * 100) / 100;

    result.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      month: date.getMonth(),
      rupees,
      waterLiters,
      co2Kg,
      skips: dayEntries.length,
    });
  }

  return result;
}
