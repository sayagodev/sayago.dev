import { t, type Dictionary } from 'intlayer'

const ContactContent = {
  key: 'contact',
  content: {
    headlinePrefix: t({
      es: 'Hago realidad…',
      en: 'I make real…',
    }),
    rotatingWords: t({
      es: ['tu idea.', 'tu producto.', 'tu sistema.', 'tu plataforma.', 'tu proyecto.'],
      en: ['your idea.', 'your product.', 'your system.', 'your platform.', 'your project.'],
    }),
    subtitlePart1: t({
      es: 'Cuéntame qué quieres construir. Respondo en',
      en: 'Tell me what you want to build. I reply within',
    }),
    subtitleHighlight: t({
      es: '~24h',
      en: '~24h',
    }),
    subtitlePart2: t({
      es: ', sin bots de por medio 【信】.',
      en: ', no bots in between 【信】.',
    }),
    form: {
      nameStart: t({
        es: 'Mi nombre es',
        en: 'My name is',
      }),
      namePlaceholder: t({
        es: 'nombre y apellido',
        en: 'full name',
      }),
      nameFieldLabel: t({
        es: 'Tu nombre',
        en: 'Your name',
      }),
      nameMiddle: t({
        es: 'y estoy interesado en',
        en: "and I'm interested in",
      }),
      projectPlaceholder: t({
        es: 'nombre del proyecto',
        en: 'project name',
      }),
      projectFieldLabel: t({
        es: 'El nombre del proyecto',
        en: 'Project name',
      }),
      budgetLabel: t({
        es: 'Mi presupuesto es',
        en: 'My budget is',
      }),
      budgets: t({
        es: ['<$10K', '$10–15K', '$15–30K', '$30–60K', '$60–120K', '>$120K'],
        en: ['<$10K', '$10–15K', '$15–30K', '$30–60K', '$60–120K', '>$120K'],
      }),
      emailStart: t({
        es: 'Por favor, contáctame al',
        en: 'Please, reach me at',
      }),
      emailPlaceholder: t({
        es: 'email@correo.com',
        en: 'email@you.com',
      }),
      emailFieldLabel: t({
        es: 'Tu correo electrónico',
        en: 'Your email',
      }),
      optionalLabel: t({
        es: 'opcional — comparto más:',
        en: 'optional — tell me more:',
      }),
      optionalPlaceholder: t({
        es: 'Detalles de tu proyecto: referencias, plazos, requisitos…',
        en: 'Project details: references, timelines, requirements…',
      }),
      submitIdle: t({
        es: 'enviar mensaje →',
        en: 'send message →',
      }),
      submitSending: t({
        es: 'transmitiendo…',
        en: 'transmitting…',
      }),
      submitDone: t({
        es: 'mensaje enviado — 收到',
        en: 'message sent — 收到',
      }),
      error: t({
        es: 'Revisa los campos marcados.',
        en: 'Please check the highlighted fields.',
      }),
      errorServer: t({
        es: 'Hubo un problema de conexión. Inténtalo de nuevo en unos minutos.',
        en: 'There was a connection problem. Try again in a few minutes.',
      }),
      errorResend: t({
        es: 'El envío falló con el proveedor de correo. Vuelve a intentarlo.',
        en: 'Sending failed with the email provider. Please try again.',
      }),
      errorCooldown: t({
        es: 'Ya enviaste un mensaje hace poco. Podrás escribir de nuevo en un momento.',
        en: 'You recently sent a message. You can write again shortly.',
      }),
      cooldownMessage: t({
        es: 'puedes enviar otro mensaje en {time}',
        en: 'you can send another message in {time}',
      }),
      cooldownAriaLabel: t({
        es: 'Tiempo restante antes de poder enviar otro mensaje',
        en: 'Time remaining before you can send another message',
      }),
      security: t({
        es: 'cifrado en tránsito · sin spam · respuesta humana garantizada',
        en: 'encrypted in transit · no spam · guaranteed human response',
      }),
    },
    channels: {
      emailLabel: t({
        es: 'email',
        en: 'email',
      }),
      githubLabel: t({
        es: 'github',
        en: 'github',
      }),
      locationLabel: t({
        es: 'ubicación',
        en: 'location',
      }),
      emailValue: 'hi@sayago.dev',
      githubValue: 'github.com/sayagodev',
      locationValue: 'SMA, MX — UTC-6',
    },
    metadata: {
      title: t({
        es: 'Contacto',
        en: 'Contact',
      }),
      description: t({
        es: 'Cuéntame qué quieres construir — respondo en ~24h, sin bots de por medio.',
        en: 'Tell me what you want to build — I reply within ~24h, no bots in between.',
      }),
    },
  },
} satisfies Dictionary

export default ContactContent
