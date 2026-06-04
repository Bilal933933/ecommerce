import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.admin.dashboard')
  async dashboard() {
    return await this.adminService.getDashboard();
  }
}
