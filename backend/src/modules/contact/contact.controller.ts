import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.contact.sent')
  async send(@Body() dto: ContactDto) {
    await this.contactService.send(dto);
    return { sent: true };
  }
}
