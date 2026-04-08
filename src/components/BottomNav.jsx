import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Início', icon: '🏠' },
  { path: '/novo', label: 'Registrar', icon: '✂️' },
  { path: '/catalogo', label: 'Estilos', icon: '💈' },
  { path: '/clientes', label: 'Clientes', icon: '👥' },
  { path: '/perfil', label: 'Perfil', icon: '⚙️' },
]

const navStyle = {
  position: 'fixed', bottom: 0, left: 0, right: 0, height: '72px',
  background: '#111111', borderTop: '1px solid #1e1e1e',
  display: 'flex', justifyContent: 'space-around', alignItems: 'center',
  zIndex: 1000, paddingBottom: 'env(safe-area-inset-bottom)',
}

const tabStyle = (active) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
  cursor: 'pointer', background: 'none', border: 'none',
  color: active ? '#FF6B35' : '#666', fontSize: '9px',
  fontFamily: 'Sora, sans-serif', fontWeight: active ? 600 : 400,
  transition: 'color 0.2s', padding: '8px 6px',
})

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <nav style={navStyle}>
      {tabs.map((tab) => {
        const active = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path)
        return (
          <button key={tab.path} style={tabStyle(active)} onClick={() => navigate(tab.path)}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
