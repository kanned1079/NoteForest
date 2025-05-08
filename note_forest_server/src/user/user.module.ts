import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
// import {JwtModule} from "@nestjs/jwt"
import {AuthModule} from "../auth/auth.module";

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  // JwtModule.register({
  //   secret: '1TCdd4aNqF4trHyx',
  //   signOptions: {
  //     expiresIn: '10m'
  //   }
  // }),
      AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
