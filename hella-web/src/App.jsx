import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import MenuEventos from './pages/MenuEventos.jsx'
import About from './pages/About.jsx'
import Service from './pages/Service.jsx'
import Contact from './pages/Contact.jsx'
import AvisoPrivacidad from './components/AvisoPrivacidad.jsx'
import TerminosCondiciones from './components/TerminosCondiciones.jsx'
import Register from './pages/Register.jsx'

// Nuevos componentes para la seguridad
import Login from './pages/Login.jsx'
import AccesoDenegado from './pages/AccesoDenegado.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Páginas de ejemplo para los roles superiores
import GestionarMenu from './pages/GestionarMenu.jsx' // Solo Chefs y Admin
import DashboardAdmin from './pages/DashboardAdmin.jsx' // Solo Admin

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          
          {/* RUTAS PÚBLICAS (Cualquiera puede entrar) */}
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} /> 
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          <Route path="/aviso-legal" element={<AvisoPrivacidad />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
      

          {/* RUTAS PROTEGIDAS - Nivel 1: Usuarios, Chefs y Administradores */}
          {/* Los usuarios regulares pueden ver lo que hay en el sitio */}
          <Route element={<ProtectedRoute rolesPermitidos={['Administrador', 'Chef', 'Usuario']} />}>
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu-eventos" element={<MenuEventos />} />
            <Route path="/sobre-nosotros" element={<About />} />
            <Route path="/servicio" element={<Service />} />
            <Route path="/contacto" element={<Contact />} />
          </Route>

          {/* RUTAS PROTEGIDAS - Nivel 2: Edición del sitio (Chefs y Administradores) */}
          {/* Los chefs pueden editar recetas y menús */}
          <Route element={<ProtectedRoute rolesPermitidos={['Administrador', 'Chef']} />}>
            <Route path="/gestionar-menu" element={<GestionarMenu />} />
          </Route>

          {/* RUTAS PROTEGIDAS - Nivel 3: Control Total (Solo Administradores) */}
          <Route element={<ProtectedRoute rolesPermitidos={['Administrador']} />}>
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}