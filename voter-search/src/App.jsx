import React, { useEffect, useRef, useState } from "react";
import votersData from "./data/voters.json";
import bannerUrl from "./assets/banner.jpeg";
import resultPhoto from "./assets/mama.jpeg";

// Decorative inlined tile background (kept as data URL)
const tileBgDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAd0AAADdCAIAAABxKD+NAAAQAElEQVR4AeydB3wUVdn/3e+e9+zsy5t3Z2b2d2d2Zl3Znd2bZ2d2bZ2d2bZ2d2bZ2d2bZ2d2bYt2kqkqS5KpUKhQqVKoUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSpUKlUqFSr6r8w3/8wAABgH/8wAAHHcD4x0mAABgC9v9bWz+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1+v1";

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
      // require at least 3 characters to search
      if (!q || q.length < 3) {
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
        /* Header with subtle gradient background and rounded corners */
        header{ display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px; padding:12px 18px; border-radius:12px; background: linear-gradient(90deg, #0b57d0 0%, #0ea5e9 100%); color: #fff }
        .brand { display:flex; gap:12px; align-items:center }
        .brand h3{ margin:0; font-size:20px; color: #fff }
        nav a{ color:rgba(255,255,255,0.95); text-decoration:none; margin-left:12px; font-size:14px }

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
        .search-box{ flex:1; background:var(--surface); border-radius:14px; padding:12px 14px; display:flex; align-items:center; gap:12px; box-shadow:var(--card-shadow); border:1px solid rgba(223, 237, 236, 0.04); }
        /* Ensure input text is visible and caret uses accent color */
        .search-box input{ border:0; outline:0; width:100%; font-size:15px; background-color: transparent; color: #0f172a; caret-color: var(--accent); }
        .search-box input::placeholder { color: #94a3b8; opacity:1 }
        .search-box:focus-within{ box-shadow: 0 8px 28px rgba(11,87,208,0.12); }
        .controls{ display:flex; gap:8px }
        .btn{ background:var(--accent); color:#fff; border:0; padding:8px 12px; border-radius:10px; font-weight:700; cursor:pointer }
        .btn.secondary{ background:transparent; border:1px solid rgba(2,6,23,0.06); color:var(--muted) }

        /* Force two cards per row on wide screens (as requested) */
        .results{ margin-top:28px; display:grid; grid-template-columns: repeat(2, 1fr); gap:18px }

        .card{ background:var(--surface); border-radius:12px; overflow:hidden; border:1px solid rgba(2,6,23,0.04); box-shadow:var(--card-shadow); transition: transform .18s ease, box-shadow .18s ease }
        .card:hover{ transform: translateY(-6px); box-shadow: 0 22px 56px rgba(2,6,23,0.08) }

        /* Header layout: left = 50% slogan/name/ward, right = photo */
        .card-header{ position:relative; padding:16px; display:flex; align-items:center; gap:12px; background-image:url("${tileBgDataUrl}"); background-size:cover; background-position:center; min-height:110px }
        .card-header::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(208, 147, 147, 0.92), rgba(204, 162, 37, 0.92)); z-index:0 }
        .header-left{ z-index:2; flex:1; display:flex; flex-direction:column; justify-content:center; min-width:0 }
        .header-right{ z-index:2; width:130px; display:flex; justify-content:center; align-items:center }

        .photo-circle{ width:110px; height:110px; border-radius:999px; object-fit:cover; border:3px solid rgba(255,255,255,0.95); box-shadow: 0 8px 22px rgba(2,6,23,0.12); }

        .marathi-slogan{ font-size:14px; color:#475569; font-weight:500; margin-bottom:6px }
        .slogan-badge{ display:inline-block; background:#f1f5f9; color:#1e3a8a; padding:6px 12px; border-radius:12px; font-size:13px; font-weight:700 }
        .ward-badge{ margin-top:8px; display:inline-block; background:rgba(2,6,23,0.04); color:var(--accent); padding:6px 10px; border-radius:8px; font-weight:800 }

        /* card body styles kept similar */
        .card-body{ padding:16px; display:flex; gap:12px; flex-direction:column }
        .header-text{ position:relative; z-index:1; min-width:0 }
        .name-en{ font-size:16px; font-weight:800; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60ch }
        .name-mr{ font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60ch }

        .card-body .name-en{ color:#0f172a; text-shadow:none; }
        .card-body .name-mr{ color:#475569; }

        .details{ flex:1 }
        .meta{ display:flex; justify-content:space-between; gap:12px; color:var(--muted); font-size:13px }
        .address{ margin-top:10px; color:#475569; font-size:13px }

        footer{ margin-top:36px; text-align:center; color:var(--muted); font-size:13px }

        @media(max-width:900px){
          .results{ grid-template-columns: repeat(1, 1fr) }
          .card-header{ min-height:100px }
          .header-right{ width:100px }
          .photo-circle{ width:88px; height:88px }
        }

        @media(max-width:600px){
          .hero-inner{ padding:18px }
          .hero-left{ max-width:100% }
          .title{ font-size:20px }
          .subtitle{ font-size:13px }
          .card-header{ padding:12px }
          .photo-circle{ width:72px; height:72px }
          .slogan-badge{ padding:6px 8px }
          .ward-badge{ padding:6px 8px }
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
            <div className="hero-left"></div>

            <div style={{ textAlign: "right" }}></div>
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
              {query && query.trim().length >= 3 ? (
                <>
                  <strong>{results.length}</strong> {results.length === 1 ? " record found" : " records found"}
                </>
              ) : (
                <span style={{ color: "var(--muted)" }}>Type at least 3 characters to search</span>
              )}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}></div>
          </div>

          <div className="results" aria-live="polite">
            {query && query.trim().length > 0 && query.trim().length < 3 && (
              <div style={{ gridColumn: "1/-1", padding: 12, color: "#64748b" }}>
                Please type at least 3 characters to start searching.
              </div>
            )}

            {query && query.trim().length >= 3 && results.length === 0 && (
              <div style={{ gridColumn: "1/-1", padding: 12, color: "#64748b" }}>
                No records matched your search.
              </div>
            )}

            {results.map((voter) => {
              const nameEn = voter.name_english || "—";
              const nameMr = voter.name_marathi || "—";
              const photo = voter.photo || resultPhoto;
              const slogan = voter.slogan || "श्री. बापू तुकाराम महाजन";
              const sloganMr =
                voter.slogan_marathi ||
                "सदैव संपर्कात विश्वास जुना नगरसेवक पुन्हा";
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
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    padding: 0,
                    background: "#fff",
                  }}
                >
                  <div className="card-header">
                    <div className="header-left">
                      <div className="marathi-slogan">{sloganMr}</div>
                      <div style={{ marginTop: 6 }}>
                        <span className="slogan-badge" aria-hidden>
                          {slogan.length > 40 ? slogan.slice(0, 38) + "…" : slogan}
                        </span>
                      </div>

                      <div>
                        <span className="ward-badge">Ward 7 ( {ward} )</span>
                      </div>
                    </div>

                    <div className="header-right">
                      <img
                        className="photo-circle"
                        src={photo}
                        alt={nameEn || nameMr}
                        onError={(e) => {
                          e.currentTarget.src = resultPhoto;
                        }}
                      />
                    </div>
                  </div>

                  <div className="card-body">
                    <div style={{ marginBottom: 6, textAlign: "center" }}>
                      <div className="header-text" style={{ color: "#0f172a" }}>
                        <div
                          className="name-en"
                          title={nameEn}
                          style={{ fontSize: 16, fontWeight: 700 }}
                        >
                          {nameEn}
                        </div>
                        <div
                          className="name-mr"
                          title={nameMr}
                          style={{ fontSize: 15, color: "#334155" }}
                        >
                          {nameMr}
                        </div>
                      </div>
                    </div>

                    <div
                      className="details"
                      style={{ fontSize: 13, color: "#334155" }}
                    >
                      <div
                        className="meta"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13 }}>
                            <strong>Relative:</strong>{" "}
                            {voter.relative_name_english || "—"} / {" "}
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

                      <div className="address" style={{ marginTop: 8 }}>
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
          <div
            style={{
              textAlign: "right",
              width: "100%",
              marginBottom: 6,
              color: "#475569",
              fontSize: 13,
            }}
          >
            Total Records: <strong>{votersData.length}</strong>
          </div>
          © {new Date().getFullYear()} Voter Search — built with Lalit Mali ❤️
        </footer>
      </div>
    </div>
  );
}
