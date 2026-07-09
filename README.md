# WhatsApp Meta Lab

WhatsApp Meta Lab est une API NestJS concue comme un laboratoire d'apprentissage pour comprendre le fonctionnement de la WhatsApp Business Cloud API de Meta.

Ce projet n'est pas un chatbot. Il sert a observer, stocker, rejouer et simuler les evenements WhatsApp/Meta afin de comprendre ce qui se passe entre un client, WhatsApp, Meta, votre webhook, votre base de donnees et la Graph API.

## Objectif

L'API permet de :

- configurer les variables d'un compte Meta Developer ;
- connecter un numero WhatsApp Business Cloud API ;
- recevoir les webhooks Meta ;
- verifier la signature HMAC `x-hub-signature-256` ;
- stocker tous les payloads bruts recus ;
- reconnaitre le type d'evenement recu ;
- reconstruire les conversations ;
- envoyer des messages via la Graph API ;
- observer les confirmations `sent`, `delivered`, `read` et `failed` ;
- rejouer un webhook deja recu ;
- simuler Meta sans utiliser de telephone ;
- tester tout le flux depuis Swagger.

## Architecture

Le projet suit une approche inspiree du backend 1HandBiz :

```text
src/
  @1hand/
    base.type.ts
    base.validator.ts
    decorators/
    pipes/
    utils.ts

  app/
    app.module.ts

  common/
  config/
  database/
  prisma/
  prisma.service.ts
  shared/

  meta/
  webhook/
  messages/
  media/
  contacts/
  conversations/
  templates/
  events/
  simulator/
  health/
```

Chaque module metier suit la meme convention :

```text
<feature>.module.ts
<feature>.controller.ts
<feature>.service.ts
<feature>.types.ts
<feature>.validation.ts
<feature>.mapper.ts
```

Le role de chaque fichier est volontairement strict :

| Fichier           | Role                                                            |
| ----------------- | --------------------------------------------------------------- |
| `*.module.ts`     | Declare le module NestJS, ses providers, controllers et imports |
| `*.controller.ts` | Expose les routes HTTP et delegue au service                    |
| `*.service.ts`    | Contient la logique metier et les appels Prisma ou Graph API    |
| `*.types.ts`      | Definit les DTOs d'entree/sortie documentes avec Swagger        |
| `*.validation.ts` | Contient les schemas Joi utilises par `JoiValidationPipe`       |
| `*.mapper.ts`     | Transforme les entites internes en DTOs propres                 |

## Modules principaux

| Module          | Role                                                                             |
| --------------- | -------------------------------------------------------------------------------- |
| `meta`          | Encapsule toute la communication avec Meta Graph API                             |
| `webhook`       | Recoit les callbacks Meta, verifie la signature, stocke et classe les evenements |
| `events`        | Liste, affiche et rejoue les webhooks stockes                                    |
| `messages`      | Envoie des messages et liste les messages observes                               |
| `conversations` | Reconstruit les conversations depuis les webhooks                                |
| `contacts`      | Stocke les contacts WhatsApp observes                                            |
| `media`         | Liste et telecharge les medias WhatsApp                                          |
| `templates`     | Cree et suit les modeles WhatsApp                                                |
| `simulator`     | Genere de faux webhooks Meta pour travailler en local                            |
| `health`        | Verifie que l'API est disponible                                                 |

## Prerequis

Pour lancer le projet :

- Docker ;
- Docker Compose ;
- Node.js 20 ou plus si vous lancez sans Docker ;
- un compte Meta Developer si vous voulez appeler la vraie Graph API ;
- un numero WhatsApp Business Cloud API pour les tests reels.

## Lancement rapide avec Docker

Le projet fournit deja un `.env` de laboratoire. Il permet de demarrer l'API et d'utiliser le simulateur sans configuration Meta reelle.

```bash
docker compose up --build
```

Services lances :

| Service    | URL / port                   |
| ---------- | ---------------------------- |
| API NestJS | `http://localhost:3000`      |
| Swagger    | `http://localhost:3000/docs` |
| MySQL      | `localhost:3306`             |

Au demarrage du conteneur API, Prisma execute :

```bash
npx prisma db push
```

Cela cree les tables MySQL a partir de `prisma/schema.prisma`.

## Variables d'environnement

Les principales variables sont dans `.env` et `.env.example`.

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="mysql://meta:meta_password@mysql:3306/meta_lab"

META_GRAPH_API_VERSION=v23.0
META_ACCESS_TOKEN=replace_me
META_PHONE_NUMBER_ID=replace_me
META_WABA_ID=replace_me
META_APP_SECRET=
META_VERIFY_TOKEN=local_verify_token

DOWNLOAD_DIR=uploads
SIMULATOR_PHONE_NUMBER=33600000000
```

| Variable                 | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `DATABASE_URL`           | URL MySQL utilisee par Prisma                          |
| `META_GRAPH_API_VERSION` | Version de la Graph API, par exemple `v23.0`           |
| `META_ACCESS_TOKEN`      | Token Meta utilise pour appeler Graph API              |
| `META_PHONE_NUMBER_ID`   | ID du numero WhatsApp Business Cloud API               |
| `META_WABA_ID`           | ID du WhatsApp Business Account                        |
| `META_APP_SECRET`        | Secret d'app Meta pour verifier les signatures webhook |
| `META_VERIFY_TOKEN`      | Token utilise par Meta lors du challenge webhook       |
| `DOWNLOAD_DIR`           | Dossier local ou les medias sont telecharges           |
| `SIMULATOR_PHONE_NUMBER` | Numero utilise par defaut dans les webhooks simules    |

Si `META_APP_SECRET` est vide, l'API accepte les webhooks en mode laboratoire sans verifier la signature HMAC. Pour une integration reelle, renseignez toujours `META_APP_SECRET`.

## Swagger

Swagger est le tableau de bord principal du laboratoire :

```text
http://localhost:3000/docs
```

Depuis Swagger, vous pouvez :

- envoyer un message texte ;
- consulter les conversations ;
- voir les payloads webhooks bruts ;
- rejouer un webhook ;
- simuler un message entrant ;
- simuler un statut de message ;
- creer un template ;
- telecharger un media ;
- tester le challenge webhook.

## Flux complet observe

Exemple : un client ecrit a une boutique.

```text
Client WhatsApp
  -> WhatsApp
  -> Meta
  -> POST /webhook
  -> Verification signature HMAC
  -> Classification du payload
  -> Stockage WebhookEvent
  -> Reponse 200
  -> Traitement interne
  -> Contact / Conversation / Message / Status / Media
  -> Consultation dans Swagger
```

Quand vous envoyez un message depuis l'API :

```text
POST /messages/text
  -> MessagesService
  -> MetaService
  -> Graph API /{phone-number-id}/messages
  -> Meta accepte la requete
  -> Message OUTBOUND stocke
  -> Plus tard Meta appelle /webhook avec sent/delivered/read/failed
```

Point important : envoyer un message et recevoir sa confirmation sont deux evenements differents.

## Endpoints principaux

### Health

| Methode | Endpoint  | Description                      |
| ------- | --------- | -------------------------------- |
| `GET`   | `/health` | Verifie que l'API est disponible |

### Webhook

| Methode | Endpoint   | Description                    |
| ------- | ---------- | ------------------------------ |
| `GET`   | `/webhook` | Challenge de verification Meta |
| `POST`  | `/webhook` | Reception des webhooks Meta    |

Le `GET /webhook` est utilise par Meta lors de la configuration du webhook.

Parametres attendus :

```text
hub.mode=subscribe
hub.verify_token=local_verify_token
hub.challenge=123456
```

Si `hub.verify_token` correspond a `META_VERIFY_TOKEN`, l'API renvoie `hub.challenge`.

### Simulator

| Methode | Endpoint             | Description                                              |
| ------- | -------------------- | -------------------------------------------------------- |
| `POST`  | `/simulator/message` | Simule un message entrant Meta                           |
| `POST`  | `/simulator/status`  | Simule un statut `sent`, `delivered`, `read` ou `failed` |

Exemple de message texte simule :

```json
{
  "type": "text",
  "from": "33612345678",
  "body": "Bonjour, avez-vous des chaussures en 42 ?"
}
```

Exemple de statut simule :

```json
{
  "waMessageId": "wamid.local_123",
  "status": "delivered",
  "recipientId": "33612345678"
}
```

Types de messages simulables :

- `text`
- `image`
- `video`
- `reaction`
- `button`
- `location`
- `template`

### Events

| Methode | Endpoint             | Description                        |
| ------- | -------------------- | ---------------------------------- |
| `GET`   | `/events`            | Liste paginee des webhooks stockes |
| `GET`   | `/events/:id`        | Detail complet d'un webhook        |
| `POST`  | `/events/:id/replay` | Rejoue un webhook stocke           |

Le module `events` est le coeur pedagogique du projet. Il permet de voir exactement ce que Meta a envoye.

Filtres disponibles :

```text
search
type
processed
page
limit
```

### Messages

| Methode | Endpoint         | Description                             |
| ------- | ---------------- | --------------------------------------- |
| `POST`  | `/messages/text` | Envoie un message texte via Graph API   |
| `GET`   | `/messages`      | Liste les messages entrants et sortants |

Exemple :

```json
{
  "to": "33612345678",
  "message": "Bonjour, oui nous avons des chaussures en 42."
}
```

Reponse attendue :

- `localMessageId` : ID local en base ;
- `waMessageId` : ID Meta si Graph API l'a renvoye ;
- `note` : rappel que les confirmations arriveront plus tard par webhook ;
- `graphResponse` : reponse brute de Meta.

### Meta

| Methode  | Endpoint          | Description                                      |
| -------- | ----------------- | ------------------------------------------------ |
| `POST`   | `/meta/messages`  | Envoie un payload message bas niveau a Graph API |
| `POST`   | `/meta/templates` | Cree un template via Graph API                   |
| `GET`    | `/meta/media/:id` | Recupere les metadonnees d'un media              |
| `DELETE` | `/meta/media/:id` | Supprime un media via Graph API                  |

Le reste de l'application ne doit pas appeler Graph API directement. Toute communication Meta passe par `MetaService`.

### Conversations

| Methode | Endpoint             | Description                                 |
| ------- | -------------------- | ------------------------------------------- |
| `GET`   | `/conversations`     | Liste les conversations reconstruites       |
| `GET`   | `/conversations/:id` | Detail d'une conversation avec ses messages |

Une conversation est creee ou mise a jour lorsqu'un message webhook est traite.

### Contacts

| Methode | Endpoint    | Description                          |
| ------- | ----------- | ------------------------------------ |
| `GET`   | `/contacts` | Liste les contacts WhatsApp observes |

Les contacts sont crees a partir des payloads Meta, notamment `contacts[0].wa_id` et `contacts[0].profile.name`.

### Media

| Methode | Endpoint              | Description                                  |
| ------- | --------------------- | -------------------------------------------- |
| `GET`   | `/media`              | Liste les medias observes                    |
| `POST`  | `/media/:id/download` | Telecharge un media WhatsApp dans `uploads/` |

Quand un utilisateur envoie une image, Meta envoie d'abord un `mediaId` dans le webhook. L'API peut ensuite utiliser Graph API pour obtenir l'URL temporaire du fichier puis le telecharger.

### Templates

| Methode | Endpoint     | Description                |
| ------- | ------------ | -------------------------- |
| `POST`  | `/templates` | Cree un template WhatsApp  |
| `GET`   | `/templates` | Liste les templates locaux |

Exemple :

```json
{
  "name": "order_update",
  "language": "fr",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Bonjour {{1}}, votre commande est prete."
    }
  ]
}
```

Le template peut ensuite evoluer via des evenements Meta :

```text
PENDING -> APPROVED
PENDING -> REJECTED
```

## Exemple pratique complet

### 1. Demarrer l'API

```bash
docker compose up --build
```

Ouvrir :

```text
http://localhost:3000/docs
```

### 2. Simuler un client qui ecrit

Dans Swagger :

```text
POST /simulator/message
```

Body :

```json
{
  "type": "text",
  "from": "33612345678",
  "body": "Bonjour, avez-vous des chaussures en 42 ?"
}
```

### 3. Observer le webhook stocke

```text
GET /events
```

Vous verrez un evenement de type `MESSAGE_TEXT`.

### 4. Observer la conversation

```text
GET /conversations
```

Puis :

```text
GET /conversations/:id
```

Vous verrez le message associe a la conversation.

### 5. Envoyer une reponse

Pour un vrai envoi Graph API, configurez d'abord :

```env
META_ACCESS_TOKEN=...
META_PHONE_NUMBER_ID=...
```

Puis :

```text
POST /messages/text
```

Body :

```json
{
  "to": "33612345678",
  "message": "Bonjour, oui nous avons des chaussures en 42."
}
```

### 6. Simuler une confirmation Meta

Si vous n'utilisez pas Meta en reel :

```text
POST /simulator/status
```

Body :

```json
{
  "waMessageId": "wamid.local_123",
  "status": "read",
  "recipientId": "33612345678"
}
```

## Base de donnees

Le schema Prisma contient les concepts principaux de WhatsApp Business Cloud API :

| Table            | Concept                          |
| ---------------- | -------------------------------- |
| `MetaAccount`    | Compte Meta / Business           |
| `PhoneNumber`    | Numero WhatsApp Business         |
| `Contact`        | Contact WhatsApp observe         |
| `Conversation`   | Conversation reconstruite        |
| `Message`        | Message entrant ou sortant       |
| `MessageStatus`  | Statut de message                |
| `Media`          | Media WhatsApp                   |
| `WebhookEvent`   | Payload webhook brut             |
| `Template`       | Template WhatsApp                |
| `TemplateStatus` | Historique de statut de template |
| `ApiLog`         | Logs d'appels entrants/sortants  |

## Validation et conventions 1HandBiz

Les entrees HTTP sont validees avec Joi :

```ts
@UsePipes(new JoiValidationPipe(CreateTemplateSchema))
create(@Body() dto: CreateTemplateDto) {
  return this.service.create(dto);
}
```

Les controllers restent simples :

- ils recoivent les parametres ;
- ils appliquent les validations ;
- ils appellent le service.

Les services contiennent la logique :

- appels Prisma ;
- appels Graph API ;
- transactions ;
- verification d'existence ;
- orchestration entre modules.

Les mappers transforment les entites avant retour HTTP :

```ts
return {
  page,
  limit,
  total,
  data: entities.map(toMessageDto),
};
```

## Signature webhook Meta

Meta envoie la signature dans l'en-tete :

```text
x-hub-signature-256: sha256=...
```

Si `META_APP_SECRET` est configure, l'API :

1. recupere le `rawBody` de la requete ;
2. calcule un HMAC SHA-256 avec `META_APP_SECRET` ;
3. compare le resultat avec `x-hub-signature-256` ;
4. rejette le webhook si la signature est invalide.

En local, vous pouvez laisser `META_APP_SECRET` vide pour tester le simulateur plus facilement.

## Logs et observabilite

L'API journalise les grandes etapes :

```text
Webhook recu
Signature valide
Payload enregistre
Type detecte
Conversation mise a jour
Message enregistre
Reponse 200 envoyee a Meta
```

Les appels entrants et sortants sont aussi stockes dans `ApiLog`.

## Developpement sans Docker

Si vous preferez lancer localement :

```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Dans ce cas, adaptez `DATABASE_URL` pour pointer vers votre MySQL local.

## Commandes utiles

```bash
npm run start:dev
npm run build
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

## Depannage

### Swagger ne s'ouvre pas

Verifiez que l'API tourne :

```text
GET http://localhost:3000/health
```

Puis ouvrez :

```text
http://localhost:3000/docs
```

### MySQL ne demarre pas

Verifiez que le port `3306` n'est pas deja utilise par une autre instance MySQL.

### Les appels Graph API echouent

Verifiez :

- `META_ACCESS_TOKEN` ;
- `META_PHONE_NUMBER_ID` ;
- `META_GRAPH_API_VERSION` ;
- les permissions du token Meta ;
- le fait que le destinataire puisse recevoir le message.

### Les webhooks Meta sont refuses

Verifiez :

- `META_VERIFY_TOKEN` pour le challenge ;
- `META_APP_SECRET` pour la signature ;
- l'URL publique configuree dans Meta ;
- la reponse `200` de `POST /webhook`.

### Les imports `src/...` cassent

Cette version utilise des imports relatifs dans les modules applicatifs afin d'eviter les erreurs lorsque le projet est extrait dans un dossier imbrique.

## Scenario recommande pour apprendre

1. Lancez Docker.
2. Ouvrez Swagger.
3. Appelez `POST /simulator/message`.
4. Consultez `GET /events`.
5. Consultez `GET /conversations`.
6. Rejouez l'evenement avec `POST /events/:id/replay`.
7. Configurez Meta.
8. Testez `POST /messages/text`.
9. Observez les statuts qui reviennent par webhook.

En suivant ce parcours, vous comprenez progressivement la difference entre :

- un message envoye ;
- un message accepte par Graph API ;
- un statut Meta ;
- un webhook entrant ;
- une conversation reconstruite localement.
