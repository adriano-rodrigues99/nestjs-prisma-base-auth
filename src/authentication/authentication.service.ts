import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { SignOptions } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { JWTToken } from './dto/jwt-token.dto';
import { UserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  public async encryptPassword(password: any): Promise<string> {
    return await hash(password, 8);
  }

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

  public async changePassword(
    id: any,
    body: ChangePasswordDTO,
  ): Promise<UserDTO> {
    const user: User | null = await this.userService.findOne(id, true);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }
    if (!(await compare(body.currentPassword, user.password))) {
      throw new BadRequestException('Wrong password.');
    }
    if (await compare(body.newPassword, user.password)) {
      throw new BadRequestException(
        'Your new password cannot be the same as your current password.',
      );
    }
    return await this.userService.update(id, {
      ...user,
      password: body.newPassword,
    });
  }
}
