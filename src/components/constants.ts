// === CONSTANTES DE DISEÑO ===
export const SELECTED_BORDER_COLOR = "#A46B31" // Color dorado para el tema seleccionado
export const BUTTON_SIZE = 40 // Tamaño del botón en pixels (2.5rem = 40px)
export const BUTTON_RADIUS = BUTTON_SIZE / 2 // Radio para botones circulares (20px)
export const BORDER_WIDTH = 2 // Grosor del borde animado
export const SVG_SIZE = BUTTON_SIZE // El SVG debe tener el mismo tamaño que el botón
export const SVG_CIRCLE_RADIUS = BUTTON_RADIUS - BORDER_WIDTH / 2 // Radio ajustado para que el borde quede dentro del botón

// === CONFIGURACIÓN DE ANIMACIONES ===
export const SWAP_ANIMATION_DURATION = 0.5 // GSAP usa segundos
export const BORDER_ANIMATION_DURATION = 0.6
export const BORDER_DELAY = 0.8 // Sincronizado con View Transition
export const STAGGER_DELAY = 0.1 // Delay entre animaciones de botones

// === CONFIGURACIÓN DE BOX-SHADOW ===
export const BOX_SHADOW_STATES = {
  idle: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  hover: "0 0px 10px 0 rgba(0, 0, 0, 0.2)",
  tap: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
  selected: "0 0 20px 0 rgba(164, 107, 49, 0.9)", // Glow dorado distintivo
}
