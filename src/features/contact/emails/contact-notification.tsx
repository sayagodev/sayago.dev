import { GRAINIENT_COLORS } from '@/lib/constants'

export interface ContactNotificationEmailProps {
  name: string
  email: string
  project: string
  budget: string
  details: string
  themeName: string
  submittedAt: string
}

function resolvePalette(themeName: string): Palette {
  const theme =
    GRAINIENT_COLORS[themeName as keyof typeof GRAINIENT_COLORS] ?? GRAINIENT_COLORS.light

  return {
    tone: theme.tone,
    gradient: [theme.color1, theme.color2, theme.color3],
  }
}

type Palette = {
  tone: 'light' | 'dark'
  gradient: [string, string, string]
}

const FONT = "'Monaspace Neon', 'SF Mono', 'Consolas', 'Liberation Mono', monospace"

export function ContactNotificationEmail({
  name,
  email,
  project,
  budget,
  details,
  themeName,
  submittedAt,
}: ContactNotificationEmailProps) {
  const palette = resolvePalette(themeName)
  const dark = palette.tone === 'dark'

  const c = {
    bg: dark ? '#09090b' : '#ffffff',
    fg: dark ? '#ffffff' : '#09090b',
    muted: dark ? '#a1a1aa' : '#71717a',
    border: dark ? '#27272a' : '#d4d4d8',
    accent: palette.gradient[1],
  }

  const gradient = `linear-gradient(90deg, ${palette.gradient[0]} 0%, ${palette.gradient[1]} 50%, ${palette.gradient[2]} 100%)`

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: c.muted,
    padding: '0 0 6px',
    margin: 0,
  }

  const valueStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: '15px',
    lineHeight: '1.7',
    color: c.fg,
    padding: '0 0 20px',
    margin: 0,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  }

  const linkStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: '15px',
    lineHeight: '1.7',
    color: c.accent,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  }

  return (
    <html>
      <head>
        <title>{`Nuevo mensaje — ${project}`}</title>
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      <body
        style={{
          backgroundColor: c.bg,
          fontFamily: FONT,
          margin: 0,
          padding: '32px 16px',
        }}
      >
        <div
          style={{
            display: 'none',
            maxHeight: '0px',
            overflow: 'hidden',
            opacity: 0,
            fontSize: '1px',
            lineHeight: '1px',
          }}
        >
          Nuevo mensaje de {name} sobre {project}
        </div>

        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ borderCollapse: 'collapse' }}
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                style={{
                  maxWidth: '560px',
                  borderCollapse: 'collapse',
                  backgroundColor: c.bg,
                  border: `1px solid ${c.border}`,
                }}
              >
                {/* Gradient band del theme */}
                <tr>
                  <td style={{ background: gradient, height: '8px' }} aria-hidden />
                </tr>

                {/* Header */}
                <tr>
                  <td style={{ padding: '28px 32px', borderBottom: `1px solid ${c.border}` }}>
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td>
                          <span
                            style={{
                              fontFamily: FONT,
                              fontSize: '18px',
                              fontWeight: 600,
                              letterSpacing: '0.04em',
                              color: c.fg,
                            }}
                          >
                            sāyago;dev
                          </span>
                        </td>
                        <td align="right">
                          <span
                            style={{
                              fontFamily: FONT,
                              fontSize: '14px',
                              color: c.muted,
                            }}
                          >
                            信
                          </span>
                        </td>
                      </tr>
                    </table>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: c.muted,
                        margin: '10px 0 0',
                      }}
                    >
                      nuevo mensaje · recibido {submittedAt}
                    </p>
                  </td>
                </tr>

                {/* Cuerpo */}
                <tr>
                  <td style={{ padding: '28px 32px 8px' }}>
                    <p style={labelStyle}>Nombre</p>
                    <p style={valueStyle}>{name}</p>

                    <p style={labelStyle}>Email</p>
                    <p style={valueStyle}>
                      <a href={`mailto:${email}`} style={linkStyle}>
                        {email}
                      </a>
                    </p>

                    <p style={labelStyle}>Proyecto</p>
                    <p style={valueStyle}>{project}</p>

                    <p style={labelStyle}>Presupuesto</p>
                    <p style={valueStyle}>{budget || '—'}</p>

                    <p style={labelStyle}>Tema de la página</p>
                    <p style={valueStyle}>{themeName}</p>

                    {details && (
                      <>
                        <p style={labelStyle}>Detalles</p>
                        <p style={valueStyle}>{details}</p>
                      </>
                    )}
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: '16px 32px 32px' }}>
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td style={{ borderTop: `1px solid ${c.border}`, paddingTop: '24px' }}>
                          <a
                            href={`mailto:${email}?subject=Re: ${encodeURIComponent(project)}`}
                            style={{
                              display: 'inline-block',
                              fontFamily: FONT,
                              fontSize: '12px',
                              fontWeight: 600,
                              letterSpacing: '0.22em',
                              textTransform: 'uppercase',
                              color: c.bg,
                              backgroundColor: c.fg,
                              textDecoration: 'none',
                              padding: '12px 24px',
                            }}
                          >
                            responder → {name.split(' ')[0]}
                          </a>
                          <p
                            style={{
                              fontFamily: FONT,
                              fontSize: '11px',
                              color: c.muted,
                              margin: '20px 0 0',
                            }}
                          >
                            sayago.dev — respuesta humana garantizada, sin bots de por medio.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

ContactNotificationEmail.PreviewProps = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  project: 'Acme Dashboard',
  budget: '$15–30K',
  details:
    'Me interesa un dashboard con paneles en tiempo real.\nReferencias y plazos por definir.',
  themeName: 'light2',
  submittedAt: '15/08/2026 · 12:34',
} satisfies ContactNotificationEmailProps

export default ContactNotificationEmail
