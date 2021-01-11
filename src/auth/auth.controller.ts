import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IBodyWithApiKey } from './interfaces/IBodyWithApiKey';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger();

  constructor(private readonly authService: AuthService) {}

  @Post()
  async getToken(@Body() body: IBodyWithApiKey): Promise<string> {
    const { apiKey } = body;

    this.logger.log(`GET token by apiKey ${apiKey}`);
    return await this.authService.getToken(apiKey);
  }
}
