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
