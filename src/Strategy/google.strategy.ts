import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';





@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){

    constructor(private config: ConfigService){
        super({

        })
    }

}