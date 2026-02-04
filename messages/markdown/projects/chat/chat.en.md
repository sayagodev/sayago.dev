## Description

\>chat_privado is a real-time web chat application designed for private one-to-one conversations with enhanced security and privacy features. The app allows users to create temporary chat rooms that self-destruct automatically after 10 minutes, ensuring that conversations do not persist indefinitely. Users can create rooms, generate unique invitation codes to invite another person, and manage multiple active rooms simultaneously (up to 3 per user).

## Roles

Full Stack Development, UI/UX

## Technologies

Next.js, React, TypeScript, TailwindCSS, Elysia, Upstash Redis, Upstash Realtime, TanStack Query, Zod

## Objectives

- Implement a private chat room creation system with authentication based on HTTP-only cookie tokens
- Integrate [Upstash Redis](https://upstash.com/) for persistent storage of messages, room metadata, and invitation codes with automatic TTL
- Implement automatic room self-destruction after 10 minutes using Redis TTL
- Develop an invitation system with unique codes to invite another user, each code having a TTL of 3 minutes
- Develop an active room management system using localStorage
- Integrate sound notifications for received message events, errors, success, and room destruction
- Develop a RESTful API using the Elysia framework with TypeScript end-to-end type safety
