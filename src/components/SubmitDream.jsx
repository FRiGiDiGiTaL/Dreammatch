import { useState } from "react";
import Card from "./ui/Card";
import Tag from "./ui/Tag";

export default function SubmitDream({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim() || !description.trim()) {
        throw new Error("Title and description are required");
      }
      await onSubmit({ title, description, tags, isPublic });
      setTitle("");
      setDescription("");
      setTags([]);
      setTagInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Submit Your Dream</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2">Dream Title</label>
          <input
            type="text"
            placeholder="e.g., Flying Over Mountains"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2">Description</label>
          <textarea
            placeholder="Describe your dream in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2">Add Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g., adventure, flying, nature"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              disabled={loading}
            />
            <button type="button" onClick={addTag} className="btn-secondary" disabled={loading}>
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Tag key={i} onRemove={() => removeTag(i)}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={loading}
            className="w-4 h-4"
          />
          <label htmlFor="isPublic" className="text-sm font-semibold">
            Make this dream public (visible to others for matching)
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%" }}>
          {loading ? "Submitting..." : "Submit Dream"}
        </button>
      </form>
    </Card>
  );
}