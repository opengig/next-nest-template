# Email Templates Guide

This guide explains how to create and use type-safe email templates in the application.

## Table of Contents
- [Overview](#overview)
- [Creating a New Template](#creating-a-new-template)
- [Using Templates](#using-templates)
- [Type Safety](#type-safety)

## Overview

The email template system provides a type-safe way to send templated emails. Each template has:
- A HTML template with placeholders (e.g., `{{variableName}}`)
- A TypeScript type defining the required context variables
- Type-safe integration with the mail service

## Creating a New Template

### 1. Create Template File
Create a new file in `server/src/mail/templates/` (e.g., `welcome-template.ts`):

```typescript
// welcome-template.ts

export const welcomeTemplate = `
<div>
  <h1>Welcome {{name}}!</h1>
  <p>We're excited to have you join us.</p>
  <p>Your account was created on {{joinDate}}.</p>
</div>
`;

// Define the context type for this template
export type WelcomeTemplateContext = {
  name: string;
  joinDate: string;
};
```

### 2. Register Template
Update `server/src/mail/templates/index.ts`:

```typescript
import { otpTemplate } from './otp-template';
import { welcomeTemplate } from './welcome-template';
import type { OtpTemplateContext } from './otp-template';
import type { WelcomeTemplateContext } from './welcome-template';

export const templates = {
  OTP: otpTemplate,
  WELCOME: welcomeTemplate,
} as const;

export type Template = keyof typeof templates;

export type TemplateContextMap = {
  OTP: OtpTemplateContext;
  WELCOME: WelcomeTemplateContext;
};
```

## Using Templates

Use the `sendTemplateMail` method in `MailService`:

```typescript
// Example: Sending OTP email
await mailService.sendTemplateMail({
  to: 'user@example.com',
  subject: 'Your OTP',
  templateName: 'OTP',
  context: {
    otp: '123456',
    validity: 5
  }
});

// Example: Sending Welcome email
await mailService.sendTemplateMail({
  to: 'user@example.com',
  subject: 'Welcome to Our Platform',
  templateName: 'WELCOME',
  context: {
    name: 'John Doe',
    joinDate: '2024-04-22'
  }
});
```

## Type Safety

The template system provides full type safety:

1. `templateName` must be a valid template key
2. `context` must match the template's context type
3. TypeScript will show errors if:
   - Using an invalid template name
   - Missing required context properties
   - Including extra/invalid context properties
   - Using wrong property types

### Example of Type Safety

```typescript
// ❌ TypeScript Error: Wrong context type
mailService.sendTemplateMail({
  templateName: 'OTP',
  context: {
    wrongField: 'value' // Error: Object literal may only specify known properties
  }
});

// ❌ TypeScript Error: Missing required property
mailService.sendTemplateMail({
  templateName: 'WELCOME',
  context: {
    name: 'John' // Error: Property 'joinDate' is missing
  }
});

// ✅ Correct usage
mailService.sendTemplateMail({
  templateName: 'WELCOME',
  context: {
    name: 'John',
    joinDate: '2024-04-22'
  }
});
```

## Template Placeholders

- Use double curly braces for placeholders: `{{variableName}}`
- Placeholders are automatically replaced with the corresponding context values
- All placeholder values are converted to strings using `String(value)`

## Best Practices

1. Keep templates in separate files for better organization
2. Use descriptive names for templates and context properties
3. Document any special formatting requirements in the context type
4. Use HTML templates for better email compatibility
5. Test templates with various context values before using in production
