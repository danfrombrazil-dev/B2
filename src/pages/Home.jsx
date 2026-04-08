import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { calcStreak, calcDailyProgress, calcLevel, filterByDate, today } from '../utils/gamification'
import ProgressBar from '../components/ProgressBar'
import ConfettiExplosion from '../components/ConfettiExplosion'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }
const greeting = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#a0a0a0', fontWeight: 400 }
const nameStyle = { fontFamily: 'Sora, sans-serif', fontSize: '24px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }
const streakBadge = { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1a1a1a', borderRadius: '16px', padding: '10px 16px', border: '1px solid #2a2a2a' }
const streakNumber = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 700, color: '#FF6B35', lineHeight: 1 }
const streakLabel = { fontSize: '10px', color: '#a0a0a0', fontWeight: 500, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }
const card = { background: '#141414', borderRadius: '20px', padding: '24px', marginBottom: '16px', border: '1px solid #1e1e1e' }
const cardTitle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }
const bigNumber = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '40px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }
const subText = { fontSize: '13px', color: '#a0a0a0', marginTop: '4px' }
const metaRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }
const exceededBanner = { marginTop: '16px', padding: '12px 16px', background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,140,66,0.08))', borderRadius: '12px', border: '1px solid rgba(255,107,53,0.3)', textAlign: 'center' }
const exceededText = { fontSize: '14px', fontWeight: 600, color: '#FF6B35' }
const todayList = { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }
const todayItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1a1a1a', borderRadius: '12px' }
const todayService = { fontSize: '14px', fontWeight: 500, color: '#ffffff' }
const todayValue = { fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 600, color: '#22c55e' }
const todayTime = { fontSize: '11px', color: '#666', marginTop: '2px' }
const emptyState = { textAlign: 'center', padding: '32px 16px', color: '#666', fontSize: '14px' }
const levelRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }
const levelName = { fontSize: '16px', fontWeight: 600, color: '#FF6B35' }
const levelNext = { fontSize: '12px', color: '#666' }

function getGreeting() { const h = new Date().getHours(); if (h < 12) return 'Bom dia'; if (h < 18) return 'Boa tarde'; return 'Boa noite' }
function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

export default function Home() {
  const navigate = useNavigate()
  const [atendimentos] = useLocalStorage('b2_atendimentos', [])
  const [streakData, setStreakData] = useLocalStorage('b2_streak', null)
  const [metaDiaria] = useLocalStorage('b2_meta_diaria', 480)
  const [nomeUsuario] = useLocalStorage('b2_nome', '')

  const todayAtendimentos = useMemo(() => filterByDate(atendimentos, 'dia'), [atendimentos])
  const currentStreak = useMemo(() => {
    const updated = calcStreak(streakData, todayAtendimentos.length)
    if (JSON.stringify(updated) !== JSON.stringify(streakData)) setStreakData(updated)
    return updated
  }, [streakData, todayAtendimentos.length])
  const daily = useMemo(() => calcDailyProgress(todayAtendimentos, metaDiaria), [todayAtendimentos, metaDiaria])
  const totalRevenue = useMemo(() => atendimentos.reduce((s, a) => s + (a.valor || 0) + (a.gorjeta || 0), 0), [atendimentos])
  const levelInfo = useMemo(() => calcLevel(totalRevenue), [totalRevenue])
  const showConfetti = daily.percent >= 100

  return (
    <div style={page}>
      <ConfettiExplosion trigger={showConfetti} />
      <div style={header}>
        <div>
          <div style={greeting}>{getGreeting()}</div>
          <div style={nameStyle}>{nomeUsuario || 'Profissional'}</div>
        </div>
        <div style={streakBadge}>
          <span style={streakNumber}>{currentStreak?.count || 0}</span>
          <span style={streakLabel}>dias</span>
          {currentStreak?.shields > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '12px', color: '#a0a0a0' }}>{'🛡️'.repeat(currentStreak.shields)}</div>}
        </div>
      </div>

      <div style={card}>
        <div style={cardTitle}>Meta do dia</div>
        <div style={metaRow}>
          <div style={bigNumber}>{fmt(daily.total)}</div>
          <div style={subText}>de {fmt(metaDiaria)}</div>
        </div>
        <ProgressBar percent={daily.percent} />
        <div style={{ ...subText, marginTop: '8px' }}>{todayAtendimentos.length} atendimento{todayAtendimentos.length !== 1 ? 's' : ''}</div>
        {daily.exceeded && <div style={exceededBanner}><div style={exceededText}>Dia extraordinário! +{fmt(daily.exceededBy)} acima da meta</div></div>}
      </div>

      <div style={card}>
        <div style={cardTitle}>Seu nível</div>
        <div style={levelRow}>
          <span style={levelName}>{levelInfo.level}</span>
          {levelInfo.next && <span style={levelNext}>Próximo: {levelInfo.next}</span>}
        </div>
        <ProgressBar percent={levelInfo.progressToNext} color="#3b82f6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div onClick={() => navigate('/catalogo')} style={{ background: '#141414', borderRadius: '16px', padding: '18px 16px', border: '1px solid #1e1e1e', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>💈</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Consultor Visual</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Mostrar estilos</div>
        </div>
        <div onClick={() => navigate('/antes-depois')} style={{ background: '#141414', borderRadius: '16px', padding: '18px 16px', border: '1px solid #1e1e1e', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>📸</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Antes & Depois</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Gerar card</div>
        </div>
        <div onClick={() => navigate('/conquistas')} style={{ background: '#141414', borderRadius: '16px', padding: '18px 16px', border: '1px solid #1e1e1e', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🏆</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Conquistas</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Seus badges</div>
        </div>
        <div onClick={() => navigate('/resumo')} style={{ background: '#141414', borderRadius: '16px', padding: '18px 16px', border: '1px solid #1e1e1e', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>📊</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Resumo Semanal</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Compartilhar</div>
        </div>
      </div>

      <div style={card}>
        <div style={cardTitle}>Hoje</div>
        {todayAtendimentos.length === 0 ? (
          <div style={emptyState}>Nenhum atendimento registrado hoje.<br />Toque em <strong>Registrar</strong> pra começar.</div>
        ) : (
          <div style={todayList}>
            {[...todayAtendimentos].reverse().map((a, i) => (
              <div key={i} style={todayItem}>
                <div><div style={todayService}>{a.servico}</div><div style={todayTime}>{a.hora}</div></div>
                <div style={todayValue}>{fmt((a.valor || 0) + (a.gorjeta || 0))}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
