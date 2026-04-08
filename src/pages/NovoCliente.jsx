import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { today } from '../utils/gamification'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const inputStyle = { width: '100%', padding: '14px 16px', background: '#141414', border: '2px solid #1e1e1e', borderRadius: '14px', color: '#ffffff', fontSize: '15px', fontFamily: 'Sora, sans-serif', outline: 'none', transition: 'border-color 0.2s' }
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical', lineHeight: 1.5 }
const label = { display: 'block', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' }
const hintText = { fontSize: '11px', color: '#666', marginTop: '6px' }
const btnSalvar = { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #FF6B35, #ff8c42)', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer', boxShadow: '0 4px 24px rgba(255,107,53,0.3)', marginTop: '12px' }
const btnDisabled = { ...btnSalvar, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' }

export default function NovoCliente() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useLocalStorage('b2_clientes', [])
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [aniversario, setAniversario] = useState('')
  const [preferencias, setPreferencias] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [focused, setFocused] = useState(null)
  const canSave = nome.trim().length >= 2

  function handleSave() {
    if (!canSave) return
    const novo = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nome: nome.trim(), telefone: telefone.trim() || null, aniversario: aniversario || null, preferencias: preferencias.trim() || null, observacoes: observacoes.trim() || null, criadoEm: today() }
    setClientes([...clientes, novo])
    navigate('/clientes/' + novo.id)
  }

  const getStyle = (name, base = inputStyle) => ({ ...base, borderColor: focused === name ? '#FF6B35' : '#1e1e1e' })

  return (
    <div style={page}>
      <button onClick={() => navigate('/clientes')} style={{ background: 'none', border: 'none', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', padding: '0', marginBottom: '20px' }}>← Voltar</button>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Novo cliente</div>
      <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '28px' }}>Cadastre e nunca mais esqueça um detalhe.</div>
      <div style={{ marginBottom: '20px' }}><label style={label}>Nome *</label><input type="text" placeholder="Nome do cliente" value={nome} onChange={(e) => setNome(e.target.value)} onFocus={() => setFocused('nome')} onBlur={() => setFocused(null)} style={getStyle('nome')} /></div>
      <div style={{ marginBottom: '20px' }}><label style={label}>Telefone / WhatsApp</label><input type="tel" inputMode="tel" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} onFocus={() => setFocused('tel')} onBlur={() => setFocused(null)} style={getStyle('tel')} /><div style={hintText}>Para enviar mensagem de reconquista pelo WhatsApp</div></div>
      <div style={{ marginBottom: '20px' }}><label style={label}>Aniversário</label><input type="date" value={aniversario} onChange={(e) => setAniversario(e.target.value)} onFocus={() => setFocused('aniv')} onBlur={() => setFocused(null)} style={{ ...getStyle('aniv'), colorScheme: 'dark' }} /><div style={hintText}>Para surpreender com desconto ou cortesia</div></div>
      <div style={{ marginBottom: '20px' }}><label style={label}>Preferências</label><input type="text" placeholder="Ex: degradê com navalha, sem gel, barba curta" value={preferencias} onChange={(e) => setPreferencias(e.target.value)} onFocus={() => setFocused('pref')} onBlur={() => setFocused(null)} style={getStyle('pref')} /><div style={hintText}>O que ele sempre pede</div></div>
      <div style={{ marginBottom: '20px' }}><label style={label}>Observações pessoais</label><textarea placeholder="Ex: torce pro Corinthians, alergia a produto X, tem filho pequeno..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} onFocus={() => setFocused('obs')} onBlur={() => setFocused(null)} style={getStyle('obs', textareaStyle)} /><div style={hintText}>Detalhes que fazem o cliente se sentir especial</div></div>
      <button style={canSave ? btnSalvar : btnDisabled} onClick={handleSave} disabled={!canSave}>Salvar cliente</button>
    </div>
  )
}
