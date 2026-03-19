import { useState, useEffect, useRef } from "react";

// ─── Google Fonts ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── Global Styles ───────────────────────────────────────────────────────────
const G = document.createElement("style");
G.textContent = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root { --bg:#050508; --cyan:#39FF14; --violet:#7B2FBE; --warn:#FF6B35; --gold:#FFD700; }
html { scroll-behavior: smooth; }
body { background:var(--bg); color:#e8e8f0; font-family:'DM Sans',sans-serif; overflow-x:hidden; font-size:17px; line-height:1.7; }
::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-track { background:#08080f; }
::-webkit-scrollbar-thumb { background:var(--cyan); border-radius:2px; }
h1,h2,h3,h4,h5,h6 { font-family:'Syne',sans-serif; }
a { text-decoration:none; }

@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(.95)} }
@keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(57,255,20,.3)} 50%{box-shadow:0 0 50px rgba(57,255,20,.7),0 0 100px rgba(57,255,20,.2)} }
@keyframes ticker-warn { 0%,100%{background:rgba(255,107,53,.1)} 50%{background:rgba(255,107,53,.2)} }
@keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }

.btn-primary {
  background:var(--cyan) !important; color:#050508 !important; border:none; border-radius:6px;
  padding:16px 36px; font-size:15px; font-family:'Syne',sans-serif;
  font-weight:800; letter-spacing:.1em; cursor:pointer; transition:all .25s;
  box-shadow:0 0 40px rgba(57,255,20,.4); animation:glow-pulse 3s infinite;
  display:inline-flex; align-items:center; justify-content:center;
  text-decoration:none; line-height:1; white-space:nowrap;
  -webkit-appearance:none; appearance:none;
  user-select:none; -webkit-tap-highlight-color:transparent;
}
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 60px rgba(57,255,20,.7); }
.btn-primary:active { transform:translateY(0px) scale(0.98); }
.btn-ghost {
  background:transparent !important; color:var(--cyan) !important;
  border:1px solid rgba(57,255,20,.4); border-radius:6px;
  padding:16px 36px; font-size:15px; font-family:'Syne',sans-serif;
  font-weight:700; letter-spacing:.08em; cursor:pointer; transition:all .25s;
  display:inline-flex; align-items:center; justify-content:center;
  text-decoration:none; line-height:1; white-space:nowrap;
  -webkit-appearance:none; appearance:none;
  user-select:none; -webkit-tap-highlight-color:transparent;
}
.btn-ghost:hover { border-color:var(--cyan) !important; background:rgba(57,255,20,.08) !important; transform:translateY(-2px); }
.btn-ghost:active { transform:translateY(0px) scale(0.98); }
@media (max-width:480px) {
  .btn-primary, .btn-ghost { padding:14px 24px; font-size:14px; width:100%; text-align:center; }
}

@media (max-width:768px) {
  .desktop-nav { display:none !important; }
  .hamburger { display:flex !important; }
  .hero-grid { flex-direction:column !important; }
  .pricing-grid { grid-template-columns:1fr !important; }
  .process-grid { grid-template-columns:1fr 1fr !important; }
  .footer-inner { flex-direction:column !important; align-items:center !important; text-align:center; gap:20px !important; }
  .contact-grid { flex-direction:column !important; }
}
@media (max-width:480px) {
  .process-grid { grid-template-columns:1fr !important; }
}
`;
document.head.appendChild(G);

// ─── Utility ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const TOTAL_SLOTS = 10;
function getClaimedCount() {
  try { return JSON.parse(localStorage.getItem("codon_claimed") || "0"); }
  catch { return 0; }
}

// ─── THE CODON LOGO SVG ───────────────────────────────────────────────────────
function CodonLogo({ size = 32, showText = true, textSize = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      {/* Icon: three vertical bars — codon triplet / bar chart */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left bar — tallest */}
        <rect x="4" y="8" width="9" height="28" rx="3" fill="#39FF14"/>
        {/* Middle bar — shortest */}
        <rect x="15.5" y="18" width="9" height="18" rx="3" fill="#39FF14"/>
        {/* Right bar — medium */}
        <rect x="27" y="13" width="9" height="23" rx="3" fill="#39FF14"/>
      </svg>
      {showText && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <span style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800,
            fontSize: textSize, color: "rgba(232,232,240,0.5)",
            letterSpacing: "0.12em", lineHeight: 1,
          }}>THE</span>
          <span style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800,
            fontSize: textSize + 2, color: "#39FF14",
            letterSpacing: "0.12em", lineHeight: 1, marginLeft: 6,
          }}>CODON</span>
        </div>
      )}
    </div>
  );
}

// ─── DNA CANVAS ──────────────────────────────────────────────────────────────
function HelixCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const helixH = H * 0.8, amp = Math.min(W * 0.2, 80), nodes = 20;
      const fog = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.6);
      fog.addColorStop(0, "rgba(57,255,20,0.05)");
      fog.addColorStop(0.5, "rgba(123,47,190,0.03)");
      fog.addColorStop(1, "transparent");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H);
      const s1 = [], s2 = [];
      for (let i = 0; i <= nodes; i++) {
        const f = i / nodes, y = cy - helixH / 2 + f * helixH, a = f * Math.PI * 5 + t;
        s1.push({ x: cx + Math.cos(a) * amp, y, z: Math.sin(a) });
        s2.push({ x: cx + Math.cos(a + Math.PI) * amp, y, z: Math.sin(a + Math.PI) });
      }
      for (let i = 0; i <= nodes; i++) {
        const p1 = s1[i], p2 = s2[i];
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(57,255,20,${0.12 + 0.12 * ((p1.z + 1) / 2)})`; ctx.lineWidth = 0.8; ctx.stroke();
        [p1, p2].forEach((p, si) => {
          const r = 3.5 + 2 * ((p.z + 1) / 2);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
          const a2 = 0.8 * ((p.z + 1) / 2 + 0.3);
          if (si === 0) { g.addColorStop(0, `rgba(57,255,20,${a2})`); g.addColorStop(1, "rgba(57,255,20,0)"); }
          else { g.addColorStop(0, `rgba(123,47,190,${a2})`); g.addColorStop(1, "rgba(123,47,190,0)"); }
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        });
      }
      [s1, s2].forEach((strand, si) => {
        ctx.beginPath(); strand.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = si === 0 ? "rgba(57,255,20,0.85)" : "rgba(123,47,190,0.85)";
        ctx.lineWidth = 1.8; ctx.shadowColor = si === 0 ? "#39FF14" : "#7B2FBE";
        ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
      });
      for (let p = 0; p < 28; p++) {
        const px = cx + Math.sin(t * 0.3 + p * 1.7) * (amp + 20 + p * 3);
        const py = cy - helixH / 2 + ((p / 28 + t * 0.016) % 1) * helixH;
        ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57,255,20,${0.15 + 0.25 * Math.sin(t * 1.2 + p)})`; ctx.fill();
      }
      t += 0.012;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── LAUNCH BANNER ───────────────────────────────────────────────────────────
function LaunchBanner() {
  const [claimed] = useState(getClaimedCount);
  const remaining = TOTAL_SLOTS - claimed;
  return (
    <div style={{
      background: "rgba(255,107,53,0.1)", borderBottom: "1px solid rgba(255,107,53,0.3)",
      padding: "10px 5%", display: "flex", alignItems: "center", justifyContent: "center",
      gap: 14, flexWrap: "wrap", animation: "ticker-warn 3s infinite",
      position: "relative", zIndex: 102,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B35", boxShadow: "0 0 10px #FF6B35", animation: "pulse 1.5s infinite", display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: "#FF6B35", letterSpacing: "0.1em" }}>
        🚀 FOUNDING OFFER — 50% OFF ALL SERVICES
      </span>
      <span style={{ color: "rgba(232,232,240,0.65)", fontSize: 13 }}>First {TOTAL_SLOTS} clients only.</span>
      <span style={{
        background: "rgba(255,107,53,0.2)", border: "1px solid rgba(255,107,53,0.5)",
        borderRadius: 4, padding: "3px 10px", fontFamily: "'Syne',sans-serif",
        fontWeight: 800, fontSize: 12, color: "#FF6B35",
      }}>{remaining} of {TOTAL_SLOTS} slots remaining</span>
      <span onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} style={{ color: "#FF6B35", fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>See Prices →</span>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [{ label: "Services", id: "services" }, { label: "Pricing", id: "pricing" }, { label: "Process", id: "process" }, { label: "Contact", id: "contact" }];
  const scrollTo = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <nav style={{
      position: "fixed", top: 38, left: 0, right: 0, zIndex: 100,
      padding: "0 5%", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(5,5,8,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(57,255,20,0.08)" : "none",
      transition: "all 0.4s",
    }}>
      <CodonLogo size={30} textSize={16} />
      <div className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {links.map(l => (
          <span key={l.label} onClick={() => scrollTo(l.id)} style={{ color: "rgba(232,232,240,0.6)", fontSize: 14, letterSpacing: "0.04em", transition: "color 0.2s", cursor: "pointer" }}
            onMouseEnter={e => e.target.style.color = "#39FF14"}
            onMouseLeave={e => e.target.style.color = "rgba(232,232,240,0.6)"}
          >{l.label}</span>
        ))}
        <button onClick={() => scrollTo("contact")} className="btn-primary" style={{ padding: "9px 22px", fontSize: 13, animation: "none", boxShadow: "0 0 20px rgba(57,255,20,0.3)", borderRadius: 5, color: "#050508" }}>Claim 50% Off →</button>
      </div>
      <button className="hamburger" onClick={() => setOpen(!open)} style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ display: "block", width: 22, height: 2, background: "#39FF14", borderRadius: 1, transition: "all 0.3s", transform: open ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 1 ? "scaleX(0)" : "rotate(-45deg) translate(5px,-5px)") : "none" }} />
        ))}
      </button>
      {open && (
        <div style={{ position: "fixed", inset: 0, top: 106, background: "rgba(5,5,8,0.97)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36, zIndex: 99 }}>
          {links.map(l => <span key={l.label} onClick={() => scrollTo(l.id)} style={{ color: "#e8e8f0", fontSize: 28, fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>{l.label}</span>)}
          <button onClick={() => scrollTo("contact")} className="btn-primary" style={{ color: "#050508" }}>Claim 50% Off →</button>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const [vis, setVis] = useState(false);
  const [claimed] = useState(getClaimedCount);
  const remaining = TOTAL_SLOTS - claimed;
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "140px 5% 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "15%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(123,47,190,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 280, height: 280, background: "radial-gradient(circle, rgba(57,255,20,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="hero-grid" style={{ display: "flex", alignItems: "center", width: "100%", gap: "4%" }}>
        {/* Left */}
        <div style={{ flex: "1 1 400px", minWidth: 280 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 100, padding: "7px 16px", marginBottom: 28, opacity: vis ? 1 : 0, transition: "opacity 0.6s 0.1s" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B35", animation: "pulse 1.5s infinite", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#FF6B35", fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}>FOUNDING OFFER · {remaining} SLOTS LEFT AT 50% OFF</span>
          </div>
          {["YOUR BRAND,", "DECODED &", "EXPRESSED."].map((line, i) => (
            <h1 key={i} style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", color: i === 2 ? "#39FF14" : "#e8e8f0", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(50px)", transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.15}s` }}>{line}</h1>
          ))}
          <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.85, color: "rgba(232,232,240,0.65)", maxWidth: 480, fontWeight: 300, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s" }}>
            We build websites, brands, custom software, and YouTube channels — everything a growing business needs to stand out and scale.
          </p>
          {/* Approachable honest note */}
          <div style={{ marginTop: 28, display: "inline-flex", alignItems: "flex-start", gap: 12, background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.12)", borderRadius: 12, padding: "16px 20px", maxWidth: 500, opacity: vis ? 1 : 0, transition: "opacity 0.9s ease 0.75s" }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: 14, color: "rgba(232,232,240,0.65)", lineHeight: 1.75 }}>
              We're brand new — <strong style={{ color: "#39FF14" }}>0 projects delivered.</strong> So our first 10 clients get <strong style={{ color: "#FF6B35" }}>50% off everything</strong> — you help us build a portfolio, we deliver premium work at half price.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.85s" }}>
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary" style={{ flex: "1 1 auto", maxWidth: 280 }}>See Prices & Claim Offer</button>
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="btn-ghost" style={{ flex: "1 1 auto", maxWidth: 200 }}>What We Do</button>
          </div>
        </div>
        {/* Helix */}
        <div style={{ flex: "1 1 340px", minWidth: 260, height: 500, opacity: vis ? 1 : 0, transition: "opacity 1.2s ease 0.4s" }}>
          <HelixCanvas />
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const t = ["WEB DEVELOPMENT", "PERSONAL BRANDING", "YOUTUBE MANAGEMENT", "CUSTOM SOFTWARE", "UI/UX DESIGN", "BRAND STRATEGY"].join(" · ") + " · ";
  return (
    <div style={{ borderTop: "1px solid rgba(57,255,20,0.1)", borderBottom: "1px solid rgba(57,255,20,0.1)", padding: "14px 0", overflow: "hidden", background: "rgba(57,255,20,0.015)" }}>
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee 28s linear infinite" }}>
        {[0, 1].map(i => <span key={i} style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, letterSpacing: "0.25em", color: "#FF6B35", paddingRight: 60, fontWeight: 700 }}>{t}</span>)}
      </div>
    </div>
  );
}

// ─── HONEST SECTION ──────────────────────────────────────────────────────────
function Honest() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: "100px 5%", background: "rgba(255,107,53,0.03)", borderTop: "1px solid rgba(255,107,53,0.08)", borderBottom: "1px solid rgba(255,107,53,0.08)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "#FF6B35", fontSize: 12, letterSpacing: "0.3em", marginBottom: 20, fontFamily: "'Syne',sans-serif", fontWeight: 700, opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>◈ RADICAL TRANSPARENCY</p>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: "#e8e8f0", lineHeight: 1.2, marginBottom: 28, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(30px)", transition: "all 0.8s ease 0.1s" }}>
          We have <span style={{ color: "#39FF14" }}>0 clients.</span><br />That's exactly why you should hire us.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(232,232,240,0.65)", lineHeight: 1.85, maxWidth: 680, margin: "0 auto 48px", fontWeight: 300, opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.25s" }}>
          Every great agency started with zero. We're not here to fake a portfolio — we're here to build one. Our first 10 clients get <strong style={{ color: "#FF6B35" }}>50% off every service</strong> as founding partners. You get premium work at half the price. We get to prove ourselves.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 20, maxWidth: 680, margin: "0 auto", opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}>
          {[{ icon: "🎯", title: "0 Projects", sub: "Starting fresh. Full focus on you." }, { icon: "💸", title: "50% Off", sub: "First 10 clients only. Forever." }, { icon: "⚡", title: "100% Effort", sub: "Proving ourselves, not phoning it in." }].map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#e8e8f0", marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "rgba(232,232,240,0.5)", lineHeight: 1.6 }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const [ref, inView] = useInView();
  const services = [
    { n: "01", icon: "🌐", name: "Web Development", desc: "Custom websites built to convert visitors into customers.", deliverables: ["Custom React / Next.js builds", "CMS integration", "E-commerce & payments"] },
    { n: "02", icon: "✦", name: "Personal Branding & Social Media", desc: "Your identity, amplified across every platform with consistent managed presence.", deliverables: ["Logo & brand identity system", "Content strategy & calendar", "Social media management retainer"] },
    { n: "03", icon: "▶", name: "YouTube & Video", desc: "End-to-end channel management, from strategy to upload-ready.", deliverables: ["Video editing & production", "Channel strategy & SEO", "Thumbnails that get clicks"] },
    { n: "04", icon: "📸", name: "Photography & Videography", desc: "Professional visuals that make your brand impossible to ignore.", deliverables: ["Product & brand photoshoots", "Real estate & graduation shoots", "Brand videography & reels"] },
    { n: "05", icon: "⚙", name: "Custom Software", desc: "Bespoke tools built around your exact workflow. No bloat, no BS.", deliverables: ["Web apps & dashboards", "Automation & API integrations", "30 days post-launch support"] },
    { n: "06", icon: "📣", name: "Content Creation & Ads", desc: "Scroll-stopping content and paid ads that turn attention into revenue.", deliverables: ["Short-form content (Reels, TikTok)", "Paid ad creative & copywriting", "Monthly performance reporting"] },
  ];
  return (
    <section id="services" ref={ref} style={{ padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, opacity: inView ? 1 : 0, transition: "opacity 0.7s" }}>
          <p style={{ color: "#39FF14", fontSize: 12, letterSpacing: "0.3em", marginBottom: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>◈ WHAT WE BUILD</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.02em" }}>STRANDS OF EXPERTISE</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {services.map((s, i) => <ServiceCard key={i} s={s} i={i} inView={inView} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s, i, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? "rgba(57,255,20,0.04)" : "rgba(255,255,255,0.025)", border: `1px solid ${hov ? "rgba(57,255,20,0.45)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "36px 30px", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", transform: hov ? "translateY(-8px)" : inView ? "none" : "translateY(40px)", opacity: inView ? 1 : 0, transitionDelay: `${0.08 * i}s`, boxShadow: hov ? "0 20px 60px rgba(57,255,20,0.08)" : "none" }}>
      <div style={{ fontSize: 26, marginBottom: 12 }}>{s.icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, color: "rgba(57,255,20,0.1)", lineHeight: 1, marginBottom: 14 }}>{s.n}</div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#e8e8f0", marginBottom: 10 }}>{s.name}</h3>
      <p style={{ fontSize: 16, color: "rgba(232,232,240,0.65)", lineHeight: 1.75, marginBottom: 22 }}>{s.desc}</p>
      <ul style={{ listStyle: "none" }}>
        {s.deliverables.map((d, j) => (
          <li key={j} style={{ fontSize: 15, color: "rgba(232,232,240,0.75)", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#39FF14", fontSize: 11 }}>▸</span>{d}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── PRICING ─────────────────────────────────────────────────────────────────
const PLANS = [
  { name: "Starter Website", tag: "GET ONLINE FAST", icon: "🌐", full: 500, features: ["Up to 5 pages", "Mobile responsive", "Contact form", "Basic SEO", "1 revision round", "Delivered in 2 weeks"], cta: "Get This Site", popular: false, gold: false },
  { name: "Growth Website", tag: "⭐ MOST POPULAR", icon: "🚀", full: 1200, features: ["Up to 10 pages", "Custom animations", "CMS / Blog", "Advanced SEO", "3 revision rounds", "Analytics setup", "Delivered in 3–4 weeks"], cta: "Claim This Package", popular: true, gold: false },
  { name: "Brand Identity", tag: "FULL BRAND SYSTEM", icon: "✦", full: 800, features: ["Logo + icon system", "Color & typography", "Brand guidelines PDF", "Social media kit", "3 concept directions", "Delivered in 2 weeks"], cta: "Start My Brand", popular: false, gold: false },
  { name: "YouTube Launch", tag: "CHANNEL GROWTH", icon: "▶", full: 600, features: ["Channel audit & strategy", "4 video edits / month", "Thumbnail design", "SEO titles & descriptions", "Monthly report", "Monthly retainer"], cta: "Launch My Channel", popular: false, gold: false },
  { name: "Custom Software", tag: "BESPOKE BUILD", icon: "⚙", full: 2000, features: ["Discovery & architecture", "Full custom web app", "Admin dashboard", "API integrations", "Deployment included", "30 days support"], cta: "Build My App", popular: false, gold: false },
  { name: "Full Stack", tag: "💎 EVERYTHING INCLUDED", icon: "💎", full: 2500, features: ["Website + Brand Identity", "Social media setup", "YouTube launch", "3 months support", "Monthly strategy call", "Priority 24h response"], cta: "I Want Everything", popular: false, gold: true },
];

function Pricing() {
  const [ref, inView] = useInView(0.05);
  const [claimed] = useState(getClaimedCount);
  const remaining = TOTAL_SLOTS - claimed;
  const offerActive = remaining > 0;
  return (
    <section id="pricing" ref={ref} style={{ padding: "100px 5%", background: "rgba(0,0,0,0.3)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28, opacity: inView ? 1 : 0, transition: "opacity 0.7s" }}>
          <p style={{ color: "#39FF14", fontSize: 12, letterSpacing: "0.3em", marginBottom: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>◈ TRANSPARENT PRICING</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.02em", marginBottom: 18 }}>
            NO HIDDEN FEES.<br /><span style={{ color: "#39FF14" }}>EVERYTHING UPFRONT.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.55)", maxWidth: 540, margin: "0 auto" }}>These are our real prices. The founding discount applies automatically — no code needed.</p>
        </div>
        {offerActive && (
          <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 10, padding: "16px 24px", marginBottom: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.2s" }}>
            <span style={{ animation: "pulse 1.5s infinite", fontSize: 18 }}>🔥</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#FF6B35", fontSize: 14 }}>FOUNDING OFFER ACTIVE — {remaining} of {TOTAL_SLOTS} slots remaining</span>
            <div style={{ background: "rgba(255,107,53,0.15)", borderRadius: 100, padding: "4px 0", width: 160, overflow: "hidden" }}>
              <div style={{ height: 6, background: "#FF6B35", width: `${(claimed / TOTAL_SLOTS) * 100}%`, minWidth: 4, borderRadius: 100 }} />
            </div>
            <span style={{ fontSize: 13, color: "rgba(232,232,240,0.5)" }}>{claimed} claimed</span>
          </div>
        )}
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {PLANS.map((plan, i) => <PricingCard key={i} plan={plan} i={i} inView={inView} offerActive={offerActive} />)}
        </div>
        <p style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "rgba(232,232,240,0.3)", fontStyle: "italic", opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.5s" }}>
          * All prices in USD. Split payment available: 50% upfront, 50% on delivery. Contact us for custom scopes.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan, i, inView, offerActive }) {
  const [hov, setHov] = useState(false);
  const discounted = Math.round(plan.full * 0.5);
  const bc = plan.gold ? "#FFD700" : plan.popular ? "#39FF14" : "rgba(255,255,255,0.07)";
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: plan.popular ? "rgba(57,255,20,0.04)" : plan.gold ? "rgba(255,215,0,0.03)" : "rgba(255,255,255,0.025)",
      border: `1px solid ${hov ? (plan.gold ? "#FFD700" : "#39FF14") : bc}`,
      borderRadius: 14, padding: "34px 28px",
      position: "relative", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      transform: hov ? "translateY(-8px)" : inView ? "none" : "translateY(40px)",
      opacity: inView ? 1 : 0, transitionDelay: `${0.06 * i}s`,
      boxShadow: hov ? `0 24px 60px ${plan.gold ? "rgba(255,215,0,0.12)" : "rgba(57,255,20,0.1)"}` : plan.popular ? "0 0 40px rgba(57,255,20,0.08)" : "none",
      display: "flex", flexDirection: "column",
    }}>
      {plan.tag && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.gold ? "#FFD700" : plan.popular ? "#39FF14" : "rgba(255,107,53,0.9)", color: (plan.gold || plan.popular) ? "#050508" : "#fff", padding: "4px 14px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: "0.12em", whiteSpace: "nowrap" }}>{plan.tag}</div>
      )}
      <div style={{ fontSize: 26, marginBottom: 14 }}>{plan.icon}</div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#e8e8f0", marginBottom: 20 }}>{plan.name}</h3>
      <div style={{ marginBottom: 26 }}>
        {offerActive ? (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 46, fontWeight: 800, color: plan.gold ? "#FFD700" : "#39FF14", lineHeight: 1 }}>${discounted}</span>
              <span style={{ fontSize: 13, color: "rgba(232,232,240,0.4)" }}>/ project</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 17, color: "rgba(232,232,240,0.3)", textDecoration: "line-through" }}>${plan.full}</span>
              <span style={{ background: "rgba(255,107,53,0.2)", color: "#FF6B35", fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 800, padding: "2px 8px", borderRadius: 100, letterSpacing: "0.1em" }}>50% OFF</span>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 46, fontWeight: 800, color: "#39FF14", lineHeight: 1 }}>${plan.full}</span>
            <span style={{ fontSize: 13, color: "rgba(232,232,240,0.4)" }}>/ project</span>
          </div>
        )}
      </div>
      <ul style={{ listStyle: "none", flex: 1, marginBottom: 26 }}>
        {plan.features.map((f, j) => (
          <li key={j} style={{ fontSize: 15, color: "rgba(232,232,240,0.8)", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: plan.gold ? "#FFD700" : "#39FF14", fontSize: 13, flexShrink: 0 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      <a href="#contact" style={{ display: "block", textAlign: "center", background: plan.gold ? "#FFD700" : plan.popular ? "#39FF14" : "transparent", color: (plan.gold || plan.popular) ? "#050508" : "#39FF14", border: (!plan.gold && !plan.popular) ? "1px solid rgba(57,255,20,0.35)" : "none", borderRadius: 8, padding: "14px 16px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", transition: "all 0.25s", cursor: "pointer", boxShadow: plan.popular ? "0 0 30px rgba(57,255,20,0.2)" : plan.gold ? "0 0 30px rgba(255,215,0,0.2)" : "none", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
        onMouseEnter={e => { const t = e.currentTarget; if (!plan.popular && !plan.gold) { t.style.background = "rgba(57,255,20,0.08)"; t.style.borderColor = "#39FF14"; } t.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const t = e.currentTarget; if (!plan.popular && !plan.gold) { t.style.background = "transparent"; t.style.borderColor = "rgba(57,255,20,0.35)"; } t.style.transform = "none"; }}
        onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
        onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      >{plan.cta} →</a>
    </div>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────
function Process() {
  const [ref, inView] = useInView();
  const steps = [
    { n: "01", icon: "🔍", title: "Discovery", desc: "We learn your goals, audience, and gaps in a single focused call." },
    { n: "02", icon: "📐", title: "Architecture", desc: "We plan every page, feature, and flow before writing a line of code." },
    { n: "03", icon: "⚡", title: "Expression", desc: "We build, design, edit, and ship with full attention to detail." },
    { n: "04", icon: "🚀", title: "Launch", desc: "We go live, hand you full access, and stay available for 30 days." },
  ];
  return (
    <section id="process" ref={ref} style={{ padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, opacity: inView ? 1 : 0, transition: "opacity 0.7s" }}>
          <p style={{ color: "#39FF14", fontSize: 12, letterSpacing: "0.3em", marginBottom: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>◈ HOW IT WORKS</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.02em" }}>HOW WE DECODE</h2>
        </div>
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, borderTop: "1px solid rgba(57,255,20,0.1)" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ padding: "44px 28px", borderRight: i < 3 ? "1px solid rgba(57,255,20,0.07)" : "none", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-24px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.15}s` }}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 40, fontWeight: 800, color: "rgba(57,255,20,0.12)", lineHeight: 1, marginBottom: 14 }}>{s.n}</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 700, color: "#e8e8f0", marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 16, color: "rgba(232,232,240,0.7)", lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "You have 0 projects — how do I know the quality will be good?", a: "Fair question. We have the skills — what we don't have yet is a client list. That's exactly why the price is 50% off: you take a small risk, so we made it a small investment. We'll share design concepts before any payment is made so you see the quality upfront." },
    { q: "Do I pay everything upfront?", a: "No. We split it 50% upfront and 50% on delivery. You only pay the final amount once you're happy with the work." },
    { q: "What if I don't like the result?", a: "We keep iterating until you do. Every package includes at least 1 round of revisions. Larger packages include 3+. We don't close a project until you're satisfied." },
    { q: "How fast can you deliver?", a: "Small websites in 2 weeks. Larger projects in 3–6 weeks. Custom software depends on scope — we'll give you a realistic timeline before you commit, not after." },
    { q: "Can I combine services or get a custom quote?", a: "Yes. Message us and we'll build a custom bundle. The Full Stack package is our best value if you want website + brand + social all at once." },
    { q: "Will the 50% offer expire?", a: "Yes — the moment the 10th client signs. There's no countdown timer, it just closes. Once it's gone, standard prices apply permanently." },
  ];
  return (
    <section ref={ref} style={{ padding: "100px 5%", background: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, opacity: inView ? 1 : 0, transition: "opacity 0.7s" }}>
          <p style={{ color: "#39FF14", fontSize: 12, letterSpacing: "0.3em", marginBottom: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>◈ FAQ</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.02em" }}>YOU'RE PROBABLY THINKING...</h2>
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: inView ? 1 : 0, transition: `opacity 0.6s ease ${0.06 * i}s` }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#e8e8f0", lineHeight: 1.4 }}>{f.q}</span>
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(57,255,20,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#39FF14", fontSize: 16, transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            <div style={{ maxHeight: open === i ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ fontSize: 14, color: "rgba(232,232,240,0.6)", lineHeight: 1.85, paddingBottom: 24 }}>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, inView] = useInView();
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: "website", message: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    try {
      const c = Math.min(getClaimedCount() + 1, TOTAL_SLOTS);
      localStorage.setItem("codon_claimed", JSON.stringify(c));
    } catch {}
    setSubmitted(true);
  };

  const inp = (id) => ({
    width: "100%", background: "rgba(57,255,20,0.025)",
    border: `1px solid ${focused === id ? "#39FF14" : "rgba(57,255,20,0.12)"}`,
    borderRadius: 6, padding: "13px 16px", color: "#e8e8f0",
    fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    outline: "none", transition: "border-color 0.2s",
    boxShadow: focused === id ? "0 0 20px rgba(57,255,20,0.08)" : "none",
  });

  return (
    <section id="contact" ref={ref} style={{ padding: "100px 5%", background: "rgba(0,0,0,0.4)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, opacity: inView ? 1 : 0, transition: "opacity 0.7s" }}>
          <p style={{ color: "#39FF14", fontSize: 12, letterSpacing: "0.3em", marginBottom: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>◈ GET STARTED</p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.02em" }}>LET'S BUILD SOMETHING.</h2>
        </div>
        <div className="contact-grid" style={{ display: "flex", gap: "6%", flexWrap: "wrap", opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.2s" }}>
          {/* Left */}
          <div style={{ flex: "1 1 250px", marginBottom: 40 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#e8e8f0", marginBottom: 14, lineHeight: 1.25 }}>Ready to be expressed?</h3>
            <p style={{ fontSize: 15, color: "rgba(232,232,240,0.55)", lineHeight: 1.75, marginBottom: 32 }}>One message. No fluff.<br />Reply within 24 hours.</p>
            <div style={{ borderLeft: "2px solid rgba(57,255,20,0.15)", paddingLeft: 18, marginBottom: 32 }}>
              {["We receive your message", "Reply within 24h with a clear proposal", "You approve scope & pay 50% deposit", "We start building immediately"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11, color: "#39FF14", marginTop: 3, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ fontSize: 13, color: "rgba(232,232,240,0.6)", lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>
            <a href="mailto:hello@thecodon.co" style={{ color: "#39FF14", fontSize: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#39FF14", boxShadow: "0 0 10px #39FF14", animation: "pulse 2s infinite", display: "inline-block" }} />
              hello@thecodon.co
            </a>
          </div>
          {/* Form */}
          <div style={{ flex: "1 1 380px", background: "rgba(57,255,20,0.015)", border: "1px solid rgba(57,255,20,0.1)", borderRadius: 14, padding: "38px 34px" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 26 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <span style={{ marginLeft: 10, fontSize: 10, color: "rgba(57,255,20,0.3)", letterSpacing: "0.15em" }}>CODON_CONTACT v1.0</span>
            </div>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 18 }}>🎉</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: "#39FF14", marginBottom: 12 }}>Sequence Initialized.</h3>
                <p style={{ color: "rgba(232,232,240,0.6)", fontSize: 14, lineHeight: 1.75 }}>We'll reply within 24 hours with a clear proposal.<br />Your 50% founding discount is locked in.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[["name", "YOUR NAME", "text", "Alex Johnson"], ["email", "EMAIL", "email", "alex@email.com"]].map(([id, label, type, ph]) => (
                  <div key={id}>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.25em", color: "rgba(57,255,20,0.5)", marginBottom: 6 }}>{label}</label>
                    <input type={type} placeholder={ph} value={form[id]} onChange={e => setForm({ ...form, [id]: e.target.value })} onFocus={() => setFocused(id)} onBlur={() => setFocused(null)} style={inp(id)} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.25em", color: "rgba(57,255,20,0.5)", marginBottom: 6 }}>I NEED A...</label>
                  <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} onFocus={() => setFocused("service")} onBlur={() => setFocused(null)} style={{ ...inp("service"), appearance: "none", cursor: "pointer" }}>
                    {[["website", "Website"], ["branding", "Brand Identity"], ["youtube", "YouTube / Video"], ["software", "Custom Software"], ["fullstack", "Full Stack Package"], ["other", "Other / Not Sure"]].map(([v, l]) => (
                      <option key={v} value={v} style={{ background: "#0a0a14" }}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, letterSpacing: "0.25em", color: "rgba(57,255,20,0.5)", marginBottom: 6 }}>TELL US ABOUT YOUR PROJECT</label>
                  <textarea rows={4} placeholder="What are you building? What's the goal?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} style={{ ...inp("message"), resize: "vertical", minHeight: 90 }} />
                </div>
                <button onClick={handleSubmit} className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: 13, borderRadius: 8, letterSpacing: "0.12em" }}>
                  SEND MESSAGE + LOCK IN 50% OFF →
                </button>
                <p style={{ fontSize: 11, color: "rgba(232,232,240,0.3)", textAlign: "center", lineHeight: 1.6 }}>No commitment. We'll send a proposal first. You decide.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(57,255,20,0.15)", padding: "36px 5%" }}>
      <div className="footer-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <CodonLogo size={26} textSize={14} />
        <p style={{ fontSize: 12, color: "rgba(232,232,240,0.3)" }}>© 2025 The Codon. All rights reserved.</p>
        <div style={{ display: "flex", gap: 12 }}>
          {[["IG", "Instagram"], ["𝕏", "Twitter"], ["in", "LinkedIn"], ["▶", "YouTube"]].map(([n, label]) => (
            <a key={n} href="#" title={label} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(57,255,20,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,232,240,0.4)", fontSize: 13, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#39FF14"; e.currentTarget.style.color = "#39FF14"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(57,255,20,0.12)"; e.currentTarget.style.color = "rgba(232,232,240,0.4)"; }}
            >{n}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <LaunchBanner />
      <Navbar />
      <Hero />
      <Marquee />
      <Honest />
      <Services />
      <Pricing />
      <Process />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
