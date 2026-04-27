import { useState } from "react";
import { EMOTIONAL_TONES, STRUCTURAL_PATTERNS } from "../utils/dreamFeatures.js";

// ---------------------------------------------------------------------------
// SHARED SUB-COMPONENTS
// ---------------------------------------------------------------------------

function MultiInput({ values, onChange, placeholder, variant = "default" }) {
  const update = (i, val) => {
    const next = [...values];
    next[i] = val;
    onChange(next);
  };
  const add    = () => onChange([...values, ""]);
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div className="multi-input">
      {values.map((v, i) => (
        <div key={i} className="multi-input__row">
          <input
            type="text"
            className={`input${variant === "anchor" ? " input--anchor" : ""}`}
            placeholder={placeholder}
            value={v}
            onChange={(e) => update(i, e.target.value)}
          />
          {values.length > 1 && (
            <button type="button" className="btn-remove" onClick={() => remove(i)}>
              ×
            </button>
          )}
        </div>
      ))}
      <button type="button" className="btn-add" onClick={add}>
        + add another
      </button>
    </div>
  );
}

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flex: i < totalSteps - 1 ? "1" : "0",
          }}
        >
          <div
            className={`step-dot${
              i < currentStep
                ? " step-dot--done"
                : i === currentStep
                ? " step-dot--active"
                : ""
            }`}
          />
          {i < totalSteps - 1 && <div className="step-line" />}
        </div>
      ))}
      <span className="step-number" style={{ marginLeft: "0.75rem" }}>
        {currentStep + 1} / {totalSteps}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STEPS
// ---------------------------------------------------------------------------

function StepDescribe({ data, update }) {
  return (
    <div className="stack stack--lg animate-in">
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.7rem", marginBottom: "0.4rem" }}>
          Tell us everything
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Write freely. Include the strange details, the things you can't explain,
          the parts that felt wrong. The more specific you are, the better the match.
        </p>
      </div>

      <div className="field">
        <label className="field-label">Full dream description</label>
        <textarea
          className="textarea"
          placeholder="I was in a place that felt like my childhood home, but the hallway kept going and going and never ended..."
          rows={8}
          value={data.rawDescription}
          onChange={(e) => update("rawDescription", e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">Is this a recurring dream?</label>
        <div className="radio-group">
          {["no", "yes"].map((opt) => (
            <label key={opt} className="radio-option">
              <input
                type="radio"
                name="recurring"
                value={opt}
                checked={data.isRecurring === (opt === "yes")}
                onChange={() => update("isRecurring", opt === "yes")}
              />
              {opt}
            </label>
          ))}
        </div>
        {data.isRecurring && (
          <input
            type="text"
            className="input"
            placeholder="How often, and for how long? e.g. monthly for 3 years"
            style={{ marginTop: "0.5rem" }}
            value={data.recurringNote}
            onChange={(e) => update("recurringNote", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

function StepEnvironments({ data, update }) {
  return (
    <div className="stack stack--lg animate-in">
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.7rem", marginBottom: "0.4rem" }}>
          Where were you?
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          A hallway isn't just a hallway. Was it long? Dark? Did it end abruptly or go on forever?
          Did it feel familiar — like somewhere you knew — or completely wrong?
          Describe each space with as much detail as you can.
        </p>
      </div>

      <div className="field">
        <label className="field-label">Environments</label>
        <p className="field-hint">Each entry is one place. Include its qualities.</p>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.environments}
            onChange={(v) => update("environments", v)}
            placeholder="e.g. a long dark hallway that ended without warning"
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Notable objects</label>
        <p className="field-hint">Things you noticed or that felt significant.</p>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.objects}
            onChange={(v) => update("objects", v)}
            placeholder="e.g. a red door, a clock with no hands"
          />
        </div>
      </div>
    </div>
  );
}

function StepInhabitants({ data, update }) {
  return (
    <div className="stack stack--lg animate-in">
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.7rem", marginBottom: "0.4rem" }}>
          Who was there?
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          People, creatures, presences. Were they familiar? What was their posture, their intent?
          A "stranger" means something different than "a tall figure that wouldn't turn around."
        </p>
      </div>

      <div className="field">
        <label className="field-label">Figures & people</label>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.figures}
            onChange={(v) => update("figures", v)}
            placeholder="e.g. a shadow figure watching from the end of the hall"
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Creatures & animals</label>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.animals}
            onChange={(v) => update("animals", v)}
            placeholder="e.g. a large black bird that didn't move"
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Actions & sequences</label>
        <p className="field-hint">What were you doing? What happened?</p>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.actions}
            onChange={(v) => update("actions", v)}
            placeholder="e.g. searching for something I couldn't name"
          />
        </div>
      </div>
    </div>
  );
}

function StepAnchors({ data, update }) {
  return (
    <div className="stack stack--lg animate-in">
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.7rem", marginBottom: "0.4rem" }}>
          Rare elements
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Was there anything that felt impossible to have invented?
          A specific number. A creature that shouldn't exist. A door in the wrong place.
          These are your anchors — the details specific enough that finding them twice shouldn't be possible.
        </p>
      </div>

      <div className="anchor-callout">
        <strong>Anchors carry the most weight in matching.</strong> A phoenix. The number 333.
        A mirror that showed something wrong. If it felt like it couldn't be coincidence, it belongs here.
      </div>

      <div className="field">
        <label className="field-label field-label--gold">Anchors — rare, specific elements</label>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.anchors}
            onChange={(v) => update("anchors", v)}
            placeholder="e.g. phoenix, the number 333, a door that opened onto nothing"
            variant="anchor"
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Symbols, numbers, words</label>
        <p className="field-hint">Specific numbers you saw, words on signs, recurring symbols.</p>
        <div style={{ marginTop: "0.5rem" }}>
          <MultiInput
            values={data.symbols}
            onChange={(v) => update("symbols", v)}
            placeholder="e.g. 7, a word I couldn't read, a triangle"
          />
        </div>
      </div>
    </div>
  );
}

function StepStructure({ data, update }) {
  return (
    <div className="stack stack--lg animate-in">
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.7rem", marginBottom: "0.4rem" }}>
          Shape & tone
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Every dream has an underlying shape. Was it a chase? Did it loop?
          Were you searching for something, or watching something unfold?
        </p>
      </div>

      <div className="field">
        <label className="field-label">Dream structure</label>
        <select
          className="select"
          value={data.structuralType}
          onChange={(e) => update("structuralType", e.target.value)}
        >
          <option value="">— choose the closest —</option>
          {STRUCTURAL_PATTERNS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Emotional tone</label>
        <select
          className="select"
          value={data.emotionalTone}
          onChange={(e) => update("emotionalTone", e.target.value)}
        >
          <option value="">— what did it feel like? —</option>
          {EMOTIONAL_TONES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Visibility</label>
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={data.isPublic}
            onChange={(e) => update("isPublic", e.target.checked)}
          />
          Make this dream public so it can be matched with others
        </label>
        <p className="field-hint" style={{ marginTop: "0.35rem" }}>
          Private dreams are stored in your journal but never matched.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 5;

const EMPTY = {
  rawDescription: "",
  isRecurring:    false,
  recurringNote:  "",
  environments:   [""],
  objects:        [""],
  figures:        [""],
  animals:        [""],
  actions:        [""],
  anchors:        [""],
  symbols:        [""],
  emotionalTone:  "",
  structuralType: "",
  isPublic:       true,
};

export default function SubmitDream({ onSubmit }) {
  const [step, setStep]       = useState(0);
  const [data, setData]       = useState(EMPTY);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const clean  = (arr) => arr.filter((s) => s.trim());

  const validate = () => {
    if (!data.rawDescription.trim())
      throw new Error("Please describe your dream in step 1.");
    if (clean(data.environments).length === 0)
      throw new Error("Please describe at least one environment in step 2.");
  };

  const handleNext = () => {
    setError("");
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      validate();
      const payload = {
        rawDescription: data.rawDescription.trim(),
        isRecurring:    data.isRecurring,
        recurringNote:  data.recurringNote.trim(),
        environments:   clean(data.environments),
        objects:        clean(data.objects),
        figures:        clean(data.figures),
        animals:        clean(data.animals),
        actions:        clean(data.actions),
        anchors:        clean(data.anchors),
        symbols:        clean(data.symbols),
        emotionalTone:  data.emotionalTone,
        structuralType: data.structuralType,
        isPublic:       data.isPublic,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <StepDescribe     data={data} update={update} />,
    <StepEnvironments data={data} update={update} />,
    <StepInhabitants  data={data} update={update} />,
    <StepAnchors      data={data} update={update} />,
    <StepStructure    data={data} update={update} />,
  ];

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div className="stack stack--lg">
      <div className="card card--raised" style={{ padding: "1.75rem" }}>
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        {steps[step]}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={handleBack}
          className="btn btn--ghost"
          style={{ visibility: step === 0 ? "hidden" : "visible" }}
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="btn btn--primary"
          style={{ minWidth: "160px" }}
        >
          {loading ? "Processing…" : isLast ? "Submit dream" : "Continue →"}
        </button>
      </div>
    </div>
  );
}