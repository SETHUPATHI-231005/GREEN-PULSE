/**
 * Agriculture Logic - Rule-based models for Smart Farming
 */

export interface CropInput {
  soilType: string;
  season: string;
  temperature: number;
}

export interface FertilizerInput {
  crop: string;
  soilType: string;
}

export function recommendCrop(input: CropInput): string[] {
  const { soilType, season, temperature } = input;
  const recommendations: string[] = [];
  const normalizedSoil = soilType.toLowerCase();
  const normalizedSeason = season.toLowerCase();

  // South Indian specific rule-based logic
  if (normalizedSoil === 'red' || normalizedSoil === 'loamy red') {
    if (temperature > 25) {
      recommendations.push('Groundnut', 'Ragi (Finger Millet)', 'Sorghum (Cholam)');
    } else {
      recommendations.push('Pulses', 'Maize');
    }
  } else if (normalizedSoil === 'black' || normalizedSoil === 'regur') {
    if (temperature > 22) {
      recommendations.push('Cotton', 'Chillies', 'Tobacco');
    } else {
      recommendations.push('Sunflower', 'Bengal Gram');
    }
  } else if (normalizedSoil === 'alluvial' || normalizedSoil === 'deltaic') {
    if (normalizedSeason === 'kharif (samba/kuruvai)') {
      recommendations.push('Paddy (Rice)', 'Sugarcane', 'Banana');
    } else {
      recommendations.push('Paddy (Navarai)', 'Black Gram', 'Green Gram');
    }
  } else if (normalizedSoil === 'laterite') {
    if (temperature > 24) {
      recommendations.push('Cashew', 'Coconut', 'Tapioca');
    } else {
      recommendations.push('Coffee', 'Tea', 'Pepper');
    }
  } else if (normalizedSoil === 'coastal sandy') {
    recommendations.push('Coconut', 'Casuarina', 'Palmyra');
  } else {
    recommendations.push('Millets', 'Maize', 'Vegetables');
  }

  return recommendations.length > 0 ? recommendations : ['Paddy (Rice)'];
}

export function recommendFertilizer(input: FertilizerInput): { type: string; quantity: string } {
  const { crop, soilType } = input;
  
  const rules: Record<string, { type: string; quantity: string }> = {
    'Paddy (Rice)': { type: 'Urea, SSP, MOP (NPK 17:17:17)', quantity: '150kg/hectare' },
    'Sugarcane': { type: 'Urea, DAP, MOP', quantity: '250kg/hectare' },
    'Cotton': { type: 'DAP, Urea, Zinc Sulphate', quantity: '100kg/hectare' },
    'Groundnut': { type: 'Gypsum, SSP', quantity: '400kg/hectare' },
    'Ragi (Finger Millet)': { type: 'Urea, Super Phosphate', quantity: '80kg/hectare' },
    'Chillies': { type: 'NPK Complex, Micronutrients', quantity: '120kg/hectare' },
    'Coconut': { type: 'Organic Manure, MOP, Urea', quantity: '5kg/tree/year' },
    'Turmeric': { type: 'FYM, NPK 60:60:120', quantity: '200kg/hectare' },
  };

  return rules[crop] || { type: 'Neem Cake & Bio-fertilizers', quantity: 'Based on soil test' };
}

export function detectDisease(imageName: string): { disease: string; suggestion: string } {
  // Simulated local analysis logic
  const diseases = [
    { disease: 'Bacterial Blight', suggestion: 'Use copper-based fungicides.' },
    { disease: 'Leaf Rust', suggestion: 'Apply sulfur-based fungicides and improve drainage.' },
    { disease: 'Downy Mildew', suggestion: 'Reduce humidity and apply appropriate pesticides.' },
    { disease: 'Healthy', suggestion: 'No disease detected. Maintain current care.' }
  ];

  // Random result for demo purposes, but simulating "analysis"
  const index = Math.floor(Math.random() * diseases.length);
  return diseases[index];
}
