import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma/prisma.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les contacts WhatsApp observes dans les webhooks' })
  findAll() {
    return this.prisma.contact.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true, conversations: true } } },
    });
  }
}
