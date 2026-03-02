# API Spec (Draft)

Base URL: `https://newsletter.md`

All JSON requests use `Content-Type: application/json`.

## Auth

### POST /api/auth/google
Exchange a Google OAuth token for a session cookie.

Request:
```
{
  "id_token": "..."
}
```

Response:
```
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane",
    "avatar_url": "https://..."
  }
}
```

### GET /api/me
Return current user.

Response:
```
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane",
    "avatar_url": "https://...",
    "username": "jane"
  }
}
```

## Username

### POST /api/username/claim
Request:
```
{
  "username": "jane"
}
```

Response:
```
{
  "username": "jane"
}
```

Errors:
- `409` if username already taken

## Themes



## Posts

### GET /api/posts
Response:
```
{
  "posts": [
    {
      "id": "uuid",
      "title": "Hello",
      "slug": "hello",
      "status": "published",
      "updated_at": "2026-02-27T00:00:00Z"
    }
  ]
}
```

### POST /api/posts
Request:
```
{
  "title": "Hello",
  "slug": "hello",
  "markdown": "# Hello"
}
```

Response:
```
{
  "id": "uuid",
  "status": "draft"
}
```

### PUT /api/posts/:id
Request:
```
{
  "title": "Hello",
  "slug": "hello",
  "markdown": "# Hello",
  "status": "published"
}
```

Response:
```
{
  "id": "uuid",
  "status": "published"
}
```

## Uploads

### POST /api/uploads
Request:
```
{
  "filename": "cover.png",
  "content_type": "image/png"
}
```

Response:
```
{
  "upload_url": "https://...",
  "key": "uploads/user/cover.png",
  "public_url": "https://cdn.newsletter.md/...."
}
```
