#!/bin/bash

THIS_FILE := $(lastword $(MAKEFILE_LIST))
.PHONY: run
help:
	make -pRrq  -f $(THIS_FILE) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
run:	#run a command
	echo "Write the command to execute: (npm install, npm audit fix, npm fund, npm update, ...)"; \
	read command; \
	docker-compose run node $$command;