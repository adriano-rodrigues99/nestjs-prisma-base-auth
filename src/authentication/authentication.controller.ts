import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticateDTO } from './dto/authenticate.dto';
import { Public } from './guards/jwt.guard';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('authenticate')
  @Public()
  public async authenticate(@Body() authenticateDTO: AuthenticateDTO) {
    return this.authenticationService.authenticate(authenticateDTO);
  }
}
