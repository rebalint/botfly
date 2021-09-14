module.exports.run = (PermNum, CommandStruct, RefStruct) => {
    if(CommandStruct.args[0].lenght = 1){
    	RefStruct.db.run('UPDATE servers SET prefix = ? WHERE serverid = ?', [CommandStruct.args[0], CommandStruct.message.guild.id])
        CommandStruct.message.reply(`Set server prefix to \`${CommandStruct.args[0]}\``)
    } else {
        CommandStruct.message.reply("You can only set 1 character as prefix.")
    }
}

module.exports.helpText = '+ Sets the bot prefix for the server \n- Arg: prefix character to be used'

module.exports.perms = 2