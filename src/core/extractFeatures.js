// src/core/extractFeatures.js

// Basic keyword dictionaries (MVP - will expand later)
const ANCHOR_KEYWORDS = [
  "phoenix",
  "dragon",
  "angel",
  "demon"
];

const ACTION_KEYWORDS = [
  "running",
  "chasing",
  "falling",
  "flying",
  "watching",
  "walking",
  "hiding"
];

const OBJECT_KEYWORDS = [
  "car",
  "house",
  "ball",
  "door",
  "mirror",
  "phone",
  "building",
  "field",
  "hallway"
];

const EMOTION_KEYWORDS = [
  "fear",
  "scared",
  "panic",
  "calm",
  "happy",
  "confused",
  "anxious"
];

// Detect numbers like 11:47, 333, etc.
function extractNumbers(text) {
  const matches = text.match(/\b\d+(?::\d+)?\b/g);
  return matches ? matches : [];
}

// Normalize text
function normalize(text) {
  return text.toLowerCase();
}

// Extract keywords from text
function extractKeywords(text, keywordList) {
  return keywordList.filter(word => text.includes(word));
}

// Main function
export function extractFeatures(dreamText) {
  const text = normalize(dreamText);

  const anchors = extractKeywords(text, ANCHOR_KEYWORDS);
  const actions = extractKeywords(text, ACTION_KEYWORDS);
  const objects = extractKeywords(text, OBJECT_KEYWORDS);
  const emotions = extractKeywords(text, EMOTION_KEYWORDS);
  const symbolicTokens = extractNumbers(text);

  return {
    anchors,
    actions,
    objects,
    emotions,
    symbolicTokens
  };
}