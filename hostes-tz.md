# 1.2. Модуль «Гостиницы»

Модуль «Гостиницы» предназначен для хранения и поиска гостиниц и комнат. Он используется функциональными модулями для показа списка мест для бронирования, а также для их добавления, включения и выключения. Данные хранятся в MongoDB.

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

В методе `search` флаг `isEnabled` может принимать только boolean значения или может быть не передан. Если значение `true`, флаг должен использоваться в фильтрации, если `undefined` — игнорироваться.

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
