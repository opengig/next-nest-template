# Authentication Documentation

## Overview

The authentication system in this application is built using NestJS and implements a robust security model with JWT (JSON Web Token) based authentication. By default, all API endpoints are protected and require authentication. The system provides decorators and guards to manage authentication and access control.

## Authentication Flow

The system supports two authentication methods:
1. Google Authentication
2. Email OTP Authentication

### Google Authentication
- Uses Google OAuth2 for authentication
- Verifies Google ID token
- Creates/updates user in the database
- Returns JWT token for subsequent requests

### Email OTP Authentication
- Sends OTP to user's email
- Verifies OTP
- Creates/updates user in the database
- Returns JWT token for subsequent requests

## Decorators

### @Public() Decorator

The `@Public()` decorator is used to mark specific endpoints as publicly accessible, bypassing the authentication requirement.

```typescript
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Post('login')
  @Public()  // This endpoint will be publicly accessible
  async login() {
    // ...
  }
}
```

Under the hood, the Public decorator sets metadata that is later checked by the authentication guard:

### @CurrentUser() Decorator

The `@CurrentUser()` decorator provides easy access to the authenticated user's information within your controllers.

```typescript
import { CurrentUser } from './decorators/user.decorator';
import { RequestUser } from './dto/request-user.dto';

@Controller('users')
export class UsersController {
  @Get('profile')
  async getProfile(@CurrentUser() user: RequestUser) {
    // user object contains: id, email, name, avatarUrl, role, sub
    return user;
  }
}
```

The RequestUser interface defines the structure of the user object:

```typescript
interface RequestUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  sub: string;
}
```

## Guards

### JWTAuthGuard

The JWT Authentication Guard is automatically applied to all routes (unless marked as @Public). It:
1. Extracts the JWT token from the request header
2. Validates the token
3. Attaches the user information to the request object

```typescript
// Example of how the guard is applied globally in your application
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

## Default Security Behavior

By default, all API endpoints in the application are protected and require authentication. This is achieved through the global application of the JWTAuthGuard. To make an endpoint publicly accessible:

1. Use the @Public() decorator on the specific endpoint
2. The endpoint will bypass authentication checks

Example of protected vs public endpoints:

```typescript
@Controller('api')
export class ApiController {
  @Get('protected')
  protectedEndpoint() {
    // Requires authentication
    return 'This endpoint is protected';
  }

  @Public()
  @Get('public')
  publicEndpoint() {
    // No authentication required
    return 'This endpoint is public';
  }
}
```

## Best Practices

1. Always use @Public() decorator explicitly for public endpoints
2. Use @CurrentUser() decorator to access user information instead of accessing the request object directly
3. Keep sensitive operations protected (without @Public() decorator)
4. Implement additional authorization checks where needed (e.g., role-based access control)

## Example Usage

Here's a complete example showcasing the authentication system:

```typescript
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Public endpoint for user registration
    return this.userService.register(registerDto);
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: RequestUser) {
    // Protected endpoint - only accessible to authenticated users
    // user object is automatically populated with authenticated user's info
    return this.userService.getProfile(user.id);
  }

  @Put('settings')
  async updateSettings(
    @CurrentUser() user: RequestUser,
    @Body() settings: UpdateSettingsDto
  ) {
    // Protected endpoint with access to user information
    return this.userService.updateSettings(user.id, settings);
  }
}
