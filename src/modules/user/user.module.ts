import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { BcryptUtils } from 'src/common/utils/password.utils';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UsersService, UserRepository, BcryptUtils, JwtService],
})
export class UserModule {}
