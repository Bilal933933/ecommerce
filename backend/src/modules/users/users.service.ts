/* eslint-disable @typescript-eslint/await-thenable */
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { USERS_REPOSITORY } from './users.constants';
import * as usersRepositoryInterface from './repository/users.repository.interface';
import { User } from '@prisma/client';
import { FilesService } from '../files/services/files.service';

export interface UpdateMeResult {
  user: User;
  emailChanged: boolean;
}

export interface SetAvatarResult {
  avatarUrl: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: usersRepositoryInterface.IUsersRepository,
    private readonly filesService: FilesService,
    private readonly i18n: I18nService,
  ) {}

  async createUser(
    data: usersRepositoryInterface.CreateUserData,
  ): Promise<User> {
    return this.usersRepository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.usersRepository.findAllPaginated(page, limit);
  }

  async updateUser(
    id: string,
    data: usersRepositoryInterface.UpdateUserData,
  ): Promise<User> {
    return this.usersRepository.update(id, data);
  }

  async updateMe(
    userId: string,
    data: {
      name?: string;
      deviceName?: string | null;
      avatarUrl?: string | null;
      phone?: string | null;
      bio?: string | null;
      gender?: usersRepositoryInterface.UpdateUserData['gender'];
      birthDate?: string | null;
      email?: string;
    },
  ): Promise<UpdateMeResult> {
    const current = await this.usersRepository.findById(userId);
    if (!current) {
      throw new NotFoundException('errors.users.not_found');
    }

    const updateData: usersRepositoryInterface.UpdateUserData = {};
    let emailChanged = false;

    if (data.name !== undefined) updateData.name = data.name;
    if (data.deviceName !== undefined) updateData.deviceName = data.deviceName;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.birthDate !== undefined) {
      updateData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    }

    if (data.email !== undefined && data.email !== current.email) {
      const existing = await this.usersRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        const lang = I18nContext.current()?.lang ?? 'ar';
        throw new ConflictException(
          await this.i18n.translate('errors.users.email_taken', { lang }),
        );
      }
      updateData.email = data.email;
      updateData.isEmailVerified = false;
      emailChanged = true;
    }

    const user = await this.usersRepository.update(userId, updateData);
    return { user, emailChanged };
  }

  async deleteUser(id: string): Promise<User> {
    return this.usersRepository.delete(id);
  }

  async setUserAvatar(
    userId: string,
    fileId: string,
  ): Promise<SetAvatarResult> {
    const lang = I18nContext.current()?.lang ?? 'ar';

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('errors.users.not_found', { lang }),
      );
    }

    const file = await this.filesService.findFileOwnedBy(fileId, userId);
    if (!file) {
      throw new NotFoundException(
        await this.i18n.translate('errors.file.not_found', { lang }),
      );
    }

    if (file.type !== 'IMAGE') {
      throw new ConflictException(
        await this.i18n.translate('errors.file.avatar_not_image', { lang }),
      );
    }

    if (user.avatarUrl) {
      const oldFile = await this.filesService.findFileByUrlForOwner(
        user.avatarUrl,
        userId,
      );
      if (oldFile) {
        await this.filesService.deleteFile(oldFile.id);
      }
    }

    const updated = await this.usersRepository.update(userId, {
      avatarUrl: file.url,
    });

    return { avatarUrl: updated.avatarUrl! };
  }

  async removeUserAvatar(userId: string): Promise<void> {
    const lang = I18nContext.current()?.lang ?? 'ar';

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('errors.users.not_found', { lang }),
      );
    }

    if (user.avatarUrl) {
      const oldFile = await this.filesService.findFileByUrlForOwner(
        user.avatarUrl,
        userId,
      );
      if (oldFile) {
        await this.filesService.deleteFile(oldFile.id);
      }
      await this.usersRepository.update(userId, { avatarUrl: null });
    }
  }

  async getMyProfile(userId: string) {
    const user = await this.usersRepository.findUserWithSessions(userId, {
      sessionsLimit: 10,
    });

    if (!user) {
      throw new NotFoundException('errors.users.not_found');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        deviceName: user.deviceName,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        phone: user.phone,
        bio: user.bio,
        gender: user.gender,
        birthDate: user.birthDate,
      },
      activeSessions: user.sessions.map((s) => ({
        id: s.id,
        userAgent: s.userAgent,
        ipAddress: s.ipAddress,
        expiresAt: s.expiresAt,
        createdAt: s.createdAt,
      })),
    };
  }
}
