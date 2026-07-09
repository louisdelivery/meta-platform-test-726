import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { FilterContactDto } from "./contacts.types";
import { FilterContactSchema } from "./contacts.validation";
import { ContactsService } from "./contacts.service";

@ApiTags("contacts")
@Controller("contacts")
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  @UsePipes(new JoiValidationPipe(FilterContactSchema))
  @ApiOperation({
    summary: "Liste les contacts WhatsApp observes dans les webhooks",
  })
  getAll(@Query() filter: FilterContactDto) {
    return this.service.selectMany(filter);
  }
}
