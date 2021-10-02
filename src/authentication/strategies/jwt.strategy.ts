import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from '../../user/user.service';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly userService: UserService,
    private readonly apiConfigService: ApiConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.appSecret,
      signOptions: {
        expiresIn: '1d',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<UserDTO> {
    const { sub: id } = payload;

    const user = await this.userService.findOne(+id);

    if (!user) {
      return null;
    }

    return user;
  }
}
