import React, { useState, useMemo, useRef, createContext, useContext, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE — conexión a la base de datos real
// ─────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://bdtofmztaydqlezsibjq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdG9mbXp0YXlkcWxlenNpYmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDIyMTMsImV4cCI6MjA4ODQ3ODIxM30.nd70DcR63k86SqHIoYfRMF8atKh2yfRtv30c8X_NKoM"
);

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTO COMPARTIDO
// ─────────────────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─────────────────────────────────────────────────────────────────────────────
// ILUSTRACIONES SVG (fallback si no hay foto subida)
// ─────────────────────────────────────────────────────────────────────────────
const Illustrations = {
  volcano_cover: <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><rect width="400" height="240" fill="#FFF3E0"/><polygon points="200,40 80,220 320,220" fill="#A1887F"/><polygon points="200,40 120,220 280,220" fill="#795548"/><ellipse cx="200" cy="44" rx="30" ry="14" fill="#FF5722"/>{[0,1,2,3,4].map(i=><ellipse key={i} cx={185+i*8} cy={44-i*18} rx={6-i} ry={10-i*1.5} fill={["#FF5722","#FF7043","#FF8A65","#FFAB91","#FFCCBC"][i]}/>)}<text x="200" y="232" textAnchor="middle" fill="#795548" fontSize="11" fontFamily="sans-serif">¡Reacción química!</text></svg>,
  bridge_cover:  <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><rect width="400" height="240" fill="#E3F2FD"/><rect x="0" y="180" width="400" height="60" fill="#B0BEC5"/><rect x="30" y="165" width="340" height="8" rx="4" fill="#8D6E63"/>{[60,140,220,300].map((x,i)=><g key={i}><line x1={x} y1="165" x2={x-30} y2="100" stroke="#A1887F" strokeWidth="4"/><line x1={x} y1="165" x2={x+30} y2="100" stroke="#A1887F" strokeWidth="4"/></g>)}<line x1="30" y1="100" x2="370" y2="100" stroke="#795548" strokeWidth="5"/></svg>,
  crystal_cover: <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><rect width="400" height="240" fill="#1a0533"/>{[{x:80,y:80,c:"#A78BFA"},{x:160,y:50,c:"#34D399"},{x:240,y:90,c:"#60A5FA"},{x:320,y:60,c:"#F472B6"},{x:120,y:160,c:"#FBBF24"},{x:280,y:150,c:"#A78BFA"}].map((cr,i)=><g key={i}><polygon points={`${cr.x},${cr.y-30} ${cr.x+15},${cr.y} ${cr.x},${cr.y+30} ${cr.x-15},${cr.y}`} fill={cr.c} opacity="0.85"/></g>)}</svg>,
  rocket_cover:  <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><rect width="400" height="240" fill="#0D1B2A"/>{[30,80,140,200,260,320,370].map((x,i)=><circle key={i} cx={x} cy={15+i*8} r={1+i%2} fill="white" opacity="0.5"/>)}<rect x="185" y="100" width="14" height="28" rx="4" fill="#B0BEC5"/><ellipse cx="192" cy="100" rx="14" ry="12" fill="#FF5722"/><polygon points="180,128 192,148 204,128" fill="#FFB300"/></svg>,
  geometry_cover:<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><rect width="400" height="240" fill="#E8F5E9"/><g transform="translate(120,40)"><rect x="0" y="0" width="80" height="80" fill="none" stroke="#66BB6A" strokeWidth="3"/><line x1="0" y1="0" x2="20" y2="-28" stroke="#43A047" strokeWidth="3"/><line x1="80" y1="0" x2="100" y2="-28" stroke="#43A047" strokeWidth="3"/><line x1="20" y1="-28" x2="100" y2="-28" stroke="#2E7D32" strokeWidth="3"/></g></svg>,
  music_cover:   <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><rect width="400" height="240" fill="#FCE4EC"/><circle cx="200" cy="115" r="70" fill="#F8BBD0" stroke="#F06292" strokeWidth="3"/><circle cx="200" cy="115" r="40" fill="#F06292" stroke="#E91E63" strokeWidth="2"/><circle cx="200" cy="115" r="10" fill="#C2185B"/></svg>,
};

const defaultStepSvg = (n, color) => (
  <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <rect width="300" height="200" fill={color+"18"}/>
    <circle cx="150" cy="90" r="45" fill={color+"30"} stroke={color} strokeWidth="2"/>
    <text x="150" y="97" textAnchor="middle" fill={color} fontSize="32" fontFamily="sans-serif" fontWeight="bold">{n}</text>
    <text x="150" y="165" textAnchor="middle" fill={color} fontSize="12" fontFamily="sans-serif">Paso {n}</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────
const catColor  = {"Ciencia":"#5b3d8a","Ingeniería":"#4ECDC4","Arte + Ciencia":"#A78BFA","Tecnología":"#F59E0B","Matemáticas":"#10B981","Arte + Tecnología":"#EC4899"};
const diffColor = {Fácil:"#10B981",Medio:"#F59E0B",Difícil:"#EF4444"};
const CATEGORIES   = ["Todas","Ciencia","Ingeniería","Arte + Ciencia","Tecnología","Matemáticas","Arte + Tecnología"];
const AGES         = ["Todas las edades","3+ años","4+ años","5+ años","6+ años"];
const DIFFICULTIES = ["Todas","Fácil","Medio","Difícil"];
const labelStyle   = {display:"block",fontSize:11,fontWeight:800,color:"#888",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:5};
const inputStyle   = {width:"100%",padding:"9px 12px",borderRadius:10,border:"2px solid #E5E7EB",fontSize:14,fontFamily:"inherit",outline:"none",background:"white",boxSizing:"border-box",color:"#1a1a2e"};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Badge({text,color}){return <span style={{background:color+"20",color,padding:"3px 10px",borderRadius:50,fontSize:11,fontWeight:800}}>{text}</span>;}
function Toast({msg,color}){return <div style={{position:"fixed",bottom:28,right:28,background:color,color:"white",padding:"12px 22px",borderRadius:50,fontSize:14,fontWeight:800,boxShadow:"0 8px 24px rgba(0,0,0,.2)",animation:"toastIn .3s ease",zIndex:9999}}>{msg}</div>;}
function Spinner(){return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 0",flexDirection:"column",gap:16}}><div style={{width:40,height:40,border:"4px solid #f0f0f0",borderTop:"4px solid #5b3d8a",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><div style={{color:"#bbb",fontWeight:700,fontSize:14}}>Cargando actividades...</div></div>);}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC APP
// ─────────────────────────────────────────────────────────────────────────────
function PublicApp() {
  const {activities,loading,trackView} = useApp();
  const [selected,     setSelected]    = useState(null);
  const [cat,          setCat]         = useState("Todas");
  const [age,          setAge]         = useState("Todas las edades");
  const [diff,         setDiff]        = useState("Todas");
  const [sideOpen,     setSideOpen]    = useState(true);
  const [openSections, setOpenSections]= useState({cat:true,age:true,diff:true});

  const published = activities.filter(a=>a.status==="publicado");
  const filtered  = useMemo(()=>published.filter(a=>{
    return (cat==="Todas"||a.category===cat) && (age==="Todas las edades"||a.age===age) && (diff==="Todas"||a.difficulty===diff);
  }),[cat,age,diff,published.length]);

  const activeFilters = [cat!=="Todas"&&{label:cat,clear:()=>setCat("Todas")},age!=="Todas las edades"&&{label:age,clear:()=>setAge("Todas las edades")},diff!=="Todas"&&{label:diff,clear:()=>setDiff("Todas")}].filter(Boolean);
  const resetAll = ()=>{setCat("Todas");setAge("Todas las edades");setDiff("Todas");};
  const toggleSection = k=>setOpenSections(s=>({...s,[k]:!s[k]}));
  const open  = a=>{trackView(a.id);setSelected(a);window.scrollTo({top:0,behavior:"smooth"});};
  const close = ()=>{setSelected(null);window.scrollTo({top:0,behavior:"smooth"});};

  const getCover   = act   => act.cover_image ? <img src={act.cover_image} alt={act.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (Illustrations[act.cover_key]||Illustrations.rocket_cover);
  const getStepImg = (s,a) => s.image ? <img src={s.image} alt={s.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : defaultStepSvg(s.number,a.category_color||"#5b3d8a");

  const FilterSection = ({sectionKey,label,items,val,set,color})=>{
    const isOpen = openSections[sectionKey];
    return(
      <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:isOpen?16:0,marginBottom:16}}>
        <button onClick={()=>toggleSection(sectionKey)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",background:"none",border:"none",cursor:"pointer",padding:"0 0 10px",fontFamily:"'Nunito',sans-serif"}}>
          <span style={{fontSize:12,fontWeight:900,color:"#aaa",textTransform:"uppercase",letterSpacing:"1px"}}>{label}</span>
          <span style={{fontSize:16,color:"#ccc",transform:isOpen?"rotate(0)":"rotate(-90deg)",transition:"transform .2s",display:"inline-block"}}>▾</span>
        </button>
        <div style={{overflow:"hidden",maxHeight:isOpen?300:0,opacity:isOpen?1:0,transition:"max-height .3s,opacity .25s"}}>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {items.map(it=>{
              const active=val===it; const c=color||diffColor[it]||"#6366F1";
              return(<button key={it} onClick={()=>set(it)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:10,border:"2px solid",borderColor:active?c:"transparent",background:active?c+"18":"transparent",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:active?800:600,fontSize:13,color:active?c:"#555",textAlign:"left",transition:"all .15s"}}
                onMouseOver={e=>{if(!active){e.currentTarget.style.background="#F9FAFB";e.currentTarget.style.borderColor="#E5E7EB";}}}
                onMouseOut={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="transparent";}}}>
                <span>{it}</span>{active&&<span style={{fontSize:12,color:c}}>✓</span>}
              </button>);
            })}
          </div>
        </div>
      </div>
    );
  };

  return(
    <div style={{minHeight:"100vh",background:"#FDFAF6",fontFamily:"'Nunito',sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#2d1b4e 0%,#5b3d8a 45%,#2e9e6b 100%)",padding:"44px 24px 60px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",borderRadius:"50%",background:"#ffffff15",width:300,height:300,top:-100,right:-80}}/>
        <div style={{position:"relative",zIndex:1}}>
          {selected&&<button onClick={close} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 20px",borderRadius:50,border:"none",background:"white",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:14,color:"#555",boxShadow:"0 2px 12px rgba(0,0,0,.1)",marginBottom:16}}>← Volver</button>}
          <div style={{fontSize:42,marginBottom:6}}>🔬🎨🔢</div>
          <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(26px,6vw,48px)",color:"white",textShadow:"0 2px 20px rgba(0,0,0,.15)",marginBottom:6}}>{selected?selected.title:"Sinapsis"}</h1>
          <p style={{color:"rgba(255,255,255,.9)",fontSize:16,fontWeight:700}}>{selected?`${selected.emoji} ${selected.category} · ${selected.time} · ${selected.age}`:"Conectando mentes curiosas con el mundo STEAM"}</p>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px 60px",marginTop:-20}}>
        {loading&&<Spinner/>}

        {/* Grid con sidebar */}
        {!loading&&!selected&&(
          <div style={{display:"flex",gap:22,alignItems:"flex-start"}}>
            {/* Sidebar filtros */}
            <div style={{width:sideOpen?230:52,minWidth:sideOpen?230:52,flexShrink:0,transition:"width .3s cubic-bezier(.4,0,.2,1),min-width .3s",position:"sticky",top:20}}>
              <div style={{background:"white",borderRadius:20,boxShadow:"0 4px 20px rgba(0,0,0,.08)",overflow:"hidden"}}>
                <div style={{padding:sideOpen?"16px 18px 14px":"16px 10px",display:"flex",alignItems:"center",justifyContent:sideOpen?"space-between":"center",borderBottom:"1px solid #F3F4F6"}}>
                  {sideOpen&&<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>🎛️</span><span style={{fontWeight:900,fontSize:14,color:"#1a1a2e"}}>Filtros</span>{activeFilters.length>0&&<span style={{background:"#5b3d8a",color:"white",borderRadius:50,fontSize:11,fontWeight:900,padding:"1px 7px"}}>{activeFilters.length}</span>}</div>}
                  <button onClick={()=>setSideOpen(o=>!o)} style={{background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}} onMouseOver={e=>e.currentTarget.style.background="#F0F0F0"} onMouseOut={e=>e.currentTarget.style.background="#F9FAFB"}>{sideOpen?"◀":"▶"}</button>
                </div>
                {!sideOpen&&(
                  <div style={{padding:"12px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                    {[{icon:"🔬",v:cat,d:"Todas"},{icon:"👶",v:age,d:"Todas las edades"},{icon:"⭐",v:diff,d:"Todas"}].map((f,i)=>(
                      <div key={i} title={f.v} style={{width:32,height:32,borderRadius:8,background:f.v!==f.d?"#5b3d8a18":"#F9FAFB",border:f.v!==f.d?"2px solid #5b3d8a":"2px solid #E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{f.icon}</div>
                    ))}
                    {activeFilters.length>0&&<button onClick={resetAll} style={{width:32,height:32,borderRadius:8,background:"#FEE2E2",border:"2px solid #FCA5A5",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}} title="Limpiar">✕</button>}
                  </div>
                )}
                {sideOpen&&(
                  <div style={{padding:"16px 16px 4px"}}>
                    <FilterSection sectionKey="cat"  label="🔬 Categoría" items={CATEGORIES}   val={cat}  set={setCat}  color="#5b3d8a"/>
                    <FilterSection sectionKey="age"  label="👶 Edad"      items={AGES}          val={age}  set={setAge}  color="#6366F1"/>
                    <FilterSection sectionKey="diff" label="⭐ Dificultad" items={DIFFICULTIES} val={diff} set={setDiff} color={null}/>
                    {activeFilters.length>0&&(
                      <div style={{paddingBottom:14}}>
                        <div style={{fontSize:11,fontWeight:800,color:"#bbb",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Aplicados</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                          {activeFilters.map((f,i)=><button key={i} onClick={f.clear} style={{display:"flex",alignItems:"center",gap:5,background:"#5b3d8a18",color:"#5b3d8a",border:"1.5px solid #5b3d8a55",borderRadius:50,padding:"4px 10px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{f.label} ×</button>)}
                        </div>
                        <button onClick={resetAll} style={{width:"100%",padding:"8px",borderRadius:10,border:"none",background:"#FEE2E2",color:"#EF4444",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Limpiar todo</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Grid cards */}
            <div style={{flex:1,minWidth:0}}>
              <p style={{color:"#bbb",fontWeight:700,fontSize:13,marginBottom:18,marginTop:4}}>{filtered.length===0?"😅 Sin resultados":`${filtered.length} actividad${filtered.length!==1?"es":""}`}</p>
              {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",background:"white",borderRadius:20,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}><div style={{fontSize:52,marginBottom:12}}>🔍</div><button onClick={resetAll} style={{padding:"10px 26px",borderRadius:50,border:"none",background:"#5b3d8a",color:"white",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:14,cursor:"pointer"}}>Limpiar filtros</button></div>}
              <div style={{display:"grid",gridTemplateColumns:`repeat(auto-fill,minmax(${sideOpen?260:290}px,1fr))`,gap:20}}>
                {filtered.map(act=>(
                  <div key={act.id} onClick={()=>open(act)} style={{background:"white",borderRadius:22,overflow:"hidden",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,.08)",transition:"transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s"}} onMouseOver={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,.14)";}} onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.08)";}}>
                    <div style={{height:170,overflow:"hidden",background:"#f5f5f5",position:"relative"}}>
                      {getCover(act)}
                      <div style={{position:"absolute",top:10,left:10,background:act.category_color||"#888",color:"white",padding:"3px 10px",borderRadius:50,fontSize:11,fontWeight:800,textTransform:"uppercase"}}>{act.category}</div>
                      <div style={{position:"absolute",top:10,right:10,display:"flex",gap:5}}>
                        <span style={{background:"rgba(0,0,0,.6)",color:"white",padding:"3px 9px",borderRadius:50,fontSize:11,fontWeight:700}}>{act.time}</span>
                        <span style={{background:diffColor[act.difficulty],color:"white",padding:"3px 9px",borderRadius:50,fontSize:11,fontWeight:700}}>{act.difficulty}</span>
                      </div>
                    </div>
                    <div style={{padding:"14px 16px 12px"}}>
                      <div style={{fontSize:24,marginBottom:3}}>{act.emoji}</div>
                      <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,color:"#2D2D2D",marginBottom:4}}>{act.title}</h2>
                      <p style={{color:"#888",fontSize:12,lineHeight:1.55,marginBottom:10}}>{act.description}</p>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:12,color:"#aaa",fontWeight:700}}>👶 {act.age}</span>
                        <span style={{background:act.category_color||"#888",color:"white",padding:"5px 13px",borderRadius:50,fontSize:12,fontWeight:800}}>Ver pasos →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detalle actividad */}
        {!loading&&selected&&(
          <div>
            <div style={{background:"white",borderRadius:18,padding:22,marginBottom:24,boxShadow:"0 4px 20px rgba(0,0,0,.08)",borderLeft:`6px solid ${selected.category_color||"#5b3d8a"}`}}>
              <p style={{color:"#555",fontSize:16,lineHeight:1.75,fontWeight:600,marginBottom:14}}>{selected.description}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {[{i:"⏱️",l:selected.time},{i:"👶",l:selected.age},{i:"📋",l:`${selected.steps?.length||0} pasos`},{i:"⭐",l:selected.difficulty}].map((it,i)=>(
                  <span key={i} style={{background:"#f4f4f4",padding:"7px 15px",borderRadius:50,fontSize:13,fontWeight:700,color:"#444"}}>{it.i} {it.l}</span>
                ))}
              </div>
            </div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,color:"#2D2D2D",marginBottom:20}}><span style={{color:selected.category_color||"#5b3d8a"}}>📋</span> Paso a paso</h2>
            {(selected.steps||[]).map(step=>(
              <div key={step.number} style={{background:"white",borderRadius:18,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.08)",marginBottom:18,border:"2px solid #f0f0f0",display:"flex"}}>
                <div style={{width:52,minWidth:52,background:selected.category_color||"#5b3d8a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontSize:26,color:"white"}}>{step.number}</div>
                <div style={{padding:"18px 20px",flex:1}}>
                  <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,color:"#2D2D2D",marginBottom:7}}>{step.title}</h3>
                  <p style={{color:"#555",fontSize:14,lineHeight:1.75,fontWeight:600}}>{step.description}</p>
                </div>
                <div style={{width:180,minWidth:180,background:"#f8f8f8",overflow:"hidden",display:"flex",alignItems:"stretch"}}>{getStepImg(step,selected)}</div>
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:30}}>
              <button onClick={close} style={{background:selected.category_color||"#5b3d8a",color:"white",border:"none",borderRadius:50,padding:"13px 30px",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>← Ver todas las actividades</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY MODAL (admin)
// ─────────────────────────────────────────────────────────────────────────────
function ActivityModal({activity,onSave,onClose}){
  const isNew = !activity.id;
  const [form,setForm] = useState({title:activity.title||"",emoji:activity.emoji||"⭐",category:activity.category||"Ciencia",difficulty:activity.difficulty||"Fácil",age:activity.age||"4+ años",time:activity.time||"",status:activity.status||"borrador",description:activity.description||"",cover_image:activity.cover_image||null,cover_key:activity.cover_key||"rocket_cover",steps:activity.steps||[{number:1,title:"",description:"",image:null}]});
  const fileRefs=useRef([]);const coverRef=useRef();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setStep=(i,k,v)=>setForm(f=>({...f,steps:f.steps.map((s,idx)=>idx===i?{...s,[k]:v}:s)}));
  const addStep=()=>setForm(f=>({...f,steps:[...f.steps,{number:f.steps.length+1,title:"",description:"",image:null}]}));
  const removeStep=i=>setForm(f=>({...f,steps:f.steps.filter((_,idx)=>idx!==i).map((s,idx)=>({...s,number:idx+1}))}));
  const toBase64=file=>new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.readAsDataURL(file);});
  const handleImg=async(i,e)=>{const f=e.target.files[0];if(!f)return;setStep(i,"image",await toBase64(f));};
  const handleCover=async e=>{const f=e.target.files[0];if(!f)return;set("cover_image",await toBase64(f));};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(10,10,30,.75)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",backdropFilter:"blur(4px)",overflowY:"auto",padding:"28px 16px"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#f8f9ff",borderRadius:24,width:"100%",maxWidth:700,boxShadow:"0 24px 80px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",padding:"22px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:"#A78BFA",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:3}}>{isNew?"Nueva actividad":"Editar actividad"}</div><div style={{color:"white",fontSize:19,fontWeight:800}}>{form.emoji} {form.title||"Sin título"}</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:"white",width:34,height:34,borderRadius:50,cursor:"pointer",fontSize:18}}>×</button>
        </div>
        <div style={{padding:"22px 28px",display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"white",borderRadius:16,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
            <h3 style={{...labelStyle,marginBottom:12}}>🖼️ Portada</h3>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:120,height:75,borderRadius:12,overflow:"hidden",background:"#f0f0f0",flexShrink:0}}>{form.cover_image?<img src={form.cover_image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:Illustrations[form.cover_key]}</div>
              <div><input type="file" accept="image/*" ref={coverRef} style={{display:"none"}} onChange={handleCover}/><button onClick={()=>coverRef.current?.click()} style={{background:"#EDE9FE",color:"#7C3AED",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:800,cursor:"pointer",display:"block",marginBottom:6}}>📤 Subir portada</button><div style={{fontSize:11,color:"#aaa"}}>O usa la ilustración automática</div></div>
            </div>
          </div>
          <div style={{background:"white",borderRadius:16,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
            <h3 style={{...labelStyle,marginBottom:14}}>📋 Información básica</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 70px",gap:10,marginBottom:10}}><div><label style={labelStyle}>Título</label><input value={form.title} onChange={e=>set("title",e.target.value)} style={inputStyle} placeholder="Nombre de la actividad"/></div><div><label style={labelStyle}>Emoji</label><input value={form.emoji} onChange={e=>set("emoji",e.target.value)} style={{...inputStyle,textAlign:"center",fontSize:20}}/></div></div>
            <div><label style={labelStyle}>Descripción</label><textarea value={form.description} onChange={e=>set("description",e.target.value)} style={{...inputStyle,height:60,resize:"vertical",marginBottom:10}} placeholder="Descripción corta..."/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>{[{label:"Categoría",key:"category",opts:Object.keys(catColor)},{label:"Dificultad",key:"difficulty",opts:["Fácil","Medio","Difícil"]},{label:"Edad",key:"age",opts:["3+ años","4+ años","5+ años","6+ años","8+ años"]}].map(({label,key,opts})=>(<div key={key}><label style={labelStyle}>{label}</label><select value={form[key]} onChange={e=>set(key,e.target.value)} style={inputStyle}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>))}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={labelStyle}>Tiempo</label><input value={form.time} onChange={e=>set("time",e.target.value)} style={inputStyle} placeholder="Ej: 30 min"/></div><div><label style={labelStyle}>Estado</label><select value={form.status} onChange={e=>set("status",e.target.value)} style={inputStyle}><option value="borrador">📝 Borrador</option><option value="publicado">✅ Publicado</option></select></div></div>
          </div>
          <div style={{background:"white",borderRadius:16,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={labelStyle}>👟 Pasos ({form.steps.length})</h3><button onClick={addStep} style={{background:"#A78BFA",color:"white",border:"none",borderRadius:50,padding:"6px 14px",fontSize:12,fontWeight:800,cursor:"pointer"}}>+ Agregar</button></div>
            {form.steps.map((step,i)=>(
              <div key={i} style={{border:"2px solid #f0f0f0",borderRadius:12,padding:14,marginBottom:10,background:"#fafafa"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{background:"#1a1a2e",color:"white",width:26,height:26,borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900}}>{step.number}</div>{form.steps.length>1&&<button onClick={()=>removeStep(i)} style={{background:"#FEE2E2",color:"#EF4444",border:"none",borderRadius:50,padding:"3px 10px",fontSize:11,fontWeight:800,cursor:"pointer"}}>Eliminar</button>}</div>
                <input value={step.title} onChange={e=>setStep(i,"title",e.target.value)} style={{...inputStyle,marginBottom:8}} placeholder={`Título del paso ${step.number}`}/>
                <textarea value={step.description} onChange={e=>setStep(i,"description",e.target.value)} style={{...inputStyle,height:60,resize:"vertical",marginBottom:10}} placeholder="Descripción..."/>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  {step.image?<img src={step.image} alt="" style={{width:56,height:56,borderRadius:8,objectFit:"cover"}}/>:<div style={{width:56,height:56,borderRadius:8,background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📷</div>}
                  <div><input type="file" accept="image/*" style={{display:"none"}} ref={el=>fileRefs.current[i]=el} onChange={e=>handleImg(i,e)}/><button onClick={()=>fileRefs.current[i]?.click()} style={{background:"#EDE9FE",color:"#7C3AED",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:800,cursor:"pointer"}}>{step.image?"Cambiar foto":"📤 Subir foto"}</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"14px 28px 22px",display:"flex",gap:10,justifyContent:"flex-end",borderTop:"2px solid #f0f0f0"}}>
          <button onClick={onClose} style={{background:"white",border:"2px solid #e0e0e0",borderRadius:50,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:"pointer",color:"#555",fontFamily:"inherit"}}>Cancelar</button>
          <button onClick={()=>onSave({...form,category_color:catColor[form.category]||"#888"})} style={{background:"linear-gradient(135deg,#A78BFA,#6366F1)",border:"none",borderRadius:50,padding:"10px 26px",fontSize:14,fontWeight:800,cursor:"pointer",color:"white",fontFamily:"inherit"}}>
            {isNew?"✅ Crear":"💾 Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({activity,onConfirm,onClose}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(10,10,30,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}><div style={{background:"white",borderRadius:20,padding:32,maxWidth:370,textAlign:"center",boxShadow:"0 24px 80px rgba(0,0,0,.25)"}}><div style={{fontSize:48,marginBottom:10}}>⚠️</div><h2 style={{fontSize:19,fontWeight:900,color:"#1a1a2e",marginBottom:8}}>¿Eliminar actividad?</h2><p style={{color:"#888",fontSize:14,marginBottom:22}}>Se eliminará <strong>"{activity.title}"</strong> permanentemente.</p><div style={{display:"flex",gap:10,justifyContent:"center"}}><button onClick={onClose} style={{background:"#f4f4f4",border:"none",borderRadius:50,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:"pointer",color:"#555",fontFamily:"inherit"}}>Cancelar</button><button onClick={onConfirm} style={{background:"#EF4444",border:"none",borderRadius:50,padding:"10px 22px",fontSize:14,fontWeight:800,cursor:"pointer",color:"white",fontFamily:"inherit"}}>Sí, eliminar</button></div></div></div>);
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanel(){
  const {activities,setActivities,showToast} = useApp();
  const [section,setSection]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const [saving,setSaving]=useState(false);

  const published  = activities.filter(a=>a.status==="publicado").length;
  const totalViews = activities.reduce((s,a)=>s+a.views,0);
  const top        = [...activities].sort((a,b)=>b.views-a.views)[0];
  const filtered   = activities.filter(a=>a.title.toLowerCase().includes(search.toLowerCase())||a.category.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async(form)=>{
    setSaving(true);
    const payload={title:form.title,emoji:form.emoji,category:form.category,category_color:form.category_color,difficulty:form.difficulty,age:form.age,time:form.time,status:form.status,description:form.description,cover_image:form.cover_image,cover_key:form.cover_key,steps:form.steps,updated_at:new Date().toISOString()};
    if(modal.activity.id){
      const{error}=await supabase.from("activities").update(payload).eq("id",modal.activity.id);
      if(error)showToast("❌ Error al guardar","#EF4444");
      else{setActivities(prev=>prev.map(a=>a.id===modal.activity.id?{...a,...payload}:a));showToast("✅ Actividad actualizada");}
    }else{
      const{data,error}=await supabase.from("activities").insert(payload).select().single();
      if(error)showToast("❌ Error al crear","#EF4444");
      else{setActivities(prev=>[data,...prev]);showToast("🎉 Actividad creada","#6366F1");}
    }
    setSaving(false);setModal(null);
  };

  const handleDelete=async()=>{
    const{error}=await supabase.from("activities").delete().eq("id",modal.activity.id);
    if(error)showToast("❌ Error al eliminar","#EF4444");
    else{setActivities(prev=>prev.filter(a=>a.id!==modal.activity.id));showToast("🗑️ Eliminada","#EF4444");}
    setModal(null);
  };

  const toggleStatus=async(id,current)=>{
    const newStatus=current==="publicado"?"borrador":"publicado";
    const{error}=await supabase.from("activities").update({status:newStatus}).eq("id",id);
    if(!error){setActivities(prev=>prev.map(a=>a.id===id?{...a,status:newStatus}:a));showToast("Estado actualizado");}
  };

  const weekData=[{d:"Lun",v:48},{d:"Mar",v:72},{d:"Mié",v:61},{d:"Jue",v:95},{d:"Vie",v:88},{d:"Sáb",v:120},{d:"Dom",v:97}];

  return(
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Nunito',sans-serif",background:"#f0f2ff"}}>
      <div style={{width:215,background:"#1a1a2e",display:"flex",flexDirection:"column",padding:"24px 0",position:"sticky",top:0,height:"100vh",flexShrink:0}}>
        <div style={{padding:"0 18px 22px"}}><div style={{fontSize:22,marginBottom:4}}>🔬🎨🔢</div><div style={{color:"white",fontWeight:900,fontSize:15}}>STEAM Admin</div><div style={{color:"#A78BFA",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px"}}>Panel de control</div></div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:12,flex:1}}>
          {[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"actividades",icon:"🔬",label:"Actividades"}].map(item=>(
            <button key={item.id} onClick={()=>setSection(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 18px",border:"none",cursor:"pointer",textAlign:"left",background:section===item.id?"rgba(167,139,250,.18)":"transparent",borderLeft:section===item.id?"3px solid #A78BFA":"3px solid transparent",color:section===item.id?"#A78BFA":"rgba(255,255,255,.55)",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif",transition:"all .15s"}}>
              <span style={{fontSize:16}}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 18px",borderTop:"1px solid rgba(255,255,255,.08)"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👩</div><div><div style={{color:"white",fontSize:12,fontWeight:800}}>Admin</div><div style={{color:"rgba(255,255,255,.4)",fontSize:10}}>steam@edu.com</div></div></div></div>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{background:"white",padding:"15px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 12px rgba(0,0,0,.06)",position:"sticky",top:0,zIndex:10}}>
          <div><h1 style={{fontSize:19,fontWeight:900,color:"#1a1a2e"}}>{section==="dashboard"?"📊 Dashboard":"🔬 Actividades"}</h1><p style={{color:"#bbb",fontSize:12,fontWeight:600,marginTop:1}}>{section==="dashboard"?"Resumen general":`${activities.length} actividades · ${published} publicadas`}</p></div>
          {section==="actividades"&&<button onClick={()=>setModal({type:"edit",activity:{}})} style={{background:"linear-gradient(135deg,#A78BFA,#6366F1)",border:"none",borderRadius:50,padding:"9px 20px",color:"white",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>+ Nueva actividad</button>}
        </div>

        <div style={{padding:"24px 28px"}}>
          {section==="dashboard"&&(
            <div>
              <div style={{display:"flex",gap:16,marginBottom:22,flexWrap:"wrap"}}>
                {[{icon:"👁️",label:"Vistas totales",value:totalViews,sub:"↑ +12% esta semana",color:"#6366F1"},{icon:"✅",label:"Publicadas",value:published,sub:`de ${activities.length} totales`,color:"#10B981"},{icon:"🔬",label:"Actividades",value:activities.length,sub:"En Supabase",color:"#F59E0B"},{icon:"🏆",label:"Más popular",value:top?.emoji||"🔬",sub:top?.title.split(" ").slice(0,2).join(" ")||"",color:"#EC4899"}].map((s,i)=>(
                  <div key={i} style={{background:"white",borderRadius:16,padding:"18px 20px",boxShadow:"0 2px 14px rgba(0,0,0,.07)",borderTop:`4px solid ${s.color}`,flex:1,minWidth:140}}>
                    <div style={{fontSize:24,marginBottom:4}}>{s.icon}</div><div style={{fontSize:26,fontWeight:900,color:"#1a1a2e"}}>{s.value}</div><div style={{fontSize:12,fontWeight:700,color:"#aaa",marginTop:1}}>{s.label}</div><div style={{fontSize:11,color:s.color,fontWeight:700,marginTop:3}}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                <div style={{background:"white",borderRadius:18,padding:22,boxShadow:"0 2px 14px rgba(0,0,0,.07)"}}>
                  <h2 style={{fontSize:14,fontWeight:900,color:"#1a1a2e",marginBottom:20}}>📈 Vistas esta semana</h2>
                  <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
                    {weekData.map((d,i)=>(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,height:"100%"}}>
                        <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div style={{width:"100%",borderRadius:"6px 6px 0 0",background:"linear-gradient(180deg,#A78BFA,#6366F1)",height:`${(d.v/120)*100}%`,minHeight:4,position:"relative"}}><div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",fontSize:9,fontWeight:800,color:"#6366F1",whiteSpace:"nowrap"}}>{d.v}</div></div></div>
                        <div style={{fontSize:10,fontWeight:700,color:"#bbb"}}>{d.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:"white",borderRadius:18,padding:22,boxShadow:"0 2px 14px rgba(0,0,0,.07)"}}>
                  <h2 style={{fontSize:14,fontWeight:900,color:"#1a1a2e",marginBottom:18}}>🏆 Top actividades</h2>
                  {[...activities].sort((a,b)=>b.views-a.views).slice(0,5).map((act,i)=>(
                    <div key={act.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"6px 10px",borderRadius:10,background:i===0?"#faf5ff":"transparent"}}>
                      <div style={{fontSize:14,width:22,textAlign:"center",fontWeight:900,color:i===0?"#A78BFA":i===1?"#F59E0B":i===2?"#EC4899":"#ddd"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
                      <div style={{fontSize:18}}>{act.emoji}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:800,color:"#1a1a2e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}>{act.title}</div><div style={{marginTop:4,background:"#f0f0f0",borderRadius:50,height:4,overflow:"hidden"}}><div style={{height:"100%",borderRadius:50,background:act.category_color||"#A78BFA",width:`${(act.views/(top?.views||1))*100}%`}}/></div></div>
                      <div style={{fontSize:12,fontWeight:800,color:"#6366F1",minWidth:36,textAlign:"right"}}>{act.views}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section==="actividades"&&(
            <div>
              <div style={{background:"white",borderRadius:12,padding:"9px 14px",display:"flex",alignItems:"center",gap:8,marginBottom:18,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
                <span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar actividad..." style={{border:"none",outline:"none",fontSize:13,fontWeight:600,color:"#1a1a2e",width:"100%",fontFamily:"inherit",background:"transparent"}}/>{search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:16}}>×</button>}
              </div>
              <div style={{background:"white",borderRadius:18,boxShadow:"0 2px 14px rgba(0,0,0,.07)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#f8f6ff",borderBottom:"2px solid #ede9fe"}}>{["Actividad","Categoría","Dificultad","Vistas","Estado","Acciones"].map(h=><th key={h} style={{padding:"12px 14px",fontSize:10,fontWeight:900,color:"#aaa",textTransform:"uppercase",textAlign:"left"}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filtered.map((act,i)=>(
                      <tr key={act.id} style={{borderBottom:i<filtered.length-1?"1px solid #f4f4f8":"none",transition:"background .15s"}} onMouseOver={e=>e.currentTarget.style.background="#f8f6ff"} onMouseOut={e=>e.currentTarget.style.background="white"}>
                        <td style={{padding:"12px 14px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{act.emoji}</span><div><div style={{fontSize:13,fontWeight:800,color:"#1a1a2e"}}>{act.title}</div><div style={{fontSize:10,color:"#bbb",fontWeight:600}}>⏱️ {act.time} · 👶 {act.age}</div></div></div></td>
                        <td style={{padding:"12px 14px"}}><Badge text={act.category} color={catColor[act.category]||"#888"}/></td>
                        <td style={{padding:"12px 14px"}}><Badge text={act.difficulty} color={diffColor[act.difficulty]||"#888"}/></td>
                        <td style={{padding:"12px 14px",fontSize:12,fontWeight:800,color:"#6366F1"}}>{act.views}</td>
                        <td style={{padding:"12px 14px"}}><button onClick={()=>toggleStatus(act.id,act.status)} style={{background:act.status==="publicado"?"#DCFCE7":"#FEF3C7",color:act.status==="publicado"?"#16A34A":"#D97706",border:"none",borderRadius:50,padding:"4px 11px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{act.status==="publicado"?"✅ Publicado":"📝 Borrador"}</button></td>
                        <td style={{padding:"12px 14px"}}><div style={{display:"flex",gap:5}}><button onClick={()=>setModal({type:"edit",activity:act})} style={{background:"#EDE9FE",color:"#7C3AED",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>✏️</button><button onClick={()=>setModal({type:"delete",activity:act})} style={{background:"#FEE2E2",color:"#EF4444",border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>🗑️</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length===0&&<div style={{padding:"40px 0",textAlign:"center",color:"#ccc",fontSize:14,fontWeight:700}}>🔍 Sin resultados</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {modal?.type==="edit"&&<ActivityModal activity={modal.activity} onSave={handleSave} onClose={()=>setModal(null)}/>}
      {modal?.type==="delete"&&<DeleteConfirm activity={modal.activity} onConfirm={handleDelete} onClose={()=>setModal(null)}/>}
      {saving&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"white",borderRadius:16,padding:"24px 32px",fontSize:15,fontWeight:800,color:"#1a1a2e"}}>💾 Guardando en Supabase...</div></div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — carga datos reales de Supabase
// ─────────────────────────────────────────────────────────────────────────────
export default function Root(){
  const [activities,setActivities] = useState([]);
  const [loading,setLoading]       = useState(true);
  const [mode,setMode]             = useState("public");
  const [toast,setToast]           = useState(null);

  const showToast=(msg,color="#10B981")=>{setToast({msg,color});setTimeout(()=>setToast(null),2800);};

  // Cargar actividades desde Supabase
  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const{data,error}=await supabase.from("activities").select("*").order("created_at",{ascending:false});
      if(error){console.error(error);showToast("❌ Error cargando datos","#EF4444");}
      else setActivities(data||[]);
      setLoading(false);
    })();
  },[]);

  // Registrar vista
  const trackView=async(id)=>{
    const act=activities.find(a=>a.id===id);
    if(!act)return;
    setActivities(prev=>prev.map(a=>a.id===id?{...a,views:a.views+1}:a));
    await supabase.from("activities").update({views:act.views+1}).eq("id",id);
  };

  return(
    <AppContext.Provider value={{activities,setActivities,loading,trackView,showToast}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Outfit:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes toastIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* Switch 🌐 / ⚙️ */}
      <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:500,display:"flex",background:"#1a1a2e",borderRadius:50,padding:5,boxShadow:"0 8px 32px rgba(0,0,0,.35)",gap:4}}>
        {[{id:"public",icon:"🌐",label:"App pública"},{id:"admin",icon:"⚙️",label:"Panel admin"}].map(m=>(
          <button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"9px 20px",borderRadius:50,border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:13,transition:"all .2s",background:mode===m.id?"linear-gradient(135deg,#A78BFA,#6366F1)":"transparent",color:mode===m.id?"white":"rgba(255,255,255,.5)"}}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {mode==="public"?<PublicApp/>:<AdminPanel/>}
      {toast&&<Toast msg={toast.msg} color={toast.color}/>}
    </AppContext.Provider>
  );
}