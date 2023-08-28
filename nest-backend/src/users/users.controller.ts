import {Controller, Get, UseGuards, Response, Request, HttpStatus, Logger, Put, Body} from '@nestjs/common';
import {AuthenticatedGuard} from "../auth/authenticated.guard";
import {UsersService} from "./users.service";
import {UserMetadataDTO} from "../dto/usermetadata.dto";

@Controller('users')
export class UsersController {

    constructor(
       private usersService: UsersService
    ) {}

    @Get('/')
    @UseGuards(AuthenticatedGuard)
    async getUserInformation(@Request() req, @Response() res ) {
        // Required to always update data as req.user is static and does not update until authentication
        return res.status(HttpStatus.OK).json(await this.usersService.getUserMetadata(req.user));
    }

    @Put('/metadata')
    @UseGuards(AuthenticatedGuard)
    async updateMetadata(@Request() req, @Body() userMetadataDTO: UserMetadataDTO ) {
        const user = req.user;
        return await this.usersService.updateUserMetadata(user, userMetadataDTO)
    }

}
