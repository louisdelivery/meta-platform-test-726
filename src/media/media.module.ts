import { Module } from '@nestjs/common';
import { MetaModule } from '../meta/meta.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [MetaModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
