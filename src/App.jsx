import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import NovoAtendimento from './pages/NovoAtendimento'
import Financeiro from './pages/Financeiro'
import Clientes from './pages/Clientes'
import ClienteDetalhe from './pages/ClienteDetalhe'
import NovoCliente from './pages/NovoCliente'
import Catalogo from './pages/Catalogo'
import CatalogoResultado from './pages/CatalogoResultado'
import AntesDepois from './pages/AntesDepois'
import Conquistas from './pages/Conquistas'
import ResumoSemanal from './pages/ResumoSemanal'
import Perfil from './pages/Perfil'
import BottomNav from './components/BottomNav'
import useLocalStorage from './hooks/useLocalStorage'

const appStyles = {
  minHeight: '100dvh',
  paddingBottom: '80px',
  background: '#0a0a0a',
}

const landingStyles = {
  minHeight: '100dvh',
  background: '#0a0a0a',
}

export default function App() {
  const [onboarded] = useLocalStorage('b2_onboarded', false)

  if (!onboarded) {
    return (
      <div style={landingStyles}>
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    )
  }

  return (
    <div style={appStyles}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo" element={<NovoAtendimento />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/novo" element={<NovoCliente />} />
        <Route path="/clientes/:id" element={<ClienteDetalhe />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/resultado" element={<CatalogoResultado />} />
        <Route path="/antes-depois" element={<AntesDepois />} />
        <Route path="/conquistas" element={<Conquistas />} />
        <Route path="/resumo" element={<ResumoSemanal />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
