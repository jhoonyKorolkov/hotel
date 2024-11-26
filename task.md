# 1.1. Модуль «Пользователи»

Модуль «Пользователи» предназначен для создания, хранения и поиска профилей пользователей. Он используется функциональными модулями для регистрации и аутентификации, а данные пользователя хранятся в MongoDB.

### Модель данных пользователя (`User`)

| Название       | Тип      | Обязательное | Уникальное | По умолчанию |
| -------------- | -------- | ------------ | ---------- | ------------ |
| `_id`          | ObjectId | да           | да         |              |
| `email`        | string   | да           | да         |              |
| `passwordHash` | string   | да           | нет        |              |
| `name`         | string   | да           | нет        |              |
| `contactPhone` | string   | нет          | нет        |              |
| `role`         | string   | да           | нет        | `client`     |

Модуль «Пользователи» реализован как NestJS-модуль и экспортирует сервисы с интерфейсами.

### Интерфейсы

#### `SearchUserParams`

interface SearchUserParams {  
 limit: number;  
 offset: number;  
 email: string;  
 name: string;  
 contactPhone: string;  
}

#### `IUserService`

interface IUserService {  
 create(data: Partial<User>): Promise<User>;  
 findById(id: ID): Promise<User>;  
 findByEmail(email: string): Promise<User>;  
 findAll(params: SearchUserParams): Promise<User[]>;  
}

Поле `role` может принимать одно из значений: `client`, `admin`, `manager`.

При поиске методом `IUserService.findAll()` поля `email`, `name` и `contactPhone` проверяются на частичное совпадение.

---

# 2.3. API Модуля «Аутентификация и авторизация»

Модуль «Аутентификация и авторизация» реализован как отдельный NestJS-модуль. Он предназначен для управления сессиями пользователей и регистрации пользователей. Сессии хранятся в памяти приложения с использованием библиотеки `passport.js`.

Аутентификация производится через модуль «Пользователи». Каждому пользователю назначается одна из ролей: `client`, `admin`, `manager`.

## 2.3.1. Вход

**Описание**  
Стартует сессию пользователя и выставляет Cookies.

**Адрес**  
POST /api/auth/login

**Body-параметры**

{  
 "email": "string",  
 "password": "string"  
}

**Формат ответа**

{  
 "email": "string",  
 "name": "string",  
 "contactPhone": "string"  
}

**Доступ**  
Доступно только не аутентифицированным пользователям.

**Ошибки**

- 401 — если пользователя с указанным email не существует или пароль неверный.

## 2.3.2. Выход

**Описание**  
Завершает сессию пользователя и удаляет Cookies.

**Адрес**  
POST /api/auth/logout

**Формат ответа**  
Пустой ответ.

**Доступ**  
Доступно только аутентифицированным пользователям.

## 2.3.3. Регистрация

**Описание**  
Позволяет создать пользователя с ролью `client` в системе.

**Адрес**  
POST /api/client/register

**Body-параметры**

{  
 "email": "string",  
 "password": "string",  
 "name": "string",  
 "contactPhone": "string"  
}

**Формат ответа**

{  
 "id": "string",  
 "email": "string",  
 "name": "string"  
}

**Доступ**  
Доступно только не аутентифицированным пользователям.

**Ошибки**

- 400 — если email уже занят.

---

# 2.4. API Модуля «Управление пользователями»

## 2.4.1. Создание пользователя

**Описание**  
Позволяет пользователю с ролью `admin` создать пользователя в системе.

**Адрес**  
POST /api/admin/users/

**Body-параметры**

{  
 "email": "string",  
 "password": "string",  
 "name": "string",  
 "contactPhone": "string",  
 "role": "string"  
}

**Формат ответа**

{  
 "id": "string",  
 "email": "string",  
 "name": "string",  
 "contactPhone": "string",  
 "role": "string"  
}

**Доступ**  
Доступно только пользователям с ролью `admin`.

**Ошибки**

- 401 — если пользователь не аутентифицирован;
- 403 — если роль пользователя не `admin`.

## 2.4.2. Получение списка пользователей

**Описание**  
Позволяет пользователю с ролью `admin` или `manager` получить список пользователей.

**Адрес**

- GET /api/admin/users/
- GET /api/manager/users/

**Query-параметры**

- limit — количество записей в ответе;
- offset — сдвиг от начала списка;
- name — фильтр по полю;
- email — фильтр по полю;
- contactPhone — фильтр по полю.

**Формат ответа**

[
{
"id": "string",
"email": "string",
"name": "string",
"contactPhone": "string"
}
]

**Доступ**

- GET /api/admin/users/ — доступно только пользователям с ролью `admin`.
- GET /api/manager/users/ — доступно только пользователям с ролью `manager`.

**Ошибки**

- 401 — если пользователь не аутентифицирован;
- 403 — если роль пользователя не подходит.

# 1.2. Модуль «Гостиницы»

Модуль «Гостиницы» предназначен для хранения и поиска гостиниц и комнат.
Он используется функциональными модулями для показа списка мест для бронирования,
а также для их добавления, включения и выключения. Данные хранятся в MongoDB.

### Модель данных гостиницы (`Hotel`)

| Название      | Тип      | Обязательное | Уникальное | По умолчанию |
| ------------- | -------- | ------------ | ---------- | ------------ |
| `_id`         | ObjectId | да           | да         |              |
| `title`       | string   | да           | да         |              |
| `description` | string   | нет          | нет        |              |
| `createdAt`   | Date     | да           | нет        |              |
| `updatedAt`   | Date     | да           | нет        |              |

### Модель данных комнаты (`HotelRoom`)

| Название      | Тип      | Обязательное | Уникальное | По умолчанию |
| ------------- | -------- | ------------ | ---------- | ------------ |
| `_id`         | ObjectId | да           | да         |              |
| `hotel`       | ObjectId | да           | нет        |              |
| `description` | string   | нет          | нет        |              |
| `images`      | string[] | нет          | нет        | `[]`         |
| `createdAt`   | Date     | да           | нет        |              |
| `updatedAt`   | Date     | да           | нет        |              |
| `isEnabled`   | boolean  | да           | нет        | `true`       |

Свойство `hotel` должно ссылаться на модель `Hotel`.

### Интерфейсы

#### `SearchHotelParams`

interface SearchHotelParams {  
 limit: number;  
 offset: number;  
 title: string;  
}

#### `UpdateHotelParams`

interface UpdateHotelParams {  
 title: string;  
 description: string;  
}

#### `IHotelService`

interface IHotelService {  
 create(data: any): Promise<Hotel>;  
 findById(id: ID): Promise<Hotel>;  
 search(params: SearchHotelParams): Promise<Hotel[]>;  
 update(id: ID, data: UpdateHotelParams): Promise<Hotel>;  
}

#### `SearchRoomsParams`

interface SearchRoomsParams {  
 limit: number;  
 offset: number;  
 hotel: ID;  
 isEnabled?: boolean;  
}

#### `HotelRoomService`

interface HotelRoomService {  
 create(data: Partial<HotelRoom>): Promise<HotelRoom>;  
 findById(id: ID): Promise<HotelRoom>;  
 search(params: SearchRoomsParams): Promise<HotelRoom[]>;  
 update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;  
}

В методе `search` флаг `isEnabled` может принимать только boolean значения или может быть не передан.
Если значение `true`, флаг должен использоваться в фильтрации, если `undefined` — игнорироваться.

---

# 2.1. API Модуля «Гостиницы»

Модуль оформлен как отдельный NestJS-модуль.

### Ограничения

Если пользователь не аутентифицирован или его роль `client`, то при поиске всегда должен использоваться флаг `isEnabled: true`.

## 2.1.1. Поиск номеров

**Описание**  
Основной API для поиска номеров.

**Адрес**  
GET /api/common/hotel-rooms

**Query-параметры**

- `limit` — количество записей в ответе;
- `offset` — сдвиг от начала списка;
- `hotel` — ID гостиницы для фильтра.

**Формат ответа**

[  
 {  
 "id": "string",  
 "description": "string",  
 "images": ["string"],  
 "hotel": {  
 "id": "string",  
 "title": "string"  
 }  
 }  
]

**Доступ**  
Доступно всем пользователям, включая неаутентифицированных.

## 2.1.2. Информация о конкретном номере

**Описание**  
Получение подробной информации о номере.

**Адрес**  
GET /api/common/hotel-rooms/:id

**Формат ответа**

{  
 "id": "string",  
 "description": "string",  
 "images": ["string"],  
 "hotel": {  
 "id": "string",  
 "title": "string",  
 "description": "string"  
 }  
}

**Доступ**  
Доступно всем пользователям, включая неаутентифицированных.

## 2.1.3. Добавление гостиницы

**Описание**  
Добавление гостиницы администратором.

**Адрес**  
POST /api/admin/hotels/

**Body-параметры**  
{  
 "title": "string",  
 "description": "string"  
}

**Формат ответа**

{  
 "id": "string",  
 "title": "string",  
 "description": "string"  
}

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `admin`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `admin`.

## 2.1.4. Получение списка гостиниц

**Описание**  
Получение списка гостиниц администратором.

**Адрес**  
GET /api/admin/hotels/

**Query-параметры**

- `limit` — количество записей в ответе;
- `offset` — сдвиг от начала списка;
- `title` — фильтр по полю.

**Формат ответа**

{  
 "id": "string",  
 "title": "string",  
 "description": "string"  
}

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `admin`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `admin`.

## 2.1.5. Изменение описания гостиницы

**Описание**  
Изменение описания гостиницы администратором.

**Адрес**  
PUT /api/admin/hotels/:id

**Body-параметры**  
{  
 "title": "string",  
 "description": "string"  
}

**Формат ответа**

{  
 "id": "string",  
 "title": "string",  
 "description": "string"  
}

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `admin`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `admin`.

## 2.1.6. Добавление номера

**Описание**  
Добавление номера гостиницы администратором.

**Адрес**  
POST /api/admin/hotel-rooms/

**Body-параметры**  
Этот запрос предполагает загрузку файлов и должен использовать формат `multipart/form-data`.

- `description`: string
- `hotelId`: string
- `images[]`: File

**Формат ответа**

{  
 "id": "string",  
 "description": "string",  
 "images": ["string"],  
 "isEnabled": boolean,  
 "hotel": {  
 "id": "string",  
 "title": "string",  
 "description": "string"  
 }  
}

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `admin`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `admin`.

## 2.1.7. Изменение описания номера

**Описание**  
Изменение описания номера гостиницы администратором.

**Адрес**  
PUT /api/admin/hotel-rooms/:id

**Body-параметры**  
Этот запрос предполагает загрузку файлов и должен использовать формат `multipart/form-data`.

- `description`: string
- `hotelId`: string
- `isEnabled`: boolean
- `images[]`: File | string

При обновлении может быть отправлен одновременно список ссылок на уже загруженные картинки и список файлов с новыми картинками.

**Формат ответа**

{  
 "id": "string",  
 "description": "string",  
 "images": ["string"],  
 "isEnabled": boolean,  
 "hotel": {  
 "id": "string",  
 "title": "string",  
 "description": "string"  
 }  
}

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `admin`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `admin`.

# 1.3. Модуль «Брони»

Модуль «Брони» предназначен для хранения и получения броней гостиниц конкретного пользователя.
Он не использует модуль «Пользователи» и модуль «Гостиницы» для получения данных,
а также не хранит данные пользователей и гостиниц. Данные хранятся в MongoDB.

### Модель данных бронирования (`Reservation`)

| Название    | Тип      | Обязательное | Уникальное | По умолчанию |
| ----------- | -------- | ------------ | ---------- | ------------ |
| `_id`       | ObjectId | да           | да         |              |
| `userId`    | ObjectId | да           | нет        |              |
| `hotelId`   | ObjectId | да           | нет        |              |
| `roomId`    | ObjectId | да           | нет        |              |
| `dateStart` | Date     | да           | нет        |              |
| `dateEnd`   | Date     | да           | нет        |              |

Модуль реализован в виде NestJS-модуля и экспортирует сервисы с интерфейсами.

### Интерфейсы

#### `ReservationDto`

interface ReservationDto {  
 userId: ID;  
 hotelId: ID;  
 roomId: ID;  
 dateStart: Date;  
 dateEnd: Date;  
}

#### `ReservationSearchOptions`

interface ReservationSearchOptions {  
 userId: ID;  
 dateStart: Date;  
 dateEnd: Date;  
}

#### `IReservation`

interface IReservation {  
 addReservation(data: ReservationDto): Promise<Reservation>;  
 removeReservation(id: ID): Promise<void>;  
 getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>>;  
}

Метод `IReservation.addReservation` должен проверять, доступен ли номер на заданную дату.

---

# 2.2. API Модуля «Бронирование»

Модуль оформлен как отдельный NestJS-модуль.

## 2.2.1. Бронирование номера клиентом

**Описание**  
Создаёт бронь на номер на выбранную дату для текущего пользователя.

**Адрес**  
POST /api/client/reservations

**Body-параметры**

{  
 "hotelRoom": "string",  
 "dateStart": "string",  
 "dateEnd": "string"  
}

**Формат ответа**

{  
 "dateStart": "string",  
 "dateEnd": "string",  
 "hotelRoom": {  
 "description": "string",  
 "images": ["string"]  
 },  
 "hotel": {  
 "title": "string",  
 "description": "string"  
 }  
}

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `client`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `client`;
- `400` — если номера с указанным ID не существует или он отключён.

## 2.2.2. Список броней текущего пользователя

**Описание**  
Получение списка броней текущего пользователя.

**Адрес**  
GET /api/client/reservations

**Формат ответа**

[  
 {  
 "dateStart": "string",  
 "dateEnd": "string",  
 "hotelRoom": {  
 "description": "string",  
 "images": ["string"]  
 },  
 "hotel": {  
 "title": "string",  
 "description": "string"  
 }  
 }  
]

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `client`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `client`.

## 2.2.3. Отмена бронирования клиентом

**Описание**  
Отменяет бронь пользователя.

**Адрес**  
DELETE /api/client/reservations/:id

**Формат ответа**  
Пустой ответ.

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `client`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `client`;
- `403` — если ID текущего пользователя не совпадает с ID пользователя в брони;
- `400` — если брони с указанным ID не существует.

## 2.2.4. Список броней конкретного пользователя

**Описание**  
Получение списка броней конкретного пользователя.

**Адрес**  
GET /api/manager/reservations/:userId

**Формат ответа**

[  
 {  
 "dateStart": "string",  
 "dateEnd": "string",  
 "hotelRoom": {  
 "description": "string",  
 "images": ["string"]  
 },  
 "hotel": {  
 "title": "string",  
 "description": "string"  
 }  
 }  
]

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `manager`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `manager`.

## 2.2.5. Отмена бронирования менеджером

**Описание**  
Отменяет бронь пользователя по id брони.

**Адрес**  
DELETE /api/manager/reservations/:id

**Формат ответа**  
Пустой ответ.

**Доступ**  
Доступно только аутентифицированным пользователям с ролью `manager`.

**Ошибки**

- `401` — если пользователь не аутентифицирован;
- `403` — если роль пользователя не `manager`;
- `400` — если брони с указанным ID не существует.

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
