import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const NAV_ITEMS = [
  { icon: '➕', label: 'Log Activity', path: '/log-activity', active: true },
  { icon: '📋', label: 'Activities',  path: '/activities',   active: true },
  { icon: '📊', label: 'Analytics',   path: '/analytics',    soon: true    },
  { icon: '🎯', label: 'Goals',       path: '/goals',        soon: true    },
  { icon: '💤', label: 'Recovery',    path: '/recovery',     soon: true    },
  { icon: '🏆', label: 'Leaderboard', path: '/leaderboard',  soon: true    },
]

export default function Layout({ children, onLogout }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const user      = useSelector((s) => s.auth.user)
  const [collapsed, setCollapsed] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.preferred_username?.slice(0, 2).toUpperCase() ?? 'U')

  const displayName = user?.name ?? user?.preferred_username ?? 'Athlete'
  const email       = user?.email ?? ''

  return (
    <div style={css.shell}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Sidebar ── */}
      <aside style={{ ...css.sidebar, width: collapsed ? 72 : 248 }}>

        {/* Logo row */}
        <div style={css.logoRow}>
          <div style={css.logoMark}>💪</div>
          {!collapsed && (
            <span style={css.logoText}>
              FitPulse<span style={{ color: '#4ade80' }}>AI</span>
            </span>
          )}
          <button
            style={{ ...css.collapseBtn, marginLeft: collapsed ? 0 : 'auto' }}
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>
              {collapsed ? '›' : '‹'}
            </span>
          </button>
        </div>

        {/* Section label */}
        {!collapsed && <div style={css.sectionLabel}>Menu</div>}

        {/* Nav items */}
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(({ icon, label, path, soon }) => {
            const isActive = location.pathname.startsWith(path)
            return (
              <button
                key={path}
                className={`fp-nav${isActive ? ' fp-nav--active' : ''}${soon ? ' fp-nav--soon' : ''}`}
                onClick={() => !soon && navigate(path)}
                title={collapsed ? label : undefined}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              >
                <span className="fp-nav__icon">{icon}</span>
                {!collapsed && <span className="fp-nav__label">{label}</span>}
                {!collapsed && soon && <span className="fp-soon-pill">Soon</span>}
                {!collapsed && isActive && <span style={css.activeDot} />}
              </button>
            )
          })}
        </nav>

        {/* AI Coach tip strip */}
        {!collapsed && (
          <div style={css.aiStrip}>
            <div style={css.aiStripDot} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', marginBottom: 3 }}>AI Coach</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.55 }}>
                Recovery score: <span style={{ color: '#fff', fontWeight: 600 }}>87</span> — great day for a run.
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={css.divider} />

        {/* User card */}
        <div style={css.userCard}>
          <div style={css.avatar}>{initials}</div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={css.userName}>{displayName}</div>
              {email && <div style={css.userEmail}>{email}</div>}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          className="fp-logout"
          onClick={onLogout}
          title={collapsed ? 'Sign out' : undefined}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fp-logout-icon"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {!collapsed && <span>Sign out</span>}
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={css.main}>
        {/* Top bar */}
        <header style={css.topBar}>
          <div style={css.breadcrumb}>
            {NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.icon ?? '🏠'}
            <span style={css.breadcrumbText}>
              {NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.label ?? 'Home'}
            </span>
          </div>

          <div style={css.topBarRight}>
            <div style={css.streakPill}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>21</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>day streak</span>
            </div>
            <div style={css.topAvatar}>{initials}</div>
          </div>
        </header>

        {/* Page content — scrolls naturally, no nested overflow container */}
        <div style={css.content}>
          {children}
        </div>
      </main>
    </div>
  )
}

/* ─── Styles ─────────────────────────────────────────────── */

const css = {
  shell: {
    height: '100vh',          // Exactly the viewport — no overflow here
    background: '#060810',
    display: 'flex',
    fontFamily: '"DM Sans", sans-serif',
    color: '#e8eaf0',
    overflow: 'hidden',       // Shell never scrolls; only main content does
  },
  sidebar: {
    background: 'rgba(255,255,255,0.02)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '26px 16px',
    height: '100vh',
    transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
    flexShrink: 0,
    zIndex: 20,
    position: 'relative',
  },

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 4,
    marginBottom: 32,
    minHeight: 40,
  },
  logoMark: {
    width: 36, height: 36, flexShrink: 0,
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 17,
  },
  logoText: {
    fontSize: 18, fontWeight: 700, color: '#fff',
    letterSpacing: '-0.4px', whiteSpace: 'nowrap',
  },
  collapseBtn: {
    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', padding: 0,
  },

  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)',
    textTransform: 'uppercase', letterSpacing: '1px',
    padding: '0 12px', marginBottom: 8,
  },

  activeDot: {
    marginLeft: 'auto', width: 5, height: 5,
    borderRadius: '50%', background: '#4ade80', flexShrink: 0,
  },

  aiStrip: {
    margin: '18px 0 14px',
    padding: '14px 16px',
    background: 'rgba(34,197,94,0.06)',
    border: '1px solid rgba(34,197,94,0.14)',
    borderRadius: 13,
    display: 'flex', alignItems: 'flex-start', gap: 11,
  },
  aiStripDot: {
    width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
    marginTop: 6, flexShrink: 0,
    boxShadow: '0 0 8px rgba(74,222,128,0.7)',
    animation: 'gpulse 2s ease-in-out infinite',
  },

  divider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0 14px' },

  userCard: {
    display: 'flex', alignItems: 'center', gap: 11,
    padding: '10px 12px', borderRadius: 13,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 10, overflow: 'hidden',
  },
  avatar: {
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#fff',
  },
  userName: {
    fontSize: 14, fontWeight: 600, color: '#fff',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  userEmail: {
    fontSize: 12, color: 'rgba(255,255,255,0.28)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
  },

  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 32px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(6,8,16,0.85)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 10,
    flexShrink: 0,
  },
  breadcrumb: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 14, color: 'rgba(255,255,255,0.38)',
  },
  breadcrumbText: {
    fontSize: 15, fontWeight: 600, color: '#fff',
  },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 },
  streakPill: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: 'rgba(251,146,60,0.08)',
    border: '1px solid rgba(251,146,60,0.2)',
    padding: '7px 16px', borderRadius: 100,
    whiteSpace: 'nowrap',
  },
  topAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
    flexShrink: 0,
  },

  // main is the right column — fills remaining width, scrolls vertically
  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100%',
    maxWidth: 'none',
  },
  // content is the only scroll container — page components no longer need minHeight:100vh
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#060810',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    boxSizing: 'border-box',
    justifyContent: 'flex-start',
  },
}

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes gpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

.fp-nav {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.35);
  font-size: 14px;
  font-weight: 500;
  font-family: "DM Sans", sans-serif;
  cursor: pointer;
  transition: all 0.18s;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
}
.fp-nav:hover:not(.fp-nav--soon) {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.78);
}
.fp-nav--active {
  background: rgba(34,197,94,0.11) !important;
  color: #4ade80 !important;
  border: 1px solid rgba(34,197,94,0.2);
}
.fp-nav--soon { opacity: 0.45; cursor: not-allowed; }

.fp-nav__icon { font-size: 16px; flex-shrink: 0; }
.fp-nav__label { flex: 1; text-align: left; }

.fp-soon-pill {
  font-size: 9px; font-weight: 700; letter-spacing: 0.4px;
  background: rgba(99,102,241,0.15);
  color: #818cf8;
  padding: 2px 8px; border-radius: 50px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.fp-logout {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.04);
  background: rgba(255,255,255,0.02);
  color: rgba(255,255,255,0.35);
  font-size: 14px;
  font-weight: 500;
  font-family: "DM Sans", sans-serif;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  margin-top: 4px;
}
.fp-logout:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.15);
  color: #f87171;
  transform: translateY(-1px);
}
.fp-logout-icon {
  opacity: 0.6;
  transition: opacity 0.2s;
}
.fp-logout:hover .fp-logout-icon {
  opacity: 1;
}
`
