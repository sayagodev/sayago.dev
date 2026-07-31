export interface Project {
  id: string
  idx: string
  name: string
  year: string
  type: 'profesional' | 'personal'
  tags: string[]
  img: string
  link: string
  source: string
}

export const projects: Project[] = [
  {
    id: 'zihuame',
    idx: '01',
    name: 'Zihuame Mochilla',
    year: '2024',
    type: 'profesional',
    tags: ['next.js', 'tailwind', 'stripe'],
    img: '/images/preview.png',
    link: '#',
    source: '#',
  },
  {
    id: 'lms',
    idx: '02',
    name: 'SáyagodevLMS',
    year: '2023',
    type: 'profesional',
    tags: ['node.js', 'postgresql', 'prisma'],
    img: '/images/preview.png',
    link: '#',
    source: '#',
  },
  {
    id: 'chat',
    idx: '03',
    name: 'Chat_Privado',
    year: '2023',
    type: 'personal',
    tags: ['webrtc', 'aes-256', 'rust'],
    img: '/images/preview.png',
    link: '#',
    source: '#',
  },
  {
    id: 'hanzi',
    idx: '04',
    name: '打字 Typer',
    year: '2024',
    type: 'personal',
    tags: ['react', 'canvas', 'pinyin'],
    img: '/images/preview.png',
    link: '#',
    source: '#',
  },
  {
    id: 'calendar',
    idx: '05',
    name: 'Calendar;Dev',
    year: '2022',
    type: 'personal',
    tags: ['react', 'radix ui', 'zustand'],
    img: '/images/preview.png',
    link: '#',
    source: '#',
  },
]
