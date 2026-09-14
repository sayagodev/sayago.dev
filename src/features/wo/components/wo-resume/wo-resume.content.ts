import { md, t, type Dictionary } from 'intlayer'

const resumeLargeEs = `Mi nombre es **Ángel Sáyago**, egresado de la **Universidad Autónoma de Nuevo León [(UANL)](https://www.uanl.mx)** como **Licenciado en Seguridad en Tecnologías de la Información**.

Al principio comencé estudiando Ingeniería en Sistemas, pero entre los profesores, las circunstancias y, sobre todo, mi falta de interés en aquel momento, terminé por dejarla. Sin embargo, desde antes —aproximadamente desde **2017**— me había llamado profundamente la atención todo el mundo del desarrollo de aplicaciones, así que decidí comenzar a aprender por mi cuenta, de forma autodidacta.

Desde entonces, mi enfoque siempre ha sido el mismo: **hacer las cosas y hacerlas bien; si es posible, muy bien**. Empecé desde las bases: HTML, CSS, JavaScript, algoritmia y bases de datos. Con el tiempo fui adentrándome también en infraestructura, testing, despliegue continuo, cloud y, más recientemente, inteligencia artificial.

No me interesa únicamente aprender un framework o una herramienta de moda. Me interesa entender cómo funcionan las cosas, conocer sus fundamentos y después utilizar las herramientas adecuadas para resolver problemas reales. Los frameworks, librerías y plataformas son medios para un fin: construir mejores aplicaciones, automatizar procesos y crear soluciones que realmente aporten valor, tanto para mí como para mis clientes.

En los últimos dos años, la inteligencia artificial se ha convertido en una parte fundamental de mi forma de trabajar. No la veo simplemente como un chatbot al que se le hacen preguntas, sino como una nueva capa de abstracción para desarrollar software. He incorporado herramientas y conceptos como Claude, OpenCode, agentes, skills, MCP (Model Context Protocol) y distintos flujos de trabajo asistidos por IA para investigar, programar, automatizar, probar, documentar y resolver problemas.

Esta transformación también cambió mi manera de entender el desarrollo. Ya no se trata únicamente de escribir código más rápido, sino de aprender a orquestar herramientas, contexto y agentes, definir correctamente los problemas y construir sistemas en los que la IA pueda colaborar de manera estructurada. Para mí, aprender a trabajar con estas tecnologías es tan importante como haber aprendido en su momento HTML, JavaScript o bases de datos.

Y, como probablemente es evidente por el diseño de esta página, también estoy aprendiendo mandarín.

Me interesa profundamente la cultura, la historia, las tradiciones, la arquitectura, la gastronomía**<span className="text-symbol">\*</span>** y la política de China. Me resulta fascinante en prácticamente todos los aspectos. Así como el <span className="font-zi text-symbol">如意金箍棒</span> de <span className="font-zi text-symbol">孙悟空</span>, que según la tradición podía alterar su tamaño hasta alcanzar dimensiones enormes y que originalmente se utilizó para medir la profundidad de los mares, <span className="font-zi text-symbol">中国</span> y sus **«5 000»** años de historia se presentan ante mí como un <span className="font-zi text-symbol">国</span> inamovible: antiguo, extremadamente pesado y, de cierta manera, mágico.

No se trata de idealizarlo, sino de observarlo, estudiarlo y aprender de aquello que considero valioso para incorporarlo a nuestra propia cosmogonía.

Quizá mi interés por China tampoco sea tan casual.

**<span className="text-symbol">\*</span>**Mi padre es chef y, desde que tengo uso de razón, ha trabajado en su restaurante, **El Dragón de Oro**, preparando comida china. Supongo que, de alguna manera, algo de todo aquello despertó en mí desde muy pequeño. Jaja.
`

const resumeLargeEn = `My name is **Ángel Sáyago**, and I graduated from the **Universidad Autónoma de Nuevo León [(UANL)](https://www.uanl.mx)** with a degree in **Information Technology Security**.

I originally started studying Systems Engineering, but between the professors, the circumstances, and, above all, my lack of interest at the time, I eventually decided to leave the program. However, even before that —around **2017**— I had already become deeply interested in the world of application development, so I decided to start learning on my own, as a self-taught developer.

Since then, my approach has always been the same: **do things, and do them well; if possible, very well**. I started with the fundamentals: HTML, CSS, JavaScript, algorithms, and databases. Over time, I also ventured into infrastructure, testing, continuous deployment, cloud computing, and, more recently, artificial intelligence.

I am not interested in simply learning whatever framework or trendy tool happens to be popular at the moment. I want to understand how things work, learn their underlying principles, and then use the right tools to solve real-world problems. Frameworks, libraries, and platforms are means to an end: building better applications, automating processes, and creating solutions that genuinely provide value, both for myself and for my clients.

Over the past two years, artificial intelligence has become a fundamental part of the way I work. I don't see it simply as a chatbot you ask questions to, but rather as a new layer of abstraction for software development. I have incorporated tools and concepts such as Claude, OpenCode, agents, skills, MCP (Model Context Protocol), and various AI-assisted workflows for researching, programming, automating, testing, documenting, and solving problems.

This transformation has also changed the way I understand software development. It is no longer simply about writing code faster, but about learning how to orchestrate tools, context, and agents; properly define problems; and build systems in which AI can collaborate in a structured way. To me, learning how to work with these technologies is just as important as learning HTML, JavaScript, or databases was back then.

And, as is probably evident from the design of this website, I am also learning Mandarin.

I am deeply interested in Chinese culture, history, traditions, architecture, cuisine**<span className="text-symbol">\*</span>**, and politics. I find China fascinating in virtually every respect. Much like Sun Wukong's <span className="font-zi text-symbol">如意金箍棒</span>, which according to tradition could change its size until it became enormous and was originally used to measure the depth of the seas, <span className="font-zi text-symbol">中国</span> and its **“5,000”** years of history appear to me as an immovable <span className="font-zi text-symbol">国</span>: ancient, extraordinarily heavy, and, in a certain sense, magical.

This is not about idealizing it, but about observing it, studying it, and learning from what I consider valuable so that I can incorporate it into our own cosmology.

Perhaps my interest in China isn't entirely coincidental either.

**<span className="text-symbol">\*</span>**My father is a chef and, for as long as I can remember, he has worked at his restaurant, **El Dragón de Oro**, preparing Chinese food. I suppose that, in some way, something about all of that awakened an interest in me from a very young age. Haha.
`

const resumeTLDREs = `**Ángel Sáyago**, egresado de **Seguridad en Tecnologías de la Información** por la **UANL** y desarrollador autodidacta desde **2017**, enfocado en crear aplicaciones de alta calidad.

Tengo experiencia en desarrollo frontend y full-stack con **Next.js, React y TypeScript**, además de sólidos fundamentos en HTML, CSS y JavaScript, algoritmos, bases de datos, testing, CI/CD, infraestructura y cloud.

Durante los últimos dos años he integrado profundamente la inteligencia artificial en mi flujo de desarrollo, trabajando con herramientas y conceptos como **Claude, OpenCode, agentes, skills y MCP**, buscando no solo programar más rápido, sino construir mejores procesos y soluciones.
`

const resumeTLDREn = `**Ángel Sáyago**, a graduate in **Information Technology Security** from the **UANL** and a self-taught developer since **2017**, focused on building high-quality applications.

I have experience in frontend and full-stack development with **Next.js, React, and TypeScript**, along with strong foundations in HTML, CSS, and JavaScript, algorithms, databases, testing, CI/CD, infrastructure, and cloud computing.

Over the past two years, I have deeply integrated artificial intelligence into my development workflow, working with tools and concepts such as **Claude, OpenCode, agents, skills, and MCP**. My goal is not simply to code faster, but to build better processes and better solutions.
`

const WoResumeContent = {
  key: 'wo-resume',
  content: {
    resumeL: t({
      es: md(resumeLargeEs),
      en: md(resumeLargeEn),
    }),
    resumeTLDRL: t({
      es: md(resumeTLDREs),
      en: md(resumeTLDREn),
    }),
  },
} satisfies Dictionary

export default WoResumeContent
