import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// PARTICLE CANVAS
// Slowly drifting nodes that occasionally connect — the matching system made visual
// ---------------------------------------------------------------------------

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      vx:  (Math.random() - 0.5) * 0.3,
      vy:  (Math.random() - 0.5) * 0.3,
      r:   Math.random() * 1.5 + 0.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        const glow = 0.4 + Math.sin(p.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93,184,255,${glow})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// TYPEWRITER
// ---------------------------------------------------------------------------

function Typewriter({ text, speed = 38, delay = 0, onDone, style, className }) {
  const [displayed, setDisplayed] = useState("");
  const [started,   setStarted]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed, onDone]);

  return (
    <span style={style} className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: "var(--accent-gold)",
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          animation: "blink 1s step-end infinite",
        }} />
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// LIVE MATCH SIMULATION
// Shows two dream fragments being matched in real time
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// LIVE MATCH SIMULATION — 3 scenarios
// ---------------------------------------------------------------------------

const SCENARIOS = [
  {
    label: "Phoenix / corridor",
    dreamA: {
      user: "user_7f2a",
      anchors: ["phoenix", "circular flight pattern"],
      excerpt: "…I was standing at the end of a hallway that kept extending. Then the phoenix appeared, circling above in a pattern I recognized but couldn't name…",
    },
    dreamB: {
      user: "user_3c9e",
      anchors: ["phoenix", "loop"],
      excerpt: "…the corridor stretched further every time I moved. Something was flying above — a burning bird, circling. It kept looping. I woke up before it stopped…",
    },
    sequence: [
      { delay: 400,  action: "scan",    label: "Scanning dream A…" },
      { delay: 900,  action: "scan",    label: "Scanning dream B…" },
      { delay: 1500, action: "anchor",  label: "Anchor detected: \"phoenix\"", terms: ["phoenix", "burning bird"] },
      { delay: 2200, action: "anchor",  label: "Anchor detected: \"circular flight pattern\" ↔ \"loop\"", terms: ["circling", "looping"] },
      { delay: 3000, action: "env",     label: "Environment match: \"corridor with no end\"" },
      { delay: 3700, action: "emotion", label: "Emotional tone: dread ↔ dread" },
      { delay: 4400, action: "score",   label: "Computing improbability…", score: 81 },
      { delay: 5200, action: "done",    label: "Match confirmed — score 81" },
    ],
  },
  {
    label: "Number 333",
    dreamA: {
      user: "user_c12b",
      anchors: ["333", "mirror"],
      excerpt: "…the number 333 was written on every door. I looked in the mirror and my reflection was already gone. The number kept appearing on the walls, the floor…",
    },
    dreamB: {
      user: "user_88af",
      anchors: ["333", "reflection missing"],
      excerpt: "…I kept seeing 333 everywhere — on clocks, signs, my own hands. When I tried to look at myself in the bathroom mirror there was nothing there. Just the number again…",
    },
    sequence: [
      { delay: 400,  action: "scan",    label: "Scanning dream A…" },
      { delay: 900,  action: "scan",    label: "Scanning dream B…" },
      { delay: 1500, action: "anchor",  label: "Anchor detected: \"333\"", terms: ["333"] },
      { delay: 2300, action: "anchor",  label: "Anchor detected: \"mirror\" ↔ \"reflection missing\"", terms: ["mirror", "nothing there"] },
      { delay: 3100, action: "symbol",  label: "Symbol match: recurring number sequence" },
      { delay: 3900, action: "emotion", label: "Emotional tone: confusion ↔ confusion" },
      { delay: 4600, action: "score",   label: "Computing improbability…", score: 94 },
      { delay: 5400, action: "done",    label: "Match confirmed — score 94" },
    ],
  },
  {
    label: "The teeth / void",
    dreamA: {
      user: "user_44d1",
      anchors: ["teeth falling out", "void"],
      excerpt: "…I was standing at the edge of something that had no bottom. My teeth started loosening one by one. I tried to speak but couldn't. The void just kept expanding beneath me…",
    },
    dreamB: {
      user: "user_f90c",
      anchors: ["teeth crumbling", "infinite darkness below"],
      excerpt: "…I felt my teeth go loose and start to fall. Below me was just darkness — no floor, no end to it. I was completely alone. The silence was the worst part…",
    },
    sequence: [
      { delay: 400,  action: "scan",    label: "Scanning dream A…" },
      { delay: 900,  action: "scan",    label: "Scanning dream B…" },
      { delay: 1500, action: "anchor",  label: "Anchor detected: \"teeth falling out\" ↔ \"teeth crumbling\"", terms: ["teeth"] },
      { delay: 2400, action: "anchor",  label: "Anchor detected: \"void\" ↔ \"infinite darkness\"", terms: ["void", "darkness"] },
      { delay: 3200, action: "env",     label: "Environment match: boundless dark space" },
      { delay: 3900, action: "emotion", label: "Emotional tone: terror ↔ terror" },
      { delay: 4600, action: "score",   label: "Computing improbability…", score: 78 },
      { delay: 5400, action: "done",    label: "Match confirmed — score 78" },
    ],
  },
];

function MatchSimulator() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [step,           setStep]           = useState(-1);
  const [running,        setRunning]        = useState(false);
  const [scoreVal,       setScoreVal]       = useState(0);
  const [highlights,     setHighlights]     = useState([]);
  const timeoutsRef = useRef([]);

  const scenario = SCENARIOS[activeScenario];

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const switchScenario = (i) => {
    if (running) {
      clearAllTimeouts();
      setRunning(false);
    }
    setActiveScenario(i);
    setStep(-1);
    setScoreVal(0);
    setHighlights([]);
  };

  const run = () => {
    if (running) return;
    setRunning(true);
    setStep(-1);
    setScoreVal(0);
    setHighlights([]);

    scenario.sequence.forEach(({ delay, action, terms, score: targetScore }, i) => {
      const t = setTimeout(() => {
        setStep(i);
        if ((action === "anchor" || action === "symbol") && terms?.length) {
          setHighlights(h => [...new Set([...h, ...terms])]);
        }
        if (action === "score" && targetScore) {
          let v = 0;
          const tick = setInterval(() => {
            v += 3;
            setScoreVal(Math.min(v, targetScore));
            if (v >= targetScore) clearInterval(tick);
          }, 30);
        }
        if (action === "done") {
          setTimeout(() => setRunning(false), 2000);
        }
      }, delay);
      timeoutsRef.current.push(t);
    });
  };

  const currentStep  = step >= 0 ? scenario.sequence[step] : null;
  const currentLabel = currentStep?.label ?? null;
  const isDone       = currentStep?.action === "done";

  const highlightText = (text, terms) => {
    if (!terms.length) return text;
    let result = text;
    for (const term of terms) {
      try {
        result = result.replace(
          new RegExp(`(${term})`, "gi"),
          `<mark>$1</mark>`
        );
      } catch {}
    }
    return result;
  };

  return (
    <div style={{
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      background: "var(--bg-surface)",
      overflow: "hidden",
    }}>
      {/* Header with scenario tabs */}
      <div style={{
        padding: "0.85rem 1.25rem",
        borderBottom: "1px solid var(--border-dim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        background: "var(--bg-raised)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => switchScenario(i)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                padding: "0.25rem 0.65rem",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${activeScenario === i ? "rgba(201,168,76,0.4)" : "var(--border-dim)"}`,
                background: activeScenario === i ? "var(--accent-gold-dim)" : "transparent",
                color: activeScenario === i ? "var(--accent-gold)" : "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={run}
          disabled={running}
          style={{
            background: running ? "transparent" : "var(--accent-gold-dim)",
            border: `1px solid ${running ? "var(--border-dim)" : "rgba(201,168,76,0.3)"}`,
            borderRadius: "var(--radius-sm)",
            color: running ? "var(--text-muted)" : "var(--accent-gold)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            padding: "0.3rem 0.75rem",
            cursor: running ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {running ? "running…" : isDone ? "run again" : "▶ run"}
        </button>
      </div>

      {/* Dreams side by side */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid var(--border-dim)",
      }}>
        {[scenario.dreamA, scenario.dreamB].map((dream, di) => (
          <div
            key={`${activeScenario}-${di}`}
            style={{
              padding: "1rem 1.25rem",
              borderRight: di === 0 ? "1px solid var(--border-dim)" : "none",
              transition: "background 0.3s",
              background: step >= 0 && !isDone
                ? (di === 0 && step === 0) || (di === 1 && step === 1)
                  ? "rgba(93,184,255,0.04)"
                  : "transparent"
                : "transparent",
            }}
          >
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              marginBottom: "0.6rem",
            }}>
              @{dream.user}
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
              dangerouslySetInnerHTML={{
                __html: highlightText(dream.excerpt, highlights),
              }}
            />
            <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
              {dream.anchors.map((a, i) => {
                const active = highlights.some(h => a.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(a.toLowerCase()));
                return (
                  <span key={i} style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                    background: active ? "var(--accent-gold-dim)" : "rgba(255,255,255,0.04)",
                    color: active ? "var(--accent-gold)" : "var(--text-muted)",
                    border: `1px solid ${active ? "rgba(201,168,76,0.3)" : "var(--border-dim)"}`,
                    transition: "all 0.4s",
                  }}>
                    {a}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div style={{
        padding: "0.85rem 1.25rem",
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: isDone ? "var(--accent-green)" : "var(--text-muted)",
          transition: "color 0.3s",
          flex: 1,
        }}>
          {currentLabel ?? "Select a scenario and press \u25b6 run"}
        </p>
        {scoreVal > 0 && (
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.1rem",
            fontWeight: 500,
            color: isDone ? "var(--accent-green)" : "var(--accent-gold)",
            transition: "color 0.3s",
            minWidth: "40px",
            textAlign: "right",
          }}>
            {scoreVal}
          </div>
        )}
      </div>

      <style>{`
        mark {
          background: rgba(201,168,76,0.25);
          color: var(--accent-gold);
          border-radius: 2px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}


// ---------------------------------------------------------------------------
// SECTION: HOW IT WORKS
// ---------------------------------------------------------------------------

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Write your dream",
      body: "Not just what happened — everything you remember. The setting, the objects, the feeling, the strange details that don't make sense.",
    },
    {
      num: "02",
      title: "We break it down",
      body: "A \"hallway\" isn't one thing. It's distance, lighting, confinement, direction. Your dream is analyzed across layers most people don't consciously separate.",
    },
    {
      num: "03",
      title: "We match patterns, not words",
      body: "Not just shared objects — but shared structures. Sequences. Rare elements. Specific combinations that don't show up twice unless they actually do.",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "1.5rem",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-surface)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span style={{
            position: "absolute",
            top: "1rem",
            right: "1.25rem",
            fontFamily: "var(--font-mono)",
            fontSize: "2rem",
            fontWeight: 500,
            color: "var(--border-subtle)",
            lineHeight: 1,
          }}>
            {s.num}
          </span>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "1.15rem",
            marginBottom: "0.6rem",
            color: "var(--text-primary)",
          }}>
            {s.title}
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION: SPECIFICITY CALLOUT
// ---------------------------------------------------------------------------

function SpecificitySection() {
  const items = [
    { label: "Rare elements",        example: "phoenixes, specific locations, unusual objects" },
    { label: "Repeating numbers",    example: "333, 7, sequences that kept appearing" },
    { label: "Behavioral patterns",  example: "running, watching, searching, looping" },
    { label: "Environmental structure", example: "infinite hallways, abrupt endings, wrong-feeling spaces" },
  ];

  return (
    <div style={{
      border: "1px solid rgba(201,168,76,0.2)",
      borderRadius: "var(--radius-lg)",
      background: "linear-gradient(135deg, var(--bg-surface), rgba(201,168,76,0.03))",
      padding: "2rem",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--accent-gold)",
        marginBottom: "0.75rem",
      }}>
        Not just similar. Specific.
      </p>
      <h3 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 300,
        fontSize: "1.5rem",
        marginBottom: "1.25rem",
        color: "var(--text-primary)",
      }}>
        DreamMatch doesn't rely on vague keyword overlap. It detects:
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: "1rem",
            background: "var(--bg-raised)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-dim)",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--accent-gold)",
              marginBottom: "0.35rem",
              fontWeight: 500,
            }}>
              {item.label}
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {item.example}
            </p>
          </div>
        ))}
      </div>
      <p style={{
        marginTop: "1.25rem",
        fontSize: "0.875rem",
        color: "var(--text-secondary)",
        fontStyle: "italic",
        fontFamily: "var(--font-display)",
        fontSize: "1rem",
      }}>
        Details specific enough that finding them twice should feel impossible.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN LANDING PAGE
// ---------------------------------------------------------------------------

export default function LandingPage({ onEnter }) {
  const [line1Done, setLine1Done] = useState(false);
  const [line2Done, setLine2Done] = useState(false);
  const [showRest,  setShowRest]  = useState(false);

  useEffect(() => {
    if (line2Done) {
      const t = setTimeout(() => setShowRest(true), 300);
      return () => clearTimeout(t);
    }
  }, [line2Done]);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <ParticleCanvas />

      {/* ---- HERO ---- */}
      <section style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "6rem 1.5rem 4rem",
        position: "relative",
        zIndex: 1,
      }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--accent-gold)",
          marginBottom: "1.5rem",
          opacity: 0.8,
        }}>
          Dream pattern matching
        </p>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
          lineHeight: 1.15,
          marginBottom: "1.5rem",
          color: "var(--text-primary)",
        }}>
          <Typewriter
            text="Someone, somewhere,"
            speed={45}
            delay={300}
            onDone={() => setLine1Done(true)}
          />
          {line1Done && (
            <>
              <br />
              <Typewriter
                text="has had your dream."
                speed={45}
                delay={100}
                onDone={() => setLine2Done(true)}
                style={{ color: "var(--accent-gold)" }}
              />
            </>
          )}
        </h1>

        {showRest && (
          <>
            <p style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: "52ch",
              marginBottom: "2.5rem",
              animation: "fadeIn 0.5s ease both",
            }}>
              Describe your dream in detail — and discover people across the world
              who experienced something eerily similar.
            </p>

            <div style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              animation: "fadeIn 0.5s ease 0.1s both",
            }}>
              <button
                onClick={onEnter}
                className="btn btn--primary btn--large"
              >
                Submit your first dream →
              </button>
              <a
                href="#how-it-works"
                className="btn btn--ghost btn--large"
                style={{ textDecoration: "none" }}
              >
                How it works
              </a>
            </div>

            <p style={{
              marginTop: "1.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
              animation: "fadeIn 0.5s ease 0.2s both",
            }}>
              Free · No tracking · All data stored locally
            </p>
          </>
        )}
      </section>

      {/* ---- LIVE MATCH SIMULATION ---- */}
      {showRest && (
        <section style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "0 1.5rem 5rem",
          position: "relative",
          zIndex: 1,
          animation: "fadeIn 0.6s ease 0.3s both",
        }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}>
              See it in action
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "1.6rem",
              color: "var(--text-primary)",
            }}>
              Watch two strangers get matched
            </h2>
          </div>
          <MatchSimulator />
        </section>
      )}

      {/* ---- HOW IT WORKS ---- */}
      {showRest && (
        <section
          id="how-it-works"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "0 1.5rem 5rem",
            position: "relative",
            zIndex: 1,
            animation: "fadeIn 0.6s ease 0.4s both",
          }}
        >
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "0.4rem",
          }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "1.6rem",
            color: "var(--text-primary)",
            marginBottom: "1.5rem",
          }}>
            Three steps to a match
          </h2>
          <HowItWorks />
        </section>
      )}

      {/* ---- SPECIFICITY ---- */}
      {showRest && (
        <section style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "0 1.5rem 5rem",
          position: "relative",
          zIndex: 1,
          animation: "fadeIn 0.6s ease 0.5s both",
        }}>
          <SpecificitySection />
        </section>
      )}

      {/* ---- CLOSING CTA ---- */}
      {showRest && (
        <section style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "0 1.5rem 8rem",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          animation: "fadeIn 0.6s ease 0.6s both",
        }}>
          <div style={{
            padding: "3rem 2rem",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-xl)",
            background: "var(--bg-surface)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              marginBottom: "0.75rem",
              color: "var(--text-primary)",
            }}>
              Start exploring
            </h2>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              marginBottom: "2rem",
              fontStyle: "italic",
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
            }}>
              Some matches are loose. Others shouldn't exist at all.
            </p>
            <button onClick={onEnter} className="btn btn--primary btn--large">
              Submit your first dream →
            </button>
          </div>
        </section>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}