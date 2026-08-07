import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('Usuario') 
  
  const [errorMensaje, setErrorMensaje] = useState('')
  const [exitoMensaje, setExitoMensaje] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMensaje('')
    setExitoMensaje('')
    
    try {
      const respuesta = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol })
      })

      const datos = await respuesta.json()

      if (respuesta.ok) {
        setExitoMensaje('Cuenta creada con éxito. Redirigiendo...')
        // Esperamos 2 segundos para que el usuario lea el mensaje antes de mandarlo al login
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setErrorMensaje(datos.error)
      }
    } catch (error) {
      console.error('Error al conectar:', error)
      setErrorMensaje('No se pudo conectar con el servidor.')
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12 md:px-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200/60">
        
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
            Únete a HELLA
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Regístrate para vivir la experiencia de la alta cocina.
          </p>
        </div>

        {errorMensaje && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
            {errorMensaje}
          </div>
        )}

        {exitoMensaje && (
          <div className="mb-4 rounded-xl bg-green-50 p-3 text-center text-sm font-semibold text-green-700">
            {exitoMensaje}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700">Nombre Completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600"
              placeholder="Ej. Valeria Hernández"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600"
              placeholder="tu@correo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700">Contraseña</label>
            <input
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700">Tipo de Cuenta (Rol)</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600"
            >
              <option value="Usuario">Usuario (Cliente)</option>
              <option value="Chef">Chef (Editor)</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-stone-50 transition-all hover:bg-stone-800"
          >
            Registrarme
            <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-red-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

      </div>
    </section>
  )
}