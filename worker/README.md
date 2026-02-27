# Worker Overview

This Worker serves both API and public rendering.

## Responsibilities
- Auth endpoints
- CRUD endpoints for posts/pages/themes
- SSR rendering for public pages
- R2 signed uploads
- D1 data access

## Suggested Dependencies
- hono
- marked (markdown parser)
- dompurify (html sanitization)
- jsonwebtoken (JWT)
