import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { User } from '@prisma/client';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  public async sendCreation(user: User): Promise<void> {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Sistema X - Criação de conta',
        template: join(__dirname, 'templates', 'account-creation'),
        context: {
          name: user.name,
          email: user.email,
          password: user.password,
          url: `${this.apiConfigService.baseUrl}`,
        },
      })
      .catch(console.error);
  }
}
