const commando = require('discord.js-commando');
const Discord = require('discord.js');

class GuildInfoCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'guild', 
            group: 'info',
            memberName: 'guild',
            description: 'Gives some info on the current guild. (;guild)',
            examples: [';guild']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        if (message.channel.type === 'dm') {
            message.reply(":x: This is a DM!");
        } else {
            const embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setThumbnail(message.guild.iconURL)
            .addField('**Name:**',
            message.guild.name, true)
            .addField('**ID:**',
            message.guild.id, true)
            .addField('**Created On:**',
            message.guild.createdAt, true)
            .addField('**Default Channel:**',
            message.guild.defaultChannel, true)
            .addField('**Region:**',
            message.guild.region, true)
            .addField('**Owner:**',
            message.guild.owner.user.username + '#' + message.guild.owner.user.discriminator, true)
            .addField("**Users:**",
            message.guild.memberCount, true);
            message.channel.sendEmbed(embed).catch(console.error);
        }
    }
}

module.exports = GuildInfoCommand;