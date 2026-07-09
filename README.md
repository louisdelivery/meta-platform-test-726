# WhatsApp Meta Lab

Laboratoire NestJS pour apprendre la WhatsApp Business Cloud API sans transformer le projet en chatbot. Le but est d'observer le cycle complet : Meta Developer, numero WhatsApp Business, webhook, signature HMAC, stockage Prisma, replay, simulation et appels Graph API.

> Note: `https://docs.1handbiz.com` a renvoye `403 Forbidden` depuis cet environnement. Le projet suit donc strictement le cahier des charges fourni dans ta demande et s'appuie sur les conventions officielles Meta pour les endpoints Graph API.

## Lancer avec Docker

```bash
docker compose up --build
```

Swagger sera disponible ici :

```text
http://localhost:3000/docs
```

MySQL est lance par Docker Compose et Prisma pousse le schema au demarrage avec `prisma db push`. Un `.env` de laboratoire est deja fourni pour demarrer le simulateur; remplace les valeurs Meta quand tu veux appeler la vraie Graph API.

## Variables importantes

```bash
META_GRAPH_API_VERSION=v23.0
META_ACCESS_TOKEN=replace_me
META_PHONE_NUMBER_ID=replace_me
META_WABA_ID=replace_me
META_APP_SECRET=replace_me
META_VERIFY_TOKEN=local_verify_token
```

`META_APP_SECRET` active la validation `x-hub-signature-256`. Si la variable est vide, le laboratoire accepte les webhooks en mode local et l'indique dans les logs.

## Flux observe

1. Le client ecrit a votre numero WhatsApp.
2. Meta appelle `POST /webhook`.
3. L'application verifie la signature HMAC si `META_APP_SECRET` est configure.
4. Le payload brut est stocke dans `WebhookEvent`.
5. Le type est detecte : message texte, media, reaction, bouton, location, statut, template.
6. Les tables `Contact`, `Conversation`, `Message`, `MessageStatus` et `Media` sont mises a jour.
7. L'API repond `200`.
8. Vous pouvez consulter `GET /events`, `GET /conversations`, `GET /messages`.
9. Vous pouvez rejouer un payload avec `POST /events/:id/replay`.

## Endpoints principaux

| Module | Endpoint | Role |
| --- | --- | --- |
| Webhook | `GET /webhook` | Challenge Meta `hub.challenge` |
| Webhook | `POST /webhook` | Reception de tous les evenements |
| Events | `GET /events` | Liste des payloads Meta bruts |
| Events | `POST /events/:id/replay` | Replay pedagogique d'un webhook |
| Messages | `POST /messages/text` | Envoi texte via Graph API |
| Meta | `POST /meta/messages` | Envoi Graph API bas niveau |
| Meta | `POST /meta/templates` | Creation Graph API de template |
| Meta | `GET /meta/media/:id` | Metadonnees d'un media |
| Media | `POST /media/:id/download` | Telechargement local dans `uploads/` |
| Simulator | `POST /simulator/message` | Genere un webhook message local |
| Simulator | `POST /simulator/status` | Genere un statut sent/delivered/read/failed |

## Exemple boutique

Dans Swagger, appelez :

```json
POST /simulator/message
{
  "type": "text",
  "from": "33612345678",
  "body": "Bonjour, avez-vous des chaussures en 42 ?"
}
```

Puis consultez :

```text
GET /events
GET /conversations
GET /messages
```

Pour envoyer une reponse reelle via Meta :

```json
POST /messages/text
{
  "to": "33612345678",
  "message": "Bonjour, oui nous avons des chaussures en 42."
}
```

L'appel Graph API peut reussir avant que les statuts `sent`, `delivered` et `read` arrivent. Ces confirmations sont des webhooks differents et seront visibles dans `MessageStatus`.
