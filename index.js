require('dotenv').config()

var sqlite = require('sqlite3')

//open database /* assumes initialised database, will crash if this is not the case! */
var db = new sqlite.Database('settings')

const StructBuilder = require('./StructBuilder')

const Discord = require('discord.js')

Intents = Discord.Intents

// Init discord client
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


// This will contain all the commands when loaded, allowing reference to them later
client.CommandRegistry = {}

//struct to store prefixes on servers
let prefixStruct = {}
const prefix_default = process.env.PREFIX

const modrole = process.env.MODROLE


//LOAD COMMANDS
const normalizedPath = require('path').join(__dirname, "commands")
// For each file in the commands directory...
const fs = require('fs').readdirSync(normalizedPath).forEach( file => {
  let extensionlessFilename = file.split('.js')[0]
  // Set a member in client.CommandRegistry to the exports of a file in /commands
  client.CommandRegistry[extensionlessFilename] = require('./commands/' + file)

  // Let us know it loaded
  console.log(`Loaded command from ${file}`)
})


//MESSAGE EVENT HANDLER
client.on('messageCreate', msg => {
    //if DM or from bot, ignore
    if(msg.author.bot) return
    else if(msg.guild === null) return

    getPrefix(msg, db, prefix_default, (prefix) => {
        //process command if msg starts with prefix
        if(msg.content.startsWith(prefix)){
            //get command struct
            StructBuilder(msg, db, prefix, (PermNum, CommandStruct, RefStruct) => {
                //help command is special, construct helptext here
                if(CommandStruct.command == 'help'){
                    let helpmsg = '\`\`\`markdown\n'
                    Object.keys(client.CommandRegistry).forEach((cmd) => {
                        helpmsg += `# ${cmd}\n *Perm level:* ${client.CommandRegistry[cmd].perms} \n${client.CommandRegistry[cmd].helpText} \n`
                    })
                    helpmsg += '\`\`\`'
                    msg.reply(helpmsg)
                }
                //if not help, try to run command if possible
                else if(client.CommandRegistry.hasOwnProperty(CommandStruct.command)){
                    //compare PermNum and perms needed
                    if(PermNum >= client.CommandRegistry[CommandStruct.command].perms){
                        //we have perms needed, run command
                        client.CommandRegistry[CommandStruct.command].run(PermNum, CommandStruct, RefStruct)
                    } else {
                        //fail message
                        msg.reply('You need higher permissions to run this command.')
                    }
                }  
            })
        }
    })   
})

// Set the status
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
    client.user.setPresence({
         activities: [{
             name: 'whack-a-mole with keyboard',
             type: 'PLAYING'
         }],
         status: 'online'
     })
})

client.login(process.env.DISCORD_TOKEN)

function getPrefix(msg, db, prefix_default, cb) {
    db.get('SELECT prefix FROM servers WHERE serverid = ?', [msg.guild.id], (err, row) => {
        //load and use if found
        if(row !== undefined){
            cb(row['prefix'])
        } else {
            //add server to db, use default prefix
            console.log(`Adding server ${msg.guild.name} to database`)
            db.run('INSERT INTO servers (serverid, prefix) VALUES (?, ?)', [msg.guild.id, prefix_default])
            cb(prefix_default)
       }
      })
}