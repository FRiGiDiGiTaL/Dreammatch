import React, { useState } from "react";

export default function SubmitDream({ onSubmit }) {
  const [timeOfWaking, setTimeOfWaking] = useState("");
  const [isRecurring, setIsRecurring] = useState("no");
  const [recurringFrequency, setRecurringFrequency] = useState("");
  const [places, setPlaces] = useState([""]);
  const [names, setNames] = useState([""]);
  const [animals, setAnimals] = useState([""]);
  const [dreamType, setDreamType] = useState("neutral");
  const [keywords, setKeywords] = useState([""]);
  const [fullDescription, setFullDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addField = (state, setState) => {
    setState([...state, ""]);
  };

  const removeField = (index, state, setState) => {
    setState(state.filter((_, i) => i !== index));
  };

  const updateField = (index, value, state, setState) => {
    const updated = [...state];
    updated[index] = value;
    setState(updated);
  };

  const validateForm = () => {
    if (!fullDescription.trim()) {
      throw new Error("Please enter your full dream description");
    }
    if (keywords.filter(k => k.trim()).length === 0) {
      throw new Error("Please add at least one keyword");
    }
    if (!timeOfWaking) {
      throw new Error("Please enter time of waking");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      validateForm();

      const payload = {
        timeOfWaking,
        isRecurring: isRecurring === "yes",
        recurringFrequency: isRecurring === "yes" ? recurringFrequency : null,
        places: places.filter(p => p.trim()),
        names: names.filter(n => n.trim()),
        animals: animals.filter(a => a.trim()),
        dreamType,
        keywords: keywords.filter(k => k.trim()).map(k => k.toLowerCase().trim()),
        fullDescription: fullDescription.trim(),
        isPublic,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900/40 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Submit Your Dream</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Time of Waking */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              What time did you wake up?
            </label>
            <input
              type="time"
              value={timeOfWaking}
              onChange={(e) => setTimeOfWaking(e.target.value)}
              className="w-full px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100"
            />
          </div>

          {/* Recurring Dream */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Is this a recurring dream?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  value="no"
                  checked={isRecurring === "no"}
                  onChange={(e) => setIsRecurring(e.target.value)}
                  className="w-4 h-4"
                />
                <span>No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  value="yes"
                  checked={isRecurring === "yes"}
                  onChange={(e) => setIsRecurring(e.target.value)}
                  className="w-4 h-4"
                />
                <span>Yes</span>
              </label>
            </div>
            {isRecurring === "yes" && (
              <input
                type="text"
                placeholder="e.g., weekly, daily, monthly"
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value)}
                className="mt-3 w-full px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100 placeholder-slate-400"
              />
            )}
          </div>

          {/* Places */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Specific Places (locations in your dream)
            </label>
            <div className="space-y-2">
              {places.map((place, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., inside a house, lake, underground, city street"
                    value={place}
                    onChange={(e) => updateField(i, e.target.value, places, setPlaces)}
                    className="flex-1 px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100 placeholder-slate-400"
                  />
                  {places.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i, places, setPlaces)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(places, setPlaces)}
                className="mt-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-medium"
              >
                + Add Place
              </button>
            </div>
          </div>

          {/* Names */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Names (people/characters in your dream)
            </label>
            <div className="space-y-2">
              {names.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., John, my mother, a stranger"
                    value={name}
                    onChange={(e) => updateField(i, e.target.value, names, setNames)}
                    className="flex-1 px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100 placeholder-slate-400"
                  />
                  {names.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i, names, setNames)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(names, setNames)}
                className="mt-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-medium"
              >
                + Add Name
              </button>
            </div>
          </div>

          {/* Animals */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Animals (creatures in your dream)
            </label>
            <div className="space-y-2">
              {animals.map((animal, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., dog, bird, dragon"
                    value={animal}
                    onChange={(e) => updateField(i, e.target.value, animals, setAnimals)}
                    className="flex-1 px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100 placeholder-slate-400"
                  />
                  {animals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i, animals, setAnimals)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(animals, setAnimals)}
                className="mt-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-medium"
              >
                + Add Animal
              </button>
            </div>
          </div>

          {/* Dream Type */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              How would you describe this dream?
            </label>
            <select
              value={dreamType}
              onChange={(e) => setDreamType(e.target.value)}
              className="w-full px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100"
            >
              <option value="neutral">Neutral</option>
              <option value="good">Good / Positive</option>
              <option value="nightmare">Nightmare / Scary</option>
              <option value="surreal">Surreal / Weird</option>
              <option value="lucid">Lucid</option>
              <option value="prophetic">Prophetic / Meaningful</option>
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Keywords (heavily used for matching)
            </label>
            <div className="space-y-2">
              {keywords.map((keyword, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., flying, water, family, chase"
                    value={keyword}
                    onChange={(e) => updateField(i, e.target.value, keywords, setKeywords)}
                    className="flex-1 px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100 placeholder-slate-400"
                  />
                  {keywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i, keywords, setKeywords)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(keywords, setKeywords)}
                className="mt-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-medium"
              >
                + Add Keyword
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Tell us everything about your dream
            </label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Describe the entire dream experience in detail..."
              rows={6}
              className="w-full px-3 py-2 bg-indigo-900/30 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 text-slate-100 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm text-white">
              Make this dream public so it can be matched with others
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-lg font-semibold transition text-white"
          >
            {loading ? "Processing..." : "Submit Dream & Find Matches"}
          </button>
        </div>
      </div>
    </div>
  );
}