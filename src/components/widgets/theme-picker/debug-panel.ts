import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import { Pane } from 'tweakpane'
import { pickerConfig, snapOrbsToSlots } from './config'

gsap.registerPlugin(Draggable)

const PANEL_CLASS = 'tp-dfwv'
const PANEL_SELECTOR = `div.${PANEL_CLASS}`

const EASES = {
  'Cinematográfica (smooth)': 'cubic-bezier(0.25, 1, 0.5, 1)',
  'Rebote (back)': 'back.out(1.7)',
  'Exponencial (expo)': 'expo.out',
  'Circular (circ)': 'circ.out',
  'Suave (power2)': 'power2.out',
}

/** El panel vive por encima de todo el chrome del sitio, si no queda detrás. */
const PANEL_STYLE = `
  div.${PANEL_CLASS} {
    position: fixed;
    top: 1rem;
    left: 1rem;
    right: auto;
    bottom: auto;
    z-index: 2147483647;
  }
`

/** Defaults espejo de theme-picker.css: el panel los sobreescribe como CSS vars. */
const cssVars = { orbSize: 28, strokeWidth: 2 }

let panelMounted = false

const pickerRoots = () => Array.from(document.querySelectorAll<HTMLElement>('.theme-picker'))

const activeIndex = () => {
  const root = pickerRoots()[0]
  if (!root) return 0
  const index = Array.from(root.querySelectorAll('.theme-orb')).findIndex(
    (orb) => orb.getAttribute('aria-selected') === 'true'
  )
  return index >= 0 ? index : 0
}

/** Recoloca la cinta sin animar (cambios de geometría en vivo). */
const snapAll = () => {
  const index = activeIndex()
  pickerRoots().forEach((root) => snapOrbsToSlots(root, index))
}

const dockCenter = () => {
  // La instancia visible: la otra vive con display:none en su wrapper.
  const root = pickerRoots().find((el) => el.getBoundingClientRect().width > 0) ?? pickerRoots()[0]
  const rect = root?.getBoundingClientRect()
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: 0, y: 0 }
}

function createOverlay() {
  const ring = document.createElement('div')
  ring.className = 'theme-picker-debug-ring'
  Object.assign(ring.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    borderRadius: '50%',
    border: '2px solid var(--corner)',
    boxShadow: '0 0 20px var(--corner)',
    translate: '-50% -50%',
    pointerEvents: 'none',
    zIndex: '99998',
    opacity: '0',
  })

  const origin = document.createElement('div')
  origin.className = 'theme-picker-debug-origin'
  Object.assign(origin.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    inlineSize: '8px',
    blockSize: '8px',
    borderRadius: '50%',
    background: 'hotpink',
    boxShadow: '0 0 10px hotpink',
    translate: '-50% -50%',
    pointerEvents: 'none',
    zIndex: '99999',
    opacity: '0',
  })

  document.body.append(ring, origin)
  return { ring, origin }
}

/** Aro de onda desde el centro del dock, disparado por el cambio de tema. */
function watchThemeChange(ring: HTMLElement) {
  new MutationObserver(() => {
    if (!pickerConfig.shockwave) return
    const { x, y } = dockCenter()
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
    gsap.fromTo(
      ring,
      { left: x, top: y, width: 0, height: 0, opacity: 0.8 },
      {
        width: maxRadius * 2.2,
        height: maxRadius * 2.2,
        opacity: 0,
        duration: pickerConfig.lensDuration,
        ease: pickerConfig.lensEase,
      }
    )
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
}

function makeDraggable() {
  const drag = Draggable.create(PANEL_SELECTOR, {
    type: 'x,y',
    allowEventDefault: true,
    trigger: `${PANEL_SELECTOR} button.tp-rotv_b`,
  })

  document.querySelector(PANEL_SELECTOR)?.addEventListener('dblclick', () => {
    gsap.to(PANEL_SELECTOR, {
      x: `+=${drag[0].x * -1}`,
      y: `+=${drag[0].y * -1}`,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => gsap.set(PANEL_SELECTOR, { clearProps: 'all' }),
    })
  })
}

/**
 * Panel de ajuste del picker (animación, espaciado, geometría). Solo se importa
 * en development y con #debug en la URL (ver index.tsx), así que nada de esto
 * entra en el bundle que ve el usuario.
 */
export function mountThemePickerDebug() {
  if (panelMounted || typeof document === 'undefined') return
  panelMounted = true

  const { ring, origin } = createOverlay()
  const style = document.createElement('style')
  style.textContent = PANEL_STYLE
  document.head.append(style)

  const pane = new Pane({ title: 'Theme & Motion Studio', expanded: true })
  document.querySelector(PANEL_SELECTOR)?.setAttribute('data-ko-skip', '')

  const tema = pane.addFolder({ title: 'Tema' })
  tema.addBinding(pickerConfig, 'debug', { label: 'X-Ray' }).on('change', ({ value }) => {
    pickerRoots().forEach((root) => {
      root.dataset.themeDebug = String(value)
    })
  })

  const cinta = pane.addFolder({ title: 'Cinta' })
  cinta.addBinding(pickerConfig, 'shiftDuration', {
    min: 0.1,
    max: 2,
    step: 0.05,
    label: 'Duración shift (s)',
  })
  cinta.addBinding(pickerConfig, 'shiftEase', { label: 'Ease shift', options: EASES })
  cinta.addBinding(pickerConfig, 'shiftStagger', {
    min: 0,
    max: 0.3,
    step: 0.01,
    label: 'Stagger shift',
  })
  cinta
    .addBinding(pickerConfig.slotGap, 'vertical', {
      min: 24,
      max: 64,
      step: 1,
      label: 'Gap vertical',
    })
    .on('change', snapAll)
  cinta
    .addBinding(pickerConfig.slotGap, 'horizontal', {
      min: 24,
      max: 72,
      step: 1,
      label: 'Gap horizontal',
    })
    .on('change', snapAll)
  cinta
    .addBinding(pickerConfig, 'inactiveOpacity', {
      min: 0,
      max: 1,
      step: 0.05,
      label: 'Opacidad inactivos',
    })
    .on('change', snapAll)
  cinta
    .addBinding(cssVars, 'orbSize', { min: 14, max: 40, step: 1, label: 'Tamaño orbe (px)' })
    .on('change', ({ value }) => {
      pickerRoots().forEach((root) => root.style.setProperty('--orb-size', `${value}px`))
    })

  const anillo = pane.addFolder({ title: 'Anillo' })
  anillo.addBinding(pickerConfig, 'traceDelay', {
    min: 0,
    max: 3,
    step: 0.05,
    label: 'Delay trazo (s)',
  })
  anillo.addBinding(pickerConfig, 'traceDuration', {
    min: 0.1,
    max: 3,
    step: 0.05,
    label: 'Duración trazo (s)',
  })
  anillo
    .addBinding(cssVars, 'strokeWidth', { min: 1, max: 6, step: 0.5, label: 'Grosor trazo' })
    .on('change', ({ value }) => {
      pickerRoots().forEach((root) => root.style.setProperty('--stroke-width', String(value)))
    })

  const lente = pane.addFolder({ title: 'Lente' })
  lente.addBinding(pickerConfig, 'lensDuration', {
    min: 0.2,
    max: 2,
    step: 0.05,
    label: 'Duración lente (s)',
  })
  lente.addBinding(pickerConfig, 'lensEase', { label: 'Ease lente', options: EASES })
  lente.addBinding(pickerConfig, 'shockwave', { label: 'Aro de onda' })

  const lenteScrub = { radius: 0 }
  lente
    .addBinding(lenteScrub, 'radius', { min: 0, max: 100, step: 1, label: 'Scrub lente' })
    .on('change', ({ value }) => {
      const { x, y } = dockCenter()
      const maxRadius = Math.hypot(window.innerWidth, window.innerHeight)
      const current = (value / 100) * maxRadius
      gsap.set(ring, {
        left: x,
        top: y,
        width: current * 2,
        height: current * 2,
        opacity: value > 0 && value < 100 ? 0.9 : 0,
      })
    })

  const diagnostico = pane.addFolder({ title: 'Diagnóstico', expanded: false })
  diagnostico
    .addBinding(pickerConfig, 'showOrigin', { label: 'Punto de origen' })
    .on('change', ({ value }) => {
      const { x, y } = dockCenter()
      gsap.set(origin, { left: x, top: y, opacity: value ? 1 : 0 })
    })
  diagnostico.addBinding(pickerConfig, 'introDelay', {
    min: 0,
    max: 2,
    step: 0.05,
    label: 'Delay intro (s)',
  })

  watchThemeChange(ring)
  makeDraggable()
}
