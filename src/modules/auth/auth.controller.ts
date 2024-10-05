import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { UserRepositoryResponse } from '../user/interfaces/user-repo-res.interface';
import { UsersService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userSerice: UsersService) {}
  @Post('signup')
  async signUp(@Body() signUpData: SignUpDTO): Promise<UserRepositoryResponse> {
    return this.userSerice.signup(signUpData);
  }

  @Post('login')
  async login(
    @Body() LoginData: Partial<SignUpDTO>,
  ): Promise<UserRepositoryResponse> {
    return this.userSerice.login(LoginData);
  }
}
