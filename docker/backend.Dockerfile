FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY backend/ .

# Make entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Run server
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"] 