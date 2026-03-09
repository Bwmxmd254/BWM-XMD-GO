# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.19.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install all packages needed to build native modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      curl \
      git \
      libvips-dev \
      pkg-config \
      python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install node modules
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .


# Final stage for app image
FROM base

# Install runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      ffmpeg \
      libvips && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Must match internal_port in fly.toml
EXPOSE 8080
ENV DATABASE_URL="file:///data/sqlite.db"
CMD [ "npm", "run", "start" ]