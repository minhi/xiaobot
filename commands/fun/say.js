const commando = require('discord.js-commando');

class SayCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'say', 
            group: 'fun',
            memberName: 'say',
            description: 'Make XiaoBot say what you wish. (;say I can talk!)',
            examples: [';say I can talk!']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        let Copycat = message.content.split(" ").slice(1).join(" ");
        if (message.channel.type === 'dm') {
            message.channel.sendMessage(Copycat);
        } else {
            message.delete();
            message.channel.sendMessage(Copycat);
        }
    }
}

module.exports = SayCommand;