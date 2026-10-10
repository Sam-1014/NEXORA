 <header className="page-header">
  <div className="page-heading">
    <span className="eyebrow">NEXORA INTELLIGENCE PLATFORM</span>
    <h1>
      Intelligence that keeps
      <span> payments resilient.</span>
    </h1>
    <p>
      Predict disruptions. Understand every incident.
      Orchestrate safer recovery.
    </p>
  </div>

  <div className="header-actions">
    <div className="environment-badge">
      <span className="live-dot"></span>
      <div>
        <small>ENVIRONMENT</small>
      </div>
    </div>

    <button
      className="button primary"
      onClick={() => {
        document
          .getElementById("recovery-lab")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      ✳ Simulate incident
    </button>
  </div>
</header>

import { useEffect, useMemo, useState } from "react";
import "./App.css";

const scenarios = {
  latency: {
    name: "Latency spike",
    severity: "HIGH",
    cause: "Payment API response delay",
    confidence: 94,
    impact: "Elevated response times",
    action: "Scale the API service and monitor latency",
    risk: "Low",
    savings: 420,
  },
  timeout: {
    name: "Payment timeout",
    severity: "CRITICAL",
    cause: "Upstream payment gateway timeout",
    confidence: 89,
    impact: "Potentially delayed transactions",
    action: "Retry eligible requests with bounded backoff",
    risk: "Medium",
    savings: 680,
  },
  failures: {
    name: "Failure surge",
    severity: "HIGH",
    cause: "Elevated payment error rate",
    confidence: 92,
    impact: "More transactions may require review",
    action: "Pause repeated retries and investigate errors",
    risk: "Low",
    savings: 510,
  },
};

const initialTransactions = [
  { id: "NX-1042", amount: 2499, status: "Success", latency: 182 },
  { id: "NX-1041", amount: 899, status: "Success", latency: 210 },
  { id: "NX-1040", amount: 1599, status: "Failed", latency: 980 },
  { id: "NX-1039", amount: 3200, status: "Success", latency: 165 },
  { id: "NX-1038", amount: 649, status: "Success", latency: 198 },
];

function App() {
  const [health, setHealth] = useState(null);
  const [backendError, setBackendError] = useState(false);
  const [page, setPage] = useState("Overview");
  const [scenario, setScenario] = useState("latency");
  const [incident, setIncident] = useState(null);
  const [diagnosed, setDiagnosed] = useState(false);
  const [approved, setApproved] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [transactions] = useState(initialTransactions);
  const [history, setHistory] = useState([]);
  const [audit, setAudit] = useState([
    {
      time: new Date().toLocaleTimeString(),
      event: "NEXORA workspace initialized",
      detail: "Environment ready",
    },
  ]);
  const [injection, setInjection] = useState("latency");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    fetch("http://localhost:5000/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then((data) => {
        if (active) {
          setHealth(data);
          setBackendError(false);
        }
      })
      .catch(() => {
        if (active) setBackendError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const logEvent = (event, detail) => {
    setAudit((previous) =>
      [
        {
          time: new Date().toLocaleTimeString(),
          event,
          detail,
        },
        ...previous,
      ].slice(0, 30)
    );
  };

  const startIncident = (type = scenario) => {
    const selected = scenarios[type];

    const newIncident = {
      id: `NX-INC-${Date.now().toString().slice(-6)}`,
      ...selected,
      type,
      createdAt: new Date().toLocaleTimeString(),
      status: "Detected",
    };

    setScenario(type);
    setIncident(newIncident);
    setDiagnosed(false);
    setApproved(false);
    setRecovered(false);
    setNotice("Incident injected successfully.");

    logEvent("Incident injected", `${selected.name} · ${selected.severity} severity`);
    setPage("Recovery Lab");
  };

  const diagnoseIncident = () => {
    if (!incident) return;

    setBusy(true);
    setNotice("");

    // A deterministic local demo, not a live AI inference.
    window.setTimeout(() => {
      setDiagnosed(true);
      setBusy(false);
      setNotice("Diagnosis completed. Review the recommendation.");
      logEvent(
        "Diagnosis completed",
        `${incident.cause} · ${incident.confidence}% illustrative confidence`
      );
    }, 650);
  };

  const approveRecovery = () => {
    if (!incident || !diagnosed) return;

    setApproved(true);
    setNotice("Recovery action approved in the demo environment.");
    logEvent("Recovery approved", incident.action);
  };

  const executeRecovery = () => {
    if (!incident || !approved) return;

    setRecovered(true);
    setNotice("Simulated recovery verified. No real infrastructure was changed.");

    const record = {
      ...incident,
      status: "Resolved",
      resolvedAt: new Date().toLocaleTimeString(),
    };

    setHistory((previous) => [record, ...previous].slice(0, 20));
    logEvent("Recovery verified", `${incident.name} · Simulated outcome`);
  };

  const resetIncident = () => {
    setIncident(null);
    setDiagnosed(false);
    setApproved(false);
    setRecovered(false);
    setNotice("Recovery Lab reset. Ready for another simulation.");
    logEvent("Lab reset", "Waiting for the next demo scenario");
  };

  const successRate = useMemo(() => {
    const successes = transactions.filter(
      (transaction) => transaction.status === "Success"
    ).length;

    return ((successes / transactions.length) * 100).toFixed(1);
  }, [transactions]);

  const failedCount = transactions.filter(
    (transaction) => transaction.status === "Failed"
  ).length;

  const navItems = [
    ["Overview", "◈"],
    ["Transactions", "⇄"],
    ["Incident Commander", "⌘"],
    ["Recovery Lab", "✳"],
    ["Digital Twin", "◎"],
    ["Cost Radar", "⌁"],
    ["Incident Memory", "◷"],
    ["Audit Trail", "≡"],
  ];

  const currentScenario = scenarios[scenario];

  return (
    <div className="nexora-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => setPage("Overview")}
          aria-label="Go to overview"
        >
          <span className="brand-symbol">N</span>
          <span>
            <strong>NEXORA</strong>
            <small>INTELLIGENT RELIABILITY</small>
          </span>
        </button>

        <div className="nav-caption">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map(([name, icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => setPage(name)}
            >
              <span className="nav-icon">{icon}</span>
              {name}
              {name === "Recovery Lab" && (
                <span className="nav-tag">LAB</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="connection-card">
          <div className={`connection-dot ${backendError ? "offline" : ""}`} />
          <div>
            <strong>API CONNECTION</strong>
            <p>{health ? "Backend online" : "Local API status"}</p>
          </div>
          <span className="connection-label">
            {health ? "LIVE" : backendError ? "OFFLINE" : "CHECKING"}
          </span>
        </div>

        <div className="sidebar-profile">
          <span className="mini-logo">N</span>
          <div>
            <strong>NEXORA Console</strong>
            <small>Reliability workspace</small>
          </div>
          <span className="online-pulse" />
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <div className="breadcrumb">WORKSPACE / {page.toUpperCase()}</div>
            <h1>
              {page === "Overview" ? "Reliability overview" : page}
            </h1>
            <p className="subtitle">
              Intelligence for resilient payment infrastructure.
            </p>
          </div>

          <div className="header-actions">
            <div className="environment">
              <span className="live-dot" />
            </div>
            <button
              className="button primary"
              onClick={() => startIncident(injection)}
            >
              + Simulate incident
            </button>
          </div>
        </header>

        <section className="hero-panel">
          <div className="hero-content">
            <div className="pill">
              <span className="live-dot" />
              AI RELIABILITY ENGINE
            </div>

            <h2>
              Predict disruptions. Understand incidents.
              <br />
              <span>Heal. Pay.</span>
            </h2>

            <p>
              Autonomous AI-driven payment infrastructure orchestration.
              Detect abnormal behavior, investigate incidents, and coordinate
              controlled recovery from one intelligent workspace.
            </p>

            <div className="hero-actions">
              <button
                className="button primary"
                onClick={() => setPage("Recovery Lab")}
              >
                ✳ Open Recovery Lab
              </button>
              <button
                className="button secondary"
                onClick={() => setPage("Digital Twin")}
              >
                Explore Digital Twin ↗
              </button>
            </div>

            <div className="hero-footnote">
              <span className="live-dot" />
              Observe  ·  Explain  ·  Approve  ·  Verify
            </div>
          </div>

          <div className="hero-visual" aria-label="NEXORA reliability illustration">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <span className="orbit-node node-right">PAYMENT</span>
            <div className="core-logo"> WITH </div>
            <div className="visual-label">
              <span className="live-dot" />
              INTELLIGENCE
            </div>
          </div>
        </section>

        {notice && (
          <div className="notice" role="status">
            <span>✳</span>
            {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        {page === "Overview" && (
          <>
            <section className="section-heading">
              <div>
                <h2>SYSTEM OVERVIEW</h2>
                <p>Illustrative metrics from dataset</p>
              </div>
              <span className="demo-label">● LOCAL DATA</span>
            </section>

            <section className="metric-grid">
              <Metric
                icon="⇄"
                tone="cyan"
                label="Payment success"
                value={`${successRate}%`}
                note="Transactions"
              />
              <Metric
                icon="₹"
                tone="green"
                label="Tracked transactions"
                value={transactions.length}
                note="Illustration"
              />
              <Metric
                icon="⌁"
                tone="violet"
                label="Failed transactions"
                value={failedCount}
                note="In dataset"
              />
              <Metric
                icon="◎"
                tone="green"
                label="API connection"
                value={health ? "Online" : "Unverified"}
                note={health ? "Backend responded" : "Check local backend"}
              />
            </section>

            <section className="content-grid">
              <div className="panel">
                <PanelHeading
                  title="Autonomous Recovery Lab"
                  subtitle="Test incidents without affecting real payments"
                  tag="SIGNATURE FEATURE"
                />

                <div className="lab-intro">
                  <div className="lab-icon">
                    ✳</div>
                  <div>
                    <strong>Run a controlled failure experiment</strong>
                    <p>
                      
                       Inject a scenario, inspect the diagnosis, then approve
                      and verify a simulated recovery.
                    </p>
                  </div>
                </div>

                <label className="field-label" htmlFor="incident-type">
                 
                  SELECT FAILURE SCENARIO ANALYSE BEFORE RECOVERY
                </label>
                <select
                  id="incident-type"
                  value={injection}
                  onChange={(event) => setInjection(event.target.value)}
                  className="select-control"
                >
                  <option value="latency">API latency spike</option>
                  <option value="timeout">Payment gateway timeout</option>
                  <option value="failures">Payment failure surge</option>
                </select>

                <button
                  className="button primary full-button"
                  onClick={() => startIncident(injection)}
                >
                  + Select Failure
                </button>

                <div className="workflow">
                  {[" Detect", " Diagnose", " Approve", " Verify"].map(
                    (step, index) => {
                      const complete = [
                        Boolean(incident),
                        diagnosed,
                        approved,
                        recovered,
                      ][index];

                      return (
                        <div className="workflow-step" key={step}>
                          <span className={complete ? " step done" : " step"}>
                            {complete ? "✓" : index + 1}
                          </span>
                          <small>{step}</small>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="panel">
                <PanelHeading
                  title="Incident Commander"
                  subtitle="Prioritize what needs attention"
                  tag={`${history.length} RESOLVED`}
                />

                {incident ? (
                  <IncidentSummary incident={incident} />
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">⌘ </span>
                    <strong>No active incident</strong>
                    <p>
                      Inject a failure to reveal its suspected cause, severity,
                      and recommended response.
                    </p>
                    <button
                      className="button secondary"
                      onClick={() => setPage("Incident Commander")}
                    >
                      Open command center ↗
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="content-grid lower-grid">
              <DigitalTwin incident={incident} recovered={recovered} />
              <PaymentTable transactions={transactions} />
            </section>
          </>
        )}

        {page === "Transactions" && (
          <PaymentTable transactions={transactions} expanded />
        )}

        {page === "Incident Commander" && (
          <section className="panel page-panel">
            <PanelHeading
              title="AI Incident Commander"
              subtitle="Inspect the incident, impact, and response strategy"
              tag="DECISION SUPPORT"
            />
            {incident ? (
              <IncidentSummary incident={incident} expanded />
            ) : (
              <div className="empty-state">
                <span className="empty-icon">⌘ </span>
                <strong>Command center standing by</strong>
                <p>Choose a failure scenario to begin an investigation.</p>
                <button
                  className="button primary"
                  onClick={() => startIncident(injection)}
                >
                  Start Investigation
                </button>
              </div>
            )}
          </section>
        )}

        {page === "Recovery Lab" && (
          <section className="content-grid lab-grid">
            <div className="panel page-panel">
              <PanelHeading
                title="Autonomous Recovery Lab"
                subtitle="A controlled, step-by-step incident experiment"
                tag="EXPERIMENTAL"
              />

              <label className="field-label" htmlFor="lab-scenario">
                FAILURE INJECTION STUDIO
              </label>
              <select
                id="lab-scenario"
                value={injection}
                onChange={(event) => setInjection(event.target.value)}
                className="select-control"
              >
                <option value="latency">Latency spike</option>
                <option value="timeout">Payment timeout</option>
                <option value="failures">Failure surge</option>
              </select>

              <button
                className="button primary full-button"
                onClick={() => startIncident(injection)}
              >
                Inject a new incident
              </button>

              {incident && (
                <div className="incident-report">
                  <div className="report-top">
                    <span className="pill">{incident.severity} SEVERITY</span>
                    <span className="report-id">{incident.id}</span>
                  </div>

                  <h3>{incident.name}</h3>
                  <p className="muted">
                    Created at {incident.createdAt} · Simulated incident
                  </p>

                  <div className="report-grid">
                    <ReportItem label="Suspected cause" value={incident.cause} />
                    <ReportItem
                      label="Affected transactions"
                      value="Potential impact · not a live count"
                    />
                    <ReportItem
                      label="Diagnostic confidence"
                      value={`${incident.confidence}% illustrative`}
                    />
                    <ReportItem label="Recovery risk" value={incident.risk} />
                  </div>

                  <div className="recommendation">
                    <span className="recommendation-icon">✳</span>
                    <div>
                      <strong>Recommended response</strong>
                      <p>{incident.action}</p>
                      <small>
                        Explanation: this action targets the suspected failure
                        while limiting unnecessary repeated requests.
                      </small>
                    </div>
                  </div>

                  <div className="lab-buttons">
                    <button
                      className="button secondary"
                      disabled={busy || diagnosed || recovered}
                      onClick={diagnoseIncident}
                    >
                      {busy
                        ? "Analyzing..."
                        : diagnosed
                          ? "✓ Diagnosed"
                          : "1. Diagnose"}
                    </button>

                    <button
                      className="button secondary"
                      disabled={!diagnosed || approved || recovered}
                      onClick={approveRecovery}
                    >
                      {approved ? "✓ Approved" : "2. Approve action"}
                    </button>

                    <button
                      className="button primary"
                      disabled={!approved || recovered}
                      onClick={executeRecovery}
                    >
                      {recovered ? "✓ Verified" : "3. Verify recovery"}
                    </button>
                  </div>

                  {recovered && (
                    <div className="recovery-success">
                      <span>✓</span>
                      <div>
                        <strong>Demo recovery verified</strong>
                        <p>
                          The simulated workflow completed. No real payments
                          or infrastructure were changed.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    className="text-button"
                    onClick={resetIncident}
                  >
                    Reset experiment ↺
                  </button>
                </div>
              )}

              {!incident && (
                <div className="empty-state">
                  <span className="empty-icon">✳</span>
                  <strong>Lab ready for experimentation</strong>
                  <p>
                    Inject a failure to unlock diagnosis, approval, and
                    recovery verification.
                  </p>
                </div>
              )}
            </div>

            <div className="panel page-panel">
              <PanelHeading
                title="Safety controls"
                subtitle="Human-governed recovery workflow"
                tag="GUARDED"
              />
              <SafetyItem
                title="Human approval gate"
                detail="Recovery execution stays locked until you approve it."
              />
              <SafetyItem
                title="Bounded demo environment"
                detail="Actions update local application state only."
              />
              <SafetyItem
                title="Explainable decisions"
                detail="Display the suspected cause, confidence estimate, and rationale."
              />
              <SafetyItem
                title="Post-action verification"
                detail="A recovery is marked verified only after the demo workflow completes."
              />
              <div className="disclaimer">
                This prototype uses predefined scenario logic, not a live AI
                model or production remediation engine.
              </div>
            </div>
          </section>
        )}

        {page === "Digital Twin" && (
          <DigitalTwin incident={incident} recovered={recovered} expanded />
        )}

        {page === "Cost Radar" && (
          <section className="panel page-panel">
            <PanelHeading
              title="Reliability & Cost Radar"
              subtitle="Illustrative impact comparison for the selected scenario"
              tag="ESTIMATES ONLY"
            />
            <div className="cost-summary">
              <div>
                <span>Selected scenario</span>
                <strong>{currentScenario.name}</strong>
              </div>
              <div>
                <span>Potential exposure</span>
                <strong>₹{currentScenario.savings.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span>Response risk</span>
                <strong>{currentScenario.risk}</strong>
              </div>
            </div>
            <div className="cost-options">
              <CostOption
                name="Observe and escalate"
                description="Preserve system state and request engineer review."
                cost="Lower action risk"
              />
              <CostOption
                name="Controlled recovery"
                description={currentScenario.action}
                cost="Recommended for review"
                recommended
              />
              <CostOption
                name="Aggressive retry"
                description="Could increase duplicate requests or upstream load."
                cost="Higher operational risk"
              />
            </div>
            <p className="muted">
              Amounts and comparisons are illustrative demo values, not actual
              financial losses, measured savings, or financial advice.
            </p>
          </section>
        )}

        {page === "Incident Memory" && (
          <section className="panel page-panel">
            <PanelHeading
              title="AI Incident Memory"
              subtitle="Compare previous demo incidents and outcomes"
              tag={`${history.length} RECORDS`}
            />
            {history.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">◷</span>
                <strong>Your incident memory is empty</strong>
                <p>
                  Complete a simulated recovery to create your first history
                  record.
                </p>
                <button
                  className="button primary"
                  onClick={() => setPage("Recovery Lab")}
                >
                  Open Recovery Lab
                </button>
              </div>
            ) : (
              <div className="memory-list">
                {history.map((item) => (
                  <div className="memory-item" key={item.id}>
                    <span className="memory-icon">✓</span>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.cause}</p>
                      <small>
                        {item.id} · Resolved {item.resolvedAt}
                      </small>
                    </div>
                    <span className="status-pill">RESOLVED</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "Audit Trail" && (
          <section className="panel page-panel">
            <PanelHeading
              title="Audit Trail"
              subtitle="Chronological record of actions in this browser session"
              tag="LOCAL SESSION"
            />
            <div className="audit-list">
              {audit.map((entry, index) => (
                <div className="audit-item" key={`${entry.time}-${index}`}>
                  <span className="audit-line" />
                  <div>
                    <strong>{entry.event}</strong>
                    <p>{entry.detail}</p>
                    <small>{entry.time}</small>
                  </div>
                </div>
              ))}
            </div>
            <p className="muted">
              The audit trail is held in application memory and resets when the
              page reloads. Persistent database storage can be added next.
            </p>
          </section>
        )}

        <footer className="footer">
          <div>
            <strong>NEXORA</strong>
            <span> · Autonomous Payment Reliability</span>
          </div>
          <div className="footer-right">
            <span className="live-dot" />
            Prototype · Demo data · Human-governed recovery
          </div>
        </footer>
      </main>
    </div>
  );
}

function Metric({ icon, tone, label, value, note }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <p>{label}</p>
      <h3>{value}</h3>
      <small>{note}</small>
    </article>
  );
}

function PanelHeading({ title, subtitle, tag }) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <span className="count-badge">{tag}</span>
    </div>
  );
}

function IncidentSummary({ incident, expanded = false }) {
  return (
    <div className="incident-summary">
      <div className="incident-summary-top">
        <span className={`severity ${incident.severity.toLowerCase()}`}>
          {incident.severity}
        </span>
        <span className="muted">{incident.id}</span>
      </div>
      <h3>{incident.name}</h3>
      <p className="muted">Suspected cause</p>
      <strong>{incident.cause}</strong>
      <div className="confidence-row">
        <span>Diagnostic confidence</span>
        <strong>{incident.confidence}%</strong>
      </div>
      <div className="confidence-track">
        <span style={{ width: `${incident.confidence}%` }} />
      </div>
      <div className="recommendation compact">
        <span className="recommendation-icon">✳</span>
        <div>
          <strong>Suggested next step</strong>
          <p>{incident.action}</p>
        </div>
      </div>
      {expanded && (
        <div className="report-grid">
          <ReportItem label="Impact" value={incident.impact} />
          <ReportItem label="Action risk" value={incident.risk} />
          <ReportItem
            label="Approval"
            value="Human review required in this prototype"
          />
          <ReportItem
            label="Environment"
            value="Local simulation only"
          />
        </div>
      )}
    </div>
  );
}

function ReportItem({ label, value }) {
  return (
    <div className="report-item">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function SafetyItem({ title, detail }) {
  return (
    <div className="safety-item">
      <span>✓</span>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function CostOption({ name, description, cost, recommended = false }) {
  return (
    <div className={`cost-option ${recommended ? "recommended" : ""}`}>
      <div>
        <strong>{name}</strong>
        <p>{description}</p>
      </div>
      <span>{cost}</span>
    </div>
  );
}

function DigitalTwin({ incident, recovered, expanded = false }) {
  const nodes = [
    { id: "client", name: "Payment client", x: 45, y: 38 },
    { id: "api", name: "Payment API", x: 225, y: 38 },
    { id: "database", name: "Transaction DB", x: 405, y: 38 },
    { id: "monitor", name: "Observability", x: 135, y: 145 },
    { id: "recovery", name: "Recovery engine", x: 315, y: 145 },
  ];

  const impacted =
    incident && !recovered
      ? incident.type === "timeout"
        ? ["api", "client"]
        : incident.type === "failures"
          ? ["api", "database"]
          : ["api", "monitor"]
      : [];

  return (
    <section className={`panel digital-twin ${expanded ? "twin-expanded" : ""}`}>
      <PanelHeading
        title="Reliability Digital Twin"
        subtitle="Interactive-style map of the demo payment architecture"
        tag={incident && !recovered ? "FAULT INJECTED" : "NOMINAL"}
      />

      <div className="twin-map">
        <svg viewBox="0 0 480 200" role="img" aria-label="Payment service architecture">
          <defs>
            <linearGradient id="link-gradient">
              <stop offset="0%" stopColor="#00e6a0" />
              <stop offset="100%" stopColor="#8a6cff" />
            </linearGradient>
          </defs>
          {[
            [90, 38, 225, 38],
            [270, 38, 405, 38],
            [225, 53, 135, 145],
            [270, 53, 315, 145],
            [165, 145, 285, 145],
          ].map(([x1, y1, x2, y2], index) => (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#link-gradient)"
              strokeWidth="2"
              strokeDasharray={incident && !recovered ? "5 5" : "0"}
              opacity=".75"
            />
          ))}
          {nodes.map((node) => {
            const isImpacted = impacted.includes(node.id);

            return (
              <g key={node.id}>
                <rect
                  x={node.x - 39}
                  y={node.y - 20}
                  width="78"
                  height="40"
                  rx="10"
                  fill={isImpacted ? "#4c2447" : "#201b3b"}
                  stroke={isImpacted ? "#ff7198" : "#00dca0"}
                  strokeWidth="1.5"
                />
                <circle
                  cx={node.x - 27}
                  cy={node.y - 9}
                  r="3"
                  fill={isImpacted ? "#ff7198" : "#00e6a0"}
                />
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  fill="#f1efff"
                  fontSize="8.5"
                  fontWeight="600"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="twin-legend">
        <span><i className="legend-dot healthy" /> Healthy component</span>
        <span><i className="legend-dot fault" /> Simulated fault</span>
      </div>

      <div className="twin-status">
        <span className="live-dot" />
        {recovered
          ? "Recovery marked verified"
          : incident
            ? "Fault highlighted in the simulated architecture"
            : "No simulated component failures"}
      </div>
    </section>
  );
}

function PaymentTable({ transactions, expanded = false }) {
  return (
    <section className={`panel ${expanded ? "page-panel" : ""}`}>
      <PanelHeading
        title="Payment Pulse"
        tag="ILLUSTRATIVE"
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Latency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td><strong>{transaction.id}</strong></td>
                <td>₹{transaction.amount.toLocaleString("en-IN")}</td>
                <td>{transaction.latency} ms</td>
                <td>
                  <span
                    className={`status-pill ${
                      transaction.status === "Failed" ? "failed" : ""
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footnote">
        Illustrative values · PayPal Sandbox not connected yet
      </div>
    </section>
  );
}
export default App;
