import { insert, t, type Dictionary } from 'intlayer'

const FooterClockContent = {
  key: 'footer-clock',
  content: {
    morning: {
      message: insert(
        t({
          es: '¿Buenos días? Preparándome para el día - {{time}}',
          en: 'Good morning? Getting ready for the day - {{time}}',
        })
      ),
      zh: '准备',
    },
    afternoon: {
      message: insert(
        t({
          es: '¿Buenas tardes?, estoy trabajando - {{time}}',
          en: "Good afternoon?, I'm working - {{time}}",
        })
      ),
      zh: '准备',
    },
    night: {
      message: insert(
        t({
          es: '¿Buenas noches?, probablemente estoy durmiendo - {{time}}',
          en: "Good night?, probably I'm sleeping - {{time}}",
        })
      ),
      zh: '睡觉',
    },
  },
} satisfies Dictionary

export default FooterClockContent
