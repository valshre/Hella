import { ShieldCheck } from 'lucide-react'

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-white px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-stone-100 p-8 md:p-16">
        
        {/* Encabezado */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            Aviso de Privacidad
          </h1>
        </div>

        {/* Contenido Legal */}
        <div className="space-y-8 text-sm leading-relaxed text-stone-600 md:text-base">
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Responsable</h2>
            <p><strong>Héctor Torres.</strong></p>
          </section>
          
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Tratamiento de Información</h2>
            <p className="mb-4">
              En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México), informamos cómo tratamos tu información:
            </p>
            <ul className="ml-5 list-disc space-y-3">
              <li>
                <strong className="text-stone-900">¿Qué datos recabamos?:</strong> Nombre, teléfono, correo electrónico, fecha del evento, número de invitados y detalles adicionales proporcionados voluntariamente en el formulario de contacto.
              </li>
              <li>
                <strong className="text-stone-900">Finalidad:</strong> Los datos se utilizan única y exclusivamente para establecer contacto contigo, atender tu solicitud de cotización y gestionar la contratación de los servicios de chef personal. No se utilizan para fines de mercadotecnia ni se comparten con terceros.
              </li>
              <li>
                <strong className="text-stone-900">Derechos ARCO:</strong> En cualquier momento puedes enviarnos un correo electrónico para solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos personales.
              </li>
            </ul>
          </section>
        </div>
        
      </div>
    </div>
  )
}