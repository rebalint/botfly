/* Contains code to create the structs used in command handling */

module.exports = (msg, db, prefix, cb) => {
	//creates a standardised command format
    const CommandStruct = {}
    let CommandSubstring = msg.content.split(prefix)[1].split(' ') // Splits up a command message
    CommandStruct.command = CommandSubstring[0]
    CommandStruct.args = CommandSubstring.slice(1, CommandSubstring.length+1)
    CommandStruct.message = msg

    //get user perm level into permnum
    getPerms(msg, db, (PermNum) => {
        //construct RefStruct
        const RefStruct = {}
        RefStruct.db = db
        
        cb(PermNum, CommandStruct, RefStruct)
    })
    
}

function getPerms(msg, db, cb){
    //check for admin
    if(msg.member.permissions.has('ADMINISTRATOR')){
        cb(2)
    } else {
        //check database for modrole
        db.get('SELECT modrole FROM servers WHERE serverid = ?', [msg.guild.id], (err, row) => {
            //if found, check if user has modrole
            if(row !== undefined && msg.member.roles.cache.has(row['modrole'])){
                cb(1)
            } else {
                cb(0)
            }
        })
    }
}