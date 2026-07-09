import { Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { WebhookService } from "../webhook/webhook.service";
import { EventsService } from "./events.service";
import { FilterEventDto } from "./events.types";
import { FilterEventSchema } from "./events.validation";

@ApiTags("events")
@Controller("events")
export class EventsController {
  constructor(
    private readonly events: EventsService,
    private readonly webhook: WebhookService,
  ) {}

  @Get()
  @UsePipes(new JoiValidationPipe(FilterEventSchema))
  @ApiOperation({ summary: "Liste tous les webhooks bruts recus ou simules" })
  getAll(@Query() filter: FilterEventDto) {
    return this.events.selectMany(filter);
  }

  @Get(":id")
  @ApiOperation({ summary: "Affiche le payload exact envoye par Meta" })
  getById(@Param("id") id: string) {
    return this.events.selectById(id);
  }

  @Post(":id/replay")
  @ApiOperation({
    summary: "Rejoue le payload stocke comme si Meta venait de le renvoyer",
  })
  replay(@Param("id") id: string) {
    return this.webhook.replay(id);
  }
}
