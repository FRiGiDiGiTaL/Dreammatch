import { useEffect, useMemo, useState } from "react";
import { loadLS, saveLS, uid, textToHashHex, sleep } from "./utils/localStorageHelpers.js";
import { computeSimilarity } from "./utils/matchAlgorithm.js";

import LandingPage from "./components/LandingPage.jsx";
import AuthCard    from "./components/AuthCard.jsx";
import Dashboard   from "./components/Dashboard.jsx";
import SubmitDream from "./components/SubmitDream.jsx";
import Journal     from "./components/Journal.jsx";
import Profile     from "./components/Profile.jsx";
import MoonLogo    from "./components/ui/MoonLogo.jsx";
import NavBtn      from "./components/ui/NavBtn.jsx";

export default function DreamMatchApp() {
  const [users,   setUsers]   = useState(() => loadLS("dm_users",   []));
  const [dreams,  setDreams]  = useState(() => loadLS("dm_dreams",  []));
  const [matches, setMatches] = useState(() => loadLS("dm_matches", []));
  const [session, setSession] = useState(() => loadLS("dm_session", null));
  const [route,   setRoute]   = useState(() => {
    const s = loadLS("dm_session", null);
    return s ? "dashboard" : "landing";
  });

  const currentUser = useMemo(
    () => users.find(u => u.id === session?.userId) || null,
    [users, session]
  );

  useEffect(() => { saveLS("dm_users",   users);   }, [users]);
  useEffect(() => { saveLS("dm_dreams",  dreams);  }, [dreams]);
  useEffect(() => { saveLS("dm_matches", matches); }, [matches]);
  useEffect(() => { saveLS("dm_session", session); }, [session]);

  // ---- AUTH ----------------------------------------------------------------

  const handleRegister = async (username, password) => {
    username = username.trim();
    if (!username || !password) throw new Error("Username and password are required.");
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase()))
      throw new Error("That username is already taken.");
    const passwordHash = await textToHashHex(password);
    const user = {
      id: uid(),
      username,
      passwordHash,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };
    setUsers(prev => [...prev, user]);
    setSession({ userId: user.id });
    setRoute("dashboard");
  };

  const handleLogin = async (username, password) => {
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) throw new Error("Invalid credentials.");
    const hash = await textToHashHex(password);
    if (hash !== user.passwordHash) throw new Error("Invalid credentials.");
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastLogin: Date.now() } : u));
    setSession({ userId: user.id });
    setRoute("dashboard");
  };

  const handleLogout = () => {
    setSession(null);
    setRoute("landing");
  };

  // ---- DREAM SUBMISSION ----------------------------------------------------

  const addDream = async (payload) => {
    const dream = {
      id:        uid(),
      userId:    currentUser.id,
      createdAt: Date.now(),
      ...payload,
    };
    setDreams(prev => [dream, ...prev]);
    await sleep(300);
    createMatchesFor(dream);
    setRoute("dashboard");
  };

  const createMatchesFor = (newDream) => {
    if (!newDream.isPublic) return;
    const newMatches = [];
    dreams
      .filter(d => d.id !== newDream.id && d.userId !== newDream.userId && d.isPublic)
      .forEach(other => {
        const sim = computeSimilarity(newDream, other);
        if (sim.isSignificant) {
          newMatches.push({
            id:                uid(),
            dreamId:           other.id,
            ownerId:           newDream.userId,
            matchedWithUserId: other.userId,
            score:             sim.score,
            breakdown:         sim.breakdown,
            reasons:           sim.reasons,
            eeriness:          sim.eeriness,
            totalOverlap:      sim.totalOverlap,
            status:            "pending",
            createdAt:         Date.now(),
          });
        }
      });
    if (newMatches.length > 0) {
      setMatches(prev => [...prev, ...newMatches]);
    }
  };

  const setMatchStatus = (id, status) =>
    setMatches(prev => prev.map(m => m.id === id ? { ...m, status } : m));

  // ---- DERIVED DATA --------------------------------------------------------

  const myDreams  = useMemo(() => dreams.filter(d => d.userId === currentUser?.id),   [dreams,  currentUser]);
  const myMatches = useMemo(() => matches.filter(m => m.ownerId === currentUser?.id), [matches, currentUser]);

  const dreamById = id => dreams.find(d => d.id === id);
  const userById  = id => users.find(u => u.id === id);

  // ---- RENDER --------------------------------------------------------------

  const isLanding = route === "landing";
  const isLogin   = route === "login";

  return (
    <>
      {/* Minimal header on landing and login */}
      {(isLanding || isLogin) && (
        <header className="app-header">
          <div className="app-header__inner">
            <div className="app-header__logo" style={{ cursor: "pointer" }} onClick={() => setRoute("landing")}>
              <MoonLogo />
              <span className="app-header__wordmark">dream<span>match</span></span>
            </div>
            <nav className="app-header__nav">
              {isLanding && <NavBtn onClick={() => setRoute("login")}>Sign in</NavBtn>}
              {isLogin   && <NavBtn onClick={() => setRoute("landing")}>← Back</NavBtn>}
            </nav>
          </div>
        </header>
      )}

      {/* Full header inside app */}
      {!isLanding && !isLogin && (
        <header className="app-header">
          <div className="app-header__inner">
            <div className="app-header__logo" style={{ cursor: "pointer" }} onClick={() => setRoute("dashboard")}>
              <MoonLogo />
              <span className="app-header__wordmark">dream<span>match</span></span>
            </div>
            {currentUser && (
              <nav className="app-header__nav">
                <NavBtn active={route === "dashboard"} onClick={() => setRoute("dashboard")}>Dashboard</NavBtn>
                <NavBtn active={route === "submit"}    onClick={() => setRoute("submit")}>Submit</NavBtn>
                <NavBtn active={route === "journal"}   onClick={() => setRoute("journal")}>Journal</NavBtn>
                <NavBtn active={route === "profile"}   onClick={() => setRoute("profile")}>Profile</NavBtn>
                <NavBtn variant="logout" onClick={handleLogout}>Logout</NavBtn>
              </nav>
            )}
          </div>
        </header>
      )}

      {/* Landing */}
      {isLanding && <LandingPage onEnter={() => setRoute("login")} />}

      {/* Auth */}
      {isLogin && (
        <main className="app-main">
          <AuthCard onLogin={handleLogin} onRegister={handleRegister} />
        </main>
      )}

      {/* App routes */}
      {currentUser && route === "dashboard" && (
        <main className="app-main">
          <Dashboard currentUser={currentUser} myMatches={myMatches} dreamById={dreamById} userById={userById} onSetStatus={setMatchStatus} />
        </main>
      )}
      {currentUser && route === "submit" && (
        <main className="app-main">
          <SubmitDream onSubmit={addDream} />
        </main>
      )}
      {currentUser && route === "journal" && (
        <main className="app-main">
          <Journal dreams={myDreams} />
        </main>
      )}
      {currentUser && route === "profile" && (
        <main className="app-main">
          <Profile user={currentUser} dreams={myDreams} matches={myMatches} onDeleteAccount={handleLogout} />
        </main>
      )}

      {!isLanding && (
        <footer className="app-footer">
          privacy-first · all data stored locally · no tracking
        </footer>
      )}
    </>
  );
}