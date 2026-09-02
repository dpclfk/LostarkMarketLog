import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    // 서버 로컬 디스크에 이미지를 저장할 경로
    this.uploadDir =
      this.configService.get<string>('UPLOAD_DIR') ||
      path.join(process.cwd(), 'uploads');
  }

  async uploadFromUrl(imageUri: string, name: string) {
    // 원본 이미지 다운로드
    const imgDownload = await axios({
      method: 'GET',
      url: imageUri,
      responseType: 'arraybuffer',
    });

    // 저장 폴더가 없으면 생성
    await fs.mkdir(this.uploadDir, { recursive: true });

    // name을 그대로 파일명으로 사용
    await fs.writeFile(path.join(this.uploadDir, name), imgDownload.data);

    return {
      success: true,
    };
  }
}
