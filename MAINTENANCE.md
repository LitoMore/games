# Maintenance

## Commands

### Add new game

```shell
$ make add                                        \
  anchor="#steam"                                 \
  name="Game Name"                                \
  website="https://game.example.com/path/to/game"
```

### Add new platform

```shell
$ make add-platform                                 \
  anchor="#new-platform"                            \
  name="New Platform"                               \
  badge="https://img.shields.io/path/to/badge"      \ 
  hostname="platform.example.com games.example.com"
```

### Lint

```shell
$ make lint
```

### Check & Fix

```shell
# Sorting check
$ make check

# Sorting check and auto-fix
$ make fix
```

### Build

```shell
$ make build
```
