/**
 * dreamFeatures.js
 *
 * The vocabulary layer. Defines how raw user input maps to
 * structured dream features, how rare each element is, and
 * which synonyms should be treated as equivalent during matching.
 *
 * Rarity scores (1–10):
 *   1–3  = extremely common (running, falling, water)
 *   4–6  = moderately specific
 *   7–9  = rare and meaningful (phoenix, specific number sequences)
 *   10   = anchor-class: should never appear twice by coincidence
 */

// ---------------------------------------------------------------------------
// SYNONYM MAP
// Keys are canonical forms. Values are alternate phrasings that map to them.
// ---------------------------------------------------------------------------
export const SYNONYMS = {
  // Environments
  hallway:     ['corridor', 'passage', 'passageway', 'walkway', 'aisle'],
  house:       ['home', 'building', 'room', 'apartment', 'residence', 'mansion', 'cabin'],
  school:      ['classroom', 'college', 'university', 'lecture hall', 'campus'],
  forest:      ['woods', 'jungle', 'trees', 'woodland', 'grove', 'thicket'],
  water:       ['ocean', 'sea', 'lake', 'river', 'flood', 'pool', 'puddle', 'rain', 'tide'],
  city:        ['town', 'street', 'urban', 'downtown', 'alley', 'road', 'avenue'],
  void:        ['darkness', 'nothingness', 'empty space', 'abyss', 'infinite dark'],
  sky:         ['air', 'clouds', 'above', 'atmosphere', 'heavens'],
  underground: ['basement', 'beneath', 'below', 'cave', 'bunker', 'catacomb', 'cellar'],

  // Environmental modifiers
  dark:        ['shadowy', 'dim', 'pitch black', 'unlit', 'no light'],
  bright:      ['glowing', 'blinding', 'illuminated', 'sunlit', 'radiant'],
  infinite:    ['endless', 'never ending', 'never-ending', 'no end', 'goes on forever'],
  familiar:    ['recognizable', 'known', 'feels like home', 'like my house', 'childhood'],
  unfamiliar:  ['unknown', 'strange', 'never seen', 'foreign', 'alien', 'wrong'],
  empty:       ['deserted', 'abandoned', 'nobody there', 'nobody around', 'vacant'],

  // Actions
  running:     ['fleeing', 'sprinting', 'chasing', 'being chased', 'ran', 'running away', 'pursuit'],
  flying:      ['floating', 'levitating', 'soaring', 'hovering', 'drifting', 'weightless'],
  falling:     ['dropping', 'plummeting', 'tumbling', 'fell', 'falling down', 'plunging'],
  searching:   ['looking for', 'seeking', 'finding', 'lost', 'trying to find', 'wandering'],
  watching:    ['observing', 'staring', 'looking at', 'witnessing', 'seeing'],
  hiding:      ['concealed', 'hiding from', 'behind something', 'tucked away'],
  climbing:    ['ascending', 'going up', 'stairs', 'ladder', 'mountain'],
  drowning:    ['underwater', 'submerged', 'sinking', 'suffocating in water'],
  looping:     ['repeating', 'again and again', 'keeps happening', 'starts over', 'circular'],

  // Creatures / figures
  snake:       ['serpent', 'viper', 'cobra', 'python'],
  wolf:        ['wolves', 'dog-like creature', 'canine'],
  bird:        ['birds', 'flock', 'ravens', 'crows', 'owl', 'eagle', 'hawk'],
  horse:       ['horses', 'stallion', 'mare'],
  shadow:      ['shadow figure', 'dark figure', 'silhouette', 'shade', 'dark shape'],
  stranger:    ['unknown person', 'faceless person', 'unknown figure', 'anonymous figure'],

  // Rare anchors
  phoenix:     ['phoenix bird', 'firebird', 'bird on fire', 'rising from flames'],
  clock:       ['broken clock', 'melting clock', 'clock with no hands', 'stopped clock', 'wrong time'],
  mirror:      ['mirror showing something wrong', 'mirror with no reflection', 'distorted mirror'],
  door:        ['door with no handle', 'locked door', 'door to nowhere', 'door in wrong place'],
  eye:         ['giant eye', 'eye watching me', 'single eye', 'disembodied eye'],
  spiral:      ['spiraling', 'spiral pattern', 'spinning inward', 'vortex'],
  teeth:       ['teeth falling out', 'losing teeth', 'teeth crumbling', 'broken teeth'],
};

// Reverse lookup: given any word, return its canonical form.
export function canonicalize(word) {
  const lower = word.toLowerCase().trim();
  if (SYNONYMS[lower]) return lower;
  for (const [canonical, synonymList] of Object.entries(SYNONYMS)) {
    if (synonymList.some(s => lower.includes(s) || s.includes(lower))) {
      return canonical;
    }
  }
  return lower;
}

// ---------------------------------------------------------------------------
// RARITY WEIGHTS
// Higher = rarer = more signal when matched
// ---------------------------------------------------------------------------
export const RARITY = {
  running:     1,
  falling:     1,
  water:       2,
  house:       2,
  flying:      2,
  searching:   2,
  dark:        2,
  stranger:    2,
  school:      2,
  hallway:     4,
  forest:      3,
  snake:       4,
  bird:        3,
  wolf:        5,
  clock:       5,
  looping:     5,
  underground: 4,
  hiding:      4,
  climbing:    3,
  mirror:      6,
  spiral:      6,
  teeth:       6,
  void:        5,
  phoenix:     9,
  eye:         7,
  door:        6,
  shadow:      5,
  _default:    3,
};

export function getRarity(term) {
  const canonical = canonicalize(term);
  return RARITY[canonical] ?? RARITY._default;
}

// ---------------------------------------------------------------------------
// ANCHOR DETECTION PATTERNS
// Regex patterns that identify rare, high-signal dream elements in free text
// ---------------------------------------------------------------------------
export const ANCHOR_PATTERNS = [
  /\bphoenix\b/i,
  /\b(number|numbers?)\s+\d+/i,
  /\b\d{2,}\b/,
  /\bclock\b.*(no hands|broken|wrong|backwards|melting)/i,
  /\bmirror\b.*(no reflection|wrong|different|backwards)/i,
  /\bdoor\b.*(no handle|locked|nowhere|wrong place)/i,
  /\b(giant|massive|huge)\s+eye\b/i,
  /\bspiral\b/i,
  /\bvortex\b/i,
  /\bteeth\b.*(fall|crumble|broken|loose)/i,
];

// ---------------------------------------------------------------------------
// STRUCTURAL PATTERNS
// ---------------------------------------------------------------------------
export const STRUCTURAL_PATTERNS = [
  'chase',
  'loop',
  'exploration',
  'confrontation',
  'observation',
  'transformation',
  'loss',
  'return',
  'ascent',
  'descent',
];

// ---------------------------------------------------------------------------
// EMOTIONAL TONES
// ---------------------------------------------------------------------------
export const EMOTIONAL_TONES = [
  { value: 'dread',      label: 'Dread / Foreboding' },
  { value: 'wonder',     label: 'Wonder / Awe' },
  { value: 'confusion',  label: 'Confusion / Disorientation' },
  { value: 'peace',      label: 'Peace / Calm' },
  { value: 'terror',     label: 'Terror / Panic' },
  { value: 'joy',        label: 'Joy / Elation' },
  { value: 'melancholy', label: 'Melancholy / Grief' },
  { value: 'urgency',    label: 'Urgency / Pressure' },
  { value: 'neutral',    label: 'Neutral / Unclear' },
];

// ---------------------------------------------------------------------------
// MATCH QUALITY LABELS
// ---------------------------------------------------------------------------
export function matchQualityLabel(score) {
  if (score >= 75) return { label: 'Remarkable', color: 'gold' };
  if (score >= 50) return { label: 'Strong',     color: 'cyan' };
  if (score >= 30) return { label: 'Notable',    color: 'blue' };
  if (score >= 15) return { label: 'Loose',      color: 'muted' };
  return              { label: 'Distant',     color: 'muted' };
}