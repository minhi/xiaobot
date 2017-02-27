const commando = require('discord.js-commando');
const Jimp = require("jimp");

class BeautifulCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'beautiful', 
            group: 'fun',
            memberName: 'beautiful',
            description: 'Oh, this? This is beautiful. (;beautiful @User)',
            examples: [';beautiful @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        if (message.mentions.users.size !== 1) {
            message.reply(':x: Either too many or no members, only mention one person!');
        } else {
            if(message.mentions.users.first().avatarURL === null) {
                message.reply(":x: This person has no avatar!");
            } else {
                let avatarurl = message.mentions.users.first().avatarURL;
                avatarurl = avatarurl.replace(".jpg", ".png");
                avatarurl = avatarurl.replace(".gif", ".png");
                let username = message.content.split(" ").slice(1).join(" ");
                message.channel.sendMessage('This? ' + username + " is beautiful.");
                let images = [];
                images.push(Jimp.read(avatarurl));
                images.push(Jimp.read("./images/beautiful.jpg"));
                Promise.all(images).then(([avatar, beautiful]) => {
                    avatar.resize(200, 200);
                    beautiful.blit(avatar, 432, 42);
                    avatar.resize(190, 190);
                    beautiful.blit(avatar, 451, 434);
                    beautiful.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                        if (err) throw err;
                        message.channel.sendFile(buff);
                    });
                });
            }
        }
    }
}

module.exports = BeautifulCommand;