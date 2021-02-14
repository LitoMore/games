.DEFAULT_GOAL := default

add:
	@deno run --allow-write --allow-run add.ts '$(anchor)' '$(name)' '$(website)'
check:
	@deno run check.ts
fix:
	@deno run --allow-write --allow-run check.ts --fix
build:
	@deno run build.ts
default: check build
