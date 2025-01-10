// src/common/decorators/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../common/enums/user-role.enum";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
