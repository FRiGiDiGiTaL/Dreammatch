import Card from "./ui/Card";
import Badge from "./ui/Badge";

export default function Profile({ user, dreams, matches, onDeleteAccount }) {
  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This will erase all local data.")) {
      localStorage.clear();
      onDeleteAccount();
    }
  };

  return (
    <Card className="p-5">
      <h2 className="text-xl font-semibold tracking-wide mb-4">Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p className="text-sm text-slate-500 mb-3">
        Member since {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <div className="flex flex-wrap gap-3 mb-4">
        <Badge>{dreams.length} dreams</Badge>
        <Badge>{matches.length} matches</Badge>
      </div>
      <button
        onClick={confirmDelete}
        className="rounded-xl bg-rose-600 text-white px-4 py-2 hover:bg-rose-700"
      >
        Delete account
      </button>
    </Card>
  );
}
