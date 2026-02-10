## Description

A real-time web chat focused on private one-to-one conversations. It allows creating temporary rooms that self-destruct automatically, generating unique invite codes, and managing multiple active rooms at once. Built with a strong focus on privacy, simplicity, and full control over how long conversations exist.

## Roles

Full Stack Development, UI/UX

## Technologies

Next.js, React, TypeScript, TailwindCSS, Elysia, Upstash Redis, Upstash Realtime, TanStack Query, Zod

## Objectives

- Design and build a private chat system with token-based authentication using HTTP-only cookies, enabling secure room creation, controlled access, and real-time communication between two users.
- Implement lightweight persistence with [Upstash Redis](https://upstash.com/) for messages, room metadata, and invite codes, using TTL to automatically destroy rooms and ensure conversations do not persist longer than intended.
- Deliver a simple and functional experience with multi-room management, temporary invites, event notifications, and a RESTful API built with [Elysia](https://elysiajs.com/) and end-to-end type safety to maintain consistency, security, and performance.
