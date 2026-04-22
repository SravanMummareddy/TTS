// ── ICONS ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size=16, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
    <path d={d} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ICONS = {
  dashboard: "M2 2h5v5H2zm7 0h5v5H9zM2 9h5v5H2zm7 0h5v5H9z",
  journal:   "M3 2h8l2 2v11H3V2zm2 4h6M5 9h6m-6 3h4",
  notes:     "M2 3h12v10H2zm2 3h8m-8 3h5",
  gallery:   "M2 2h12v12H2zM2 9.5l3-3 2.5 2 3-4 3.5 4.5",
  tasks:     "M4 8l2.5 2.5L12 5M2 2h12v12H2z",
  routines:  "M8 2a6 6 0 100 12A6 6 0 008 2zm0 3v3l2 2",
  fasting:   "M8 3a5 5 0 100 10A5 5 0 008 3zm0 2v3l2 1.5",
  nutrition: "M5 2c0 2-2 3-2 5h10c0-2-2-3-2-5M3 7v7h10V7",
  body:      "M8 2a2 2 0 100 4 2 2 0 000-4zM5 8l-1 6h8l-1-6",
  insights:  "M2 12l3-4.5 3 2 3-5.5 3 4",
  settings:  "M6.5 2.5A5.5 5.5 0 018 2a5.5 5.5 0 011.5.5L10.5 4a4 4 0 011 1l1.5.5c.3.6.5 1.3.5 2s-.2 1.4-.5 2L11.5 11a4 4 0 01-1 1L9.5 13.5A5.5 5.5 0 018 14a5.5 5.5 0 01-1.5-.5L5 12a4 4 0 01-1-1L2.5 10.5A5.5 5.5 0 012 8.5c0-.7.2-1.4.5-2L4 6a4 4 0 011-1zm0 4a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z",
  logout:    "M10 8H3m4-4-4 4 4 4m3-9h4v10h-4",
  home:      "M2 7l6-5 6 5v8H2V7z",
};

const NAV = [
  { group: '', items: [{ id:'dashboard', label:'Dashboard', icon:'dashboard' }] },
  { group: 'Life', items: [{ id:'journal', label:'Journal', icon:'journal' }, { id:'notes', label:'Notes', icon:'notes' }, { id:'gallery', label:'Gallery', icon:'gallery' }] },
  { group: 'Body', items: [{ id:'fasting', label:'Fasting', icon:'fasting' }, { id:'nutrition', label:'Nutrition', icon:'nutrition' }, { id:'body', label:'Measurements', icon:'body' }] },
  { group: 'Mind', items: [{ id:'tasks', label:'Tasks', icon:'tasks' }, { id:'routines', label:'Routines', icon:'routines' }] },
  { group: 'System', items: [{ id:'insights', label:'Insights', icon:'insights' }, { id:'settings', label:'Settings', icon:'settings' }] },
];

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const Sidebar = ({ active, navigate }) => {
  const [hov, setHov] = React.useState(null);

  return (
    <aside style={{ width:'var(--sidebar-w)', height:'100vh', background:'#0e0e1c', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0, overflowY:'auto', overflowX:'hidden' }}>
      {/* Logo */}
      <div style={{ padding:'20px 16px 18px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg,var(--purple),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:800, color:'white', flexShrink:0 }}>P</div>
          <div>
            <div style={{ fontSize:'14px', fontWeight:700, color:'var(--t1)', letterSpacing:'-0.01em' }}>Personal OS</div>
            <div style={{ fontSize:'10px', color:'var(--t3)', fontWeight:500 }}>Your system</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px' }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom:'6px' }}>
            {group && <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.10em', color:'var(--t3)', textTransform:'uppercase', padding:'10px 8px 6px' }}>{group}</div>}
            {items.map(item => {
              const isActive = active === item.id;
              const isHov = hov === item.id;
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  onMouseEnter={() => setHov(item.id)} onMouseLeave={() => setHov(null)}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'9px 10px', borderRadius:'10px', background: isActive ? 'rgba(124,92,252,0.15)' : isHov ? 'rgba(255,255,255,0.04)' : 'transparent', border:`1px solid ${isActive ? 'rgba(124,92,252,0.35)' : 'transparent'}`, color: isActive ? 'var(--purple)' : 'var(--t2)', fontFamily:'var(--font)', fontSize:'13px', fontWeight: isActive ? 600 : 500, cursor:'pointer', textAlign:'left', transition:'all 0.15s', marginBottom:'2px' }}>
                  <Ico d={ICONS[item.icon]} size={15} />
                  <span style={{ flex:1 }}>{item.label}</span>
                  {isActive && <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--purple)', flexShrink:0 }}/>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding:'12px 10px 16px', borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', borderRadius:'10px', marginBottom:'4px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,var(--purple),var(--pink))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, color:'white', flexShrink:0 }}>J</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:'13px', fontWeight:600, color:'var(--t1)' }}>Jamie</div>
            <div style={{ fontSize:'10px', color:'var(--t3)' }}>Owner</div>
          </div>
        </div>
        <button onClick={() => navigate('landing')} style={{ width:'100%', display:'flex', alignItems:'center', gap:'9px', padding:'8px 10px', borderRadius:'10px', background:'transparent', border:'none', color:'var(--t3)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:500, cursor:'pointer', transition:'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color='#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color='var(--t3)'}>
          <Ico d={ICONS.logout} size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
};

// ── HEADER ────────────────────────────────────────────────────────────────────
const Header = ({ page }) => {
  const [q, setQ] = React.useState('');
  const labels = { dashboard:'Dashboard', journal:'Journal', notes:'Notes', gallery:'Gallery', tasks:'Tasks', routines:'Routines', fasting:'Fasting', nutrition:'Nutrition', body:'Measurements', insights:'Insights', settings:'Settings' };
  const now = new Date('2026-04-21');
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  return (
    <header style={{ height:'var(--header-h)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0, background:'rgba(12,12,22,0.8)', backdropFilter:'blur(12px)' }}>
      <div>
        <div style={{ fontSize:'11px', color:'var(--t3)', fontWeight:500, marginBottom:'2px' }}>{dateStr}</div>
        <div style={{ fontSize:'20px', fontWeight:800, letterSpacing:'-0.02em', color:'var(--t1)', lineHeight:1 }}>{labels[page] || page}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ position:'relative' }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
            style={{ background:'var(--surface)', border:'1px solid var(--border)', color:'var(--t1)', padding:'7px 12px 7px 34px', borderRadius:'22px', fontFamily:'var(--font)', fontSize:'13px', outline:'none', width:'180px', transition:'width 0.3s, border-color 0.2s' }}
            onFocus={e => { e.target.style.width='240px'; e.target.style.borderColor='var(--purple)'; }}
            onBlur={e => { e.target.style.width='180px'; e.target.style.borderColor='var(--border)'; }} />
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'var(--t3)', pointerEvents:'none' }}>
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M8.5 8.5L11.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Bell */}
        <button style={{ width:'36px', height:'36px', borderRadius:'50%', background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--t2)' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 00-5 5v3l-1 2h12l-1-2V6a5 5 0 00-5-5zm0 13a2 2 0 01-2-2h4a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,var(--purple),var(--pink))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, color:'white', cursor:'pointer' }}>J</div>
      </div>
    </header>
  );
};

// ── SHELL ─────────────────────────────────────────────────────────────────────
const AppShell = ({ page, navigate }) => (
  <div style={{ display:'flex', height:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
    <div className="orb-layer" style={{ opacity:0.45 }}><div className="orb orb-p"/><div className="orb orb-g"/></div>
    <Sidebar active={page} navigate={navigate} />
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', zIndex:1 }}>
      <Header page={page} />
      <main key={page} className="fade-in" style={{ flex:1, overflowY:'auto', padding:'28px' }}>
        {page === 'dashboard' && <OverviewSection navigate={navigate} />}
        {page === 'journal'   && <JournalSection navigate={navigate} />}
        {page === 'tasks'     && <TasksSection />}
        {page === 'gallery'   && <GallerySection />}
        {page === 'fasting'   && <FastingSection />}
        {page === 'notes'     && <NotesSection />}
        {page === 'routines'  && <RoutinesSection />}
        {page === 'insights'  && <InsightsSection />}
        {page === 'nutrition' && <NutritionSection />}
        {page === 'body'      && <BodySection />}
        {page === 'settings'  && <SettingsSection />}
      </main>
    </div>
  </div>
);

window.AppShell = AppShell;
