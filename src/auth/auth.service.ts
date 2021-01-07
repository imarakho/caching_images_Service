import { HttpService, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/IAuth.service';

@Injectable()
export class AuthService implements IAuthService {
  private apiUrl: string;

  constructor(private readonly http: HttpService) {
    this.apiUrl = process.env.API_URL;
   }

  async getToken(apiKey: string): Promise<string> {
      const headers = {
        'Content-Type': 'application/json',
      }
      const result = await this.http.post(
        `${this.apiUrl}/auth`,
        { apiKey },
        { headers },
      ).toPromise();

      return result.data && result.data.token ? result.data.token : "401:Unovtorized";
    } 
}
