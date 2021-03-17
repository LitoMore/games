.DEFAULT_GOAL := default
.SILENT: lint add add-platform check fix build reset

lint:
	deno lint --unstable

add:
	cd source && deno run --allow-read --allow-write add.ts '$(anchor)' '$(name)' '$(website)'

add-platform:
	cd source && deno run --allow-read --allow-write add-platform.ts '$(anchor)' '$(name)' '$(badge)' '$(hostnames)'

check:
	cd source && deno run --allow-read check.ts

fix:
	cd source && deno run --allow-read --allow-write check.ts --fix

build:
	cd source && deno run --allow-read --allow-write build.ts

reset:
	cd source && deno run --allow-read --allow-write reset.ts

default: lint check build
