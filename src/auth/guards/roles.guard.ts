import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/users/user.entity";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<UserRole[]>("roles", context.getHandler());
        if(!requiredRoles) return true

        const {user} = context.switchToHttp().getRequest()

        console.log(user)
        return requiredRoles.includes(user.role)
    }

}