import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DESIGN TOKENS — Arcodic DNA
// ============================================================
const T = {
  bg: "#0c0a09",
  bgWarm: "#141210",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",
  cream: "#f0ece4",
  white: "#ffffff",
  muted: "rgba(240,236,228,0.45)",
  accent: "#c0392b",
  accentSoft: "rgba(192,57,43,0.15)",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.10)",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.bg};
    color: ${T.cream};
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  .serif { font-family: 'Cormorant Garamond', serif; }
  .serif-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; }

  /* Noise texture overlay */
  .noise::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* Glass card */
  .glass-card {
    background: ${T.glass};
    border: 1px solid ${T.glassBorder};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .glass-card:hover { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.055); }

  /* Inputs */
  .arc-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 2px;
    padding: 14px 18px;
    color: ${T.cream};
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease, background 0.3s ease;
    letter-spacing: 0.02em;
  }
  .arc-input::placeholder { color: rgba(240,236,228,0.3); }
  .arc-input:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.07); }
  .arc-input:disabled { opacity: 0.4; cursor: not-allowed; }

  textarea.arc-input { resize: vertical; min-height: 100px; }

  /* Buttons */
  .btn-primary {
    background: ${T.cream};
    color: ${T.bg};
    border: none;
    border-radius: 100px;
    padding: 13px 28px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
  }
  .btn-primary:hover { background: ${T.white}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: transparent;
    color: ${T.muted};
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: ${T.cream}; }

  .btn-danger {
    background: rgba(192,57,43,0.15);
    color: #e74c3c;
    border: 1px solid rgba(192,57,43,0.25);
    border-radius: 100px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-danger:hover { background: rgba(192,57,43,0.3); }

  /* Label */
  .arc-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${T.muted};
    display: block;
    margin-bottom: 8px;
  }

  /* Divider */
  .arc-divider {
    width: 100%;
    height: 1px;
    background: ${T.border};
    margin: 32px 0;
  }

  /* Signature canvas */
  .sig-canvas {
    width: 100%;
    height: 160px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 2px;
    cursor: crosshair;
    display: block;
  }

  /* Status badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .badge-pending { background: rgba(240,180,0,0.1); color: #f0b400; border: 1px solid rgba(240,180,0,0.2); }
  .badge-complete { background: rgba(39,174,96,0.1); color: #27ae60; border: 1px solid rgba(39,174,96,0.2); }
  .badge-new { background: rgba(192,57,43,0.1); color: #e74c3c; border: 1px solid rgba(192,57,43,0.2); }

  /* Fade-in animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .fade-in { animation: fadeIn 0.5s ease forwards; }

  .stagger-1 { animation-delay: 0.05s; opacity: 0; }
  .stagger-2 { animation-delay: 0.12s; opacity: 0; }
  .stagger-3 { animation-delay: 0.19s; opacity: 0; }
  .stagger-4 { animation-delay: 0.26s; opacity: 0; }
  .stagger-5 { animation-delay: 0.33s; opacity: 0; }
  .stagger-6 { animation-delay: 0.40s; opacity: 0; }

  /* Progress steps */
  .step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    transition: all 0.4s ease;
  }
  .step-dot.active { background: ${T.cream}; width: 24px; border-radius: 3px; }
  .step-dot.done { background: rgba(39,174,96,0.6); }

  /* Upload zone */
  .upload-zone {
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 2px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255,255,255,0.02);
  }
  .upload-zone:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

  /* Sidebar nav item */
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 13px;
    color: ${T.muted};
    letter-spacing: 0.02em;
    transition: all 0.25s ease;
    border: 1px solid transparent;
  }
  .nav-item:hover { color: ${T.cream}; background: rgba(255,255,255,0.04); }
  .nav-item.active { color: ${T.cream}; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }

  /* Scrollable section */
  .scroll-section { overflow-y: auto; max-height: 60vh; padding-right: 8px; }
  .scroll-section::-webkit-scrollbar { width: 2px; }
  .scroll-section::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); }

  /* Red glow blob */
  .glow-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }

  select.arc-input option { background: #1a1714; color: ${T.cream}; }

  .form-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: ${T.cream};
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${T.border};
  }
`;

// ============================================================
// MOCK DATA STORE
// ============================================================
const generateEMPLID = () => {
  return String(Math.floor(10000000 + Math.random() * 90000000));
};

const initialClients = [
  {
    id: "24680135",
    name: "Sunset Brands",
    email: "client@sunsetbrands.co.za",
    created: "2025-04-10",
    status: "complete",
    data: null,
  },
  {
    id: "87351249",
    name: "Volta Studio",
    email: "hello@voltastudio.io",
    created: "2025-04-18",
    status: "pending",
    data: null,
  },
];

// ============================================================
// LEGAL DOCUMENT TEMPLATES (AI-generated proper legal text)
// ============================================================
const LEGAL_DOCS = {
  sow: {
    title: "Statement of Work",
    short: "SOW",
    content: `STATEMENT OF WORK

This Statement of Work ("SOW") is entered into between ARcodic Digital Studio ("Agency") and the Client identified herein ("Client"), effective upon the date of Client's electronic signature below.

1. SCOPE OF SERVICES
Agency agrees to provide web design, development, and related digital services as mutually agreed upon during the onboarding process. Specific deliverables, timelines, and technical specifications shall be outlined in a separate Project Brief annexed to this agreement.

2. DELIVERABLES
Agency shall deliver: (a) custom website design mockups; (b) fully developed, responsive website; (c) deployment to Client's chosen hosting environment; (d) post-launch support period as agreed.

3. TIMELINE & MILESTONES
The project timeline shall commence upon receipt of all required Client materials, signed agreements, and initial payment. Delays caused by Client's failure to provide timely feedback or materials shall extend the timeline accordingly without penalty to Agency.

4. PAYMENT TERMS
Payment shall be made in accordance with the Payment Terms Agreement executed concurrently. Agency reserves the right to withhold delivery of final files until payment obligations are fulfilled in their entirety.

5. REVISIONS
The SOW includes a reasonable number of revision rounds as agreed. Additional revisions beyond the agreed scope shall be billed at Agency's standard hourly rate.

6. INTELLECTUAL PROPERTY
Upon receipt of full payment, all custom design and code created specifically for Client shall be assigned to Client in accordance with the Copyright Assignment Agreement. Third-party assets, fonts, plugins, and frameworks remain subject to their respective licences.

7. CONFIDENTIALITY
Both parties agree to keep the terms of this SOW and all project-related information confidential and shall not disclose such information to third parties without prior written consent.

8. TERMINATION
Either party may terminate this agreement with 14 days' written notice. In the event of termination, Client shall pay for all work completed to date. Deposits are non-refundable.

9. GOVERNING LAW
This agreement shall be governed by the laws of the Republic of South Africa.

By signing below, Client acknowledges having read, understood, and agreed to all terms of this Statement of Work.`,
  },
  copyright: {
    title: "Copyright Assignment Agreement",
    short: "COPYRIGHT",
    content: `COPYRIGHT ASSIGNMENT AGREEMENT

This Copyright Assignment Agreement ("Agreement") is entered into between ARcodic Digital Studio ("Assignor") and the Client identified herein ("Assignee").

1. ASSIGNMENT OF RIGHTS
Upon full settlement of all outstanding payments, Assignor hereby irrevocably assigns to Assignee all right, title, and interest, including copyright, in and to the original creative works specifically designed and developed for Client under this engagement ("Work"). This assignment includes the right to reproduce, distribute, modify, display, and create derivative works.

2. RETAINED RIGHTS
Assignor expressly retains: (a) the right to display the Work in Agency's portfolio, case studies, and marketing materials; (b) ownership of all pre-existing intellectual property, proprietary frameworks, libraries, tools, and methodologies used in the creation of the Work; (c) ownership of any components not exclusively created for Client.

3. THIRD-PARTY COMPONENTS
The Work may incorporate third-party assets, open-source libraries, stock media, fonts, or plugins, each governed by their own licence terms. Assignee is responsible for ensuring continued compliance with such licences. Assignor makes no representation or warranty regarding third-party licence terms.

4. MORAL RIGHTS
To the fullest extent permitted by law, Assignor waives all moral rights in the Work in favour of Assignee.

5. WARRANTY
Assignor warrants that, to the best of its knowledge, the original elements of the Work do not infringe upon the intellectual property rights of any third party.

6. CONDITION PRECEDENT
This assignment is expressly conditional upon Assignee's full payment of all fees due under the Statement of Work and Payment Terms Agreement. Until such payment is received, all intellectual property rights remain vested in Assignor.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the Republic of South Africa.`,
  },
  nda: {
    title: "Non-Disclosure Agreement",
    short: "NDA",
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between ARcodic Digital Studio ("Agency") and the Client identified herein ("Client"), collectively referred to as the "Parties."

1. PURPOSE
The Parties wish to explore and engage in a business relationship involving web development services. In connection with this relationship, each Party may disclose to the other certain confidential and proprietary information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by either Party, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure. This includes, but is not limited to: business strategies, financial data, client lists, technical specifications, designs, pricing, and trade secrets.

3. OBLIGATIONS
Each Party agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) not disclose Confidential Information to any third party without prior written consent; (c) use Confidential Information solely for purposes of the business relationship; (d) protect Confidential Information using the same degree of care used to protect its own confidential information, but no less than reasonable care.

4. EXCLUSIONS
Obligations do not apply to information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was rightfully known before disclosure; (c) is independently developed without reference to Confidential Information; (d) is required to be disclosed by law or court order.

5. TERM
This Agreement shall remain in effect for a period of three (3) years from the date of last signature.

6. RETURN OF INFORMATION
Upon request, each Party shall promptly return or destroy all Confidential Information of the other Party.

7. REMEDIES
Each Party acknowledges that breach of this Agreement would cause irreparable harm for which monetary damages would be inadequate, and that injunctive relief would be appropriate.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the Republic of South Africa.`,
  },
  payment: {
    title: "Payment Terms Agreement",
    short: "PAYMENT",
    content: `PAYMENT TERMS AGREEMENT

This Payment Terms Agreement ("Agreement") is entered into between ARcodic Digital Studio ("Agency") and the Client identified herein ("Client").

1. DEPOSIT
A non-refundable deposit of fifty percent (50%) of the total project fee is due prior to commencement of any work. No design, development, or creative work shall begin until the deposit is received and cleared.

2. FINAL PAYMENT
The remaining balance shall be due upon project completion and prior to handover of final files, website credentials, or deployment to a live environment.

3. PAYMENT METHODS
Payment shall be made via bank transfer, credit card, or such other method as agreed in writing. All fees are quoted in South African Rand (ZAR) unless otherwise specified.

4. LATE PAYMENT
Invoices not paid within seven (7) days of the due date shall accrue interest at a rate of 2% per month on the outstanding balance. Agency reserves the right to suspend all work and withhold deliverables until overdue amounts are settled.

5. ADDITIONAL WORK
Work requested beyond the agreed scope shall be quoted separately and must be approved by Client in writing before commencement. Additional work is invoiced at Agency's standard rate.

6. DISPUTES
In the event of a payment dispute, Client must notify Agency in writing within five (5) business days of receiving an invoice. Failure to notify shall constitute acceptance of the invoice.

7. TAXES
All fees are exclusive of Value Added Tax (VAT) or other applicable taxes. Client is responsible for all applicable taxes in their jurisdiction.

8. REFUND POLICY
Deposits are strictly non-refundable. In the event of project cancellation by Client after work has commenced, Client shall be liable for the full cost of work completed to the date of cancellation.

9. OWNERSHIP UPON NON-PAYMENT
All deliverables remain the sole property of Agency until full and final payment is received. Agency may pursue all legal remedies available for non-payment.

10. GOVERNING LAW
This Agreement shall be governed by the laws of the Republic of South Africa.`,
  },
  liability: {
    title: "Limitation of Liability",
    short: "LIABILITY",
    content: `LIMITATION OF LIABILITY & INDEMNIFICATION AGREEMENT

This Limitation of Liability and Indemnification Agreement ("Agreement") is entered into between ARcodic Digital Studio ("Agency") and the Client identified herein ("Client").

1. LIMITATION OF LIABILITY
To the maximum extent permitted by applicable law, Agency's total liability to Client for any and all claims arising out of or related to the services provided shall not exceed the total fees paid by Client to Agency in the three (3) months preceding the claim.

2. EXCLUSION OF CONSEQUENTIAL DAMAGES
In no event shall Agency be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of revenue, loss of profits, loss of data, or loss of business opportunity, even if Agency has been advised of the possibility of such damages.

3. CLIENT RESPONSIBILITIES
Client is solely responsible for: (a) providing accurate and complete content, information, and materials; (b) ensuring that all materials provided do not infringe upon third-party rights; (c) compliance with all applicable laws and regulations governing Client's business and website; (d) maintaining appropriate backups after project handover.

4. INDEMNIFICATION
Client agrees to indemnify, defend, and hold harmless Agency, its directors, employees, and contractors from and against any and all claims, damages, losses, costs, and expenses (including reasonable legal fees) arising out of: (a) Client's breach of any agreement with Agency; (b) Client's use of the deliverables; (c) any content provided by Client; (d) Client's violation of any applicable law.

5. FORCE MAJEURE
Agency shall not be liable for delays or failures resulting from circumstances beyond its reasonable control, including but not limited to acts of God, government actions, internet outages, or third-party service failures.

6. DISCLAIMER OF WARRANTIES
Agency provides services "as is" and makes no representations or warranties regarding uptime, security, or fitness for a particular purpose of third-party platforms, hosting services, or plugins.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the Republic of South Africa.`,
  },
};

// ============================================================
// SIGNATURE CANVAS COMPONENT
// ============================================================
function SignatureCanvas({ onSave, saved }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#f0ece4";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stop = () => {
    drawing.current = false;
    onSave(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSave(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="sig-canvas"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
        <button className="btn-ghost" onClick={clear} style={{ fontSize: 11, padding: "8px 16px" }}>
          Clear
        </button>
        {saved && (
          <span style={{ fontSize: 11, color: "#27ae60", letterSpacing: "0.08em" }}>
            ✓ Signature captured
          </span>
        )}
        {!saved && (
          <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.02em" }}>
            Draw your signature above
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// LEGAL DOCUMENT MODAL
// ============================================================
function LegalModal({ doc, onSign, onClose, signed, existingSig }) {
  const [sig, setSig] = useState(existingSig || null);
  const [typedSig, setTypedSig] = useState("");
  const [sigMode, setSigMode] = useState("draw");

  const handleSign = () => {
    const finalSig = sigMode === "draw" ? sig : typedSig;
    if (!finalSig) return;
    onSign(doc.short, finalSig, sigMode);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(16px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", animation: "fadeIn 0.3s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card"
        style={{
          width: "100%", maxWidth: 740,
          maxHeight: "92vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sticky header */}
        <div style={{
          padding: "22px 28px 18px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexShrink: 0,
          background: "rgba(12,10,9,0.95)",
        }}>
          <div>
            <div className="arc-label">Legal Document</div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, color: T.cream, marginTop: 4 }}>{doc.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 4px" }}>×</button>
        </div>

        {/* Single scrollable body — document text + signature together */}
        <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" }}>

          {/* Document text */}
          <div style={{ padding: "28px 28px 0" }}>
            <pre style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              lineHeight: 2,
              color: "rgba(240,236,228,0.82)",
              whiteSpace: "pre-wrap",
              letterSpacing: "0.01em",
            }}>
              {doc.content}
            </pre>
          </div>

          {/* Divider with scroll-cue text */}
          <div style={{ padding: "32px 28px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted, whiteSpace: "nowrap" }}>
                Signature
              </span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>
          </div>

          {/* Signature section — inline after document */}
          <div style={{ padding: "28px 28px 36px" }}>
            {!signed ? (
              <>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.8, marginBottom: 24 }}>
                  By signing below you confirm you have read and understood the full document above and agree to its terms.
                </p>

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <button
                    className={sigMode === "draw" ? "btn-primary" : "btn-ghost"}
                    style={{ fontSize: 12, padding: "10px 20px" }}
                    onClick={() => setSigMode("draw")}
                  >
                    Draw Signature
                  </button>
                  <button
                    className={sigMode === "type" ? "btn-primary" : "btn-ghost"}
                    style={{ fontSize: 12, padding: "10px 20px" }}
                    onClick={() => setSigMode("type")}
                  >
                    Type Signature
                  </button>
                </div>

                {sigMode === "draw" ? (
                  <SignatureCanvas onSave={setSig} saved={!!sig} />
                ) : (
                  <input
                    className="arc-input"
                    placeholder="Type your full legal name"
                    value={typedSig}
                    onChange={(e) => setTypedSig(e.target.value)}
                    style={{ fontFamily: "cursive", fontSize: 22, letterSpacing: "0.05em" }}
                  />
                )}

                <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn-ghost" onClick={onClose}>Cancel</button>
                  <button
                    className="btn-primary"
                    onClick={handleSign}
                    disabled={sigMode === "draw" ? !sig : !typedSig.trim()}
                  >
                    Sign Document
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20, color: "#27ae60" }}>✓</span>
                  <span style={{ color: "#27ae60", fontSize: 13, letterSpacing: "0.04em" }}>Document signed</span>
                </div>
                <button className="btn-ghost" onClick={onClose}>Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ onViewClient }) {
  const [clients, setClients] = useState(initialClients);
  const [newClient, setNewClient] = useState({ name: "", email: "" });
  const [generatedId, setGeneratedId] = useState(null);
  const [adminSection, setAdminSection] = useState("clients");
  const [adminEmail, setAdminEmail] = useState("arcodichq@gmail.com");
  const [isCreating, setIsCreating] = useState(false);

  const createClient = () => {
    if (!newClient.name || !newClient.email) return;
    setIsCreating(true);
    setTimeout(() => {
      const id = generateEMPLID();
      const client = {
        id,
        name: newClient.name,
        email: newClient.email,
        created: new Date().toISOString().split("T")[0],
        status: "new",
        data: null,
      };
      setClients((prev) => [client, ...prev]);
      setGeneratedId(id);
      setNewClient({ name: "", email: "" });
      setIsCreating(false);
    }, 800);
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const navItems = [
    { key: "clients", label: "Client Roster", icon: "◈" },
    { key: "create", label: "New Client", icon: "+" },
    { key: "settings", label: "Settings", icon: "◎" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "32px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div className="arc-label" style={{ marginBottom: 6 }}>Admin Panel</div>
          <div style={{ fontSize: 20, letterSpacing: "0.12em", fontWeight: 500, color: T.cream }}>ARCODIC</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${adminSection === item.key ? "active" : ""}`}
              onClick={() => setAdminSection(item.key)}
            >
              <span style={{ fontSize: 14, opacity: 0.6 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.06em" }}>ARcodic Studio</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>Admin Access</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 48px" }}>
        {adminSection === "clients" && (
          <div className="fade-up">
            <div style={{ marginBottom: 40 }}>
              <div className="arc-label stagger-1 fade-up">Client Management</div>
              <h1 className="serif stagger-2 fade-up" style={{ fontSize: 40, fontWeight: 300, color: T.cream, marginTop: 8 }}>
                Client Roster
              </h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {clients.map((client, i) => (
                <div
                  key={client.id}
                  className="glass-card fade-up"
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    animationDelay: `${i * 0.07}s`,
                    opacity: 0,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, color: T.cream, fontWeight: 400 }}>{client.name}</span>
                      <span className={`badge badge-${client.status}`}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                        {client.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                      <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.04em" }}>{client.email}</span>
                      <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", fontFamily: "monospace" }}>
                        ID: {client.id}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Created {client.created}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: 11, padding: "8px 16px" }}
                      onClick={() => onViewClient(client.id)}
                    >
                      Preview Portal
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => deleteClient(client.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {clients.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
                  <div className="serif-italic" style={{ fontSize: 24, marginBottom: 8 }}>No clients yet</div>
                  <div style={{ fontSize: 13 }}>Create your first client to get started</div>
                </div>
              )}
            </div>
          </div>
        )}

        {adminSection === "create" && (
          <div className="fade-up">
            <div style={{ marginBottom: 40 }}>
              <div className="arc-label">Client Management</div>
              <h1 className="serif" style={{ fontSize: 40, fontWeight: 300, color: T.cream, marginTop: 8 }}>
                New Client
              </h1>
            </div>

            <div style={{ maxWidth: 520 }}>
              <div className="glass-card" style={{ padding: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="arc-label">Client Name / Business</label>
                    <input
                      className="arc-input"
                      placeholder="e.g. Sunset Brands"
                      value={newClient.name}
                      onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="arc-label">Client Email</label>
                    <input
                      className="arc-input"
                      type="email"
                      placeholder="client@business.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <button
                    className="btn-primary"
                    onClick={createClient}
                    disabled={isCreating || !newClient.name || !newClient.email}
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                  >
                    {isCreating ? "Generating..." : "Generate Client Portal"}
                  </button>
                </div>
              </div>

              {generatedId && (
                <div
                  className="glass-card fade-up"
                  style={{ padding: 28, marginTop: 20, border: "1px solid rgba(39,174,96,0.25)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ color: "#27ae60", fontSize: 16 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#27ae60", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Portal Created
                    </span>
                  </div>
                  <div className="arc-label">Client EMPLID</div>
                  <div style={{
                    fontFamily: "monospace",
                    fontSize: 32,
                    letterSpacing: "0.15em",
                    color: T.cream,
                    marginBottom: 16,
                  }}>
                    {generatedId}
                  </div>
                  <div className="arc-label" style={{ marginBottom: 8 }}>Portal Link to Share</div>
                  <div style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${T.border}`,
                    borderRadius: 2,
                    padding: "12px 16px",
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: T.muted,
                    wordBreak: "break-all",
                  }}>
                    https://portal.arcodic.com/?id={generatedId}
                  </div>
                  <button
                    className="btn-ghost"
                    style={{ marginTop: 12, fontSize: 11 }}
                    onClick={() => navigator.clipboard?.writeText(`https://portal.arcodic.com/?id=${generatedId}`)}
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {adminSection === "settings" && (
          <div className="fade-up">
            <div style={{ marginBottom: 40 }}>
              <div className="arc-label">Configuration</div>
              <h1 className="serif" style={{ fontSize: 40, fontWeight: 300, color: T.cream, marginTop: 8 }}>
                Settings
              </h1>
            </div>
            <div style={{ maxWidth: 520 }}>
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, letterSpacing: "0.08em", color: T.muted, textTransform: "uppercase", marginBottom: 20 }}>
                    Notifications
                  </h3>
                  <label className="arc-label">Summary Email Recipient</label>
                  <input
                    className="arc-input"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>
                    PDF summaries will be sent here when a client completes their portal.
                  </div>
                </div>
                <div className="arc-divider" />
                <div>
                  <h3 style={{ fontSize: 13, letterSpacing: "0.08em", color: T.muted, textTransform: "uppercase", marginBottom: 20 }}>
                    Branding
                  </h3>
                  <div style={{ fontSize: 13, color: T.muted }}>
                    Portal uses Arcodic brand identity. Connect Supabase to enable full data persistence.
                  </div>
                </div>
                <button className="btn-primary" style={{ marginTop: 24 }}>Save Settings</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CLIENT PORTAL
// ============================================================
function ClientPortal({ prefilledId }) {
  const [step, setStep] = useState("auth"); // auth | dashboard
  const [clientId, setClientId] = useState(prefilledId || "");
  const [authError, setAuthError] = useState("");
  const [activeSection, setActiveSection] = useState("business");
  const [completedSections, setCompletedSections] = useState([]);

  // Form data
  const [businessData, setBusinessData] = useState({
    businessName: "", tagline: "", description: "",
    industry: "", website: "", phone: "", address: "",
    primaryColor: "", secondaryColor: "", style: "",
    logo: null, logoName: "",
  });

  const [projectData, setProjectData] = useState({
    projectType: "", pages: "", features: "",
    inspiration: "", competitors: "", deadline: "", budget: "",
    assets: null, assetsName: "",
  });

  const [signatures, setSignatures] = useState({});
  const [activeModal, setActiveModal] = useState(null);

  const VALID_IDS = ["24680135", "87351249", ...initialClients.map((c) => c.id)];

  const handleAuth = () => {
    if (clientId.length !== 8 || !/^\d+$/.test(clientId)) {
      setAuthError("Please enter a valid 8-digit EMPLID.");
      return;
    }
    setAuthError("");
    setStep("dashboard");
  };

  const handleSign = (docKey, sig, mode) => {
    setSignatures((prev) => ({ ...prev, [docKey]: { sig, mode, date: new Date().toLocaleDateString() } }));
    setActiveModal(null);
  };

  const markComplete = (section) => {
    if (!completedSections.includes(section)) {
      setCompletedSections((prev) => [...prev, section]);
    }
  };

  const allDocsSigned = Object.keys(LEGAL_DOCS).every((k) => signatures[LEGAL_DOCS[k].short]);
  const totalProgress = Math.round(
    ((completedSections.length / 3) * 50 + (Object.keys(signatures).length / 5) * 50)
  );

  const navItems = [
    { key: "business", label: "Business Info", icon: "◈", required: true },
    { key: "project", label: "Project Brief", icon: "◎", required: true },
    { key: "documents", label: "Legal Documents", icon: "◻", required: true },
    { key: "assets", label: "Assets & Uploads", icon: "⊞" },
    { key: "review", label: "Review & Submit", icon: "→" },
  ];

  // ---- AUTH SCREEN ----
  if (step === "auth") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: 24,
        }}
      >
        {/* Blobs */}
        <div className="glow-blob" style={{ width: 500, height: 500, background: "rgba(192,57,43,0.06)", top: -100, right: -100 }} />
        <div className="glow-blob" style={{ width: 300, height: 300, background: "rgba(240,236,228,0.03)", bottom: -50, left: 100 }} />

        <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div className="fade-up stagger-1" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 28, letterSpacing: "0.2em", fontWeight: 500, color: T.cream, marginBottom: 6 }}>
              ARCODIC
            </div>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", color: T.muted, textTransform: "uppercase" }}>
              Client Portal
            </div>
          </div>

          <div className="glass-card fade-up stagger-2" style={{ padding: "40px 36px" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="serif fade-up stagger-3" style={{ fontSize: 28, fontWeight: 300, color: T.cream, marginBottom: 8 }}>
                Welcome.
              </h2>
              <p className="fade-up stagger-4" style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>
                Enter your 8-digit EMPLID to access your personal onboarding portal.
              </p>
            </div>

            <div className="fade-up stagger-5">
              <label className="arc-label">Your EMPLID</label>
              <input
                className="arc-input"
                placeholder="00000000"
                maxLength={8}
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value.replace(/\D/g, "").slice(0, 8));
                  setAuthError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                style={{ textAlign: "center", fontSize: 24, letterSpacing: "0.3em", fontFamily: "monospace" }}
              />
              {authError && (
                <div style={{ fontSize: 11, color: "#e74c3c", marginTop: 8, letterSpacing: "0.04em" }}>
                  {authError}
                </div>
              )}
            </div>

            <button
              className="btn-primary fade-up stagger-6"
              onClick={handleAuth}
              style={{ width: "100%", marginTop: 24, padding: "15px 0", fontSize: 13, letterSpacing: "0.08em" }}
            >
              Access Portal
            </button>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.8 }}>
                Don't have an EMPLID? Contact your ARcodic representative at{" "}
                <span style={{ color: T.muted }}>hello@arcodic.com</span>
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
            © 2025 ARcodic. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  // ---- DASHBOARD ----
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: 256,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "32px 16px",
        flexShrink: 0,
      }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 18, letterSpacing: "0.14em", fontWeight: 500, color: T.cream }}>ARCODIC</div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.1em", marginTop: 3, textTransform: "uppercase" }}>
            Client Portal
          </div>
        </div>

        {/* Progress */}
        <div className="glass-card" style={{ padding: "16px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Progress</span>
            <span style={{ fontSize: 11, color: T.cream }}>{totalProgress}%</span>
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1 }}>
            <div style={{
              height: "100%",
              width: `${totalProgress}%`,
              background: T.cream,
              borderRadius: 1,
              transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span style={{ fontSize: 12, opacity: 0.5 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {completedSections.includes(item.key) && (
                <span style={{ fontSize: 10, color: "#27ae60" }}>✓</span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            Your ID
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: "0.12em", color: T.cream }}>
            {clientId}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 52px" }}>

        {/* ── BUSINESS INFO ── */}
        {activeSection === "business" && (
          <div className="fade-up">
            <div className="arc-label stagger-1 fade-up">Step 1 of 4</div>
            <h1 className="serif stagger-2 fade-up" style={{ fontSize: 42, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 8 }}>
              Tell us about your business.
            </h1>
            <p className="stagger-3 fade-up" style={{ fontSize: 14, color: T.muted, marginBottom: 40, lineHeight: 1.7 }}>
              This helps us understand who you are and craft a website that truly represents your brand.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 720 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Business Name *</label>
                <input className="arc-input" placeholder="e.g. Sunset Brands (Pty) Ltd"
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData((p) => ({ ...p, businessName: e.target.value }))} />
              </div>
              <div>
                <label className="arc-label">Tagline / Slogan</label>
                <input className="arc-input" placeholder="e.g. Built to perform"
                  value={businessData.tagline}
                  onChange={(e) => setBusinessData((p) => ({ ...p, tagline: e.target.value }))} />
              </div>
              <div>
                <label className="arc-label">Industry</label>
                <select className="arc-input" value={businessData.industry}
                  onChange={(e) => setBusinessData((p) => ({ ...p, industry: e.target.value }))}>
                  <option value="">Select industry</option>
                  <option>Hospitality</option><option>Retail</option><option>Technology</option>
                  <option>Healthcare</option><option>Finance</option><option>Real Estate</option>
                  <option>Food & Beverage</option><option>Beauty & Wellness</option>
                  <option>Education</option><option>Creative / Arts</option><option>Other</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Business Description *</label>
                <textarea className="arc-input" placeholder="Describe your business, what you offer, and who your customers are..."
                  value={businessData.description}
                  onChange={(e) => setBusinessData((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label className="arc-label">Current Website (if any)</label>
                <input className="arc-input" placeholder="https://yourdomain.com"
                  value={businessData.website}
                  onChange={(e) => setBusinessData((p) => ({ ...p, website: e.target.value }))} />
              </div>
              <div>
                <label className="arc-label">Phone Number</label>
                <input className="arc-input" placeholder="+27 xx xxx xxxx"
                  value={businessData.phone}
                  onChange={(e) => setBusinessData((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Business Address</label>
                <input className="arc-input" placeholder="123 Main Street, City, Province"
                  value={businessData.address}
                  onChange={(e) => setBusinessData((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="arc-label">Primary Brand Colour</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="arc-input" placeholder="#000000"
                    value={businessData.primaryColor}
                    onChange={(e) => setBusinessData((p) => ({ ...p, primaryColor: e.target.value }))}
                    style={{ flex: 1 }} />
                  <input type="color" value={businessData.primaryColor || "#000000"}
                    onChange={(e) => setBusinessData((p) => ({ ...p, primaryColor: e.target.value }))}
                    style={{ width: 46, height: 46, border: "none", background: "none", cursor: "pointer", borderRadius: 2 }} />
                </div>
              </div>
              <div>
                <label className="arc-label">Secondary Brand Colour</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="arc-input" placeholder="#ffffff"
                    value={businessData.secondaryColor}
                    onChange={(e) => setBusinessData((p) => ({ ...p, secondaryColor: e.target.value }))}
                    style={{ flex: 1 }} />
                  <input type="color" value={businessData.secondaryColor || "#ffffff"}
                    onChange={(e) => setBusinessData((p) => ({ ...p, secondaryColor: e.target.value }))}
                    style={{ width: 46, height: 46, border: "none", background: "none", cursor: "pointer", borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Design Style / Aesthetic</label>
                <select className="arc-input" value={businessData.style}
                  onChange={(e) => setBusinessData((p) => ({ ...p, style: e.target.value }))}>
                  <option value="">Select a style direction</option>
                  <option>Minimal & Clean</option><option>Bold & Editorial</option>
                  <option>Luxury & Premium</option><option>Playful & Energetic</option>
                  <option>Corporate & Professional</option><option>Dark & Moody</option>
                  <option>Organic & Natural</option><option>Futuristic / Tech</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
              <button
                className="btn-primary"
                onClick={() => { markComplete("business"); setActiveSection("project"); }}
                disabled={!businessData.businessName || !businessData.description}
              >
                Save & Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── PROJECT BRIEF ── */}
        {activeSection === "project" && (
          <div className="fade-up">
            <div className="arc-label">Step 2 of 4</div>
            <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 8 }}>
              Your project brief.
            </h1>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 40, lineHeight: 1.7 }}>
              The more detail you provide, the better we can build exactly what you envision.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 720 }}>
              <div>
                <label className="arc-label">Project Type *</label>
                <select className="arc-input" value={projectData.projectType}
                  onChange={(e) => setProjectData((p) => ({ ...p, projectType: e.target.value }))}>
                  <option value="">Select type</option>
                  <option>Brand Website</option><option>E-commerce Store</option>
                  <option>Portfolio / Showcase</option><option>Landing Page</option>
                  <option>Web Application</option><option>Booking / Reservation System</option>
                  <option>Blog / Editorial</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="arc-label">Number of Pages</label>
                <select className="arc-input" value={projectData.pages}
                  onChange={(e) => setProjectData((p) => ({ ...p, pages: e.target.value }))}>
                  <option value="">Select</option>
                  <option>1-3 pages</option><option>4-7 pages</option>
                  <option>8-15 pages</option><option>15+ pages</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Features & Functionality *</label>
                <textarea className="arc-input" placeholder="e.g. Contact form, booking system, gallery, blog, e-commerce, user accounts, animations..."
                  value={projectData.features}
                  onChange={(e) => setProjectData((p) => ({ ...p, features: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Design Inspiration</label>
                <textarea className="arc-input" style={{ minHeight: 80 }}
                  placeholder="Share links or names of websites you love. What draws you to them?"
                  value={projectData.inspiration}
                  onChange={(e) => setProjectData((p) => ({ ...p, inspiration: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="arc-label">Competitor Websites</label>
                <textarea className="arc-input" style={{ minHeight: 80 }}
                  placeholder="Links to competitor websites — so we know what to distinguish you from."
                  value={projectData.competitors}
                  onChange={(e) => setProjectData((p) => ({ ...p, competitors: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setActiveSection("business")}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => { markComplete("project"); setActiveSection("documents"); }}
                disabled={!projectData.projectType || !projectData.features}
              >
                Save & Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── LEGAL DOCUMENTS ── */}
        {activeSection === "documents" && (
          <div className="fade-up">
            <div className="arc-label">Step 3 of 4</div>
            <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 8 }}>
              Legal agreements.
            </h1>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 40, lineHeight: 1.7 }}>
              Please read and sign each document. All signatures are legally binding.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 680 }}>
              {Object.entries(LEGAL_DOCS).map(([key, doc], i) => {
                const isSigned = !!signatures[doc.short];
                return (
                  <div
                    key={key}
                    className="glass-card fade-up"
                    style={{
                      padding: "22px 28px",
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      animationDelay: `${i * 0.08}s`,
                      opacity: 0,
                      borderColor: isSigned ? "rgba(39,174,96,0.2)" : T.glassBorder,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, color: T.cream, fontWeight: 400 }}>{doc.title}</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.06em" }}>
                        {isSigned
                          ? `Signed ${signatures[doc.short].date} · ${signatures[doc.short].mode === "draw" ? "Drawn signature" : "Typed signature"}`
                          : "Click to read and sign this document"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {isSigned && <span style={{ color: "#27ae60", fontSize: 18 }}>✓</span>}
                      <button
                        className={isSigned ? "btn-ghost" : "btn-primary"}
                        style={{ fontSize: 11, padding: "10px 20px" }}
                        onClick={() => setActiveModal(key)}
                      >
                        {isSigned ? "View" : "Read & Sign"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setActiveSection("project")}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => { markComplete("documents"); setActiveSection("assets"); }}
                disabled={!allDocsSigned}
              >
                {allDocsSigned ? "All Signed — Continue →" : `Sign All Documents to Continue (${Object.keys(signatures).length}/${Object.keys(LEGAL_DOCS).length})`}
              </button>
            </div>
          </div>
        )}

        {/* ── ASSETS ── */}
        {activeSection === "assets" && (
          <div className="fade-up">
            <div className="arc-label">Step 4 of 4</div>
            <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 8 }}>
              Assets & uploads.
            </h1>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 40, lineHeight: 1.7 }}>
              Upload your logo, brand assets, images, and any files you'd like us to incorporate.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 680 }}>
              <div className="glass-card" style={{ padding: 28 }}>
                <div className="form-section-title">Logo</div>
                <div
                  className="upload-zone"
                  onClick={() => document.getElementById("logo-upload").click()}
                >
                  <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>⊞</div>
                  <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>
                    {businessData.logoName || "Drop your logo here, or click to browse"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                    PNG, SVG, AI, PDF — max 20MB
                  </div>
                  <input id="logo-upload" type="file" accept=".png,.svg,.ai,.pdf,.jpg,.jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) setBusinessData((p) => ({ ...p, logo: f, logoName: f.name }));
                    }} />
                </div>
                {businessData.logoName && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "#27ae60", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>✓</span> {businessData.logoName}
                  </div>
                )}
              </div>

              <div className="glass-card" style={{ padding: 28 }}>
                <div className="form-section-title">Brand Assets & Additional Files</div>
                <div
                  className="upload-zone"
                  onClick={() => document.getElementById("assets-upload").click()}
                >
                  <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>⊞</div>
                  <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>
                    {projectData.assetsName || "Images, brand guidelines, content, etc."}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                    Multiple files accepted — ZIP for large collections
                  </div>
                  <input id="assets-upload" type="file" multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length) setProjectData((p) => ({ ...p, assetsName: files.map((f) => f.name).join(", ") }));
                    }} />
                </div>
                {projectData.assetsName && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "#27ae60", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>✓</span> {projectData.assetsName}
                  </div>
                )}
              </div>

              <div className="glass-card" style={{ padding: 28 }}>
                <div className="form-section-title">Additional Notes</div>
                <label className="arc-label">Anything else we should know?</label>
                <textarea className="arc-input" style={{ minHeight: 120 }}
                  placeholder="Special requirements, access credentials for existing platforms, domain registrar details, hosting preferences..." />
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={() => setActiveSection("documents")}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => { markComplete("assets"); setActiveSection("review"); }}
              >
                Continue to Review →
              </button>
            </div>
          </div>
        )}

        {/* ── REVIEW & SUBMIT ── */}
        {activeSection === "review" && (
          <div className="fade-up">
            <div className="arc-label">Final Step</div>
            <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, color: T.cream, marginTop: 8, marginBottom: 8 }}>
              Review & submit.
            </h1>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 40, lineHeight: 1.7 }}>
              Everything looks good? Submit your onboarding and we'll be in touch within 2 hours.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720, marginBottom: 40 }}>
              {[
                { label: "Business Info", section: "business", done: completedSections.includes("business") },
                { label: "Project Brief", section: "project", done: completedSections.includes("project") },
                { label: "Legal Documents", section: "documents", done: allDocsSigned },
                { label: "Assets & Uploads", section: "assets", done: completedSections.includes("assets") },
              ].map((item) => (
                <div
                  key={item.section}
                  className="glass-card"
                  style={{
                    padding: "20px 24px",
                    borderColor: item.done ? "rgba(39,174,96,0.2)" : T.glassBorder,
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveSection(item.section)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: T.cream }}>{item.label}</span>
                    <span style={{ fontSize: 16, color: item.done ? "#27ae60" : "rgba(255,255,255,0.2)" }}>
                      {item.done ? "✓" : "○"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                    {item.done ? "Complete" : "Tap to complete"}
                  </div>
                </div>
              ))}
            </div>

            {businessData.businessName && (
              <div className="glass-card" style={{ padding: 28, maxWidth: 720, marginBottom: 32 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 20 }}>
                  Submission Summary
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    ["Business", businessData.businessName],
                    ["Industry", businessData.industry || "—"],
                    ["Project Type", projectData.projectType || "—"],
                    ["Timeline", projectData.deadline || "—"],
                    ["Documents Signed", `${Object.keys(signatures).length} / ${Object.keys(LEGAL_DOCS).length}`],
                    ["Logo Uploaded", businessData.logoName ? "Yes" : "No"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="arc-label">{label}</div>
                      <div style={{ fontSize: 13, color: T.cream }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn-primary"
              style={{ padding: "16px 40px", fontSize: 14, letterSpacing: "0.06em" }}
              onClick={() => alert("✓ Submitted! ARcodic will contact you within 2 hours.")}
              disabled={!completedSections.includes("business") || !completedSections.includes("project") || !allDocsSigned}
            >
              Submit Onboarding →
            </button>
            {(!completedSections.includes("business") || !completedSections.includes("project") || !allDocsSigned) && (
              <div style={{ fontSize: 11, color: T.muted, marginTop: 12, letterSpacing: "0.04em" }}>
                Complete Business Info, Project Brief, and all Legal Documents to submit.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legal modal */}
      {activeModal && (
        <LegalModal
          doc={LEGAL_DOCS[activeModal]}
          onSign={handleSign}
          onClose={() => setActiveModal(null)}
          signed={!!signatures[LEGAL_DOCS[activeModal].short]}
          existingSig={signatures[LEGAL_DOCS[activeModal]?.short]?.sig}
        />
      )}
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [view, setView] = useState("landing"); // landing | admin | client
  const [previewClientId, setPreviewClientId] = useState(null);

  const handleViewClient = (id) => {
    setPreviewClientId(id);
    setView("client");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="noise" style={{ minHeight: "100vh" }}>

        {/* Ambient background blobs */}
        <div className="glow-blob" style={{ width: 600, height: 600, background: "rgba(192,57,43,0.05)", top: -200, right: -150 }} />
        <div className="glow-blob" style={{ width: 400, height: 400, background: "rgba(240,236,228,0.02)", bottom: 100, left: -100 }} />

        {view === "landing" && (
          <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            position: "relative",
            zIndex: 1,
          }}>
            <div style={{ textAlign: "center", maxWidth: 560 }}>
              <div className="arc-label fade-up stagger-1" style={{ marginBottom: 20 }}>
                Digital Studio — South Africa
              </div>
              <h1 className="serif fade-up stagger-2" style={{ fontSize: 72, fontWeight: 300, lineHeight: 1.05, color: T.cream, marginBottom: 8 }}>
                ARCODIC
              </h1>
              <p className="serif-italic fade-up stagger-3" style={{ fontSize: 26, color: T.muted, marginBottom: 48 }}>
                Client Portal System
              </p>

              <div className="fade-up stagger-4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => setView("admin")} style={{ padding: "15px 32px" }}>
                  Admin Panel
                </button>
                <button className="btn-ghost" onClick={() => setView("client")} style={{ padding: "15px 32px" }}>
                  Client Portal
                </button>
              </div>

              <p className="fade-up stagger-5" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 48, letterSpacing: "0.06em" }}>
                © 2025 ARcodic. Built fast, built right.
              </p>
            </div>
          </div>
        )}

        {view === "admin" && (
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ position: "fixed", top: 20, right: 24, zIndex: 100 }}>
              <button className="btn-ghost" onClick={() => setView("landing")} style={{ fontSize: 11, padding: "8px 16px" }}>
                ← Exit
              </button>
            </div>
            <AdminPanel onViewClient={handleViewClient} />
          </div>
        )}

        {view === "client" && (
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ position: "fixed", top: 20, right: 24, zIndex: 100 }}>
              <button className="btn-ghost" onClick={() => { setView("landing"); setPreviewClientId(null); }} style={{ fontSize: 11, padding: "8px 16px" }}>
                ← Exit
              </button>
            </div>
            <ClientPortal prefilledId={previewClientId} />
          </div>
        )}
      </div>
    </>
  );
}
