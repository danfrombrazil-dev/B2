import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const wrapper = { maxWidth: '480px', margin: '0 auto', padding: '0 20px', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }
const hero = { paddingTop: '60px', paddingBottom: '40px', textAlign: 'center' }
const badge = { display: 'inline-block', padding: '6px 14px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#FF6B35', marginBottom: '24px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.5px' }
const h1 = { fontFamily: 'Sora, sans-serif', fontSize: '32px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '16px' }
const accent = { color: '#FF6B35' }
const heroSub = { fontSize: '16px', color: '#a0a0a0', lineHeight: 1.6, marginBottom: '32px' }
const ctaBtn = { display: 'inline-block', padding: '18px 48px', background: 'linear-gradient(135deg, #FF6B35, #ff8c42)', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '18px', fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer', boxShadow: '0 4px 32px rgba(255,107,53,0.4)', width: '100%', marginBottom: '12px' }
const ctaHint = { fontSize: '13px', color: '#666', textAlign: 'center' }
const section = { padding: '40px 0' }
const sectionTitle = { fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '24px', textAlign: 'center' }
const painCard = { padding: '20px', background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', marginBottom: '12px' }
const painEmoji = { fontSize: '24px', marginBottom: '8px' }
const painTitle = { fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }
const painText = { fontSize: '13px', color: '#a0a0a0', lineHeight: 1.5 }
const featureCard = { display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px', background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', marginBottom: '12px' }
const featureEmoji = { fontSize: '28px', flexShrink: 0, width: '48px', height: '48px', background: 'rgba(255,107,53,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const featureTitle = { fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }
const featureText = { fontSize: '13px', color: '#a0a0a0', lineHeight: 1.5 }
const quoteCard = { padding: '24px', background: 'linear-gradient(145deg, #141414, #1a1a1a)', borderRadius: '20px', border: '1px solid #1e1e1e', marginBottom: '12px' }
const quoteText = { fontSize: '15px', color: '#d0d0d0', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '12px' }
const quoteAuthor = { fontSize: '13px', color: '#FF6B35', fontWeight: 600 }
const howStep = { display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }
const howNumber = { width: '36px', height: '36px', borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: '#ffffff', flexShrink: 0 }
const howTitle = { fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }
const howText = { fontSize: '13px', color: '#a0a0a0', lineHeight: 1.5 }
const footer = { padding: '40px 0 24px', textAlign: 'center', borderTop: '1px solid #1e1e1e' }

const PAINS = [
  { emoji: '😰', title: 'Agenda vazia', text: 'Cadeira sem cliente, dia perdido, dinheiro que não entra. E o aluguel não espera.' },
  { emoji: '🤷', title: 'Não sabe quanto ganha', text: 'Dinheiro entra e sai, mas no final do mês não sabe o saldo real. Vive no achismo.' },
  { emoji: '📱', title: 'Cliente some', text: 'Aquele cliente frequente simplesmente para de vir. E você nem percebe até ser tarde.' },
  { emoji: '😤', title: 'Expectativas irreais', text: 'Cliente traz foto com filtro do Instagram e quer o mesmo resultado por R$50.' },
  { emoji: '💸', title: 'Medo de cobrar mais', text: 'Sabe que precisa reajustar, mas tem medo de perder cliente. Então não reajusta.' },
  { emoji: '📸', title: 'Rede social travada', text: 'Sabe que precisa postar, mas não tem tempo, não sabe fotografar, não sabe o que escrever.' },
]

const FEATURES = [
  { emoji: '💈', title: 'Consultor Visual', text: 'Catálogo inteligente de estilos. Filtra por formato de rosto, tom de pele e vibe do cliente. Use na cadeira pra aumentar o ticket.' },
  { emoji: '👥', title: 'CRM de Clientes', text: 'Ficha de cada cliente: histórico, preferências, aniversário, observações. Mensagem pronta pro WhatsApp pra reconquistar quem sumiu.' },
  { emoji: '💰', title: 'Controle Financeiro', text: 'Registre atendimentos em 2 toques. Veja quanto faturou hoje, na semana, no mês. Ranking dos serviços mais lucrativos.' },
  { emoji: '📸', title: 'Antes & Depois', text: 'Tire as fotos, o app gera um card profissional pronto pra stories. Cada atendimento vira marketing com zero esforço.' },
  { emoji: '🔥', title: 'Ofensiva Diária', text: 'Sistema estilo Duolingo. Streak de dias consecutivos, meta diária com barra de progresso, confete ao bater meta.' },
  { emoji: '🏆', title: 'Conquistas', text: 'Desbloqueie badges conforme evolui: Primeiro Dia, Mês de Ouro, Dia de Ouro (R$1.000), Top Performer.' },
]

export default function Landing() {
  const [, setOnboarded] = useLocalStorage('b2_onboarded', false)
  const [, setNome] = useLocalStorage('b2_nome', '')
  const [inputNome, setInputNome] = useState('')
  const [showOnboard, setShowOnboard] = useState(false)

  function handleStart() { setShowOnboard(true) }
  function handleConfirm() {
    if (inputNome.trim()) setNome(inputNome.trim())
    setOnboarded(true)
    window.location.href = '/'
  }

  if (showOnboard) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#0a0a0a' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>✂️</div>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', textAlign: 'center' }}>Bem-vindo ao B2</div>
        <div style={{ fontSize: '14px', color: '#a0a0a0', textAlign: 'center', marginBottom: '32px', lineHeight: 1.5, maxWidth: '300px' }}>
          Antes de começar, como quer ser chamado? Isso aparece nos seus cards e resumos.
        </div>
        <input type="text" placeholder="Seu nome ou nome artístico" value={inputNome} onChange={(e) => setInputNome(e.target.value)}
          style={{ width: '100%', maxWidth: '320px', padding: '16px 20px', background: '#141414', border: '2px solid #1e1e1e', borderRadius: '16px', color: '#ffffff', fontSize: '16px', fontFamily: 'Sora, sans-serif', outline: 'none', textAlign: 'center', marginBottom: '20px' }} autoFocus />
        <button style={{ ...ctaBtn, maxWidth: '320px', opacity: inputNome.trim() ? 1 : 0.5 }} onClick={handleConfirm}>Começar</button>
        <button style={{ background: 'none', border: 'none', color: '#666', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', marginTop: '12px', padding: '8px' }}
          onClick={() => { setOnboarded(true); window.location.href = '/' }}>Pular</button>
      </div>
    )
  }

  return (
    <div style={wrapper}>
      <div style={hero}>
        <div style={badge}>GRÁTIS • FEITO PRA QUEM TÁ NA CADEIRA</div>
        <h1 style={h1}>O app que faz você <span style={accent}>ganhar mais</span> por cliente</h1>
        <p style={heroSub}>Controle seu dinheiro, fidelize clientes, mostre estilos na cadeira e transforme cada atendimento em conteúdo pro Instagram. Tudo em um app feito pra profissional de beleza.</p>
        <button style={ctaBtn} onClick={handleStart}>Usar agora — é grátis</button>
        <div style={ctaHint}>Sem cadastro, sem cartão, funciona offline</div>
      </div>
      <div style={section}>
        <div style={sectionTitle}>Conhece essa realidade?</div>
        {PAINS.map((p, i) => (<div key={i} style={painCard}><div style={painEmoji}>{p.emoji}</div><div style={painTitle}>{p.title}</div><div style={painText}>{p.text}</div></div>))}
      </div>
      <div style={section}>
        <div style={quoteCard}>
          <div style={quoteText}>"Tem barbeiro que passa anos no aperto. Sem cliente, sem dinheiro, contando moeda. O dinheiro entra, mas também sai, e rápido."</div>
          <div style={quoteAuthor}>— Realidade de milhares de profissionais</div>
        </div>
      </div>
      <div style={section}>
        <div style={sectionTitle}>O que o B2 faz por você</div>
        {FEATURES.map((f, i) => (<div key={i} style={featureCard}><div style={featureEmoji}>{f.emoji}</div><div><div style={featureTitle}>{f.title}</div><div style={featureText}>{f.text}</div></div></div>))}
      </div>
      <div style={section}>
        <div style={sectionTitle}>Como funciona</div>
        {[
          { n: '1', title: 'Abre o app', text: 'Vê sua ofensiva, meta do dia e próximos clientes.' },
          { n: '2', title: 'Registra em 2 toques', text: 'Seleciona serviço + valor. Pronto. Barra de progresso atualiza.' },
          { n: '3', title: 'Mostra estilos na cadeira', text: 'Abre o Consultor Visual, filtra por formato de rosto. Cliente escolhe.' },
          { n: '4', title: 'Tira foto antes/depois', text: 'App gera card profissional pronto pra stories em segundos.' },
          { n: '5', title: 'Bate a meta', text: 'Confete! +1 dia na ofensiva. Dorme sabendo exatamente quanto ganhou.' },
        ].map((s, i) => (<div key={i} style={howStep}><div style={howNumber}>{s.n}</div><div><div style={howTitle}>{s.title}</div><div style={howText}>{s.text}</div></div></div>))}
      </div>
      <div style={{ padding: '32px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', lineHeight: 1.3 }}>
          Para de contar moeda.<br /><span style={accent}>Começa a contar clientes.</span>
        </div>
        <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '24px' }}>100% grátis. Sem cadastro. Funciona offline.</div>
        <button style={ctaBtn} onClick={handleStart}>Começar agora</button>
      </div>
      <div style={footer}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: '#FF6B35', marginBottom: '8px' }}>B2</div>
        <div style={{ fontSize: '12px', color: '#666' }}>Feito pra quem tá na cadeira.</div>
      </div>
    </div>
  )
}
