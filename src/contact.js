export const INSTAGRAM = "https://www.instagram.com/ad.indumentaria77/";
export const POST = "https://www.instagram.com/p/Db8693eiQmk/";

// Número internacional de AD, sin espacios ni signos.
export const WHATSAPP_NUMBER = "5493434698263";
export const WHATSAPP_MESSAGE =
  "¡Hola AD! Quiero consultar por unas prendas personalizadas.";
export const WHATSAPP = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  : null;
