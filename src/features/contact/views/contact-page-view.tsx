'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useIntlayer } from 'next-intlayer'
import { Container } from '@/components/layout/container'
import { Logo } from '@/components/widgets/logo'
import TextRotate from '../components/text-rotate'
import { ContactForm } from '../components/contact-form'
import { ContactChannels } from '../components/contact-channels'
import './contact-page-view.css'

export function ContactPageView() {
  const rootRef = useRef<HTMLDivElement>(null)
  const content = useIntlayer('contact')

  useGSAP(
    () => {
      gsap.fromTo(
        '.ct-intro',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.1 }
      )
    },
    { scope: rootRef }
  )

  return (
    <main className="contact-view">
      <Container fullWidth>
        <Logo />

        <div ref={rootRef} className="contact-inner">
          <h1 className="ct-intro contact-heading">
            {content.headlinePrefix}
            <br />
            <TextRotate
              texts={content.rotatingWords.map((w) => w.value)}
              rotationInterval={2600}
              mainClassName="contact-word"
            />
          </h1>

          <p className="ct-intro contact-subtitle">
            {content.subtitlePart1}{' '}
            <span className="contact-subtitle__highlight">{content.subtitleHighlight}</span>
            {content.subtitlePart2}
          </p>

          <ContactForm />

          <ContactChannels />
        </div>
      </Container>
    </main>
  )
}
