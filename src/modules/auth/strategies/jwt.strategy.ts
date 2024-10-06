import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import globallConfig from 'src/configs/global.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: globallConfig.jwt_secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
  public async validateJwt(token: string): Promise<boolean> {
    try {
      // This will throw an error if the JWT is invalid
      const payload = this.jwtService.verify(token, {
        secret: globallConfig.jwt_secret, // You can use globallConfig.jwt_secret here
      });
      return !!payload; // Return true if valid
    } catch (error) {
      return false; // Invalid JWT
    }
  }
}
