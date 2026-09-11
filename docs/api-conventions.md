# API Conventions

All endpoints are namespaced under `/api/v1`, except `/health` (excluded from
the global prefix so it stays easy to point uptime checks at).

## Response envelope

Every response, success or failure, uses the same shape (defined once in
`packages/types/src/api.ts` and applied automatically by
`ResponseInterceptor` / `HttpExceptionFilter`):

```jsonc
// Success
{ "success": true, "data": { /* ... */ }, "meta": { "page": 1, "pageSize": 20, "total": 42 } }

// Failure — never includes a stack trace or raw internal error message
{ "success": false, "error": { "code": "BAD_REQUEST", "message": "..." } }
```

Consumers (`packages/api-client`, future Flutter apps) can rely on `success`
alone to branch, without inspecting HTTP status codes.

## HTTP methods & status codes

Standard REST semantics: `GET` (read, idempotent), `POST` (create), `PATCH`
(partial update), `DELETE` (remove). `200` for success, `201` for creation,
`204` where there's no body, `400` for validation errors, `401` unauthenticated,
`403` unauthorized (authenticated but not permitted), `404` not found, `409`
conflict, `500` only for genuinely unexpected server errors.

## Validation

Every write endpoint takes a `class-validator` DTO. The global `ValidationPipe`
(`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`) strips any
field not declared on the DTO and rejects requests containing unexpected
fields outright — this is also a security control, not just a UX one (see
[security.md](security.md)).

## Pagination, filtering, sorting

Once list endpoints exist (Phase 3+), they accept `page`/`pageSize` query
params (returned back in `meta`), plus endpoint-specific filter params and a
`sort` param (`field` or `-field` for descending). Cursor-based pagination is
adopted instead if/when an endpoint's data volume makes offset pagination
impractical — documented per-endpoint if so.

## Versioning

The `v1` prefix is deliberate from day one so a future breaking change can
ship as `v2` alongside it rather than breaking existing clients (including
Flutter apps once they exist).
