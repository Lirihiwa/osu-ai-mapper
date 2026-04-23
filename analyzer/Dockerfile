FROM python:3.9-slim

# 1. Устанавливаем системные зависимости для сборки C-кода
RUN apt-get update && apt-get install -y \
    ffmpeg \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Сначала устанавливаем ТОЛЬКО numpy и Cython.
# Это критически важно, так как madmom ищет их в момент своей установки.
RUN pip install --no-cache-dir "numpy<1.24" Cython

# 3. Теперь копируем requirements.txt и ставим всё остальное
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Копируем проект
COPY . .

# Создаем нужные папки
RUN mkdir -p temp output static

# Запускаем
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]