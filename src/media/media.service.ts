import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { PrismaService } from '../database/prisma/prisma.service';
import { MetaService } from '../meta/meta.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly config: ConfigService,
    private readonly meta: MetaService,
    private readonly prisma: PrismaService,
  ) {}

  async download(mediaId: string) {
    const metadata = await this.meta.getMedia(mediaId);
    const file = await this.meta.downloadMedia(metadata.url);
    const dir = this.config.get<string>('lab.downloadDir', 'uploads');
    await mkdir(dir, { recursive: true });
    const extension = this.extensionFromMime(file.contentType) || extname(metadata.filename ?? '') || '.bin';
    const digest = createHash('sha1').update(file.data).digest('hex').slice(0, 12);
    const filePath = join(dir, `${mediaId}-${digest}${extension}`);
    await writeFile(filePath, file.data);

    const saved = await this.prisma.media.upsert({
      where: { mediaId },
      create: {
        mediaId,
        mimeType: file.contentType ?? metadata.mime_type,
        sha256: metadata.sha256,
        filePath,
        url: metadata.url,
        payload: metadata,
      },
      update: {
        mimeType: file.contentType ?? metadata.mime_type,
        sha256: metadata.sha256,
        filePath,
        url: metadata.url,
        payload: metadata,
      },
    });
    return { ok: true, media: saved };
  }

  private extensionFromMime(mime?: string) {
    if (!mime) return undefined;
    if (mime.includes('jpeg')) return '.jpg';
    if (mime.includes('png')) return '.png';
    if (mime.includes('webp')) return '.webp';
    if (mime.includes('mp4')) return '.mp4';
    if (mime.includes('mpeg')) return '.mp3';
    if (mime.includes('ogg')) return '.ogg';
    if (mime.includes('pdf')) return '.pdf';
    return undefined;
  }
}
