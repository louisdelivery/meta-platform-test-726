export function toSimulatorResultDto(event: any) {
  return {
    ok: true,
    eventId: event.id,
    type: event.type,
  };
}
