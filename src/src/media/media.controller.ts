import { Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { MediaService } from "./media.service";
import { FilterMediaDto } from "./media.types";
import { FilterMediaSchema } from "./media.validation";

@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  @UsePipes(new JoiValidationPipe(FilterMediaSchema))
  @ApiOperation({ summary: "Liste les medias observes dans les webhooks" })
  getAll(@Query() filter: FilterMediaDto) {
    return this.media.selectMany(filter);
  }

  @Post(":id/download")
  @ApiOperation({
    summary:
      "Recupere un media WhatsApp via Graph API, telecharge le fichier et l enregistre dans uploads/",
  })
  create(@Param("id") id: string) {
    return this.media.download(id);
  }
}
