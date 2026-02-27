# VNext Press Spec (MVP)

This document defines the initial architecture, API surface, data model, and repo layout for a Cloudflare-native, WordPress-lite publishing platform.

## Goals
- Free, open-source, simple publishing platform
- Custom username path: `newsletter.md/@username`
- Themes with YAML-defined configuration
- Markdown editor + publish flow
- Deploy on Cloudflare Workers + D1 + R2
- Google OAuth login

## Non-Goals (MVP)
- Custom domains
- Paid themes
- Advanced analytics

## Stack
- Runtime: Cloudflare Workers
- API framework: Hono (lightweight)
- Database: Cloudflare D1 (SQLite)
- Storage: Cloudflare R2 (uploads, theme assets)
- Cache: Cloudflare Cache API (public pages)
- Auth: Google OAuth + signed session cookie

## Repo Layout
- `worker/` Worker app (API + SSR)
- `worker/src/` source code
- `docs/` specifications and API docs
- `schema/` D1 schema

## Routing
- `GET /@username` public homepage
- `GET /@username/:slug` public post page
- `GET /@username/page/:slug` public page
- `GET /api/health` health check
- `POST /api/auth/google` exchange Google token and issue session
- `POST /api/username/claim` claim `@username`
- `GET /api/me` current user
- `GET /api/themes` marketplace list
- `POST /api/themes/activate` activate theme
- `PUT /api/themes/config` update theme config
- `GET /api/posts` list posts
- `POST /api/posts` create post
- `PUT /api/posts/:id` update post
- `POST /api/uploads` get signed upload URL

## Auth
- Google OAuth (server-side exchange)
- Session cookie: `session` (signed JWT)
- Cookie: `HttpOnly`, `Secure`, `SameSite=Lax`

## Theme System
- Themes stored as records in D1 with YAML schema
- Each user has one active theme
- Theme config is stored as JSON values per user
- Theme YAML defines editable fields

### Theme Config (YAML example)
```
name: "Minimal Writer"
version: "1.0"
settings:
  primary_color:
    type: color
    default: "#1f2937"
  logo:
    type: image
    default: null
  social_links:
    type: list
    item:
      label: string
      url: string
  custom_pages:
    type: list
    item:
      title: string
      slug: string
```

## Rendering
- SSR HTML rendering in Worker for public pages
- Markdown -> HTML stored in D1
- HTML sanitized before render

## Caching
- Cache public pages using Cache API
- Invalidate on publish/update

## MVP Milestones
1. Google login
2. Username claim
3. Markdown editor + post publishing
4. Public SSR rendering (one default theme)
5. Basic theme config UI
6. R2 uploads for images
