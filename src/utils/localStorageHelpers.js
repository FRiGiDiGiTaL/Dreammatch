// src/utils/localStorageHelpers.js

export function loadLS(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export function uid() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function textToHashHex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Dream schema — what a fully submitted dream looks like in storage.
 *
 * {
 *   id:              string
 *   userId:          string
 *   createdAt:       number  (timestamp)
 *
 *   rawDescription:  string  — full free-text account
 *
 *   environments:    string[]  — e.g. ["long dark hallway that ended without warning"]
 *   objects:         string[]  — e.g. ["clock with no hands"]
 *   figures:         string[]  — e.g. ["shadow figure", "my mother"]
 *   animals:         string[]  — e.g. ["large black bird"]
 *   actions:         string[]  — e.g. ["searching", "running"]
 *   anchors:         string[]  — rare/specific elements explicitly flagged
 *   symbols:         string[]  — e.g. ["7", "a word I couldn't read"]
 *
 *   emotionalTone:   string   — one of EMOTIONAL_TONES values
 *   structuralType:  string   — one of STRUCTURAL_PATTERNS values
 *
 *   isRecurring:     boolean
 *   recurringNote:   string   — e.g. "monthly for 3 years"
 *
 *   isPublic:        boolean
 * }
 */