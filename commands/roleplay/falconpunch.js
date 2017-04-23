const { Command } = require('discord.js-commando');

module.exports = class FalconPunchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'falconpunch',
            group: 'roleplay',
            memberName: 'falconpunch',
            description: 'Falcon Punches something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { thing } = args;
        return message.say(`${message.author} *falcon punches* ${thing}`);
    }
};
