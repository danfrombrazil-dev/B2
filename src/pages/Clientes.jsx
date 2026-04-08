import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { today } from '../utils/gamification'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const AVATAR_COLORS = ['#FF6B35', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
function getAvatarColor(name) { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length] }
function getInitials(name) { return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') }
function daysSince(dateStr) { if (!dateStr) return Infinity; const then = new Date(dateStr + 'T00:00:00'); const now = new Date(today() + 'T00:00:00'); return Math.floor((now - then) / (1000 * 60 * 60 * 24)) }

export default function Clientes() {
  const navigate = useNavigate()
  const [clientes] = useLocalStorage('b2_clientes', [])
  const [atendimentos] = useLocalStorage('b2_atendimentos', [])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [searchFocused, setSearchFocused] = useState(false)

  const enriched = useMemo(() => clientes.map((c) => {
    const ca = atendimentos.filter((a) => a.clienteId === c.id || (a.cliente && a.cliente.toLowerCase() === c.nome.toLowerCase()))
    const lastVisit = ca.length > 0 ? ca.sort((a, b) => b.data.localeCompare(a.data))[0].data : c.criadoEm || null
    return { ...c, atendimentos: ca.length, lastVisit, diasAusente: daysSince(lastVisit) }
  }), [clientes, atendimentos])

  const filtered = useMemo(() => {
    let list = enriched
    if (search.trim()) { const q = search.toLowerCase().trim(); list = list.filter((c) => c.nome.toLowerCase().includes(q)) }
    if (filter === 'sumidos') list = list.filter((c) => c.diasAusente >= 30)
    else if (filter === 'recentes') list = list.filter((c) => c.diasAusente < 30)
    else if (filter === 'novos') list = list.filter((c) => c.atendimentos <= 1)
    list.sort((a, b) => { if (a.diasAusente >= 30 && b.diasAusente < 30) return -1; if (b.diasAusente >= 30 && a.diasAusente < 30) return 1; return a.nome.localeCompare(b.nome) })
    return list
  }, [enriched, search, filter])

  const sumidos = enriched.filter((c) => c.diasAusente >= 30).length

  return (
    <div style={page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Clientes</div>
        <button onClick={() => navigate('/clientes/novo')} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #FF6B35, #ff8c42)', border: 'none', borderRadius: '12px', color: '#ffffff', fontSize: '13px', fontWeight: 600, fontFamily: 'Sora, sans-serif', cursor: 'pointer', boxShadow: '0 2px 12px rgba(255,107,53,0.25)' }}>+ Novo</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px 16px', background: '#141414', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
        <div style={{ fontSize: '13px', color: '#a0a0a0' }}>Total de clientes</div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{clientes.length}</div>
      </div>
      <input type="text" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
        style={{ width: '100%', padding: '14px 16px', background: '#141414', border: `2px solid ${searchFocused ? '#FF6B35' : '#1e1e1e'}`, borderRadius: '14px', color: '#ffffff', fontSize: '14px', fontFamily: 'Sora, sans-serif', outline: 'none', marginBottom: '12px', transition: 'border-color 0.2s' }} />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[{ key: 'todos', label: 'Todos' }, { key: 'sumidos', label: `Sumidos (${sumidos})` }, { key: 'recentes', label: 'Recentes' }, { key: 'novos', label: 'Novos' }].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '8px 14px', background: filter === f.key ? 'rgba(255,107,53,0.15)' : '#141414', border: filter === f.key ? '1.5px solid #FF6B35' : '1.5px solid #1e1e1e', borderRadius: '20px', color: filter === f.key ? '#FF6B35' : '#a0a0a0', fontSize: '12px', fontWeight: filter === f.key ? 600 : 400, fontFamily: 'Sora, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>{f.label}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#666', fontSize: '14px' }}>{clientes.length === 0 ? 'Nenhum cliente cadastrado ainda. Toque em "+ Novo" pra começar.' : 'Nenhum cliente encontrado.'}</div>
      ) : filtered.map((c) => (
        <div key={c.id} onClick={() => navigate(`/clientes/${c.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#141414', borderRadius: '16px', border: '1px solid #1e1e1e', marginBottom: '10px', cursor: 'pointer' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: getAvatarColor(c.nome), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff', flexShrink: 0 }}>{getInitials(c.nome)}</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>{c.nome}</div>
            <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '2px' }}>{c.lastVisit ? (c.diasAusente === 0 ? 'Veio hoje' : c.diasAusente === 1 ? 'Veio ontem' : `Há ${c.diasAusente} dias`) : 'Sem visitas'}</div>
            {c.diasAusente >= 30 && <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>⚠️ Não vem há {c.diasAusente} dias</div>}
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 600, color: '#FF6B35' }}>{c.atendimentos}</div>
            <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>visitas</div>
          </div>
        </div>
      ))}
    </div>
  )
}
