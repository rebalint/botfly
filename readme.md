# Bot (on the) Fly

This project serves as an easy-to-use skeleton for future discord bot projects in node.js.

## Setup

* Clone the repo

* `npm install` in the root directory of the bot

* start init.js

Commands placed into the disabled directory can be moved to commands and are ready to be used.

## Details

### Helptext formatting

Description following `+`, args in order following `-`

Don't forget to add newlines

### Permission handling

Commands export a field called perms

- value 0: @everyone perms

- value 1: server admin access or modrole (if defined)

- value 2: only server admin access 

### RefStruct

Passed to commands to give them access to various more rarely used objects

Components:

- RefStruct.db: standard database client

### Database

The bot uses a sqlite database. The only database it has by default is `settings`, with a table named `servers`  which contains a primary key string field called `serverid`, a string field called `modrole` and a string field called `prefix`.  

## TODO

- create more commands
- implement embeds
- implement slash commands