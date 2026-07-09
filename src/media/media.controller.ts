import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma/prisma.service';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly media: MediaService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liste les medias observes dans les webhooks' })
  findAll() {
    return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Recupere un media WhatsApp via Graph API, telecharge le fichier et l enregistre dans uploads/' })
  download(@Param('id') id: string) {
    return this.media.download(id);
  }
}
