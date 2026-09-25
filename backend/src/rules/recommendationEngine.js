// Deterministic Skincare Recommendation Engine

const generateRecommendation = (profile) => {
  const { skinType, sensitivity, concerns } = profile;
  
  const routine = {
    skinType: skinType || 'normal',
    sensitivity: sensitivity || 'normal',
    concerns: concerns || [],
    morning: [],
    evening: [],
    weekly: [],
    notes: []
  };

  const isSensitive = routine.sensitivity === 'sensitive';

  // Base routines
  if (routine.skinType === 'oily') {
    routine.morning.push({ step: 1, category: 'cleanser', title: 'Gentle Foaming Cleanser', description: 'Use a foaming cleanser to remove excess sebum.', reason: 'Foaming cleansers effectively remove oil without excessive stripping.' });
    routine.morning.push({ step: 2, category: 'moisturizer', title: 'Lightweight Non-comedogenic Moisturizer', description: 'Apply a gel-based or lightweight moisturizer.', reason: 'Hydrates without adding heavy oils.' });
    routine.morning.push({ step: 3, category: 'sunscreen', title: 'Broad-spectrum Sunscreen', description: 'Apply a lightweight sunscreen (SPF 30+).', reason: 'Protects skin from UV damage.' });
    
    routine.evening.push({ step: 1, category: 'cleanser', title: 'Gentle Foaming Cleanser', description: 'Cleanse to remove daily buildup and sunscreen.', reason: 'Cleanses the skin thoroughly.' });
    routine.evening.push({ step: 2, category: 'moisturizer', title: 'Lightweight Moisturizer', description: 'Apply a lightweight moisturizer.', reason: 'Keeps skin balanced overnight.' });
  } 
  else if (routine.skinType === 'dry') {
    routine.morning.push({ step: 1, category: 'cleanser', title: 'Gentle Hydrating Cleanser', description: 'Use a cream or milk-based cleanser, or just rinse with water.', reason: 'Avoids stripping natural oils.' });
    routine.morning.push({ step: 2, category: 'moisturizer', title: 'Rich Hydrating Moisturizer', description: 'Apply a nourishing cream.', reason: 'Provides lasting moisture and barrier support.' });
    routine.morning.push({ step: 3, category: 'sunscreen', title: 'Broad-spectrum Sunscreen', description: 'Apply a hydrating sunscreen (SPF 30+).', reason: 'Protects skin from UV damage.' });
    
    routine.evening.push({ step: 1, category: 'cleanser', title: 'Gentle Hydrating Cleanser', description: 'Cleanse gently.', reason: 'Removes impurities without drying.' });
    routine.evening.push({ step: 2, category: 'moisturizer', title: 'Barrier-supporting Moisturizer', description: 'Apply a thick, nourishing moisturizer.', reason: 'Repairs the skin barrier overnight.' });
  }
  else if (routine.skinType === 'combination') {
    routine.morning.push({ step: 1, category: 'cleanser', title: 'Gentle Cleanser', description: 'Use a balanced cleanser.', reason: 'Cleanses oily areas while respecting dry areas.' });
    routine.morning.push({ step: 2, category: 'moisturizer', title: 'Lightweight Moisturizer', description: 'Apply an adaptable lightweight moisturizer.', reason: 'Provides balanced hydration.' });
    routine.morning.push({ step: 3, category: 'sunscreen', title: 'Broad-spectrum Sunscreen', description: 'Apply daily sunscreen (SPF 30+).', reason: 'Protects skin from UV damage.' });
    
    routine.evening.push({ step: 1, category: 'cleanser', title: 'Gentle Cleanser', description: 'Cleanse the face thoroughly.', reason: 'Removes the day\'s impurities.' });
    routine.evening.push({ step: 2, category: 'moisturizer', title: 'Lightweight Moisturizer', description: 'Apply moisturizer, focusing on dry areas if needed.', reason: 'Nourishes the skin without overwhelming the T-zone.' });
  }
  else {
    // Normal
    routine.morning.push({ step: 1, category: 'cleanser', title: 'Gentle Cleanser', description: 'Use a basic, gentle cleanser.', reason: 'Keeps skin fresh.' });
    routine.morning.push({ step: 2, category: 'moisturizer', title: 'Basic Moisturizer', description: 'Apply a balanced moisturizer.', reason: 'Maintains skin hydration.' });
    routine.morning.push({ step: 3, category: 'sunscreen', title: 'Broad-spectrum Sunscreen', description: 'Apply daily sunscreen (SPF 30+).', reason: 'Protects skin from UV damage.' });
    
    routine.evening.push({ step: 1, category: 'cleanser', title: 'Gentle Cleanser', description: 'Cleanse the face.', reason: 'Removes impurities.' });
    routine.evening.push({ step: 2, category: 'moisturizer', title: 'Basic Moisturizer', description: 'Apply a balanced moisturizer.', reason: 'Supports the skin overnight.' });
  }

  // Concern modifiers (inject into routines or add notes)
  const cList = routine.concerns.map(c => c.toLowerCase());
  
  if (cList.includes('acne')) {
    routine.notes.push("Consider a salicylic-acid based skincare product for acne-prone areas.");
    // Optionally add a treatment step to evening
    routine.evening.splice(1, 0, { step: 1.5, category: 'treatment', title: 'Acne-focused Ingredient', description: 'Consider a general acne-care product.', reason: 'Helps manage breakouts.' });
  }
  if (cList.includes('oiliness')) {
    routine.notes.push("Consider lightweight, non-comedogenic products and gentle oil-control ingredients.");
  }
  if (cList.includes('dryness')) {
    routine.notes.push("Consider hydrating ingredients such as glycerin or hyaluronic-acid based hydration.");
  }
  if (cList.includes('redness')) {
    routine.notes.push("Prefer gentle, fragrance-free, barrier-supporting skincare.");
  }
  if (cList.includes('dark spots')) {
    routine.notes.push("Consider brightening ingredient categories such as niacinamide or vitamin-C based skincare.");
    routine.notes.push("Daily sunscreen is essential for managing dark spots.");
  }
  if (cList.includes('uneven texture')) {
    routine.notes.push("Consider gentle texture-supporting skincare and avoid aggressive exfoliation.");
  }
  if (cList.includes('dullness')) {
    routine.notes.push("Consider gentle exfoliation or antioxidant-focused skincare.");
  }

  // Weekly / Optional Care
  if (isSensitive || routine.skinType === 'dry') {
    routine.weekly.push({ step: 1, category: 'weekly', title: 'Focus on Hydration', description: 'Focus on hydration and barrier support. Exfoliation is optional and should be approached cautiously.', reason: 'Protects sensitive/dry skin from over-exfoliation.' });
  } else {
    routine.weekly.push({ step: 1, category: 'weekly', title: 'Gentle Exfoliation', description: 'Consider gentle exfoliation if your skin tolerates it (1-2 times a week).', reason: 'Helps remove dead skin cells and improve texture.' });
  }

  // Sensitivity modifications
  if (isSensitive) {
    routine.notes.push("Because your profile indicates sensitivity, introduce new products one at a time.");
    routine.notes.push("Consider patch testing a new product before regular use.");
    routine.notes.push("If significant irritation occurs, stop using the product and seek professional advice if needed.");
  }

  // Normalize step numbers for evening since we might have injected a treatment
  routine.evening.forEach((item, index) => {
    item.step = index + 1;
  });

  return routine;
};

module.exports = { generateRecommendation };
