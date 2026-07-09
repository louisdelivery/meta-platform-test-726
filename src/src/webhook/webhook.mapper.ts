export function toWebhookIngestResultDto(event: any) {
  return {
    ok: true,
    eventId: event.id,
    type: event.type,
    message: 'Webhook recu, payload enregistre, traitement interne lance.',
  };
}
