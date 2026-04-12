import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Clock,
  FileText,
  Gift,
  Link2,
  ShieldCheck,
  Mail,
  HelpCircle,
} from 'lucide-react'

import useReveal from '../hooks/useReveal'
import PublicNavbar from '../components/public/PublicNavbar'
import PublicFooter from '../components/public/PublicFooter'

export default function Home() {
  // Animación actual (IntersectionObserver + clase .reveal)
  const heroRef = useReveal(0)
  const heroVisualRef = useReveal(120)
  const trustRef = useReveal(0)

  const stepsRef = useReveal(0)
  const step1Ref = useReveal(0)
  const step2Ref = useReveal(80)
  const step3Ref = useReveal(160)
  const step4Ref = useReveal(240)
  const step5Ref = useReveal(320)

  const techRef = useReveal(0)
  const deliverRef = useReveal(0)
  const verifyRef = useReveal(0)
  const faqRef = useReveal(0)
  const freeRef = useReveal(0)

  // Anti-parpadeo: marcar una vez animado aunque el observer vuelva a disparar
  useEffect(() => {
    const onAnimEnd = (e) => {
      const el = e.target
      if (el && el.classList && el.classList.contains('reveal')) {
        el.classList.add('bs-animated')
      }
    }
    document.addEventListener('animationend', onAnimEnd, true)
    return () => document.removeEventListener('animationend', onAnimEnd, true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <style>{`
        /* Anti-flicker + animación estable */
        .reveal {
          opacity: 0;
          transform: translateY(14px);
          will-change: opacity, transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        /* Solo anima si NO está marcada como ya animada */
        .reveal:not(.bs-animated) {
          animation: bs_fadeUp .65s ease both;
        }
        /* Una vez animada, fija el estado final (evita parpadeo al re-entrar) */
        .reveal.bs-animated {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes bs_fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bs_float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .bs-float { animation: bs_float 6s ease-in-out infinite; will-change: transform; }

        @keyframes bs_glow { 0%,100% { opacity: .55; } 50% { opacity: .9; } }
        .bs-glow { animation: bs_glow 8s ease-in-out infinite; }

        @keyframes bs_shine { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        .bs-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,.35) 45%, transparent 70%);
          transform: translateX(-120%);
          animation: bs_shine 2.8s ease-in-out infinite;
          pointer-events: none;
          opacity: .55;
        }

        /* Accesibilidad: si el usuario prefiere menos movimiento */
        @media (prefers-reduced-motion: reduce) {
          .reveal:not(.bs-animated) { animation: none; }
          .reveal { opacity: 1; transform: none; }
          .bs-float, .bs-glow, .bs-shine::after { animation: none !important; }
        }
      `}</style>

      <PublicNavbar />

      {/* HERO */}
      <section className="relative">
        <BackgroundGradient />

        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-10 items-center">
          {/* Copy */}
          <div ref={heroRef}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Prueba criptográfica de existencia{' '}
              <span className="bg-gradient-to-r from-[#f7931a] to-[#ffcc00] bg-clip-text text-transparent">
                anclada a Bitcoin
              </span>
            </h1>

            <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg">
              Sella archivos de forma gratuita usando OpenTimestamps y la red Bitcoin. Obtén una prueba verificable,
              independiente y válida a largo plazo.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/dashboard"
                className="relative overflow-hidden bs-shine inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white bg-[#f7931a] hover:bg-[#e67e00] shadow-lg shadow-orange-200/40 transition"
              >
                Sellar archivo gratis <ArrowRight className="size-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('como-funciona')
                  if (!el) return
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 64 - 10
                  window.scrollTo({ top: y, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-slate-800 dark:text-white bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/15 transition"
              >
                Ver cómo funciona
              </button>
            </div>

            <div className="mt-6" ref={trustRef}>
              <TrustChipsRow
                items={[
                  { icon: ShieldCheck, text: 'Sin coste' },
                  { icon: FileText, text: 'Sin custodia de archivos' },
                  { icon: BadgeCheck, text: 'Estándares abiertos' },
                  { icon: Link2, text: 'Verificación pública' },
                ]}
              />
            </div>

            {/* Logos */}
            <div className="mt-10 flex flex-wrap items-center gap-6 opacity-80">
              <img src="/assets/logos/partner1.svg" alt="Partner 1" className="h-8" />
              <img src="/assets/logos/partner2.svg" alt="Partner 2" className="h-8" />
              <img src="/assets/logos/partner3.svg" alt="Partner 3" className="h-8" />
              <img src="/assets/logos/partner4.svg" alt="Partner 4" className="h-8" />
            </div>
          </div>

          {/* Visual */}
          <div className="relative" ref={heroVisualRef}>
            <GlowBackdrop />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
              <img src="/assets/hero.jpg" alt="Sellado en Bitcoin" className="w-full" />
            </div>

            <div className="hidden md:block absolute -bottom-6 -left-6 w-2/3 bs-float">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/30 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/10">
                <img src="/assets/screenshot-dashboard.png" alt="Dashboard BitSealer" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-14" ref={stepsRef}>
        <SectionHeader align="center" title="Cómo funciona" subtitle="Un flujo sencillo con pruebas descargables y verificables." />

        <StepsTimeline
          steps={[
            { title: 'Subes un archivo desde tu navegador', description: 'Selecciona o arrastra tu archivo para iniciar el sellado.', ref: step1Ref },
            { title: 'Generamos su hash SHA-256', description: 'Creamos una huella única del contenido sin almacenar el archivo.', ref: step2Ref },
            { title: 'Merkle + OpenTimestamps', description: 'Se incluye en un árbol de Merkle y se publica en calendarios públicos.', ref: step3Ref },
            { title: 'Anclaje a Bitcoin', description: 'El calendario queda anclado a Bitcoin de forma periódica (en unas horas).', ref: step4Ref },
            { title: 'Descargas .ots y certificado PDF', description: 'Te llevas las pruebas para verificar ahora o en el futuro.', ref: step5Ref },
          ]}
        />
      </section>

      {/* TECH EXPLAINER */}
      <section className="max-w-6xl mx-auto px-4 py-14" ref={techRef}>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <SectionHeader
              align="left"
              title="Sellado temporal con OpenTimestamps y Bitcoin"
              subtitle="Estándar abierto, verificable e independiente de un proveedor."
            />
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Usamos OpenTimestamps para convertir tu archivo en una prueba criptográfica verificable. En vez de escribir una
              transacción por cada documento, se agrupan muchos hashes en un árbol de Merkle y se publican en calendarios
              públicos. Después, esos calendarios quedan anclados a Bitcoin periódicamente.
            </p>

            <CalloutCard
              icon={Clock}
              title="Anclaje diferido (gratis)"
              text="El anclaje no es inmediato: suele completarse en unas horas. Este enfoque mantiene el servicio gratuito y escalable, preservando la verificabilidad."
            />
          </div>

          <TechDiagramCard />
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="max-w-6xl mx-auto px-4 py-14" ref={deliverRef}>
        <SectionHeader align="center" title="Qué obtienes" subtitle="Pruebas descargables, pensadas para durar." />

        <div className="grid lg:grid-cols-2 gap-6">
          <DeliverableCard
            type=".ots"
            title="Archivo .ots"
            desc="Prueba estándar de OpenTimestamps verificable de forma independiente."
            bullets={[
              'Vincula el archivo exacto (si cambia 1 byte, deja de validar)',
              'Permite verificación pública con herramientas OTS',
              'Diseñado para conservarse y verificarse en el futuro',
            ]}
          />
          <DeliverableCard
            type="PDF"
            title="Certificado PDF"
            desc="Resumen legible del sellado: hash, fecha, estado y referencias técnicas."
            bullets={[
              'Útil como evidencia documental y trazabilidad interna',
              'Resumen claro para auditorías y compliance',
              'Incluye referencias para validar la prueba',
            ]}
          />
        </div>
      </section>

      

      {/* FAQ TÉCNICA */}
      <section id="faq" className="max-w-6xl mx-auto px-4 py-14" ref={faqRef}>
        <SectionHeader align="center" title="Preguntas frecuentes" subtitle="Detalles técnicos sin humo, explicados de forma clara." />
        <FaqAccordion
          items={[
            {
              icon: HelpCircle,
              title: '¿Qué prueba exactamente el sellado?',
              content:
                'La prueba demuestra que el contenido exacto del archivo existía antes (o como máximo en) el momento del anclaje. Esto se hace mediante un hash criptográfico: si el archivo cambia en cualquier byte, el hash cambia y la verificación falla. No es un “sello de autoría” ni valida quién lo creó; valida integridad y existencia temporal del contenido.',
            },
            {
              icon: ShieldCheck,
              title: '¿Guardáis mis archivos o podéis reconstruirlos?',
              content:
                'No. El archivo no se almacena como parte de la prueba. El sellado se basa en generar un resumen criptográfico (hash) y construir una prueba (.ots) que conecta ese hash con un anclaje. Con el hash no puedes reconstruir el archivo original, y la verificación se realiza comparando el archivo real con su prueba .ots.',
            },
            {
              icon: Link2,
              title: '¿Qué es el .ots y por qué es importante conservarlo?',
              content:
                'El .ots es la “receta” criptográfica de verificación: contiene el compromiso asociado a tu archivo y las operaciones necesarias para llegar a una o varias atestaciones. Si guardas el archivo + su .ots, puedes verificar en el futuro que ese contenido se corresponde exactamente con la prueba, incluso si el servicio ya no existiera.',
            },
            {
              icon: CalendarClock,
              title: '¿Por qué el anclaje tarda horas?',
              content:
                'Porque el modelo de calendarios públicos agrega muchas solicitudes en lotes (Merkle) y publica periódicamente compromisos que luego se anclan a Bitcoin. Esta agregación reduce costes y hace viable un servicio gratuito y escalable. La prueba puede existir “incompleta” al principio y quedar “completada” cuando ya está anclada.',
            },
            {
              icon: BadgeCheck,
              title: '¿Dependo de BitSealer para verificar?',
              content:
                'No. El objetivo del formato y del protocolo es que la verificación sea independiente. La verificación pública existe precisamente para demostrar que no hay “caja negra”: la prueba .ots está pensada para poder validarse con herramientas compatibles y comprobando el contenido real del archivo.',
            },
            {
              icon: FileText,
              title: '¿Para qué sirve el certificado PDF si ya tengo el .ots?',
              content:
                'El PDF no sustituye al .ots: es una representación humana (legible) del sellado para documentación interna, auditorías o trazabilidad. La verificación criptográfica real se apoya en el archivo original y el .ots. El PDF ayuda a comunicar el estado y los identificadores de la prueba.',
            },
          ]}
        />
      </section>

      {/* FREE + FINAL CTA (id="precio" para no romper el navbar actual) */}
      <section id="precio" className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fff3e0] to-[#fffbeb] dark:from-amber-500/10 dark:to-amber-500/5" />
        <div className="max-w-6xl mx-auto px-4 py-14" ref={freeRef}>
          <InfoBannerV2
            icon={Gift}
            title="Versión pública (gratuita) + hoja de ruta"
            body="Esta primera versión funciona con calendarios públicos de OpenTimestamps: agregación por Merkle y anclaje diferido a Bitcoin para mantener el servicio gratuito. En el futuro incorporaremos opciones de sellado más rápido con infraestructura dedicada (por ejemplo, nodo propio o calendarios privados) para casos de uso empresariales."
            ctaLabel="Contactar (Enterprise)"
            ctaHref="mailto:?subject=BitSealer%20-%20Inter%C3%A9s%20Enterprise&body=Hola%2C%0A%0ASomos%20una%20empresa%20interesada%20en%20BitSealer.%0A%0A-%20Volumen%20aproximado%3A%20%0A-%20Necesidad%20principal%3A%20(sellado%20r%C3%A1pido%2Finfra%20dedicada%2Fintegraci%C3%B3n%2Fcompliance)%0A-%20Detalles%20t%C3%A9cnicos%3A%20%0A-%20Contacto%3A%20%0A%0AGracias."
            external
          />

          
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

function BackgroundGradient() {
  return (
    <>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-amber-50/40 to-white dark:from-slate-950 dark:via-amber-500/5 dark:to-slate-950" />
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-[#ffcc00]/20 blur-3xl bs-glow" />
        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-[#f7931a]/15 blur-3xl bs-glow" />
      </div>
    </>
  )
}

function GlowBackdrop() {
  return (
    <div className="absolute -inset-6 -z-10">
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#f7931a]/15 to-[#ffcc00]/15 blur-2xl" />
    </div>
  )
}

function TrustChipsRow({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ icon: Icon, text }, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10"
        >
          <Icon className="size-4 text-[#f7931a]" />
          <span className="text-slate-700 dark:text-slate-200">{text}</span>
        </span>
      ))}
    </div>
  )
}

function SectionHeader({ title, subtitle, align = 'center' }) {
  const alignCls = align === 'left' ? 'text-left' : 'text-center'
  return (
    <div className={`${alignCls} mb-10`}>
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
      {subtitle ? <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
    </div>
  )
}

function StepsTimeline({ steps }) {
  return (
    <div className="grid lg:grid-cols-5 gap-4">
      {steps.map((s, idx) => (
        <StepItem
          key={idx}
          number={idx + 1}
          title={s.title}
          description={s.description}
          revealRef={s.ref}
          isLast={idx === steps.length - 1}
        />
      ))}
    </div>
  )
}

function StepItem({ number, title, description, revealRef, isLast }) {
  return (
    <div ref={revealRef} className="card p-6 hover:shadow-xl hover:shadow-orange-200/30 transition">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-gradient-to-r from-[#f7931a] to-[#ffcc00] text-white grid place-items-center font-extrabold">
          {number}
        </div>
        {!isLast ? <div className="hidden lg:block h-px flex-1 bg-gradient-to-r from-[#f7931a]/50 to-transparent" /> : null}
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  )
}

function CalloutCard({ icon: Icon, title, text }) {
  return (
    <div className="mt-6 card p-5 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex items-center justify-center size-9 rounded-xl bg-black/5 dark:bg-white/10">
          <Icon className="size-5 text-[#f7931a]" />
        </div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</div>
        </div>
      </div>
    </div>
  )
}

function TechDiagramCard() {
  const nodes = useMemo(
    () => [
      { label: 'SHA-256', icon: BadgeCheck },
      { label: 'Merkle tree', icon: Link2 },
      { label: 'Public calendar', icon: CalendarClock },
      { label: 'Bitcoin anchor', icon: ShieldCheck },
    ],
    []
  )

  return (
    <div className="card p-6 md:p-8 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur">
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">Flujo de sellado</div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {nodes.map((n, idx) => (
          <div key={n.label} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10">
              <n.icon className="size-4 text-[#f7931a]" />
              {n.label}
            </span>
            {idx < nodes.length - 1 ? <span className="text-slate-400">→</span> : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <MiniStat icon={CalendarClock} title="Calendarios" value="Públicos" />
        <MiniStat icon={Clock} title="Anclaje" value="En horas" />
        <MiniStat icon={ShieldCheck} title="Red" value="Bitcoin" />
        <MiniStat icon={BadgeCheck} title="Prueba" value=".ots" />
      </div>
    </div>
  )
}

function MiniStat({ icon: Icon, title, value }) {
  return (
    <div className="rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <Icon className="size-4" />
        {title}
      </div>
      <div className="mt-1 text-lg font-extrabold">{value}</div>
    </div>
  )
}

function DeliverableCard({ type, title, desc, bullets }) {
  const ref = useReveal(0)
  return (
    <div ref={ref} className="card p-6 md:p-7 hover:shadow-xl hover:shadow-orange-200/30 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
            <FileText className="size-4" />
            <span className="font-semibold">{type}</span>
          </div>
          <h3 className="mt-3 text-xl font-extrabold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
        <div className="hidden sm:flex items-center justify-center size-12 rounded-2xl bg-gradient-to-r from-[#f7931a] to-[#ffcc00] text-white shadow-sm">
          <Check className="size-6" />
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex items-center justify-center size-5 rounded-full bg-black/5 dark:bg-white/10">
              <Check className="size-3 text-[#f7931a]" />
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FaqAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-3">
        {items.map((it, idx) => {
          const open = openIdx === idx
          const Icon = it.icon
          return (
            <div key={it.title} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? -1 : idx)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center size-9 rounded-xl bg-black/5 dark:bg-white/10">
                    <Icon className="size-5 text-[#f7931a]" />
                  </span>
                  <div className="font-bold">{it.title}</div>
                </div>
                <span className="text-slate-400">{open ? '−' : '+'}</span>
              </button>

              <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {it.content}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InfoBannerV2({ icon: Icon, title, body, ctaLabel, ctaHref, external = false }) {
  return (
    <div className="card p-6 md:p-7 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur">
      <div className="flex flex-col md:flex-row md:items-start gap-5">
        <div className="inline-flex items-center justify-center size-11 rounded-2xl bg-black/5 dark:bg-white/10 shrink-0">
          <Icon className="size-6 text-[#f7931a]" />
        </div>

        <div className="flex-1">
          <div className="text-lg font-extrabold tracking-tight">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</div>
        </div>

        {ctaLabel && ctaHref ? (
          <div className="shrink-0">
            <a
              href={ctaHref}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-white bg-[#f7931a] hover:bg-[#e67e00] shadow-lg shadow-orange-200/40 transition"
            >
              <Mail className="size-4" />
              {ctaLabel}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function FinalCTA() {
  const ref = useReveal(120)
  return (
    <div
      ref={ref}
      className="mt-8 card p-6 md:p-8 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Empieza a sellar archivos ahora</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Genera una prueba criptográfica sólida en segundos y descarga tu .ots y certificado PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white bg-[#f7931a] hover:bg-[#e67e00] shadow-lg shadow-orange-200/40 transition"
          >
            Sellar mi primer archivo <ArrowRight className="size-4" />
          </a>
          <a
            href="/verify"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/15 transition"
          >
            Verificación pública
          </a>
        </div>
      </div>
    </div>
  )
}
