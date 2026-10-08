import React, { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { AnimatedImage, EASE, Icon, Reveal, WhatsAppLink } from "../components";
import { photoKinds, projects } from "./projects";

const filters = [
  { id: "all", label: "Todas" },
  { id: "prototype", label: "Bocetos" },
  { id: "result", label: "Resultados reales" },
];
const allPhotos = projects.flatMap((project) =>
  project.photos.map((photo, index) => ({ project, photo, index })),
);

function PhotoViewer({ project, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [comparing, setComparing] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const photo = project.photos[index];
  const prototype = project.photos.find((item) => item.kind === "prototype");
  const result = project.photos.find((item) => item.kind === "result");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      )
        previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  const move = (direction) => {
    setComparing(false);
    setIndex(
      (current) =>
        (current + direction + project.photos.length) % project.photos.length,
    );
  };
  const selectKind = (kind) => {
    setComparing(false);
    if (photo.kind === kind) return;
    const next = project.photos.findIndex((item) => item.kind === kind);
    if (next !== -1) setIndex(next);
  };

  return (
    <dialog
      ref={dialogRef}
      className="photo-dialog"
      aria-labelledby="viewer-title"
      aria-describedby="viewer-caption"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = [
            ...event.currentTarget.querySelectorAll(
              'button:not([disabled]), a[href], [tabindex="0"]',
            ),
          ];
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <div className="viewer-shell">
        <div className="photo-dialog-header">
          <div>
            <h2 id="viewer-title">{project.name}</h2>
            <p>{project.garment}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="viewer-close"
            aria-label="Cerrar foto"
          >
            <Icon name="close" size={23} />
          </button>
        </div>
        <div className="photo-dialog-body">
          <div
            className={`photo-dialog-stage ${comparing ? "is-comparing" : ""}`}
          >
            {comparing ? (
              <div className="photo-comparison">
                {[prototype, photo.kind === "result" ? photo : result].map(
                  (item) => (
                    <figure key={item.id}>
                      <AnimatedImage
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                      />
                      <figcaption>{photoKinds[item.kind]}</figcaption>
                    </figure>
                  ),
                )}
              </div>
            ) : (
              <AnimatedImage
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
              />
            )}
            {!comparing && project.photos.length > 1 && (
              <>
                <button
                  className="viewer-arrow viewer-previous"
                  aria-label="Foto anterior"
                  onClick={() => move(-1)}
                >
                  <Icon name="left" size={22} />
                </button>
                <button
                  className="viewer-arrow viewer-next"
                  aria-label="Foto siguiente"
                  onClick={() => move(1)}
                >
                  <Icon name="left" size={22} />
                </button>
              </>
            )}
          </div>
          <div className="photo-dialog-details">
            {prototype && result && (
              <button
                className="viewer-compare-button"
                aria-pressed={comparing}
                onClick={() => setComparing(!comparing)}
              >
                {comparing ? "Ver una foto" : "Ver antes y después"}
                <Icon name="cube" size={16} />
              </button>
            )}
            <div
              className="viewer-kind-switch"
              role="group"
              aria-label="Comparar boceto y resultado"
            >
              {Object.entries(photoKinds).map(
                ([kind, label]) =>
                  project.photos.some((item) => item.kind === kind) && (
                    <button
                      key={kind}
                      className={photo.kind === kind ? "active" : ""}
                      aria-pressed={photo.kind === kind}
                      onClick={() => selectKind(kind)}
                    >
                      {label}
                    </button>
                  ),
              )}
            </div>
            <div
              className="viewer-caption"
              aria-live="polite"
              aria-atomic="true"
            >
              <p id="viewer-caption">{photo.alt}</p>
              <span>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(project.photos.length).padStart(2, "0")}
              </span>
            </div>
            <div className="viewer-thumbnails" aria-label="Fotos del proyecto">
              {project.photos.map((item, itemIndex) => (
                <button
                  key={item.id}
                  aria-label={`Ver ${photoKinds[item.kind].toLowerCase()}: ${item.alt}`}
                  aria-pressed={index === itemIndex}
                  className={index === itemIndex ? "active" : ""}
                  onClick={() => {
                    setComparing(false);
                    setIndex(itemIndex);
                  }}
                >
                  <img
                    src={item.src}
                    alt=""
                    loading="lazy"
                    width={item.width}
                    height={item.height}
                  />
                </button>
              ))}
            </div>
            <WhatsAppLink className="button button-red viewer-contact">
              Consultar por WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [selection, setSelection] = useState(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!projects.some((project) => project.id === id)) return;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  const photos = allPhotos.filter(
    ({ project, photo }) =>
      (filter === "all" || photo.kind === filter) &&
      (projectFilter === "all" || project.id === projectFilter),
  );

  return (
    <section
      className="gallery-page"
      id="galeria"
      aria-labelledby="gallery-title"
    >
      <div className="container">
        <Reveal className="gallery-heading" onScroll={false}>
          <a href="/" className="gallery-back">
            <Icon name="left" size={16} /> Inicio
          </a>
          <h1 id="gallery-title">
            GALERÍA<span>.</span>
          </h1>
          <p className="gallery-intro">
            Lo que imaginamos. Lo que entregamos.
            <br />
            Cada proyecto, desde su boceto hasta la prenda terminada.
          </p>
        </Reveal>
        <div className="gallery-toolbar">
          <div
            className="gallery-filters"
            role="group"
            aria-label="Filtrar fotos"
          >
            {filters.map(({ id, label }) => (
              <button
                key={id}
                className={filter === id ? "active" : ""}
                aria-pressed={filter === id}
                aria-controls="photo-mosaic"
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="gallery-project-select">
            Proyecto
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              aria-label="Filtrar por proyecto"
            >
              <option value="all">Todos los proyectos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <p className="gallery-count" role="status">
            {photos.length} {photos.length === 1 ? "foto" : "fotos"}
          </p>
        </div>
        <div
          className="gallery-projects"
          id="photo-mosaic"
          aria-label="Fotos de nuestros trabajos"
        >
          {projects.map((project, projectPosition) => {
            const projectPhotos = photos.filter(
              (item) => item.project.id === project.id,
            );
            if (!projectPhotos.length) return null;
            const hasBoceto = project.photos.some(
              (photo) => photo.kind === "prototype",
            );
            return (
              <section
                className="gallery-project"
                id={project.id}
                key={project.id}
                aria-labelledby={`project-${project.id}`}
              >
                <div className="gallery-project-heading">
                  <div>
                    <span className="project-index">
                      PROYECTO {String(projectPosition + 1).padStart(2, "0")}
                    </span>
                    <h2 id={`project-${project.id}`}>{project.name}</h2>
                    <p>{project.garment}</p>
                  </div>
                  <span
                    className={`project-journey ${hasBoceto ? "has-boceto" : ""}`}
                  >
                    {hasBoceto ? (
                      <>
                        <Icon name="cube" size={14} /> Boceto{" "}
                        <Icon name="arrow" size={14} /> Resultado real
                      </>
                    ) : (
                      <>
                        <Icon name="check" size={14} /> Prendas terminadas
                      </>
                    )}
                  </span>
                </div>
                <div className="photo-mosaic">
                  {projectPhotos.map(({ photo, index }, position) => (
                    <m.button
                      className={`mosaic-card mosaic-card-${photo.kind}`}
                      key={`${filter}-${project.id}-${photo.id}`}
                      data-kind={photo.kind}
                      aria-label={`Abrir ${project.name}: ${photo.alt}`}
                      aria-haspopup="dialog"
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.08 }}
                      transition={{
                        duration: reduced ? 0 : 0.5,
                        delay: reduced
                          ? 0
                          : Math.min((position % 3) * 0.07, 0.14),
                        ease: EASE,
                      }}
                      onClick={() => setSelection({ project, index })}
                    >
                      <span
                        className="mosaic-image"
                        style={{
                          aspectRatio: "1 / 1",
                        }}
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading={
                            projectPosition === 0 && position < 3
                              ? "eager"
                              : "lazy"
                          }
                          decoding="async"
                          width={photo.width}
                          height={photo.height}
                        />
                        <span
                          className={`mosaic-label mosaic-label-${photo.kind}`}
                        >
                          <Icon
                            name={photo.kind === "prototype" ? "cube" : "check"}
                            size={14}
                          />
                          {photoKinds[photo.kind]}
                        </span>
                        <span className="mosaic-expand">
                          <Icon name="diagonal" size={22} />
                        </span>
                      </span>
                      <span className="mosaic-caption">
                        <strong>{project.name}</strong>
                        <span>{project.garment}</span>
                      </span>
                    </m.button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        {photos.length === 0 && (
          <p className="gallery-empty">
            Todavía no hay fotos en esta categoría.
          </p>
        )}
      </div>
      {selection && (
        <PhotoViewer
          key={selection.project.id}
          project={selection.project}
          initialIndex={selection.index}
          onClose={() => setSelection(null)}
        />
      )}
    </section>
  );
}
