import {Injectable, Logger} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) {
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }
}
