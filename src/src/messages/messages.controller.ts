import { Body, Controller, Get, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { FilterMessageDto, SendTextMessageDto } from "./messages.types";
import {
  FilterMessageSchema,
  SendTextMessageSchema,
} from "./messages.validation";
import { MessagesService } from "./messages.service";

@ApiTags("messages")
@Controller("messages")
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Post("text")
  @UsePipes(new JoiValidationPipe(SendTextMessageSchema))
  @ApiOperation({
    summary:
      "Envoie un message texte via Graph API puis cree une trace OUTBOUND locale",
  })
  create(@Body() dto: SendTextMessageDto) {
    return this.messages.sendText(dto);
  }

  @Get()
  @UsePipes(new JoiValidationPipe(FilterMessageSchema))
  @ApiOperation({ summary: "Liste tous les messages observes ou envoyes" })
  getAll(@Query() filter: FilterMessageDto) {
    return this.messages.selectMany(filter);
  }
}
