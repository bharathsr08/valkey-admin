---
title: Send Command
description: Execute Valkey commands directly with an interactive terminal
---

The Send Command interface provides a powerful terminal-like environment for executing Valkey commands directly against your cluster.

## Overview

Execute any Valkey command with syntax highlighting and command history.

![Send Command interface](../../../assets/command.png)

## Basic Usage

### Executing Commands

Type commands exactly as you would in `valkey-cli`:

```
GET mykey
SET mykey "Hello World"
HGETALL user:1001
LPUSH mylist "item1" "item2"
```

Press `Enter` to execute. Results are displayed below the command input.

### Command Autocomplete

As you type, Valkey Admin suggests matching commands from a built-in list of 396 Valkey commands. Select a suggestion to auto-complete the command name, then continue typing your arguments.

### Restricted Commands

Some commands are restricted to prevent accidental server disruption.

**Blocked commands** — cannot be executed through Send Command on standalone or cluster connections:

`SELECT`, `AUTH`, `HELLO`, `RESET`, and `QUIT` are blocked because they can change the shared connection's database, authentication, protocol, or lifecycle. These restrictions are enforced in both the UI (including history reruns) and the backend, with no confirmation override. They do not restrict the application's internal connection setup.

| Command | Reason |
|---------|--------|
| `SHUTDOWN` | Stops the server and cannot be undone remotely |
| `DEBUG` | Can cause crashes or data corruption |
| `FLUSHALL` | Deletes all keys in all databases |
| `FLUSHDB` | Deletes all keys in the current database |

**Confirmation-required commands** — prompt for confirmation before executing:

| Command | Reason |
|---------|--------|
| `KEYS` | Can block the server when many keys exist |
| `CONFIG RESETSTAT` | Resets all server statistics |
| `CONFIG REWRITE` | Overwrites the server configuration file |
| `SLAVEOF` | Changes replication topology |
| `REPLICAOF` | Changes replication topology |
| `CLUSTER RESET` | Resets cluster state and may cause data loss |

Database-selection UI is tracked separately in [issue #519](https://github.com/valkey-io/valkey-admin/issues/519); this change only restricts commands in Send Command.

## Features

### Response View

Commands are highlighted for better readability:
- **Search**: Search command response 
- **Copy**: Copy command response
- **Values**: White
- **Keys**: Gray

### Command History

Navigate through previously executed commands:
- **Search**: Search previously executed commands
- **Copy**: Copy command
- **Run**: Run the command again
- **Compare**: Compare the results two commands

## Next Steps

- Browse keys with the [Key Browser](/features/key-browser/)
- Monitor command performance in [Activity](/features/activity/)
- Understand cluster layout in [Cluster Topology](/features/cluster-topology/)
