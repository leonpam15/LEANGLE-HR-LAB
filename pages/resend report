import { useState } from "react";

const B = {
  navy:"#1A2535",navyD:"#0F1823",navyL:"#243040",gold:"#B8965A",
  steel:"#4A7FA5",silver:"#C8CDD6",white:"#FFFFFF",muted:"#6B7A8D",
  border:"#2A3A4D",success:"#4A9B7F",
};

const QUIZZES = [
  { id:"communication", title:"Leadership Communication Style", emoji:"💬" },
  { id:"conflict", title:"Conflict Resolution Style", emoji:"⚡" },
  { id:"feedback", title:"Feedback Style", emoji:"🎙️" },
  { id:"decision", title:"Decision-Making Style", emoji:"⚖️" },
  { id:"motivation", title:"What Motivates You at Work", emoji:"🔋" },
  { id:"stress", title:"Workplace Stress Response", emoji:"🌡️" },
];

function Logo({ size=1 }) {
  return (
    <div style={{textAlign:"center",userSelect:"none"}}>
      <div style={{fontSize:22*size,fontWeight:300,letterSpacing:8*size,color:B.white,fontFamily:"Georgia,serif",lineHeight:1.1}}>LEANGLE</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8*size,marginTop:2*size}}>
        <div style={{height:1,width:28*size,background:B.steel}}/>
        <div style={{fontSize:10*size,letterSpacing:5*size,color:B.steel,fontFamily:"system-ui",fontWeight:600}}>HR LAB</div>
        <div style={{height:1,width:28*size,background:B.steel}}/>
      </div>
    </div>
  );
}

export default function ResendReport() {
  const [email, setEmail] = useState("");
  const [quiz, setQuiz] = useState("");
  const [style, setStyle] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [lang, setLang] = useState("en");

  const tx = {
    en: {
      title: "Resend My Report",
      sub: "Enter your details below and we'll regenerate and resend your personalised report.",
      emailLabel: "Email address used for purchase",
      quizLabel: "Which assessment did you take?",
      styleLabel: "What was your result? (e.g. Collaborative, Directive…)",
      stylePlaceholder: "Your result style",
      btn: "Resend My Report",
      sending: "Generating & sending…",
      successTitle: "Report sent! 🎉",
      successSub: "Check your inbox — it should arrive within a few minutes. Check your spam folder too.",
      errorTitle: "Something went wrong",
      errorSub: "Please try again or contact support@leangle.com",
      selectQuiz: "Select your assessment…",
      backHome: "← Back to assessments",
    },
    es: {
      title: "Reenviar Mi Informe",
      sub: "Ingresa tus datos y regeneraremos y reenviaremos tu informe personalizado.",
      emailLabel: "Correo electrónico usado en la compra",
      quizLabel: "¿Qué evaluación completaste?",
      styleLabel: "¿Cuál fue tu resultado? (ej. Colaborativo, Directivo…)",
      stylePlaceholder: "Tu estilo de resultado",
      btn: "Reenviar Mi Informe",
      sending: "Generando y enviando…",
      successTitle: "¡Informe enviado! 🎉",
      successSub: "Revisa tu bandeja de entrada — debería llegar en unos minutos. Revisa también tu carpeta de spam.",
      errorTitle: "Algo salió mal",
      errorSub: "Por favor intenta de nuevo o contacta support@leangle.com",
      selectQuiz: "Selecciona tu evaluación…",
      backHome: "← Volver a las evaluaciones",
    }
  }[lang];

  const handleResend = async () => {
    if (!email || !quiz || !style) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/resend-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, quizId: quiz, primaryStyle: style, lang }),
      });
      if (res.ok) { setStatus("sent"); }
      else { setStatus("error"); }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{minHeight:"100vh",background:B.navyD,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
      <div style={{maxWidth:460,width:"100%"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <Logo size={1}/>
          <div style={{marginTop:16,display:"flex",justifyContent:"center"}}>
            <button onClick={()=>setLang(lang==="en"?"es":"en")} style={{
              background:"none",border:`1px solid ${B.border}`,borderRadius:99,
              padding:"4px 12px",color:B.silver,fontSize:12,cursor:"pointer",
            }}>
              {lang==="en"?"🇪🇸 ES":"🇬🇧 EN"}
            </button>
          </div>
        </div>

        {status === "sent" ? (
          <div style={{background:B.navyL,border:`1px solid ${B.steel}55`,borderRadius:20,padding:"40px 28px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>📬</div>
            <h2 style={{color:B.white,fontSize:20,fontWeight:400,fontFamily:"Georgia,serif",marginBottom:8}}>{tx.successTitle}</h2>
            <p style={{color:B.silver,fontSize:14,lineHeight:1.7,marginBottom:24}}>{tx.successSub}</p>
            <button onClick={()=>window.location.href="/"} style={{background:B.steel,color:B.white,border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>
              {tx.backHome}
            </button>
          </div>
        ) : (
          <div style={{background:B.navyL,border:`1px solid ${B.border}`,borderRadius:20,padding:"32px 28px"}}>
            <h2 style={{color:B.white,fontSize:20,fontWeight:400,fontFamily:"Georgia,serif",marginBottom:6,textAlign:"center"}}>{tx.title}</h2>
            <p style={{color:B.muted,fontSize:13,lineHeight:1.6,marginBottom:24,textAlign:"center"}}>{tx.sub}</p>

            {/* Email */}
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,color:B.silver,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>{tx.emailLabel}</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"
                style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1px solid ${B.border}`,background:B.navyD,color:B.white,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>

            {/* Quiz selector */}
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,color:B.silver,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>{tx.quizLabel}</label>
              <select value={quiz} onChange={e=>setQuiz(e.target.value)}
                style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1px solid ${B.border}`,background:B.navyD,color:quiz?B.white:B.muted,fontSize:14,outline:"none",boxSizing:"border-box"}}>
                <option value="">{tx.selectQuiz}</option>
                {QUIZZES.map(q=>(
                  <option key={q.id} value={q.id}>{q.emoji} {q.title}</option>
                ))}
              </select>
            </div>

            {/* Style input */}
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:11,color:B.silver,marginBottom:5,letterSpacing:0.5,textTransform:"uppercase"}}>{tx.styleLabel}</label>
              <input type="text" value={style} onChange={e=>setStyle(e.target.value)} placeholder={tx.stylePlaceholder}
                style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1px solid ${B.border}`,background:B.navyD,color:B.white,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>

            {status==="error" && (
              <div style={{background:"#3A1515",border:"1px solid #C05050",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
                <p style={{color:"#F08080",fontSize:13,marginBottom:2,fontWeight:600}}>{tx.errorTitle}</p>
                <p style={{color:"#F08080",fontSize:12}}>{tx.errorSub}</p>
              </div>
            )}

            <button onClick={handleResend} disabled={status==="sending"||!email||!quiz||!style}
              style={{width:"100%",padding:"14px",borderRadius:9,border:"none",fontSize:15,fontWeight:700,
                cursor:status==="sending"||!email||!quiz||!style?"not-allowed":"pointer",
                background:status==="sending"||!email||!quiz||!style?B.border:B.steel,
                color:status==="sending"||!email||!quiz||!style?B.muted:B.white,transition:"all 0.2s"}}>
              {status==="sending" ? tx.sending : tx.btn}
            </button>

            <button onClick={()=>window.location.href="/"} style={{display:"block",margin:"12px auto 0",background:"none",border:"none",color:B.muted,fontSize:12,cursor:"pointer"}}>
              {tx.backHome}
            </button>
          </div>
        )}

        <p style={{textAlign:"center",color:B.muted,fontSize:11,marginTop:16}}>
          Questions? <a href="mailto:support@leangle.com" style={{color:B.steel,textDecoration:"none"}}>support@leangle.com</a>
        </p>
      </div>
    </div>
  );
}
