## Description

\>chat_privado es una aplicación web de chat en tiempo real diseñada para conversaciones privadas one-to-one con características de seguridad y privacidad. La aplicación permite crear salas de chat temporales que se autodestruyen automáticamente después de 10 minutos, garantizando que las conversaciones no persistan indefinidamente. Los usuarios pueden crear salas, generar códigos de invitación únicos para invitar a otra persona, y gestionar múltiples salas activas simultáneamente (hasta 3 por usuario).

## Roles

Full Stack Development, UI/UX

## Technologies

Next.js, React, TypeScript, TailwindCSS, Elysia, Upstash Redis, Upstash Realtime, TanStack Query, Zod

## Objectives

- Implementar sistema de creación de salas de chat privadas con autenticación basada en tokens HTTP-only cookies
- Integrar [Upstash Redis](https://upstash.com/) para almacenamiento persistente de mensajes, metadatos de salas y códigos de invitación con TTL automático
- Implementar autodestrucción automática de salas después de 10 minutos usando TTL de Redis
- Desarrollar sistema de invitación con códigos únicos para invitar a otra persona con TTL de 3 minutos
- Desarrollar sistema de gestión de salas activas con almacenamiento en localStorage
- Integrar notificaciones de sonido para eventos de mensajes recibidos, errores, éxito y destrucción de sala
- Desarrollar API RESTful con Elysia framework usando TypeScript end-to-end type safety con Elysia
