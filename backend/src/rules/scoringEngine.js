// Rule-based Skin Type Scoring Engine

const calculateSkinProfile = (answers) => {
  const scores = {
    oily: 0,
    dry: 0,
    combination: 0,
    normal: 0,
    sensitive: 0
  };

  const concernsSet = new Set();

  // Q1: Face wash ke 1–2 hours baad skin kaisi feel hoti hai?
  switch (answers.q1) {
    case 'Very oily / shiny': scores.oily += 2; break;
    case 'Comfortable': scores.normal += 2; break;
    case 'Tight / stretched': scores.dry += 2; break;
    case 'T-zone oily but cheeks normal/dry': scores.combination += 2; break;
  }

  // Q2: Din ke beech mein face kitna oily hota hai?
  switch (answers.q2) {
    case 'Very oily': scores.oily += 2; break;
    case 'Slightly oily': scores.oily += 1; scores.combination += 1; break;
    case 'Mostly normal': scores.normal += 2; break;
    case 'Almost never oily': scores.dry += 2; break;
  }

  // Q3: Face wash ke baad skin?
  switch (answers.q3) {
    case 'Tight/dry': scores.dry += 2; break;
    case 'Comfortable': scores.normal += 2; break;
    case 'T-zone oily': scores.combination += 2; break;
    case 'Irritated/burning': scores.sensitive += 2; scores.dry += 1; break;
  }

  // Q4: Cheeks generally kaise hote hain?
  switch (answers.q4) {
    case 'Dry/flaky': scores.dry += 2; break;
    case 'Normal': scores.normal += 2; scores.combination += 1; break;
    case 'Oily': scores.oily += 2; break;
    case 'Kabhi dry, kabhi oily': scores.combination += 2; break;
  }

  // Q5: T-zone (forehead + nose) kaisa hota hai?
  switch (answers.q5) {
    case 'Very oily': scores.oily += 2; scores.combination += 1; break;
    case 'Slightly oily': scores.combination += 1; scores.normal += 1; break;
    case 'Normal': scores.normal += 2; break;
    case 'Dry': scores.dry += 2; break;
  }

  // Q6: Pimples kitni frequently hote hain?
  if (answers.q6 === 'Frequently' || answers.q6 === 'Very frequently') {
    concernsSet.add('Acne');
  }

  // Q7: Skin products lagane ke baad irritation hoti hai?
  switch (answers.q7) {
    case 'Rarely': scores.sensitive += 1; break;
    case 'Sometimes': scores.sensitive += 2; break;
    case 'Frequently': scores.sensitive += 3; break;
  }

  // Q8: Skin mein redness/stinging easily hoti hai?
  switch (answers.q8) {
    case 'Sometimes': scores.sensitive += 1; break;
    case 'Often': scores.sensitive += 2; break;
    case 'Very easily': scores.sensitive += 3; break;
  }

  // Q9: Skin flakes / rough patches?
  switch (answers.q9) {
    case 'Frequently': scores.dry += 2; scores.sensitive += 1; break;
    case 'Sometimes': scores.dry += 1; break;
  }

  // Q10: Current main concern kya hai? (Array of strings)
  if (Array.isArray(answers.q10)) {
    answers.q10.forEach(c => {
      if (c !== 'None') concernsSet.add(c);
    });
  }

  // Determine primary skin type
  let primaryType = 'normal';
  let maxScore = -1;
  const types = ['oily', 'dry', 'combination', 'normal'];

  types.forEach(type => {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      primaryType = type;
    }
  });

  // Tie-breaking logic (deterministic)
  // If multiple types have the exact same maxScore, we apply a priority:
  // Combination > Oily > Dry > Normal
  const tiedTypes = types.filter(type => scores[type] === maxScore);
  if (tiedTypes.length > 1) {
    if (tiedTypes.includes('combination')) primaryType = 'combination';
    else if (tiedTypes.includes('oily')) primaryType = 'oily';
    else if (tiedTypes.includes('dry')) primaryType = 'dry';
  }

  // Determine sensitivity
  // If sensitivity score is 4 or higher, classify as sensitive
  const sensitivity = scores.sensitive >= 4 ? 'sensitive' : 'resilient';

  return {
    skinType: primaryType,
    sensitivity: sensitivity,
    concerns: Array.from(concernsSet),
    scores: {
      oily: scores.oily,
      dry: scores.dry,
      combination: scores.combination,
      normal: scores.normal,
      sensitive: scores.sensitive
    }
  };
};

module.exports = { calculateSkinProfile };
