import { HttpException, HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from './interfaces/IAuth.service';

@Injectable()
export class AuthService implements IAuthService {
  private apiUrl: string;
  private readonly logger = new Logger();

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = configService.get('API_URL');
  }

  async getToken(apiKey: string): Promise<string> {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const result = await this.http
        .post(`${this.apiUrl}/auth`, { apiKey }, { headers })
        .toPromise();
      const { token } = result.data;

      return token;
    } catch (error) {
      const { status, statusText } = error.response;

      this.logger.error(`Error AuthSevice: ${status}:${statusText}`);
      throw new HttpException(
        {
          status: status,
          error: statusText,
        },
        status,
      );
    }
  }
}
