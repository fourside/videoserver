NAME := videoserver

ifeq ($(OS),Windows_NT)
	EXT = .exe
endif

.DEFAULT_GOAL: $(NAME)

$(NAME): setup
	go build -v -o ${NAME}${EXT}

clean:
	go clean

setup:
	dep ensure


test:

lint:

.PHONY: clean setup test lint
