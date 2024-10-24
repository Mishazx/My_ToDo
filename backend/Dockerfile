# Используем официальный образ Python
FROM python:3.10-slim

# Устанавливаем переменную окружения для работы с pyc-файлами
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы requirements.txt и устанавливаем зависимости
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все остальные файлы приложения
COPY . /app/

# Устанавливаем переменные окружения для подключения к PostgreSQL
ENV DATABASE_URL=postgresql://user:password@db:5432/tasks_db

# Открываем порт для приложения Flask
EXPOSE 5000

# Команда для запуска приложения
CMD ["python", "app.py"]
