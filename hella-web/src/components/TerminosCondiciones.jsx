import { FileText } from 'lucide-react'

export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-white px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-stone-100 p-8 md:p-16">
        
        {/* Encabezado */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
            <FileText className="h-8 w-8" />
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            Términos y Condiciones
          </h1>
        </div>

        {/* Contenido Legal */}
        <div className="space-y-8 text-sm leading-relaxed text-stone-600 md:text-base">
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Identificación</h2>
            <p>El sitio web Hella es propiedad de Héctor Torres, con domicilio en Santiago de Querétaro, Querétaro, México.</p>
          </section>
          
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Naturaleza del Servicio</h2>
            <p>
              Hella funciona como un portal informativo para la prestación de servicios de chef personal. Debido a que cada evento es personalizado (basado en ingredientes, número de invitados y especificaciones), la página no realiza cobros ni transacciones directas. Los precios finales se definen tras una consulta directa con el cliente.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Uso del Sitio</h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>El usuario se obliga a utilizar el sitio de forma responsable.</li>
              <li>Está estrictamente prohibido realizar acciones que busquen comprometer la seguridad del sitio, tales como intentos de hacking, inyección de código, spam o ingeniería inversa sobre la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Propiedad Intelectual</h2>
            <p>
              Todo el diseño, código, logotipos, textos y elementos gráficos presentes en el sitio web de Hella son propiedad exclusiva de Héctor Torres y están protegidos por las leyes de derechos de autor. Queda prohibida su reproducción sin autorización previa.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Limitación de Responsabilidad</h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>Hella se esfuerza por mantener la disponibilidad del sitio, sin embargo, no se hace responsable por caídas temporales del servidor, errores técnicos ajenos al control del propietario o interrupciones en el servicio de internet.</li>
              <li>La información mostrada en el sitio tiene fines ilustrativos. Los compromisos contractuales de los servicios de chef se formalizarán únicamente tras la comunicación directa y el acuerdo entre las partes (Héctor Torres y el cliente).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">Ley Aplicable</h2>
            <p>
              Para cualquier controversia derivada del uso de este sitio o los servicios ofrecidos, el usuario y el propietario acuerdan someterse a la jurisdicción de los tribunales de Santiago de Querétaro, Querétaro, México, aplicando la legislación vigente en el estado y la normativa federal mexicana.
            </p>
          </section>
        </div>
        
      </div>
    </div>
  )
}