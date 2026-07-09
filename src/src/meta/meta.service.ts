import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiLogDirection } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { PrismaService } from 'src/prisma.service';
import { CreateTemplateDto, MetaMessageDto } from './meta.types';
import { toMetaGraphResponseDto } from './meta.mapper';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendMessage(dto: MetaMessageDto) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: dto.to,
      type: dto.type,
      [dto.type]: dto.content ?? {},
    };
    return toMetaGraphResponseDto(await this.graphRequest('POST', `/${this.requiredPhoneNumberId()}/messages`, payload));
  }

  async sendText(to: string, body: string) {
    return this.sendMessage({
      to,
      type: 'text',
      content: { preview_url: false, body },
    });
  }

  async createTemplate(dto: CreateTemplateDto) {
    const payload = {
      name: dto.name,
      language: dto.language,
      category: dto.category,
      components: dto.components ?? [],
    };
    return toMetaGraphResponseDto(await this.graphRequest('POST', `/${this.requiredWabaId()}/message_templates`, payload));
  }

  async getTemplates() {
    return toMetaGraphResponseDto(await this.graphRequest('GET', `/${this.requiredWabaId()}/message_templates`));
  }

  async getMedia(id: string) {
    return toMetaGraphResponseDto(await this.graphRequest('GET', `/${id}`));
  }

  async deleteMedia(id: string) {
    return toMetaGraphResponseDto(await this.graphRequest('DELETE', `/${id}`));
  }

  async downloadMedia(url: string): Promise<{ data: Buffer; contentType?: string }> {
    const started = Date.now();
    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: this.authorizationHeaders(),
      });
      await this.logApi('GET', url, undefined, response.status, { contentType: response.headers['content-type'] }, Date.now() - started);
      return {
        data: Buffer.from(response.data),
        contentType: response.headers['content-type'],
      };
    } catch (error: any) {
      await this.logApi('GET', url, undefined, error.response?.status, error.response?.data, Date.now() - started, error.message);
      throw error;
    }
  }

  private async graphRequest(method: AxiosRequestConfig['method'], path: string, data?: any) {
    const url = `${this.baseUrl()}${path}`;
    const started = Date.now();
    this.logger.log(`Graph API ${method} ${path}`);
    try {
      const response = await axios.request({
        method,
        url,
        data,
        headers: {
          ...this.authorizationHeaders(),
          'Content-Type': 'application/json',
        },
      });
      await this.logApi(method ?? 'GET', url, data, response.status, response.data, Date.now() - started);
      return response.data;
    } catch (error: any) {
      const responseBody = error.response?.data ?? { message: error.message };
      await this.logApi(method ?? 'GET', url, data, error.response?.status, responseBody, Date.now() - started, error.message);
      throw new BadRequestException(responseBody);
    }
  }

  private baseUrl() {
    return `https://graph.facebook.com/${this.config.get<string>('meta.graphApiVersion')}`;
  }

  private authorizationHeaders() {
    const token = this.config.get<string>('meta.accessToken');
    if (!token) {
      throw new BadRequestException('META_ACCESS_TOKEN manquant');
    }
    return { Authorization: `Bearer ${token}` };
  }

  private requiredPhoneNumberId() {
    const id = this.config.get<string>('meta.phoneNumberId');
    if (!id) {
      throw new BadRequestException('META_PHONE_NUMBER_ID manquant');
    }
    return id;
  }

  private requiredWabaId() {
    const id = this.config.get<string>('meta.wabaId');
    if (!id) {
      throw new BadRequestException('META_WABA_ID manquant');
    }
    return id;
  }

  private async logApi(
    method: string,
    url: string,
    requestBody: any,
    statusCode?: number,
    responseBody?: any,
    durationMs?: number,
    error?: string,
  ) {
    await this.prisma.apiLog.create({
      data: {
        direction: ApiLogDirection.OUTBOUND,
        method: method.toUpperCase(),
        url,
        statusCode,
        requestBody,
        responseBody,
        durationMs,
        error,
      },
    });
  }
}
