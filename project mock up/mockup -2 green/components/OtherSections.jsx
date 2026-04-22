// ─── TASKS ──────────────────────────────────────────────────────────────────
const TasksSection = () => {
  const [tab, setTab] = React.useState('today');
  const [tasks, setTasks] = React.useState([
    { id:1, done:true,  text:'Morning meditation — 15 min', priority:'high' },
    { id:2, done:true,  text:'Cold shower', priority:'medium' },
    { id:3, done:true,  text:'Journal entry', priority:'high' },
    { id:4, done:true,  text:'Protein target ≥ 160g', priority:'medium' },
    { id:5, done:false, text:'Evening walk — 30 min', priority:'high' },
    { id:6, done:false, text:'Read — 30 min', priority:'medium' },
    { id:7, done:false, text:'Mobility session', priority:'low' },
  ]);
  const [newTask, setNewTask] = React.useState('');
  const toggle = id => setTasks(ts => ts.map(t => t.id === id ? {...t, done: !t.done} : t));
  const addTask = () => { if (!newTask.trim()) return; setTasks(ts => [...ts, {id: Date.now(), done: false, text: newTask, priority: 'medium'}]); setNewTask(''); };
  const pColor = { high: 'var(--rose-400)', medium: 'var(--gold-400)', low: 'var(--text-400)' };
  const tabs = ['today','inbox','projects'];
  return (
    <div style={{maxWidth:'720px'}}>
      <div style={{display:'flex', gap:'6px', marginBottom:'28px'}}>
        {tabs.map(t => <button key={t} onClick={()=>setTab(t)} style={{padding:'7px 18px', background: tab===t ? 'var(--glass)' : 'transparent', border:`1px solid ${tab===t ? 'var(--glass-border)' : 'transparent'}`, color: tab===t ? 'var(--text-100)' : 'var(--text-400)', borderRadius:'20px', fontFamily:'var(--font-ui)', fontSize:'12px', cursor:'pointer', textTransform:'capitalize', backdropFilter: tab===t ? 'blur(20px)' : 'none'}}>{t}</button>)}
        <div style={{marginLeft:'auto', fontSize:'12px', color:'var(--text-400)', alignSelf:'center'}}>{tasks.filter(t=>t.done).length}/{tasks.length} complete</div>
      </div>
      {/* Progress */}
      <div style={{height:'3px', background:'var(--bg-500)', borderRadius:'2px', marginBottom:'24px', overflow:'hidden'}}>
        <div style={{height:'100%', width:`${(tasks.filter(t=>t.done).length/tasks.length)*100}%`, background:'linear-gradient(to right, var(--gold-400), var(--violet-400))', transition:'width 0.4s ease'}}/>
      </div>
      {/* Task list */}
      <div className="glass" style={{padding:'8px 0', marginBottom:'16px'}}>
        {tasks.map((t,i) => (
          <div key={t.id} onClick={()=>toggle(t.id)} style={{display:'flex', alignItems:'center', gap:'14px', padding:'12px 20px', cursor:'pointer', borderBottom: i<tasks.length-1 ? '1px solid oklch(0.20 0.008 258 / 0.4)' : 'none', transition:'background 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.background='oklch(0.15 0.01 258 / 0.5)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{width:'18px',height:'18px',borderRadius:'5px',border:`1.5px solid ${t.done ? 'var(--gold-400)':'var(--bg-500)'}`,background:t.done?'var(--gold-400)':'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
              {t.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.8 3L9 1" stroke="oklch(0.08 0.018 258)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{flex:1,fontSize:'14px',color:t.done?'var(--text-400)':'var(--text-100)',textDecoration:t.done?'line-through':'none',fontWeight:300}}>{t.text}</span>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:pColor[t.priority],flexShrink:0,opacity:t.done?0.3:0.8}}/>
          </div>
        ))}
      </div>
      {/* Add task */}
      <div style={{display:'flex',gap:'10px'}}>
        <input value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Add a task…"
          style={{flex:1,background:'var(--bg-700)',border:'1px solid var(--glass-border)',color:'var(--text-100)',padding:'11px 14px',borderRadius:'var(--radius-sm)',fontFamily:'var(--font-ui)',fontSize:'13px',outline:'none'}}
          onFocus={e=>e.target.style.borderColor='var(--gold-400)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'} />
        <button onClick={addTask} style={{padding:'11px 20px',background:'linear-gradient(135deg, var(--gold-400), var(--gold-500))',border:'none',color:'oklch(0.08 0.018 258)',borderRadius:'var(--radius-sm)',fontFamily:'var(--font-ui)',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>Add</button>
      </div>
    </div>
  );
};

// ─── GALLERY ─────────────────────────────────────────────────────────────────
const GallerySection = () => {
  const [filter, setFilter] = React.useState('All');
  const [modal, setModal] = React.useState(null);
  const filters = ['All','Body','Food','Journal','Progress','Routine'];
  const gradients = [
    ['oklch(0.30 0.06 84)','oklch(0.18 0.03 84)'],
    ['oklch(0.28 0.06 285)','oklch(0.16 0.04 285)'],
    ['oklch(0.26 0.05 165)','oklch(0.16 0.03 165)'],
    ['oklch(0.30 0.05 18)','oklch(0.18 0.03 18)'],
    ['oklch(0.28 0.04 220)','oklch(0.16 0.03 220)'],
    ['oklch(0.26 0.06 84)','oklch(0.16 0.04 84)'],
  ];
  const items = [
    {id:1,tag:'Body',label:'Morning — Apr 21',aspect:'1/1',size:1},
    {id:2,tag:'Food',label:'Breakfast plate',aspect:'4/3',size:1},
    {id:3,tag:'Progress',label:'12-week check',aspect:'3/4',size:2},
    {id:4,tag:'Routine',label:'Morning stack',aspect:'1/1',size:1},
    {id:5,tag:'Journal',label:'Desk setup',aspect:'16/9',size:2},
    {id:6,tag:'Body',label:'Post-run',aspect:'4/3',size:1},
    {id:7,tag:'Food',label:'Dinner prep',aspect:'1/1',size:1},
    {id:8,tag:'Progress',label:'8-week check',aspect:'3/4',size:1},
  ];
  const shown = filter==='All' ? items : items.filter(i=>i.tag===filter);
  return (
    <div style={{maxWidth:'1100px'}}>
      <div style={{display:'flex',gap:'6px',marginBottom:'28px',flexWrap:'wrap'}}>
        {filters.map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 16px',background:filter===f?'var(--gold-400)':'transparent',border:`1px solid ${filter===f?'var(--gold-400)':'var(--glass-border)'}`,color:filter===f?'oklch(0.08 0.018 258)':'var(--text-300)',borderRadius:'20px',fontFamily:'var(--font-ui)',fontSize:'11px',fontWeight:filter===f?600:400,cursor:'pointer',transition:'all 0.15s'}}>{f}</button>)}
      </div>
      {/* Masonry-ish grid */}
      <div style={{columns:'3 240px',gap:'12px'}}>
        {shown.map((item,i)=>{
          const [c1,c2]=gradients[i%gradients.length];
          return (
            <div key={item.id} onClick={()=>setModal(item)} style={{breakInside:'avoid',marginBottom:'12px',borderRadius:'var(--radius)',overflow:'hidden',background:`linear-gradient(135deg, ${c1}, ${c2})`,aspectRatio:item.aspect,cursor:'pointer',position:'relative',border:'1px solid var(--glass-border)',transition:'transform 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.01)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 18px,oklch(0.08 0.01 258 / 0.15) 18px,oklch(0.08 0.01 258 / 0.15) 19px)'}}/>
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'12px',background:'linear-gradient(to top, oklch(0.05 0.01 258 / 0.8), transparent)'}}>
                <div style={{fontSize:'9px',letterSpacing:'0.14em',color:'var(--gold-400)',textTransform:'uppercase',marginBottom:'2px'}}>{item.tag}</div>
                <div style={{fontSize:'12px',color:'var(--text-100)',fontWeight:300}}>{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal */}
      {modal && (
        <div onClick={()=>setModal(null)} style={{position:'fixed',inset:0,background:'oklch(0.05 0.01 258 / 0.9)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(12px)'}}>
          <div onClick={e=>e.stopPropagation()} className="glass" style={{width:'540px',maxWidth:'90vw',padding:'0',overflow:'hidden',borderRadius:'var(--radius)'}}>
            <div style={{aspectRatio:'4/3',background:`linear-gradient(135deg, ${gradients[modal.id%gradients.length][0]}, ${gradients[modal.id%gradients.length][1]})`,position:'relative'}}>
              <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 18px,oklch(0.08 0.01 258 / 0.15) 18px,oklch(0.08 0.01 258 / 0.15) 19px)'}}/>
              <div style={{position:'absolute',top:'12px',right:'12px'}}><button onClick={()=>setModal(null)} style={{background:'oklch(0.08 0.018 258 / 0.7)',border:'none',color:'var(--text-100)',width:'28px',height:'28px',borderRadius:'50%',cursor:'pointer',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button></div>
            </div>
            <div style={{padding:'20px 24px'}}>
              <div style={{fontSize:'10px',letterSpacing:'0.14em',color:'var(--gold-400)',textTransform:'uppercase',marginBottom:'6px'}}>{modal.tag}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'22px',fontWeight:400,color:'var(--text-100)'}}>{modal.label}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── FASTING ─────────────────────────────────────────────────────────────────
const FastingSection = () => {
  const [secs, setSecs] = React.useState(22*3600+14*60+33);
  React.useEffect(()=>{ const t=setInterval(()=>setSecs(s=>s+1),1000); return ()=>clearInterval(t); },[]);
  const h=Math.floor(secs/3600), m=Math.floor((secs%3600)/60), s=secs%60;
  const f2=(n)=>String(n).padStart(2,'0');
  const target=24, pct=Math.min(h/target,1);
  const circ=2*Math.PI*68;
  const history=[{date:'Apr 20',hours:24,target:24},{date:'Apr 19',hours:20,target:24},{date:'Apr 18',hours:24,target:24},{date:'Apr 17',hours:18,target:24},{date:'Apr 16',hours:22,target:24}];
  return (
    <div style={{maxWidth:'900px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'24px'}}>
        {/* Active timer */}
        <div className="glass" style={{padding:'40px',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'28px'}}>Active fast</div>
          <div style={{position:'relative',width:'160px',height:'160px',marginBottom:'24px'}}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{transform:'rotate(-90deg)'}}>
              <circle cx="80" cy="80" r="68" stroke="var(--bg-500)" strokeWidth="6" fill="none"/>
              <circle cx="80" cy="80" r="68" stroke="var(--gold-400)" strokeWidth="6" fill="none"
                strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
                style={{transition:'stroke-dashoffset 1s ease',filter:'drop-shadow(0 0 10px var(--gold-glow))'}}/>
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'38px',fontWeight:400,color:'var(--gold-400)',lineHeight:1}}>{h}:{f2(m)}</div>
              <div style={{fontSize:'11px',color:'var(--text-400)',marginTop:'4px'}}>{f2(s)}s · {Math.round(pct*100)}%</div>
            </div>
          </div>
          <div style={{fontSize:'13px',color:'var(--text-300)',marginBottom:'4px'}}>{target-h}h {f2(60-m)}m remaining</div>
          <div style={{fontSize:'11px',color:'var(--text-400)',marginBottom:'24px'}}>Target: {target}h · Started 8:00 PM</div>
          <div style={{display:'flex',gap:'10px'}}>
            <button style={{padding:'9px 20px',background:'transparent',border:'1px solid var(--glass-border)',color:'var(--text-300)',borderRadius:'6px',fontFamily:'var(--font-ui)',fontSize:'12px',cursor:'pointer'}}>+1h</button>
            <button style={{padding:'9px 22px',background:'var(--rose-400)',border:'none',color:'white',borderRadius:'6px',fontFamily:'var(--font-ui)',fontSize:'12px',fontWeight:500,cursor:'pointer'}}>Break Fast</button>
          </div>
        </div>
        {/* Stats */}
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {[{label:'Longest fast',value:'27h 14m',sub:'April 3'},{label:'Average (30d)',value:'21.4h',sub:'Out of 24h target'},{label:'Compliance',value:'87%',sub:'13 of 15 days'}].map((s,i)=>(
            <div key={i} className="glass" style={{padding:'20px 24px',flex:1}}>
              <div style={{fontSize:'10px',letterSpacing:'0.14em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'8px'}}>{s.label}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'32px',fontWeight:400,color:'var(--gold-400)',lineHeight:1,marginBottom:'4px'}}>{s.value}</div>
              <div style={{fontSize:'11px',color:'var(--text-300)'}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      {/* History */}
      <div className="glass" style={{padding:'24px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'16px'}}>Recent fasts</div>
        {history.map((f,i)=>{
          const p=f.hours/f.target;
          return (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'16px',padding:'10px 0',borderBottom:i<history.length-1?'1px solid oklch(0.20 0.008 258 / 0.4)':'none'}}>
              <div style={{width:'70px',fontSize:'11px',color:'var(--text-300)'}}>{f.date}</div>
              <div style={{flex:1,height:'6px',background:'var(--bg-500)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${p*100}%`,background:p>=1?'var(--gold-400)':'var(--violet-400)',borderRadius:'3px'}}/>
              </div>
              <div style={{width:'52px',textAlign:'right',fontFamily:'var(--font-display)',fontSize:'16px',color:p>=1?'var(--gold-400)':'var(--text-200)',fontWeight:400}}>{f.hours}h</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── NOTES ───────────────────────────────────────────────────────────────────
const NotesSection = () => {
  const notes = [{id:1,title:'Daily affirmations',preview:'I am capable of growth…',date:'Today'},{id:2,title:'Book highlights — Range',preview:'Breadth beats depth in complex domains…',date:'Apr 19'},{id:3,title:'Goals Q2 2026',preview:'Ship personal OS, run 5k sub 25min…',date:'Apr 15'},{id:4,title:'Supplement stack',preview:'Creatine 5g, Magnesium glycinate…',date:'Apr 12'}];
  const [active, setActive] = React.useState(notes[0]);
  const [body, setBody] = React.useState('I am capable of growth. I am consistent. I choose discomfort over stagnation.\n\nToday I will do what yesterday-me could not.');
  return (
    <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:'0',height:'calc(100vh - 130px)',background:'var(--glass)',backdropFilter:'blur(20px)',border:'1px solid var(--glass-border)',borderRadius:'var(--radius)',overflow:'hidden'}}>
      <div style={{borderRight:'1px solid var(--glass-border)',overflowY:'auto',padding:'16px 0'}}>
        <div style={{padding:'0 16px 12px',fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase'}}>Notes</div>
        {notes.map(n=>(
          <div key={n.id} onClick={()=>setActive(n)} style={{padding:'14px 16px',cursor:'pointer',background:active.id===n.id?'oklch(0.17 0.012 258 / 0.8)':'transparent',borderLeft:`3px solid ${active.id===n.id?'var(--gold-400)':'transparent'}`,transition:'all 0.15s'}}>
            <div style={{fontSize:'13px',fontWeight:500,color:'var(--text-100)',marginBottom:'4px'}}>{n.title}</div>
            <div style={{fontSize:'11px',color:'var(--text-400)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.preview}</div>
            <div style={{fontSize:'10px',color:'var(--text-400)',marginTop:'4px'}}>{n.date}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'28px 32px',overflowY:'auto',display:'flex',flexDirection:'column'}}>
        <input defaultValue={active.title} key={active.id} style={{background:'transparent',border:'none',fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:400,color:'var(--text-100)',outline:'none',marginBottom:'20px'}}/>
        <textarea value={body} onChange={e=>setBody(e.target.value)} style={{flex:1,background:'transparent',border:'none',fontFamily:'var(--font-display)',fontSize:'18px',fontWeight:300,color:'var(--text-200)',outline:'none',lineHeight:1.8,resize:'none'}}/>
      </div>
    </div>
  );
};

// ─── ROUTINES ────────────────────────────────────────────────────────────────
const RoutinesSection = () => {
  const routines = [
    {name:'Morning',items:['5:30 Wake',{done:true,t:'Hydrate 500ml'},{done:true,t:'Cold shower'},{done:true,t:'Meditate 15m'},{done:false,t:'Journal'}],streak:12},
    {name:'Movement',items:[{done:true,t:'Mobility warmup'},{done:false,t:'Workout / run'},{done:false,t:'Stretch cooldown'}],streak:8},
    {name:'Evening',items:[{done:false,t:'No screens 9pm'},{done:false,t:'Read 30m'},{done:false,t:'Reflect + tomorrow plan'}],streak:5},
  ];
  const dots = Array.from({length:14},(_,i)=>({day:i+1,done:i<12}));
  return (
    <div style={{maxWidth:'900px'}}>
      {/* Streak heatmap */}
      <div className="glass" style={{padding:'24px',marginBottom:'20px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'16px'}}>Last 14 days</div>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          {dots.map(d=><div key={d.day} title={`Day ${d.day}`} style={{width:'28px',height:'28px',borderRadius:'6px',background:d.done?'var(--gold-400)':'var(--bg-600)',border:'1px solid var(--glass-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:d.done?'oklch(0.08 0.018 258)':'var(--text-400)'}}>{d.day}</div>)}
          <div style={{marginLeft:'auto',alignSelf:'center',fontFamily:'var(--font-display)',fontSize:'32px',fontWeight:400,color:'var(--gold-400)'}}>12<span style={{fontSize:'14px',color:'var(--text-400)',marginLeft:'4px',fontFamily:'var(--font-ui)',fontWeight:300}}>day streak</span></div>
        </div>
      </div>
      {/* Routine blocks */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
        {routines.map((r,i)=>(
          <div key={i} className="glass" style={{padding:'22px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'20px',fontWeight:400,color:'var(--text-100)'}}>{r.name}</div>
              <div style={{fontSize:'10px',color:'var(--gold-400)'}}>{r.streak}d</div>
            </div>
            {r.items.map((item,j)=>{
              const isObj=typeof item==='object';
              return (
                <div key={j} style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:j<r.items.length-1?'1px solid oklch(0.20 0.008 258 / 0.3)':'none'}}>
                  <div style={{width:'14px',height:'14px',borderRadius:'3px',border:`1.5px solid ${isObj&&item.done?'var(--gold-400)':'var(--bg-500)'}`,background:isObj&&item.done?'var(--gold-400)':'transparent',flexShrink:0}}/>
                  <span style={{fontSize:'12px',color:isObj&&item.done?'var(--text-400)':'var(--text-200)',textDecoration:isObj&&item.done?'line-through':'none',fontWeight:300}}>{isObj?item.t:item}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── INSIGHTS ────────────────────────────────────────────────────────────────
const InsightsSection = () => {
  const weights=[178.4,179.1,178.8,179.5,180.2,180.0,179.3,178.9,179.6,178.4,177.8,178.1,177.5,178.4];
  const maxW=Math.max(...weights), minW=Math.min(...weights)-1;
  const toY=(w,h)=>h-((w-minW)/(maxW-minW))*(h-16)-8;
  const W=400,H=80;
  const pts=weights.map((w,i)=>`${(i/(weights.length-1))*W},${toY(w,H)}`).join(' ');
  return (
    <div style={{maxWidth:'1000px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
        {/* Weight trend */}
        <div className="glass" style={{padding:'24px'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'4px'}}>Weight trend</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'36px',fontWeight:400,color:'var(--text-100)',marginBottom:'4px'}}>178.4<span style={{fontSize:'14px',color:'var(--text-400)',marginLeft:'4px'}}>lbs</span></div>
          <div style={{fontSize:'12px',color:'oklch(0.68 0.14 165)',marginBottom:'20px'}}>↓ 2.1 lbs this week</div>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{overflow:'visible'}}>
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#wg)"/>
            <polyline points={pts} fill="none" stroke="var(--gold-400)" strokeWidth="2" strokeLinejoin="round" style={{filter:'drop-shadow(0 0 4px var(--gold-glow))'}}/>
          </svg>
        </div>
        {/* Fasting compliance */}
        <div className="glass" style={{padding:'24px'}}>
          <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'4px'}}>Fasting compliance</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'36px',fontWeight:400,color:'var(--violet-400)',marginBottom:'16px'}}>87%</div>
          <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
            {Array.from({length:30},(_,i)=>i<26).map((done,i)=><div key={i} style={{width:'20px',height:'20px',borderRadius:'3px',background:done?'var(--violet-400)':'var(--bg-600)',opacity:done?0.9:0.5}}/>)}
          </div>
          <div style={{fontSize:'11px',color:'var(--text-400)',marginTop:'10px'}}>26 of 30 days this month</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
        {[{label:'Journal entries',value:'47',sub:'this year',color:'var(--gold-400)'},{label:'Avg fast length',value:'21.4h',sub:'last 30 days',color:'var(--violet-400)'},{label:'Tasks completed',value:'312',sub:'this month',color:'oklch(0.68 0.14 165)'},{label:'Streak record',value:'18d',sub:'routines',color:'var(--rose-400)'}].map((s,i)=>(
          <div key={i} className="glass" style={{padding:'20px'}}>
            <div style={{fontSize:'10px',letterSpacing:'0.14em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'10px'}}>{s.label}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'30px',fontWeight:400,color:s.color,lineHeight:1,marginBottom:'4px'}}>{s.value}</div>
            <div style={{fontSize:'11px',color:'var(--text-300)'}}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── NUTRITION ───────────────────────────────────────────────────────────────
const NutritionSection = () => {
  const macros=[{label:'Protein',cur:142,target:160,color:'var(--gold-400)'},{label:'Carbs',cur:180,target:200,color:'var(--violet-400)'},{label:'Fat',cur:68,target:80,color:'var(--rose-400)'}];
  const meals=[{name:'Breakfast',cals:520,items:['Greek yogurt 200g','Blueberries 80g','Oats 40g','Honey 15g']},{name:'Lunch',cals:680,items:['Chicken breast 180g','Brown rice 120g','Broccoli 150g','Olive oil 10ml']},{name:'Snack',cals:220,items:['Almonds 30g','Banana 1 medium']}];
  return (
    <div style={{maxWidth:'900px'}}>
      <div className="glass" style={{padding:'24px',marginBottom:'16px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'16px'}}>Today — 1,420 / 2,200 kcal</div>
        <div style={{height:'8px',background:'var(--bg-500)',borderRadius:'4px',overflow:'hidden',marginBottom:'20px'}}>
          <div style={{height:'100%',width:`${(1420/2200)*100}%`,background:'linear-gradient(to right, var(--gold-400), var(--violet-400))',borderRadius:'4px'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
          {macros.map((m,i)=>(
            <div key={i}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                <span style={{fontSize:'12px',color:'var(--text-300)'}}>{m.label}</span>
                <span style={{fontSize:'12px',color:m.color}}>{m.cur}g / {m.target}g</span>
              </div>
              <div style={{height:'5px',background:'var(--bg-500)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(m.cur/m.target)*100}%`,background:m.color,borderRadius:'3px'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {meals.map((meal,i)=>(
          <div key={i} className="glass" style={{padding:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'20px',fontWeight:400,color:'var(--text-100)'}}>{meal.name}</div>
              <div style={{fontSize:'12px',color:'var(--gold-400)'}}>{meal.cals} kcal</div>
            </div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {meal.items.map((item,j)=><span key={j} style={{fontSize:'11px',color:'var(--text-300)',background:'var(--bg-600)',padding:'4px 10px',borderRadius:'20px'}}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── BODY ────────────────────────────────────────────────────────────────────
const BodySection = () => {
  const metrics=[{label:'Weight',value:'178.4',unit:'lbs',trend:'↓ 2.1',pos:false},{label:'Body Fat',value:'14.2',unit:'%',trend:'↓ 0.8%',pos:false},{label:'Waist',value:'32.0',unit:'in',trend:'↓ 0.5',pos:false},{label:'Chest',value:'41.5',unit:'in',trend:'→',pos:null}];
  return (
    <div style={{maxWidth:'900px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px',marginBottom:'20px'}}>
        {metrics.map((m,i)=>(
          <div key={i} className="glass" style={{padding:'22px'}}>
            <div style={{fontSize:'10px',letterSpacing:'0.14em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'8px'}}>{m.label}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'30px',fontWeight:400,color:'var(--text-100)',lineHeight:1,marginBottom:'4px'}}>{m.value}<span style={{fontSize:'12px',color:'var(--text-400)',marginLeft:'4px'}}>{m.unit}</span></div>
            <div style={{fontSize:'12px',color:m.pos===false?'oklch(0.68 0.14 165)':m.pos===true?'var(--rose-400)':'var(--text-400)'}}>{m.trend}</div>
          </div>
        ))}
      </div>
      <div className="glass" style={{padding:'24px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'16px'}}>Progress photos</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
          {['Jan 1','Feb 1','Mar 1','Apr 1'].map((d,i)=>{
            const ls=['oklch(0.24 0.04 84)','oklch(0.22 0.05 285)','oklch(0.20 0.04 165)','oklch(0.22 0.05 84)'];
            return (
              <div key={i} style={{borderRadius:'var(--radius-sm)',aspectRatio:'3/4',background:ls[i],border:'1px solid var(--glass-border)',display:'flex',alignItems:'flex-end',justifyContent:'center',overflow:'hidden',position:'relative',cursor:'pointer'}}>
                <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(45deg,transparent,transparent 16px,oklch(0.08 0.01 258 / 0.2) 16px,oklch(0.08 0.01 258 / 0.2) 17px)'}}/>
                <div style={{padding:'8px',fontSize:'10px',color:'var(--text-300)',position:'relative',background:'oklch(0.05 0.01 258 / 0.7)',width:'100%',textAlign:'center'}}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const SettingsSection = () => {
  const [notif, setNotif] = React.useState(true);
  const [compact, setCompact] = React.useState(false);
  const Toggle = ({val, onChange}) => (
    <div onClick={()=>onChange(!val)} style={{width:'40px',height:'22px',borderRadius:'11px',background:val?'var(--gold-400)':'var(--bg-500)',cursor:'pointer',position:'relative',transition:'background 0.25s',flexShrink:0}}>
      <div style={{position:'absolute',top:'3px',left:val?'21px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.25s'}}/>
    </div>
  );
  return (
    <div style={{maxWidth:'600px'}}>
      {/* Profile */}
      <div className="glass" style={{padding:'28px',marginBottom:'16px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'20px'}}>Profile</div>
        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'24px'}}>
          <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'linear-gradient(135deg, var(--gold-400), var(--violet-400))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:'22px',fontWeight:500,color:'oklch(0.08 0.018 258)'}}>J</div>
          <div>
            <div style={{fontSize:'16px',fontWeight:500,color:'var(--text-100)',marginBottom:'2px'}}>Jamie</div>
            <div style={{fontSize:'12px',color:'var(--text-400)'}}>jamie@example.com</div>
          </div>
        </div>
        {[{label:'Display name',val:'Jamie'},{label:'Timezone',val:'UTC−5 (EST)'}].map((f,i)=>(
          <div key={i} style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'10px',letterSpacing:'0.12em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'6px'}}>{f.label}</label>
            <input defaultValue={f.val} style={{width:'100%',background:'var(--bg-700)',border:'1px solid var(--glass-border)',color:'var(--text-100)',padding:'10px 14px',borderRadius:'var(--radius-sm)',fontFamily:'var(--font-ui)',fontSize:'13px',outline:'none'}}
              onFocus={e=>e.target.style.borderColor='var(--gold-400)'} onBlur={e=>e.target.style.borderColor='var(--glass-border)'}/>
          </div>
        ))}
      </div>
      {/* Prefs */}
      <div className="glass" style={{padding:'28px'}}>
        <div style={{fontSize:'10px',letterSpacing:'0.16em',color:'var(--text-400)',textTransform:'uppercase',marginBottom:'20px'}}>Preferences</div>
        {[{label:'Notifications',sub:'Daily reminders and streaks',val:notif,fn:setNotif},{label:'Compact mode',sub:'Reduce padding and type size',val:compact,fn:setCompact}].map((p,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i===0?'1px solid oklch(0.20 0.008 258 / 0.4)':'none'}}>
            <div>
              <div style={{fontSize:'14px',fontWeight:400,color:'var(--text-100)',marginBottom:'2px'}}>{p.label}</div>
              <div style={{fontSize:'11px',color:'var(--text-400)'}}>{p.sub}</div>
            </div>
            <Toggle val={p.val} onChange={p.fn}/>
          </div>
        ))}
      </div>
    </div>
  );
};

window.TasksSection = TasksSection;
window.GallerySection = GallerySection;
window.FastingSection = FastingSection;
window.NotesSection = NotesSection;
window.RoutinesSection = RoutinesSection;
window.InsightsSection = InsightsSection;
window.NutritionSection = NutritionSection;
window.BodySection = BodySection;
window.SettingsSection = SettingsSection;
