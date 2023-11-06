import {Body, Controller, Get, Logger, Param, Post, Query, Request, Response, UseGuards} from '@nestjs/common';
import {AppService} from './app.service';
import {AuthenticatedGuard} from "./auth/authenticated.guard";
import {UsersService} from "./users/users.service";
import {User} from "./entity/user.entity";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly usersService: UsersService,
  ) {}

  @Get('/search')
  @UseGuards(AuthenticatedGuard)
  async searchUsers(@Query('query') query, @Query('page') page, @Request() req) {
    const user = req.user;
    const offset = (page - 1) * 5;

    return await this.usersService.fetchUserSearch(query, offset, user);
  }

  @Get('/profile/:id')
  @UseGuards(AuthenticatedGuard)
  async getUserProfile(@Param('id') profile_id: string, @Request() req) {
    const logged_user = req.user;
    return await this.usersService.loadProfile(logged_user, profile_id);
  }

  @Get('/chat')
  @UseGuards(AuthenticatedGuard)
  async getChats(@Request() req) {
    const user = req.user;
    return await this.usersService.getChats(user)
  }

  @Post('/chat')
  @UseGuards(AuthenticatedGuard)
  async createChat(@Request() req, @Body() users: User[]) {
    return await this.usersService.identifyAndCreateChat(req.user, users)
  }

  @Post('/friends/add')
  @UseGuards(AuthenticatedGuard)
  async addFriend(@Request() req, @Body() user: User) {
    Logger.log('Added friends')
    const self_user = req.user;
    return await this.usersService.addFriend(self_user, user)

  }

  @Post('/message')
  @UseGuards(AuthenticatedGuard)
  async sendMessage(@Request() req, @Body() body) {
    return await this.usersService.sendMessage(req.user, body.chat, body.text, body.images);
  }

  @Get('/contact')
  @UseGuards(AuthenticatedGuard)
  async getContactList(@Request() req) {
    return await this.usersService.getContacts(req.user);
  }

  @Get('/messages/:id')
  @UseGuards(AuthenticatedGuard)
  async getMessages(@Param('id') chat_id, @Request() req, @Query('limit') limit = '1') {
    return await this.usersService.fetchMessages(chat_id, req.user, Number.parseInt(limit));
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
