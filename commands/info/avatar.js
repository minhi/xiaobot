const commando = require('discord.js-commando');

class AvatarCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'avatar', 
            group: 'info',
            memberName: 'avatar',
            description: "Gives a link to someone's avatar. (;avatar @User)",
            examples: [";avatar @XiaoBot"]
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        if (message.mentions.users.size !== 1) {
            message.reply(':x: Either too many or no members, only mention one person!');
        } else {
            if(message.mentions.users.first().avatarURL === null) {
                message.reply(":x: This person has no avatar!");
            } else {
                message.reply(message.mentions.users.first().avatarURL);
            }
        }
    }
}

module.exports = AvatarCommand;