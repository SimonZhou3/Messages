import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile} from 'passport-facebook';
import {UsersService} from "../../users/users.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private userService: UsersService
    ) {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: "/auth/facebook/callback",
            scope: 'email',
            profileFields: ['emails', 'name'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        const { id, name, emails } = profile;
        const user = await this.userService.findOneByEmail(emails[0].value);
        if (!user) {
            const facebook_user = {
                provider: 'facebook',
                providerId: id,
                email: emails[0].value,
                first_name: name.givenName,
                last_name: name.familyName ? name.familyName : "",
            };
            const new_user = await this.userService.createOauthUser(facebook_user);
            done(null, new_user)
        }
        done(null, user);
    }
    ;}