import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuthService {
  constructor(private configService: ConfigService) {}
  async naver(code: string, state: string) {
    const naverUrl: URL = new URL('https://nid.naver.com/oauth2.0/token');
    naverUrl.searchParams.append('grant_type', 'authorization_code');
    naverUrl.searchParams.append(
      'client_id',
      this.configService.get<string>(`CLIENT_ID`),
    );
    naverUrl.searchParams.append(
      'client_secret',
      this.configService.get<string>(`CLIENT_SECRET`),
    );
    naverUrl.searchParams.append('code', code);
    naverUrl.searchParams.append('state', state);
    const getAccessToket = await axios.get(`${naverUrl.href}`);

    const getProfile = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `bearer ${getAccessToket.data.access_token}`,
      },
    });

    // getProfile 받는정보
    //   resultcode: '00',
    //   message: 'success',
    //   response: {
    //     id: 'string',
    //     email: 'email'

    if (getProfile.data.message === 'success') {
      return getProfile.data.response.email;
    }
  }
}
