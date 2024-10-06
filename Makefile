.DEFAULT_GOAL := default
.SILENT: fmt-check lint type-check add add-platform check fix build reset search summary

fmt-check:
	deno fmt --quiet --check

lint:
	deno lint --quiet

type-check:
	deno check --quiet source/*.ts

add:
	deno --allow-env --allow-read --allow-write source/add.ts anchor=$(anchor) name=$(name) website=$(website)

add-platform:
	deno --allow-env --allow-read --allow-write source/add-platform.ts

check:
	deno --allow-env --allow-read source/check.ts

fix:
	deno --allow-env --allow-read --allow-write source/check.ts --fix

build:
	deno --allow-env --allow-read --allow-write source/build.ts

reset:
	deno --allow-env --allow-read --allow-write source/reset.ts

search:
	deno --allow-env --allow-read source/search.ts

summary:
	deno --allow-env --allow-read source/summary.ts

default: fmt-check lint type-check check build
