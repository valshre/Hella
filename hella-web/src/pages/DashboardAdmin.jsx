import { useState, useEffect } from 'react'
import { Users, FileText, Settings, ShieldAlert, Activity, Check, X, Gauge, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardAdmin() {
  const [dataStats, setDataStats] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [urlPrueba, setUrlPrueba] = useState('https://hella.com') // URL por defecto para el analizador

  // Obtenemos los datos reales al cargar la página
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { 'Authorization': `Bearer ${token}` }

        // Peticiones simultáneas a tus endpoints reales
        const [resStats, resUsers] = await Promise.all([
          fetch('http://localhost:3001/api/admin/stats', { headers }),
          fetch('http://localhost:3001/api/admin/usuarios', { headers })
        ])
        
        if (resStats.ok && resUsers.ok) {
          const stats = await resStats.json()
          const users = await resUsers.json()
          
          setDataStats(stats.usuarios)
          setUsuarios(users)
        }
      } catch (error) {
        console.error("Error obteniendo datos del dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Función para habilitar/inhabilitar usuarios en vivo
  const handleToggleEstado = async (id, estaDeshabilitado) => {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await fetch(`http://localhost:3001/api/admin/usuarios/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (respuesta.ok) {
        // Actualizamos el estado de React para que el botón cambie visualmente al instante
        setUsuarios(usuarios.map(user => {
          if (user.id === id) {
            return { ...user, deshabilitado_en: estaDeshabilitado ? null : new Date().toISOString() }
          }
          return user
        }))
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      alert("Hubo un error de comunicación con el servidor.")
    }
  }

  // Analizador Web (Redirige a Google PageSpeed Insights oficial)
  const handleAnalisisWeb = (e) => {
    e.preventDefault()
    window.open(`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(urlPrueba)}`, '_blank')
  }

  const totalUsuarios = dataStats.reduce((acc, curr) => acc + curr.cantidad, 0)

  return (
    <section className="px-4 py-12 md:px-8 bg-stone-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl">
        
        {/* Cabecera */}
        <div className="mb-10">
          <span className="mb-2 inline-block rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-800">
            Acceso Total
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Panel de Administración
          </h2>
          <p className="mt-2 text-stone-500">
            Gestión de usuarios y rendimiento del ecosistema HELLA en tiempo real.
          </p>
        </div>

        {/* ========================== */}
        {/* SECCIÓN 1: KPIs Rápidos Reales */}
        {/* ========================== */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Usuarios Registrados</p>
              <h4 className="text-2xl font-bold text-stone-900">
                {loading ? '...' : totalUsuarios}
              </h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">Usuarios Activos</p>
              <h4 className="text-2xl font-bold text-stone-900">
                {loading ? '...' : usuarios.filter(u => u.deshabilitado_en === null).length}
              </h4>
            </div>
          </div>
        </div>

        {/* ========================== */}
        {/* SECCIÓN 2: Lista de Usuarios (Con Toggle) */}
        {/* ========================== */}
        <div className="mb-12 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/60 overflow-hidden">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand" />
              Gestión de Accesos
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="border-b border-stone-200 bg-stone-50/50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Correo</th>
                  <th className="px-4 py-3 font-semibold">Rol</th>
                  <th className="px-4 py-3 font-semibold text-center">Estado</th>
                  <th className="px-4 py-3 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="py-8 text-center">Cargando usuarios...</td></tr>
                ) : (
                  usuarios.map((user) => {
                    const estaDeshabilitado = user.deshabilitado_en !== null;
                    return (
                      <tr key={user.id} className="border-b border-stone-100 transition-colors hover:bg-stone-50">
                        <td className="px-4 py-3 font-medium text-stone-900">#{user.id}</td>
                        <td className="px-4 py-3">{user.nombre}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-stone-200 px-2 py-1 text-xs font-medium text-stone-700">
                            {user.rol}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {estaDeshabilitado ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                              <X className="h-3 w-3" /> Inhabilitado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                              <Check className="h-3 w-3" /> Activo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {/* Botón Toggle */}
                          <button
                            onClick={() => handleToggleEstado(user.id, estaDeshabilitado)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              estaDeshabilitado ? 'bg-stone-300' : 'bg-emerald-500'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              estaDeshabilitado ? 'translate-x-1' : 'translate-x-6'
                            }`} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================== */}
        {/* SECCIÓN 3: Rendimiento Web y Gráfico */}
        {/* ========================== */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Gráfico Real */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/60">
            <h3 className="mb-6 font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-stone-400" />
              Distribución de Cuentas
            </h3>
            <div className="h-64 w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center text-stone-400 font-medium">Cargando...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="rol" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="cantidad" fill="#0f172a" radius={[6, 6, 0, 0]} name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Analizador de Rendimiento Web Oficial */}
          <div className="rounded-3xl bg-stone-900 p-6 shadow-lg shadow-stone-900/20 ring-1 ring-stone-800 text-stone-50">
            <div className="mb-6">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <Gauge className="h-5 w-5 text-emerald-400" />
                Auditoría de Rendimiento Web
              </h3>
              <p className="mt-2 text-sm text-stone-400">
                Conectado con Google Lighthouse (PageSpeed Insights). Analiza la velocidad de carga, accesibilidad y SEO de tu sitio en producción.
              </p>
            </div>
            
            <form onSubmit={handleAnalisisWeb} className="flex flex-col gap-4 mt-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-stone-400">URL a analizar:</label>
                <input 
                  type="url" 
                  value={urlPrueba}
                  onChange={(e) => setUrlPrueba(e.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-sm text-stone-200 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  required
                />
              </div>
              <button 
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-stone-900 transition-colors hover:bg-emerald-400"
              >
                Ejecutar Análisis
                <ExternalLink className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-stone-500">
              El reporte se abrirá en una nueva pestaña cifrada.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}