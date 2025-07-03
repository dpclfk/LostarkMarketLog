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

  async google(code: string) {
    const googleUrl: URL = new URL('https://oauth2.googleapis.com/token');
    const googleBody: URLSearchParams = new URLSearchParams();
    googleBody.append('grant_type', 'authorization_code');
    googleBody.append(
      'client_id',
      this.configService.get<string>(`GOOGLE_CLIENT_ID`),
    );
    googleBody.append(
      'client_secret',
      this.configService.get<string>(`GOOGLE_CLIENT_SECRET`),
    );
    googleBody.append('code', code);
    googleBody.append(
      'redirect_uri',
      'http://localhost:3701/auth/googlecallback',
    );

    const getAccessToken = await axios.post(`${googleUrl.href}`, googleBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const getProfile = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${getAccessToken.data.access_token}`,
        },
      },
    );

    // getProfile 받는정보
    // {
    //   id: 'number',
    //   email: '로그인 이메일',
    //   verified_email: true,
    //   name: '닉네임',
    //   given_name: 'string',
    //   family_name: 'string',
    //   picture: '이미지 링크'
    // }

    if (getProfile.data.email) {
      return getProfile.data.email;
    }
  }
}
