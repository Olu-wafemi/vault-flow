import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService  } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService, private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean{
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) return false;

        const token = authHeader.split(' ')[1]
        try{
            request.user = this.jwtService.verify(token);
            return true
        }
        catch{
            return false
        }
    }
}