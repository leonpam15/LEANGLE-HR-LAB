import { useState } from "react";
const B = { navyD:"#0F1823",navy:"#1A2535",steel:"#4A7FA5",silver:"#C8CDD6",white:"#FFFFFF",muted:"#6B7A8D",border:"#2A3A4D" };
export default function ResendReport() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const handleResend = async () => {
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/resend-report", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email }) });
      if (res.ok) setStatus("sent"); else setStatus("error");
    } catch { setStatus("error"); }
  };
  const disabled = status === "sending" || !email;
  return (
    <div style={{minHeight:"100vh",background:B.navyD,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:26,fontWeight:300,letterSpacing:10,color:B.white,fontFamily:"Georgia,serif",marginBottom:4}}>LEANGLE</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:32}}>
          <div style={{height:1,width:28,background:B.steel}}/><div style={{fontSize:10,letterSpacing:5,color:B.steel,fontWeight:600}}>HR LAB</div><div style={{height:1,width:28,background:B.steel}}/>
        </div>
        {status==="sent" ? (
          <div style={{background:B.navy,border:"1px solid #4A7FA555",borderRadius:20,padding:"40px 28px"}}>
            <div style={{fontSize:48,marginBottom:16}}>📬</div>
            <h2 style={{color:B.white,fontSize:20,fontWeight:400,fontFamily:"Georgia,serif",marginBottom:10}}>Report Sent!</h2>
            <p style={{color:B.silver,fontSize:14,lineHeight:1.7,marginBottom:24}}>Check your inbox — your report will arrive within a few minutes.</p>
            <button onClick={()=>window.location.href="/"} style={{background:B.steel,color:B.white,border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Back to Assessments</button>
          </div>
        ) : (
          <div style={{background:B.navy,border:"1px solid #2A3A4D",borderRadius:20,padding:"32px 28px"}}>
            <h2 style={{color:B.white,fontSize:20,fontWeight:400,fontFamily:"Georgia,serif",marginBottom:8}}>Resend My Report</h2>
            <p style={{color:B.muted,fontSize:13,lineHeight:1.6,marginBottom:24}}>Enter your email and we will resend your report instantly.</p>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
              style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid #2A3A4D",background:B.navyD,color:B.white,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
            {status==="error" && <p style={{color:"#F08080",fontSize:13,marginBottom:12}}>Something went wrong. Please try again.</p>}
            <button onClick={handleResend} disabled={disabled}
              style={{width:"100%",padding:"14px",borderRadius:9,border:"none",fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",background:disabled?B.border:B.steel,color:disabled?B.muted:B.white}}>
              {status==="sending" ? "Sending..." : "Resend My Report"}
            </button>
            <button onClick={()=>window.location.href="/"} style={{display:"block",margin:"12px auto 0",background:"none",border:"none",color:B.muted,fontSize:12,cursor:"pointer"}}>Back to Assessments</button>
          </div>
        )}
      </div>
    </div>
  );
}