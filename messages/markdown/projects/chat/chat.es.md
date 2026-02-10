## Description

Aplicación web de chat en tiempo real enfocada en conversaciones privadas one-to-one. Permite crear salas temporales que se autodestruyen automáticamente, generar códigos únicos de invitación y mantener múltiples salas activas al mismo tiempo. Diseñada con énfasis en privacidad, simplicidad y control total sobre la duración de las conversaciones.

## Roles

Full Stack Development, UI/UX

## Technologies

Next.js, React, TypeScript, TailwindCSS, Elysia, Upstash Redis, Upstash Realtime, TanStack Query, Zod

## Objectives

- Diseñar y desarrollar un sistema de chat privado con autenticación basada en tokens mediante HTTP-only cookies, permitiendo crear salas seguras con control de acceso y comunicación en tiempo real entre dos usuarios.
- Implementar persistencia ligera usando [Upstash Redis](https://upstash.com/) para mensajes, metadatos y códigos de invitación, aprovechando TTL para autodestruir salas automáticamente y garantizar que las conversaciones no permanezcan más tiempo del necesario.
- Construir una experiencia simple y funcional con gestión de múltiples salas activas, invitaciones temporales, notificaciones de eventos y una API RESTful con [Elysia](https://elysiajs.com/) y type-safety end-to-end para mantener consistencia, seguridad y rendimiento.
