.DEFAULT_GOAL := default
.SILENT: lint add add-platform check fix build reset search summary

lint:
	deno lint -q

add:
	deno run --allow-run --allow-env --allow-read --allow-write source/add.ts anchor=$(anchor) name=$(name) website=$(website)

add-platform:
	deno run --allow-run --allow-env --allow-read --allow-write source/add-platform.ts

check:
	deno run --allow-run --allow-env --allow-read source/check.ts

fix:
	deno run --allow-run --allow-env --allow-read --allow-write source/check.ts --fix

build:
	deno run --allow-run --allow-env --allow-read --allow-write source/build.ts

reset:
	deno run --allow-run --allow-env --allow-read --allow-write source/reset.ts

search:
	deno run --allow-run --allow-env --allow-read source/search.ts

summary:
	deno run --allow-run --allow-env --allow-read source/summary.ts

default: lint check build
