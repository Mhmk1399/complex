# API Architecture Documentation

## Overview
This API system provides a clean, modular approach to handling HTTP requests with three main components:
- **api-service.ts**: Core HTTP client class
- **api-factory.ts**: Service factory with dynamic endpoint builder
- **api.ts**: Default configurations and service instances

## File Structure

```
lib/
├── api-service.ts    # Core HTTP client class
├── api-factory.ts    # Factory for creating API services
└── api.ts           # Default service configurations
```

## 1. api-service.ts (Core HTTP Client)

### Purpose
Base class that handles all HTTP operations with fetch API wrapper.

### Key Features
- **HTTP Methods**: GET, POST, PATCH, DELETE
- **Header Management**: Automatic header merging
- **Error Handling**: HTTP status error throwing
- **SWR Integration**: Optional React hook for data fetching

### Configuration Interface
```typescript
interface ApiConfig {
  baseUrl?: string                    // Base URL for all requests
  headers?: Record<string, string>    // Default headers
  cache?: number                      // Cache duration (for SWR)
}
```

### Usage Example
```typescript
const service = new ApiService({
  baseUrl: '/api',
  headers: { 'Authorization': 'Bearer token' }
})

// Direct method calls
await service.get('/users')
await service.post('/users', { name: 'John' })
```

## 2. api-factory.ts (Service Factory)

### Purpose
Factory function that creates configured API service instances with enhanced features.

### Key Features
- **Dynamic Endpoint Builder**: Fluent API for endpoint construction
- **Predefined Endpoints**: Configure common endpoints upfront
- **Method Binding**: Preserves `this` context for service methods

### Factory Configuration
```typescript
interface ServiceConfig {
  baseUrl?: string                           // Base URL
  headers?: Record<string, string>           // Default headers  
  endpoints?: Record<string, string>         // Predefined endpoints
}
```

### Usage Patterns

#### 1. Dynamic Endpoint Builder
```typescript
const api = createApiService({ baseUrl: '/api' })

// Fluent endpoint building
await api.endpoint('/users').get()
await api.endpoint('/users').post({ name: 'John' })
await api.endpoint('/users/1').patch({ name: 'Jane' })
await api.endpoint('/users/1').delete()
```

#### 2. Predefined Endpoints
```typescript
const api = createApiService({
  baseUrl: '/api',
  endpoints: {
    users: '/users',
    posts: '/posts'
  }
})

// Use predefined endpoints
await api.users.get()
await api.posts.post({ title: 'Hello' })
```

#### 3. Direct Methods
```typescript
const api = createApiService({ baseUrl: '/api' })

// Direct method access
await api.get('/users')
await api.post('/users', { name: 'John' })
```

## 3. api.ts (Default Configurations)

### Purpose
Provides pre-configured API service instances for common use cases.

### Default Service
```typescript
export const api = createApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  }
})
```

### Specialized Services
```typescript
export const userApi = createApiService({
  baseUrl: '/api',
  endpoints: {
    users: '/users',
    profile: '/profile',
    posts: '/posts'
  }
})
```

## Implementation in Your Project

### Current Usage in main.tsx
```typescript
// Service creation with dynamic headers
const api = createApiService({
  baseUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
    storeId: localStorage.getItem('storeId') || 'default'
  }
})

// Dynamic endpoint usage
await api.endpoint('/layout-jason').get({
  headers: {
    selectedRoute: selectedRoute,
    activeMode: activeMode,
  }
})

await api.endpoint('/route-handler').post(null, {
  headers: { filename: name }
})
```

## Architecture Benefits

### 1. Modularity
- **Separation of Concerns**: Each file has a specific responsibility
- **Reusable Components**: Services can be configured for different use cases
- **Easy Testing**: Individual components can be tested in isolation

### 2. Flexibility
- **Dynamic Endpoints**: Build endpoints on-the-fly
- **Multiple Configurations**: Different services for different APIs
- **Header Management**: Per-request and default header support

### 3. Developer Experience
- **Fluent API**: Readable endpoint construction
- **Type Safety**: TypeScript interfaces for configuration
- **Consistent Patterns**: Same API across all HTTP methods

## Advanced Features

### SWR Integration
```typescript
// React hook for data fetching with caching
const { data, error } = api.useGet('/users', {
  revalidateOnFocus: false,
  refreshInterval: 60000
})
```

### Custom Headers Per Request
```typescript
await api.endpoint('/protected').get({
  headers: { 'Authorization': 'Bearer new-token' }
})
```

### Error Handling
```typescript
try {
  await api.endpoint('/users').get()
} catch (error) {
  console.error('HTTP Error:', error.message) // "HTTP 404"
}
```

## Best Practices

### 1. Service Configuration
- Use environment variables for base URLs
- Set common headers at service creation
- Create specialized services for different APIs

### 2. Endpoint Organization
- Use dynamic endpoints for flexible APIs
- Use predefined endpoints for stable, frequently-used routes
- Group related endpoints in specialized services

### 3. Error Handling
- Always wrap API calls in try-catch blocks
- Handle HTTP errors appropriately in your UI
- Use consistent error messaging patterns

## Caching Strategy

### Current Implementation
- **Frontend Cache**: Manual state-based caching in components
- **Cache Duration**: 1 minute for GET requests
- **Cache Keys**: Include dynamic parameters (route, mode)

### SWR Alternative (Available but not used)
- **Automatic Revalidation**: Background updates
- **Focus Revalidation**: Refresh on window focus
- **Interval Refresh**: Periodic data updates

The current manual caching approach was chosen for precise control over cache behavior and compatibility with existing useEffect patterns.