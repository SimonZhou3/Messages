import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entity/user.entity";
import {UserMetadata} from "../entity/user_metadata.entity";
import { UsersController } from './users.controller';
import {Contact} from "../entity/contact.entity";
import {Chat} from "../entity/chat.entity";
import {Messages} from "../entity/messages.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserMetadata, Contact, Chat, Messages])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
