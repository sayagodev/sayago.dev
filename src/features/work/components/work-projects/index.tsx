'use client'

import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useIntlayer } from 'next-intlayer'
import { projects, type Project } from '../../data'
import './work-projects.css'
import { Button } from '@/components/ui/button'

type Filter = 'todos' | 'profesional' | 'personal'

export function WorkProjects() {
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Filter>('todos')
  const [openId, setOpenId] = useState<string | null>(null)
  const hovered = useRef<string | null>(null)
  const content = useIntlayer('work')

  const filtered = projects.filter((p) => filter === 'todos' || p.type === filter)

  useGSAP(
    () => {
      gsap.fromTo(
        '.proj-head',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo(
        '.proj-row',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.45 }
      )
    },
    { scope: rootRef }
  )

  useGSAP(
    () => {
      const list = listRef.current
      if (!list) return
      gsap.fromTo(
        list.querySelectorAll('.proj-row'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' }
      )
    },
    { dependencies: [filter], scope: rootRef }
  )

  useGSAP(
    () => {
      const preview = previewRef.current
      if (!preview) return
      if (window.matchMedia('(pointer: coarse)').matches) return

      gsap.set(preview, { scale: 0, opacity: 0 })
      const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3' })
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3' })
      const rotTo = gsap.quickTo(preview, 'rotation', { duration: 0.5, ease: 'power3' })
      let lastX = 0

      const move = (e: MouseEvent) => {
        xTo(e.clientX + 28)
        yTo(e.clientY - 130)
        rotTo(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.55))
        lastX = e.clientX
      }

      window.addEventListener('mousemove', move)
      return () => window.removeEventListener('mousemove', move)
    },
    { dependencies: [filter], scope: rootRef }
  )

  const handleRowEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const row = e.currentTarget
    hovered.current = row.dataset.proj ?? null
    const preview = previewRef.current
    if (!preview) return
    const label = preview.querySelector<HTMLElement>('[data-label]')
    const idx = preview.querySelector<HTMLElement>('[data-idx]')
    if (label) label.textContent = row.dataset.name ?? ''
    if (idx) idx.textContent = row.dataset.idx ?? ''
    gsap.to(preview, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })
  }, [])

  const handleRowLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const related = e.relatedTarget as HTMLElement | null
    if (related?.closest('[data-proj]')) return
    hovered.current = null
    const preview = previewRef.current
    if (!preview) return
    gsap.to(preview, { scale: 0, opacity: 0, duration: 0.28, ease: 'power2.in' })
  }, [])

  const handleListLeave = useCallback(() => {
    hovered.current = null
    const preview = previewRef.current
    if (!preview) return
    gsap.to(preview, { scale: 0, opacity: 0, duration: 0.28, ease: 'power2.in' })
  }, [])

  const filters: { value: Filter; label: string }[] = [
    { value: 'todos', label: content.filterAll.value },
    { value: 'profesional', label: content.filterProfessional.value },
    { value: 'personal', label: content.filterPersonal.value },
  ]

  return (
    <div ref={rootRef} className="work-projects">
      <div ref={previewRef} className="work-projects__preview">
        <div className="work-projects__preview-header">
          <span data-label>{content.preview.value}</span>
          <span data-idx className="work-projects__preview-idx">
            —
          </span>
        </div>
        <div className="work-projects__preview-img" />
      </div>

      <div className="proj-head work-projects__heading-row">
        <h1 className="work-projects__title">{content.title.value}</h1>
        <span className="work-projects__count">({String(filtered.length).padStart(2, '0')})</span>
      </div>

      <p className="proj-head work-projects__description">
        {content.description}
        <em className="work-projects__hint"> {content.hoverHint}</em>
      </p>

      <div className="proj-head work-projects__filters">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`work-projects__filter${filter === f.value ? ' work-projects__filter--active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={listRef} className="work-projects__list" onMouseLeave={handleListLeave}>
        {filtered.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            open={openId === p.id}
            onToggle={() => setOpenId(openId === p.id ? null : p.id)}
            onRowEnter={handleRowEnter}
            onRowLeave={handleRowLeave}
          />
        ))}
      </div>
    </div>
  )
}

function ProjectRow({
  project,
  open,
  onToggle,
  onRowEnter,
  onRowLeave,
}: {
  project: Project
  open: boolean
  onToggle: () => void
  onRowEnter?: (e: React.MouseEvent<HTMLElement>) => void
  onRowLeave?: (e: React.MouseEvent<HTMLElement>) => void
}) {
  const content = useIntlayer('work')
  const desc = content.descriptions[project.id as keyof typeof content.descriptions]

  return (
    <article className="proj-row">
      <Button
        data-proj={project.id}
        data-name={project.name}
        data-idx={project.idx}
        onClick={onToggle}
        onMouseEnter={onRowEnter}
        onMouseLeave={onRowLeave}
        className="work-projects__item"
      >
        <span className="work-projects__idx">{project.idx}</span>

        <span className="work-projects__info">
          <span className="work-projects__name">{project.name}</span>
          <span className="work-projects__tags">
            {project.tags.map((t) => (
              <span key={t} className="work-projects__tag">
                {t}
              </span>
            ))}
          </span>
        </span>

        <span className="work-projects__desc">{desc?.value}</span>

        <span className="work-projects__year">{project.year}</span>

        <span className="work-projects__arrow">
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M12.943 3.463A.75.75 0 0 0 12.25 3h-5.5a.75.75 0 0 0 0 1.5h3.69l-7.22 7.22a.75.75 0 1 0 1.06 1.06l7.22-7.22v3.69a.75.75 0 0 0 1.5 0v-5.5a.8.8 0 0 0-.057-.287"
            />
          </svg>
        </span>
      </Button>

      <div
        className="work-projects__accordion md-hidden"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="work-projects__accordion-inner">
          <div className="work-projects__accordion-content">
            <div className="work-projects__accordion-img" />
            <div className="work-projects__accordion-body">
              <p className="work-projects__accordion-desc">{desc?.value}</p>
              <div className="work-projects__accordion-links">
                <a href={project.link} className="work-projects__accordion-link">
                  {content.viewProject}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="work-projects__accordion-arrow"
                  >
                    <path
                      fill="currentColor"
                      d="M12.943 3.463A.75.75 0 0 0 12.25 3h-5.5a.75.75 0 0 0 0 1.5h3.69l-7.22 7.22a.75.75 0 1 0 1.06 1.06l7.22-7.22v3.69a.75.75 0 0 0 1.5 0v-5.5a.8.8 0 0 0-.057-.287"
                    />
                  </svg>
                </a>
                <a href={project.source} className="work-projects__accordion-link-dim">
                  {content.sourceCode}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
