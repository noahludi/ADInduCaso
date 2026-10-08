import React, { useRef, useState } from "react";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { EASE, Icon } from "./components";
import "./process.css";

const IMAGE_ROOT = "/images/galeria/el-amigo";
const steps = [
  {
    title: "Nos contás tu idea",
    short: "La referencia",
    icon: "chat",
    description:
      "Una foto, tu logo o esa idea que tenés en la cabeza. Ese es el punto de partida.",
    detail: "Elegimos la prenda, los colores y dónde va tu diseño.",
    label: "01 / EL MOTIVO",
    image: "referencia.webp",
  },
  {
    title: "La hacemos visible",
    short: "El boceto",
    icon: "cube",
    description:
      "Tu referencia toma forma sobre la prenda. Así podés ver cómo va a quedar antes de producir.",
    detail: "Ajustamos el tamaño, la ubicación y los colores con vos.",
    label: "02 / EL BOCETO",
    image: "boceto-espalda.webp",
  },
  {
    title: "Vos das el sí",
    short: "Tu aprobación",
    icon: "check",
    description:
      "Miramos cada detalle juntos. Cuando el diseño está como lo imaginaste, nos das el OK.",
    detail: "Confirmamos el diseño, los talles y las cantidades.",
    label: "03 / DISEÑO APROBADO",
    image: "boceto-espalda.webp",
  },
  {
    title: "Manos a la prenda",
    short: "El estampado",
    icon: "print",
    description:
      "El boceto se convierte en estampado. Tu diseño pasa de la pantalla a una prenda real.",
    detail: "Aplicamos el diseño y revisamos las terminaciones.",
    label: "04 / DEL BOCETO A LA PRENDA",
    image: "espalda.webp",
  },
  {
    title: "Tu idea, puesta",
    short: "La realidad",
    icon: "box",
    description:
      "La misma idea, ahora lista para usar. Esto es lo que entregamos: tu identidad en una prenda.",
    detail: "El Amigo del Chamamecero · trabajo terminado por AD.",
    label: "05 / EL RESULTADO REAL",
    image: "espalda.webp",
  },
];

export default function Process() {
  const trackRef = useRef(null);
  const tabRefs = useRef([]);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(4, Math.max(0, Math.floor(value * 5))));
  });
  const referenceOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.23],
    [1, 1, 0],
  );
  const referenceScale = useTransform(scrollYProgress, [0, 0.23], [1, 1.12]);
  const mockupOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.23, 0.78, 0.84],
    [0, 0, 1, 1, 0],
  );
  const mockupScale = useTransform(
    scrollYProgress,
    [0.12, 0.25, 0.6],
    [0.82, 1, 1],
  );
  const resultOpacity = useTransform(scrollYProgress, [0.6, 0.62], [0, 1]);
  const resultClip = useTransform(
    scrollYProgress,
    [0.62, 0.8],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const scanPosition = useTransform(
    scrollYProgress,
    [0.62, 0.8],
    ["0%", "100%"],
  );
  const scanOpacity = useTransform(
    scrollYProgress,
    [0.6, 0.63, 0.77, 0.8],
    [0, 1, 1, 0],
  );
  const step = steps[active];

  const goToStep = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: start + distance * (index / 5 + 0.055),
      behavior: reduced ? "instant" : "smooth",
    });
    setActive(index);
  };
  const selectByKeyboard = (event, index) => {
    const next = {
      ArrowRight: (index + 1) % 5,
      ArrowLeft: (index + 4) % 5,
      Home: 0,
      End: 4,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    goToStep(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <section
      className="process-section scroll-process"
      id="proceso"
      aria-labelledby="process-title"
    >
      <div className="process-track" ref={trackRef}>
        <div className="process-sticky container">
          <div className="section-heading">
            <h2 id="process-title">
              DE UNA IDEA
              <br />A TU <span className="outline-text">PRÓXIMA PRENDA.</span>
            </h2>
            <p className="process-scroll-hint">
              <Icon name="down" size={16} /> Scrolleá y mirá cómo toma forma
            </p>
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
                onClick={() => goToStep(index)}
                onKeyDown={(event) => selectByKeyboard(event, index)}
                className={`step-tab ${active === index ? "active" : ""} ${index < active ? "completed" : ""}`}
              >
                <span className="step-number">
                  {index < active ? (
                    <Icon name="check" size={15} />
                  ) : (
                    `0${index + 1}`
                  )}
                </span>
                <span>{item.short}</span>
                <Icon name={item.icon} size={18} />
              </button>
            ))}
          </div>
          <div className="process-progress" aria-hidden="true">
            <m.span style={{ scaleX: scrollYProgress }} />
          </div>
          <div
            className="process-panel"
            id="step-panel"
            role="tabpanel"
            aria-labelledby={`step-tab-${active}`}
            tabIndex={0}
            data-step={active}
          >
            <m.div
              className="step-copy"
              key={active}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
            >
              <span className="step-overline">
                PASO 0{active + 1} <span>/ 05</span>
              </span>
              <h3>
                {step.title}
                <span>.</span>
              </h3>
              <p>{step.description}</p>
              <p className="process-detail">
                <Icon name="check" size={15} /> {step.detail}
              </p>
              <div className="step-navigation">
                <button
                  className="step-next"
                  onClick={() => goToStep((active + 1) % 5)}
                >
                  {active === 4 ? "Volver al inicio" : "Siguiente paso"}
                  <Icon name={active === 4 ? "replay" : "arrow"} size={18} />
                </button>
                <span>0{active + 1} — 05</span>
              </div>
            </m.div>
            <div
              className={`step-visual transformation-visual stage-${active}`}
            >
              <div className="transformation-top">
                <span>EL AMIGO DEL CHAMAMECERO</span>
                <span>UN TRABAJO REAL DE AD</span>
              </div>
              <div
                className="transformation-frame"
                role="img"
                aria-label={
                  active === 0
                    ? "Detalle del motivo de referencia de El Amigo del Chamamecero"
                    : active < 3
                      ? "Boceto de la remera negra con el acordeón y el logo en la espalda"
                      : "Foto de la remera terminada con el mismo diseño estampado"
                }
              >
                <div className="design-grid" aria-hidden="true" />
                <m.img
                  className="transformation-image reference-image"
                  src={`${IMAGE_ROOT}/referencia.webp`}
                  alt=""
                  width="1050"
                  height="1220"
                  style={
                    reduced
                      ? { opacity: active === 0 ? 1 : 0 }
                      : { opacity: referenceOpacity, scale: referenceScale }
                  }
                />
                <m.img
                  className="transformation-image mockup-image"
                  src={`${IMAGE_ROOT}/boceto-espalda.webp`}
                  alt=""
                  width="1400"
                  height="1497"
                  style={
                    reduced
                      ? { opacity: active === 1 || active === 2 ? 1 : 0 }
                      : { opacity: mockupOpacity, scale: mockupScale }
                  }
                />
                <m.img
                  className="transformation-image result-image"
                  src={`${IMAGE_ROOT}/espalda.webp`}
                  alt=""
                  width="1400"
                  height="1400"
                  style={
                    reduced
                      ? { opacity: active >= 3 ? 1 : 0 }
                      : { opacity: resultOpacity, clipPath: resultClip }
                  }
                />
                {!reduced && (
                  <m.div
                    className="print-scan"
                    aria-hidden="true"
                    style={{ left: scanPosition, opacity: scanOpacity }}
                  >
                    <span>ESTAMPANDO</span>
                  </m.div>
                )}
                {active === 2 && (
                  <m.span
                    className="design-approved"
                    initial={reduced ? false : { scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Icon name="check" size={17} /> DISEÑO APROBADO
                  </m.span>
                )}
                <span className="transformation-label">{step.label}</span>
              </div>
              <div className="transformation-bottom">
                <span>
                  La referencia <Icon name="arrow" size={13} /> El boceto{" "}
                  <Icon name="arrow" size={13} /> La realidad
                </span>
                <a href="/galeria/#el-amigo">
                  Ver este proyecto <Icon name="diagonal" size={13} />
                </a>
              </div>
            </div>
          </div>
          <div className="process-footnote">
            <span>SEGUÍ BAJANDO. TU IDEA VA TOMANDO FORMA.</span>
            <span>FOTO / BOCETO / PRENDA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
