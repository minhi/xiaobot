const { Command } = require('discord.js-commando');
const cats = require('./cats.json');

module.exports = class CatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cat',
            aliases: [
                'neko'
            ],
            group: 'randomimg',
            memberName: 'cat',
            description: 'Sends a random cat image.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return message.say(':x: Error! I don\'t have the Attach Files Permission!');
        }
        const cat = cats[Math.floor(Math.random() * cats.length)];
        return message.channel.send({files: [`./images/Cat${cat}`]});
    }
};