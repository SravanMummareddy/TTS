// ── SPARKLINE ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color, w=80, h=32 }) => {
  const max = Math.max(...data), min = Math.min(...data) - 0.5;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h - ((v-min)/(max-min))*h}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id={`sg${color.replace(/[^a-z0-9]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg${color.replace(/[^a-z0-9]/gi,'')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
};

// ── WEEKLY CHART ─────────────────────────────────────────────────────────────
const WeeklyChart = () => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const series = [
    { label:'Tasks',    color:'#7c5cfc', data:[5,7,4,8,6,3,4] },
    { label:'Calories', color:'#f97316', data:[1800,2100,1650,2200,1900,2300,1700] },
    { label:'Fast hrs', color:'#22c55e', data:[22,24,20,24,22,18,22] },
  ];
  const W=400, H=120;

  // Normalize each series 0–H independently
  const renderLine = (s, idx) => {
    const max = Math.max(...s.data), min = Math.min(...s.data) - 0.5;
    const pts = s.data.map((v,i) => {
      const x = 40 + (i / (s.data.length-1)) * (W-40);
      const y = 8 + (1 - (v-min)/(max-min)) * (H-16);
      return `${x},${y}`;
    });
    return (
      <g key={idx}>
        <polyline points={pts.join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.9"/>
        {pts.map((p, i) => {
          const [px,py] = p.split(',');
          return <circle key={i} cx={px} cy={py} r="3" fill={s.color} opacity="0.85"/>;
        })}
      </g>
    );
  };

  return (
    <div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {/* Y gridlines */}
        {[0,0.33,0.66,1].map((t,i) => (
          <line key={i} x1={40} y1={8 + t*(H-16)} x2={W} y2={8 + t*(H-16)} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        ))}
        {/* X labels */}
        {days.map((d,i) => (
          <text key={i} x={40 + (i/6)*(W-40)} y={H} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="var(--font)">{d}</text>
        ))}
        {series.map(renderLine)}
      </svg>
      <div style={{ display:'flex', gap:'16px', marginTop:'12px' }}>
        {series.map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'20px', height:'3px', borderRadius:'2px', background:s.color }}/>
            <span style={{ fontSize:'11px', color:'var(--t3)', fontWeight:500 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, unit, sub, subColor, sparkData, sparkColor, icon, progress }) => (
  <div className="card" style={{ padding:'20px', position:'relative', overflow:'hidden' }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
      <div style={{ fontSize:'11px', fontWeight:600, color:'var(--t3)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:'18px', lineHeight:1 }}>{icon}</div>
    </div>
    <div style={{ display:'flex', alignItems:'baseline', gap:'5px', marginBottom:'6px' }}>
      <span style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-0.03em', color:'var(--t1)', lineHeight:1 }}>{value}</span>
      {unit && <span style={{ fontSize:'13px', fontWeight:500, color:'var(--t3)' }}>{unit}</span>}
    </div>
    <div style={{ fontSize:'12px', fontWeight:600, color: subColor || 'var(--t2)', marginBottom:sparkData?'12px':'0' }}>{sub}</div>
    {progress !== undefined && (
      <div style={{ height:'4px', background:'var(--surface3)', borderRadius:'2px', overflow:'hidden', marginBottom: sparkData ? '10px' : '0' }}>
        <div style={{ height:'100%', width:`${progress}%`, background:sparkColor || 'var(--purple)', borderRadius:'2px', transition:'width 0.6s ease' }}/>
      </div>
    )}
    {sparkData && <Sparkline data={sparkData} color={sparkColor || 'var(--purple)'} w={140} h={36}/>}
  </div>
);

// ── OVERVIEW ─────────────────────────────────────────────────────────────────
const OverviewSection = ({ navigate }) => {
  const [secs, setSecs] = React.useState(22*3600+14*60+33);
  React.useEffect(() => { const t = setInterval(() => setSecs(s => s+1), 1000); return () => clearInterval(t); }, []);
  const fh = Math.floor(secs/3600), fm = Math.floor((secs%3600)/60), fs = secs%60;
  const f2 = n => String(n).padStart(2,'0');
  const target = 24, pct = Math.min(fh/target, 1);
  const circ = 2*Math.PI*52;

  const plans = [
    { done:true,  text:'Morning Skincare Routine', tag:'Routine', sub:'5/7 tasks' },
    { done:true,  text:'Meditation',               tag:'Habit',   sub:'15 min' },
    { done:false, text:'Work on Project',           tag:'Task',    sub:'High priority' },
    { done:false, text:'Evening Walk',              tag:'Habit',   sub:'30 min' },
  ];

  const photos = [
    { label:'Apr 21', grad:'linear-gradient(135deg,oklch(0.28 0.08 280),oklch(0.18 0.05 255))' },
    { label:'Apr 20', grad:'linear-gradient(135deg,oklch(0.26 0.07 165),oklch(0.18 0.05 185))' },
    { label:'Apr 18', grad:'linear-gradient(135deg,oklch(0.30 0.09 55),oklch(0.20 0.06 70))' },
    { label:'Apr 15', grad:'linear-gradient(135deg,oklch(0.25 0.08 18),oklch(0.18 0.05 30))' },
  ];

  const journalEntry = { title:"Grateful for another beautiful morning.", date:"May 12, 2025", preview:"Every morning is a new opportunity to become a better version of myself. Grateful for the little things, the big lessons, and the journey that shapes me every day." };

  return (
    <div style={{ maxWidth:'1280px' }}>
      {/* Greeting */}
      <div style={{ marginBottom:'24px' }}>
        <h2 style={{ fontSize:'26px', fontWeight:800, letterSpacing:'-0.02em', color:'var(--t1)', lineHeight:1 }}>
          Good morning, Jamie 👋
        </h2>
        <p style={{ fontSize:'13px', color:'var(--t3)', fontWeight:500, marginTop:'5px' }}>
          Here is your overview for today · Tuesday, April 21
        </p>
      </div>

      {/* Stat cards row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'16px' }}>
        <StatCard label="Fasting" value={`${fh}:${f2(fm)}`} unit="h" sub={`In Progress · ${target}h goal`} subColor="var(--purple)"
          sparkColor="var(--purple)" sparkData={[18,22,24,20,24,22,24,22]} progress={Math.round(pct*100)} icon="⏱"/>
        <StatCard label="Steps" value="8,979" unit="steps" sub="Goal: 10,000" subColor="var(--teal)"
          sparkColor="var(--teal)" sparkData={[7200,9100,8400,10200,7800,9500,8979]} icon="🚶"/>
        <StatCard label="Calories" value="1,420" unit="kcal" sub="Goal: 2,000 kcal" subColor="var(--orange)"
          sparkColor="var(--orange)" sparkData={[1800,2100,1650,1950,1720,2050,1420]} progress={71} icon="🔥"/>
        <StatCard label="Weight" value="178.4" unit="lbs" sub="↓ 2.1 lbs this week" subColor="var(--green)"
          sparkColor="var(--green)" sparkData={[182,181,180.5,179.8,179.2,178.8,178.4]} icon="⚖"/>
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr 280px', gap:'14px', marginBottom:'14px' }}>

        {/* Today's plan */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <div style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>Today's Plan</div>
            <div style={{ fontSize:'11px', color:'var(--t3)', fontWeight:500 }}>3 of 4</div>
          </div>
          {plans.map((p,i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'11px', padding:'9px 0', borderBottom: i < plans.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${p.done ? 'var(--green)' : 'var(--border2)'}`, background: p.done ? 'var(--green)' : 'transparent', flexShrink:0, marginTop:'1px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
                {p.done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'13px', fontWeight:600, color: p.done ? 'var(--t3)' : 'var(--t1)', textDecoration: p.done ? 'line-through' : 'none', marginBottom:'2px' }}>{p.text}</div>
                <div style={{ fontSize:'11px', color:'var(--t3)' }}>{p.tag} · {p.sub}</div>
              </div>
            </div>
          ))}
          <button onClick={() => navigate('tasks')} style={{ marginTop:'14px', width:'100%', padding:'9px', background:'rgba(124,92,252,0.08)', border:'1px solid rgba(124,92,252,0.2)', borderRadius:'8px', color:'var(--purple)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600, cursor:'pointer', transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(124,92,252,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(124,92,252,0.08)'}>
            View all tasks
          </button>
        </div>

        {/* Center: Fasting + Journal */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {/* Fasting timer */}
          <div className="card" style={{ padding:'24px', display:'flex', alignItems:'center', gap:'24px' }}>
            <div style={{ position:'relative', width:'120px', height:'120px', flexShrink:0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" stroke="var(--surface3)" strokeWidth="7" fill="none"/>
                <circle cx="60" cy="60" r="52" stroke="var(--purple)" strokeWidth="7" fill="none"
                  strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
                  style={{ filter:'drop-shadow(0 0 8px var(--purple-g))', transition:'stroke-dashoffset 1s linear' }}/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.03em', color:'var(--t1)', lineHeight:1 }}>{fh}:{f2(fm)}</div>
                <div style={{ fontSize:'10px', color:'var(--t3)', fontWeight:500, marginTop:'2px' }}>{f2(fs)}s</div>
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:'var(--t3)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'6px' }}>Fasting Timer</div>
              <div style={{ fontSize:'24px', fontWeight:800, color:'var(--t1)', marginBottom:'4px' }}>You're fasting</div>
              <div style={{ fontSize:'13px', color:'var(--t2)', marginBottom:'4px' }}>Elapsed Time</div>
              <div style={{ fontSize:'13px', color:'var(--t3)', marginBottom:'16px' }}>16:8 Intermittent · Started 8:00 PM</div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={() => navigate('fasting')} style={{ padding:'8px 18px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', color:'#ef4444', fontFamily:'var(--font)', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>End Fast</button>
                <button style={{ padding:'8px 16px', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--t2)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>+1h</button>
              </div>
            </div>
          </div>

          {/* Recent journal */}
          <div className="card" style={{ padding:'20px', cursor:'pointer', transition:'border-color 0.2s' }}
            onClick={() => navigate('journal')}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(124,92,252,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <div style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>Recent Journal Entry</div>
              <div style={{ fontSize:'11px', color:'var(--t3)' }}>{journalEntry.date}</div>
            </div>
            <div style={{ fontSize:'16px', fontWeight:700, color:'var(--t1)', marginBottom:'8px', lineHeight:1.3 }}>{journalEntry.title}</div>
            <p style={{ fontSize:'13px', color:'var(--t2)', lineHeight:1.65, fontWeight:400, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{journalEntry.preview}</p>
            <div style={{ marginTop:'12px', fontSize:'12px', fontWeight:600, color:'var(--purple)' }}>Read full entry →</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <div style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>Weekly Activity</div>
            <div style={{ fontSize:'11px', color:'var(--t3)', background:'var(--surface2)', padding:'4px 10px', borderRadius:'20px', fontWeight:500 }}>Apr 14–21</div>
          </div>
          <WeeklyChart />
        </div>
      </div>

      {/* Recent Photos */}
      <div className="card" style={{ padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'var(--t1)' }}>Recent Photos</div>
          <button onClick={() => navigate('gallery')} style={{ fontSize:'12px', fontWeight:600, color:'var(--purple)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font)' }}>View all</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px' }}>
          {photos.map((p,i) => (
            <div key={i} style={{ borderRadius:'10px', aspectRatio:'1/1', background:p.grad, border:'1px solid var(--border)', position:'relative', overflow:'hidden', cursor:'pointer', transition:'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent,transparent 16px,rgba(255,255,255,0.02) 16px,rgba(255,255,255,0.02) 17px)'}}/>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px', background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)' }}>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)', fontWeight:500 }}>{p.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.OverviewSection = OverviewSection;
