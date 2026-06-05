import { useState } from 'react'
import { addActivity } from '../services/api'

const ACTIVITIES = [
  { value:'RUNNING',       label:'Running',       emoji:'🏃' },
  { value:'WALKING',       label:'Walking',       emoji:'🚶' },
  { value:'CYCLING',       label:'Cycling',       emoji:'🚴' },
  { value:'SWIMMING',      label:'Swimming',      emoji:'🏊' },
  { value:'WEIGHTLIFTING', label:'Weightlifting', emoji:'🏋️' },
  { value:'YOGA',          label:'Yoga',          emoji:'🧘' },
  { value:'HIKING',        label:'Hiking',        emoji:'🥾' },
  { value:'OTHER',         label:'Other',         emoji:'⚡' }
]

export default function ActivityForm({ onActivitiesAdded }) {
  const [activity, setActivity] = useState({ type:'RUNNING', duration:'', caloriesBurned:'', additionalMetrics:{} })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!activity.duration || !activity.caloriesBurned) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    try {
      await addActivity(activity)
      setSuccess(true)
      setActivity({ type:'RUNNING', duration:'', caloriesBurned:'', additionalMetrics:{} })
      setTimeout(() => setSuccess(false), 4000)
      onActivitiesAdded()
    } catch(e) { console.error(e); setError('Failed to log activity. Please try again.') }
    finally { setLoading(false) }
  }

  const sel = ACTIVITIES.find(a => a.value === activity.type)
  const kcalPerMin = activity.duration && activity.caloriesBurned
    ? Math.round(activity.caloriesBurned / activity.duration * 10) / 10 : null

  return (
    <div style={{ fontFamily:'"DM Sans",sans-serif', width:'100%', maxWidth:'100%', boxSizing:'border-box' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .af-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:22px; padding:32px; width:100%; box-sizing:border-box; }
        .af-lbl { font-size:12px; font-weight:700; color:rgba(255,255,255,0.38); text-transform:uppercase; letter-spacing:0.8px; display:block; margin-bottom:12px; }
        .af-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:28px; }
        .af-chip { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:14px 8px; text-align:center; cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .af-chip:hover { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.14); }
        .af-chip.on { background:rgba(34,197,94,0.12); border-color:rgba(34,197,94,0.3); }
        .af-chip-e { font-size:22px; display:block; margin-bottom:5px; }
        .af-chip-l { font-size:11px; font-weight:600; color:rgba(255,255,255,0.38); }
        .af-chip.on .af-chip-l { color:#4ade80; }
        .af-row2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
        .af-field { position:relative; }
        .af-inp { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px 52px 14px 18px; font-size:16px; font-weight:500; color:#fff; font-family:inherit; outline:none; transition:all 0.2s; -moz-appearance:textfield; box-sizing:border-box; }
        .af-inp::-webkit-outer-spin-button,.af-inp::-webkit-inner-spin-button{-webkit-appearance:none}
        .af-inp::placeholder{color:rgba(255,255,255,0.2)}
        .af-inp:focus{border-color:rgba(34,197,94,0.45);background:rgba(34,197,94,0.04)}
        .af-unit { position:absolute; right:16px; top:50%; transform:translateY(-50%); font-size:12px; color:rgba(255,255,255,0.28); font-weight:600; pointer-events:none; }
        .af-preview { display:flex; align-items:center; gap:14px; background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.16); border-radius:14px; padding:15px 20px; margin-bottom:22px; }
        .af-btn { width:100%; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; border-radius:14px; padding:16px 20px; font-size:16px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.25s; box-shadow:0 0 20px rgba(34,197,94,0.25); letter-spacing:0.3px; }
        .af-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 36px rgba(34,197,94,0.4)}
        .af-btn:disabled{opacity:0.55;cursor:not-allowed}
        .af-success{display:flex;align-items:center;gap:10px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:14px;color:#4ade80;font-weight:500}
        .af-error{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.24);border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:14px;color:#f87171}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="af-card">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>➕</div>
          <div>
            <div style={{ fontSize:19, fontWeight:700, color:'#fff', letterSpacing:'-0.3px' }}>Log Activity</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginTop:2 }}>Track your workout · get AI insights</div>
          </div>
        </div>

        {success && <div className="af-success"><span style={{ fontSize:16 }}>✓</span> Logged! AI is analysing your performance...</div>}
        {error && <div className="af-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="af-lbl">Activity type</label>
          <div className="af-grid">
            {ACTIVITIES.map(({ value, label, emoji }) => (
              <button key={value} type="button" className={`af-chip${activity.type===value?' on':''}`}
                onClick={() => setActivity({ ...activity, type:value })}>
                <span className="af-chip-e">{emoji}</span>
                <span className="af-chip-l">{label}</span>
              </button>
            ))}
          </div>

          <div className="af-row2">
            <div>
              <label className="af-lbl">Duration</label>
              <div className="af-field">
                <input className="af-inp" type="number" placeholder="45" value={activity.duration}
                  onChange={e => setActivity({ ...activity, duration:e.target.value })} required />
                <span className="af-unit">min</span>
              </div>
            </div>
            <div>
              <label className="af-lbl">Calories burned</label>
              <div className="af-field">
                <input className="af-inp" type="number" placeholder="320" value={activity.caloriesBurned}
                  onChange={e => setActivity({ ...activity, caloriesBurned:e.target.value })} required />
                <span className="af-unit">kcal</span>
              </div>
            </div>
          </div>

          {kcalPerMin && (
            <div className="af-preview">
              <span style={{ fontSize:22 }}>{sel?.emoji}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.5)' }}>
                <span style={{ color:'#fff', fontWeight:600 }}>{sel?.label}</span>
                {' · '}<span style={{ color:'#fff', fontWeight:600 }}>{activity.duration} min</span>
                {' · '}<span style={{ color:'#fff', fontWeight:600 }}>{activity.caloriesBurned} kcal</span>
                <span style={{ color:'rgba(255,255,255,0.35)' }}> · {kcalPerMin} kcal/min</span>
              </span>
            </div>
          )}

          <button className="af-btn" type="submit" disabled={loading}>
            {loading
              ? <span style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                  <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
                  Logging...
                </span>
              : `Log ${sel?.label} →`
            }
          </button>
        </form>
      </div>
    </div>
  )
}