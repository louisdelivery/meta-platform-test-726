import { Module } from '@nestjs/common';
import { MetaModule } from '../meta/meta.module';
import { SharedModule } from '../shared/shared.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [SharedModule, MetaModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
