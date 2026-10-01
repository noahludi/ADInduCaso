import React from "react";
import { m, useReducedMotion } from "motion/react";
import { INSTAGRAM, WHATSAPP } from "./contact";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  onScroll = true,
  ...props
}) {
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

export function AnimatedImage({ ...props }) {
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

export function Icon({ name = "arrow", size = 20, ...props }) {
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

export function InstagramLink({
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

export function WhatsAppLink({
  children = "WhatsApp",
  className = "",
  ...props
}) {
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
