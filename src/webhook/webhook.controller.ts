import { Body, Controller, Get, Headers, HttpCode, Post, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { WebhookQueryDto } from './dto/webhook-query.dto';
import { WebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly config: ConfigService,
    private readonly webhook: WebhookService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Challenge Meta: valide hub.verify_token puis renvoie hub.challenge' })
  verify(@Query() query: WebhookQueryDto, @Res() res: Response) {
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
  @ApiHeader({ name: 'x-hub-signature-256', required: false })
  @ApiBody({ schema: { example: { object: 'whatsapp_business_account', entry: [] } } })
  @ApiOperation({ summary: 'Recoit tous les webhooks Meta, les stocke, puis repond 200 rapidement' })
  async receive(@Req() req: Request, @Headers() headers: Record<string, string>, @Body() payload: any) {
    const event = await this.webhook.ingest({
      payload,
      headers,
      rawBody: req.rawBody,
      signature: headers['x-hub-signature-256'],
      verifySignature: true,
    });
    return {
      ok: true,
      eventId: event.id,
      type: event.type,
      message: 'Webhook recu, signature valide si configuree, payload enregistre.',
    };
  }
}
