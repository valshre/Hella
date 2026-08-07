import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function AccesoDenegado() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center md:px-8">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </span>
      <h2 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
        Acceso Restringido
      </h2>
      <p className="mt-4 max-w-md text-stone-500">
        Tu rol actual no tiene los permisos necesarios para visualizar esta página o editar este contenido.
      </p>
      <Link
        to="/"
        className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
      >
        Volver al inicio
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  )
}