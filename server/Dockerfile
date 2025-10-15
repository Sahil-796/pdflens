FROM python:3.11-slim

WORKDIR /app

# Install LibreOffice + dependencies
RUN apt-get update && \
    apt-get install -y libreoffice libicu-dev libfontconfig1 fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
