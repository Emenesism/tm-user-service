import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import globallConfig from 'src/configs/global.config';
import { BcryptUtils } from 'src/common/utils/password.utils';
import { UserModule } from '../user/user.module';
import { UsersService } from '../user/user.service';
@Module({
  imports: [
    JwtModule.register({
      secret: globallConfig.jwt_secret,
      signOptions: { expiresIn: '48h' },
    }),
    UserModule,
  ],
  providers: [AuthService, BcryptUtils, UsersService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
