# To start the project for development

1. run `pnpm i` to install all packages
2. run `docker-compose up -d` for running databse in another terminal.
3. run prisma generate, to generate prisma client.
4. run `pnpm start:dev` to run the server
5. check if server is running at http://localhost:3001/

# Swagger UI
-   swagger running on: localhost:3001/api

# To generate typescript types for API contract
    - run `swagger-typescript-api -p swagger-spec.json -o ./generated-types``
    - the types are in folder generated-types/Api.ts

# When changing any code
1. after code has been changed run `pnpm run lint` for linting and formatting the code.
