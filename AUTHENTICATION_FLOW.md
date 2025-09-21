# Authentication Flow Documentation

## Current Secure Flow

### 1. Initial Redirect from Dashboard
```
Dashboard → App with ?token=JWT_TOKEN
```

### 2. Token Processing (Client-Side)
- `AuthHandler` extracts token from URL query
- Token sent to `/api/verify-token` endpoint via POST request
- **Server-side verification only** - JWT secret never exposed to client

### 3. Server-Side Verification (`/api/verify-token`)
```
POST /api/verify-token
Body: { "token": "JWT_TOKEN" }
Response: { "valid": true/false, "user": DecodedToken }
```

### 4. Authentication Success Path
- Valid token → Save to localStorage
- Remove token from URL
- Refresh page to clean URL
- Show main application content

### 5. Authentication Failure Path
- Invalid token → Show error page
- No token in URL or localStorage → Show access denied

### 6. Subsequent Visits
- Check localStorage for existing token
- Send token to server for verification
- Valid → Show app / Invalid → Show error

## Key Differences from Previous Flow

### Previous (Insecure) Flow:
```
❌ Client-side JWT verification using exposed secret
❌ JWT_SECRET available in browser environment
❌ Direct jwt.verify() calls in browser
❌ Vulnerable to token forgery
```

### Current (Secure) Flow:
```
✅ Server-side only JWT verification
✅ JWT_SECRET stays on server
✅ API endpoint handles all verification
✅ Prevents token forgery attacks
```

## Security Improvements

| Aspect | Previous | Current |
|--------|----------|---------|
| JWT Secret | Exposed to client | Server-only |
| Verification | Client-side | Server-side API |
| Token Forgery | Possible | Prevented |
| XSS Risk | High (secret exposed) | Low (no secret) |

## Flow Diagram

```
User Redirect → AuthHandler → /api/verify-token → localStorage → App Content
     ↓              ↓              ↓                ↓           ↓
  ?token=JWT    Extract Token   Server Verify    Store Token  Show UI
```