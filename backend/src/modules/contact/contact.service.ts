import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async send(dto: ContactDto): Promise<void> {
    await this.mailService.sendContactEmail(dto);
  }
}
