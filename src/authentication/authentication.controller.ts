import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { Public } from './guards/jwt.guard';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { PasswordUtils } from 'src/util/password-util';
import { JWTToken } from './dto/jwt-token.dto';
import { UserDTO } from 'src/user/dto/user.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('authenticate')
  @Public()
  public async authenticate(
    @Body() authenticateDTO: AuthenticateDTO,
  ): Promise<JWTToken> {
    return await this.authenticationService.authenticate(authenticateDTO);
  }

  @Post('change-password')
  public async changePassword(
    @Req() request,
    @Body() body: ChangePasswordDTO,
  ): Promise<UserDTO> {
    if (!new PasswordUtils().checkPasswordLength(body.newPassword)) {
      throw new BadRequestException(
        'The password must be at least 8 characters long, at least 1 capital letter, letters and numbers, and at most 100 characters.',
      );
    }
    return await this.authenticationService.changePassword(
      request.user.id,
      body,
    );
  }
}
