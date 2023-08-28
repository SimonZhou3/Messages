import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UseGuards,
    Response,
    Get
} from '@nestjs/common';
import {RegisterDTO} from "../dto/register.dto";
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import * as passport from "passport";
import {AuthGuard} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {LocalAuthGuard} from "./local.auth.guard";
import * as Http from "http";
import {AuthenticatedGuard} from "./authenticated.guard";
import {GoogleOauthGuard} from "./google/google.auth.guard";
import {FacebookAuthGuard} from "./facebook/facebook.auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {
    }

    @Post('signup')
    @UseGuards(LocalStrategy)
    async signup(@Body() registerDTO: RegisterDTO, next, @Request() req, @Response() res): Promise<any> {
        try {
            await this.usersService.addUserToDatabase(registerDTO);
            const user = await this.authService.validateUser(registerDTO.email, registerDTO.password);
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.status(HttpStatus.OK).send();
            });
        } catch (error) {
            return res.status(HttpStatus.FORBIDDEN).send(error.message);
        }
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    async login(@Request() req, @Response() res) {
        return res.status(HttpStatus.OK).json(req.user)
    }

    @Post('login/success')
    @UseGuards(LocalAuthGuard)
    async checkUser(@Request() req, @Response() res): Promise<any> {
        if (req.user) {
            res.status(HttpStatus.OK).json({
                success: true,
                message: "successful",
                user: req.user,
                cookies: req.cookies
            })
        }
    }

    @Post('logout')
    async logout(@Request() req, @Response() res) {
        req.session.destroy(function (error) {
            res.redirect('/')
        });
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Request() req, @Response() res) {}

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleCallback(@Request() req, @Response() res) {
        res.redirect(process.env.CLIENT_URL)
    }

    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    async facebookAuth(@Request() req, @Response() res) {}

    @Get('facebook/callback')
    @UseGuards(FacebookAuthGuard)
    async facebookCallback(@Request() req, @Response() res) {
        res.redirect(process.env.CLIENT_URL)
    }

    @Get('test')
    @UseGuards(AuthenticatedGuard)
    async protected(@Request() req) {
        return req.user;
    }

}
