.DEFAULT_GOAL := default

add:
	@cd source && deno run --allow-read --allow-write --allow-run add.ts '$(anchor)' '$(name)' '$(website)'

check:
	@cd source && deno run --allow-read check.ts

fix:
	@cd source && deno run --allow-read --allow-write --allow-run check.ts --fix

build:
	@cd source && deno run --allow-read --allow-write build.ts

default: check build
