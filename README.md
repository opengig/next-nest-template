# Next.js + NestJS Template

A modern full-stack template featuring Next.js for frontend and NestJS for backend, with built-in authentication, email service, and more.

## 🚀 Features

- **Frontend**: Next.js 14 with App Router
- **Backend**: NestJS with Prisma ORM
- **UI Components**: shadcn/ui components
- **Authentication**: JWT-based auth system
- **Email Service**: Built-in email service with templates
- **Docker Support**: Containerization ready
- **Type Safety**: Full TypeScript support
- **API Client**: Axios-based API client with interceptors, automatic token handling, and type-safe responses
- **Form Validation**: Zod-based schema validation
- **State Management**: Built-in store setup
- **Theme**: Dark/Light mode support
- **LLM Service**: Built-in LLM service with Gemini support, type-safe responses, and retry mechanisms


## 🛠 Setup Instructions

### Prerequisites

- Node.js 20+
- pnpm
- Docker (optional, for containerized deployment)

### Environment Setup

1. **Frontend Setup**
   ```bash
   cd web
   cp .env.example .env
   pnpm install
   ```

2. **Backend Setup**
   ```bash
   cd server
   cp .env.example .env
   pnpm install
   ```

3. **Database Setup**
   ```bash
   cd server
   pnpm prisma generate
   pnpm prisma db push
   ```

### Development

1. **Start Backend Server**
   ```bash
   cd server
   pnpm start:dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd web
   pnpm dev
   ```

### Production Deployment

Using Docker:
```bash
./deploy-docker.sh
```

## 📁 Project Structure

```
├── web/                 # Frontend (Next.js)
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── constants/       # Constants files
│   ├── hooks/           # React Hooks
│   ├── lib/             # Lib Functions like, ApiClient, authOptions for NextAuth
│   ├── config/          # Mainly for Environment config
│   ├── services/        # API services Must call backend apis through this
│   ├── store/           # Zustand State management use for global state management
│   ├── utils/           # All utils Functions goes here
│   ├── validations/     # Zod schemas
│   └── types/           # TypeScript types
│
├── server/              # Backend (NestJS)
│   ├── src/
│   │   ├── auth/       # Authentication module
│   │   ├── mail/       # Email service
│   │   └── prisma/     # Database module
│   └── prisma/         # Prisma schema & client
│
└── docs/               # Documentation
```

## 📋 Coding Standards

### General Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful commit messages following commitlint

### Frontend Standards

1. **Components**
   - Use functional components with hooks
   - Follow atomic design principles
   - Place reusable components in `components/` directory
   - Use shadcn/ui components for consistent UI
   - Always write modular and clean code
   - Follow DRY principle

2. **State Management**
   - Use React hooks for local state
   - Implement global state in `store/` directory
   - Keep state logic separate from UI components

3. **API Integration**
   - Use services from `services/` directory for all API calls
   - Create type-safe service methods using ApiClient
   - Implement proper loading states and error handling
   - Never call API endpoints directly; always create a service method
   - Example service pattern:
     ```typescript
     // services/user.service.ts
     import { ApiClient } from '@/lib/api-client';
     import { User, UpdateUserDto } from '@/types';

     export class UserService {
       static async getProfile() {
         return await ApiClient.get<User>('/api/users/profile');
       }

       static async updateProfile(data: UpdateUserDto) {
         return await ApiClient.patch<User>('/api/users/profile', data);
       }
     }
     ```

4. **Routing**
   - Use App Router conventions
   - Implement proper loading and error states
   - Keep route handlers clean and focused

### Backend Standards

1. **Architecture**
   - Follow NestJS module architecture
   - Use dependency injection
   - Implement DTOs for data validation, add ApiProperty Tag to each dto field for swagger
   - Follow RESTful API conventions

2. **Database**
   - Use Prisma for database operations
   - Write clean and optimized queries
   - Use transactions where necessary

3. **Security**
   - Implement proper authentication checks
   - Validate all input data
   - Follow security best practices
   - Use environment variables for sensitive data

## 📚 Documentation

### API Client Usage

The `ApiClient` class provides a type-safe way to make HTTP requests with automatic token handling and error formatting:

```typescript
// Example usage:
import { ApiClient } from '@/lib/api-client';

// GET request
const response = await ApiClient.get<UserType>('/api/users/profile');
if (response.data) {
  // response.data is typed as UserType
  console.log(response.data);
} else {
  // response.error contains formatted error details
  console.error(response.error.message);
}

// POST request with data
const loginResponse = await ApiClient.post<LoginResponse>('/api/auth/login', { 
  email, 
  password 
});
```

Return type for all API calls:
```typescript
type ApiResult<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: {
        message: string;
        status: number;
        details?: Record<string, unknown>;
      };
    };
```

### Authentication System

The authentication system provides:
- JWT-based authentication with automatic token handling
- Multiple authentication methods:
  - Google OAuth authentication
  - Email OTP-based authentication
- Protected routes by default with `@Public()` decorator for public endpoints
- Easy access to user data via `@CurrentUser()` decorator
- Type-safe user information with `RequestUser` interface

[Detailed Authentication Documentation](./docs/authentication.md)

### Email Templates

The email service features:
- Type-safe template system with HTML support
- Built-in templates for OTP and Welcome emails
- Easy template creation with TypeScript types
- Automatic context validation
- Placeholder system using `{{variableName}}` syntax

[Detailed Email Templates Documentation](./docs/email-templates.md)

### LLM Service

The LLM service features:
- Type-safe interaction with Large Language Models
- Support for both string and JSON responses
- Configurable retry mechanisms with exponential backoff
- Temperature control for response randomness
- Automatic error handling and response formatting
- Built-in support for Gemini model

[Detailed LLM Service Documentation](./docs/llm-service.md)

## Extract Text Util Function (server/src/common/utils/extractText.utils.ts)
- Extract Text from File
- Supported File Types : PDF, DOCX, TEXT, CSV, XLSX
- Just Call extract `async extractTextFromDocument(file: Express.Multer.File):string` function.
