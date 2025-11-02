// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import votersData from "./data/voters.json";
import bannerUrl from "./assets/banner.jpeg";
import resultPhoto from "./assets/mama.jpeg";

// Decorative inlined tile background (kept as data URL)
const tileBgDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAd0AAADdCAIAAABxKD+NAAAQAElEQVR4AeydB3wUVdn/3e+e9+zsy5t3Z2b2d2d2Zl3Znd2bZ2d2bZ2d2bZ2d2bZ2d2bZ2d2bYt2kqkqS5KpUKhQqVKoUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSr6r8w3/8wAABgH/8wAAHHcD4x0mAABgC9v9bWz+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // debounce search
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      const q = query.trim();
      if (!q) {
        setResults([]);
        return;
      }

      const qLower = q.toLocaleLowerCase();

      const filtered = votersData.filter((voter) => {
        const ne = (voter.name_english || "").toLocaleLowerCase();
        const nm = (voter.name_marathi || "").toLocaleLowerCase();
        const re = (voter.relative_name_english || "").toLocaleLowerCase();
        const rm = (voter.relative_name_marathi || "").toLocaleLowerCase();
        const id = (voter.voter_id || "").toLocaleLowerCase();

        const matchMarathi = nm.includes(qLower) || rm.includes(qLower);
        const matchEnglish =
          ne.includes(qLower) || re.includes(qLower) || id.includes(qLower);

        return matchMarathi || matchEnglish;
      });

      setResults(filtered);
    }, 160);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    // safe focus without TypeScript casts
    document.getElementById("voter-search-input")?.focus();
  };

  const nagarsevakMarathi = "श्री. बापू तुकराम महाजन";

  return (
    <div
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, Roboto, Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f8fafc 0%, #f1f5f9 100%)",
        color: "#0f172a",
        paddingBottom: 40,
      }}
    >
      <style>{`
        :root{
          --surface:#ffffff;
          --muted:#94a3b8;
          --accent:#0b57d0;
          --soft:#eef2ff;
          --card-shadow: 0 12px 36px rgba(2,6,23,0.06);
        }
        .site-shell { max-width:1200px; margin:0 auto; padding:28px 20px; }
        header{ display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px }
        .brand { display:flex; gap:12px; align-items:center }
        .brand h1{ margin:0; font-size:20px; color:var(--accent) }
        nav a{ color:var(--muted); text-decoration:none; margin-left:12px; font-size:14px }

        .hero{ width:100%; border-radius:16px; overflow:hidden; position:relative; min-height:220px; display:flex; align-items:center; margin-bottom:36px }
        .hero .banner{ position:absolute; inset:0; background-size:cover; background-position:center; filter: contrast(0.96) saturate(1.02) }
        .hero .overlay{ position:absolute; inset:0; background:linear-gradient(180deg, rgba(2,6,23,0.18) 0%, rgba(2,6,23,0.38) 100%) }
        .hero-inner{ position:relative; z-index:2; width:100%; padding:28px; display:flex; justify-content:space-between; align-items:center; gap:12px }
        .hero-left{ color:white; max-width:72% }
        .eyebrow{ font-size:13px; opacity:0.95; margin-bottom:6px }
        .title{ font-size:26px; font-weight:800; margin:0 0 6px }
        .subtitle{ font-size:10px; margin:0; opacity:0.95 }
        .nagarsevak{ margin-top:10px; font-weight:700; color:#ffedd5 }

        .search-wrap{ width:100%; max-width:980px; margin:-28px auto 0; padding:12px; display:flex; gap:12px; align-items:center; z-index:3 }
        .search-box{ flex:1; background:var(--surface); border-radius:14px; padding:12px 14px; display:flex; align-items:center; gap:12px; box-shadow:var(--card-shadow); border:1px solid rgba(2,6,23,0.04); }
        .search-box input{ border:0; outline:0; width:100%; font-size:15px }
        .controls{ display:flex; gap:8px }
        .btn{ background:var(--accent); color:#fff; border:0; padding:8px 12px; border-radius:10px; font-weight:700; cursor:pointer }
        .btn.secondary{ background:transparent; border:1px solid rgba(2,6,23,0.06); color:var(--muted) }

        .results{ margin-top:28px; display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px }

        .card{ background:var(--surface); border-radius:12px; overflow:hidden; border:1px solid rgba(2,6,23,0.04); box-shadow:var(--card-shadow); transition: transform .18s ease, box-shadow .18s ease }
        .card:hover{ transform: translateY(-6px); box-shadow: 0 22px 56px rgba(2,6,23,0.08) }

        .card-header{ position:relative; padding:16px 16px 22px 110px; display:flex; align-items:flex-start; background-image:url("${tileBgDataUrl}"); background-size:cover; background-position:center; min-height:92px }
        .card-header::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(221, 156, 17, 0.73), rgba(0,0,0,0.48)); z-index:0 }

        .photo-circle{ position:absolute; left:18px; top:14px; width:72px; height:72px; border-radius:999px; object-fit:cover; border:3px solid rgba(255,255,255,0.95); box-shadow: 0 8px 22px rgba(2,6,23,0.12); z-index:2 }

        /* header-text used previously in the header; names moved into the body now */
        .header-text{ position:relative; z-index:2; min-width:0 }
        .name-en{ font-size:16px; font-weight:800; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60ch }
        .name-mr{ font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60ch }

        /* When the name elements are rendered inside the card body, use these colors/styles */
        .card-body .name-en{ color:#0f172a; text-shadow:none; }
        .card-body .name-mr{ color:#475569; }

        .slogan-badge{ position:absolute; right:16px; top:12px; z-index:3; background:linear-gradient(90deg,#ffedd5,#fed7aa); color:#92400e; padding:6px 12px; border-radius:999px; font-size:12px; font-weight:800; box-shadow:0 8px 20px rgba(249,115,22,0.08); max-width:40% ; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }

        .ward-badge{ position:absolute; right:16px; bottom:12px; z-index:3; background:rgba(255,255,255,0.98); color:var(--accent); padding:8px 12px; border-radius:10px; font-weight:900; box-shadow:0 10px 28px rgba(2,6,23,0.08); font-size:13px }

        /* stack the name section + details vertically inside card body */
        .card-body{
          padding:16px;
          display:flex;
          gap:12px;
          flex-direction:column;
        }
.marathi-slogan{
  position:relative;
  z-index:2;
  margin-left: 0; /* header already has left padding for the photo */
  margin-top: 8px;
  font-size:13px;
  font-weight:700;
  color:#ffedd5; /* matches other warm accent in header */
  text-shadow: 0 4px 14px rgba(0,0,0,0.32);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  max-width:60%;
}


        .details{ flex:1 }
        .meta{ display:flex; justify-content:space-between; gap:12px; color:var(--muted); font-size:13px }
        .address{ margin-top:10px; color:#475569; font-size:13px }

        footer{ margin-top:36px; text-align:center; color:var(--muted); font-size:13px }

        @media(max-width:600px){
          .hero-inner{ padding:18px }
          .hero-left{ max-width:100% }
          .title{ font-size:20px }
          .subtitle{ font-size:13px }
          .card-header{ padding-left:92px; min-height:84px }
          .photo-circle{ left:12px; top:12px; width:58px; height:58px }
          .slogan-badge{ right:12px; top:10px; padding:6px 8px }
          .ward-badge{ right:12px; bottom:10px; padding:6px 10px }
        }

        @media(max-width:420px){
          .hero-inner{ flex-direction:column; align-items:flex-start; gap:10px }
          .search-wrap{ margin-top:12px }
        }
      `}</style>

      <div className="site-shell">
        <header>
          <div className="brand" aria-hidden>
            <div style={{ fontSize: 28 }}>🗳️</div>
            <h3>Voter Search Portal </h3>
          </div>

          <nav aria-label="Main">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="hero" aria-label="Campaign banner">
          <div
            className="banner"
            style={{ backgroundImage: `url(${bannerUrl})` }}
            role="img"
            aria-hidden
          />
          <div className="overlay" aria-hidden />

          <div className="hero-inner">
            <div className="hero-left">
              <div className="eyebrow">Committed to service</div>
              <div className="title"></div>
              <div className="subtitle">
                Search the voter list quickly — Marathi + English supported. 
              </div>
              <div className="nagarsevak">नगरसेवक: {nagarsevakMarathi}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              {/* <button
                className="btn"
                onClick={() =>
                  document.getElementById("voter-search-input")?.focus()
                }
              >
                Search Voters
              </button> */}
            </div>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="search-wrap" role="search">
            <div className="search-box">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                focusable="false"
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="#94a3b8"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="#94a3b8"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></circle>
              </svg>

              <input
                id="voter-search-input"
                placeholder="उदा: पाटील नभ्रता OR Patil Namrata OR voter id XWU2254902"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search voters by name or voter ID"
                inputMode="text"
                autoComplete="off"
              />

              {query && (
                <button
                  aria-label="Clear query"
                  title="Clear"
                  onClick={() => setQuery("")}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
              )}
            </div>

            <div className="controls" aria-hidden>
              <button className="btn secondary" onClick={clearSearch}>
                Clear
              </button>
             
            </div>
          </div>
        </div>

        <main>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 18,
            }}
          >
            <div style={{ color: "#475569", fontSize: 14 }}>
              {query ? (
                <strong>{results.length}</strong>
              ) : (
                <span style={{ color: "var(--muted)" }}>Type to search</span>
              )}{" "}
              {query
                ? results.length === 1
                  ? " record found"
                  : " records found"
                : ""}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Search Marathi or English — no language toggle needed
            </div>
          </div>

          <div className="results" aria-live="polite">
            {query && results.length === 0 && (
              <div
                style={{ gridColumn: "1/-1", padding: 12, color: "#64748b" }}
              >
                No records matched your search.
              </div>
            )}

            {results.map((voter) => {
              // Use actual voter fields here (don't override)
              const nameEn = voter.name_english || "—";
              const nameMr = voter.name_marathi || "—";
              const photo = voter.photo || resultPhoto;
              const slogan = voter.slogan || "श्री. बापू तुकराम महाजन";
              const sloganMr =
                voter.slogan_marathi ||
                "सदैव संपर्कात "
               " विश्वासू जुना नगरसेवक पुन्हा";
              const ward =
                voter.ward ||
                voter.ward_no ||
                voter.wardNumber ||
                voter.part_no ||
                7;

              return (
                <article
                  key={voter.voter_id || `${voter.box_number}-${voter.part_no}`}
                  className="card"
                  aria-label={`Voter ${nameEn || nameMr}`}
                >
                  <div className="card-header">
                    <img
                      className="photo-circle"
                      src={photo}
                      alt={nameEn || nameMr}
                      onError={(e) => {
                        e.currentTarget.src = resultPhoto;
                      }}
                    />

                    {/* Marathi slogan line (uses voter.slogan_marathi if available) */}
                    <div className="marathi-slogan" aria-hidden>
                      {sloganMr}
                    </div>

                    {/* existing slogan badge (english/default) */}
                    <div className="slogan-badge" aria-hidden>
                      {slogan.length > 32 ? slogan.slice(0, 30) + "…" : slogan}
                    </div>

                    <div className="ward-badge">(Ward 7) {ward}</div>
                  </div>

                  <div className="card-body">
                    {/* Names moved here — they will appear above the "Relative" line */}
                    <div style={{ marginBottom: 6 }}>
                      <div className="header-text" style={{ color: "#0f172a" }}>
                        <div className="name-en" title={nameEn}>
                          {nameEn}
                        </div>
                        <div className="name-mr" title={nameMr}>
                          {nameMr}
                        </div>
                      </div>
                    </div>

                    <div className="details">
                      <div className="meta">
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13 }}>
                            <strong>Relative:</strong>{" "}
                            {voter.relative_name_english || "—"} /{" "}
                            {voter.relative_name_marathi || "—"}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 13 }}>
                            <strong>Voter ID:</strong> {voter.voter_id || "—"}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 13 }}>
                            <strong>Part No:</strong> {voter.part_no || "—"}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: 86 }}>
                          <div
                            style={{
                              background: "var(--soft)",
                              color: "#1e3a8a",
                              padding: "6px 10px",
                              borderRadius: 10,
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                            className="pill"
                          >
                            Box #{voter.box_number ?? "—"}
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              color: "#64748b",
                              fontSize: 13,
                            }}
                          >
                            {voter.age ?? "—"} yrs • {voter.gender || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="address">
                        <strong>Address:</strong> {voter.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <footer>
          © {new Date().getFullYear()} Voter Search — built with ❤️
        </footer>
      </div>
    </div>
  );
}
