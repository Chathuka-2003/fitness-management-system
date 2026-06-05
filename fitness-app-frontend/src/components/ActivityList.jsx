import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const TYPE_META = {
  RUNNING:  { emoji:'🏃', color:'#22c55e', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.2)'   },
  WALKING:  { emoji:'🚶', color:'#60a5fa', bg:'rgba(96,165,250,0.1)',  border:'rgba(96,165,250,0.2)'  },
  CYCLING:  { emoji:'🚴', color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)'  },
  SWIMMING: { emoji:'🏊', color:'#22d3ee', bg:'rgba(34,211,238,0.1)',  border:'rgba(34,211,238,0.2)'  },
  HIIT:     { emoji:'⚡', color:'#f97316', bg:'rgba(249,115,22,0.1)',  border:'rgba(249,115,22,0.2)'  },
  STRENGTH: { emoji:'🏋️', color:'#a78bfa', bg:'rgba(167,139,250,0.1)',border:'rgba(167,139,250,0.2)' },
  YOGA:     { emoji:'🧘', color:'#fb7185', bg:'rgba(251,113,133,0.1)', border:'rgba(251,113,133,0.2)' },
  HIKING:   { emoji:'🥾', color:'#86efac', bg:'rgba(134,239,172,0.1)', border:'rgba(134,239,172,0.2)' },
}
const DEF = { emoji:'💪', color:'#818cf8', bg:'rgba(129,140,248,0.1)', border:'rgba(129,140,248,0.2)' }

// backend may return type as "type" or "activityType" — handle both
const getType = (a) => {
  const type = a.type || a.activityType || a.activity_type || null
  if (type) {
    console.log('Found activity type:', type, 'from activity:', a)
  } else {
    console.log('Activity type not found in:', a)
  }
  return type
}
const getMeta = (t) => TYPE_META[t?.toUpperCase()] ?? DEF

const fmt = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function ActivityList() {
  const token = useSelector(s => s.auth.token)
  const userId = useSelector(s => s.auth.userId)
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [recommendations, setRecommendations] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('http://localhost:8080/api/activities', {
          headers: { Authorization:`Bearer ${token}`, 'X-User-ID':userId }
        })
        if (r.ok) {
          const data = await r.json()
          console.log('Full activities response:', data) // debug full response
          console.log('Activities sample:', data[0]) // debug field names
          console.log('Activity keys:', data[0] ? Object.keys(data[0]) : 'No activities')
          setActivities(data)
          
          // Load recommendations for each activity
          const recs = {}
          for (const activity of data) {
            try {
              const recRes = await fetch(`http://localhost:8080/api/recommendations/activity/${activity.id}`, {
                headers: { Authorization:`Bearer ${token}`, 'X-User-ID':userId }
              })
              if (recRes.ok) {
                const recData = await recRes.json()
                recs[activity.id] = recData.data || recData
              }
            } catch(e) {
              console.error(`Failed to load recommendation for ${activity.id}:`, e)
            }
          }
          setRecommendations(recs)
        }
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (token && userId) load()
  }, [token, userId])

  const getActivityName = (a) => {
    const type = getType(a)
    if (!type) {
      console.warn('No type found for activity:', a)
      return a.name || 'Activity'
    }
    // Capitalize first letter of type
    const typeName = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    return a.name && a.name.toLowerCase() !== 'activity' && a.name !== type ? a.name : typeName
  }

  const types = ['ALL', ...new Set(activities.map(a => getType(a)).filter(Boolean))]
  const filtered = filter === 'ALL' ? activities : activities.filter(a => getType(a) === filter)
  const totalCal = activities.reduce((s,a) => s+(a.caloriesBurned||0), 0)
  const totalMin = activities.reduce((s,a) => s+(a.duration||0), 0)

  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', width:'100%', maxWidth:'100%', boxSizing:'border-box' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .al-stat { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:18px; padding:24px 28px; flex:1; min-width:0; transition:all 0.2s; cursor:pointer; box-sizing:border-box; }
        .al-stat:hover { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.14); transform:translateY(-1px); }
        .al-filter { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:100px; padding:8px 16px; font-size:13px; font-weight:600; color:rgba(255,255,255,0.5); cursor:pointer; font-family:inherit; transition:all 0.18s; }
        .al-filter:hover { border-color:rgba(255,255,255,0.18); color:rgba(255,255,255,0.8); }
        .al-filter.on { background:rgba(34,197,94,0.12); border-color:rgba(34,197,94,0.32); color:#4ade80; }
        .al-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:18px; width:100%; }
        .al-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:18px; padding:20px; cursor:pointer; transition:all 0.25s cubic-bezier(0.4,0,0.2,1); width:100%; box-sizing:border-box; display:flex; flex-direction:column; gap:14px; }
        .al-card:hover { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.12); transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.35); }
        .al-card-header { display:flex; align-items:center; gap:12px; }
        .al-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .al-card-info { flex:1; min-width:0; }
        .al-card-title { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
        .al-card-name { font-size:16; font-weight:600; color:#fff; }
        .al-badge { font-size:12px; font-weight:700; padding:5px 12px; border-radius:100px; }
        .al-card-meta { font-size:13px; color:rgba(255,255,255,0.35); }
        .al-card-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
        .al-stat-item { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:12px; text-align:center; }
        .al-stat-val { font-size:18px; font-weight:700; color:#fff; }
        .al-stat-unit { font-size:11px; color:rgba(255,255,255,0.35); }
        .al-rec { background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.16); border-radius:12px; padding:12px; }
        .al-rec-label { font-size:11px; font-weight:700; color:#4ade80; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:6px; }
        .al-rec-text { font-size:13px; color:rgba(255,255,255,0.5); line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .al-shimmer { background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:18px; height:250px; width:100%; }
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media (max-width:1024px) { .al-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:'#fff', letterSpacing:'-0.6px', margin:0, marginBottom:6 }}>Activities</h1>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', margin:0 }}>Track, analyse and improve every workout</p>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:16, marginBottom:36, width:'100%' }}>
        {[
          { label:'Sessions', val:activities.length, unit:'', icon:'🏁', color:'#818cf8' },
          { label:'Total time', val: totalMin >= 60 ? `${Math.floor(totalMin/60)}h ${totalMin%60}m` : `${totalMin}m`, unit:'', icon:'⏱', color:'#60a5fa' },
          { label:'Calories', val:totalCal.toLocaleString(), unit:'kcal', icon:'🔥', color:'#f97316' },
        ].map(({ label, val, unit, icon, color }) => (
          <div className="al-stat" key={label}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>
              <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.7px' }}>{label}</span>
            </div>
            <div style={{ fontSize:28, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>
              {val} <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:400 }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* List header + filters */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:16 }}>
        <div style={{ fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-0.3px' }}>
          History
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.3)', fontWeight:400, marginLeft:10 }}>{filtered.length} sessions</span>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {types.map(t => {
            const m = getMeta(t)
            return (
              <button key={t} className={`al-filter${filter===t?' on':''}`} onClick={() => setFilter(t)}>
                {t==='ALL' ? '✦ All' : `${m.emoji} ${t[0]+t.slice(1).toLowerCase()}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="al-grid">
          {[1,2,3,4].map(i => <div key={i} className="al-shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 30px', color:'rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:18, width:'100%', boxSizing:'border-box' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🏁</div>
          <div style={{ fontSize:17, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>No activities yet</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>Log your first workout above to get AI insights</div>
        </div>
      ) : (
        <div className="al-grid">
          {filtered.map(a => {
            const type = getType(a)
            const m = getMeta(type)
            const displayName = getActivityName(a)
            const rec = recommendations[a.id]
            const kcalPerMin = a.duration && a.caloriesBurned
              ? Math.round(a.caloriesBurned / a.duration * 10) / 10 : null
            
            return (
              <div className="al-card" key={a.id} onClick={() => navigate(`/activities/${a.id}`)}>
                <div className="al-card-header">
                  <div className="al-icon" style={{ background:m.bg, border:`1px solid ${m.border}` }}>{m.emoji}</div>
                  <div className="al-card-info">
                    <div className="al-card-title">
                      <span className="al-card-name">{displayName}</span>
                    </div>
                    <div className="al-card-meta">
                      {a.createdAt && fmt(a.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="al-card-stats">
                  <div className="al-stat-item">
                    <div className="al-stat-val">{a.duration}</div>
                    <div className="al-stat-unit">min</div>
                  </div>
                  <div className="al-stat-item">
                    <div className="al-stat-val">{a.caloriesBurned}</div>
                    <div className="al-stat-unit">kcal</div>
                  </div>
                </div>
                
                {kcalPerMin && (
                  <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:12, padding:10, textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{kcalPerMin}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>kcal/min</div>
                  </div>
                )}
                
                {rec?.recommendation && (
                  <div className="al-rec">
                    <div className="al-rec-label">✦ AI Recommendation</div>
                    <div className="al-rec-text">{rec.recommendation}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
