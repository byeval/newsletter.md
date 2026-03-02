# letters Spec (MVP)

This document defines the initial architecture, API surface, data model, and repo layout for a Cloudflare-native, WordPress-lite publishing platform.

## Goals
- Free, open-source, simple publishing platform
- Custom username path: `newsletter.md/u/username`
- Newsletter-first publishing
- Markdown editor + publish flow
- Deploy on Cloudflare Workers + D1 + R2
- Google OAuth login
- Newsletter subscriptions
- Email delivery on publish (Cloudflare Email Service)

## Non-Goals (MVP)
- Custom domains
- Advanced analytics

## Stack
- Runtime: Cloudflare Workers (vinext)
- Framework: vinext (Next.js API surface on Vite)
- Database: Cloudflare D1 (SQLite)
- Storage: Cloudflare R2 (uploads)
- Cache: Cloudflare Cache API (public pages)
- Auth: Google OAuth + signed session cookie

## Repo Layout
- `app/` vinext App Router (UI + API routes)
- `docs/` specifications and API docs
- `schema/` D1 schema

## Routing
- `GET /u/:username` public homepage
- `GET /u/:username/:slug` public post page
- `GET /api/health` health check
- `POST /api/auth/google` exchange Google token and issue session
- `POST /api/username/claim` claim `username`
- `GET /api/me` current user
- `GET /api/posts` list posts
- `POST /api/posts` create post
- `PUT /api/posts/:id` update post
- `POST /api/uploads` get upload URL
- `PUT /api/uploads?key=...` upload to R2
- `GET /r2/*` serve R2 assets
- `POST /api/subscribe` add subscriber
- `GET /api/subscribers` list subscribers (owner)
- `GET /api/subscribe/unsubscribe?token=...` unsubscribe
- `GET /unsubscribe?token=...` unsubscribe page

## Auth
- Google OAuth (server-side exchange)
- Session cookie: `session` (signed JWT)
- Cookie: `HttpOnly`, `Secure`, `SameSite=Lax`

## Rendering
- SSR HTML rendering via vinext App Router
- Markdown -> HTML stored in D1
- HTML sanitized before render

## Content Model
- Single content type: posts
- Subscribers list per author

## Caching
- Cache public pages using Cache API
- Invalidate on publish/update

## MVP Milestones
1. Google login
2. Username claim
3. Markdown editor + post publishing
4. Public SSR rendering
6. R2 uploads for images
