
---

# API Endpoints Documentation

Базовый URL: `http://localhost:8000`

---

### 1. Upload Audio
Загружает аудиофайл на сервер и возвращает его уникальный идентификатор. Все последующие запросы используют этот `file_id`.

**Endpoint:**
```http
POST /api/upload
```

**Request (Multipart Form-Data):**
- `file`: Аудиофайл (mp3, wav, ogg)

**Response:**
```json
{
  "file_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "filename": "song.mp3"
}
```

---

### 1.5. Get Audio File
Отдает загруженный аудиофайл по его ID. Идеально подходит для использования в качестве источника (`src`) для HTML5 тега `<audio>`. Поддерживает стриминг и перемотку.

**Endpoint:**
```http
GET /api/audio/{file_id}
```

---

### 2. Analyze BPM
Анализирует аудиофайл и возвращает детальную статистику по темпу.

**Endpoint:**
```http
GET /api/analyze/bpm
```

**Query Parameters:**
- `file_id` (string, required): Уникальный ID файла.

**Response:**
```json
{
  "estimated_bpm": {
    "mean": 175.05,
    "median": 175.0
  },
  "std_error": 0.0452
}
```

---

### 3. Analyze Rhythm (Onsets)
Прогоняет аудио через нейросеть для поиска всех потенциальных ударов (нот). Возвращает "сырые" тайминги в секундах.

**Endpoint:**
```http
GET /api/analyze/onsets
```
*(Примечание: Запрос `GET`, так как мы не меняем состояние, а просто получаем данные из существующего файла)*

**Query Parameters:**
- `file_id` (string, required): Уникальный ID файла.
- `threshold` (float, optional, default=0.3): Чувствительность нейросети (0.1 - много нот, 0.8 - только самые четкие).

**Response:**
```json
{
  "onsets": [0.51, 0.85, 1.20, 1.54, 1.88]
}
```

---

### 4. Get Recommended Offset
Быстрый вспомогательный метод для определения стартовой точки (офсета) на основе первого найденного удара. Возвращает время в миллисекундах.

**Endpoint:**
```http
POST /api/analyze/offset
```

**Request JSON:**
```json
[0.51, 0.85, 1.20, 1.54]
```

**Response:**
```json
{
  "offset": 510
}
```

---

### 5. Generate Hit Objects
Математический генератор. Привязывает сырые тайминги к сетке BPM и создает массив объектов (кружков) для osu!. Выполняется мгновенно.

**Endpoint:**
```http
POST /api/generate/objects
```

**Request JSON:**
```json
{
  "onsets": [0.51, 0.85, 1.20, 1.54],
  "bpm": 175.0,
  "offset": 510,
  "grid_size": 4, 
  "start_time": 0, 
  "end_time": null 
}
```
*(`grid_size`: 2 = 1/2, 4 = 1/4, 3 = 1/3 и т.д. `start_time` и `end_time` указаны в миллисекундах для частичной регенерации).*

**Response:**
```json
{
  "hit_objects": [
    {
      "x": 256,
      "y": 192,
      "time": 510,
      "new_combo": false
    },
    {
      "x": 256,
      "y": 192,
      "time": 852,
      "new_combo": true
    }
  ]
}
```

---

### 6. Package to OSZ
Создает `.osu` файл, пакует его вместе с оригинальным аудио в `.osz` архив и возвращает ссылку на скачивание.

**Endpoint:**
```http
POST /api/package
```

**Request JSON:**
```json
{
  "file_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "original_filename": "song.mp3",
  "bpm": 175.0,
  "offset": 510,
  "title": "Numb",
  "artist": "Linkin Park",
  "creator": "AI",
  "ar": 9.0,
  "hp": 5.0,
  "od": 7.0,
  "cs": 4.0,
  "hit_objects": [
    { "x": 256, "y": 192, "time": 510, "new_combo": false }
  ]
}
```

**Response:**
```json
{
  "download_url": "/api/download/Linkin Park - Numb (1a2b3c).osz"
}
```

---

### 7. Download Package
Отдает готовый `.osz` файл.

**Endpoint:**
```http
GET /api/download/{filename}
```

**Response:**
File Download (`application/octet-stream`).