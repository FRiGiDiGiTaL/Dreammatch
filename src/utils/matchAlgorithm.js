/**
 * matchAlgorithm.js
 *
 * Multi-phase dream matching engine.
 *
 * Phase 1 — Anchor matching       (rarity-weighted, highest signal)
 * Phase 2 — Environment matching  (multi-dimensional, synonym-aware)
 * Phase 3 — Figure matching       (people, creatures)
 * Phase 4 — Action matching       (sequences, behaviors)
 * Phase 5 — Symbol matching       (numbers, words, glyphs)
 * Phase 6 — Structural matching   (chase, loop, exploration...)
 * Phase 7 — Emotional tone        (dread, wonder, terror...)
 * Phase 8 — Raw description       (final cross-match pass)
 */

import { canonicalize, getRarity, SYNONYMS, ANCHOR_PATTERNS } from './dreamFeatures.js';

// ---------------------------------------------------------------------------
// UTILITIES
// ---------------------------------------------------------------------------

function tokenize(str) {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function expandTerm(term) {
  const lower = term.toLowerCase().trim();
  const canonical = canonicalize(lower);
  const synonymList = SYNONYMS[canonical] || [];
  return new Set([lower, canonical, ...synonymList]);
}

function findSemanticOverlap(items1, items2) {
  const list1 = Array.isArray(items1) ? items1 : [items1];
  const list2 = Array.isArray(items2) ? items2 : [items2];
  const pairs = [];

  for (const a of list1) {
    const expandedA = expandTerm(a);
    for (const b of list2) {
      const expandedB = expandTerm(b);
      const intersection = [...expandedA].filter(t => expandedB.has(t));
      if (intersection.length > 0) {
        const canonical = canonicalize(a);
        pairs.push({
          term1: a,
          term2: b,
          canonical,
          rarity: getRarity(canonical),
          shared: intersection[0],
        });
        break;
      }
    }
  }

  const raritySum = pairs.reduce((sum, p) => sum + p.rarity, 0);
  return { matched: pairs.length > 0, pairs, raritySum };
}

function termsInText(terms, text) {
  if (!text || !terms?.length) return [];
  const lower = text.toLowerCase();
  return terms.filter(term => {
    const expanded = expandTerm(term);
    return [...expanded].some(t => lower.includes(t));
  });
}

function detectAnchors(text) {
  if (!text) return [];
  const anchors = [];
  for (const pattern of ANCHOR_PATTERNS) {
    const match = text.match(pattern);
    if (match) anchors.push(match[0]);
  }
  return anchors;
}

// ---------------------------------------------------------------------------
// PHASE SCORERS
// ---------------------------------------------------------------------------

function scoreAnchors(d1, d2) {
  const reasons = [];
  let score = 0;

  const anchors1 = [...(d1.anchors || [])];
  const anchors2 = [...(d2.anchors || [])];

  if (d1.rawDescription) anchors1.push(...detectAnchors(d1.rawDescription));
  if (d2.rawDescription) anchors2.push(...detectAnchors(d2.rawDescription));

  if (anchors1.length === 0 || anchors2.length === 0) {
    return { score: 0, reasons, detail: {} };
  }

  const overlap = findSemanticOverlap(anchors1, anchors2);

  for (const pair of overlap.pairs) {
    // Anchor matches are exponentially weighted by rarity
    const contribution = Math.pow(pair.rarity, 1.5) * 1.5;
    score += contribution;
    reasons.push(`shared anchor: "${pair.canonical}"`);
  }

  score = Math.min(score, 45);
  return { score, reasons, detail: { anchorPairs: overlap.pairs } };
}

function scoreEnvironments(d1, d2) {
  const reasons = [];
  let score = 0;

  const envs1 = d1.environments || [];
  const envs2 = d2.environments || [];

  if (envs1.length === 0 && envs2.length === 0) {
    return { score: 0, reasons, detail: {} };
  }

  const overlap = findSemanticOverlap(envs1, envs2);
  for (const pair of overlap.pairs) {
    score += pair.rarity * 1.8;
    reasons.push(`shared environment: "${pair.canonical}"`);
  }

  // Modifier matching within environment strings
  const modifiers1 = envs1.flatMap(e => tokenize(e)).map(canonicalize);
  const modifiers2 = envs2.flatMap(e => tokenize(e)).map(canonicalize);
  const modOverlap = findSemanticOverlap(modifiers1, modifiers2);
  for (const pair of modOverlap.pairs) {
    const r = getRarity(pair.canonical);
    if (r >= 4) {
      score += r * 0.8;
      if (!reasons.some(r => r.includes(pair.canonical))) {
        reasons.push(`shared environmental quality: "${pair.canonical}"`);
      }
    }
  }

  // Cross-check env terms against raw descriptions
  if (d1.rawDescription && envs2.length > 0) {
    const found = termsInText(envs2, d1.rawDescription);
    score += found.reduce((s, t) => s + getRarity(t) * 0.5, 0);
  }
  if (d2.rawDescription && envs1.length > 0) {
    const found = termsInText(envs1, d2.rawDescription);
    score += found.reduce((s, t) => s + getRarity(t) * 0.5, 0);
  }

  score = Math.min(score, 25);
  return { score, reasons, detail: { envPairs: overlap.pairs } };
}

function scoreFigures(d1, d2) {
  const reasons = [];
  let score = 0;

  const figures1 = [...(d1.figures || []), ...(d1.animals || [])];
  const figures2 = [...(d2.figures || []), ...(d2.animals || [])];

  if (figures1.length === 0 || figures2.length === 0) {
    return { score: 0, reasons, detail: {} };
  }

  const overlap = findSemanticOverlap(figures1, figures2);
  for (const pair of overlap.pairs) {
    score += pair.rarity * 1.5;
    reasons.push(`shared figure: "${pair.canonical}"`);
  }

  score = Math.min(score, 15);
  return { score, reasons, detail: {} };
}

function scoreActions(d1, d2) {
  const reasons = [];
  let score = 0;

  const ACTION_KEYS = ['running','flying','falling','searching','watching','hiding','climbing','drowning','looping'];
  const actions1 = [...(d1.actions || [])];
  const actions2 = [...(d2.actions || [])];

  // Mine actions from raw descriptions
  for (const key of ACTION_KEYS) {
    const synonymList = SYNONYMS[key] || [];
    if (d1.rawDescription) {
      const text = d1.rawDescription.toLowerCase();
      if ((synonymList.some(s => text.includes(s)) || text.includes(key)) && !actions1.includes(key)) {
        actions1.push(key);
      }
    }
    if (d2.rawDescription) {
      const text = d2.rawDescription.toLowerCase();
      if ((synonymList.some(s => text.includes(s)) || text.includes(key)) && !actions2.includes(key)) {
        actions2.push(key);
      }
    }
  }

  if (actions1.length === 0 || actions2.length === 0) {
    return { score: 0, reasons, detail: {} };
  }

  const overlap = findSemanticOverlap(actions1, actions2);
  for (const pair of overlap.pairs) {
    if (pair.rarity >= 3) {
      score += pair.rarity * 0.9;
      reasons.push(`shared action: "${pair.canonical}"`);
    }
  }

  score = Math.min(score, 12);
  return { score, reasons, detail: {} };
}

function scoreSymbols(d1, d2) {
  const reasons = [];
  let score = 0;

  const symbols1 = d1.symbols || [];
  const symbols2 = d2.symbols || [];

  if (symbols1.length === 0 || symbols2.length === 0) {
    return { score: 0, reasons, detail: {} };
  }

  for (const s1 of symbols1) {
    for (const s2 of symbols2) {
      const l1 = s1.toLowerCase().trim();
      const l2 = s2.toLowerCase().trim();
      if (l1 === l2 || l1.includes(l2) || l2.includes(l1)) {
        score += getRarity(l1) * 2;
        reasons.push(`shared symbol: "${s1}"`);
        break;
      }
    }
  }

  score = Math.min(score, 15);
  return { score, reasons, detail: {} };
}

function scoreStructure(d1, d2) {
  if (!d1.structuralType || !d2.structuralType) {
    return { score: 0, reasons: [], detail: {} };
  }
  if (d1.structuralType === d2.structuralType) {
    return {
      score: 4,
      reasons: [`shared dream structure: "${d1.structuralType}"`],
      detail: {},
    };
  }
  return { score: 0, reasons: [], detail: {} };
}

function scoreEmotionalTone(d1, d2) {
  if (!d1.emotionalTone || !d2.emotionalTone) {
    return { score: 0, reasons: [], detail: {} };
  }
  if (d1.emotionalTone === d2.emotionalTone) {
    const rareEmotions = ['dread', 'terror', 'melancholy', 'urgency'];
    const bonus = rareEmotions.includes(d1.emotionalTone) ? 4 : 2;
    return {
      score: bonus,
      reasons: [`shared emotional tone: "${d1.emotionalTone}"`],
      detail: {},
    };
  }
  return { score: 0, reasons: [], detail: {} };
}

function scoreRawDescriptions(d1, d2) {
  const reasons = [];
  let score = 0;

  if (!d1.rawDescription || !d2.rawDescription) {
    return { score: 0, reasons, detail: {} };
  }

  const tokens1 = tokenize(d1.rawDescription).map(canonicalize);
  const tokens2 = tokenize(d2.rawDescription).map(canonicalize);
  const set2 = new Set(tokens2);
  const seen = new Set();

  for (const t of tokens1) {
    if (set2.has(t) && !seen.has(t)) {
      const r = getRarity(t);
      if (r >= 4) {
        score += r * 0.4;
        seen.add(t);
      }
    }
  }

  score = Math.min(score, 8);
  return { score, reasons, detail: {} };
}

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------

export function computeSimilarity(dream1, dream2) {
  const phases = [
    scoreAnchors(dream1, dream2),
    scoreEnvironments(dream1, dream2),
    scoreFigures(dream1, dream2),
    scoreActions(dream1, dream2),
    scoreSymbols(dream1, dream2),
    scoreStructure(dream1, dream2),
    scoreEmotionalTone(dream1, dream2),
    scoreRawDescriptions(dream1, dream2),
  ];

  const phaseNames = ['anchors','environments','figures','actions','symbols','structure','emotion','description'];

  const breakdown = {};
  let totalScore = 0;
  const allReasons = [];
  let totalOverlap = 0;

  phases.forEach((phase, i) => {
    breakdown[phaseNames[i]] = Math.round(phase.score * 10) / 10;
    totalScore += phase.score;
    allReasons.push(...phase.reasons);
    if (phase.score > 0) totalOverlap++;
  });

  totalScore = Math.min(totalScore, 100);
  totalScore = Math.round(totalScore * 10) / 10;

  const anchorPhase = phases[0];
  const anchorRaritySum = anchorPhase.detail?.anchorPairs?.reduce((s, p) => s + p.rarity, 0) ?? 0;
  const eeriness = Math.min(anchorRaritySum / 30, 1);

  return {
    score: totalScore,
    breakdown,
    reasons: allReasons,
    eeriness: Math.round(eeriness * 100) / 100,
    totalOverlap,
    isSignificant: totalScore >= 12 && totalOverlap >= 2,
  };
}

export function primaryMatchReason(similarity) {
  const { reasons } = similarity;
  if (!reasons || reasons.length === 0) return 'Overlapping dream patterns';

  const anchorReason = reasons.find(r => r.startsWith('shared anchor'));
  if (anchorReason) return anchorReason.replace('shared anchor: ', '');

  const envReason = reasons.find(r => r.startsWith('shared environment'));
  if (envReason) return envReason.replace('shared environment: ', '');

  const symReason = reasons.find(r => r.startsWith('shared symbol'));
  if (symReason) return symReason.replace('shared symbol: ', '');

  return reasons[0];
}