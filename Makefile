.DEFAULT_GOAL := default
.SILENT: fmt-check lint type-check add add-platform check fix build reset search summary blog

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

blog:
	cat README.md | sed -r 's/<h1.+h1>//g' | sed -r 's/<h2/<h3/g' | sed -r 's/<\/h2/<\/h4/g' | pbcopy

default: fmt-check lint type-check check build
