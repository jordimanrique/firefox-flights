all: help

SHELL:=/bin/bash
.PHONY: help run

help: Makefile
	@sed -n 's/^##//p' $<

## run: 	        Run a explicit command.
run:
	@echo "Write the command to execute: (npm install, npm audit fix, npm fund, npm update, ...)"; \
	read COMMAND; \
	docker-compose run node $$COMMAND;