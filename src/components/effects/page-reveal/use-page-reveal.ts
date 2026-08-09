import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'
import { OverlayScrollbars } from 'overlayscrollbars'
import { useRef, useEffect, type RefObject } from 'react'
import { usePathname } from 'next/navigation'

gsap.registerPlugin(useGSAP, SplitText, CustomEase)

CustomEase.create('hop', '0.9, 0, 0.1, 1')
CustomEase.create('glide', '0.8, 0, 0.2, 1')

// ============================================================
// TIMING CONFIG — tweak these to adjust the animation rhythm
// ============================================================

// --- Overlay ---
const OVERLAY_DELAY = 1
const OVERLAY_PART_DURATION = 0.3
const OVERLAY_EASE = 'hop'
const SQUARE_OFFSET = '<0.3'

// --- Corners (initial fly-out) ---
const CORNERS_FLY_DURATION = 0.3
const CORNERS_FLY_EASE = 'hop'

// --- Frames ---
const FRAMES_DURATION = 0.3
const FRAMES_EASE = 'hop'

// --- Images (visual) ---
const INTRO_IMG_SCALE = 0.2
const INTRO_IMG_GAP = 40
const INTRO_IMG_BORDER_RADIUS = '2.5rem'
const INTRO_IMG_OFFSCREEN_MULTIPLIER = 1.3

// --- Images (slide to center) ---
const IMG_CENTER_OFFSET = '<0.025'
const IMG_CENTER_DURATION = 1.5
const IMG_CENTER_STAGGER = 0.025
const IMG_CENTER_EASE = 'glide'

// --- Images (spread & hero expand) ---
const IMG_SPREAD_DURATION = 1.5
const IMG_SPREAD_EASE = 'glide'
const HERO_EXPAND_DURATION = 1.5
const HERO_EXPAND_EASE = 'glide'

// --- Text reveal ---
const NAV_TEXT_OFFSET = '<'
const NAV_TEXT_DURATION = 1
const NAV_TEXT_STAGGER = 0.1
const NAV_TEXT_EASE = 'power3.out'

const HEADER_TEXT_OFFSET = '<'
const HEADER_TEXT_DURATION = 1
const HEADER_TEXT_STAGGER = 0.1
const HEADER_TEXT_EASE = 'power3.out'

// --- Corner snap ---
const CORNER_SIZE = 60
const CORNER_GAP_MOBILE = 15
const CORNER_GAP_DESKTOP = 30
const MOBILE_BREAKPOINT = 640

// --- Text line initial offset ---
const LINE_INITIAL_Y = '125%'
// ============================================================

export function usePageReveal(containerRef: RefObject<HTMLDivElement | null>) {
  const snapRef = useRef<(() => void) | null>(null)
  const osRef = useRef<OverlayScrollbars | null>(null)
  const pathname = usePathname()

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const vw = window.innerWidth
      const vh = window.innerHeight
      const isMobile = vw < MOBILE_BREAKPOINT
      const off = (isMobile ? CORNER_GAP_MOBILE : CORNER_GAP_DESKTOP) + CORNER_SIZE / 2

      gsap.set('.corner-top-r, .corner-top-l, .corner-bottom-l, .corner-bottom-r', {
        xPercent: -50,
        yPercent: -50,
      })

      // --- Image setup ---
      const introImages = container.querySelectorAll<HTMLElement>('.intro-img')
      const introImgRotations = [-15, 5, -7.5, 10, -2.5]
      const introImgScaleWidth = vw * INTRO_IMG_SCALE
      const introImgRowWidth = introImgScaleWidth * 5 + INTRO_IMG_GAP * 4
      const introImgCenteredX = (vw - introImgRowWidth) / 2
      const introImgOffScreenX = introImgCenteredX - vw * INTRO_IMG_OFFSCREEN_MULTIPLIER

      introImages.forEach((img, i) => {
        const centeredX =
          introImgCenteredX +
          i * (introImgScaleWidth + INTRO_IMG_GAP) +
          introImgScaleWidth / 2 -
          vw / 2
        const offScreenX =
          introImgOffScreenX +
          i * (introImgScaleWidth + INTRO_IMG_GAP) +
          introImgScaleWidth / 2 -
          vw / 2
        gsap.set(img, {
          scale: INTRO_IMG_SCALE,
          x: offScreenX,
          rotation: introImgRotations[i],
          borderRadius: INTRO_IMG_BORDER_RADIUS,
        })
        img.dataset.centeredX = String(centeredX)
      })

      // --- Text split ---
      // Make sure we only split text that actually exists.
      const textsToSplit = container.querySelectorAll('.home-nav, .footer-block')
      if (textsToSplit.length > 0) {
        SplitText.create(textsToSplit, {
          type: 'lines',
          linesClass: 'line',
          mask: 'lines',
        })
        gsap.set('.line', { y: LINE_INITIAL_Y })
      }

      const tl = gsap.timeline({ delay: OVERLAY_DELAY })

      // --- Phase 1: Semicolon ---
      tl.to('.colon', {
        opacity: 0,
        y: '70%',
        duration: OVERLAY_PART_DURATION,
        ease: OVERLAY_EASE,
      })
      tl.to(
        '.square',
        {
          opacity: 0,
          duration: 0,
        },
        SQUARE_OFFSET
      )
      tl.to(
        '.corner-top-r',
        {
          x: vw / 2 - off,
          y: -(vh / 2) + off,
          duration: CORNERS_FLY_DURATION,
          ease: CORNERS_FLY_EASE,
        },
        '<'
      )
      tl.to(
        '.corner-top-l',
        {
          x: -(vw / 2) + off,
          y: -(vh / 2) + off,
          duration: CORNERS_FLY_DURATION,
          ease: CORNERS_FLY_EASE,
        },
        '<'
      )
      tl.to(
        '.corner-bottom-l',
        {
          x: -(vw / 2) + off,
          y: vh / 2 - off,
          duration: CORNERS_FLY_DURATION,
          ease: CORNERS_FLY_EASE,
        },
        '<'
      )
      tl.to(
        '.corner-bottom-r',
        {
          x: vw / 2 - off,
          y: vh / 2 - off,
          duration: CORNERS_FLY_DURATION,
          ease: CORNERS_FLY_EASE,
        },
        '<'
      )
      tl.to(
        '.frame-top-r',
        {
          x: vw / 2,
          y: -(vh / 2),
          duration: FRAMES_DURATION,
          ease: FRAMES_EASE,
        },
        '<'
      )
      tl.to(
        '.frame-bottom-l',
        {
          x: -(vw / 2),
          y: vh / 2,
          duration: FRAMES_DURATION,
          ease: FRAMES_EASE,
        },
        '<'
      )

      // --- Phase 2: Show white overlay + cards ---
      tl.to(
        '.cards-overlay',
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '-=0.6'
      )

      // --- Phase 3: Image slide to center ---
      tl.to(
        introImages,
        {
          x: (_, target) => parseFloat(target.dataset.centeredX!),
          duration: IMG_CENTER_DURATION,
          ease: IMG_CENTER_EASE,
          stagger: IMG_CENTER_STAGGER,
        },
        IMG_CENTER_OFFSET
      )

      // --- Phase 4: Side images spread, hero expands ---
      tl.to('.intro-img:nth-child(1), .intro-img:nth-child(2)', {
        x: '-100vw',
        duration: IMG_SPREAD_DURATION,
        ease: IMG_SPREAD_EASE,
      })

      tl.to(
        '.intro-img:nth-child(4), .intro-img:nth-child(5)',
        {
          x: '100vw',
          duration: IMG_SPREAD_DURATION,
          ease: IMG_SPREAD_EASE,
        },
        '<'
      )

      // Expand the hero card to cover the screen
      tl.to(
        '.hero-img',
        {
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          borderRadius: 0,
          duration: HERO_EXPAND_DURATION,
          ease: HERO_EXPAND_EASE,
        },
        '<'
      )

      // Hide the white background behind the hero image just in case
      tl.set('.cards-overlay__bg', { opacity: 0 }, '<0.5')
      tl.set('.preloader-overlay', { visibility: 'hidden' }, '<0.5')

      // --- Phase 5: Reveal Content ---
      tl.call(() => {
        const content = document.querySelector('.page-content')
        if (content) {
          content.classList.add('visible')
        }
      })

      // Push cards overlay behind content so it stays as the page background
      tl.set(
        '.cards-overlay',
        {
          zIndex: 0,
        },
        '<'
      )

      // Slide in version badge from left
      tl.from(
        '.version-badge',
        {
          xPercent: -100,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
        },
        '<'
      )

      // Slide in theme picker from right
      tl.from(
        '.theme-picker-desktop',
        {
          xPercent: 100,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
        },
        '<'
      )

      // --- Phase 6: Text reveal ---
      if (textsToSplit.length > 0) {
        tl.to(
          '.home-nav .line',
          {
            y: '0%',
            duration: NAV_TEXT_DURATION,
            stagger: NAV_TEXT_STAGGER,
            ease: NAV_TEXT_EASE,
          },
          NAV_TEXT_OFFSET
        )

        tl.to(
          '.footer-block .line',
          {
            y: '0%',
            duration: HEADER_TEXT_DURATION,
            stagger: HEADER_TEXT_STAGGER,
            ease: HEADER_TEXT_EASE,
          },
          HEADER_TEXT_OFFSET
        )
      }

      let resize: (() => void) | null = null
      let prevNeedsScroll = false
      let scrollbarShown = false
      let osInstance: OverlayScrollbars | null = null

      const initScrollbar = () => {
        if (!osInstance) {
          osInstance = OverlayScrollbars(document.body, {
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: {
              theme: 'os-theme-sayago',
              visibility: 'auto',
              autoHide: 'never',
              autoHideSuspend: true,
            },
          })
          osRef.current = osInstance
        }
      }

      const showScrollbar = () => {
        initScrollbar()
        if (!scrollbarShown) {
          scrollbarShown = true
          gsap.fromTo(
            '.os-scrollbar-handle',
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set('.os-scrollbar-handle', { clearProps: 'opacity' })
              },
            }
          )
        } else {
          gsap.set('.os-scrollbar-handle', { clearProps: 'opacity' })
        }
      }

      // Snap corners to correct edges after frames clear
      tl.call(() => {
        const snap = () => {
          // Skip while a page transition has the semicolon overlay visible
          const overlay = document.querySelector<HTMLElement>('.preloader-overlay')
          if (overlay && getComputedStyle(overlay).visibility === 'visible') return
          const gap = window.innerWidth < MOBILE_BREAKPOINT ? CORNER_GAP_MOBILE : CORNER_GAP_DESKTOP
          const vw = window.innerWidth
          const vh = window.innerHeight
          const osState = osInstance && !osInstance.state().destroyed ? osInstance.state() : null
          const scrollExtent = osState
            ? osState.scrollCoordinates.end.y
            : document.documentElement.scrollHeight - vh
          const needsScroll = scrollExtent > 0
          const shouldAnimate = needsScroll && !prevNeedsScroll
          prevNeedsScroll = needsScroll

          container.style.position = 'relative'

          const pin = (el: HTMLElement, pos: string, props: Record<string, string>) => {
            el.style.position = pos
            el.style.transform = 'none'
            el.style.zIndex = '100'
            el.style.visibility = 'visible'
            el.style.width = CORNER_SIZE + 'px'
            el.style.height = CORNER_SIZE + 'px'
            el.style.backgroundColor = 'var(--corner)'
            Object.entries(props).forEach(([k, v]) => {
              el.style.setProperty(k, v)
            })
          }

          const setup = (el: HTMLElement, clip: string) => {
            if (el.parentElement !== container) container.appendChild(el)
            el.style.clipPath = clip
          }

          // Top corners: always fixed at viewport top
          container.querySelectorAll<HTMLElement>('.corner-top-r').forEach((el) => {
            pin(el, 'fixed', {
              left: vw - gap - CORNER_SIZE + 'px',
              top: gap + 'px',
              bottom: 'auto',
              right: 'auto',
            })
          })
          container.querySelectorAll<HTMLElement>('.corner-top-l').forEach((el) => {
            pin(el, 'fixed', { left: gap + 'px', top: gap + 'px', bottom: 'auto', right: 'auto' })
          })

          // Bottom corners
          if (needsScroll && shouldAnimate) {
            // Step 1: fixed at viewport bottom
            container.querySelectorAll<HTMLElement>('.corner-bottom-l').forEach((el) => {
              setup(el, 'polygon(0 0, 30% 0, 30% 70%, 100% 70%, 100% 100%, 0 100%)')
              pin(el, 'fixed', {
                left: gap + 'px',
                top: vh - gap - CORNER_SIZE + 'px',
                right: 'auto',
                bottom: 'auto',
              })
            })
            container.querySelectorAll<HTMLElement>('.corner-bottom-r').forEach((el) => {
              setup(el, 'polygon(70% 0, 100% 0, 100% 100%, 0 100%, 0 70%, 70% 70%)')
              pin(el, 'fixed', {
                left: vw - gap - CORNER_SIZE + 'px',
                top: vh - gap - CORNER_SIZE + 'px',
                right: 'auto',
                bottom: 'auto',
              })
            })

            showScrollbar()

            // Step 2: slide down, then switch to absolute
            gsap.to('.corner-bottom-l, .corner-bottom-r', {
              y: scrollExtent,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                container.querySelectorAll<HTMLElement>('.corner-bottom-l').forEach((el) => {
                  pin(el, 'absolute', {
                    left: gap + 'px',
                    bottom: gap + 'px',
                    right: 'auto',
                    top: 'auto',
                  })
                  el.style.clipPath = 'polygon(0 0, 30% 0, 30% 70%, 100% 70%, 100% 100%, 0 100%)'
                })
                container.querySelectorAll<HTMLElement>('.corner-bottom-r').forEach((el) => {
                  pin(el, 'absolute', {
                    right: gap + 'px',
                    bottom: gap + 'px',
                    left: 'auto',
                    top: 'auto',
                  })
                  el.style.clipPath = 'polygon(70% 0, 100% 0, 100% 100%, 0 100%, 0 70%, 70% 70%)'
                })
              },
            })
          } else if (needsScroll) {
            container.querySelectorAll<HTMLElement>('.corner-bottom-l').forEach((el) => {
              setup(el, 'polygon(0 0, 30% 0, 30% 70%, 100% 70%, 100% 100%, 0 100%)')
              pin(el, 'absolute', {
                left: gap + 'px',
                bottom: gap + 'px',
                right: 'auto',
                top: 'auto',
              })
            })
            container.querySelectorAll<HTMLElement>('.corner-bottom-r').forEach((el) => {
              setup(el, 'polygon(70% 0, 100% 0, 100% 100%, 0 100%, 0 70%, 70% 70%)')
              pin(el, 'absolute', {
                right: gap + 'px',
                bottom: gap + 'px',
                left: 'auto',
                top: 'auto',
              })
            })
            showScrollbar()
          } else {
            container.querySelectorAll<HTMLElement>('.corner-bottom-l').forEach((el) => {
              setup(el, 'polygon(0 0, 30% 0, 30% 70%, 100% 70%, 100% 100%, 0 100%)')
              pin(el, 'fixed', {
                left: gap + 'px',
                top: vh - gap - CORNER_SIZE + 'px',
                right: 'auto',
                bottom: 'auto',
              })
            })
            container.querySelectorAll<HTMLElement>('.corner-bottom-r').forEach((el) => {
              setup(el, 'polygon(70% 0, 100% 0, 100% 100%, 0 100%, 0 70%, 70% 70%)')
              pin(el, 'fixed', {
                left: vw - gap - CORNER_SIZE + 'px',
                top: vh - gap - CORNER_SIZE + 'px',
                right: 'auto',
                bottom: 'auto',
              })
            })
            showScrollbar()
          }
        }
        snap()
        snapRef.current = snap
        resize = snap
        window.addEventListener('resize', snap)
      })

      return () => {
        if (osInstance) {
          osInstance.destroy()
          osInstance = null
        }
        if (resize) window.removeEventListener('resize', resize)
      }
    },
    { scope: containerRef }
  )

  // Re-run corner positioning on route change
  useEffect(() => {
    const os = osRef.current
    if (os && !os.state().destroyed) os.update(true)
    snapRef.current?.()
  }, [pathname])

  // Re-pin corners once a page transition finishes (enter complete)
  useEffect(() => {
    const onTransitionEnd = () => snapRef.current?.()
    window.addEventListener('page-transition-end', onTransitionEnd)
    return () => window.removeEventListener('page-transition-end', onTransitionEnd)
  }, [])
}
