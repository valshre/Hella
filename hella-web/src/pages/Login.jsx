import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' // <-- Añadimos Link aquí
import { ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMensaje, setErrorMensaje] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMensaje('') // Limpiar errores anteriores
    
    try {
      // Conexión asíncrona con el servidor de autenticación
      const respuesta = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const datos = await respuesta.json()

      if (respuesta.ok) {
        // Se guardan los datos de sesión en el almacenamiento local
        localStorage.setItem('token', datos.token)
        localStorage.setItem('userRole', datos.rol)
        
        // ¡NUEVO!: Guardamos el nombre y correo para que el formulario de Contacto los use
        if (datos.nombre) localStorage.setItem('userName', datos.nombre)
        if (datos.email) localStorage.setItem('userEmail', datos.email)

        // Redirección basada en los roles
        if (datos.rol === 'Administrador') {
          navigate('/dashboard-admin')
        } else if (datos.rol === 'Chef') {
          navigate('/gestionar-menu')
        } else {
          navigate('/menu') // Redirección para el Usuario estándar
        }
      } else {
        // Se muestra el error devuelto por el servidor (ej. "Contraseña incorrecta")
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
            Acceso
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Ingresa tus credenciales para acceder a tu cuenta HELLA.
          </p>
        </div>

        {/* Mensaje de error visual */}
        {errorMensaje && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
            {errorMensaje}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-stone-50 transition-all hover:bg-stone-800"
          >
            Entrar al portal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* NUEVO: Enlace para ir a registrarse */}
        <div className="mt-8 text-center text-sm text-stone-500">
          ¿No tienes una cuenta?{' '}
          <Link 
            to="/registro" 
            className="font-semibold text-stone-900 transition-colors hover:text-red-600 hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>

      </div>
    </section>
  )
}