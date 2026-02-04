## Description

Learning Management System (LMS) that allows you to create, edit, and delete courses with a hierarchical structure of chapters and lessons. It includes an enrollment system with payment processing via [Stripe](https://stripe.com/), an admin panel for managing educational content, a student dashboard with progress tracking, authentication with multiple providers, and media file storage (images and videos) on AWS S3. The system enables administrators to manage complete courses with rich descriptions, while students can enroll, access content, and track their learning progress.

## Roles

Full Stack Development

## Technologies

Next.js, React, TypeScript, TailwindCSS, Prisma, PostgreSQL, Stripe, Better Auth, AWS S3, TipTap, Resend, Arcjet

## Objectives

- Develop a comprehensive Learning Management System (LMS) with functionality to create, edit, and delete courses.
- Implement a hierarchical content structure with chapters and lessons within each course.
- Integrate a payment system using Stripe for course enrollments, including webhooks for automatic enrollment status updates.
- Create a complete admin panel that allows managing courses, chapters, and lessons without requiring advanced technical knowledge.
- Develop a student dashboard showing enrolled courses and tracking lesson progress.
- Implement robust authentication using multiple providers (email OTP and OAuth with GitHub) via Better Auth.
- Integrate media file storage (cover images, thumbnails, and lesson videos) on AWS S3 using presigned URLs for secure uploads.
- Implement a rich text editor (TipTap) for course and lesson descriptions.
- Apply advanced security measures including rate limiting, bot protection, multi-layer validation, and end-to-end type safety with TypeScript, Arcjet, and Zod.
