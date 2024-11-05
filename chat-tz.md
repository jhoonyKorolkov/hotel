# 1.4. Модуль «Чат техподдержки»

Модуль «Чат техподдержки» предназначен для хранения обращений в техподдержку и сообщений в чате обращения. Он используется для общения пользователей с поддержкой. Данные чатов хранятся в MongoDB.

### Модель данных обращения (`SupportRequest`)

| Название    | Тип       | Обязательное | Уникальное |
| ----------- | --------- | ------------ | ---------- |
| `_id`       | ObjectId  | да           | да         |
| `user`      | ObjectId  | да           | нет        |
| `createdAt` | Date      | да           | нет        |
| `messages`  | Message[] | нет          | нет        |
| `isActive`  | bool      | нет          | нет        |

### Модель данных сообщения (`Message`)

| Название | Тип      | Обязательное | Уникальное |
| -------- | -------- | ------------ | ---------- |
| `_id`    | ObjectId | да           | да         |
| `author` | ObjectId | да           | нет        |
| `sentAt` | Date     | да           | нет        |
| `text`   | string   | да           | нет        |
| `readAt` | Date     | нет          | нет        |

Сообщение считается прочитанным, если поле `readAt` не пустое.

### Интерфейсы

#### `CreateSupportRequestDto`

interface CreateSupportRequestDto {  
 user: ID;  
 text: string;  
}

#### `SendMessageDto`

interface SendMessageDto {  
 author: ID;  
 supportRequest: ID;  
 text: string;  
}

#### `MarkMessagesAsReadDto`

interface MarkMessagesAsReadDto {  
 user: ID;  
 supportRequest: ID;  
 createdBefore: Date;  
}

#### `GetChatListParams`

interface GetChatListParams {  
 user: ID | null;  
 isActive: bool;  
}

#### `ISupportRequestService`

interface ISupportRequestService {  
 findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;  
 sendMessage(data: SendMessageDto): Promise<Message>;  
 getMessages(supportRequest: ID): Promise<Message[]>;  
 subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void;  
}

#### `ISupportRequestClientService`

interface ISupportRequestClientService {  
 createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;  
 markMessagesAsRead(params: MarkMessagesAsReadDto);  
 getUnreadCount(supportRequest: ID): Promise<number>;  
}

#### `ISupportRequestEmployeeService`

interface ISupportRequestEmployeeService {  
 markMessagesAsRead(params: MarkMessagesAsReadDto);  
 getUnreadCount(supportRequest: ID): Promise<number>;  
 closeRequest(supportRequest: ID): Promise<void>;  
}

Метод `ISupportRequestClientService.getUnreadCount` возвращает количество сообщений, отправленных сотрудником поддержки и не отмеченных прочитанными.  
Метод `ISupportRequestClientService.markMessagesAsRead` выставляет текущую дату в поле `readAt` для всех непрочитанных сообщений, отправленных сотрудником.  
Метод `ISupportRequestEmployeeService.getUnreadCount` возвращает количество сообщений, отправленных пользователем и не отмеченных прочитанными.  
Метод `ISupportRequestEmployeeService.markMessagesAsRead` выставляет текущую дату в поле `readAt` для всех непрочитанных сообщений, отправленных пользователем.  
Метод `ISupportRequestEmployeeService.closeRequest` меняет флаг `isActive` на `false`.

Оповещения реализуются через EventEmitter.

---

# 2.5. API модуля «Чат с техподдержкой»

## 2.5.1. Создание обращения в поддержку

**Описание**  
Позволяет пользователю с ролью `client` создать обращение в техподдержку.

**Адрес**  
POST /api/client/support-requests/

**Body-параметры**

{  
 "text": "string"  
}

**Формат ответа**

[
{
"id": "string",
"createdAt": "string",
"isActive": boolean,
"hasNewMessages": boolean
}
]

**Доступ**  
Доступно только пользователям с ролью `client`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `client`.

---

## 2.5.2. Получение списка обращений для клиента

**Описание**  
Позволяет пользователю с ролью `client` получить список обращений текущего пользователя.

**Адрес**  
GET /api/client/support-requests/

**Query-параметры**

- `limit` — количество записей в ответе;
- `offset` — сдвиг от начала списка;
- `isActive` — фильтр по полю.

**Формат ответа**

[
{
"id": "string",
"createdAt": "string",
"isActive": boolean,
"hasNewMessages": boolean
}
]

**Доступ**  
Доступно только пользователям с ролью `client`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `client`.

---

## 2.5.3. Получение списка обращений для менеджера

**Описание**  
Позволяет пользователю с ролью `manager` получить список обращений от клиентов.

**Адрес**  
GET /api/manager/support-requests/

**Query-параметры**

- `limit` — количество записей в ответе;
- `offset` — сдвиг от начала списка;
- `isActive` — фильтр по полю.

**Формат ответа**

[
{
"id": "string",
"createdAt": "string",
"isActive": boolean,
"hasNewMessages": boolean,
"client": {
"id": "string",
"name": "string",
"email": "string",
"contactPhone": "string"
}
}
]

**Доступ**  
Доступно только пользователям с ролью `manager`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `manager`.

---

## 2.5.4. Получение истории сообщений из обращения

**Описание**  
Позволяет пользователю с ролью `manager` или `client` получить все сообщения из чата.

**Адрес**  
GET /api/common/support-requests/:id/messages

**Формат ответа**

[
{
"id": "string",
"createdAt": "string",
"text": "string",
"readAt": "string",
"author": {
"id": "string",
"name": "string"
}
}
]

**Доступ**  
Доступно пользователям с ролью `manager` и пользователю с ролью `client`, который создал обращение.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не подходит.

---

## 2.5.5. Отправка сообщения

**Описание**  
Позволяет пользователю с ролью `manager` или `client` отправлять сообщения в чат.

**Адрес**  
POST /api/common/support-requests/:id/messages

**Body-параметры**

{  
 "text": "string"  
}

**Формат ответа**

[
{
"id": "string",
"createdAt": "string",
"text": "string",
"readAt": "string",
"author": {
"id": "string",
"name": "string"
}
}
]

**Доступ**  
Доступно пользователям с ролью `manager` и пользователю с ролью `client`, который создал обращение.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не подходит.

---

## 2.5.6. Отправка события, что сообщения прочитаны

**Описание**  
Позволяет пользователю с ролью `manager` или `client` пометить сообщения как прочитанные.

**Адрес**  
POST /api/common/support-requests/:id/messages/read

**Body-параметры**

{  
 "createdBefore": "string"  
}

**Формат ответа**

{  
 "success": true  
}

**Доступ**  
Доступно пользователям с ролью `manager` и пользователю с ролью `client`, который создал обращение.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не подходит.

---

## 2.5.7. Подписка на сообщения из чата техподдержки

**Описание**  
Позволяет пользователю с ролью `manager` или `client`

Команда
message: subscribeToChat payload: chatId

Формат ответа
{
"id": string,
"createdAt": string,
"text": string,
"readAt": string,
"author": {
"id": string,
"name": string
}
}
Доступ
Доступно только пользователям с ролью manager и пользователю с ролью client, который создал обращение.
