# Project Setup

1. This is a momo repo for both frontend (`web`) and the backend (`server`).

## Running the projects

Refer the readme of the project you want to run in their directory

1. Frontend: [README](./web/README.md)
2. Backend: [README](./server/README.md)

## Docker

You can also run the project through docker.

1. Make sure you have docker and docker compose installed and docker daemon running in your system.
2. In the root of the project, run:

```sh
docker compose up -d --build
```

# Git guidelines

-   The `master` branch is used for production and the `dev` branch is used for development environment.
-   All the work should be done in a `feature/` branch and should be sourced from `dev` branch.
-   Keep taking pull `dev` branch to avoid any future conflicts.
-   Any work can't be pushed in the `master` branch directly, for a production deployment, raise a PR from the `dev` branch to the `master` branch.

The project has git hooks setup with the following checks:
-   Formats all the files with prettier before every commit.
-   Check for linting issues before every commit
-   Runs all unit tests before every push
-   Makes a build before every push

Do not ignore or override them to prevent any further issues.

## Commit Guidelines

A healthy commit message is written in third form of verb, depicting the exact work in message as small as possible.
Always format your message in the following way:

```
subject: message
```

The `subject` can be any one of the following: build, ci, docs, feat, fix, perf, refactor, style, test, config <br />
Read more [here](./commitlint.config.js).

## General Guidelines

### Components Folder

    - Naming Convention: Use PascalCase.
    - Purpose: Store reusable UI components.
    - Examples: Header.jsx, Footer.jsx, UserProfile.jsx.

### Pages Folder

    - Naming Convention: Use lowercase and hyphens.
    - Purpose: Store page components mapped to routes.
    - Examples: index.jsx, about.jsx, api/users.js.

### Public Folder

    - Naming Convention: Use lowercase and hyphens.
    - Purpose: Store static assets like images and fonts.
    - Examples: images/logo.png, fonts/Roboto.woff2.

### Styles Folder

    - Naming Convention: Use lowercase and hyphens for global styles, PascalCase for module-specific styles.
    - Purpose: Store global CSS files and CSS modules.
    - Examples: globals.css, Home.module.css.

### Utils Folder

    - Naming Convention: Use camelCase for files.
    - Purpose: Store utility functions.
    - Examples: fetchData.js, formatDate.js.

### Hooks Folder

    - Naming Convention: Use camelCase.
    - Purpose: Store custom hooks.
    - Examples: useAuth.js, useFetch.js.

### Context Folder

    - Naming Convention: Use PascalCase for context files.
    - Purpose: Store context providers and consumers.
    - Examples: AuthContext.js.

### Services Folder

    - Naming Convention: Use camelCase for files.
    - Purpose: Store service functions for API calls and business logic.
    - Examples: api.js.
