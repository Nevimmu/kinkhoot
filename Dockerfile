# Build Stage (Pocketbase)
FROM golang:1.24-alpine AS backend-builder
WORKDIR /pocketbase
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
# Prod : build static binary
ARG BUILD_ENV=prod
RUN if [ "$BUILD_ENV" = "prod" ]; then \
	go build -o /pocketbase . ; \
	fi

# Build Stage (Vue.js)
FROM node:18-alpine AS frontend-builder
WORKDIR /web
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
ARG BUILD_ENV=prod
RUN if [ "$BUILD_ENV" = "prod" ]; then \
	npm run build ; \
	fi

# Dev stage
FROM golang:1.24-alpine AS dev
ENV BUILD=dev
WORKDIR /pocketbase
RUN apk add --no-cache nodejs npm
RUN go install github.com/air-verse/air@latest
COPY --from=backend-builder /pocketbase .
COPY --from=frontend-builder /web /web
EXPOSE 8090 5173
CMD ["sh", "-c", "air serve --http=0.0.0.0:8090 & cd /web && npm run dev -- --host 0.0.0.0"]

# Prod stage
FROM golang:1.24-alpine AS prod
WORKDIR /pocketbase
COPY --from=backend-builder /pocketbase/backend .
COPY --from=frontend-builder /web/dist /pocketbase/pb_public
EXPOSE 8090
CMD ["/pocketbase/backend", "serve", "--http=0.0.0.0:8090"]