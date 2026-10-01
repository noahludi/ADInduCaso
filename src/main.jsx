import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { INSTAGRAM, POST, WHATSAPP } from "./contact";
import "./styles.css";

const PREVIEW = "/images/buzos-preview.webp";
const EASE = [0.22, 1, 0.36, 1];

function Reveal({ children, className, delay = 0, onScroll = true, ...props }) {
  const reduced = useReducedMotion();
  const visible = { opacity: 1, y: 0 };
  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      {...(onScroll
        ? { whileInView: visible, viewport: { once: true, amount: 0.15 } }
        : { animate: visible })}
      transition={{
        duration: reduced ? 0 : 0.65,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}

function AnimatedImage({ ...props }) {
  const reduced = useReducedMotion();
  return (
    <m.img
      initial={reduced ? false : { opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
      {...props}
    />
  );
}

function Icon({ name = "arrow", size = 20, ...props }) {
  const paths = {
    arrow: (
      <>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v16m-6-6 6 6 6-6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    doubleCheck: (
      <>
        <path d="m2 12 4 4L16 6m-5 9 2 2L23 7" />
      </>
    ),
    chat: (
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2 2-6a8.5 8.5 0 1 1 18-4.5Z" />
    ),
    cube: (
      <>
        <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10 9-5m-9 5L3 8m9 5v9M7.5 5.5l9 5" />
      </>
    ),
    print: (
      <>
        <path d="M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v8H6zM17 12h1" />
      </>
    ),
    box: (
      <>
        <path d="m12 3 9 5v12H3V8l9-5ZM3 8h18M12 3v5m-4 5h8" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20.5 11.6a8.6 8.6 0 0 1-12.8 7.5L3 20.5l1.4-4.6a8.6 8.6 0 1 1 16.1-4.3Z" />
        <path d="m8.2 7.1 1.4-.2 1 2.3-.9 1.1a7.2 7.2 0 0 0 3.2 3.2l1.1-.9 2.3 1-.2 1.4c-.2.8-1 1.3-1.8 1.1-3.9-.7-6.6-3.4-7.3-7.3-.1-.8.4-1.5 1.2-1.7Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    shirt: <path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z" />,
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    replay: (
      <>
        <path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" />
      </>
    ),
    left: <path d="m14 6-6 6 6 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a
      href="#inicio"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="AD Indumentaria, inicio"
    >
      <img src="/images/ad-logo.jpg" alt="" width="62" height="62" />
      <span>
        AD <strong>INDUMENTARIA</strong>
      </span>
    </a>
  );
}

function InstagramLink({
  children = "Contanos tu idea",
  className = "",
  icon = "diagonal",
  ...props
}) {
  const reduced = useReducedMotion();
  return (
    <m.a
      href={INSTAGRAM}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
      <Icon name={icon} />
    </m.a>
  );
}

function WhatsAppLink({ children = "WhatsApp", className = "", ...props }) {
  const reduced = useReducedMotion();
  if (!WHATSAPP)
    return (
      <button className={className} disabled {...props}>
        {children}
        <Icon name="whatsapp" />
      </button>
    );
  return (
    <m.a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
      <Icon name="whatsapp" />
    </m.a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav
          className={open ? "navigation is-open" : "navigation"}
          id="main-nav"
          aria-label="Navegación principal"
        >
          <a href="#proceso" onClick={() => setOpen(false)}>
            Cómo trabajamos
          </a>
          <a href="#trabajos" onClick={() => setOpen(false)}>
            Trabajos
          </a>
          <a href="#preguntas" onClick={() => setOpen(false)}>
            Preguntas frecuentes
          </a>
        </nav>
        <div className="header-socials">
          <InstagramLink
            className="header-contact"
            icon="instagram"
            aria-label="Instagram de AD Indumentaria"
          >
            <span>Instagram</span>
          </InstagramLink>
          <WhatsAppLink
            className="header-contact header-whatsapp"
            aria-label="WhatsApp de AD Indumentaria"
          >
            <span>WhatsApp</span>
          </WhatsAppLink>
        </div>
        <button
          className="menu-toggle"
          ref={menuRef}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-controls="main-nav"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <Reveal className="hero-copy" onScroll={false}>
          <h1 id="hero-title">
            VOS LO
            <br />
            IMAGINÁS.
            <br />
            <span>LO HACEMOS.</span>
          </h1>
          <p>Buzos personalizados con tu logo, de la idea al estampado.</p>
          <div className="hero-actions">
            <WhatsAppLink className="button button-red">WhatsApp</WhatsAppLink>
            <InstagramLink className="button button-outline" icon="instagram">
              Instagram
            </InstagramLink>
          </div>
          <a className="text-link process-link" href="#proceso">
            Cómo trabajamos <Icon name="down" size={17} />
          </a>
        </Reveal>
        <Reveal className="hero-art" onScroll={false} delay={0.15}>
          <div className="hero-orbit" aria-hidden="true" />
          <m.div
            className="hoodies-float"
            animate={reduced ? { y: 0 } : { y: [0, -7, 0] }}
            transition={{
              duration: 6,
              repeat: reduced ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              className="hero-hoodies"
              src={PREVIEW}
              alt="Boceto 3D de buzos blanco y negro con cierre y logo azul de El Ramblón en el pecho"
              width="1254"
              height="1254"
              fetchPriority="high"
            />
          </m.div>
          <div className="hand-note">
            Tu marca.
            <br />
            Tu estilo.
            <svg viewBox="0 0 88 58" aria-hidden="true">
              <m.path
                d="M3 7c55-24 86 20 61 41m-9-15 9 17 18-5"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
          </div>
          <div className="preview-tag">
            <span className="tag-icon">
              <Icon name="cube" size={19} />
            </span>
            <span>
              <strong>Boceto 3D</strong>
            </span>
            <span className="live-dot" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Nos contás tu idea",
    short: "La idea",
    icon: "chat",
    description:
      "Mandanos tu logo o una referencia y contanos qué prendas necesitás.",
    checklist: ["Logo o referencia", "Prenda y colores", "Cantidad y talles"],
  },
  {
    title: "La hacemos visible",
    short: "El boceto",
    icon: "cube",
    description: "Te mostramos un boceto 3D y ajustamos el diseño con vos.",
    checklist: [
      "Color de la prenda",
      "Tamaño y ubicación del logo",
      "Los cambios que necesites",
    ],
  },
  {
    title: "Vos das el sí",
    short: "Tu aprobación",
    icon: "check",
    description: "Con tu OK al diseño y al presupuesto, pasamos a producción.",
    checklist: [
      "Diseño aprobado",
      "Talles y cantidades confirmados",
      "Precio y fecha acordados",
    ],
  },
  {
    title: "Manos a la prenda",
    short: "El estampado",
    icon: "print",
    description: "Estampamos el diseño aprobado y revisamos cada prenda.",
    checklist: [
      "Preparación del estampado",
      "Aplicación del logo",
      "Control de terminaciones",
    ],
  },
  {
    title: "Tu idea, puesta",
    short: "La entrega",
    icon: "box",
    description: "Te avisamos cuando está listo y coordinamos la entrega.",
    checklist: ["Pedido completo", "Entrega acordada con vos"],
  },
];

function RamblonLogo() {
  return (
    <div className="ramblon-logo" aria-label="Logo de referencia de El Ramblón">
      <span className="ramblon-monogram">JB</span>
      <span className="ramblon-small">
        MATARIFE <i /> ABASTECEDOR
      </span>
      <strong>EL RAMBLÓN</strong>
      <span className="ramblon-name">JULIO BALLA</span>
    </div>
  );
}

function ChatPreview({ approved = false }) {
  const reduced = useReducedMotion();
  const messages = {
    hidden: { opacity: 0, y: 8 },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.4, ease: EASE },
    },
  };
  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src="/images/ad-logo.jpg" width="42" height="42" alt="" />
        <span>
          <strong>AD Indumentaria</strong>
        </span>
        <Icon name="instagram" size={21} />
      </div>
      <m.div
        className="chat-body"
        initial={reduced ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          shown: {
            transition: {
              staggerChildren: reduced ? 0 : 0.16,
              delayChildren: reduced ? 0 : 0.1,
            },
          },
        }}
      >
        {approved ? (
          <>
            <m.div className="message incoming" variants={messages}>
              <p>¡Así quedaría el diseño final! ¿Lo hacemos?</p>
              <img
                src={PREVIEW}
                className="chat-product"
                alt="Propuesta de buzos personalizada"
              />
              <span className="message-time">10:42</span>
            </m.div>
            <m.div className="message outgoing" variants={messages}>
              <p>
                ¡Me encanta! Está tal cual lo quería 🙌
                <br />
                Dale, avancemos.
              </p>
              <span className="message-time">
                10:43 <Icon name="doubleCheck" size={15} />
              </span>
            </m.div>
            <m.div className="approval-chip" variants={messages}>
              <Icon name="check" size={17} /> Diseño aprobado. ¡A producir!
            </m.div>
          </>
        ) : (
          <>
            <m.div className="message outgoing" variants={messages}>
              <p>¡Hola! Quiero este logo en unos buzos 👋</p>
              <div className="logo-attachment">
                <RamblonLogo />
                <span>logo-el-ramblon.png</span>
              </div>
              <span className="message-time">
                10:30 <Icon name="doubleCheck" size={15} />
              </span>
            </m.div>
            <m.div className="message incoming" variants={messages}>
              <p>
                ¡Hola! Sí, lo hacemos 🙌
                <br />
                ¿En qué colores los imaginás?
              </p>
              <span className="message-time">10:32</span>
            </m.div>
            <m.div className="message outgoing" variants={messages}>
              <p>Blanco y negro, con el logo en el pecho.</p>
              <span className="message-time">
                10:33 <Icon name="doubleCheck" size={15} />
              </span>
            </m.div>
          </>
        )}
      </m.div>
      <span className="chat-disclaimer">Conversación ilustrativa</span>
    </div>
  );
}

function ProcessVisual({ step, onApprove }) {
  const [view, setView] = useState("preview");
  if (step === 0 || step === 2) return <ChatPreview approved={step === 2} />;
  if (step === 1)
    return (
      <div className="mockup-viewer">
        <div className="viewer-top">
          <span>
            <Icon name="cube" size={16} /> TU DISEÑO, ANTES DE PRODUCIR
          </span>
          <span>{view === "preview" ? "01" : "02"} / 02</span>
        </div>
        <AnimatedImage
          key={view}
          src={view === "preview" ? PREVIEW : "/images/trabajo-real-01.webp"}
          alt={
            view === "preview"
              ? "Visualización 3D de los buzos blanco y negro"
              : "Foto de los buzos realmente producidos"
          }
        />
        <div className="viewer-controls">
          <div className="segmented">
            <button
              className={view === "preview" ? "active" : ""}
              aria-pressed={view === "preview"}
              onClick={() => setView("preview")}
            >
              Boceto 3D
            </button>
            <button
              className={view === "real" ? "active" : ""}
              aria-pressed={view === "real"}
              onClick={() => setView("real")}
            >
              Resultado real
            </button>
          </div>
          <span>EL RAMBLÓN</span>
        </div>
        <button className="approve-demo" onClick={onApprove}>
          ¡Así lo quiero! <Icon name="check" size={17} />
        </button>
        <small className="demo-note">Explorá un ejemplo del proceso</small>
      </div>
    );
  if (step === 3)
    return (
      <div className="production-visual">
        <img
          src="/images/trabajo-real-04.webp"
          alt="Detalle real del estampado de El Ramblón sobre el buzo negro"
          loading="lazy"
        />
      </div>
    );
  return (
    <div className="delivery-visual">
      <img
        src="/images/trabajo-real-02.webp"
        alt="Buzos blanco y negro de El Ramblón terminados y listos para entregar"
        loading="lazy"
      />
      <span className="photo-tag">
        <Icon name="check" size={15} /> LISTOS PARA ENTREGAR
      </span>
    </div>
  );
}

function Process() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const step = steps[active];
  const selectByKeyboard = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % steps.length;
    if (event.key === "ArrowLeft")
      next = (index + steps.length - 1) % steps.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = steps.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };
  return (
    <section
      className="process-section"
      id="proceso"
      aria-labelledby="process-title"
    >
      <Reveal className="container">
        <div className="section-heading">
          <div>
            <h2 id="process-title">
              DE UN MENSAJE
              <br />A TU <span className="outline-text">PRÓXIMA PRENDA.</span>
            </h2>
          </div>
        </div>
        <div
          className="step-tabs"
          role="tablist"
          aria-label="Los cinco pasos de tu pedido"
        >
          {steps.map((item, index) => (
            <button
              key={item.short}
              id={`step-tab-${index}`}
              role="tab"
              aria-selected={active === index}
              aria-controls="step-panel"
              tabIndex={active === index ? 0 : -1}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              onClick={() => setActive(index)}
              onKeyDown={(e) => selectByKeyboard(e, index)}
              className={`step-tab ${active === index ? "active" : ""} ${index < active ? "completed" : ""}`}
            >
              <span className="step-number">
                {index < active ? (
                  <Icon name="check" size={18} />
                ) : (
                  `0${index + 1}`
                )}
              </span>
              <span>{item.short}</span>
              <Icon name={item.icon} size={19} />
            </button>
          ))}
        </div>
        <div
          className="process-panel"
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${active}`}
          tabIndex={0}
        >
          <Reveal className="step-copy" key={`copy-${active}`} onScroll={false}>
            <span className="step-overline">
              PASO 0{active + 1} <span>/ 05</span>
            </span>
            <h3>
              {step.title}
              <span>.</span>
            </h3>
            <p>{step.description}</p>
            <ul className="step-checklist">
              {step.checklist.map((item) => (
                <li key={item}>
                  <span>
                    <Icon name="check" size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="step-navigation">
              <button
                className="step-next"
                onClick={() => setActive((active + 1) % 5)}
              >
                {active === 4 ? "Volver al inicio" : "Siguiente paso"}
                <Icon name={active === 4 ? "replay" : "arrow"} size={18} />
              </button>
              <span>0{active + 1} — 05</span>
            </div>
          </Reveal>
          <Reveal
            className="step-visual"
            key={`visual-${active}`}
            delay={0.08}
            onScroll={false}
          >
            <ProcessVisual step={active} onApprove={() => setActive(2)} />
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}

function Work() {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState("real");
  const photos = [
    "/images/trabajo-real-01.webp",
    "/images/trabajo-real-02.webp",
    "/images/trabajo-real-03.webp",
  ];
  return (
    <section
      className="work-section"
      id="trabajos"
      aria-labelledby="work-title"
    >
      <Reveal className="container work-grid">
        <div className="work-gallery">
          <div className="work-main-photo">
            <AnimatedImage
              key={`${mode}-${selected}`}
              src={mode === "real" ? photos[selected] : PREVIEW}
              alt={
                mode === "real"
                  ? [
                      "Buzos blanco y negro de El Ramblón estampados por AD Indumentaria",
                      "Los dos buzos terminados vistos de frente",
                      "Buzo blanco con cierre y logo en el pecho",
                    ][selected]
                  : "Boceto 3D generado como propuesta para los buzos de El Ramblón"
              }
              loading="lazy"
            />
            <div className="gallery-mode">
              <button
                className={mode === "preview" ? "active" : ""}
                aria-pressed={mode === "preview"}
                onClick={() => setMode("preview")}
              >
                El boceto
              </button>
              <button
                className={mode === "real" ? "active" : ""}
                aria-pressed={mode === "real"}
                onClick={() => setMode("real")}
              >
                La realidad <Icon name="check" size={14} />
              </button>
            </div>
          </div>
          <div className="gallery-thumbs">
            {photos.map((photo, index) => (
              <button
                key={photo}
                onClick={() => {
                  setSelected(index);
                  setMode("real");
                }}
                aria-label={`Ver foto ${index + 1} del trabajo terminado`}
                aria-pressed={mode === "real" && selected === index}
                className={
                  mode === "real" && selected === index ? "active" : ""
                }
              >
                <img src={photo} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
        <div className="work-copy">
          <h2 id="work-title">
            NO QUEDA
            <br />
            EN UN <span>BOCETO.</span>
          </h2>
          <div className="project-detail">
            <h3>El Ramblón</h3>
            <p>
              Buzos con cierre en blanco y negro, con el logo de El Ramblón
              estampado en el pecho.
            </p>
          </div>
          <a
            className="text-link work-link"
            href={POST}
            target="_blank"
            rel="noopener noreferrer"
          >
            Mirá el trabajo en Instagram <Icon name="diagonal" size={18} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

const faqs = [
  [
    "¿Necesito tener el logo listo?",
    "Podés mandarnos un logo, una referencia o contarnos tu idea. Te ayudamos a definir el diseño.",
  ],
  [
    "¿Puedo ver cómo queda antes de confirmar?",
    "Sí. Te mostramos un boceto 3D con tu logo antes de pasar a producción.",
  ],
  [
    "¿Puedo pedir cambios en el boceto?",
    "Sí. Ajustamos colores, tamaño y ubicación del logo antes de tu aprobación.",
  ],
  [
    "¿Cómo consulto precios y cantidades?",
    "Escribinos por WhatsApp o Instagram con la prenda, el diseño y la cantidad aproximada.",
  ],
  [
    "¿Cuánto tarda y cómo se entrega?",
    "Depende del diseño y la cantidad. Acordamos la fecha y la entrega al confirmar el pedido.",
  ],
];

function FAQ() {
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();
  return (
    <section className="faq-section" id="preguntas" aria-labelledby="faq-title">
      <Reveal className="container faq-grid">
        <div>
          <h2 id="faq-title">
            ¿TENÉS
            <br />
            <span className="outline-text">PREGUNTAS?</span>
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], i) => (
            <div
              className={`faq-item ${open === i ? "is-open" : ""}`}
              key={question}
            >
              <h3>
                <button
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{question}</span>
                  <Icon name="plus" size={20} />
                </button>
              </h3>
              <m.div
                className="faq-answer"
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                aria-hidden={open !== i}
                inert={open !== i ? true : undefined}
                initial={false}
                animate={{
                  height: open === i ? "auto" : 0,
                  opacity: open === i ? 1 : 0,
                }}
                transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
              >
                <p>{answer}</p>
              </m.div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  return (
    <section
      className="contact-section"
      id="contacto"
      aria-labelledby="contact-title"
    >
      <Reveal className="container contact-inner">
        <h2 id="contact-title">
          BUENO, ¿QUÉ
          <br />
          <span>VAMOS A CREAR?</span>
        </h2>
        <div className="contact-actions">
          <WhatsAppLink className="button button-cream">
            Hablemos por WhatsApp
          </WhatsAppLink>
          <InstagramLink className="button button-outline" icon="instagram">
            Hablemos por Instagram
          </InstagramLink>
        </div>
      </Reveal>
    </section>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <div className="brand-strip" aria-hidden="true">
          <span>TU LOGO</span>
          <span className="strip-star">✳</span>
          <span>TU ESTILO</span>
          <span className="strip-star">✳</span>
          <span>TU IDENTIDAD</span>
          <span className="strip-star">✳</span>
          <span>HECHO PARA VOS</span>
          <span className="strip-star">✳</span>
        </div>
        <Process />
        <Work />
        <FAQ />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Brand footer />
          <div className="footer-socials">
            <WhatsAppLink className="footer-instagram" />
            <InstagramLink className="footer-instagram" icon="instagram">
              @ad.indumentaria77
            </InstagramLink>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} AD Indumentaria</span>
          <a href="#inicio">
            VOLVER ARRIBA <Icon name="arrow" size={13} />
          </a>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.3, ease: EASE }}
      >
        <App />
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>,
);
