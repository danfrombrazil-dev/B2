import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { today } from '../utils/gamification'

const SERVICOS_PADRAO = [
  { nome: 'Corte', valor: 45 }, { nome: 'Barba', valor: 30 }, { nome: 'Corte + Barba', valor: 65 },
  { nome: 'Degradê', valor: 50 }, { nome: 'Coloração', valor: 80 }, { nome: 'Escova', valor: 40 },
  { nome: 'Hidratação', valor: 60 }, { nome: 'Manicure', valor: 35 }, { nome: 'Pedicure', valor: 40 },
  { nome: 'Sobrancelha', valor: 20 }, { nome: 'Outro', valor: 0 },
]

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const title = { fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }
const subtitle = { fontSize: '14px', color: '#a0a0a0', marginBottom: '28px' }
const sectionLabel = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }
const grid = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '28px' }
const chipStyle = (sel) => ({ padding: '14px 12px', background: sel ? 'rgba(255,107,53,0.15)' : '#141414', border: sel ? '2px solid #FF6B35' : '2px solid #1e1e1e', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' })
const chipNome = (sel) => ({ fontSize: '14px', fontWeight: sel ? 600 : 500, color: sel ? '#FF6B35' : '#ffffff' })
const chipValor = { fontSize: '12px', color: '#a0a0a0', marginTop: '2px', fontFamily: 'Space Grotesk, sans-serif' }
const label = { display: 'block', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' }
const inputStyle = { width: '100%', padding: '14px 16px', background: '#141414', border: '2px solid #1e1e1e', borderRadius: '14px', color: '#ffffff', fontSize: '18px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, outline: 'none', WebkitAppearance: 'none', transition: 'border-color 0.2s' }
const rowInputs = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }
const btnSalvar = { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #FF6B35, #ff8c42)', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer', boxShadow: '0 4px 24px rgba(255,107,53,0.3)' }
const btnDisabled = { ...btnSalvar, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' }
const clienteInputStyle = { width: '100%', padding: '14px 16px', background: '#141414', border: '2px solid #1e1e1e', borderRadius: '14px', color: '#ffffff', fontSize: '14px', fontFamily: 'Sora, sans-serif', outline: 'none', transition: 'border-color 0.2s' }
const suggestionsBox = { background: '#1a1a1a', borderRadius: '12px', border: '1px solid #2a2a2a', marginTop: '4px', overflow: 'hidden' }
const suggestionItem = { padding: '12px 16px', cursor: 'pointer', fontSize: '14px', color: '#ffffff', borderBottom: '1px solid #1e1e1e' }
const selectedClientBadge = { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '10px', fontSize: '13px', color: '#FF6B35', fontWeight: 500, marginTop: '8px' }
const successOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,10,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'b2-fadeIn 0.3s ease' }
const fadeIn = `@keyframes b2-fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`
function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

export default function NovoAtendimento() {
  const navigate = useNavigate()
  const [atendimentos, setAtendimentos] = useLocalStorage('b2_atendimentos', [])
  const [clientes] = useLocalStorage('b2_clientes', [])
  const [selected, setSelected] = useState(null)
  const [valorCustom, setValorCustom] = useState('')
  const [gorjeta, setGorjeta] = useState('')
  const [clienteText, setClienteText] = useState('')
  const [clienteId, setClienteId] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [focused, setFocused] = useState(null)

  const servicoObj = selected !== null ? SERVICOS_PADRAO[selected] : null
  const valorFinal = servicoObj ? (servicoObj.valor > 0 ? (valorCustom !== '' ? parseFloat(valorCustom) || 0 : servicoObj.valor) : parseFloat(valorCustom) || 0) : 0
  const gorjetaFinal = parseFloat(gorjeta) || 0
  const total = valorFinal + gorjetaFinal
  const canSave = selected !== null && valorFinal > 0

  const suggestions = useMemo(() => {
    if (!clienteText.trim() || clienteId) return []
    const q = clienteText.toLowerCase().trim()
    return clientes.filter((c) => c.nome.toLowerCase().includes(q)).slice(0, 5)
  }, [clienteText, clienteId, clientes])

  function selectCliente(c) { setClienteId(c.id); setClienteText(c.nome); setShowSuggestions(false) }
  function clearCliente() { setClienteId(null); setClienteText('') }

  function handleSave() {
    if (!canSave) return
    const now = new Date()
    const novo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      servico: servicoObj.nome, valor: valorFinal, gorjeta: gorjetaFinal,
      cliente: clienteText.trim() || null, clienteId: clienteId || null,
      data: today(), hora: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      timestamp: now.toISOString(),
    }
    setAtendimentos([...atendimentos, novo])
    setShowSuccess(true)
    setTimeout(() => { setShowSuccess(false); navigate('/') }, 1500)
  }

  const border = (name) => focused === name ? '#FF6B35' : '#1e1e1e'

  return (
    <div style={page}>
      <style>{fadeIn}</style>
      <div style={title}>Novo atendimento</div>
      <div style={subtitle}>Selecione o serviço e registre em segundos.</div>
      <div style={sectionLabel}>Serviço</div>
      <div style={grid}>
        {SERVICOS_PADRAO.map((s, i) => (
          <div key={s.nome} style={chipStyle(selected === i)} onClick={() => { setSelected(i); if (s.valor > 0) setValorCustom('') }}>
            <div style={chipNome(selected === i)}>{s.nome}</div>
            {s.valor > 0 && <div style={chipValor}>{fmt(s.valor)}</div>}
          </div>
        ))}
      </div>
      <div style={rowInputs}>
        <div>
          <label style={label}>Valor (R$)</label>
          <input type="number" inputMode="decimal" placeholder={servicoObj?.valor > 0 ? String(servicoObj.valor) : '0'} value={valorCustom} onChange={(e) => setValorCustom(e.target.value)} onFocus={() => setFocused('valor')} onBlur={() => setFocused(null)} style={{ ...inputStyle, borderColor: border('valor') }} />
        </div>
        <div>
          <label style={label}>Gorjeta (R$)</label>
          <input type="number" inputMode="decimal" placeholder="0" value={gorjeta} onChange={(e) => setGorjeta(e.target.value)} onFocus={() => setFocused('gorjeta')} onBlur={() => setFocused(null)} style={{ ...inputStyle, borderColor: border('gorjeta') }} />
        </div>
      </div>
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <label style={label}>Cliente (opcional)</label>
        {clienteId ? (
          <div style={selectedClientBadge}><span>{clienteText}</span><button style={{ background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer', fontSize: '16px', padding: '0 0 0 4px' }} onClick={clearCliente}>×</button></div>
        ) : (
          <>
            <input type="text" placeholder="Nome do cliente" value={clienteText} onChange={(e) => { setClienteText(e.target.value); setShowSuggestions(true) }} onFocus={() => { setFocused('cliente'); setShowSuggestions(true) }} onBlur={() => { setFocused(null); setTimeout(() => setShowSuggestions(false), 200) }} style={{ ...clienteInputStyle, borderColor: border('cliente') }} />
            {showSuggestions && suggestions.length > 0 && (
              <div style={suggestionsBox}>{suggestions.map((c) => (<div key={c.id} style={suggestionItem} onMouseDown={() => selectCliente(c)}>{c.nome}{c.preferencias && <span style={{ fontSize: '11px', color: '#666', marginLeft: '8px' }}>{c.preferencias}</span>}</div>))}</div>
            )}
          </>
        )}
      </div>
      {canSave && (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '16px', background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e' }}>
          <div style={{ fontSize: '12px', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Total</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{fmt(total)}</div>
        </div>
      )}
      <button style={canSave ? btnSalvar : btnDisabled} onClick={handleSave} disabled={!canSave}>Registrar atendimento</button>
      {showSuccess && (<div style={successOverlay}><div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div><div style={{ fontFamily: 'Sora, sans-serif', fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Registrado!</div><div style={{ fontSize: '14px', color: '#a0a0a0' }}>{fmt(total)} — {servicoObj.nome}</div></div>)}
    </div>
  )
}
