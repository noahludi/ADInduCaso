import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { POST } from "./contact";
import {
  Reveal,
  AnimatedImage,
  Icon,
  InstagramLink,
  WhatsAppLink,
  EASE,
} from "./components";
import Gallery from "./gallery/Gallery";
import Process from "./Process";
import "./styles.css";
import "./gallery/gallery.css";

const PREVIEW = "/images/buzos-preview.webp";

function Brand({ footer = false, gallery = false }) {
  return (
    <a
      href={gallery ? "/#inicio" : "#inicio"}
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

function Header({ gallery = false }) {
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
        <Brand gallery={gallery} />
        <nav
          className={open ? "navigation is-open" : "navigation"}
          id="main-nav"
          aria-label="Navegación principal"
        >
          <a
            href={gallery ? "/#proceso" : "#proceso"}
            onClick={() => setOpen(false)}
          >
            Cómo trabajamos
          </a>
          <a
            href={gallery ? "/#trabajos" : "#trabajos"}
            onClick={() => setOpen(false)}
          >
            Trabajos
          </a>
          <a
            href="/galeria/"
            aria-current={gallery ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Galería
          </a>
          <a
            href={gallery ? "/#preguntas" : "#preguntas"}
            onClick={() => setOpen(false)}
          >
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
              alt="Boceto 3D de buzos y camperas en blanco y negro con logo azul de El Ramblón en el pecho"
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
                      "Buzos y camperas en blanco y negro de El Ramblón estampados por AD Indumentaria",
                      "Las prendas terminadas vistas de frente",
                      "Campera blanca con cierre y logo en el pecho",
                    ][selected]
                  : "Boceto 3D generado como propuesta para los buzos y camperas de El Ramblón"
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
              Buzos y camperas en blanco y negro, con el logo de El Ramblón
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
          <a
            className="button button-outline work-gallery-link"
            href="/galeria/"
          >
            Ver galería <Icon name="arrow" size={18} />
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
  const isGallery = /^\/galeria(?:\/|$)/.test(window.location.pathname);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header gallery={isGallery} />
      <main id="contenido">
        {isGallery ? (
          <Gallery />
        ) : (
          <>
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
          </>
        )}
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Brand footer gallery={isGallery} />
          <div className="footer-socials">
            <WhatsAppLink className="footer-instagram" />
            <InstagramLink className="footer-instagram" icon="instagram">
              @ad.indumentaria77
            </InstagramLink>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} AD Indumentaria</span>
          <a href={isGallery ? "#galeria" : "#inicio"}>
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
