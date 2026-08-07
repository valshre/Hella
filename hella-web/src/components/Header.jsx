import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom' 
import { Menu, X, LogOut, User } from 'lucide-react' 
import hellaLogo from '../assets/hella.png'
import Buscador from './Buscador' 

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation() 

  const isLoggedIn = !!localStorage.getItem('token')
  const rawRole = localStorage.getItem('userRole') || ''
  
  // Normalizamos el rol a minúsculas para comparar fácilmente
  const userRole = rawRole.trim().toLowerCase() 

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/' 
  }

  // Lógica ajustada con los nombres EXACTOS de tu base de datos
  const getNavLinks = () => {
    const baseLinks = [
      { label: 'Inicio', to: '/' },
      { label: 'Menú', to: '/menu' },
      { label: 'Servicio', to: '/servicio' },
      { label: 'Sobre Nosotros', to: '/sobre-nosotros' },
    ];

    if (userRole === 'administrador') {
      return [...baseLinks, { label: 'Dashboard Admin', to: '/dashboard-admin' }];
    }
    
    if (userRole === 'chef') {
      return [...baseLinks, { label: 'Gestionar Menú', to: '/gestionar-menu' }];
    }

    // Si no ha iniciado sesión o es 'usuario', mostramos 'Contacto'
    return [...baseLinks, { label: 'Contacto', to: '/contacto' }];
  }

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300 shrink-0">
          <img 
            src={hellaLogo} 
            alt="Logo HELLA" 
            className="h-16 w-16 md:h-20 md:w-20 object-contain" 
          />
        </Link>

        {/* Contenedor central (Escritorio) */}
        <div className="hidden flex-1 items-center justify-end md:flex">
          <nav className="flex items-center gap-6 lg:gap-8 mr-6 lg:mr-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label} 
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand whitespace-nowrap ${
                    isActive ? 'text-brand' : 'text-stone-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="mr-6 lg:mr-8 w-64 lg:w-72">
            <Buscador />
          </div>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-stone-50 shadow-sm shadow-brand/30 transition-all hover:bg-brand-dark hover:shadow-md"
              >
                <User className="h-4 w-4" />
                Registrarme / Iniciar sesión
              </Link>
            ) : (
              <>
                {/* Ahora el botón validar que el rol sea 'usuario' */}
                {userRole === 'usuario' && (
                  <Link
                    to="/contacto"
                    className="shrink-0 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-stone-50 shadow-sm shadow-brand/30 transition-all hover:bg-brand-dark hover:shadow-md"
                  >
                    Reservar chef
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-red-100 hover:text-red-700"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Salir</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Botón de menú móvil */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-200/50 text-stone-800 transition-colors hover:bg-stone-200 md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {open && (
        <nav className="mx-4 mb-4 rounded-3xl bg-white p-4 shadow-xl shadow-stone-200/50 md:hidden border border-stone-100 flex flex-col gap-4">
          
          <div className="w-full z-50">
             <Buscador />
          </div>

          <ul className="flex flex-col gap-1 z-40">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-base font-medium transition-colors hover:bg-brand-soft hover:text-brand ${
                      isActive ? 'bg-brand-soft text-brand' : 'text-stone-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {!isLoggedIn ? (
              <li className="mt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-stone-50 transition-colors hover:bg-brand-dark"
                >
                  <User className="h-5 w-5" />
                  Registrarme / Iniciar sesión
                </Link>
              </li>
            ) : (
              <>
                {userRole === 'usuario' && (
                  <li className="mt-2">
                    <Link
                      to="/contacto"
                      onClick={() => setOpen(false)}
                      className="block w-full rounded-full bg-brand px-6 py-3 text-center text-base font-semibold text-stone-50 transition-colors hover:bg-brand-dark"
                    >
                      Reservar chef
                    </Link>
                  </li>
                )}
                <li className="mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-100 px-6 py-3 text-base font-semibold text-stone-700 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}