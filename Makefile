.DEFAULT_GOAL := help

# -- variables -----------------

mode ?= development

# -- help ---------------------

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# -- project ------------------

.PHONY: setup
setup: ## setup development
	@git config --local core.hooksPath .githooks && \
	test -f .env || cp .env.sample .env

# -- node ---------------------

.PHONY: run
run: ## run application on development mode
	npm run start:dev

.PHONY: client
client: ## run application on development mode
	node --watch --experimental-strip-types client/index.ts

.PHONY: test
test: ## run tests
	npm test

.PHONY: lint
lint: ## check lint
	npm run lint

.PHONY: format
format: ## format project files using prettier
	npm run format:fix

.PHONY: validate
validate: ## validate types
	npm run type-check

# -- docker -------------------

.PHONY: up
up: ## start docker containers
	docker compose up --wait

.PHONY: down
down: ## stop all docker containers
	docker compose down --volumes

.PHONY: build
build: ## build docker image
	docker build --debug --tag express:dev .

.PHONY: deploy
deploy: ## build docker image and create container
	docker compose --file docker-compose.build.yml run --build --rm --service-ports app
