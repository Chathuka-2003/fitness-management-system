import { useState } from 'react'
import { useAuth } from 'react-oidc-context'

const HomePage = () => {
  const { signinRedirect } = useAuth()
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      fontFamily: '"DM Sans", sans-serif',
      color: '#e8eaf0',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .glow { position: absolute; border-radius: 50%; pointer-events: none; }

        .video-modal {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.92); backdrop-filter: blur(20px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 40px;
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .video-container {
          width: 100%; maxWidth: 1000px; aspect-ratio: 16/9;
          background: #000; border-radius: 24px; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1);
          position: relative;
          transform: scale(0.95);
          animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleUp { to { transform: scale(1); } }

        .close-video {
          position: absolute; top: 30px; right: 30px;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          color: #fff; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; z-index: 1001;
        }
        .close-video:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }

        .nav-link { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; letter-spacing: 0.2px; }
        .nav-link:hover { color: rgba(255,255,255,0.85); }

        .btn-cta {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          border: none;
          padding: 13px 28px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.2px;
          transition: all 0.25s;
          box-shadow: 0 0 24px rgba(34,197,94,0.35);
        }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(34,197,94,0.5); }
        .btn-cta:active { transform: translateY(0); }

        .btn-ghost {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 13px 28px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.9); }

        .pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          color: #4ade80;
          padding: 6px 14px; border-radius: 100px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.4px;
          text-transform: uppercase; margin-bottom: 28px;
        }
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .h1 {
          font-size: clamp(44px, 6vw, 72px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 24px;
        }
        .grad-green {
          background: linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #86efac 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .grad-white {
          background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .metric-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 14px 20px;
          display: flex; flex-direction: column; gap: 2px;
        }

        .fcard {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 28px 24px;
          transition: all 0.3s;
        }
        .fcard:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(34,197,94,0.2);
          transform: translateY(-3px);
        }

        .widget {
          background: rgba(8,12,24,0.95);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 18px 20px;
          backdrop-filter: blur(20px);
        }

        @keyframes up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes up2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes up3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }

        .bar-fill { border-radius: 3px; transition: width 0.3s; }

        .step-row { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 32px; }
        .step-num {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #4ade80;
        }

        .divider { height: 1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); }

        .footer-link { color: rgba(255,255,255,0.3); text-decoration: none; font-size: 13px; transition: color 0.2s; }
        .footer-link:hover { color: rgba(255,255,255,0.6); }

        .testimonial {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 24px;
        }

        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; flex-shrink: 0;
        }
      `}</style>

      {/* Glows */}
      <div className="glow" style={{ width:700, height:700, background:'radial-gradient(circle,rgba(34,197,94,0.08),transparent 70%)', top:-200, right:-150 }} />
      <div className="glow" style={{ width:500, height:500, background:'radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)', bottom:200, left:-100 }} />
      <div className="glow" style={{ width:350, height:350, background:'radial-gradient(circle,rgba(34,197,94,0.05),transparent 70%)', top:'50%', left:'35%' }} />

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 48px', borderBottom:'1px solid rgba(255,255,255,0.05)', position:'relative', zIndex:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>💪</div>
          <span style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>FitPulse<span style={{ color:'#4ade80' }}>AI</span></span>
        </div>
        <div style={{ display:'flex', gap:32, alignItems:'center' }}>
          <a className="nav-link" href="#">Features</a>
          <a className="nav-link" href="#">How it works</a>
          <a className="nav-link" href="#">Pricing</a>
          <a className="nav-link" href="#">Community</a>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button className="btn-ghost" onClick={() => signinRedirect()} style={{ padding:'9px 20px' }}>Sign in</button>
          <button className="btn-cta" onClick={() => signinRedirect()} style={{ padding:'9px 20px' }}>Start free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'90px 48px 60px', display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:60, alignItems:'center', position:'relative', zIndex:5 }}>
        <div>
          <div className="pill"><div className="pill-dot" /> New · AI coaching is live</div>
          <h1 className="h1">
            <span className="grad-green">Your fitness,</span>
            <br /><span className="grad-white">powered by AI.</span>
            <br /><span style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.65em', letterSpacing:'-1px', fontWeight:300 }}>No guesswork. Just results.</span>
          </h1>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', lineHeight:1.75, maxWidth:460, marginBottom:40 }}>
            Log workouts, receive intelligent coaching tailored to your body, and track every metric that matters — all in one beautifully designed platform.
          </p>
          <div style={{ display:'flex', gap:12, marginBottom:52 }}>
            <button className="btn-cta" onClick={() => signinRedirect()} style={{ fontSize:15, padding:'14px 32px' }}>Get started free →</button>
            <button className="btn-ghost" onClick={() => setShowVideo(true)} style={{ fontSize:15, padding:'14px 32px' }}>▶ Watch demo</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { n:'47K+', l:'Active athletes' },
              { n:'3.2M', l:'Workouts tracked' },
              { n:'94%', l:'Goal completion' },
            ].map(({ n, l }) => (
              <div className="metric-chip" key={l}>
                <span style={{ fontSize:22, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>{n}</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero widgets */}
        <div style={{ position:'relative', height:520 }}>
          {/* Activity card center */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:300, animation:'up 7s ease-in-out infinite' }}>
            <div className="widget">
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🏃</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>Morning Run</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>Today · 6:24 AM</div>
                </div>
                <div style={{ marginLeft:'auto', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', color:'#4ade80', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:100 }}>Done</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
                {[{v:'5.4km',l:'Distance'},{v:'31min',l:'Duration'},{v:'324',l:'Calories'}].map(({ v, l }) => (
                  <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{v}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:8 }}>Weekly pace (min/km)</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:36 }}>
                  {[60,75,55,80,65,90,70].map((h, i) => (
                    <div key={i} style={{ flex:1, height:`${h}%`, background: i===5 ? '#22c55e' : 'rgba(255,255,255,0.08)', borderRadius:3 }} />
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                  {['M','T','W','T','F','S','S'].map((d,i) => (
                    <span key={i} style={{ fontSize:9, color: i===5 ? '#4ade80' : 'rgba(255,255,255,0.2)', flex:1, textAlign:'center' }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI card top-right */}
          <div style={{ position:'absolute', top:20, right:-10, width:210, animation:'up2 5s ease-in-out infinite', animationDelay:'1.2s' }}>
            <div className="widget">
              <div style={{ fontSize:10, color:'#4ade80', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10 }}>✦ AI Coach</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.55 }}>
                Push your long run to <span style={{ color:'#fff', fontWeight:600 }}>7km</span> this Sunday — your recovery score is excellent.
              </div>
              <div style={{ marginTop:12, display:'flex', gap:6 }}>
                <div style={{ flex:1, height:3, borderRadius:2, background:'#22c55e' }} />
                <div style={{ flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,0.08)' }} />
                <div style={{ flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,0.08)' }} />
              </div>
            </div>
          </div>

          {/* Streak card bottom-left */}
          <div style={{ position:'absolute', bottom:40, left:-20, width:160, animation:'up3 8s ease-in-out infinite', animationDelay:'0.5s' }}>
            <div className="widget" style={{ textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:4 }}>🔥</div>
              <div style={{ fontSize:28, fontWeight:700, color:'#fb923c', letterSpacing:'-1px' }}>21</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>Day streak</div>
              <div style={{ marginTop:10, display:'flex', justifyContent:'center', gap:3 }}>
                {[1,1,1,1,1,1,1].map((_, i) => (
                  <div key={i} style={{ width:6, height:6, borderRadius:2, background:'#fb923c', opacity: i<5 ? 1 : 0.2 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Heart rate pill top-left */}
          <div style={{ position:'absolute', top:50, left:10, width:150, animation:'up2 6s ease-in-out infinite', animationDelay:'3s' }}>
            <div className="widget" style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ fontSize:20 }}>❤️</div>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:'#f87171', letterSpacing:'-0.5px' }}>148 <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:400 }}>bpm</span></div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Peak zone</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" style={{ margin:'0 48px' }} />

      {/* HOW IT WORKS */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'80px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'#4ade80', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:16 }}>How it works</div>
          <h2 style={{ fontSize:40, fontWeight:700, letterSpacing:'-1.2px', color:'#fff', lineHeight:1.15, marginBottom:20 }}>
            From first rep<br />to peak performance
          </h2>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:15, lineHeight:1.75, marginBottom:48, maxWidth:380 }}>
            FitPulseAI learns your body, adapts to your schedule, and keeps you progressing — week after week.
          </p>
          <div>
            {[
              { n:'01', t:'Log your activity', d:'Record any workout in seconds. Running, cycling, strength, yoga — we support 60+ activity types.' },
              { n:'02', t:'AI analyses your data', d:'Our models study your performance patterns, recovery signals, and progression trends.' },
              { n:'03', t:'Get personalised coaching', d:'Receive actionable recommendations timed perfectly to your training cycle.' },
            ].map(({ n, t, d }) => (
              <div className="step-row" key={n}>
                <div className="step-num">{n}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#fff', marginBottom:6 }}>{t}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.6 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-cta" onClick={() => signinRedirect()} style={{ marginTop:8 }}>Start your journey →</button>
        </div>

        {/* Progress widget */}
        <div className="widget" style={{ padding:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>Weekly progress</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:2 }}>Jun 2 – Jun 8, 2026</div>
            </div>
            <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', color:'#4ade80', fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:100 }}>+18%</div>
          </div>

          {[
            { label:'Running', pct:78, color:'#22c55e', val:'24.3km' },
            { label:'Strength', pct:55, color:'#818cf8', val:'4 sessions' },
            { label:'Cycling', pct:40, color:'#f59e0b', val:'62km' },
            { label:'Recovery', pct:90, color:'#34d399', val:'Excellent' },
          ].map(({ label, pct, color, val }) => (
            <div key={label} style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>{label}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{val}</span>
              </div>
              <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:3 }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop:24, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:12 }}>Calories burned this week</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:60 }}>
              {[45,65,50,80,60,95,70].map((h, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:'100%', height:`${h}%`, background: i===5 ? 'linear-gradient(180deg,#22c55e,#16a34a)' : 'rgba(255,255,255,0.07)', borderRadius:'4px 4px 0 0' }} />
                  <span style={{ fontSize:9, color: i===5 ? '#4ade80' : 'rgba(255,255,255,0.2)' }}>
                    {['M','T','W','T','F','S','S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" style={{ margin:'0 48px' }} />

      {/* FEATURES GRID */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'80px 48px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:11, color:'#4ade80', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:16 }}>Features</div>
          <h2 style={{ fontSize:42, fontWeight:700, letterSpacing:'-1.2px', color:'#fff', lineHeight:1.15 }}>Everything a serious<br />athlete needs</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { e:'🤖', bg:'rgba(99,102,241,0.1)', bc:'rgba(99,102,241,0.2)', t:'AI Coaching', d:'Personalised plans that adapt to your performance, recovery, and goals in real time.' },
            { e:'📈', bg:'rgba(34,197,94,0.08)', bc:'rgba(34,197,94,0.18)', t:'Smart Analytics', d:'Visualise trends across pace, power, heart rate, and 30+ metrics with stunning charts.' },
            { e:'⚡', bg:'rgba(251,191,36,0.08)', bc:'rgba(251,191,36,0.18)', t:'60+ Activities', d:'Running, cycling, swimming, HIIT, yoga, strength — every discipline beautifully tracked.' },
            { e:'🔥', bg:'rgba(251,113,133,0.08)', bc:'rgba(251,113,133,0.18)', t:'Streak System', d:'Stay motivated with daily streaks, milestone badges, and community leaderboards.' },
            { e:'💤', bg:'rgba(139,92,246,0.08)', bc:'rgba(139,92,246,0.18)', t:'Recovery Tracking', d:'Monitor sleep, HRV, and soreness to train hard without burning out.' },
            { e:'🎯', bg:'rgba(20,184,166,0.08)', bc:'rgba(20,184,166,0.18)', t:'Goal Engine', d:'Set SMART goals. Weekly check-ins and auto-adjusted targets keep you on track.' },
          ].map(({ e, bg, bc, t, d }) => (
            <div className="fcard" key={t}>
              <div style={{ width:48, height:48, borderRadius:14, background:bg, border:`1px solid ${bc}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:18 }}>{e}</div>
              <div style={{ fontSize:15, fontWeight:600, color:'#fff', marginBottom:8 }}>{t}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.65 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ margin:'0 48px' }} />

      {/* TESTIMONIALS */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'80px 48px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:11, color:'#4ade80', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:14 }}>Loved by athletes</div>
          <h2 style={{ fontSize:36, fontWeight:700, letterSpacing:'-1px', color:'#fff' }}>Real results, real people</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { name:'Sarah K.', role:'Marathon runner', init:'SK', color:'#22c55e', colorBg:'rgba(34,197,94,0.15)', q:'FitPulseAI completely changed how I train. The AI caught my overtraining before I even felt it. PR\'d my last marathon by 8 minutes.' },
            { name:'James T.', role:'Strength athlete', init:'JT', color:'#818cf8', colorBg:'rgba(129,140,248,0.15)', q:'The analytics are insane. I can see exactly which sessions correlate with my best lifts. My programming has never been smarter.' },
            { name:'Maya R.', role:'Triathlete', init:'MR', color:'#f59e0b', colorBg:'rgba(245,158,11,0.15)', q:'Managing three sports used to be chaos. Now FitPulseAI balances my load automatically. I hit podium in my first Ironman.' },
          ].map(({ name, role, init, color, colorBg, q }) => (
            <div className="testimonial" key={name}>
              <div style={{ display:'flex', gap:4, marginBottom:16 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#f59e0b', fontSize:13 }}>★</span>)}
              </div>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:20 }}>"{q}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div className="avatar" style={{ background:colorBg, color:color }}>{init}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ margin:'0 48px' }} />

      {/* CTA SECTION */}
      <section style={{ maxWidth:720, margin:'0 auto', padding:'100px 48px 120px', textAlign:'center', position:'relative', zIndex:5 }}>
        <div style={{ width:64, height:64, borderRadius:20, background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 28px' }}>💪</div>
        <h2 style={{ fontSize:52, fontWeight:700, letterSpacing:'-2px', lineHeight:1.1, marginBottom:20 }}>
          <span className="grad-green">Ready to level</span><br />
          <span className="grad-white">up your fitness?</span>
        </h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:16, lineHeight:1.75, marginBottom:40, maxWidth:480, margin:'0 auto 40px' }}>
          Join 47,000+ athletes already training smarter with FitPulseAI. Your first month is completely free.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:20 }}>
          <button className="btn-cta" onClick={() => signinRedirect()} style={{ fontSize:16, padding:'15px 40px' }}>Start for free →</button>
          <button className="btn-ghost" onClick={() => window.open('https://wa.me/94770522297', '_blank')} style={{ fontSize:16, padding:'15px 40px' }}>Talk to us</button>
        </div>
        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12, letterSpacing:'0.3px' }}>No credit card · Cancel anytime · Free forever plan available</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'40px 48px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, background:'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>💪</div>
          <span style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.6)' }}>FitPulseAI</span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {['Privacy','Terms','Support','Status'].map(l => <a key={l} className="footer-link" href="#">{l}</a>)}
        </div>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2026 FitPulseAI. All rights reserved.</span>
      </footer>

      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <button className="close-video" onClick={() => setShowVideo(false)}>×</button>
          <div className="video-container" onClick={e => e.stopPropagation()}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/UIFE7LutW60?autoplay=1"
              title="FitPulse AI Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
