import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JoiValidationPipe } from "../@1hand/pipes/JoiValidatorPipe";
import { SimulateMessageDto, SimulateStatusDto } from "./simulator.types";
import {
  SimulateMessageSchema,
  SimulateStatusSchema,
} from "./simulator.validation";
import { SimulatorService } from "./simulator.service";

@ApiTags("simulator")
@Controller("simulator")
export class SimulatorController {
  constructor(private readonly simulator: SimulatorService) {}

  @Post("message")
  @UsePipes(new JoiValidationPipe(SimulateMessageSchema))
  @ApiOperation({
    summary: "Genere un webhook message comme si Meta l avait envoye",
  })
  create(@Body() dto: SimulateMessageDto) {
    return this.simulator.message(dto);
  }

  @Post("status")
  @UsePipes(new JoiValidationPipe(SimulateStatusSchema))
  @ApiOperation({
    summary: "Genere un webhook status sent/delivered/read/failed",
  })
  status(@Body() dto: SimulateStatusDto) {
    return this.simulator.status(dto);
  }
}
