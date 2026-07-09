import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SimulateMessageDto } from './dto/simulate-message.dto';
import { SimulateStatusDto } from './dto/simulate-status.dto';
import { SimulatorService } from './simulator.service';

@ApiTags('simulator')
@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulator: SimulatorService) {}

  @Post('message')
  @ApiOperation({ summary: 'Genere un webhook message comme si Meta l avait envoye' })
  message(@Body() dto: SimulateMessageDto) {
    return this.simulator.message(dto);
  }

  @Post('status')
  @ApiOperation({ summary: 'Genere un webhook status sent/delivered/read/failed' })
  status(@Body() dto: SimulateStatusDto) {
    return this.simulator.status(dto);
  }
}
