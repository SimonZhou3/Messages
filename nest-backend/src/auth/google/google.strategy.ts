import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {UsersService} from "../../users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private userService: UsersService
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ['profile', 'email'],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { id, name, emails } = profile;
        const user = await this.userService.findOneByEmail(emails[0].value);
        if (!user) {
            const google_user = {
                provider: 'google',
                providerId: id,
                email: emails[0].value,
                first_name: name.givenName,
                last_name: name.familyName ? name.familyName : "",
            };
            const new_user = await this.userService.createOauthUser(google_user);
            done(null, new_user)
        }
         done(null, user);
    }
;}