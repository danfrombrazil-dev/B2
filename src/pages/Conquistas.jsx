import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { calcStats } from '../utils/gamification'
import CONQUISTAS from '../data/conquistas'

export default function Conquistas() {
  const navigate = useNavigate()
  const [atendimentos] = useLocalStorage('b2_atendimentos', [])
  const [streakData] = useLocalStorage('b2_streak', null)
  const [metaDiaria] = useLocalStorage('b2_meta_diaria', 480)

  const stats = useMemo(() => calcStats(atendimentos, streakData, metaDiaria), [atendimentos, streakData, metaDiaria])
  const evaluated = useMemo(() => CONQUISTAS.map((c) => ({ ...c, unlocked: c.check(stats) })), [stats])
  const unlocked = evaluated.filter((c) => c.unlocked)
  const locked = evaluated.filter((c) => !c.unlocked)

  return (
    <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#a0a0a0', fontSize: '14px', fontFamily: 'Sora, sans-serif', cursor: 'pointer', padding: '0', marginBottom: '20px' }}>← Voltar</button>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Conquistas</div>
      <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '24px' }}>Desbloqueie badges e mostre sua evolução.</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', marginBottom: '24px' }}>
        <span style={{ fontSize: '14px', color: '#a0a0a0' }}>Desbloqueadas</span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#FF6B35' }}>{unlocked.length} / {CONQUISTAS.length}</span>
      </div>

      {unlocked.length > 0 && (
        <>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', marginTop: '8px' }}>Conquistadas</div>
          {unlocked.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', marginBottom: '10px' }}>
              <div style={{ fontSize: '32px', width: '52px', height: '52px', background: 'rgba(255,107,53,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
              <div><div style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>{c.nome}</div><div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '2px', lineHeight: 1.4 }}>{c.desc}</div></div>
              <div style={{ marginLeft: 'auto', padding: '4px 10px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', fontSize: '10px', fontWeight: 600, color: '#22c55e', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>OK</div>
            </div>
          ))}
        </>
      )}

      {locked.length > 0 && (
        <>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', marginTop: '8px' }}>Bloqueadas</div>
          {locked.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', background: '#0e0e0e', borderRadius: '16px', border: '1px solid #151515', marginBottom: '10px', opacity: 0.45 }}>
              <div style={{ fontSize: '32px', width: '52px', height: '52px', background: '#141414', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, filter: 'grayscale(100%)' }}>{c.icon}</div>
              <div><div style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: 600, color: '#666' }}>{c.nome}</div><div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '2px', lineHeight: 1.4 }}>{c.desc}</div></div>
              <div style={{ marginLeft: 'auto', fontSize: '18px', flexShrink: 0, opacity: 0.3 }}>🔒</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
