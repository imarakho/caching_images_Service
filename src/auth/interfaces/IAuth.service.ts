export interface IAuthService {
  getToken(apiKey: string): Promise<string>;
}
