require('dotenv').config()
var sqlite = require('sqlite3')

//create database and initialise structure
var db = new sqlite.Database('settings')

//set up database if needed
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='servers';", (err, rows) => {
	if(rows === undefined){
		//create the table
		db.run('CREATE TABLE servers (serverid TEXT PRIMARY KEY, modrole TEXT, prefix)')
	}
})

//start the bot itself
const Bot = require('./index.js')