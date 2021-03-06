import { MailerOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  private getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get(key, defaultValue);
    if (value === undefined) {
      throw new Error(key + ' env var not set'); // probably we should call process.exit() too to avoid locking the service
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' env var is not a number');
    }
  }

  private getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.configService.get(key, defaultValue?.toString());
    if (value === undefined) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get(key, defaultValue);

    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    return value.toString().replace(/\\n/g, '\n');
  }

  private getArrayFromComma(key: string, defaultValue?: string): string[] {
    const value = this.configService.get(key, defaultValue);

    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    try {
      return value
        .toString()
        .split(',')
        .filter((f: string) => f);
    } catch {
      throw new Error(key + ' env var is not a string comma separated');
    }
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV', 'development');
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION', this.isDevelopment);
  }

  get appSecret(): string {
    return this.getString('APP_SECRET', 'APPSECRET');
  }

  get baseUrl(): string {
    return this.getString('BASE_URL', 'http://localhost:3333');
  }

  get appConfig(): { port: number } {
    return {
      port: this.getNumber('PORT', 3000),
    };
  }

  get mailerConfig(): MailerOptions {
    console.log(join(__dirname, '..', '..', '..', 'mail', 'templates'));

    const MAIL_USER = this.getString('MAIL_USER');
    const MAIL_PASSWORD = this.getString('MAIL_PASSWORD');
    const MAIL_HOST = this.getString('MAIL_HOST');
    return {
      transport: `smtps://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}`,
      defaults: {
        from: `Equipe X <${this.getString('MAIL_FROM')}>`,
      },
      template: {
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
