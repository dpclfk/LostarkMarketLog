import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { AdminDto } from 'src/auth/dto/admin-dto';
import { RegisterDto } from 'src/auth/dto/register-dto';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async login(email: string): Promise<Users | undefined> {
    return await this.usersRepository.findOne({
      where: { email: email },
      select: ['id', 'password', 'admin', 'nickname'],
    });
  }

  async register(registerDto: RegisterDto) {
    const userRegister: Users = this.usersRepository.create({
      email: registerDto.email,
      password: registerDto.password,
      nickname: registerDto.nickname,
    });
    await this.usersRepository.save(userRegister);
  }

  async adminAuth(adminDto: AdminDto) {
    const adminAuth = await this.usersRepository.findOne({
      where: { nickname: adminDto.nickname },
    });
    this.usersRepository.update(adminAuth.id, { admin: true });
  }

  async adminRemove(adminDto: AdminDto) {
    const adminAuth = await this.usersRepository.findOne({
      where: { nickname: adminDto.nickname },
    });
    if (adminAuth.id === 1) {
      throw new BadRequestException(
        '해당유저는 어드민권한 삭제가 불가능합니다.',
      );
    }
    this.usersRepository.update(adminAuth.id, { admin: false });
  }

  async addRefresh(id: number, refresh_token: string) {
    await this.usersRepository.update(id, { refresh: refresh_token });
  }

  async checkRefresh(id: number) {
    return await this.usersRepository.findOne({
      where: { id: id },
      select: ['refresh'],
    });
  }

  async logout(id: number) {
    await this.usersRepository.update(id, { refresh: null });
  }

  async notAdminList() {
    return await this.usersRepository.find({
      where: { admin: false },
      select: ['id', 'nickname'],
    });
  }

  async adminList() {
    return await this.usersRepository.find({
      where: { admin: true },
      select: ['id', 'nickname'],
    });
  }

  async addFirstAdmin(registerDto: RegisterDto) {
    const userRegister: Users = this.usersRepository.create({
      id: 1,
      email: registerDto.email,
      password: registerDto.password,
      nickname: registerDto.nickname,
      admin: true,
    });
    await this.usersRepository.upsert(userRegister, ['id']);
  }

  async naverRegister(email: string) {
    if (!email) {
      throw new BadRequestException('다시 로그인 해주세요');
    }
    const userInfo = await this.usersRepository.findOne({
      where: { email: email },
      select: ['id', 'admin', 'nickname'],
    });

    if (userInfo) {
      return userInfo;
    } else {
      const nickname = nanoid(10);
      const userRegister: Users = this.usersRepository.create({
        email: email,
        password: 'naver',
        nickname: `naver-${nickname}`,
      });
      const saved = await this.usersRepository.save(userRegister);
      const userInfo = await this.usersRepository.findOne({
        where: { id: saved.id },
        select: ['id', 'admin', 'nickname'],
      });
      return userInfo;
    }
  }

  async googleRegister(email: string) {
    if (!email) {
      throw new BadRequestException('다시 로그인 해주세요');
    }
    const userInfo = await this.usersRepository.findOne({
      where: { email: email },
      select: ['id', 'admin', 'nickname'],
    });

    if (userInfo) {
      return userInfo;
    } else {
      const nickname = nanoid(10);
      const userRegister: Users = this.usersRepository.create({
        email: email,
        password: 'google',
        nickname: `google-${nickname}`,
      });
      const saved = await this.usersRepository.save(userRegister);
      const userInfo = await this.usersRepository.findOne({
        where: { id: saved.id },
        select: ['id', 'admin', 'nickname'],
      });
      return userInfo;
    }
  }
}
