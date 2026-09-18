export interface Project {
  id: string
  idx: string
  name: string
  year: string
  type: 'profesional' | 'personal'
  tags: string[]
  img: string
  link: string
}

export const projects: Project[] = [
  {
    id: 'zihuame',
    idx: '01',
    name: 'Zihuame Mochilla',
    year: '2025',
    type: 'profesional',
    tags: ['next.js', 'sanity', 'stripe'],
    img: '/images/projects/zihuame.png',
    link: 'https://zihuame.org.mx',
  },
  {
    id: 'vanguardias',
    idx: '02',
    name: 'Vanguardias Iberófonas',
    year: '2026',
    type: 'profesional',
    tags: ['next.js', 'payloadcms', 'postgres'],
    img: '/images/projects/vanguardias.png',
    link: 'https://vanguardias.sayago.dev',
  },
  {
    id: 'beidou',
    idx: '03',
    name: 'Beidou 北斗',
    year: '2026',
    type: 'personal',
    tags: ['next.js', 'intlayer', 'prismjs'],
    img: '/images/projects/beidou.png',
    link: 'https://beidou.sayago.dev',
  },
  {
    id: 'resonance',
    idx: '04',
    name: 'Resonance',
    year: '2026',
    type: 'personal',
    tags: ['next.js', 'trpc', 'prisma'],
    img: '/images/projects/resonance.png',
    link: 'https://tts.sayago.dev',
  },
  {
    id: 'mo',
    idx: '05',
    name: 'Mò 墨',
    year: '2026',
    type: 'personal',
    tags: ['html', 'css', 'js'],
    img: '/images/projects/mo.png',
    link: 'https://mo.sayago.dev',
  },
]
