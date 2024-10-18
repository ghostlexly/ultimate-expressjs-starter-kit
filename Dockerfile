# -- BUILDER
FROM node:22.9.0-bullseye-slim as builder
WORKDIR /usr/src/app

# Install dependencies
COPY . .
RUN yarn install

# Build project
RUN yarn prisma generate
RUN yarn build

# -- RUNNER
FROM node:22.9.0-bullseye-slim AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Update apt and install security updates
RUN apt update && \
    apt upgrade -y && \
    apt install -y ca-certificates && \
    apt clean

# Install wget
RUN apt install -y wget xz-utils

# Download and install ffmpeg based on the architecture
# More files can be found here : https://johnvansickle.com/ffmpeg/
RUN if [ "$(uname -m)" = "x86_64" ]; then \
        wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -O ffmpeg.tar.xz; \
    else \
        wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz -O ffmpeg.tar.xz; \
    fi && \
    tar xJf ffmpeg.tar.xz --strip-components=1 -C /usr/local/bin && \
    rm ffmpeg.tar.xz

# Install production-only dependencies (this will ignore devDependencies)
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./.yarnrc ./
RUN yarn install --production --ignore-optional

# Playwright's dependencies
RUN yarn playwright install-deps
RUN yarn add @playwright/browser-chromium

# Copy project specific files
COPY --from=builder /usr/src/app/dist ./dist
COPY ./prisma ./prisma

# Generate Prisma
RUN yarn prisma generate

CMD yarn start:prod
