## Description

Learning Management System (LMS) que permite crear, editar y eliminar cursos con estructura jerárquica de capítulos y lecciones. Incluye un sistema de inscripciones con pagos mediante [Stripe](https://stripe.com/), panel de administración para gestión de contenido educativo, dashboard para estudiantes con seguimiento de progreso, sistema de autenticación con múltiples proveedores, y almacenamiento de archivos multimedia (imágenes y videos) en AWS S3. El sistema permite a los administradores gestionar cursos completos con descripciones enriquecidas, mientras que los estudiantes pueden inscribirse, acceder al contenido y rastrear su progreso de aprendizaje.

## Roles

Full Stack Development

## Technologies

Next.js, React, TypeScript, TailwindCSS, Prisma, PostgreSQL, Stripe, Better Auth, AWS S3, TipTap, Resend, Arcjet

## Objectives

- Desarrollar un sistema completo de gestión de aprendizaje (LMS) con funcionalidades de creación, edición y eliminación de cursos.
- Implementar una estructura jerárquica de contenido con capítulos y lecciones dentro de cada curso.
- Integrar un sistema de pagos con Stripe para procesar inscripciones a cursos, incluyendo webhooks para actualización automática de estados de inscripción.
- Crear un panel de administración completo que permita gestionar cursos, capítulos y lecciones sin necesidad de conocimientos técnicos avanzados.
- Desarrollar un dashboard para estudiantes con visualización de cursos inscritos y seguimiento de progreso por lección.
- Implementar un sistema de autenticación robusto con múltiples proveedores (email OTP y OAuth con GitHub) usando Better Auth.
- Integrar almacenamiento de archivos multimedia (imágenes de portada, thumbnails y videos de lecciones) en AWS S3 con presigned URLs para uploads seguros.
- Implementar un editor de texto enriquecido (TipTap) para descripciones de cursos y lecciones.
- Aplicar medidas de seguridad avanzadas incluyendo rate limiting, protección contra bots, validación en múltiples capas y type safety end-to-end con TypeScript, Arcject y Zod.
