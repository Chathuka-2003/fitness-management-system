import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getActivityDetail } from '../services/api'

const TYPE_META = {
  RUNNING:  { emoji:'🏃', color:'#22c55e', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.2)'   },
  WALKING:  { emoji:'🚶', color:'#60a5fa', bg:'rgba(96,165,250,0.1)',  border:'rgba(96,165,250,0.2)'  },
  CYCLING:  { emoji:'🚴', color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)'  },
  SWIMMING: { emoji:'🏊', color:'#22d3ee', bg:'rgba(34,211,238,0.1)',  border:'rgba(34,211,238,0.2)'  },
  OTHER:     { emoji:'⚡', color:'#f97316', bg:'rgba(249,115,22,0.1)',  border:'rgba(249,115,22,0.2)'  },
  WEIGHTLIFTING: { emoji:'🏋️', color:'#a78bfa', bg:'rgba(167,139,250,0.1)',border:'rgba(167,139,250,0.2)' },
  YOGA:     { emoji:'🧘', color:'#fb7185', bg:'rgba(251,113,133,0.1)', border:'rgba(251,113,133,0.2)' },
  HIKING:   { emoji:'🥾', color:'#86efac', bg:'rgba(134,239,172,0.1)', border:'rgba(134,239,172,0.2)' },
}
const DEF = { emoji:'💪', color:'#818cf8', bg:'rgba(129,140,248,0.1)', border:'rgba(129,140,248,0.2)' }
const getMeta = (t) => TYPE_META[t?.toUpperCase()] ?? DEF

const Section = ({ icon, title, bg, border, children }) => (
  <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', marginBottom:18 }}>
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
      <div style={{ width:34, height:34, borderRadius:10, background:bg, border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>
      <span style={{ fontSize:15, fontWeight:700, color:'#fff', letterSpacing:'-0.2px' }}>{title}</span>
    </div>
    <div style={{ padding:'18px 24px' }}>{children}</div>
  </div>
)

const BulletItem = ({ text, index }) => (
  <div style={{ display:'flex', gap:14, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
    <div style={{ width:22, height:22, borderRadius:7, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.24)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#4ade80', flexShrink:0, marginTop:1 }}>{index+1}</div>
    <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.8, margin:0 }}>{text}</p>
  </div>
)

export default function ActivitiesDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useSelector(s => s.auth.token)

  const [rec, setRec] = useState(null)       // recommendation object
  const [activityData, setActivityData] = useState(null) // original activity
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // id here is the ACTIVITY id (from /activities/:id route)
        // getActivityDetail calls /api/recommendations/activity/:id
        const r = await getActivityDetail(id)
        console.log('Detail response:', r.data) // debug
        setRec(r.data)

        // Also fetch the original activity to get duration & caloriesBurned
        const actRes = await fetch(`http://localhost:8080/api/activities/${id}`, {
          headers: { Authorization:`Bearer ${token}` }
        })
        if (actRes.ok) {
          const actData = await actRes.json()
          console.log('Activity data:', actData) // debug
          setActivityData(actData)
        }
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    if (id && token) load()
  }, [id, token])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:'"DM Sans",sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:36, height:36, border:'3px solid rgba(34,197,94,0.2)', borderTopColor:'#22c55e', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>Loading activity...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (!rec && !activityData) return (
    <div style={{ textAlign:'center', padding:60, fontFamily:'"DM Sans",sans-serif' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
      <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)' }}>Activity not found</div>
    </div>
  )

  // Resolve fields — rec may have activityType, activityData has type/activityType + duration + caloriesBurned
  const rawType = rec?.activityType || activityData?.type || activityData?.activityType
  const duration = activityData?.duration ?? rec?.duration
  const caloriesBurned = activityData?.caloriesBurned ?? rec?.caloriesBurned
  const createdAt = activityData?.createdAt || rec?.createdAt

  const meta = getMeta(rawType)
  const typeName = rawType ? rawType[0]+rawType.slice(1).toLowerCase() : 'Activity'
  const kcalPerMin = duration && caloriesBurned
    ? Math.round(caloriesBurned / duration * 10) / 10 : null

  return (
    <div style={{ width:'100%', maxWidth:'100%', padding:'32px 40px 80px', fontFamily:'"DM Sans",sans-serif', boxSizing:'border-box' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Back */}
      <button onClick={() => navigate('/activities')}
        style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', marginBottom:28, padding:0, transition:'color 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.8)'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}
      >← Back to activities</button>

      {/* Hero */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:22, padding:28, marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div style={{ width:58, height:58, borderRadius:17, background:meta.bg, border:`1px solid ${meta.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{meta.emoji}</div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:22, fontWeight:700, color:'#fff', letterSpacing:'-0.4px', margin:0, marginBottom:4 }}>{typeName}</h1>
            {createdAt && <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)' }}>
              {new Date(createdAt).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'})}
            </div>}
          </div>
          <div style={{ background:meta.bg, border:`1px solid ${meta.border}`, color:meta.color, fontSize:12, fontWeight:700, padding:'6px 16px', borderRadius:100, flexShrink:0 }}>Completed</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { label:'Duration',  val: duration ?? '—',       unit:'min',     icon:'⏱' },
            { label:'Calories',  val: caloriesBurned ?? '—', unit:'kcal',    icon:'🔥' },
            { label:'Intensity', val: kcalPerMin ?? '—',     unit:'kcal/min',icon:'⚡' },
          ].map(({ label, val, unit, icon }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'18px 18px' }}>
              <div style={{ fontSize:20, marginBottom:10 }}>{icon}</div>
              <div style={{ fontSize:22, fontWeight:700, color:'#fff', letterSpacing:'-0.4px', marginBottom:3 }}>
                {val} <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:400 }}>{val !== '—' ? unit : ''}</span>
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI divider */}
      {rec && (
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <div style={{ height:1, flex:1, background:'rgba(255,255,255,0.06)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.24)', borderRadius:100, padding:'6px 16px' }}>
            <span style={{ fontSize:12 }}>✦</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#4ade80', textTransform:'uppercase', letterSpacing:'0.7px' }}>AI Analysis</span>
          </div>
          <div style={{ height:1, flex:1, background:'rgba(255,255,255,0.06)' }} />
        </div>
      )}

      {rec?.recommendation && (
        <Section icon="🤖" title="Overall Analysis" bg="rgba(99,102,241,0.1)" border="rgba(99,102,241,0.2)">
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.9, margin:0 }}>{rec.recommendation}</p>
        </Section>
      )}

      {rec?.improvements?.length > 0 && (
        <Section icon="📈" title="Improvements" bg="rgba(34,197,94,0.1)" border="rgba(34,197,94,0.2)">
          {rec.improvements.map((item, i) => <BulletItem key={i} text={item} index={i} />)}
        </Section>
      )}

      {rec?.suggestions?.length > 0 && (
        <Section icon="💡" title="Suggestions" bg="rgba(251,191,36,0.1)" border="rgba(251,191,36,0.2)">
          {rec.suggestions.map((item, i) => <BulletItem key={i} text={item} index={i} />)}
        </Section>
      )}

      {rec?.safety?.length > 0 && (
        <Section icon="🛡️" title="Safety Notes" bg="rgba(251,113,133,0.1)" border="rgba(251,113,133,0.2)">
          {rec.safety.map((item, i) => <BulletItem key={i} text={item} index={i} />)}
        </Section>
      )}

      {!rec && (
        <div style={{ textAlign:'center', padding:'60px 24px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:18 }}>
          <div style={{ fontSize:40, marginBottom:14 }}>🤖</div>
          <div style={{ fontSize:16, color:'rgba(255,255,255,0.45)', marginBottom:7 }}>AI analysis pending</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>Check back in a moment while we process your workout</div>
        </div>
      )}
    </div>
  )
}
