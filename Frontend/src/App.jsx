import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { ShieldAlert, RotateCcw, Activity, Network, CheckCircle2, Bot } from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────
const ticketsData = [
  { month: "Jan", solved: 35, created: 28 },
  { month: "Feb", solved: 45, created: 38 },
  { month: "Mar", solved: 42, created: 50 },
  { month: "Apr", solved: 68, created: 55 },
  { month: "May", solved: 58, created: 62 },
  { month: "Jun", solved: 72, created: 65 },
  { month: "Jul", solved: 78, created: 70 },
];
const resolveTimeData = [
  { t: "1", v: 4.5 }, { t: "2", v: 3.8 }, { t: "3", v: 5.2 },
  { t: "4", v: 2.5 }, { t: "5", v: 3.1 }, { t: "6", v: 4.0 }, { t: "7", v: 2.8 },
];
const weekDayData = [
  { day: "Mon", tickets: 45 }, { day: "Tue", tickets: 18 },
  { day: "Wed", tickets: 72 }, { day: "Thu", tickets: 85 },
  { day: "Fri", tickets: 95 }, { day: "Sat", tickets: 62 },
];
const ticketsByType = [
  { name: "Sales",    value: 44, color: "#00d4ff" },
  { name: "Setup",    value: 25, color: "#4fc3f7" },
  { name: "Bug",      value: 12, color: "#0288d1" },
  { name: "Features", value: 19, color: "#0052cc" },
];
const returnedTickets = [
  { name: "New Tickets",      value: 38.2, color: "#e040fb" },
  { name: "Returned Tickets", value: 61.8, color: "#aa00ff" },
];
const mttrTrend = [
  { d: "D1", v: 67 }, { d: "D2", v: 55 }, { d: "D3", v: 42 },
  { d: "D4", v: 38 }, { d: "D5", v: 29 }, { d: "D6", v: 15 }, { d: "D7", v: 8 },
];
const cpuData = [
  { svc: "API GW",    prod: 72, batch: 15 },
  { svc: "Order",     prod: 88, batch: 8  },
  { svc: "Payment",   prod: 65, batch: 20 },
  { svc: "Auth",      prod: 55, batch: 12 },
  { svc: "Service D", prod: 0,  batch: 0  },
  { svc: "DB",        prod: 45, batch: 30 },
];
const historyData = [
  { id: "INC-047", sim: 94, fix: "Rollback", outcome: "Auto-healed", color: "#22c55e", daysAgo: "2 days ago" },
  { id: "INC-039", sim: 61, fix: "Scale-up", outcome: "Auto-healed", color: "#22c55e", daysAgo: "5 days ago" },
  { id: "INC-031", sim: 38, fix: "—",         outcome: "Escalated",  color: "#3b82f6", daysAgo: "8 days ago" },
];

// ── NAV ───────────────────────────────────────────────────────────────
const navSections = [
  { key: "overview",  label: "OVERVIEW",  icon: "🖥️",
    items: ["System Overview", "Service Graphs"] },
  { key: "agents",    label: "AGENTS",    icon: "🤖",
    items: ["Agent Pipeline", "AI Decisions", "Actions Log"] },
  { key: "incidents", label: "INCIDENTS", icon: "🚨",
    items: ["Active Incidents", "Service Dependency", "Alerts"] },
  { key: "resources", label: "RESOURCES", icon: "⚡",
    items: ["Resource Optimizations", "History"] },
];

// ─────────────────────────────────────────────────────────────────────
// SECTION 1 — AGENT PIPELINE BANNER (always pinned at top)
// ─────────────────────────────────────────────────────────────────────
function AgentPipeline() {
  const [eta, setEta] = useState(20);
  const [elapsed, setElapsed] = useState(42);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const t = setInterval(() => {
      setEta(p => Math.max(0, p - 1));
      setElapsed(p => p + 1);
      setDots(p => (p.length >= 3 ? "." : p + "."));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const agents = [
    {
      id: "observer", label: "Observer", status: "DONE", icon: "✓",
      statusColor: "#22c55e", glowColor: "rgba(34,197,94,0.2)",
      detail: "anomaly flagged · memory spike",
      sub: `${elapsed}s ago`,
      pulse: false,
    },
    {
      id: "diagnostician", label: "Diagnostician", status: "ACTIVE", icon: "◉",
      statusColor: "#a855f7", glowColor: "rgba(168,85,247,0.35)",
      detail: "querying logs + traces",
      sub: `Claude Sonnet reasoning${dots}`,
      pulse: true,
    },
    {
      id: "executor", label: "Executor", status: "IDLE", icon: "○",
      statusColor: "#64748b", glowColor: "rgba(100,116,139,0.12)",
      detail: "awaiting diagnosis",
      sub: "on standby",
      pulse: false,
    },
  ];

  return (
    <div className="pipeline-banner">
      <div className="pipeline-header">
        <span className="pipeline-title">AGENT PIPELINE</span>
        <span className="pipeline-live">
          <span className="live-dot" /> LIVE
        </span>
      </div>

      <div className="pipeline-agents">
        {agents.map((agent, i) => (
          <div key={agent.id} style={{ display:"flex", alignItems:"center", flex:1, minWidth:0 }}>
            <div
              className={`agent-pill${agent.pulse ? " agent-pulse" : ""}`}
              style={{ "--glow": agent.glowColor, "--border-color": agent.statusColor }}
            >
              <div className="agent-pill-top">
                <span className="agent-icon" style={{ color: agent.statusColor }}>{agent.icon}</span>
                <span className="agent-label">{agent.label}</span>
                <span className="agent-status-badge"
                  style={{ background: agent.statusColor + "22", color: agent.statusColor }}>
                  {agent.pulse && <span className="pulse-dot" style={{ background: agent.statusColor }} />}
                  {agent.status}
                </span>
              </div>
              <div className="agent-detail">{agent.detail}</div>
              <div className="agent-sub">{agent.sub}</div>
            </div>
            {i < agents.length - 1 && (
              <div className="pipeline-arrow">
                <div className="arrow-line" />
                <span className="arrow-head">›</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pipeline-narrative">
        "Anomaly detected {elapsed}s ago · LLM identifying root cause · ETA ~{eta}s"
      </div>
      <div className="pipeline-progress-track">
        <div className="progress-segment seg-done" />
        <div className="progress-segment seg-active" />
        <div className="progress-segment seg-idle" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SECTION 2 — ACTIVE INCIDENT + AI DECISION (side by side)
// Shared component used by both "Active Incidents" and "AI Decisions" nav items
// ─────────────────────────────────────────────────────────────────────
function IncidentAndDecisionPanel() {
  const [conf, setConf] = useState(0);
  const [actionStatus, setActionStatus] = useState("PENDING");

  useEffect(() => {
    const t = setTimeout(() => setConf(91), 400);
    return () => clearTimeout(t);
  }, []);

  const cycleStatus = () =>
    setActionStatus(s => (s === "PENDING" ? "EXECUTED" : s === "EXECUTED" ? "FAILED" : "PENDING"));

  const statusStyle = {
    PENDING:  { bg:"rgba(168,85,247,0.2)", color:"#a855f7", border:"rgba(168,85,247,0.35)" },
    EXECUTED: { bg:"rgba(34,197,94,0.2)",  color:"#22c55e", border:"rgba(34,197,94,0.35)"  },
    FAILED:   { bg:"rgba(239,68,68,0.2)",  color:"#ef4444", border:"rgba(239,68,68,0.35)"  },
  }[actionStatus];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

      {/* ── LEFT: Active Incident ── */}
      <div className="chart-card" style={{ border:"1px solid rgba(239,68,68,0.45)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{
              fontSize:17, fontWeight:700, color:"#f1f5f9",
              fontFamily:"Rajdhani,sans-serif", lineHeight:1.25, marginBottom:6,
            }}>
              Service D — memory leak detected
            </div>
            <div style={{ fontSize:12, color:"#8892a4" }}>
              Root cause: Memory leak post v2.3.1 deployment
            </div>
          </div>
          <span className="status-badge red" style={{ marginLeft:14, flexShrink:0, marginTop:2 }}>HIGH</span>
        </div>

        {/* Blast radius */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
          <span style={{ fontSize:12, color:"#8892a4" }}>Blast radius:</span>
          <span style={{
            fontSize:12, fontWeight:700, padding:"4px 14px", borderRadius:20,
            background:"rgba(245,158,11,0.14)", color:"#f59e0b",
            border:"1px solid rgba(245,158,11,0.28)", fontFamily:"Rajdhani,sans-serif",
          }}>3 services affected</span>
        </div>

        {/* Confidence bar */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
            <span style={{ fontSize:12, color:"#8892a4", fontFamily:"Rajdhani,sans-serif" }}>AI Confidence Score</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#22c55e", fontFamily:"Rajdhani,sans-serif" }}>{conf}%</span>
          </div>
          <div style={{ height:10, background:"rgba(255,255,255,0.07)", borderRadius:6, overflow:"hidden" }}>
            <div style={{
              width:`${conf}%`, height:"100%",
              background:"linear-gradient(90deg,#22c55e,#4ade80)",
              borderRadius:6,
              transition:"width 1.6s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>

        {/* Blast radius graph */}
        <div style={{ marginBottom:24 }}>
          <div style={{
            fontSize:10, color:"#4a5568", fontFamily:"Rajdhani,sans-serif",
            letterSpacing:1.2, textTransform:"uppercase", marginBottom:10,
          }}>Blast Radius Graph</div>
          <div style={{
            border:"1px solid rgba(239,68,68,0.22)",
            borderRadius:12,
            background:"radial-gradient(circle at center, rgba(239,68,68,0.12), rgba(17,24,39,0.3) 55%, rgba(17,24,39,0.08) 100%)",
            padding:10,
            overflow:"hidden",
          }}>
            <svg viewBox="0 0 520 300" width="100%" height="220" role="img" aria-label="Blast radius showing Service D isolated from healthy services">
              <defs>
                <radialGradient id="failGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="260" cy="150" r="112" fill="none" stroke="rgba(239,68,68,0.35)" strokeDasharray="8 7" strokeWidth="2" />
              <circle cx="260" cy="150" r="136" fill="none" stroke="rgba(148,163,184,0.2)" strokeDasharray="4 8" strokeWidth="1" />

              {[{ x:115, y:72, label:"Auth" }, { x:410, y:72, label:"Payments" }, { x:105, y:232, label:"Dashboard" }, { x:420, y:232, label:"Notifs" }].map((n, i) => (
                <g key={i}>
                  <line x1="260" y1="150" x2={n.x} y2={n.y} stroke="rgba(100,116,139,0.35)" strokeWidth="1.5" />
                  <circle cx={n.x} cy={n.y} r="35" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="2" />
                  <text x={n.x} y={n.y + 4} fill="#86efac" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Rajdhani,sans-serif">{n.label}</text>
                </g>
              ))}

              <circle cx="260" cy="150" r="52" fill="url(#failGlow)" />
              <circle cx="260" cy="150" r="40" fill="rgba(127,29,29,0.5)" stroke="#ef4444" strokeWidth="3" />
              <text x="260" y="146" fill="#fca5a5" fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="Rajdhani,sans-serif">Service D</text>
              <text x="260" y="166" fill="#ef4444" fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="Rajdhani,sans-serif">FAIL</text>

              <text x="260" y="24" fill="#f87171" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="Rajdhani,sans-serif" letterSpacing="1">ISOLATION BOUNDARY</text>
            </svg>
          </div>
        </div>

        {/* Affected services */}
        <div>
          <div style={{
            fontSize:10, color:"#4a5568", fontFamily:"Rajdhani,sans-serif",
            letterSpacing:1.2, textTransform:"uppercase", marginBottom:10,
          }}>Affected Services</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {["Order Svc", "Payment Svc", "Auth Svc"].map((s, i) => (
              <span key={i} style={{
                fontSize:12, padding:"5px 14px", borderRadius:20,
                background:"rgba(239,68,68,0.12)", color:"#f87171",
                border:"1px solid rgba(239,68,68,0.28)",
                fontFamily:"Rajdhani,sans-serif", fontWeight:600,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: AI Decision ── */}
      <div className="chart-card" style={{ border:"1px solid rgba(168,85,247,0.42)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <span className="chart-title">Diagnostician — AI Decision</span>
          <span style={{
            fontSize:10, color:"#a855f7", fontFamily:"Rajdhani,sans-serif", fontWeight:700,
            background:"rgba(168,85,247,0.12)", padding:"3px 10px", borderRadius:20,
            letterSpacing:.8, border:"1px solid rgba(168,85,247,0.25)",
          }}>Claude Sonnet</span>
        </div>

        {/* Decision box */}
        <div style={{
          background:"rgba(168,85,247,0.06)", border:"1px solid rgba(168,85,247,0.2)",
          borderRadius:12, padding:"16px 18px", marginBottom:16,
        }}>
          <div style={{
            fontSize:16, fontWeight:700, color:"#f1f5f9",
            fontFamily:"Rajdhani,sans-serif", marginBottom:10, lineHeight:1.3,
          }}>
            Rollback deployment v2.3.1 → v2.3.0
          </div>
          <div style={{ fontSize:12.5, color:"#8892a4", lineHeight:1.65, marginBottom:16 }}>
            Memory grew 340% in 8 min post-deploy; prior version stable for 6 days.
            Service D exhibiting heap exhaustion pattern consistent with INC-047.
          </div>

          {/* Confidence */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <span style={{ fontSize:11, color:"#8892a4", fontFamily:"Rajdhani,sans-serif", whiteSpace:"nowrap" }}>Confidence:</span>
            <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:"91%", height:"100%", background:"linear-gradient(90deg,#22c55e,#4ade80)", borderRadius:4 }} />
            </div>
            <span style={{ fontSize:13, fontWeight:700, color:"#22c55e", fontFamily:"Rajdhani,sans-serif" }}>91%</span>
          </div>

          {/* Action status */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:11, color:"#8892a4" }}>Action Status:</span>
            <span
              onClick={cycleStatus}
              style={{
                fontSize:11, fontWeight:700, padding:"4px 14px", borderRadius:20,
                fontFamily:"Rajdhani,sans-serif", letterSpacing:1, cursor:"pointer",
                transition:"all .2s",
                background: statusStyle.bg,
                color: statusStyle.color,
                border: `1px solid ${statusStyle.border}`,
              }}
            >{actionStatus}</span>
            <span style={{ fontSize:10, color:"#4a5568", fontStyle:"italic" }}>click to cycle</span>
          </div>
        </div>

        {/* Similar past fix */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:11, color:"#8892a4" }}>Similar past fix:</span>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(0,229,255,0.07)", border:"1px solid rgba(0,229,255,0.22)",
            borderRadius:8, padding:"5px 14px", cursor:"pointer",
          }}>
            <span style={{ fontSize:12, color:"#00e5ff", fontFamily:"Rajdhani,sans-serif", fontWeight:700 }}>
              INC-047 — 94% match
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SECTION 3 — SERVICE DEPENDENCY GRAPH (draggable SVG + HTML nodes)
// ─────────────────────────────────────────────────────────────────────
const INIT_NODES = {
  api:     { id:"api",     label:"API Gateway",     x:300, y:30,  w:130, h:54, status:"healthy",  color:"#22c55e" },
  order:   { id:"order",   label:"Order Service",   x:80,  y:175, w:132, h:54, status:"at-risk",  color:"#f59e0b" },
  payment: { id:"payment", label:"Payment Service", x:300, y:210, w:142, h:54, status:"at-risk",  color:"#f59e0b" },
  auth:    { id:"auth",    label:"Auth Service",    x:505, y:175, w:130, h:54, status:"at-risk",  color:"#f59e0b" },
  svcD:    { id:"svcD",    label:"Service D",       x:300, y:355, w:120, h:54, status:"isolated", color:"#ef4444" },
  db:      { id:"db",      label:"Database",        x:300, y:490, w:120, h:54, status:"healthy",  color:"#64748b" },
};

const GRAPH_EDGES = [
  { from:"api",     to:"order",   iso:false },
  { from:"api",     to:"payment", iso:false },
  { from:"api",     to:"auth",    iso:false },
  { from:"order",   to:"svcD",    iso:true  },
  { from:"payment", to:"svcD",    iso:true  },
  { from:"auth",    to:"svcD",    iso:true  },
  { from:"svcD",    to:"db",      iso:true  },
];

function ServiceDepGraph() {
  const [nodes, setNodes] = useState(INIT_NODES);
  const dragging = useRef(null);
  const containerRef = useRef(null);

  const onMouseDown = useCallback((e, id) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    dragging.current = {
      id,
      ox: e.clientX - rect.left - nodes[id].x,
      oy: e.clientY - rect.top  - nodes[id].y,
    };
  }, [nodes]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const { id, ox, oy } = dragging.current;
      setNodes(prev => ({
        ...prev,
        [id]: { ...prev[id], x: Math.max(0, e.clientX - rect.left - ox), y: Math.max(0, e.clientY - rect.top - oy) },
      }));
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const ncx = n => n.x + n.w / 2;
  const ncy = n => n.y + n.h / 2;

  return (
    <div className="section-wrap">
      <div className="chart-card">
        <div className="chart-header" style={{ marginBottom:10 }}>
          <span className="chart-title">Service Dependency Graph</span>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {[["#22c55e","healthy"],["#f59e0b","at risk"],["#ef4444","isolated"],["#64748b","passive"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#8892a4", fontFamily:"Rajdhani,sans-serif" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize:10, color:"#4a5568", fontFamily:"Rajdhani,sans-serif", marginBottom:12, letterSpacing:.8 }}>
          Drag nodes to rearrange
        </div>

        <div ref={containerRef} style={{ position:"relative", width:"100%", height:580, userSelect:"none" }}>
          {/* SVG edge layer */}
          <svg width="100%" height="580" style={{ position:"absolute", top:0, left:0, overflow:"visible" }}>
            <defs>
              <marker id="mGray" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#4a5568" />
              </marker>
              <marker id="mRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#ef444499" />
              </marker>
            </defs>

            {GRAPH_EDGES.map((e, i) => {
              const s = nodes[e.from], t = nodes[e.to];
              const sx = ncx(s), sy = ncy(s), tx = ncx(t), ty = ncy(t);
              const mx = (sx + tx) / 2, my = (sy + ty) / 2 - 8;
              return (
                <g key={i}>
                  <line
                    x1={sx} y1={sy} x2={tx} y2={ty}
                    stroke={e.iso ? "#ef444488" : "#4a5568"}
                    strokeWidth={e.iso ? 2 : 1.5}
                    strokeDasharray={e.iso ? "7 4" : "none"}
                    markerEnd={e.iso ? "url(#mRed)" : "url(#mGray)"}
                  />
                  {e.iso && (
                    <text x={mx} y={my}
                      fill="#ef4444" fontSize="9"
                      fontFamily="Rajdhani,sans-serif" fontWeight="700"
                      textAnchor="middle">
                      ISOLATED
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML node layer */}
          {Object.values(nodes).map(n => (
            <div
              key={n.id}
              onMouseDown={(e) => onMouseDown(e, n.id)}
              style={{
                position:"absolute",
                left: n.x, top: n.y,
                width: n.w,
                padding:"10px 14px",
                background: n.status==="isolated" ? "rgba(239,68,68,0.1)"
                  : n.status==="at-risk"  ? "rgba(245,158,11,0.07)"
                  : "rgba(255,255,255,0.03)",
                border:`1.5px solid ${n.color}`,
                borderRadius:10,
                cursor:"grab",
                zIndex:10,
                animation: n.status==="isolated" ? "nodeRedPulse 1.6s ease-in-out infinite" : "none",
                transition:"box-shadow .2s",
              }}
            >
              <div style={{
                fontSize:12, fontWeight:700, color:n.color,
                fontFamily:"Rajdhani,sans-serif", marginBottom:3, whiteSpace:"nowrap",
              }}>{n.label}</div>
              <div style={{
                fontSize:9.5, color:"#8892a4",
                textTransform:"uppercase", letterSpacing:.8,
              }}>{n.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// All other sections (unchanged from previous version)
// ─────────────────────────────────────────────────────────────────────
function SystemOverview() {
  return (
    <div className="section-wrap">
      <div className="top-row four-col">
        <div className="metric-card amber-card">
          <div className="metric-label">Cluster Status</div>
          <div style={{ marginTop:14 }}><span className="status-badge amber">DEGRADED</span></div>
        </div>
        <div className="metric-card green-card">
          <div className="metric-label">Live MTTR</div>
          <div className="metric-value green-val">1m <span className="metric-unit">48s</span></div>
          <div className="metric-sub">↓ was 67 min</div>
        </div>
        <div className="metric-card dark-card">
          <div className="metric-label">Active Services</div>
          <div className="metric-value white-val">12</div>
          <div className="metric-sub red-sub">1 degraded</div>
        </div>
        <div className="metric-card dark-card">
          <div className="metric-label">Incidents Today</div>
          <div className="metric-value white-val">3</div>
          <div className="metric-sub green-sub">2 auto-healed</div>
        </div>
      </div>
      <div className="chart-card" style={{ marginTop:16 }}>
        <div className="chart-header">
          <span className="chart-title">MTTR Trend — 7 days</span>
          <span style={{ fontSize:11, color:"#22c55e", fontFamily:"Rajdhani,sans-serif" }}>↓ Improving</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={mttrTrend} margin={{ top:5, right:10, bottom:0, left:-20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="d" tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} />
            <Tooltip content={({ active, payload }) => active && payload?.length
              ? <div style={{ background:"#0d0d1a", border:"1px solid #22c55e44", borderRadius:6, padding:"4px 10px", fontSize:11, color:"#22c55e", fontFamily:"Rajdhani" }}>{payload[0].value} min</div> : null} />
            <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2.5} dot={{ r:3, fill:"#22c55e" }} activeDot={{ r:5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ServiceGraphs() {
  return (
    <div className="section-wrap">
      <div className="middle-row">
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Tickets Created vs Tickets Solved</span>
            <div className="chart-legend">
              <div className="legend-item"><div className="legend-line" style={{ background:"#00e5ff" }} />Solved</div>
              <div className="legend-item"><div className="legend-dashed" style={{ borderColor:"#a855f7" }} />Created</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ticketsData} margin={{ top:10, right:10, bottom:0, left:-20 }}>
              <defs>
                <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.25} /><stop offset="100%" stopColor="#00e5ff" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.2} /><stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} domain={[20,90]} />
              <Tooltip content={({ active, payload }) => active && payload?.length
                ? <div style={{ background:"#7c3aed", borderRadius:8, padding:"6px 12px", color:"#fff", fontSize:12, fontFamily:"Rajdhani,sans-serif" }}>Value: {payload[0]?.value}</div> : null} />
              <Area type="monotone" dataKey="solved"  stroke="#00e5ff" strokeWidth={2.5} fill="url(#sg1)" dot={false} />
              <Area type="monotone" dataKey="created" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#sg2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="card-title" style={{ marginBottom:14 }}>Number of Tickets / Week Day</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekDayData} margin={{ top:10, right:5, bottom:0, left:-20 }} barSize={28}>
              <defs>
                <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" /><stop offset="100%" stopColor="#0288d1" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload, label }) => active && payload?.length
                ? <div style={{ background:"#0d0d1a", border:"1px solid rgba(0,229,255,0.3)", borderRadius:6, padding:"4px 10px", fontSize:11, color:"#00e5ff", fontFamily:"Rajdhani" }}>{label}: {payload[0].value}</div> : null} />
              <Bar dataKey="tickets" fill="url(#bg2)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bottom-row" style={{ marginTop:16 }}>
        <div className="chart-card">
          <div className="card-title" style={{ marginBottom:12 }}>Tickets By Type</div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <PieChart width={160} height={160}>
              <Pie data={ticketsByType} cx={75} cy={75} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                {ticketsByType.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div className="donut-labels">
              {ticketsByType.map((item,i) => (
                <div key={i} className="donut-label">
                  <div className="donut-dot" style={{ background:item.color }} />{item.name}
                  <span style={{ marginLeft:"auto", color:item.color, fontWeight:600 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="card-title" style={{ marginBottom:12 }}>New vs Returned Tickets</div>
          <div style={{ display:"flex", alignItems:"center", gap:16, justifyContent:"center" }}>
            <div style={{ position:"relative", width:160, height:160 }}>
              <PieChart width={160} height={160}>
                <Pie data={returnedTickets} cx={75} cy={75} innerRadius={50} outerRadius={72} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                  {returnedTickets.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
                <div style={{ fontSize:10, color:"#8892a4", fontFamily:"Rajdhani" }}>Returned</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#e2e8f0", fontFamily:"Rajdhani" }}>1,200</div>
              </div>
            </div>
            <div className="pie-stats">
              {returnedTickets.map((item,i) => (
                <div key={i} className="pie-stat-row">
                  <div className="pie-ring" style={{ borderColor:item.color }} />
                  <div>
                    <div style={{ fontWeight:600, color:"#e2e8f0", fontSize:13 }}>{item.value}%</div>
                    <div style={{ fontSize:11, color:"#8892a4" }}>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-card">
          <div className="card-title" style={{ marginBottom:12 }}>Reply vs Resolve Time</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={resolveTimeData} margin={{ top:5, right:5, bottom:0, left:-30 }}>
              <defs>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.5} /><stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Tooltip content={({ active, payload }) => active && payload?.length
                ? <div style={{ background:"#00bcd4", borderRadius:6, padding:"4px 10px", fontSize:11, color:"#fff", fontFamily:"Rajdhani" }}>{payload[0].value} hours</div> : null} />
              <Area type="monotone" dataKey="v" stroke="#00e5ff" strokeWidth={2} fill="url(#ag2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AgentPipelineSection() {
  return (
    <div className="section-wrap">
      <AgentPipeline />
      <div className="chart-card" style={{ marginTop:16 }}>
        <div className="chart-title" style={{ marginBottom:12 }}>Agent Activity Timeline</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { time:"14:03:21", agent:"Observer",      action:"Anomaly flagged — memory spike detected",   color:"#22c55e" },
            { time:"14:03:22", agent:"Diagnostician", action:"Querying logs and distributed traces",       color:"#a855f7" },
            { time:"14:03:24", agent:"Diagnostician", action:"Claude Sonnet reasoning in progress...",    color:"#a855f7" },
            { time:"ETA ~20s", agent:"Executor",      action:"Awaiting diagnosis before acting",           color:"#64748b" },
          ].map((row,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 14px", background:"rgba(255,255,255,0.02)", borderRadius:8, borderLeft:`3px solid ${row.color}` }}>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:"#64748b", whiteSpace:"nowrap", minWidth:70 }}>{row.time}</span>
              <span style={{ fontSize:12, color:row.color, fontFamily:"Rajdhani,sans-serif", fontWeight:700, minWidth:100 }}>{row.agent}</span>
              <span style={{ fontSize:12, color:"#8892a4" }}>{row.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionsLog() {
  const rows = [
    {
      time:"14:03:21",
      action:"Traffic isolated",
      target:"Service D",
      status:"Isolating",
      state:"active",
      dot:"#f59e0b",
      agent:"Executor",
      Icon: ShieldAlert,
    },
    {
      time:"14:03:19",
      action:"NetworkPolicy applied",
      target:"Service D",
      status:"In Progress",
      state:"active",
      dot:"#f59e0b",
      agent:"Executor",
      Icon: Network,
    },
    {
      time:"14:03:18",
      action:"Rollback initiated v2.3.1→v2.3.0",
      target:"Service D",
      status:"Success",
      state:"done",
      dot:"#22c55e",
      agent:"Executor",
      Icon: RotateCcw,
    },
    {
      time:"14:02:39",
      action:"Anomaly confirmed",
      target:"Memory spike",
      status:"Confirmed",
      state:"done",
      dot:"#22c55e",
      agent:"Observer",
      Icon: Activity,
    },
  ];

  return (
    <div className="section-wrap">
      <div
        className="chart-card bg-[#13131a] border border-gray-800 rounded-2xl"
        style={{ background:"#13131a", border:"1px solid rgba(148,163,184,0.18)", borderRadius:16 }}
      >
        <div className="chart-title text-slate-100" style={{ marginBottom:16 }}>Incident Response Timeline</div>

        <div className="relative pl-9">
          <div
            className="absolute left-3 top-1 bottom-1 border-l-2 border-gray-800"
            style={{ borderLeft:"2px solid rgba(71,85,105,0.55)" }}
          />

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {rows.map((row, i) => {
              const isActive = row.state === "active";
              const Icon = row.Icon;
              return (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-9 top-5 h-4 w-4 rounded-full ring-4 ring-[#13131a] ${isActive ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`}
                    style={{
                      width:16,
                      height:16,
                      borderRadius:"50%",
                      left:-36,
                      top:18,
                      background:isActive ? "#f59e0b" : "#22c55e",
                      boxShadow:isActive ? "0 0 12px rgba(245,158,11,.8)" : "0 0 12px rgba(34,197,94,.75)",
                      animation:isActive ? "livePulse 1.1s ease-in-out infinite" : "none",
                      border:"3px solid #13131a",
                    }}
                  />

                  <div
                    className="rounded-xl border border-gray-800 bg-[#101018]/80 px-4 py-3"
                    style={{
                      background:"linear-gradient(140deg, rgba(16,16,24,.95), rgba(16,16,24,.72))",
                      border:"1px solid rgba(71,85,105,0.35)",
                      borderRadius:12,
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
                        <Icon size={15} color={isActive ? "#f59e0b" : "#22c55e"} strokeWidth={2.2} />
                        <span className="text-sm font-semibold text-slate-100" style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>
                          {row.action}
                        </span>
                      </div>

                      <span
                        className="text-[10px] font-semibold"
                        style={{
                          fontSize:10,
                          fontWeight:700,
                          color:isActive ? "#f59e0b" : "#22c55e",
                          letterSpacing:.7,
                          textTransform:"uppercase",
                          whiteSpace:"nowrap",
                        }}
                      >
                        {isActive ? "●" : "✓"} {row.status}
                      </span>
                    </div>

                    <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                      <span className="text-sm text-gray-400" style={{ fontSize:12, color:"#9ca3af", fontFamily:"'Courier New',monospace" }}>
                        {row.time}
                      </span>
                      <span className="text-sm text-gray-400" style={{ fontSize:12, color:"#9ca3af" }}>
                        Target: {row.target}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-[2px] text-[10px] text-violet-200"
                        style={{
                          display:"inline-flex",
                          alignItems:"center",
                          gap:4,
                          fontSize:10,
                          color:"#d8b4fe",
                          background:"rgba(168,85,247,0.14)",
                          border:"1px solid rgba(168,85,247,0.35)",
                          borderRadius:999,
                          padding:"2px 8px",
                          fontFamily:"Rajdhani,sans-serif",
                          fontWeight:600,
                        }}
                      >
                        <Bot size={11} /> Agent: {row.agent}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alerts() {
  const threshold = 80, currentConf = 91;
  const alerts = [
    { dot:"#ef4444", pulse:true,  text:"Slack alert sent — INC-052 active", time:"14:03:21", active:true  },
    { dot:"#22c55e", pulse:false, text:"INC-051 auto-resolved",              time:"13:47:05", active:false },
    { dot:"#22c55e", pulse:false, text:"INC-050 auto-resolved",              time:"12:31:18", active:false },
  ];
  return (
    <div className="section-wrap">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="chart-card">
          <div className="chart-title" style={{ marginBottom:16 }}>Active Alerts</div>
          {alerts.map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"rgba(255,255,255,0.02)", borderRadius:8, opacity: a.active ? 1 : .5, marginBottom:10 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:a.dot, boxShadow:`0 0 8px ${a.dot}`, flexShrink:0, animation: a.pulse ? "livePulse 1s infinite" : "none" }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color: a.active ? "#e2e8f0" : "#8892a4" }}>{a.text}</div>
                <div style={{ fontSize:11, color:"#4a5568", fontFamily:"'Courier New',monospace", marginTop:2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <div className="chart-title" style={{ marginBottom:16 }}>Confidence Threshold Config</div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:"#8892a4" }}>Threshold</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#f59e0b", fontFamily:"Rajdhani,sans-serif" }}>{threshold}%</span>
          </div>
          <div style={{ fontSize:11, color:"#4a5568", marginBottom:14, lineHeight:1.6 }}>
            Below threshold → escalate to human<br/>Above threshold → auto-execute
          </div>
          <div style={{ position:"relative", height:20, background:"rgba(255,255,255,0.06)", borderRadius:10, overflow:"visible", marginBottom:8 }}>
            <div style={{ width:`${currentConf}%`, height:"100%", background:"linear-gradient(90deg,#22c55e,#4ade80)", borderRadius:10 }} />
            <div style={{ position:"absolute", left:`${threshold}%`, top:-6, width:2, height:32, background:"#f59e0b", borderRadius:1 }}>
              <div style={{ position:"absolute", top:-16, left:4, fontSize:10, color:"#f59e0b", fontFamily:"Rajdhani,sans-serif", whiteSpace:"nowrap" }}>Threshold</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#4a5568", marginBottom:14 }}>
            <span>0%</span><span>100%</span>
          </div>
          <div style={{ padding:"10px 14px", background:"rgba(34,197,94,0.08)", borderRadius:8, border:"1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ fontSize:12, color:"#22c55e", fontFamily:"Rajdhani,sans-serif", fontWeight:600 }}>
              ✓ Confidence ({currentConf}%) exceeds threshold — auto-execute enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceOptimizations() {
  return (
    <div className="section-wrap">
      <div className="top-row four-col">
        <div className="metric-card dark-card"><div className="metric-label">Idle Nodes</div><div className="metric-value white-val">7</div></div>
        <div className="metric-card dark-card"><div className="metric-label">Jobs Scheduled</div><div className="metric-value white-val">4</div><div className="metric-sub">running</div></div>
        <div className="metric-card dark-card"><div className="metric-label">Preemptions</div><div className="metric-value white-val">1</div><div className="metric-sub">today</div></div>
        <div className="metric-card green-card"><div className="metric-label">Compute Saved</div><div className="metric-value green-val">68<span className="metric-unit">%</span></div></div>
      </div>
      <div className="chart-card" style={{ marginTop:16 }}>
        <div className="card-title" style={{ marginBottom:14 }}>CPU Utilization by Service</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={cpuData} margin={{ top:5, right:10, bottom:0, left:-20 }} barSize={20} barCategoryGap="30%">
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" /><stop offset="100%" stopColor="#0288d1" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="btg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="svc" tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:"#8892a4", fontSize:11, fontFamily:"Rajdhani" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={({ active, payload, label }) => active && payload?.length
              ? <div style={{ background:"#0d0d1a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 14px", fontSize:12, fontFamily:"Rajdhani,sans-serif", color:"#e2e8f0" }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{label}</div>
                  {payload.map((p,i) => <div key={i} style={{ color:i===0?"#00e5ff":"#a855f7" }}>{i===0?"Production":"Batch"}: {p.value}%</div>)}
                </div> : null} />
            <Bar dataKey="prod"  fill="url(#pg)"  radius={[3,3,0,0]} />
            <Bar dataKey="batch" fill="url(#btg)" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", gap:20, marginTop:12 }}>
          {[["#00e5ff","Production workload"],["#a855f7","Batch jobs"]].map(([c,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#8892a4", fontFamily:"Rajdhani,sans-serif" }}>
              <div style={{ width:14, height:3, background:c, borderRadius:2 }} />{l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function History() {
  return (
    <div className="section-wrap">
      <div className="chart-card">
        <div className="chart-title" style={{ marginBottom:16 }}>ChromaDB — Incident History</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              {["Incident","Similarity","Fix Applied","Outcome","Date"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"8px 14px", fontSize:11, color:"#4a5568", fontFamily:"Rajdhani,sans-serif", fontWeight:600, letterSpacing:1, textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyData.map((row,i) => (
              <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding:"14px", fontSize:13, fontWeight:700, color:"#00e5ff", fontFamily:"Rajdhani,sans-serif", cursor:"pointer" }}>{row.id}</td>
                <td style={{ padding:"14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:80, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ width:`${row.sim}%`, height:"100%", background:`linear-gradient(90deg,${row.color},${row.color}99)`, borderRadius:3 }} />
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:row.color, fontFamily:"Rajdhani,sans-serif" }}>{row.sim}%</span>
                  </div>
                </td>
                <td style={{ padding:"14px", fontSize:13, color:"#8892a4" }}>{row.fix}</td>
                <td style={{ padding:"14px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:`${row.color}22`, color:row.color, fontFamily:"Rajdhani,sans-serif" }}>{row.outcome}</span>
                </td>
                <td style={{ padding:"14px", fontSize:12, color:"#4a5568", fontFamily:"'Courier New',monospace" }}>{row.daysAgo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ROUTER ────────────────────────────────────────────────────────────
function SectionContent({ active }) {
  switch (active) {
    case "System Overview":        return <SystemOverview />;
    case "Service Graphs":         return <ServiceGraphs />;
    case "Agent Pipeline":         return <AgentPipelineSection />;
    case "AI Decisions":           return <div className="section-wrap"><IncidentAndDecisionPanel /></div>;
    case "Actions Log":            return <ActionsLog />;
    case "Active Incidents":       return <div className="section-wrap"><IncidentAndDecisionPanel /></div>;
    case "Service Dependency":     return <ServiceDepGraph />;
    case "Alerts":                 return <Alerts />;
    case "Resource Optimizations": return <ResourceOptimizations />;
    case "History":                return <History />;
    default:                       return <SystemOverview />;
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("System Overview");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { width:100%; height:100%; }
        body { background:#0d0d1a; font-family:'Exo 2',sans-serif; min-height:100vh; }

        :root {
          --bg-main:#0d0d1a; --bg-card:#13131f; --bg-sidebar:#0f0f1c;
          --text-primary:#e2e8f0; --text-secondary:#8892a4;
          --text-muted:#4a5568; --border:rgba(255,255,255,0.06);
        }

        .dash { display:flex; min-height:100vh; width:100%; background:#0d0d1a; }

        /* Sidebar */
        .sidebar { width:220px; min-width:220px; background:var(--bg-sidebar); padding:28px 0; display:flex; flex-direction:column; border-right:1px solid var(--border); }
        .sidebar-title { font-family:'Rajdhani',sans-serif; font-size:18px; font-weight:700; color:var(--text-primary); padding:0 22px 24px; letter-spacing:.5px; }
        .nav-sec { font-family:'Rajdhani',sans-serif; font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; padding:14px 22px 6px; display:flex; align-items:center; gap:8px; }
        .nav-sec.overview  { color:#00e5ff; }
        .nav-sec.agents    { color:#a855f7; }
        .nav-sec.incidents { color:#ec4899; }
        .nav-sec.resources { color:#f59e0b; }
        .nav-item { font-size:13px; color:var(--text-secondary); padding:8px 22px; cursor:pointer; transition:all .2s; position:relative; display:flex; align-items:center; gap:8px; }
        .nav-item:hover { color:var(--text-primary); }
        .nav-item.active { color:var(--text-primary); background:rgba(168,85,247,.15); }
        .nav-item.active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:#a855f7; border-radius:0 3px 3px 0; }
        .badge-live  { background:rgba(34,197,94,.2);  color:#22c55e; font-size:9px; font-weight:700; padding:2px 6px; border-radius:20px; }
        .badge-count { background:rgba(236,72,153,.2); color:#ec4899; font-size:9px; font-weight:700; padding:2px 6px; border-radius:20px; }
        .badge-new   { background:#ec4899; color:white; font-size:9px; font-weight:700; padding:2px 6px; border-radius:20px; text-transform:uppercase; }
        .sidebar-footer { margin-top:auto; padding:0 18px 10px; }
        .full-report-label { font-size:12px; color:var(--text-secondary); margin-bottom:4px; display:flex; align-items:center; gap:8px; }
        .full-report-sub   { font-size:11px; color:var(--text-muted); margin-bottom:12px; }
        .download-btn { background:linear-gradient(135deg,#7c3aed,#a855f7); color:white; border:none; border-radius:10px; padding:10px 18px; font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; cursor:pointer; width:100%; display:flex; align-items:center; justify-content:space-between; }
        .download-btn:hover { opacity:.9; }

        /* Main */
        .main { flex:1; padding:28px 24px; overflow-y:auto; display:flex; flex-direction:column; gap:20px; min-width:0; }

        /* Pipeline banner */
        .pipeline-banner { background:#0f0f1e; border:1px solid rgba(168,85,247,.25); border-radius:16px; padding:20px 24px 0; position:relative; overflow:hidden; flex-shrink:0; }
        .pipeline-banner::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(168,85,247,.04),transparent 60%); pointer-events:none; }
        .pipeline-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .pipeline-title  { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; color:var(--text-secondary); text-transform:uppercase; }
        .pipeline-live   { display:flex; align-items:center; gap:6px; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; color:#22c55e; letter-spacing:1px; }
        .live-dot { width:7px; height:7px; border-radius:50%; background:#22c55e; box-shadow:0 0 8px #22c55e; animation:livePulse 1.4s ease-in-out infinite; }

        @keyframes livePulse  { 0%,100%{opacity:1;box-shadow:0 0 8px #22c55e} 50%{opacity:.5;box-shadow:0 0 3px #22c55e} }
        @keyframes pillGlow   { 0%,100%{box-shadow:0 0 14px var(--glow)} 50%{box-shadow:0 0 30px var(--glow)} }
        @keyframes nodeRedPulse { 0%,100%{box-shadow:0 0 8px rgba(239,68,68,.45),0 0 0 1px rgba(239,68,68,.2)} 50%{box-shadow:0 0 24px rgba(239,68,68,.75),0 0 0 2px rgba(239,68,68,.45)} }
        @keyframes progressShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .pipeline-agents { display:flex; align-items:center; gap:0; margin-bottom:16px; }
        .agent-pill { flex:1; background:rgba(255,255,255,.03); border:1px solid var(--border-color,rgba(255,255,255,.08)); border-radius:12px; padding:14px 16px; box-shadow:0 0 18px var(--glow,transparent); transition:box-shadow .3s; min-width:0; }
        .agent-pulse { animation:pillGlow 2s ease-in-out infinite; }
        .agent-pill-top { display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
        .agent-icon   { font-size:14px; line-height:1; }
        .agent-label  { font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:700; color:var(--text-primary); }
        .agent-status-badge { font-family:'Rajdhani',sans-serif; font-size:9px; font-weight:700; padding:2px 8px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; display:flex; align-items:center; gap:5px; margin-left:auto; }
        .pulse-dot  { width:6px; height:6px; border-radius:50%; animation:livePulse 1s ease-in-out infinite; flex-shrink:0; }
        .agent-detail { font-size:12px; color:var(--text-secondary); margin-bottom:4px; }
        .agent-sub    { font-size:11px; color:var(--text-muted); font-style:italic; }
        .pipeline-arrow { display:flex; align-items:center; padding:0 8px; flex-shrink:0; }
        .arrow-line { width:28px; height:1px; background:linear-gradient(90deg,rgba(168,85,247,.5),rgba(168,85,247,.2)); }
        .arrow-head { font-size:18px; color:#a855f7; opacity:.7; line-height:1; margin-left:-4px; }
        .pipeline-narrative { font-family:'Exo 2',sans-serif; font-size:12px; color:var(--text-secondary); font-style:italic; text-align:center; padding:10px 0 16px; border-top:1px solid var(--border); opacity:.8; }
        .pipeline-progress-track { display:flex; height:3px; width:100%; border-radius:0 0 16px 16px; overflow:hidden; }
        .progress-segment { height:100%; }
        .seg-done   { flex:1; background:#22c55e; }
        .seg-active { flex:1; background:linear-gradient(90deg,#a855f7,#c084fc); background-size:200% 100%; animation:progressShimmer 1.5s linear infinite; }
        .seg-idle   { flex:1; background:rgba(100,116,139,.3); }

        /* Cards */
        .chart-card   { background:var(--bg-card); border-radius:14px; padding:20px 22px; border:1px solid var(--border); }
        .chart-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .chart-title  { font-family:'Rajdhani',sans-serif; font-size:15px; font-weight:600; color:var(--text-primary); }
        .card-title   { font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; color:var(--text-primary); }
        .chart-legend { display:flex; align-items:center; gap:16px; font-size:11px; color:var(--text-secondary); font-family:'Rajdhani',sans-serif; }
        .legend-item  { display:flex; align-items:center; gap:6px; }
        .legend-line  { width:18px; height:2px; border-radius:2px; }
        .legend-dashed{ width:18px; height:2px; border-top:2px dashed; opacity:.6; }

        /* Metric cards */
        .top-row.four-col { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:16px; }
        .metric-card { border-radius:14px; padding:22px 24px; display:flex; flex-direction:column; justify-content:space-between; min-height:100px; }
        .amber-card  { background:linear-gradient(135deg,#92400e,#d97706,#f59e0b); }
        .green-card  { background:linear-gradient(135deg,#064e3b,#059669,#22c55e); }
        .dark-card   { background:var(--bg-card); border:1px solid var(--border); }
        .metric-label { font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:500; color:rgba(255,255,255,.8); }
        .dark-card .metric-label { color:var(--text-secondary); }
        .metric-value { font-family:'Rajdhani',sans-serif; font-size:40px; font-weight:700; display:flex; align-items:baseline; gap:4px; line-height:1; margin-top:8px; }
        .metric-unit  { font-size:14px; font-weight:500; opacity:.85; }
        .green-val    { color:#22c55e; }
        .white-val    { color:#e2e8f0; }
        .metric-sub   { font-size:12px; margin-top:4px; }
        .red-sub      { color:#ef4444; }
        .green-sub    { color:#22c55e; }
        .status-badge { font-family:'Rajdhani',sans-serif; font-size:12px; font-weight:700; padding:5px 14px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; }
        .status-badge.amber { background:rgba(245,158,11,.2); color:#f59e0b; border:1px solid rgba(245,158,11,.3); }
        .status-badge.red   { background:rgba(239,68,68,.2);  color:#ef4444; border:1px solid rgba(239,68,68,.3); }

        /* Layout helpers */
        .section-wrap { display:flex; flex-direction:column; gap:0; width:100%; }
        .middle-row   { display:grid; grid-template-columns:1fr 320px; gap:16px; }
        .bottom-row   { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
        .donut-labels { display:flex; flex-direction:column; gap:8px; justify-content:center; flex:1; }
        .donut-label  { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-secondary); font-family:'Rajdhani',sans-serif; }
        .donut-dot    { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .pie-stats    { display:flex; flex-direction:column; gap:10px; justify-content:center; }
        .pie-stat-row { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-secondary); font-family:'Rajdhani',sans-serif; }
        .pie-ring     { width:12px; height:12px; border-radius:50%; border:2px solid; flex-shrink:0; }

        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#0d0d1a; }
        ::-webkit-scrollbar-thumb { background:#2d2d4e; border-radius:3px; }
      `}</style>

      <div className="dash">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-title">CRM Dashboard</div>
          {navSections.map(sec => (
            <div key={sec.key}>
              <div className={`nav-sec ${sec.key}`}><span>{sec.icon}</span>{sec.label}</div>
              {sec.items.map(item => (
                <div
                  key={item}
                  className={`nav-item${activeNav===item?" active":""}`}
                  onClick={() => setActiveNav(item)}
                >
                  {item}
                  {item==="Agent Pipeline"     && <span className="badge-live">live</span>}
                  {item==="Active Incidents"   && <span className="badge-live">live</span>}
                  {item==="Service Dependency" && <span className="badge-live">live</span>}
                  {item==="Alerts"             && <span className="badge-count">3</span>}
                </div>
              ))}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="full-report-label">Full System Report <span className="badge-new">new</span></div>
            <div className="full-report-sub">Download report</div>
            <button className="download-btn">Download <span>⬇</span></button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <AgentPipeline />
          <SectionContent active={activeNav} />
        </div>
      </div>
    </>
  );
}