import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  async getToken(@Body() apiKey: any): Promise<string> {
    return await this.authService.getToken(apiKey);
  }
}
