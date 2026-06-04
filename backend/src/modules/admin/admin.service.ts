import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getDashboard() {
    const [totalUsers, activeUsers, newThisMonth] = await Promise.all([
      this.adminRepository.countUsers(),
      this.adminRepository.countActiveUsers(),
      this.adminRepository.countNewUsersThisMonth(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth,
      },
    };
  }
}
