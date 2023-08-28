import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entity/user.entity";
import {LocalStrategy} from "./local.strategy";
import {PassportModule} from "@nestjs/passport";
import {SessionSerializer} from "./session.serializer";
import {GoogleStrategy} from "./google/google.strategy";
import {FacebookStrategy} from "./facebook/facebook.strategy";

@Module({
  imports: [UsersModule, PassportModule.register({session: true}), TypeOrmModule.forFeature([User])],
  providers: [AuthService, LocalStrategy, SessionSerializer, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
