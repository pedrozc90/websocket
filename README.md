# websocket

A minimal websocket server template.

## Requirements

- Node.js &ge; 24 (LTS)
- NPM

## Getting Started

```bash
# printout scripts
make help
```

```bash
# setup development environment
make setup

# install dependencies
npm ci

# npm run start:dev
make run
```

## Project Structure

```text
repo/
├── .githooks/               # git hook scripts
├── src/                     # application source code
│   ├── config/              # application configurations
│   ├── types/               # shared project types
│   ├── utils/               # useful helper functions
│   ├── server.ts            # http server setup
│   └── index.ts             # application entrypoint
├── docker-compose.yml       # local development services
├── docker-compose.build.yml # build-oriented compose file
├── Dockerfile               # container image definition
├── Makefile                 # common development commands
└── package.json             # scripts and dependencies
```

## Logging
 
Each module creates its own child logger, tagged with its filename:
 
```ts
import { createLogger } from "./config/logger.ts";
 
const logger = createLogger("server.ts");
logger.info("Application running");
```
