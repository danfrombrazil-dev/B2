import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ESTILOS, { CATEGORIAS } from '../data/estilos'

function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
const FORMATO_LABELS = { oval: 'Oval', redondo: 'Redondo', quadrado: 'Quadrado', retangular: 'Retangular', triangular: 'Triangular', diamante: 'Diamante' }
const TOM_LABELS = { claro: 'Claro', medio: 'Médio', escuro: 'Escuro' }
const VIBE_LABELS = { classico: 'Clássico', moderno: 'Moderno', ousado: 'Ousado', clean: 'Clean' }

export default function CatalogoResultado() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [expandedId, setExpandedId] = useState(null)
  const cat = searchParams.get('cat')
  const formato = searchParams.get('formato')
  const tom = searchParams.get('tom')
  const vibe = searchParams.get('vibe')
  const hasFilters = cat || formato || tom || vibe

  const results = useMemo(() => {
    let list = [...ESTILOS]
    if (cat) list = list.filter((e) => e.categoria === cat)
    list = list.map((e) => {
      let score = 0, maxScore = 0
      if (formato) { maxScore += 1; if (e.formatos.includes(formato)) score += 1 }
      if (tom) { maxScore += 1; if (e.tons.includes(tom)) score += 1 }
      if (vibe) { maxScore += 1; if (e.vibe === vibe) score += 1 }
      const matchPercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : null
      return { ...e, matchPercent, score }
    })
    if (hasFilters && (formato || tom || vibe)) list = list.filter((e) => e.matchPercent === null || e.matchPercent >= 50)
    list.sort((a, b) => { if (a.matchPercent !== null && b.matchPercent !== null) return b.matchPercent - a.matchPercent; if (a.matchPercent !== null) return -1; if (b.matchPercent !== null) return 1; return a.nome.localeCompare(b.nome) })
    return list
  }, [cat, formato, tom, vibe, hasFilters])

  const catObj = CATEGORIAS.find((c) => c.id === cat)

  return (
    <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => navigate('/catalogo')} style={{ background: 'none', border: 'none', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', padding: '0', marginBottom: '20px' }}>← Voltar</button>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>{catObj ? catObj.emoji + ' ' + catObj.nome : 'Todos os Estilos'}</div>
      <div style={{ fontSize: '13px', color: '#a0a0a0', marginBottom: '20px' }}>{results.length} estilo{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}</div>

      {hasFilters && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {cat && catObj && <span style={{ padding: '6px 12px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '20px', fontSize: '11px', color: '#FF6B35', fontWeight: 500 }}>{catObj.nome}</span>}
          {formato && <span style={{ padding: '6px 12px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '20px', fontSize: '11px', color: '#FF6B35', fontWeight: 500 }}>Rosto {FORMATO_LABELS[formato]}</span>}
          {tom && <span style={{ padding: '6px 12px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '20px', fontSize: '11px', color: '#FF6B35', fontWeight: 500 }}>Pele {TOM_LABELS[tom]}</span>}
          {vibe && <span style={{ padding: '6px 12px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '20px', fontSize: '11px', color: '#FF6B35', fontWeight: 500 }}>{VIBE_LABELS[vibe]}</span>}
        </div>
      )}

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#666', fontSize: '14px', lineHeight: 1.6 }}>Nenhum estilo encontrado com esses filtros.<br />Tente remover algum filtro.</div>
      ) : results.map((e) => {
        const expanded = expandedId === e.id
        return (
          <div key={e.id} onClick={() => setExpandedId(expanded ? null : e.id)} style={{ background: '#141414', borderRadius: '20px', border: `1px solid ${expanded ? '#FF6B35' : '#1e1e1e'}`, marginBottom: '14px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
              <div style={{ fontSize: '36px', width: '56px', height: '56px', background: '#1a1a1a', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{e.emoji}</div>
              <div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>{e.nome}</div>
                <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px', display: 'flex', gap: '12px' }}>
                  <span>{e.tempoMin}min</span><span>{fmt(e.ticketSugerido)}</span>
                </div>
              </div>
              {e.matchPercent !== null && e.matchPercent >= 80 && <div style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', fontSize: '11px', color: '#22c55e', fontWeight: 600, marginLeft: 'auto', flexShrink: 0 }}>{e.matchPercent}% match</div>}
            </div>
            {expanded && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '14px', color: '#d0d0d0', lineHeight: 1.6, marginTop: '16px', marginBottom: '12px' }}>{e.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0', background: '#1a1a1a', borderRadius: '12px', marginBottom: '14px' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>{fmt(e.ticketSugerido)}</div><div style={{ fontSize: '10px', color: '#a0a0a0', textTransform: 'uppercase', marginTop: '2px' }}>Ticket</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>{e.tempoMin}min</div><div style={{ fontSize: '10px', color: '#a0a0a0', textTransform: 'uppercase', marginTop: '2px' }}>Tempo</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ffffff', letterSpacing: '2px' }}>{'●'.repeat(e.dificuldade) + '○'.repeat(4 - e.dificuldade)}</div><div style={{ fontSize: '10px', color: '#a0a0a0', textTransform: 'uppercase', marginTop: '2px' }}>Dificuldade</div></div>
                </div>
                <div style={{ padding: '14px 16px', background: 'rgba(255,107,53,0.08)', borderRadius: '12px', border: '1px solid rgba(255,107,53,0.15)', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#FF6B35', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Dica profissional</div>
                  <div style={{ fontSize: '13px', color: '#d0d0d0', lineHeight: 1.5 }}>{e.dica}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{e.tags.map((t) => (<span key={t} style={{ padding: '4px 10px', background: '#1a1a1a', borderRadius: '8px', fontSize: '11px', color: '#a0a0a0' }}>#{t}</span>))}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
