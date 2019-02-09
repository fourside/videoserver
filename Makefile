NAME := videoserver

ifeq ($(OS),Windows_NT)
	EXT = .exe
endif

.DEFAULT_GOAL: $(NAME)

$(NAME):
	go build -v -o ${NAME}${EXT}

clean:
	go clean

setup:

test:

lint:

.PHONY: clean setup test lint
