import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'

export default function Buscador() {
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  
  // Usamos un debounce (retraso) para no saturar la API con cada tecla que presiona el usuario
  const timeoutRef = useRef(null)

  const buscarEnElastic = async (texto) => {
    if (!texto.trim()) {
      setResultados([])
      return
    }

    setCargando(true)
    setError(null)

    try {
      // Llamada a tu servidor Node.js
      const respuesta = await fetch(`http://localhost:3001/api/buscar?q=${encodeURIComponent(texto)}`)
      
      if (!respuesta.ok) {
        const errorData = await respuesta.json()
        throw new Error(errorData.error || 'Error de conexión')
      }

      const datos = await respuesta.json()
      setResultados(datos)
    } catch (err) {
      setError(err.message)
      setResultados([])
    } finally {
      setCargando(false)
    }
  }

  const manejarCambio = (e) => {
    const texto = e.target.value
    setConsulta(texto)

    // Limpiamos el timeout anterior
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Esperamos 300ms después de que el usuario deje de escribir para hacer la petición
    timeoutRef.current = setTimeout(() => {
      buscarEnElastic(texto)
    }, 300)
  }

  const limpiarBusqueda = () => {
    setConsulta('')
    setResultados([])
    setError(null)
  }

  return (
    <div className="relative w-full max-w-sm">
      {/* Barra de entrada */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar en todo el sitio..."
          value={consulta}
          onChange={manejarCambio}
          className="w-full rounded-full bg-stone-100 py-2.5 pl-12 pr-10 text-sm text-stone-700 outline-none transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-brand shadow-sm"
        />
        
        {/* Ícono de carga o botón de limpiar */}
        {cargando ? (
          <Loader2 className="absolute right-4 h-4 w-4 animate-spin text-brand" />
        ) : consulta ? (
          <button 
            onClick={limpiarBusqueda}
            className="absolute right-3 rounded-full p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Menú desplegable de resultados */}
      {resultados.length > 0 && (
        <div className="absolute mt-2 w-full overflow-hidden rounded-2xl bg-white py-2 shadow-lg ring-1 ring-stone-900/5 z-50">
          {resultados.map((resultado) => (
            <Link
              key={resultado.id}
              to={resultado.ruta}
              onClick={limpiarBusqueda}
              className="block px-5 py-3 transition-colors hover:bg-stone-50"
            >
              <h4 className="font-serif text-sm font-semibold text-stone-900">
                {resultado.titulo}
              </h4>
              <p className="mt-0.5 truncate text-xs text-stone-500">
                {resultado.descripcion}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Mensajes de feedback humanizados */}
      {consulta && !cargando && resultados.length === 0 && !error && (
        <div className="absolute mt-2 w-full rounded-2xl bg-white px-5 py-4 shadow-lg ring-1 ring-stone-900/5 z-50 text-center">
          <p className="text-sm text-stone-500">
            No encontramos resultados para "{consulta}". ¿Podrías intentar con otras palabras?
          </p>
        </div>
      )}

      {error && (
        <div className="absolute mt-2 w-full rounded-2xl bg-white px-5 py-4 shadow-lg ring-1 ring-rose-900/5 border border-rose-100 z-50 text-center">
          <p className="text-sm text-rose-500">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}