import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JWTGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.appSecret,
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ApiConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JWTGuard,
    },
  ],
})
export class AuthenticationModule {}
