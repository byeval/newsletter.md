# letters Spec (MVP)

This document defines the initial architecture, API surface, data model, and repo layout for a Cloudflare-native, WordPress-lite publishing platform.

## Goals
- Free, open-source, simple publishing platform
- Custom username path: `newsletter.md/u/username`
- Themes with YAML-defined configuration
- Markdown editor + publish flow
- Deploy on Cloudflare Workers + D1 + R2
- Google OAuth login

## Non-Goals (MVP)
- Custom domains
- Paid themes
- Advanced analytics

## Stack
- Runtime: Cloudflare Workers (vinext)
- Framework: vinext (Next.js API surface on Vite)
- Database: Cloudflare D1 (SQLite)
- Storage: Cloudflare R2 (uploads, theme assets)
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
- `GET /api/themes` marketplace list
- `GET /api/themes/:id` fetch theme schema
- `GET /api/themes/active` current active theme
- `POST /api/themes/activate` activate theme
- `PUT /api/themes/config` update theme config
- `GET /api/posts` list posts
- `POST /api/posts` create post
- `PUT /api/posts/:id` update post
- `POST /api/uploads` get upload URL
- `PUT /api/uploads?key=...` upload to R2
- `GET /r2/*` serve R2 assets

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
- SSR HTML rendering via vinext App Router
- Markdown -> HTML stored in D1
- HTML sanitized before render

## Content Model
- Single content type: posts

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
