import { useState, useEffect } from 'react'
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Send } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'

export default function PedidoCliente() {
  const [menu, setMenu] = useState([])
  const [carrito, setCarrito] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [loadingPedido, setLoadingPedido] = useState(false)
  const [sent, setSent] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')
  const token = localStorage.getItem('token')

  // Obtener el menú disponible sin mostrar la preparación
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const respuesta = await fetch('https://hella-i3o7.onrender.com/api/cliente/menu', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
        if (respuesta.ok) {
          const data = await respuesta.json()
          setMenu(data)
        } else {
          console.error('Error al obtener el menú')
        }
      } catch (error) {
        console.error('Error de red al obtener el menú:', error)
      } finally {
        setLoadingMenu(false)
      }
    }

    fetchMenu()
  }, [token])

  // Funciones para gestionar el carrito de compras
  const agregarAlCarrito = (platillo) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.platillo_id === platillo.platillo_id)
      if (existe) {
        return prev.map(item =>
          item.platillo_id === platillo.platillo_id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          platillo_id: platillo.platillo_id,
          nombre: platillo.nombre,
          precio: platillo.precio,
          cantidad: 1,
          imagen_url: platillo.imagen_url
        }
      ]
    })
  }

  const disminuirDelCarrito = (platillo_id) => {
    setCarrito(prev => {
      return prev.map(item => {
        if (item.platillo_id === platillo_id) {
          return { ...item, cantidad: item.cantidad - 1 }
        }
        return item
      }).filter(item => item.cantidad > 0)
    })
  }

  const eliminarDelCarrito = (platillo_id) => {
    setCarrito(prev => prev.filter(item => item.platillo_id !== platillo_id))
  }

  // Envío del pedido al backend
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para realizar un pedido')
      return
    }

    if (carrito.length === 0) {
      alert('Selecciona al menos un platillo')
      return
    }

    setLoadingPedido(true)
    const formData = new FormData(event.target)

    const datosPedido = {
      zona_domicilio: formData.get('zona_domicilio'),
      numero_comensales: parseInt(formData.get('numero_comensales'), 10),
      notas_especiales: formData.get('notas_especiales') || null,
      prioridad: formData.get('prioridad') || 'Normal',
      items: carrito.map(item => ({
        platillo_id: item.platillo_id,
        cantidad: item.cantidad
      }))
    }

    try {
      const respuesta = await fetch('https://hella-i3o7.onrender.com/api/cliente/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosPedido),
      })

      if (respuesta.ok) {
        setSent(true)
        setCarrito([])
      } else {
        const errorData = await respuesta.json()
        alert(`Hubo un problema: ${errorData.error || 'Inténtalo de nuevo.'}`)
      }
    } catch (error) {
      console.error('Error de comunicación asíncrona:', error)
      alert('No se pudo conectar con el servidor.')
    } finally {
      setLoadingPedido(false)
    }
  }

  const inputClassBase = "rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none transition-colors"
  const inputClassActive = "bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:border-brand focus:bg-white"

  return (
    <>
      <PageHero
        eyebrow="Pedidos"
        title="Realiza tu pedido HELLA"
        description="Explora nuestro menú disponible y solicita tus platillos favoritos directamente desde tu cuenta."
        image="/images/evento.png"
      />

      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          {sent ? (
            <div className="mx-auto max-w-md rounded-[2rem] bg-white p-7 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60 md:p-9">
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">¡Pedido registrado con éxito!</h3>
                <p className="max-w-sm text-pretty leading-relaxed text-stone-500">
                  Hemos recibido tu pedido correctamente. Nuestro equipo ya se encuentra procesándolo.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-stone-50 shadow-lg shadow-brand/30 transition-all hover:bg-brand-dark"
                >
                  Hacer otro pedido
                </button>
              </div>
            </div>
          ) : !isLoggedIn ? (
            <div className="mx-auto max-w-md rounded-[2rem] bg-white p-7 text-center shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60 md:p-9">
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">Inicia sesión requerido</h3>
              <p className="text-stone-500 mb-6 leading-relaxed">
                Debes iniciar sesión con tu cuenta registrada para consultar el menú y realizar un pedido.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              
              {/* Sección del Menú */}
              <div className="flex flex-col gap-6 lg:col-span-7">
                <h2 className="font-serif text-2xl font-bold text-stone-900 md:text-3xl">
                  Menú Disponible
                </h2>
                {loadingMenu ? (
                  <p className="text-stone-500">Cargando menú...</p>
                ) : menu.length === 0 ? (
                  <p className="text-stone-500">No hay platillos disponibles en este momento.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {menu.map((platillo) => (
                      <div key={platillo.platillo_id} className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60">
                        <div>
                          {platillo.imagen_url && (
                            <img src={platillo.imagen_url} alt={platillo.nombre} className="mb-4 h-36 w-full rounded-2xl object-cover" />
                          )}
                          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">{platillo.categoria_nombre}</span>
                          <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">{platillo.nombre}</h3>
                          <p className="text-xs text-stone-500 line-clamp-2 mt-1">{platillo.descripcion}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
                          <div>
                            <span className="text-base font-bold text-stone-900">${Number(platillo.precio).toFixed(2)}</span>
                            {platillo.tiempo_estimado_min && (
                              <span className="block text-[11px] text-stone-400">⏱ {platillo.tiempo_estimado_min} min</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => agregarAlCarrito(platillo)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark transition-all hover:bg-brand hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario y Resumen del Pedido */}
              <div className="lg:col-span-5">
                <div className="sticky top-8 rounded-[2rem] bg-white p-7 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60 md:p-9">
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-5 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-brand" /> Tu Pedido
                  </h3>

                  {carrito.length === 0 ? (
                    <p className="text-sm text-stone-500 py-6 text-center">
                      No has seleccionado ningún platillo del menú todavía.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4 mb-6">
                      <ul className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                        {carrito.map((item) => (
                          <li key={item.platillo_id} className="flex items-center justify-between rounded-2xl bg-stone-50 p-3 text-sm">
                            <div className="flex flex-col flex-1 pr-2">
                              <span className="font-semibold text-stone-800">{item.nombre}</span>
                              <span className="text-xs text-stone-500">${Number(item.precio).toFixed(2)} c/u</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => disminuirDelCarrito(item.platillo_id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-stone-200 text-stone-700 hover:bg-stone-100"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center font-medium text-xs">{item.cantidad}</span>
                              <button
                                type="button"
                                onClick={() => agregarAlCarrito(item)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-stone-200 text-stone-700 hover:bg-stone-100"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => eliminarDelCarrito(item.platillo_id)}
                                className="ml-1 text-stone-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-900 text-base">
                        <span>Total estimado:</span>
                        <span>
                          ${carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="zona_domicilio" className="text-sm font-medium text-stone-700">Zona de domicilio</label>
                      <input
                        id="zona_domicilio" name="zona_domicilio" type="text" required
                        placeholder="Ej. Centro, Querétaro"
                        className={`${inputClassBase} ${inputClassActive}`}
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="numero_comensales" className="text-sm font-medium text-stone-700">Nº de comensales</label>
                        <input
                          id="numero_comensales" name="numero_comensales" type="number" min="1" required
                          placeholder="Ej. 4"
                          className={`${inputClassBase} ${inputClassActive}`}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="prioridad" className="text-sm font-medium text-stone-700">Prioridad</label>
                        <select
                          id="prioridad" name="prioridad" defaultValue="Normal"
                          className={`${inputClassBase} ${inputClassActive} cursor-pointer font-medium`}
                        >
                          <option value="Normal">Normal</option>
                          <option value="Alta">Alta</option>
                          <option value="Urgente">Urgente</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="notas_especiales" className="text-sm font-medium text-stone-700">Notas especiales (opcional)</label>
                      <textarea
                        id="notas_especiales" name="notas_especiales" rows={3}
                        placeholder="Ej. Una persona no consume picante..."
                        className={`resize-none ${inputClassBase} ${inputClassActive}`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingPedido || carrito.length === 0}
                      className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-stone-50 shadow-lg shadow-brand/30 transition-all hover:bg-brand-dark disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loadingPedido ? 'Registrando...' : 'Confirmar pedido'}
                      {!loadingPedido && <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}