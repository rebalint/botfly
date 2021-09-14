/* command used to set modrole in a server */

module.exports.run = (PermNum, CommandStruct, RefStruct) => {
	//TODO make the actual command
    RefStruct.db.run('UPDATE servers SET modrole = ? WHERE serverid = ?', [CommandStruct.args[0], CommandStruct.message.guild.id])
    CommandStruct.message.reply(`Set modrole to role with id ${CommandStruct.args[0]}.`)
}

module.exports.helpText = '+ Sets the modrole used for level 1 access on the server \n- First arg: modrole id'

module.exports.perms = 2