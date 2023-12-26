# Base image (choose a suitable Python image)
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copy app code
COPY app /app/app

# Expose port (if applicable)
EXPOSE 5000

# Run the app
CMD ["python", "-m", "app.main"]
