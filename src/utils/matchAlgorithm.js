/**
 * Enhanced Dream Matching Algorithm
 * Compares two dreams across multiple dimensions
 * Keywords and full description are weighted heavily
 */

export function computeSimilarity(dream1, dream2) {
  const scores = {
    keywords: 0,
    description: 0,
    places: 0,
    animals: 0,
    names: 0,
    dreamType: 0,
    recurring: 0,
  };

  // 1. KEYWORD MATCHING (Heavily Weighted - 40%)
  // Exact keyword matches boost score significantly
  const keywords1 = dream1.keywords || [];
  const keywords2 = dream2.keywords || [];
  
  let keywordMatches = 0;
  keywords1.forEach(kw => {
    if (keywords2.includes(kw)) {
      keywordMatches++;
    }
  });
  
  // Score: 0-40 based on keyword overlap
  const maxKeywords = Math.max(keywords1.length, keywords2.length);
  scores.keywords = maxKeywords > 0 ? (keywordMatches / maxKeywords) * 40 : 0;

  // 2. FULL DESCRIPTION MATCHING (Heavily Weighted - 30%)
  // Extract key terms from descriptions and compare
  const description1 = (dream1.fullDescription || "").toLowerCase();
  const description2 = (dream2.fullDescription || "").toLowerCase();
  
  let descriptionScore = 0;
  
  // Check how many keywords from dream1 appear in dream2's description
  keywords1.forEach(kw => {
    if (description2.includes(kw.toLowerCase())) {
      descriptionScore++;
    }
  });
  
  // Check how many keywords from dream2 appear in dream1's description
  keywords2.forEach(kw => {
    if (description1.includes(kw.toLowerCase())) {
      descriptionScore++;
    }
  });
  
  const totalKeywordReferences = keywords1.length + keywords2.length;
  scores.description = totalKeywordReferences > 0 
    ? (descriptionScore / totalKeywordReferences) * 30 
    : 0;

  // 3. PLACES MATCHING (10%)
  // Exact place matches only
  const places1 = (dream1.places || []).map(p => p.toLowerCase().trim());
  const places2 = (dream2.places || []).map(p => p.toLowerCase().trim());
  
  let placeMatches = 0;
  places1.forEach(place => {
    if (places2.includes(place)) {
      placeMatches++;
    }
  });
  
  const maxPlaces = Math.max(places1.length, places2.length, 1);
  scores.places = (placeMatches / maxPlaces) * 10;

  // 4. ANIMALS MATCHING (7%)
  // Exact animal matches only
  const animals1 = (dream1.animals || []).map(a => a.toLowerCase().trim());
  const animals2 = (dream2.animals || []).map(a => a.toLowerCase().trim());
  
  let animalMatches = 0;
  animals1.forEach(animal => {
    if (animals2.includes(animal)) {
      animalMatches++;
    }
  });
  
  const maxAnimals = Math.max(animals1.length, animals2.length, 1);
  scores.animals = (animalMatches / maxAnimals) * 7;

  // 5. NAMES MATCHING (5%)
  // Exact name matches only (case-insensitive)
  const names1 = (dream1.names || []).map(n => n.toLowerCase().trim());
  const names2 = (dream2.names || []).map(n => n.toLowerCase().trim());
  
  let nameMatches = 0;
  names1.forEach(name => {
    if (names2.includes(name)) {
      nameMatches++;
    }
  });
  
  const maxNames = Math.max(names1.length, names2.length, 1);
  scores.names = (nameMatches / maxNames) * 5;

  // 6. DREAM TYPE MATCHING (4%)
  // Same dream type (good, nightmare, neutral, etc.) adds small bonus
  if (dream1.dreamType && dream2.dreamType && dream1.dreamType === dream2.dreamType) {
    scores.dreamType = 4;
  }

  // 7. RECURRING DREAM BONUS (4%)
  // Both being recurring dreams is a strong indicator of similarity
  if (dream1.isRecurring && dream2.isRecurring) {
    scores.recurring = 4;
  }

  // Calculate total score (0-100)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Count meaningful matches (at least 2 different dimensions with matches)
  const dimensionsWithMatches = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .length;

  return {
    score: Math.round(totalScore * 10) / 10, // Round to 1 decimal
    breakdown: scores,
    totalOverlap: dimensionsWithMatches,
    keywordMatches,
    placeMatches,
    animalMatches,
    nameMatches,
  };
}

/**
 * Get human-readable match reason
 */
export function getMatchReason(similarity) {
  const { breakdown, keywordMatches, score } = similarity;
  
  if (score < 10) return "Low similarity";
  if (keywordMatches >= 3) return `Strong keyword match (${keywordMatches} shared)`;
  if (breakdown.description > 15) return "Shared dream elements in narrative";
  if (breakdown.places > 5) return "Similar dream locations";
  if (breakdown.animals > 3) return "Common creatures appeared";
  if (breakdown.dreamType === 4 && breakdown.recurring === 4) return "Recurring dream type match";
  return "Compatible dreams";
}