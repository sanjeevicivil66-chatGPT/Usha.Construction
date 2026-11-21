import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const navigation = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Leads", icon: "↗" },
  { label: "Customers", icon: "◎" },
  { label: "Projects", icon: "▦" },
  { label: "Site Visits", icon: "⌖" },
  { label: "Quotations", icon: "▤" },
  { label: "Invoices", icon: "₹" },
  { label: "Content", icon: "✎" },
  { label: "Settings", icon: "⚙" },
];

function Brand() {
  return <div className="brand-lockup" aria-label="USHA Construction and Architect">
    <span className="brand-mark">U</span>
    <span className="brand-type"><strong>USHA</strong><small>CONSTRUCTION &amp; ARCHITECT</small></span>
  </div>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid owner email address.");
      return;
    }
    if (password.length < 1) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setError("Secure sign-in is not connected yet. Your details were not sent or saved. The next release will connect the approved owner-auth service.");
    }, 350);
  }

  return <main className="login-page">
    <section className="login-story">
      <div className="story-top"><Brand /><span className="owner-label">OWNER WORKSPACE</span></div>
      <div className="story-copy">
        <p className="eyebrow">BUILD WITH CLARITY</p>
        <h1>Every project.<br /><em>One clear view.</em></h1>
        <p className="story-lead">A dedicated workspace for managing the work behind every USHA home — from the first enquiry to project completion.</p>
      </div>
      <div className="story-footer"><span>DESIGN · BUILD · RENOVATE</span><span>CHITHOD · ERODE</span></div>
    </section>
    <section className="login-side">
      <div className="login-card">
        <div className="mobile-brand"><Brand /></div>
        <div className="login-heading"><p className="eyebrow">SECURE OWNER ACCESS</p><h2>Welcome back.</h2><p>Sign in to your USHA workspace.</p></div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="owner-email">OWNER EMAIL</label>
          <input id="owner-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
          <div className="password-label"><label htmlFor="owner-password">PASSWORD</label><button type="button" className="text-action" onClick={() => setVisible(v => !v)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? "Hide" : "Show"}</button></div>
          <input id="owner-password" type={visible ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
          {error && <p className="form-message" role="alert">{error}</p>}
          <button className="sign-in" type="submit" disabled={loading}>{loading ? "CHECKING…" : "SIGN IN"} <span aria-hidden="true">↗</span></button>
        </form>
        <div className="login-note"><span className="lock-icon">▣</span><p>Owner access only. No public registration is available.</p></div>
        <p className="preview-note">PREVIEW BUILD · AUTHENTICATION NOT CONNECTED</p>
      </div>
      <footer className="login-footer">© 2026 USHA CONSTRUCTION &amp; ARCHITECT <span>PRIVATE OWNER AREA</span></footer>
    </section>
  </main>;
}

function AdminPreview() {
  const [active, setActive] = useState("Dashboard");
  const [drawer, setDrawer] = useState(false);
  const [account, setAccount] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const current = navigation.find(item => item.label === active) ?? navigation[0];
  if (signedOut) return <Login />;
  return <div className="admin-shell">
    <aside className={drawer ? "sidebar open" : "sidebar"}>
      <div className="sidebar-brand"><Brand /></div>
      <p className="nav-caption">WORKSPACE</p>
      <nav aria-label="Admin navigation">{navigation.map(item => <button key={item.label} className={active === item.label ? "nav-item active" : "nav-item"} onClick={() => {setActive(item.label);setDrawer(false);}}><span>{item.icon}</span>{item.label}{item.label !== "Dashboard" && <small>SOON</small>}</button>)}</nav>
      <div className="sidebar-bottom"><span className="status-dot" /> Local preview only</div>
    </aside>
    {drawer && <button className="drawer-scrim" aria-label="Close navigation" onClick={() => setDrawer(false)} />}
    <section className="admin-main">
      <header className="admin-topbar">
        <button className="drawer-toggle" onClick={() => setDrawer(v => !v)} aria-label="Toggle navigation">☰</button>
        <div className="breadcrumbs">Workspace <span>/</span> <strong>{active}</strong></div>
        <div className="account-wrap"><button className="account-button" onClick={() => setAccount(v => !v)} aria-expanded={account}><span className="avatar">U</span><span className="account-copy"><b>Owner preview</b><small>Local only</small></span><span>⌄</span></button>{account && <div className="account-menu"><button onClick={() => setSignedOut(true)}>Return to login</button></div>}</div>
      </header>
      <main className="dashboard-content">
        <div className="page-title"><div><p className="eyebrow">USHA OWNER WORKSPACE</p><h1>{current.label}</h1><p>Manage your construction business from one place.</p></div><span className="preview-chip">DEVELOPMENT PREVIEW</span></div>
        {active === "Dashboard" ? <>
          <div className="welcome-panel"><div><p className="eyebrow">YOUR WORKSPACE</p><h2>Good work starts with a clear plan.</h2><p>Your owner dashboard is ready for secure data connections.</p></div><div className="welcome-symbol">U</div></div>
          <div className="metric-grid">{["Active leads","Ongoing projects","Quotes to review","Payments received"].map(label => <article className="metric-card" key={label}><span>{label}</span><strong>— —</strong><small>Not connected yet</small></article>)}</div>
          <section className="empty-panel"><div className="empty-icon">▦</div><h3>Your business overview will appear here.</h3><p>Leads, project updates, quotations and payment information will connect in later approved releases.</p><span className="coming-chip">MODULES NOT CONNECTED YET</span></section>
        </> : <section className="empty-panel module-empty"><div className="empty-icon">{current.icon}</div><p className="eyebrow">NEXT WORKSPACE MODULE</p><h2>{active} is coming next.</h2><p>This section is a navigation placeholder only. No records, actions or customer data are available in this preview.</p><span className="coming-chip">COMING NEXT</span></section>}
        <p className="preview-disclaimer">This is a local UI preview. It is not authenticated and must not be deployed as an operational admin dashboard.</p>
      </main>
    </section>
  </div>;
}

const isPreview = import.meta.env.DEV && window.location.pathname === "/admin/preview";
createRoot(document.getElementById("root")!).render(<React.StrictMode>{isPreview ? <AdminPreview /> : <Login />}</React.StrictMode>);
