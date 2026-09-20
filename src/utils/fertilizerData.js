// src/utils/fertilizerData.js
// Fertilizer dosage recommendations based on ICAR (Indian Council of Agricultural Research) guidelines.
// All values in kg/hectare for a standard growing season.

export const FERTILIZER_RECOMMENDATIONS = {
  wheat: {
    id: 'wheat',
    n: 120,  // Nitrogen (kg/ha)
    p: 60,   // Phosphorus as P₂O₅ (kg/ha)
    k: 40,   // Potassium as K₂O (kg/ha)
    source: 'ICAR Wheat Handbook',
  },
  rice: {
    id: 'rice',
    n: 120,
    p: 60,
    k: 60,
    source: 'ICAR Rice Production Manual',
  },
  maize: {
    id: 'maize',
    n: 120,
    p: 60,
    k: 40,
    source: 'ICAR Maize Guidelines',
  },
  pulses: {
    id: 'pulses',
    n: 20,
    p: 40,
    k: 20,
    source: 'ICAR Pulses Handbook',
  },
  vegetables: {
    id: 'vegetables',
    n: 100,
    p: 60,
    k: 60,
    source: 'ICAR Vegetable Crops',
  },
  potato: {
    id: 'potato',
    n: 180,
    p: 80,
    k: 100,
    source: 'ICAR Potato Production',
  },
  tomato: {
    id: 'tomato',
    n: 120,
    p: 80,
    k: 80,
    source: 'ICAR Tomato Guidelines',
  },
};

/**
 * Get recommended NPK dosage for a crop
 * @param {string} cropId - crop identifier from cropData.js
 * @returns {{ n: number, p: number, k: number, source: string } | null}
 */
export function getRecommendedDosage(cropId) {
  return FERTILIZER_RECOMMENDATIONS[cropId] || null;
}

/**
 * Calculate estimated nitrogen runoff from over-application.
 * Assumption: approximately 30% of excess nitrogen leaches into water sources (FAO/IPCC estimates).
 * This is a conservative estimate — actual leaching varies by soil type, rainfall, and application method.
 *
 * @param {number} appliedN - farmer's actual N application (kg/ha)
 * @param {number} recommendedN - ICAR-recommended N application (kg/ha)
 * @param {number} areaHa - farm area in hectares (default 1)
 * @returns {{ excessN: number, runoffN: number, isOverdosing: boolean }}
 */
export function calculateRunoff(appliedN, recommendedN, areaHa = 1) {
  const excessN = Math.max(0, (appliedN - recommendedN) * areaHa);
  const LEACHING_FACTOR = 0.30; // 30% of excess N leaches to water
  const runoffN = Math.round(excessN * LEACHING_FACTOR * 10) / 10;
  return {
    excessN: Math.round(excessN * 10) / 10,
    runoffN,
    isOverdosing: appliedN > recommendedN,
  };
}

/**
 * Get fertilizer status label and color for a single nutrient
 * @param {number} applied - applied amount
 * @param {number} recommended - recommended amount
 * @returns {{ status: string, color: string, statusKey: string }}
 */
export function getNutrientStatus(applied, recommended) {
  const ratio = applied / recommended;
  if (ratio > 1.2) return { status: 'अधिक', color: '#C62828', statusKey: 'overdose' };
  if (ratio >= 0.8) return { status: 'सही', color: '#2E7D32', statusKey: 'optimal' };
  return { status: 'कम', color: '#E65100', statusKey: 'deficient' };
}
