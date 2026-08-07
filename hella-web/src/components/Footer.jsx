import { Link } from 'react-router-dom'
import { ChefHat, Mail, Phone, MapPin, AtSign, Share2 } from 'lucide-react'

// Pie de página con información de contacto
export default function Footer() {
  return (
    <footer className="px-4 pb-6 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-stone-100 px-7 py-12 md:px-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Marca */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-stone-50">
                <ChefHat className="h-5 w-5" />
              </span>
              <span className="font-serif text-2xl font-bold text-stone-900">
                HELLA
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-stone-500">
              Chefs privados a domicilio. Experiencias gastronómicas de lujo,
              hechas a tu medida.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', icon: AtSign },
                { label: 'Compartir', icon: Share2 },
                { label: 'Correo', icon: Mail },
              ].map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm transition-colors hover:bg-brand hover:text-stone-50"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-stone-600">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand" />
                +52 55 1234 5678
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand" />
                hella@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand" />
                Querétaro, Qro.
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-stone-600">
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Menú', to: '/menu' },
                { label: 'Servicio', to: '/servicio' },
                { label: 'Sobre Nosotros', to: '/sobre-nosotros' },
                { label: 'Contacto', to: '/contacto' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea inferior actualizada con los avisos legales */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 text-center text-xs text-stone-400 md:flex-row md:text-left">
          <p>{`© ${new Date().getFullYear()} HELLA · Chefs privados a domicilio. Todos los derechos reservados.`}</p>
          <div className="flex items-center gap-4">
            <Link to="/aviso-legal" className="transition-colors hover:text-brand">
              Aviso de Privacidad
            </Link>
            <span className="h-1 w-1 rounded-full bg-stone-300"></span>
            <Link to="/terminos-condiciones" className="transition-colors hover:text-brand">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}