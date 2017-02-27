const commando = require('discord.js-commando');
const Jimp = require("jimp");

class BobRossCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'bobross', 
            group: 'fun',
            memberName: 'bobross',
            description: "Make Bob Ross draw your avatar. (;bobross @User)",
            examples: [';bobross @User']
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
                message.channel.sendMessage(username + "...");
                let images = [];
                images.push(Jimp.read(avatarurl));
                images.push(Jimp.read("./images/BobRoss.png"));
                images.push(Jimp.read("./images/BlankWhite.png"));
                Promise.all(images).then(([avatar, bob, nothing]) => {
                    avatar.rotate(2);
                    avatar.resize(300, 300);
                    nothing.composite(avatar, 44, 85);
                    nothing.composite(bob, 0, 0);
                    nothing.getBuffer(Jimp.MIME_PNG, (err, buff) => {
                        if (err) throw err;
                        message.channel.sendFile(buff);
                    });
                });
            }
        }
    }
}

module.exports = BobRossCommand;