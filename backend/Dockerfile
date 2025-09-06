# syntax=docker/dockerfile:1

# ---- Base image ----
FROM python:3.12.4-slim AS base

# Set environment variables
ENV POETRY_VERSION=2.1.4 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install system dependencies (git, curl, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    make \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION \
    && ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Copy only dependency files first for caching
COPY pyproject.toml poetry.lock* Makefile ./

# Install dependencies via make (calls poetry)
RUN make install

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["make", "run"]
