import { useState, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { filterByDate } from '../utils/gamification'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const title = { fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }
const tabRow = { display: 'flex', gap: '4px', background: '#141414', borderRadius: '14px', padding: '4px', marginBottom: '24px' }
const tabBtn = (active) => ({ flex: 1, padding: '10px', background: active ? '#FF6B35' : 'transparent', border: 'none', borderRadius: '10px', color: active ? '#ffffff' : '#a0a0a0', fontSize: '13px', fontWeight: active ? 600 : 400, fontFamily: 'Sora, sans-serif', cursor: 'pointer', transition: 'all 0.2s' })
const card = { background: '#141414', borderRadius: '20px', padding: '24px', marginBottom: '16px', border: '1px solid #1e1e1e' }
const cardTitle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }
const bigNumber = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', fontWeight: 700, color: '#22c55e', lineHeight: 1 }
const statsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }
const statCard = { background: '#1a1a1a', borderRadius: '14px', padding: '16px' }
const statValue = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }
const statLabel = { fontSize: '11px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }
const emptyState = { textAlign: 'center', padding: '48px 16px', color: '#666', fontSize: '14px' }
function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

export default function Financeiro() {
  const [atendimentos] = useLocalStorage('b2_atendimentos', [])
  const [period, setPeriod] = useState('dia')
  const filtered = useMemo(() => filterByDate(atendimentos, period), [atendimentos, period])

  const stats = useMemo(() => {
    const faturamento = filtered.reduce((s, a) => s + (a.valor || 0), 0)
    const gorjetas = filtered.reduce((s, a) => s + (a.gorjeta || 0), 0)
    const total = faturamento + gorjetas
    const count = filtered.length
    const ticketMedio = count > 0 ? total / count : 0
    const diasUnicos = new Set(filtered.map((a) => a.data)).size
    const horasEstimadas = diasUnicos * 8
    const valorHora = horasEstimadas > 0 ? total / horasEstimadas : 0
    const servicoMap = {}
    filtered.forEach((a) => { if (!servicoMap[a.servico]) servicoMap[a.servico] = { count: 0, total: 0 }; servicoMap[a.servico].count += 1; servicoMap[a.servico].total += (a.valor || 0) + (a.gorjeta || 0) })
    const ranking = Object.entries(servicoMap).map(([nome, data]) => ({ nome, ...data })).sort((a, b) => b.total - a.total)
    return { faturamento, gorjetas, total, count, ticketMedio, valorHora, ranking }
  }, [filtered])

  return (
    <div style={page}>
      <div style={title}>Meu dinheiro</div>
      <div style={tabRow}>
        {['dia', 'semana', 'mes'].map((p) => (<button key={p} style={tabBtn(period === p)} onClick={() => setPeriod(p)}>{p === 'dia' ? 'Hoje' : p === 'semana' ? 'Semana' : 'Mês'}</button>))}
      </div>
      {filtered.length === 0 ? (<div style={emptyState}>Nenhum atendimento neste período.</div>) : (
        <>
          <div style={card}>
            <div style={cardTitle}>Faturamento total</div>
            <div style={bigNumber}>{fmt(stats.total)}</div>
            {stats.gorjetas > 0 && <div style={{ fontSize: '13px', color: '#a0a0a0', marginTop: '6px' }}>incluindo {fmt(stats.gorjetas)} em gorjetas</div>}
          </div>
          <div style={statsGrid}>
            <div style={statCard}><div style={statValue}>{stats.count}</div><div style={statLabel}>Atendimentos</div></div>
            <div style={statCard}><div style={statValue}>{fmt(stats.ticketMedio)}</div><div style={statLabel}>Ticket médio</div></div>
            <div style={statCard}><div style={statValue}>{fmt(stats.valorHora)}</div><div style={statLabel}>Valor / hora</div></div>
            <div style={statCard}><div style={{ ...statValue, color: '#FF6B35' }}>{fmt(stats.gorjetas)}</div><div style={statLabel}>Gorjetas</div></div>
          </div>
          {stats.ranking.length > 0 && (
            <div style={card}>
              <div style={cardTitle}>Serviços que mais faturam</div>
              {stats.ranking.map((s, i) => (
                <div key={s.nome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === stats.ranking.length - 1 ? 'none' : '1px solid #1e1e1e' }}>
                  <div><div style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>{s.nome}</div><div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '2px' }}>{s.count}x</div></div>
                  <div><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 600, color: '#22c55e', textAlign: 'right' }}>{fmt(s.total)}</div><div style={{ fontSize: '11px', color: '#a0a0a0', textAlign: 'right', marginTop: '2px' }}>{((s.total / stats.total) * 100).toFixed(0)}%</div></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
