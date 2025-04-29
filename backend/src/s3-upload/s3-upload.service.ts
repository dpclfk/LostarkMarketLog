import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';

@Injectable()
export class S3UploadService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async s3Upload(imageUri: string, name: string) {
    // stream 으로 다운하기
    const imgDownload = await axios({
      method: 'GET',
      url: imageUri,
      responseType: 'arraybuffer',
    });

    // S3 업로드 설정
    const imgUpload = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
      Key: name,
      Body: imgDownload.data,
      ContentType: imgDownload.headers['content-type'],
    });

    // S3에 업로드
    await this.s3Client.send(imgUpload);

    return {
      success: true,
    };
  }
}
