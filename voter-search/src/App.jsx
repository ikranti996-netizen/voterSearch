// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import votersData from "./data/voters.json";
import bannerUrl from "./assets/LOGO.jpg";
import bannerUrl1 from "./assets/awe.jpeg";
import bannerUrl2 from "./assets/banner.jpeg";
import bannerUrl23 from "./assets/imagebanner.jpg";
import resultPhoto from "./assets/mama.jpeg";

/*
 Single-button share: capture card image + share text together.
 - Attempts navigator.share({ files, text }) first.
 - Then clipboard image+text fallback.
 - Final fallback: open image in new tab + open WhatsApp web with text.
*/

const CAMPAIGN_TITLE = `🌸 मतदान करा बापू तुकाराम महाजन यांना 🌸
💪 विकास आणि जनसेवेच्या वाटचालीसाठी तुमचा एक मत द्या!

✨ आपल्या भागाचा सर्वांगीण विकास, शिक्षण, रोजगार, आणि स्वच्छतेसाठी —
एकत्र येऊया, बदल घडवूया!

🙏 चला, बापू तुकाराम महाजन यांना आपला पाठिंबा द्या.
आपले मत द्या — उज्वल भविष्यासाठी एक पाऊल पुढे टाका!

#विकासासाठीबापू #जनतेचाआवाज #आपलाबापूमहाजन`;

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  // snapshot state
  const [snapshotLoadingFor, setSnapshotLoadingFor] = useState(null);
  const [snapshotMessage, setSnapshotMessage] = useState("");

  // debounce search
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      const q = query.trim();
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
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    document.getElementById("voter-search-input")?.focus();
  };

  // Carousel
  const carouselImages = [bannerUrl, bannerUrl1, bannerUrl, bannerUrl23];
  const [slide, setSlide] = useState(0);
  const isPausedRef = useRef(false);
  const AUTO_ADVANCE_MS = 1500;

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPausedRef.current)
        setSlide((s) => (s + 1) % carouselImages.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [carouselImages.length]);

  const goTo = (i) =>
    setSlide(
      ((i % carouselImages.length) + carouselImages.length) %
        carouselImages.length
    );
  const prevSlide = () =>
    setSlide((s) => (s - 1 + carouselImages.length) % carouselImages.length);
  const nextSlide = () => setSlide((s) => (s + 1) % carouselImages.length);

  // Single button: capture card + share text together
  const shareCardWithInfo = async (voter) => {
    const cardId = "card-" + (voter.voter_id || `${voter.box_number}-${voter.part_no}`);
    const node = document.getElementById(cardId);
    if (!node) {
      alert("Card element not found.");
      return;
    }

    // Build the share text (campaign + voter details)
    const name = voter.name_marathi || voter.name_english || "—";
    const rel = voter.relative_name_marathi || voter.relative_name_english || "—";
    const id = voter.voter_id || "—";
    const ward = voter.ward || voter.ward_no || voter.part_no || "—";
    const box = voter.box_number ?? "—";
    const addr = voter.address || "—";
    const age = voter.age ?? "—";
    const gender = voter.gender || "—";

    const textToShare =
      `${CAMPAIGN_TITLE}\n\n` +
      `🔹 नाव: ${name}\n` +
      `🔹 नातेवाईक: ${rel}\n` +
      `🔹 मतदान ओळख क्रमांक (Voter ID): ${id}\n` +
      `🔹 विभाग / भाग क्र.: 7 (${ward})\n` +
      `🔹 बॉक्स क्रमांक: ${box}\n` +
      `🔹 पत्ता: ${addr}\n` +
      `🔹 वय / लिंग: ${age} वर्षे • ${gender}\n\n` +
      `🗳️ बापू तुकाराम महाजन यांना मतदान करा — कृपया हा कार्ड शेअर करा आणि पाठिंबा द्या!`;

    setSnapshotLoadingFor(cardId);
    setSnapshotMessage("Preparing image...");

    try {
      // Optionally style the node for snapshot
      node.classList.add("snapshot-active");

      const canvas = await html2canvas(node, {
        scale: Math.max(2, window.devicePixelRatio || 1),
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      node.classList.remove("snapshot-active");

      const blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );

      if (!blob) throw new Error("Failed to create image blob");

      const fileName = `${(name || "voter").replace(/\s+/g, "-").slice(0, 40)}-card.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      // 1) Preferred: Web Share API with files + text (works on many mobile browsers)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Voter Card",
            text: textToShare,
          });
          setSnapshotMessage("Shared!");
          setTimeout(() => setSnapshotLoadingFor(null), 900);
          return;
        } catch (err) {
          console.warn("navigator.share with files failed:", err);
          // fall through to clipboard fallback
        }
      }

      // 2) Clipboard fallback: try to write image and text to clipboard (secure contexts)
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          // write image
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          // write text (some apps accept paste of both)
          try {
            await navigator.clipboard.writeText(textToShare);
          } catch (e) {
            // ignore text copy error
          }
          setSnapshotMessage("Image & text copied to clipboard. Paste into chat to send.");
          setTimeout(() => setSnapshotLoadingFor(null), 1600);
          return;
        } catch (err) {
          console.warn("clipboard image write failed:", err);
          // fall through to final fallback
        }
      }

      // 3) Final fallback: open image in new tab + open WhatsApp with text prefilled
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");

      const wa = `https://wa.me/?text=${encodeURIComponent(textToShare + "\n\n(Please attach the image from the opened tab)")}`;
      window.open(wa, "_blank", "noopener,noreferrer");

      setSnapshotMessage("Image opened in new tab. Attach it manually in WhatsApp.");
      setTimeout(() => setSnapshotLoadingFor(null), 1800);
    } catch (err) {
      console.error(err);
      setSnapshotMessage("Failed to prepare image. Check console.");
      setTimeout(() => setSnapshotLoadingFor(null), 1500);
    }
  };

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
        :root{ --surface:#ffffff; --muted:#94a3b8; --accent:#0b57d0; --soft:#eef2ff; --card-shadow: 0 12px 36px rgba(2,6,23,0.06); --gap:18px; }
        .site-shell { max-width:1200px; margin:0 auto; padding:28px 20px; }

        .hero{ width:100%; border-radius:16px; overflow:hidden; position:relative; display:flex; align-items:center; margin-bottom:36px }
        .hero { height: clamp(220px, 30vh, 420px) }
        .carousel{ position:relative; width:100%; height:100%; }
        .carousel-track{ display:flex; height:100%; transition: transform 480ms cubic-bezier(.22,.9,.28,1); }
        .carousel-slide{ min-width:100%; height:100%; position:relative; flex:0 0 100%; }
        .carousel-slide img{ width:100%; height:100%; object-fit:cover; display:block }
        .carousel-overlay{ position:absolute; inset:0; background: linear-gradient(180deg, rgba(2,6,23,0.18) 0%, rgba(2,6,23,0.38) 100%); pointer-events:none }
        .carousel-dots{ position:absolute; left:50%; transform:translateX(-50%); bottom:12px; display:flex; gap:8px; z-index:5 }
        .dot{ width:10px; height:10px; border-radius:999px; background:rgba(255,255,255,0.6); border:1px solid rgba(2,6,23,0.06); cursor:pointer }
        .dot[aria-current='true']{ background:#fff; box-shadow:0 6px 18px rgba(2,6,23,0.12) }

        .search-wrap{ width:100%; max-width:980px; margin:-28px auto 0; padding:12px; display:flex; gap:12px; align-items:center; z-index:3 }
        .search-box{ flex:1; background:var(--surface); border-radius:14px; padding:12px 14px; display:flex; align-items:center; gap:12px; box-shadow:var(--card-shadow); border:1px solid rgba(223, 237, 236, 0.04); }
        .search-box input{ border:0; outline:0; width:100%; font-size:clamp(14px, 1.6vw, 15px); background-color: transparent; color: #0f172a; caret-color: var(--accent); }
        .search-box input::placeholder { color: #94a3b8; opacity: 1; }

        .btn-clear { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:10px; font-weight:700; font-size:14px; cursor:pointer; border:0; background: var(--accent); color: #fff; box-shadow: 0 8px 20px rgba(11,87,208,0.18); transition: transform .12s ease, box-shadow .12s ease, opacity .12s; }
        .btn-clear:active{ transform: translateY(1px) }
        .btn-clear[disabled]{ opacity: .6; cursor: default }

        .results{ margin-top:28px; display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:var(--gap); align-items:start }

        .card{ background:var(--surface); border-radius:12px; overflow:hidden; border:1px solid rgba(2,6,23,0.04); box-shadow:var(--card-shadow); transition: transform .18s ease, box-shadow .18s ease; display:flex; flex-direction:column; position:relative; border-left: 4px solid transparent; }
        .card:hover{ transform: translateY(-6px); box-shadow: 0 18px 48px rgba(2,6,23,0.08); border-left-color: rgba(11,87,208,0.9); }

        .card-header{ position:relative; width:100%; height: clamp(88px, 18vw, 160px); overflow:hidden; background:#f1f5f9 }
        .card-header img.banner{ width:100%; height:150%; object-fit:cover; display:block; vertical-align:middle; filter: saturate(1.03) contrast(0.98); }

        .snapshot-overlay {
          position: absolute;
          inset: 0;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(2,6,23,0.42);
          color: #fff;
          font-weight:700;
          z-index: 40;
          border-radius: 12px;
          pointer-events: none;
        }

        .snapshot-active { transform: none !important; }

        .card-body{ padding:18px 14px 14px 14px; display:flex; gap:12px; flex-direction:column; flex:1 }

        .share-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 10px; border-radius:10px; font-weight:600; font-size:13px; cursor:pointer; border:0; background:transparent; color:var(--accent); }
        .share-icon { width:18px; height:18px; display:inline-block; }

        @media(max-width:900px){
          .results{ grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        }

        @media(max-width:640px){
          .site-shell{ padding:18px 12px }
          .hero{ margin-bottom:18px }
          .search-wrap{ max-width:100%; margin-top:12px; padding:10px }
          .results{ gap:12px; grid-template-columns: 1fr; }
          .card-body{ padding:14px 10px 10px 10px }
        }
      `}</style>

      <div className="site-shell">
        <section className="hero" aria-label="Campaign banner">
          <div
            className="carousel"
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
          >
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {carouselImages.map((src, idx) => (
                <div className="carousel-slide" key={idx}>
                  <img
                    src={src}
                    alt={`Banner ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = bannerUrl;
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              ))}
            </div>

            <div className="carousel-overlay" aria-hidden />

            <div
              className="carousel-dots"
              role="tablist"
              aria-label="Slide dots"
            >
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  className="dot"
                  aria-current={i === slide}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="search-wrap"
            role="search"
            style={{
              boxShadow: "0 12px 36px rgba(2,6,23,0.04)",
              background: "transparent",
            }}
          >
            <div className="search-box" style={{ minWidth: 0 }}>
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
                style={{
                  color: "#0f172a",
                  fontSize: 15,
                  lineHeight: "20px",
                }}
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
                    fontSize: 18,
                    padding: 8,
                  }}
                >
                  ✖
                </button>
              )}
            </div>

            <div className="controls" aria-hidden>
              {query ? (
                <button
                  className="btn-clear"
                  onClick={clearSearch}
                  title="Clear search"
                >
                  Clear
                </button>
              ) : (
                <button
                  className="btn secondary"
                  onClick={clearSearch}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: "white",
                    border: "1px solid rgba(2,6,23,0.06)",
                    boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
                    cursor: "pointer",
                    opacity: 0.0,
                    pointerEvents: "none",
                  }}
                >
                  Clear
                </button>
              )}
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
                  <strong>{results.length}</strong>{" "}
                  {results.length === 1 ? " record found" : " records found"}
                </>
              ) : (
                <span style={{ color: "var(--muted)" }}>
                  Type at least 3 characters to search
                </span>
              )}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}></div>
          </div>

          <div className="results" aria-live="polite">
            {query && query.trim().length > 0 && query.trim().length < 3 && (
              <div
                style={{ gridColumn: "1/-1", padding: 12, color: "#64748b" }}
              >
                Please type at least 3 characters to start searching.
              </div>
            )}

            {query && query.trim().length >= 3 && results.length === 0 && (
              <div
                style={{ gridColumn: "1/-1", padding: 12, color: "#64748b" }}
              >
                No records matched your search.
              </div>
            )}

            {results.map((voter) => {
              const nameEn = voter.name_english || "—";
              const nameMr = voter.name_marathi || "—";
              const photo = voter.photo || resultPhoto;
              const ward =
                voter.ward ||
                voter.ward_no ||
                voter.wardNumber ||
                voter.part_no ||
                7;

              const cardBanner =
                voter.card_banner || voter.header_image || bannerUrl2;

              const cardId = `card-${voter.voter_id || `${voter.box_number}-${voter.part_no}`}`;

              return (
                <article
                  key={voter.voter_id || `${voter.box_number}-${voter.part_no}`}
                  className="card"
                  id={cardId}
                  aria-label={`Voter ${nameEn || nameMr}`}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    padding: 0,
                    background: "#fff",
                    backgroundImage:
                      "linear-gradient(180deg, rgba(11,87,208,0.02), rgba(255,255,255,0))",
                    position: "relative",
                  }}
                >
                  {snapshotLoadingFor === cardId && (
                    <div className="snapshot-overlay" aria-hidden>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14 }}>{snapshotMessage}</div>
                      </div>
                    </div>
                  )}

                  <div className="card-header" aria-hidden>
                    <img
                      className="banner"
                      src={cardBanner}
                      alt={`Banner for ${nameEn}`}
                      loading="lazy"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = bannerUrl;
                      }}
                    />
                  </div>

                  <div className="card-body">
                    <div
                      style={{
                        marginBottom: 6,
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <div className="header-text" style={{ color: "#0f172a" }}>
                        <span style={{ fontSize: 15, color: "#334155" }}>
                          Ward 7 ( {ward} )
                        </span>
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

                      <div
                        style={{
                          position: "absolute",
                          right: 8,
                          top: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {/* SINGLE BUTTON: prepares & shares both image + text */}
                        <button
                          onClick={() => shareCardWithInfo(voter)}
                          title="Share full card + info"
                          style={{
                            marginLeft: 6,
                            padding: "8px 5px",
                            borderRadius: 10,
                            border: "1px solid rgba(11,87,208,0.12)",
                            background: "#fff",
                            cursor: "pointer",
                            fontWeight: 700,
                            color: "#0b57d0",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                          aria-label="Share full card with information"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.94.56 3.74 1.53 5.25L2 22l4.9-1.49A9.9 9.9 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/>
                            <path d="M17.6 14.2c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.08-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.38-.02-.53-.02-.15-.68-1.64-.93-2.25-.25-.6-.5-.5-.68-.5h-.58c-.2 0-.52.07-.8.3-.28.23-1.08 1.05-1.08 2.56 0 1.5 1.1 2.95 1.25 3.16.15.2 2.16 3.3 5.23 4.63 3.07 1.33 3.07.89 3.62.83.55-.06 1.78-.72 2.03-1.41.25-.69.25-1.27.18-1.4-.07-.13-.25-.2-.55-.35z" fill="#fff"/>
                          </svg>
                          Share
                        </button>
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

        <footer style={{ marginTop: 24 }}>
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
          © {new Date().getFullYear()} Voter Search — built with Lalit Mali
          (7775025688) ❤️
        </footer>
      </div>
    </div>
  );
}
