# Kinkhoot
<a target="_blank" href="https://hub.docker.com/repository/docker/nevimmu/kinkhoot/general"><img src="https://img.shields.io/docker/v/nevimmu/kinkhoot?color=%232496ED" />

Kinkhoot is a game where you guess your friends' BDSMtest

## How to deploy with Docker
Here is an example `docker-compose.yml` to deploy the application:
```yaml
services:
  kinkhoot:
    image: nevimmu/kinkhoot:latest
    ports:
      - "8090:8090"
    env_file:
      - .env
```

## How to install for development
1. Clone the repo
2. Create the `.env` from the `example.env`
3. Start the dev server with `docker-compose up -d pokcetserve-dev`
