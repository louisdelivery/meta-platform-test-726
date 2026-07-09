import { Body, Controller, Get, Headers, HttpCode, Post, Query, Req, Res, UsePipes } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JoiValidationPipe } from 'src/@1hand/pipes/JoiValidatorPipe';
import { WebhookService } from './webhook.service';
import { WebhookChallengeDto, WebhookIngestDto } from './webhook.types';
import { WebhookChallengeSchema, WebhookIngestSchema } from './webhook.validation';
import { toWebhookIngestResultDto } from './webhook.mapper';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly config: ConfigService,
    private readonly webhook: WebhookService,
  ) {}

  @Get()
  @UsePipes(new JoiValidationPipe(WebhookChallengeSchema))
  @ApiOperation({ summary: 'Challenge Meta: valide hub.verify_token puis renvoie hub.challenge' })
  verify(@Query() query: WebhookChallengeDto, @Res() res: Response) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    if (mode === 'subscribe' && token === this.config.get<string>('meta.verifyToken')) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(WebhookIngestSchema))
  @ApiHeader({ name: 'x-hub-signature-256', required: false })
  @ApiBody({ schema: { example: { object: 'whatsapp_business_account', entry: [] } } })
  @ApiOperation({ summary: 'Recoit tous les webhooks Meta, les stocke, puis repond 200 rapidement' })
  async create(@Req() req: Request, @Headers() headers: Record<string, string>, @Body() payload: WebhookIngestDto) {
    const event = await this.webhook.ingest({
      payload,
      headers,
      rawBody: req.rawBody,
      signature: headers['x-hub-signature-256'],
      verifySignature: true,
    });
    return toWebhookIngestResultDto(event);
  }
}
