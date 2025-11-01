import React, { useEffect, useMemo, useState } from "react";
import { textToHashHex, loadLS, saveLS, uid, sleep } from "./utils/localStorageHelpers";
import { computeSimilarity } from "./utils/matchAlgorithm";

import AuthCard from "./components/AuthCard";
import Dashboard from "./components/Dashboard";
import SubmitDream from "./components/SubmitDream";
import Journal from "./components/Journal";
import Profile from "./components/Profile";
import NavBtn from "./components/ui/NavBtn";
import MoonLogo from "./components/ui/MoonLogo";
import Card from "./components/ui/Card";
import Badge from "./components/ui/Badge";

export default function DreamMatchApp() {
  const [users, setUsers] = useState(loadLS("dm_users", []));
  const [dreams, setDreams] = useState(loadLS("dm_dreams", []));
  const [matches, setMatches] = useState(loadLS("dm_matches", []));
  const [session, setSession] = useState(loadLS("dm_session", null));
  const [route, setRoute] = useState(session ? "dashboard" : "login");

  const currentUser = useMemo(() => users.find(u => u.id === session?.userId) || null, [users, session]);

  useEffect(() => { saveLS("dm_users", users); }, [users]);
  useEffect(() => { saveLS("dm_dreams", dreams); }, [dreams]);
  useEffect(() => { saveLS("dm_matches", matches); }, [matches]);
  useEffect(() => { saveLS("dm_session", session); }, [session]);

  const handleRegister = async (username, password) => {
    username = username.trim();
    if (!username || !password) throw new Error("Missing fields");
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase()))
      throw new Error("Username already exists");
    const passwordHash = await textToHashHex(password);
    const user = { id: uid(), username, passwordHash, createdAt: Date.now(), lastLogin: Date.now() };
    setUsers([...users, user]);
    setSession({ userId: user.id });
    setRoute("dashboard");
  };

  const handleLogin = async (username, password) => {
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) throw new Error("Invalid credentials");
    const hash = await textToHashHex(password);
    if (hash !== user.passwordHash) throw new Error("Invalid credentials");
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastLogin: Date.now() } : u));
    setSession({ userId: user.id });
    setRoute("dashboard");
  };

  const handleLogout = () => { setSession(null); setRoute("login"); };

  const addDream = async (payload) => {
    const dream = { id: uid(), userId: currentUser.id, createdAt: Date.now(), ...payload };
    setDreams(prev => [dream, ...prev]);
    await sleep(300);
    createMatchesFor(dream);
    setRoute("dashboard");
  };

  const createMatchesFor = (newDream) => {
    const myId = newDream.userId;
    const newMatches = [];
    dreams.filter(d => d.id !== newDream.id && d.userId !== myId && d.isPublic)
      .forEach(other => {
        const sim = computeSimilarity(newDream, other);
        if (sim.totalOverlap >= 2 && sim.score > 0)
          newMatches.push({ id: uid(), dreamId: other.id, ownerId: myId, matchedWithUserId: other.userId, score: sim.score, status: "pending", createdAt: Date.now() });
      });
    setMatches(prev => [...prev, ...newMatches]);
  };

  const setMatchStatus = (id, status) =>
    setMatches(prev => prev.map(m => m.id === id ? { ...m, status } : m));

  const myDreams = useMemo(() => dreams.filter(d => d.userId === currentUser?.id), [dreams, currentUser]);
  const myMatches = useMemo(() => matches.filter(m => m.ownerId === currentUser?.id), [matches, currentUser]);
  const dreamById = id => dreams.find(d => d.id === id);
  const userById = id => users.find(u => u.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-900 text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur bg-indigo-950/70 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <MoonLogo />
          <h1 className="text-lg font-semibold tracking-wide">DreamMatch</h1>
          {currentUser &&
            <nav className="ml-auto flex gap-1">
              <NavBtn active={route === "dashboard"} onClick={() => setRoute("dashboard")}>Dashboard</NavBtn>
              <NavBtn active={route === "submit"} onClick={() => setRoute("submit")}>Submit</NavBtn>
              <NavBtn active={route === "journal"} onClick={() => setRoute("journal")}>Journal</NavBtn>
              <NavBtn active={route === "profile"} onClick={() => setRoute("profile")}>Profile</NavBtn>
              <button onClick={handleLogout} className="ml-2 px-3 py-1.5 rounded-xl bg-slate-100/10 hover:bg-slate-100/20 border border-white/10">Logout</button>
            </nav>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!currentUser && route === "login" && <AuthCard onLogin={handleLogin} onRegister={handleRegister} />}
        {currentUser && route === "dashboard" && <Dashboard currentUser={currentUser} myMatches={myMatches} dreamById={dreamById} userById={userById} onSetStatus={setMatchStatus} />}
        {currentUser && route === "submit" && <SubmitDream onSubmit={addDream} />}
        {currentUser && route === "journal" && <Journal dreams={myDreams} />}
        {currentUser && route === "profile" && <Profile user={currentUser} dreams={myDreams} matches={myMatches} onDeleteAccount={() => { setSession(null); setRoute("login"); }} />}
      </main>

      <footer className="pb-8 pt-2 text-center text-xs text-slate-300/70">
        <p>Privacy-first demo. No tracking. Data stored locally.</p>
      </footer>
    </div>
  );
}
