/* ═══════════════════════════════════════════════════
   ARQUIVO 29 · src/pages/Perfil.jsx
   ═══════════════════════════════════════════════════ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { calcLevel, calcStreak, today } from '../utils/gamification';
import ProgressBar from '../components/ProgressBar';

const fmt = v => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
const cardStyle = {background:'#1e1e1e',borderRadius:'16px',padding:'20px',marginBottom:'16px'};
const inputStyle = {width:'100%',padding:'14px',background:'#141414',border:'1px solid #2a2a2a',borderRadius:'12px',color:'#fff',fontSize:'14px',fontFamily:'Sora',outline:'none',marginBottom:'12px'};
const linkBtn = {width:'100%',padding:'14px',background:'#141414',border:'1px solid #2a2a2a',borderRadius:'12px',color:'#fff',fontSize:'14px',fontFamily:'Sora',fontWeight:500,cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'};

export default function Perfil(){
  const navigate = useNavigate();
  const [nome, setNome] = useLocalStorage('b2_nome','');
  const [especialidade, setEspecialidade] = useLocalStorage('b2_especialidade','');
  const [metaDiaria, setMetaDiaria] = useLocalStorage('b2_meta_diaria',5);
  const [atendimentos] = useLocalStorage('b2_atendimentos',[]);
  const [clientes] = useLocalStorage('b2_clientes',[]);
  const [streakData] = useLocalStorage('b2_streak',{});

  const [editNome, setEditNome] = useState(nome);
  const [editEsp, setEditEsp] = useState(especialidade);
  const [editMeta, setEditMeta] = useState(metaDiaria);
  const [saved, setSaved] = useState(false);

  /* Stats */
  const totalReceita = atendimentos.reduce((s,a)=>s+(a.valor||0)+(a.gorjeta||0),0);
  const level = calcLevel(totalReceita);
  const todayCount = atendimentos.filter(a=>a.data===today()).length;
  const streak = calcStreak(streakData, todayCount);
  const totalClientes = clientes.length;

  const salvar = () => {
    setNome(editNome);
    setEspecialidade(editEsp);
    setMetaDiaria(Number(editMeta)||5);
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const resetar = () => {
    if(!window.confirm('Apagar TODOS os dados do app? Isso não pode ser desfeito.')) return;
    const keys = ['b2_atendimentos','b2_clientes','b2_streak','b2_nome','b2_especialidade','b2_meta_diaria','b2_onboarded'];
    keys.forEach(k=>localStorage.removeItem(k));
    window.location.reload();
  };

  /* Avatar */
  const iniciais = (nome||'B2').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();

  return (
    <div style={{padding:'20px 16px 100px',maxWidth:'480px',margin:'0 auto'}}>

      {/* Avatar + Level */}
      <div style={{textAlign:'center',marginBottom:'24px'}}>
        <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'linear-gradient(135deg,#FF6B35,#ff8c42)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontSize:'28px',fontWeight:700,fontFamily:'Sora',color:'#fff'}}>{iniciais}</div>
        <h1 style={{fontSize:'22px',fontWeight:700,fontFamily:'Sora',color:'#fff',margin:0}}>{nome || 'Profissional'}</h1>
        {especialidade && <p style={{fontSize:'13px',color:'#888',marginTop:'4px'}}>{especialidade}</p>}
      </div>

      {/* Level */}
      <div style={{...cardStyle,textAlign:'center'}}>
        <div style={{fontSize:'11px',color:'#888',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'8px'}}>Nível profissional</div>
        <div style={{fontSize:'24px',fontWeight:800,color:'#FF6B35',fontFamily:'Sora',marginBottom:'4px'}}>{level.label}</div>
        <div style={{fontSize:'12px',color:'#666',marginBottom:'12px'}}>
          {level.nextLabel ? `Próximo: ${level.nextLabel} (${fmt(level.nextThreshold)})` : 'Nível máximo alcançado!'}
        </div>
        <ProgressBar percent={level.progress} />
        <div style={{fontSize:'11px',color:'#555',marginTop:'6px'}}>Receita total: {fmt(totalReceita)}</div>
      </div>

      {/* Quick stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'16px'}}>
        {[
          {l:'Atendimentos',v:atendimentos.length},
          {l:'Streak',v:`${streak.current} 🔥`},
          {l:'Clientes',v:totalClientes}
        ].map((s,i)=>(
          <div key={i} style={{...cardStyle,textAlign:'center',padding:'14px',marginBottom:0}}>
            <div style={{fontSize:'20px',fontWeight:700,color:'#fff',fontFamily:'Space Grotesk'}}>{s.v}</div>
            <div style={{fontSize:'10px',color:'#888',marginTop:'4px'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Editar perfil */}
      <div style={cardStyle}>
        <p style={{fontSize:'12px',color:'#888',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'12px',fontWeight:600}}>Editar perfil</p>
        <input placeholder="Seu nome" value={editNome} onChange={e=>setEditNome(e.target.value)} style={inputStyle}/>
        <input placeholder="Especialidade (ex: Barbeiro)" value={editEsp} onChange={e=>setEditEsp(e.target.value)} style={inputStyle}/>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <label style={{fontSize:'13px',color:'#aaa',whiteSpace:'nowrap'}}>Meta diária:</label>
          <input type="number" min="1" max="50" value={editMeta} onChange={e=>setEditMeta(e.target.value)} style={{...inputStyle,marginBottom:0,width:'80px',textAlign:'center'}}/>
          <span style={{fontSize:'12px',color:'#666'}}>atendimentos</span>
        </div>
        <button onClick={salvar} style={{
          width:'100%',padding:'14px',background:'linear-gradient(135deg,#FF6B35,#ff8c42)',
          color:'#fff',border:'none',borderRadius:'14px',fontSize:'15px',fontWeight:700,fontFamily:'Sora',cursor:'pointer'
        }}>
          {saved ? '✓ Salvo!' : 'Salvar alterações'}
        </button>
      </div>

      {/* Links rápidos */}
      <div style={cardStyle}>
        <p style={{fontSize:'12px',color:'#888',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'12px',fontWeight:600}}>Atalhos</p>
        {[
          {label:'🏆 Conquistas',path:'/conquistas'},
          {label:'📊 Resumo Semanal',path:'/resumo'},
          {label:'💰 Financeiro',path:'/financeiro'},
          {label:'📸 Antes & Depois',path:'/antes-depois'}
        ].map((link,i)=>(
          <button key={i} onClick={()=>navigate(link.path)} style={linkBtn}>
            <span>{link.label}</span>
            <span style={{color:'#555'}}>→</span>
          </button>
        ))}
      </div>

      {/* Reset */}
      <button onClick={resetar} style={{
        width:'100%',padding:'14px',background:'transparent',border:'1px solid #7f1d1d',
        borderRadius:'12px',color:'#ef4444',fontSize:'13px',fontFamily:'Sora',fontWeight:600,cursor:'pointer',marginTop:'8px'
      }}>
        Resetar todos os dados
      </button>

      <p style={{textAlign:'center',fontSize:'11px',color:'#333',marginTop:'20px'}}>B2 — Pro Beleza · v0.1.0</p>
    </div>
  );
}
