const LandingPage = ({ navigate }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const features = [
    { icon: '◈', title: 'Track Everything', desc: 'Tasks, habits, fasting, meals, body & more' },
    { icon: '✦', title: 'Journal & Thoughts', desc: 'Write, reflect and capture moments' },
    { icon: '⬡', title: 'Visual Progress', desc: 'Photos, stats and personal milestones' },
    { icon: '◉', title: 'Private & Secure', desc: 'Your data. Your space. Always private.' },
  ];

  const stats = [
    { value: '47', label: 'Journal entries' },
    { value: '12', label: 'Day streak' },
    { value: '−5.6', label: 'lbs lost' },
    { value: '94%', label: 'Habit rate' },
  ];

  const T = { transition: 'all 0.7s ease' };

  return (
    <div style={{ height:'100vh', overflowY:'auto', overflowX:'hidden', background:'var(--bg)', position:'relative', fontFamily:'var(--font)' }}>
      <div className="orb-layer"><div className="orb orb-p"/><div className="orb orb-g"/><div className="orb orb-t"/></div>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 56px', background:'rgba(12,12,22,0.75)', backdropFilter:'blur(18px)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,var(--purple),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:700, color:'white' }}>P</div>
          <span style={{ fontSize:'15px', fontWeight:700, color:'var(--t1)', letterSpacing:'-0.01em' }}>Personal OS</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'28px' }}>
          {['Journal','Gallery','Features'].map(l => (
            <span key={l} style={{ fontSize:'13px', fontWeight:500, color:'var(--t2)', cursor:'pointer', transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='var(--t1)'} onMouseLeave={e => e.target.style.color='var(--t2)'}>{l}</span>
          ))}
          <button onClick={() => navigate('login')} style={{ padding:'8px 20px', background:'var(--purple)', border:'none', borderRadius:'8px', color:'white', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600, cursor:'pointer', boxShadow:'0 0 24px var(--purple-g)' }}>Login</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'100px 56px 60px', position:'relative', zIndex:1 }}>
        <div style={{ flex:1, maxWidth:'580px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(124,92,252,0.12)', border:'1px solid rgba(124,92,252,0.3)', borderRadius:'20px', padding:'5px 14px', marginBottom:'28px', opacity: mounted?1:0, ...T }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--purple)', animation:'pulse 1.8s ease infinite' }}/>
            <span style={{ fontSize:'12px', fontWeight:600, color:'var(--purple)', letterSpacing:'0.04em' }}>All-in-one personal system</span>
          </div>
          <h1 style={{ fontSize:'clamp(42px,5.5vw,72px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.03em', color:'var(--t1)', marginBottom:'24px', opacity:mounted?1:0, transform:mounted?'none':'translateY(20px)', ...T, transitionDelay:'0.1s' }}>
            A private system<br/>for your <span className="grad-text">life, thoughts</span><br/>and progress.
          </h1>
          <p style={{ fontSize:'17px', fontWeight:400, color:'var(--t2)', lineHeight:1.7, maxWidth:'440px', marginBottom:'40px', opacity:mounted?1:0, ...T, transitionDelay:'0.2s' }}>
            Track. Reflect. Improve. All in one beautifully organized space.
          </p>
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', opacity:mounted?1:0, ...T, transitionDelay:'0.3s' }}>
            <button onClick={() => navigate('login')} style={{ padding:'14px 32px', background:'linear-gradient(135deg,var(--purple),var(--purple-d))', border:'none', borderRadius:'10px', color:'white', fontFamily:'var(--font)', fontSize:'15px', fontWeight:700, cursor:'pointer', boxShadow:'0 8px 32px var(--purple-g)', transition:'transform 0.2s,box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px var(--purple-g)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 32px var(--purple-g)'; }}>
              Enter My System
            </button>
            <button onClick={() => navigate('journal')} style={{ padding:'14px 28px', background:'transparent', border:'1px solid var(--border2)', borderRadius:'10px', color:'var(--t1)', fontFamily:'var(--font)', fontSize:'15px', fontWeight:600, cursor:'pointer', transition:'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--purple)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border2)'}>
              Explore Journal
            </button>
          </div>
        </div>

        {/* ── FLOATING PREVIEW CARDS ── */}
        <div style={{ flex:1, position:'relative', height:'520px', display:'flex', justifyContent:'center', opacity:mounted?1:0, ...T, transitionDelay:'0.4s' }}>
          {/* Main image card */}
          <div style={{ position:'absolute', top:'20px', left:'60px', width:'260px', borderRadius:'18px', overflow:'hidden', border:'1px solid var(--border2)', background:'var(--surface)', boxShadow:'0 24px 60px rgba(0,0,0,0.5)', animation:'float1 7s ease-in-out infinite' }}>
            <div style={{ height:'160px', background:'linear-gradient(135deg,oklch(0.25 0.08 280),oklch(0.18 0.06 220))', position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'flex-start' }}>
              <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.03) 20px,rgba(255,255,255,0.03) 21px)' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(12,12,22,0.8),transparent)' }}/>
              <div style={{ position:'relative', padding:'14px', fontSize:'11px', fontFamily:'monospace', color:'rgba(255,255,255,0.4)' }}>[ landscape photo ]</div>
            </div>
            <div style={{ padding:'14px 16px 16px' }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:'var(--purple)', letterSpacing:'0.06em', marginBottom:'6px' }}>INSIGHT</div>
              <div style={{ fontSize:'14px', fontWeight:700, color:'var(--t1)', lineHeight:1.35 }}>Discipline today.<br/>Freedom tomorrow.</div>
            </div>
          </div>

          {/* Stats card */}
          <div style={{ position:'absolute', top:'0px', right:'40px', width:'200px', borderRadius:'16px', border:'1px solid var(--border2)', background:'var(--surface)', padding:'18px', boxShadow:'0 20px 50px rgba(0,0,0,0.4)', animation:'float2 9s ease-in-out infinite' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--t3)', letterSpacing:'0.08em', marginBottom:'14px' }}>TODAY'S FAST</div>
            <div style={{ fontSize:'36px', fontWeight:800, color:'var(--purple)', letterSpacing:'-0.03em', lineHeight:1 }}>22:14</div>
            <div style={{ fontSize:'12px', color:'var(--t2)', marginTop:'6px', marginBottom:'12px' }}>of 24h goal</div>
            <div style={{ height:'5px', background:'var(--surface3)', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:'92%', background:'linear-gradient(to right,var(--purple),var(--teal))', borderRadius:'3px' }}/>
            </div>
          </div>

          {/* Routine card */}
          <div style={{ position:'absolute', bottom:'60px', left:'40px', width:'230px', borderRadius:'16px', border:'1px solid var(--border2)', background:'var(--surface)', padding:'16px', boxShadow:'0 20px 50px rgba(0,0,0,0.4)', animation:'float1 11s ease-in-out infinite', animationDelay:'3s' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--t3)', letterSpacing:'0.08em', marginBottom:'12px' }}>MORNING ROUTINE</div>
            {['Hydrate 500ml','Cold shower','Meditate 15m'].map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'5px 0' }}>
                <div style={{ width:'16px', height:'16px', borderRadius:'4px', background: i<2 ? 'var(--green)' : 'var(--surface3)', border:`1px solid ${i<2?'var(--green)':'var(--border2)'}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {i<2 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize:'12px', color: i<2 ? 'var(--t3)' : 'var(--t1)', fontWeight:500, textDecoration: i<2 ? 'line-through' : 'none' }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop:'10px', fontSize:'11px', fontWeight:600, color:'var(--green)' }}>5 / 7 complete</div>
          </div>

          {/* Weight card */}
          <div style={{ position:'absolute', bottom:'40px', right:'30px', width:'190px', borderRadius:'16px', border:'1px solid var(--border2)', background:'var(--surface)', padding:'16px', boxShadow:'0 20px 50px rgba(0,0,0,0.4)', animation:'float2 13s ease-in-out infinite', animationDelay:'2s' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--t3)', letterSpacing:'0.08em', marginBottom:'8px' }}>WEIGHT</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
              <span style={{ fontSize:'30px', fontWeight:800, color:'var(--t1)', letterSpacing:'-0.03em' }}>178.4</span>
              <span style={{ fontSize:'13px', color:'var(--t3)', fontWeight:500 }}>lbs</span>
            </div>
            <div style={{ fontSize:'12px', fontWeight:600, color:'var(--green)', marginTop:'4px' }}>↓ 2.1 this week</div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ padding:'0 56px 80px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:'800px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'var(--border)', borderRadius:'var(--r)', overflow:'hidden' }}>
          {stats.map((s,i) => (
            <div key={i} style={{ padding:'28px 24px', background:'var(--surface)', textAlign:'center' }}>
              <div style={{ fontSize:'32px', fontWeight:800, letterSpacing:'-0.03em', background:'linear-gradient(135deg,var(--purple),var(--teal))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'12px', color:'var(--t3)', fontWeight:500, marginTop:'6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{ padding:'0 56px 100px', position:'relative', zIndex:1, maxWidth:'1100px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'52px' }}>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--t1)', marginBottom:'12px' }}>Everything you need.</h2>
          <p style={{ fontSize:'16px', color:'var(--t2)', fontWeight:400 }}>One beautifully organised system for every part of your life.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px' }}>
          {features.map((f,i) => (
            <div key={i} className="card" style={{ padding:'28px 24px', transition:'transform 0.2s,border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='var(--purple)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='var(--border)'; }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(124,92,252,0.12)', border:'1px solid rgba(124,92,252,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginBottom:'16px', color:'var(--purple)' }}>{f.icon}</div>
              <div style={{ fontSize:'15px', fontWeight:700, color:'var(--t1)', marginBottom:'8px' }}>{f.title}</div>
              <div style={{ fontSize:'13px', color:'var(--t2)', lineHeight:1.6, fontWeight:400 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding:'60px 56px 100px', textAlign:'center', position:'relative', zIndex:1, background:'linear-gradient(to bottom,transparent,rgba(124,92,252,0.05),transparent)' }}>
        <h2 style={{ fontSize:'clamp(28px,3.5vw,48px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--t1)', maxWidth:'560px', margin:'0 auto 16px', lineHeight:1.15 }}>Your system is waiting.</h2>
        <p style={{ fontSize:'16px', color:'var(--t2)', marginBottom:'36px' }}>Start tracking, reflecting and growing today.</p>
        <button onClick={() => navigate('login')} style={{ padding:'16px 44px', background:'linear-gradient(135deg,var(--purple),var(--purple-d))', border:'none', borderRadius:'12px', color:'white', fontFamily:'var(--font)', fontSize:'16px', fontWeight:700, cursor:'pointer', boxShadow:'0 8px 40px var(--purple-g)', transition:'transform 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform='none'}>
          Enter My System
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding:'24px 56px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:'linear-gradient(135deg,var(--purple),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, color:'white' }}>P</div>
          <span style={{ fontSize:'13px', fontWeight:600, color:'var(--t2)' }}>Personal OS</span>
        </div>
        <span style={{ fontSize:'12px', color:'var(--t3)' }}>Private. Yours. Always.</span>
      </footer>
    </div>
  );
};

window.LandingPage = LandingPage;
