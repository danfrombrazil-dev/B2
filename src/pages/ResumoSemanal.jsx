import { useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { filterByDate, filterLastWeek } from '../utils/gamification'

function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

export default function ResumoSemanal() {
  const navigate = useNavigate()
  const [atendimentos] = useLocalStorage('b2_atendimentos', [])
  const [streakData] = useLocalStorage('b2_streak', null)
  const [nomeUsuario] = useLocalStorage('b2_nome', '')
  const canvasRef = useRef(null)

  const thisWeek = useMemo(() => filterByDate(atendimentos, 'semana'), [atendimentos])
  const lastWeek = useMemo(() => filterLastWeek(atendimentos), [atendimentos])

  const thisStats = useMemo(() => {
    const faturamento = thisWeek.reduce((s, a) => s + (a.valor || 0) + (a.gorjeta || 0), 0)
    const count = thisWeek.length
    const ticketMedio = count > 0 ? faturamento / count : 0
    const clienteSet = new Set(); thisWeek.forEach((a) => { if (a.clienteId) clienteSet.add(a.clienteId); else if (a.cliente) clienteSet.add(a.cliente.toLowerCase()) })
    return { faturamento, count, ticketMedio, novosClientes: clienteSet.size }
  }, [thisWeek])

  const lastStats = useMemo(() => ({ faturamento: lastWeek.reduce((s, a) => s + (a.valor || 0) + (a.gorjeta || 0), 0), count: lastWeek.length }), [lastWeek])

  const faturamentoDiff = lastStats.faturamento > 0 ? ((thisStats.faturamento - lastStats.faturamento) / lastStats.faturamento * 100).toFixed(0) : null
  const countDiff = lastStats.count > 0 ? ((thisStats.count - lastStats.count) / lastStats.count * 100).toFixed(0) : null

  const insights = useMemo(() => {
    const list = []
    const dayMap = {}; const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    atendimentos.forEach((a) => { const d = new Date(a.data + 'T12:00:00').getDay(); if (!dayMap[d]) dayMap[d] = 0; dayMap[d] += (a.valor || 0) + (a.gorjeta || 0) })
    let bestDay = null, bestDayVal = 0; Object.entries(dayMap).forEach(([idx, val]) => { if (val > bestDayVal) { bestDay = dayNames[idx]; bestDayVal = val } })
    if (bestDay) list.push({ emoji: '📅', text: `Seu melhor dia é ${bestDay}. Considere abrir horários extras nesse dia.` })
    const svcMap = {}; thisWeek.forEach((a) => { if (!svcMap[a.servico]) svcMap[a.servico] = 0; svcMap[a.servico] += (a.valor || 0) + (a.gorjeta || 0) })
    let bestSvc = null, bestSvcVal = 0; Object.entries(svcMap).forEach(([nome, val]) => { if (val > bestSvcVal) { bestSvc = nome; bestSvcVal = val } })
    if (bestSvc) list.push({ emoji: '💰', text: `"${bestSvc}" foi o serviço que mais faturou esta semana. Considere destacá-lo nas redes.` })
    if (faturamentoDiff !== null && Number(faturamentoDiff) > 0) list.push({ emoji: '📈', text: `Faturamento cresceu ${faturamentoDiff}% comparado à semana passada. Continue assim!` })
    else if (faturamentoDiff !== null && Number(faturamentoDiff) < 0) list.push({ emoji: '💪', text: `Faturamento caiu ${Math.abs(faturamentoDiff)}% vs semana passada. Que tal reconquistar clientes sumidos?` })
    if (thisStats.ticketMedio < 60) list.push({ emoji: '🎯', text: 'Dica: combos (corte + barba, manicure + pedicure) aumentam o ticket médio em até 25%.' })
    return list
  }, [atendimentos, thisWeek, faturamentoDiff, thisStats.ticketMedio])

  const generateShareCard = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const W = 1080, H = 1080; canvas.width = W; canvas.height = H; const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H)
    const gradient = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, 300); gradient.addColorStop(0, 'rgba(255,107,53,0.2)'); gradient.addColorStop(1, 'transparent'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 28px Space Grotesk, sans-serif'; ctx.fillText('RESUMO DA SEMANA', 60, 80)
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px Sora, sans-serif'; ctx.fillText(nomeUsuario || 'Profissional', 60, 140)
    ctx.fillStyle = '#FF6B35'; ctx.fillRect(60, 170, 100, 4)
    ctx.fillStyle = '#22c55e'; ctx.font = 'bold 72px Space Grotesk, sans-serif'; ctx.fillText(fmt(thisStats.faturamento), 60, 280)
    ctx.fillStyle = '#a0a0a0'; ctx.font = '28px Sora, sans-serif'; ctx.fillText('faturados', 60, 320)
    const sy = 400, c1 = 60, c2 = W / 2 + 30
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 52px Space Grotesk, sans-serif'; ctx.fillText(String(thisStats.count), c1, sy); ctx.fillStyle = '#a0a0a0'; ctx.font = '24px Sora, sans-serif'; ctx.fillText('atendimentos', c1, sy + 36)
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 52px Space Grotesk, sans-serif'; ctx.fillText(String(thisStats.novosClientes), c2, sy); ctx.fillStyle = '#a0a0a0'; ctx.font = '24px Sora, sans-serif'; ctx.fillText('clientes', c2, sy + 36)
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 52px Space Grotesk, sans-serif'; ctx.fillText(fmt(thisStats.ticketMedio), c1, sy + 120); ctx.fillStyle = '#a0a0a0'; ctx.font = '24px Sora, sans-serif'; ctx.fillText('ticket médio', c1, sy + 156)
    ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 52px Space Grotesk, sans-serif'; ctx.fillText(String(streakData?.count || 0) + ' dias', c2, sy + 120); ctx.fillStyle = '#a0a0a0'; ctx.font = '24px Sora, sans-serif'; ctx.fillText('de ofensiva', c2, sy + 156)
    if (faturamentoDiff !== null) { ctx.fillStyle = Number(faturamentoDiff) >= 0 ? '#22c55e' : '#ef4444'; ctx.font = 'bold 32px Space Grotesk, sans-serif'; ctx.fillText(`${Number(faturamentoDiff) >= 0 ? '+' : ''}${faturamentoDiff}% vs semana passada`, 60, sy + 260) }
    ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 24px Space Grotesk, sans-serif'; const ft = 'B2 Pro Beleza'; ctx.fillText(ft, W - ctx.measureText(ft).width - 60, H - 50)
    ctx.fillStyle = '#666'; ctx.font = '20px Sora, sans-serif'; ctx.fillText('Meu app de gestão profissional', 60, H - 50)
    canvas.toBlob((blob) => { if (!blob) return; const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `resumo-semanal-${Date.now()}.png`; a.click(); URL.revokeObjectURL(url) }, 'image/png')
  }, [thisStats, streakData, nomeUsuario, faturamentoDiff])

  const compareBadge = (positive) => ({ padding: '3px 8px', background: positive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: positive ? '#22c55e' : '#ef4444' })

  return (
    <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', padding: '0', marginBottom: '20px' }}>← Voltar</button>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Resumo da Semana</div>
      <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '28px' }}>Seu progresso nos últimos 7 dias.</div>

      <div style={{ background: 'linear-gradient(145deg, #141414, #1a1a1a)', borderRadius: '24px', padding: '28px 24px', border: '1px solid #1e1e1e', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#FF6B35', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>Faturamento semanal</div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '44px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{fmt(thisStats.faturamento)}</div>
        <div style={{ fontSize: '14px', color: '#a0a0a0', marginTop: '4px', marginBottom: '24px' }}>
          {thisStats.count} atendimentos
          {faturamentoDiff !== null && <span style={{ ...compareBadge(Number(faturamentoDiff) >= 0), marginLeft: '10px' }}>{Number(faturamentoDiff) >= 0 ? '+' : ''}{faturamentoDiff}%</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#0e0e0e', borderRadius: '14px', padding: '16px' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{thisStats.count}</div><div style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase' }}>Atendimentos</div>{countDiff !== null && <div style={{ marginTop: '6px' }}><span style={compareBadge(Number(countDiff) >= 0)}>{Number(countDiff) >= 0 ? '+' : ''}{countDiff}%</span></div>}</div>
          <div style={{ background: '#0e0e0e', borderRadius: '14px', padding: '16px' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#FF6B35', lineHeight: 1 }}>{fmt(thisStats.ticketMedio)}</div><div style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase' }}>Ticket médio</div></div>
          <div style={{ background: '#0e0e0e', borderRadius: '14px', padding: '16px' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{thisStats.novosClientes}</div><div style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase' }}>Clientes</div></div>
          <div style={{ background: '#0e0e0e', borderRadius: '14px', padding: '16px' }}><div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#FF6B35', lineHeight: 1 }}>{streakData?.count || 0} dias</div><div style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase' }}>Ofensiva</div></div>
        </div>
      </div>

      {insights.map((ins, i) => (
        <div key={i} style={{ background: '#141414', borderRadius: '16px', padding: '18px 20px', border: '1px solid #1e1e1e', marginBottom: '10px' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>{ins.emoji}</div>
          <div style={{ fontSize: '14px', color: '#d0d0d0', lineHeight: 1.5 }}>{ins.text}</div>
        </div>
      ))}

      <button onClick={generateShareCard} style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #FF6B35, #ff8c42)', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer', boxShadow: '0 4px 24px rgba(255,107,53,0.3)', marginTop: '16px' }}>Baixar card pra stories</button>
      <button onClick={() => navigate('/financeiro')} style={{ width: '100%', padding: '16px', background: 'none', border: '2px solid #1e1e1e', borderRadius: '16px', color: '#a0a0a0', fontSize: '14px', fontWeight: 500, fontFamily: 'Sora, sans-serif', cursor: 'pointer', marginTop: '10px' }}>Ver detalhes financeiros</button>
    </div>
  )
}
