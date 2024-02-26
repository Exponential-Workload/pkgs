# This file is public domain; do with it what you wish.

# Find out the user's node package manager - npm, yarn or pnpm
PNPM := $(shell command -v pnpm 2> /dev/null)
NPM := $(shell command -v npm 2> /dev/null)
YARN := $(shell command -v yarn 2> /dev/null)

ifeq ($(PNPM),)
	ifeq ($(NPM),)
		ifeq ($(YARN),)
			$(error "No package manager found. Please install pnpm, npm or yarn.")
		else
			PM := yarn
		endif
	else
		PM := npm
	endif
else
	PM := pnpm
endif

all: build

build:
	$(PM) run build

clean:
	$(PM) run clean:nx
	$(PM) run clean:pkg-out
	$(PM) run clean:nx
	rm -rf .nx

publish:
	$(PM) run pub

dev:
	$(PM) run dev
