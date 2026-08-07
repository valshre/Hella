import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'

const contactInfo = [
  { icon: Phone, label: 'Teléfono', value: '+52 55 1234 5678' },
  { icon: Mail, label: 'Correo', value: 'hella@gmail.com' },
  { icon: MapPin, label: 'Cobertura', value: 'Querétaro, Qro.' },
  { icon: Clock, label: 'Horario', value: 'Lun a Dom · 9:00 - 21:00' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // NUEVO: Estado para detectar si es Reservación o Sugerencia
  const [asunto, setAsunto] = useState('Reservacion')

  const isLoggedIn = !!localStorage.getItem('token')
  const storedName = localStorage.getItem('userName') || ''
  const storedEmail = localStorage.getItem('userEmail') || ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target)
    
    // Extraemos datos. Si es sugerencia, fecha e invitados se envían vacíos
    const datosEnvio = {
      nombre: formData.get('name'),
      correo: formData.get('email'),
      asunto: formData.get('subject'),
      fecha: formData.get('date') || null,
      invitados: formData.get('guests') || null,
      mensaje: formData.get('message')
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const respuesta = await fetch('http://localhost:3001/api/contacto', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(datosEnvio),
      })

      if (respuesta.ok) {
        setSent(true)
      } else {
        const errorData = await respuesta.json()
        alert(`Hubo un problema: ${errorData.error || 'Inténtalo de nuevo.'}`)
      }
    } catch (error) {
      console.error('Error de comunicación asíncrona:', error)
      alert('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const inputClassBase = "rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none transition-colors"
  const inputClassActive = "bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:border-brand focus:bg-white"
  const inputClassReadOnly = "bg-stone-200 text-stone-500 cursor-not-allowed focus:border-stone-200"

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Reserva tu experiencia HELLA"
        description="Cuéntanos sobre tu evento y nuestro equipo te contactará para diseñar un menú a tu medida."
        image="/images/evento.png"
      />

      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5 lg:gap-14">
          
          <div className="flex flex-col gap-6 lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900 md:text-3xl">
              Hablemos de tu evento
            </h2>
            <p className="text-pretty leading-relaxed text-stone-500">
              Estamos list@s para ayudarte a crear una experiencia gastronómica inolvidable. Escríbenos por el medio que prefieras.
            </p>
            <ul className="flex flex-col gap-4">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <li key={info.label} className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">{info.label}</span>
                      <span className="font-medium text-stone-800">{info.value}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-[2rem] bg-white p-7 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60 md:p-9">
              {sent ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">¡Gracias por escribirnos!</h3>
                  <p className="max-w-sm text-pretty leading-relaxed text-stone-500">
                    Hemos recibido tu solicitud. Nuestro equipo la revisará muy pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Nombre y Teléfono */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-medium text-stone-700">Nombre</label>
                      <input
                        id="name" name="name" type="text" required
                        defaultValue={storedName} readOnly={isLoggedIn} placeholder="Tu nombre"
                        className={`${inputClassBase} ${isLoggedIn ? inputClassReadOnly : inputClassActive}`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-sm font-medium text-stone-700">Teléfono</label>
                      <input
                        id="phone" name="phone" type="tel" placeholder="Tu teléfono"
                        className={`${inputClassBase} ${inputClassActive}`}
                      />
                    </div>
                  </div>

                  {/* Correo y Asunto */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-stone-700">Correo electrónico</label>
                      <input
                        id="email" name="email" type="email" required
                        defaultValue={storedEmail} readOnly={isLoggedIn} placeholder="tucorreo@ejemplo.com"
                        className={`${inputClassBase} ${isLoggedIn ? inputClassReadOnly : inputClassActive}`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-sm font-medium text-stone-700">Asunto</label>
                      <select
                        id="subject" name="subject" required
                        value={asunto} // Vinculado al estado
                        onChange={(e) => setAsunto(e.target.value)} // Actualiza el estado
                        className={`${inputClassBase} ${inputClassActive} cursor-pointer font-medium`}
                      >
                        <option value="Reservacion">Reservación</option>
                        <option value="Sugerencias">Sugerencias</option>
                      </select>
                    </div>
                  </div>

                  {/* RENDERIZADO CONDICIONAL: Solo si el asunto es "Reservacion" */}
                  {asunto === 'Reservacion' && (
                    <div className="grid gap-5 sm:grid-cols-2 transition-all">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="date" className="text-sm font-medium text-stone-700">Fecha del evento</label>
                        <input
                          id="date" name="date" type="date" required={asunto === 'Reservacion'}
                          className={`${inputClassBase} ${inputClassActive}`}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="guests" className="text-sm font-medium text-stone-700">Nº de invitados</label>
                        <input
                          id="guests" name="guests" type="number" min="1" placeholder="Ej. 8" required={asunto === 'Reservacion'}
                          className={`${inputClassBase} ${inputClassActive}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mensaje */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-stone-700">
                      {asunto === 'Reservacion' ? 'Cuéntanos más detalles' : 'Escribe tu sugerencia'}
                    </label>
                    <textarea
                      id="message" name="message" required
                      rows={asunto === 'Reservacion' ? 4 : 6} // Más grande si es sugerencia
                      placeholder={asunto === 'Reservacion' ? "Tipo de celebración, alergias, preferencias..." : "Tus comentarios nos ayudan a mejorar..."}
                      className={`resize-none ${inputClassBase} ${inputClassActive}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-stone-50 shadow-lg shadow-brand/30 transition-all hover:bg-brand-dark disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                    {!loading && <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                  </button>

                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}