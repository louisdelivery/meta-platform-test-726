import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { CreateTemplateDto, MetaMessageDto } from "./meta.types";
import { CreateTemplateSchema, MetaMessageSchema } from "./meta.validation";
import { MetaService } from "./meta.service";

@ApiTags("meta")
@ApiBearerAuth()
@Controller("meta")
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  @Post("messages")
  @UsePipes(new JoiValidationPipe(MetaMessageSchema))
  @ApiOperation({
    summary: "Envoie un payload brut a Graph API /{phone-number-id}/messages",
  })
  sendMessage(@Body() dto: MetaMessageDto) {
    return this.meta.sendMessage(dto);
  }

  @Post("templates")
  @UsePipes(new JoiValidationPipe(CreateTemplateSchema))
  @ApiOperation({
    summary:
      "Cree un template WhatsApp via Graph API /{waba-id}/message_templates",
  })
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.meta.createTemplate(dto);
  }

  @Get("media/:id")
  @ApiOperation({
    summary: "Recupere les metadonnees Graph API d un media WhatsApp",
  })
  getMedia(@Param("id") id: string) {
    return this.meta.getMedia(id);
  }

  @Delete("media/:id")
  @ApiOperation({ summary: "Supprime un media WhatsApp via Graph API" })
  deleteMedia(@Param("id") id: string) {
    return this.meta.deleteMedia(id);
  }
}
