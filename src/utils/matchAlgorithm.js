// src/utils/matchAlgorithm.js
export function computeSimilarity(dream1, dream2) {
  const tags1 = (dream1.tags || []).map((t) => t.toLowerCase());
  const tags2 = (dream2.tags || []).map((t) => t.toLowerCase());

  const commonTags = tags1.filter((t) => tags2.includes(t)).length;
  const allTags = new Set([...tags1, ...tags2]).size;

  const titleSim = calculateStringSimilarity(
    dream1.title.toLowerCase(),
    dream2.title.toLowerCase()
  );
  const descSim = calculateStringSimilarity(
    dream1.description.toLowerCase(),
    dream2.description.toLowerCase()
  );

  const tagOverlap = allTags > 0 ? commonTags / allTags : 0;
  const score = (titleSim * 0.2 + descSim * 0.3 + tagOverlap * 0.5) * 100;

  return {
    score,
    totalOverlap: commonTags,
    tagSimilarity: tagOverlap,
    titleSimilarity: titleSim,
    descriptionSimilarity: descSim,
  };
}

function calculateStringSimilarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(s1, s2) {
  const costs = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}