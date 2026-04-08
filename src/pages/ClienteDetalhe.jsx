import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { today } from '../utils/gamification'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const AVATAR_COLORS = ['#FF6B35', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
function getAvatarColor(name) { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length] }
function getInitials(name) { return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') }
function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function daysSince(dateStr) { if (!dateStr) return Infinity; const then = new Date(dateStr + 'T00:00:00'); const now = new Date(today() + 'T00:00:00'); return Math.floor((now - then) / (1000 * 60 * 60 * 24)) }
function formatDate(dateStr) { if (!dateStr) return '—'; const [y, m, d] = dateStr.split('-'); return `${d}/${m}/${y}` }
function isBirthdaySoon(aniversario) { if (!aniversario) return false; const now = new Date(); const [, m, d] = aniversario.split('-').map(Number); const thisYear = new Date(now.getFullYear(), m - 1, d); const diff = Math.floor((thisYear - now) / (1000 * 60 * 60 * 24)); return diff >= 0 && diff <= 7 }

function getWhatsAppMessages(cliente) {
  const nome = cliente.nome.split(' ')[0]
  return [
    { label: 'Saudade', text: `Fala ${nome}! Tudo bem? Faz um tempo que você não aparece, tô com a agenda aberta essa semana. Bora marcar? 😄` },
    { label: 'Promoção', text: `E aí ${nome}! Essa semana tô com condição especial pra clientes VIP como você. Manda mensagem pra garantir seu horário! 🔥` },
    { label: 'Aniversário', text: `Parabéns ${nome}! 🎉 Como presente, seu próximo atendimento tem desconto especial. Vem comemorar com estilo!` },
    { label: 'Casual', text: `Salve ${nome}! Tudo certo? Só passando pra avisar que tenho horários essa semana. Se precisar, é só chamar! ✌️` },
  ]
}

function openWhatsApp(phone, message) {
  const cleaned = phone.replace(/\D/g, '')
  const number = cleaned.startsWith('55') ? cleaned : '55' + cleaned
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
}

export default function ClienteDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clientes, setClientes] = useLocalStorage('b2_clientes', [])
  const [atendimentos] = useLocalStorage('b2_atendimentos', [])
  const [showWhatsApp, setShowWhatsApp] = useState(false)

  const cliente = clientes.find((c) => c.id === id)

  const clienteAtendimentos = useMemo(() => {
    if (!cliente) return []
    return atendimentos
      .filter((a) => a.clienteId === cliente.id || (a.cliente && a.cliente.toLowerCase() === cliente.nome.toLowerCase()))
      .sort((a, b) => (b.timestamp || b.data).localeCompare(a.timestamp || a.data))
  }, [cliente, atendimentos])

  if (!cliente) {
    return (<div style={page}><button onClick={() => navigate('/clientes')} style={{ background: 'none', border: 'none', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', padding: '0', marginBottom: '20px' }}>← Voltar</button><div style={{ textAlign: 'center', padding: '24px', color: '#666', fontSize: '13px' }}>Cliente não encontrado.</div></div>)
  }

  const totalGasto = clienteAtendimentos.reduce((s, a) => s + (a.valor || 0) + (a.gorjeta || 0), 0)
  const ticketMedio = clienteAtendimentos.length > 0 ? totalGasto / clienteAtendimentos.length : 0
  const lastVisit = clienteAtendimentos.length > 0 ? clienteAtendimentos[0].data : null
  const dias = daysSince(lastVisit || cliente.criadoEm)
  const birthdaySoon = isBirthdaySoon(cliente.aniversario)
  const messages = getWhatsAppMessages(cliente)

  function handleDelete() {
    if (window.confirm(`Remover ${cliente.nome} da sua clientela?`)) {
      setClientes(clientes.filter((c) => c.id !== id))
      navigate('/clientes')
    }
  }

  return (
    <div style={page}>
      <button onClick={() => navigate('/clientes')} style={{ background: 'none', border: 'none', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', padding: '0', marginBottom: '24px' }}>← Voltar</button>

      {/* Profile */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: getAvatarColor(cliente.nome), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff', marginBottom: '12px' }}>{getInitials(cliente.nome)}</div>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>{cliente.nome}</div>
        <div style={{ fontSize: '13px', color: '#a0a0a0', marginTop: '4px' }}>Cliente desde {formatDate(cliente.criadoEm)}</div>
        {dias >= 30 && <div style={{ marginTop: '12px', padding: '10px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: '#ef4444', fontWeight: 500, textAlign: 'center' }}>⚠️ Não aparece há {dias} dias — hora de reconquistar!</div>}
        {birthdaySoon && <div style={{ marginTop: '8px', padding: '10px 16px', background: 'rgba(234,179,8,0.1)', borderRadius: '10px', border: '1px solid rgba(234,179,8,0.3)', fontSize: '13px', color: '#eab308', fontWeight: 500, textAlign: 'center' }}>🎂 Aniversário nos próximos 7 dias!</div>}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button onClick={() => { if (cliente.telefone) setShowWhatsApp(true); else alert('Este cliente não tem telefone cadastrado.') }} style={{ flex: 1, padding: '14px 12px', background: '#25D366', border: 'none', borderRadius: '14px', color: '#ffffff', fontSize: '13px', fontWeight: 600, fontFamily: 'Sora, sans-serif', cursor: 'pointer', textAlign: 'center' }}>💬 WhatsApp</button>
        <button onClick={() => navigate('/novo')} style={{ flex: 1, padding: '14px 12px', background: '#FF6B35', border: 'none', borderRadius: '14px', color: '#ffffff', fontSize: '13px', fontWeight: 600, fontFamily: 'Sora, sans-serif', cursor: 'pointer', textAlign: 'center' }}>✂️ Registrar</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{clienteAtendimentos.length}</div><div style={{ fontSize: '10px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visitas</div></div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>{fmt(totalGasto)}</div><div style={{ fontSize: '10px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div></div>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: '#FF6B35', lineHeight: 1 }}>{fmt(ticketMedio)}</div><div style={{ fontSize: '10px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ticket médio</div></div>
      </div>

      {/* Info */}
      <div style={{ background: '#141414', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid #1e1e1e' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Informações</div>
        {cliente.telefone && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}><span style={{ fontSize: '13px', color: '#a0a0a0' }}>Telefone</span><span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500 }}>{cliente.telefone}</span></div>}
        {cliente.aniversario && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}><span style={{ fontSize: '13px', color: '#a0a0a0' }}>Aniversário</span><span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500 }}>{formatDate(cliente.aniversario)}</span></div>}
        {cliente.preferencias && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}><span style={{ fontSize: '13px', color: '#a0a0a0' }}>Preferências</span><span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{cliente.preferencias}</span></div>}
        {cliente.observacoes && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><span style={{ fontSize: '13px', color: '#a0a0a0' }}>Observações</span><span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{cliente.observacoes}</span></div>}
      </div>

      {/* Histórico */}
      <div style={{ background: '#141414', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid #1e1e1e' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Histórico de atendimentos</div>
        {clienteAtendimentos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#666', fontSize: '13px' }}>Nenhum atendimento registrado.</div>
        ) : clienteAtendimentos.map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === clienteAtendimentos.length - 1 ? 'none' : '1px solid #1a1a1a' }}>
            <div><div style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>{a.servico}</div><div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{formatDate(a.data)} às {a.hora}</div></div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>{fmt((a.valor || 0) + (a.gorjeta || 0))}</div>
          </div>
        ))}
      </div>

      {/* Delete */}
      <button onClick={handleDelete} style={{ width: '100%', padding: '14px', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', color: '#ef4444', fontSize: '14px', fontWeight: 500, fontFamily: 'Sora, sans-serif', cursor: 'pointer', marginTop: '8px' }}>Remover cliente</button>

      {/* WhatsApp overlay */}
      {showWhatsApp && (
        <div onClick={() => setShowWhatsApp(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,10,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#141414', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid #1e1e1e' }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', textAlign: 'center' }}>Mensagem pronta</div>
            {messages.map((msg) => (
              <div key={msg.label} onClick={() => { openWhatsApp(cliente.telefone, msg.text); setShowWhatsApp(false) }} style={{ padding: '14px 16px', background: '#1a1a1a', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', fontSize: '13px', color: '#ffffff', lineHeight: 1.5, border: '1px solid #2a2a2a' }}>
                <strong>{msg.label}:</strong><br />{msg.text}
              </div>
            ))}
            <button onClick={() => setShowWhatsApp(false)} style={{ marginTop: '12px', padding: '12px', background: 'none', border: '1px solid #333', borderRadius: '12px', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', width: '100%' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
