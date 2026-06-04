import type { Gender, Prisma, User } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  role?: Prisma.UserCreateInput['role'];
  deviceName?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  gender?: Gender;
  birthDate?: Date;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  password?: string;
  role?: Prisma.UserUpdateInput['role'];
  deviceName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  bio?: string | null;
  gender?: Gender | null;
  birthDate?: Date | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
}

export type UserWithSessions = Prisma.UserGetPayload<{
  include: { sessions: true };
}>;

export interface FindUserWithRelationsOptions {
  sessionsLimit?: number;
}

export interface IUsersRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<User>;
  findUserWithSessions(
    userId: string,
    options?: FindUserWithRelationsOptions,
  ): Promise<UserWithSessions | null>;
}
