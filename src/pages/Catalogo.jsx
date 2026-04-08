import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIAS, FORMATOS_ROSTO, TONS_PELE, VIBES } from '../data/estilos'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const card = { background: '#141414', borderRadius: '20px', padding: '24px', marginBottom: '16px', border: '1px solid #1e1e1e' }
const FORMATO_LABELS = { oval: 'Oval', redondo: 'Redondo', quadrado: 'Quadrado', retangular: 'Retangular', triangular: 'Triangular', diamante: 'Diamante' }
const TOM_LABELS = { claro: 'Claro', medio: 'Médio', escuro: 'Escuro' }
const VIBE_LABELS = { classico: 'Clássico', moderno: 'Moderno', ousado: 'Ousado', clean: 'Clean / Minimalista' }

export default function Catalogo() {
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState(null)
  const [formato, setFormato] = useState(null)
  const [tom, setTom] = useState(null)
  const [vibe, setVibe] = useState(null)
  const canSearch = categoria !== null

  function handleSearch() {
    if (!canSearch) return
    const params = new URLSearchParams()
    params.set('cat', categoria)
    if (formato) params.set('formato', formato)
    if (tom) params.set('tom', tom)
    if (vibe) params.set('vibe', vibe)
    navigate('/catalogo/resultado?' + params.toString())
  }

  const optionChip = (selected) => ({ padding: '12px 10px', background: selected ? 'rgba(255,107,53,0.15)' : '#1a1a1a', border: selected ? '2px solid #FF6B35' : '2px solid transparent', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontSize: '13px', fontWeight: selected ? 600 : 400, color: selected ? '#FF6B35' : '#ffffff', fontFamily: 'Sora, sans-serif' })

  return (
    <div style={page}>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Consultor Visual</div>
      <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '28px', lineHeight: 1.5 }}>Responda sobre o cliente e veja os estilos ideais. Use na cadeira pra mostrar as opções.</div>

      <div style={card}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#FF6B35', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Passo 1</div>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Que tipo de serviço?</div>
        {CATEGORIAS.map((cat) => (
          <div key={cat.id} onClick={() => setCategoria(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: categoria === cat.id ? 'rgba(255,107,53,0.12)' : '#1a1a1a', border: categoria === cat.id ? '2px solid #FF6B35' : '2px solid transparent', borderRadius: '14px', cursor: 'pointer', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>{cat.emoji}</span>
            <span style={{ fontSize: '14px', fontWeight: categoria === cat.id ? 600 : 500, color: categoria === cat.id ? '#FF6B35' : '#ffffff' }}>{cat.nome}</span>
          </div>
        ))}
      </div>

      {categoria && (
        <div style={card}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#FF6B35', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Passo 2 (opcional)</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Formato do rosto do cliente?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {FORMATOS_ROSTO.map((f) => (<div key={f} style={optionChip(formato === f)} onClick={() => setFormato(formato === f ? null : f)}>{FORMATO_LABELS[f]}</div>))}
          </div>
        </div>
      )}

      {categoria && (
        <div style={card}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#FF6B35', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Passo 3 (opcional)</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Tom de pele?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {TONS_PELE.map((t) => (<div key={t} style={optionChip(tom === t)} onClick={() => setTom(tom === t ? null : t)}>{TOM_LABELS[t]}</div>))}
          </div>
        </div>
      )}

      {categoria && (
        <div style={card}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#FF6B35', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>Passo 4 (opcional)</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Qual a vibe do cliente?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {VIBES.map((v) => (<div key={v} style={optionChip(vibe === v)} onClick={() => setVibe(vibe === v ? null : v)}>{VIBE_LABELS[v]}</div>))}
          </div>
        </div>
      )}

      <button onClick={handleSearch} disabled={!canSearch} style={{ width: '100%', padding: '18px', background: canSearch ? 'linear-gradient(135deg, #FF6B35, #ff8c42)' : '#1e1e1e', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: canSearch ? 'pointer' : 'not-allowed', boxShadow: canSearch ? '0 4px 24px rgba(255,107,53,0.3)' : 'none', opacity: canSearch ? 1 : 0.4, marginTop: '8px' }}>Ver estilos recomendados</button>
      <div style={{ textAlign: 'center', padding: '16px 0', color: '#666', fontSize: '13px' }}>ou</div>
      <button onClick={() => navigate('/catalogo/resultado')} style={{ width: '100%', padding: '16px', background: 'none', border: '2px solid #1e1e1e', borderRadius: '16px', color: '#a0a0a0', fontSize: '14px', fontWeight: 500, fontFamily: 'Sora, sans-serif', cursor: 'pointer' }}>Explorar todos os estilos</button>
    </div>
  )
}
