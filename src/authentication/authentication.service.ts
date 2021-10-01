import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { SignOptions } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { JWTToken } from './dto/jwt-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  public async authenticate(
    authenticateDTO: AuthenticateDTO,
  ): Promise<JWTToken> {
    const user: User = await this.userService.findByEmail(
      authenticateDTO.email,
    );

    const valid = user
      ? await compare(authenticateDTO.password, user.password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('Invalid user or password.');
    }

    const token: string = await this.generateToken(user);

    delete user.password;

    return {
      token,
      user,
    };
  }

  public async generateToken(user: User): Promise<string> {
    const opts: SignOptions = {
      subject: String(user.id),
    };

    return this.jwt.signAsync({}, opts);
  }
}
