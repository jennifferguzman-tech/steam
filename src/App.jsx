import { useState } from "react";

const sitMap = {
  just_for_fun: "🌟 Solo diversión",
  dejar_pacha: "🍼 Dejar la pacha",
  tomar_medicina: "💊 Tomar medicina",
  potty_training: "🚽 Potty training",
  ir_doctor: "👨‍⚕️ Ir al doctor",
  nuevo_hermanito: "👶 Nuevo hermanito/a",
};

const ageEmojis = { 1:"👶",2:"👶",3:"🧒",4:"🧒",5:"🧒",6:"👦",7:"👦",8:"👦",9:"👧",10:"👧" };

export default function App() {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState(null);
  const [age, setAge] = useState(3);
  const [sit, setSit] = useState(null);
  const [cuento, setCuento] = useState("");
  const [loading, setLoading] = useState(false);

  const goTo = (n) => setStep(n);

 

  const restart = () => {
    setStep(1); setNombre(""); setGenero(null);
    setAge(3); setSit(null); setCuento("");
  };

  const s = { // styles
    page: { minHeight:"100vh", background:"radial-gradient(ellipse at 20% 50%, #3d1060 0%, #1a0533 40%, #0d0220 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito', sans-serif", padding:"20px" },
    card: { background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"36px", width:"100%", maxWidth:"400px", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.6)" },
    header: { background:"linear-gradient(160deg, #2d0b6b 0%, #4a1090 50%, #6a1fbd 100%)", padding:"24px 28px 20px", position:"relative" },
    appName: { fontFamily:"'Fredoka One', cursive", fontSize:"24px", color:"white", margin:0 },
    tagline: { fontSize:"12px", color:"rgba(255,255,255,0.55)", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", margin:"4px 0 16px" },
    dots: { display:"flex", gap:"6px" },
    dot: (i, cur) => ({ height:"4px", borderRadius:"2px", transition:"all 0.4s", background: i < cur ? "rgba(180,79,255,0.5)" : i === cur ? "#b44fff" : "rgba(255,255,255,0.15)", width: i === cur ? "28px" : "12px", boxShadow: i === cur ? "0 0 8px #b44fff" : "none" }),
    body: { padding:"20px 28px 28px" },
    title: { fontFamily:"'Fredoka One', cursive", fontSize:"24px", color:"white", marginBottom:"4px" },
    sub: { fontSize:"13px", color:"rgba(255,255,255,0.5)", marginBottom:"20px", lineHeight:1.5 },
    input: { width:"100%", padding:"14px 16px 14px 48px", background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:"18px", color:"white", fontFamily:"'Nunito',sans-serif", fontSize:"16px", fontWeight:700, outline:"none", boxSizing:"border-box" },
    inputWrap: { position:"relative", marginBottom:"18px" },
    inputIcon: { position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", fontSize:"20px", pointerEvents:"none" },
    btnMain: (disabled) => ({ width:"100%", padding:"16px", borderRadius:"20px", border:"none", background: disabled ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #b44fff 0%, #ff6bcd 100%)", color:"white", fontFamily:"'Fredoka One',cursive", fontSize:"19px", cursor: disabled ? "not-allowed" : "pointer", marginTop:"20px", boxShadow: disabled ? "none" : "0 8px 32px rgba(180,79,255,0.45)", transition:"all 0.25s" }),
    btnBack: { background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontFamily:"'Nunito',sans-serif", fontSize:"13px", fontWeight:700, cursor:"pointer", padding:"4px 0", marginBottom:"12px", display:"flex", alignItems:"center", gap:"5px" },
    genderRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"12px" },
    genderBtn: (sel) => ({ background: sel ? "rgba(180,79,255,0.15)" : "rgba(255,255,255,0.05)", border: sel ? "1.5px solid #b44fff" : "1.5px solid rgba(255,255,255,0.1)", borderRadius:"18px", padding:"20px 10px", cursor:"pointer", textAlign:"center", transition:"all 0.25s", boxShadow: sel ? "0 0 0 2px rgba(180,79,255,0.3)" : "none" }),
    genderEmoji: { fontSize:"36px", display:"block", marginBottom:"8px" },
    genderLabel: (sel) => ({ fontSize:"13px", fontWeight:800, color: sel ? "white" : "rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:"0.5px" }),
    ageBox: { background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px" },
    ageBtn: { width:"44px", height:"44px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"white", fontSize:"22px", fontWeight:900, cursor:"pointer" },
    ageNum: { fontFamily:"'Fredoka One',cursive", fontSize:"52px", color:"white", lineHeight:1, textAlign:"center", textShadow:"0 0 20px rgba(180,79,255,0.8)" },
    ageWord: { fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", textAlign:"center" },
    ageEmojis: { textAlign:"center", fontSize:"22px", marginBottom:"8px", minHeight:"30px" },
    sitGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"4px" },
    sitBtn: (sel) => ({ background: sel ? "rgba(180,79,255,0.15)" : "rgba(255,255,255,0.05)", border: sel ? "1.5px solid #b44fff" : "1.5px solid rgba(255,255,255,0.1)", borderRadius:"18px", padding:"14px 8px", cursor:"pointer", textAlign:"center", transition:"all 0.25s", boxShadow: sel ? "0 0 0 2px rgba(180,79,255,0.3)" : "none" }),
    sitEmoji: { fontSize:"26px", display:"block", marginBottom:"6px" },
    sitLabel: (sel) => ({ fontSize:"11px", fontWeight:800, color: sel ? "white" : "rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:"0.3px", lineHeight:1.3 }),
    summaryCard: { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", overflow:"hidden", marginBottom:"4px" },
    sumRow: { display:"flex", alignItems:"center", gap:"14px", padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)" },
    sumIco: { fontSize:"24px" },
    sumKey: { fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"2px" },
    sumVal: { fontSize:"16px", color:"white", fontWeight:800 },
    loadWrap: { textAlign:"center", padding:"20px 0 8px" },
    orb: { width:"90px", height:"90px", borderRadius:"50%", background:"radial-gradient(circle at 35% 35%, #d480ff, #7b1fff)", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"40px", boxShadow:"0 0 40px rgba(180,79,255,0.7)", animation:"orbPulse 2s ease-in-out infinite" },
    loadTitle: { fontFamily:"'Fredoka One',cursive", fontSize:"22px", color:"white", marginBottom:"6px" },
    loadSub: { fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.6 },
    badge: { display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,rgba(180,79,255,0.2),rgba(255,107,205,0.2))", border:"1px solid rgba(180,79,255,0.3)", borderRadius:"20px", padding:"5px 14px", fontSize:"12px", color:"rgba(255,255,255,0.7)", fontWeight:700, marginBottom:"14px" },
    storyScroll: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px", padding:"18px", maxHeight:"200px", overflowY:"auto", fontSize:"14px", color:"rgba(255,255,255,0.85)", lineHeight:1.85, whiteSpace:"pre-wrap" },
    actionRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"14px" },
    btnAct: { padding:"12px", borderRadius:"16px", border:"1.5px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.7)", fontFamily:"'Nunito',sans-serif", fontSize:"14px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes orbPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        input::placeholder { color: rgba(255,255,255,0.3); }
        * { box-sizing: border-box; }
      `}</style>

      <div style={s.page}>
        <div style={s.card}>

          {/* Header */}
          <div style={s.header}>
            <div style={s.appName}>✨ Cuentos Mágicos</div>
            <div style={s.tagline}>Historias para soñar</div>
            {step <= 5 && (
              <div style={s.dots}>
                {[1,2,3,4,5].map(i => <div key={i} style={s.dot(i, step)} />)}
              </div>
            )}
          </div>

          <div style={s.body}>

            {/* STEP 1: Nombre */}
            {step === 1 && (
              <div>
                <div style={s.title}>¿Cómo se llama? ✏️</div>
                <div style={s.sub}>El protagonista de la historia será tu pequeño</div>
                <div style={s.inputWrap}>
                  <span style={s.inputIcon}>🌟</span>
                  <input style={s.input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del niño/niña" />
                </div>
                <button style={s.btnMain(!nombre.trim())} disabled={!nombre.trim()} onClick={() => goTo(2)}>Continuar ✨</button>
              </div>
            )}

            {/* STEP 2: Género */}
            {step === 2 && (
              <div>
                <button style={s.btnBack} onClick={() => goTo(1)}>← Volver</button>
                <div style={s.title}>¿{nombre} es niño o niña? 💫</div>
                <div style={s.sub}>Para que el cuento use las palabras perfectas</div>
                <div style={s.genderRow}>
                  {[{val:"nino",emoji:"👦",label:"Niño"},{val:"nina",emoji:"👧",label:"Niña"}].map(g => (
                    <div key={g.val} style={s.genderBtn(genero===g.val)} onClick={() => setGenero(g.val)}>
                      <span style={s.genderEmoji}>{g.emoji}</span>
                      <span style={s.genderLabel(genero===g.val)}>{g.label}</span>
                    </div>
                  ))}
                </div>
                <button style={s.btnMain(!genero)} disabled={!genero} onClick={() => goTo(3)}>Continuar ✨</button>
              </div>
            )}

            {/* STEP 3: Edad */}
            {step === 3 && (
              <div>
                <button style={s.btnBack} onClick={() => goTo(2)}>← Volver</button>
                <div style={s.title}>¿Cuántos años tiene? 🎂</div>
                <div style={s.sub}>Adaptamos el cuento perfectamente a su edad</div>
                <div style={s.ageEmojis}>{(ageEmojis[age]||"🧒").repeat(Math.min(age,5))}</div>
                <div style={s.ageBox}>
                  <button style={s.ageBtn} onClick={() => setAge(a => Math.max(1,a-1))}>−</button>
                  <div>
                    <div style={s.ageNum}>{age}</div>
                    <div style={s.ageWord}>años</div>
                  </div>
                  <button style={s.ageBtn} onClick={() => setAge(a => Math.min(10,a+1))}>+</button>
                </div>
                <button style={s.btnMain(false)} onClick={() => goTo(4)}>Continuar ✨</button>
              </div>
            )}

            {/* STEP 4: Situación */}
            {step === 4 && (
              <div>
                <button style={s.btnBack} onClick={() => goTo(3)}>← Volver</button>
                <div style={s.title}>¿Para qué ocasión? 🌈</div>
                <div style={s.sub}>Elige el tema del cuento mágico</div>
                <div style={s.sitGrid}>
                  {Object.entries(sitMap).map(([val, label]) => {
                    const [emoji, ...rest] = label.split(" ");
                    return (
                      <div key={val} style={s.sitBtn(sit===val)} onClick={() => setSit(val)}>
                        <span style={s.sitEmoji}>{emoji}</span>
                        <span style={s.sitLabel(sit===val)}>{rest.join(" ")}</span>
                      </div>
                    );
                  })}
                </div>
                <button style={s.btnMain(!sit)} disabled={!sit} onClick={() => goTo(5)}>Continuar ✨</button>
              </div>
            )}

            {/* STEP 5: Resumen */}
            {step === 5 && (
              <div>
                <button style={s.btnBack} onClick={() => goTo(4)}>← Volver</button>
                <div style={s.title}>¡Todo listo! 🪄</div>
                <div style={s.sub}>Así será el cuento de tu pequeño</div>
                <div style={s.summaryCard}>
                  {[
                    { ico: genero==="nino"?"👦":"👧", key:"Protagonista", val:`${nombre} · ${genero==="nino"?"Niño":"Niña"}` },
                    { ico:"🎂", key:"Edad", val:`${age} años` },
                    { ico:"🌈", key:"Tema", val: sitMap[sit] },
                  ].map((r,i,arr) => (
                    <div key={r.key} style={{...s.sumRow, borderBottom: i<arr.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none"}}>
                      <span style={s.sumIco}>{r.ico}</span>
                      <div>
                        <div style={s.sumKey}>{r.key}</div>
                        <div style={s.sumVal}>{r.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={s.btnMain(false)} onClick={generate}>🪄 Crear el cuento mágico</button>
              </div>
            )}

            {/* STEP 6: Loading */}
            {step === 6 && (
              <div style={s.loadWrap}>
                <div style={s.orb}>🪄</div>
                <div style={s.loadTitle}>Tejiendo la magia...</div>
                <div style={s.loadSub}>Creando una historia única<br/>para <strong style={{color:"#d480ff"}}>{nombre}</strong></div>
              </div>
            )}

            {/* STEP 7: Resultado */}
            {step === 7 && (
              <div>
                <div style={s.badge}>📖 Cuento personalizado · {sitMap[sit]}</div>
                <div style={s.storyScroll}>{cuento}</div>
                <div style={s.actionRow}>
                  <button style={s.btnAct}>❤️ Guardar</button>
                  <button style={s.btnAct}>📤 Compartir</button>
                </div>
                <button style={{...s.btnMain(false), marginTop:"12px"}} onClick={restart}>✨ Crear otro cuento</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}