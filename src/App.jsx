import { useState, useEffect } from "react";
import { supabase, getClients, createClientRecord, deleteClientRecord, getSubmissions } from "./supabase.js";

// ── DESIGN TOKENS ──────────────────────────────────────────
const T = {
  bg: "#0c0a09", cream: "#f0ece4", white: "#ffffff",
  muted: "rgba(240,236,228,0.45)", border: "rgba(255,255,255,0.08)",
  glass: "rgba(255,255,255,0.04)", glassBorder: "rgba(255,255,255,0.10)",
  accent: "#c0392b",
};

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "arcodic2025";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.cream}; font-family: 'DM Sans', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; min-height: 100vh; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${T.bg}; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
  .serif { font-family: 'Cormorant Garamond', serif; }
  .serif-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; }
  .noise::after { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events: none; z-index: 9999; opacity: 0.4; }
  .glass-card { background: ${T.glass}; border: 1px solid ${T.glassBorder}; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 2px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
  .glass-card:hover { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.055); }
  .arc-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; padding: 14px 18px; color: ${T.cream}; font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 14px; outline: none; transition: border-color 0.3s ease, background 0.3s ease; letter-spacing: 0.02em; }
  .arc-input::placeholder { color: rgba(240,236,228,0.3); }
  .arc-input:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.07); }
  .arc-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.muted}; display: block; margin-bottom: 8px; }
  .btn-primary { background: ${T.cream}; color: ${T.bg}; border: none; border-radius: 100px; padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 13px; letter-spacing: 0.04em; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); white-space: nowrap; }
  .btn-primary:hover { background: ${T.white}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-ghost { background: transparent; color: ${T.muted}; border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 13px; letter-spacing: 0.04em; cursor: pointer; transition: all 0.3s ease; }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: ${T.cream}; }
  .btn-danger { background: rgba(192,57,43,0.15); color: #e74c3c; border: 1px solid rgba(192,57,43,0.25); border-radius: 100px; padding: 8px 18px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
  .btn-danger:hover { background: rgba(192,57,43,0.3); }
  .arc-divider { width: 100%; height: 1px; background: ${T.border}; margin: 28px 0; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 100px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
  .badge-pending { background: rgba(240,180,0,0.1); color: #f0b400; border: 1px solid rgba(240,180,0,0.2); }
  .badge-complete { background: rgba(39,174,96,0.1); color: #27ae60; border: 1px solid rgba(39,174,96,0.2); }
  .badge-new { background: rgba(192,57,43,0.1); color: #e74c3c; border: 1px solid rgba(192,57,43,0.2); }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 2px; cursor: pointer; font-size: 13px; color: ${T.muted}; letter-spacing: 0.02em; transition: all 0.25s ease; border: 1px solid transparent; }
  .nav-item:hover { color: ${T.cream}; background: rgba(255,255,255,0.04); }
  .nav-item.active { color: ${T.cream}; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .s1{animation-delay:0.05s;opacity:0} .s2{animation-delay:0.12s;opacity:0} .s3{animation-delay:0.19s;opacity:0} .s4{animation-delay:0.26s;opacity:0}
  .glow-blob { position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.3s ease; }
  .data-row { display: flex; flex-direction: column; gap: 4px; padding: 14px 0; border-bottom: 1px solid ${T.border}; }
  .data-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.muted}; }
  .data-value { font-size: 14px; color: ${T.cream}; line-height: 1.6; }
  select.arc-input option { background: #1a1714; color: ${T.cream}; }
`;

const generateEMPLID = () => String(Math.floor(10000000 + Math.random() * 90000000));

// ── SUBMISSION DETAIL MODAL ────────────────────────────────
function SubmissionModal({ submission, client, onClose }) {
  const bd = submission?.business_data || {};
  const pd = submission?.project_data || {};
  const sigs = submission?.signatures || {};

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card" style={{ width: "100%", maxWidth: 700, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0, background: "rgba(12,10,9,0.95)" }}>
          <div>
            <div className="arc-label">Submission Details</div>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, color: T.cream, marginTop: 4 }}>{client?.name || "Client"}</h2>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>EMPLID: {client?.emplid} · Submitted {new Date(submission.submitted_at).toLocaleDateString()}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }}>
          {/* Business Info */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>Business Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              {[
                ["Business Name", bd.businessName],
                ["Tagline", bd.tagline],
                ["Industry", bd.industry],
                ["Phone", bd.phone],
                ["Website", bd.website],
                ["Address", bd.address],
                ["Primary Colour", bd.primaryColor],
                ["Secondary Colour", bd.secondaryColor],
                ["Design Style", bd.style],
              ].map(([label, value]) => value ? (
                <div className="data-row" key={label}>
                  <span className="data-label">{label}</span>
                  <span className="data-value">{value}</span>
                </div>
              ) : null)}
              {bd.description && (
                <div className="data-row" style={{ gridColumn: "1/-1" }}>
                  <span className="data-label">Business Description</span>
                  <span className="data-value" style={{ whiteSpace: "pre-wrap" }}>{bd.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Project Brief */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>Project Brief</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              {[
                ["Project Type", pd.projectType],
                ["Number of Pages", pd.pages],
              ].map(([label, value]) => value ? (
                <div className="data-row" key={label}>
                  <span className="data-label">{label}</span>
                  <span className="data-value">{value}</span>
                </div>
              ) : null)}
              {[
                ["Features & Functionality", pd.features],
                ["Design Inspiration", pd.inspiration],
                ["Competitor Websites", pd.competitors],
              ].map(([label, value]) => value ? (
                <div className="data-row" style={{ gridColumn: "1/-1" }} key={label}>
                  <span className="data-label">{label}</span>
                  <span className="data-value" style={{ whiteSpace: "pre-wrap" }}>{value}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Signatures */}
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>Signed Documents</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {Object.entries(sigs).map(([doc, info]) => (
                <div key={doc} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(39,174,96,0.08)", border: "1px solid rgba(39,174,96,0.2)", borderRadius: 2 }}>
                  <span style={{ color: "#27ae60", fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 12, color: T.cream }}>{doc}</span>
                  <span style={{ fontSize: 10, color: T.muted }}>{info.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 28px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN LOGIN ────────────────────────────────────────────
function AdminLogin({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem("arc_admin", "1");
        onAuth();
      } else {
        setError("Incorrect password. Try again.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div className="glow-blob" style={{ width: 500, height: 500, background: "rgba(192,57,43,0.06)", top: -150, right: -100 }} />
      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
        <div className="fade-up s1" style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 26, letterSpacing: "0.2em", fontWeight: 500, color: T.cream }}>ARCODIC</div>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: T.muted, textTransform: "uppercase", marginTop: 6 }}>Admin Portal</div>
        </div>
        <div className="glass-card fade-up s2" style={{ padding: "40px 36px" }}>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 300, color: T.cream, marginBottom: 8 }}>Restricted Access</h2>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 32 }}>Enter the admin password to access the ARcodic management panel.</p>
          <label className="arc-label">Admin Password</label>
          <input
            className="arc-input"
            type="password"
            placeholder="••••••••••"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ letterSpacing: "0.2em", fontSize: 18 }}
          />
          {error && <div style={{ fontSize: 11, color: "#e74c3c", marginTop: 8, letterSpacing: "0.04em" }}>{error}</div>}
          <button className="btn-primary" onClick={handleLogin} disabled={loading || !pw} style={{ width: "100%", marginTop: 20, padding: "15px 0" }}>
            {loading ? "Verifying..." : "Enter"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
          © 2025 ARcodic. Internal use only.
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [section, setSection] = useState("clients");
  const [clients, setClients] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({ name: "", email: "" });
  const [generatedId, setGeneratedId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const CLIENT_PORTAL_URL = import.meta.env.VITE_CLIENT_PORTAL_URL || "https://arcodic-client.vercel.app";

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([getClients(), getSubmissions()]);
      setClients(c || []);
      setSubmissions(s || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newClient.name || !newClient.email) return;
    setCreating(true);
    const emplid = generateEMPLID();
    try {
      await createClientRecord(newClient.name, newClient.email, emplid);
      setGeneratedId(emplid);
      setNewClient({ name: "", email: "" });
      await load();
    } catch (e) { console.error(e); }
    setCreating(false);
  };

  const handleDelete = async (emplid) => {
    if (!confirm("Remove this client permanently?")) return;
    try {
      await deleteClientRecord(emplid);
      await load();
    } catch (e) { console.error(e); }
  };

  const copyLink = (emplid) => {
    navigator.clipboard?.writeText(`${CLIENT_PORTAL_URL}?id=${emplid}`);
    setCopiedId(emplid);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSubmissionForClient = (emplid) => submissions.find((s) => s.emplid === emplid);

  const navItems = [
    { key: "clients", label: "Client Roster", icon: "◈" },
    { key: "create", label: "New Client", icon: "+" },
    { key: "submissions", label: "Submissions", icon: "◎" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "32px 16px", flexShrink: 0 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 18, letterSpacing: "0.16em", fontWeight: 500, color: T.cream }}>ARCODIC</div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>Admin Panel</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map((item) => (
            <div key={item.key} className={`nav-item ${section === item.key ? "active" : ""}`} onClick={() => { setSection(item.key); setGeneratedId(null); }}>
              <span style={{ fontSize: 13, opacity: 0.5 }}>{item.icon}</span>
              {item.label}
              {item.key === "submissions" && submissions.length > 0 && (
                <span style={{ marginLeft: "auto", background: T.accent, color: "#fff", borderRadius: 100, fontSize: 10, padding: "2px 8px" }}>{submissions.length}</span>
              )}
            </div>
          ))}
        </nav>
        <div style={{ paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
          <button className="btn-ghost" onClick={onLogout} style={{ fontSize: 11, padding: "8px 16px", width: "100%" }}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 48px" }}>

        {/* CLIENT ROSTER */}
        {section === "clients" && (
          <div className="fade-up">
            <div className="arc-label s1 fade-up">Management</div>
            <h1 className="serif s2 fade-up" style={{ fontSize: 40, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 40 }}>Client Roster</h1>
            {loading ? (
              <div style={{ color: T.muted, fontSize: 13 }}>Loading clients...</div>
            ) : clients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="serif-italic" style={{ fontSize: 22, color: T.muted, marginBottom: 8 }}>No clients yet</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Create your first client to get started</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {clients.map((client, i) => {
                  const sub = getSubmissionForClient(client.emplid);
                  return (
                    <div key={client.emplid} className="glass-card fade-up" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 15, color: T.cream, fontWeight: 400 }}>{client.name}</span>
                          <span className={`badge badge-${sub ? "complete" : client.status || "new"}`}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                            {sub ? "submitted" : client.status || "new"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: T.muted }}>{client.email}</span>
                          <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace", letterSpacing: "0.08em" }}>ID: {client.emplid}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                            {new Date(client.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {sub && (
                          <button className="btn-ghost" style={{ fontSize: 11, padding: "8px 14px" }}
                            onClick={() => { setSelectedSubmission(sub); setSelectedClient(client); }}>
                            View Data
                          </button>
                        )}
                        <button className="btn-ghost" style={{ fontSize: 11, padding: "8px 14px" }} onClick={() => copyLink(client.emplid)}>
                          {copiedId === client.emplid ? "Copied ✓" : "Copy Link"}
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(client.emplid)}>Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CREATE CLIENT */}
        {section === "create" && (
          <div className="fade-up">
            <div className="arc-label">New Client</div>
            <h1 className="serif" style={{ fontSize: 40, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 40 }}>Generate Portal</h1>
            <div style={{ maxWidth: 520 }}>
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="arc-label">Client Name / Business</label>
                    <input className="arc-input" placeholder="e.g. Sunset Brands" value={newClient.name}
                      onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="arc-label">Client Email</label>
                    <input className="arc-input" type="email" placeholder="client@business.com" value={newClient.email}
                      onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <button className="btn-primary" onClick={handleCreate} disabled={creating || !newClient.name || !newClient.email} style={{ alignSelf: "flex-start", marginTop: 8 }}>
                    {creating ? "Generating..." : "Generate Client Portal"}
                  </button>
                </div>
              </div>

              {generatedId && (
                <div className="glass-card fade-in" style={{ padding: 28, marginTop: 20, borderColor: "rgba(39,174,96,0.25)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ color: "#27ae60", fontSize: 16 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#27ae60", letterSpacing: "0.08em", textTransform: "uppercase" }}>Portal Created</span>
                  </div>
                  <div className="arc-label">Client EMPLID</div>
                  <div style={{ fontFamily: "monospace", fontSize: 36, letterSpacing: "0.18em", color: T.cream, marginBottom: 20 }}>{generatedId}</div>
                  <div className="arc-label" style={{ marginBottom: 8 }}>Portal Link to Send Client</div>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 2, padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: T.muted, wordBreak: "break-all", marginBottom: 12 }}>
                    {CLIENT_PORTAL_URL}?id={generatedId}
                  </div>
                  <button className="btn-primary" onClick={() => copyLink(generatedId)}>
                    {copiedId === generatedId ? "Copied ✓" : "Copy Link"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBMISSIONS */}
        {section === "submissions" && (
          <div className="fade-up">
            <div className="arc-label">Inbox</div>
            <h1 className="serif" style={{ fontSize: 40, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 40 }}>Client Submissions</h1>
            {loading ? (
              <div style={{ color: T.muted, fontSize: 13 }}>Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div className="serif-italic" style={{ fontSize: 22, color: T.muted, marginBottom: 8 }}>No submissions yet</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Clients haven't submitted their portals yet</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {submissions.map((sub, i) => {
                  const client = clients.find((c) => c.emplid === sub.emplid);
                  const bd = sub.business_data || {};
                  return (
                    <div key={sub.id} className="glass-card fade-up" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 15, color: T.cream, fontWeight: 400 }}>{client?.name || sub.emplid}</span>
                          <span className="badge badge-complete"><span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />submitted</span>
                        </div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: T.muted }}>{bd.businessName || "—"}</span>
                          <span style={{ fontSize: 11, color: T.muted }}>{bd.industry || "—"}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                            {new Date(sub.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button className="btn-primary" style={{ fontSize: 11, padding: "10px 20px" }}
                        onClick={() => { setSelectedSubmission(sub); setSelectedClient(client); }}>
                        View Full Submission
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          client={selectedClient}
          onClose={() => { setSelectedSubmission(null); setSelectedClient(null); }}
        />
      )}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("arc_admin"));

  const handleLogout = () => {
    sessionStorage.removeItem("arc_admin");
    setAuthed(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="noise" style={{ minHeight: "100vh" }}>
        <div className="glow-blob" style={{ width: 600, height: 600, background: "rgba(192,57,43,0.04)", top: -200, right: -150 }} />
        {authed ? <AdminDashboard onLogout={handleLogout} /> : <AdminLogin onAuth={() => setAuthed(true)} />}
      </div>
    </>
  );
}
