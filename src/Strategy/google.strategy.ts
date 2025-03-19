import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';





@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){

    constructor(private config: ConfigService){
        super({
            clientID: config.get('GOOGLE_CLIENT_ID'),
            clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],

        })
    }


  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done,
  ) {
    const { name, emails, photos } = profile;
    const user =  {
      email: emails[0].value,
      firstname: name.givenName,
      lastname: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }

}